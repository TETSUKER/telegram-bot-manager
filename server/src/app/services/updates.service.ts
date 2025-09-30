import { diContainer } from "app/core/di-container";
import { TelegramService } from "./telegram.service";
import {
  Rule,
  RuleCondition,
  RuleResponse,
} from "app/interfaces/rule.interfaces";
import {
  TelegramCallbackQuery,
  TelegramMessage,
  TelegramUpdate,
} from "app/interfaces/telegram-api.interfaces";
import { Bot } from "app/interfaces/bot.interfaces";
import { Logger } from "app/core/logger";
import { EventBus } from "app/core/event-bus";
import { EventName } from "app/interfaces/event-bus.interfaces";
import { RulesService } from "./rules.service";
import { BotsService } from "./bots.service";
import { JokesService } from "./jokes.service";
import { MessageResponseService } from "./message-response.service";

export class UpdatesService {
  private bots = new Map<number, Bot>();
  private rules: Rule[] = [];

  constructor(
    private telegramService: TelegramService,
    private logger: Logger,
    private eventBus: EventBus,
    private rulesService: RulesService,
    private botsService: BotsService,
    private jokesService: JokesService,
    private messageResponseService: MessageResponseService
  ) {
    this.cacheBots();
    this.cacheRules();
    this.eventBus.subscribe(EventName.bot_added, (bot) => {
      this.bots.set(bot.id, bot);
      this.pollBotUpdates(bot.id);
    });
    this.eventBus.subscribe(EventName.bot_removed, (id) => {
      this.bots.delete(id);
    });
    this.eventBus.subscribe(EventName.rule_added, (rule) => {
      this.rules.push(rule);
    });
    this.eventBus.subscribe(EventName.rule_updated, (updatedRule) => {
      this.rules = this.rules.filter((rule) => updatedRule.id !== rule.id);
      this.rules.push(updatedRule);
    });
    this.eventBus.subscribe(EventName.rules_removed, (ids) => {
      this.rules = this.rules.filter((rule) => !ids.includes(rule.id));
    });
  }

  private async cacheBots(): Promise<void> {
    const bots = await this.botsService.getBots({});

    for (const bot of bots) {
      this.bots.set(bot.id, bot);
      this.pollBotUpdates(bot.id);
    }
  }

  private async cacheRules(): Promise<void> {
    this.rules = await this.rulesService.getRules({});
  }

  private async pollBotUpdates(botId: number): Promise<void> {
    let bot = this.bots.get(botId);

    while (bot) {
      let updates: TelegramUpdate[] = [];
      try {
        updates = await this.telegramService.getUpdates(
          bot.token,
          bot.lastUpdateId
        );
      } catch(err) {
        if (err instanceof Error) {
          this.logger.errorLog(`Error while get updates:`, err);
        } else {
          this.logger.errorLog(`Unknown error while get updates: ${JSON.stringify(err)}`);
        }
        await this.delay(5000);
      }

      if (Array.isArray(updates) && updates.length > 0) {
        for (const update of updates) {
          this.logger.infoLog(
            `Bot: ${bot.username} recieve update: ${JSON.stringify(update)}`
          );
          try {
            if (
              update &&
              update.callback_query &&
              update.callback_query.from.is_bot === false
            ) {
              await this.handleCallback(update.callback_query, bot);
            } else if (update && update.message) {
              await this.handleUpdate(update.message, bot);
            } else {
              this.logger.warningLog('Update with unknown type');
            }
          } catch(err) {
            if (err instanceof Error) {
              this.logger.errorLog(`Error while handle update:`, err);
            } else {
              this.logger.errorLog(`Unknown error while handle update: ${JSON.stringify(err)}`);
            }
            await this.delay(5000);
          } finally {
            await this.updateBotLastUpdateId(bot.id, update.update_id + 1);
          }
        }
      }
      bot = this.bots.get(botId);
    }
  }

  private async updateBotLastUpdateId(
    botId: number,
    lastUpdateId: number
  ): Promise<void> {
    try {
      const updatedBot = await this.botsService.updateBot({
        id: botId,
        lastUpdateId: lastUpdateId,
      });
      if (updatedBot && this.bots.has(updatedBot.id)) {
        this.bots.set(updatedBot.id, updatedBot);
      }
    } catch (err) {
      this.logger.errorLog(
        `Error while updateBotLastUpdateId: ${JSON.stringify(err)}`
      );
    }
  }

  private async handleCallback(
    callbackQuery: TelegramCallbackQuery,
    bot: Bot
  ): Promise<void> {
    const thumbUpMatch = callbackQuery.data?.match(/^thumb_up_([0-9]*)$/);
    const thumbDownMatch = callbackQuery.data?.match(/^thumb_down_([0-9]*)$/);
    const updateJokeRatingMatch = callbackQuery.data?.match(
      /^update_joke_rating_([0-9]*)$/
    );

    if (callbackQuery && callbackQuery.message) {
      const userId = callbackQuery.from.id;
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;

      if (thumbUpMatch && thumbUpMatch[1]) {
        const jokeId = Number(thumbUpMatch[1]);
        await this.jokesService.likeJokeMessage(
          jokeId,
          userId,
          chatId,
          messageId,
          bot.token,
          callbackQuery.id
        );
      } else if (thumbDownMatch && thumbDownMatch[1]) {
        const jokeId = Number(thumbDownMatch[1]);
        await this.jokesService.dislikeJokeMessage(
          jokeId,
          userId,
          chatId,
          messageId,
          bot.token,
          callbackQuery.id
        );
      } else if (updateJokeRatingMatch && updateJokeRatingMatch[1]) {
        const jokeId = Number(updateJokeRatingMatch[1]);
        await this.jokesService.updateJokeMessage(
          jokeId,
          chatId,
          messageId,
          bot.token,
          callbackQuery.id
        );
      } else {
        throw new Error(`Not a single match with callback query data: ${JSON.stringify(callbackQuery)}`);
      }
    } else {
      throw new Error(`Callback query message is empty: ${JSON.stringify(callbackQuery)}`);
    }
  }

  private async handleUpdate(message: TelegramMessage, bot: Bot): Promise<void> {
    const rules = this.rules.filter((rule) => bot.ruleIds.includes(rule.id));

    if (message && rules.length) {
      for (const rule of rules) {
        if (message && this.isMessageMatchRule(rule.condition, message.text)) {
          await this.sendMessageResponse(rule.condition, rule.response, message, bot.token, bot.username);
        }
      }
    }
  }

  private isMessageMatchRule(
    ruleCondition: RuleCondition,
    message: string
  ): boolean {
    if (ruleCondition.type === "regex") {
      return new RegExp(ruleCondition.pattern).test(message);
    }

    if (ruleCondition.type === "length") {
      switch (ruleCondition.operator) {
        case "<":
          return message.length < ruleCondition.value;
        case ">":
          return message.length > ruleCondition.value;
        case ">=":
          return message.length >= ruleCondition.value;
        case "<=":
          return message.length <= ruleCondition.value;
        case "=":
          return message.length === ruleCondition.value;
      }
    }

    if (ruleCondition.type === "command") {
      const startCommandMatch = this.parseStartCommand(message);
      if (startCommandMatch && startCommandMatch.command) {
        return startCommandMatch.command === ruleCondition.name.slice(1);
      }
      return message.match(/^\/[a-zA-Z]*/)?.[0] === ruleCondition.name;
    }

    return false;
  }

  private async sendMessageResponse(
    ruleCondition: RuleCondition,
    ruleResponse: RuleResponse,
    message: TelegramMessage,
    botToken: string,
    botUserName: string, 
  ): Promise<void> {
    const chatId = Number(message.chat.id);
    if (ruleResponse.type === "message") {
      const messageId = ruleResponse.reply ? message.message_id : undefined;
      await this.messageResponseService.sendTextMessage(
        botToken,
        chatId,
        ruleResponse.text,
        messageId
      );
    } else if (ruleResponse.type === "sticker") {
      const messageId = ruleResponse.reply ? message.message_id : undefined;
      await this.messageResponseService.sendStickerMessage(
        botToken,
        chatId,
        ruleResponse.stickerId,
        messageId
      );
    } else if (ruleResponse.type === "emoji") {
      const messageId = message.message_id;
      await this.messageResponseService.setEmojiReaction(
        botToken,
        chatId,
        messageId,
        ruleResponse.emoji
      );
    } else if (ruleResponse.type === "random_joke") {
      await this.messageResponseService.sendRandomJoke(botToken, chatId);
    } else if (ruleResponse.type === "find_joke") {
      await this.messageResponseService.sendFindedJoke(
        botToken,
        chatId,
        message.text
      );
    } else if (ruleResponse.type === "joke_rating") {
      await this.messageResponseService.sendJokesRating(botToken, botUserName, chatId);
    } else if (ruleResponse.type === "get_joke_by_id" && ruleCondition.type === "command") {
      const startCommandMatch = this.parseStartCommand(message.text);
      const command = ruleCondition.name;
      const commandRegExp = new RegExp(`^${command} (.*)$`);
      const getJokeByIdCommandMatch = message.text.match(commandRegExp);

      if (getJokeByIdCommandMatch && getJokeByIdCommandMatch[1]) {
        const jokeId = Number(getJokeByIdCommandMatch[1]);
        const joke = await this.jokesService.findJokeById(jokeId);
        await this.jokesService.sendJoke(botToken, chatId, joke);
      }
      if (startCommandMatch && startCommandMatch.argument) {
        const jokeId = Number(startCommandMatch.argument);
        const joke = await this.jokesService.findJokeById(jokeId);
        await this.jokesService.sendJoke(botToken, chatId, joke);
      }
    } else {
      throw new Error(`Not a single match with rule response type: ${ruleResponse.type}`);
    }
  }

  private parseStartCommand(message: string): ({
    command: string;
    argument: string | undefined;
  } | null) {
    const startCommandRegExp = message.match(new RegExp('^/start (?<command>[a-zA-Z]*)_(?<argument>[0-9]*)$'));
    if (startCommandRegExp && startCommandRegExp.groups && startCommandRegExp.groups['command']) {
      return {
        command: startCommandRegExp.groups['command'], 
        argument: startCommandRegExp.groups['argument'],
      };
    }
    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

diContainer.registerDependencies(UpdatesService, [
  TelegramService,
  Logger,
  EventBus,
  RulesService,
  BotsService,
  JokesService,
  MessageResponseService,
]);

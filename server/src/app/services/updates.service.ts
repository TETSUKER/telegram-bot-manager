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
} from "app/interfaces/telegram-api.interfaces";
import { Bot } from "app/interfaces/bot.interfaces";
import { Logger } from "app/core/logger";
import { EventBus } from "app/core/event-bus";
import { EventName } from "app/interfaces/event-bus.interfaces";
import { RulesService } from "./rules.service";
import { BotsService } from "./bots.service";
import { JokesService } from "./jokes.service";
import { MessageResponseService } from "./message-response.service";
import { ApiError } from 'app/errors/api.error';

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

    try {
      while (bot) {
        const updates = await this.telegramService.getUpdates(
          bot.token,
          bot.lastUpdateId
        );

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
                throw new Error(`Can't handle update: ${JSON.stringify(update)}`);
              }
            } catch(err) {
              if (err instanceof ApiError) {
                this.logger.errorLog(`${this.pollBotUpdates.name} error:`, err);
              } else {
                this.logger.errorLog(`${this.pollBotUpdates.name} error: ${JSON.stringify(err)}`);
              }
              await this.delay(5000);
            } finally {
              await this.updateBotLastUpdateId(bot.id, update.update_id + 1);
            }
          }
        }
        bot = this.bots.get(botId);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        this.logger.errorLog(`${this.pollBotUpdates.name} error poll updates for bot: `, err);
      } else {
        this.logger.errorLog(`${this.pollBotUpdates.name} unknown error poll updates for bot: ${JSON.stringify(err)}`);
      }
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
          await this.sendMessageResponse(rule.response, message, bot.token);
        }
      }
    }
  }

  private isMessageMatchRule(
    messageCondition: RuleCondition,
    message: string
  ): boolean {
    if (messageCondition.type === "regex") {
      return new RegExp(messageCondition.pattern).test(message);
    }

    if (messageCondition.type === "length") {
      switch (messageCondition.operator) {
        case "<":
          return message.length < messageCondition.value;
        case ">":
          return message.length > messageCondition.value;
        case ">=":
          return message.length >= messageCondition.value;
        case "<=":
          return message.length <= messageCondition.value;
        case "=":
          return message.length === messageCondition.value;
      }
    }

    if (messageCondition.type === "command") {
      return message.match(/^\/[a-zA-Z]*/)?.[0] === messageCondition.name;
    }

    return false;
  }

  private async sendMessageResponse(
    response: RuleResponse,
    message: TelegramMessage,
    botToken: string
  ): Promise<void> {
    const chatId = Number(message.chat.id);
    if (response.type === "message") {
      const messageId = response.reply ? message.message_id : undefined;
      await this.messageResponseService.sendTextMessage(
        botToken,
        chatId,
        response.text,
        messageId
      );
    }

    if (response.type === "sticker") {
      const messageId = response.reply ? message.message_id : undefined;
      await this.messageResponseService.sendStickerMessage(
        botToken,
        chatId,
        response.stickerId,
        messageId
      );
    }

    if (response.type === "emoji") {
      const messageId = message.message_id;
      await this.messageResponseService.setEmojiReaction(
        botToken,
        chatId,
        messageId,
        response.emoji
      );
    }

    if (response.type === "random_joke") {
      await this.messageResponseService.sendRandomJoke(botToken, chatId);
    }

    if (response.type === "find_joke") {
      await this.messageResponseService.sendFindedJoke(
        botToken,
        chatId,
        message.text
      );
    }

    if (response.type === "joke_rating") {
      await this.messageResponseService.sendJokesRating(botToken, chatId);
    }
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

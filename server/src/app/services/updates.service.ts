import { diContainer } from 'app/core/di-container';
import { TelegramService } from './telegram.service';
import { Rule, RuleCondition } from 'app/interfaces/rule.interfaces';
import { TelegramUpdate } from 'app/interfaces/telegram-api.interfaces';
import { Bot } from 'app/interfaces/bot.interfaces';
import { Logger } from 'app/core/logger';
import { EventBus } from 'app/core/event-bus';
import { EventName } from 'app/interfaces/event-bus.interfaces';
import { RulesService } from './rules.service';
import { BotsService } from './bots.service';

export class UpdatesService {
  private bots = new Map<number, Bot>();
  private rules: Rule[] = [];

  constructor(
    private telegramService: TelegramService,
    private logger: Logger,
    private eventBus: EventBus,
    private rulesService: RulesService,
    private botsService: BotsService,
  ) {
    this.cacheBots();
    this.cacheRules();
    this.eventBus.subscribe(EventName.bot_added, bot => {
      this.bots.set(bot.id, bot);
    });
    this.eventBus.subscribe(EventName.bot_removed, id => {
      this.bots.delete(id);
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
    const rules = await this.rulesService.getRules({});
    this.rules = rules;
  }

  private async pollBotUpdates(botId: number): Promise<void> {
    let bot = this.bots.get(botId);

    while(bot) {
      try {
        const updates = await this.telegramService.getUpdates(bot.token, bot.lastUpdateId + 1);

        if (Array.isArray(updates) && updates.length > 0) {
          for (const update of updates) {
            this.logger.infoLog(`Bot: ${bot.username} recieve update: ${JSON.stringify(update)}`);
            await this.handleUpdate(update, bot);
          }
        }
        bot = this.bots.get(botId);
      } catch(err) {
        this.logger.errorLog(`UpdatesService error: ${err}`);
        await this.delay(5000);
      }
    }
  }

  private async handleUpdate(update: TelegramUpdate, bot: Bot): Promise<void> {
    const messageRules = this.rules.filter(rule => bot.ruleIds.includes(rule.id));
    const message = update.message?.text;

    if (message && messageRules.length) {
      for (const rule of messageRules) {
        if (this.isMessageMatchRule(rule.condition, message)) {
          const chatId = Number(update.message?.chat.id);
          const messageId = update.message?.message_id;
          await this.telegramService.sendMessageResponse(rule.response, bot.token, chatId, messageId);
        }
      }
    }

    const updatedBot = await this.botsService.updateBot({...bot, lastUpdateId: update.update_id});
    if (updatedBot && this.bots.has(updatedBot.id)) {
      this.bots.set(updatedBot.id, updatedBot);
    }
  }

  private isMessageMatchRule(messageCondition: RuleCondition, message: string): boolean {
    if (messageCondition.type === 'regex') {
      return new RegExp(messageCondition.pattern).test(message);
    }
  
    if (messageCondition.type === 'length') {
      switch(messageCondition.operator) {
        case '<': return message.length < messageCondition.value;
        case '>': return message.length > messageCondition.value;
        case '>=': return message.length >= messageCondition.value;
        case '<=': return message.length <= messageCondition.value;
        case '=': return message.length === messageCondition.value;
      }
    }
  
    if (messageCondition.type === 'command') {
      return message.match(/^\/[a-z]*/)?.[0] === messageCondition.name;
    }
  
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

diContainer.registerDependencies(UpdatesService, [
  TelegramService,
  Logger,
  EventBus,
  RulesService,
  BotsService,
]);

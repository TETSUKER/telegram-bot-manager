import { diContainer } from 'app/core/di-container';
import { TelegramService } from './telegram.service';
import { RulesModel } from 'app/models/rules.model';
import { MessageResponse, MessageCondition, MessageRule } from 'app/interfaces/rule.interfaces';
import { TelegramUpdate } from 'app/interfaces/telegram-api.interfaces';
import { GetBotApi } from 'app/interfaces/bot.interfaces';
import { BotModel } from 'app/models/bot.model';
import { Logger } from 'app/core/logger';

export class UpdatesService {
  private cachedBots: GetBotApi[] = [];
  private messageRules: MessageRule[] = [];

  constructor(
    private telegramService: TelegramService,
    private botModel: BotModel,
    private rulesModel: RulesModel,
    private logger: Logger,
  ) {
    this.updateCachedBots();
    this.updateCachedMessageRules();
  }

  public async updateCachedBots(): Promise<void> {
    const dbBots = await this.botModel.getBots({});
    const newBots = dbBots.filter(dbBot => !this.cachedBots.map(bot => bot.id).includes(dbBot.id));
    this.cachedBots = dbBots;
    for (const newBot of newBots) {
      this.pollBotUpdates(newBot.id);
    }
  }

  public async updateCachedMessageRules(): Promise<void> {
    this.messageRules = await this.rulesModel.getAllMessageRules();
  }

  private async pollBotUpdates(botId: number): Promise<void> {
    let bot = this.getCachedBotById(botId);

    while(bot) {
      try {
        const updates = await this.telegramService.getUpdates(bot.token, bot.lastUpdateId + 1);

        if (Array.isArray(updates) && updates.length > 0) {
          for (const update of updates) {
            // console.log(update);
            await this.handleUpdate(update, bot);
          }
        }
        await this.updateCachedBots();
        bot = this.getCachedBotById(botId);
      } catch(err) {
        this.logger.errorLog(`UpdatesService error: ${err}`);
        await this.delay(5000);
      }
    }
  }

  private getCachedBotById(botId: number): GetBotApi | undefined {
    return this.cachedBots.find(bot => bot.id === botId);
  }

  private async handleUpdate(update: TelegramUpdate, bot: GetBotApi): Promise<void> {
    const messageRules = this.messageRules.filter(handler => bot.ruleIds.includes(handler.id));
    const message = update.message?.text;

    if (message && messageRules.length) {
      for (const rule of messageRules) {
        if (this.isMessageMatchRule(rule.condition, message)) {
          await this.sendMessageResponse(rule.response, update, bot);
        }
      }
    }

    this.botModel.updateBot({...bot, lastUpdateId: update.update_id});
    await this.updateCachedBots();
  }

  private isMessageMatchRule(messageCondition: MessageCondition, message: string): boolean {
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

  private async sendMessageResponse(response: MessageResponse, update: TelegramUpdate, bot: GetBotApi): Promise<void> {
    const chatId = Number(update.message?.chat.id);

    if (response.type === 'message') {
      await this.telegramService.sendTextMessage(bot.token, chatId, response.text, response.reply ? update.message?.message_id : undefined);
    }

    if (response.type === 'sticker') {
      await this.telegramService.sendSticker(bot.token, chatId, response.stickerId, response.reply ? update.message?.message_id : undefined);
    }

    if (response.type === 'emoji' && update.message?.message_id) {
      await this.telegramService.setMessageReaction(bot.token, chatId, update.message.message_id, response.emoji);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

diContainer.registerDependencies(UpdatesService, [
  TelegramService,
  BotModel,
  RulesModel,
  Logger,
]);

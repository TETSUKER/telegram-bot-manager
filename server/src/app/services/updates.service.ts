import { diContainer } from 'app/core/di-container';
import { TelegramService } from './telegram.service';
import { BotModel } from 'app/models/bot.model';
import { MessageRulesModel } from 'app/models/message-rules.model';
import { Bot } from 'app/interfaces/bot-model.interfaces';
import { MessageResponse, MessageCondition, MessageRule } from 'app/interfaces/message-rules-model.interfaces';
import { TelegramUpdate } from 'app/interfaces/telegram-api.interfaces';

export class UpdatesService {
  private bots: Bot[] = [];
  private messageRules: MessageRule[] = [];

  constructor(
    private telegramService: TelegramService,
    private botModel: BotModel,
    private handlersModel: MessageRulesModel,
  ) {
    this.updateCachedBots();
    this.updateCachedMessageRules();
  }

  public async updateCachedBots(): Promise<void> {
    const dbBots = await this.botModel.getBots();
    const newBots = dbBots.filter(dbBot => !this.bots.map(bot => bot.id).includes(dbBot.id));
    this.bots = dbBots;
    for (const newBot of newBots) {
      this.pollBotUpdates(newBot.id);
    }
  }

  public updateCachedMessageRules(): void {
    this.messageRules = this.handlersModel.getAllMessageRules();
  }

  private async pollBotUpdates(botId: number): Promise<void> {
    let bot = this.getBotById(botId);
    while(bot) {
      try {
        const updates = await this.telegramService.getUpdates(bot.token, bot.lastUpdateId + 1);

        if (Array.isArray(updates) && updates.length > 0) {
          for (const update of updates) {
            await this.handleUpdate(update, bot);
          }
        }
        this.updateCachedBots();
        bot = this.getBotById(botId);
      } catch(err) {
        console.error('UpdatesService error:', err);
        await this.delay(5000);
      }
    }
  }

  private getBotById(botId: number): Bot | undefined {
    return this.bots.find(bot => bot.id === botId);
  }

  private async handleUpdate(update: TelegramUpdate, bot: Bot): Promise<void> {
    const messageRules = this.messageRules.filter(handler => bot.handlerIds.includes(handler.id));
    const message = update.message?.text;

    if (message && messageRules.length) {
      for (const rule of messageRules) {
        if (this.isMessageMatchRule(rule.condition, message)) {
          await this.sendMessageResponse(rule.response, update, bot);
        }
      }
    }

    this.botModel.updateBot({...bot, lastUpdateId: update.update_id});
  }

  private isMessageMatchRule(messageCondition: MessageCondition, message: string): boolean {
    if (messageCondition.type === 'regex') {
      return new RegExp(messageCondition.pattern).test(message);
    }
    return false;
  }

  private async sendMessageResponse(response: MessageResponse, update: TelegramUpdate, bot: Bot): Promise<void> {
    if (response.type === 'message') {
      const chatId = Number(update.message?.chat.id);
      await this.telegramService.sendTextMessage(bot.token, chatId, response.text, response.reply ? update.message?.message_id : null);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public updateHandlers(): void {
    console.log('updateHandlers');
    this.messageRules = this.handlersModel.getMessageRules();
  }
}

diContainer.registerDependencies(UpdatesService, [
  TelegramService,
  BotModel,
  MessageRulesModel,
]);
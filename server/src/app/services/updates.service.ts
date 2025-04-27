import { diContainer } from 'app/core/di-container';
import { TelegramService } from './telegram.service';
import { BotModel } from 'app/models/bot.model';
import { HandlersModel } from 'app/models/handlers.model';
import { Bot } from 'app/interfaces/bot-model.interfaces';
import { Handler } from 'app/interfaces/handlers-model.interfaces';
import { TelegramUpdate } from 'app/interfaces/telegram-api.interfaces';

export class UpdatesService {
  private bots: Bot[] = [];
  private handlers: Handler[] = [];

  constructor(
    private telegramService: TelegramService,
    private botModel: BotModel,
    private handlersModel: HandlersModel,
  ) {
    this.updateCachedBots();
    this.updateCachedHandlers();
  }

  public updateCachedBots(): void {
    const dbBots = this.botModel.getBots();
    const newBots = dbBots.filter(dbBot => !this.bots.map(bot => bot.id).includes(dbBot.id));
    this.bots = dbBots;
    for (const newBot of newBots) {
      this.pollBotUpdates(newBot.id);
    }
  }

  public updateCachedHandlers(): void {
    this.handlers = this.handlersModel.getAllHandlers();
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
        console.error('Error:', err);
        await this.delay(5000);
      }
    }
  }

  private getBotById(botId: number): Bot | undefined {
    return this.bots.find(bot => bot.id === botId);
  }

  private async handleUpdate(update: TelegramUpdate, bot: Bot): Promise<void> {
    this.botModel.updateBot({...bot, lastUpdateId: update.update_id});
    const handlers = this.handlers.filter(handler => bot.handlerIds.includes(handler.id));
    const message = update.message?.text;
    console.info(`${bot.username} message: ${message}`);
    for (const handler of handlers) {
      if (handler.reply?.message === message && handler.reply?.text) {
        const chatId = Number(update.message?.chat.id);
        await this.telegramService.sendTextMessage(bot.token, chatId, handler.reply.text);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public updateHandlers(): void {
    console.log('updateHandlers');
    this.handlers = this.handlersModel.getBotHandlers();
  }
}

diContainer.registerDependencies(UpdatesService, [
  TelegramService,
  BotModel,
  HandlersModel,
]);
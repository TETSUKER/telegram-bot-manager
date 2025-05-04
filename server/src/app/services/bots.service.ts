import { diContainer } from 'app/core/di-container';
import { Bot } from 'app/interfaces/bot-model.interfaces';
import { BotModel } from 'app/models/bot.model';
import { UpdatesService } from './updates.service';
import { TelegramService } from './telegram.service';
import { TelegramUser } from 'app/interfaces/telegram-api.interfaces';

export class BotsService {
  constructor(
    private botModel: BotModel,
    private updatesService: UpdatesService,
    private telegramService: TelegramService,
  ) {}

  public async addBot(token: string): Promise<void> {
    try {
      const botInfo = await this.telegramService.getBotInfo(token);
      await this.botModel.addBot({
        token,
        username: botInfo.username || '',
      });
      await this.updatesService.updateCachedBots();
    } catch(err) {
      throw err;
    }
  }

  public async getAllBots(): Promise<Bot[]> {
    try {
      return await this.botModel.getAllBots();
    } catch(err) {
      throw err;
    }
  }

  public async getBotById(botId: number): Promise<Bot> {
    try {
      return await this.botModel.getBot(botId);
    } catch(err) {
      throw err;
    }
  }

  public async removeBot(botId: number): Promise<void> {
    try {
      await this.botModel.removeBot(botId);
      await this.updatesService.updateCachedBots();
    } catch(err) {
      throw err;
    }
  }

  public async updateBot(bot: Bot): Promise<void> {
    try {
      await this.botModel.updateBot(bot);
      await this.updatesService.updateCachedBots();
    } catch(err) {
      throw err;
    }
  }

  public async getBotInfo(botId: number): Promise<TelegramUser> {
    try {
      const bot = await this.botModel.getBot(botId);
      return await this.telegramService.getBotInfo(bot.token);
    } catch(err) {
      throw err;
    }
  }
}

diContainer.registerDependencies(BotsService, [
  BotModel,
  UpdatesService,
  TelegramService,
]);
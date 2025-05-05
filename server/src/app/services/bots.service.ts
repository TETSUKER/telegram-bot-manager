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
    const botInfo = await this.telegramService.getBotInfo(token);
    await this.botModel.addBot({
      token,
      username: botInfo.username || '',
    });
    await this.updatesService.updateCachedBots();
  }

  public async getAllBots(): Promise<Bot[]> {
    return await this.botModel.getAllBots();
  }

  public async getBotById(botId: number): Promise<Bot> {
    return await this.botModel.getBot(botId);
  }

  public async removeBot(botId: number): Promise<void> {
    await this.botModel.removeBot(botId);
    await this.updatesService.updateCachedBots();
  }

  public async updateBot(bot: Bot): Promise<void> {
    await this.botModel.updateBot(bot);
    await this.updatesService.updateCachedBots();
  }

  public async getBotInfo(botId: number): Promise<TelegramUser> {
    const bot = await this.botModel.getBot(botId);
    return await this.telegramService.getBotInfo(bot.token);
  }
}

diContainer.registerDependencies(BotsService, [
  BotModel,
  UpdatesService,
  TelegramService,
]);
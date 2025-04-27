import { diContainer } from 'app/core/di-container';
import { Bot, NewBot } from 'app/interfaces/bot-model.interfaces';
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
    // const bot = this.botModel.getBots().filter(bot => bot.username === botInfo.username)[0]; 
    this.botModel.addBot({
      token,
      username: botInfo.username || '',
    });
    this.updatesService.updateCachedBots();
  }

  public getBots(): Bot[] {
    return this.botModel.getBots();
  }

  public getBot(botId: number): Bot | undefined {
    return this.botModel.getBot(botId);
  }

  public removeBot(botId: number): void {
    this.botModel.removeBot(botId);
    this.updatesService.updateCachedBots();
  }

  public updateBot(bot: Bot): void {
    this.botModel.updateBot(bot);
    this.updatesService.updateCachedBots();
  }

  public async getBotInfo(botId: number): Promise<TelegramUser | undefined> {
    const bot = this.botModel.getBot(botId);

    if (bot) {
      return this.telegramService.getBotInfo(bot.token);
    } else {
      return;
    }
  }
}

diContainer.registerDependencies(BotsService, [
  BotModel,
  UpdatesService,
  TelegramService,
]);
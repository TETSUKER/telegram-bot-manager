import { diContainer } from 'app/core/di-container';
import { FilterBotApi } from 'app/interfaces/bot.interfaces';
import { BotModel } from 'app/models/bot.model';
import { UpdatesService } from './updates.service';
import { TelegramService } from './telegram.service';
import { GetBotApi, UpdateBotApi } from 'app/interfaces/bot.interfaces';

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
      rule_ids: [],
      date_added: new Date(),
      first_name: botInfo.first_name || '',
      can_join_groups: botInfo.can_join_groups || false,
      can_read_all_group_messages: botInfo.can_read_all_group_messages || false,
      supports_inline_queries: botInfo.supports_inline_queries || false,
      can_connect_to_business: botInfo.can_connect_to_business || false,
      has_main_web_app: botInfo.has_main_web_app || false,
      last_update_id: 0,
    });
    await this.updatesService.updateCachedBots();
  }

  public async getBots(filter: FilterBotApi): Promise<GetBotApi[]> {
    return await this.botModel.getBots(filter);
  }

  public async removeBot(botId: number): Promise<void> {
    await this.botModel.removeBot(botId);
    await this.updatesService.updateCachedBots();
  }

  public async updateBot(bot: UpdateBotApi): Promise<void> {
    await this.botModel.updateBot(bot);
    await this.updatesService.updateCachedBots();
  }
}

diContainer.registerDependencies(BotsService, [
  BotModel,
  UpdatesService,
  TelegramService,
]);
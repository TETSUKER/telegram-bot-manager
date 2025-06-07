import { diContainer } from 'app/core/di-container';
import { FilterBotApi } from 'app/interfaces/bot.interfaces';
import { BotModel } from 'app/models/bot.model';
import { TelegramService } from './telegram.service';
import { Bot, UpdateBotApi } from 'app/interfaces/bot.interfaces';
import { EventBus } from 'app/core/event-bus';
import { EventName } from 'app/interfaces/event-bus.interfaces';

export class BotsService {
  constructor(
    private botModel: BotModel,
    private telegramService: TelegramService,
    private eventBus: EventBus,
  ) {
    this.eventBus.subscribe(EventName.rules_removed, async removedRuleIds => {
      const bots = await this.getBots({ ruleIds: removedRuleIds });
      for (const bot of bots) {
        const remainingRuleIds = bot.ruleIds.filter(id => !removedRuleIds.includes(id));
        await this.updateBot({
          id: bot.id,
          ruleIds: remainingRuleIds,
        });
      }
    });
  }

  public async addBot(token: string): Promise<void> {
    const botInfo = await this.telegramService.getBotInfo(token);
    const addedBot = await this.botModel.addBot({
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
    if (addedBot) {
      this.eventBus.publish(EventName.bot_added, addedBot);
    }
  }

  public async getBots(filter: FilterBotApi): Promise<Bot[]> {
    return await this.botModel.getBots(filter);
  }

  public async removeBot(botIds: number[]): Promise<void> {
    const oldBots = await this.getBots({ ids: botIds });
    await this.botModel.removeBot(botIds);
    this.publishDeletedRulesFromBots(oldBots);
  }

  private publishDeletedRulesFromBots(bots: Bot[]): void {
    for (const bot of bots) {
      this.eventBus.publish(EventName.removed_rules_from_bot, { ruleIds: bot.ruleIds, botId: bot.id });
    }
  }

  public async updateBot(updatedBot: UpdateBotApi): Promise<Bot | null> {
    const [oldBot] = await this.getBots({ ids: [updatedBot.id] });
    const newBot = await this.botModel.updateBot(updatedBot);

    if (oldBot && newBot) {
      this.publishChangedBotRules(oldBot, newBot);
    }

    return newBot;
  }

  private publishChangedBotRules(oldBot: Bot, newBot: Bot): void {
    const addedRuleIds = newBot.ruleIds?.filter(id => !oldBot.ruleIds?.includes(id)) ?? [];
    this.eventBus.publish(EventName.added_rules_to_bot, { ruleIds: addedRuleIds, botId: newBot.id });

    const removedRuleIds = oldBot.ruleIds?.filter(id => !newBot.ruleIds?.includes(id)) ?? [];
    this.eventBus.publish(EventName.removed_rules_from_bot, { ruleIds: removedRuleIds, botId: newBot.id });
  }
}

diContainer.registerDependencies(BotsService, [
  BotModel,
  TelegramService,
  EventBus,
]);

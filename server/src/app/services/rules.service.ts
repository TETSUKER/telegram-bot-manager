import { diContainer } from 'app/core/di-container';
import { Rule, NewRule, FilterRuleApi, UpdateRuleApi } from 'app/interfaces/rule.interfaces';
import { RulesModel } from 'app/models/rules.model';
import { BotsService } from './bots.service';
import { EventBus } from 'app/core/event-bus';
import { EventName } from 'app/interfaces/event-bus.interfaces';
import { Bot } from 'app/interfaces/bot.interfaces';

export class RulesService {
  constructor(
    private rulesModel: RulesModel,
    private botsService: BotsService,
    private eventBus: EventBus,
  ) {
    this.eventBus.subscribe(EventName.chats_removed, async ids => {
      const rules = await this.getRules({ scheduleChatIds: ids });
      for (const rule of rules) {
        if (rule.condition.type === 'schedule') {
          const updatedChatIds = rule.condition.scheduleChatIds.filter(id => !ids.includes(id));
          await this.updateRule({
            id: rule.id,
            condition: {
              type: 'schedule',
              schedule: rule.condition.schedule,
              scheduleChatIds: updatedChatIds,
            }
          });
        }
      }
    });
  }

  public async addRule(newMessageRule: NewRule): Promise<void> {
    await this.rulesModel.addRule(newMessageRule);
  }

  public async removeRules(ids: number[]): Promise<void> {
    const removedRules = await this.rulesModel.removeRules(ids);
    const removedRuleIds = removedRules.map(rule => rule.id);
    const bots = await this.botsService.getBots({ ruleIds: removedRuleIds });

    this.publishDeletedRules(removedRuleIds);
    this.publishDeletedRulesFromBots(bots, removedRuleIds);
  }

  private publishDeletedRules(removedRuleIds: number[]): void {
    this.eventBus.publish(EventName.rules_removed, removedRuleIds);
  }

  // В bots.service такой же метод
  // подумать в какой сервис их можно вынести
  private publishDeletedRulesFromBots(bots: Bot[], removedRuleIds: number[]): void {
    for (const bot of bots) {
      const ruleIds = bot.ruleIds.filter(ruleId => removedRuleIds.includes(ruleId));
      this.eventBus.publish(EventName.removed_rules_from_bot, { ruleIds: ruleIds, botId: bot.id });
    }
  }

  public async updateRule(updateRule: UpdateRuleApi): Promise<void> {
    const updatedRule = await this.rulesModel.updateRule(updateRule);

    if (updatedRule) {
      const bots = await this.botsService.getBots({ ruleIds: [updateRule.id] });
      this.publishUpdatedRuleInBots(bots, updatedRule);
    }
  }

  private publishUpdatedRuleInBots(bots: Bot[], rule: Rule): void {
    for (const bot of bots) {
      this.eventBus.publish(EventName.updated_rule_in_bot, { botId: bot.id, rule });
    }
  }

  public async getRules(filter: FilterRuleApi): Promise<Rule[]> {
    return await this.rulesModel.getRules(filter);
  }
}

diContainer.registerDependencies(RulesService, [
  RulesModel,
  BotsService,
  EventBus,
]);
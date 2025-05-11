import { diContainer } from 'app/core/di-container';
import { Rule, NewRule, FilterRuleApi } from 'app/interfaces/rule.interfaces';
import { RulesModel } from 'app/models/rules.model';
import { UpdatesService } from './updates.service';

export class RulesService {
  constructor(
    private rulesModel: RulesModel,
    private updatesService: UpdatesService,
  ) {}

  public async addRule(newMessageRule: NewRule): Promise<void> {
    await this.rulesModel.addRule(newMessageRule);
    await this.updatesService.updateCachedMessageRules();
  }

  public async removeRule(messageRuleId: number): Promise<void> {
    await this.rulesModel.removeRule(messageRuleId);
    await this.updatesService.updateCachedMessageRules();
  }

  public async updateRule(messageRule: Rule): Promise<void> {
    await this.rulesModel.updateRule(messageRule);
    await this.updatesService.updateCachedMessageRules();
  }

  public async getRules(filter: FilterRuleApi): Promise<Rule[]> {
    return await this.rulesModel.getRules(filter);
  }
}

diContainer.registerDependencies(RulesService, [
  RulesModel,
  UpdatesService,
]);
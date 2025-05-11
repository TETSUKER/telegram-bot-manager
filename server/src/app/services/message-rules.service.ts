import { diContainer } from 'app/core/di-container';
import { MessageRule, NewMessageRule } from 'app/interfaces/rule.interfaces';
import { RulesModel } from 'app/models/rules.model';
import { UpdatesService } from './updates.service';

export class MessageRulesService {
  constructor(
    private messageRulesModel: RulesModel,
    private updatesService: UpdatesService,
  ) {}

  public async addMessageRule(newMessageRule: NewMessageRule): Promise<void> {
    await this.messageRulesModel.addMessageRule(newMessageRule);
    await this.updatesService.updateCachedMessageRules();
  }

  public async removeMessageRule(messageRuleId: number): Promise<void> {
    await this.messageRulesModel.removeMessageRule(messageRuleId);
    await this.updatesService.updateCachedMessageRules();
  }

  public async updateMessageRule(messageRule: MessageRule): Promise<void> {
    await this.messageRulesModel.updateMessageRule(messageRule);
    await this.updatesService.updateCachedMessageRules();
  }

  public async getAllMessageRules(): Promise<MessageRule[]> {
    return await this.messageRulesModel.getAllMessageRules();
  }

  public async getMessageRuleById(id: number): Promise<MessageRule> {
    return await this.messageRulesModel.getMessageRule(id);
  }
}

diContainer.registerDependencies(MessageRulesService, [
  RulesModel,
  UpdatesService,
]);
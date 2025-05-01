import { diContainer } from 'app/core/di-container';
import { MessageRule, NewMessageRule } from 'app/interfaces/message-rules-model.interfaces';
import { MessageRulesModel } from 'app/models/message-rules.model';
import { UpdatesService } from './updates.service';

export class MessageRulesService {
  constructor(
    private messageRulesModel: MessageRulesModel,
    private updatesService: UpdatesService,
  ) {}

  public addMessageRule(newMessageRule: NewMessageRule): void {
    this.messageRulesModel.addMessageRule(newMessageRule);
    this.updatesService.updateCachedMessageRules();
  }

  public removeMessageRule(messageRuleId: number): void {
    this.messageRulesModel.removeMessageRule(messageRuleId);
    this.updatesService.updateCachedMessageRules();
  }

  public updateMessageRule(messageRule: MessageRule): void {
    this.messageRulesModel.updateMessageRule(messageRule);
    this.updatesService.updateCachedMessageRules();
  }

  public getAllMessageRules(): MessageRule[] {
    return this.messageRulesModel.getAllMessageRules();
  }
}

diContainer.registerDependencies(MessageRulesService, [
  MessageRulesModel,
  UpdatesService,
]);
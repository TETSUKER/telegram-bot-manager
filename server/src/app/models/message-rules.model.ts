import { diContainer } from 'app/core/di-container';
import { MessageRule, NewMessageRule } from 'app/interfaces/message-rules-model.interfaces';
import { generateId } from 'app/utils/generateId';

export class MessageRulesModel {
  private messageRules: MessageRule[] = [
    {
      id: 0,
      name: 'Message 1',
      condition: { type: 'regex', pattern: '^Да$' },
      response: { type: 'message', text: 'Нет', reply: false },
    },
    {
      id: 1,
      name: 'Message 2',
      condition: { type: 'regex', pattern: '^Нет$' },
      response: { type: 'message', text: 'Да', reply: false },
    },
  ];

  public addMessageRule(newMessageRule: NewMessageRule): void {
    const id = generateId(this.messageRules.map(messageRule => messageRule.id));
    this.messageRules.push({
      ...newMessageRule,
      id,
    });
  }

  public getMessageRule(id: number): MessageRule | undefined {
    return this.messageRules.find(messageRule => messageRule.id === id);
  }

  public getAllMessageRules(): MessageRule[] {
    return this.messageRules;
  }

  public removeMessageRule(id: number): void {
    this.messageRules = this.messageRules.filter(messageRule => messageRule.id !== id);
  }

  public getMessageRules(): MessageRule[] {
    return this.messageRules;
  }

  public updateMessageRule(messageRule: MessageRule): void {
    this.messageRules = this.messageRules.map(dbMessageRule =>
      dbMessageRule.id === messageRule.id ? {...messageRule} : dbMessageRule
    );
  }
}

diContainer.registerDependencies(MessageRulesModel);

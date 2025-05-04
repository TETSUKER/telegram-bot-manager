import { diContainer } from 'app/core/di-container';
import { ConflictError } from 'app/errors/conflict.error';
import { NotFoundError } from 'app/errors/not-found.error';
import { MessageRule, NewMessageRule } from 'app/interfaces/message-rules-model.interfaces';
import { generateId } from 'app/utils/generateId';

export class MessageRulesModel {
  private messageRules: MessageRule[] = [
    {
      id: 0,
      name: 'Message 1',
      condition: { type: 'regex', pattern: '^Да$' },
      response: { type: 'emoji', emoji: '👍' },
    },
    {
      id: 1,
      name: 'Message 2',
      condition: { type: 'regex', pattern: '^Нет$' },
      response: { type: 'message', text: 'Да', reply: false },
    },
    {
      id: 2,
      name: 'Sticker',
      condition: { type: 'regex', pattern: '^Каеф$' },
      response: {
        type: 'sticker',
        stickerId: 'CAACAgIAAyEFAASc524zAAP3aBcw-uOT5tsFj3MX-uKEoK6je24AAiJaAAIrBAlJKlxMKkER0TI2BA',
        reply: true,
      },
    }
  ];

  public async addMessageRule(newMessageRule: NewMessageRule): Promise<void> {
    const rule = this.messageRules.find(messageRule => messageRule.name === newMessageRule.name);
    if(rule) {
      throw new ConflictError(`Message rule with name: ${newMessageRule.name} already exist`);
    }

    const id = generateId(this.messageRules.map(messageRule => messageRule.id));
    this.messageRules.push({
      id,
      ...newMessageRule,
    });
  }

  public async getMessageRule(id: number): Promise<MessageRule> {
    const rule = this.messageRules.find(messageRule => messageRule.id === id);

    if (rule) {
      return rule;
    } else {
      throw new NotFoundError(`Message rule with id: ${id} not found`);
    }
  }

  public async getAllMessageRules(): Promise<MessageRule[]> {
    return this.messageRules;
  }

  public async removeMessageRule(id: number): Promise<void> {
    await this.getMessageRule(id);
    this.messageRules = this.messageRules.filter(messageRule => messageRule.id !== id);
  }

  public async updateMessageRule(messageRule: MessageRule): Promise<void> {
    await this.getMessageRule(messageRule.id);
    this.messageRules = this.messageRules.map(dbMessageRule =>
      dbMessageRule.id === messageRule.id ? {...messageRule} : dbMessageRule
    );
  }
}

diContainer.registerDependencies(MessageRulesModel);

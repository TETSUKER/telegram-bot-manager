import { diContainer } from 'app/core/di-container';
import { Postgres } from 'app/core/postgres';
import { ConflictError } from 'app/errors/conflict.error';
import { NotFoundError } from 'app/errors/not-found.error';
import { ServerApiError } from 'app/errors/server.error';
import { Column } from 'app/interfaces/postgres.interfaces';
import {
  ConditionDbRule,
  CreateDbRuleTable,
  DbRule,
  MessageCondition,
  MessageResponse,
  MessageRule,
  NewDbRule,
  NewMessageRule,
  ResponseDbRule
} from 'app/interfaces/rule.interfaces';

export class RulesModel {
  constructor(private postgres: Postgres) {
    this.createTable();
  }

  private async createTable(): Promise<void> {
    const columns: Column<CreateDbRuleTable>[] = [{
      columnName: 'id',
      type: 'serial',
      primary: true,
    }, {
      columnName: 'date_added',
      type: 'timestamp',
    }, {
      columnName: 'name',
      type: 'text',
    }, {
      columnName: 'condition_type',
      type: 'text',
    }, {
      columnName: 'regex_pattern',
      type: 'text',
    }, {
      columnName: 'length_operator',
      type: 'varchar',
      length: 1,
    }, {
      columnName: 'length_value',
      type: 'int',
    }, {
      columnName: 'command_name',
      type: 'text',
    }, {
      columnName: 'response_type',
      type: 'text',
    }, {
      columnName: 'response_text',
      type: 'text',
    }, {
      columnName: 'response_reply',
      type: 'boolean',
    }, {
      columnName: 'response_sticker_id',
      type: 'text',
    }, {
      columnName: 'response_emoji',
      type: 'text',
    }, {
      columnName: 'probability',
      type: 'int',
    }];
    await this.postgres.createTableIfNotExist('rules', columns);
  }

  public async addMessageRule(newMessageRule: NewMessageRule): Promise<void> {
    const [rule] = await this.postgres.selectFromTable<DbRule>('rules', [], [{ columnName: 'name', value: newMessageRule.name, type: 'string' }]);
    if(rule) {
      throw new ConflictError(`Message rule with name: ${newMessageRule.name} already exist`);
    }

    const newRule = this.convertToDbRule(newMessageRule);
    try {
      await this.postgres.insertInTable<NewDbRule>('rules', newRule);
    } catch {
      throw new ServerApiError('Error add message rule');
    }
  }

  public async getMessageRule(id: number): Promise<MessageRule> {
    const [rule] = await this.postgres.selectFromTable<DbRule>('rules', [], [{ columnName: 'id', value: id, type: 'number' }]);

    if (rule) {
      return this.convertFromDbRule([rule])[0];
    } else {
      throw new NotFoundError(`Message rule with id: ${id} not found`);
    }
  }

  public async getAllMessageRules(): Promise<MessageRule[]> {
    try {
      const rules = await this.postgres.selectFromTable<DbRule>('rules');
      return this.convertFromDbRule(rules);
    } catch {
      throw new ServerApiError('Error get message rules');
    }
  }

  public async removeMessageRule(id: number): Promise<void> {
    await this.getMessageRule(id);
    await this.postgres.deleteFromTableById('rules', id);
  }

  public async updateMessageRule(messageRule: MessageRule): Promise<void> {
    await this.getMessageRule(messageRule.id);

    const updatedRule = this.convertToDbRule(messageRule) as Partial<NewMessageRule>;
    await this.postgres.updateTable('rules', messageRule.id, updatedRule);
  }

  private convertToDbRule(newMessageRule: NewMessageRule): NewDbRule {
    return {
      name: newMessageRule.name,
      date_added: new Date(),
      probability: newMessageRule.probability ?? null,
      ...this.getDbCondition(newMessageRule),
      ...this.getDbResponse(newMessageRule),
    };
  }

  private getDbCondition(newMessageRule: NewMessageRule): ConditionDbRule {
    if (newMessageRule.condition.type === 'regex') {
      return {
        condition_type: 'regex',
        regex_pattern: newMessageRule.condition.pattern
      };
    }

    if (newMessageRule.condition.type === 'length') {
      return {
        condition_type: 'length',
        length_operator: newMessageRule.condition.operator,
        length_value: newMessageRule.condition.value,
      };
    }

    return {
      condition_type: 'command',
      command_name: newMessageRule.condition.name
    };
  }

  private getDbResponse(newMessageRule: NewMessageRule): ResponseDbRule {
    if (newMessageRule.response.type === 'message') {
      return {
        response_type: 'message',
        response_text: newMessageRule.response.text,
        response_reply: newMessageRule.response.reply,
      };
    }

    if (newMessageRule.response.type === 'sticker') {
      return {
        response_type: 'sticker',
        response_sticker_id: newMessageRule.response.stickerId,
        response_reply: newMessageRule.response.reply,
      };
    }

    return {
      response_type: 'emoji',
      response_emoji: newMessageRule.response.emoji,
    };
  }

  private convertFromDbRule(dbRules: DbRule[]): MessageRule[] {
    return dbRules.map(dbRule => ({
      id: dbRule.id,
      name: dbRule.name,
      condition: this.getMessageCondition(dbRule),
      response: this.getMessageResponse(dbRule),
      probability: dbRule.probability
    }));
  }

  private getMessageCondition(dbRule: DbRule): MessageCondition {
    if (dbRule.condition_type === 'regex') {
      return {
        type: 'regex',
        pattern: dbRule.regex_pattern,
      };
    }

    if (dbRule.condition_type === 'length') {
      return {
        type: 'length',
        operator: dbRule.length_operator,
        value: dbRule.length_value,
      };
    }

    return {
      type: 'command',
      name: dbRule.command_name,
    };
  }

  private getMessageResponse(dbRule: DbRule): MessageResponse {
    if (dbRule.response_type === 'message') {
      return {
        type: 'message',
        text: dbRule.response_text,
        reply: dbRule.response_reply,
      };
    }

    if (dbRule.response_type === 'sticker') {
      return {
        type: 'sticker',
        stickerId: dbRule.response_sticker_id,
        reply: dbRule.response_reply,
      };
    }

    return {
      type: 'emoji',
      emoji: dbRule.response_emoji,
    };
  }
}

diContainer.registerDependencies(RulesModel, [Postgres]);

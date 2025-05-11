import { diContainer } from 'app/core/di-container';
import { Postgres } from 'app/core/postgres';
import { ConflictError } from 'app/errors/conflict.error';
import { NotFoundError } from 'app/errors/not-found.error';
import { ServerApiError } from 'app/errors/server.error';
import { Column, Condition } from 'app/interfaces/postgres.interfaces';
import {
  ConditionDbRule,
  CreateDbRuleTable,
  DbRule,
  FilterRuleApi,
  RuleCondition,
  RuleResponse,
  Rule,
  NewDbRule,
  NewRule,
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

  public async addRule(newRule: NewRule): Promise<void> {
    const [rule] = await this.postgres.selectFromTable<DbRule>('rules', [], [{ columnName: 'name', value: newRule.name, type: 'string' }]);
    if(rule) {
      throw new ConflictError(`Rule with name: ${newRule.name} already exist`);
    }

    const dbRule = this.convertToDbRule(newRule);
    try {
      await this.postgres.insertInTable<NewDbRule>('rules', dbRule);
    } catch {
      throw new ServerApiError('Error add rule');
    }
  }

  public async getRules(filter: FilterRuleApi): Promise<Rule[]> {
    const conditions = this.getConditionsFromFilter(filter);
    try {
      const rules = await this.postgres.selectFromTable<DbRule>('rules', [], conditions);
      return this.convertFromDbRule(rules);
    } catch {
      throw new ServerApiError('Error get rules');
    }
  }

  public async removeRule(id: number): Promise<void> {
    const [rule] = await this.postgres.selectFromTable<DbRule>('rules', [], [{ columnName: 'id', value: id, type: 'number', operation: '=' }]);
    if (!rule) {
      throw new NotFoundError(`Rule with id: ${id} not found`);
    }

    await this.postgres.deleteFromTableById('rules', id);
  }

  public async updateRule(rule: Rule): Promise<void> {
    const [dbRule] = await this.postgres.selectFromTable<DbRule>('rules', [], [{ columnName: 'id', value: rule.id, type: 'number', operation: '=' }]);
    if (!dbRule) {
      throw new NotFoundError(`Rule with id: ${rule.id} not found`);
    }

    const updatedRule = this.convertToDbRule(rule) as Partial<NewRule>;
    await this.postgres.updateTable('rules', rule.id, updatedRule);
  }

  private convertToDbRule(newRule: NewRule): NewDbRule {
    return {
      name: newRule.name,
      date_added: new Date(),
      probability: newRule.probability ?? null,
      ...this.getDbCondition(newRule),
      ...this.getDbResponse(newRule),
    };
  }

  private getDbCondition(newRule: NewRule): ConditionDbRule {
    if (newRule.condition.type === 'regex') {
      return {
        condition_type: 'regex',
        regex_pattern: newRule.condition.pattern
      };
    }

    if (newRule.condition.type === 'length') {
      return {
        condition_type: 'length',
        length_operator: newRule.condition.operator,
        length_value: newRule.condition.value,
      };
    }

    return {
      condition_type: 'command',
      command_name: newRule.condition.name
    };
  }

  private getDbResponse(newRule: NewRule): ResponseDbRule {
    if (newRule.response.type === 'message') {
      return {
        response_type: 'message',
        response_text: newRule.response.text,
        response_reply: newRule.response.reply,
      };
    }

    if (newRule.response.type === 'sticker') {
      return {
        response_type: 'sticker',
        response_sticker_id: newRule.response.stickerId,
        response_reply: newRule.response.reply,
      };
    }

    return {
      response_type: 'emoji',
      response_emoji: newRule.response.emoji,
    };
  }

  private convertFromDbRule(dbRules: DbRule[]): Rule[] {
    return dbRules.map(dbRule => ({
      id: dbRule.id,
      name: dbRule.name,
      condition: this.getMessageCondition(dbRule),
      response: this.getMessageResponse(dbRule),
      probability: dbRule.probability
    }));
  }

  private getMessageCondition(dbRule: DbRule): RuleCondition {
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

  private getMessageResponse(dbRule: DbRule): RuleResponse {
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

  private getConditionsFromFilter(filter: FilterRuleApi): Condition<DbRule>[] {
    const conditions: Condition<DbRule>[] = [];

    if (filter.id) {
      conditions.push({
        columnName: 'id',
        value: filter.id,
        type: 'number',
        operation: '=',
      });
    }

    if (filter.name) {
      conditions.push({
        columnName: 'name',
        value: filter.name,
        type: 'string',
      });
    }

    if (filter.conditionType) {
      conditions.push({
        columnName: 'condition_type',
        value: filter.conditionType,
        type: 'string',
      });
    }

    if (filter.responseType) {
      conditions.push({
        columnName: 'response_type',
        value: filter.responseType,
        type: 'string',
      });
    }

    return conditions;
  }
}

diContainer.registerDependencies(RulesModel, [Postgres]);

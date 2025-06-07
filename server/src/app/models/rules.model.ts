import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
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
  ResponseDbRule,
  UpdateRuleApi,
  UpdateDbRule
} from 'app/interfaces/rule.interfaces';

export class RulesModel {
  constructor(
    private postgres: Postgres,
    private logger: Logger,
  ) {
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
      columnName: 'schedule_type',
      type: 'text',
    }, {
      columnName: 'schedule_month',
      type: 'int',
    }, {
      columnName: 'schedule_day',
      type: 'int',
    }, {
      columnName: 'schedule_day_of_week',
      type: 'text',
    }, {
      columnName: 'schedule_chat_ids',
      type: 'int',
      isArray: true,
    }, {
      columnName: 'schedule_hour',
      type: 'int',
    }, {
      columnName: 'schedule_minute',
      type: 'int',
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

  public async addRule(newRule: NewRule): Promise<Rule | null> {
    const [rule] = await this.postgres.selectFromTable<DbRule, DbRule>('rules', [], [{
      columnName: 'name',
      value: newRule.name,
      type: 'string',
      exactMatch: true,
    }]);
    if (rule) {
      throw new ConflictError(`Rule with name: ${newRule.name} already exist`);
    }

    const dbRule = this.convertToDbRule(newRule);
    try {
      const { rows } = await this.postgres.insertInTable<NewDbRule, DbRule>('rules', dbRule);
      const [ convertedRule ] = this.convertFromDbRules(rows);
      return convertedRule ?? null;
    } catch {
      throw new ServerApiError('Error add rule');
    }
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

  public async getRules(filter: FilterRuleApi): Promise<Rule[]> {
    const conditions = this.getConditionsFromFilter(filter);
    try {
      const rules = await this.postgres.selectFromTable<DbRule, DbRule>('rules', [], conditions);
      return this.convertFromDbRules(rules);
    } catch {
      throw new ServerApiError('Error get rules');
    }
  }

  private convertFromDbRules(dbRules: DbRule[]): Rule[] {
    return dbRules.map(dbRule => ({
      id: dbRule.id,
      name: dbRule.name,
      condition: this.getMessageCondition(dbRule),
      response: this.getMessageResponse(dbRule),
      probability: dbRule.probability
    }));
  }

  private getMessageCondition(dbRule: DbRule): RuleCondition {
    switch(dbRule.condition_type) {
      case 'regex': return {
        type: 'regex',
        pattern: dbRule.regex_pattern,
      };
      case 'length': return {
        type: 'length',
        operator: dbRule.length_operator,
        value: dbRule.length_value,
      };
      case 'command': return {
        type: 'command',
        name: dbRule.command_name,
      };
      case 'schedule': {
        if (dbRule.schedule_type === 'weekly') {
          return {
            type: 'schedule',
            schedule: {
              type: 'weekly',
              dayOfWeek: dbRule.schedule_day_of_week,
              hour: dbRule.schedule_hour,
              minute: dbRule.schedule_minute,
            },
            scheduleChatIds: dbRule.schedule_chat_ids,
          };
        }

        if (dbRule.schedule_type === 'annually') {
          return {
            type: 'schedule',
            schedule: {
              type: 'annually',
              month: dbRule.schedule_month,
              day: dbRule.schedule_day,
              hour: dbRule.schedule_hour,
              minute: dbRule.schedule_minute,
            },
            scheduleChatIds: dbRule.schedule_chat_ids,
          };
        }
      };
    }

    throw new Error('No all condition types mapped in getMessageCondition');
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

    if (dbRule.response_type === 'emoji') {
      return {
        type: 'emoji',
        emoji: dbRule.response_emoji,
      };
    }

    if (dbRule.response_type === 'random_joke') {
      return {
        type: 'random_joke',
      };
    }

    if (dbRule.response_type === 'find_joke') {
      return {
        type: 'find_joke',
      };
    }

    return {
      type: 'joke_rating',
    };
  }

  private getConditionsFromFilter(filter: FilterRuleApi): Condition<DbRule>[] {
    const conditions: Condition<DbRule>[] = [];

    if (filter.ids?.length) {
      filter.ids.forEach(id => {
        conditions.push({
          columnName: 'id',
          value: id,
          type: 'number',
          operation: '=',
        });
      });
    }

    if (filter.names?.length) {
      filter.names.forEach(name => {
        conditions.push({
          columnName: 'name',
          value: name,
          type: 'string',
          exactMatch: false,
        });
      });
    }

    if (filter.conditionTypes?.length) {
      filter.conditionTypes.forEach(conditionType => {
        conditions.push({
          columnName: 'condition_type',
          value: conditionType,
          type: 'string',
          exactMatch: false,
        });
      });
    }

    if (filter.responseTypes?.length) {
      filter.responseTypes.forEach(responseType => {
        conditions.push({
          columnName: 'response_type',
          value: responseType,
          type: 'string',
          exactMatch: false,
        });
      });
    }

    if (filter.scheduleChatIds?.length) {
      conditions.push({
        columnName: 'schedule_chat_ids',
        values: filter.scheduleChatIds,
        type: 'array',
      });
    }

    return conditions;
  }

  public async removeRules(ids: number[]): Promise<Rule[]> {
    const { rows } = await this.postgres.deleteFromTableByIds<DbRule>('rules', ids);
    return this.convertFromDbRules(rows);
  }

  public async updateRule(rule: UpdateRuleApi): Promise<Rule | null> {
    const [dbRule] = await this.postgres.selectFromTable<DbRule, DbRule>('rules', [], [{ columnName: 'id', value: rule.id, type: 'number', operation: '=' }]);
    if (!dbRule) {
      throw new NotFoundError(`Rule with id: ${rule.id} not found`);
    }

    const updatedDbRule = this.convertToUpdateModelRule(rule);
    const { rows } = await this.postgres.updateTable<UpdateDbRule, DbRule>('rules', rule.id, updatedDbRule);
    const [ updatedRule ] = this.convertFromDbRules(rows);
    return updatedRule ?? null;
  }

  private convertToUpdateModelRule(rule: UpdateRuleApi): UpdateDbRule {
    const updateModelRule: UpdateDbRule = {};

    if (rule.name) {
      updateModelRule.name = rule.name;
    }
    if (rule.condition && rule.condition.type) {
      updateModelRule.condition_type = rule.condition.type;

      if (rule.condition.type === 'regex' && updateModelRule.condition_type === 'regex') {
        updateModelRule.regex_pattern = rule.condition.pattern;
      }

      if (rule.condition.type === 'length' && updateModelRule.condition_type === 'length') {
        updateModelRule.length_value = rule.condition.value;
        updateModelRule.length_operator = rule.condition.operator;
      }

      if (rule.condition.type === 'command' && updateModelRule.condition_type === 'command') {
        updateModelRule.command_name = rule.condition.name;
      }

      if (rule.condition.type === 'schedule' && updateModelRule.condition_type === 'schedule') {
        if (rule.condition.schedule && rule.condition.schedule.type) {
          updateModelRule.schedule_type = rule.condition.schedule.type;
          updateModelRule.schedule_chat_ids = rule.condition.scheduleChatIds;
          updateModelRule.schedule_hour = rule.condition.schedule.hour;
          updateModelRule.schedule_minute = rule.condition.schedule.minute;

          if (rule.condition.schedule.type === 'weekly' && updateModelRule.schedule_type === 'weekly') {
            updateModelRule.schedule_day_of_week = rule.condition.schedule.dayOfWeek;
          }

          if (rule.condition.schedule.type === 'annually' && updateModelRule.schedule_type === 'annually') {
            updateModelRule.schedule_month = rule.condition.schedule.month;
          }
        }
      }
    }
    if (rule.response && rule.response.type) {
      updateModelRule.response_type = rule.response.type;

      if (rule.response.type === 'message' && updateModelRule.response_type === 'message') {
        updateModelRule.response_text = rule.response.text;
        updateModelRule.response_reply = rule.response.reply;
      }

      if (rule.response.type === 'sticker' && updateModelRule.response_type === 'sticker') {
        updateModelRule.response_sticker_id = rule.response.stickerId;
        updateModelRule.response_reply = rule.response.reply;
      }

      if (rule.response.type === 'emoji' && updateModelRule.response_type === 'emoji') {
        updateModelRule.response_emoji = rule.response.emoji;
      }
    }
    if (rule.probability) {
      updateModelRule.probability = rule.probability;
    }

    return updateModelRule;
  }

  private getDbCondition(newRule: NewRule): ConditionDbRule {
    switch(newRule.condition.type) {
      case 'regex': return {
        condition_type: 'regex',
        regex_pattern: newRule.condition.pattern
      };

      case 'length': return {
        condition_type: 'length',
        length_operator: newRule.condition.operator,
        length_value: newRule.condition.value,
      };

      case 'command': return {
        condition_type: 'command',
        command_name: newRule.condition.name,
      };

      case 'schedule': {
        if (newRule.condition.schedule.type === 'weekly') {
          return {
            condition_type: 'schedule',
            schedule_type: 'weekly',
            schedule_day_of_week: newRule.condition.schedule.dayOfWeek,
            schedule_hour: newRule.condition.schedule.hour,
            schedule_minute: newRule.condition.schedule.minute,
            schedule_chat_ids: newRule.condition.scheduleChatIds,
          };
        }
        if (newRule.condition.schedule.type === 'annually') {
          return {
            condition_type: 'schedule',
            schedule_type: 'annually',
            schedule_month: newRule.condition.schedule.month,
            schedule_day: newRule.condition.schedule.day,
            schedule_hour: newRule.condition.schedule.hour,
            schedule_minute: newRule.condition.schedule.minute,
            schedule_chat_ids: newRule.condition.scheduleChatIds,
          };
        }
      }
    }

    throw new Error('No all condition types mapped in getDbCondition');
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

    if (newRule.response.type === 'emoji') {
      return {
        response_type: 'emoji',
        response_emoji: newRule.response.emoji,
      };
    }

    if (newRule.response.type === 'random_joke') {
      return {
        response_type: 'random_joke',
      };
    }

    if (newRule.response.type === 'find_joke') {
      return {
        response_type: 'find_joke',
      };
    }

    return {
      response_type: 'joke_rating',
    };
  }
}

diContainer.registerDependencies(RulesModel, [
  Postgres,
  Logger,
]);

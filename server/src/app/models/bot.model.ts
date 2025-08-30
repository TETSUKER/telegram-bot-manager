import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
import { Postgres } from 'app/core/postgres';
import { ConflictError } from 'app/errors/conflict.error';
import { NotFoundError } from 'app/errors/not-found.error';
import { FilterBotApi, Bot, UpdateBotApi } from 'app/interfaces/bot.interfaces';
import { NewDbBot, DbBot, UpdateDbBot } from 'app/interfaces/bot.interfaces';
import { Column, Condition } from 'app/interfaces/postgres.interfaces';

export class BotModel {
  constructor(
    private postgres: Postgres,
    private logger: Logger,
  ) {
    this.createTable();
  }

  private async createTable(): Promise<void> {
    const columns: Column<DbBot>[] = [{
      columnName: 'id',
      type: 'serial',
      primary: true,
    }, {
      columnName: 'rule_ids',
      type: 'int',
      isArray: true,
    }, {
      columnName: 'token',
      type: 'text',
    }, {
      columnName: 'date_added',
      type: 'timestamp',
    }, {
      columnName: 'username',
      type: 'text',
    }, {
      columnName: 'first_name',
      type: 'text',
    }, {
      columnName: 'can_join_groups',
      type: 'boolean',
    }, {
      columnName: 'can_read_all_group_messages',
      type: 'boolean',
    }, {
      columnName: 'supports_inline_queries',
      type: 'boolean',
    }, {
      columnName: 'can_connect_to_business',
      type: 'boolean',
    }, {
      columnName: 'has_main_web_app',
      type: 'boolean',
    }, {
      columnName: 'last_update_id',
      type: 'int',
    }];
    await this.postgres.createTableIfNotExist('bots', columns);
  }

  public async addBot(newBot: NewDbBot): Promise<Bot | null> {
    const bot = await this.postgres.selectFromTable('bots', [], [{
      columnName: 'token',
      value: newBot.token,
      type: 'string',
      exactMatch: true,
    }]);
    if (bot.length) {
      throw new ConflictError(`Bot with same token already exist`);
    }

    try {
      const { rows } = await this.postgres.insertInTable<NewDbBot, DbBot>('bots', newBot);
      const [ bot ] = this.convertFromDbBot(rows);
      return bot ?? null;
    } catch(err) {
      this.logger.errorLog(`Error get all bots: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  public async getBots(filter: FilterBotApi): Promise<Bot[]> {
    const conditions = this.getConditionsFromFilter(filter);

    try {
      const bots = await this.postgres.selectFromTable<DbBot, DbBot>('bots', [], conditions);
      return this.convertFromDbBot(bots);
    } catch(err) {
      this.logger.errorLog(`Error get all bots: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  public async removeBot(ids: number[]): Promise<Bot[]> {
    try {
      const { rows } = await this.postgres.deleteFromTableByIds<DbBot>('bots', ids);
      return this.convertFromDbBot(rows);
    } catch(err) {
      this.logger.errorLog(`Remove bot with ids: ${ids.join(',')} error: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  public async updateBot(bot: UpdateBotApi): Promise<Bot | null> {
    const [dbBot] = await this.getBots({ ids: [bot.id] });
    if (!dbBot) {
      throw new NotFoundError(`Bot with id: ${bot.id} not found`);
    }

    if (bot.id) {
      const updatedBot = this.convertToUpdateModelBot(bot);
      const { rows } = await this.postgres.updateTable<UpdateDbBot, DbBot>('bots', bot.id, updatedBot);
      const [ convertedBot ] = this.convertFromDbBot(rows);
      return convertedBot ?? null;
    } else {
      throw new NotFoundError(`Bot with id: ${bot.id} not found`);
    }
  }

  private convertFromDbBot(bots: DbBot[]): Bot[] {
    return bots.map(bot => ({
      id: bot.id,
      token: bot.token,
      username: bot.username,
      ruleIds: bot.rule_ids,
      dateAdded: bot.date_added,
      firstName: bot.first_name,
      canJoinGroups: bot.can_join_groups,
      canReadAllGroupMessages: bot.can_read_all_group_messages,
      supportsInlineQueries: bot.supports_inline_queries,
      canConnectToBusiness: bot.can_connect_to_business,
      hasMainWebApp: bot.has_main_web_app,
      lastUpdateId: bot.last_update_id,
    }));
  }

  private convertToUpdateModelBot(bot: UpdateBotApi): UpdateDbBot {
    const updateModelBot: UpdateDbBot = {};

    if (bot.ruleIds) {
      updateModelBot.rule_ids = bot.ruleIds;
    }
    if (bot.lastUpdateId) {
      updateModelBot.last_update_id = bot.lastUpdateId;
    }

    return updateModelBot;
  }

  private getConditionsFromFilter(filter: FilterBotApi): Condition<DbBot>[] {
    const conditions: Condition<DbBot>[] = [];

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

    if (filter.usernames?.length) {
      filter.usernames.forEach(username => {
        conditions.push({
          columnName: 'username',
          value: username,
          type: 'string',
          exactMatch: false,
        });
      });
    }

    if (filter.ruleIds?.length) {
      conditions.push({
        columnName: 'rule_ids',
        values: filter.ruleIds,
        type: 'array',
      });
    }

    return conditions;
  }
}

diContainer.registerDependencies(BotModel, [Postgres, Logger]);

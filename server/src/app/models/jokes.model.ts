import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
import { Postgres } from 'app/core/postgres';
import { NotFoundError } from 'app/errors/not-found.error';
import { ServerApiError } from 'app/errors/server.error';
import { DbJoke, FilterJokeApi, Joke, NewDbJoke, NewJoke, UpdateDbJoke, UpdateJokeApi } from 'app/interfaces/joke.interfaces';
import { Column, Condition } from 'app/interfaces/postgres.interfaces';

export class JokesModel {
  private readonly JokesTableName = 'jokes';
  constructor(
    private postgres: Postgres,
    private logger: Logger,
  ) {
    this.createTable();
  }

  private async createTable(): Promise<void> {
    const columns: Column<DbJoke>[] = [{
      columnName: 'id',
      type: 'serial',
      primary: true,
    }, {
      columnName: 'text',
      type: 'text',
    }, {
      columnName: 'sended_chat_ids',
      type: 'text',
      isArray: true,
    }];
    await this.postgres.createTableIfNotExist(this.JokesTableName, columns);
  }

  public async getJokes(filter: FilterJokeApi): Promise<Joke[]> {
    const conditions = this.getConditionsFromFilter(filter);

    try {
      const jokes = await this.postgres.selectFromTable<DbJoke, DbJoke>(this.JokesTableName, [], conditions);
      return this.convertFromDbJoke(jokes);
    } catch(err) {
      this.logger.errorLog(`Error while get jokes: ${err}`);
      throw new ServerApiError('Error get jokes');
    }
  }

  private getConditionsFromFilter(filter: FilterJokeApi): Condition<DbJoke>[] {
    const conditions: Condition<DbJoke>[] = [];

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

    if (filter.text) {
      conditions.push({
        columnName: 'text',
        value: filter.text,
        type: 'string',
        exactMatch: false,
      });
    }

    if (filter.sendedChatIds && filter.sendedChatIds.ids.length) {
      conditions.push({
        columnName: 'sended_chat_ids',
        values: filter.sendedChatIds.ids,
        type: 'array',
        exclude: filter.sendedChatIds.exclude,
      });
    }

    return conditions;
  }

  private convertFromDbJoke(dbJokes: DbJoke[]): Joke[] {
    return dbJokes.map(dbJoke => ({
      id: dbJoke.id,
      text: dbJoke.text.replace(/\\n/g, '\n'),
      sendedChatIds: dbJoke.sended_chat_ids ?? [],
    }));
  }

  public async addJoke(newJoke: NewJoke): Promise<Joke | null> {
    const joke: NewDbJoke = {
      ...newJoke,
      sended_chat_ids: [],
    };
    try {
      const { rows } = await this.postgres.insertInTable<NewDbJoke, DbJoke>(this.JokesTableName, joke);
      const [ addedJoke ] = this.convertFromDbJoke(rows);
      return addedJoke ?? null;
    } catch(err) {
      this.logger.errorLog(`Error add joke: ${err}`);
      throw err;
    }
  }

  public async updateJoke(joke: UpdateJokeApi): Promise<Joke | null> {
    const [dbJoke] = await this.postgres.selectFromTable<DbJoke, DbJoke>(this.JokesTableName, [], [{
      columnName: 'id', value: joke.id, type: 'number', operation: '='
    }]);
    if (!dbJoke) {
      throw new NotFoundError(`Joke with id: ${joke.id} not found`);
    }

    const updatedDbJoke = this.convertFromUpdateJoke(joke);
    const { rows } = await this.postgres.updateTable<UpdateDbJoke, DbJoke>(this.JokesTableName, joke.id, updatedDbJoke);
    const [ updatedJoke ] = this.convertFromDbJoke(rows);
    return updatedJoke ?? null;
  }

  private convertFromUpdateJoke(joke: UpdateJokeApi): UpdateDbJoke {
    const updateDbChat: UpdateDbJoke = {};

    if (joke.text) {
      updateDbChat.text = joke.text;
    }

    if (joke.sendedChatIds) {
      updateDbChat.sended_chat_ids = joke.sendedChatIds;
    }

    return updateDbChat;
  }

  public async removeJokes(ids: number[]): Promise<Joke[]> {
    const { rows } = await this.postgres.deleteFromTableByIds<DbJoke>(this.JokesTableName, ids);
    return this.convertFromDbJoke(rows);
  }
}

diContainer.registerDependencies(JokesModel, [
  Postgres,
  Logger,
]);
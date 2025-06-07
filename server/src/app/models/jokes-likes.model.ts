import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
import { Postgres } from 'app/core/postgres';
import { ServerApiError } from 'app/errors/server.error';
import { DbJokeLike, FilterJokesLikes, JokeLike, NewDbJokeLike, NewJokeLike } from 'app/interfaces/jokes-likes.interfaces';
import { Column, Condition } from 'app/interfaces/postgres.interfaces';

export class JokesLikesModel {
  private readonly JokesLikesTableName = 'jokes_likes';

  constructor(
    private postgres: Postgres,
    private logger: Logger,
  ) {
    this.createTable();
  }

  private async createTable(): Promise<void> {
    const columns: Column<DbJokeLike>[] = [{
      columnName: 'id',
      type: 'serial',
      primary: true,
    }, {
      columnName: 'joke_id',
      type: 'bigint',
    }, {
      columnName: 'user_id',
      type: 'bigint',
    }, {
      columnName: 'is_like',
      type: 'boolean',
    }];
    await this.postgres.createTableIfNotExist(this.JokesLikesTableName, columns);
  }

  public async getJokesLikes(filter: FilterJokesLikes): Promise<JokeLike[]> {
    const conditions = this.getConditionsFromFilter(filter);

    try {
      const jokes = await this.postgres.selectFromTable<DbJokeLike, DbJokeLike>(this.JokesLikesTableName, [], conditions, 'and');
      return this.convertFromDbJokeLike(jokes);
    } catch(err) {
      this.logger.errorLog(`Error while get jokes likes: ${err}`);
      throw new ServerApiError('Error get jokes likes');
    }
  }

  private getConditionsFromFilter(filter: FilterJokesLikes): Condition<DbJokeLike>[] {
    const conditions: Condition<DbJokeLike>[] = [];

    if (filter.id) {
      conditions.push({
        columnName: 'id',
        value: filter.id,
        type: 'number',
        operation: '=',
      });
    }

    if (filter.jokeId) {
      conditions.push({
        columnName: 'joke_id',
        value: filter.jokeId,
        type: 'number',
        operation: '=',
      });
    }

    if (filter.userId) {
      conditions.push({
        columnName: 'user_id',
        value: filter.userId,
        type: 'number',
        operation: '=',
      });
    }

    if (filter.isLike) {
      conditions.push({
        columnName: 'is_like',
        value: filter.isLike,
        type: 'boolean',
      });
    }

    return conditions;
  }

  public async addJokeLike(newJokeLike: NewJokeLike): Promise<JokeLike | null> {
    try {
      const dbNewJokeLike = this.convertFromNewJokeLike(newJokeLike);
      const { rows } = await this.postgres.insertInTable<NewDbJokeLike, DbJokeLike>(this.JokesLikesTableName, dbNewJokeLike);
      const [ convertedJoke ] = this.convertFromDbJokeLike(rows);
      return convertedJoke ?? null;
    } catch(err) {
      this.logger.errorLog(`Error add joke like: ${err}`);
      throw err;
    }
  }

  private convertFromNewJokeLike(newJokeLike: NewJokeLike): NewDbJokeLike {
    return {
      joke_id: newJokeLike.jokeId,
      user_id: newJokeLike.userId,
      is_like: newJokeLike.isLike,
    };
  }

  public async removeJokesLikes(ids: number[]): Promise<JokeLike[]> {
    const { rows } = await this.postgres.deleteFromTableByIds<DbJokeLike>(this.JokesLikesTableName, ids);
    return this.convertFromDbJokeLike(rows);
  }

  private convertFromDbJokeLike(dbJokeLikes: DbJokeLike[]): JokeLike[] {
    return dbJokeLikes.map(dbJokeLike => ({
      id: dbJokeLike.id,
      jokeId: dbJokeLike.joke_id,
      userId: dbJokeLike.user_id,
      isLike: dbJokeLike.is_like,
    }));
  }
}

diContainer.registerDependencies(JokesLikesModel, [
  Postgres,
  Logger,
]);

import { diContainer } from './di-container';
import { Dotenv } from './dotenv';
import { Logger } from './logger';
import { Client, QueryResultRow, QueryResult } from 'pg';
import { Column, Condition, LogicalOperator, Sort, TableName } from 'app/interfaces/postgres.interfaces';

export class Postgres {
  private client = this.getClient();

  constructor(
    private dotenv: Dotenv,
    private logger: Logger,
  ) {
    this.connectToDb();
    this.closeConnectToDbOnSigterm();
  }

  public async selectFromTable<T, R extends QueryResultRow = any>(tableName: TableName, columns?: (keyof T)[], conditions?: Condition<T>[], logicOperator?: LogicalOperator, sort?: Sort<T>): Promise<R[]> {
    const select = columns?.length ? columns.join(',') : '*';
    const queryConditions = conditions?.length ? `where ${conditions.map(condition => {
      if (condition.type === 'string') {
        return `"${String(condition.columnName)}" ${condition.exactMatch ? '=' : 'like'} '%${condition.value}%'`;
      }
      if (condition.type === 'json') {
        return `${String(condition.columnName)}::jsonb @> '[${condition.value}]'`;
      }
      if (condition.type === 'number') {
        return `"${String(condition.columnName)}" ${condition.operation ?? '='} ${condition.value}`;
      }
      if (condition.type === 'boolean') {
        return `${String(condition.columnName)} = ${condition.value ? 'true' : 'false'}`;
      }
      if (condition.type === 'array' && condition.values.length) {
        return `${condition?.exclude ? 'not' : ''} ${String(condition.columnName)} && array[${condition.values.map(key => typeof key === 'number' ? key :`'${key}'`).join(',')}]`;
      }
    }).join(` ${logicOperator ? logicOperator : 'or'} `)}` : '';
    const sortQuery = sort ? `order by ${sort.columnName.toString()} ${sort.sort}` : '';
    const query = `select ${select} from ${tableName} ${queryConditions} ${sortQuery}`;

    try {
      this.logger.infoLog(`Select from ${tableName} query: ${query}`);
      const { rows } = await this.client.query(query);
      return rows as R[];
    } catch(err) {
      this.logger.errorLog(`Select from ${tableName} error: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  public async insertInTable<T, R extends QueryResultRow = any>(tableName: TableName, object: {[Key in keyof T]: T[Key]}): Promise<QueryResult<R>> {
    const columns = Object.keys(object).map(key => `"${key}"`).join(', ');
    const values = Object.keys(object).map(key => {
      const isArray = Array.isArray(object[key as keyof T]);
      if (typeof object[key as keyof T] === 'string') {
        return object[key as keyof T];
      }
      if (isArray) {
        return `{${(object[key as keyof T] as []).join(',')}}`;
      }
      if (object[key as keyof T] === null) {
        return null;
      }
      return `${JSON.stringify(object[key as keyof T])}`;
    });
    const query = `insert into ${tableName} (${columns})\nvalues (${values.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;

    try {
      this.logger.infoLog(`Insert in ${tableName} query: ${query} \nvalues: ${JSON.stringify(values)}`);
      return await this.client.query(query, values);
    } catch(err) {
      this.logger.errorLog(`Insert in ${tableName} error: ${err}`);
      throw err;
    }
  }

  public async updateTable<T, R extends QueryResultRow = any>(tableName: TableName, id: number, object: {[Key in keyof T]: T[Key]}): Promise<QueryResult<R>> {
    const columns = Object.keys(object).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.keys(object).map(key => {
      if (typeof object[key as keyof T] === 'string') {
        return object[key as keyof T];
      }
      const isArray = Array.isArray(object[key as keyof T]);
      if (isArray) {
        return object[key as keyof T] as [];
      }
      if (object[key as keyof T] === null) {
        return null;
      }
      if (typeof object[key as keyof T] === 'object' && !isArray) {
        return JSON.stringify(object[key as keyof T]);
      }
      return object[key as keyof T];
    });
    const query = `update ${tableName} set ${columns} where id=${id} RETURNING *`;

    try {
      this.logger.infoLog(`Update ${tableName} query: "${query}"\n${JSON.stringify(values)}`);
      return await this.client.query(query, values);
    } catch(err) {
      this.logger.errorLog(`Update ${tableName} error: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  public async deleteFromTableByIds<R extends QueryResultRow = any>(tableName: TableName, ids: number[]): Promise<QueryResult<R>> {
    const query = `delete from ${tableName} where id IN (${ids.join(', ')}) returning *`;

    try {
      this.logger.infoLog(`Delete from ${tableName} query: ${query}`);
      return await this.client.query(query);
    } catch(err) {
      this.logger.errorLog(`Delete from ${tableName} error: ${err}`);
      throw err;
    }
  }

  public async createTableIfNotExist<T>(tableName: TableName, columns: Column<T>[]): Promise<any> {
    const query = `create table if not exists ${tableName} (\n` + columns.map((column, index) => {
      const type = `${column.type === 'varchar' ? `(${column.length})` : ''}`;
      const primary = `${column.primary ? 'primary key' : ''}`;
      const unique = `${column.unique ? 'unique': ''}`;
      const notNull = `${column.notNull ? 'not null' : ''}`;
      const isArray = `${column.isArray ? '[]' : ''}`;
      return `"${column.columnName.toString()}" ${column.type}${type}${isArray} ${primary} ${unique} ${notNull}${columns.length - 1 === index ? '' : ',' }`;
    }).join('\n') + '\n);';

    try {
      this.logger.infoLog(`Create ${tableName} query: ${query}`);
      return await this.client.query(query);
    } catch(err) {
      this.logger.errorLog(`Create ${tableName} if not exists error: ${err}`);
      throw err;
    }
  }

  // Костыль для запросов с кастомной сортировкой
  // типа: SUM(CASE WHEN is_like THEN 1 ELSE -1 END)
  public async customQuery<R extends QueryResultRow = any>(query: string): Promise<QueryResult<R>> {
    try {
      this.logger.infoLog(`${this.customQuery.name}: ${query}`);
      return await this.client.query(query);
    } catch(err) {
      this.logger.errorLog(`Error while call ${this.customQuery.name}: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  private getClient(): Client {
    const host = this.dotenv.environments.PG_HOST;
    const db_port = Number(this.dotenv.environments.PG_PORT);
    const database = this.dotenv.environments.PG_DATABASE;
    const db_user = this.dotenv.environments.PG_USERNAME;
    const db_password = this.dotenv.environments.PG_PASSWORD;

    return new Client({
      host,
      port: db_port,
      database,
      user: db_user,
      password: db_password,
    });
  }

  private async connectToDb(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.successfulLog('PostgreSQL connected');
    } catch(err) {
      throw new Error(`❌ Error connect to PostgreSQL: ${err}`);
    }
  }

  private closeConnectToDbOnSigterm(): void {
    process.on('SIGTERM', () => {
      this.client.end()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    });
  }
}

diContainer.registerDependencies(Postgres, [
  Dotenv,
  Logger,
]);
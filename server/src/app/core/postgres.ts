import { diContainer } from './di-container';
import { Dotenv } from './dotenv';
import { Logger } from './logger';
import { Client } from 'pg';
import { Column, Condition, LogicalOperator, TableName } from 'app/interfaces/postgres.interfaces';

export class Postgres {
  private client = this.getClient();

  constructor(
    private dotenv: Dotenv,
    private logger: Logger,
  ) {
    this.connectToDb();
    this.closeConnectToDbOnSigterm();
  }

  public async selectFromTable<T>(tableName: TableName, columns?: (keyof T)[], conditions?: Condition<T>[], logicOperator?: LogicalOperator): Promise<T[]> {
    const select = columns?.length ? columns.join(',') : '*';
    const queryConditions = conditions?.length ? `where ${conditions.map(condition => {
      if (condition.type === 'string') {
        return `"${String(condition.columnName)}" like '%${condition.value}%'`;
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
    }).join(` ${logicOperator ? logicOperator : 'and'} `)}` : '';
    const query = `select ${select} from ${tableName} ${queryConditions}`;
    const { rows } = await this.client.query(query);

    return rows;
  }

  public async insertInTable<T>(tableName: TableName, object: {[Key in keyof T]: T[Key]}): Promise<any> {
    const columns = Object.keys(object).map(key => `"${key}"`).join(', '); // Тут только двойные кавычки работают
    const values = Object.keys(object).map(key => {
      const isArray = Array.isArray(object[key as keyof T]);
      if (typeof object[key as keyof T] === 'string') {
        return `'${object[key as keyof T]}'`;
      }
      if (isArray) {
        return `'{${(object[key as keyof T] as []).join(',')}}'`;
      }
      if (object[key as keyof T] === null) {
        return 'null';
      }
      return `'${JSON.stringify(object[key as keyof T])}'`;
    }).join(', '); // Тут только одинарные
    const query = `insert into ${tableName} (${columns})\nvalues (${values})`;

    try {
      return await this.client.query(query);
    } catch(err) {
      this.logger.errorLog(`Insert in ${tableName} error: ${err}`);
      throw err;
    }
  }

  public async updateTable<T>(tableName: TableName, id: number, object: {[Key in keyof T]: T[Key]}): Promise<any> {
    const values = Object.keys(object).map(key => {
      const isArray = Array.isArray(object[key as keyof T]);
      if (typeof object[key as keyof T] === 'string') {
        return `"${key}"='${object[key as keyof T]}'`;
      }
      if (isArray) {
        return `"${key}"='{${(object[key as keyof T] as []).join(',')}}'`;
      }
      if (object[key as keyof T] === null) {
        return `"${key}"=null`;
      }
      if (typeof object[key as keyof T] === 'object' && !isArray) {
        return `"${key}"='${JSON.stringify(object[key as keyof T])}'`;
      }
      return `"${key}"=${object[key as keyof T]}`;
    }).join(', ');
    const query = `update ${tableName} set ${values} where id=${id}`;

    try {
      return await this.client.query(query);
    } catch(err) {
      this.logger.errorLog(`Update ${tableName} error: ${err}`);
      throw err;
    }
  }

  public async deleteFromTableById(tableName: TableName, id: number): Promise<any> {
    const query = `delete from ${tableName} where id=${id}`;

    try {
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
      return await this.client.query(query);
    } catch(err) {
      this.logger.errorLog(`Create ${tableName} if not exists error: ${err}`);
      throw err;
    }
  }

  private getClient(): Client {
    const host = this.dotenv.environments.HOST;
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
    process.on('SIGTERM', async () => {
      await this.client.end();
      process.exit(0);
    });
  }
}

diContainer.registerDependencies(Postgres, [
  Dotenv,
  Logger,
]);
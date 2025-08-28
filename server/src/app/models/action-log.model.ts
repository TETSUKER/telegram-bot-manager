import { diContainer } from "app/core/di-container";
import { Logger } from "app/core/logger";
import { Postgres } from "app/core/postgres";
import { ServerApiError } from "app/errors/server.error";
import {
  ActionLog,
  DbActionLog,
  FilterActionLog,
  NewActionLog,
  NewDbActionLog,
} from "app/interfaces/action-log.interfaces";
import { Column, Condition, Sort } from "app/interfaces/postgres.interfaces";

export class ActionLogModel {
  private readonly ActionLogTableName = "action_logs";
  constructor(private postgres: Postgres, private logger: Logger) {
    this.createTable();
  }

  private async createTable(): Promise<void> {
    const columns: Column<DbActionLog>[] = [
      {
        columnName: "id",
        type: "serial",
        primary: true,
      },
      {
        columnName: "type",
        type: "text",
      },
      {
        columnName: "details",
        type: "text",
      },
      {
        columnName: "date",
        type: "timestamp",
      },
    ];
    await this.postgres.createTableIfNotExist(this.ActionLogTableName, columns);
  }

  public async getActionLogs(filter: FilterActionLog): Promise<ActionLog[]> {
    const conditions = this.getConditionsFromFilter(filter);
    const sort: Sort<DbActionLog> = {
      sort: "desc",
      columnName: "date",
    };

    try {
      return await this.postgres.selectFromTable<DbActionLog, DbActionLog>(
        this.ActionLogTableName,
        [],
        conditions,
        "or",
        sort
      );
    } catch (err) {
      this.logger.errorLog(`Error while get logs: ${err}`);
      throw new ServerApiError("Error get action logs");
    }
  }

  private getConditionsFromFilter(
    filter: FilterActionLog
  ): Condition<DbActionLog>[] {
    const conditions: Condition<DbActionLog>[] = [];

    if (filter.ids?.length) {
      filter.ids.forEach((id) => {
        conditions.push({
          columnName: "id",
          value: id,
          type: "number",
          operation: "=",
        });
      });
    }

    if (filter.types?.length) {
      filter.types.forEach((type) => {
        conditions.push({
          columnName: "type",
          value: type,
          type: "string",
          exactMatch: false,
        });
      });
    }

    return conditions;
  }

  public async addActionLog(
    newActionLog: NewActionLog
  ): Promise<ActionLog | null> {
    try {
      const { rows } = await this.postgres.insertInTable<
        NewDbActionLog,
        DbActionLog
      >(this.ActionLogTableName, newActionLog);
      const [actionLog] = rows;
      return actionLog ?? null;
    } catch (err) {
      this.logger.errorLog(`Error add action log: ${err}`);
      throw err;
    }
  }

  public async removeActionLogs(ids: number[]): Promise<ActionLog[]> {
    const { rows } = await this.postgres.deleteFromTableByIds<DbActionLog>(
      this.ActionLogTableName,
      ids
    );
    return rows;
  }
}

diContainer.registerDependencies(ActionLogModel, [Postgres, Logger]);

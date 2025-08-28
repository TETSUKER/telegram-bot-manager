import { diContainer } from "app/core/di-container";
import {
  FilterActionLog,
  NewActionLog,
} from "app/interfaces/action-log.interfaces";
import { ActionLogService } from "app/services/action-log.service";
import { Request } from "app/interfaces/http.interfaces";
import { ServerResponse } from "http";

export class ActionLogController {
  constructor(private actionLogService: ActionLogService) {}

  public async getActionLogs(
    request: Request<FilterActionLog>,
    response: ServerResponse
  ): Promise<void> {
    const actionLogs = await this.actionLogService.getActionLogs(
      request.body ?? {}
    );
    response.end(JSON.stringify(actionLogs));
  }

  public async addActionLog(
    request: Request<NewActionLog>,
    response: ServerResponse
  ): Promise<void> {
    if (request.body) {
      const addedActionLog = await this.actionLogService.addActionLog(
        request.body
      );
      response.end(JSON.stringify(addedActionLog ?? {}));
    }
  }

  public async removeActionLogs(
    request: Request<{ ids: number[] }>,
    response: ServerResponse
  ): Promise<void> {
    if (request.body) {
      const ids = request.body.ids;
      const removedIds = await this.actionLogService.removeActionLogs(ids);
      response.end(JSON.stringify({ ids: removedIds }));
    }
  }
}

diContainer.registerDependencies(ActionLogController, [ActionLogService]);

import { ActionLogController } from "app/controllers/action-log.controller";
import { diContainer } from "app/core/di-container";
import { Router } from "app/core/router";
import { FilterActionLog } from "app/interfaces/action-log.interfaces";
import { parseBody } from "app/middlewares/parseBody";
import { validateSchema } from "app/middlewares/validateSchema";
import { writeHeadJson } from "app/middlewares/writeHeadJson";
import { FilterActionLogSchema } from "app/schemas/action-log.schema";
import { IdsSchema } from "app/schemas/id.schema";

export class ActionLogRoutes {
  constructor(
    private router: Router,
    private actionLogController: ActionLogController
  ) {}

  public registerRoutes(): void {
    this.router.post<FilterActionLog>(
      "/getActionLogs",
      [writeHeadJson, parseBody, validateSchema(FilterActionLogSchema)],
      async (req, res) => {
        await this.actionLogController.getActionLogs(req, res);
      }
    );

    this.router.post<{ ids: number[] }>(
      "/removeActionLogs",
      [writeHeadJson, parseBody, validateSchema(IdsSchema)],
      async (req, res) => {
        await this.actionLogController.removeActionLogs(req, res);
      }
    );
  }
}

diContainer.registerDependencies(ActionLogRoutes, [
  Router,
  ActionLogController,
]);

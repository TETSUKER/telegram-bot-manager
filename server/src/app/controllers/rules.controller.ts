import { ServerResponse } from "http";
import { diContainer } from "app/core/di-container";
import { Request } from "app/interfaces/http.interfaces";
import {
  NewRule,
  FilterRuleApi,
  UpdateRuleApi,
} from "app/interfaces/rule.interfaces";
import { RulesService } from "app/services/rules.service";

export class RulesController {
  constructor(private rulesService: RulesService) {}

  public async addRule(
    request: Request<NewRule>,
    response: ServerResponse
  ): Promise<void> {
    if (request.body) {
      const addedRule = await this.rulesService.addRule(request.body);
      response.end(JSON.stringify(addedRule ?? {}));
    }
  }

  public async getRules(
    request: Request<FilterRuleApi>,
    response: ServerResponse
  ): Promise<void> {
    const messageRules = await this.rulesService.getRules(request.body ?? {});
    response.end(JSON.stringify(messageRules));
  }

  public async removeRule(
    request: Request<{ ids: number[] }>,
    response: ServerResponse
  ): Promise<void> {
    if (request.body) {
      const ids = request.body.ids;
      const removedRuleIds = await this.rulesService.removeRules(ids);
      response.end(JSON.stringify({ ids: removedRuleIds }));
    }
  }

  public async updateRule(
    request: Request<UpdateRuleApi>,
    response: ServerResponse
  ): Promise<void> {
    if (request.body) {
      const updatedRule = await this.rulesService.updateRule(request.body);
      response.end(JSON.stringify(updatedRule ?? {}));
    }
  }
}

diContainer.registerDependencies(RulesController, [RulesService]);

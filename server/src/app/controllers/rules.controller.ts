import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { Rule, NewRule, FilterRuleApi } from 'app/interfaces/rule.interfaces';
import { RulesService } from 'app/services/rules.service';

export class RulesController {
  constructor(private rulesService: RulesService) {}

  public async addRule(request: Request<NewRule>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.rulesService.addRule(request.body);
      response.end('MessageRule added');
    }
  }

  public async getRules(request: Request<FilterRuleApi>, response: ServerResponse): Promise<void> {
    const messageRules = await this.rulesService.getRules(request.body ?? {});
    response.end(JSON.stringify(messageRules));
  }

  public async removeRule(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const ruleId = request.body.id;
      await this.rulesService.removeRule(ruleId);
      response.end('Message rule successfully removed');
    }
  }

  public async updateRule(request: Request<Rule>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.rulesService.updateRule(request.body);
      response.end('Message rule seccessfully updated');
    }
  }
}

diContainer.registerDependencies(RulesController, [RulesService]);
import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { RulesController } from 'app/controllers/rules.controller';
import { validateSchema } from 'app/middlewares/validateSchema';
import { NewRuleSchema, FilterRuleSchema, UpdateRuleSchema } from 'app/schemas/rule.schema';
import { NewRule, FilterRuleApi, UpdateRuleApi } from 'app/interfaces/rule.interfaces';
import { IdsSchema } from 'app/schemas/id.schema';

export class RulesRoutes {
  constructor(
    private router: Router,
    private rulesController: RulesController,
  ) {}

  public registerRoutes(): void {
    this.router.post<FilterRuleApi>('/getRules', [writeHeadJson, parseBody, validateSchema(FilterRuleSchema)], async (req, res) => {
      await this.rulesController.getRules(req, res);
    });

    this.router.post<NewRule>('/addRule', [writeHeadJson, parseBody, validateSchema(NewRuleSchema)], async (req, res) => {
      await this.rulesController.addRule(req, res);
    });

    this.router.post<{ ids: number[] }>('/removeRules', [writeHeadJson, parseBody, validateSchema(IdsSchema)], async (req, res) => {
      await this.rulesController.removeRule(req, res);
    });

    this.router.post<UpdateRuleApi>('/updateRule', [writeHeadJson, parseBody, validateSchema(UpdateRuleSchema)], async (req, res) => {
      await this.rulesController.updateRule(req, res);
    });
  }
}

diContainer.registerDependencies(RulesRoutes, [
  Router,
  RulesController,
]);
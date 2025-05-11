import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { RulesController } from 'app/controllers/rules.controller';
import { validateSchema } from 'app/middlewares/validateSchema';
import { RuleSchema, NewRuleSchema, FilterRuleSchema } from 'app/schemas/rule.schema';
import { Rule, NewRule, FilterRuleApi } from 'app/interfaces/rule.interfaces';
import { IdSchema } from 'app/schemas/id.schema';

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

    this.router.post<{ id: number }>('/removeRule', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.rulesController.removeRule(req, res);
    });

    this.router.post<Rule>('/updateRule', [writeHeadJson, parseBody, validateSchema(RuleSchema)], async (req, res) => {
      await this.rulesController.updateRule(req, res);
    });
  }
}

diContainer.registerDependencies(RulesRoutes, [
  Router,
  RulesController,
]);
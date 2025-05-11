import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { MessageRulesController } from 'app/controllers/message-rules.controller';
import { validateSchema } from 'app/middlewares/validateSchema';
import { MessageRuleSchema, NewMessageRuleSchema } from 'app/schemas/message-rule.schema';
import { MessageRule, NewMessageRule } from 'app/interfaces/rule.interfaces';
import { IdSchema } from 'app/schemas/id.schema';

export class RulesRoutes {
  constructor(
    private router: Router,
    private messageRulesController: MessageRulesController,
  ) {}

  public registerRoutes(): void {
    this.router.get('/getAllMessageRules', [writeHeadJson], async (req, res) => {
      await this.messageRulesController.getAllMessageRules(req, res);
    });

    this.router.post<{ id: number }>('/getMessageRule', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.messageRulesController.getMessageRuleById(req, res);
    });

    this.router.post<NewMessageRule>('/addMessageRule', [writeHeadJson, parseBody, validateSchema(NewMessageRuleSchema)], async (req, res) => {
      await this.messageRulesController.addMessageRule(req, res);
    });

    this.router.post<{ id: number }>('/removeMessageRule', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.messageRulesController.removeMessageRule(req, res);
    });

    this.router.post<MessageRule>('/updateMessageRule', [writeHeadJson, parseBody, validateSchema(MessageRuleSchema)], async (req, res) => {
      await this.messageRulesController.updateMessageRule(req, res);
    });
  }
}

diContainer.registerDependencies(RulesRoutes, [
  Router,
  MessageRulesController,
]);
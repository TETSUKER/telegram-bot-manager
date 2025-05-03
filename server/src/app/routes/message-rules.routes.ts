import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { MessageRulesController } from 'app/controllers/message-rules.controller';

export class MessageRulesRoutes {
  constructor(
    private router: Router,
    private messageRulesController: MessageRulesController,
  ) {}

  public registerRoutes(): void {
    this.router.post('/addMessageRule', [writeHeadJson, parseBody], async (req, res) => {
      this.messageRulesController.addMessageRule(req, res);
    });

    this.router.get('/getAllMessageRules', [writeHeadJson], async (req, res) => {
      this.messageRulesController.getAllMessageRules(req, res);
    });

    this.router.post<{ messageRuleId: number }>('/removeMessageRule', [writeHeadJson, parseBody], async (req, res) => {
      this.messageRulesController.removeMessageRule(req, res);
    });
  }
}

diContainer.registerDependencies(MessageRulesRoutes, [
  Router,
  MessageRulesController,
]);
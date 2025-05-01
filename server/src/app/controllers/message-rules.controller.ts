import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { NewMessageRule } from 'app/interfaces/message-rules-model.interfaces';
import { MessageRulesService } from 'app/services/message-rules.service';

export class MessageRulesController {
  constructor(private messageRulesService: MessageRulesService) {}

  public addMessageRule(request: Request, response: ServerResponse): void {
    if (request.body as NewMessageRule) {
      const newMessageRule = request.body as NewMessageRule;
      this.messageRulesService.addMessageRule(newMessageRule);
      response.end('MessageRule added');
    } else {
      response.end('Provide body');
    }
  }

  public getAllMessageRules(request: Request, response: ServerResponse): void {
    try {
      const messageRules = this.messageRulesService.getAllMessageRules();
      response.end(JSON.stringify(messageRules));
    } catch(err) {
      response.end('Error get rules');
    }
  }

  public removeMessageRule(request: Request<{ messageRuleId: number }>, response: ServerResponse): void {
    try {
      const ruleId = request.body?.messageRuleId as number;
      this.messageRulesService.removeMessageRule(ruleId);
      response.end('Bot successfully removed');
    } catch(err) {
      console.error(err);
      response.end('Unknown error while removing MessageRule');
    }
  }
}

diContainer.registerDependencies(MessageRulesController, [MessageRulesService]);
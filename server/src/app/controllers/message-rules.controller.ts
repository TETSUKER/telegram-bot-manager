import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { MessageRule, NewMessageRule } from 'app/interfaces/message-rules-model.interfaces';
import { MessageRulesService } from 'app/services/message-rules.service';

export class MessageRulesController {
  constructor(private messageRulesService: MessageRulesService) {}

  public async addMessageRule(request: Request<NewMessageRule>, response: ServerResponse): Promise<void> {
    if (request.body) {
      this.messageRulesService.addMessageRule(request.body);
      response.end('MessageRule added');
    }
  }

  public async getAllMessageRules(_: Request, response: ServerResponse): Promise<void> {
    const messageRules = await this.messageRulesService.getAllMessageRules();
    response.end(JSON.stringify(messageRules));
  }

  public async getMessageRuleById(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const messageRule = await this.messageRulesService.getMessageRuleById(request.body.id);
      response.end(JSON.stringify(messageRule));
    }
  }

  public async removeMessageRule(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const ruleId = request.body.id;
      await this.messageRulesService.removeMessageRule(ruleId);
      response.end('Message rule successfully removed');
    }
  }

  public async updateMessageRule(request: Request<MessageRule>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.messageRulesService.updateMessageRule(request.body);
      response.end('Message rule seccessfully updated');
    }
  }
}

diContainer.registerDependencies(MessageRulesController, [MessageRulesService]);
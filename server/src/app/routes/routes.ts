import { diContainer } from 'app/core/di-container';
import { BotsRoutes } from './bots.routes';
import { MessageRulesRoutes } from './message-rules.routes';

export class Routes {
  constructor(
    private telegramRoutes: BotsRoutes,
    private messageRulesRoutes: MessageRulesRoutes,
  ) {}

  public registerRoutes(): void {
    this.telegramRoutes.registerRoutes();
    this.messageRulesRoutes.registerRoutes();
  }
}

diContainer.registerDependencies(Routes, [
  BotsRoutes,
  MessageRulesRoutes,
]);
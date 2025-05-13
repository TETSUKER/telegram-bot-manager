import { diContainer } from 'app/core/di-container';
import { BotsRoutes } from './bots.routes';
import { RulesRoutes } from './rules.routes';
import { ChatsRoutes } from './chats.routes';

export class Routes {
  constructor(
    private telegramRoutes: BotsRoutes,
    private messageRulesRoutes: RulesRoutes,
    private chatsRoutes: ChatsRoutes,
  ) {}

  public registerRoutes(): void {
    this.telegramRoutes.registerRoutes();
    this.messageRulesRoutes.registerRoutes();
    this.chatsRoutes.registerRoutes();
  }
}

diContainer.registerDependencies(Routes, [
  BotsRoutes,
  RulesRoutes,
  ChatsRoutes,
]);
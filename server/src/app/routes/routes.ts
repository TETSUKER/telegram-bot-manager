import { diContainer } from 'app/core/di-container';
import { BotsRoutes } from './bots.routes';
import { RulesRoutes } from './rules.routes';
import { ChatsRoutes } from './chats.routes';
import { JokesRoutes } from './jokes.routes';

export class Routes {
  constructor(
    private telegramRoutes: BotsRoutes,
    private rulesRoutes: RulesRoutes,
    private chatsRoutes: ChatsRoutes,
    private jokesRoutes: JokesRoutes,
  ) {}

  public registerRoutes(): void {
    this.telegramRoutes.registerRoutes();
    this.rulesRoutes.registerRoutes();
    this.chatsRoutes.registerRoutes();
    this.jokesRoutes.registerRoutes();
  }
}

diContainer.registerDependencies(Routes, [
  BotsRoutes,
  RulesRoutes,
  ChatsRoutes,
  JokesRoutes,
]);
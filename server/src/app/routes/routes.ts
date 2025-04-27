import { diContainer } from 'app/core/di-container';
import { BotsRoutes } from './bots.routes';
import { HandlersRoutes } from './handlers.routes';

export class Routes {
  constructor(
    private telegramRoutes: BotsRoutes,
    private handlersRoutes: HandlersRoutes,
  ) {}

  public registerRoutes(): void {
    this.telegramRoutes.registerRoutes();
    this.handlersRoutes.registerRoutes();
  }
}

diContainer.registerDependencies(Routes, [
  BotsRoutes,
  HandlersRoutes,
]);
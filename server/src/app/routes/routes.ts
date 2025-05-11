import { diContainer } from 'app/core/di-container';
import { BotsRoutes } from './bots.routes';
import { RulesRoutes } from './rules.routes';

export class Routes {
  constructor(
    private telegramRoutes: BotsRoutes,
    private messageRulesRoutes: RulesRoutes,
  ) {}

  public registerRoutes(): void {
    this.telegramRoutes.registerRoutes();
    this.messageRulesRoutes.registerRoutes();
  }
}

diContainer.registerDependencies(Routes, [
  BotsRoutes,
  RulesRoutes,
]);
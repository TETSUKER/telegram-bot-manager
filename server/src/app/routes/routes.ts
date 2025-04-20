import { diContainer } from 'app/core/di-container';
import { TelegramRoutes } from './telegram.routes';

export class Routes {
  constructor(
    private telegramRoutes: TelegramRoutes,
  ) {}

  public registerRoutes(): void {
    this.telegramRoutes.registerRoutes();
  }
}

diContainer.registerDependencies(Routes, [TelegramRoutes]);
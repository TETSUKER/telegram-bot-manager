import { diContainer } from 'app/core/di-container';
import { TelegramBot } from 'app/interfaces/telegram.interfaces';

export class TelegramModel {
  private bots: TelegramBot[] = [];

  constructor() {}

  public addBot(bot: TelegramBot): void {
    this.bots.push(bot);
  }

  public getBots(): TelegramBot[] {
    return this.bots;
  }
}

diContainer.registerDependencies(TelegramModel);
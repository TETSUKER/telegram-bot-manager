import { diContainer } from 'app/core/di-container';
import { Handler, NewHandler } from 'app/interfaces/handlers-model.interfaces';
import { generateId } from 'app/utils/generateId';

export class HandlersModel {
  private botHandlers: Handler[] = [
    {
      id: 0,
      name: 'reply',
      reply: {
        message: 'Да',
        text: 'Нет',
      }
    },
    {
      id: 1,
      name: 'reply',
      reply: {
        message: 'Нет',
        text: 'Да',
      }
    },
  ];

  public addBotHandler(botHandler: NewHandler): void {
    const id = generateId(this.botHandlers.map(handler => handler.id));
    this.botHandlers.push({
      ...botHandler,
      id,
    });
  }

  public getBotHandler(id: number): Handler | undefined {
    return this.botHandlers.find(handler => handler.id === id);
  }

  public getAllHandlers(): Handler[] {
    return this.botHandlers;
  }

  public removeBotHandler(id: number): void {
    this.botHandlers = this.botHandlers.filter(botHandler => botHandler.id !== id);
  }

  public getBotHandlers(): Handler[] {
    return this.botHandlers;
  }

  public updateBotHandler(handler: Handler): void {
    this.botHandlers = this.botHandlers.map(dbHandler =>
      dbHandler.id === handler.id ? {...handler} : dbHandler
    );
  }
}

diContainer.registerDependencies(HandlersModel);

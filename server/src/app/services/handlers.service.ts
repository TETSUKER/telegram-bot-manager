import { diContainer } from 'app/core/di-container';
import { Handler, NewHandler } from 'app/interfaces/handlers-model.interfaces';
import { HandlersModel } from 'app/models/handlers.model';
import { UpdatesService } from './updates.service';

export class HandlersService {
  constructor(
    private handlersModel: HandlersModel,
    private updatesService: UpdatesService,
  ) {}

  public addHandler(newHandler: NewHandler): void {
    this.handlersModel.addBotHandler(newHandler);
    this.updatesService.updateCachedHandlers();
  }

  public removeHandler(handlerId: number): void {
    this.handlersModel.removeBotHandler(handlerId);
    this.updatesService.updateCachedHandlers();
  }

  public updateHandler(handler: Handler): void {
    this.handlersModel.updateBotHandler(handler);
    this.updatesService.updateCachedHandlers();
  }

  public getAllHandlers(): Handler[] {
    return this.handlersModel.getAllHandlers();
  }
}

diContainer.registerDependencies(HandlersService, [
  HandlersModel,
  UpdatesService,
]);
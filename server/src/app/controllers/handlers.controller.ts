import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { NewHandler } from 'app/interfaces/handlers-model.interfaces';
import { HandlersService } from 'app/services/handlers.service';

export class HandlersController {
  constructor(private handlersService: HandlersService) {}

  public addHandler(request: Request, response: ServerResponse): void {
    if (request.body as NewHandler) {
      const newHandler = request.body as NewHandler;
      this.handlersService.addHandler(newHandler);
      response.end('Handler added');
    } else {
      response.end('Provide body');
    }
  }

  public getAllHandlers(request: Request, response: ServerResponse): void {
    try {
      const handlers = this.handlersService.getAllHandlers();
      response.end(JSON.stringify(handlers));
    } catch(err) {
      response.end('Error get handlers');
    }
  }

  public removeHandler(request: Request<{ handlerId: number }>, response: ServerResponse): void {
    try {
      const handlerId = request.body?.handlerId as number;
      this.handlersService.removeHandler(handlerId);
      response.end('Bot successfully removed');
    } catch(err) {
      console.error(err);
      response.end('Unknown error while removing handler');
    }
  }
}

diContainer.registerDependencies(HandlersController, [HandlersService]);
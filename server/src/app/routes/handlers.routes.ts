import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { HandlersController } from 'app/controllers/handlers.controller';

export class HandlersRoutes {
  constructor(
    private router: Router,
    private handlersController: HandlersController,
  ) {}

  public registerRoutes(): void {
    this.router.post('/addHandler', [writeHeadJson, parseBody], (req, res) => {
      this.handlersController.addHandler(req, res);
    });

    this.router.get('/getAllHandlers', [writeHeadJson], (req, res) => {
      this.handlersController.getAllHandlers(req, res);
    });

    this.router.post<{ handlerId: number }>('/removeHanlder', [writeHeadJson, parseBody], (req, res) => {
      this.handlersController.removeHandler(req, res);
    });
  }
}

diContainer.registerDependencies(HandlersRoutes, [
  Router,
  HandlersController,
]);
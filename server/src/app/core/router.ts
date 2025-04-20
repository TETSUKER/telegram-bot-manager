import { RequestCallback, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { diContainer } from 'app/core/di-container';
import { Middleware } from 'app/interfaces/middleware.interfaces';

export class Router {
  private readonly routes: Routes = {};

  public get(path: string, middlewares: Middleware[], handler: RequestCallback) {
    this.addRoute(path, 'GET', middlewares, handler);
  }

  public post(path: string, middlewares: Middleware[], handler: RequestCallback) {
    this.addRoute(path, 'POST', middlewares, handler);
  }

  private addRoute(
    path: string,
    method: RequestMethod,
    middlewares: Middleware[],
    handler: RequestCallback,
  ): void {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }

    if (this.routes[path][method]) {
      throw new Error(`${method} with path: ${path} already exist.`);
    }

    this.routes[path][method] = {
      middlewares: middlewares,
      callback: handler,
    };
  }

  public getRoutes(): Routes {
    return this.routes;
  }
}

diContainer.registerDependencies(Router);

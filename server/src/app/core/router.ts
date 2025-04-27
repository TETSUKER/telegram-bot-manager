import { RequestCallback, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { diContainer } from 'app/core/di-container';
import { Middleware } from 'app/interfaces/middleware.interfaces';

export class Router {
  private readonly routes: Routes = {};

  public get(path: string, middlewares: Middleware[], handler: RequestCallback<null>) {
    this.addRoute(path, 'GET', middlewares, handler);
  }

  public post<T>(path: string, middlewares: Middleware[], handler: RequestCallback<T>) {
    this.addRoute<T>(path, 'POST', middlewares, handler);
  }

  private addRoute<T>(
    path: string,
    method: RequestMethod,
    middlewares: Middleware[],
    handler: RequestCallback<T>,
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

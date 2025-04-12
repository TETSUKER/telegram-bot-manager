import { RequestCallback, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { diContainer } from './di-container';

export class Router {
  private readonly _routes: Routes = {};

  constructor() {}

  get routes() {
    return this._routes;
  }

  get(path: string, handler: RequestCallback) {
    this.addRoute(path, 'GET', handler);
  }

  post(path: string, handler: RequestCallback) {
    this.addRoute(path, 'POST', handler);
  }

  private addRoute(path: string, method: RequestMethod, handler: RequestCallback): void {
    if (!this._routes[path]) {
      this._routes[path] = {};
    }

    if (this._routes[path][method]) {
      throw new Error(`${method} with path: ${path} already exist.`);
    }

    this._routes[path][method] = handler;
  }
}

diContainer.registerDependencies(Router);

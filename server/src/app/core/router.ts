import { ServerResponse } from 'node:http';
import { Request, RequestCallback, RequestMethod } from 'app/interfaces/http.interfaces';
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

  public async handleRequest(req: Request, res: ServerResponse): Promise<void> {
    const fullUrl = this.getFullUrl(req);
    const parsedUrl = new URL(fullUrl);

    if (!this.routes[parsedUrl.pathname]) {
      res.statusCode = 404;
      res.end(`Path: ${parsedUrl.pathname} doesn't exist.`);
      return;
    }

    if (!this.routes[parsedUrl.pathname][req.method as RequestMethod]) {
      res.statusCode = 404;
      res.end(`${req.method} with path: ${parsedUrl.pathname} doesn't exist.`);
      return;
    }

    const route = this.routes[parsedUrl.pathname][req.method as RequestMethod];

    if (route?.callback) {
      await this.runMiddlewareChain(route.middlewares, req, res);
      return route.callback(req, res);
    } else {
      throw new Error(`Handler for ${req.method} with path: ${parsedUrl.pathname} doesn't exist.`)
    }
  }

  private async runMiddlewareChain(middlewares: Middleware[], req: Request, res: ServerResponse): Promise<void> {
    const middlewareChain = async (index: number) => {
      if (index >= middlewares.length) {
        return;
      }
      await middlewares[index](req, res, () => middlewareChain(index + 1));
    }

    await middlewareChain(0);
  }

  private getFullUrl(req: Request): string {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const path = req.url;

    return `${protocol}://${host}${path}`;
  }
}

diContainer.registerDependencies(Router);

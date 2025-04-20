import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { diContainer } from 'app/core/di-container';
import { Request, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { Middleware } from 'app/interfaces/middleware.interfaces';

export class Http {
  private httpServer: Server = new Server();
  private routes: Routes = {};

  constructor() {
    this.httpServer = this.getServer();
  }

  private getServer(): Server {
    return createServer(async (req: IncomingMessage, res: ServerResponse) => {
      this.handleRequest(req as Request, res);
    });
  }

  public listen(port: number, hostname: string, callback: () => void): void {
    this.httpServer.listen(port, hostname, callback);
  }

  public setRoutes(routes: Routes): void {
    this.routes = routes;
  }

  private async handleRequest(req: Request, res: ServerResponse): Promise<void> {
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

diContainer.registerDependencies(Http);

import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { diContainer } from 'app/core/di-container';
import { Request, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { Middleware } from 'app/interfaces/middleware.interfaces';
import { getFullUrl } from 'app/utils/getFullUrl';

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
    const fullUrl = getFullUrl(req);
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
      try {
        await this.runMiddlewareChain(route.middlewares, req, res);
      } catch(err) {
        res.end(`Error: ${err}`);
        return;
      }

      return route.callback(req, res);
    } else {
      throw new Error(`Handler for ${req.method} with path: ${parsedUrl.pathname} doesn't exist.`)
    }
  }

  private async runMiddlewareChain(middlewares: Middleware[], req: Request, res: ServerResponse): Promise<void> {
    const dispatch = async (index: number): Promise<void> => {
      if (index >= middlewares.length) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const next = (err?: any) => {
          if (err) {
            return reject(err);
          }
          resolve();
        };

        try {
          const result = middlewares[index](req, res, next);

          if (result instanceof Promise) {
            result.catch(reject);
          }
        } catch(err) {
          reject(err);
        }
      });

      await dispatch(index + 1);
    };

    await dispatch(0);
  }
}

diContainer.registerDependencies(Http);

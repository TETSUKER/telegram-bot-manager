import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { diContainer } from 'app/core/di-container';
import { Request, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { Middleware } from 'app/interfaces/middleware.interfaces';
import { getFullUrl } from 'app/utils/getFullUrl';
import { AddressInfo } from 'node:net';
import { ApiError } from 'app/errors/api.error';

export class Http {
  private httpServer: Server;
  private routes: Routes = {};

  constructor() {
    this.httpServer = this.getServer();
  }

  private getServer(): Server {
    return createServer((req: IncomingMessage, res: ServerResponse) => {
      this.handleRequest(req as Request, res);
    });
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

      try {
        await route.callback(req, res);
      } catch(err) {
        this.handleError(err as ApiError, res);
      }
    } else {
      throw new Error(`Handler for ${req.method} with path: ${parsedUrl.pathname} doesn't exist.`)
    }
  }

  private handleError(err: ApiError, res: ServerResponse): void {
    res.statusCode = err.statusCode;
    res.end(JSON.stringify({
      error: {
        message: err.message,
        details: err.details,
        timestamp: err.timestamp,
      }
    }));
  }

  private async runMiddlewareChain(middlewares: Middleware[], req: Request, res: ServerResponse): Promise<void> {
    const dispatch = async (index: number = 0): Promise<void> => {
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

    await dispatch();
  }

  public listen(port: number, hostname: string, callback: () => void): void {
    console.log('Starting server...');
    this.httpServer.listen(port, hostname, () => {
      callback();
      const addr = this.httpServer.address() as AddressInfo;
      console.log(`Server running at http://${addr.address}:${addr.port}`);
    });
  }

  public setRoutes(routes: Routes): void {
    this.routes = routes;
  }
}

diContainer.registerDependencies(Http);

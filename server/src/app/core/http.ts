import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { diContainer } from 'app/core/di-container';
import { Request, RequestMethod } from 'app/interfaces/http.interfaces';
import { Routes } from 'app/interfaces/router.interfaces';
import { Middleware } from 'app/interfaces/middleware.interfaces';
import { getFullUrl } from 'app/utils/getFullUrl';
import { AddressInfo } from 'node:net';
import { ApiError } from 'app/errors/api.error';
import { Logger } from './logger';
import { ServerApiError } from 'app/errors/server.error';
import { Dotenv } from './dotenv';
import { NotFoundError } from 'app/errors/not-found.error';

export class Http {
  private httpServer: Server;
  private routes: Routes = {};

  constructor(
    private logger: Logger,
    private dotenv: Dotenv,
  ) {
    this.httpServer = this.getServer();
  }

  private getServer(): Server {
    return createServer((req: IncomingMessage, res: ServerResponse) => {
      this.setCors(req, res);
      this.handleRequest(req as Request, res);
    });
  }

  private setCors(request: IncomingMessage, response: ServerResponse): void {
    const host = this.dotenv.environments.HOST;
    const allowedOrigins = [`http://${host}`, `http://${host}:3000`];
    const origin = request.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
    }
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  private async handleRequest(req: Request, res: ServerResponse): Promise<void> {
    const fullUrl = getFullUrl(req);
    const parsedUrl = new URL(fullUrl);
    const routePath = this.routes[parsedUrl.pathname];

    if (routePath === undefined) {
      const error = new NotFoundError(`Path: ${parsedUrl.pathname} doesn't exist.`);
      this.handleError(error, res);
      return;
    }

    if (routePath[req.method as RequestMethod] === undefined) {
      const error = new NotFoundError(`${req.method} with path: ${parsedUrl.pathname} doesn't exist.`);
      this.handleError(error, res);
      return;
    }

    const route = routePath[req.method as RequestMethod];

    if (route?.callback) {
      try {
        await this.runMiddlewareChain(route.middlewares, req, res);
        await route.callback(req, res);
      } catch(err) {
        this.handleError(err as ApiError, res);
      }
    } else {
      const error = new NotFoundError(`Handler for ${req.method} with path: ${parsedUrl.pathname} doesn't exist.`);
      this.handleError(error, res);
    }
  }

  private handleError(err: ApiError, res: ServerResponse): void {
    res.statusCode = err.statusCode;
    res.setHeader('Content-Type', 'application/json');
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
        const next = (err?: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve();
        };

        try {
          const middleware = middlewares[index];
          if (middleware === undefined) {
            throw new ServerApiError('Middleware is undefined');
          }

          const result = middleware(req, res, next);
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

  public listen(callback: () => void): void {
    this.logger.infoLog('Starting server...');
    this.httpServer.listen(3020, () => {
      callback();
      const addr = this.httpServer.address() as AddressInfo;
      this.logger.successfulLog(`Server running at http://${addr.address}:${addr.port}`);
    });
  }

  public setRoutes(routes: Routes): void {
    this.routes = routes;
  }
}

diContainer.registerDependencies(Http, [
  Logger,
  Dotenv,
]);

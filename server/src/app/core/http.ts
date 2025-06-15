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

export class Http {
  private httpServer: Server;
  private routes: Routes = {};

  constructor(private logger: Logger) {
    this.httpServer = this.getServer();
  }

  private getServer(): Server {
    return createServer((req: IncomingMessage, res: ServerResponse) => {
      this.setCors(res);
      this.handleRequest(req as Request, res);
    });
  }

  private setCors(response: ServerResponse): void {
    const addressInfo = this.httpServer.address() as AddressInfo;
    response.setHeader('Access-Control-Allow-Origin', `http://${addressInfo.address}:${3000}`); // Разрешаем запросы с любого origin
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Разрешаем методы
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  private async handleRequest(req: Request, res: ServerResponse): Promise<void> {
    const fullUrl = getFullUrl(req);
    const parsedUrl = new URL(fullUrl);
    const routePath = this.routes[parsedUrl.pathname];

    if (routePath === undefined) {
      res.statusCode = 404;
      res.end(`Path: ${parsedUrl.pathname} doesn't exist.`);
      return;
    }

    if (routePath[req.method as RequestMethod] === undefined) {
      res.statusCode = 404;
      res.end(`${req.method} with path: ${parsedUrl.pathname} doesn't exist.`);
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
      throw new Error(`Handler for ${req.method} with path: ${parsedUrl.pathname} doesn't exist.`);
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

  public listen(port: number, hostname: string, callback: () => void): void {
    this.logger.infoLog('Starting server...');
    this.httpServer.listen(port, hostname, () => {
      callback();
      const addr = this.httpServer.address() as AddressInfo;
      this.logger.successfulLog(`Server running at http://${addr.address}:${addr.port}`);
    });
  }

  public setRoutes(routes: Routes): void {
    this.routes = routes;
  }
}

diContainer.registerDependencies(Http, [Logger]);

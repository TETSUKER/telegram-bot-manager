import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { Routes } from 'app/interfaces/router.interfaces';
import { RequestMethod } from 'app/interfaces/http.interfaces';
import { diContainer } from './di-container';

export class Http {
  private httpServer: Server;
  private routes: Routes = {};

  constructor() {
    this.httpServer = this.getServer();
  }

  private getServer(): Server {
    return createServer((req: IncomingMessage, res: ServerResponse) => {
      const fullUrl = this.getFullUrl(req);
      const parsedUrl = new URL(fullUrl);

      const handler = this.routes[parsedUrl.pathname][req.method as RequestMethod];

      if (handler) {
        handler(req, res);
      }
    });
  }

  private getFullUrl(req: IncomingMessage): string {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const path = req.url;

    return `${protocol}://${host}${path}`;
  }

  public listen(port: number, hostname: string, callback: () => void): void {
    this.httpServer.listen(port, hostname, callback);
  }

  public setRoutes(routes: Routes): void {
    this.routes = routes;
  }
}

diContainer.registerDependencies(Http);

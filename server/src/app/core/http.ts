import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { Request } from 'app/interfaces/http.interfaces';

export class Http {
  private httpServer: Server = new Server();

  constructor(private router: Router) {
    this.httpServer = this.getServer();
  }

  private getServer(): Server {
    return createServer(async (req: IncomingMessage, res: ServerResponse) => {
      this.router.handleRequest(req as Request, res);
    });
  }

  public listen(port: number, hostname: string, callback: () => void): void {
    this.httpServer.listen(port, hostname, callback);
  }
}

diContainer.registerDependencies(Http, [Router]);

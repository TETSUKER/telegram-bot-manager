import { diContainer } from './core/di-container.js';
import { Http } from './core/http.js';
import { Router } from './core/router.js';

export class App {
  constructor(
    private http: Http,
    private router: Router,
  ) {
    this.router.get('/users', (_, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('GET Users');
    });

    this.router.post('/users', (_, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('POST Users');
    });
  }

  start() {
    this.http.listen(3000, 'localhost', () => {
      this.http.setRoutes(this.router.routes);
    });
  }
}

diContainer.registerDependencies(App, [Http, Router]);

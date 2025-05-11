import { diContainer } from 'app/core/di-container';
import { Http } from 'app/core/http';
import { Routes } from 'app/routes/routes';
import { Router } from 'app/core/router';
import { Dotenv } from './core/dotenv';

export class App {
  constructor(
    private http: Http,
    private router: Router,
    private routes: Routes,
    private dotenv: Dotenv,
  ) {}

  start() {
    const host = this.dotenv.environments.HOST;
    const port = Number(this.dotenv.environments.PORT);

    this.http.listen(port, host, () => {
      this.routes.registerRoutes();
      this.http.setRoutes(this.router.getRoutes());
    });
  }
}

diContainer.registerDependencies(App, [
  Http,
  Router,
  Routes,
  Dotenv,
]);

import { diContainer } from 'app/core/di-container';
import { Http } from 'app/core/http';
import { Routes } from 'app/routes/routes';
import { Router } from 'app/core/router';

export class App {
  constructor(
    private http: Http,
    private router: Router,
    private routes: Routes,
  ) {}

  start() {
    const port = Number(process.env.PORT);

    this.http.listen(port, 'localhost', () => {
      this.routes.registerRoutes();
      this.http.setRoutes(this.router.getRoutes());
      console.log(`Http server on PORT: ${port} started`);
    });
  }
}

diContainer.registerDependencies(App, [Http, Router, Routes]);

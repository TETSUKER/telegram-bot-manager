import { diContainer } from 'app/core/di-container';
import { Http } from 'app/core/http';
import { Routes } from './routes/routes';

export class App {
  constructor(
    private http: Http,
    private routes: Routes,
  ) {
    this.routes.registerRoutes();
  }

  start() {
    this.http.listen(Number(process.env.PORT), 'localhost', () => {
      console.log(`Http server started`);
    });
  }
}

diContainer.registerDependencies(App, [Http, Routes]);

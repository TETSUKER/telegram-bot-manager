import { diContainer } from 'app/core/di-container.js';
import { Http } from 'app/core/http.js';
import { Router } from 'app/core/router.js';
import { parseBody } from 'app/middlewares/parseBody.js';
import { writeHeadJson } from 'app/middlewares/writeHeadJson.js';

export class App {
  constructor(
    private http: Http,
    private router: Router,
  ) {
    this.router.get('/users', [writeHeadJson], (_, res) => {
      res.end(JSON.stringify({
        user: 'Roman',
        password: '123',
      }));
    });

    this.router.post('/users', [writeHeadJson, parseBody], (_, res) => {
      res.end('POST Users');
    });
  }

  start() {
    this.http.listen(3000, 'localhost', () => {
      console.log(`Server started`);
    });
  }
}

diContainer.registerDependencies(App, [Http, Router]);

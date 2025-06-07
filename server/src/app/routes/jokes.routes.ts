import { JokesController } from 'app/controllers/jokes.controller';
import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { FilterJokeApi, NewJoke, UpdateJokeApi } from 'app/interfaces/joke.interfaces';
import { parseBody } from 'app/middlewares/parseBody';
import { validateSchema } from 'app/middlewares/validateSchema';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { IdsSchema } from 'app/schemas/id.schema';
import { FilterJokeSchema, NewJokeSchema, UpdateJokeSchema } from 'app/schemas/joke.schema';

export class JokesRoutes {
  constructor(
    private router: Router,
    private jokesController: JokesController,
  ) {}

  public registerRoutes(): void {
    this.router.post<FilterJokeApi>('/getJokes', [writeHeadJson, parseBody, validateSchema(FilterJokeSchema)], async (req, res) => {
      await this.jokesController.getJokes(req, res);
    });

    this.router.post<NewJoke>('/addJoke', [writeHeadJson, parseBody, validateSchema(NewJokeSchema)], async (req, res) => {
      await this.jokesController.addJoke(req, res);
    });

    this.router.post<{ ids: number[] }>('/removeJokes', [writeHeadJson, parseBody, validateSchema(IdsSchema)], async (req, res) => {
      await this.jokesController.removeJokes(req, res);
    });

    this.router.post<UpdateJokeApi>('/updateJoke', [writeHeadJson, parseBody, validateSchema(UpdateJokeSchema)], async (req, res) => {
      await this.jokesController.updateJoke(req, res);
    });
  }
}

diContainer.registerDependencies(JokesRoutes, [
  Router,
  JokesController,
]);

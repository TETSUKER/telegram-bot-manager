import { diContainer } from 'app/core/di-container';
import { JokesService } from 'app/services/jokes.service';
import { Request } from 'app/interfaces/http.interfaces';
import { ServerResponse } from 'http';
import { FilterJokeApi, NewJoke, UpdateJokeApi } from 'app/interfaces/joke.interfaces';

export class JokesController {
  constructor(
    private jokesService: JokesService,
  ) {}

  public async getJokes(request: Request<FilterJokeApi>, response: ServerResponse): Promise<void> {
    const jokes = await this.jokesService.getJokes(request.body ?? {});
    response.end(JSON.stringify(jokes));
  }

  public async addJoke(request: Request<NewJoke>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const addedJoke = await this.jokesService.addJoke(request.body);
      response.end(JSON.stringify(addedJoke ?? {}));
    }
  }

  public async removeJokes(request: Request<{ ids: number[] }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const ids = request.body.ids;
      const removedJokesIds = await this.jokesService.removeJokes(ids);
      response.end(JSON.stringify({ids: removedJokesIds}));
    }
  }

  public async updateJoke(request: Request<UpdateJokeApi>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const updatedJoke = await this.jokesService.updateJoke(request.body);
      response.end(JSON.stringify(updatedJoke ?? {}));
    }
  }
}

diContainer.registerDependencies(JokesController, [
  JokesService,
]);
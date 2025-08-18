import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { BotsService } from 'app/services/bots.service';
import { FilterBotApi, UpdateBotApi } from 'app/interfaces/bot.interfaces';

export class BotsController {
  constructor(private botsService: BotsService) {}

  public async addBot(request: Request<{ token: string }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const addedBot = await this.botsService.addBot(request.body.token);
      response.end(JSON.stringify(addedBot ?? {}));
    }
  }

  public async removeBots(request: Request<{ ids: number[] }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const removedBotsIds = await this.botsService.removeBot(request.body.ids);
      response.end(JSON.stringify({ids: removedBotsIds}));
    }
  }

  public async getBots(request: Request<FilterBotApi>, response: ServerResponse): Promise<void> {
    const bots = await this.botsService.getBots(request.body ?? {});
    response.end(JSON.stringify(bots));
  }

  public async updateBot(request: Request<UpdateBotApi>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const updatedBot = await this.botsService.updateBot(request.body);
      response.end(JSON.stringify(updatedBot ?? {}));
    }
  }
}

diContainer.registerDependencies(BotsController, [BotsService]);
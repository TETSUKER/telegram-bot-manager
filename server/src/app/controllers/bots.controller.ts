import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { BotsService } from 'app/services/bots.service';
import { FilterBotApi, UpdateBotApi } from 'app/interfaces/bot.interfaces';

export class BotsController {
  constructor(private botsService: BotsService) {}

  public async addBot(request: Request<{ token: string }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.botsService.addBot(request.body.token);
      response.end('Bot added');
    }
  }

  public async removeBot(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.botsService.removeBot(request.body.id);
      response.end('Bot successfully removed');
    }
  }

  public async getBots(request: Request<FilterBotApi>, response: ServerResponse): Promise<void> {
    const bots = await this.botsService.getBots(request.body ?? {});
    response.end(JSON.stringify(bots));
  }

  public async updateBot(request: Request<UpdateBotApi>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.botsService.updateBot(request.body);
      response.end('Bot succesfully updated');
    }
  }
}

diContainer.registerDependencies(BotsController, [BotsService]);
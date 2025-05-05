import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { BotsService } from 'app/services/bots.service';
import { Bot } from 'app/interfaces/bot-model.interfaces';

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

  public async getBotInfo(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const botInfo = await this.botsService.getBotInfo(request.body.id);
      response.end(JSON.stringify(botInfo));
    }
  }

  public async getAllBots(_: Request, response: ServerResponse): Promise<void> {
    const bots = await this.botsService.getAllBots();
    response.end(JSON.stringify(bots));
  }

  public async getBotById(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const bot = await this.botsService.getBotById(request.body.id);
      response.end(JSON.stringify(bot));
    }
  }

  public async updateBot(request: Request<Bot>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.botsService.updateBot(request.body);
      response.end('Bot succesfully updated');
    }
  }
}

diContainer.registerDependencies(BotsController, [BotsService]);
import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { BotsService } from 'app/services/bots.service';

export class BotsController {
  constructor(private botsService: BotsService) {}

  public async addBot(request: Request<{ token: string }>, response: ServerResponse): Promise<void> {
    const token = request.body?.token as string;

    if (token) {
      this.botsService.addBot(token);
      response.end('Bot added');
    } else {
      response.end('Provide token');
    }
  }

  public removeBot(request: Request<{ botId: number }>, response: ServerResponse): void {
    try {
      const botId = request.body?.botId as number;
      this.botsService.removeBot(botId);
      response.end('Bot successfully removed');
    } catch(err) {
      console.error(err);
      response.end('Unknown error while removing bot');
    }
  }

  public async getBotInfo(request: Request, response: ServerResponse): Promise<void> {
    const botId = Number(request?.params?.id);

    if (botId) {
      const botInfo = await this.botsService.getBotInfo(botId);
      response.end(JSON.stringify(botInfo));
    } else {
      response.end('No id provided');
    }
  }

  public getAllBots(_: Request, response: ServerResponse): void {
    try {
      const bots = this.botsService.getBots();
      response.end(JSON.stringify(bots));
    } catch(err) {
      console.error(err);
      response.end('Error get bots');
    }
  }
}

diContainer.registerDependencies(BotsController, [BotsService]);
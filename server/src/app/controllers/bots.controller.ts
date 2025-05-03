import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { BotsService } from 'app/services/bots.service';
import { ValidationError } from 'app/errors/validation.error';

export class BotsController {
  constructor(private botsService: BotsService) {}

  public async addBot(request: Request<{ token: string }>, response: ServerResponse): Promise<void> {
    const token = request.body?.token;

    if (token) {
      try {
        await this.botsService.addBot(token);
        response.end('Bot added');
      } catch(err) {
        throw err;
      }
    } else {
      throw new ValidationError('Token are required', {
        fields: { token: !!token }
      });
    }
  }

  public async removeBot(request: Request<{ botId: number }>, response: ServerResponse): Promise<void> {
    const botId = request.body?.botId;

    if (typeof botId === 'number') {
      try {
        await this.botsService.removeBot(botId);
        response.end('Bot successfully removed');
      } catch(err) {
        throw err;
      }
    } else {
      throw new ValidationError('botId are required', {
        fields: { botId: !!botId }
      });
    }
  }

  public async getBotInfo(request: Request, response: ServerResponse): Promise<void> {
    const botId = Number(request?.params?.id);

    if (typeof botId === 'number') {
      try {
        const botInfo = await this.botsService.getBotInfo(botId);
        response.end(JSON.stringify(botInfo));
      } catch(err) {
        throw err;
      }
    } else {
      throw new ValidationError('id parameter are required');
    }
  }

  public async getAllBots(_: Request, response: ServerResponse): Promise<void> {
    try {
      const bots = await this.botsService.getBots();
      response.end(JSON.stringify(bots));
    } catch(err) {
      throw err;
    }
  }
}

diContainer.registerDependencies(BotsController, [BotsService]);
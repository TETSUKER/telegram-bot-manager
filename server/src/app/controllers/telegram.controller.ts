import { ServerResponse } from 'http';
import { diContainer } from 'app/core/di-container';
import { Request } from 'app/interfaces/http.interfaces';
import { TelegramModel } from 'app/models/telegram.model';
import { TelegramService } from 'app/services/telegram.service';

export class TelegramController {
  constructor(
    private telegramService: TelegramService,
    private telegramModel: TelegramModel
  ) {}

  public async addBot(request: Request, response: ServerResponse): Promise<void> {
    const token = request.body?.token as string;

    if (token) {
      const botInfo = await this.telegramService.getBotInfo(token);
      const bot = this.telegramModel.getBots().filter(bot => bot.username === botInfo.username)[0];

      if (bot) {
        response.end('Bot already exist');
      } else {
        this.telegramModel.addBot({ ...botInfo, token });
        response.end('Bot added');
      }
    } else {
      response.end('Provide token');
    }
  }

  public async getBotInfo(request: Request, response: ServerResponse): Promise<void> {
    const botToken = request?.params?.token;
    if (botToken) {
      const botInfo = await this.telegramService.getBotInfo(botToken);
      response.end(JSON.stringify(botInfo));
    } else {
      response.end('No token provided');
    }
  }
}

diContainer.registerDependencies(TelegramController, [TelegramService, TelegramModel]);
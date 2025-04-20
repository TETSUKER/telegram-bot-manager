import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { TelegramUpdatesHandler } from 'app/services/handle-telegram-updates.service';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';

export class TelegramRoutes {
  private readonly chatIdPrefix = -100;
  private readonly botToken = process.env.BOT_TOKEN || '';

  constructor(
    private router: Router,
    private telegramHttpsApi: TelegramHttpsApi,
    private telegramUpdatesHandler: TelegramUpdatesHandler,
  ) {}

  public registerRoutes(): void {
    this.router.get('/sendMessage', [writeHeadJson], async (req, res) => {
      const chatId = Number(`${this.chatIdPrefix}${2632412723}`);
      this.telegramHttpsApi.sendTextMessage(this.botToken, chatId, 'Hello JOPA')
        .then(response => res.end(JSON.stringify(response)))
        .catch(err => res.end(err));
    });

    this.router.post('/startPolling', [writeHeadJson, parseBody], (_, res) => {
      this.telegramUpdatesHandler.startPolling();
      res.end('Polling started');
    });

    this.router.post('/stopPolling', [writeHeadJson, parseBody], (_, res) => {
      this.telegramUpdatesHandler.stopPolling();
      res.end('Polling stopped');
    });
  }
}

diContainer.registerDependencies(TelegramRoutes, [Router, TelegramHttpsApi, TelegramUpdatesHandler]);
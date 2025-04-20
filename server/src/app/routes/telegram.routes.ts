import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { TelegramService } from 'app/services/telegram.service';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { TelegramController } from 'app/controllers/telegram.controller';
import { parseParams } from 'app/middlewares/parseParams';

export class TelegramRoutes {
  private readonly chatIdPrefix = -100;
  private readonly botToken = process.env.BOT_TOKEN || '';

  constructor(
    private router: Router,
    private telegramService: TelegramService,
    private telegramController: TelegramController,
  ) {}

  public registerRoutes(): void {
    this.router.get('/sendMessage', [writeHeadJson], async (req, res) => {
      const chatId = Number(`${this.chatIdPrefix}${2632412723}`);
      this.telegramService.sendTextMessage(this.botToken, chatId, 'Hello JOPA')
        .then(response => res.end(JSON.stringify(response)))
        .catch(err => res.end(err));
    });

    this.router.post('/startPolling', [writeHeadJson, parseBody], (_, res) => {
      this.telegramService.startPolling();
      res.end('Polling started');
    });

    this.router.post('/stopPolling', [writeHeadJson, parseBody], (_, res) => {
      this.telegramService.stopPolling();
      res.end('Polling stopped');
    });

    this.router.post('/addBot', [writeHeadJson, parseBody], (req, res) => {
      this.telegramController.addBot(req, res);
    });

    this.router.get('/getBotInfo', [parseParams, writeHeadJson], async (req, res) => {
      this.telegramController.getBotInfo(req, res);
    });
  }
}

diContainer.registerDependencies(TelegramRoutes, [
  Router,
  TelegramService,
  TelegramController,
]);
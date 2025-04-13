import { diContainer } from 'app/core/di-container';
import { Http } from 'app/core/http';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { TelegramUpdatesHandler } from 'app/handle-telegram-updates';

export class App {
  private readonly chatIdPrefix = -100;

  constructor(
    private http: Http,
    private router: Router,
    private telegramHttpsApi: TelegramHttpsApi,
    private telegramUpdatesHandler: TelegramUpdatesHandler,
  ) {
    this.router.get('/users', [writeHeadJson], (_, res) => {
      res.end(JSON.stringify({
        user: 'Roman',
        password: '123',
      }));
    });

    this.router.post('/users', [writeHeadJson, parseBody], (_, res) => {
      res.end('POST Users');
    });

    this.router.get('/sendMessage', [writeHeadJson], async (req, res) => {
      const chatId = Number(`${this.chatIdPrefix}${2632412723}`);
      const response = await this.telegramHttpsApi.sendTextMessage(chatId, 'Hello JOPA');
      res.end(JSON.stringify(response));
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

  start() {
    this.http.listen(Number(process.env.PORT), 'localhost', () => {
      console.log(`Http server started`);
    });
  }
}

diContainer.registerDependencies(App, [Http, Router, TelegramHttpsApi, TelegramUpdatesHandler]);

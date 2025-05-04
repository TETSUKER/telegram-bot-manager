import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { BotsController } from 'app/controllers/bots.controller';
import { validateSchema } from 'app/middlewares/validateSchema';
import { TokenSchema } from 'app/schemas/token.schema';
import { IdSchema } from 'app/schemas/id.schema';
import { Bot } from 'app/interfaces/bot-model.interfaces';
import { BotSchema } from 'app/schemas/bot.schema';

export class BotsRoutes {
  constructor(
    private router: Router,
    private botsController: BotsController,
  ) {}

  public registerRoutes(): void {
    this.router.get('/getAllBots', [writeHeadJson], async (req, res) => {
      await this.botsController.getAllBots(req, res);
    });

    this.router.post<{ id: number }>('/getBot', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.botsController.getBotById(req, res);
    });

    this.router.post<{ token: string }>('/addBot', [writeHeadJson, parseBody, validateSchema(TokenSchema)], async (req, res) => {
      await this.botsController.addBot(req, res);
    });

    this.router.post<{ id: number }>('/removeBot', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.botsController.removeBot(req, res);
    });

    this.router.post<{ id: number }>('/getBotInfo', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.botsController.getBotInfo(req, res);
    });

    this.router.post<Bot>('/updateBot', [writeHeadJson, parseBody, validateSchema(BotSchema)], async (req, res) => {
      await this.botsController.updateBot(req, res);
    });
  }
}

diContainer.registerDependencies(BotsRoutes, [
  Router,
  BotsController,
]);
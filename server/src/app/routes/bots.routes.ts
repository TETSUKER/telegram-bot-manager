import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { BotsController } from 'app/controllers/bots.controller';
import { validateSchema } from 'app/middlewares/validateSchema';
import { IdSchema } from 'app/schemas/id.schema';
import { NewBotSchema, UpdateBotSchema } from 'app/schemas/bot.schema';
import { UpdateBotApi } from 'app/interfaces/bot.interfaces';

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

    this.router.post<{ token: string }>('/addBot', [writeHeadJson, parseBody, validateSchema(NewBotSchema)], async (req, res) => {
      await this.botsController.addBot(req, res);
    });

    this.router.post<{ id: number }>('/removeBot', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.botsController.removeBot(req, res);
    });

    this.router.post<UpdateBotApi>('/updateBot', [writeHeadJson, parseBody, validateSchema(UpdateBotSchema)], async (req, res) => {
      await this.botsController.updateBot(req, res);
    });
  }
}

diContainer.registerDependencies(BotsRoutes, [
  Router,
  BotsController,
]);
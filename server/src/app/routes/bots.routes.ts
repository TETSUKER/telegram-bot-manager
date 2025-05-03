import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { parseBody } from 'app/middlewares/parseBody';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { BotsController } from 'app/controllers/bots.controller';
import { parseParams } from 'app/middlewares/parseParams';

export class BotsRoutes {
  constructor(
    private router: Router,
    private botsController: BotsController,
  ) {}

  public registerRoutes(): void {
    this.router.post<{ token: string }>('/addBot', [writeHeadJson, parseBody], async (req, res) => {
      await this.botsController.addBot(req, res);
    });

    this.router.post<{ botId: number }>('/removeBot', [writeHeadJson, parseBody], async (req, res) => {
      await this.botsController.removeBot(req, res);
    });

    this.router.get('/getBotInfo', [parseParams, writeHeadJson], async (req, res) => {
      await this.botsController.getBotInfo(req, res);
    });

    this.router.get('/getAllBots', [parseParams, writeHeadJson], async (req, res) => {
      await this.botsController.getAllBots(req, res);
    });
  }
}

diContainer.registerDependencies(BotsRoutes, [
  Router,
  BotsController,
]);
import { ChatsController } from 'app/controllers/chats.controller';
import { diContainer } from 'app/core/di-container';
import { Router } from 'app/core/router';
import { FilterChatApi, NewChatApi, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { parseBody } from 'app/middlewares/parseBody';
import { validateSchema } from 'app/middlewares/validateSchema';
import { writeHeadJson } from 'app/middlewares/writeHeadJson';
import { FilterChatSchema, NewChatSchema, UpdateChatSchema } from 'app/schemas/chat.schema';
import { IdSchema } from 'app/schemas/id.schema';

export class ChatsRoutes {
  constructor(
    private router: Router,
    private chatsController: ChatsController,
  ) {}

  public registerRoutes(): void {
    this.router.post<FilterChatApi>('/getChats', [writeHeadJson, parseBody, validateSchema(FilterChatSchema)], async (req, res) => {
      await this.chatsController.getChats(req, res);
    });

    this.router.post<NewChatApi>('/addChat', [writeHeadJson, parseBody, validateSchema(NewChatSchema)], async (req, res) => {
      await this.chatsController.addChat(req, res);
    });

    this.router.post<{ id: number }>('/removeChat', [writeHeadJson, parseBody, validateSchema(IdSchema)], async (req, res) => {
      await this.chatsController.removeChat(req, res);
    });

    this.router.post<UpdateChatApi>('/updateChat', [writeHeadJson, parseBody, validateSchema(UpdateChatSchema)], async (req, res) => {
      await this.chatsController.updateChat(req, res);
    });
  }
}

diContainer.registerDependencies(ChatsRoutes, [
  Router,
  ChatsController,
]);

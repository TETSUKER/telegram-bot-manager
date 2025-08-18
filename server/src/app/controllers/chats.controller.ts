import { diContainer } from 'app/core/di-container';
import { FilterChatApi, NewChatApi, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { ChatsService } from 'app/services/chats.service';
import { Request } from 'app/interfaces/http.interfaces';
import { ServerResponse } from 'http';

export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  public async getChats(request: Request<FilterChatApi>, response: ServerResponse): Promise<void> {
    const chats = await this.chatsService.getChats(request.body ?? {});
    response.end(JSON.stringify(chats));
  }

  public async addChat(request: Request<NewChatApi>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const addedChat = await this.chatsService.addChat(request.body);
      response.end(JSON.stringify(addedChat ?? {}));
    }
  }

  public async removeChat(request: Request<{ ids: number[] }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const ids = request.body.ids;
      const removedIds = await this.chatsService.removeChat(ids);
      response.end(JSON.stringify({ ids: removedIds }));
    }
  }

  public async updateChat(request: Request<UpdateChatApi>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const chat = await this.chatsService.updateChat(request.body);
      response.end(JSON.stringify(chat ?? {}));
    }
  }
}

diContainer.registerDependencies(ChatsController, [ChatsService]);
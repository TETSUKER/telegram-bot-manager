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
      await this.chatsService.addChat(request.body);
      response.end('Chat added');
    }
  }

  public async removeChat(request: Request<{ id: number }>, response: ServerResponse): Promise<void> {
    if (request.body) {
      const id = request.body.id;
      await this.chatsService.removeChat(id);
      response.end('Chat successfully removed');
    }
  }

  public async updateChat(request: Request<UpdateChatApi>, response: ServerResponse): Promise<void> {
    if (request.body) {
      await this.chatsService.updateChat(request.body);
      response.end('Chat successfully updated');
    }
  }
}

diContainer.registerDependencies(ChatsController, [ChatsService]);
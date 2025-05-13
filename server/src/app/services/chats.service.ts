import { diContainer } from 'app/core/di-container';
import { FilterChatApi, GetChatApi, NewChatApi, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { ChatModel } from 'app/models/chat.model';

export class ChatsService {
  constructor(private chatModel: ChatModel) {}

  public async getChats(filter: FilterChatApi): Promise<GetChatApi[]> {
    return await this.chatModel.getChats(filter);
  }

  public async addChat(newChat: NewChatApi): Promise<void> {
    await this.chatModel.addChat(newChat);
  }

  public async removeChat(chatId: number): Promise<void> {
    await this.chatModel.removeChat(chatId);
  }

  public async updateChat(chat: UpdateChatApi): Promise<void> {
    await this.chatModel.updateChat(chat);
  }
}

diContainer.registerDependencies(ChatsService, [ChatModel]);

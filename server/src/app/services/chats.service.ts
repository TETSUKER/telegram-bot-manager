import { diContainer } from 'app/core/di-container';
import { EventBus } from 'app/core/event-bus';
import { FilterChatApi, Chat, NewChatApi, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { EventName } from 'app/interfaces/event-bus.interfaces';
import { ChatsModel } from 'app/models/chats.model';

export class ChatsService {
  constructor(
    private chatModel: ChatsModel,
    private eventBus: EventBus,
  ) {}

  public async getChats(filter: FilterChatApi): Promise<Chat[]> {
    return await this.chatModel.getChats(filter);
  }

  public async addChat(newChat: NewChatApi): Promise<Chat | null> {
    return await this.chatModel.addChat(newChat);
  }

  public async removeChat(chatIds: number[]): Promise<number[]> {
    const removedChats = await this.chatModel.removeChat(chatIds);
    const removedChatsIds = removedChats.map(chat => chat.id);
    this.eventBus.publish(EventName.chats_removed, removedChatsIds);

    return removedChatsIds;
  }

  public async updateChat(chat: UpdateChatApi): Promise<Chat | null> {
    return await this.chatModel.updateChat(chat);
  }
}

diContainer.registerDependencies(ChatsService, [
  ChatsModel,
  EventBus,
]);

import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
import { Postgres } from 'app/core/postgres';
import { ConflictError } from 'app/errors/conflict.error';
import { NotFoundError } from 'app/errors/not-found.error';
import { ServerApiError } from 'app/errors/server.error';
import { DbChat, FilterChatApi, GetChatApi, NewChatApi, NewDbChat, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { Column, Condition } from 'app/interfaces/postgres.interfaces';

export class ChatModel {
  constructor(
    private postgres: Postgres,
    private logger: Logger,
  ) {
    this.createTable();
  }

  private async createTable(): Promise<void> {
    const columns: Column<DbChat>[] = [{
      columnName: 'id',
      type: 'serial',
      primary: true,
    }, {
      columnName: 'chat_id',
      type: 'text',
    }, {
      columnName: 'name',
      type: 'text',
    }, {
      columnName: 'date_added',
      type: 'timestamp',
    }];
    await this.postgres.createTableIfNotExist('chats', columns);
  }

  public async getChats(filter: FilterChatApi): Promise<GetChatApi[]> {
    const conditions = this.getConditionsFromFilter(filter);

    try {
      const chats = await this.postgres.selectFromTable<DbChat>('chats', [], conditions);
      return this.convertFromDbChat(chats);
    } catch(err) {
      this.logger.errorLog(`Error while get chats: ${err}`);
      throw new ServerApiError('Error get chats');
    }
  }

  public async addChat(newChat: NewChatApi): Promise<void> {
    const [dbChat] = await this.getChats({ name: newChat.name });

    if (dbChat) {
      throw new ConflictError(`Chat with same name already exist`);
    }

    try {
      const newDbChat = this.convertFromNewChat(newChat);
      await this.postgres.insertInTable('chats', newDbChat);
    } catch(err) {
      this.logger.errorLog(`Error add chat: ${err}`);
      throw err;
    }
  }

  public async removeChat(id: number): Promise<void> {
    const [chat] = await this.postgres.selectFromTable<DbChat>('chats', [], [{ columnName: 'id', value: id, type: 'number', operation: '=' }]);
    if (!chat) {
      throw new NotFoundError(`Chat with id: ${id} not found`);
    }

    await this.postgres.deleteFromTableById('chats', id);
  }

  public async updateChat(chat: UpdateChatApi): Promise<void> {
    const [dbChat] = await this.postgres.selectFromTable<DbChat>('chats', [], [{ columnName: 'id', value: chat.id, type: 'number', operation: '=' }]);
    if (!dbChat) {
      throw new NotFoundError(`Chat with id: ${chat.id} not found`);
    }

    const updatedChat = this.convertFromGetApiChat({ ...chat, dateAdded: dbChat.date_added });
    await this.postgres.updateTable('chats', chat.id, updatedChat);
  }

  private getConditionsFromFilter(filter: FilterChatApi): Condition<DbChat>[] {
    const conditions: Condition<DbChat>[] = [];

    if (filter.id) {
      conditions.push({
        columnName: 'id',
        value: filter.id,
        type: 'number',
        operation: '=',
      });
    }

    if (filter.chatId) {
      conditions.push({
        columnName: 'chat_id',
        value: filter.chatId,
        type: 'string',
      });
    }

    if (filter.name) {
      conditions.push({
        columnName: 'name',
        value: filter.name,
        type: 'string',
      });
    }

    return conditions;
  }

  private convertFromDbChat(dbChats: DbChat[]): GetChatApi[] {
    return dbChats.map(dbChat => ({
      id: dbChat.id,
      chatId: dbChat.chat_id,
      name: dbChat.name,
      dateAdded: dbChat.date_added,
    }));
  }

  private convertFromNewChat(newChat: NewChatApi): NewDbChat {
    return {
      chat_id: newChat.chatId,
      name: newChat.name,
      date_added: new Date(),
    };
  }

  private convertFromGetApiChat(chat: GetChatApi): DbChat {
    return {
      id: chat.id,
      chat_id: chat.chatId,
      name: chat.name,
      date_added: chat.dateAdded,
    };
  }
}

diContainer.registerDependencies(ChatModel, [
  Postgres,
  Logger,
]);
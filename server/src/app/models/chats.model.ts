import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
import { Postgres } from 'app/core/postgres';
import { ConflictError } from 'app/errors/conflict.error';
import { NotFoundError } from 'app/errors/not-found.error';
import { ServerApiError } from 'app/errors/server.error';
import { Chat, DbChat, FilterChatApi, NewChatApi, NewDbChat, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { Column, Condition } from 'app/interfaces/postgres.interfaces';

export class ChatsModel {
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

  public async getChats(filter: FilterChatApi): Promise<Chat[]> {
    const conditions = this.getConditionsFromFilter(filter);

    try {
      const chats = await this.postgres.selectFromTable<DbChat, DbChat>('chats', [], conditions);
      return this.convertFromDbChat(chats);
    } catch(err) {
      this.logger.errorLog(`Error while get chats: ${err}`);
      throw new ServerApiError('Error get chats');
    }
  }

  private getConditionsFromFilter(filter: FilterChatApi): Condition<DbChat>[] {
    const conditions: Condition<DbChat>[] = [];

    if (filter.ids?.length) {
      filter.ids.forEach(id => {
        conditions.push({
          columnName: 'id',
          value: id,
          type: 'number',
          operation: '=',
        });
      });
    }

    if (filter.names?.length) {
      filter.names.forEach(name => {
        conditions.push({
          columnName: 'name',
          value: name,
          type: 'string',
          exactMatch: false,
        });
      });
    }

    return conditions;
  }

  public async addChat(newChat: NewChatApi): Promise<Chat | null> {
    const [dbChat] = await this.postgres.selectFromTable<DbChat, DbChat>('chats', [], [{
      columnName: 'name',
      value: newChat.name,
      type: 'string',
      exactMatch: true,
    }]);

    if (dbChat) {
      throw new ConflictError(`Chat with same name already exist`);
    }

    try {
      const newDbChat = this.convertFromNewChat(newChat);
      const { rows } = await this.postgres.insertInTable<NewDbChat, DbChat>('chats', newDbChat);
      const [ chat ] = this.convertFromDbChat(rows);
      return chat ?? null;
    } catch(err) {
      this.logger.errorLog(`Error add chat: ${err}`);
      throw err;
    }
  }

  public async removeChat(ids: number[]): Promise<Chat[]> {
    const { rows } = await this.postgres.deleteFromTableByIds<DbChat>('chats', ids);
    return this.convertFromDbChat(rows);
  }

  public async updateChat(chat: UpdateChatApi): Promise<Chat | null> {
    const [dbChat] = await this.postgres.selectFromTable<DbChat, DbChat>('chats', [], [{ columnName: 'id', value: chat.id, type: 'number', operation: '=' }]);
    if (!dbChat) {
      throw new NotFoundError(`Chat with id: ${chat.id} not found`);
    }

    try {
      const updatedDbChat = this.convertFromUpdateChat(chat);
      const { rows } = await this.postgres.updateTable<Partial<DbChat>, DbChat>('chats', chat.id, updatedDbChat);
      const [ updatedChat ] = this.convertFromDbChat(rows);
      return updatedChat ?? null;
    } catch(err) {
      this.logger.errorLog(`Error update chat: ${err}`);
      throw err;
    }
    
  }

  private convertFromUpdateChat(chat: UpdateChatApi): Partial<DbChat> {
    const updateDbChat: Partial<DbChat> = {};

    if ('name' in chat) updateDbChat.name = chat.name;
    if ('chatId' in chat) updateDbChat.chat_id = chat.chatId;

    return updateDbChat;
  }

  private convertFromDbChat(dbChats: DbChat[]): Chat[] {
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

  private convertToDbChat(chat: Chat): DbChat {
    return {
      id: chat.id,
      chat_id: chat.chatId,
      name: chat.name,
      date_added: chat.dateAdded,
    };
  }
}

diContainer.registerDependencies(ChatsModel, [
  Postgres,
  Logger,
]);
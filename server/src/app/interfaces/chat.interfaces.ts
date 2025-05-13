export interface NewDbChat {
  chat_id: string;
  name: string;
  date_added: Date;
}

export interface DbChat extends NewDbChat {
  id: number;
}

export type UpdateDbChat = Partial<DbChat>;

export interface NewChatApi {
  chatId: string;
  name: string;
}

export interface GetChatApi extends NewChatApi {
  dateAdded: Date;
  id: number;
}

export type FilterChatApi = Partial<GetChatApi>;

export interface UpdateChatApi {
  id: number;
  chatId: string;
  name: string;
}

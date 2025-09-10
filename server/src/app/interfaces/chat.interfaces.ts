export interface NewDbChat {
  chat_id: string;
  name: string;
  date_added: string;
}

export interface DbChat extends NewDbChat {
  id: number;
}

export type UpdateDbChat = Partial<DbChat>;

export interface NewChatApi {
  chatId: string;
  name: string;
}

export interface Chat {
  id: number;
  chatId: string;
  name: string;
  dateAdded: string;
}

export interface FilterChatApi {
  ids?: number[];
  names?: string[];
};

export interface UpdateChatApi {
  id: number;
  chatId?: string;
  name?: string;
}

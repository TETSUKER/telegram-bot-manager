export interface DbJoke {
  id: number;
  text: string;
  sended_chat_ids: string[];
}

export interface NewDbJoke {
  text: string;
  sended_chat_ids: string[];
}

export type UpdateDbJoke = Partial<NewDbJoke>;

export interface NewJoke {
  text: string;
}

export interface Joke extends NewJoke {
  id: number;
  sendedChatIds: string[];
}

export interface FilterJokeApi {
  ids?: number[];
  text?: string;
  sendedChatIds?: {
    ids: string[],
    exclude: boolean;
  };
};

export interface UpdateJokeApi {
  id: number;
  text?: string;
  sendedChatIds?: string[];
}

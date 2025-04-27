export interface NewBot {
  token: string;
  username: string;
}

export interface Bot extends NewBot {
  id: number;
  handlerIds: number[];
  lastUpdateId: number;
}

export interface NewBot {
  token: string;
  username: string;
}

export interface Bot extends NewBot {
  id: number;
  ruleIds: number[];
  lastUpdateId: number;
}

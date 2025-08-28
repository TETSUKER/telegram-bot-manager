export type ActionLogType =
  | 'MESSAGE_SEND'
  | 'STICKER_SEND'
  | 'EMOJI_REACTION_SEND'
  | 'RANDOM_JOKE_SEND'
  | 'FIND_JOKE_SEND'
  | 'JOKE_RATING_SEND'
  | 'BOT_ADDED'
  | 'BOT_DELETED'
  | 'BOT_UPDATED'
  | 'CHAT_ADDED'
  | 'CHAT_DELETED'
  | 'CHAT_UPDATED'
  | 'RULE_CREATED'
  | 'RULE_DELETED'
  | 'RULE_UPDATED'
  | 'JOKE_CREATED'
  | 'JOKE_DELETED'
  | 'JOKE_UPDATED'

export interface NewDbActionLog {
  type: ActionLogType;
  details: string;
  date: Date;
}

export interface DbActionLog extends NewDbActionLog {
  id: number;
}

export type ActionLog = DbActionLog;
export type NewActionLog = NewDbActionLog;

export interface FilterActionLog {
  ids?: number[];
  types?: ActionLogType[];
}

export type EventName =
  'BOT_ADDED' |
  'BOT_REMOVED' |
  'HANDLER_ADDED' |
  'HANDLER_REMOVED';

export type EventHandler<T = any> = (data: T) => void;

export interface Events {
  'BOT_ADDED': { id: number },
  'BOT_REMOVED': { id: number },
  'HANDLER_ADDED': { id: number },
  'HANDLER_REMOVED': { id: number },
}

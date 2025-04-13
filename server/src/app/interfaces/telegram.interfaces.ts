export interface TelegramError extends Error {
  code?: number;
  response?: {
    statusCode: number;
    body: string;
  };
}

export interface TelegramApiResponse {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  };
  chat: {
    id: number;
    title: string;
    type: string;
  }
  date: number;
  text: string;
}

export type TelegramApiMethod = 'sendMessage' | 'getUpdates';

export type TelegramMessageEntityType =
  'mention' |
  'hashtag' |
  'cashtag' |
  'bot_command' |
  'url' |
  'email' |
  'phone_number' |
  'bold' |
  'italic' |
  'underline' |
  'strikethrough' |
  'spoiler' |
  'blockquote' |
  'expandable_blockquote' |
  'code' |
  'pre' |
  'text_link' |
  'text_mention' |
  'custom_emoji';

export interface TelegramMessageEntity {
  type: TelegramMessageEntityType;
  offset: number;
  length: number;
  url?: string;
  user?: any;
  language?: string;
  custom_emoji_id?: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
  can_connect_to_business?: boolean;
  has_main_web_app?: boolean;
}

export type TelegramChatType =
  'private' |
  'group' |
  'supergroup' |
  'channel';

export interface TelegramChat {
  id: number;
  type: TelegramChatType;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
}

export interface TelegramMessage {
  message_id: number;
  date: number;
  chat: TelegramChat;
  text: string;
  from?: TelegramUser;
  sender_chat?: TelegramChat;
  entities?: TelegramMessageEntity[];
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

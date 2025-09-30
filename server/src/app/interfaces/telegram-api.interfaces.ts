export type TelegramApiMethod =
  | 'sendMessage'
  | 'getUpdates'
  | 'getMe'
  | 'sendSticker'
  | 'setMessageReaction'
  | 'editMessageText'
  | 'answerCallbackQuery'

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

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramAnimation {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail?: TelegramPhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  thumbnail?: TelegramPhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramFile {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  file_path?: string;
}

export interface TelegramSticker {
  file_id: string;
  file_unique_id: string;
  type: 'regular' | 'mask' | 'custom_emoji';
  width: number;
  height: number;
  is_animated: boolean;
  is_video: boolean;
  thumbnail?: TelegramPhotoSize;
  emoji?: string;
  set_name?: string;
  premium_animation?: TelegramFile;
  mask_position?: unknown;
  custom_emoji_id?: string;
  needs_repainting?: true;
  file_size?: number;
}

export interface TelegramMessageEntity {
  type: TelegramMessageEntityType;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
  language?: string;
  custom_emoji_id?: string;
  animation?: TelegramAnimation;
  document?: TelegramDocument;
  photo?: TelegramPhotoSize[];
  sticker?: TelegramSticker;
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

export interface TelegramChatMember {
  status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
  user: TelegramUser;
}

export interface TelegramChatMemberUpdated {
  chat: TelegramChat;
  from: TelegramUser;
  date: number;
  old_chat_member: TelegramChatMember;
  new_chat_member: TelegramChatMember;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage; // На самом деле должен быть тип MaybeInaccessibleMessage
  inline_message_id?: string;
  chat_instance?: string;
  data?: string;
  game_short_name?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  my_chat_member?: TelegramChatMemberUpdated;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramApiResponse<T> {
  ok: boolean,
  result?: T;
  description?: string;
  error_code?: number;
}

export interface SendTextMessageRequestBody {
  chat_id: number;
  text: string;
  reply_to_message_id?: number;
  parse_mode?: 'Markdown';
}

export interface ReplyMarkup {
  inline_keyboard: {
    text: string;
    callback_data: string;
  }[][];
}

export interface SendMessageWithMarkupRequestBody {
  chat_id: number;
  text: string;
  reply_markup: ReplyMarkup;
}

export interface EditMessageTextRequestBody {
  chat_id: number;
  message_id: number;
  text: string;
  reply_markup?: ReplyMarkup;
}

export interface SendStickerRequestBody {
  chat_id: number;
  sticker: string;
  reply_to_message_id?: number;
}

export interface SetMessageReactionRequestBody {
  chat_id: number,
  message_id: number,
  reaction: {
    type: 'emoji',
    emoji: string
  }[],
}

export interface GetUpdatesRequestBody {
  offset: number;
  timeout: number;
}

import { diContainer } from 'app/core/di-container';
import { Logger } from 'app/core/logger';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { ExternalApiError } from 'app/errors/external-api.error';
import { ServerApiError } from 'app/errors/server.error';
import {
  EditMessageTextRequestBody,
  GetUpdatesRequestBody,
  ReplyMarkup,
  SendMessageWithMarkupRequestBody,
  SendStickerRequestBody,
  SendTextMessageRequestBody,
  SetMessageReactionRequestBody,
  TelegramMessage,
  TelegramUpdate,
  TelegramUser,
} from 'app/interfaces/telegram-api.interfaces';

export class TelegramService {
  constructor(
    private telegramHttpsApi: TelegramHttpsApi,
    private logger: Logger,
  ) {}

  public async getBotInfo(botToken: string): Promise<TelegramUser> {
    try {
      return await this.telegramHttpsApi.callApi('getMe', botToken);
    } catch(err) {
      throw new ExternalApiError(`Error when get bot: ${err}`);
    }
  }

  public async sendTextMessage(botToken: string, chatId: number, text: string, reply_to_message_id?: number): Promise<TelegramMessage> {
    const body: SendTextMessageRequestBody = {
      chat_id: chatId,
      text,
      reply_to_message_id
    };

    try {
      return await this.telegramHttpsApi.callApi<TelegramMessage>('sendMessage', botToken, body);
    } catch(err) {
      throw new ServerApiError(`Error then sending text meessage: ${JSON.stringify(err)}`);
    }
  }

  public async sendTextMarkdownMessage(botToken: string, chatId: number, text: string, reply_to_message_id?: number): Promise<TelegramMessage> {
    const body: SendTextMessageRequestBody = {
      chat_id: chatId,
      text,
      reply_to_message_id,
      parse_mode: 'Markdown',
    };

    try {
      return await this.telegramHttpsApi.callApi<TelegramMessage>('sendMessage', botToken, body);
    } catch(err) {
      throw new ServerApiError(`Error then sending markdown meessage: ${JSON.stringify(err)}`);
    }
  }

  public async sendSticker(botToken: string, chatId: number, stickerId: string, reply_to_message_id?: number): Promise<TelegramMessage> {
    const body: SendStickerRequestBody = {
      chat_id: chatId,
      sticker: stickerId,
      reply_to_message_id
    };

    try {
      return await this.telegramHttpsApi.callApi<TelegramMessage>('sendSticker', botToken, body);
    } catch(err) {
      throw new ServerApiError(`Error then sending sticker: ${JSON.stringify(err)}`);
    }
  }

  public async setMessageReaction(botToken: string, chatId: number, messageId: number, emoji: string): Promise<TelegramMessage> {
    const body: SetMessageReactionRequestBody = {
      chat_id: chatId,
      message_id: messageId,
      reaction: [{ type: 'emoji', emoji }]
    };
    return await this.telegramHttpsApi.callApi<TelegramMessage>('setMessageReaction', botToken, body);
  }

  public async getUpdates(botToken: string, offset: number = 0, timeout: number = 30): Promise<TelegramUpdate[]> {
    const body: GetUpdatesRequestBody = { offset, timeout };
    return await this.telegramHttpsApi.callApi('getUpdates', botToken, body);
  }

  public async sendMessageWithMarkup(botToken: string, chatId: number, text: string, replyMarkup: ReplyMarkup): Promise<TelegramMessage> {
    const body: SendMessageWithMarkupRequestBody = {
      chat_id: chatId,
      text,
      reply_markup: replyMarkup,
    };

    try {
      return await this.telegramHttpsApi.callApi('sendMessage', botToken, body);
    } catch(err) {
      throw new ServerApiError(`Error then sending meessage with reply markup: ${JSON.stringify(err)}`);
    }
  }

  public async editMessageText(botToken: string, chatId: number, messageId: number, text: string, replyMarkup: ReplyMarkup): Promise<TelegramMessage> {
    const body: EditMessageTextRequestBody = {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: replyMarkup,
    };

    try {
      return await this.telegramHttpsApi.callApi('editMessageText', botToken, body);
    } catch(err) {
      throw new ServerApiError(`Error then edit message text: ${JSON.stringify(err)}`);
    }
  }

  public async answerCallbackQuery(botToken: string, callback_query_id: string, text: string): Promise<TelegramMessage> {
    const body = {
      callback_query_id,
      text,
    };

    try {
      return await this.telegramHttpsApi.callApi('answerCallbackQuery', botToken, body);
    } catch(err) {
      throw new ServerApiError(`Error then answer callback query: ${JSON.stringify(err)}`);
    }
  }
}

diContainer.registerDependencies(TelegramService, [
  TelegramHttpsApi,
  Logger,
]);

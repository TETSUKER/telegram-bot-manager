import { diContainer } from 'app/core/di-container';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { ExternalApiError } from 'app/errors/external-api.error';
import { GetUpdatesRequestBody, SendStickerRequestBody, SendTextMessageRequestBody, SetMessageReactionRequestBody, TelegramMessage, TelegramUpdate, TelegramUser } from 'app/interfaces/telegram-api.interfaces';

export class TelegramService {
  constructor(private telegramHttpsApi: TelegramHttpsApi) {}

  public async getBotInfo(botToken: string): Promise<TelegramUser> {
    try {
      return await this.telegramHttpsApi.callApi('getMe', botToken);
    } catch(err) {
      throw new ExternalApiError(`Error when get bot: ${err}`);
    }
  }

  public async sendTextMessage(botToken: string, chatId: number, text: string, reply_to_message_id?: number | undefined): Promise<TelegramMessage> {
    const body: SendTextMessageRequestBody = {
      chat_id: chatId,
      text,
      reply_to_message_id
    };
    return await this.telegramHttpsApi.callApi('sendMessage', botToken, body);
  }

  public async sendSticker(botToken: string, chatId: number, stickerId: string, reply_to_message_id?: number | undefined): Promise<TelegramMessage> {
    const body: SendStickerRequestBody = {
      chat_id: chatId,
      sticker: stickerId,
      reply_to_message_id
    };
    return await this.telegramHttpsApi.callApi('sendSticker', botToken, body);
  }

  public async setMessageReaction(botToken: string, chatId: number, messageId: number, emoji: string): Promise<TelegramMessage> {
    const body: SetMessageReactionRequestBody = {
      chat_id: chatId,
      message_id: messageId,
      reaction: [{ type: 'emoji', emoji }]
    };
    return await this.telegramHttpsApi.callApi('setMessageReaction', botToken, body);
  }

  public async getUpdates(botToken: string, offset: number = 0, timeout: number = 30): Promise<TelegramUpdate[]> {
    const body: GetUpdatesRequestBody = { offset, timeout };
    return await this.telegramHttpsApi.callApi('getUpdates', botToken, body);
  }
}

diContainer.registerDependencies(TelegramService, [TelegramHttpsApi]);

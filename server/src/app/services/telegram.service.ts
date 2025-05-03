import { diContainer } from 'app/core/di-container';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { ExternalApiError } from 'app/errors/external-api.error';
import { TelegramMessage, TelegramUpdate, TelegramUser } from 'app/interfaces/telegram-api.interfaces';

export class TelegramService {
  constructor(private telegramHttpsApi: TelegramHttpsApi) {}

  public async getBotInfo(botToken: string): Promise<TelegramUser> {
    try {
      return await this.telegramHttpsApi.callApi('getMe', botToken);
    } catch(err) {
      throw new ExternalApiError(`Error when get bot: ${err}`);
    }
  }

  public async sendTextMessage(botToken: string, chatId: number, text: string, reply_to_message_id?: number | null): Promise<TelegramMessage> {
    return await this.telegramHttpsApi.callApi('sendMessage', botToken, { chat_id: chatId, text, reply_to_message_id });
  }

  public async getUpdates(botToken: string, offset: number = 0, timeout: number = 30): Promise<TelegramUpdate[]> {
    return this.telegramHttpsApi.callApi('getUpdates', botToken, { offset, timeout });
  }
}

diContainer.registerDependencies(TelegramService, [TelegramHttpsApi]);

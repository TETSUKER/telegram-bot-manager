import { IncomingMessage } from 'http';
import { request } from 'https';
import { diContainer } from 'app/core/di-container';
import {
  TelegramApiMethod,
  TelegramApiResponse,
  TelegramMessage,
  TelegramUpdate
} from 'app/interfaces/telegram.interfaces';

export class TelegramHttpsApi {
  private readonly apiUrl = 'https://api.telegram.org/bot';
  private readonly options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async sendTextMessage(botToken: string, chatId: number, text: string): Promise<TelegramMessage | string> {
    return await this.callApi('sendMessage', botToken, { chat_id: chatId, text });
  }

  async getUpdates(botToken: string, offset: number = 0, timeout: number = 30): Promise<TelegramUpdate[] | string> {
    return this.callApi('getUpdates', botToken, { offset, timeout });
  }

  private async callApi<T>(method: TelegramApiMethod, botToken: string, body: object = {}): Promise<T | string> {
    return new Promise((resolve, reject) => {
      this.checkForEmptyToken(botToken, reject);
      this.sendBotRequest(method, botToken, body, resolve, reject);
    });
  }

  private checkForEmptyToken(botToken: string, reject: (text: string) => void): Promise<Error> | void {
    if (!botToken.length) {
      reject(`Empty bot token`);
    }
  }

  private sendBotRequest<T>(
    method: TelegramApiMethod,
    botToken: string,
    body: object = {},
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (text: string) => void,
  ): void {
    const url = `${this.apiUrl}${botToken}/${method}`;
    const req = request(
      url,
      this.options,
      (res: IncomingMessage) => this.handleApiResponse(res, resolve, reject)
    );

    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  }

  private handleApiResponse<T>(
    res: IncomingMessage,
    resolve: (value: T) => void,
    reject: (reason: string) => void,
  ): void {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(data) as TelegramApiResponse<T>;
        if (!json.ok) {
          reject(json.description || 'Telegram API error');
        }
        if (json.result) {
          resolve(json.result);
        }
      } catch (err) {
        this.handleErrorRespone(err, reject);
      }
    });
    res.on('error', (err) => this.handleErrorRespone(err, reject));
  }

  private handleErrorRespone(err: unknown, reject: (reason: string) => void): void {
    if (err instanceof Error) {
      console.error('Telegram API error:', err);
      reject(`Telegram API error: ${err.message}`);
    } else {
      console.error('Telegram API unknown error:', err);
      reject(`Telegram API unknown error: ${err}`);
    }
  }
}

diContainer.registerDependencies(TelegramHttpsApi);

import { IncomingMessage } from 'http';
import { request } from 'https';
import { diContainer } from 'app/core/di-container';
import { TelegramApiMethod, TelegramApiResponse } from 'app/interfaces/telegram.interfaces';

interface TelegramResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}

export class TelegramHttpsApi {
  private readonly apiUrl = 'https://api.telegram.org/bot';
  private readonly botToken = process.env.BOT_TOKEN;

  async sendTextMessage(chatId: number, text: string): Promise<TelegramApiResponse> {
    return await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
    });
  }

  async getUpdates(offset: number = 0, timeout: number = 30): Promise<any[]> {
    return this.callApi<any[]>('getUpdates', { offset, timeout });
  }

  private async callApi<T>(method: TelegramApiMethod, body: object = {}): Promise<T> {
    const url = `${this.apiUrl}${this.botToken}/${method}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = request(
        url,
        options,
        (res: IncomingMessage) => this.handleApiResponse(res, resolve, reject),
      );
      req.on('error', reject);
      req.write(JSON.stringify(body));
      req.end();
    });
  }

  private handleApiResponse<T>(
    res: IncomingMessage,
    resolve: (value: T) => void,
    reject: (reason: Error) => void,
  ): void {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(data) as TelegramResponse<T>;
        if (!json.ok) {
          reject(new Error(json.description || 'Telegram API error'));
        } else {
          resolve(json.result);
        }
      } catch (err) {
        this.handleErrorRespone(err, reject);
      }
    });
    res.on('error', (err) => this.handleErrorRespone(err, reject));
  }

  private handleErrorRespone(err: unknown, reject: (reason: Error) => void): void {
    if (err instanceof Error) {
      console.error('Telegram API error:', err);
      reject(new Error(`Telegram API error: ${err.message}`));
    } else {
      console.error('Telegram API unknown error:', err);
      reject(new Error(`Telegram API unknown error: ${err}`));
    }
  }
}

diContainer.registerDependencies(TelegramHttpsApi);

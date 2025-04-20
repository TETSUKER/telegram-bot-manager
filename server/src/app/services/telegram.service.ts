import { diContainer } from 'app/core/di-container';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { TelegramMessage, TelegramUpdate, TelegramUser } from 'app/interfaces/telegram.interfaces';

export class TelegramService {
  private isPolling: boolean = false;
  private pollLoopPromise: Promise<void> | null = null;
  private shouldStop: boolean = false;
  private lastUpdateId: number = 0;
  private readonly chatIdPrefix = -100;
  private readonly botToken = process.env.BOT_TOKEN || '';

  constructor(private telegramHttpsApi: TelegramHttpsApi) {}

  public async getBotInfo(botToken: string): Promise<TelegramUser> {
    return await this.telegramHttpsApi.callApi('getMe', botToken);
  }

  public async sendTextMessage(botToken: string, chatId: number, text: string): Promise<TelegramMessage> {
    return await this.telegramHttpsApi.callApi('sendMessage', botToken, { chat_id: chatId, text });
  }

  public async getUpdates(botToken: string, offset: number = 0, timeout: number = 30): Promise<TelegramUpdate[]> {
    return this.telegramHttpsApi.callApi('getUpdates', botToken, { offset, timeout });
  }

  public startPolling(): void {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    this.shouldStop = false;

    this.pollLoopPromise = this.pollUpdates();

    this.pollLoopPromise
      .catch(err => console.error('Polling stopped with error:', err))
      .finally(() => {
        this.isPolling = false;
        this.pollLoopPromise = null;
      });
  }

  public async stopPolling() {
    if (!this.isPolling) {
      return;
    }

    this.shouldStop = true;

    try {
      await this.pollLoopPromise;
    } catch (err) {
      console.error('Error during stopping:', err);
    }
  }

  private async pollUpdates(): Promise<void> {
    while(!this.shouldStop) {
      try {
        const updates = await this.getUpdates(this.botToken, this.lastUpdateId + 1);
        if (Array.isArray(updates) && updates.length > 0) {
          for (const update of updates) {
            this.handleUpdate(update);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        await this.delay(5000);
      }
    }
  }

  private async handleUpdate(update: TelegramUpdate): Promise<void> {
    this.lastUpdateId = update.update_id;

    if (update?.message?.text === 'Да') {
      const chatId = Number(`${this.chatIdPrefix}${process.env.CHAT_ID}`);
      await this.sendTextMessage(this.botToken, chatId, 'Нет');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

diContainer.registerDependencies(TelegramService, [TelegramHttpsApi]);

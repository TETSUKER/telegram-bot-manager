import { diContainer } from 'app/core/di-container';
import { TelegramHttpsApi } from 'app/core/telegram-https-api';
import { TelegramUpdate } from 'app/interfaces/telegram.interfaces';

export class TelegramUpdatesHandler {
  private isPolling: boolean = false;
  private pollLoopPromise: Promise<void> | null = null;
  private shouldStop: boolean = false;
  private lastUpdateId: number = 0;
  private readonly chatIdPrefix = -100;
  private readonly botToken = process.env.BOT_TOKEN || '';

  constructor(private telegramHttpsApi: TelegramHttpsApi) {}

  public startPolling(): void {
    if (this.isPolling) {
      console.log('Polling is already running');
      return;
    }

    this.isPolling = true;
    this.shouldStop = false;
    console.log('Starting polling...');

    this.pollLoopPromise = this.pollUpdates();

    this.pollLoopPromise
      .then(() => console.log('Polling stopped gracefully'))
      .catch(err => console.error('Polling stopped with error:', err))
      .finally(() => {
        this.isPolling = false;
        this.pollLoopPromise = null;
      });
  }

  public async stopPolling() {
    if (!this.isPolling) {
      console.log('Polling is not running');
      return;
    }

    console.log('Stopping polling...');
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
        const updates = await this.telegramHttpsApi.getUpdates(this.botToken, this.lastUpdateId + 1);
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
      await this.telegramHttpsApi.sendTextMessage(this.botToken, chatId, 'Нет');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

diContainer.registerDependencies(TelegramUpdatesHandler, [TelegramHttpsApi]);

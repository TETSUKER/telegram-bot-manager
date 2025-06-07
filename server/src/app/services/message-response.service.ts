import { diContainer } from 'app/core/di-container';
import { TelegramService } from './telegram.service';
import { JokesService } from './jokes.service';

export class MessageResponseService {
  constructor(
    private telegramService: TelegramService,
    private jokesService: JokesService,
  ) {}

  public async sendTextMessage(token: string, chatId: number, text: string, message_id?: number): Promise<void> {
    await this.telegramService.sendTextMessage(token, chatId, text, message_id);
  }

  public async sendStickerMessage(token: string, chatId: number, stickerId: string, message_id?: number): Promise<void> {
    await this.telegramService.sendTextMessage(token, chatId, stickerId, message_id);
  }

  public async setEmojiReaction(token: string, chatId: number, message_id: number, emoji: string): Promise<void> {
    await this.telegramService.setMessageReaction(token, chatId, message_id, emoji);
  }

  public async sendRandomJoke(token: string, chatId: number): Promise<void> {
    await this.jokesService.sendRandomJoke(token, chatId);
  }

  public async sendFindedJoke(token: string, chatId: number, command: string): Promise<void> {
    const findJokeCommandMatch = command.match(/^\/findJoke (.*)$/);

    if (findJokeCommandMatch && findJokeCommandMatch[1]) {
      await this.jokesService.findJokeAndSend(token, chatId, findJokeCommandMatch[1]);
    } else {
      await this.telegramService.sendTextMessage(token, chatId, 'Write joke text after command.');
    }
  }

  public async sendJokesRating(botToken: string, chatId: number): Promise<void> {
    await this.jokesService.sendJokesRating(botToken, chatId);
  }
}

diContainer.registerDependencies(MessageResponseService, [
  TelegramService,
  JokesService,
]);
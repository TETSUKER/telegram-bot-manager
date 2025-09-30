import { diContainer } from 'app/core/di-container';
import { TelegramService } from './telegram.service';
import { JokesService } from './jokes.service';
import { EventBus } from 'app/core/event-bus';
import { EventName } from 'app/interfaces/event-bus.interfaces';

export class MessageResponseService {
  constructor(
    private telegramService: TelegramService,
    private jokesService: JokesService,
    private eventBus: EventBus,
  ) {}

  public async sendTextMessage(token: string, chatId: number, text: string, message_id?: number): Promise<void> {
    await this.telegramService.sendTextMessage(token, chatId, text, message_id);
    this.eventBus.publish(EventName.message_send, {
      chatId,
      message: text,
    });
  }

  public async sendStickerMessage(token: string, chatId: number, stickerId: string, message_id?: number): Promise<void> {
    await this.telegramService.sendSticker(token, chatId, stickerId, message_id);
    this.eventBus.publish(EventName.sticker_send, {
      chatId,
      stickerId,
    });
  }

  public async setEmojiReaction(token: string, chatId: number, messageId: number, emoji: string): Promise<void> {
    await this.telegramService.setMessageReaction(token, chatId, messageId, emoji);
    this.eventBus.publish(EventName.emoji_reaction_send, {
      chatId,
      messageId,
      emoji,
    });
  }

  public async sendRandomJoke(token: string, chatId: number): Promise<void> {
    await this.jokesService.sendRandomJoke(token, chatId);
  }

  public async sendFindedJoke(token: string, chatId: number, command: string): Promise<void> {
    const findJokeCommandMatch = command.match(/^\/findJoke (.*)$/);

    if (findJokeCommandMatch && findJokeCommandMatch[1]) {
      await this.jokesService.findJokeAndSend(token, chatId, findJokeCommandMatch[1]);
    } else {
      const message = 'Write joke text after command.';
      await this.telegramService.sendTextMessage(token, chatId, message);
      this.eventBus.publish(EventName.message_send, {
        chatId,
        message,
      });
    }
  }

  public async sendJokesRating(botToken: string, botUserName: string, chatId: number): Promise<void> {
    await this.jokesService.sendJokesRating(botToken, botUserName, chatId);
  }
}

diContainer.registerDependencies(MessageResponseService, [
  TelegramService,
  JokesService,
  EventBus,
]);
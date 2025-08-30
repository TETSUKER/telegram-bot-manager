import { diContainer } from "app/core/di-container";
import {
  FilterJokeApi,
  Joke,
  NewJoke,
  UpdateJokeApi,
} from "app/interfaces/joke.interfaces";
import { JokesLikesModel } from "app/models/jokes-likes.model";
import { JokesModel } from "app/models/jokes.model";
import { TelegramService } from "./telegram.service";
import { getRandomNumber } from "app/utils/getRandomNumber";
import { Logger } from "app/core/logger";
import { ApiError } from "app/errors/api.error";
import { Postgres } from "app/core/postgres";
import { JokeIdWithRatingDb } from "app/interfaces/jokes-likes.interfaces";
import { EventBus } from "app/core/event-bus";
import { EventName } from "app/interfaces/event-bus.interfaces";

export class JokesService {
  constructor(
    private telegramService: TelegramService,
    private jokesLikesModel: JokesLikesModel,
    private jokesModel: JokesModel,
    private logger: Logger,
    private postgres: Postgres,
    private eventBus: EventBus
  ) {}

  public async getJokes(filter: FilterJokeApi): Promise<Joke[]> {
    return await this.jokesModel.getJokes(filter);
  }

  public async addJoke(joke: NewJoke): Promise<Joke | null> {
    const createdJoke = await this.jokesModel.addJoke(joke);

    if (createdJoke) {
      this.eventBus.publish(EventName.joke_created, createdJoke);
    }

    return createdJoke;
  }

  public async updateJoke(joke: UpdateJokeApi): Promise<Joke | null> {
    const updatedJoke = await this.jokesModel.updateJoke(joke);

    if (updatedJoke) {
      this.eventBus.publish(EventName.joke_updated, updatedJoke);
    }

    return updatedJoke;
  }

  public async removeJokes(ids: number[]): Promise<number[]> {
    const removedJokes = await this.jokesModel.removeJokes(ids);
    const removedJokesIds = removedJokes.map((joke) => joke.id);

    if (removedJokesIds.length) {
      this.eventBus.publish(EventName.jokes_deleted, removedJokesIds);
    }

    return removedJokesIds;
  }

  public async sendRandomJoke(botToken: string, chatId: number): Promise<void> {
    const chatIdString = chatId.toString();
    const notSendedJokes = await this.jokesModel.getJokes({
      sendedChatIds: {
        ids: [chatIdString],
        exclude: true,
      },
    });
    const randomJokeId = getRandomNumber(1, notSendedJokes.length);
    const joke = notSendedJokes[randomJokeId - 1];

    if (joke) {
      await this.sendJoke(botToken, chatId, joke);
      this.eventBus.publish(EventName.random_joke_send, {
        chatId,
        jokeId: joke.id,
      });
    } else {
      await this.telegramService.sendTextMessage(
        botToken,
        chatId,
        "Jokes are over((("
      );
    }
  }

  private async sendJoke(
    botToken: string,
    chatId: number,
    joke: Joke
  ): Promise<void> {
    const chatIdString = chatId.toString();
    const likes = await this.jokesLikesModel.getJokesLikes({ jokeId: joke.id });
    const rating =
      likes.reduce((sum, like) => sum + (like.isLike ? +1 : -1), 0) ?? 0;
    const likesCount =
      likes.reduce((sum, like) => sum + (like.isLike === true ? +1 : 0), 0) ??
      0;
    const dislikesCount =
      likes.reduce((sum, like) => sum + (like.isLike === false ? +1 : 0), 0) ??
      0;
    const markup = this.getJokeMarkup(
      rating,
      joke.id,
      likesCount,
      dislikesCount
    );
    await this.telegramService.sendMessageWithMarkup(
      botToken,
      chatId,
      joke.text,
      markup
    );
    await this.jokesModel.updateJoke({
      id: joke.id,
      sendedChatIds: [...(joke.sendedChatIds ?? []), chatIdString],
    }); // добавляются дублирующиеся id-шники чатов при поиске анеков
  }

  private getJokeMarkup(
    jokeRating: number,
    jokeId: number,
    likesCount: number,
    dislikesCount: number
  ) {
    return {
      inline_keyboard: [
        [
          {
            text: jokeRating.toString(),
            callback_data: `update_joke_rating_${jokeId}`,
          },
        ],
        [
          {
            text: `${likesCount} 👍`,
            callback_data: `thumb_up_${jokeId}`,
          },
          {
            text: `${dislikesCount} 👎`,
            callback_data: `thumb_down_${jokeId}`,
          },
        ],
      ],
    };
  }

  public async likeJokeMessage(
    jokeId: number,
    userId: number,
    chatId: number,
    messageId: number,
    botToken: string,
    callbackQueryId: string
  ): Promise<void> {
    const [jokeLike] = await this.jokesLikesModel.getJokesLikes({
      jokeId,
      userId,
    });
    let callbackMessage = "Liked";

    if (jokeLike && jokeLike.isLike === true) {
      await this.jokesLikesModel.removeJokesLikes([jokeLike.id]);
      callbackMessage = "Like removed";
    } else if (jokeLike && jokeLike.isLike === false) {
      await this.jokesLikesModel.removeJokesLikes([jokeLike.id]);
      await this.jokesLikesModel.addJokeLike({ jokeId, userId, isLike: true });
    } else {
      await this.jokesLikesModel.addJokeLike({ jokeId, userId, isLike: true });
    }

    await this.updateJokeMessage(jokeId, chatId, messageId, botToken);
    await this.telegramService.answerCallbackQuery(
      botToken,
      callbackQueryId,
      callbackMessage
    );
  }

  public async dislikeJokeMessage(
    jokeId: number,
    userId: number,
    chatId: number,
    messageId: number,
    botToken: string,
    callbackQueryId: string
  ): Promise<void> {
    const [jokeLike] = await this.jokesLikesModel.getJokesLikes({
      jokeId,
      userId,
    });
    let callbackMessage = "Disliked";

    if (jokeLike && jokeLike.isLike === false) {
      await this.jokesLikesModel.removeJokesLikes([jokeLike.id]);
      callbackMessage = "Dislike removed";
    } else if (jokeLike && jokeLike.isLike === true) {
      await this.jokesLikesModel.removeJokesLikes([jokeLike.id]);
      await this.jokesLikesModel.addJokeLike({ jokeId, userId, isLike: false });
    } else {
      await this.jokesLikesModel.addJokeLike({ jokeId, userId, isLike: false });
    }

    await this.updateJokeMessage(jokeId, chatId, messageId, botToken);
    await this.telegramService.answerCallbackQuery(
      botToken,
      callbackQueryId,
      callbackMessage
    );
  }

  public async updateJokeMessage(
    jokeId: number,
    chatId: number,
    messageId: number,
    botToken: string,
    callbackQueryId?: string
  ): Promise<void> {
    try {
      const [joke] = await this.jokesModel.getJokes({ ids: [jokeId] });
      if (joke) {
        const likes = await this.jokesLikesModel.getJokesLikes({ jokeId });
        const rating =
          likes.reduce((sum, like) => sum + (like.isLike ? +1 : -1), 0) ?? 0;
        const likesCount =
          likes.reduce(
            (sum, like) => sum + (like.isLike === true ? +1 : 0),
            0
          ) ?? 0;
        const dislikesCount =
          likes.reduce(
            (sum, like) => sum + (like.isLike === false ? +1 : 0),
            0
          ) ?? 0;
        const markup = this.getJokeMarkup(
          rating,
          jokeId,
          likesCount,
          dislikesCount
        );
        await this.telegramService.editMessageText(
          botToken,
          chatId,
          messageId,
          joke.text,
          markup
        );
      }
    } catch (err) {
      const methodName = this.updateJokeMessage.name;
      if (err instanceof ApiError) {
        this.logger.errorLog(`Error while ${methodName}: ${err.message}`);
      }
    } finally {
      if (callbackQueryId) {
        await this.telegramService.answerCallbackQuery(
          botToken,
          callbackQueryId,
          "Rating updated"
        );
      }
    }
  }

  public async findJokeAndSend(
    botToken: string,
    chatId: number,
    text: string
  ): Promise<void> {
    const jokes = await this.getJokes({ text });

    if (jokes && jokes[0]) {
      await this.sendJoke(botToken, chatId, jokes[0]);
      this.eventBus.publish(EventName.find_joke_send, {
        chatId,
        jokeId: jokes[0].id,
      });
    } else {
      await this.telegramService.sendTextMessage(
        botToken,
        chatId,
        "Я не нашел ниче, по другому введи как-нибудь"
      );
    }
  }

  public async sendJokesRating(
    botToken: string,
    chatId: number
  ): Promise<void> {
    const query =
      "select joke_id, sum(case when is_like then 1 else -1 end) as rating from jokes_likes group by joke_id order by rating desc";
    const { rows } = await this.postgres.customQuery<JokeIdWithRatingDb>(query);

    if (rows.length) {
      const ratingMessage = (
        await Promise.all(
          rows.map(async (row, index) => {
            const [joke] = await this.getJokes({ ids: [row.joke_id] });
  
            if (joke) {
              return `${index + 1}. ${joke.text.substring(0, 40)}... (${
                row.rating
              })`;
            }
            return `${index + 1}. Текст шутки не найден... (${row.rating})`;
          })
        )
      ).join("\n");
      await this.telegramService.sendTextMessage(botToken, chatId, ratingMessage);
      this.eventBus.publish(EventName.joke_rating_send, {
        chatId,
      });
    } else {
      await this.telegramService.sendTextMessage(botToken, chatId, 'No jokes in db :(');
    }
  }
}

diContainer.registerDependencies(JokesService, [
  TelegramService,
  JokesLikesModel,
  JokesModel,
  Logger,
  Postgres,
  EventBus,
]);

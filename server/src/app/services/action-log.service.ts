import { diContainer } from "app/core/di-container";
import { EventBus } from "app/core/event-bus";
import {
  ActionLog,
  FilterActionLog,
  NewActionLog,
} from "app/interfaces/action-log.interfaces";
import { EventName } from "app/interfaces/event-bus.interfaces";
import { ActionLogModel } from "app/models/action-log.model";

export class ActionLogService {
  constructor(
    private actionLogModel: ActionLogModel,
    private eventBus: EventBus
  ) {
    this.eventBus.subscribe(EventName.bot_added, async (bot) => {
      await this.addActionLog({
        type: "BOT_ADDED",
        details: `Bot with username: ${bot.username} added`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.bot_removed, async (id) => {
      await this.addActionLog({
        type: "BOT_DELETED",
        details: `Bot with id: ${id} removed`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.bot_updated, async (bot) => {
      await this.addActionLog({
        type: "BOT_UPDATED",
        details: `Bot with id: ${bot.id} updated`,
        date: new Date(),
      });
    });

    this.eventBus.subscribe(EventName.chat_added, async (chat) => {
      await this.addActionLog({
        type: "CHAT_ADDED",
        details: `Chat with name: ${chat.name} added`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.chats_removed, async (ids) => {
      await this.addActionLog({
        type: "CHAT_DELETED",
        details: `Chats with ids: ${ids.join(",")} deleted`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.chat_updated, async (chat) => {
      await this.addActionLog({
        type: "CHAT_UPDATED",
        details: `Chat with name: ${chat.name} updated`,
        date: new Date(),
      });
    });

    this.eventBus.subscribe(EventName.rule_added, async (rule) => {
      await this.addActionLog({
        type: "RULE_CREATED",
        details: `Rule with name: ${rule.name} created`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.rules_removed, async (ids) => {
      await this.addActionLog({
        type: "RULE_DELETED",
        details: `Rules with ids: ${ids.join(",")} deleted`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.rule_updated, async (rule) => {
      await this.addActionLog({
        type: "RULE_UPDATED",
        details: `Rule with name: ${rule.name} updated`,
        date: new Date(),
      });
    });

    this.eventBus.subscribe(EventName.joke_created, async (joke) => {
      await this.addActionLog({
        type: "JOKE_CREATED",
        details: `Joke with id: ${joke.id} created`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.jokes_deleted, async (ids) => {
      await this.addActionLog({
        type: "JOKE_DELETED",
        details: `Jokes with ids: ${ids.join(",")} deleted`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.joke_updated, async (joke) => {
      await this.addActionLog({
        type: "JOKE_UPDATED",
        details: `Joke with id: ${joke.id} updated`,
        date: new Date(),
      });
    });

    this.eventBus.subscribe(EventName.message_send, async (data) => {
      await this.addActionLog({
        type: "MESSAGE_SEND",
        details: `Message send to chat id: ${data.chatId} with text: ${data.message}`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.sticker_send, async (data) => {
      await this.addActionLog({
        type: "STICKER_SEND",
        details: `Sticker with id: ${data.stickerId} send to chat: ${data.chatId}`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.emoji_reaction_send, async (data) => {
      await this.addActionLog({
        type: "EMOJI_REACTION_SEND",
        details: `Emoji reaction ${data.emoji} set to message id: ${data.messageId} in chat id: ${data.chatId}`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.random_joke_send, async (data) => {
      await this.addActionLog({
        type: "RANDOM_JOKE_SEND",
        details: `Random joke command send joke id: ${data.jokeId} to chat id: ${data.chatId}`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.find_joke_send, async (data) => {
      await this.addActionLog({
        type: "FIND_JOKE_SEND",
        details: `Find joke command send joke id: ${data.jokeId} to chat id: ${data.chatId}`,
        date: new Date(),
      });
    });
    this.eventBus.subscribe(EventName.joke_rating_send, async (data) => {
      await this.addActionLog({
        type: "JOKE_RATING_SEND",
        details: `Joke rating command send to chat id: ${data.chatId}`,
        date: new Date(),
      });
    });
  }

  public async getActionLogs(filter: FilterActionLog): Promise<ActionLog[]> {
    return await this.actionLogModel.getActionLogs(filter);
  }

  public async addActionLog(
    newActionLog: NewActionLog
  ): Promise<ActionLog | null> {
    return await this.actionLogModel.addActionLog(newActionLog);
  }

  public async removeActionLogs(actionLogsIds: number[]): Promise<number[]> {
    const removedActionLogs = await this.actionLogModel.removeActionLogs(
      actionLogsIds
    );
    return removedActionLogs.map((log) => log.id);
  }
}

diContainer.registerDependencies(ActionLogService, [ActionLogModel, EventBus]);

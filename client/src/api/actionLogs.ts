import { baseUrl } from "./baseUrl";
import { parseResponse } from "./parseResponse";

export enum ActionLogType {
  MESSAGE_SEND = "MESSAGE_SEND",
  STICKER_SEND = "STICKER_SEND",
  EMOJI_REACTION_SEND = "EMOJI_REACTION_SEND",
  RANDOM_JOKE_SEND = "RANDOM_JOKE_SEND",
  FIND_JOKE_SEND = "FIND_JOKE_SEND",
  JOKE_RATING_SEND = "JOKE_RATING_SEND",
  BOT_ADDED = "BOT_ADDED",
  BOT_DELETED = "BOT_DELETED",
  BOT_UPDATED = "BOT_UPDATED",
  CHAT_ADDED = "CHAT_ADDED",
  CHAT_DELETED = "CHAT_DELETED",
  CHAT_UPDATED = "CHAT_UPDATED",
  RULE_CREATED = "RULE_CREATED",
  RULE_DELETED = "RULE_DELETED",
  RULE_UPDATED = "RULE_UPDATED",
  JOKE_CREATED = "JOKE_CREATED",
  JOKE_DELETED = "JOKE_DELETED",
  JOKE_UPDATED = "JOKE_UPDATED",
}

export interface ServerActionLog {
  id: number;
  type: ActionLogType;
  details: string;
  date: Date;
}

export async function getActionLogs(): Promise<ServerActionLog[]> {
  const path = baseUrl + "/getActionLogs";

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return await parseResponse(response);
    }
  } catch (err) {
    throw err;
  }
}

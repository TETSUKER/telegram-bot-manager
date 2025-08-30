import { Bot } from './bot.interfaces';
import { Chat } from './chat.interfaces';
import { Joke } from './joke.interfaces';
import { Rule } from './rule.interfaces';

export type EventHandler<Key extends EventName> = (data: EventData[Key]) => void;

export enum EventName {
  bot_added = 'bot_added',
  bot_removed = 'bot_removed',
  rule_added = 'rule_added',
  rules_removed = 'rules_removed',
  rule_updated = 'rule_updated',
  added_rules_to_bot = 'added_rules_to_bot',
  removed_rules_from_bot = 'removed_rules_from_bot',
  updated_rule_in_bot = 'updated_rule_in_bot',
  chats_removed = 'chats_removed',
  chat_added = 'chat_added',
  chat_updated = 'chat_updated',
  joke_created = 'joke_created',
  joke_updated = 'joke_updated',
  jokes_deleted = 'jokes_deleted',
  message_send = 'message_send',
  sticker_send = 'sticker_send',
  emoji_reaction_send = 'emoji_reaction_send',
  random_joke_send = 'random_joke_send',
  find_joke_send = 'find_joke_send',
  joke_rating_send = 'joke_rating_send',
}

export interface EventData {
  [EventName.bot_added]: Bot,
  [EventName.bot_removed]: number,
  [EventName.rule_added]: Rule,
  [EventName.rules_removed]: number[],
  [EventName.rule_updated]: Rule,
  [EventName.added_rules_to_bot]: {
    ruleIds: number[],
    botId: number,
  },
  [EventName.removed_rules_from_bot]: {
    ruleIds: number[],
    botId: number,
  },
  [EventName.updated_rule_in_bot]: {
    rule: Rule,
    botId: number,
  },
  [EventName.chats_removed]: number[],
  [EventName.chat_added]: Chat,
  [EventName.chat_updated]: Chat,
  [EventName.joke_created]: Joke,
  [EventName.joke_updated]: Joke,
  [EventName.jokes_deleted]: number[],
  [EventName.message_send]: {
    chatId: number;
    message: string;
  },
  [EventName.sticker_send]: {
    chatId: number;
    stickerId: string;
  },
  [EventName.emoji_reaction_send]: {
    chatId: number;
    messageId: number;
    emoji: string;
  },
  [EventName.random_joke_send]: {
    chatId: number;
    jokeId: number;
  },
  [EventName.find_joke_send]: {
    chatId: number;
    jokeId: number;
  },
  [EventName.joke_rating_send]: {
    chatId: number;
  },
}

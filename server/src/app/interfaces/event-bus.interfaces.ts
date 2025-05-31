import { Bot } from './bot.interfaces';
import { Rule } from './rule.interfaces';

export type EventHandler<Key extends EventName> = (data: EventData[Key]) => void;

export enum EventName {
  bot_added = 'bot_added',
  bot_removed = 'bot_removed',
  rule_added = 'rule_added',
  rules_removed = 'rules_removed',
  added_rules_to_bot = 'added_rules_to_bot',
  removed_rules_from_bot = 'removed_rules_from_bot',
  updated_rule_in_bot = 'updated_rule_in_bot',
  chats_removed = 'chats_removed',
}

export interface EventData {
  [EventName.bot_added]: Bot,
  [EventName.bot_removed]: number,
  [EventName.rule_added]: Rule,
  [EventName.rules_removed]: number[],
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
}

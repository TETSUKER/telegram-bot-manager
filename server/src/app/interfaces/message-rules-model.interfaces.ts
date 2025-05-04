export type MessageCondition =
  | { type: 'regex', pattern: string }
  | { type: 'length', operator: '>' | '<' | '>=' | '<=' | '=', value: number }
  | { type: 'command', name: string, minArgs?: number, maxArgs?: number }

export type MessageResponse =
  | { type: 'message', text: string, reply: boolean }
  | { type: 'sticker', stickerId: string, reply: boolean }
  | { type: 'emoji', emoji: string }

export interface NewMessageRule {
  name: string;
  condition: MessageCondition;
  response: MessageResponse;
  probability?: number;
}

export interface MessageRule extends NewMessageRule {
  id: number;
}

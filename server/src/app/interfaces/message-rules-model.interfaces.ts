export type MessageCondition =
  | { type: 'regex', pattern: string }
  | { type: 'length', operator: '>' | '<' | '>=' | '<=' | '=', value: number }
  | { type: 'command', name: string, minArgs?: number, maxArgs?: number }

export type MessageResponse =
  | { type: 'message', text: string, reply: boolean }
  | { type: 'sticker', stickerId: number }
  | { type: 'gif', gifId: number }
  | { type: 'emoji', emoji: string }

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export interface NewMessageRule {
  name: string;
  condition: MessageCondition;
  response: MessageResponse;
  probability?: IntRange<0, 101>;
}

export interface MessageRule extends NewMessageRule {
  id: number;
}

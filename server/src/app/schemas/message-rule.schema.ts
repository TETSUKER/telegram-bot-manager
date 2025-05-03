import { z } from 'zod';

const MessageConditionSchema = z.union([
  z.object({
    type: z.literal("regex"),
    pattern: z.string().min(1, "Паттерн не может быть пустым"),
  }),
  z.object({
    type: z.literal("length"),
    operator: z.enum([">", "<", ">=", "<=", "="]),
    value: z.number().int().nonnegative("Значение должно быть ≥ 0"),
  }),
  z.object({
    type: z.literal("command"),
    name: z.string().min(1, "Имя команды обязательно"),
    minArgs: z.number().int().nonnegative().optional(),
    maxArgs: z.number().int().nonnegative().optional(),
  }),
]);

const MessageResponseSchema = z.union([
  z.object({
    type: z.literal('message'),
    text: z.string().min(1, 'Need text'),
    reply: z.boolean(),
  }),
  z.object({
    type: z.literal('length'),
    stickerId: z.number().min(1).max(100),
  }),
  z.object({
    type: z.literal('gif'),
    gifId: z.number().min(1).max(100),
  }),
  z.object({
    type: z.literal('emoji'),
    emoji: z.string().min(1).max(100),
  })
]);

export const MessageRuleSchema = z.object({
  name: z.string().min(3).max(30),
  condition: MessageConditionSchema,
  response: MessageResponseSchema,
  probability: z.number().min(0).max(100),
});

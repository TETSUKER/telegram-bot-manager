import { z, ZodType } from 'zod';
import { NewRule, RuleCondition, RuleResponse, Rule, FilterRuleApi, UpdateRuleApi } from 'app/interfaces/rule.interfaces';

const MessageConditionSchema: ZodType<RuleCondition> = z.union([
  z.object({
    type: z.literal('regex'),
    pattern: z.string().min(1, 'Паттерн не может быть пустым'),
  }),
  z.object({
    type: z.literal('length'),
    operator: z.enum(['>', '<', '>=', '<=', '=']),
    value: z.number().int().nonnegative('Значение должно быть ≥ 0'),
  }),
  z.object({
    type: z.literal('command'),
    name: z.string().min(1, 'Имя команды обязательно'),
    minArgs: z.number().int().nonnegative().optional(),
    maxArgs: z.number().int().nonnegative().optional(),
  }),
  z.object({
    type: z.literal('schedule'),
    schedule: z.object({
      type: z.literal('weekly'),
      dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      hour: z.number(),
      minute: z.number(),
    }),
    scheduleChatIds: z.array(z.number()),
  }),
  z.object({
    type: z.literal('schedule'),
    schedule: z.object({
      type: z.literal('annually'),
      day: z.number(),
      month: z.number(),
      hour: z.number(),
      minute: z.number(),
    }),
    scheduleChatIds: z.array(z.number()),
  }),
  z.object({
    type: z.literal('schedule'),
    schedule: z.object({
      type: z.literal('daily'),
      hour: z.number(),
      minute: z.number(),
    }),
    scheduleChatIds: z.array(z.number()),
  }),
]);

const MessageResponseSchema: ZodType<RuleResponse> = z.union([
  z.object({
    type: z.literal('message'),
    text: z.string().min(1, 'Need text'),
    reply: z.boolean(),
  }),
  z.object({
    type: z.literal('sticker'),
    stickerId: z.string().min(1).max(100),
    reply: z.boolean()
  }),
  z.object({
    type: z.literal('emoji'),
    emoji: z.string().min(1).max(100),
  }),
  z.object({
    type: z.literal('random_joke'),
  }),
  z.object({
    type: z.literal('find_joke'),
  }),
  z.object({
    type: z.literal('joke_rating'),
  }),
  z.object({
    type: z.literal('get_joke_by_id'),
  }),
]);

export const NewRuleSchema = z.object({
  name: z.string().min(3).max(30),
  condition: MessageConditionSchema,
  response: MessageResponseSchema,
  probability: z.number().min(0).max(100).nullable(),
}) satisfies ZodType<NewRule>;

export const RuleSchema = NewRuleSchema.extend({
  id: z.number()
}) satisfies ZodType<Rule>;

export const FilterRuleSchema = z.object({
  ids: z.array(z.number()).optional(),
  names: z.array(z.string()).optional(),
  conditionTypes: z.array(z.enum(['regex', 'length', 'command'])).optional(),
  responseTypes: z.array(z.enum(['message', 'sticker', 'emoji', 'joke'])).optional(),
  scheduleChatIds: z.array(z.number()).optional(),
}) satisfies ZodType<FilterRuleApi>;

export const UpdateRuleSchema = z.object({
  id: z.number(),
  condition: MessageConditionSchema.optional(),
  response: MessageResponseSchema.optional(),
  probability: z.number().min(0).max(100).nullable().optional(),
}) satisfies ZodType<UpdateRuleApi>;

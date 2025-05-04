import { z, ZodType } from 'zod';
import { Bot, NewBot } from 'app/interfaces/bot-model.interfaces';

export const NewBotSchema = z.object({
  username: z.string(),
  token: z.string(),
}) satisfies ZodType<NewBot>;

export const BotSchema = NewBotSchema.extend({
  id: z.number(),
  ruleIds: z.array(z.number()),
  lastUpdateId: z.number(),
}) satisfies ZodType<Bot>;

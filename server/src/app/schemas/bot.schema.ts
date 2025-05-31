import { z, ZodType } from 'zod';
import { UpdateBotApi, CreateBotApi, FilterBotApi } from 'app/interfaces/bot.interfaces';

export const NewBotSchema = z.object({
  token: z.string(),
}) satisfies ZodType<CreateBotApi>;

export const UpdateBotSchema = z.object({
  id: z.number(),
  ruleIds: z.array(z.number()),
}) satisfies ZodType<UpdateBotApi>;

export const FilterBotSchema = z.object({
  ids: z.array(z.number()).optional(),
  usernames: z.array(z.string()).optional(),
  ruleIds: z.array(z.number()).min(1).optional(),
}) satisfies ZodType<FilterBotApi>;

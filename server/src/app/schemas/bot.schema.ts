import { z, ZodType } from 'zod';
import { UpdateBotApi, CreateBotApi } from 'app/interfaces/bot.interfaces';

export const NewBotSchema = z.object({
  token: z.string(),
}) satisfies ZodType<CreateBotApi>;

export const UpdateBotSchema = z.object({
  id: z.number(),
  ruleIds: z.array(z.number()),
}) satisfies ZodType<UpdateBotApi>;

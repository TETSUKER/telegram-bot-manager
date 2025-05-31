import { FilterChatApi, NewChatApi, UpdateChatApi } from 'app/interfaces/chat.interfaces';
import { z, ZodType } from 'zod';

export const FilterChatSchema = z.object({
  ids: z.array(z.number()).optional(),
  names: z.array(z.string()).optional(),
}) satisfies ZodType<FilterChatApi>;

export const NewChatSchema = z.object({
  chatId: z.string(),
  name: z.string(),
}) satisfies ZodType<NewChatApi>;

export const UpdateChatSchema = z.object({
  id: z.number(),
  chatId: z.string().optional(),
  name: z.string().optional(),
}) satisfies ZodType<UpdateChatApi>;

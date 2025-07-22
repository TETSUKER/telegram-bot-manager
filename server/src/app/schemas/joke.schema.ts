import { FilterJokeApi, NewJoke, UpdateJokeApi } from 'app/interfaces/joke.interfaces';
import { z, ZodType } from 'zod';

export const FilterJokeSchema = z.object({
  ids: z.array(z.number()).optional(),
  text: z.string().optional(),
  sendedChatIds: z.object({
    ids: z.array(z.string()),
    exclude: z.boolean(),
  }).optional(),
}) satisfies ZodType<FilterJokeApi>;

export const NewJokeSchema = z.object({
  text: z.string(),
}) satisfies ZodType<NewJoke>;

export const UpdateJokeSchema = z.object({
  id: z.number(),
  text: z.string().optional(),
  sendedChatIds: z.array(z.string()).optional(),
}) satisfies ZodType<UpdateJokeApi>;

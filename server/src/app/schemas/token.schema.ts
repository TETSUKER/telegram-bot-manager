import { z } from 'zod';

export const TokenSchema = z.object({
  token: z.string().min(1).max(1000),
});

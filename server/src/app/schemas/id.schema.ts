import { z } from 'zod';

export const IdSchema = z.object({
  id: z.number().min(0).max(100),
});

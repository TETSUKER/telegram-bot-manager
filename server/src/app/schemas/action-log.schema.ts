import {
  FilterActionLog,
} from "app/interfaces/action-log.interfaces";
import { z, ZodType } from "zod";

export const FilterActionLogSchema = z.object({
  ids: z.array(z.number()).optional(),
  types: z
    .array(
      z.enum([
        "MESSAGE_SEND",
        "STICKER_SEND",
        "EMOJI_REACTION_SEND",
        "RANDOM_JOKE_SEND",
        "FIND_JOKE_SEND",
        "JOKE_RATING_SEND",
        "BOT_ADDED",
        "BOT_DELETED",
        "BOT_UPDATED",
        "CHAT_ADDED",
        "CHAT_DELETED",
        "CHAT_UPDATED",
        "RULE_CREATED",
        "RULE_DELETED",
        "RULE_UPDATED",
        "JOKE_CREATED",
        "JOKE_DELETED",
        "JOKE_UPDATED",
      ])
    )
    .optional(),
}) satisfies ZodType<FilterActionLog>;

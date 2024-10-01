import { z } from "zod";

export const QueryValidator = z.object({
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IQueryValidator extends z.infer<typeof QueryValidator> {}

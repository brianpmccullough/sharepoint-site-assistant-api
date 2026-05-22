import { tool } from "@openai/agents";
import { z } from "zod";

export const currentDateTimeTool = tool({
  name: "current_date_time",
  description: "Returns the current UTC date and time in ISO 8601 format",
  parameters: z.object({}),
  execute: () => new Date().toISOString(),
});

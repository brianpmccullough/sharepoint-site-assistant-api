import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import type { AgentInputItem } from "@openai/agents";

export class ChatRequest {
  @ApiProperty({ description: "The user message for this turn" })
  @IsString()
  message: string = "";

  @ApiPropertyOptional({
    description:
      "Client-generated identifier for this conversation thread, used for logging",
  })
  @IsOptional()
  @IsString()
  threadId?: string;

  @ApiPropertyOptional({
    description:
      "Message history from the previous turn, as returned in the done event. Omit on the first turn.",
    type: "array",
    items: { type: "object" },
  })
  @IsOptional()
  @IsArray()
  previousMessages?: AgentInputItem[];
}

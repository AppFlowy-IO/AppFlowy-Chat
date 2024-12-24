import { AIModelName, SelectOption } from "@/types";

export const AIModelOptions: SelectOption<AIModelName>[] = [
  { name: "Default", value: "default", shortName: "" },
  { name: "Caude 3 Opus", value: "claude_3_opus", shortName: "opus" },
  { name: "Caude 3 Sonnet", value: "claude_3_sonnet", shortName: "sonnet" },
  { name: "GPT-4o-mini", value: "gpt_4omini", shortName: "4o-mini" },
  { name: "GPT-4o", value: "gpt_4o", shortName: "4o" },
];

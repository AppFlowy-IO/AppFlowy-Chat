import { ChatAuthorType, ChatMessage } from "@/types/ai";

function generateChatMessage(index: number): ChatMessage {
  if (index % 2) {
    // AI
    return {
      author: {
        author_id: 1,
        author_type: ChatAuthorType.AI,
      },
      message_id: 1000 + index,
      content: `# Heading 1
## Heading 2
### Heading 3`,
      created_at: new Date(),
      meta_data: {},
      reply_message_id: 100 + index - 1,
    };
  } else {
    // HUMAN
    return {
      author: {
        author_id: 1,
        author_type: ChatAuthorType.Human,
      },
      message_id: 100 + index,
      content: `MSG:${index}.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      created_at: new Date(),
      meta_data: {},
      reply_message_id: null,
    };
  }
}

export const MockChatMessages: ChatMessage[] = (() => {
  const amountOfMessages = 100;

  const result: ChatMessage[] = [];

  for (let index = 0; index < amountOfMessages; index++) {
    result.push(generateChatMessage(index));
  }

  return result;
})();

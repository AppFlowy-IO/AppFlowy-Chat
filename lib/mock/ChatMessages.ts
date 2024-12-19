import { ChatAuthorType, ChatMessage } from '@appflowy-chat/types/ai';

function generateChatMessage(index: number): ChatMessage {
  if (index % 2) {
    // AI
    return {
      author: {
        author_id: 1,
        author_type: ChatAuthorType.AI,
      },
      message_id: 1000 + index,
      content: `MSG:${index}. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.`,
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

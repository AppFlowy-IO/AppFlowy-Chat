/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { MockChatHttpService } from './mock_http_service';
import {
  ChatMessageType,
  CreateChatMessageParams,
  MessageCursor,
  QuestionStream,
  RepeatedChatMessage,
} from '@/types/ai';
import { beforeEach, describe, expect, test } from '@jest/globals';

describe('MockChatHttpService - Create and Get Messages', () => {
  let chatService: MockChatHttpService;

  beforeEach(() => {
    chatService = new MockChatHttpService();
    // Create a test chat and add some messages
    const chatParams = {
      chat_id: 'chat1',
      name: 'Test Chat',
      rag_ids: [],
    };
    chatService.createChat('workspace1', chatParams);

    // Add 5 messages to the chat with message type
    for (let i = 0; i < 5; i++) {
      const params = {
        content: `Message ${i + 1}`,
        message_type: ChatMessageType.User, // Adding message_type as User
      } as CreateChatMessageParams;
      chatService.sendMessage('workspace1', 'chat1', params);
    }
  });

  // --- Test 1: Create Message ---
  test('should create a new message with message_type and add it to the chat', async () => {
    const params: CreateChatMessageParams = {
      content: 'Hello, world!',
      message_type: ChatMessageType.User,
    };
    const response = await chatService.sendMessage(
      'workspace1',
      'chat1',
      params
    );

    expect(response.isSuccess()).toBe(true);
    expect(response.data).toBeTruthy();
    expect(response.data?.content).toBe('Hello, world!');

    const chat = chatService['chatMap'].get('chat1');
    expect(chat?.messages.length).toBe(6); // There should be 6 messages now
    expect(chat?.messages[5].content).toBe('Hello, world!');
  });

  test('should return error when creating a message for a non-existent chat', async () => {
    const params: CreateChatMessageParams = {
      content: 'This should fail!',
      message_type: ChatMessageType.User,
    };
    const response = await chatService.sendMessage(
      'workspace1',
      'nonexistent_chat',
      params
    );

    expect(response.isError()).toBe(true);
    expect(response.error?.message).toBe('Chat not found');
  });

  // --- Test 2: Get Messages (Offset Cursor) ---
  test('should get messages successfully with offset cursor', async () => {
    const cursor: MessageCursor = { type: 'Offset', value: 0 };
    const limit = 3;
    const response = await chatService.getChatMessages(
      'workspace1',
      'chat1',
      cursor,
      limit
    );

    expect(response.isSuccess()).toBe(true);
    const repeatedChatMessage: RepeatedChatMessage | null = response.data;
    expect(repeatedChatMessage?.messages.length).toBe(limit);
    expect(repeatedChatMessage?.messages[0].content).toBe('Message 1');
    expect(repeatedChatMessage?.has_more).toBe(true); // There are more messages to fetch
    expect(repeatedChatMessage?.total).toBe(5); // Total number of messages in the chat
  });

  // --- Test 3: Get Messages (AfterMessageId Cursor) ---
  test('should get messages successfully with AfterMessageId cursor', async () => {
    const chat = chatService['chatMap'].get('chat1');
    const cursor: MessageCursor = {
      type: 'AfterMessageId',
      value: chat?.messages[2].message_id!,
    }; // After message 3
    const limit = 2;
    const response = await chatService.getChatMessages(
      'workspace1',
      'chat1',
      cursor,
      limit
    );

    expect(response.isSuccess()).toBe(true);
    const repeatedChatMessage: RepeatedChatMessage | null = response.data;
    expect(repeatedChatMessage?.messages.length).toBe(limit);
    expect(repeatedChatMessage?.messages[0].content).toBe('Message 4');
    expect(repeatedChatMessage?.messages[1].content).toBe('Message 5');
    expect(repeatedChatMessage?.has_more).toBe(false); // No more messages after this
    expect(repeatedChatMessage?.total).toBe(5); // Total number of messages in the chat
  });

  // --- Test 4: Get Messages (BeforeMessageId Cursor) ---
  test('should get messages successfully with BeforeMessageId cursor', async () => {
    const chat = chatService['chatMap'].get('chat1');
    const cursor: MessageCursor = {
      type: 'BeforeMessageId',
      value: chat?.messages[3].message_id!,
    }; // Before message 4
    const limit = 3;
    const response = await chatService.getChatMessages(
      'workspace1',
      'chat1',
      cursor,
      limit
    );

    expect(response.isSuccess()).toBe(true);
    const repeatedChatMessage: RepeatedChatMessage | null = response.data;
    expect(repeatedChatMessage?.messages.length).toBe(limit);
    expect(repeatedChatMessage?.messages[0].content).toBe('Message 1');
    expect(repeatedChatMessage?.messages[1].content).toBe('Message 2');
    expect(repeatedChatMessage?.messages[2].content).toBe('Message 3');
    expect(repeatedChatMessage?.has_more).toBe(true); // There are more messages before this
    expect(repeatedChatMessage?.total).toBe(5); // Total number of messages in the chat
  });

  // --- Test 5: Get Messages (Invalid Cursor Type) ---
  test('should return error when using an unsupported cursor type', async () => {
    const cursor: MessageCursor = { type: 'NextBack' };
    const limit = 3;
    const response = await chatService.getChatMessages(
      'workspace1',
      'chat1',
      cursor,
      limit
    );

    expect(response.isError()).toBe(true);
    expect(response.error?.message).toBe(
      'NextBack cursor type is not fully implemented'
    );
  });

  // --- Test 6: Get Messages (Chat Not Found) ---
  test('should return error when trying to get messages for a non-existent chat', async () => {
    const cursor: MessageCursor = { type: 'Offset', value: 0 };
    const limit = 3;
    const response = await chatService.getChatMessages(
      'workspace1',
      'nonexistent_chat',
      cursor,
      limit
    );

    expect(response.isError()).toBe(true);
    expect(response.error?.message).toBe('Chat not found');
  });

  // --- Test 7: Get Messages (Message Not Found in AfterMessageId Cursor) ---
  test('should return error if message id not found in AfterMessageId cursor', async () => {
    const cursor: MessageCursor = { type: 'AfterMessageId', value: 9999 }; // Invalid message ID
    const limit = 3;
    const response = await chatService.getChatMessages(
      'workspace1',
      'chat1',
      cursor,
      limit
    );

    expect(response.isError()).toBe(true);
    expect(response.error?.message).toBe('Message not found');
  });

  // --- Test 8: Stream Message Response ---
  test('should stream a message response successfully', async () => {
    const chat = chatService['chatMap'].get('chat1');
    const message = chat?.messages[1]; // Message with ID 1
    if (!message) {
      throw new Error('Message not found');
    }

    const response = await chatService.streamMessageResponse(
      'workspace1',
      'chat1',
      message.message_id
    );

    expect(response.isSuccess()).toBe(true);
    expect(response.data).toBeInstanceOf(QuestionStream);
    const streamData = [];
    for await (const chunk of response.data!) {
      streamData.push(chunk);
    }
    expect(streamData.length).toBeGreaterThan(0); // Ensure there are chunks in the stream
    const expectedStreamData = [
      { '1': 'Streamed answer for message 1' },
      { '0': { meta: 'Metadata for message 1' } },
      { '1': 'Another streamed answer for message 1' },
      { '0': { meta: 'Additional metadata for message 1' } },
    ];

    // Ensure the stream data matches the expected structure
    expect(streamData).toEqual(expectedStreamData);
  });
});

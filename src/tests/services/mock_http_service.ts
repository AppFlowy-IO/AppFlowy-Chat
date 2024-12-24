import { Response } from '@/types/response';
import {
  ChatSettings,
  CreateChatParams,
  UpdateChatParams,
  CreateChatMessageParams,
  ChatMessage,
  QuestionStream,
  RelatedQuestion,
  MessageCursor,
  RepeatedChatMessage,
  ChatAuthor,
  ChatAuthorType,
  JSONValue,
  STREAM_ANSWER_KEY,
  STREAM_METADATA_KEY,
} from '@/types/ai';
import { ChatError } from '@/types/error';
import { ErrorCode } from '@/types/error';
import { ChatHttpService } from '@/types/http_service';
import { MockChatMessages } from '@appflowy-chat/mock/ChatMessages';
class MockChat {
  settings: ChatSettings;
  messages: ChatMessage[];

  constructor(settings: ChatSettings, messages: ChatMessage[]) {
    this.settings = settings;
    this.messages = messages;
  }
}

// Create a mock implementation of the ChatHttpService
export class MockChatHttpService extends ChatHttpService {
  message_id_counter: number = 0;
  // create a map to store the chat id and chat object
  private chatMap: Map<string, MockChat> = new Map();

  constructor() {
    super();

    this.chatMap.set(
      'test-1',
      new MockChat(
        { metadata: '', name: 'Test 1', rag_ids: [] },
        MockChatMessages
      )
    );
  }
  nextMessageId(): number {
    return this.message_id_counter++;
  }

  createChat(
    _workspace_id: string,
    params: CreateChatParams
  ): Promise<Response<void>> {
    if (!params.chat_id) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.InvalidRequest, 'Chat ID is required')
        )
      );
    }
    const settings = {
      chat_id: params.chat_id,
      name: params.name,
      rag_ids: params.rag_ids,
      metadata: {},
    } as ChatSettings;
    this.chatMap.set(params.chat_id, new MockChat(settings, []));
    return Promise.resolve(Response.fromSuccess(undefined));
  }

  deleteChat(_workspace_id: string, chat_id: string): Promise<Response<void>> {
    if (!this.chatMap.has(chat_id)) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Chat not found')
        )
      );
    }
    this.chatMap.delete(chat_id);
    return Promise.resolve(Response.fromSuccess(undefined));
  }

  updateChatSettings(
    _workspace_id: string,
    chat_id: string,
    params: UpdateChatParams
  ): Promise<Response<void>> {
    const chatSettings = this.chatMap.get(chat_id);
    if (!chatSettings) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Chat not found')
        )
      );
    }

    // return error if all params are null
    if (
      params.name === null &&
      params.rag_ids === null &&
      params.metadata === null
    ) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.InvalidRequest, 'All parameters are null')
        )
      );
    }

    if (params.name !== null) {
      chatSettings.settings.name = params.name;
    }
    if (params.rag_ids !== null) {
      chatSettings.settings.rag_ids = params.rag_ids;
    }
    if (params.metadata !== null) {
      chatSettings.settings.metadata = params.metadata;
    }

    return Promise.resolve(Response.fromSuccess(undefined));
  }

  getChatSettings(
    _workspace_id: string,
    chat_id: string
  ): Promise<Response<ChatSettings | null>> {
    const chatSettings = this.chatMap.get(chat_id);
    if (!chatSettings) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Chat not found')
        )
      );
    }
    return Promise.resolve(Response.fromSuccess(chatSettings.settings));
  }

  getChatMessages(
    _workspace_id: string,
    chat_id: string,
    cursor: MessageCursor,
    limit: number
  ): Promise<Response<RepeatedChatMessage | null>> {
    const chat = this.chatMap.get(chat_id);
    if (!chat) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Chat not found')
        )
      );
    }

    let startIndex: number | null = null;
    let endIndex: number | null = null;

    switch (cursor.type) {
      case 'Offset':
        // Return messages starting from the specified offset
        startIndex = cursor.value;
        endIndex = startIndex + limit;
        break;

      case 'AfterMessageId':
        // Find the message with the specified ID and return messages after it
        startIndex = chat.messages.findIndex(
          (msg) => msg.message_id === cursor.value
        );
        if (startIndex === -1) {
          return Promise.resolve(
            Response.fromError(
              new ChatError(ErrorCode.RecordNotFound, 'Message not found')
            )
          );
        }
        startIndex += 1; // Start after the given message ID
        endIndex = startIndex + limit;
        break;

      case 'BeforeMessageId':
        // Find the message with the specified ID and return messages before it
        startIndex = chat.messages.findIndex(
          (msg) => msg.message_id === cursor.value
        );
        if (startIndex === -1) {
          return Promise.resolve(
            Response.fromError(
              new ChatError(ErrorCode.RecordNotFound, 'Message not found')
            )
          );
        }
        endIndex = startIndex; // End at the specified message ID
        startIndex = Math.max(0, endIndex - limit); // Ensure we don't go out of bounds
        break;

      case 'NextBack':
        // Assuming "NextBack" indicates pagination and we don't have enough context to infer the direction
        return Promise.resolve(
          Response.fromError(
            new ChatError(
              ErrorCode.InvalidRequest,
              'NextBack cursor type is not fully implemented'
            )
          )
        );
    }

    // Slice the messages array based on calculated indices
    const messagesToReturn = chat.messages.slice(startIndex, endIndex);

    // Check if there are more messages available after this slice
    const hasMore = endIndex < chat.messages.length;

    // Return the response in the format of RepeatedChatMessage
    const repeatedChatMessage: RepeatedChatMessage = {
      messages: messagesToReturn,
      has_more: hasMore,
      total: chat.messages.length, // Total number of messages
    };

    return Promise.resolve(Response.fromSuccess(repeatedChatMessage));
  }

  sendMessage(
    _workspace_id: string,
    chat_id: string,
    params: CreateChatMessageParams
  ): Promise<Response<ChatMessage | null>> {
    const chat = this.chatMap.get(chat_id);
    if (!chat) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Chat not found')
        )
      );
    }

    const author = {
      author_id: 1,
      author_type: ChatAuthorType.Human,
    } as ChatAuthor;

    const message = {
      author: author,
      message_id: this.nextMessageId(),
      content: params.content,
      created_at: new Date(),
      meta_data: {},
      reply_message_id: null,
    } as ChatMessage;
    chat.messages.push(message);
    return Promise.resolve(Response.fromSuccess(message));
  }

  streamMessageResponse(
    _workspace_id: string,
    chat_id: string,
    message_id: number
  ): Promise<Response<QuestionStream | null>> {
    const chat = this.chatMap.get(chat_id);
    if (!chat) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Chat not found')
        )
      );
    }

    // Find the message that corresponds to the given message_id
    const message = chat.messages.find((msg) => msg.message_id === message_id);
    if (!message) {
      return Promise.resolve(
        Response.fromError(
          new ChatError(ErrorCode.RecordNotFound, 'Message not found')
        )
      );
    }

    // Simulate streaming by generating an AsyncIterableIterator
    const stream = this.createStream(message_id); // This should return an async iterator

    // Create and return the stream wrapped in a Response object
    return QuestionStream.fromStream(stream).then((questionStream) => {
      return Response.fromSuccess(questionStream);
    });
  }

  // Helper function to create an AsyncIterableIterator for the stream

  getRelatedQuestions(
    _workspace_id: string,
    _chat_id: string,
    _message_id: number
  ): Promise<Response<RelatedQuestion[] | null>> {
    const questions = [
      { content: 'Related question', metadata: {} },
      { content: 'Related question 2', metadata: {} },
      { content: 'Related question 3', metadata: {} },
    ] as RelatedQuestion[];
    return Promise.resolve(Response.fromSuccess(questions));
  }

  private async *createStream(
    message_id: number
  ): AsyncIterableIterator<JSONValue | ChatError> {
    const streamData = [
      { [STREAM_ANSWER_KEY]: `Streamed answer for message ${message_id}` },
      { [STREAM_METADATA_KEY]: { meta: 'Metadata for message ' + message_id } },
      {
        [STREAM_ANSWER_KEY]: `Another streamed answer for message ${message_id}`,
      },
      {
        [STREAM_METADATA_KEY]: {
          meta: 'Additional metadata for message ' + message_id,
        },
      },
    ];

    for (const chunk of streamData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      yield chunk;
    }

    return null;
  }
}

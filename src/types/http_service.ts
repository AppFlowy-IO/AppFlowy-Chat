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
} from "@/types/ai";
import { Response } from "@/types/response";

/**
 * @abstract
 * A service that defines the necessary methods for interacting with chat data.
 * This service is intended to be extended and implemented by classes that manage chat operations.
 */
export abstract class ChatHttpService {
  /**
   * Creates a new chat.
   *
   * @param {string} workspace_id - The ID of the workspace where the chat will be created.
   * @param {CreateChatParams} params - Parameters for creating a new chat.
   * @returns {Promise<Response<void>>} A promise that resolves when the chat is created successfully.
   */
  abstract createChat(
    workspace_id: string,
    params: CreateChatParams
  ): Promise<Response<void>>;

  /**
   * Deletes an existing chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat to delete.
   * @param {string} chat_id - The ID of the chat to be deleted.
   * @returns {Promise<Response<void>>} A promise that resolves when the chat is deleted successfully.
   */
  abstract deleteChat(
    workspace_id: string,
    chat_id: string
  ): Promise<Response<void>>;

  // Settings

  /**
   * Updates the settings of a chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat whose settings will be updated.
   * @param {string} chat_id - The ID of the chat whose settings will be updated.
   * @param {UpdateChatParams} params - The new settings for the chat.
   * @returns {Promise<Response<void>>} A promise that resolves when the chat settings are updated successfully.
   */
  abstract updateChatSettings(
    workspace_id: string,
    chat_id: string,
    params: UpdateChatParams
  ): Promise<Response<void>>;

  /**
   * Retrieves the settings of a specific chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat.
   * @param {string} chat_id - The ID of the chat whose settings will be retrieved.
   * @returns {Promise<Response<ChatSettings>>} A promise that resolves with the chat settings.
   */
  abstract getChatSettings(
    workspace_id: string,
    chat_id: string
  ): Promise<Response<ChatSettings | null>>;

  // Messages

  /**
   * Retrieves a list of chat messages for a specific chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat.
   * @param {string} chat_id - The ID of the chat whose messages are to be retrieved.
   * @param {MessageCursor} offset - The cursor used to offset the messages in the chat.
   * @param {number} limit - The maximum number of messages to retrieve.
   * @returns {Promise<Response<RepeatedChatMessage>>} A promise that resolves with a list of chat messages.
   */
  abstract getChatMessages(
    workspace_id: string,
    chat_id: string,
    offset: MessageCursor,
    limit: number
  ): Promise<Response<RepeatedChatMessage | null>>;

  /**
   * Sends a message to a chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat.
   * @param {string} chat_id - The ID of the chat to which the message will be sent.
   * @param {CreateChatMessageParams} params - The content and type of the message being sent.
   * @returns {Promise<Response<ChatMessage>>} A promise that resolves with the sent message.
   */
  abstract sendMessage(
    workspace_id: string,
    chat_id: string,
    params: CreateChatMessageParams
  ): Promise<Response<ChatMessage | null>>;

  /**
   * Streams the response to a message in a chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat.
   * @param {string} chat_id - The ID of the chat containing the message.
   * @param {number} message_id - The ID of the message whose response is being streamed.
   * @returns {Promise<Response<QuestionStream>>} A promise that resolves with the streamed response.
   */
  abstract streamMessageResponse(
    workspace_id: string,
    chat_id: string,
    message_id: number
  ): Promise<Response<QuestionStream | null>>;

  // Related Questions

  /**
   * Retrieves related questions for a specific message in a chat.
   *
   * @param {string} workspace_id - The ID of the workspace containing the chat.
   * @param {string} chat_id - The ID of the chat containing the message.
   * @param {number} message_id - The ID of the message for which related questions are to be retrieved.
   * @returns {Promise<Response<RelatedQuestion[] | null>>} A promise that resolves with an array of related questions.
   */
  abstract getRelatedQuestions(
    workspace_id: string,
    chat_id: string,
    message_id: number
  ): Promise<Response<RelatedQuestion[] | null>>;
}

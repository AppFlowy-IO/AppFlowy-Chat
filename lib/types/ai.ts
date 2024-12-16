import { ResponseError } from "./error";

export const STREAM_METADATA_KEY: string = "0";
export const STREAM_ANSWER_KEY: string = "1";

export type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | null
    | Array<JSONValue>;

interface JSONObject {
  [x: string]: JSONValue;
}

export interface CreateChatParams {
  chat_id: string;
  name: string;
  rag_ids: string[];
}

export enum ChatMessageType {
  System = 0,
  User = 1,
}

export interface CreateChatMessageParams {
  content: string;
  message_type: ChatMessageType;
}

export type MessageCursor =
  | { type: "Offset"; value: number } 
  | { type: "AfterMessageId"; value: number } 
  | { type: "BeforeMessageId"; value: number } 
  | { type: "NextBack" }; 

export interface GetChatMessagesParams {
  cursor: MessageCursor;
  limit: number;
}


export interface ChatAuthor {
  id: string;
  name: string;
}

export interface ChatMessage {
  author: ChatAuthor;
  message_id: number;
  content: string;
  created_at: Date;
  meta_data: Record<string, string>;
  reply_message_id: number;
}

export interface RepeatedChatMessage {
  messages: ChatMessage[];
  has_more: boolean;
  total: number;
}


export enum ChatAuthorType {
  Unknown = 0,
  Human = 1,
  System = 2,
  AI = 3
}

export interface ChatAuthor {
  author_id: number;
  author_type: ChatAuthorType;
  meta?: JSONValue;
}

export interface UpdateChatParams {
  name: string | null;
  rag_ids: string[] | null;
  metadata: JSONValue;
}

export interface ChatSettings {
  name: string;
  rag_ids: string[];
  metadata: JSONValue;
}



// Interface for the values in the stream (Answer or Metadata)
interface QuestionStreamValue {
  type: "Answer" | "Metadata";
  value: JSONValue;
}
export class QuestionStream {
  private stream: AsyncIterableIterator<JSONValue | ResponseError>;

  constructor(stream: AsyncIterableIterator<JSONValue | ResponseError>) {
    this.stream = stream;
  }

  // Static method to create an instance of QuestionStream from an async iterable iterator
  static async fromStream(stream: AsyncIterableIterator<JSONValue | ResponseError>): Promise<QuestionStream> {
    return new QuestionStream(stream);
  }

  // Processes the next item in the stream
  async next(): Promise<QuestionStreamValue | ResponseError | null> {
    const result = await this.stream.next();
    if (result.done) return null;

    const value = result.value;
    if ((value as ResponseError).message) {
      return value as ResponseError;
    }

    const jsonValue = value as Record<string, JSONValue>;

    // Check for metadata in the stream
    if (STREAM_METADATA_KEY in jsonValue) {
      return { type: "Metadata", value: jsonValue[STREAM_METADATA_KEY] };
    }

    // Check for answer in the stream
    if (STREAM_ANSWER_KEY in jsonValue) {
      return { type: "Answer", value: jsonValue[STREAM_ANSWER_KEY] };
    }

    // Invalid format case
    return { message: "Invalid streaming value", code: -1 } as ResponseError;
  }
}
export interface RelatedQuestion {
  content: string;
  metadata: JSONValue;
}
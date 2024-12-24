import { ChatError } from "./error";

export class Response<T> {
  data: T | null;
  error: ChatError | null;

  constructor(data: T, error: ChatError | null) {
    this.data = data;
    this.error = error;
  }

  static fromSuccess<T>(data: T): Response<T> {
    return new Response(data, null);
  }

  static fromError(error: ChatError): Response<null> {
    return new Response<null>(null, error); 
  }

  isSuccess(): boolean {
    return this.error === null;
  }

  isError(): boolean {
    return this.error !== null;
  }
}


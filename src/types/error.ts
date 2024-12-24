export class ChatError {
  code: ErrorCode;
  message: string;

  constructor(code: ErrorCode, message: string) {
    this.code = code;
    this.message = message;
  }
}


export enum ErrorCode {
  Ok = 0,
  Unhandled = -1,
  RecordNotFound = -2,
  RecordAlreadyExists = -3,
  InvalidRequest = 1008,
}

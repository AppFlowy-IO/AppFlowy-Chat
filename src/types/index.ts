import { SupportedAttachmentExtensionNames } from '@appflowy-chat/utils/supportedAttachmentExtensions';

interface ChatMessageCommon {
  id: string;
  body: string;
  created_at: number;
}
export interface ChatMessageUser extends ChatMessageCommon {
  author: 'user';
}
export interface ChatMessageAI extends ChatMessageCommon {
  author: 'ai';
  aiModel: AIModelName;
  formatType: ResponseFormatType | 'auto';
}

export interface WSData {
  content: string;
  status: 'update' | 'end';
}

export type ChatMessageOld = ChatMessageAI | ChatMessageUser;

export type ActionBarAIButtonName =
  | 'copy'
  | 'try-again'
  | 'change-format'
  | 'switch-model'
  | 'add-to-page'
  | 'download';

export interface SelectOption<V = string> {
  value: V;
  name: string;
  shortName?: string;
}

export type AIModelName =
  | 'default'
  | 'claude_3_opus'
  | 'claude_3_sonnet'
  | 'gpt_4omini'
  | 'gpt_4o';

export type ResponseFormatType =
  | 'text'
  | 'image_text'
  | 'image_only'
  | 'paragraph'
  | 'number_list'
  | 'table'
  | 'bullet_list';

export type ResponseFormatMode = 'custom' | 'auto';

export interface FilePreview {
  file: File;
  url: string | null;
  id: string;
  preview: 'image' | 'pdf';
  ext: (typeof SupportedAttachmentExtensionNames)[number];
}

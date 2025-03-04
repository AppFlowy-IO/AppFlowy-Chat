import { ChatRequest } from '@/request';
import { User } from '@/types/request';

export * from './request';

export interface ChatProps {
  chatId: string;
  requestInstance: ChatRequest;
  currentUser?: User;
  openingViewId?: string;
  onOpenView?: (viewId: string) => void;
  onCloseView?: () => void;
  selectionMode?: boolean;
  onOpenSelectionMode?: () => void;
  onCloseSelectionMode?: () => void;
}
import { parsePromptData } from '@/lib/utils';
import { AiPrompt } from '@/types/prompt';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import promptsData from '../data/built_in_prompts.json';

interface PromptModalContextTypes {
  isOpen: boolean;
  currentPromptId: string | null;
  updateCurrentPromptId: (id: string | null) => void;
  prompts: AiPrompt[];
  openModal: () => void;
  closeModal: () => void;
}

export const PromptModalContext = createContext<
  PromptModalContextTypes | undefined
>(undefined);

export function usePromptModal() {
  const context = useContext(PromptModalContext);

  if (!context) {
    throw new Error(
      'usePromptModal: usePromptModal must be used within a PromptModalProvider',
    );
  }
  return context;
}

export const PromptModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const prompts = useRef<AiPrompt[]>([]);

  const currentPromptIdRef = useRef<string | null>(null);
  const updateCurrentPromptId = (id: string | null) => {
    currentPromptIdRef.current = id;
  };

  const fetchBuiltInPrompts = useCallback(() => {
    try {
      if (Array.isArray(promptsData.prompts)) {
        const parsedPrompts = parsePromptData(promptsData.prompts);
        prompts.current = parsedPrompts;
        console.log(parsedPrompts);
      } else {
        throw new Error(
          'Invalid JSON structure: "prompts" array not found in imported data.',
        );
      }
    } catch (err) {
      console.error('Failed to load prompts:', err);
    }
  }, []);

  useEffect(() => {
    fetchBuiltInPrompts();
  }, [fetchBuiltInPrompts]);

  return (
    <PromptModalContext.Provider
      value={{
        isOpen,
        currentPromptId: currentPromptIdRef.current,
        updateCurrentPromptId,
        prompts: prompts.current,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </PromptModalContext.Provider>
  );
};

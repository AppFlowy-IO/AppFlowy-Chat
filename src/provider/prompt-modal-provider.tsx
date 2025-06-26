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
import { parsePromptData } from '@/lib/utils';
import {
  AiPrompt,
  AiPromptCategory,
  PromptDatabaseField,
  RawPromptData,
} from '@/types/prompt';
import { useTranslation } from '@/i18n';

const STORAGE_KEY = 'appflowy_prompt_db_config';

export interface PromptDatabaseConfiguration {
  databaseViewId: string;
  titleFieldId: string;
  contentFieldId: string;
  exampleFieldId: string | null;
  categoryFieldId: string | null;
}

interface PromptModalContextTypes {
  isOpen: boolean;
  currentPromptId: string | null;
  updateCurrentPromptId: (id: string | null) => void;
  prompts: AiPrompt[];
  openModal: () => void;
  closeModal: () => void;
  databaseConfig: PromptDatabaseConfiguration | null;
  fields: Array<PromptDatabaseField> | null;
  reloadDatabasePrompts: () => void;
  testDatabasePromptConfig?: (databaseViewId: string) => Promise<{
    config: PromptDatabaseConfiguration;
    fields: PromptDatabaseField[];
  }>;
  saveDatabaseConfig: (config: PromptDatabaseConfiguration) => void;
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

export const PromptModalProvider = ({
  workspaceId,
  loadDatabasePrompts,
  testDatabasePromptConfig,
  children,
}: {
  workspaceId: string;
  loadDatabasePrompts?: (config: PromptDatabaseConfiguration) => Promise<{
    rawDatabasePrompts: RawPromptData[];
    fields: PromptDatabaseField[];
  }>;
  testDatabasePromptConfig?: (databaseViewId: string) => Promise<{
    config: PromptDatabaseConfiguration;
    fields: PromptDatabaseField[];
  }>;
  children: ReactNode;
}) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [currentDatabaseConfig, setCurrentDatabaseConfig] =
    useState<PromptDatabaseConfiguration | null>(null);
  const [fields, setFields] = useState<PromptDatabaseField[]>([]);

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
      } else {
        throw new Error(
          'Invalid JSON structure: "prompts" array not found in imported data.',
        );
      }
    } catch (err) {
      console.error('Failed to load prompts:', err);
    }
  }, []);

  const fetchCustomPrompts = useCallback(async () => {
    if (!loadDatabasePrompts) return;

    const storageKey = `${STORAGE_KEY}_${workspaceId}`;
    const savedConfig = localStorage.getItem(storageKey);
    if (!savedConfig) return;

    const config = JSON.parse(savedConfig) as PromptDatabaseConfiguration;

    try {
      const { rawDatabasePrompts, fields } = await loadDatabasePrompts(config);

      const categories = new Map(
        Object.values(AiPromptCategory).map((category) => [
          category,
          t(`customPrompt.${category}`),
        ]),
      );

      const databasePrompts = parsePromptData(rawDatabasePrompts, categories);

      const builtInPrompts = prompts.current.filter((p) => !p.isCustom);
      prompts.current = [
        ...builtInPrompts,
        ...databasePrompts.map((p) => ({
          ...p,
          isCustom: true,
          isFeatured: false,
        })),
      ];

      setCurrentDatabaseConfig(config);
      setFields(fields);
    } catch (err) {
      console.error(
        'Failed to load custom prompts using database config:',
        err,
      );
      setCurrentDatabaseConfig(null);
      setFields([]);
    }
  }, [loadDatabasePrompts, t, workspaceId]);

  const saveDatabaseConfig = useCallback(
    (config: PromptDatabaseConfiguration) => {
      try {
        const storageKey = `${STORAGE_KEY}_${workspaceId}`;
        localStorage.setItem(storageKey, JSON.stringify(config));
        fetchCustomPrompts();
      } catch (err) {
        console.error('Failed to save database config:', err);
      }
    },
    [fetchCustomPrompts, workspaceId],
  );

  useEffect(() => {
    fetchBuiltInPrompts();
    void fetchCustomPrompts();
  }, [fetchBuiltInPrompts, fetchCustomPrompts]);

  return (
    <PromptModalContext.Provider
      value={{
        isOpen,
        currentPromptId: currentPromptIdRef.current,
        updateCurrentPromptId,
        prompts: prompts.current,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
        databaseConfig: currentDatabaseConfig,
        fields,
        testDatabasePromptConfig,
        saveDatabaseConfig,
        reloadDatabasePrompts: fetchCustomPrompts,
      }}
    >
      {children}
    </PromptModalContext.Provider>
  );
};

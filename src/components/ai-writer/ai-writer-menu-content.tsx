import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n';
import ImproveWritingIcon from '@/assets/icons/improve-writing.svg?react';
import AskAIIcon from '@/assets/icons/ai.svg?react';
import FixSpellingIcon from '@/assets/icons/fix-spelling.svg?react';
import ExplainIcon from '@/assets/icons/explain.svg?react';
import MakeLongerIcon from '@/assets/icons/make-longer.svg?react';
import MakeShorterIcon from '@/assets/icons/make-shorter.svg?react';
import ContinueWritingIcon from '@/assets/icons/continue-writing.svg?react';
import { AIAssistantType } from '@/types';
import { useWriterContext } from '@/writer/context';
import { useMemo } from 'react';

export function AiWriterMenuContent({ input, onClicked, isFilterOut }: {
  onClicked: (type: AIAssistantType) => void;
  isFilterOut?: (type: AIAssistantType) => boolean;
  input?: string;
}) {
  const { t } = useTranslation();
  const {
    improveWriting,
    askAIAnything,
    fixSpelling,
    explain,
    makeLonger,
    makeShorter,
    continueWriting,
  } = useWriterContext();

  const actions = useMemo(() => [{
    icon: ContinueWritingIcon,
    label: t('writer.continue'),
    key: AIAssistantType.ContinueWriting,
    onClick: continueWriting,
  }, {
    icon: ImproveWritingIcon,
    label: t('writer.improve'),
    key: AIAssistantType.ImproveWriting,
    onClick: () => improveWriting(input),
  },
    {
      key: AIAssistantType.AskAIAnything,
      icon: AskAIIcon,
      label: t('writer.askAI'),
      onClick: askAIAnything,
    },
    {
      key: AIAssistantType.FixSpelling,
      icon: FixSpellingIcon,
      label: t('writer.fixSpelling'),
      onClick: fixSpelling,
    },
    {
      key: AIAssistantType.Explain,
      icon: ExplainIcon,
      label: t('writer.explain'),
      onClick: explain,
    },
  ].filter(item => {
    return !isFilterOut || !isFilterOut(item.key);
  }), [askAIAnything, continueWriting, explain, fixSpelling, improveWriting, input, isFilterOut, t]);

  const otherActions = useMemo(() => [{
    icon: MakeLongerIcon,
    label: t('writer.makeLonger'),
    onClick: makeLonger,
    key: AIAssistantType.MakeLonger,
  },
    {
      icon: MakeShorterIcon,
      label: t('writer.makeShorter'),
      onClick: makeShorter,
      key: AIAssistantType.MakeShorter,
    }].filter(item => {
    return !isFilterOut || !isFilterOut(item.key);
  }), [makeLonger, makeShorter, t, isFilterOut]);

  return <div className="flex flex-col gap-1 p-0.5">
    {actions.map((action, index) => (
      <Button
        key={index}
        onClick={() => {
          action.onClick();
          onClicked(action.key);
        }}
        className={'w-full justify-start !text-foreground/80 !font-normal'}
        variant={'ghost'}
        onMouseDown={e => e.preventDefault()}
        startIcon={<action.icon />}
      >{action.label}
      </Button>
    ))}
    {otherActions.length > 0 && <Separator />}

    {
      otherActions.map((action, index) => (
        <Button
          onClick={() => {
            action.onClick();
            onClicked(action.key);
          }}
          key={index}
          className={'w-full justify-start !text-foreground/80 !font-normal'}
          variant={'ghost'}
          startIcon={<action.icon />}
          onMouseDown={e => e.preventDefault()}

        >{action.label}
        </Button>
      ))
    }
  </div>;
}
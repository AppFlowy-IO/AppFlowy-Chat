import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n';
import ImproveWritingIcon from '@/assets/icons/improve-writing.svg?react';
import AskAIIcon from '@/assets/icons/ai.svg?react';
import FixSpellingIcon from '@/assets/icons/fix-spelling.svg?react';
import ExplainIcon from '@/assets/icons/explain.svg?react';
import MakeLongerIcon from '@/assets/icons/make-longer.svg?react';
import MakeShorterIcon from '@/assets/icons/make-shorter.svg?react';
import { useMemo } from 'react';

export function AiWriterMenuContent() {
  const { t } = useTranslation();

  const actions = useMemo(() => [{
    icon: ImproveWritingIcon,
    label: t('writer.improve'),
  },
    {
      icon: AskAIIcon,
      label: t('writer.askAI'),
    },
    {
      icon: FixSpellingIcon,
      label: t('writer.fixSpelling'),
    },
    {
      icon: ExplainIcon,
      label: t('writer.explain'),
    },
  ], [t]);

  const otherActions = useMemo(() => [{
    icon: MakeLongerIcon,
    label: t('writer.makeLonger'),
  },
    {
      icon: MakeShorterIcon,
      label: t('writer.makeShorter'),
    }], [t]);

  return <div className="flex flex-col gap-1 p-0.5">
    {actions.map((action, index) => (
      <Button
        key={index}
        className={'w-full justify-start text-foreground/80 !font-normal'}
        variant={'ghost'}
        startIcon={<action.icon />}
      >{action.label}
      </Button>
    ))}
    <Separator />
    {
      otherActions.map((action, index) => (
        <Button
          key={index}
          className={'w-full justify-start text-foreground/80 !font-normal'}
          variant={'ghost'}
          startIcon={<action.icon />}
        >{action.label}
        </Button>
      ))
    }
  </div>;
}
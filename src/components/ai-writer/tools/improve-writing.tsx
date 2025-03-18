import { CommentWithAskAnything } from '@/components/ai-writer/tools/with-comment';

import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';
import { useMemo } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import TryAgainIcon from '@/assets/icons/undo.svg?react';
import InsertBelowIcon from '@/assets/icons/insert-below.svg?react';

export function ImproveWriting({
  title,
}: {
  title: string
}) {
  const {
    rewrite,
    accept,
    keep: insertBelow,
    exit,
    placeholderContent,
  } = useWriterContext();
  const { t } = useTranslation();

  const actions = useMemo(() => placeholderContent ? [
    {
      label: t('writer.button.accept'),
      onClick: accept,
      icon: <CheckIcon className={'text-success'} />,
    },
    {
      label: t('writer.button.discard'),
      onClick: () => {
        exit();
      },
      icon: <XIcon className={'text-destructive'} />,
    },
    {
      label: t('writer.button.insert-below'),
      onClick: insertBelow,
      icon: <InsertBelowIcon />,
    },
    {
      label: t('writer.button.rewrite'),
      onClick: rewrite,
      icon: <TryAgainIcon />,
    },
  ] : [
    {
      label: t('writer.button.try-again'),
      onClick: rewrite,
      icon: <TryAgainIcon />,
    },
    {
      label: t('writer.button.close'),
      onClick: () => {
        exit();
      },
      icon: <XIcon className={'text-destructive'} />,
    },
  ], [accept, exit, insertBelow, placeholderContent, rewrite, t]);

  return <CommentWithAskAnything
    title={title}
    actions={actions}
    noSwitchMode={true}
  />;
}
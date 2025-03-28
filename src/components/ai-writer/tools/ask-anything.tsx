import TryAgainIcon from '@/assets/icons/undo.svg?react';
import { CommentWithAskAnything } from '@/components/ai-writer/tools/with-comment';
import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';
import { CheckIcon, XIcon } from 'lucide-react';
import { useMemo } from 'react';

export function AskAnything({
  title,
}: {
  title: string
}) {
  const { t } = useTranslation();
  const {
    rewrite,
    keep,
    exit,
  } = useWriterContext();

  const actions = useMemo(() => [
    {
      label: t('writer.button.keep'),
      onClick: keep,
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
      label: t('writer.button.rewrite'),
      onClick: rewrite,
      icon: <TryAgainIcon />,
    },
  ], [exit, keep, rewrite, t]);

  return <CommentWithAskAnything
    noSwitchMode={false}
    title={title}
    actions={actions}
  />;
}
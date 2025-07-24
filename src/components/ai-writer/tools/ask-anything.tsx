import TryAgainIcon from '@/assets/icons/undo.svg?react';
import { CommentWithAskAnything } from '@/components/ai-writer/tools/with-comment';
import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';
import { CheckIcon, XIcon } from 'lucide-react';
import { useMemo } from 'react';
import InsertBelowIcon from '@/assets/icons/insert-below.svg?react';

export function AskAnything({ title }: { title: string }) {
  const { t } = useTranslation();
  const { initialContent } = useWriterContext();
  const { rewrite, accept, keep, exit } = useWriterContext();

  const actions = useMemo(
    () =>
      initialContent()
        ? [
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
              onClick: keep,
              icon: <InsertBelowIcon />,
            },
            {
              label: t('writer.button.rewrite'),
              onClick: rewrite,
              icon: <TryAgainIcon />,
            },
          ]
        : [
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
          ],
    [accept, exit, initialContent, keep, rewrite, t],
  );

  return (
    <CommentWithAskAnything
      noSwitchMode={false}
      title={title}
      actions={actions}
    />
  );
}

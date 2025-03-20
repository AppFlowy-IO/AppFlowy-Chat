import { RenderEditor } from '@/components/ai-writer/render-editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';
import { EditorProvider } from '@appflowyinc/editor';
import { XIcon } from 'lucide-react';
import InsertBelowIcon from '@/assets/icons/insert-below.svg?react';
import TryAgainIcon from '@/assets/icons/undo.svg?react';

export function ExplainToolbar() {
  const { t } = useTranslation();
  const {
    rewrite,
    keep: insertBelow,
    exit,
  } = useWriterContext();

  return <div
    className={'flex h-fit gap-2 p-2 py-3 min-h-[48px] flex-col bg-muted/40 overflow-hidden w-full max-w-full'}
  >
    <Label className={'font-semibold px-[6px] text-xs text-foreground/60'}>{t('writer.explain')}</Label>
    <div className={'text-sm px-[4px] font-medium'}>
      <EditorProvider>
        <RenderEditor />
      </EditorProvider>
    </div>
    <div className={'flex text-sm px-1 items-center w-fit gap-1'}>
      <Button
        onClick={insertBelow}
        startIcon={<InsertBelowIcon />}
        variant={'ghost'}
        className={'!text-sm !h-[28px] text-foreground/80'}
      >{t('writer.button.insert-below')}</Button>
      <Button
        onClick={() => rewrite()}
        startIcon={<TryAgainIcon />}
        variant={'ghost'}
        className={'!text-sm !h-[28px] text-foreground/80'}
      >{t('writer.button.try-again')}</Button>
      <Button
        onClick={exit}
        startIcon={<XIcon className={'text-destructive'} />}
        variant={'ghost'}
        className={'!text-sm !h-[28px] text-foreground/80'}
      >{t('writer.button.close')}</Button>
    </div>
  </div>;
}
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
    placeholderContent,
    setEditorData,
  } = useWriterContext();

  return <div
    className={'flex h-fit gap-2 p-2 py-3 min-h-[48px] flex-col bg-secondary-background border-b border-input overflow-hidden w-full max-w-full'}
  >
    <Label className={'font-semibold select-text px-[6px] text-xs text-foreground/60'}>{t('writer.explain')}</Label>
    <div className={'text-sm leading-[20px] select-none px-[4px] max-h-[238px] appflowy-scrollbar overflow-y-auto w-full font-medium'}>
      <EditorProvider>
        <RenderEditor
          content={placeholderContent || ''}
          onDataChange={setEditorData}
        />
      </EditorProvider>
    </div>
    <div className={'flex text-sm items-center w-fit gap-1'}>
      <Button
        onClick={insertBelow}
        startIcon={<InsertBelowIcon />}
        variant={'ghost'}
        className={'!text-sm !h-[28px] text-foreground'}
      >{t('writer.button.insert-below')}</Button>
      <Button
        onClick={() => rewrite()}
        startIcon={<TryAgainIcon />}
        variant={'ghost'}
        className={'!text-sm !h-[28px] text-foreground'}
      >{t('writer.button.try-again')}</Button>
      <Button
        onClick={() => {
          exit();
        }}
        startIcon={<XIcon className={'text-destructive'} />}
        variant={'ghost'}
        className={'!text-sm !h-[28px] text-foreground'}
      >{t('writer.button.close')}</Button>
    </div>
  </div>;
}
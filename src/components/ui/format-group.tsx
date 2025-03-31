import { Button } from '@/components/ui/button';
import TextIcon from '@/assets/icons/text.svg?react';
import TextWithIcon from '@/assets/icons/image-text.svg?react';
import ImageIcon from '@/assets/icons/image.svg?react';
import ParagraphIcon from '@/assets/icons/paragraph.svg?react';
import BulletedListIcon from '@/assets/icons/bullet-list.svg?react';
import NumberedListIcon from '@/assets/icons/num-list.svg?react';
import TableIcon from '@/assets/icons/table.svg?react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/i18n';
import { OutputContent, OutputLayout } from '@/types';
import { useMemo } from 'react';

export function FormatGroup({
  outputContent,
  outputLayout,
  setOutputContent,
  setOutputLayout,
}: {
  outputContent?: OutputContent;
  outputLayout?: OutputLayout;
  setOutputContent: (content: OutputContent) => void;
  setOutputLayout: (layout: OutputLayout) => void;
}) {
  const { t } = useTranslation();

  const actions = useMemo(() => [{
    Icon: TextIcon,
    key: OutputContent.TEXT,
    title: t('input.button.text'),
    onClick: () => setOutputContent(OutputContent.TEXT),
  }, {
    Icon: TextWithIcon,
    key: OutputContent.RichTextImage,
    title: t('input.button.textWithImage'),
    onClick: () => setOutputContent(OutputContent.RichTextImage),
  }, {
    Icon: ImageIcon,
    key: OutputContent.IMAGE,
    title: t('input.button.imageOnly'),
    onClick: () => setOutputContent(OutputContent.IMAGE),
  }], [setOutputContent, t]);

  const textFormats = useMemo(() => [
    {
      Icon: ParagraphIcon,
      key: OutputLayout.Paragraph,
      title: t('input.button.paragraph'),
      onClick: () => setOutputLayout(OutputLayout.Paragraph),
    },
    {
      Icon: BulletedListIcon,
      key: OutputLayout.BulletList,
      title: t('input.button.bulletList'),
      onClick: () => setOutputLayout(OutputLayout.BulletList),
    },
    {
      Icon: NumberedListIcon,
      key: OutputLayout.NumberedList,
      title: t('input.button.numberedList'),
      onClick: () => setOutputLayout(OutputLayout.NumberedList),
    },
    {
      Icon: TableIcon,
      key: OutputLayout.SimpleTable,
      title: t('input.button.table'),
      onClick: () => setOutputLayout(OutputLayout.SimpleTable),
    },
  ], [setOutputLayout, t]);

  const renderGroup = (options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: any,
    onClick?: () => void;
    key: OutputContent | OutputLayout, title: string
  }[], isLayout: boolean) => {
    return options.map(({ Icon, key, title, onClick }) => (
      <Tooltip key={String(key)}>
        <TooltipTrigger asChild>
          <Button
            onMouseDown={e => {
              e.preventDefault();
            }}
            variant={'ghost'}
            size={'icon'}
            onClick={onClick}
            className={`${(outputContent === key && !isLayout) || (outputLayout === key && isLayout) ? 'bg-accent' : ''} w-7 h-7 !p-0`}
          >
            <Icon
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          align={'center'}
          side={'top'}
        >
          {title}
        </TooltipContent>
      </Tooltip>
    ));
  };

  return (
    <div className={'flex gap-2 items-center'}>
      <div className={'flex gap-1'}>
        {renderGroup(actions, false)}
      </div>
      {
        outputContent !== OutputContent.IMAGE && (
          <>
            <Separator
              orientation={'vertical'}
              className={'h-4'}
            />
            <div className={'flex gap-1'}>
              {renderGroup(textFormats, true)}
            </div>
          </>
        )
      }

    </div>
  );
}


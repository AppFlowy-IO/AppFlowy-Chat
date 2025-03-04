import DocIcon from '@/assets/icons/doc.svg?react';
import { cn, getIcon, renderColor } from '@/lib/utils';
import { View, ViewIconType } from '@/types';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';

function PageIcon({ view }: {
  view: View;
}) {
  const icon = view.icon;

  const [iconSvg, setIconSvg] = useState<string | null>(null);
  const [iconColor, setIconColor] = useState<string | null>(null);
  const isEmoji = icon?.ty === ViewIconType.Emoji;

  useEffect(() => {
    if(isEmoji || !icon) return;
    void (async() => {

      const iconValue = icon.value;

      const iconJson = iconValue ? JSON.parse(iconValue) : null;

      if(iconJson) {
        const svg = await getIcon(`${iconJson.groupName}/${iconJson.iconName}`);
        if(svg) {
          setIconSvg(svg);
        }

        setIconColor(iconJson.color);
      }
    })();
  }, [icon, isEmoji, view.extra]);

  const customIcon = useMemo(() => {
    const cleanSvg = iconSvg ? DOMPurify.sanitize(iconSvg.replace('black', iconColor ? renderColor(iconColor) : 'black').replace('<svg', '<svg width="100%" height="100%"'), {
      USE_PROFILES: { svg: true, svgFilters: true },
    }) : '';

    return <span
      className={cn('flex w-4 h-4 rounded-md items-center justify-center')}
    ><span
      dangerouslySetInnerHTML={{
        __html: cleanSvg,
      }}
    /></span>;
  }, [iconColor, iconSvg]);

  if(!icon || !icon.value) {
    return <DocIcon
      style={{
        width: 16,
        height: 16,
      }}
    />;
  }

  if(isEmoji) {
    return <span
      className={'flex justify-center items-center'}
      style={{
        width: 16,
        height: 16,
      }}
    >{icon.value}</span>;
  }

  return customIcon;

}

export default PageIcon;
import { ViewItem } from '@/components/chat-input/related-views/view-item';
import { View } from '@/types';
import { CheckStatus } from '@/types/checkbox';

export function ViewChildren({
  item,
  getCheckStatus,
  onToggle,
}: {
  item: View;
  getCheckStatus: (view: View) => CheckStatus;
  onToggle: (view: View) => void;
}) {
  if(!item.children || item.children.length === 0) {
    return null;
  }

  return (
    <div className={'flex pl-4 flex-col gap-1'}>
      {item.children.map((view: View) => {
        return (
          <ViewItem
            key={view.view_id}
            view={view}
            getCheckStatus={getCheckStatus}
            onToggle={onToggle}
          >
            <ViewChildren
              item={view}
              getCheckStatus={getCheckStatus}
              onToggle={onToggle}
            />
          </ViewItem>
        );
      })}
    </div>
  );
}

export default ViewChildren;
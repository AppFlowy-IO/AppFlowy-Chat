import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { stringToColor } from '@/lib/utils';
import { User } from '@/types';
import { useEffect, useState } from 'react';

function HumanQuestion({
  content,
  userId,
  fetchMember,
}: {
  content: string;
  userId: string;
  fetchMember: (uuid: string) => Promise<User>;
}) {

  const [member, setMember] = useState<User | null>(null);

  useEffect(() => {
    void (async() => {
      try {
        const member = await fetchMember(userId);
        setMember(member);
      } catch(e) {
        console.error(e);
      }
    })();
  }, [fetchMember, userId]);

  const name = member?.name || 'Anonymous';

  return (
    <div className={`flex gap-2 w-full`}>
      <div className={'flex-1 flex items-center justify-end'}>
        <div className={'w-fit max-w-[83%] bg-muted rounded-[16px] px-4 py-2'}>
          {content}
        </div>
      </div>
      <Avatar className={'w-9 h-9 border border-border'}>
        <AvatarFallback
          style={{
            background: stringToColor(name),
          }}
        >
          {name[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export default HumanQuestion;
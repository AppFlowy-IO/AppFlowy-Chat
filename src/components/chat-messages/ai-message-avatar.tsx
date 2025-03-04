import Logo from '@/assets/logo.svg';
import MessageCheckbox from '@/components/chat-messages/message-checkbox';

export function AiMessageAvatar({ id }: {
  id: number
}) {
  return (
    <div className={'flex items-center h-fit gap-1.5'}>
      <MessageCheckbox id={id} />
      <div className={'border border-border h-9 w-9 p-2 rounded-full overflow-hidden'}>
        <img
          src={Logo}
          alt={'logo'}
          className={'object-cover'}
        />
      </div>
    </div>
  );
}


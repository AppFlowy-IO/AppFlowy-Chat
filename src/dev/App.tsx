import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import '@/styles/index.scss';
import Chat from '@/chat';

const languages = ['en'];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [_lang, setLang] = useState<string>('en');
  const [testChatId, setTestChatId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isDark = searchParams.get('dark');
    const chatId = searchParams.get('chat');
    if (isDark === 'true') {
      setTheme('dark');
    }

    setTestChatId(chatId || '');

    setIsInitialized(true);
    return () => {};
  }, []);

  useEffect(() => {
    document.documentElement.dataset.darkMode = `${theme === 'dark'}`;
    return () => {};
  }, [theme]);

  return (
    <div className='h-screen w-full'>
      {isInitialized && (
        <div className='flex h-full w-full'>
          <div className='max-h-full w-full max-w-[300px] border-r border-r-gray-500 p-4'>
            Sidebar
            <hr className='mt-1' />
            <div className='py-2'>
              <div className={'flex flex-col gap-4'}>
                <div className={'flex items-center gap-2'}>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => {
                      const themeCurrent = checked ? 'dark' : 'light';
                      setTheme(themeCurrent);
                    }}
                  />
                  <Label>Theme</Label>
                </div>

                <Select onValueChange={(value) => setLang(value as 'en')}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Language' />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Chat
            userAvatar={
              'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S-768x768.jpg'
            }
            workspaceId='30940593343'
            initChatId={testChatId}
          />
        </div>
      )}
    </div>
  );
}

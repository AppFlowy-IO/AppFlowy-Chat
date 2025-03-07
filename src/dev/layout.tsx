import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useCallback, useEffect, useState } from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

const languages = ['en'];

function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [_lang, setLang] = useState<string>('en');
  const [workspaceId, setWorkspaceId] = useState<string>();
  const [token, setToken] = useState<string>();
  const [chatId, setChatId] = useState<string>();
  const [search, setSearch] = useSearchParams();
  const handleOpenSelectionMode = useCallback(() => {
    return setSearch((prev) => {
      prev.set('selectable', 'true');
      return prev;
    });
  }, [setSearch]);

  const handleCloseSelectionMode = useCallback(() => {
    return setSearch((prev) => {
      prev.delete('selectable');
      return prev;
    });
  }, [setSearch]);

  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setToken(token);
    }

    if(params.workspaceId) {
      setWorkspaceId(params.workspaceId);
    }

    if(params.chatId) {
      setChatId(params.chatId);
    }
  }, [params]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isDark = searchParams.get('dark');
    if(isDark === 'true') {
      setTheme('dark');
    }

    return () => {};
  }, []);

  useEffect(() => {
    document.documentElement.dataset.darkMode = `${theme === 'dark'}`;
    return () => {};
  }, [theme]);

  const navigate = useNavigate();

  const onSumit = () => {
    if(token) {
      localStorage.setItem('token', token);
    }

    navigate(`/${workspaceId}/${chatId}`);
  };

  return (
    <div className="h-screen text-foreground w-full bg-background">
      <div className="flex h-full w-full">
        <div className="max-h-full w-full max-w-[300px] border-r border-r-border p-4">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Separator />
            <Button
              onClick={() => {
                navigate(`/${workspaceId}/${chatId}/writer`);
              }}
            >
              AI Writer
            </Button>
            <Separator />
            <div className={'flex items-center gap-2'}>
              <Switch
                checked={search.get('selectable') === 'true'}
                onCheckedChange={(checked) => {
                  if(checked) {
                    handleOpenSelectionMode();
                  } else {
                    handleCloseSelectionMode();
                  }
                }}
              />
              <Label>Open Select</Label>
            </div>
            <Separator />
            <div className={'flex flex-col gap-4'}>
              <div className={'flex flex-col gap-2'}>
                <Label>Token</Label>
                <Input
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                  }}
                />
              </div>
              <div className={'flex flex-col gap-2'}>
                <Label>Workspace ID</Label>
                <Input
                  value={workspaceId}
                  onChange={(e) => {
                    setWorkspaceId(e.target.value);
                  }}
                />
              </div>
              <div className={'flex  flex-col gap-2'}>
                <Label>Chat ID</Label>
                <Input
                  value={chatId}
                  onChange={(e) => {
                    setChatId(e.target.value);
                  }}
                />
              </div>
            </div>
            <Button
              variant={'default'}
              onClick={onSumit}
            >
              Submit
            </Button>


          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({
  value,
  onChange,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={cn('flex gap-2 items-center', `border border-border py-1 px-3 rounded-[8px]`, focused ? 'ring-ring ring-1 border-primary' : '')}
    >
      <SearchIcon
        size={20}
        className={'text-muted-foreground'}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus
        type="text"
        placeholder={t('search.label')}
        className={'!p-0 !h-6 !ring-0 !border-none !shadow-none'}
      />
    </div>
  );
}


import { WriterCard } from '@/dev/writer-card';
import { WriterProvider } from '@/writer';

export function AIWriter() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <WriterProvider>
        <WriterCard />
      </WriterProvider>
    </div>
  );
}

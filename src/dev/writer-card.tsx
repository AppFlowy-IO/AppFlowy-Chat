import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIWriterMenu, ContextPlaceholder } from '@/writer';
import { useState } from 'react';

export function WriterCard() {

  const [open, setOpen] = useState(false);
  const [inputContext, setInputContext] = useState<string>('');
  return <div className={'flex w-[80%] flex-col h-fit gap-2'}>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Writer</CardTitle>
        <CardDescription>
          Deploy your new project in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="input-context">Input context</Label>
              <Input
                id="input-context"
                placeholder="Context string"
                value={inputContext}
                onChange={e => setInputContext(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start">
        <div className={'flex justify-between w-full'}>
          <Button variant="outline">Cancel</Button>
          <AIWriterMenu
            open={open}
            onOpenChange={setOpen}
            input={inputContext}
          >
            <Button>Run</Button>
          </AIWriterMenu>
        </div>

      </CardFooter>

    </Card>
    <Card className="w-full h-fit pb-[200px]">
      <CardHeader>
        <CardTitle>Output Content</CardTitle>
        <CardDescription>
          The generated content will be displayed here.
        </CardDescription>
      </CardHeader>
      <CardContent className={'h-fit'}>
        <ContextPlaceholder />
      </CardContent>
    </Card>
  </div>;
}
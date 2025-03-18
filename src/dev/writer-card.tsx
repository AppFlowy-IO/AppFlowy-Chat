import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIWriterMenu, ContextPlaceholder, useAIWriter } from '@/writer';

export function WriterCard() {
  const { setInputContext, inputContext } = useAIWriter();

  return <div className={'flex flex-col h-full gap-2 overflow-y-auto overflow-hidden'}>
    <Card className="w-[350px]">
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
          <AIWriterMenu>
            <Button>Run</Button>
          </AIWriterMenu>
        </div>

      </CardFooter>

    </Card>
    <Card className="w-[350px] pb-[200px]">
      <CardHeader>
        <CardTitle>Output Content</CardTitle>
        <CardDescription>
          The generated content will be displayed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContextPlaceholder />
      </CardContent>
    </Card>
  </div>;
}
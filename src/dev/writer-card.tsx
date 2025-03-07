import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIWriterMenu, useAIWriter } from '@/writer';

export function WriterCard() {
  const { contextPlaceholder } = useAIWriter();

  return <Card className="w-[350px]">
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
            />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <AIWriterMenu>
        <Button>Run</Button>
      </AIWriterMenu>

    </CardFooter>
    {contextPlaceholder}
  </Card>;
}
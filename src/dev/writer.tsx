import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const languages = ["en"];

const enum AiWriterFunction {
  ImproveWriting = 1,
  FixSpellingAndGrammar,
  MakeShorter,
  MakeLonger,
  ContinueWriting,
  Explain,
  UserQuestion,
}

const collapsedFunctions = [
  {
    name: "Fix Spelling and Grammar",
    value: AiWriterFunction.FixSpellingAndGrammar,
  },
  { name: "Continue Writing", value: AiWriterFunction.ContinueWriting },
  { name: "User Question", value: AiWriterFunction.UserQuestion },
];

const nonCollapsedFunctions = [
  { name: "User Question", value: AiWriterFunction.UserQuestion },
  { name: "Improve Writing", value: AiWriterFunction.ImproveWriting },
  {
    name: "Fix Spelling and Grammar",
    value: AiWriterFunction.FixSpellingAndGrammar,
  },
  { name: "Make Shorter", value: AiWriterFunction.MakeShorter },
  { name: "Make Longer", value: AiWriterFunction.MakeLonger },
  { name: "Explain", value: AiWriterFunction.Explain },
];

export function AiWriter() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [_lang, setLang] = useState<string>("en");
  const [token, setToken] = useState<string>();

  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, [params]);

  const [isSelectionCollapsed, setIsSelectionCollapsed] = useState(true);
  const [text, setText] = useState("");
  const [selectedCollapsedFunction, setSelectedCollapsedFunction] = useState(
    AiWriterFunction.UserQuestion
  );
  const [selectedNonCollapsedFunction, setSelectedNonCollapsedFunction] =
    useState(AiWriterFunction.UserQuestion);

  const collapsedOptions = useMemo(() => {
    return (
      <div>
        <RadioGroup
          value={selectedCollapsedFunction.toString()}
          onValueChange={(value) => {
            setSelectedCollapsedFunction(value as unknown as AiWriterFunction);
          }}
        >
          {collapsedFunctions.map((functionOption) => (
            <div className="flex gap-2">
              <RadioGroupItem
                key={functionOption.value}
                value={functionOption.value.toString()}
              />
              <Label htmlFor={functionOption.value.toString()}>
                {functionOption.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }, [selectedCollapsedFunction]);

  const nonCollapsedOptions = useMemo(() => {
    return (
      <div>
        <RadioGroup
          value={selectedNonCollapsedFunction.toString()}
          onValueChange={(value) => {
            setSelectedNonCollapsedFunction(
              value as unknown as AiWriterFunction
            );
          }}
        >
          {nonCollapsedFunctions.map((functionOption) => (
            <div className="flex gap-2">
              <RadioGroupItem
                key={functionOption.value}
                value={functionOption.value.toString()}
              />
              <Label htmlFor={functionOption.value.toString()}>
                {functionOption.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }, [selectedNonCollapsedFunction]);

  return (
    <div className="h-screen w-screen text-foreground bg-background">
      <div className="h-full w-full max-w-[300px] p-4 border-r border-border">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => {
                const themeCurrent = checked ? "dark" : "light";
                setTheme(themeCurrent);
              }}
            />
            <Label>Theme</Label>
          </div>

          <div className={"flex flex-col gap-2"}>
            <Label>Token</Label>
            <Input
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                localStorage.setItem("token", e.target.value);
              }}
            />
          </div>

          <Select onValueChange={(value) => setLang(value as "en")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setIsSelectionCollapsed(value === "collapsed")
            }
            defaultValue="collapsed"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selection Collapsed"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="collapsed" value="collapsed">
                Collapsed
              </SelectItem>
              <SelectItem key="range" value="range">
                Non-Collapsed
              </SelectItem>
            </SelectContent>
          </Select>

          <div className={"flex flex-col gap-2"}>
            <Label className="text-base">First Command</Label>
            {isSelectionCollapsed ? collapsedOptions : nonCollapsedOptions}
          </div>

          <div className={"flex flex-col gap-2"}>
            <Label className="text-base">Text</Label>
            <Textarea
              value={text}
              onChange={(value) => setText(value.target.value)}
            />
          </div>

          <Button>Show AI Writer</Button>
        </div>
      </div>
      <div className="h-full"></div>
    </div>
  );
}

import { WSData } from "@/types";
import { wait } from "./common";

export async function simulateWSResponse(
  cb: (data: WSData) => void,
  renderText: string
) {
  const maxLength = renderText.length;

  const workPerSend = 6;

  for (let i = 0; i < maxLength; i = i + workPerSend) {
    const str = renderText.substring(i, i + workPerSend);
    const data: WSData = { content: str, status: "update" };
    cb(data);
    await wait(30);
  }
  const d2: WSData = { content: "Success", status: "end" };
  cb(d2);
}

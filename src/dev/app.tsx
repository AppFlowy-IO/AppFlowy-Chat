import AiChat from "@/dev/chat";
import Layout from "@/dev/layout";
import { AiWriter } from "@/dev/writer";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path={"chat"} element={<Layout />}>
        <Route path={":workspaceId/:chatId"} element={<AiChat />} />
      </Route>
      <Route path={"writer"} element={<AiWriter />}></Route>
    </Routes>
  );
}

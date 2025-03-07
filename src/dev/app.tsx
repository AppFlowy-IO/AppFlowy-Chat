import AiChat from '@/dev/chat';
import Layout from '@/dev/layout';
import { AIWriter } from '@/dev/writer';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route
          path={':workspaceId/:chatId'}
          element={<AiChat />}
        />
        <Route
          path={'writer'}
          element={<AIWriter />}
        />
      </Route>
    </Routes>
  );
}

import AiChat from '@/dev/chat';
import Layout from '@/dev/layout';
import { Routes, Route } from 'react-router-dom';
import '@appflowyinc/editor/style';

export default function App() {
  return <Routes>
    <Route
      path={'/'}
      element={<Layout />}
    >
      <Route
        path={'/:workspaceId/:chatId'}
        element={<AiChat />}
      />
    </Route>
  </Routes>;
}

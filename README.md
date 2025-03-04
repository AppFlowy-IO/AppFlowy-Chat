# AppFlowy Web Chat

## 📦 Installation

```bash
npm i @appflowyinc/ai-chat
# or
yarn add @appflowyinc/ai-chat
# or
pnpm add @appflowyinc/ai-chat
```

## 🚀 Quick Start

> NB: Many functionalities of AppFlowy Web Chat are meant to work very closely with an instance of [AppFlowy Cloud](https://github.com/AppFlowy-IO/AppFlowy-Cloud). Some features will require token access as well.

To get started with AppFlowy Web Chat, import `Chat` from the package and supply it with necessary `ChatProps`.

```tsx
import { Chat, ChatProps } from "@appflowyinc/ai-chat";

const App = () => {
  const props: ChatProps = {
    // fill with data
    ...
  };

  return <Chat {...props} />;
};

export default App;
```

## 💡 Theming

AppFlowy Web Chat will use dark mode when `document.documentelement.dataset.darkMode` is set to true.

## 📖 API

### `ChatProps`

| Prop                 | Type                       | Default | Description                                                     |
| -------------------- | -------------------------- | ------- | --------------------------------------------------------------- |
| chatId               | `string`                   | -       | The id of the chat                                              |
| requestInstance      | `ChatRequest`              | -       | ChatRequest which handles chat-related API requests             |
| currentUser          | `User`                     | -       | Current user in the chat, determines the sender                 |
| openingViewId        | `string`                   | -       | id of the currently-opened view                                 |
| onOpenView           | `(viewId: string) => void` | -       | Callback when clicking on a view link in the chat               |
| onCloseView          | `() => void`               | -       | Callback when closing an opened view                            |
| selectionMode        | `boolean`                  | -       | When true, disable input and allows selecting multiple messages |
| onOpenSelectionMode  | `() => void`               | -       | Callback when turning on selection mode                         |
| onCloseSelectionMode | `() => void`               | -       | Callback when turning off selection mode                        |

### `ChatRequest`

Supply the `workspaceId` and `chatId`. For saving messages to AppFlowy Cloud, an access token will be required in local storage.

## 🔨 Development Guide

### Development Mode

```bash
# Install dependencies
pnpm i

# Start development server
pnpm run dev

# Build library
pnpm run build
```

To run the demo locally, first run:

```bash
pnpm i
pnpm run dev
```

Then open http://localhost:3001/ in your browser to see the demo application.

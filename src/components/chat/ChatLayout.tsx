"use client";

import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <ChatSidebar
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />

      <ChatContainer selectedConversation={selectedConversation} />
    </div>
  );
}

"use client";

import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        setConversations={setConversations}
        loading={loading}
        setLoading={setLoading}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />

      <ChatContainer selectedConversation={selectedConversation} />
    </div>
  );
}

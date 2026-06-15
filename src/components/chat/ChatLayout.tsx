"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import { socket } from "@/lib/socket-client";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server: ", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

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

      <ChatContainer
        selectedConversation={selectedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />
    </div>
  );
}

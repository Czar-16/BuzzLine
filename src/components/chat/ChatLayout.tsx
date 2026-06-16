"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import { socket } from "@/lib/socket-client";
import { useSession } from "next-auth/react";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  //  Socket Connected
  //       ↓
  //  user-connected event
  //       ↓
  //  userId sent to server
  // server receives the user id instead of socket id.

  const { data: session } = useSession();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected  to socket server : ", socket.id);
      console.log("Sending user id:", session?.user?.id);
      socket.emit("user-connected", session?.user?.id);
    });

    return () => {
      socket.off("connect");
    };
  }, [session]);

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

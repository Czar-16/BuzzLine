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
    if (!session?.user?.id) return;

    socket.emit("user-connected", session.user.id);
  }, [session]);

  // for online status and lastActive.
  useEffect(() => {
    // server se "user-online" event aaya toh conversations state update karo
    socket.on("user-online", (userId) => {
      setConversations((prev: any[]) =>
        // har conversation pe loop
        prev.map((conversation) => ({
          // conversation ki saari fields as-it-is rakho
          ...conversation,
          // sirf participants update karo
          participants: conversation.participants.map(
            (participant: any) =>
              // jo user online aaya usse dhundho
              participant._id === userId
                ? { ...participant, isOnline: true } // mila → online mark karo
                : participant, // nahi mila → as-it-is
          ),
        })),
      );

      setSelectedConversation((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          participants: prev.participants.map((participant: any) =>
            participant._id === userId
              ? {
                  ...participant,
                  isOnline: true,
                }
              : participant,
          ),
        };
      });
    });

    // server se "user-offline" event aaya toh conversations state update karo
    socket.on("user-offline", ({ userId, lastActive }) => {
      setConversations((prev: any[]) =>
        // har conversation pe loop
        prev.map((conversation) => ({
          // conversation ki saari fields as-it-is rakho
          ...conversation,
          // sirf participants update karo
          participants: conversation.participants.map(
            (participant: any) =>
              // jo user offline hua usse dhundho
              participant._id === userId
                ? { ...participant, isOnline: false, lastActive } // mila → offline + last seen set karo
                : participant, // nahi mila → as-it-is
          ),
        })),
      );

      setSelectedConversation((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          participants: prev.participants.map((participant: any) =>
            participant._id === userId
              ? {
                  ...participant,
                  isOnline: false,
                  lastActive,
                }
              : participant,
          ),
        };
      });
    });

    // cleanup — component unmount hone pe listeners hata do (duplicate listeners avoid)
    return () => {
      socket.off("user-online");
      socket.off("user-offline");
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

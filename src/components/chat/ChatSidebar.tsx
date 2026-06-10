"use client";

import { patrickHand, syne } from "@/lib/fonts";
import { Search, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Conversation {
  _id: string;
  participants: any[];
  latestMessage?: any;
}

export default function ChatSidebar({
  selectedConversation,
  setSelectedConversation,
}: {
  selectedConversation: any; // TODO: replace with proper type if needed
  setSelectedConversation: (value: any) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();

        if (data.success) {
          setConversations(data.conversations);
        }
        console.log("conversation is : ", data.conversations);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <aside className="w-80 border-r border-neutral-800 bg-black">
        <div className="p-4 text-white">Loading conversations...</div>
      </aside>
    );
  }
  return (
    <aside className="w-80 border-r border-neutral-800 bg-black flex flex-col">
      {/* Logo */}

      <div className="p-5 border-b border-neutral-800 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <h1
          className="text-xl font-bold tracking-wider text-white cursor-default"
          style={syne.style}
        >
          BUZZLINE
        </h1>
      </div>
      {/* Search */}
      <div className="p-4 ">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 ">
          <Search size={16} className="text-neutral-500" />
          <input
            placeholder="Search username..."
            className="w-full bg-transparent outline-none text-sm text-white "
            style={syne.style}
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 px-3">
        <p
          className="mb-3 text-xs uppercase tracking-widest text-neutral-300 "
          style={syne.style}
        >
          Messages
        </p>

        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-neutral-500 text-sm p-3">
              No conversations found
            </div>
          ) : (
            conversations.map((conversation) => {
              const isSelected = selectedConversation?._id === conversation._id;
              const otherUser = conversation.participants.find(
                (participant: any) => participant._id !== session?.user.id,
              );

              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all min-w-0
                      ${
                        isSelected
                          ? "bg-neutral-900 border-neutral-700"
                          : "border-neutral-900 hover:bg-neutral-950"
                      }
                 `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-white text-sm font-bold"
                      style={syne.style}
                    >
                      {otherUser?.username?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-white" style={syne.style}>
                        @{otherUser?.username}
                      </p>

                      <p
                        className="text-sm text-neutral-500 truncate"
                        style={patrickHand.style}
                      >
                        {conversation.latestMessage?.text || "Start chatting"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Current User */}
      <div className="border-t border-neutral-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-900 flex justify-center items-center">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <p className="text-white text-sm" style={syne.style}>
              @{session?.user?.username}
            </p>
            <p className="text-xs text-green-500" style={syne.style}>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

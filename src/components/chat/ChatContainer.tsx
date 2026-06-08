"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { syne } from "@/lib/fonts";
import { formatDistanceToNow } from "date-fns";

export default function ChatContainer({
  selectedConversation,
}: {
  selectedConversation: any;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();

        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [selectedConversation]);

  const { data: session } = useSession();
  const otherUser = selectedConversation?.participants.find(
    (p: any) => p._id !== session?.user?.id,
  );
  console.log("this is the op", otherUser);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-green-600 px-6 py-3.5">
        <h2 className="text-white font-semibold" style={syne.style}>
          @{otherUser?.username}
        </h2>
        <p className="text-xs text-neutral-500">User status coming soon...</p>
      </div>

      <div className="flex-1 flex  text-neutral-500">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-neutral-500">
            No conversation selected
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center text-neutral-500">
            Loading...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((message) => {
              const isOwn = message.sender === session?.user?.id;
              return (
                <div
                  key={message._id}
                  className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className="rounded-xl bg-neutral-900 p-3 text-white max-w-[70%] wrap-break-word">
                    {message.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

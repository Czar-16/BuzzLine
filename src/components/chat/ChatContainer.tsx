"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { dmSans, syne } from "@/lib/fonts";
import { SendHorizonal, UserRound } from "lucide-react";
import { socket } from "@/lib/socket-client";

export default function ChatContainer({
  selectedConversation,
  conversations,
  setConversations,
}: {
  selectedConversation: any;
  conversations: any[];
  setConversations: (value: any) => void;
}) {
  const [chatMessages, setChatMessages] = useState<any[]>([]); // all messgae already in the chat
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState(""); // user currently typing

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();

        if (data.success) {
          setChatMessages(data.messages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [selectedConversation]);

  // Join the socket room whenever the selected conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    socket.emit("join-conversation", selectedConversation._id);
  }, [selectedConversation]);

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      setConversations((prev: any[]) =>
        prev.map((conversation) => {
          if (conversation._id === message.conversation) {
            return {
              ...conversation,
              latestMessage: message,
            };
          }

          return conversation;
        }),
      );

      if (message.conversation === selectedConversation?._id) {
        setChatMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedConversation]);

  const { data: session } = useSession();
  const otherUser = selectedConversation?.participants.find(
    (p: any) => p._id !== session?.user?.id,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          text: messageText,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const data = await res.json();

      if (data.success) {
        // update message in the chat container
        setChatMessages((prev) => [...prev, data.message]);

        socket.emit("send-message", {
          conversationId: selectedConversation._id,
          message: data.message,
        });

        // update latest message in the sidebar
        setConversations((prev: any[]) =>
          prev.map((conversation) => {
            if (conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                latestMessage: data.message,
              };
            }

            return conversation;
          }),
        );
        setMessageText("");
        // after sending big message text area : resets to its original size
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {selectedConversation && (
        <div className="border-b border-zinc-900 px-6 py-3.5  flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full bg-neutral-950 flex items-center justify-center shrink-0 text-white text-sm font-semibold"
            style={syne.style}
          >
            {otherUser?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-semibold" style={syne.style}>
              @{otherUser?.username}
            </h2>
            {otherUser?.isOnline ? (
              <p className="text-xs text-green-500" style={syne.style}>
                Online
              </p>
            ) : (
              <p className="text-xs text-neutral-500" style={syne.style}>
                Last seen{" "}
                {otherUser?.lastActive
                  ? new Date(otherUser.lastActive).toLocaleString([], {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "recently"}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 flex  text-neutral-500 min-h-0">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-neutral-500 ">
            Pick a conversation, don't be shy.
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center text-neutral-500">
            Loading...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 min-w-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
            {chatMessages.map((chatMessage) => {
              const isOwn = chatMessage.sender === session?.user?.id;
              return (
                <div
                  key={chatMessage._id}
                  className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[70%] w-fit" style={dmSans.style}>
                    <div className="rounded-xl bg-[#121318] p-3 text-neutral-200 wrap-break-word overflow-hidden">
                      <p>{chatMessage.text}</p>
                      <span
                        className={`text-[10px] text-neutral-500 mt-1 flex ${isOwn ? "justify-end" : "justify-end"}`}
                        style={dmSans.style}
                      >
                        {new Date(chatMessage.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
        )}
      </div>

      {selectedConversation && (
        <div className="border-t border-zinc-900 p-4 ">
          <div className="flex gap-3 items-end ">
            {" "}
            <textarea
              autoFocus
              value={messageText}
              ref={textareaRef}
              onChange={(e) => {
                setMessageText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Message @${otherUser?.username || "user"}...`}
              rows={1}
              className="flex-1 rounded-xl border border-zinc-900 bg-neutral-950 px-4 py-2 text-white outline-none resize-none custom-scrollbar"
              style={{
                ...dmSans.style,
                maxHeight: "120px",
                overflowY:
                  (textareaRef.current?.scrollHeight ?? 0) > 120
                    ? "auto"
                    : "hidden",
              }}
            />
            <button
              onClick={sendMessage}
              className="rounded-xl border border-zinc-900 p-2.5 text-white cursor-pointer hover:bg-neutral-900 transition-colors"
            >
              <SendHorizonal size={19} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

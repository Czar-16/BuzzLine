"use client";

import { dmSans, syne } from "@/lib/fonts";
import { LogOut, Search, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Conversation {
  _id: string;
  participants: any[];
  latestMessage?: any;
}
export default function ChatSidebar({
  conversations,
  setConversations,
  loading,
  setLoading,
  selectedConversation,
  setSelectedConversation,
}: any) {
  // export default function ChatSidebar({
  //   selectedConversation,
  //   setSelectedConversation,
  // }: {
  //   selectedConversation: any; // TODO: replace with proper type if needed
  //   setSelectedConversation: (value: any) => void;
  // }) {
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

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([]);

  useEffect(() => {
    if (search.length < 2) {
      setSearchResult([]);
      return;
    }

    const searchUsers = async () => {
      try {
        const res = await fetch(`/api/users/search?q=${search}`);
        const data = await res.json();
        if (data.success) {
          setSearchResult(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer); //  cancel previous timer if user types again before 500ms
  }, [search]);

  const startConversation = async (userId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await res.json();
      console.log("POST conversation:", data.conversation);
      // if (data.success) {
      //   setSelectedConversation(data.conversation);
      //   setSearch("");
      //   setSearchResult([]);
      // }

      // true/false deta hai, bas exist karta hai ya nahi
      if (data.success) {
        const exists = conversations.some(
          (convo: any) => convo._id === data.conversation.id,
        );
        if (!exists) {
          setConversations((prev: any) => [data.conversation, ...prev]); // new conversation could be seen on sidebar on top
        }
        setSelectedConversation(data.conversation);
        setSearch("");
        setSearchResult([]);
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <aside className="w-80 border-r border-neutral-800 bg-black">
        <div className="p-4 text-white" style={syne.style}>
          Loading conversations...
        </div>
      </aside>
    );
  }
  return (
    <aside className="w-80 border-r border-zinc-900 bg-black flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-zinc-900 flex items-center gap-2">
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
        <div className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-neutral-950 hover:bg-black px-3 py-2 ">
          <Search size={16} className="text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username..."
            className="w-full bg-transparent outline-none text-sm text-white "
            style={syne.style}
          />
        </div>
      </div>
      {searchResult.length > 0 && (
        <div className="mx-4 mb-2 rounded-xl border border-zinc-900 bg-[#0d0d0d] overflow-hidden">
          {searchResult.map((user) => (
            <div
              key={user._id}
              onClick={() => startConversation(user._id)}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-neutral-900 transition-colors"
              style={syne.style}
            >
              <div className="h-8 w-8 rounded-full bg-[#121318] flex items-center justify-center shrink-0 text-white text-xs font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-white text-sm">@{user.username}</span>
            </div>
          ))}
        </div>
      )}
      {/* Conversations  and the scroll bar*/}
      <div className="flex-1 px-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
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
            conversations.map((conversation: any) => {
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
                          ? "bg-neutral-950 border-zinc-900"
                          : "border-neutral-900 hover:bg-neutral-950"
                      }
                 `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="h-10 w-10 rounded-full bg-[#121318] flex items-center justify-center shrink-0 text-white text-sm font-bold"
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
                        style={dmSans.style}
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
      <div className="border-t border-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#121318] flex justify-center items-center">
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer">
                <LogOut size={18} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#121318] border-neutral-900">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white" style={syne.style}>
                  Logout?
                </AlertDialogTitle>
                <AlertDialogDescription style={syne.style}>
                  Are you sure you want to logout?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="border-neutral-800 text-white hover:bg-neutral-900 cursor-pointer"
                  style={syne.style}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  style={syne.style}
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
}

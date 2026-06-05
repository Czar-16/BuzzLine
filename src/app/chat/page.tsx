import LogoutButton from "@/components/auth/LogoutButton";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!session.user.hasUsername) {
    redirect("/choose-username");
  }

  return (
    <div className="h-screen bg-black flex">
      <ChatSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-18 border-b border-neutral-900 flex items-center justify-between px-6">
          <div>
            <h2 className="text-white font-semibold">@alex</h2>
            <p className="text-sm text-green-500">Online now</p>
          </div>

          <LogoutButton />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-md rounded-2xl bg-neutral-900 px-4 py-3 text-white">
            Hey! You finally made it on Buzzline 👋
          </div>

          <div className="ml-auto max-w-md rounded-2xl bg-neutral-800 px-4 py-3 text-white">
            Yeah just picked my username and jumped in lol
          </div>

          <div className="max-w-md rounded-2xl bg-neutral-900 px-4 py-3 text-white">
            fr this app is actually clean. real-time is insane 🔥
          </div>

          <div className="ml-auto max-w-md rounded-2xl bg-neutral-800 px-4 py-3 text-white">
            Zero lag too. didn't expect it to be this smooth
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-neutral-900 p-4">
          <div className="flex gap-3">
            <input
              placeholder="Message @alex..."
              className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none"
            />

            <button className="rounded-xl border border-neutral-800 px-5 text-white">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

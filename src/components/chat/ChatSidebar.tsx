import { Search } from "lucide-react";

const conversations = [
  {
    id: 1,
    username: "@alex",
    lastMessage: "fr this app is clean 🔥",
    online: true,
  },
  {
    id: 2,
    username: "@John",
    lastMessage: "you there?",
    online: true,
  },
  {
    id: 3,
    username: "@Czar",
    lastMessage: "real-time is insane here",
    online: false,
  },
  {
    id: 4,
    username: "@bott",
    lastMessage: "sent you something",
    online: false,
  },
];

export default function ChatSidebar() {
  return (
    <aside className="w-80 border-r border-neutral-900 bg-black flex flex-col">
      {/* Logo */}

      <div className="p-5 border-b border-neutral-900 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-white" />
        <h1 className="text-xl font-bold tracking-wider text-white">
          BUZZLINE
        </h1>
      </div>
      {/* Search */}
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2">
          <Search size={16} className="text-neutral-500" />
          <input
            placeholder="Search username..."
            className="w-full bg-transparent outline-none text-sm text-white"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 px-3">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-500">
          Messages
        </p>

        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="rounded-xl border border-neutral-900 p-3 hover:bg-neutral-950 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-neutral-800" />

                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-black" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-white">
                    {conversation.username}
                  </p>

                  <p className="text-sm text-neutral-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current User */}
      <div className="border-t border-neutral-900 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-700" />

          <div>
            <p className="text-white text-sm">@you</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

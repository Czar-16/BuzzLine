"use client";

export default function ChatContainer({
  selectedConversation,
}: {
  selectedConversation: any;
}) {
  console.log(selectedConversation);
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-17 border-b border-neutral-900 flex items-center px-6">
        <h2 className="text-white">
          {selectedConversation
            ? "Conversation Selected"
            : "Select a conversation"}
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center text-neutral-500">
        No conversation selected
      </div>
    </div>
  );
}

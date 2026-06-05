"use client";

export default function TestPage() {
  const createConversation = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "6a22ea815a3a736c09e1ffc5",
      }),
    });

    const data = await res.json();

    console.log("Conversation:");
    console.log(data);
  };

  return (
    <div className="flex gap-4 p-10">
      <button
        className="bg-red-700 px-4 py-2 rounded"
        onClick={createConversation}
      >
        Create Conversation
      </button>
    </div>
  );
}

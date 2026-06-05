"use client";

export default function TestPage() {
  const sendMessage = async () => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: "6a22ed025a3a736c09e1ffc7",
        text: "Hello Rahul",
      }),
    });

    const data = await res.json();

    console.log("Message:");
    console.log(data);
  };

  return (
    <div className="flex gap-4 p-10">
      <button className="bg-blue-700 px-4 py-2 rounded" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
}

import LogoutButton from "@/components/auth/LogoutButton";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatLayout from "@/components/chat/ChatLayout";
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
    <div className="h-screen bg-black flex ">
      <ChatLayout />
    </div>
  );
}

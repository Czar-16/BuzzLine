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

  return <div>Chat Page</div>;
}

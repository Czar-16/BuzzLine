import LogoutButton from "@/components/auth/LogoutButton";
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
    <div className="p-10">
      <h1>Chat Page</h1>

      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}

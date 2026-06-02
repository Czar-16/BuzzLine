import { authOptions } from "@/lib/auth";
import ChooseUsernameForm from "@/components/auth/ChooseUsernameForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChooseUsernamePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.hasUsername) {
    redirect("/chat");
  }

  return <ChooseUsernameForm />;
}

import LoginForm from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if(session?.user?.hasUsername){
    redirect("/chat");
  }

  if(session && !session.user.hasUsername){
    redirect("/choose-username")
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black">
      <div className="hidden lg:flex items-center justify-center border-r border-[#111]">
        <div className="max-w-md px-10">
          <h1 className="text-5xl font-bold text-white">Buzzline</h1>

          <p className="mt-4 text-[#555] text-lg">
            Real-time conversations. Zero noise.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

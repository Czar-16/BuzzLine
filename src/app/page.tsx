import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    if (session.user.hasUsername) {
      redirect("/chat");
    }
    redirect("/choose-username");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-7xl min-h-[85vh] rounded-3xl border overflow-hidden grid lg:grid-cols-2">
        {/* LEFT HERO SECTION  flex flex-col justify-between*/}
        <div className="border-r p-8 flex flex-col justify-between">
          {/* Top */}

          <div>
            <h1 className="text-3xl font-bold">Buzzline</h1>

            <div className="mt-10 space-y-6">
              <div className="max-w-xs rounded-2xl border p-4">
                <p className="text-xs text-muted-foreground">@alex</p>

                <p className="mt-2">Hey, you there? 👋</p>
              </div>

              <div className="ml-auto max-w-xs rounded-2xl border p-4">
                <p>Yeah! Just joined Buzzline.</p>
              </div>

              <div className="max-w-xs rounded-2xl border p-4">
                <p className="text-xs text-muted-foreground">@raj</p>

                <p className="mt-2">Real-time chat is insane here 🔥</p>
              </div>

              <div className="ml-auto max-w-xs rounded-2xl border p-4">
                <p>Chose my username and jumped right in 🚀</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">2,400 online now</span>
            </div>

            <div>
              <h2 className="text-5xl font-bold leading-tight">
                Chat in real time.
                <br />
                No lag.
                <br />
                No fluff.
              </h2>

              <p className="mt-4 text-muted-foreground">
                Pick a username and start chatting instantly.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT REGISTER SECTION */}

        <div className="p-8 flex items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
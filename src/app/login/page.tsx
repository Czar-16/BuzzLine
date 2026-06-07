import LoginForm from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { syne } from "@/lib/fonts";

const tiles = [
  {
    icon: "⚡",
    title: "Instant delivery",
    desc: "Messages land in milliseconds. No refresh, no waiting.",
    wide: true,
  },
  {
    icon: "🔒",
    title: "Secure",
    desc: "Passwords hashed. Sessions protected.",
    wide: false,
  },
  {
    icon: "🎯",
    title: "Username first",
    desc: "Your handle, your identity. Simple.",
    wide: false,
  },
  {
    icon: "🌐",
    title: "Built for everyone",
    desc: "No downloads. No setup. Just a username and you're in.",
    wide: true,
  },
];

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.hasUsername) redirect("/chat");
  if (session && !session.user.hasUsername) redirect("/choose-username");

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-[#0d0d0d] border border-[#1e1e1e] rounded-3xl overflow-hidden grid lg:grid-cols-2">
        {/* ── LEFT PANEL ── */}
        <div className="border-r border-[#1e1e1e] p-8 flex flex-col justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span
              className="text-white text-sm font-bold tracking-widest uppercase"
              style={syne.style}
            >
              Buzzline
            </span>
          </div>

          {/* Feature tiles */}
          <div className="grid grid-cols-2 gap-3 flex-1 content-center">
            {tiles.map((t) => (
              <div
                key={t.title}
                className={`bg-[#111] border border-[#1a1a1a] rounded-2xl p-4 flex gap-3 ${
                  t.wide ? "col-span-2 flex-row items-center" : "flex-col"
                }`}
              >
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div>
                  <p
                    className="text-white text-sm font-bold mb-1"
                    style={syne.style}
                  >
                    {t.title}
                  </p>
                  <p className="text-[#444] text-xs leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div>
            <div className="h-px bg-[#1a1a1a] mb-4" />
            <h2
              className="text-white text-xl font-extrabold leading-snug mb-1"
              style={syne.style}
            >
              Welcome back.
              <br />
              <span className="text-[#333]">You were missed.</span>
            </h2>
            <p className="text-[#333] text-xs mt-2">
              New here?{" "}
              <a
                href="/register"
                className="text-[#555] underline hover:text-white transition-colors"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex items-center justify-center p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { syne } from "@/lib/fonts";

const bubbles = [
  { from: "them", avatar: "A", handle: "@alex", text: "Hey, you there? 👋" },
  { from: "me", text: "Yeah! Just joined Buzzline. This is clean." },
  {
    from: "them",
    avatar: "R",
    handle: "@raj",
    text: "Real-time chat is insane here ngl",
  },
  { from: "me", text: "Fr. Chose my username and jumped in 🔥" },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    if (session.user.hasUsername) redirect("/chat");
    redirect("/choose-username");
  }

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

          {/* Chat bubbles */}
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {bubbles.map((b, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1.5 max-w-[82%] ${
                  b.from === "me"
                    ? "self-end items-end"
                    : "self-start items-start"
                }`}
              >
                {b.from === "them" && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#252525] flex items-center justify-center text-[10px] text-[#666] font-semibold">
                      {b.avatar}
                    </div>
                    <span className="text-[11px] text-[#555]">{b.handle}</span>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    b.from === "me"
                      ? "bg-[#1c1c1c] border border-[#2a2a2a] text-[#ccc] rounded-br-sm"
                      : "bg-[#141414] border border-[#202020] text-[#999] rounded-bl-sm"
                  }`}
                >
                  {b.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#111] border border-[#1e1e1e] rounded-full px-3 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] text-[#888]">2,400 online now</span>
            </div>

            <h2
              className="text-white text-3xl font-extrabold leading-snug mb-2"
              style={syne.style}
            >
              Chat in real time.
              <br />
              <span className="text-[#555]">No lag. No fluff.</span>
            </h2>

            <p className="text-[#555] text-sm mb-4">
              Pick a username, start chatting instantly.
            </p>

            <div className="flex gap-1.5 items-center">
              <div className="w-5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex items-center justify-center p-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

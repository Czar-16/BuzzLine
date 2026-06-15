"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dmSans, syne } from "@/lib/fonts";
import { useSession } from "next-auth/react";

const bgBubbles = [
  { side: "l", text: "Hey, you finally joined! 👋" },
  { side: "r", text: "Yep, just picking a username 😎" },
  { side: "l", text: "Make it a good one, people will remember it" },
  { side: "r", text: "You are giving me pressure 🫠" },
  { side: "l", text: "Most of the cool ones are probably taken" },
  { side: "r", text: "Already finding that out :(" },
  { side: "l", text: "this app is actually clean ngl" },
  { side: "r", text: "whoever built this cooked" },
  { side: "l", text: "Found your username yet?" },
  { side: "r", text: "Got a few ideas cooking 🔥" },
  { side: "l", text: "Don't take too long, we're waiting 👀" },
  { side: "r", text: "Alright, almost done!" },
  { side: "l", text: "Perfect. See you in chat 🚀" },
  { side: "r", text: "On my way 😏" },
];

const topOffsets = [2, 5, 3, 7, 4, 6, 2, 8, 3, 5, 4, 6, 3, 7];

export default function ChooseUsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  let debounceTimer: ReturnType<typeof setTimeout>;

  const checkUsername = async (value: string) => {
    clearTimeout(debounceTimer);
    if (!value || value.length < 3) {
      setAvailable(null);
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await fetch(`/api/username/check?username=${value}`);
        const data = await res.json();
        setAvailable(data.available);
      } catch (error) {
        console.log(error);
      } finally {
        setChecking(false);
      }
    }, 1000);
  };

  const { update } = useSession();

  const saveUsername = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save username");
        return;
      }
      toast.success("Username created successfully 🎉");
      await update();
      setTimeout(() => router.replace("/chat"), 1500);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = /^[a-zA-Z0-9_]+$/.test(username) && username.length >= 3;

  const renderStatus = () => {
    if (!username)
      return (
        <p
          className="flex items-center gap-1.5 text-xs text-[#555]"
          style={dmSans.style}
        >
          <Info size={12} />
          3–20 chars, letters, numbers, underscores
        </p>
      );
    if (!isValid)
      return (
        <p
          className="flex items-center gap-1.5 text-xs text-red-500"
          style={dmSans.style}
        >
          <XCircle size={12} />
          min 3 chars : Only letters, numbers, and underscores
        </p>
      );
    if (checking)
      return (
        <p
          className="flex items-center gap-1.5 text-xs text-[#555]"
          style={dmSans.style}
        >
          <Loader2 size={12} className="animate-spin" />
          Checking availability...
        </p>
      );
    if (available === true)
      return (
        <p
          className="flex items-center gap-1.5 text-xs text-green-500"
          style={dmSans.style}
        >
          <CheckCircle2 size={12} />
          Available!
        </p>
      );
    if (available === false)
      return (
        <p
          className="flex items-center gap-1.5 text-xs text-red-500"
          style={dmSans.style}
        >
          <XCircle size={12} />
          Username taken
        </p>
      );
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background chat bubbles */}
      <div className="absolute inset-0 flex flex-col gap-3 p-8 pointer-events-none select-none">
        {bgBubbles.map((b, i) => (
          <div
            key={i}
            className={`flex max-w-xs ${b.side === "r" ? "self-end" : "self-start"}`}
            style={{ marginTop: `${topOffsets[i]}px` }}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                b.side === "l"
                  ? "bg-[#141414] border border-[#1e1e1e] text-[#aaa] rounded-bl-sm"
                  : "bg-[#141414] border border-[#222] text-[#999] rounded-br-sm"
              }`}
              style={dmSans.style}
            >
              {b.text}
            </div>
          </div>
        ))}
      </div>

      {/* Radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 65%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm bg-[#0a0a0a]/90 border border-[#1e1e1e] rounded-3xl p-8 space-y-7"
        style={{ backdropFilter: "blur(12px)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          <span
            className="text-[12px] font-bold tracking-widest text-[#666] uppercase leading-none"
            style={syne.style}
          >
            Buzzline
          </span>
        </div>

        {/* Heading */}
        <div>
          <h1
            className="text-white text-3xl font-extrabold leading-tight tracking-tight"
            style={syne.style}
          >
            Pick your
            <br />
            username
          </h1>
          <p
            className="text-[#777] text-sm leading-relaxed mt-2"
            style={dmSans.style}
          >
            Everyone&apos;s already talking. Are you?
          </p>
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444] text-sm pointer-events-none">
              @
            </span>
            <Input
              value={username}
              onChange={(e) => {
                const val = e.target.value;
                setUsername(val);
                setAvailable(null);
                checkUsername(val);
              }}
              maxLength={20}
              placeholder="yourname"
              className="pl-7 h-12 bg-[#111] border-[#222] text-white placeholder:text-[#333] rounded-xl focus-visible:ring-0 focus-visible:border-[#444] transition-colors"
              style={syne.style}
            />
          </div>
          <div className="min-h-[18px] px-0.5">{renderStatus()}</div>
        </div>

        {/* Button */}
        <Button
          onClick={saveUsername}
          disabled={!available || loading}
          className="w-full h-12 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 disabled:opacity-25 transition-all cursor-pointer"
          style={syne.style}
        >
          {loading ? (
            <span className="flex items-center gap-2" style={syne.style}>
              <Loader2 size={14} className="animate-spin" /> Saving...
            </span>
          ) : (
            "Save username"
          )}
        </Button>

        {/* Divider */}
        <div className="h-px bg-[#1a1a1a]" />

        {/* Rules */}
        <div className="grid grid-cols-2 gap-2">
          {[
            "Permanent handle",
            "No spaces",
            "Visible to all",
            "Case insensitive",
          ].map((rule) => (
            <div
              key={rule}
              className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-[#666] text-[11px]"
              style={syne.style}
            >
              {rule}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

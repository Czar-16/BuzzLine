"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2, Info } from "lucide-react";
import { Syne } from "next/font/google";
import { toast } from "sonner";
import router from "next/navigation";
import { useRouter } from "next/navigation";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

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
    }, 900);
  };

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
      toast.success("Username created successfully🎉");
      setTimeout(() => {
        router.replace("/chat");
      }, 1500);
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
        <p className="flex items-center gap-1.5 text-xs text-neutral-600">
          <Info size={12} /> 3–20 chars, letters, numbers, underscores
        </p>
      );
    if (!isValid)
      return (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <XCircle size={12} /> Only letters, numbers, and underscores
        </p>
      );
    if (checking)
      return (
        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Loader2 size={12} className="animate-spin" /> Checking
          availability...
        </p>
      );
    if (available === true)
      return (
        <p className="flex items-center gap-1.5 text-xs text-green-500">
          <CheckCircle2 size={12} /> Available!
        </p>
      );
    if (available === false)
      return (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <XCircle size={12} /> Username taken
        </p>
      );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#0e0e0e] border border-[#222] rounded-3xl shadow-none">
        {/* App name */}
        <div className="flex items-center gap-2 px-6 pt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[12px] font-medium  text-[#bebebe] uppercase">
            Buzzline
          </span>
        </div>

        <CardHeader className="pb-2">
          <CardTitle
            className="text-white text-3xl font-extrabold leading-tight tracking-tight"
            style={syne.style}
          >
            Pick your
            <br />
            username
          </CardTitle>
          <p className="text-[#666] text-sm leading-relaxed mt-1">
            Others will see this in chat. Choose wisely — it&apos;s permanent.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
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
                className="pl-7 h-12 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#444] rounded-xl focus-visible:ring-0 focus-visible:border-[#555]"
              />
            </div>
            <div className="min-h-[18px] px-0.5">{renderStatus()}</div>
          </div>

          {/* Button */}
          <Button
            onClick={saveUsername}
            disabled={!available || loading}
            className="w-full h-12 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-300 disabled:opacity-25 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Saving...
              </span>
            ) : (
              "Save username"
            )}
          </Button>

          {/* Rules */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              "Permanent handle",
              "No spaces",
              "Visible to all",
              "Case insensitive",
            ].map((rule) => (
              <div
                key={rule}
                className="bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-[#555] text-[11px]"
              >
                {rule}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

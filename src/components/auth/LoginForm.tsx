"use client";

import { signIn } from "next-auth/react";
import { Syne } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

import { patrickHand, syne } from "@/lib/fonts";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        toast.error("Invalid username or password");
        return;
      }

      toast.success("Login successful ✅");
      setTimeout(() => router.replace("/"), 1000);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-5 w-full max-w-md px-10 py-12 bg-[#070706] rounded-3xl">
      {/* Heading */}
      <div>
        <h1 className="text-white text-3xl font-extrabold" style={syne.style}>
          Welcome back
        </h1>
        <p
          className="text-[#444] text-sm mt-1.5 leading-relaxed"
          style={patrickHand.style}
        >
          Good to see you again. Let&apos;s get you in.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <Input
          placeholder="Username"
          style={patrickHand.style}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-12 bg-[#0d0d0d] border border-[#1e1e1e] text-white placeholder:text-[#333] rounded-xl focus-visible:ring-0 focus-visible:border-[#444] transition-colors"
        />
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 bg-[#0d0d0d] border border-[#1e1e1e] text-white placeholder:text-[#333] rounded-xl focus-visible:ring-0 focus-visible:border-[#444] transition-colors"
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleLogin}
        disabled={loading}
        className="w-full h-12 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 disabled:opacity-30 transition-all text-base cursor-pointer"
        style={patrickHand.style}
      >
        {loading ? "Signing in..." : "Login"}
      </Button>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <Separator className="flex-1 bg-[#2a2a2a]" />
        <span
          className="text-[9px] text-[#555] tracking-widest uppercase"
          style={syne.style}
        >
          or continue with
        </span>
        <Separator className="flex-1 bg-[#2a2a2a]" />
      </div>

      {/* Google + Register link */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11 bg-[#0d0d0d] border-[#1e1e1e] text-[#888] hover:bg-[#111] hover:text-white hover:border-[#333] rounded-xl transition-all gap-2 cursor-pointer"
          style={syne.style}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </div>

      {/* Terms */}
      <p
        className="text-[10px] text-[#2a2a2a] text-center leading-relaxed"
        style={syne.style}
      >
        By signing in you agree to our{" "}
        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#383838] underline hover:text-white transition-colors"
          style={syne.style}
        >
          Terms
        </Link>
        {" & "}
        <Link
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#383838] underline hover:text-white transition-colors"
          style={syne.style}
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button
      className="cursor-pointer text-black"
      onClick={() => {
        signOut({
          callbackUrl: "/",
        });
      }}
    >
      Logout
    </Button>
  );
}

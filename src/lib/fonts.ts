import { Syne } from "next/font/google";

import { DM_Sans } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

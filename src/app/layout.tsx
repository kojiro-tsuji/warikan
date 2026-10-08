import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  weight: ["500", "700"],
  subsets: ["latin"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WARIKAN",
  description: "友人同士の立て替えを記録し、精算額を自動計算するアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${zenMaru.variable} ${zenKaku.variable}`}>
      <body>{children}</body>
    </html>
  );
}

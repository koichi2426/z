import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Sidebarをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "z",
  description: "シンプルなSNSアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-black text-white`}>
        <div className="container mx-auto flex min-h-screen max-w-7xl">
          <Sidebar /> {/* ← ここに配置する */}
          <main className="flex-1 border-x border-slate-700">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
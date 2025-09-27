import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";
import { verifyToken, VerifyTokenResponse } from "@/fetchs/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "z",
  description: "シンプルなSNSアプリケーション",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || null;

  let user: VerifyTokenResponse | null = null;

  try {
    if (token) {
      const res = await verifyToken(token);
      if (res && res.id) {
        user = res;
      }
    }
  } catch (err) {
    console.error("RootLayout::verifyToken failed", err);
  }

  return (
    <html lang="ja">
      <body>
        <div className="container mx-auto flex min-h-screen max-w-7xl">
          {/* token も渡す */}
          <Sidebar user={user} token={token} />
          <main className="flex-1 border-x border-slate-700">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
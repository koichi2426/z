import Link from "next/link";
import { Home, User, LogIn, Shield } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { VerifyTokenResponse } from "@/fetchs/auth";

type SidebarProps = {
  user: VerifyTokenResponse | null;
  token: string | null; // ← 追加
};

export default function Sidebar({ user, token }: SidebarProps) {
  const signedIn = !!user;

  const navItems = [
    { href: "/", label: "ホーム", icon: Home, show: true },
    {
      href: user ? `/${user.username}` : "#", // ← 動的にユーザーネームを反映
      label: "プロフィール",
      icon: User,
      show: signedIn,
    },
    { href: "/login", label: "ログイン", icon: LogIn, show: !signedIn },
  ];

  return (
    <header className="flex flex-col justify-between p-4 w-64 h-screen border-r border-slate-700">
      <div>
        <div className="text-2xl font-bold mb-8">z</div>

        {signedIn && (
          <div className="mb-6">
            <div className="text-lg font-semibold">{user?.name}</div>
            <div className="text-sm text-slate-400">{user?.email}</div>
          </div>
        )}

        <nav>
          <ul>
            {navItems.map(
              (item) =>
                item.show && (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-4 py-3 px-4 rounded-full hover:bg-slate-900 transition-colors duration-200"
                    >
                      <item.icon size={24} />
                      <span className="text-xl">{item.label}</span>
                    </Link>
                  </li>
                )
            )}
          </ul>
        </nav>
      </div>
      {signedIn && token && (
        <div className="mb-4">
          {/* token を渡す */}
          <LogoutButton token={token} />
        </div>
      )}
    </header>
  );
}

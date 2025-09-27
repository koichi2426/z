import Link from "next/link";
import { Home, User, LogIn, Shield } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";
import { API_URL } from "@/fetchs/config";

export default async function Sidebar() {
  // next/headers の cookies() は Promise の場合があるので await
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let signedIn = false;
  try {
    if (token) {
      const res = await fetch(`${API_URL}/v1/auth/verify?token=${token}`, {
        method: "POST",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        signedIn = data.valid;
      }
    }
  } catch (err) {
    console.error("Token verification failed:", err);
  }

  const navItems = [
    { href: "/", label: "ホーム", icon: Home, show: true },
    { href: "/koichi", label: "プロフィール", icon: User, show: signedIn },
    { href: "/admin", label: "管理", icon: Shield, show: signedIn },
    { href: "/login", label: "ログイン", icon: LogIn, show: !signedIn },
  ];

  return (
    <header className="flex flex-col justify-between p-4 w-64 h-screen border-r border-slate-700">
      <div>
        <div className="text-2xl font-bold mb-8">z</div>
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
      {signedIn && (
        <div className="mb-4">
          <LogoutButton />
        </div>
      )}
    </header>
  );
}

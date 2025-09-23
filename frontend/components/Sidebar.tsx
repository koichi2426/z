import Link from 'next/link';
// Shieldを追加
import { Home, User, LogIn, Shield } from 'lucide-react';

const navItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/koichi', label: 'プロフィール', icon: User },
  { href: '/login', label: 'ログイン', icon: LogIn },
  // Adminページへのリンクを追加
  { href: '/admin', label: '管理', icon: Shield },
];

// ...以降は変更なし
export default function Sidebar() {
  return (
    <header className="flex flex-col p-4 w-64">
      <div className="text-2xl font-bold mb-8">z</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="flex items-center space-x-4 py-3 px-4 rounded-full hover:bg-slate-900 transition-colors duration-200">
                <item.icon size={24} />
                <span className="text-xl">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
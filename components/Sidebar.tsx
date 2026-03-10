'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/new', label: 'Nuevo Post', icon: '➕' },
  { href: '/scheduled', label: 'Programados', icon: '📅' },
  { href: '/calendar', label: 'Calendario', icon: '🗓️' },
  { href: '/history', label: 'Historial', icon: '📜' },
  { href: '/settings', label: 'Configuración', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1E293B] text-white flex flex-col z-50">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <span className="text-xl font-bold text-orange-400">PostScheduler</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(item => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href ? 'bg-orange-500/20 text-orange-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm">JK</div>
          <div>
            <div className="text-sm font-medium">Jhonatan</div>
            <div className="text-xs text-orange-400">Plan Pro ✨</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

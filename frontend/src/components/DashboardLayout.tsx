import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Sakhi Chat', path: '/chat' },
    { icon: BookOpen, label: 'Academic Hub', path: '/academics' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
  ];

  return (
    <aside className="w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-black tracking-tighter text-white">SAKHI<span className="text-blue-500">.</span></h1>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon size={20} />
            <span className="font-semibold text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="font-bold text-sm">Session Terminate</span>
        </button>
      </div>
    </aside>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      <Sidebar />
      <main className="flex-grow relative overflow-auto">
        <div className="absolute inset-0 sakhi-grid opacity-[0.03] pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

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
    <aside className="w-72 bg-[#080808]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen sticky top-0 relative overflow-hidden">
      {/* Sidebar Accent Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl opacity-50"></div>
      
      <div className="p-10">
        <h1 className="text-3xl font-black tracking-tighter text-white">SAKHI<span className="text-blue-500">.</span></h1>
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mt-2">Core Interface</p>
      </div>

      <nav className="flex-grow px-6 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)]' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}
            `}
          >
            <item.icon size={22} className={`${isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="glass-card rounded-[32px] p-5 mb-6 bg-gradient-to-tr from-white/5 to-transparent border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-black text-white truncate">{user?.name}</p>
              <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">{user?.role}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 text-zinc-600 hover:text-red-400 font-bold text-xs uppercase tracking-widest transition-all"
        >
          <LogOut size={16} />
          Terminate Session
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

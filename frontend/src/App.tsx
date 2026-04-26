import { Routes, Route, Navigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import Terminal from './pages/Terminal';
import { useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import DashboardLayout from './components/DashboardLayout';
import { Sparkles, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

// Modules
import ChatInterface from './components/ChatInterface';

const DashboardHome = () => {
  const { user } = useAuth();
  
  // Role-based dashboard content
  const getRoleSpecificContent = () => {
    if (!user?.role) return null;
    
    switch(user.role) {
      case 'student':
        return (
          <div className="space-y-8">
            <div className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-blue-600/5 to-transparent">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">Check Attendance</span>
                  <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">My Subjects</span>
                  <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'faculty':
        return (
          <div className="space-y-8">
            <div className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-purple-600/5 to-transparent">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Faculty Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">Generate Workbook</span>
                  <span className="text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">Fortnight Report</span>
                  <span className="text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'college_admin':
        return (
          <div className="space-y-8">
            <div className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-green-600/5 to-transparent">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                Admin Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">College Statistics</span>
                  <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">Attendance Thresholds</span>
                  <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'superuser':
        return (
          <div className="space-y-8">
            <div className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-red-600/5 to-transparent">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                Super Admin Console
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => window.location.href = '/chat'} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-zinc-300">Platform Statistics</span>
                  <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
             Welcome back, <span className="text-blue-500">{user?.name?.split(' ')[0]}</span>
           </h2>
           <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
             Role: <span className="text-blue-500">{user?.role}</span> // Aacharya Node Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
           </p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Sync Active</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {getRoleSpecificContent()}
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-[40px] p-8 bg-blue-600 group hover:bg-blue-500 cursor-pointer overflow-hidden relative transition-all shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)]" onClick={() => window.location.href = '/chat'}>
             <Bot className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
             <h3 className="text-xl font-black text-white mb-2 relative z-10">Chat with Sakhi</h3>
             <p className="text-white/70 text-sm font-medium relative z-10 mb-6">Ask questions, generate reports, or get assistance.</p>
             <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-sm relative z-10">
               Open Chat
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { token, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth-success" element={<AuthCallback />} />
      
      {!token ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <Route path="*" element={
          <ChatProvider token={token}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/terminal" element={<Terminal />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/academics" element={<div className="p-8"><h2 className="text-2xl font-bold underline decoration-blue-500 underline-offset-8">Academic Hub</h2><p className="mt-8 text-zinc-500 italic">Course materials and syllabus coming soon...</p></div>} />
                <Route path="/attendance" element={<div className="p-8"><h2 className="text-2xl font-bold underline decoration-purple-500 underline-offset-8">Attendance Metrics</h2><p className="mt-8 text-zinc-500 italic">High-fidelity visualization syncing with Vitarn...</p></div>} />
              </Routes>
            </DashboardLayout>
          </ChatProvider>
        } />
      )}

      <Route path="/login" element={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
          {/* Neural Network Background */}
          <div className="absolute inset-0 neural-grid"></div>
          
          {/* Floating Cyber Orbs */}
          <div className="cyber-orb bg-blue-600/20 w-[600px] h-[600px] -top-20 -left-20"></div>
          <div className="cyber-orb bg-purple-600/10 w-[400px] h-[400px] bottom-0 right-0 animate-pulse [animation-duration:15s]"></div>
          <div className="cyber-orb bg-cyan-600/10 w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl w-full cyber-glass rounded-[48px] p-2 relative z-10"
          >
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[46px] p-16 text-center border border-white/5">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.3)] relative"
              >
                 <Sparkles className="text-white w-12 h-12" />
                 <div className="absolute inset-0 bg-blue-400/20 rounded-[32px] animate-ping opacity-50"></div>
              </motion.div>
              
              <h1 className="text-7xl font-black text-white mb-6 tracking-tightest leading-none glow-text">
                SAKHI<span className="text-blue-500">.</span>
              </h1>
              
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-8 opacity-50"></div>
              
              <p className="text-zinc-400 text-lg font-medium mb-12 max-w-sm mx-auto leading-relaxed">
                The Most Powerful <span className="text-white">Academic Intelligence</span> Node in the Aacharya Ecosystem.
              </p>
              
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(0, 255, 200, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={login}
                className="neo-cta w-full py-6 rounded-[24px] text-xl isolate"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Enter Terminal
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                </span>
              </motion.button>
              
              <div className="mt-16 flex items-center justify-center gap-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    Secure OIDC
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    PKCE S256
                 </div>
              </div>
            </div>
          </motion.div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-800 text-[9px] font-black uppercase tracking-[0.6em]">
            Authorized JNWN Terminal // Session 2.0.1
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;

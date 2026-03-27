import { Routes, Route, Navigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import { Sparkles } from 'lucide-react';

// Modules
import ChatInterface from './components/ChatInterface';

const DashboardHome = () => {
  const { user } = useAuth();
  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
             Welcome back, <span className="text-blue-500">{user?.name?.split(' ')[0]}</span>
           </h2>
           <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Aacharya Node Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Sync Active</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-blue-600/5 to-transparent">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Academic Pulse
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { label: 'Engineering Physics', grade: 'A+', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                   { label: 'Network Architecture', grade: 'B', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                   { label: 'Data Ethics', grade: 'A', color: 'text-green-400', bg: 'bg-green-400/10' },
                   { label: 'Applied AI', grade: 'A', color: 'text-orange-400', bg: 'bg-orange-400/10' }
                 ].map((course) => (
                   <div key={course.label} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
                      <span className="font-bold text-zinc-300">{course.label}</span>
                      <span className={`w-10 h-10 rounded-xl ${course.bg} ${course.color} flex items-center justify-center font-black text-sm`}>{course.grade}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-purple-600/5 to-transparent">
              <h3 className="text-xl font-bold mb-4">Upcoming Milestones</h3>
              <div className="space-y-4 pt-4">
                 <div className="flex gap-6 items-center">
                    <div className="text-center w-12 shrink-0">
                       <p className="text-blue-500 font-black text-xl leading-none">28</p>
                       <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">March</p>
                    </div>
                    <div className="flex-grow">
                       <p className="font-bold text-white">System Architecture Submission</p>
                       <p className="text-xs text-zinc-500">Node Sync Required // 23:59 IST</p>
                    </div>
                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 w-3/4"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-[40px] p-10 text-center flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 rounded-full border-[8px] border-blue-500/10 border-t-blue-500 mx-auto flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                <span className="text-4xl font-black text-white">88<span className="text-blue-500 text-xl">%</span></span>
              </div>
              <h4 className="text-lg font-black text-white tracking-tight">Average Attendance</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 px-4 py-1.5 bg-white/5 rounded-full inline-block">Sync with Vitarn v2.4</p>
            </div>
          </div>
          
          <div className="glass-card rounded-[40px] p-8 bg-blue-600 group hover:bg-blue-500 cursor-pointer overflow-hidden relative transition-all shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)]">
             <Bot className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
             <h3 className="text-xl font-black text-white mb-2 relative z-10">Need Assistance?</h3>
             <p className="text-white/70 text-sm font-medium relative z-10 mb-6">Sakhi AI is synced with your course syllabus.</p>
             <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-sm relative z-10">Enter Terminal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { token, isLoading } = useAuth();

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
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/academics" element={<div className="p-8"><h2 className="text-2xl font-bold underline decoration-blue-500 underline-offset-8">Academic Hub</h2><p className="mt-8 text-zinc-500 italic">Course materials and syllabus coming soon...</p></div>} />
              <Route path="/attendance" element={<div className="p-8"><h2 className="text-2xl font-bold underline decoration-purple-500 underline-offset-8">Attendance Metrics</h2><p className="mt-8 text-zinc-500 italic">High-fidelity visualization syncing with Vitarn...</p></div>} />
            </Routes>
          </DashboardLayout>
        } />
      )}

      <Route path="/login" element={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
          {/* Animated Background Artifacts */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-bounce [animation-duration:20s]"></div>
          
          <div className="max-w-xl w-full glass-card rounded-[48px] p-2 bg-gradient-to-br from-white/10 to-transparent relative z-10">
            <div className="bg-[#0a0a0a]/90 rounded-[46px] p-16 text-center">
              <div className="mb-12 inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.5)] rotate-12">
                 <Sparkles className="text-white w-10 h-10" />
              </div>
              
              <h1 className="text-6xl font-black text-white mb-6 tracking-tightest leading-none">
                SAKHI<span className="text-blue-500">.</span>
              </h1>
              <p className="text-zinc-400 text-lg font-medium mb-12 max-w-sm mx-auto leading-relaxed">
                The next generation of <span className="text-white">Agentic Academic Intelligence</span> for Aacharya Hub.
              </p>
              
              <button 
                onClick={login}
                className="group relative w-full py-6 bg-white text-black rounded-3xl font-black text-xl hover:scale-[1.02] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Launch Assistant
              </button>
              
              <div className="mt-12 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Secure OIDC</div>
                 <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">PKCE S256</div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
            Authorized JNWN Node // Terminal Session 2.0
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;

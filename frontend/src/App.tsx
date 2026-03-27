import { Routes, Route, Navigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';

// Modules
import ChatInterface from './components/ChatInterface';

const DashboardHome = () => {
  const { user } = useAuth();
  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-black text-white">Welcome, {user?.name?.split(' ')[0]}</h2>
        <p className="text-zinc-500 font-medium">Your academic overview for today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card rounded-3xl p-8">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
             Active Courses
           </h3>
           <div className="flex items-center justify-center py-12 text-zinc-600 border-2 border-dashed border-white/5 rounded-2xl">
              No active courses tracked yet.
           </div>
        </div>

        <div className="glass-card rounded-3xl p-8 flex flex-col justify-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl font-black">--%</span>
            </div>
            <h4 className="font-bold text-white">Avg. Attendance</h4>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Sync Required</p>
        </div>
      </div>
      
      <div className="glass-card rounded-3xl p-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
         <div className="bg-zinc-950/90 rounded-[22px] p-8">
            <h3 className="text-xl font-bold mb-2">Agentic Sakhi Status</h3>
            <p className="text-zinc-400 text-sm mb-6">Your personal AI agent is online and synced with Aacharya Hub.</p>
            <div className="flex gap-4">
               <span className="px-4 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">Ollama/Llama 3 Active</span>
               <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">RAG Context Synced</span>
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
        <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
          <div className="max-w-md w-full glass-card rounded-[40px] p-12 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
            
            <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">SAKHI<span className="text-blue-500">.</span></h1>
            <p className="text-zinc-400 font-medium mb-12">Authorized Node Access for Aacharya Ecosystem</p>
            
            <button 
              onClick={() => window.location.href = '/login'} // This will be handled by Context
              className="w-full py-4 bg-white text-black rounded-3xl font-black text-lg hover:bg-zinc-200 transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
            >
              Enter Terminal
            </button>
            <p className="mt-8 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Secure OIDC // PKCE S256</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;

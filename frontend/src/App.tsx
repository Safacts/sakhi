import { Routes, Route } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import { useAuth } from './context/AuthContext';
import ChatInterface from './components/ChatInterface';

function App() {
  const { token, login, logout } = useAuth();

  return (
    <div className="app-container min-h-screen bg-black text-white p-8">
      <Routes>
        <Route path="/auth-success" element={<AuthCallback />} />
        <Route path="/" element={
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12">
               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Āchārya Sakhi
               </h1>
               {!token ? (
                 <button onClick={login} className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
                   Login with Aacharya
                 </button>
               ) : (
                 <button onClick={logout} className="text-gray-400 hover:text-white transition">
                   Sign Out
                 </button>
               )}
            </div>

            {token ? (
               <ChatInterface />
            ) : (
               <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <h2 className="text-2xl mb-4">The Most Powerful Education Assistant</h2>
                  <p className="text-gray-400 max-w-lg mx-auto mb-8">
                     Access your courses, attendance, and AI-powered insights across the whole Aacharya ecosystem.
                  </p>
                  <button onClick={login} className="px-12 py-4 bg-blue-600 rounded-full text-lg hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)] transition-all">
                    Get Started
                  </button>
               </div>
            )}
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;

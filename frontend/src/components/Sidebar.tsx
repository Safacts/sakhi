import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  BarChart3, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Settings,
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tools = [
    { name: 'Attendance Guardian', icon: ShieldCheck, color: 'text-blue-500', active: true },
    { name: 'Grade Analyzer', icon: BarChart3, color: 'text-purple-500', active: false },
    { name: 'Policy Engine', icon: BookOpen, color: 'text-cyan-500', active: false },
    { name: 'Molt Core (Neural)', icon: Cpu, color: 'text-green-500', active: false },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-full relative cyber-glass border-r border-white/5 flex flex-col z-30 transition-all duration-300 ease-in-out"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand */}
      <div className="p-8 pb-12 flex items-center gap-4 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <span className="font-black text-white italic">S</span>
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-black text-xl tracking-tighter"
            >
              SAKHI<span className="text-blue-500">.</span>NODE
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tools Section */}
      <div className="flex-grow px-4 space-y-2">
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 px-4 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'T' : 'Agentic Tools'}
        </p>
        
        {tools.map((tool) => (
          <div 
            key={tool.name}
            className={`group p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
              tool.active ? 'bg-blue-600/10 border border-blue-500/20' : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <tool.icon className={`w-5 h-5 shrink-0 ${tool.active ? tool.color : 'text-zinc-500 group-hover:text-white transition-colors'}`} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`font-bold text-sm whitespace-nowrap ${tool.active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                >
                  {tool.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer / Settings */}
      <div className="p-6 mt-auto border-t border-white/5">
        <div className={`p-3 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-4 cursor-pointer group`}>
          <Settings className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:rotate-45 transition-all" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300"
              >
                Node Settings
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

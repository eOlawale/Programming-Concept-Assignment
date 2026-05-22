import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Code2, 
  FlaskConical, 
  Terminal, 
  ChevronRight, 
  Layers, 
  Cpu, 
  Braces,
  Settings,
  Monitor,
  CheckCircle2,
  GitBranch,
  Box,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { experiments, Language, Experiment } from './types';

SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);

function App() {
  const [selectedExp, setSelectedExp] = useState<Experiment>(experiments[0]);
  const [activeLang, setActiveLang] = useState<Language>(Language.JAVA);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [currentTestCase, setCurrentTestCase] = useState(experiments[0].generateTestCase("default"));

  useEffect(() => {
    setCurrentTestCase(selectedExp.generateTestCase(verificationId || "default"));
  }, [selectedExp, verificationId]);

  const getAvailableLanguages = (exp: Experiment) => {
    return Object.keys(exp.implementations) as Language[];
  };

  const handleExpChange = (exp: Experiment) => {
    setSelectedExp(exp);
    setIsMenuOpen(false);
    const langs = getAvailableLanguages(exp);
    if (!langs.includes(activeLang)) {
      setActiveLang(langs[0]);
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#12121e] border-r border-gray-800 p-6 overflow-y-auto w-full">
      <div className="flex items-center gap-3 mb-10 px-2 text-left">
        <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
          <Settings className="text-white" size={20} />
        </div>
        <h1 className="text-base font-bold tracking-tight text-white leading-tight">Programming Concept Support</h1>
      </div>

      {/* User Verification Module */}
      <div className="mb-8 px-2">
        <div className="p-4 bg-indigo-600/5 rounded-2xl border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-3 text-left">
            <UserCheck size={14} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Verification ID</span>
          </div>
          <input 
            type="text" 
            placeholder="Enter Name or ID..."
            value={verificationId}
            onChange={(e) => setVerificationId(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
          />
          <p className="text-[9px] text-gray-500 mt-2 italic leading-relaxed text-left">
            Unique test cases will be generated for this ID.
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2 mb-3 text-left">Experiments</p>
        {experiments.map((exp) => (
          <button
            key={exp.id}
            onClick={() => handleExpChange(exp)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left ${
              selectedExp.id === exp.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
                : 'hover:bg-white/5 text-gray-400 border border-transparent'
            }`}
          >
            <span className={`w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-[10px] font-bold ${
              selectedExp.id === exp.id ? 'bg-indigo-600 text-white' : 'bg-gray-800'
            }`}>
              {exp.id}
            </span>
            <span className="text-xs font-semibold truncate flex-1">{exp.title}</span>
            <ChevronRight 
              size={12} 
              className={`transition-transform duration-300 ${selectedExp.id === exp.id ? 'rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} 
            />
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-10 px-2 text-center pb-6">
          <p className="text-[9px] text-gray-700 uppercase tracking-[0.2em] font-black">Academic Model v2.0</p>
      </div>
    </div>
  );

  return (
    <div id="app-root" className="flex h-screen bg-[#0a0a0f] text-gray-200 font-sans overflow-hidden items-stretch">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-full shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#12121e]/80 backdrop-blur-md border-b border-gray-800 z-[40] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Settings className="text-indigo-500" size={20} />
          <span className="text-sm font-bold tracking-tight">Assignment Support</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-[300px] h-full"
            >
              <div className="relative h-full shadow-2xl">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white z-[70]"
                >
                  <X size={20} />
                </button>
                <Sidebar />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0a0a0f] to-[#12121e]">
        <div className="w-full pt-20 lg:pt-0 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedExp.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 lg:py-16"
            >
              {/* Header */}
              <header className="mb-12">
                <div className="flex flex-wrap items-center gap-2 text-indigo-400 mb-4 shrink-0">
                  <BookOpen size={16} className="shrink-0" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Academic Report Pipeline / Exp {selectedExp.id}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">{selectedExp.title}</h2>
                <div className="h-1 w-20 bg-indigo-600 rounded-full" />
              </header>

              <div className="space-y-12">
                {/* Requirements & Validation */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  <section className="xl:col-span-8 bg-white/5 rounded-[2rem] p-6 md:p-10 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-indigo-600 rounded-xl">
                        <Monitor className="text-white" size={18} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Requirement Specification</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-base md:text-xl font-medium">
                      {selectedExp.requirement}
                    </p>
                  </section>

                  {/* Unique Validation Module */}
                  <section className="xl:col-span-4 bg-emerald-500/5 rounded-[2rem] p-6 md:p-8 border border-emerald-500/10">
                    <div className="flex items-center gap-3 mb-6 font-bold text-white">
                      <ShieldCheck className="text-emerald-400" size={18} />
                      <h3 className="text-base tracking-tight">User Validation Base</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block">Unique Input Matrix</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {Object.entries(currentTestCase.inputs).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                              <span className="text-[10px] text-gray-500 font-mono italic truncate mr-2">{key}</span>
                              <span className="text-xs text-emerald-400 font-black shrink-0">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-emerald-500/10">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-2">Expected Verification</span>
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                          <p className="text-xs text-emerald-500/80 leading-relaxed font-mono break-words">
                            {currentTestCase.expected}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] text-emerald-600 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 italic">
                        <RefreshCcw size={10} className="animate-spin-slow shrink-0" />
                        Active Hash: {verificationId || "SYSTEM_DEFAULT"}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Analysis & Algorithm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-white/5 rounded-[2rem] p-6 md:p-10 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8 text-xl font-bold text-white">
                      <Cpu className="text-emerald-400" size={20} />
                      <h3 className="tracking-tight text-lg md:text-xl">System Analysis</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                      {selectedExp.analysis}
                    </p>
                  </section>

                  <section className="bg-white/5 rounded-[2rem] p-6 hidden md:block md:p-10 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8 text-xl font-bold text-white">
                      <Layers className="text-amber-400" size={20} />
                      <h3 className="tracking-tight text-lg md:text-xl">Logic Algorithm</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedExp.design.algorithm.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-amber-500/30 text-xs font-mono font-black italic pt-1">{(i + 1).toString().padStart(2, '0')}</span>
                          <span className="text-gray-400 text-sm leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Technical Design Documentation */}
                <section className="bg-[#12121e] rounded-[2.5rem] p-1 border border-white/5 overflow-hidden">
                  <div className="bg-[#1a1a2e]/60 p-6 md:p-10">
                    <div className="flex items-center gap-3 mb-10 text-white">
                      <Box className="text-indigo-400" size={20} />
                      <h3 className="text-xl font-black tracking-tight">Structured Class & Flow Modeling</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                      <div className="space-y-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-1">Class Specification</span>
                        <div className="bg-black/70 p-6 rounded-[1.8rem] border border-indigo-500/10 overflow-x-auto min-h-[320px] flex flex-col items-stretch">
                          <pre className="text-[10px] md:text-xs font-mono leading-[1.8] text-indigo-200/90 whitespace-pre">
                            {selectedExp.design.classDiagram}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 ml-1">Execution Flow</span>
                        <div className="bg-black/70 p-6 rounded-[1.8rem] border border-emerald-500/10 overflow-x-auto min-h-[320px] flex flex-col items-stretch">
                          <pre className="text-[10px] md:text-xs font-mono leading-[1.8] text-emerald-200/90 whitespace-pre">
                            {selectedExp.design.flowchart}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Implementation Section */}
                <section className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <Code2 className="text-indigo-400" size={22} />
                      <h3 className="text-xl md:text-2xl font-black text-white">Source Implementation</h3>
                    </div>
                    
                    <div className="flex bg-black/60 p-1 rounded-2xl border border-gray-800 self-start md:self-auto">
                      {getAvailableLanguages(selectedExp).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveLang(lang)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                            activeLang === lang 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                            : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 md:p-8 bg-black/20 overflow-x-auto">
                      <SyntaxHighlighter 
                        language={activeLang.toLowerCase()} 
                        style={vscDarkPlus}
                        customStyle={{ 
                          margin: 0, 
                          padding: '24px', 
                          fontSize: '13px', 
                          backgroundColor: '#0d0d17',
                          fontFamily: '"JetBrains Mono", monospace'
                        }}
                      >
                        {selectedExp.implementations[activeLang] || "// Implementation pending..."}
                      </SyntaxHighlighter>
                  </div>
                </section>

                {/* Testing & Issues */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-white/5 rounded-[2rem] p-6 md:p-10 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8 text-white font-bold">
                      <Terminal className="text-rose-400" size={20} />
                      <h3 className="text-lg">Functional Testing</h3>
                    </div>
                    <div className="p-5 bg-black/30 rounded-2xl border border-white/5 font-mono text-xs md:text-sm text-gray-400 leading-loose">
                      <span className="text-rose-500 opacity-40 mr-2 italic">LAB_VERIFY:</span>
                      {selectedExp.testing}
                    </div>
                  </section>

                  <section className="bg-white/5 rounded-[2rem] p-6 md:p-10 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8 text-white font-bold">
                      <Braces className="text-blue-400" size={20} />
                      <h3 className="text-lg">Design Issues Checklist</h3>
                    </div>
                    <ul className="space-y-3">
                      {(selectedExp.designIssues[activeLang] || []).map((issue, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5"
                        >
                          <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-gray-400 text-xs md:text-sm font-semibold tracking-tight leading-relaxed">
                            {issue}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`.animate-spin-slow { animation: spin 8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default App;


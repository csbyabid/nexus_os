
import React, { useState } from 'react';
import { Zap, ShieldCheck, Fingerprint, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accessKey = email.trim().toLowerCase();
    
    if (!accessKey) {
      setError("Identification required.");
      return;
    }

    // Standard email validation for "privacy" and integrity
    if (!validateEmail(accessKey)) {
      setError("Invalid credential format. Use a valid email.");
      return;
    }
    
    setLoading(true);
    setError(null);
    // Simulate Neural Link authentication
    setTimeout(() => {
      onLogin(email);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[160px]"></div>

      <div className="w-full max-w-md relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-600/40 mb-4 transform hover:rotate-6 transition-transform cursor-pointer">
            <Zap className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">NexusOS</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Neural Life Engineering System</p>
        </div>

        <form onSubmit={handleSubmit} className="glass border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl bg-white/[0.02] backdrop-blur-3xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Access Key (Email)</label>
              <div className="relative group">
                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="admin@nexus.os"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`w-full bg-black/40 border ${error ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-zinc-800 text-white`}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-[9px] font-black text-rose-500 uppercase tracking-widest px-2 mt-2">
                  <AlertCircle size={10} /> {error}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !email}
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>INITIALIZE LINK <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">
          Version 11.2.0 // Deep Focus Core // Local-First Sync
        </p>
      </div>
    </div>
  );
};

export default LoginView;

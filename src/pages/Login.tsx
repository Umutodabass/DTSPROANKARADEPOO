import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Lock, Mail, ChevronRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('umut@gmail.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate slight network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    } else {
      setError('E-posta veya şifre hatalı.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background with Large Faint Rotating Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none overflow-hidden">
        <img 
          src="/dtslogo.png" 
          alt="Background Logo" 
          className="w-[300vw] h-[300vw] sm:w-[150vw] sm:h-[150vw] max-w-none object-contain animate-[spin_90s_linear_infinite] filter grayscale" 
        />
      </div>
      
      {/* Glowing Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm mb-6 border border-white/5 shadow-xl">
            <img src="/dtslogo.png" alt="DTS Teknoloji" className="h-48 w-auto object-contain drop-shadow-md scale-110" />
          </div>
          <p className="mt-2 text-center text-sm text-slate-400 font-medium tracking-wide">
            Depo & Envanter Yönetim Sistemi
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#111827]/80 backdrop-blur-xl py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/10 relative overflow-hidden">
          {/* Subtle gradient border effect at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"></div>

          <form className="space-y-7" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center text-sm text-red-400 animate-pulse">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 ml-1">
                E-posta Adresi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0f1c]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all shadow-inner outline-none"
                  placeholder="isim@dtsteknoloji.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 ml-1">
                Şifre
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0f1c]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all shadow-inner outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#111827] transition-all overflow-hidden shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center">
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  {!isLoading && <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-white">DTS Pro</span>, bir <a href="https://dtsteknoloji.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">DTS Teknoloji</a> yazılımıdır.
            </p>
            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed px-4">
              Bu yazılımın tüm yasal hakları DTS Teknoloji'ye aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya dağıtılamaz. &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

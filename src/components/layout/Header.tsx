import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { UserCircle, LogOut, Key, ChevronDown, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, logout, updateUser } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && newPassword.trim()) {
      await updateUser(currentUser.id, { password: newPassword });
      setNewPassword('');
      setIsPasswordModalOpen(false);
      alert('Şifreniz başarıyla değiştirildi!');
    }
  };

  return (
    <header className="h-16 relative z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <div className="flex-1">
        {/* Can add breadcrumbs or global search here */}
      </div>
      
      <div className="flex items-center space-x-4">
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
            >
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {currentUser.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <UserCircle className="w-6 h-6" />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-1 z-50">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center transition-colors"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Şifre Değiştir
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Şifre Değiştir</h2>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yeni Şifre</label>
                <input 
                  type="text"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Yeni şifrenizi girin"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Güncelle
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

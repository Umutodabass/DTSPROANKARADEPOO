import React from 'react';
import { useStore } from '../../store/useStore';
import { UserCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <div className="flex-1">
        {/* Can add breadcrumbs or global search here */}
      </div>
      
      <div className="flex items-center space-x-4">
        {currentUser && (
          <div className="flex items-center space-x-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {currentUser.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <UserCircle className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

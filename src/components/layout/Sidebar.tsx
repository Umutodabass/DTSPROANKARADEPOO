import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  ShoppingCart, 
  Settings,
  Users,
  Wrench
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory', icon: Package, label: 'Envanter' },
  { to: '/deployments', icon: MapPin, label: 'Lokasyon ve Saha' },
  { to: '/shopping-list', icon: ShoppingCart, label: 'Alınacaklar' },
  { to: '/maintenance', icon: Wrench, label: 'Bakımdakiler' },
  { to: '/personnel', icon: Users, label: 'Personel' },
  { to: '/definitions', icon: Settings, label: 'Tanımlar' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="h-28 flex items-center justify-center border-b border-slate-800 bg-white/5 overflow-hidden">
        <img src="/dtslogo.png" alt="DTS Teknoloji" className="w-4/5 h-full object-contain scale-125 hover:scale-150 transition-transform duration-300" />
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-[10px] text-slate-500 text-center">
          <p>
            <span className="font-semibold text-slate-400">DTS Pro</span> bir <a href="https://dtsteknoloji.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">DTS Teknoloji</a> yazılımıdır.
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Tüm hakları saklıdır.</p>
        </div>
      </div>
    </aside>
  );
};

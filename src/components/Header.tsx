import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Layout, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';



const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-100 z-50 sticky top-0">
      {/* Logo section */}
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Layout className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Splitter</h1>
        </div>
      </div>
{/* User Dropdown section */}
      <div className="flex items-center">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button 
              className={`flex items-center gap-3 p-1.5 pr-4 rounded-md border border-slate-100 transition-all hover:bg-slate-100 ${showDropdown ? 'border-primary/30 ring-4 ring-primary/5' : ''}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-sm border border-slate-100">
                <User size={16} className="text-primary" />
              </div>
              <span className="text-sm font-semibold text-slate-700 max-w-[150px] truncate">{user.email}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-slate-100 p-1 transform transition-all z-[100]">
                <div className="px-4 py-2.5 border-b border-slate-50 mb-1">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                </div>

                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 rounded-md transition-all hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

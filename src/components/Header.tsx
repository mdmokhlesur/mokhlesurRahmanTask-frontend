import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Layout, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './layout.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
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
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-box">
            <Layout className="text-white" size={18} />
          </div>
          <h1 className="header-title">Splitter</h1>
        </div>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button 
              className={`user-trigger ${showDropdown ? 'active' : ''}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                <User size={14} className="text-indigo-600" />
              </div>
              <span className="user-email">{user.email}</span>
              <ChevronDown size={14} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-label">Signed in as</p>
                  <p className="dropdown-email">{user.email}</p>
                </div>
                <div className="dropdown-divider" />
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="dropdown-item logout"
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


import React from 'react';
import { Moon, Sun, User, Menu, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isAuthenticated: boolean;
  onAuthClick: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  setIsDarkMode, 
  isAuthenticated, 
  onAuthClick,
  onMenuClick 
}) => {
  return (
    <header className={`relative z-20 p-4 flex items-center justify-between
      ${isDarkMode ? 'bg-black/30' : 'bg-white/30'} backdrop-blur-sm
    `}>
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className={`${isDarkMode ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`rounded-full ${isDarkMode ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isAuthenticated ? "ghost" : "default"}
          size="sm"
          onClick={onAuthClick}
          className={isAuthenticated 
            ? `rounded-full ${isDarkMode ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`
            : 'bg-blue-600 hover:bg-blue-700 text-white rounded-full'
          }
        >
          <User className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'Profile' : 'Sign In'}
        </Button>
      </div>
    </header>
  );
};

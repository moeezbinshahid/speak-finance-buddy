
import React from 'react';
import { Moon, Sun, User, Menu } from 'lucide-react';
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
      ${isDarkMode ? 'bg-black/50' : 'bg-white/30'} backdrop-blur-sm border-b
      ${isDarkMode ? 'border-gray-800' : 'border-white/20'}
    `}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className={`${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className={`text-xl font-bold
          ${isDarkMode ? 'text-white' : 'text-gray-800'}
        `}>
          FinanceAI
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isAuthenticated ? "ghost" : "default"}
          size="sm"
          onClick={onAuthClick}
          className={isAuthenticated 
            ? `${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        >
          <User className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'Profile' : 'Sign In'}
        </Button>
      </div>
    </header>
  );
};

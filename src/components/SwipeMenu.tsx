
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Instagram, X, Microphone, HelpCircle, Info, LogOut } from 'lucide-react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface SwipeMenuProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const socialMediaLinks = [
  { name: 'Rate the App', icon: Heart, url: '#', color: 'text-red-500' },
  { name: 'Follow on Instagram', icon: Instagram, url: '#', color: 'text-pink-500' },
  { name: 'Follow on X', icon: X, url: '#', color: 'text-gray-400' },
];

const supportItems = [
  { name: 'Help', icon: HelpCircle, url: '#' },
  { name: 'About', icon: Info, url: '#' },
];

const permissionItems = [
  { name: 'Microphone', icon: Microphone, url: '#' },
];

export const SwipeMenu: React.FC<SwipeMenuProps> = ({ 
  isDarkMode, 
  isOpen, 
  onOpenChange, 
  isAuthenticated,
  onLogout 
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} h-[90vh]`}>
        <DrawerHeader>
          <DrawerTitle className={`text-left text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Stay in touch section */}
          <div>
            <h3 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Stay in touch
            </h3>
            <div className="space-y-2">
              {socialMediaLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  className={`w-full justify-start h-12 px-4 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => window.open(social.url, '_blank')}
                >
                  <social.icon className={`h-5 w-5 mr-3 ${social.color}`} />
                  <span className="text-base">{social.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Support section */}
          <div>
            <h3 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Support
            </h3>
            <div className="space-y-2">
              {supportItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`w-full justify-between h-12 px-4 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-base">{item.name}</span>
                  </div>
                  <span className="text-gray-400">&gt;</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Permissions section */}
          <div>
            <h3 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Permissions
            </h3>
            <div className="space-y-2">
              {permissionItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`w-full justify-between h-12 px-4 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-base">{item.name}</span>
                  </div>
                  <span className="text-gray-400">&gt;</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Logout section - only show if authenticated */}
          {isAuthenticated && (
            <div className="pt-4 border-t border-gray-700">
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 px-4 ${
                  isDarkMode 
                    ? 'hover:bg-gray-800 text-red-400' 
                    : 'hover:bg-gray-50 text-red-600'
                }`}
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="text-base">Log out</span>
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

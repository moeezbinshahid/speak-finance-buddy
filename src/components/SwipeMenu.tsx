
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';

interface SwipeMenuProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const socialMediaLinks = [
  { name: 'Facebook', icon: '📘', url: '#', color: 'bg-blue-600' },
  { name: 'Twitter', icon: '🐦', url: '#', color: 'bg-sky-500' },
  { name: 'Instagram', icon: '📷', url: '#', color: 'bg-pink-500' },
  { name: 'LinkedIn', icon: '💼', url: '#', color: 'bg-blue-700' },
  { name: 'YouTube', icon: '📺', url: '#', color: 'bg-red-600' },
  { name: 'WhatsApp', icon: '💬', url: '#', color: 'bg-green-500' },
];

export const SwipeMenu: React.FC<SwipeMenuProps> = ({ isDarkMode, isOpen, onOpenChange }) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <DrawerHeader>
          <DrawerTitle className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect with us
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 pb-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {socialMediaLinks.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                className={`h-20 flex flex-col items-center justify-center gap-2 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-800 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => window.open(social.url, '_blank')}
              >
                <span className="text-2xl">{social.icon}</span>
                <span className="text-xs">{social.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Follow us for updates and financial tips
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};


import React from 'react';
import { X, DollarSign, History, TrendingUp, Settings, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  isAuthenticated: boolean;
}

const mockTransactions = [
  { id: 1, type: 'expense', amount: -45.50, description: 'Amazon Purchase', icon: '🛒', date: '2h ago' },
  { id: 2, type: 'income', amount: 2500.00, description: 'Salary Deposit', icon: '💰', date: '1d ago' },
  { id: 3, type: 'expense', amount: -23.80, description: 'Restaurant', icon: '🍽️', date: '2d ago' },
  { id: 4, type: 'expense', amount: -67.20, description: 'Gas Station', icon: '⛽', date: '3d ago' },
  { id: 5, type: 'income', amount: 150.00, description: 'Freelance Work', icon: '💼', date: '4d ago' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isDarkMode, isAuthenticated }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-80 z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm
        border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
        lg:block
      `}>
        <div className="p-4 h-full flex flex-col">
          {/* Close button for mobile */}
          <div className="flex justify-end lg:hidden mb-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {isAuthenticated ? (
            <>
              {/* Balance Card */}
              <Card className={`p-4 mb-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
                <div className="text-center">
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Current Balance
                  </h3>
                  <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    $2,513.42
                  </p>
                  <div className="flex justify-center gap-2 mt-3">
                    <span className="text-green-500 text-sm">↗ +12.5%</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>this month</span>
                  </div>
                </div>
              </Card>
              
              {/* Navigation */}
              <nav className="space-y-2 mb-6">
                {[
                  { icon: DollarSign, label: 'Dashboard', active: true },
                  { icon: History, label: 'Transactions', active: false },
                  { icon: TrendingUp, label: 'Analytics', active: false },
                  { icon: CreditCard, label: 'Cards', active: false },
                  { icon: Settings, label: 'Settings', active: false },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isDarkMode 
                        ? item.active 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-gray-300 hover:bg-gray-800'
                        : item.active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </nav>
              
              {/* Recent Transactions */}
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Transactions
                </h3>
                <div className="space-y-2">
                  {mockTransactions.slice(0, 5).map((transaction) => (
                    <Card 
                      key={transaction.id}
                      className={`p-3 cursor-pointer hover:scale-[1.02] transition-transform
                        ${isDarkMode ? 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50' : 'bg-white/30 border-gray-200 hover:bg-white/50'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{transaction.icon}</span>
                          <div>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {transaction.description}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in to view your financial dashboard
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

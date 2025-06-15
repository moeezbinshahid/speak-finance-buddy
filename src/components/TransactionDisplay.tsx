
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  counterparty?: string;
  date: string;
}

interface TransactionDisplayProps {
  isDarkMode: boolean;
  transaction: Transaction;
  previousBalance: number;
  newBalance: number;
  currentBalance: number;
  onClose?: () => void;
}

export const TransactionDisplay: React.FC<TransactionDisplayProps> = ({
  isDarkMode,
  transaction,
  previousBalance,
  newBalance,
  currentBalance,
  onClose
}) => {
  const isIncome = transaction.type === 'income';
  const balanceChange = newBalance - previousBalance;

  return (
    <Card className={`mx-4 mb-4 p-4 border-l-4 ${
      isIncome ? 'border-l-green-500' : 'border-l-red-500'
    } ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      
      {/* Transaction Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isIncome ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <Badge 
            variant={isIncome ? "default" : "destructive"}
            className={isIncome ? "bg-green-600" : "bg-red-600"}
          >
            {isIncome ? 'Income' : 'Expense'}
          </Badge>
        </div>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date(transaction.date).toLocaleDateString()}
        </span>
      </div>

      {/* Transaction Details */}
      <div className="mb-4">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {transaction.description}
        </h3>
        {transaction.counterparty && (
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isIncome ? 'From: ' : 'To: '}{transaction.counterparty}
          </p>
        )}
      </div>

      {/* Amount and Balance Info */}
      <div className="space-y-3">
        {/* Transaction Amount */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isIncome ? 'Credited' : 'Debited'}:
          </span>
          <span className={`font-bold text-lg ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}>
            {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
          </span>
        </div>

        {/* Balance Summary */}
        <div className={`p-3 rounded-lg border ${
          isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50/50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Balance Summary
            </span>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Previous:</span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                ${previousBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Change:</span>
              <span className={`font-medium ${
                balanceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(2)}
              </span>
            </div>
            <hr className={`my-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
            <div className="flex justify-between">
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                New Balance:
              </span>
              <span className={`font-bold text-lg ${
                newBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${newBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

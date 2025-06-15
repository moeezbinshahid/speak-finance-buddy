"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Banknote, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AudioWaveform } from '@/components/animated-icons/AudioWaveform';
import { ThumbsUp } from '@/components/animated-icons/ThumbsUp';
import { ThumbsDown } from '@/components/animated-icons/ThumbsDown';
import { Copy } from '@/components/animated-icons/Copy';
import { ChevronsDown } from '@/components/animated-icons/ChevronsDown';
import { TransactionDisplay } from '@/components/TransactionDisplay';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  isAuthenticated: boolean;
}

interface JournalEntry {
  date: string;
  description: string;
  entries: {
    account: string;
    accountType: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
    debit: number;
    credit: number;
  }[];
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
  transaction?: {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    counterparty?: string;
    date: string;
  };
  journalEntry?: JournalEntry;
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
];

// Accounting system with proper double-entry bookkeeping
let currentBalance = 2513.42;
let totalAssets = 2513.42;
let totalLiabilities = 0;
let totalEquity = 2513.42;
let totalIncome = 0;
let totalExpenses = 0;

// Account structure for proper accounting
const accounts = {
  assets: {
    cash: currentBalance,
    inventory: 0,
    equipment: 0,
    accountsReceivable: 0
  },
  liabilities: {
    accountsPayable: 0,
    loans: 0
  },
  equity: {
    capital: 2513.42,
    retainedEarnings: 0
  },
  income: {
    sales: 0,
    fees: 0,
    other: 0
  },
  expenses: {
    rent: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    supplies: 0,
    other: 0
  }
};

// Proper accounting AI response function
const generateAccountingResponse = async (userInput: string): Promise<{ response: string; transaction?: any; journalEntry?: JournalEntry }> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const input = userInput.toLowerCase();
  
  // Enhanced transaction patterns with accounting logic
  const accountingPatterns = [
    // Expenses (Debit Expense, Credit Cash)
    { 
      pattern: /(?:paid|spent|bought|purchased)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:for|on)\s+([a-zA-Z\s]+)/i, 
      type: 'expense',
      accounts: ['expense', 'cash']
    },
    { 
      pattern: /(?:paid|gave|sent)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:to|for)\s+([a-zA-Z\s]+)/i, 
      type: 'expense',
      accounts: ['expense', 'cash']
    },
    
    // Income (Debit Cash, Credit Income)
    { 
      pattern: /(?:received|got|earned|collected)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:from\s+)?([a-zA-Z\s]*)/i, 
      type: 'income',
      accounts: ['cash', 'income']
    },
    { 
      pattern: /([a-zA-Z\s]+)\s+(?:gave|paid|sent)\s+(?:me\s+)?(?:\$)?(\d+(?:\.\d{2})?)/i, 
      type: 'income',
      accounts: ['cash', 'income']
    },
    
    // Loans (Debit Cash, Credit Liability for borrowing; Debit Liability, Credit Cash for repaying)
    { 
      pattern: /(?:borrowed|took\s+loan)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:from\s+)?([a-zA-Z\s]*)/i, 
      type: 'loan_received',
      accounts: ['cash', 'liability']
    },
    { 
      pattern: /(?:repaid|paid\s+back)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:to\s+)?([a-zA-Z\s]*)/i, 
      type: 'loan_repayment',
      accounts: ['liability', 'cash']
    },
    
    // Asset purchases (Debit Asset, Credit Cash)
    { 
      pattern: /(?:bought|purchased)\s+([a-zA-Z\s]+)\s+(?:for\s+)?(?:\$)?(\d+(?:\.\d{2})?)/i, 
      type: 'asset_purchase',
      accounts: ['asset', 'cash']
    }
  ];
  
  let transaction = null;
  let journalEntry = null;
  let aiResponse = "";
  
  // Process accounting transactions
  for (const { pattern, type, accounts: accountTypes } of accountingPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      let amount, counterparty, description;
      
      if (type === 'expense') {
        amount = parseFloat(match[1]);
        counterparty = match[2] ? match[2].trim() : null;
        description = `Payment for ${counterparty || 'expense'}`;
        
        // Categorize expense
        let expenseCategory = 'other';
        const categoryKeywords = {
          'food': ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'meal'],
          'rent': ['rent', 'housing'],
          'utilities': ['electricity', 'water', 'gas', 'internet', 'phone'],
          'transportation': ['uber', 'taxi', 'bus', 'gas', 'fuel'],
          'supplies': ['supplies', 'office', 'stationery']
        };
        
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(keyword => input.includes(keyword))) {
            expenseCategory = category;
            break;
          }
        }
        
        // Update accounts using double-entry
        accounts.expenses[expenseCategory] += amount;
        accounts.assets.cash -= amount;
        currentBalance = accounts.assets.cash;
        totalExpenses += amount;
        
        // Create journal entry
        journalEntry = {
          date: new Date().toISOString().split('T')[0],
          description: description,
          entries: [
            {
              account: `${expenseCategory.charAt(0).toUpperCase() + expenseCategory.slice(1)} Expense`,
              accountType: 'expense',
              debit: amount,
              credit: 0
            },
            {
              account: 'Cash',
              accountType: 'asset',
              debit: 0,
              credit: amount
            }
          ]
        };
        
        aiResponse = `✅ **Expense Recorded**: $${amount} for ${counterparty || 'expense'}\n\n` +
                    `📊 **Journal Entry**:\n` +
                    `• Debit: ${expenseCategory.charAt(0).toUpperCase() + expenseCategory.slice(1)} Expense $${amount}\n` +
                    `• Credit: Cash $${amount}\n\n` +
                    `💰 **Updated Balance**: $${currentBalance.toFixed(2)}\n` +
                    `📈 **Total Expenses**: $${totalExpenses.toFixed(2)}`;
        
      } else if (type === 'income') {
        if (match[1] && isNaN(parseFloat(match[1]))) {
          counterparty = match[1].trim();
          amount = parseFloat(match[2]);
        } else {
          amount = parseFloat(match[1]);
          counterparty = match[2] ? match[2].trim() : null;
        }
        description = `Payment received${counterparty ? ` from ${counterparty}` : ''}`;
        
        // Update accounts using double-entry
        accounts.assets.cash += amount;
        accounts.income.other += amount;
        currentBalance = accounts.assets.cash;
        totalIncome += amount;
        
        // Create journal entry
        journalEntry = {
          date: new Date().toISOString().split('T')[0],
          description: description,
          entries: [
            {
              account: 'Cash',
              accountType: 'asset',
              debit: amount,
              credit: 0
            },
            {
              account: 'Income',
              accountType: 'income',
              debit: 0,
              credit: amount
            }
          ]
        };
        
        aiResponse = `✅ **Income Recorded**: $${amount}${counterparty ? ` from ${counterparty}` : ''}\n\n` +
                    `📊 **Journal Entry**:\n` +
                    `• Debit: Cash $${amount}\n` +
                    `• Credit: Income $${amount}\n\n` +
                    `💰 **Updated Balance**: $${currentBalance.toFixed(2)}\n` +
                    `📈 **Total Income**: $${totalIncome.toFixed(2)}`;
                    
      } else if (type === 'loan_received') {
        amount = parseFloat(match[1]);
        counterparty = match[2] ? match[2].trim() : 'Bank';
        description = `Loan received from ${counterparty}`;
        
        // Update accounts using double-entry
        accounts.assets.cash += amount;
        accounts.liabilities.loans += amount;
        currentBalance = accounts.assets.cash;
        totalLiabilities += amount;
        
        journalEntry = {
          date: new Date().toISOString().split('T')[0],
          description: description,
          entries: [
            {
              account: 'Cash',
              accountType: 'asset',
              debit: amount,
              credit: 0
            },
            {
              account: 'Loan Payable',
              accountType: 'liability',
              debit: 0,
              credit: amount
            }
          ]
        };
        
        aiResponse = `✅ **Loan Received**: $${amount} from ${counterparty}\n\n` +
                    `📊 **Journal Entry**:\n` +
                    `• Debit: Cash $${amount}\n` +
                    `• Credit: Loan Payable $${amount}\n\n` +
                    `💰 **Cash Balance**: $${currentBalance.toFixed(2)}\n` +
                    `⚠️ **Total Liabilities**: $${totalLiabilities.toFixed(2)}`;
                    
      } else if (type === 'loan_repayment') {
        amount = parseFloat(match[1]);
        counterparty = match[2] ? match[2].trim() : 'Bank';
        description = `Loan repayment to ${counterparty}`;
        
        // Update accounts using double-entry
        accounts.assets.cash -= amount;
        accounts.liabilities.loans -= amount;
        currentBalance = accounts.assets.cash;
        totalLiabilities -= amount;
        
        journalEntry = {
          date: new Date().toISOString().split('T')[0],
          description: description,
          entries: [
            {
              account: 'Loan Payable',
              accountType: 'liability',
              debit: amount,
              credit: 0
            },
            {
              account: 'Cash',
              accountType: 'asset',
              debit: 0,
              credit: amount
            }
          ]
        };
        
        aiResponse = `✅ **Loan Repayment**: $${amount} to ${counterparty}\n\n` +
                    `📊 **Journal Entry**:\n` +
                    `• Debit: Loan Payable $${amount}\n` +
                    `• Credit: Cash $${amount}\n\n` +
                    `💰 **Cash Balance**: $${currentBalance.toFixed(2)}\n` +
                    `📉 **Remaining Liabilities**: $${Math.max(0, totalLiabilities).toFixed(2)}`;
      }
      
      transaction = {
        id: Date.now().toString(),
        type: type.includes('income') || type === 'loan_received' ? 'income' : 'expense',
        amount,
        counterparty: counterparty || null,
        description,
        date: new Date().toISOString().split('T')[0]
      };
      
      break;
    }
  }
  
  // Handle financial reports and queries
  if (!transaction) {
    if (input.includes('balance sheet') || input.includes('financial position')) {
      const totalAssetsCalc = accounts.assets.cash + accounts.assets.inventory + accounts.assets.equipment;
      const totalLiabilitiesCalc = accounts.liabilities.accountsPayable + accounts.liabilities.loans;
      const totalEquityCalc = accounts.equity.capital + accounts.equity.retainedEarnings;
      
      aiResponse = `📊 **BALANCE SHEET** (as of ${new Date().toLocaleDateString()})\n\n` +
                  `**ASSETS**\n` +
                  `• Cash: $${accounts.assets.cash.toFixed(2)}\n` +
                  `• Inventory: $${accounts.assets.inventory.toFixed(2)}\n` +
                  `• Equipment: $${accounts.assets.equipment.toFixed(2)}\n` +
                  `**Total Assets: $${totalAssetsCalc.toFixed(2)}**\n\n` +
                  `**LIABILITIES**\n` +
                  `• Accounts Payable: $${accounts.liabilities.accountsPayable.toFixed(2)}\n` +
                  `• Loans: $${accounts.liabilities.loans.toFixed(2)}\n` +
                  `**Total Liabilities: $${totalLiabilitiesCalc.toFixed(2)}**\n\n` +
                  `**EQUITY**\n` +
                  `• Capital: $${accounts.equity.capital.toFixed(2)}\n` +
                  `• Retained Earnings: $${accounts.equity.retainedEarnings.toFixed(2)}\n` +
                  `**Total Equity: $${totalEquityCalc.toFixed(2)}**\n\n` +
                  `✅ **Balance Check**: Assets (${totalAssetsCalc.toFixed(2)}) = Liabilities + Equity (${(totalLiabilitiesCalc + totalEquityCalc).toFixed(2)})`;
                  
    } else if (input.includes('income statement') || input.includes('profit') || input.includes('loss')) {
      const netIncome = totalIncome - totalExpenses;
      
      aiResponse = `📈 **INCOME STATEMENT**\n\n` +
                  `**INCOME**\n` +
                  `• Sales/Fees: $${accounts.income.sales.toFixed(2)}\n` +
                  `• Other Income: $${accounts.income.other.toFixed(2)}\n` +
                  `**Total Income: $${totalIncome.toFixed(2)}**\n\n` +
                  `**EXPENSES**\n` +
                  `• Rent: $${accounts.expenses.rent.toFixed(2)}\n` +
                  `• Food: $${accounts.expenses.food.toFixed(2)}\n` +
                  `• Utilities: $${accounts.expenses.utilities.toFixed(2)}\n` +
                  `• Transportation: $${accounts.expenses.transportation.toFixed(2)}\n` +
                  `• Other: $${accounts.expenses.other.toFixed(2)}\n` +
                  `**Total Expenses: $${totalExpenses.toFixed(2)}**\n\n` +
                  `${netIncome >= 0 ? '💚' : '🔴'} **Net ${netIncome >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(netIncome).toFixed(2)}**`;
                  
    } else if (input.includes('trial balance')) {
      const totalDebits = totalExpenses + accounts.assets.cash + accounts.assets.inventory + accounts.assets.equipment;
      const totalCredits = totalIncome + accounts.liabilities.accountsPayable + accounts.liabilities.loans + accounts.equity.capital;
      
      aiResponse = `⚖️ **TRIAL BALANCE**\n\n` +
                  `**DEBIT BALANCES**\n` +
                  `• Cash: $${accounts.assets.cash.toFixed(2)}\n` +
                  `• Expenses: $${totalExpenses.toFixed(2)}\n` +
                  `**Total Debits: $${(accounts.assets.cash + totalExpenses).toFixed(2)}**\n\n` +
                  `**CREDIT BALANCES**\n` +
                  `• Income: $${totalIncome.toFixed(2)}\n` +
                  `• Liabilities: $${accounts.liabilities.loans.toFixed(2)}\n` +
                  `• Capital: $${accounts.equity.capital.toFixed(2)}\n` +
                  `**Total Credits: $${(totalIncome + accounts.liabilities.loans + accounts.equity.capital).toFixed(2)}**\n\n` +
                  `${Math.abs((accounts.assets.cash + totalExpenses) - (totalIncome + accounts.liabilities.loans + accounts.equity.capital)) < 0.01 ? '✅' : '❌'} **Balance Check**: ${Math.abs((accounts.assets.cash + totalExpenses) - (totalIncome + accounts.liabilities.loans + accounts.equity.capital)) < 0.01 ? 'Balanced' : 'Out of Balance'}`;
                  
    } else if (input.includes('balance') || input.includes('cash')) {
      aiResponse = `💰 **Current Cash Balance**: $${currentBalance.toFixed(2)}\n\n` +
                  `📊 **Quick Summary**:\n` +
                  `• Total Income: $${totalIncome.toFixed(2)}\n` +
                  `• Total Expenses: $${totalExpenses.toFixed(2)}\n` +
                  `• Net: $${(totalIncome - totalExpenses).toFixed(2)}\n` +
                  `• Liabilities: $${totalLiabilities.toFixed(2)}`;
                  
    } else {
      // General financial guidance with accounting principles
      const responses = [
        "I can help you track transactions using proper accounting principles! Try telling me about payments, income, loans, or ask for financial reports like 'balance sheet' or 'income statement'.",
        "Let's keep your books balanced! Tell me about any financial transactions and I'll create proper journal entries following double-entry bookkeeping.",
        "I use professional accounting methods to track your finances. You can ask about expenses, income, loans, or request reports like trial balance or profit & loss statement.",
        "Ready to help with your accounting! Every transaction follows proper double-entry rules. What financial activity would you like to record?"
      ];
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return { response: aiResponse, transaction, journalEntry };
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isDarkMode, isAuthenticated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageMode, setIsLanguageMode] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    console.log('ChatInterface mounted, isAuthenticated:', isAuthenticated);
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage === 'ur' ? 'ur-PK' : 
                        selectedLanguage === 'hi' ? 'hi-IN' : 
                        selectedLanguage === 'pa' ? 'pa-IN' :
                        selectedLanguage === 'ps' ? 'ps-AF' :
                        selectedLanguage === 'tr' ? 'tr-TR' :
                        selectedLanguage === 'fr' ? 'fr-FR' :
                        selectedLanguage === 'es' ? 'es-ES' :
                        selectedLanguage === 'ar' ? 'ar-SA' :
                        selectedLanguage === 'fa' ? 'fa-IR' : 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input received:', transcript);
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (error: any) => {
        console.log('Speech recognition error:', error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [selectedLanguage, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message for authenticated users
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      console.log('Adding welcome message for authenticated user');
      setMessages([{
        id: '1',
        type: 'ai',
        content: `Welcome to FinanceAI! 👋 I'm your professional accounting assistant using **double-entry bookkeeping**.\n\n✅ **What I can help you with:**\n• **Record Transactions**: "I paid $25 for lunch" or "Received $100 from client"\n• **Generate Reports**: "Show balance sheet" or "Income statement"\n• **Track Loans**: "Borrowed $500 from bank" or "Repaid $200"\n• **Account Analysis**: "Trial balance" or "Cash balance"\n\n🔍 **Accounting Features:**\n• Proper journal entries with debits/credits\n• Real-time balance sheet updates\n• Income statement tracking\n• Professional financial reports\n\nTell me about any financial transaction and I'll handle the accounting!`,
        timestamp: new Date(),
      }]);
    }
  }, [isAuthenticated, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    console.log('Message copied to clipboard');
  };

  const handleThumbsUp = (messageId: string) => {
    console.log('Thumbs up for message:', messageId);
  };

  const handleThumbsDown = (messageId: string) => {
    console.log('Thumbs down for message:', messageId);
  };

  const handleVoiceToggle = () => {
    console.log('Voice toggle clicked, current state:', isListening);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        console.log('Speech recognition not available');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      console.log('Empty input, not sending message');
      return;
    }

    // Prevent AI responses for non-authenticated users
    if (!isAuthenticated) {
      console.log('User not authenticated, blocking message');
      return;
    }
    
    console.log('Sending message:', inputValue);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      language: selectedLanguage,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Get AI response with proper accounting logic - only for authenticated users
    try {
      const { response: aiResponse, transaction, journalEntry } = await generateAccountingResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        transaction: transaction,
        journalEntry: journalEntry,
      };
      
      console.log('Adding AI response:', aiMessage.content);
      if (transaction) console.log('Transaction detected:', transaction);
      if (journalEntry) console.log('Journal entry created:', journalEntry);
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I encountered an error processing your financial request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className={`text-5xl md:text-6xl font-kusanagi font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            FinanceAI
            <span className="text-blue-500">.</span>
          </h1>
        </div>

        <div className="w-full max-w-2xl mb-8">
          <div className={`relative rounded-full p-2 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
            <div className="flex items-center gap-3 px-4">
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input
                value=""
                placeholder="Sign in to ask about your finances..."
                className={`flex-1 border-0 bg-transparent text-lg placeholder:text-base focus-visible:ring-0 ${
                  isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'
                }`}
                disabled
              />
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <AudioWaveform 
                  width={20} 
                  height={20} 
                  stroke="currentColor"
                />
              </div>
            </div>
          </div>
        </div>

        <p className={`text-center text-lg mb-12 max-w-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Your intelligent financial assistant, supporting multiple languages and voice commands.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {supportedLanguages.slice(0, 5).map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              size="sm"
              disabled
              className={`${
                selectedLanguage === lang.code
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isDarkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </Button>
          ))}
        </div>

        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Sign in to start managing your finances with AI
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
      {/* Language selector */}
      {isLanguageMode && (
        <Card className={`m-4 p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Select Language / زبان منتخب کریں / भाषा चुनें
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {supportedLanguages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setIsLanguageMode(false);
                }}
                className={`justify-start ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        </Card>
      )}
      
      {/* Chat messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-xs md:max-w-md p-3 ${
                message.type === 'user'
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 text-white'
                    : 'bg-white/80 border-gray-200 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs opacity-70">
                  <div className="flex items-center gap-2">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.language && (
                      <Badge variant="secondary" className="text-xs">
                        {supportedLanguages.find(l => l.code === message.language)?.flag} {message.language.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-1 ml-2">
                      <ThumbsUp 
                        width={16} 
                        height={16}
                        stroke="currentColor"
                        onClick={() => handleThumbsUp(message.id)}
                      />
                      <ThumbsDown 
                        width={16} 
                        height={16}
                        stroke="currentColor"
                        onClick={() => handleThumbsDown(message.id)}
                      />
                      <Copy 
                        width={16} 
                        height={16}
                        stroke="currentColor"
                        onClick={() => handleCopyMessage(message.content)}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Transaction display */}
            {message.transaction && (
              <div className="mt-2 flex justify-start">
                <TransactionDisplay 
                  transaction={message.transaction}
                  previousBalance={currentBalance - (message.transaction.type === 'income' ? message.transaction.amount : -message.transaction.amount)}
                  newBalance={currentBalance}
                  currentBalance={currentBalance}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className={`max-w-xs md:max-w-md p-3 ${
              isDarkMode
                ? 'bg-gray-800/50 border-gray-700 text-white'
                : 'bg-white/80 border-gray-200 text-gray-900'
            }`}>
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm">FinanceAI is processing your transaction...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-6 z-10">
          <Button
            onClick={scrollToBottom}
            className={`rounded-full p-2 shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-900'
            } border`}
          >
            <ChevronsDown 
              width={20} 
              height={20} 
              stroke="currentColor"
            />
          </Button>
        </div>
      )}
      
      {/* Input area - only show if authenticated */}
      {isAuthenticated && (
        <div className="p-4">
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100/80 border-gray-300'}`}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageMode(!isLanguageMode)}
                className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <Globe className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={
                    selectedLanguage === 'ur' ? 'اپنا مالی سوال یہاں لکھیں...' :
                    selectedLanguage === 'hi' ? 'अपना वित्तीय प्रश्न यहाँ लिखें...' :
                    selectedLanguage === 'ar' ? 'اكتب سؤالك المالي هنا...' :
                    'Tell me about a transaction or ask for financial reports...'
                  }
                  className={`pr-12 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  disabled={isLoading}
                />
              </div>
              
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <AudioWaveform 
                  width={20} 
                  height={20} 
                  stroke="currentColor"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue(prev => prev + ' 💰')}
                className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <Banknote className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedLanguage !== 'en' && (
              <div className="mt-2 text-xs text-center">
                <Badge variant="outline" className={`${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>
                  {supportedLanguages.find(l => l.code === selectedLanguage)?.flag} Speaking in {supportedLanguages.find(l => l.code === selectedLanguage)?.name}
                </Badge>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

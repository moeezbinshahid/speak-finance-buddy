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

// Mock balance for demonstration
let currentBalance = 2513.42;

// Simple AI response function that mimics OpenAI behavior
const generateAIResponse = async (userInput: string): Promise<{ response: string; transaction?: any }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const input = userInput.toLowerCase();
  
  // Check for transaction patterns
  const transactionPatterns = [
    { pattern: /(?:paid|spent|gave|send|sent)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:to|for)\s+([a-zA-Z\s]+)/i, type: 'expense' },
    { pattern: /([a-zA-Z\s]+)\s+(?:gave|paid|sent)\s+(?:me\s+)?(?:\$)?(\d+(?:\.\d{2})?)/i, type: 'income' },
    { pattern: /(?:received|got|earned)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:from\s+)?([a-zA-Z\s]*)/i, type: 'income' },
  ];
  
  let transaction = null;
  let aiResponse = "";
  
  for (const { pattern, type } of transactionPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      let amount, counterparty;
      
      if (type === 'expense') {
        amount = parseFloat(match[1]);
        counterparty = match[2].trim();
        aiResponse = `I've recorded your expense of $${amount} to ${counterparty}. `;
      } else {
        if (match[1] && isNaN(parseFloat(match[1]))) {
          // Pattern: "John gave me $50"
          counterparty = match[1].trim();
          amount = parseFloat(match[2]);
        } else {
          // Pattern: "received $50 from John"
          amount = parseFloat(match[1]);
          counterparty = match[2] ? match[2].trim() : null;
        }
        aiResponse = `Great! I've recorded your income of $${amount}${counterparty ? ` from ${counterparty}` : ''}. `;
      }
      
      transaction = {
        id: Date.now().toString(),
        type: type as 'income' | 'expense',
        amount,
        counterparty: counterparty || null,
        description: type === 'income' 
          ? `Payment${counterparty ? ` from ${counterparty}` : ''}`
          : `Payment${counterparty ? ` to ${counterparty}` : ''}`,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Update balance
      if (type === 'income') {
        currentBalance += amount;
        aiResponse += `Your new balance is $${currentBalance.toFixed(2)}.`;
      } else {
        currentBalance -= amount;
        aiResponse += `Your new balance is $${currentBalance.toFixed(2)}.`;
      }
      
      break;
    }
  }
  
  // If no transaction detected, provide general financial advice
  if (!transaction) {
    if (input.includes('balance')) {
      aiResponse = `Your current balance is $${currentBalance.toFixed(2)}. Is there anything specific you'd like to know about your finances?`;
    } else if (input.includes('budget') || input.includes('budgeting')) {
      aiResponse = "Budgeting is crucial for financial health! I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Would you like me to help you create a personalized budget?";
    } else if (input.includes('save') || input.includes('saving')) {
      aiResponse = "Great question about saving! Start with an emergency fund of 3-6 months of expenses. Then consider high-yield savings accounts or investment options based on your goals. What's your savings goal?";
    } else if (input.includes('invest') || input.includes('investment')) {
      aiResponse = "Investment is key to building wealth! Consider diversified index funds, ETFs, or consult a financial advisor. Remember: invest only what you can afford to lose, and think long-term. What's your investment timeline?";
    } else if (input.includes('debt')) {
      aiResponse = "Managing debt is important! Consider the debt avalanche method (pay highest interest first) or debt snowball (pay smallest balance first). Would you like help creating a debt payoff strategy?";
    } else {
      const responses = [
        "I'm here to help with your finances! You can ask about budgeting, investments, savings, or tell me about your transactions.",
        "Financial planning is important! What specific area would you like to focus on - budgeting, saving, investing, or tracking expenses?",
        "I can help you manage your money better! Try asking about your balance, budget planning, or tell me about recent transactions.",
        "Managing finances can be simple with the right approach! What financial goal are you working towards?",
      ];
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return { response: aiResponse, transaction };
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
        content: `Welcome to FinanceAI! 👋 I'm your personal financial assistant. You can:\n\n• Tell me about transactions: "I spent $25 on lunch"\n• Ask about your balance: "What's my current balance?"\n• Request financial advice: "How should I budget my income?"\n• Get investment tips: "What are some good investment options?"\n\nI speak multiple languages! Try switching languages or just speak naturally. How can I help you today?`,
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
    // Here you would typically send feedback to your backend
  };

  const handleThumbsDown = (messageId: string) => {
    console.log('Thumbs down for message:', messageId);
    // Here you would typically send feedback to your backend
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
    
    // Get AI response - only for authenticated users
    try {
      const { response: aiResponse, transaction } = await generateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        transaction: transaction,
      };
      
      console.log('Adding AI response:', aiMessage.content);
      if (transaction) console.log('Transaction detected:', transaction);
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
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
                <span className="text-sm">FinanceAI is thinking...</span>
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
                    'Type your financial question here...'
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

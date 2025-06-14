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

// GPT-4 API integration with transaction parsing
const sendMessageToGPT = async (userInput: string): Promise<{ response: string; transaction?: any }> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are FinanceAI, a helpful financial assistant. 

When users mention transactions like "Zahid gave 500$ yesterday" or "I spent 25$ on lunch", respond with:
1. A natural acknowledgment
2. Then ALWAYS include a JSON block in this EXACT format:
---TRANSACTION---
{
  "type": "income" or "expense",
  "amount": number,
  "counterparty": "name" or null,
  "description": "brief description",
  "date": "YYYY-MM-DD"
}
---END---

Examples:
- "Zahid gave 500$ yesterday" → type: "income", amount: 500, counterparty: "Zahid", description: "Payment from Zahid"
- "I spent 25$ on lunch" → type: "expense", amount: 25, counterparty: null, description: "Lunch expense"

For non-transaction messages, provide normal financial advice without the JSON block.`
          },
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse transaction if present
    const transactionMatch = aiResponse.match(/---TRANSACTION---(.*?)---END---/s);
    let transaction = null;
    
    if (transactionMatch) {
      try {
        transaction = JSON.parse(transactionMatch[1].trim());
        transaction.id = Date.now().toString();
        transaction.date = transaction.date || new Date().toISOString().split('T')[0];
      } catch (e) {
        console.error('Error parsing transaction:', e);
      }
    }
    
    // Remove transaction block from response
    const cleanResponse = aiResponse.replace(/---TRANSACTION---.*?---END---/s, '').trim();
    
    return { response: cleanResponse, transaction };
  } catch (error) {
    console.error('Error calling GPT-4 API:', error);
    return { 
      response: "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment." 
    };
  }
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
        content: `Welcome to FinanceAI! 👋 I'm your personal financial assistant powered by GPT-4. You can:\n\n• Tell me about transactions: "I spent $25 on lunch"\n• Ask about your balance: "What's my current balance?"\n• Request financial advice: "How should I budget my income?"\n• Get investment tips: "What are some good investment options?"\n\nI speak multiple languages! Try switching languages or just speak naturally. How can I help you today?`,
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
    
    // Get AI response from GPT-4 with transaction parsing
    try {
      const { response: aiResponse, transaction } = await sendMessageToGPT(inputValue);
      
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
      
      // Update balance if transaction detected
      if (transaction) {
        if (transaction.type === 'income') {
          currentBalance += transaction.amount;
        } else {
          currentBalance -= transaction.amount;
        }
      }
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your finances, log expenses, or transfer money..."
                className={`flex-1 border-0 bg-transparent text-lg placeholder:text-base focus-visible:ring-0 ${
                  isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
          Your intelligent financial assistant powered by GPT-4, supporting multiple languages and voice commands.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {supportedLanguages.slice(0, 5).map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              size="sm"
              onClick={() => setSelectedLanguage(lang.code)}
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
          <div
            key={message.id}
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
      
      {/* Input area */}
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

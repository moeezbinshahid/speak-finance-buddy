
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Banknote, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isDarkMode, isAuthenticated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageMode, setIsLanguageMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
        content: `Welcome to FinanceAI! 👋 I'm your personal financial assistant. You can:\n\n• Tell me about transactions: "I spent $25 on lunch"\n• Ask about your balance: "What's my current balance?"\n• Request reports: "Show me this month's expenses"\n• Transfer money: "Send $100 to John"\n\nI speak multiple languages! Try switching languages or just speak naturally. How can I help you today?`,
        timestamp: new Date(),
      }]);
    }
  }, [isAuthenticated, messages.length]);

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

  const handleSendMessage = () => {
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
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputValue, selectedLanguage),
        timestamp: new Date(),
      };
      console.log('Adding AI response:', aiMessage.content);
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setInputValue('');
  };

  const getAIResponse = (input: string, lang: string): string => {
    const lowerInput = input.toLowerCase();
    console.log('Generating AI response for input:', input, 'in language:', lang);
    
    // Transaction pattern recognition
    if (lowerInput.includes('spent') || lowerInput.includes('bought') || lowerInput.includes('paid')) {
      return `✅ Transaction recorded! I've logged your expense. Here's what I understood:\n\n💰 **Amount**: Detected from your message\n📝 **Description**: ${input}\n📅 **Date**: ${new Date().toLocaleDateString()}\n\nWould you like me to categorize this transaction or add any additional details?`;
    }
    
    if (lowerInput.includes('balance') || lowerInput.includes('money')) {
      return `💳 **Current Balance**: $2,513.42\n\n📊 **Quick Overview**:\n• Income this month: +$3,250.00\n• Expenses this month: -$736.58\n• Net change: +$2,513.42 (↗ +12.5%)\n\nYour finances are looking healthy! 🎉`;
    }
    
    if (lowerInput.includes('send') || lowerInput.includes('transfer')) {
      return `🏦 **Transfer Request Detected**\n\nI can help you transfer money! For your security, I'll need to confirm:\n\n1. **Amount**: Please confirm the exact amount\n2. **Recipient**: Who should receive the money?\n3. **Account**: Which account to use?\n\n⚠️ *Note: This is a demo version. Real transfers would require additional security verification.*`;
    }
    
    // Language-specific responses
    const responses: Record<string, string> = {
      en: `I understand you said: "${input}"\n\nI'm processing your request using advanced AI to help with your financial needs. Here are some things I can help you with:\n\n• Record transactions\n• Check balances\n• Generate reports\n• Transfer money\n• Analyze spending patterns\n\nWhat would you like to do next?`,
      ur: `میں سمجھ گیا کہ آپ نے کہا: "${input}"\n\nمیں آپ کی مالی ضروریات کے لیے ایڈوانس AI استعمال کر کے آپ کی درخواست پر کام کر رہا ہوں۔ میں آپ کی مدد کر سکتا ہوں:\n\n• لین دین ریکارڈ کرنا\n• بیلنس چیک کرنا\n• رپورٹس بنانا\n• پیسے ٹرانسفر کرنا\n• خرچ کا تجزیہ\n\nآپ آگے کیا کرنا چاہیں گے؟`,
      hi: `मैं समझ गया कि आपने कहा: "${input}"\n\nमैं आपकी वित्तीय जरूरतों के लिए उन्नत AI का उपयोग करके आपके अनुरोध को संसाधित कर रहा हूं। मैं आपकी मदद कर सकता हूं:\n\n• लेन-देन रिकॉर्ड करना\n• बैलेंस चेक करना\n• रिपोर्ट बनाना\n• पैसे ट्रांसफर करना\n• खर्च का विश्लेषण\n\nआप आगे क्या करना चाहेंगे?`,
    };
    
    return responses[lang] || responses.en;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no messages and user is not authenticated, show Daleel-style landing
  if (!isAuthenticated && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Centered Logo */}
        <div className="mb-12 text-center">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            FinanceAI
            <span className="text-blue-500">.</span>
          </h1>
        </div>

        {/* Main Search Interface */}
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
                onKeyPress={handleKeyPress}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceToggle}
                className={`rounded-full p-2 ${
                  isListening 
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950' 
                    : isDarkMode 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className={`text-center text-lg mb-12 max-w-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Your intelligent financial assistant supporting multiple languages and voice commands.
        </p>

        {/* Language Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {supportedLanguages.slice(0, 5).map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Language selected:', lang.code);
                setSelectedLanguage(lang.code);
              }}
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

        {/* CTA */}
        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Sign in to start managing your finances with AI
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
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
                  console.log('Language changed to:', lang.code);
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.language && (
                  <Badge variant="secondary" className="text-xs">
                    {supportedLanguages.find(l => l.code === message.language)?.flag} {message.language.toUpperCase()}
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      {isAuthenticated && (
        <div className="p-4">
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100/80 border-gray-300'}`}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('Language mode toggled');
                  setIsLanguageMode(!isLanguageMode);
                }}
                className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <Globe className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceToggle}
                className={`${
                  isListening 
                    ? 'text-red-500 hover:bg-red-50' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
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
                disabled={!inputValue.trim()}
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

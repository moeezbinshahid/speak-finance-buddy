
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";
import { Sidebar } from "@/components/Sidebar";
import { AuthModal } from "@/components/AuthModal";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SwipeMenu } from "@/components/SwipeMenu";
import { Preloader } from "@/components/Preloader";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [swipeMenuOpen, setSwipeMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-black' : 'bg-[#f2f8fc]'}`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isAuthenticated={isAuthenticated}
          onAuthClick={() => setShowAuthModal(true)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="flex-1 flex">
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isDarkMode={isDarkMode}
            isAuthenticated={isAuthenticated}
          />
          
          <main className="flex-1 flex flex-col relative">
            {/* Always show FinanceAI title */}
            <div className="flex justify-center pt-8 mb-4">
              <h1 className={`text-4xl md:text-5xl font-kusanagi font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                FinanceAI
                <span className="text-blue-500">.</span>
              </h1>
            </div>
            
            <ChatInterface 
              isDarkMode={isDarkMode}
              isAuthenticated={isAuthenticated}
            />

            {/* Swipe indicator - only show when not authenticated */}
            {!isAuthenticated && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div 
                  className={`w-12 h-1 rounded-full cursor-pointer transition-all duration-300 hover:h-2 ${
                    isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  onClick={() => setSwipeMenuOpen(true)}
                />
                <p className={`text-xs text-center mt-2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Swipe up
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Swipe Menu */}
      <SwipeMenu 
        isDarkMode={isDarkMode}
        isOpen={swipeMenuOpen}
        onOpenChange={setSwipeMenuOpen}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setIsAuthenticated(true);
            setShowAuthModal(false);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Index;

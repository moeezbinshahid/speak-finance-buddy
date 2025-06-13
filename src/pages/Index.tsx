
import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";
import { Sidebar } from "@/components/Sidebar";
import { AuthModal } from "@/components/AuthModal";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          
          <main className="flex-1 flex flex-col">
            <ChatInterface 
              isDarkMode={isDarkMode}
              isAuthenticated={isAuthenticated}
            />
          </main>
        </div>
      </div>

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


import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";
import { Sidebar } from "@/components/Sidebar";
import { AuthModal } from "@/components/AuthModal";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SwipeMenu } from "@/components/SwipeMenu";
import { Preloader } from "@/components/Preloader";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [swipeMenuOpen, setSwipeMenuOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleLogout = async () => {
    console.log('Logging out user');
    await supabase.auth.signOut();
    setSwipeMenuOpen(false);
  };

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
          isAuthenticated={!!user}
          onAuthClick={() => setShowAuthModal(true)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="flex-1 flex">
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isDarkMode={isDarkMode}
            isAuthenticated={!!user}
          />
          
          <main className="flex-1 flex flex-col relative">
            {/* Only show FinanceAI title for authenticated users */}
            {user && (
              <div className="flex justify-center pt-8 mb-4">
                <h1 className={`text-4xl md:text-5xl font-kusanagi font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  FinanceAI
                  <span className="text-blue-500">.</span>
                </h1>
              </div>
            )}
            
            <ChatInterface 
              isDarkMode={isDarkMode}
              isAuthenticated={!!user}
            />

            {/* Swipe indicator - only show when not authenticated */}
            {!user && (
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
        isAuthenticated={!!user}
        onLogout={handleLogout}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Index;

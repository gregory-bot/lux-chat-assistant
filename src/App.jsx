import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import AuthPage from './components/AuthPage';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import VideoCallInterface from './components/VideoCallInterface';
import ChatBot from './components/ChatBot';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // This will be handled by the onAuthStateChanged listener
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HeroSection />;
      case 'video-call':
        return <VideoCallInterface />;
      case 'contact':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h1>
              <div className="space-y-4 text-lg text-gray-600">
                <p><strong>Email:</strong> info@luxdevhq.com</p>
                <p><strong>Phone:</strong> +254796448232</p>
                <p><strong>Website:</strong> https://www.luxdevhq.ai/</p>
                <p><strong>Address:</strong> Garden City</p>
              </div>
            </div>
          </div>
        );
      default:
        return <HeroSection />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />
      {renderCurrentPage()}
      <ChatBot />
    </div>
  );
}

export default App;
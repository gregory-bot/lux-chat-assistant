import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../services/geminiService';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const slides = [
    {
      image: 'https://i.postimg.cc/WzqCRRfB/lux2.jpg',
      subtitle: 'Join thousands of students mastering cutting-edge skills at LuxDev HQ',
    },
    {
      image: 'https://i.postimg.cc/bYGwYZXh/lux3.jpg',
      subtitle: 'Learn from industry professionals with real-world experience',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMessage = { sender: 'user', text: userInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await geminiService.generateResponse(userInput);
      const botMessage = { sender: 'bot', text: response };
      setChatHistory((prev) => [...prev, botMessage]);
      speak(response);
    } catch (error) {
      console.error('Gemini error:', error);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) =>
            index === currentSlide ? (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <img
                  src={slide.image}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                      className="text-2xl md:text-4xl text-white font-light"
                    >
                      {slide.subtitle}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Chat Interface */}
      <div className="bg-gray-50 py-12 px-4 md:px-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-indigo-950 mb-6 text-center">
            Ask LuxDev Assistant
          </h2>

          <div className="bg-white rounded-xl shadow-md p-6 h-[28rem] overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] text-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Controls */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type or speak your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleVoiceInput}
              className={`px-4 py-2 bg-white border-2 rounded-md text-indigo-950 font-semibold ${
                listening ? 'border-green-500' : 'border-indigo-950'
              }`}
            >
              🎙️
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-950 text-white px-4 py-2 rounded-md hover:bg-indigo-900"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

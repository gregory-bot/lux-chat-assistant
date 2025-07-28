import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneCall, Users, Clock, MessageSquare } from 'lucide-react';

const VideoCallInterface = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isCallActive) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setCallDuration(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCallActive(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCallActive(false);
    setShowChat(false);
    setChatMessages([]);
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: chatInput,
        sender: 'You',
        timestamp: new Date()
      }]);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {!isCallActive ? (
          // Pre-call interface
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Video className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Connect with LuxDev HQ
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Get instant support and guidance from our expert advisors
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Expert Advisors</h3>
                  <p className="text-sm text-gray-600">Talk to our program specialists</p>
                </div>
                <div className="text-center p-4">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Available 24/7</h3>
                  <p className="text-sm text-gray-600">Get help whenever you need it</p>
                </div>
                <div className="text-center p-4">
                  <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Instant Answers</h3>
                  <p className="text-sm text-gray-600">Quick responses to your questions</p>
                </div>
              </div>

              <button
                onClick={startCall}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
              >
                <PhoneCall className="w-6 h-6" />
                Start Video Call
              </button>
            </div>
          </motion.div>
        ) : (
          // Active call interface
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-screen max-h-[800px] bg-black rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Video Container */}
            <div className="relative h-full">
              {/* Main Video */}
              <div className="h-full relative">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Advisor Video (Simulated) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-green-600 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="LuxDev Advisor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    Sarah - Program Advisor
                  </div>
                </div>

                {/* Call Info */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-mono">{formatDuration(callDuration)}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-4">
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full transition-all ${
                      isAudioOn 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition-all ${
                      isVideoOn 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>

                  <button
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Panel */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Chat</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          Hi! I'm Sarah, your program advisor. How can I help you today?
                        </p>
                        <span className="text-xs text-green-600">Just now</span>
                      </div>
                      
                      {chatMessages.map((message) => (
                        <div key={message.id} className="bg-blue-100 p-3 rounded-lg ml-8">
                          <p className="text-sm text-blue-800">{message.text}</p>
                          <span className="text-xs text-blue-600">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                          placeholder="Type a message..."
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                        <button
                          onClick={sendChatMessage}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoCallInterface;
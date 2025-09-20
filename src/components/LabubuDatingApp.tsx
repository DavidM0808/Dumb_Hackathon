import React, { useState, useEffect, useRef } from 'react';
import { Heart, Check, X, Volume2, VolumeX, Loader2, AlertCircle, Mic, MicOff } from 'lucide-react';
import { labubuApi, type GameState } from '@/services/labubuApi';

export default function LabubuDatingApp() {
  const [gameState, setGameState] = useState<GameState>({ hearts: 3, isMuted: false, lastUpdated: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Audio input state
  const [audioInputLevel, setAudioInputLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio input functions
  const startAudioInput = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicrophonePermission('granted');
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      // Connect microphone to analyser
      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
      microphone.connect(analyser);
      
      setIsListening(true);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicrophonePermission('denied');
      setError('Microphone access denied. Please allow microphone access to use audio features.');
    }
  };
  
  const stopAudioInput = () => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Disconnect audio nodes
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    setAudioInputLevel(0);
  };
  
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current || !isListening) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average audio level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = average / 255; // Normalize to 0-1
      
      setAudioInputLevel(normalizedLevel);
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  // Load initial game state
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const response = await labubuApi.getGameState();
        if (response.success && response.data) {
          setGameState(response.data);
        } else {
          setError(response.error || 'Failed to load game state');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setInitialLoading(false);
      }
    };

    loadGameState();
  }, []);

  // Audio input effect - start/stop based on mute state
  useEffect(() => {
    if (!gameState.isMuted && microphonePermission === 'granted') {
      startAudioInput();
    } else {
      stopAudioInput();
    }
    
    // Cleanup on unmount
    return () => {
      stopAudioInput();
    };
  }, [gameState.isMuted, microphonePermission]);

  const handleApiCall = async (apiCall: () => Promise<any>, action: string) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setGameState(response.data);
      } else {
        setError(response.error || `Failed to ${action}`);
      }
    } catch (err) {
      setError(`Failed to ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const addHeart = () => {
    if (gameState.hearts < 6 && !gameState.isMuted) {
      handleApiCall(() => labubuApi.addHeart(), 'add heart');
    }
  };

  const removeHeart = () => {
    if (gameState.hearts > 0 && !gameState.isMuted) {
      handleApiCall(() => labubuApi.removeHeart(), 'remove heart');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setMicrophonePermission('granted');
      setError(null);
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setMicrophonePermission('denied');
      setError('Microphone access denied. Please allow microphone access to use audio features.');
    }
  };

  const toggleMute = () => {
    handleApiCall(() => labubuApi.toggleAudio(), 'toggle audio');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading Labubu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-4">
      {/* Error display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Header with earmuffs button and hearts */}
      <div className="w-full max-w-md flex justify-between items-start mb-8">
        {/* Earmuffs button */}
        <button
          onClick={toggleMute}
          disabled={loading}
          className={`p-3 rounded-full transition-all duration-300 relative ${
            gameState.isMuted 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
              : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            gameState.isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />
          )}
        </button>

        {/* Hearts display */}
        <div className="flex gap-1 flex-wrap max-w-24">
          {[...Array(Math.min(gameState.hearts, 6))].map((_, index) => (
            <Heart
              key={index}
              className="w-6 h-6 fill-red-500 text-red-500 animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
        
        {/* Audio input indicator */}
        <div className="flex flex-col items-center gap-2">
          {!gameState.isMuted && (
            <>
              {microphonePermission === 'denied' ? (
                <button
                  onClick={requestMicrophonePermission}
                  className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition-all duration-200"
                  title="Grant microphone access for audio features"
                >
                  <MicOff className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={microphonePermission === 'prompt' ? requestMicrophonePermission : undefined}
                    className="relative"
                    title={microphonePermission === 'prompt' ? 'Click to enable microphone' : 'Microphone active'}
                  >
                    <Mic className={`w-6 h-6 ${isListening ? 'text-green-500' : 'text-gray-400'} ${microphonePermission === 'prompt' ? 'cursor-pointer hover:text-blue-500' : ''}`} />
                    {isListening && (
                      <div 
                        className="absolute -inset-1 rounded-full border-2 border-green-500 animate-ping"
                        style={{
                          animationDuration: `${Math.max(0.5, 1 - audioInputLevel)}s`
                        }}
                      />
                    )}
                  </button>
                  
                  {/* Audio level bar */}
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-100"
                      style={{ 
                        width: `${Math.min(100, audioInputLevel * 100)}%`,
                        opacity: isListening ? 1 : 0.3
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Labubu character */}
      <div className="relative">
        {/* Labubu Image */}
        <div className="relative w-80 h-96 flex items-center justify-center">
          <div className="relative w-64 h-80">
            {/* Blue Labubu body */}
            <svg viewBox="0 0 300 400" className="w-full h-full">
              {/* Body */}
              <path d="M75 120 Q75 100 100 100 L200 100 Q225 100 225 120 L225 320 Q225 350 200 350 L100 350 Q75 350 75 320 Z" 
                    fill="#5B9BD5" stroke="#2F5F8F" strokeWidth="3"/>
              
              {/* Head */}
              <circle cx="150" cy="120" r="60" fill="#F5DEB3" stroke="#2F5F8F" strokeWidth="2"/>
              
              {/* Left ear */}
              <ellipse cx="110" cy="80" rx="25" ry="35" fill="#5B9BD5" stroke="#2F5F8F" strokeWidth="2"/>
              <ellipse cx="110" cy="80" rx="18" ry="28" fill="#F5DEB3"/>
              
              {/* Right ear */}
              <ellipse cx="190" cy="80" rx="25" ry="35" fill="#5B9BD5" stroke="#2F5F8F" strokeWidth="2"/>
              <ellipse cx="190" cy="80" rx="18" ry="28" fill="#F5DEB3"/>
              
              {/* Left eye */}
              <ellipse cx="130" cy="110" rx="12" ry="15" fill="white" stroke="black" strokeWidth="1"/>
              <circle cx="130" cy="115" r="8" fill="black"/>
              <circle cx="132" cy="112" r="2" fill="white"/>
              
              {/* Right eye (winking) */}
              <path d="M165 105 Q175 110 165 115" fill="none" stroke="black" strokeWidth="3"/>
              
              {/* Nose */}
              <circle cx="150" cy="125" r="3" fill="pink"/>
              
              {/* Mouth/teeth */}
              <path d="M120 135 Q150 150 180 135" fill="none" stroke="black" strokeWidth="2"/>
              <polygon points="135,140 140,150 130,150" fill="white" stroke="black" strokeWidth="1"/>
              <polygon points="160,140 170,150 165,150" fill="white" stroke="black" strokeWidth="1"/>
              
              {/* Arms */}
              <ellipse cx="65" cy="180" rx="20" ry="40" fill="#5B9BD5" stroke="#2F5F8F" strokeWidth="2"/>
              <ellipse cx="235" cy="180" rx="20" ry="40" fill="#5B9BD5" stroke="#2F5F8F" strokeWidth="2"/>
              
              {/* Hands */}
              <circle cx="65" cy="220" r="15" fill="#F5DEB3" stroke="#2F5F8F" strokeWidth="2"/>
              <circle cx="235" cy="220" r="15" fill="#F5DEB3" stroke="#2F5F8F" strokeWidth="2"/>
              
              {/* Feet */}
              <ellipse cx="120" cy="370" rx="20" ry="15" fill="#F5DEB3" stroke="#2F5F8F" strokeWidth="2"/>
              <ellipse cx="180" cy="370" rx="20" ry="15" fill="#F5DEB3" stroke="#2F5F8F" strokeWidth="2"/>
            </svg>

            {/* Left ear button (check) */}
            <button
              onClick={gameState.isMuted || loading ? undefined : addHeart}
              disabled={gameState.isMuted || loading}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10 ${
                gameState.isMuted || loading
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-green-500 hover:bg-green-600 transform hover:scale-110'
              }`}
              style={{ top: '20%', left: '23%' }}
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin text-white" />
              ) : (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Right ear button (cross) */}
            <button
              onClick={gameState.isMuted || loading ? undefined : removeHeart}
              disabled={gameState.isMuted || loading}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10 ${
                gameState.isMuted || loading
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-red-500 hover:bg-red-600 transform hover:scale-110'
              }`}
              style={{ top: '20%', right: '23%' }}
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin text-white" />
              ) : (
                <X className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Earmuffs overlay when muted */}
            {gameState.isMuted && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <svg viewBox="0 0 300 400" className="w-full h-full">
                  {/* Headband */}
                  <path d="M90 70 Q150 50 210 70" fill="#FFD700" stroke="#E6B800" strokeWidth="4"/>
                  
                  {/* Left earmuff */}
                  <circle cx="110" cy="80" r="35" fill="#FFD700" stroke="#E6B800" strokeWidth="3"/>
                  <circle cx="110" cy="80" r="28" fill="#333" opacity="0.8"/>
                  
                  {/* Right earmuff */}
                  <circle cx="190" cy="80" r="35" fill="#FFD700" stroke="#E6B800" strokeWidth="3"/>
                  <circle cx="190" cy="80" r="28" fill="#333" opacity="0.8"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status display */}
      <div className="mt-8 text-center">
        <p className="text-lg font-medium text-gray-700 mb-2">
          Hearts: {gameState.hearts}
        </p>
        <p className={`text-sm font-medium ${gameState.isMuted ? 'text-red-600' : 'text-green-600'}`}>
          Audio: {gameState.isMuted ? 'Muted' : 'Active'}
        </p>
        {!gameState.isMuted && (
          <p className="text-xs text-gray-500 mt-1">
            {isListening ? (
              <span className="text-green-600">Listening... (Level: {Math.round(audioInputLevel * 100)}%)</span>
            ) : microphonePermission === 'denied' ? (
              <span className="text-yellow-600">Microphone access needed</span>
            ) : (
              <span>Click microphone icon to enable audio input</span>
            )}
          </p>
        )}
        {loading && (
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Updating...
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600 max-w-md">
        <p>Tap the <span className="text-green-600">✓</span> on left ear to add hearts (max 6)</p>
        <p>Tap the <span className="text-red-600">✗</span> on right ear to remove hearts</p>
        <p>Tap the audio button to toggle earmuffs</p>
        {!gameState.isMuted && (
          <p>Click the <span className="text-blue-600">🎤</span> microphone icon to enable audio input</p>
        )}
      </div>
    </div>
  );
}
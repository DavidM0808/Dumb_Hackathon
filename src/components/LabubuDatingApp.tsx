import React, { useState, useEffect } from 'react';
import { Heart, HeartCrack, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import { labubuApi, type GameState } from '@/services/labubuApi';

export default function LabubuDatingApp() {
  const [gameState, setGameState] = useState<GameState>({ hearts: 3, isMuted: false, lastUpdated: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

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

  const toggleMute = () => {
    handleApiCall(() => labubuApi.toggleAudio(), 'toggle audio');
  };

  // Function to determine video source based on heart count and mute state
  const getVideoSource = () => {
    if (gameState.isMuted) {
      return encodeURI("/put on earmuff.mov");
    }
    
    // Dynamic video based on heart count
    switch (gameState.hearts) {
      case 0:
        return encodeURI("/crying - 0.mov");
      case 1:
        return encodeURI("/gun shot - 1.mov");
      case 2:
        return encodeURI("/ewww 2.mov");
      case 3:
        return encodeURI("/labubu - standing still - default.mov");
      case 4:
        return encodeURI("/4 - cat.mov");
      case 5:
        return encodeURI("/5 - painting.mov");
      case 6:
        return encodeURI("/ice cream - 6-1.mov");
      default: // Fallback for any unexpected values
        return encodeURI("/labubu - standing still - default.mov");
    }
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
      </div>

      {/* Main Labubu character */}
      <div className="relative">
        {/* Labubu Video */}
        <div className="relative w-80 h-96 flex items-center justify-center">
          <div className="relative w-64 h-80 rounded-lg overflow-hidden">
            {/* Video element */}
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={gameState.isMuted}
              playsInline
              src={getVideoSource()}
              key={`${gameState.isMuted ? 'muted' : 'unmuted'}-${gameState.hearts}`} // Force re-render when switching
            />

            {/* Left ear button (heart) - positioned over left ear */}
            <button
              onClick={gameState.isMuted || loading ? undefined : addHeart}
              disabled={gameState.isMuted || loading}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10 ${
                gameState.isMuted || loading
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-green-500 hover:bg-green-600 transform hover:scale-110'
              }`}
              style={{ top: '15%', left: '20%' }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Heart className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Right ear button (broken heart) - positioned over right ear */}
            <button
              onClick={gameState.isMuted || loading ? undefined : removeHeart}
              disabled={gameState.isMuted || loading}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10 ${
                gameState.isMuted || loading
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-red-500 hover:bg-red-600 transform hover:scale-110'
              }`}
              style={{ top: '15%', right: '20%' }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <HeartCrack className="w-5 h-5 text-white" />
              )}
            </button>
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
        {loading && (
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Updating...
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600 max-w-md">
        <p>Tap the <span className="text-green-600">♥</span> on left ear to add hearts (max 6)</p>
        <p>Tap the <span className="text-red-600">💔</span> on right ear to remove hearts</p>
        <p>Tap the audio button to toggle earmuffs</p>
      </div>
    </div>
  );
}
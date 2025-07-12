import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in effect
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    // Fade out effect before navigation
    setIsVisible(false);
    setTimeout(() => navigate('/home'), 500);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center cursor-pointer transition-all duration-500"
      onClick={handleClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Glowing sphere effect */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-2xl shadow-purple-500/50"></div>
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Welcome text */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in">
            Welcome
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-purple-200 animate-fade-in-delay">
            to SP's Digital World
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto animate-fade-in-delay-2">
          Click anywhere to explore the universe of possibilities
        </p>

        {/* Animated arrow */}
        <div className="animate-bounce">
          <svg 
            className="w-8 h-8 text-purple-300 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full animate-float"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full animate-float-delay"></div>
      <div className="absolute bottom-32 left-32 w-2 h-2 bg-blue-400 rounded-full animate-float-delay-2"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-purple-300 rounded-full animate-float"></div>
    </div>
  );
};

export default Welcome; 
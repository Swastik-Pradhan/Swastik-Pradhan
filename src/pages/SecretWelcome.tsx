import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const WAVE_TEXT = 'Welcome';

const SecretWelcome = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [ripple, setRipple] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in effect
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Ripple effect
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setTimeout(() => setRipple(null), 600);
    }
    // Fade out effect before navigation
    setIsVisible(false);
    setTimeout(() => navigate('/home'), 500);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-transparent flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden"
      onClick={handleClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.7 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Ripple effect on click */}
      {ripple && (
        <span
          className="pointer-events-none absolute rounded-full bg-blue-400/30 animate-welcome-ripple"
          style={{
            left: ripple.x - 150,
            top: ripple.y - 150,
            width: 300,
            height: 300,
            zIndex: 20,
          }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 secret-nav-glow">
        {/* Glowing, rotating, pulsing sphere with orbiting particles */}
        <div className="relative flex items-center justify-center mx-auto">
          <div className="w-32 h-32 rounded-full bg-transparent nav-glow-icon animate-welcome-sphere-pulse animate-spin-slow relative flex items-center justify-center">
            {/* Orbiting blue particles */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 2 * Math.PI;
              const x = Math.cos(angle) * 60 + 64/2 - 6/2;
              const y = Math.sin(angle) * 60 + 64/2 - 6/2;
              return (
                <span
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-blue-400 shadow-lg animate-orbit"
                  style={{
                    left: x,
                    top: y,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              );
            })}
            {/* Blue rays */}
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 w-1 h-8 bg-blue-300/30 rounded-full origin-bottom animate-welcome-ray"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-32px)`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Welcome text with wave animation */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold glow-text nav-glow-icon animate-fade-in flex justify-center gap-1">
            {WAVE_TEXT.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block animate-welcome-wave"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {char}
              </span>
            ))}
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-white/80 nav-glow-icon animate-fade-in-delay animate-slide-up">
            to SP's Digital World
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 max-w-md mx-auto animate-fade-in-delay-2 nav-glow-icon animate-slide-up">
          Click anywhere to explore the universe of possibilities
        </p>

        {/* Animated arrow */}
        <div className="animate-bounce animate-fade-in-delay-2">
          <svg 
            className="w-8 h-8 text-blue-300 mx-auto nav-glow-icon" 
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
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full animate-float"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-float-delay"></div>
      <div className="absolute bottom-32 left-32 w-2 h-2 bg-blue-400 rounded-full animate-float-delay-2"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-blue-300 rounded-full animate-float"></div>
    </div>
  );
};

export default SecretWelcome; 
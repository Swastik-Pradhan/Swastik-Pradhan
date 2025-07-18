import { Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MusicButton = () => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    // Dispatch a synthetic Ctrl+M event
    const event = new KeyboardEvent('keydown', {
      key: 'm',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" style={{ width: 'auto', height: 'auto' }}>
      <div className="relative flex items-end justify-end">
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
            bg-black/60 border-2 border-neon-blue/40 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f5ff]`}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 16px 4px #00f5ff99',
            backgroundColor: 'rgba(0,245,255,0.08)',
            borderColor: '#00f5ff',
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: '0 0 16px 4px #00f5ffcc',
            backgroundColor: 'rgba(0,245,255,0.13)',
            borderColor: '#00f5ff',
          }}
          style={{
            boxShadow: '0 0 12px 2px #00f5ff44',
            background: 'rgba(0,0,0,0.01)',
            borderColor: 'transparent',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            cursor: 'pointer',
          }}
          title="Toggle Music Controls"
          tabIndex={0}
          aria-label="Toggle Music Controls (Ctrl + M)"
        >
          <Music className="h-5 w-5" color="#00f5ff" />
        </motion.button>
        {/* Tooltip absolutely above button, never blocks pointer events */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.35, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 select-none pointer-events-none font-mono tracking-wide"
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              opacity: 0.35,
              color: '#00f5ff',
              fontWeight: 600,
              textShadow: '0 0 4px #00f5ff',
              background: 'rgba(0,0,0,0.12)',
              borderRadius: '6px',
              padding: '1px 6px',
              zIndex: 9999,
              whiteSpace: 'nowrap',
              marginBottom: '6px',
            }}
            aria-hidden="true"
          >
            ctrl+m
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MusicButton; 
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
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300
            bg-transparent border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f5ff]`}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 12px 3px #00f5ff66',
            backgroundColor: 'rgba(0,245,255,0.08)',
            borderColor: '#00f5ff',
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: '0 0 12px 3px #00f5ff99',
            backgroundColor: 'rgba(0,245,255,0.13)',
            borderColor: '#00f5ff',
          }}
          style={{
            boxShadow: 'none',
            background: 'rgba(0,0,0,0.01)',
            borderColor: 'transparent',
          }}
          title="Toggle Music Controls"
          tabIndex={0}
          aria-label="Toggle Music Controls (Ctrl + M)"
        >
          <Music className="h-4 w-4" color="#00f5ff" />
        </motion.button>
        {/* Tooltip absolutely above button, never blocks pointer events */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs select-none pointer-events-none text-[#00f5ff] font-mono tracking-wide"
            style={{ filter: 'blur(0.5px)' }}
            aria-hidden="true"
          >
            Ctrl + M
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MusicButton; 
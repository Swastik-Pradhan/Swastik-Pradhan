
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  Home, 
  User, 
  Brain, 
  FolderOpen, 
  Globe, 
  MessageSquare, 
  X 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const FloatingSphereNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const navItems: NavItem[] = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, href: '#home', color: '#00f5ff' },
    { name: 'About', icon: <User className="h-5 w-5" />, href: '#about', color: '#8b5cf6' },
    { name: 'Skills', icon: <Brain className="h-5 w-5" />, href: '#tech', color: '#f472b6' },
    { name: 'Projects', icon: <FolderOpen className="h-5 w-5" />, href: '#projects', color: '#10b981' },
    { name: 'Globe', icon: <Globe className="h-5 w-5" />, href: '#globe', color: '#f59e0b' },
    { name: 'Contact', icon: <MessageSquare className="h-5 w-5" />, href: '#contact', color: '#ef4444' },
  ];

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Track scroll position to determine active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 200;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.id;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize active section on load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate positions for the semicircle menu items
  const getSemicirclePosition = (index: number, total: number, radius: number) => {
    // Calculate angle in the semicircle (180 degrees / PI radians)
    // Starting from the right (0 degrees) to the left (180 degrees)
    const angle = (index / (total - 1)) * Math.PI;
    return {
      x: Math.cos(angle) * radius,
      y: -Math.sin(angle) * radius, // Negative to go upward
    };
  };

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  return (
    <motion.div 
      ref={menuRef}
      className="fixed right-8 bottom-8 z-50 flex items-center justify-center"
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ scale: 1.1 }}
      animate={{ x: position.x, y: position.y }}
      onDragEnd={(_, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y
        });
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-screen h-screen left-0 top-0 -z-10"
          />
        )}
      </AnimatePresence>

      {/* Semicircle menu items */}
      <AnimatePresence>
        {isOpen && navItems.map((item, index) => {
          const position = getSemicirclePosition(
            index,
            navItems.length,
            120 // Radius of the semicircle
          );
          
          return (
            <TooltipProvider key={item.name}>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      x: position.x, 
                      y: position.y, 
                      opacity: 1,
                      transition: { 
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        delay: index * 0.05
                      }
                    }}
                    exit={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0, 
                      opacity: 0,
                      transition: { 
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        delay: (navItems.length - index) * 0.03
                      }
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute"
                  >
                    <a
                      href={item.href}
                      className={`flex items-center justify-center rounded-full p-3
                                w-12 h-12 bg-black/30 backdrop-blur-md
                                border-2 transition-all duration-300
                                ${activeSection === item.href.substring(1) 
                                  ? `border-[${item.color}] shadow-lg shadow-[${item.color}]/30`
                                  : 'border-gray-700 hover:border-gray-400'}`}
                      style={{ 
                        boxShadow: activeSection === item.href.substring(1) 
                          ? `0 0 15px ${item.color}40`
                          : 'none'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                        setIsOpen(false);
                      }}
                    >
                      <span style={{ color: item.color }}>{item.icon}</span>
                    </a>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </AnimatePresence>

      {/* Close button that appears when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { delay: 0.1 }
            }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-0 right-0 -mr-3 -mt-3"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="bg-black/50 text-white rounded-full p-1
                        border border-gray-700 shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Handle for dragging */}
      <motion.div
        className="absolute inset-0 cursor-move"
        onPointerDown={startDrag}
      />

      {/* Main sphere button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-full overflow-hidden
                  ${isOpen ? 'bg-black/50' : 'bg-black/25'} 
                  backdrop-blur-md border-2 border-neon-blue/20
                  flex items-center justify-center
                  w-14 h-14 z-10`}
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.7)'
        }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 30px rgba(0, 245, 255, 0.6)' 
            : '0 0 15px rgba(0, 245, 255, 0.2)'
        }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Inner sphere content */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/60 via-neon-purple/40 to-neon-green/40 opacity-70 animate-rotate-slow" />
          
          {/* Glowing center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm animate-pulse" />
          </div>
        </div>

        {/* Orbiting particles */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-neon-blue/80 animate-orbit"
              style={{
                animationDelay: `${i * 0.7}s`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingSphereNav;

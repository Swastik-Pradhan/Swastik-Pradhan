
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, User, FolderOpen, MessageSquare, Menu } from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, href: '#home' },
    { name: 'About', icon: <User className="h-5 w-5" />, href: '#about' },
    { name: 'Projects', icon: <FolderOpen className="h-5 w-5" />, href: '#projects' },
    { name: 'Contact', icon: <MessageSquare className="h-5 w-5" />, href: '#contact' },
  ];

  // Check window size to determine if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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

  // Animation variants for the nav container
  const navVariants = {
    closed: {
      width: isMobile ? '0' : '60px',
      opacity: isMobile ? 0 : 0.6,
    },
    open: {
      width: isMobile ? '240px' : '200px',
      opacity: 1,
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <motion.button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm text-neon-blue shadow-lg shadow-neon-blue/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="h-6 w-6" />
        </motion.button>
      )}

      {/* Navigation panel */}
      <motion.nav
        className={`fixed left-0 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md rounded-r-2xl z-40
                  border-r border-t border-b border-neon-blue/20 shadow-lg shadow-neon-blue/10
                  transition-all duration-300 overflow-hidden ${isMobile ? 'h-auto py-4' : 'h-auto py-6'}`}
        initial="closed"
        animate={isNavOpen || (!isMobile && 'hover') ? 'open' : 'closed'}
        variants={navVariants}
        onHoverStart={() => !isMobile && setIsNavOpen(true)}
        onHoverEnd={() => !isMobile && setIsNavOpen(false)}
      >
        <ul className="flex flex-col gap-6 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <a 
                href={item.href}
                className={`flex items-center gap-3 transition-all duration-300 group
                ${activeSection === item.href.substring(1) 
                  ? 'text-neon-blue' 
                  : 'text-gray-300 hover:text-neon-blue'}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                  if (isMobile) setIsNavOpen(false);
                }}
              >
                <motion.div 
                  className={`p-2 rounded-lg ${activeSection === item.href.substring(1) 
                    ? 'bg-neon-blue/20 shadow-md shadow-neon-blue/50' 
                    : 'bg-gray-800/50'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isNavOpen ? 1 : 0,
                    x: isNavOpen ? 0 : -10 
                  }}
                  transition={{ delay: isNavOpen ? 0.1 : 0 }}
                  className="whitespace-nowrap font-medium"
                >
                  {item.name}
                </motion.span>

                {/* Active indicator */}
                {activeSection === item.href.substring(1) && (
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-neon-blue absolute -right-0.5"
                    layoutId="activeSection"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>
    </>
  );
};

export default FloatingNav;

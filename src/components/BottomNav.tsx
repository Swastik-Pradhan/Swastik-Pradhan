import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Brain, 
  FolderOpen, 
  Globe, 
  MessageSquare,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface BottomNavProps {
  onToggleNav: () => void;
}

const BottomNav = ({ onToggleNav }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/home', color: '#00f5ff' },
    { name: 'About', icon: <User className="h-5 w-5" />, path: '/about', color: '#8b5cf6' },
    { name: 'Skills', icon: <Brain className="h-5 w-5" />, path: '/skills', color: '#f472b6' },
    { name: 'Projects', icon: <FolderOpen className="h-5 w-5" />, path: '/projects', color: '#10b981' },
    { name: 'Globe', icon: <Globe className="h-5 w-5" />, path: '/globe', color: '#f59e0b' },
    { name: 'Contact', icon: <MessageSquare className="h-5 w-5" />, path: '/contact', color: '#ef4444' },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-0 right-0 z-50 px-4"
    >
      {/* Navigation items */}
      <div className="flex items-center justify-center gap-2">
        {navItems.map((item, index) => (
          <motion.button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                      ${location.pathname === item.path 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              boxShadow: location.pathname === item.path 
                ? `0 0 20px ${item.color}40`
                : 'none'
            }}
            title={item.name}
          >
            <span style={{ color: location.pathname === item.path ? item.color : 'inherit' }}>
              {item.icon}
            </span>
          </motion.button>
        ))}
        
        {/* Secret toggle button */}
        <motion.button
          onClick={onToggleNav}
          className="flex items-center justify-center w-12 h-12 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          title="Toggle Navigation Style"
        >
          <Settings className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BottomNav; 
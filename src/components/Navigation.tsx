import { AnimatePresence } from 'framer-motion';
import { useNavigation } from '@/contexts/NavigationContext';
import BottomNav from './BottomNav';
import FloatingSphereNav from './FloatingSphereNav';

const Navigation = () => {
  const { isBottomNav, toggleNavigation } = useNavigation();

  return (
    <>
      <AnimatePresence mode="wait">
        {isBottomNav ? (
          <BottomNav key="bottom-nav" onToggleNav={toggleNavigation} />
        ) : (
          <FloatingSphereNav key="floating-nav" />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation; 
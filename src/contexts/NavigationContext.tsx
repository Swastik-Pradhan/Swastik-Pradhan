import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isBottomNav: boolean;
  toggleNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [isBottomNav, setIsBottomNav] = useState(true); // Start with bottom nav

  const toggleNavigation = () => {
    setIsBottomNav(!isBottomNav);
  };

  return (
    <NavigationContext.Provider value={{ isBottomNav, toggleNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}; 
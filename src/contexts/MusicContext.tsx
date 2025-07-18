import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MusicContextType {
  showControls: boolean;
  toggleControls: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [showControls, setShowControls] = useState(false);

  const toggleControls = () => {
    console.log('toggleControls called, current state:', showControls);
    setShowControls(prev => {
      const newState = !prev;
      console.log('New state will be:', newState);
      return newState;
    });
  };

  console.log('MusicContext render, showControls:', showControls);

  return (
    <MusicContext.Provider value={{ showControls, toggleControls }}>
      {children}
    </MusicContext.Provider>
  );
}; 
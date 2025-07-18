import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationProvider } from "./contexts/NavigationContext";
import { MusicProvider, useMusic } from "./contexts/MusicContext";
import BackgroundMusicPlayer from "./components/BackgroundMusicPlayer";
import EasterEggs from "./components/EasterEggs";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Globe from "./pages/Globe";
import NotFound from "./pages/NotFound";
import { Music } from "lucide-react";
import { motion } from "framer-motion";

const queryClient = new QueryClient();

const FloatingMusicButton = () => {
  const { toggleControls } = useMusic();
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 nav-glow-icon shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: '0 0 8px #fff4',
        textShadow: '0 0 12px #fff, 0 0 24px #fff4',
        background: 'rgba(0,0,0,0.6)',
      }}
      title="Music (Ctrl+M)"
      aria-label="Music (Ctrl+M)"
      onClick={toggleControls}
    >
      <Music className="h-5 w-5" />
    </motion.button>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MusicProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <NavigationProvider>
            <BackgroundMusicPlayer />
            <EasterEggs />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/globe" element={<Globe />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NavigationProvider>
        </BrowserRouter>
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

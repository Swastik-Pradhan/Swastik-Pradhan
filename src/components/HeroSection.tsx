
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDownloadResume = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'SwastikPradhan_CV.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewWork = () => {
    navigate('/projects');
  };

  return (
    <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto flex items-center justify-center relative">
      <div className="text-center z-10">
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-glow-pulse glow-text">
            SWASTIK
          </h1>
          <h2 className="text-2xl md:text-4xl text-neon-blue mb-8 animate-fade-in-up">
            Full Stack Developer & Data Analyst
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Crafting digital experiences with cutting-edge technology and creative innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="neon-button" onClick={handleViewWork}>
              View My Work
            </Button>
            <Button className="neon-button" onClick={handleDownloadResume}>
              Download Resume
            </Button>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-neon-pink/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
    </section>
  );
};

export default HeroSection;

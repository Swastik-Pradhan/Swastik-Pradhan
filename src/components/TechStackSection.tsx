
import { useRef, useEffect, useState } from 'react';

interface Technology {
  name: string;
  position: [number, number, number];
  color: string;
}

const TechStackSection = () => {
  const technologies = [
    { name: 'React', position: [2, 1, 0] as [number, number, number], color: '#61dafb' },
    { name: 'Python', position: [-2, 1, 0] as [number, number, number], color: '#3776ab' },
    { name: 'JavaScript', position: [0, 2, 1] as [number, number, number], color: '#f7df1e' },
    { name: 'Node.js', position: [1, -1, 1] as [number, number, number], color: '#339933' },
    { name: 'Tableau', position: [-1, -1, -1] as [number, number, number], color: '#e97627' },
    { name: 'MongoDB', position: [0, 0, -2] as [number, number, number], color: '#47a248' },
  ];

  // Animation for tech cards
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle animation for the tech cards when not being hovered
      if (containerRef.current) {
        const cards = containerRef.current.querySelectorAll('.tech-card');
        cards.forEach((card, index) => {
          if (card instanceof HTMLElement && card.dataset.name !== hoveredTech) {
            const time = Date.now() * 0.001 + index * 0.5;
            const scale = 1 + Math.sin(time) * 0.03;
            card.style.transform = `scale(${scale})`;
          }
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [hoveredTech]);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 glow-text">
          Tech <span className="text-neon-blue">Stack</span>
        </h2>
        
        <div className="h-auto mb-12">
          <div className="tech-orbit-container flex flex-wrap justify-center items-center gap-8 mb-16">
            {technologies.map((tech, index) => (
              <div 
                key={index} 
                className="tech-orbit relative"
                style={{
                  animationDelay: `${index * 0.5}s`
                }}
              >
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center bg-card/50 backdrop-blur-md border-2 hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300 transform hover:scale-110"
                  style={{
                    borderColor: tech.color,
                    boxShadow: `0 0 15px ${tech.color}40`
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{ 
                      backgroundColor: tech.color,
                      boxShadow: `0 0 15px ${tech.color}80`
                    }}
                  />
                </div>
                <p className="text-center mt-3 text-neon-blue font-semibold">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              data-name={tech.name}
              className="tech-card text-center"
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-3 transition-transform duration-500"
                style={{ 
                  backgroundColor: tech.color,
                  boxShadow: hoveredTech === tech.name ? `0 0 15px ${tech.color}` : 'none',
                  transform: hoveredTech === tech.name ? 'scale(1.2)' : 'scale(1)'
                }}
              ></div>
              <h3 className="font-semibold text-neon-blue">{tech.name}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background glow effects */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default TechStackSection;

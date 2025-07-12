import TechStackSection from '@/components/TechStackSection';
import FloatingParticles from '@/components/FloatingParticles';
import Navigation from '@/components/Navigation';

const Skills = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <Navigation />
      <section id="skills">
        <TechStackSection />
      </section>
    </div>
  );
};

export default Skills; 
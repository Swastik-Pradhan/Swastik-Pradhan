import AboutSection from '@/components/AboutSection';
import FloatingParticles from '@/components/FloatingParticles';
import Navigation from '@/components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <Navigation />
      <section id="about">
        <AboutSection />
      </section>
    </div>
  );
};

export default About; 
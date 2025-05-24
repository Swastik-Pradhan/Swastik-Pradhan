
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import TechStackSection from '@/components/TechStackSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import FloatingParticles from '@/components/FloatingParticles';
import FloatingSphereNav from '@/components/FloatingSphereNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <FloatingSphereNav />
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="tech">
        <TechStackSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
    </div>
  );
};

export default Index;

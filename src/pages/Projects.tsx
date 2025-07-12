import ProjectsSection from '@/components/ProjectsSection';
import FloatingParticles from '@/components/FloatingParticles';
import Navigation from '@/components/Navigation';

const Projects = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <Navigation />
      <section id="projects">
        <ProjectsSection />
      </section>
    </div>
  );
};

export default Projects; 
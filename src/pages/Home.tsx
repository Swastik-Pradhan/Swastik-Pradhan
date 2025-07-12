import HeroSection from '@/components/HeroSection';
import FloatingParticles from '@/components/FloatingParticles';
import Navigation from '@/components/Navigation';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <Navigation />
      <section id="home">
        <HeroSection />
      </section>
    </div>
  );
};

export default Home; 
import ContactSection from '@/components/ContactSection';
import FloatingParticles from '@/components/FloatingParticles';
import Navigation from '@/components/Navigation';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <Navigation />
      <section id="contact">
        <ContactSection />
      </section>
    </div>
  );
};

export default Contact; 
import EarthGlobe from './EarthGlobe';

const AboutSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold glow-text">
            About <span className="text-neon-blue">Me</span>
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Hi, I'm <span className="text-neon-blue font-semibold">Swastik Pradhan</span>, a passionate Computer Science student pursuing B.Tech in CSE with specialization in Big Data Analytics at Lovely Professional University.
            </p>
            <p>
              I excel in building AI/ML solutions, real-time applications, and data-driven projects. With expertise in Python, TensorFlow, and modern web technologies, I create innovative solutions that bridge the gap between complex algorithms and user-friendly interfaces.
            </p>
            <p>
              Beyond academics, I'm actively involved in community service through NSS, contributing to social causes while continuously expanding my technical skills through hands-on projects and certifications.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="tech-card text-center">
              <h3 className="text-2xl font-bold text-neon-blue mb-2">90%+</h3>
              <p className="text-sm text-gray-400">ML Model Accuracy</p>
            </div>
            <div className="tech-card text-center">
              <h3 className="text-2xl font-bold text-neon-purple mb-2">27</h3>
              <p className="text-sm text-gray-400">ISL Gestures Classified</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-80 mx-auto">
            <EarthGlobe />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
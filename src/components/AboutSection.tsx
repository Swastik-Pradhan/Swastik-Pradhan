
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
              Hi, I'm <span className="text-neon-blue font-semibold">Swastik</span>, a passionate and curious learner currently pursuing a B.Tech in Computer Science and Engineering with a specialization in Big Data Analytics.
            </p>
            <p>
              I thrive on solving complex problems through innovative technology solutions and have a keen interest in full-stack development, data analysis, and emerging technologies.
            </p>
            <p>
              When I'm not coding, you'll find me exploring new frameworks, contributing to open-source projects, or analyzing interesting datasets to uncover hidden insights.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="tech-card text-center">
              <h3 className="text-2xl font-bold text-neon-blue mb-2">50+</h3>
              <p className="text-sm text-gray-400">Projects Completed</p>
            </div>
            <div className="tech-card text-center">
              <h3 className="text-2xl font-bold text-neon-purple mb-2">3+</h3>
              <p className="text-sm text-gray-400">Years Learning</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-80 h-80 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full opacity-20 animate-rotate-slow"></div>
            <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center border-2 border-neon-blue/30">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-4 animate-glow-pulse"></div>
                <h3 className="text-xl font-bold text-neon-blue">Developer</h3>
                <p className="text-sm text-gray-400">& Data Analyst</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

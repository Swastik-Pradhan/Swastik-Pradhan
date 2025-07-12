import InteractiveGlobe from './InteractiveGlobe';

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
              Hi, I'm <span className="text-neon-blue font-semibold">Swastik Pradhan</span>, a curious mind at the intersection of technology, creativity, and impact. Currently pursuing a B.Tech in Computer Science and Engineering with a specialization in Big Data Analytics, I thrive on solving real-world problems with data-driven solutions and intuitive design.
            </p>
            <p>
              I enjoy exploring diverse domains, from AI and Web Development to Data Visualization and Social Impact Projects. Whether it's building dashboards in Power BI or exploring ensemble models in machine learning, I believe every project is an opportunity to grow and make a difference.
            </p>
            <p>
              When I'm not coding or designing, you'll find me writing poetry, diving into music, or exploring the nuances of human emotions through storytelling.
            </p>
            <p>
              I may not be the most efficient with every tool I use, but I always finish what I start, on time. Whether it's AI, Google, or just relentless problem-solving, I find a way to deliver.
            </p>
            <p>
              Let's build something meaningful together.
            </p>
          </div>
          
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-neon-blue/20 to-purple-600/20 backdrop-blur-sm border border-neon-blue/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">✍️</div>
              <div className="text-neon-blue font-bold text-xl">10+</div>
              <div className="text-gray-300 text-sm">Poems Written</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎧</div>
              <div className="text-purple-400 font-bold text-xl">100,000+</div>
              <div className="text-gray-300 text-sm">Hours of Music Listened</div>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-orange-600/20 backdrop-blur-sm border border-pink-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-pink-400 font-bold text-xl">Infinite ☕</div>
              <div className="text-gray-300 text-sm">Cups of Curiosity</div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-80 h-80 mx-auto relative">
            <InteractiveGlobe />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
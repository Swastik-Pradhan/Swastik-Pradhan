
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Signify – Real-Time ISL Translator",
      description: "Built for Sociothon (NSS Hackathon) – a real-time Indian Sign Language to speech and speech-to-gesture translation app with 90-94% accuracy on 27 gestures.",
      image: "/placeholder.svg",
      tags: ["Python", "OpenCV", "TensorFlow", "Keras", "Tkinter"],
      github: "https://github.com/Swastik-Pradhan",
      demo: "#"
    },
    {
      title: "Real-Time Memory Allocation Tracker",
      description: "Simulation tool for dynamic memory allocation algorithms (First Fit, Best Fit, Worst Fit) with real-time visualization and multi-threading support.",
      image: "/placeholder.svg",
      tags: ["Python", "Tkinter", "Threading", "OS Concepts"],
      github: "https://github.com/Swastik-Pradhan",
      demo: "#"
    },
    {
      title: "Music Genre Classifier",
      description: "Machine learning classifier using GTZAN dataset achieving 86% accuracy with Random Forest. Features audio analysis with Librosa and real-time prediction GUI.",
      image: "/placeholder.svg",
      tags: ["Python", "scikit-learn", "Librosa", "Tkinter", "NumPy"],
      github: "https://github.com/Swastik-Pradhan",
      demo: "#"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 glow-text">
          Featured <span className="text-neon-blue">Projects</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="tech-card group">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl opacity-50">🚀</div>
                </div>
                <CardTitle className="text-neon-blue">{project.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="border-neon-blue/50 text-neon-blue">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-3">
                <Button size="sm" className="neon-button flex-1">
                  GitHub
                </Button>
                <Button size="sm" variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-gray-900 flex-1">
                  Live Demo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

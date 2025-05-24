
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Data Analytics Dashboard",
      description: "Interactive dashboard built with React and D3.js for visualizing complex datasets with real-time updates.",
      image: "/placeholder.svg",
      tags: ["React", "D3.js", "Python", "MongoDB"],
      github: "#",
      demo: "#"
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and user authentication.",
      image: "/placeholder.svg",
      tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
      github: "#",
      demo: "#"
    },
    {
      title: "Machine Learning Model",
      description: "Predictive analytics model for customer behavior analysis using scikit-learn and TensorFlow.",
      image: "/placeholder.svg",
      tags: ["Python", "TensorFlow", "Pandas", "Jupyter"],
      github: "#",
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

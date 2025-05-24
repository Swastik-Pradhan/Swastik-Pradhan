
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    const mailtoLink = `mailto:swastik5411@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email client...",
      description: "Your default email client should open with the message prepared.",
    });
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 glow-text">
          Write me <span className="text-neon-blue">something</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="tech-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-background/50 border-neon-blue/30 focus:border-neon-blue"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-background/50 border-neon-blue/30 focus:border-neon-blue"
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="bg-background/50 border-neon-blue/30 focus:border-neon-blue resize-none"
                />
                <Button type="submit" className="neon-button w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="tech-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-neon-blue mb-4">Connect with Me</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:swastik5411@gmail.com"
                    className="flex items-center gap-3 text-gray-300 hover:text-neon-blue transition-colors"
                  >
                    <span className="text-xl">📧</span>
                    swastik5411@gmail.com
                  </a>
                  
                  <div className="md:hidden space-y-2">
                    <a
                      href="tel:9938818238"
                      className="flex items-center gap-3 text-gray-300 hover:text-neon-blue transition-colors"
                    >
                      <span className="text-xl">📞</span>
                      Call me: +91 9938818238
                    </a>
                    <a
                      href="sms:9938818238"
                      className="flex items-center gap-3 text-gray-300 hover:text-neon-blue transition-colors"
                    >
                      <span className="text-xl">💬</span>
                      Text me: +91 9938818238
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="tech-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-neon-purple mb-4">Social Links</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-gray-900">
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-gray-900">
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="tech-card">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Open to Work
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Available for freelance projects and full-time opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;


import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy, Mail, Phone, MessageSquare, Linkedin, Github, ExternalLink, Check, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("_imi_OKEIErWcSidJ");
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Send email using EmailJS
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_email: 'swastik5411@gmail.com',
        subject: `Portfolio Contact from ${data.name}`,
      };

      const response = await emailjs.send(
        'service_kpjxtvg',
        'template_e55mvq4',
        templateParams,
        '_imi_OKEIErWcSidJ'
      );

      if (response.status === 200) {
        toast({
          title: "Message sent successfully! 🎉",
          description: "Thank you for reaching out. I'll get back to you soon!",
        });
        
        // Reset form
        reset();
      } else {
        throw new Error('Failed to send email');
      }
      
    } catch (error) {
      console.error('Email sending failed:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or use one of the alternative contact methods below.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied! 📋",
        description: `${field} copied to clipboard`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: 'swastik5411@gmail.com',
      href: 'mailto:swastik5411@gmail.com',
      field: 'email'
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      label: 'GitHub',
      href: 'https://github.com/Swastik-Pradhan',
      color: 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-gray-900'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/Swastik-Pradhan',
      color: 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-gray-900'
    },
    {
      icon: <ExternalLink className="h-5 w-5" />,
      label: 'Spotify',
      href: 'https://open.spotify.com/user/8src0sutylxdo3ejg94gykr90',
      color: 'border-green-500 text-green-400 hover:bg-green-500 hover:text-gray-900'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 glow-text">
          Write me <span className="text-neon-blue">something</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="tech-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    {...register('name')}
                    placeholder="Your Name"
                    className={`bg-background/50 border-neon-blue/30 focus:border-neon-blue ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Your Email"
                    className={`bg-background/50 border-neon-blue/30 focus:border-neon-blue ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    {...register('message')}
                    placeholder="Your Message"
                    rows={5}
                    className={`bg-background/50 border-neon-blue/30 focus:border-neon-blue resize-none ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm">{errors.message.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="neon-button w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                  

                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="tech-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-neon-blue mb-4">Connect with Me</h3>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.field} className="flex items-center justify-between group">
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-3 text-gray-300 hover:text-neon-blue transition-colors flex-1"
                      >
                        {info.icon}
                        <span className="text-sm">{info.value}</span>
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(info.value, info.label)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedField === info.label ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Social Links */}
            <Card className="tech-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-neon-purple mb-4">Social Links</h3>
                <div className="flex gap-4 flex-wrap">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.label}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={social.color}
                      >
                        {social.icon}
                        <span className="ml-2">{social.label}</span>
                      </Button>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Status Card */}
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

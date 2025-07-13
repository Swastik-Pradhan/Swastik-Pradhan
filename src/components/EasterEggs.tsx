import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Easter egg configurations for each page
const EASTER_EGGS = {
  '/': {
    name: 'Welcome Secret',
    trigger: 'WELCOME',
    message: '🎉 Welcome to the secret realm! 🎉',
    effect: 'welcome-secret'
  },
  '/home': {
    name: 'Home Sweet Home',
    trigger: 'HOME',
    message: '🏠 You found the home sweet home secret! 🏠',
    effect: 'home-secret'
  },
  '/about': {
    name: 'About Mystery',
    trigger: 'ABOUT',
    message: '👤 The about page has revealed its secrets! 👤',
    effect: 'about-secret'
  },
  '/skills': {
    name: 'Skill Master',
    trigger: 'SKILLS',
    message: '⚡ Skill master easter egg activated! ⚡',
    effect: 'skills-secret'
  },
  '/projects': {
    name: 'Project X',
    trigger: 'PROJECTS',
    message: '🚀 Project X easter egg discovered! 🚀',
    effect: 'projects-secret'
  },
  '/contact': {
    name: 'Contact Code',
    trigger: 'CONTACT',
    message: '📞 Contact code easter egg unlocked! 📞',
    effect: 'contact-secret'
  },
  '/globe': {
    name: 'Globe Explorer',
    trigger: 'GLOBE',
    message: '🌍 Globe explorer easter egg found! 🌍',
    effect: 'globe-secret'
  }
};

const EasterEggs = () => {
  const location = useLocation();
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
    const currentEgg = EASTER_EGGS[location.pathname as keyof typeof EASTER_EGGS];
    if (!currentEgg) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      setKeySequence(prev => {
        const newSequence = [...prev, key];
        if (newSequence.length > currentEgg.trigger.length) {
          newSequence.shift();
        }
        
        // Check if sequence matches
        if (newSequence.join('') === currentEgg.trigger) {
          triggerEasterEgg(currentEgg);
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname]);

  const triggerEasterEgg = (egg: any) => {
    if (easterEggActive) return;
    
    setEasterEggActive(true);
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black text-white px-8 py-4 rounded-lg text-xl font-bold border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)]';
    notification.innerHTML = egg.message;
    document.body.appendChild(notification);
    
    // Add page-specific effects
    addPageSpecificEffects(egg.effect);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      setEasterEggActive(false);
    }, 3000);
  };

  const addPageSpecificEffects = (effectType: string) => {
    switch (effectType) {
      case 'welcome-secret':
        // Welcome page: Add floating stars
        addFloatingStars(20, '#ffffff');
        break;
      case 'home-secret':
        // Home page: Add bouncing balls
        addBouncingBalls(15);
        break;
      case 'about-secret':
        // About page: Add rotating elements
        addRotatingElements();
        break;
      case 'skills-secret':
        // Skills page: Add skill icons floating
        addFloatingSkillIcons();
        break;
      case 'projects-secret':
        // Projects page: Add project cards floating
        addFloatingProjectCards();
        break;
      case 'contact-secret':
        // Contact page: Add contact icons floating
        addFloatingContactIcons();
        break;
      case 'globe-secret':
        // Globe page: Add earth rotation effect
        addEarthRotationEffect();
        break;
    }
  };

  const addFloatingStars = (count: number, color: string) => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-40';
    container.id = 'floating-stars';
    
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'absolute w-2 h-2 bg-white rounded-full opacity-60';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animation = `secret-float ${3 + Math.random() * 4}s ease-in-out infinite`;
      star.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(star);
    }
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 5000);
  };

  const addBouncingBalls = (count: number) => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-40';
    container.id = 'bouncing-balls';
    
    for (let i = 0; i < count; i++) {
      const ball = document.createElement('div');
      ball.className = 'absolute w-4 h-4 bg-white rounded-full opacity-70';
      ball.style.left = Math.random() * 100 + '%';
      ball.style.top = Math.random() * 100 + '%';
      ball.style.animation = `bounce ${2 + Math.random() * 2}s ease-in-out infinite`;
      ball.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(ball);
    }
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 5000);
  };

  const addRotatingElements = () => {
    const elements = document.querySelectorAll('.tech-card, .card, [class*="card"]');
    elements.forEach((element, index) => {
      (element as HTMLElement).style.animation = `rotate ${3 + index * 0.5}s linear infinite`;
    });
    
    setTimeout(() => {
      elements.forEach(element => {
        (element as HTMLElement).style.animation = '';
      });
    }, 5000);
  };

  const addFloatingSkillIcons = () => {
    const icons = ['⚡', '🚀', '💻', '🎨', '🔧', '📱', '🌐', '⚙️'];
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-40';
    container.id = 'floating-skill-icons';
    
    icons.forEach((icon, index) => {
      const iconElement = document.createElement('div');
      iconElement.className = 'absolute text-2xl opacity-70';
      iconElement.textContent = icon;
      iconElement.style.left = Math.random() * 100 + '%';
      iconElement.style.top = Math.random() * 100 + '%';
      iconElement.style.animation = `secret-float ${4 + Math.random() * 3}s ease-in-out infinite`;
      iconElement.style.animationDelay = index * 0.5 + 's';
      container.appendChild(iconElement);
    });
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 5000);
  };

  const addFloatingProjectCards = () => {
    const cards = document.querySelectorAll('.tech-card, .card, [class*="card"]');
    cards.forEach((card, index) => {
      (card as HTMLElement).style.animation = `secret-float ${3 + index * 0.3}s ease-in-out infinite`;
      (card as HTMLElement).style.animationDelay = index * 0.2 + 's';
    });
    
    setTimeout(() => {
      cards.forEach(card => {
        (card as HTMLElement).style.animation = '';
      });
    }, 5000);
  };

  const addFloatingContactIcons = () => {
    const icons = ['📧', '📱', '💬', '🌐', '📞', '✉️'];
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-40';
    container.id = 'floating-contact-icons';
    
    icons.forEach((icon, index) => {
      const iconElement = document.createElement('div');
      iconElement.className = 'absolute text-3xl opacity-80';
      iconElement.textContent = icon;
      iconElement.style.left = Math.random() * 100 + '%';
      iconElement.style.top = Math.random() * 100 + '%';
      iconElement.style.animation = `secret-float ${3 + Math.random() * 2}s ease-in-out infinite`;
      iconElement.style.animationDelay = index * 0.3 + 's';
      container.appendChild(iconElement);
    });
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 5000);
  };

  const addEarthRotationEffect = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.animation = 'rotate 2s linear infinite';
      
      setTimeout(() => {
        canvas.style.animation = '';
      }, 5000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
      💡 Try typing the page name...
    </div>
  );
};

export default EasterEggs; 
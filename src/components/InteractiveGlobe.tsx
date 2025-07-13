import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Location {
  name: string;
  lat: number;
  lon: number;
  color?: string;
}

const locations: Location[] = [
  { name: "Phagwara, India (LPU)", lat: 31.2338, lon: 75.7722, color: "#00ff88" },
  { name: "Peddapuram, India (School)", lat: 17.0833, lon: 82.1167, color: "#0088ff" },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060, color: "#ff6b6b" },
  { name: "London, UK", lat: 51.5074, lon: -0.1278, color: "#ffd93d" },
  { name: "Tokyo, Japan", lat: 35.6895, lon: 139.6917, color: "#6bcf7f" },
  { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093, color: "#4ecdc4" }
];

// SUPER SECRET EASTER EGG LOCATION - Almost impossible to find!
const SECRET_LOCATION: Location = {
  name: "🎯 Secret",
  lat: 47.6062, // Seattle area - but not exact
  lon: -122.3321,
  color: "#ff00ff"
};

// Helper function to convert lat/lon to 3D coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

interface PinProps {
  location: Location;
  radius: number;
  onHover: (location: Location | null) => void;
  onSecretFound?: () => void;
  isSecret?: boolean;
  isVisible?: boolean;
}

function LocationPin({ location, radius, onHover, onSecretFound, isSecret = false, isVisible = true }: PinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { camera } = useThree();
  
  const position = useMemo(() => 
    latLonToVector3(location.lat, location.lon, radius), 
    [location.lat, location.lon, radius]
  );

  useFrame((state) => {
    if (meshRef.current) {
      if (isSecret) {
        if (isVisible) {
          // Secret location pulses with rainbow colors when found
          const time = state.clock.elapsedTime;
          const hue = (time * 50) % 360;
          const color = new THREE.Color().setHSL(hue / 360, 1, 0.5);
          (meshRef.current.material as THREE.MeshBasicMaterial).color = color;
          meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
        } else {
          // More visible hint when camera is close to secret location
          const distanceToCamera = camera.position.distanceTo(position);
          if (distanceToCamera < 8) {
            // More visible glow when close
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5;
            (meshRef.current.material as THREE.MeshBasicMaterial).color = new THREE.Color(0xff0000);
          } else if (distanceToCamera < 12) {
            // Subtle hint when moderately close
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2;
            (meshRef.current.material as THREE.MeshBasicMaterial).color = new THREE.Color(0xffff00);
          } else {
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
      }
    }
  });

  const handleClick = () => {
    if (isSecret) {
      console.log('Secret location clicked!');
      setClickCount(prev => {
        const newCount = prev + 1;
        console.log(`Click count: ${newCount}/7`);
        if (newCount === 7) { // 7 clicks to activate
          console.log('7 clicks reached! Activating easter egg...');
          onSecretFound?.();
          setClickCount(0);
        }
        return newCount;
      });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerEnter={() => {
        setHovered(true);
        onHover(location);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <sphereGeometry args={[isSecret ? 0.025 : 0.02, 8, 8]} />
      <meshBasicMaterial 
        color={location.color || "#ff5733"}
        transparent
        opacity={hovered || (isSecret && isVisible) ? 0.9 : (isSecret ? 0 : 0.7)}
      />
      {(hovered || (isSecret && isVisible)) && (
        <Html distanceFactor={10}>
          <div className={`px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none ${
            isSecret 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold' 
              : 'bg-black/80 text-white'
          }`}>
            {location.name}
            {isSecret && clickCount > 0 && (
              <div className="text-xs text-yellow-300">
                Clicks: {clickCount}/7
              </div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [easterEggActive, setEasterEggActive] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (easterEggActive) {
        // Crazy rotation when easter egg is active
        meshRef.current.rotation.y += 0.02;
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.z += 0.005;
        
        // Rainbow material effect
        const time = state.clock.elapsedTime;
        const hue = (time * 30) % 360;
        const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
        (meshRef.current.material as THREE.MeshPhongMaterial).color = color;
        (meshRef.current.material as THREE.MeshPhongMaterial).emissive = color.clone().multiplyScalar(0.3);
      } else {
        // Normal rotation and reset to blue color
        meshRef.current.rotation.y += 0.001;
        (meshRef.current.material as THREE.MeshPhongMaterial).color = new THREE.Color("#1e40af");
        (meshRef.current.material as THREE.MeshPhongMaterial).emissive = new THREE.Color("#0f172a");
        (meshRef.current.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.1;
      }
    }
  });

  // Listen for easter egg activation and deactivation
  useEffect(() => {
    const handleEasterEgg = () => setEasterEggActive(true);
    const handleEasterEggDeactivated = () => setEasterEggActive(false);
    window.addEventListener('easter-egg-activated', handleEasterEgg);
    window.addEventListener('easter-egg-deactivated', handleEasterEggDeactivated);
    return () => {
      window.removeEventListener('easter-egg-activated', handleEasterEgg);
      window.removeEventListener('easter-egg-deactivated', handleEasterEggDeactivated);
    };
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        color="#1e40af"
        emissive="#0f172a"
        emissiveIntensity={0.1}
        shininess={30}
      />
    </mesh>
  );
}

function Starfield() {
  const starsRef = useRef<THREE.Points>(null);
  const [easterEggActive, setEasterEggActive] = useState(false);
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (starsRef.current && easterEggActive) {
      // Stars dance when easter egg is active
      const time = state.clock.elapsedTime;
      starsRef.current.rotation.y += 0.01;
      starsRef.current.rotation.x += Math.sin(time) * 0.005;
    }
  });

  useEffect(() => {
    const handleEasterEgg = () => setEasterEggActive(true);
    const handleEasterEggDeactivated = () => setEasterEggActive(false);
    window.addEventListener('easter-egg-activated', handleEasterEgg);
    window.addEventListener('easter-egg-deactivated', handleEasterEggDeactivated);
    return () => {
      window.removeEventListener('easter-egg-activated', handleEasterEgg);
      window.removeEventListener('easter-egg-deactivated', handleEasterEggDeactivated);
    };
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={5000}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={easterEggActive ? 0.1 : 0.05} 
        color={easterEggActive ? "#ffff00" : "#ffffff"} 
        opacity={0.8} 
        transparent 
      />
    </points>
  );
}

function Globe() {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [secretThemeSequence, setSecretThemeSequence] = useState<string[]>([]);
  const [deactivateThemeSequence, setDeactivateThemeSequence] = useState<string[]>([]);
  const [secretClicks, setSecretClicks] = useState<number[]>([]);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [secretLocationFound, setSecretLocationFound] = useState(false);

  // Konami Code sequence
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  // Super Secret Theme Code sequence
  const SECRET_THEME_CODE = ['KeyS', 'KeyE', 'KeyC', 'KeyR', 'KeyE', 'KeyT'];
  
  // Deactivate Secret Theme Code sequence
  const DEACTIVATE_THEME_CODE = ['KeyE', 'KeyS', 'KeyC', 'KeyA', 'KeyP', 'KeyE'];

  // Secret click pattern (coordinates in 3D space)
  const SECRET_PATTERN = [1, 3, 5, 2, 4, 1, 6]; // This represents a specific pattern

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Konami Code
      setKonamiSequence(prev => {
        const newSequence = [...prev, event.code];
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        
        // Check if Konami code is complete
        if (newSequence.join(',') === KONAMI_CODE.join(',')) {
          triggerEasterEgg();
        }
        
        return newSequence;
      });

      // Handle Secret Theme Code
      setSecretThemeSequence(prev => {
        const newSequence = [...prev, event.code];
        if (newSequence.length > SECRET_THEME_CODE.length) {
          newSequence.shift();
        }
        
        // Check if secret theme code is complete
        if (newSequence.join(',') === SECRET_THEME_CODE.join(',')) {
          triggerSecretTheme();
        }
        
        return newSequence;
      });

      // Handle Deactivate Theme Code
      setDeactivateThemeSequence(prev => {
        const newSequence = [...prev, event.code];
        if (newSequence.length > DEACTIVATE_THEME_CODE.length) {
          newSequence.shift();
        }
        
        // Check if deactivate theme code is complete
        if (newSequence.join(',') === DEACTIVATE_THEME_CODE.join(',')) {
          deactivateSecretTheme();
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerEasterEgg = () => {
    if (easterEggTriggered) return;
    
    setEasterEggTriggered(true);
    
    // Dispatch custom event to activate effects
    window.dispatchEvent(new CustomEvent('easter-egg-activated'));
    
    // Create a cool notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-xl font-bold animate-pulse';
    notification.innerHTML = '🎉 EASTER EGG FOUND! 🎉<br><span class="text-sm">You discovered the secret!</span>';
    document.body.appendChild(notification);
    
    // Add screen shake effect
    document.body.style.animation = 'shake 0.5s ease-in-out';
    
    // Remove notification and stop shake after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      document.body.style.animation = '';
    }, 3000);
    
    // Return to normal after 10 seconds
    setTimeout(() => {
      console.log('10 seconds passed - deactivating easter egg');
      setEasterEggTriggered(false);
      window.dispatchEvent(new CustomEvent('easter-egg-deactivated'));
    }, 10000);
  };

  const triggerSecretTheme = () => {
    console.log('🎭 SECRET THEME ACTIVATED! 🎭');
    
    // Add secret theme class to body
    document.body.classList.add('secret-theme');
    
    // Create a dramatic notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black text-white px-8 py-4 rounded-lg text-xl font-bold border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)]';
    notification.innerHTML = '🎭 SECRET THEME ACTIVATED! 🎭<br><span class="text-sm">The portfolio has been transformed...</span>';
    document.body.appendChild(notification);
    
    // Add dramatic screen shake
    document.body.style.animation = 'shake 1s ease-in-out';
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      document.body.style.animation = '';
    }, 5000);
    
    // Add floating particles effect
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'fixed inset-0 pointer-events-none z-40';
    particlesContainer.id = 'secret-particles';
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-white rounded-full opacity-50';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animation = `secret-float ${3 + Math.random() * 4}s ease-in-out infinite`;
      particle.style.animationDelay = Math.random() * 2 + 's';
      particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
    
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('secret-theme-activated'));
  };

  const deactivateSecretTheme = () => {
    console.log('🎭 SECRET THEME DEACTIVATED! 🎭');
    
    // Remove secret theme class from body
    document.body.classList.remove('secret-theme');
    
    // Remove floating particles
    const particlesContainer = document.getElementById('secret-particles');
    if (particlesContainer) {
      document.body.removeChild(particlesContainer);
    }
    
    // Create a notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-bold animate-pulse';
    notification.innerHTML = '🎭 THEME RESTORED! 🎭<br><span class="text-sm">Back to normal...</span>';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
    
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('secret-theme-deactivated'));
  };

  const handleSecretFound = () => {
    console.log('Secret found! Triggering easter egg...');
    setSecretLocationFound(true);
    triggerEasterEgg();
  };

  return (
    <group>
      <Starfield />
      <Earth />
      {locations.map((location, index) => (
        <LocationPin
          key={index}
          location={location}
          radius={2.05}
          onHover={setHoveredLocation}
        />
      ))}
      {/* Secret location - invisible but clickable! */}
      <LocationPin
        location={SECRET_LOCATION}
        radius={2.05}
        onHover={setHoveredLocation}
        onSecretFound={handleSecretFound}
        isSecret={true}
        isVisible={secretLocationFound}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 5, 5]} intensity={1} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
        enablePan={false}
      />
    </group>
  );
}

const InteractiveGlobe = () => {
  const [showSecretText, setShowSecretText] = useState(false);

  useEffect(() => {
    const handleEasterEgg = () => {
      console.log('Easter egg activated - will show secret text in 3 seconds');
      // Show secret text after 3 seconds (when notification disappears)
      setTimeout(() => {
        console.log('Showing secret text');
        setShowSecretText(true);
        
        // Fallback: hide secret text after 7 more seconds (total 10 seconds)
        setTimeout(() => {
          console.log('Fallback: hiding secret text after 10 seconds');
          setShowSecretText(false);
        }, 7000);
      }, 3000);
    };
    
    const handleEasterEggDeactivated = () => {
      console.log('Easter egg deactivated - hiding secret text');
      setShowSecretText(false);
    };

    window.addEventListener('easter-egg-activated', handleEasterEgg);
    window.addEventListener('easter-egg-deactivated', handleEasterEggDeactivated);
    
    return () => {
      window.removeEventListener('easter-egg-activated', handleEasterEgg);
      window.removeEventListener('easter-egg-deactivated', handleEasterEggDeactivated);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="w-full h-full"
      >
        <Globe />
      </Canvas>
      
      {/* Secret text that appears after easter egg is found */}
      {showSecretText && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold opacity-30 pointer-events-none transition-opacity duration-1000">
          🎯 You found the secret! 🎯
        </div>
      )}
      
      {/* Hidden hint - only visible if you inspect the page */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity duration-1000">
        Hint: Zoom in and look for a red dot near Seattle...<br/>
        <span className="text-xs opacity-50">💡 Try typing "SECRET" for something special...</span>
      </div>
    </div>
  );
};

export default InteractiveGlobe;
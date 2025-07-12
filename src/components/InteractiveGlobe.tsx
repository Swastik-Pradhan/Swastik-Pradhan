import { useRef, useState, useMemo } from 'react';
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
}

function LocationPin({ location, radius, onHover }: PinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = useMemo(() => 
    latLonToVector3(location.lat, location.lon, radius), 
    [location.lat, location.lon, radius]
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHover(location);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial 
        color={location.color || "#ff5733"}
        transparent
        opacity={hovered ? 0.9 : 0.7}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
            {location.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

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
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
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
      <pointsMaterial size={0.05} color="#ffffff" opacity={0.8} transparent />
    </points>
  );
}

function Globe() {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);

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
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 5, 5]} intensity={1} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={15}
        enablePan={false}
      />
    </group>
  );
}

const InteractiveGlobe = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="w-full h-full"
      >
        <Globe />
      </Canvas>
    </div>
  );
};

export default InteractiveGlobe;
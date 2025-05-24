
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface TechOrbProps {
  position: [number, number, number];
  name: string;
  color: string;
}

const TechOrb = ({ position, name, color }: TechOrbProps) => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

const TechStackSection = () => {
  const technologies = [
    { name: 'React', position: [2, 1, 0] as [number, number, number], color: '#61dafb' },
    { name: 'Python', position: [-2, 1, 0] as [number, number, number], color: '#3776ab' },
    { name: 'JavaScript', position: [0, 2, 1] as [number, number, number], color: '#f7df1e' },
    { name: 'Node.js', position: [1, -1, 1] as [number, number, number], color: '#339933' },
    { name: 'Tableau', position: [-1, -1, -1] as [number, number, number], color: '#e97627' },
    { name: 'MongoDB', position: [0, 0, -2] as [number, number, number], color: '#47a248' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 glow-text">
          Tech <span className="text-neon-blue">Stack</span>
        </h2>
        
        <div className="h-96 mb-12">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, -10, -10]} color="#8b5cf6" />
            
            {technologies.map((tech, index) => (
              <TechOrb
                key={index}
                position={tech.position}
                name={tech.name}
                color={tech.color}
              />
            ))}
            
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-card text-center">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-3"
                style={{ backgroundColor: tech.color }}
              ></div>
              <h3 className="font-semibold text-neon-blue">{tech.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;

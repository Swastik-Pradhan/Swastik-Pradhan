import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const EarthGlobe = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    controls?: any;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    // Load OrbitControls
    const loadOrbitControls = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      script.onload = initializeScene;
      document.head.appendChild(script);
    };

    const initializeScene = () => {
      if (!mountRef.current) return;

      // --- SCENE SETUP ---
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setSize(800, 600);
      mountRef.current.appendChild(renderer.domElement);

      // --- LIGHTING ---
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      const textureLoader = new THREE.TextureLoader();

      // --- STARFIELD ---
      const starGeometry = new THREE.SphereGeometry(200, 64, 64);
      const starMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/starry-sky.jpg'),
        side: THREE.BackSide
      });
      const starfield = new THREE.Mesh(starGeometry, starMaterial);
      scene.add(starfield);

      // --- EARTH ---
      const earthRadius = 5;
      const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
      const placeholderMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4d96ff, 
        transparent: true, 
        opacity: 0.8 
      });
      const earth = new THREE.Mesh(earthGeometry, placeholderMaterial);
      scene.add(earth);

      // Load the Earth texture asynchronously
      textureLoader.load(
        'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
        (texture) => {
          console.log('Earth texture loaded successfully.');
          const earthMaterial = new THREE.MeshPhongMaterial({ map: texture });
          earth.material = earthMaterial;
          earth.material.needsUpdate = true;
        },
        undefined,
        (error) => {
          console.error('An error occurred while loading the Earth texture.', error);
        }
      );

      // --- LOCATIONS & PINS ---
      const locations = [
        { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
        { name: "London, UK", lat: 51.5074, lon: -0.1278 },
        { name: "Tokyo, Japan", lat: 35.6895, lon: 139.6917 },
        { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
        { name: "Cairo, Egypt", lat: 30.0444, lon: 31.2357 },
        { name: "Phagwara, India (LPU)", lat: 31.2338, lon: 75.7722 },
        { name: "Peddapuram, India", lat: 17.0833, lon: 82.1167 }
      ];

      const pinGroup = new THREE.Group();
      earth.add(pinGroup);

      function latLonToVector3(lat: number, lon: number, radius: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return new THREE.Vector3(x, y, z);
      }

      locations.forEach(location => {
        const pinGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        const position = latLonToVector3(location.lat, location.lon, earthRadius);
        pin.position.copy(position);
        pin.userData = { name: location.name };
        pinGroup.add(pin);
      });

      // --- CAMERA & CONTROLS ---
      camera.position.z = 15;
      const controls = new (THREE as any).OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 7;
      controls.maxDistance = 50;

      // --- RAYCASTING FOR INTERACTIVITY ---
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let intersected: THREE.Object3D | null = null;

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.display = 'none';
      tooltip.style.background = 'rgba(0,0,0,0.7)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '5px 10px';
      tooltip.style.borderRadius = '5px';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.zIndex = '1000';
      document.body.appendChild(tooltip);

      function onMouseMove(event: MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update tooltip position
        tooltip.style.left = (event.clientX + 10) + 'px';
        tooltip.style.top = (event.clientY - 20) + 'px';
      }
      renderer.domElement.addEventListener('mousemove', onMouseMove, false);

      // --- ANIMATION LOOP ---
      function animate() {
        const animationId = requestAnimationFrame(animate);
        sceneRef.current.animationId = animationId;
        
        controls.update();
        earth.rotation.y += 0.0005;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinGroup.children);

        if (intersects.length > 0) {
          if (intersected !== intersects[0].object) {
            intersected = intersects[0].object;
            tooltip.style.display = 'block';
            tooltip.textContent = (intersected as any).userData.name;
          }
          // Tooltip position is handled in onMouseMove
        } else {
          if (intersected) {
            tooltip.style.display = 'none';
          }
          intersected = null;
        }

        renderer.render(scene, camera);
      }

      // --- RESIZE HANDLER ---
      const handleResize = () => {
        const width = mountRef.current?.clientWidth || 800;
        const height = mountRef.current?.clientHeight || 600;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // Store references for cleanup
      sceneRef.current = {
        scene,
        camera,
        renderer,
        controls,
      };

      animate();

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        document.body.removeChild(tooltip);
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    loadOrbitControls();

    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg border border-gray-600 max-w-xs z-10">
        <h3 className="text-lg font-bold text-neon-blue mb-2">My Journey</h3>
        <p className="text-sm text-gray-300">Hover over the pins to see locations. Click and drag to rotate the globe.</p>
      </div>
      <div 
        ref={mountRef} 
        className="w-full h-full flex items-center justify-center"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default EarthGlobe;
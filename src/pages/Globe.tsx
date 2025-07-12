import { useEffect, useRef, useState } from 'react';
import FloatingParticles from '@/components/FloatingParticles';
import Navigation from '@/components/Navigation';

const Globe = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Load Three.js from CDN
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      script2.onload = () => {
        initGlobe();
      };
      document.head.appendChild(script2);
    };
    document.head.appendChild(script1);

    function initGlobe() {
      const THREE = (window as any).THREE;
      if (!THREE) return;

      // --- BASIC SETUP ---
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current!.appendChild(renderer.domElement);

      // --- LIGHTING ---
      scene.add(new THREE.AmbientLight(0xcccccc, 0.5));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 5, 10);
      scene.add(directionalLight);
      
      const textureLoader = new THREE.TextureLoader();

      // --- BACKGROUND: STARFIELD ---
      const starGeometry = new THREE.SphereGeometry(1000, 64, 64);
      const starMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/starry-sky.jpg'),
        side: THREE.BackSide
      });
      scene.add(new THREE.Mesh(starGeometry, starMaterial));

      // --- EARTH GROUP (for rotation) ---
      const earthGroup = new THREE.Group();
      scene.add(earthGroup);

      // --- EARTH ---
      const earthRadius = 5;
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        specularMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
        bumpMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.05,
      });
      const earth = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 64, 64), earthMaterial);
      earthGroup.add(earth);

      // --- CLOUDS ---
      const cloudMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_2048.png'),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const clouds = new THREE.Mesh(new THREE.SphereGeometry(earthRadius + 0.05, 64, 64), cloudMaterial);
      earthGroup.add(clouds);

      // --- ATMOSPHERE GLOW ---
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });
      const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(earthRadius * 1.04, 64, 64), atmosphereMaterial);
      earthGroup.add(atmosphere);

      // --- MOON ---
      const moonOrbit = new THREE.Group();
      moonOrbit.rotation.x = 0.1; // Slight orbital tilt
      scene.add(moonOrbit);

      const moonRadius = 0.5;
      const moonDistance = 20;
      const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg')
      });
      const moon = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 32, 32), moonMaterial);
      moon.position.set(moonDistance, 0, 0);
      moonOrbit.add(moon);

      // --- LOCATIONS & PINS ---
      const locations = [
        { name: "Lovely Professional University", lat: 31.2554, lon: 75.7049 },
        { name: "Sri Prakash Synergy School", lat: 17.0760, lon: 82.2260 }
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

      function create3DPin() {
        const pinHeight = 0.4;
        const pinRadius = 0.05;
        const pinMaterial = new THREE.MeshPhongMaterial({ color: 0xE64A19, shininess: 80 });

        const pinContainer = new THREE.Group();

        // The main body of the pin
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(pinRadius * 0.6, pinRadius, pinHeight * 0.7, 16),
          pinMaterial
        );
        body.position.y = pinHeight * 0.35;
        pinContainer.add(body);
        
        // The head of the pin
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(pinRadius * 1.5, 16, 16),
          pinMaterial
        );
        head.position.y = pinHeight * 0.7 + pinRadius * 1.5;
        pinContainer.add(head);

        // Position the whole pin so its tip is at the origin
        pinContainer.position.y = -head.position.y;
        
        return pinContainer;
      }

      locations.forEach(loc => {
        const pin = create3DPin();
        const position = latLonToVector3(loc.lat, loc.lon, earthRadius);
        pin.position.copy(position);
        pin.lookAt(position.clone().multiplyScalar(1.1)); // Orient the pin to stand up straight
        pin.userData.name = loc.name;
        pin.userData.lat = loc.lat;
        pin.userData.lon = loc.lon;
        pinGroup.add(pin);
      });

      // --- CAMERA & CONTROLS ---
      camera.position.z = 30;
      const controls = new (window as any).THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 6;
      controls.maxDistance = 100;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.1;

      // --- INTERACTIVITY (CLICK, HOVER) ---
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let intersected: any = null;

      function onMouseMove(event: MouseEvent) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        setTooltip(prev => ({
          ...prev,
          x: event.clientX + 15,
          y: event.clientY
        }));
      }

      function onClick(event: MouseEvent) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinGroup.children, true);
        if (intersects.length > 0) {
          let clickedPin = intersects[0].object;
          while (clickedPin.parent && !clickedPin.userData.lat) {
            clickedPin = clickedPin.parent;
          }
          
          if (clickedPin.userData.lat && clickedPin.userData.lon) {
            const { lat, lon } = clickedPin.userData;
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
            window.open(mapUrl, '_blank');
          }
        }
      }
      
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('click', onClick, false);

      // --- ANIMATION LOOP ---
      const clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        controls.update();
        clouds.rotation.y += 0.05 * delta;
        earthGroup.rotation.y += (controls.autoRotate ? 0.02 * delta : 0);
        moonOrbit.rotation.y += 0.2 * delta;
        moon.rotation.y += 0.1 * delta;

        // Pin hover effect
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinGroup.children, true);
        if (intersects.length > 0) {
          let parentObject = intersects[0].object;
          while (parentObject.parent && !parentObject.userData.name) {
            parentObject = parentObject.parent;
          }

          if (intersected !== parentObject) {
            if (intersected) intersected.scale.set(1, 1, 1);
            intersected = parentObject;
            intersected.scale.set(1.4, 1.4, 1.4);
            setTooltip({ show: true, text: intersected.userData.name, x: tooltip.x, y: tooltip.y });
          }
        } else {
          if (intersected) {
            intersected.scale.set(1, 1, 1);
            setTooltip(prev => ({ ...prev, show: false }));
          }
          intersected = null;
        }

        renderer.render(scene, camera);
      }

      // --- RESIZE HANDLER ---
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize, false);

      animate();

      // Store cleanup function
      (window as any).globeCleanup = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('click', onClick);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }

    // Cleanup
    return () => {
      if ((window as any).globeCleanup) {
        (window as any).globeCleanup();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <Navigation />
      
      {/* Tooltip */}
      {tooltip.show && (
        <div 
          className="fixed z-50 bg-black/80 text-white px-3 py-2 rounded-md text-sm pointer-events-none"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y,
            transform: 'translateY(-50%)'
          }}
        >
          {tooltip.text}
        </div>
      )}
      
      {/* Globe Container */}
      <div 
        ref={mountRef} 
        className="w-full h-screen"
      />
    </div>
  );
};

export default Globe; 
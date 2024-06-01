import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

// ---------------------------------------
// Initialize pane
// ---------------------------------------
const pane = new Pane();

// ---------------------------------------
// Initialize the scene
// ---------------------------------------
const scene = new THREE.Scene();

// ---------------------------------------
// Add textures
// ---------------------------------------
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('/textures/2k_sun.jpg');
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/textures/2k_mars.jpg');
const jupiterTexture = textureLoader.load('/textures/2k_jupiter.jpg');
const saturnTexture = textureLoader.load('/textures/2k_saturn.jpg');
const saturnRingTexture = textureLoader.load('/textures/saturn_ring_v2.png');
const uranusTexture = textureLoader.load('/textures/2k_uranus.jpg');
const neptuneTexture = textureLoader.load('/textures/2k_neptune.jpg');
const moonTexture = textureLoader.load('/textures/2k_moon.jpg');

sunTexture.colorSpace = THREE.SRGBColorSpace;
mercuryTexture.colorSpace = THREE.SRGBColorSpace;
venusTexture.colorSpace = THREE.SRGBColorSpace;
earthTexture.colorSpace = THREE.SRGBColorSpace;
marsTexture.colorSpace = THREE.SRGBColorSpace;
jupiterTexture.colorSpace = THREE.SRGBColorSpace;
saturnTexture.colorSpace = THREE.SRGBColorSpace;
saturnRingTexture.colorSpace = THREE.SRGBColorSpace;
uranusTexture.colorSpace = THREE.SRGBColorSpace;
neptuneTexture.colorSpace = THREE.SRGBColorSpace;
moonTexture.colorSpace = THREE.SRGBColorSpace;

const cubeTextureLoader = new THREE.CubeTextureLoader();
const galaxyTexture = cubeTextureLoader
            .setPath('/textures/cubeMaps/')
            .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
galaxyTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = galaxyTexture;

// ---------------------------------------
// Add materials
// ---------------------------------------
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturnRingMaterial = new THREE.MeshStandardMaterial({ 
  map: saturnRingTexture,
  side: THREE.DoubleSide 
});
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

// ---------------------------------------
// Add objects
// ---------------------------------------
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  // Inner planets
  {
    name: 'Mercury',
    radius: 0.5,
    distance: 8,
    speed: 1.607,
    material: mercuryMaterial,
  },
  {
    name: 'Venus',
    radius: 0.9,
    distance: 14,
    speed: 1.174,
    material: venusMaterial,
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 1,
    material: earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: 0.27,
        distance: 2,
        speed: 0.0343,
      }
    ],
  },
  {
    name: 'Mars',
    radius: 0.57,
    distance: 30,
    speed: 0.802,
    material: marsMaterial,
  },
  // Outer planets
  {
    name: 'Jupiter',
    radius: 3,
    distance: 40,
    speed: 0.434,
    material: jupiterMaterial,
  },
  {
    name: 'Saturn',
    radius: 3.5,
    distance: 60,
    speed: 0.323,
    material: saturnMaterial,
    ring: {
      innerRadius: 1.2,
      outerRadius: 1.7,
      material: saturnRingMaterial
    }
  },
  {
    name: 'Uranus',
    radius: 2 ,
    distance: 75,
    speed: 0.228,
    material: uranusMaterial,
  },
  {
    name: 'Neptune',
    radius: 1.7,
    distance: 95,
    speed: 0.182,
    material: neptuneMaterial,
  },
];

// Automate the generation of planet meshes
const createPlanet = (planet) => {
  // Create planet mesh
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  
  // Set planet scale
  planetMesh.scale.setScalar(planet.radius);

  // Set planet position
  planetMesh.position.x = planet.distance;

  return planetMesh;
};

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};

const planetMeshes = planets.map(planet => {
  // Create planet mesh
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);
  
  if(planet.moons) {
    // Loop through each moon and create the moon
    planet.moons.forEach(moon => {
      const moonMesh = createMoon(moon);
      planetMesh.add(moonMesh); 
    });
  }
  
  if(planet.ring) {
    const ringGeometry = new THREE.RingGeometry(planet['ring'].innerRadius, planet['ring'].outerRadius);
    const ringMesh = new THREE.Mesh(ringGeometry, planet['ring'].material);
    ringMesh.rotation.x = 0.35 * Math.PI;
    planetMesh.add(ringMesh);
  }

  return planetMesh;
});

// ---------------------------------------
// Add lights
// ---------------------------------------
// Illuminate the scene
const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

// Simulate sunlight
const pointLight = new THREE.PointLight(0xffffff, 4500, 350);
scene.add(pointLight);

// ---------------------------------------
// Initialize the camera
// ---------------------------------------
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 5;
camera.position.z = 100;

// ---------------------------------------
// Initialize the renderer
// ---------------------------------------
const canvas = document.querySelector('canvas.threejs');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ---------------------------------------
// Add controls
// ---------------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 15;
controls.maxDistance = 400;

// ---------------------------------------
// Add resize listener
// ---------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------
// Animate rotation and render the scene
// ---------------------------------------
const renderloop = () => {

  sun.rotation.y += 0.001

  planetMeshes.forEach((planet, planetIndex) => {
    // planet
    planet.rotation.y += 0.01 * planets[planetIndex].speed;
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance;

    // moon 
    planet.children.forEach((child, childIndex) => {
      // if child is moon
      if (child['geometry'].type === 'SphereGeometry') {
        child.rotation.y += 0.5 * planets[planetIndex].moons[childIndex].speed;
        child.position.x = Math.sin(child.rotation.y) * planets[planetIndex].moons[childIndex].distance;
        child.position.z = Math.cos(child.rotation.y) * planets[planetIndex].moons[childIndex].distance;

      }
    });

  });

  window.requestAnimationFrame(renderloop);
  controls.update();
  renderer.render(scene, camera);
}

renderloop();
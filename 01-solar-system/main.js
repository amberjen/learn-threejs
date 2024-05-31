import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

// ----------------------------------
// Initialize pane
// ----------------------------------
const pane = new Pane();

// ----------------------------------
// Initialize the scene
// ----------------------------------
const scene = new THREE.Scene();

// ----------------------------------
// Add textures
// ----------------------------------
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('/textures/2k_sun.jpg');
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('/textures/2k_venus.jpg');
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/textures/2k_mars.jpg');
const jupiterTexture = textureLoader.load('/textures/2k_jupiter.jpg');
const saturnTexture = textureLoader.load('/textures/2k_saturn.jpg');
const uranusTexture = textureLoader.load('/textures/2k_uranus.jpg');
const neptuneTexture = textureLoader.load('/textures/2k_neptune.jpg');
const moonTexture = textureLoader.load('/textures/2k_moon.jpg');

// ----------------------------------
// Add materials
// ----------------------------------
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

// ----------------------------------
// Add objects
// ----------------------------------
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  // Inner planets
  {
    name: 'Mercury',
    radius: 0.38,
    distance: 8,
    speed: 1.607,
    material: mercuryMaterial,
    moons: []
  },
  {
    name: 'Venus',
    radius: 0.95,
    distance: 14,
    speed: 1.174,
    material: venusMaterial,
    moons: []
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
        distance: 0.0514,
        speed: 0.0343,
      }
    ]
  },
  {
    name: 'Mars',
    radius: 0.53,
    distance: 30,
    speed: 0.802,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 2.12,
        distance: 0.001254,
        speed: 0.0717,
      },
      {
        name: "Deimos",
        radius: 1.18,
        distance: 0.00314,
        speed: 0.0454,
      },
    ]
  },
  // Outer planets
  {
    name: 'Jupiter',
    radius: 10.97,
    distance: 104,
    speed: 0.434,
    material: jupiterMaterial,
    moons: [
      // {
      //   name: "Ganymede",
      //   radius: 0.41,
      //   distance: 0,
      //   speed: 0,
      // },
      // {
      //   name: "Callisto",
      //   radius: 0.38,
      //   distance: 0,
      //   speed: 0,
      // },
      // {
      //   name: "Io",
      //   radius: 0.29,
      //   distance: 0,
      //   speed: 0,
      // },
      // {
      //   name: "Europa",
      //   radius: 0.25,
      //   distance: 0,
      //   speed: 0,
      // },
    ]
  },
  {
    name: 'Saturn',
    radius: 9.14,
    distance: 190,
    speed: 0.323,
    material: saturnMaterial,
    moons: [
      // {
      //   name: "Titan",
      //   radius: 0.4,
      //   distance: 0,
      //   speed: 0,
      // },
    ]
  },
  {
    name: 'Uranus',
    radius: 3.98,
    distance: 384,
    speed: 0.228,
    material: uranusMaterial,
    moons: []
  },
  {
    name: 'Neptune',
    radius: 3.87,
    distance: 601,
    speed: 0.182,
    material: neptuneMaterial,
    moons: [
      // {
      //   name: "Triton",
      //   radius: 0.21,
      //   distance: 0,
      //   speed: 0,
      // },
    ]
  },
];


// ----------------------------------
// Initialize the camera
// ----------------------------------
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);

camera.position.y = 5;
camera.position.z = 100;

// ----------------------------------
// Initialize the renderer
// ----------------------------------
const canvas = document.querySelector('canvas.threejs');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ----------------------------------
// Add controls
// ----------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 200;

// ----------------------------------
// Add resize listener
// ----------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----------------------------------
// Render the scene
// ----------------------------------
const renderloop = () => {

  window.requestAnimationFrame(renderloop);
  controls.update();
  renderer.render(scene, camera);
}

renderloop();
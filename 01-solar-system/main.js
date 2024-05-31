import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

// -----------------------------------------
// Initialize pane
// -----------------------------------------
const pane = new Pane();

// -----------------------------------------
// Initialize the scene
// -----------------------------------------
const scene = new THREE.Scene();

// -----------------------------------------
// Add objects
// -----------------------------------------
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Sun
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 'yellow'
});
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

// Earth
const earthDistance = 10;
const earthMaterial = new THREE.MeshBasicMaterial({
  color: 'blue'
});
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.position.x = earthDistance;
scene.add(earth);

// Moon
const moonDistance = 2;
const moonMaterial = new THREE.MeshBasicMaterial({
  color: 'wheat'
});
const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.setScalar(0.3);
moon.position.x = moonDistance;
earth.add(moon);


// -----------------------------------------
// Initialize the camera
// -----------------------------------------
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);

camera.position.y = 5;
camera.position.z = 100;

// -----------------------------------------
// Initialize the renderer
// -----------------------------------------
const canvas = document.querySelector('canvas.threejs');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// -----------------------------------------
// Add controls
// -----------------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 200;

// -----------------------------------------
// Add resize listener
// -----------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------------------------
// Render the scene
// -----------------------------------------

// Initialize the clock
const clock = new THREE.Clock();

const renderloop = () => {
  
  const elapsedTIme = clock.getElapsedTime();
  
  // Add orbit animation
  earth.rotation.y += 0.01;
  earth.position.x = Math.sin(elapsedTIme) * earthDistance;
  earth.position.z = Math.cos(elapsedTIme) * earthDistance;

  moon.position.x = Math.sin(elapsedTIme) * moonDistance;
  moon.position.z = Math.cos(elapsedTIme) * moonDistance;

  window.requestAnimationFrame(renderloop);
  controls.update();
  renderer.render(scene, camera);
}

renderloop();
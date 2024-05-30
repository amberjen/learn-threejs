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
const earthMaterial = new THREE.MeshBasicMaterial({
  color: 'blue'
});
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.position.x = 10;
scene.add(earth);

// Moon
const moonMaterial = new THREE.MeshBasicMaterial({
  color: 'wheat'
});
const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.setScalar(0.3);
moon.position.x = 2;
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
// Render the scene (i.e. animate)
// -----------------------------------------
const renderloop = () => {
  window.requestAnimationFrame(renderloop);
  controls.update();
  renderer.render(scene, camera);
}

renderloop();
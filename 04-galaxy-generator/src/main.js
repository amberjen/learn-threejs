import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import GUI from 'lil-gui';

// ----------------------------------
// Debug
// ----------------------------------
const gui = new GUI();

// ----------------------------------
// Canvas
// ----------------------------------
const canvas = document.querySelector('canvas.webgl');

// ----------------------------------
// Scene
// ----------------------------------
const scene = new THREE.Scene();

// ----------------------------------
// Galaxy
// ----------------------------------
const params = {
  count: 1000, // Number of particles
  size: 0.02
};

const galaxyGenerator = () => {

  // Galaxy Geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * 3); // Each particle has 3 coords: x, y, z

  for(let i=0; i<params.count; i++) {
    const i3 = i * 3;

    positions[i3 + 0] = (Math.random() - 0.5) * 3; // x, random positions in [-1.5, 1.5]
    positions[i3 + 1] = (Math.random() - 0.5) * 3; // y
    positions[i3 + 2] = (Math.random() - 0.5) * 3; // z
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Galaxy Material
  const material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true, // Particle size decreases with distance
    depthWrite: false, // Disable writing to the depth buffer to prevent sorting issues with transparent particles
    blending: THREE.AdditiveBlending // Create a glowing effect
  });

  const points = new THREE.Points(geometry, material);

  scene.add(points);
};

galaxyGenerator();

// ----------------------------------
// Helpers
// ----------------------------------
const axesHelper =  new THREE.AxesHelper(2);
scene.add(axesHelper);

// ----------------------------------
// Textures
// ----------------------------------
const textureLoader = new THREE.TextureLoader();

// ----------------------------------
// Objects
// ----------------------------------
// const box = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshStandardMaterial({ roughness: 0.7 })
// );
// scene.add(box);

// ----------------------------------
// Lights
// ----------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 1, 7);

scene.add(ambientLight, directionalLight);


// ----------------------------------
// Sizes
// ----------------------------------
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// ----------------------------------
// Camera
// ----------------------------------
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  200
);
camera.position.x = 7;
camera.position.y = 3;
camera.position.z = 15;
scene.add(camera);

// ----------------------------------
// Controls
// ----------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 0;
controls.maxDistance = 100;

// ----------------------------------
// Renderer
// ----------------------------------
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// ----------------------------------
// Resize
// ----------------------------------
window.addEventListener('resize', () => {

  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

// ----------------------------------
// Animation
// ----------------------------------
const timer = new Timer();

const animate = () => {

  // Update timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update objects
  

  // Update controls
  controls.update();

  // Do a new render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);

}

animate();
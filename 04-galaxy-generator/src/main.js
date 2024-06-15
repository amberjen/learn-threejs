import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import GUI from 'lil-gui';

// ----------------------------------
// Debug
// ----------------------------------
const gui = new GUI({ width: 320 });

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
  count: 100000,
  size: 0.016,
  radius: 5.71,
  branches: 5,
  spin: -1.652,
  randomness: 0.29,
  randomnessPower: 3.419,
  insideColor: 0xba24ff,
  outsideColor: 0x05133d
};

let geometry = null;
let material = null;
let points = null

const generateGalaxy = () => {

  // Destroy old galaxy
  if(points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  // Galaxy Geometry
  geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(params.count * 3); // Each particle has 3 coords: x, y, z
  const colors = new Float32Array(params.count * 3); // r, g, b

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);
  

  for(let i=0; i<params.count; i++) {

    const i3 = i * 3;

    // Positions
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = 0 + randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Colors
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Galaxy Material
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true, // Particle size decreases with distance
    depthWrite: false, // Disable writing to the depth buffer to prevent sorting issues with transparent particles
    blending: THREE.AdditiveBlending, // Create a glowing effect,
    vertexColors: true
  });

  points = new THREE.Points(geometry, material);

  scene.add(points);
};

generateGalaxy();

// Debug Panel
gui.add(params, 'count')
  .min(100).max(100000).step(100)
  .onFinishChange(generateGalaxy);

gui.add(params, 'size')
  .min(0.001).max(0.1).step(0.001)
  .onFinishChange(generateGalaxy);

gui.add(params, 'radius')
  .min(0.01).max(20).step(0.01)
  .onFinishChange(generateGalaxy);

gui.add(params, 'branches')
  .min(2).max(20).step(1)
  .onFinishChange(generateGalaxy);

gui.add(params, 'spin')
  .min(-5).max(5).step(0.001)
  .onFinishChange(generateGalaxy);

gui.add(params, 'randomness')
  .min(0).max(2).step(0.001)
  .onFinishChange(generateGalaxy);

gui.add(params, 'randomnessPower')
  .min(1).max(10).step(0.001)
  .onFinishChange(generateGalaxy);

gui.addColor(params, 'insideColor')
  .onFinishChange(generateGalaxy);

gui.addColor(params, 'outsideColor')
  .onFinishChange(generateGalaxy);

// ----------------------------------
// Helpers
// ----------------------------------
// const axesHelper =  new THREE.AxesHelper(2);
// scene.add(axesHelper);

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
  0.1,
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
controls.maxDistance = 50;

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
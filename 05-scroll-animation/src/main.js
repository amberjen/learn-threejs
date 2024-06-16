import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js';
import gsap from 'gsap';
// import GUI from 'lil-gui';

// ----------------------------------
// Debug Panel
// ----------------------------------
// const gui = new GUI();

// ----------------------------------
// Canvas
// ----------------------------------
const canvas = document.querySelector('canvas.webgl');

// ----------------------------------
// Scene
// ----------------------------------
const scene = new THREE.Scene();

// ----------------------------------
// Helpers
// ----------------------------------
// const axesHelper =  new THREE.AxesHelper(2);
// scene.add(axesHelper);

// ----------------------------------
// Textures
// ----------------------------------
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

// ----------------------------------
// Objects
// ----------------------------------

const params = {
  color: 0x7116f8
}

// Debug
// gui.addColor(params, 'color')
//   .onChange(() => {
//     toonMaterial.color.set(params.color);
//     particleMaterial.color.set(params.color);
//   });

// Material
const toonMaterial = new THREE.MeshToonMaterial({
  color: params.color,
  gradientMap: gradientTexture
});

// Meshes
const objectDistance = 6; // distance between objects

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 64),
  toonMaterial
);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(1.1, 2.1, 32, 1),
  toonMaterial
);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.32, 104, 16),
  toonMaterial
);

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.85, 0.85, 1.8, 48, 1),
  toonMaterial
);

torus.position.y = -(objectDistance * 0);
cone.position.y = -(objectDistance * 1);
torusKnot.position.y = -(objectDistance * 2);
cylinder.position.y = -(objectDistance * 3);

cone.position.x = -1.75;
torusKnot.position.x = 1.75;

scene.add(torus, cone, torusKnot, cylinder);

const objectsArray = [torus, cone, torusKnot, cylinder];

// ----------------------------------
// Particles
// ----------------------------------
// Geometry
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 700;
const positions = new Float32Array(particleCount * 3); // Each particle has 3 coords: x, y, z

for(let i=0; i< particleCount; i++) {

  // Random positions for particles within a range
  
  // x
  positions[i * 3 + 0] =( Math.random() - 0.5) * 10;
  
  // y (vertical)
  positions[i * 3 + 1] = (objectDistance * 0.5) - (Math.random() * objectDistance * objectsArray.length); 
  
  // z (depth)
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10; 

}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material
const particleMaterial = new THREE.PointsMaterial({
  size: 0.03,
  color: params.color,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// ----------------------------------
// Light
// ----------------------------------
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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

// Create a camera group for better parallax control
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 7;

cameraGroup.add(camera);

// ----------------------------------
// Renderer
// ----------------------------------
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
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
// Scroll
// ----------------------------------
let scrollY = window.scrollY; // Current scroll position
let currentSection = 0;

window.addEventListener('scroll', ()=> {
  
  // Update scroll position
  scrollY = window.scrollY; 

  // Calculate the new section based on scroll position
  const newSection = Math.round(scrollY / sizes.height); 
  
  if(newSection !== currentSection) {
    
    // Update the current section
    currentSection = newSection;
    
    // Animate rotation of the object in the current section
    gsap.to(
      objectsArray[currentSection].rotation, 
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=7',
        y: '+=3',
        z: '+=2'
      }
    )

  }
});

// ----------------------------------
// Parallax
// ----------------------------------

// Create parallax effect by listening to mouse movements

// Initialize cursor object
const cursor = {
  x: 0,
  y: 0
};

window.addEventListener('mousemove', (event) => {

  // Normalize cursor x & y position to [-0.5, 0.5]
  // 1. Retrieve cursor positions
  // 2. Normalize the value between 0 and 1 by "/ viewport width" 
  // 3. [0, 1] ---- (-0.5) ---> [-0.5, 0.5]
  cursor.x = (event.clientX / sizes.width) - 0.5;
  cursor.y = (event.clientY /  sizes.height) - 0.5;

});

// ----------------------------------
// Animation
// ----------------------------------
const timer = new Timer();

let previousTime = 0;

const animate = () => {

  // Update timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Calculate the time between current time and previous time
  // (to ensure smooth animation based on the time difference between frames)
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate objects
  objectsArray.forEach(obj => {
    obj.rotation.y += deltaTime * 0.1;
    obj.rotation.x += deltaTime * 0.14;
    // obj.rotation.z = elapsedTime * 0.17;
  })

  // Animate camera based on scroll position
  camera.position.y = -scrollY / sizes.height * objectDistance;

  // Apply parallax effect to camera group
  // Calculate target parallax positions
  const parallaxX = cursor.x * 0.5; // *0.5 to reduce the effect's intensity
  const parallaxY = -cursor.y * 0.5;

  // (parallaxX - cameraGroup.position.x) calculates the difference between
    // the target parallax position and the current camera group's x position
  // (* 100 * deltaTime) ensures a smooth transition
    // 100 => controls the speed of the transition
    // deltaTime => ensures that the transition speed is consistent regardless of the frame rate
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 100 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 100 * deltaTime;

  // Do a new render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);

}

animate();
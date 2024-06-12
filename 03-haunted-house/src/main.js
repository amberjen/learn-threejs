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
// Helpers
// ----------------------------------
const axesHelper =  new THREE.AxesHelper(12);
scene.add(axesHelper);

// ----------------------------------
// Objects
// ----------------------------------

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
  })
);
floor.rotation.x = -(Math.PI * 0.5);
scene.add(floor);

// House Container
const house = new THREE.Group();
scene.add(house);

// House Sizes
const houseSizes = {
  walls: {
    width: 4,
    height: 2.5,
    depth: 4
  },
  roof: {
    radius: 3.5,
    height: 2,
    radialSegments: 4
  },
  door: {
    width: 2,
    height: 2
  }
};

// House Component: Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    houseSizes.walls.width, 
    houseSizes.walls.height, 
    houseSizes.walls.depth),
  new THREE.MeshStandardMaterial()
);
walls.position.y += (houseSizes.walls.height / 2);
house.add(walls);

// House Component: Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(
    houseSizes.roof.radius, 
    houseSizes.roof.height,
    houseSizes.roof.radialSegments),
  new THREE.MeshStandardMaterial()
);
roof.position.y += (houseSizes.walls.height + houseSizes.roof.height / 2);
roof.rotation.y = Math.PI * 0.25; 
house.add(roof);

// House Component: Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(
    houseSizes.door.width,
    houseSizes.door.height,
  ),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 0xff0000 // TEMP:
  })
);
door.position.z = houseSizes.walls.depth / 2 + 0.01;
door.position.y = houseSizes.door.height / 2;
house.add(door);

// House Component: Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x038a32 // TEMP:
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5);
bush1.position.set(1.2, 0.2, 2.5)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.25);
bush2.position.set(1.8, 0.1, 2.3)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4);
bush3.position.set(-1.2, 0.1, 2.5)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.3);
bush4.position.set(-1.85, 0.05, 2.4)

house.add(bush1, bush2, bush3, bush4);


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
  35,
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
controls.minDistance = 4.5;
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

  // Update obejcts


  // Update controls
  controls.update();

  // Do a new render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);

}

animate();
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
// Textures
// ----------------------------------
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('floor/alpha-4.jpg');

const floorColorTexture = textureLoader.load('floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg');
const floorARMTexture = textureLoader.load('floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg');
const floorNormalTexture = textureLoader.load('floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg');
const floorDisplacementTexture = textureLoader.load('floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg');

// const floorColorTexture = textureLoader.load('floor/aerial_rocks_04_1k/aerial_rocks_04_diff_1k.jpg');
// const floorARMTexture = textureLoader.load('floor/aerial_rocks_04_1k/aerial_rocks_04_arm_1k.jpg');
// const floorNormalTexture = textureLoader.load('floor/aerial_rocks_04_1k/aerial_rocks_04_nor_gl_1k.jpg');
// const floorDisplacementTexture = textureLoader.load('floor/aerial_rocks_04_1k/aerial_rocks_04_disp_1k.jpg');

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
// const wallColorTexture = textureLoader.load('wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg');
// const wallARMTexture = textureLoader.load('wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg');
// const wallNormalTexture = textureLoader.load('wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg');

const wallColorTexture = textureLoader.load('wall/factory_brick_1k/factory_brick_diff_1k.jpg');
const wallARMTexture = textureLoader.load('wall/factory_brick_1k/factory_brick_arm_1k.jpg');
const wallNormalTexture = textureLoader.load('wall/factory_brick_1k/factory_brick_nor_gl_1k.jpg');

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load('roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg');
const roofARMTexture = textureLoader.load('roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg');
const roofNormalTexture = textureLoader.load('roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg');

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 0.75);
roofARMTexture.repeat.set(3, 0.75);
roofNormalTexture.repeat.set(3, 0.75);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load('bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg');
const bushARMTexture = textureLoader.load('bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg');
const bushNormalTexture = textureLoader.load('bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg');

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;


// ----------------------------------
// Objects
// ----------------------------------

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,

    alphaMap: floorAlphaTexture,
    transparent: true,
    
    map:floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.17
  })
);
floor.rotation.x = -(Math.PI * 0.5);
scene.add(floor);

// gui.add(floor.material, 'displacementScale')
//     .min(0).max(1).step(0.01).name('displacementScale');
// gui.add(floor.material, 'displacementBias')
//     .min(-1).max(1).step(0.01).name('displacementBias');

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
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture
  })
);
walls.position.y += (houseSizes.walls.height / 2);
house.add(walls);

// House Component: Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(
    houseSizes.roof.radius, 
    houseSizes.roof.height,
    houseSizes.roof.radialSegments),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture
  })
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
  color: 0x62a363,
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5);
bush1.position.set(1.2, 0.2, 2.5)
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.25);
bush2.position.set(1.8, 0.1, 2.3);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4);
bush3.position.set(-1.2, 0.1, 2.5);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.3);
bush4.position.set(-1.85, 0.05, 2.4);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();

for(let i=0; i<30; i++) {
  
  // Grave Coordinates
  // For placing graves around the house
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * houseSizes.walls.width;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;
  
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}



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
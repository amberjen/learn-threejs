import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { Sky } from 'three/addons/objects/Sky.js';
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
// const axesHelper =  new THREE.AxesHelper(12);
// scene.add(axesHelper);

// ----------------------------------
// Textures
// ----------------------------------
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('floor/alpha-4.jpg');

const floorColorTexture = textureLoader.load('floor/Stylized_Sand_001/Stylized_Sand_001_basecolor.jpg');
const floorAOTexture = textureLoader.load('floor/Stylized_Sand_001/Stylized_Sand_001_ambientOcclusion.jpg');
const floorRoughnessTexture = textureLoader.load('floor/Stylized_Sand_001/Stylized_Sand_001_roughness.jpg');
const floorNormalTexture = textureLoader.load('floor/Stylized_Sand_001/Stylized_Sand_001_normal.jpg');
const floorDisplacementTexture = textureLoader.load('floor/Stylized_Sand_001/Stylized_Sand_001_height.png');

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(2, 2);
floorAOTexture.repeat.set(2, 2);
floorRoughnessTexture.repeat.set(2, 2);
floorNormalTexture.repeat.set(2, 2);
floorDisplacementTexture.repeat.set(2, 2);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAOTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAOTexture.wrapT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallColorTexture = textureLoader.load('wall/Stylized_Sci-fi_Wall_001/Stylized_Sci-fi_Wall_001_basecolor.jpg');
const wallAOTexture = textureLoader.load('wall/Stylized_Sci-fi_Wall_001/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg');
const wallRoughnessexture = textureLoader.load('wall/Stylized_Sci-fi_Wall_001/Stylized_Sci-fi_Wall_001_roughness.jpg');
const wallNormalTexture = textureLoader.load('wall/Stylized_Sci-fi_Wall_001/Stylized_Sci-fi_Wall_001_normal.jpg');

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load('roof/Metal_Corrugated_010/Metal_Corrugated_010_basecolor.jpg');
const roofAOTexture = textureLoader.load('roof/Metal_Corrugated_010/Metal_Corrugated_010_ambientOcclusion.jpg');
const roofRoughnessTexture = textureLoader.load('roof/Metal_Corrugated_010/Metal_Corrugated_010_roughness.jpg');
const roofMetalnessTexture = textureLoader.load('roof/Metal_Corrugated_010/Metal_Corrugated_010_metallic.jpg');
const roofNormalTexture = textureLoader.load('roof/Metal_Corrugated_010/Metal_Corrugated_010_normal.jpg');

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

// Bush
const bushColorTexture = textureLoader.load('bush/Abstract_Organic_004/Abstract_Organic_004_basecolor.jpg');
const bushAOTexture = textureLoader.load('bush/Abstract_Organic_004/Abstract_Organic_004_ambientOcclusion.jpg');
const bushRoughnessTexture = textureLoader.load('bush/Abstract_Organic_004/Abstract_Organic_004_roughness.jpg');
const bushNormalTexture = textureLoader.load('bush/Abstract_Organic_004/Abstract_Organic_004_normal.jpg');

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushAOTexture.repeat.set(2, 1);
bushRoughnessTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushAOTexture.wrapS = THREE.RepeatWrapping;
bushRoughnessTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load('grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg');
const graveARMTexture = textureLoader.load('grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg');
const graveNormalTexture = textureLoader.load('grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg');

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door

const doorColorTexture = textureLoader.load('/door/Sci-fi_Door_001/color.jpg');
const doorAlphaTexture = textureLoader.load('door/Sci-fi_Door_001/alpha.jpg');
const doorAOTexture = textureLoader.load('/door/Sci-fi_Door_001/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/door/Sci-fi_Door_001/height.png');
const doorNormalTexture = textureLoader.load('/door/Sci-fi_Door_001/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/door/Sci-fi_Door_001/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/door/Sci-fi_Door_001/roughness.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

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
    aoMap: floorAOTexture,
    roughnessMap: floorRoughnessTexture,
    normalMap: floorNormalTexture,
    
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.35,
    displacementBias: -0.13
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
    height: 5,
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
    aoMap: wallAOTexture,
    roughnessMap: wallRoughnessexture,
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
    aoMap: roofAOTexture,
    roughnessMap: roofRoughnessTexture,
    metalnessMap: roofMetalnessTexture,
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
    100, 
    100
  ),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAOTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.0325
  })
);
door.position.z = houseSizes.walls.depth / 2 + 0.01;
door.position.y = houseSizes.door.height / 2;
door.scale.setScalar(0.95);
house.add(door);

// House Component: Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  // color: 0x62a363,
  map: bushColorTexture,
  aoMap: bushAOTexture,
  roughnessMap: bushRoughnessTexture,
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
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture
});

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

// Environemnt Lights
const ambientLight = new THREE.AmbientLight(0x86cdff, 0.25);
const directionalLight = new THREE.DirectionalLight(0x86cdff, 1);
directionalLight.position.set(2, 1, -7);
scene.add(ambientLight, directionalLight);

// Door Light
const doorLight = new THREE.PointLight(0xff7d46, 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghost Lights
const ghost1 = new THREE.PointLight(0x1450f5, 5);
const ghost2 = new THREE.PointLight(0x9016fa, 5);
const ghost3 = new THREE.PointLight(0xe37b20, 5);
scene.add(ghost1, ghost2, ghost3);


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
// Shadows
// ----------------------------------
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
roof.castShadow = true;

walls.receiveShadow = true;
floor.receiveShadow = true; 

graves.children.forEach(grave => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// Optimize Mappings
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

// ----------------------------------
// Sky
// ----------------------------------
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 0.3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.25, -0.038, -0.95);

// ----------------------------------
// Fog
// ----------------------------------
scene.fog = new THREE.FogExp2(0x08343f, 0.1);

// ----------------------------------
// Animation
// ----------------------------------
const timer = new Timer();

const animate = () => {

  // Update timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Animate ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.sin(ghost1Angle) * 4;
  ghost1.position.z = Math.cos(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45);

  const ghos21Angle = -(elapsedTime * 0.37);
  ghost2.position.x = Math.sin(ghos21Angle) * 5;
  ghost2.position.z = Math.cos(ghos21Angle) * 5;
  ghost2.position.y = Math.sin(ghos21Angle) * Math.sin(ghos21Angle * 2.34) * Math.sin(ghos21Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.21;
  ghost3.position.x = Math.sin(ghost3Angle) * 6;
  ghost3.position.z = Math.cos(ghost3Angle) * 6;
  ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45);




  // Update controls
  controls.update();

  // Do a new render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);

}

animate();
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import GUI from 'lil-gui';

// ----------------------------------
// Debug
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
// Textures
// ----------------------------------
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('textures/matcaps/3.png');

matcapTexture.colorSpace = THREE.SRGBColorSpace;

const matcapMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture
});

// ----------------------------------
// Fonts
// ----------------------------------
const fontLoader = new FontLoader();
fontLoader.load(
  'fonts/Dryouth_Regular.json',
  (font) => {
    const title = 'DIGITAL\nCREATIVE\n@AMBERJEN';

    // Text Geometry
    const textGeometry = new TextGeometry(title, {
      font: font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4
    });

    textGeometry.center();

    // Text Mesh
    const textMesh = new THREE.Mesh(textGeometry, matcapMaterial);

    scene.add(textMesh);

  }
)

// ----------------------------------
// Objects
// ----------------------------------
const torusGeometry = new THREE.TorusGeometry(0.2, 0.125, 16, 48);
const boxGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
const sphereGeometry = new THREE.SphereGeometry(0.2);
const coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);

const generateRandomObjects = (objGeometry, objMaterial, objAmount, objPosition) => {

  for(let i=0; i<objAmount; i++) {
    const objMesh = new THREE.Mesh(objGeometry, objMaterial);
  
    // Randomize position
    objMesh.position.x = (Math.random() - 0.5) * objPosition;
    objMesh.position.y = (Math.random() - 0.5) * objPosition;
    objMesh.position.z = (Math.random() - 0.5) * objPosition;
    
    // Randomize rotation
    objMesh.rotation.x = Math.random() * Math.PI;
    objMesh.rotation.y = Math.random() * Math.PI;
    // objMesh.rotation.z = Math.random() * Math.PI;
    
    // Randomize scale
    const objScale = Math.random();
    objMesh.scale.set(objScale, objScale, objScale);
  
    scene.add(objMesh);
  }

}

generateRandomObjects(torusGeometry, matcapMaterial, 55, 11);
generateRandomObjects(boxGeometry, matcapMaterial, 25, 11);
generateRandomObjects(sphereGeometry, matcapMaterial, 15, 12);
generateRandomObjects(coneGeometry, matcapMaterial, 15, 13);

// ----------------------------------
// Light
// ----------------------------------
const pointLight = new THREE.PointLight(0xffffff, 2000);
scene.add(pointLight)

// ----------------------------------
// Helpers
// ----------------------------------
// const axesHelper =  new THREE.AxesHelper(2);
// scene.add(axesHelper);

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
camera.position.z = 15;
scene.add(camera);

// ----------------------------------
// Controls
// ----------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 25;

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
const clock = new THREE.Clock();

const animate = () => {

  const elapsedTime = clock.getElapsedTime();

  // Update obejcts


  // Update controls
  controls.update();

  // Do a new render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);

}

animate();

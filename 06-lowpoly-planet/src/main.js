import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
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
// Model
// ----------------------------------
const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();

dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

let planet;

gltfLoader.load(
  '/models/lowpoly-planet.glb',
  (gltf) => {
    
    planet = gltf.scene;
    planet.scale.set(1.5, 1.5, 1.5);
    scene.add(planet);
    
    // Function to set receiveShadow to true for all meshes
    const setReceiveShadow = (object) => {
      if(object.isMesh) {

        if(object.name === 'Ocean' || object.name === 'Terrain') {
          object.receiveShadow = true;
        } else {
          object.castShadow = true;
        }

      }

      if(object.children.length > 0) {
        object.children.forEach(child => setReceiveShadow(child));
      }

    };

    // Apply receiveShadow to all meshes in the model
    setReceiveShadow(planet);
    
  },
  undefined,
  (error) => console.error(error)
);

// ----------------------------------
// Helpers
// ----------------------------------
// const axesHelper =  new THREE.AxesHelper(2);
// scene.add(axesHelper);

// ----------------------------------
// Textures
// ----------------------------------
// const textureLoader = new THREE.TextureLoader();

// ----------------------------------
// Lights
// ----------------------------------

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, .5);
scene.add(ambientLight);

// Key light
const keyLight = new THREE.DirectionalLight(0xffddcc, 3);
keyLight.position.set(3, 3, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 4096;
keyLight.shadow.mapSize.height = 4096;
keyLight.shadow.camera.near = 3;
keyLight.shadow.camera.far = 8;
keyLight.shadow.camera.left = -3;
keyLight.shadow.camera.right = 3;
keyLight.shadow.camera.top = 3;
keyLight.shadow.camera.bottom = -3;
scene.add(keyLight);

// Fill light
const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
fillLight.position.set(-5, -1, 3);
fillLight.castShadow = false;
scene.add(fillLight);

// Back light
const backLight = new THREE.DirectionalLight(0xccccff, 1.1);
backLight.position.set(0 , -1.5, -5);
backLight.castShadow = false;
scene.add(backLight);

// Light helpers
// const keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 1);
// const fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 1);
// const backLightHelper = new THREE.DirectionalLightHelper(backLight, 1);

// const keyLightCameraHelper = new THREE.CameraHelper(keyLight.shadow.camera);

// scene.add(keyLightHelper, fillLightHelper, backLightHelper, keyLightCameraHelper);


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
  50,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 6);
scene.add(camera);

// ----------------------------------
// Controls
// ----------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 50;

// ----------------------------------
// Renderer
// ----------------------------------
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true, // Allow transparency to show the CSS background
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
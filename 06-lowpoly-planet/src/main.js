import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { gsap } from 'gsap';
import GUI from 'lil-gui';
import Stats from 'stats.js';
import { inject } from '@vercel/analytics';

inject();

// ----------------------------------
// Debug
// ----------------------------------
const gui = new GUI();
gui.hide();

const stats = new Stats();
stats.showPanel(0); // FPS (higher = better)
// document.body.appendChild(stats.dom);

// ----------------------------------
// Canvas
// ----------------------------------
const canvas = document.querySelector('canvas.webgl');

// ----------------------------------
// Scene
// ----------------------------------
const scene = new THREE.Scene();

// ----------------------------------
// Loading
// ----------------------------------

// Overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uAlpha;

    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
  `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);


// ----------------------------------
// Model
// ----------------------------------
let sceneReady = false;
const tl = gsap.timeline();
const progressElement = document.querySelector('.progress');

const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {

    window.setTimeout(() => {
      tl
      .to('.loader', {
        opacity: 0
      },'+=.35')
      .to('.webgl', {
          opacity: 1,
        }, '<')
      .to(overlayMaterial.uniforms.uAlpha, {
          duration: 3,
          value: 0
        })
      .to('h1', {
          opacity: 1,
          duration: 3,
        }, '<')
      .to('h2', {
          opacity: 1,
          duration: 3,
        }, '<');
      }, 500);

      window.setTimeout(()=> {
        sceneReady = true;        
      }, 2000);
      
  },
  // Progress
  (itemUrl, itemLoaded, itemTotal) => {

    const progressRatio = (itemLoaded / itemTotal) * 100;
    progressElement.innerText = progressRatio;

  }
);
const dracoLoader = new DRACOLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

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
// Markers & Raycaster
// ----------------------------------
const raycaster = new THREE.Raycaster();

const markers = [
  {
    position: new THREE.Vector3(.8, 1.45, 1.6),
    element: document.querySelector('.marker-1')
  },
  {
    position: new THREE.Vector3(.5, 0.8, 1.5),
    element: document.querySelector('.marker-2')
  },
  {
    position: new THREE.Vector3(-.85, -.4 , 1.25),
    element: document.querySelector('.marker-3')
  },
  {
    position: new THREE.Vector3(-1.55, .5 , -1.15),
    element: document.querySelector('.marker-4')
  },
];


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
controls.maxDistance = 25;

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

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFlimic: THREE.ACESFilmicToneMapping,
});

gui.add(renderer, 'toneMappingExposure')
  .min(0).max(2).step(0.001);

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

  // --- Performance Monitor: BEGIN ----
  stats.begin();

  // Update timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update model TODO:
  if(planet) {
    // planet.rotation.y = elapsedTime * 0.05;
  }

  // Update controls
  controls.update();

  // Update markers
  if(sceneReady) {
 
    markers.forEach(marker => {
      const screenPosition = marker.position.clone();
      screenPosition.project(camera)

      raycaster.setFromCamera(screenPosition, camera);
      const interacts = raycaster.intersectObjects(scene.children, true);

      if(interacts.length === 0) {
        marker.element.classList.add('visible');
      } else {
        const intersectionDistance = interacts[0].distance;
        const markerDistance = marker.position.distanceTo(camera.position);

        if(intersectionDistance < markerDistance) {
          marker.element.classList.remove('visible');
        } else {
          marker.element.classList.add('visible');
        }
      }

      const translateX = screenPosition.x * sizes.width * 0.5;
      const translateY = -screenPosition.y * sizes.height * 0.5;
      marker.element.style.transform =`translate(${translateX}px, ${translateY}px)`;


    });

  }

  // Do a new render
  renderer.render(scene, camera);

  // --- Performance Monitor: END ----
  stats.end();

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);

}

animate();
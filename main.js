import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const addButton = document.getElementById('addTextBtn');
const textMeshes = []; // Array to store text instances

let fontLoaded = false;
let font;

const loader = new FontLoader();

loader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json', loadedFont => {
  font = loadedFont;
  fontLoaded = true;
});

addButton.addEventListener('click', () => {
  if (fontLoaded) {
    const textGeo = new TextGeometry('endlessloop', {
      font: font,
      size: 30,
      height: 10,
      curveSegments: 16
    });

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x6699cc });

    const newTextMesh = new THREE.Mesh(textGeo, textMaterial);
    scene.add(newTextMesh);

    newTextMesh.position.set(0, 0, -100); // Position the new text mesh

    textMeshes.push(newTextMesh); // Store reference in the array

    animate(); // Restart animation after adding the new text mesh
  }
});

function animate() {
  requestAnimationFrame(animate);

  textMeshes.forEach(textMesh => {
    textMesh.rotation.x += 0.005;
    textMesh.rotation.y += 0.005;

    textMesh.position.x = Math.max(-window.innerWidth * 0.375, Math.min(window.innerWidth * 0.375, textMesh.position.x));
    textMesh.position.y = Math.max(-window.innerHeight * 0.375, Math.min(window.innerHeight * 0.375, textMesh.position.y));
  });

  renderer.render(scene, camera);
}

camera.position.set(0, 0, 150);

function handleResize() {
  const { clientWidth, clientHeight } = document.documentElement;

  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', handleResize);

animate();

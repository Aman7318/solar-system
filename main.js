import * as THREE from 'three';

// 1. Scene: the container that holds everything in our 3D world
const scene = new THREE.Scene();

// 2. Camera: our point of view
const camera = new THREE.PerspectiveCamera(
  60,                                      // field of view (degrees)
  window.innerWidth / window.innerHeight,  // aspect ratio
  0.1,                                     // nearest distance we can see
  1000                                     // farthest distance we can see
);
camera.position.z = 20; // move the camera back so it can see the origin

// 3. Renderer: draws the scene as seen by the camera onto a <canvas>
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 64, 64); // radius, width segments, height segments
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc33 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
// Earth
const earthGeometry = new THREE.SphereGeometry(1, 64, 64); // radius 1, much smaller than the Sun
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2266ff });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.x = 10; // 10 units to the right of the Sun
scene.add(earth);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft light from everywhere
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 300);     // light shining outward from one spot
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
renderer.render(scene, camera);
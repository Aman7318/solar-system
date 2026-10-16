import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene: the container that holds everything in our 3D world
const scene = new THREE.Scene();

// 2. Camera: our point of view
const camera = new THREE.PerspectiveCamera(
  60,                                      // field of view (degrees)
  window.innerWidth / window.innerHeight,  // aspect ratio
  0.1,                                     // nearest distance we can see
  1000                                     // farthest distance we can see
);

camera.position.set(0, 35, 60);
camera.lookAt(0, 0, 0);

// 3. Renderer: draws the scene as seen by the camera onto a <canvas>
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 64, 64); // radius, width segments, height segments
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc33 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets: simplified sizes and distances
const planetData = [
  { name: 'Mercury', radius: 0.4, distance: 6,  color: 0xaaaaaa },
  { name: 'Venus',   radius: 0.9, distance: 9,  color: 0xe6c27a },
  { name: 'Earth',   radius: 1,   distance: 12.5, color: 0x2266ff },
  { name: 'Mars',    radius: 0.6, distance: 16, color: 0xcc4422 },
  { name: 'Jupiter', radius: 2,   distance: 22, color: 0xd9a066 },
  { name: 'Saturn',  radius: 1.7, distance: 30, color: 0xe3d087 },
  { name: 'Uranus',  radius: 1.3, distance: 38, color: 0x7fdbe0 },
  { name: 'Neptune', radius: 1.3, distance: 45, color: 0x3355cc }
];

const planets = [];

planetData.forEach((data) => {
  const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = data.distance;
  scene.add(mesh);
  planets.push({ ...data, mesh });
});
// Saturn's rings
const saturn = planets.find((p) => p.name === 'Saturn');

const ringGeometry = new THREE.RingGeometry(2.1, 2.8, 64); // inner radius, outer radius, segments
const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0xc9b27a,
  side: THREE.DoubleSide,  // visible from above and below
  transparent: true,
  opacity: 0.8
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2; // lay the ring flat, around Saturn's equator

saturn.mesh.add(ring);         // attach the ring to Saturn
saturn.mesh.rotation.z = 0.4;  // tilt Saturn (and its ring) slightly

// Orbital paths
planetData.forEach((data) => {
  const points = [];
  const segments = 128;

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;  // goes from 0 to 360 degrees
    points.push(new THREE.Vector3(
      Math.cos(angle) * data.distance,  // x
      0,                                // y (flat, same level as the planets)
      Math.sin(angle) * data.distance   // z
    ));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
  const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  scene.add(orbit);
});

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft light from everywhere
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0);   // light shining outward from one spot(color, intensity, distance, decay)
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // smooth, gliding movement
controls.minDistance = 8;       // can't zoom closer than this
controls.maxDistance = 120;     // can't zoom farther than this

// Hover labels
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const label = document.getElementById('label');
const planetMeshes = planets.map((p) => p.mesh);

window.addEventListener('mousemove', (event) => {
  // Convert the mouse position to the range -1 to +1 that Three.js expects
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes);

  if (hits.length > 0) {
    const planet = planets.find((p) => p.mesh === hits[0].object);
    label.textContent = planet.name;
    label.style.left = event.clientX + 15 + 'px';
    label.style.top = event.clientY + 15 + 'px';
    label.style.display = 'block';
    document.body.style.cursor = 'pointer';
  } else {
    label.style.display = 'none';
    document.body.style.cursor = 'default';
  }
});

// Animation loop: runs about 60 times per second
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
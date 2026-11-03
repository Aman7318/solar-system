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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

function loadTexture(file) {
  const texture = loader.load(`textures/${file}`);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 64, 64); // radius, width segments, height segments
const sunMaterial = new THREE.MeshBasicMaterial({ map: loadTexture('2k_sun.jpg') });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planetData = [
  { name: 'Mercury', radius: 0.4, distance: 6,    speed: 0.8,  spin: 0.3, texture: '2k_mercury.jpg' },
  { name: 'Venus',   radius: 0.9, distance: 9,    speed: 0.6,  spin: 0.2, texture: '2k_venus_surface.jpg' },
  { name: 'Earth',   radius: 1,   distance: 12.5, speed: 0.45, spin: 1.5, texture: '2k_earth_daymap.jpg' },
  { name: 'Mars',    radius: 0.6, distance: 16,   speed: 0.35, spin: 1.4, texture: '2k_mars.jpg' },
  { name: 'Jupiter', radius: 2,   distance: 22,   speed: 0.2,  spin: 3,   texture: '2k_jupiter.jpg' },
  { name: 'Saturn',  radius: 1.7, distance: 30,   speed: 0.15, spin: 2.8, texture: '2k_saturn.jpg' },
  { name: 'Uranus',  radius: 1.3, distance: 38,   speed: 0.1,  spin: 1.8, texture: '2k_uranus.jpg' },
  { name: 'Neptune', radius: 1.3, distance: 45,   speed: 0.08, spin: 1.9, texture: '2k_neptune.jpg' }
];

const planets = [];

planetData.forEach((data) => {
  const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
  const material = new THREE.MeshStandardMaterial({ map: loadTexture(data.texture) });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  planets.push({ ...data, mesh, angle: Math.random() * Math.PI * 2 });
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

saturn.mesh.add(ring);
saturn.mesh.rotation.order = 'ZYX';
saturn.mesh.rotation.z = 0.4;

const moonData = [
  { name: 'Moon',     parent: 'Earth',   radius: 0.27, distance: 2,   speed: 1.5, texture: '2k_moon.jpg' },
  { name: 'Io',       parent: 'Jupiter', radius: 0.18, distance: 3,   speed: 2.5, color: 0xd9c85a },
  { name: 'Europa',   parent: 'Jupiter', radius: 0.16, distance: 3.7, speed: 1.8, color: 0xc9b8a0 },
  { name: 'Ganymede', parent: 'Jupiter', radius: 0.26, distance: 4.6, speed: 1.2, color: 0x8a7f72 },
  { name: 'Callisto', parent: 'Jupiter', radius: 0.24, distance: 5.6, speed: 0.8, color: 0x5e5249 },
  { name: 'Titan',    parent: 'Saturn',  radius: 0.26, distance: 3.8, speed: 0.9, color: 0xd9a24a }
];

const moons = moonData.map((data) => {
  const material = new THREE.MeshStandardMaterial(
    data.texture ? { map: loadTexture(data.texture) } : { color: data.color }
  );
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), material);
  scene.add(mesh);

  return {
    ...data,
    mesh,
    angle: Math.random() * Math.PI * 2,
    parentPlanet: planets.find((p) => p.name === data.parent)
  };
});

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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop: runs about 60 times per second
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  planets.forEach((p) => {
    p.angle += p.speed * delta;
    p.mesh.position.x = Math.cos(p.angle) * p.distance;
    p.mesh.position.z = Math.sin(p.angle) * p.distance;
    p.mesh.rotation.y += p.spin * delta;
  });

  moons.forEach((m) => {
    m.angle += m.speed * delta;
    const center = m.parentPlanet.mesh.position;
    m.mesh.position.x = center.x + Math.cos(m.angle) * m.distance;
    m.mesh.position.z = center.z + Math.sin(m.angle) * m.distance;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();
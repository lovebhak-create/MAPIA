// Main application entry point
window.addEventListener('DOMContentLoaded', () => {
  // 1. Renderer Setup
  const container = document.getElementById('canvas-container');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  // 2. Scene & Camera Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene.add(camera);

  // 3. Initialize Subsystems
  Environment.init(scene);
  TrainManager.init(scene);
  Collision.initTrainObstacles();
  Characters.init(scene);
  Player.init(camera, renderer.domElement);

  // Check URL param ?px=&py=&pz= or ?car=1..8 (default: 3호차 일반 객차)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('px')) {
    const px = parseFloat(urlParams.get('px'));
    const py = parseFloat(urlParams.get('py') || '2.85');
    const pz = parseFloat(urlParams.get('pz'));
    const ry = parseFloat(urlParams.get('ry') || '0');
    camera.position.set(px, py, pz);
    camera.rotation.set(0, ry, 0);
  } else {
    const startCar = parseInt(urlParams.get('car') || '3', 10);
    if (startCar >= 1 && startCar <= 8) {
      Player.teleportToCar(startCar);
    }
  }

  // 4. PointerLock & Clean Click to Play
  const controls = Player.getControls();

  container.addEventListener('click', () => {
    if (!controls.isLocked) {
      controls.lock();
      SoundManager.startAmbient();
    }
  });

  // Character Detection Raycaster & Nameplate
  const raycaster = new THREE.Raycaster();
  const screenCenter = new THREE.Vector2(0, 0);
  const nameplate = document.getElementById('char-nameplate');

  // 5. Firebox Flicker Animation
  const fireLight = scene.getObjectByName('FireLight');

  // 6. Render Loop
  const clock = new THREE.Clock();
  let timeElapsed = 0;

  const animate = () => {
    requestAnimationFrame(animate);

    const delta = Math.min(0.1, clock.getDelta());
    timeElapsed += delta;

    // Update Player movement & physics
    Player.update(delta);

    // Update Interactive Animated Doors
    if (typeof DoorManager !== 'undefined') {
      DoorManager.update(delta);
    }

    // Update Characters (Push physics: player pushes characters smoothly out of the way!)
    Characters.update(delta, camera.position);

    // Update Environment (track parallax, moving telegraph poles, smokestack steam particles)
    Environment.update(delta, 22.0);

    // Dynamic firebox flame pulsation in Locomotive Cab
    if (fireLight) {
      fireLight.intensity = 2.4 + Math.sin(timeElapsed * 15.0) * 0.6 + Math.cos(timeElapsed * 23.0) * 0.4;
    }

    // Character Raycast for subtle nameplate display
    if (nameplate) {
      raycaster.setFromCamera(screenCenter, camera);
      const hits = raycaster.intersectObjects(Characters.getList(), true);
      if (hits.length > 0 && hits[0].distance < 4.0 && hits[0].object.userData.characterName) {
        nameplate.textContent = hits[0].object.userData.characterName;
        nameplate.style.display = 'block';
      } else {
        nameplate.style.display = 'none';
      }
    }

    renderer.render(scene, camera);
  };

  animate();

  // Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

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
  Player.init(camera, renderer.domElement);

  // Check URL param ?car=1..8 to spawn directly in a specific car
  const urlParams = new URLSearchParams(window.location.search);
  const startCar = parseInt(urlParams.get('car') || '1', 10);
  if (startCar >= 1 && startCar <= 8) {
    Player.teleportToCar(startCar);
  }

  // 4. PointerLock Overlay & UI Interaction
  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');
  const controls = Player.getControls();

  instructions.addEventListener('click', () => {
    controls.lock();
  });

  container.addEventListener('click', () => {
    if (!controls.isLocked) {
      controls.lock();
    }
  });

  controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    SoundManager.startAmbient();
  });

  controls.addEventListener('unlock', () => {
    blocker.style.display = 'flex';
    instructions.style.display = 'block';
  });

  // Hotkey Buttons 1 ~ 8 in Top Bar
  for (let i = 1; i <= 8; i++) {
    const btn = document.getElementById(`btn-car-${i}`);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Player.teleportToCar(i);
      });
    }
  }

  // Audio Mute Toggle Button
  const btnAudio = document.getElementById('btn-audio');
  if (btnAudio) {
    btnAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      const muted = SoundManager.toggleMute();
      btnAudio.textContent = muted ? '🔇 소리 켜기' : '🔊 사운드';
    });
  }

  // Flashlight Button
  const btnLight = document.getElementById('btn-light');
  if (btnLight) {
    btnLight.addEventListener('click', (e) => {
      e.stopPropagation();
      Player.toggleFlashlight();
    });
  }

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

    // Update Environment (track parallax, moving telegraph poles, smokestack steam particles)
    Environment.update(delta, 22.0);

    // Dynamic firebox flame pulsation in Locomotive Cab
    if (fireLight) {
      fireLight.intensity = 2.4 + Math.sin(timeElapsed * 15.0) * 0.6 + Math.cos(timeElapsed * 23.0) * 0.4;
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

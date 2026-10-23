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
  if (urlParams.has('px') && urlParams.has('pz')) {
    const px = parseFloat(urlParams.get('px'));
    const py = parseFloat(urlParams.get('py') || '2.85');
    const pz = parseFloat(urlParams.get('pz'));
    const ry = parseFloat(urlParams.get('ry') || '0');
    const rx = parseFloat(urlParams.get('rx') || '0');
    if (!isNaN(px) && !isNaN(pz)) {
      camera.position.set(px, isNaN(py) ? 2.85 : py, pz);
      camera.rotation.set(isNaN(rx) ? 0 : rx, isNaN(ry) ? 0 : ry, 0, 'YXZ');
    }
  } else {
    const startCar = parseInt(urlParams.get('car') || '3', 10);
    if (startCar >= 1 && startCar <= 8) {
      Player.teleportToCar(startCar);
    }
  }

  // Initialize Dialogue Manager UI
  if (typeof DialogueManager !== 'undefined') {
    DialogueManager.init();

    // Support direct dialogue opening via URL query (e.g. ?openDlg=nurse_k or ?openDlg=jude)
    const urlParams = new URLSearchParams(window.location.search);
    const dlgTarget = urlParams.get('openDlg');
    const sendMsg = urlParams.get('sendMsg');
    const pairChat = urlParams.get('pairChat');
    const testSeq = urlParams.get('testSeq');
    const testNell = urlParams.get('testNell');
    const testVest = urlParams.get('testVest');
    if (dlgTarget) {
      setTimeout(() => {
        DialogueManager.open(dlgTarget);
        if (testVest) {
          setTimeout(() => {
            DialogueManager.sendPlayerMessage('왜냐하면 네 조끼가 마음에 들지 않아');
            setTimeout(() => {
              DialogueManager.sendPlayerMessage('미안 농담이야');
            }, 600);
          }, 400);
        } else if (testNell) {
          setTimeout(() => {
            DialogueManager.sendPlayerMessage('엄.. 안녕하세요 옷이 예뻐서요');
            setTimeout(() => {
              DialogueManager.sendPlayerMessage('조심할게 있나요?');
              setTimeout(() => {
                DialogueManager.sendPlayerMessage('이름이 뭐예요?');
              }, 600);
            }, 600);
          }, 400);
        } else if (testSeq) {
          setTimeout(() => {
            DialogueManager.sendPlayerMessage('개웃기노');
            setTimeout(() => {
              DialogueManager.sendPlayerMessage('엄..줴줴이야');
              setTimeout(() => {
                DialogueManager.sendPlayerMessage('?');
              }, 600);
            }, 600);
          }, 400);
        } else if (sendMsg) {
          setTimeout(() => {
            DialogueManager.sendPlayerMessage(decodeURIComponent(sendMsg));
          }, 400);
        } else if (pairChat) {
          setTimeout(() => {
            const pairBtn = document.getElementById('btn-interact-pair');
            if (pairBtn) pairBtn.click();
          }, 400);
        }
      }, 300);
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

    // Update Interactive Animated Doors & Sinks
    if (typeof DoorManager !== 'undefined') {
      DoorManager.update(delta);
    }
    if (typeof SinkManager !== 'undefined') {
      SinkManager.update(delta);
    }

    // Update Characters (Push physics: player pushes characters smoothly out of the way!)
    Characters.update(delta, camera.position);

    // Update Ambient Overheard Passenger Dialogues
    if (typeof DialogueManager !== 'undefined') {
      DialogueManager.updateAmbient(delta, camera.position);
    }

    // Update Environment (track parallax, moving telegraph poles, smokestack steam particles)
    Environment.update(delta, 22.0);

    // Dynamic firebox flame pulsation in Locomotive Cab
    if (fireLight) {
      fireLight.intensity = 2.4 + Math.sin(timeElapsed * 15.0) * 0.6 + Math.cos(timeElapsed * 23.0) * 0.4;
    }

    // Character Raycast for subtle nameplate display & interaction prompt
    if (nameplate) {
      raycaster.setFromCamera(screenCenter, camera);
      const hits = raycaster.intersectObjects(Characters.getList(), true);
      if (hits.length > 0 && hits[0].distance < 3.5 && hits[0].object.userData.characterName) {
        nameplate.innerHTML = `<span style="color:#ffd875;font-weight:700;margin-right:6px;">[E] 대화하기:</span> ${hits[0].object.userData.characterName}`;
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

// Player: First-Person Controller with PointerLockControls, collision, teleport, and flashlight
const Player = (() => {
  let camera = null;
  let controls = null;
  let flashlight = null;

  // Movement physics
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  };

  let targetY = 2.85; // Passenger eye height
  let currentY = 2.85;

  const init = (cam, domElement) => {
    camera = cam;
    controls = new THREE.PointerLockControls(camera, domElement);

    // Initial position: Inside Car 3 (일반 객차) looking down the aisle towards Car 4!
    camera.position.set(0.0, 2.85, -43.0);
    camera.rotation.set(0, 0, 0);

    // Vintage Brass Hand Lantern / Flashlight attached to camera
    flashlight = new THREE.SpotLight(0xfffae0, 0.0, 22.0, Math.PI / 5, 0.45, 1.2);
    flashlight.position.set(0.15, -0.2, 0.1);
    camera.add(flashlight);
    flashlight.target = new THREE.Object3D();
    camera.add(flashlight.target);
    flashlight.target.position.set(0, 0, -5.0);

    // Keyboard handlers
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.sprint = true;
          break;
        case 'KeyF':
          toggleFlashlight();
          break;
        case 'KeyH':
        case 'KeyE':
          // Blow Steam Whistle!
          SoundManager.playWhistle();
          break;
        // Hotkeys 1 ~ 8 for instant car teleportation
        case 'Digit1':
          teleportToCar(1);
          break;
        case 'Digit2':
          teleportToCar(2);
          break;
        case 'Digit3':
          teleportToCar(3);
          break;
        case 'Digit4':
          teleportToCar(4);
          break;
        case 'Digit5':
          teleportToCar(5);
          break;
        case 'Digit6':
          teleportToCar(6);
          break;
        case 'Digit7':
          teleportToCar(7);
          break;
        case 'Digit8':
          teleportToCar(8);
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.sprint = false;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Mouse click when locked to interact or whistle
    domElement.addEventListener('click', () => {
      if (controls.isLocked) {
        SoundManager.playWhistle();
      }
    });
  };

  const toggleFlashlight = () => {
    if (!flashlight) return;
    flashlight.intensity = flashlight.intensity > 0 ? 0.0 : 3.5;
  };

  const teleportToCar = (carNum) => {
    const sp = TrainManager.getCarSpawn(carNum);
    if (sp) {
      camera.position.set(sp.x, sp.y, sp.z);
      if (carNum === 1) {
        camera.rotation.set(0, Math.PI, 0);
      } else {
        camera.rotation.set(0, 0, 0);
      }
      velocity.set(0, 0, 0);
      SoundManager.playDoorSound();
      updateUI();
    }
  };

  const update = (delta) => {
    if (!controls || !controls.isLocked) return;

    // Determine target eye height:
    // Cab & Tender: Z > -11.5 -> Cab floor Y=1.6 -> Eye Y=3.25
    // Cars 2 to 8: Z <= -11.5 -> Passenger floor Y=1.2 -> Eye Y=2.85
    if (camera.position.z > -11.5) {
      targetY = 3.25;
    } else {
      targetY = 2.85;
    }
    // Smooth transition between elevations
    currentY += (targetY - currentY) * Math.min(1.0, delta * 8.0);
    camera.position.y = currentY;

    // Friction / Damping
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // Movement direction
    direction.z = Number(moveState.forward) - Number(moveState.backward);
    direction.x = Number(moveState.right) - Number(moveState.left);
    direction.normalize();

    const speed = moveState.sprint ? 5.5 : 3.0;

    if (moveState.forward || moveState.backward) {
      velocity.z -= direction.z * speed * 12.0 * delta;
    }
    if (moveState.left || moveState.right) {
      velocity.x -= direction.x * speed * 12.0 * delta;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // Train Car Interior Collision Bounds
    // Width clamp: Keep within car walls (X: -1.30 to +1.30)
    // On the Tender catwalk (Z between -1.5 and -11.5), walkway is on left side (-1.35 to -0.6)
    if (camera.position.z > -11.5 && camera.position.z < -1.5) {
      // On Tender catwalk
      camera.position.x = Math.max(-1.3, Math.min(-0.65, camera.position.x));
    } else {
      // General car width
      camera.position.x = Math.max(-1.32, Math.min(1.32, camera.position.x));
    }

    // Length clamp: From front boiler backhead (Z = 1.0) to rear observation gate (Z = -165.2)
    camera.position.z = Math.max(-165.2, Math.min(1.0, camera.position.z));

    updateUI();
  };

  const updateUI = () => {
    const currentCar = TrainManager.getCurrentCar(camera.position.z);
    const carTitleElem = document.getElementById('car-title');
    if (carTitleElem && currentCar) {
      carTitleElem.textContent = currentCar.name;
    }
  };

  return {
    init,
    update,
    teleportToCar,
    toggleFlashlight,
    getControls: () => controls,
    getCamera: () => camera
  };
})();

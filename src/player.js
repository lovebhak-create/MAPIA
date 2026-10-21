// Player: First-Person Controller with PointerLockControls, collision, sitting system, teleport, and flashlight
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

  // Interactive Seating System
  let isSitting = false;
  let sittingChair = null;
  const seats = [];

  // Register all chairs and beds across all 8 cars with realistic eye height and safe stand-up spots
  const initSeats = () => {
    seats.length = 0;

    // Car 3: 9 pairs of Coach double seats (Eye height Y = 2.38m)
    for (let i = 0; i < 9; i++) {
      const sz = -52.0 + i * 1.6;
      seats.push({ x: -0.95, y: 2.38, z: sz, name: 'Coach Seat', standPos: { x: -0.25, y: 2.85, z: sz } });
      seats.push({ x: 0.95, y: 2.38, z: sz, name: 'Coach Seat', standPos: { x: 0.25, y: 2.85, z: sz } });
    }

    // Car 4: 1st Class Luxury Suites - Armchairs & Beds
    // Armchairs
    seats.push({ x: 0.95, y: 2.32, z: -61.35, name: 'Suite 1 Armchair', standPos: { x: 0.35, y: 2.85, z: -61.35 } });
    seats.push({ x: 0.95, y: 2.32, z: -66.35, name: 'Suite 2 Armchair', standPos: { x: 0.35, y: 2.85, z: -66.35 } });
    seats.push({ x: 0.95, y: 2.32, z: -71.35, name: 'Suite 3 Armchair', standPos: { x: 0.35, y: 2.85, z: -71.35 } });
    // Luxury Double Beds (E / click to sleep/rest, Space to wake up!)
    seats.push({ x: 0.65, y: 1.85, z: -62.8, name: 'Suite 1 Bed', isBed: true, standPos: { x: -0.15, y: 2.85, z: -62.8 } });
    seats.push({ x: 0.65, y: 1.85, z: -67.8, name: 'Suite 2 Bed', isBed: true, standPos: { x: -0.15, y: 2.85, z: -67.8 } });
    seats.push({ x: 0.65, y: 1.85, z: -72.8, name: 'Suite 3 Bed', isBed: true, standPos: { x: -0.15, y: 2.85, z: -72.8 } });

    // Car 5: 2nd Class Sleeper Berths (Beds)
    seats.push({ x: 0.85, y: 1.80, z: -83.5, name: 'Berth Bed 1', isBed: true, standPos: { x: 0.0, y: 2.85, z: -83.5 } });
    seats.push({ x: -0.85, y: 1.80, z: -88.5, name: 'Berth Bed 2', isBed: true, standPos: { x: 0.0, y: 2.85, z: -88.5 } });
    seats.push({ x: 0.85, y: 1.80, z: -93.5, name: 'Berth Bed 3', isBed: true, standPos: { x: 0.0, y: 2.85, z: -93.5 } });

    // Car 6: Dining Car chairs (4 tables on each side)
    // Eye height Y = 2.42m gives an authentic view over the tabletop and plates!
    const dinerTableZ = [-113.5, -110.5, -107.5, -104.5];
    dinerTableZ.forEach(tz => {
      // Right 4-person table chairs
      seats.push({ x: 0.95, y: 2.42, z: tz - 0.7, name: 'Dining Chair', standPos: { x: 0.25, y: 2.85, z: tz - 0.7 } });
      seats.push({ x: 0.95, y: 2.42, z: tz + 0.7, name: 'Dining Chair', standPos: { x: 0.25, y: 2.85, z: tz + 0.7 } });
      // Left 2-person table chairs
      seats.push({ x: -0.95, y: 2.42, z: tz - 0.7, name: 'Dining Chair', standPos: { x: -0.25, y: 2.85, z: tz - 0.7 } });
      seats.push({ x: -0.95, y: 2.42, z: tz + 0.7, name: 'Dining Chair', standPos: { x: -0.25, y: 2.85, z: tz + 0.7 } });
    });

    // Car 7: Lounge Car Club Armchairs & Barstools
    // Club Armchairs
    seats.push({ x: 0.85, y: 2.30, z: -131.0, name: 'Club Armchair', standPos: { x: 0.20, y: 2.85, z: -131.0 } });
    seats.push({ x: 0.85, y: 2.30, z: -133.5, name: 'Club Armchair', standPos: { x: 0.20, y: 2.85, z: -133.5 } });
    seats.push({ x: 0.85, y: 2.30, z: -136.5, name: 'Club Armchair', standPos: { x: 0.20, y: 2.85, z: -136.5 } });
    seats.push({ x: 0.85, y: 2.30, z: -138.5, name: 'Club Armchair', standPos: { x: 0.20, y: 2.85, z: -138.5 } });
    seats.push({ x: -0.85, y: 2.30, z: -132.5, name: 'Club Armchair', standPos: { x: -0.20, y: 2.85, z: -132.5 } });
    seats.push({ x: -0.85, y: 2.30, z: -135.0, name: 'Club Armchair', standPos: { x: -0.20, y: 2.85, z: -135.0 } });

    // Barstools (Placed at X = -0.05, standPos at X = 0.60 in wide open walkway!)
    seats.push({ x: -0.05, y: 2.45, z: -128.3, name: 'Barstool', standPos: { x: 0.60, y: 2.85, z: -128.3 } });
    seats.push({ x: -0.05, y: 2.45, z: -127.0, name: 'Barstool', standPos: { x: 0.60, y: 2.85, z: -127.0 } });
    seats.push({ x: -0.05, y: 2.45, z: -125.7, name: 'Barstool', standPos: { x: 0.60, y: 2.85, z: -125.7 } });

    // Car 8: Observation Swivel Chairs
    [-160.0, -157.5, -155.0, -152.5, -150.0, -147.5].forEach(cz => {
      seats.push({ x: -0.95, y: 2.35, z: cz, name: 'Observation Swivel Chair', standPos: { x: -0.20, y: 2.85, z: cz } });
      seats.push({ x: 0.95, y: 2.35, z: cz, name: 'Observation Swivel Chair', standPos: { x: 0.20, y: 2.85, z: cz } });
    });
  };

  const trySitOrStand = () => {
    if (isSitting) {
      standUp();
      return;
    }

    // Only allow sitting/lying if within intimate interaction distance (<= 1.35m)
    let nearest = null;
    let minDist = 1.35;
    for (let i = 0; i < seats.length; i++) {
      const s = seats[i];
      const dist = Math.hypot(camera.position.x - s.x, camera.position.z - s.z);
      if (dist < minDist) {
        minDist = dist;
        nearest = s;
      }
    }

    if (nearest) {
      isSitting = true;
      sittingChair = nearest;
      camera.position.set(nearest.x, nearest.y, nearest.z);
      velocity.set(0, 0, 0);

      const prompt = document.getElementById('sit-prompt');
      if (prompt) {
        prompt.textContent = '[Space] 키를 눌러 일어나기';
        prompt.style.display = 'block';
      }
    }
  };

  const standUp = () => {
    if (!isSitting) return;
    isSitting = false;

    // Use safe collision-free stand-up position in open walkway
    if (sittingChair && sittingChair.standPos) {
      camera.position.set(sittingChair.standPos.x, sittingChair.standPos.y, sittingChair.standPos.z);
    } else {
      camera.position.y = 2.85;
    }
    velocity.set(0, 0, 0);
    sittingChair = null;

    const prompt = document.getElementById('sit-prompt');
    if (prompt) prompt.style.display = 'none';
  };

  const init = (cam, domElement) => {
    camera = cam;
    controls = new THREE.PointerLockControls(camera, domElement);
    initSeats();

    // Initial position: Inside Car 3 (일반 객차) looking down the aisle towards Car 4!
    camera.position.set(0.0, 2.85, -37.0);
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
      // Space to stand up if sitting
      if (e.code === 'Space' && isSitting) {
        standUp();
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          if (isSitting) standUp();
          moveState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          if (isSitting) standUp();
          moveState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (isSitting) standUp();
          moveState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (isSitting) standUp();
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
          SoundManager.playWhistle();
          break;
        case 'KeyE':
          trySitOrStand();
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

    // Mouse click when locked to interact with chairs / sit or whistle
    domElement.addEventListener('click', () => {
      if (!controls.isLocked) return;
      if (isSitting) {
        standUp();
        return;
      }
      trySitOrStand();
    });
  };

  const toggleFlashlight = () => {
    if (!flashlight) return;
    flashlight.intensity = flashlight.intensity > 0 ? 0.0 : 3.5;
  };

  const teleportToCar = (carNum) => {
    if (isSitting) standUp();
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
    }
  };

  const update = (delta) => {
    if (!controls || !controls.isLocked) return;

    // If sitting down, camera stays at chair position, looking around with mouse is free!
    if (isSitting) {
      if (sittingChair) {
        camera.position.set(sittingChair.x, sittingChair.y, sittingChair.z);
      }
      return;
    }

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

    // Calculate world displacement vectors from camera rotation
    const right = new THREE.Vector3();
    right.setFromMatrixColumn(camera.matrix, 0);
    right.y = 0;
    right.normalize();

    const forward = new THREE.Vector3();
    forward.crossVectors(camera.up, right);
    forward.y = 0;
    forward.normalize();

    const dx = right.x * (-velocity.x * delta) + forward.x * (-velocity.z * delta);
    const dz = right.z * (-velocity.x * delta) + forward.z * (-velocity.z * delta);

    // Continuous slide collision resolution for all furniture, walls, doors!
    Collision.move(camera.position, dx, dz, camera.position.y);
  };

  return {
    init,
    update,
    teleportToCar,
    toggleFlashlight,
    trySitOrStand,
    standUp,
    isSitting: () => isSitting,
    getControls: () => controls,
    getCamera: () => camera
  };
})();

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

    // Car 2: Baggage Guard Cot / Bed (Z = -15.8)
    seats.push({ x: -1.10, y: 1.70, z: -15.8, name: 'Baggage Guard Cot', isBed: true, standPos: { x: 0.0, y: 2.85, z: -15.8 } });

    // Car 3: 7 pairs of Coach double seats (Eye height Y = 2.38m)
    for (let i = 0; i < 7; i++) {
      const sz = -45.0 + (-4.2 + i * 1.6);
      seats.push({ x: -1.12, y: 2.38, z: sz, name: 'Coach Seat', standPos: { x: 0.0, y: 2.85, z: sz } });
      seats.push({ x: 1.12, y: 2.38, z: sz, name: 'Coach Seat', standPos: { x: 0.0, y: 2.85, z: sz } });
    }

    // Car 4: 1st Class Luxury Suites - Drawing Room Sofas, Armchairs & Beds (Photo 3)
    // Armchairs
    seats.push({ x: 0.25, y: 2.32, z: -60.75, name: 'Suite 1 Parlor Armchair', standPos: { x: 0.15, y: 2.85, z: -62.0 } });
    seats.push({ x: 0.25, y: 2.32, z: -65.75, name: 'Suite 2 Parlor Armchair', standPos: { x: 0.15, y: 2.85, z: -67.0 } });
    seats.push({ x: 0.25, y: 2.32, z: -70.75, name: 'Suite 3 Parlor Armchair', standPos: { x: 0.15, y: 2.85, z: -72.0 } });
    // Drawing Room Sofas (Photo 3 Day configuration)
    seats.push({ x: 1.15, y: 2.30, z: -61.30, name: 'Suite 1 Drawing Room Sofa', standPos: { x: 0.15, y: 2.85, z: -62.0 } });
    seats.push({ x: 1.15, y: 2.30, z: -66.30, name: 'Suite 2 Drawing Room Sofa', standPos: { x: 0.15, y: 2.85, z: -67.0 } });
    seats.push({ x: 1.15, y: 2.30, z: -71.30, name: 'Suite 3 Drawing Room Sofa', standPos: { x: 0.15, y: 2.85, z: -72.0 } });
    // Luxury Double Beds (Mattress at X: 1.05, standPos safely in open suite area X: 0.15)
    seats.push({ x: 1.05, y: 1.74, z: -63.4, name: 'Suite 1 Bed', isBed: true, standPos: { x: 0.15, y: 2.85, z: -62.0 } });
    seats.push({ x: 1.05, y: 1.74, z: -68.4, name: 'Suite 2 Bed', isBed: true, standPos: { x: 0.15, y: 2.85, z: -67.0 } });
    seats.push({ x: 1.05, y: 1.74, z: -73.4, name: 'Suite 3 Bed', isBed: true, standPos: { x: 0.15, y: 2.85, z: -72.0 } });

    // Car 5: 2nd Class Sleeper Berths (Beds in 6 sections)
    for (let s = 0; s < 6; s++) {
      const bz = -89.0 + (-4.0 + s * 2.2);
      seats.push({ x: 1.10, y: 1.72, z: bz, name: `Berth Bed R${s + 1}`, isBed: true, standPos: { x: 0.0, y: 2.85, z: bz } });
      seats.push({ x: -1.10, y: 1.72, z: bz, name: `Berth Bed L${s + 1}`, isBed: true, standPos: { x: 0.0, y: 2.85, z: bz } });
    }

    // Car 6: Dining Car chairs (4 tables on each side)
    const dinerTableZ = [-113.5, -110.5, -107.5, -104.5];
    dinerTableZ.forEach(tz => {
      seats.push({ x: 1.15, y: 2.42, z: tz - 0.7, name: 'Dining Chair', standPos: { x: 0.0, y: 2.85, z: tz - 0.7 } });
      seats.push({ x: 1.15, y: 2.42, z: tz + 0.7, name: 'Dining Chair', standPos: { x: 0.0, y: 2.85, z: tz + 0.7 } });
      seats.push({ x: -1.15, y: 2.42, z: tz - 0.7, name: 'Dining Chair', standPos: { x: 0.0, y: 2.85, z: tz - 0.7 } });
      seats.push({ x: -1.15, y: 2.42, z: tz + 0.7, name: 'Dining Chair', standPos: { x: 0.0, y: 2.85, z: tz + 0.7 } });
    });

    // Car 7: Lounge Car Club Armchairs & Barstools
    seats.push({ x: 1.05, y: 2.30, z: -131.0, name: 'Club Armchair', standPos: { x: 0.0, y: 2.85, z: -131.0 } });
    seats.push({ x: 1.05, y: 2.30, z: -133.5, name: 'Club Armchair', standPos: { x: 0.0, y: 2.85, z: -133.5 } });
    seats.push({ x: 1.05, y: 2.30, z: -136.5, name: 'Club Armchair', standPos: { x: 0.0, y: 2.85, z: -136.5 } });
    seats.push({ x: 1.05, y: 2.30, z: -138.5, name: 'Club Armchair', standPos: { x: 0.0, y: 2.85, z: -138.5 } });
    seats.push({ x: -1.05, y: 2.30, z: -132.5, name: 'Club Armchair', standPos: { x: 0.0, y: 2.85, z: -132.5 } });
    seats.push({ x: -1.05, y: 2.30, z: -135.0, name: 'Club Armchair', standPos: { x: 0.0, y: 2.85, z: -135.0 } });

    // Barstools (Placed at X = -0.20, standPos at X = 0.60 in wide open walkway!)
    seats.push({ x: -0.20, y: 2.45, z: -128.3, name: 'Barstool', standPos: { x: 0.60, y: 2.85, z: -128.3 } });
    seats.push({ x: -0.20, y: 2.45, z: -127.0, name: 'Barstool', standPos: { x: 0.60, y: 2.85, z: -127.0 } });
    seats.push({ x: -0.20, y: 2.45, z: -125.7, name: 'Barstool', standPos: { x: 0.60, y: 2.85, z: -125.7 } });

    // Car 8: Observation Swivel Chairs
    [-160.0, -157.5, -155.0, -152.5, -150.0, -147.5].forEach(cz => {
      seats.push({ x: -1.15, y: 2.35, z: cz, name: 'Observation Swivel Chair', standPos: { x: 0.0, y: 2.85, z: cz } });
      seats.push({ x: 1.15, y: 2.35, z: cz, name: 'Observation Swivel Chair', standPos: { x: 0.0, y: 2.85, z: cz } });
    });

    // Restroom Toilets (Cars 3, 4, 5) - Sit on toilet with safe forward stand-up spots!
    seats.push({
      x: 1.12,
      y: 2.15,
      z: -54.5,
      name: '3호차 화장실 변기',
      isToilet: true,
      standPos: { x: 1.12, y: 2.85, z: -53.4 }
    });
    seats.push({
      x: 1.12,
      y: 2.15,
      z: -76.5,
      name: '4호차 1등석 화장실 변기',
      isToilet: true,
      standPos: { x: 1.12, y: 2.85, z: -75.4 }
    });
    seats.push({
      x: 1.12,
      y: 2.15,
      z: -98.5,
      name: '5호차 침대차 화장실 변기',
      isToilet: true,
      standPos: { x: 1.12, y: 2.85, z: -97.4 }
    });
  };

  // Close interaction radius: Only interact when directly in front of the object (코앞 거리)!
  const INTERACT_DIST = 1.25;

  const tryInteract = () => {
    if (isSitting) {
      standUp();
      return;
    }

    // Check all interactive items within tight 1.25m arm's reach
    let closestType = null;
    let closestItem = null;
    let minDist = INTERACT_DIST;

    // 1. Check Door
    if (typeof DoorManager !== 'undefined') {
      const door = DoorManager.getNearestDoor(camera.position, INTERACT_DIST);
      if (door) {
        const d = Math.hypot(camera.position.x - door.x, camera.position.z - door.z);
        if (d < minDist) {
          minDist = d;
          closestType = 'door';
          closestItem = door;
        }
      }
    }

    // 2. Check Sink
    if (typeof SinkManager !== 'undefined') {
      const sink = SinkManager.getNearestSink(camera.position, INTERACT_DIST);
      if (sink) {
        const d = Math.hypot(camera.position.x - sink.x, camera.position.z - sink.z);
        if (d < minDist) {
          minDist = d;
          closestType = 'sink';
          closestItem = sink;
        }
      }
    }

    // 3. Check Chair / Bed / Toilet
    for (let i = 0; i < seats.length; i++) {
      const s = seats[i];
      const d = Math.hypot(camera.position.x - s.x, camera.position.z - s.z);
      if (d < minDist) {
        minDist = d;
        closestType = 'seat';
        closestItem = s;
      }
    }

    // Execute closest item
    if (closestType === 'door') {
      DoorManager.toggleDoor(closestItem);
    } else if (closestType === 'sink') {
      SinkManager.toggleSink(closestItem);
    } else if (closestType === 'seat') {
      sitOnItem(closestItem);
    }
  };

  const sitOnItem = (item) => {
    if (!item) return;
    isSitting = true;
    sittingChair = item;
    camera.position.set(item.x, item.y, item.z);
    velocity.set(0, 0, 0);

    const prompt = document.getElementById('sit-prompt');
    if (prompt) {
      prompt.textContent = '[Space] 키를 눌러 일어나기';
      prompt.style.display = 'block';
    }

    // If bed: look straight up at the ceiling!
    if (item.isBed) {
      camera.rotation.set(Math.PI / 2, camera.rotation.y, 0, 'YXZ');
    } else if (item.isToilet) {
      // Look straight forward out of cubicle
      camera.rotation.set(0, 0, 0, 'YXZ');
    }
  };

  const trySitOrStand = () => {
    if (isSitting) {
      standUp();
      return;
    }
    tryInteract();
  };

  const standUp = () => {
    if (!isSitting) return;

    // Reset camera pitch from ceiling to horizontal
    if (sittingChair && sittingChair.isBed) {
      camera.rotation.set(0, camera.rotation.y, 0, 'YXZ');
    }

    // Step safely to designated collision-free position
    if (sittingChair && sittingChair.standPos) {
      camera.position.set(sittingChair.standPos.x, sittingChair.standPos.y, sittingChair.standPos.z);
    } else {
      camera.position.y = 2.85;
    }

    velocity.set(0, 0, 0);
    isSitting = false;
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
          tryInteract();
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

    // Pointerdown and click listeners for mouse click when locked (triggers door toggle, sitting/sleeping reliably)
    document.addEventListener('pointerdown', (e) => {
      if (e.button === 0 && controls && controls.isLocked) {
        tryInteract();
      }
    });

    domElement.addEventListener('click', () => {
      if (!controls || !controls.isLocked) return;
      tryInteract();
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

    // If sitting down, camera stays at chair position
    // If in bed, camera stays looking directly up at ceiling!
    if (isSitting) {
      if (sittingChair) {
        camera.position.set(sittingChair.x, sittingChair.y, sittingChair.z);
        if (sittingChair.isBed) {
          camera.rotation.set(Math.PI / 2, camera.rotation.y, 0, 'YXZ');
        }
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

    // Update Interaction HUD Prompt (Doors, Sinks, Seats, Beds, Toilets)
    // ONLY displays when within close arm's reach (코앞 거리 <= 1.25m)!
    const prompt = document.getElementById('sit-prompt');
    if (prompt) {
      if (isSitting) {
        prompt.textContent = '[Space] 키를 눌러 일어나기';
        prompt.style.display = 'block';
      } else {
        let closestType = null;
        let closestItem = null;
        let minDist = INTERACT_DIST;

        // 1. Check Door
        if (typeof DoorManager !== 'undefined') {
          const door = DoorManager.getNearestDoor(camera.position, INTERACT_DIST);
          if (door) {
            const d = Math.hypot(camera.position.x - door.x, camera.position.z - door.z);
            if (d < minDist) {
              minDist = d;
              closestType = 'door';
              closestItem = door;
            }
          }
        }

        // 2. Check Sink
        if (typeof SinkManager !== 'undefined') {
          const sink = SinkManager.getNearestSink(camera.position, INTERACT_DIST);
          if (sink) {
            const d = Math.hypot(camera.position.x - sink.x, camera.position.z - sink.z);
            if (d < minDist) {
              minDist = d;
              closestType = 'sink';
              closestItem = sink;
            }
          }
        }

        // 3. Check Chair / Bed / Toilet
        for (let i = 0; i < seats.length; i++) {
          const s = seats[i];
          const d = Math.hypot(camera.position.x - s.x, camera.position.z - s.z);
          if (d < minDist) {
            minDist = d;
            closestType = 'seat';
            closestItem = s;
          }
        }

        if (closestType === 'door') {
          prompt.textContent = closestItem.isOpen ? `[E / 클릭] ${closestItem.name} 닫기` : `[E / 클릭] ${closestItem.name} 열기`;
          prompt.style.display = 'block';
        } else if (closestType === 'sink') {
          prompt.textContent = closestItem.isRunning ? `[E / 클릭] ${closestItem.name} 물 잠그기` : `[E / 클릭] ${closestItem.name} 물 틀기`;
          prompt.style.display = 'block';
        } else if (closestType === 'seat') {
          if (closestItem.isToilet) {
            prompt.textContent = '[E / 클릭] 변기에 앉기';
          } else if (closestItem.isBed) {
            prompt.textContent = '[E / 클릭] 침대에 눕기';
          } else {
            prompt.textContent = '[E / 클릭] 의자에 앉기';
          }
          prompt.style.display = 'block';
        } else {
          prompt.style.display = 'none';
        }
      }
    }
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

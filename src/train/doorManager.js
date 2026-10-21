// Door Manager: Interactive Animated Doors across the train
// Handles smooth swing/slide door opening, closed-door collision blocking, and double doors
const DoorManager = (() => {
  const doors = [];

  // Helper to create an authentic 1930s recessed brass pocket door pull handle
  const createRecessedHandle = (doorMesh, posX = 0.36) => {
    const matBezel = new THREE.MeshStandardMaterial({ color: 0xdfb142, roughness: 0.3, metalness: 0.85 });
    const matCup = new THREE.MeshStandardMaterial({ color: 0x1a160e, roughness: 0.5, metalness: 0.3 });
    const matGrip = new THREE.MeshStandardMaterial({ color: 0xc89e35, roughness: 0.35, metalness: 0.9 });

    // Front face flush cup pull
    const frontBezel = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.18, 0.008), matBezel);
    frontBezel.position.set(posX, 0, 0.026);
    const frontCup = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.12, 0.008), matCup);
    frontCup.position.set(posX, 0, 0.027);
    const frontGrip = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.10, 0.006), matGrip);
    frontGrip.position.set(posX, 0, 0.028);

    // Back face flush cup pull
    const backBezel = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.18, 0.008), matBezel);
    backBezel.position.set(posX, 0, -0.026);
    const backCup = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.12, 0.008), matCup);
    backCup.position.set(posX, 0, -0.027);
    const backGrip = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.10, 0.006), matGrip);
    backGrip.position.set(posX, 0, -0.028);

    doorMesh.add(frontBezel, frontCup, frontGrip, backBezel, backCup, backGrip);
  };

  const registerDoor = (doorObj) => {
    // Required fields:
    // mesh, type ('swing' | 'slide'), axis ('x' | 'z'), openAngle, openOffset, x, z, name
    // Optional: secondaryMesh, secondaryOpenAngle, doorBox: { minX, maxX, minZ, maxZ }
    const d = {
      mesh: doorObj.mesh,
      secondaryMesh: doorObj.secondaryMesh || null,
      type: doorObj.type || 'swing',
      axis: doorObj.axis || 'x',
      isOpen: doorObj.isOpen || false,
      openAngle: doorObj.openAngle !== undefined ? doorObj.openAngle : Math.PI / 2,
      secondaryOpenAngle: doorObj.secondaryOpenAngle !== undefined ? doorObj.secondaryOpenAngle : -Math.PI / 2,
      openOffset: doorObj.openOffset !== undefined ? doorObj.openOffset : 0.85,
      baseRotY: doorObj.mesh.rotation.y,
      secondaryBaseRotY: doorObj.secondaryMesh ? doorObj.secondaryMesh.rotation.y : 0,
      basePosX: doorObj.mesh.position.x,
      basePosZ: doorObj.mesh.position.z,
      currentVal: doorObj.isOpen ? 1.0 : 0.0,
      targetVal: doorObj.isOpen ? 1.0 : 0.0,
      x: doorObj.x,
      z: doorObj.z,
      doorBox: doorObj.doorBox || null,
      name: doorObj.name || 'Door'
    };
    doors.push(d);
    return d;
  };

  const getNearestDoor = (playerPos, maxDist = 1.3) => {
    let nearest = null;
    let minDist = maxDist;
    for (let i = 0; i < doors.length; i++) {
      const d = doors[i];
      const dist = Math.hypot(playerPos.x - d.x, playerPos.z - d.z);
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    }
    return nearest;
  };

  const toggleDoor = (door) => {
    if (!door) return;
    door.isOpen = !door.isOpen;
    door.targetVal = door.isOpen ? 1.0 : 0.0;
    if (typeof SoundManager !== 'undefined' && SoundManager.playDoorSound) {
      SoundManager.playDoorSound();
    }
  };

  // Check if player movement is blocked by any closed/closing door
  const isBlockedByClosedDoor = (px, pz, radius = 0.28) => {
    for (let i = 0; i < doors.length; i++) {
      const d = doors[i];
      // Only blocks if door is closed or mostly closed
      if (d.currentVal < 0.65) {
        let minX, maxX, minZ, maxZ;
        if (d.doorBox) {
          minX = d.doorBox.minX;
          maxX = d.doorBox.maxX;
          minZ = d.doorBox.minZ;
          maxZ = d.doorBox.maxZ;
        } else if (d.axis === 'z') {
          // Corridor suite door (spans along Z)
          minX = d.x - 0.22;
          maxX = d.x + 0.22;
          minZ = d.z - 0.55;
          maxZ = d.z + 0.55;
        } else if (d.type === 'swing') {
          // Swing door (like restroom)
          minX = d.x - 0.10;
          maxX = d.x + 0.85;
          minZ = d.z - 0.20;
          maxZ = d.z + 0.20;
        } else {
          // Standard bulkhead center sliding door (X: -0.52 to +0.52)
          minX = d.x - 0.52;
          maxX = d.x + 0.52;
          minZ = d.z - 0.22;
          maxZ = d.z + 0.22;
        }

        if (px + radius > minX && px - radius < maxX && pz + radius > minZ && pz - radius < maxZ) {
          return true;
        }
      }
    }
    return false;
  };

  const update = (delta) => {
    for (let i = 0; i < doors.length; i++) {
      const d = doors[i];
      if (Math.abs(d.currentVal - d.targetVal) > 0.001) {
        d.currentVal += (d.targetVal - d.currentVal) * Math.min(1.0, delta * 6.5);
        if (d.type === 'swing') {
          d.mesh.rotation.y = d.baseRotY + d.currentVal * d.openAngle;
          if (d.secondaryMesh) {
            d.secondaryMesh.rotation.y = d.secondaryBaseRotY + d.currentVal * d.secondaryOpenAngle;
          }
        } else if (d.type === 'slide') {
          if (d.axis === 'z') {
            d.mesh.position.z = d.basePosZ + d.currentVal * d.openOffset;
          } else {
            d.mesh.position.x = d.basePosX + d.currentVal * d.openOffset;
          }
        }
      }
    }
  };

  const clear = () => {
    doors.length = 0;
  };

  return {
    registerDoor,
    getNearestDoor,
    toggleDoor,
    isBlockedByClosedDoor,
    createRecessedHandle,
    update,
    clear,
    getDoors: () => doors
  };
})();

// Sink Manager: Interactive washbasins with animated running water streams & realistic audio
const SinkManager = (() => {
  const sinks = [];

  const registerSink = (sinkObj) => {
    // sinkObj: { x, y, z, waterStream, waterPuddle, name }
    const s = {
      x: sinkObj.x,
      y: sinkObj.y,
      z: sinkObj.z,
      waterStream: sinkObj.waterStream || null,
      waterPuddle: sinkObj.waterPuddle || null,
      isRunning: false,
      name: sinkObj.name || '세면대'
    };
    sinks.push(s);
    return s;
  };

  const getNearestSink = (playerPos, maxDist = 1.25) => {
    let nearest = null;
    let minDist = maxDist;
    for (let i = 0; i < sinks.length; i++) {
      const s = sinks[i];
      const dist = Math.hypot(playerPos.x - s.x, playerPos.z - s.z);
      if (dist < minDist) {
        minDist = dist;
        nearest = s;
      }
    }
    return nearest;
  };

  const toggleSink = (sink) => {
    if (!sink) return;
    sink.isRunning = !sink.isRunning;
    if (sink.waterStream) {
      sink.waterStream.visible = sink.isRunning;
    }
    if (sink.waterPuddle) {
      sink.waterPuddle.visible = sink.isRunning;
    }
    if (typeof SoundManager !== 'undefined' && SoundManager.playWaterSound) {
      SoundManager.playWaterSound(sink.isRunning);
    }
  };

  const update = (delta) => {
    const t = Date.now() * 0.012;
    for (let i = 0; i < sinks.length; i++) {
      const s = sinks[i];
      if (s.isRunning) {
        if (s.waterStream) {
          s.waterStream.scale.x = 0.90 + Math.sin(t * 1.8) * 0.12;
          s.waterStream.scale.z = 0.90 + Math.cos(t * 2.1) * 0.12;
          if (s.waterStream.material) {
            s.waterStream.material.opacity = 0.82 + Math.sin(t * 3.0) * 0.08;
          }
        }
        if (s.waterPuddle) {
          s.waterPuddle.scale.x = 1.0 + Math.sin(t * 1.2) * 0.06;
          s.waterPuddle.scale.z = 1.0 + Math.cos(t * 1.4) * 0.06;
        }
      }
    }
  };

  const clear = () => {
    sinks.length = 0;
  };

  return {
    registerSink,
    getNearestSink,
    toggleSink,
    update,
    clear,
    getSinks: () => sinks
  };
})();

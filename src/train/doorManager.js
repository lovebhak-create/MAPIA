// Door Manager: Interactive Animated Doors across the train
// Handles smooth swing/slide door opening and closing with audio effects
const DoorManager = (() => {
  const doors = [];

  const registerDoor = (doorObj) => {
    // Required fields:
    // mesh, type ('swing' | 'slide'), openAngle, openOffset, x, z, name
    const d = {
      mesh: doorObj.mesh,
      type: doorObj.type || 'swing',
      isOpen: doorObj.isOpen || false,
      openAngle: doorObj.openAngle !== undefined ? doorObj.openAngle : Math.PI / 2,
      openOffset: doorObj.openOffset !== undefined ? doorObj.openOffset : 0.85,
      baseRotY: doorObj.mesh.rotation.y,
      basePosX: doorObj.mesh.position.x,
      basePosZ: doorObj.mesh.position.z,
      currentVal: doorObj.isOpen ? 1.0 : 0.0,
      targetVal: doorObj.isOpen ? 1.0 : 0.0,
      x: doorObj.x,
      z: doorObj.z,
      name: doorObj.name || 'Door'
    };
    doors.push(d);
    return d;
  };

  const getNearestDoor = (playerPos, maxDist = 2.2) => {
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

  const update = (delta) => {
    for (let i = 0; i < doors.length; i++) {
      const d = doors[i];
      if (Math.abs(d.currentVal - d.targetVal) > 0.001) {
        d.currentVal += (d.targetVal - d.currentVal) * Math.min(1.0, delta * 6.5);
        if (d.type === 'swing') {
          d.mesh.rotation.y = d.baseRotY + d.currentVal * d.openAngle;
        } else if (d.type === 'slide') {
          d.mesh.position.x = d.basePosX + d.currentVal * d.openOffset;
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
    update,
    clear,
    getDoors: () => doors
  };
})();

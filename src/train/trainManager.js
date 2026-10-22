// Train Manager: Assembles and links all 8 cars with vestibules & bellows
const TrainManager = (() => {
  const cars = [];
  const carMetadata = [
    { id: 1, name: '1호차: 증기기관차 (운전실 & 탄수차)', spawn: { x: 0.0, y: 3.25, z: -0.2 }, bounds: [16, -11.5] },
    { id: 2, name: '2호차: 수하물차 (화물 및 물품 보관)', spawn: { x: 0.0, y: 2.85, z: -21.0 }, bounds: [-11.5, -34.0] },
    { id: 3, name: '3호차: 일반 객차 (승객 좌석)', spawn: { x: 0.0, y: 2.85, z: -37.0 }, bounds: [-34.0, -56.0] },
    { id: 4, name: '4호차: 1등석 침대차 (고급 개인 침실)', spawn: { x: -0.9, y: 2.85, z: -65.0 }, bounds: [-56.0, -78.0] },
    { id: 5, name: '5호차: 2등석 침대차 (공용 침대 공간)', spawn: { x: 0.0, y: 2.85, z: -87.0 }, bounds: [-78.0, -100.0] },
    { id: 6, name: '6호차: 식당차 (식사와 조리)', spawn: { x: 0.0, y: 2.85, z: -108.0 }, bounds: [-100.0, -122.0] },
    { id: 7, name: '7호차: 라운지차 (휴식과 사교)', spawn: { x: 0.0, y: 2.85, z: -130.0 }, bounds: [-122.0, -144.0] },
    { id: 8, name: '8호차: 전망차 (풍경 감상)', spawn: { x: 0.0, y: 2.85, z: -153.0 }, bounds: [-144.0, -166.0] }
  ];

  const createVestibule = (zCenter) => {
    // Accordion rubber bellows, heavy steel bridge plate, and Janney automatic knuckle coupler
    const vGroup = new THREE.Group();
    vGroup.position.set(0, 1.2, zCenter);

    const matBellows = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.9,
      metalness: 0.1
    });

    const matFootplate = new THREE.MeshStandardMaterial({
      map: Textures.rivetedSteel,
      roughness: 0.7,
      metalness: 0.8
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x222428,
      roughness: 0.8,
      metalness: 0.6
    });

    // 1. Continuous Solid Buffer Footplate spanning the inter-car gap (width 1.40m, length 1.86m)
    // Seamlessly bridges the cars without protruding into interior rooms!
    const plate = new THREE.Mesh(new THREE.BoxGeometry(1.40, 0.08, 1.86), matFootplate);
    plate.position.set(0, -0.04, 0);
    plate.receiveShadow = true;
    vGroup.add(plate);

    // 2. Heavy Janney Automatic Knuckle Coupler & Buffer Gear underneath the plate
    const couplerShank = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 1.8), matCastIron);
    couplerShank.position.set(0, -0.22, 0);
    const couplerHead = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.4), matCastIron);
    couplerHead.position.set(0, -0.22, 0);
    vGroup.add(couplerShank, couplerHead);

    // 3. Dual Flexible Air Brake Hoses
    [-0.2, 0.2].forEach(hx => {
      const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 8), matCastIron);
      hose.rotation.x = Math.PI / 2;
      hose.position.set(hx, -0.32, 0);
      vGroup.add(hose);
    });

    // 4. Heavy Accordion Pleats (Enclosing top, left, right)
    // Confined strictly between car bulkheads (pz: -0.80m to +0.80m) so they NEVER clip into car interior!
    const numPleats = 6;
    for (let p = 0; p < numPleats; p++) {
      const pz = -0.80 + (p / (numPleats - 1)) * 1.60;
      // Left pleat wall
      const pleatL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.75, 0.10), matBellows);
      pleatL.position.set(-0.75, 1.35, pz);
      // Right pleat wall
      const pleatR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.75, 0.10), matBellows);
      pleatR.position.set(0.75, 1.35, pz);
      // Top pleat roof
      const pleatTop = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.16, 0.10), matBellows);
      pleatTop.position.set(0, 2.70, pz);
      vGroup.add(pleatL, pleatR, pleatTop);
    }

    // Safety handrails inside vestibule
    [-0.68, 0.68].forEach(hx => {
      const rail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1.60, 8),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 })
      );
      rail.rotation.x = Math.PI / 2;
      rail.position.set(hx, 1.1, 0);
      vGroup.add(rail);
    });

    return vGroup;
  };

  const init = (scene) => {
    // 1. Instantiate each car
    const c1 = Car1_Locomotive.create();
    const c2 = Car2_Baggage.create();
    const c3 = Car3_Coach.create();
    const c4 = Car4_Sleeper1.create();
    const c5 = Car5_Sleeper2.create();
    const c6 = Car6_Diner.create();
    const c7 = Car7_Lounge.create();
    const c8 = Car8_Observation.create();

    scene.add(c1, c2, c3, c4, c5, c6, c7, c8);
    cars.push(c1, c2, c3, c4, c5, c6, c7, c8);

    // 2. Add Vestibule Bellows & Couplers between ALL adjacent cars (Fixes all gaps!)
    // Between Car 1 (Tender) and Car 2 (Baggage): Z = -12.0
    scene.add(createVestibule(-12.0));
    // Between Car 2 and Car 3: Z = -34.0
    scene.add(createVestibule(-34.0));
    // Between Car 3 and Car 4: Z = -56.0
    scene.add(createVestibule(-56.0));
    // Between Car 4 and Car 5: Z = -78.0
    scene.add(createVestibule(-78.0));
    // Between Car 5 and Car 6: Z = -100.0
    scene.add(createVestibule(-100.0));
    // Between Car 6 and Car 7: Z = -122.0
    scene.add(createVestibule(-122.0));
    // Between Car 7 and Car 8: Z = -144.0
    scene.add(createVestibule(-144.0));
  };

  const getCurrentCar = (cameraZ) => {
    for (let i = 0; i < carMetadata.length; i++) {
      const m = carMetadata[i];
      if (cameraZ <= m.bounds[0] && cameraZ > m.bounds[1]) {
        return m;
      }
    }
    return carMetadata[0];
  };

  const getCarSpawn = (carNumber) => {
    const idx = Math.max(1, Math.min(8, carNumber)) - 1;
    return carMetadata[idx].spawn;
  };

  return {
    init,
    getCurrentCar,
    getCarSpawn,
    carMetadata
  };
})();

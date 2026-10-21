// Car 2: Baggage & Express Mail Car (수하물차 - 1930s Historic Specification)
// Faithfully rebuilt based on historic reference photos and architectural cross-sections:
// - White beadboard curved ceiling with clerestory side transoms
// - Forged-iron 2-arm arched hanging chandeliers with milky white frosted glass globe pendants
// - Large double sliding cargo doors on both sides with iron tracks and vertical bar handles
// - Folding iron security pipe cage grates for high-value express cargo
// - Baggage Master Station: guard cot/bed, sorting desk, hurricane lantern, pigeonhole cubbies, 4-wheel handcart
// - Authentic variety of cargo: stenciled wooden crates, dome-top leather trunks, upright wardrobe crate

const Car2_Baggage = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car2_Baggage';

    // Position: Centered at Z = -23.0 (Spans Z = -13.0 to Z = -33.0)
    // Floor level: Y = 1.2m. Interior ceiling: Y = 3.9m.
    group.position.set(0, 1.2, -23.0);

    const length = 20.0;
    const width = 3.5;
    const height = 2.85;

    // Materials
    const matWoodFloor = new THREE.MeshStandardMaterial({
      map: Textures.woodFloor,
      roughness: 0.8,
      metalness: 0.1
    });

    const matCreamWall = new THREE.MeshStandardMaterial({
      color: 0xf4eee4,
      roughness: 0.75,
      metalness: 0.05
    });

    const matDarkWainscot = new THREE.MeshStandardMaterial({
      map: Textures.mahogany,
      roughness: 0.7,
      metalness: 0.15
    });

    const matWhiteCeiling = new THREE.MeshStandardMaterial({
      color: 0xfaf8f2,
      roughness: 0.8
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x222428,
      roughness: 0.7,
      metalness: 0.6
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xdfb142,
      roughness: 0.35,
      metalness: 0.8
    });

    const matCrate = new THREE.MeshStandardMaterial({
      map: Textures.crate,
      roughness: 0.8,
      metalness: 0.05
    });

    const matTrunkBrown = new THREE.MeshStandardMaterial({
      color: 0x4e2d1a,
      roughness: 0.55,
      metalness: 0.2
    });

    const matTrunkBlack = new THREE.MeshStandardMaterial({
      color: 0x1c1c1f,
      roughness: 0.5,
      metalness: 0.2
    });

    const matCanvasMail = new THREE.MeshStandardMaterial({
      color: 0xc8b898,
      roughness: 0.9,
      metalness: 0.05
    });

    // 1. Planked Wood Floor & Clerestory Beadboard Ceiling
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Curved Ceiling with Clerestory Deck (From Photo 4)
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.08, length), matWhiteCeiling);
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    // Clerestory side transoms along upper ceiling
    const transomMat = new THREE.MeshPhysicalMaterial({ color: 0xccddee, transparent: true, opacity: 0.4, roughness: 0.1 });
    [-1, 1].forEach(side => {
      const transomStrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, length - 2.0), transomMat);
      transomStrip.position.set(side * (width / 2 - 0.25), height - 0.15, 0);
      group.add(transomStrip);
    });

    // 2. Exterior Side Walls with Warm Wood Wainscoting
    const createBaggageSideWall = (xSide) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(xSide * (width / 2 - 0.06), 0, 0);

      // Lower sturdy wainscot
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, length), matDarkWainscot);
      lower.position.set(0, 0.6, 0);
      // Upper cream beadboard
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.12, height - 1.2, length), matCreamWall);
      upper.position.set(0, 1.2 + (height - 1.2) / 2, 0);

      wGroup.add(lower, upper);
      return wGroup;
    };
    group.add(createBaggageSideWall(-1));
    group.add(createBaggageSideWall(1));

    // End Bulkheads with Connecting Doors & Sliding Crew Doors
    const createBulkhead = (zPos) => {
      const bh = new THREE.Group();
      bh.position.set(0, 0, zPos);
      const postL = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matDarkWainscot);
      postL.position.set(-1.125, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matDarkWainscot);
      postR.position.set(1.125, height / 2, 0);
      const transom = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.12), matDarkWainscot);
      transom.position.set(0, height - 0.3, 0);
      bh.add(postL, postR, transom);

      // Heavy sliding crew door
      const crewDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.05, 0.05), matDarkWainscot);
      crewDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.06), transomMat);
      dWin.position.set(0, 0.35, 0);
      const dHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), matCastIron);
      dHandle.position.set(0.38, 0, 0.04);
      crewDoor.add(dWin, dHandle);
      bh.add(crewDoor);

      // Register interactive door with DoorManager
      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: crewDoor,
          type: 'slide',
          openOffset: 0.92,
          x: 0,
          z: -23.0 + zPos,
          name: zPos > 0 ? '수하물차 앞문 (기관차 방면)' : '수하물차 뒷문 (3호차 객차 방면)'
        });
      }

      return bh;
    };
    group.add(createBulkhead(length / 2));
    group.add(createBulkhead(-length / 2));

    // 3. Sliding Cargo Double Doors on Both Sides (From Photo 2, 3, 4)
    [-1, 1].forEach(side => {
      // Large sliding double doors at Z = 0
      const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 1.2), matDarkWainscot);
      doorL.position.set(side * (width / 2 - 0.12), 1.1, -0.6);
      const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 1.2), matDarkWainscot);
      doorR.position.set(side * (width / 2 - 0.12), 1.1, 0.6);

      // Heavy Iron Overhead Sliding Rail & Rollers
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.8), matCastIron);
      rail.position.set(side * (width / 2 - 0.14), 2.26, 0);

      // Vertical Iron Grab Bars
      const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), matCastIron);
      handleL.position.set(side * (width / 2 - 0.16), 1.1, -0.1);
      const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), matCastIron);
      handleR.position.set(side * (width / 2 - 0.16), 1.1, 0.1);

      group.add(doorL, doorR, rail, handleL, handleR);
    });

    // 4. Folding Iron Security Pipe Cage Grates (From Photo 4)
    // Mounted along walls to lock express packages and bonded freight
    [-1, 1].forEach(side => {
      const cageGroup = new THREE.Group();
      cageGroup.position.set(side * (width / 2 - 0.35), 0, -4.5);

      // Vertical pipe bars
      for (let bz = -2.0; bz <= 2.0; bz += 0.35) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.1, 8), matCastIron);
        pipe.position.set(0, 1.05, bz);
        cageGroup.add(pipe);
      }
      // Horizontal bracing bars
      [0.2, 1.1, 2.0].forEach(hy => {
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 4.1), matCastIron);
        hBar.position.set(0, hy, 0);
        cageGroup.add(hBar);
      });
      group.add(cageGroup);
    });

    // 5. BAGGAGE MASTER GUARD STATION (Front Section Z = +5.0 to +9.0, From Photo 3)
    // A. Baggage Master Cot / Single Bed
    const cotGroup = new THREE.Group();
    cotGroup.position.set(-width / 2 + 0.65, 0, 7.2);

    const cotFrame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 1.9), matDarkWainscot);
    cotFrame.position.set(0, 0.18, 0);
    const cotHead = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.55, 0.06), matDarkWainscot);
    cotHead.position.set(0, 0.45, 0.95);
    const cotMattress = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.16, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xddd5c7, roughness: 0.85 })
    );
    cotMattress.position.set(0, 0.34, 0);
    const cotBlanket = new THREE.Mesh(
      new THREE.BoxGeometry(0.81, 0.08, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x3d4b5c, roughness: 0.9 })
    );
    cotBlanket.position.set(0, 0.44, -0.3);
    const cotPillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.12, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.7 })
    );
    cotPillow.position.set(0, 0.46, 0.65);
    cotGroup.add(cotFrame, cotHead, cotMattress, cotBlanket, cotPillow);
    group.add(cotGroup);

    // B. Baggage Clerk Desk & Wall Pigeonhole Sorting Rack
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-width / 2 + 0.55, 0, 5.0);
    const deskBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 1.1), matDarkWainscot);
    deskBody.position.set(0, 0.375, 0);

    // Pigeonhole Cubbies Unit on Wall
    const cubbies = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 1.0), matDarkWainscot);
    cubbies.position.set(-0.15, 1.25, 0);

    // Glowing Kerosene Hurricane Lantern
    const lanternBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.06, 8), matBrass);
    lanternBase.position.set(0.1, 0.78, 0);
    const lanternGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffdf88 })
    );
    lanternGlass.position.set(0.1, 0.87, 0);
    const lanternLight = new THREE.PointLight(0xffbe60, 1.2, 5.0);
    lanternLight.position.set(0.1, 0.87, 0);

    deskGroup.add(deskBody, cubbies, lanternBase, lanternGlass, lanternLight);
    group.add(deskGroup);

    // C. 4-Wheel Railway Freight Handcart / Baggage Trolley (From Photo 3)
    const trolleyGroup = new THREE.Group();
    trolleyGroup.position.set(width / 2 - 0.65, 0, 6.0);

    const bedWood = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 1.6), matDarkWainscot);
    bedWood.position.set(0, 0.28, 0);

    // 4 Cast Iron Spoke Wheels
    [-0.38, 0.38].forEach(wx => {
      [-0.6, 0.6].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 12), matCastIron);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.14, wz);
        trolleyGroup.add(wheel);
      });
    });

    // Trolley Upright Handle
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.7, 0.04), matCastIron);
    handleBar.position.set(0, 0.65, 0.75);
    trolleyGroup.add(bedWood, handleBar);

    // Authentic U.S. MAIL Burlap Canvas Sacks & Express Parcel (Tied with hemp rope - NO EGGS!)
    [-0.32, 0.28].forEach((pz, idx) => {
      const sack = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.40), matCanvasMail);
      sack.position.set(0, 0.42 + idx * 0.18, pz);
      sack.rotation.y = idx * 0.2;
      // Gathered neck & tied hemp rope
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.12, 8), matCanvasMail);
      neck.position.set(0.16, 0.08, 0);
      const rope = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 6, 12), new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.9 }));
      rope.rotation.x = Math.PI / 2;
      rope.position.set(0.16, 0.05, 0);
      sack.add(neck, rope);
      trolleyGroup.add(sack);
    });
    const parcel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.32), matCrate);
    parcel.position.set(0.06, 0.44, -0.05);
    trolleyGroup.add(parcel);
    group.add(trolleyGroup);

    // 6. CARGO AREA (Rear Section Z = -1.0 to -9.0, From Photo 3)
    // Varied Wooden Crates with Diagonal Cross-Bracing
    const createStenciledCrate = (x, z, w, h, d, rotY = 0) => {
      const crateGroup = new THREE.Group();
      crateGroup.position.set(x, h / 2, z);
      crateGroup.rotation.y = rotY;

      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matCrate);
      body.castShadow = true;
      crateGroup.add(body);
      return crateGroup;
    };

    // Stacks of Wooden Crates along Right Wall
    group.add(createStenciledCrate(0.85, -2.5, 0.95, 0.95, 0.95, 0.05));
    group.add(createStenciledCrate(0.85, -2.5, 0.8, 0.75, 0.8, 0.2).translateY(0.85));
    group.add(createStenciledCrate(0.85, -4.2, 0.85, 0.85, 1.2, -0.1));
    group.add(createStenciledCrate(0.85, -5.8, 0.9, 0.9, 0.9, 0.15));

    // Tall Upright Wardrobe Shipping Crate (From Photo 3)
    group.add(createStenciledCrate(0.88, -7.5, 0.75, 1.85, 0.85, 0));

    // Dome-Top Antique Steamer Trunks (From Photo 3)
    const createDomeTopTrunk = (x, z, w, h, d, color = 0x4e2d1a) => {
      const trunk = new THREE.Group();
      trunk.position.set(x, 0, z);

      const matT = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 });
      const tBase = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.75, d), matT);
      tBase.position.set(0, h * 0.375, 0);

      // Curved Dome Lid
      const lidCurve = new THREE.CylinderGeometry(d / 2, d / 2, w, 12, 1, false, 0, Math.PI);
      const lid = new THREE.Mesh(lidCurve, matT);
      lid.rotation.z = Math.PI / 2;
      lid.position.set(0, h * 0.75, 0);

      // Brass Straps & Lock
      const strap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.03, d + 0.02), matBrass);
      strap.position.set(0, h * 0.5, 0);

      trunk.add(tBase, lid, strap);
      return trunk;
    };

    group.add(createDomeTopTrunk(-0.85, -2.2, 1.1, 0.65, 0.6, 0x5a2d18));
    group.add(createDomeTopTrunk(-0.85, -4.0, 1.0, 0.6, 0.55, 0x1f2b38));
    group.add(createDomeTopTrunk(-0.85, -5.8, 1.15, 0.7, 0.65, 0x241d18));
    group.add(createDomeTopTrunk(-0.85, -7.5, 0.95, 0.55, 0.5, 0x422212));

    // 7. HISTORIC CENTERLINE FORGED-IRON CHANDELIERS (From Photo 4)
    // 2-arm arched forged-iron hangers with milky white frosted glass globes
    [-7.0, -2.5, 2.5, 7.0].forEach(lz => {
      const chandelier = new THREE.Group();
      chandelier.position.set(0, height - 0.08, lz);

      // Ceiling Mounting Rose
      const ceilingRose = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 12), matCastIron);
      ceilingRose.position.set(0, -0.02, 0);

      // Arched 2-Arm Forged Iron Bracket
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), matCastIron);
      armL.rotation.z = 0.35;
      armL.position.set(-0.08, -0.22, 0);
      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), matCastIron);
      armR.rotation.z = -0.35;
      armR.position.set(0.08, -0.22, 0);

      // Globe Holder & Milky White Frosted Glass Globe
      const globeHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.05, 12), matCastIron);
      globeHolder.position.set(0, -0.42, 0);

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 14),
        new THREE.MeshStandardMaterial({
          color: 0xfffae8,
          emissive: 0xffeed0,
          emissiveIntensity: 0.6,
          roughness: 0.2
        })
      );
      globe.position.set(0, -0.58, 0);

      const pointLight = new THREE.PointLight(0xfff0d8, 1.1, 7.5);
      pointLight.position.set(0, -0.65, 0);

      chandelier.add(ceilingRose, armL, armR, globeHolder, globe, pointLight);
      group.add(chandelier);
    });

    return group;
  };

  return { create };
})();

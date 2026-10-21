// Car 5: 2nd Class Section Sleeper Car (2등석 침대차 - Pullman Open Section Berth Car)
// Central aisle flanked by upper and lower berths with privacy curtains
// Rear end features an enclosed Lavatory (화장실) on the right side and diverted walkway on the left (Photo 5 Architecture)
const Car5_Sleeper2 = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car5_Sleeper2';

    // Position: Centered at Z = -89.0 (Spans Z = -79.0 to Z = -99.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -89.0);

    const length = 20.0;
    const width = 3.5;
    const height = 2.85;

    const matWoodFloor = new THREE.MeshStandardMaterial({
      map: Textures.woodFloor,
      roughness: 0.7,
      metalness: 0.1
    });

    const matCarpet = new THREE.MeshStandardMaterial({
      map: Textures.carpet,
      roughness: 0.8,
      metalness: 0.05
    });

    const matMahogany = new THREE.MeshStandardMaterial({
      map: Textures.mahogany,
      roughness: 0.4,
      metalness: 0.2
    });

    const matExtGreen = new THREE.MeshStandardMaterial({
      map: Textures.exteriorGreen,
      roughness: 0.5,
      metalness: 0.3
    });

    const matCurtain = new THREE.MeshStandardMaterial({
      color: 0x1f3b2b, // Heavy Pullman forest green curtain
      roughness: 0.85,
      metalness: 0.05
    });

    const matBedding = new THREE.MeshStandardMaterial({
      color: 0xf0efe8, // Crisp white Pullman sheet
      roughness: 0.9,
      metalness: 0.02
    });

    const matBlanket = new THREE.MeshStandardMaterial({
      color: 0x3d2817, // Pullman wool blanket
      roughness: 0.85,
      metalness: 0.05
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.7,
      metalness: 0.4
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // 1. Floor & Central Carpet Runner
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Carpet runner running straight down the central aisle connecting both car end doors
    const aisleCarpet = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.01, length), matCarpet);
    aisleCarpet.position.set(0, 0.01, 0);
    group.add(aisleCarpet);

    // 2. Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.2, 0.1, length),
      new THREE.MeshStandardMaterial({ color: 0xe0d6c3, roughness: 0.8 })
    );
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    // 3. Exterior Walls
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), matExtGreen);
    wallL.position.set(-width / 2 + 0.06, height / 2, 0);
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), matExtGreen);
    wallR.position.set(width / 2 - 0.06, height / 2, 0);
    group.add(wallL, wallR);

    // End Bulkheads with Interactive Sliding Doors
    const createBulkhead = (zPos) => {
      const bh = new THREE.Group();
      bh.position.set(0, 0, zPos);
      const postL = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
      postL.position.set(-1.125, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
      postR.position.set(1.125, height / 2, 0);
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.12), matMahogany);
      topTransom.position.set(0, height - 0.3, 0);
      bh.add(postL, postR, topTransom);

      // Sliding Mahogany Door
      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.05, 0.05), matMahogany);
      sDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
      dWin.position.set(0, 0.35, 0);
      sDoor.add(dWin);
      bh.add(sDoor);

      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: sDoor,
          type: 'slide',
          openOffset: 0.92,
          x: 0,
          z: -89.0 + zPos,
          name: zPos > 0 ? '5호차 앞문' : '5호차 뒷문'
        });
      }

      return bh;
    };
    group.add(createBulkhead(length / 2));
    group.add(createBulkhead(-length / 2));

    // 4. Berth Sections on both sides of central aisle (6 Sections, s=0..5)
    // Central aisle: -0.55 to +0.55 (width 1.1m)
    // Left berths: x = -1.65 to -0.55 (width 1.1m)
    // Right berths: x = +0.55 to +1.65 (width 1.1m)
    const sectionLength = 2.2;
    const numSections = 6;

    for (let s = 0; s < numSections; s++) {
      const sz = -4.0 + s * sectionLength; // s=0: -4.0, s=5: 7.0 (leaves rear -6.5 ~ -10.0 open for Lavatory)

      // Divider partition between sections
      [-1, 1].forEach(side => {
        const divider = new THREE.Mesh(new THREE.BoxGeometry(1.1, height, 0.08), matMahogany);
        divider.position.set(side * 1.10, height / 2, sz - sectionLength / 2);
        group.add(divider);

        // Lower Berth (하단 침대: Y = 0.45m)
        const lowerBed = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, sectionLength - 0.15), matBedding);
        lowerBed.position.set(side * 1.10, 0.35, sz);
        const lowerBlanket = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.05, 1.2), matBlanket);
        lowerBlanket.position.set(side * 1.10, 0.47, sz + 0.3);
        const lowerPillow = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.35), matBedding);
        lowerPillow.position.set(side * 1.10, 0.5, sz - 0.8);
        group.add(lowerBed, lowerBlanket, lowerPillow);

        // Upper Berth (상단 침대: Y = 1.55m)
        const upperFrame = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, sectionLength - 0.12), matMahogany);
        upperFrame.position.set(side * 1.10, 1.5, sz);
        const upperBed = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.15, sectionLength - 0.2), matBedding);
        upperBed.position.set(side * 1.10, 1.6, sz);
        const upperPillow = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.35), matBedding);
        upperPillow.position.set(side * 1.10, 1.7, sz - 0.8);
        group.add(upperFrame, upperBed, upperPillow);

        // Brass Curtain Rod running along the aisle edge
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, sectionLength, 6), matBrass);
        rod.rotation.x = Math.PI / 2;
        rod.position.set(side * 0.56, height - 0.35, sz);
        group.add(rod);

        // Privacy Curtains (Some fully drawn, some parted)
        const isParted = (s + (side > 0 ? 1 : 0)) % 3 === 0;
        if (isParted) {
          // Bunched/parted curtain on side
          const curtainP = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.1, 0.4), matCurtain);
          curtainP.position.set(side * 0.56, 1.2, sz - 0.8);
          group.add(curtainP);
        } else {
          // Drawn privacy curtain covering the berth section
          const curtainFull = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, sectionLength - 0.1), matCurtain);
          curtainFull.position.set(side * 0.56, 1.2, sz);
          group.add(curtainFull);
        }

        // Section Number Brass Badge
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.15), matBrass);
        badge.position.set(side * 0.55, 1.8, sz - sectionLength / 2 + 0.1);
        group.add(badge);
      });

      // Wooden Berth Access Ladder attached on every other section
      if (s % 2 === 0) {
        const ladderGroup = new THREE.Group();
        ladderGroup.position.set(0.54, 0, sz + 0.4);
        const stringer1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.04), matMahogany);
        stringer1.position.set(0, 0.8, -0.15);
        const stringer2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.04), matMahogany);
        stringer2.position.set(0, 0.8, 0.15);
        for (let r = 0.3; r < 1.5; r += 0.3) {
          const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), matBrass);
          rung.rotation.x = Math.PI / 2;
          rung.position.set(0, r, 0);
          ladderGroup.add(rung);
        }
        ladderGroup.add(stringer1, stringer2);
        group.add(ladderGroup);
      }
    }

    // Front-most section end partition at sz = 7.0 + sectionLength/2 = 8.1
    [-1, 1].forEach(side => {
      const frontCap = new THREE.Mesh(new THREE.BoxGeometry(1.1, height, 0.08), matMahogany);
      frontCap.position.set(side * 1.10, height / 2, 8.1);
      group.add(frontCap);
    });

    // ==========================================
    // 5. ENCLOSED RESTROOM (화장실 - Photo 2, 3, 7 Pullman Berth Architecture)
    // Enclosed compactly in the rear right corner (X: 0.55 to 1.69, Z: -9.95 to -7.5)
    // Central aisle (X: -0.55 to +0.55) & red carpet are 100% UNOBSTRUCTED all the way to rear door!
    // ==========================================
    const bathGroup = new THREE.Group();

    // Floor: Pullman Green Slatted Duckboard Grating Floor (Photo 7)
    const matGratingFloor = new THREE.MeshStandardMaterial({
      map: Textures.greenGrating,
      roughness: 0.5,
      metalness: 0.1
    });
    const bathFloor = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.02, 2.45), matGratingFloor);
    bathFloor.position.set(1.12, 0.015, -8.725);
    bathFloor.receiveShadow = true;
    bathGroup.add(bathFloor);

    // Enclosing Partition Walls - Solid rear wall seals the car completely!
    const bathWallRear = new THREE.Mesh(new THREE.BoxGeometry(1.14, height, 0.08), matMahogany);
    bathWallRear.position.set(1.12, height / 2, -9.95);

    // Left wall of Restroom (facing aisle)
    const bathWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 2.45), matMahogany);
    bathWallL.position.set(0.55, height / 2, -8.725);

    // 2-tone Interior Wall lining (Warm cream upper, dark Pullman mahogany lower wainscot - Photo 6 & 7)
    const matLowerWainscot = new THREE.MeshStandardMaterial({ color: 0x2e1a12, roughness: 0.45 });
    const matUpperWall = new THREE.MeshStandardMaterial({ color: 0xeee7db, roughness: 0.4 });
    const innerWainscotL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.1, 2.41), matLowerWainscot);
    innerWainscotL.position.set(0.60, 0.55, -8.725);
    const innerUpperL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.6, 2.41), matUpperWall);
    innerUpperL.position.set(0.60, 1.9, -8.725);
    const innerRailL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 2.41), matMahogany);
    innerRailL.position.set(0.60, 1.1, -8.725);
    bathGroup.add(innerWainscotL, innerUpperL, innerRailL);

    // Front wall of Restroom (facing berth section at Z = -7.5)
    const bathWallFrontR = new THREE.Mesh(new THREE.BoxGeometry(0.35, height, 0.08), matMahogany);
    bathWallFrontR.position.set(1.515, height / 2, -7.5);
    const bathTransom = new THREE.Mesh(new THREE.BoxGeometry(0.79, height - 2.10, 0.08), matMahogany);
    bathTransom.position.set(0.945, height - (height - 2.10) / 2, -7.5);
    const bathThreshold = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.025, 0.08), matBrass);
    bathThreshold.position.set(0.945, 0.015, -7.5);
    bathGroup.add(bathWallRear, bathWallL, bathWallFrontR, bathTransom, bathThreshold);

    // Interactive Swing Restroom Door opening inward against left wall (Photo 1 & 3)
    const bathDoorPivot = new THREE.Group();
    bathDoorPivot.position.set(0.59, 0, -7.5);

    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(0.73, 2.05, 0.04), matMahogany);
    bathDoor.position.set(0.365, 1.025, 0);

    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.25, 0.02), new THREE.MeshPhysicalMaterial({ color: 0xc8d8e6, roughness: 0.35, transmission: 0.6 }));
    doorGlass.position.set(0, 0.22, 0.02);
    const bathPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.03), matBrass);
    bathPlaque.position.set(0, 0.95, 0.025);
    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), matBrass);
    doorHandle.position.set(-0.30, 0, 0.03);
    bathDoor.add(doorGlass, bathPlaque, doorHandle);
    bathDoorPivot.add(bathDoor);
    bathGroup.add(bathDoorPivot);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: bathDoorPivot,
        type: 'swing',
        openAngle: -Math.PI / 2,
        x: 0.59,
        z: -89.0 - 7.5,
        name: '5호차 침대차 화장실 문'
      });
    }

    // Inside Lavatory Fixtures (Photo 2, 3, 7):
    const matPorcelain = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15, metalness: 0.05 });
    const matNickelSilver = new THREE.MeshStandardMaterial({ color: 0xd6d8da, roughness: 0.22, metalness: 0.88 });
    const matDarkWalnut = new THREE.MeshStandardMaterial({ color: 0x331c12, roughness: 0.35, metalness: 0.1 });

    // 1. Porcelain flush toilet with round dark wood seat ring and overhead flush pipe against sealed rear wall (Photo 5 & 7)
    const toiletBase = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.44, 16), matPorcelain);
    toiletBase.position.set(1.12, 0.22, -9.50);
    const toiletSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 16), matDarkWalnut);
    toiletSeat.position.set(1.12, 0.45, -9.50);
    const toiletLid = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.03), matDarkWalnut);
    toiletLid.position.set(1.12, 0.68, -9.70);
    toiletLid.rotation.x = -0.15;

    const flushPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.45, 8), matNickelSilver);
    flushPipe.position.set(1.12, 1.28, -9.90);
    const flushTank = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.2), matPorcelain);
    flushTank.position.set(1.12, 2.05, -9.85);

    // 2. Arched Niche Alcove with Round Nickel Silver Washbasin (Mounted on Right Wall)
    const washNicheGroup = new THREE.Group();
    washNicheGroup.position.set(1.42, 0.82, -8.15);

    // Arched white enamel wall backplate with molded cast rim (Photo 7)
    const nicheBackplate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.72, 0.48), new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.2 }));
    nicheBackplate.position.set(0.16, 0.28, 0);
    const nicheArch = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16, 1, false, 0, Math.PI), matMahogany);
    nicheArch.rotation.z = Math.PI / 2;
    nicheArch.position.set(0.16, 0.64, 0);

    // Round Nickel Metal Washbasin Sink (Photo 2 & 7)
    const nickelBasin = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.12, 16), matNickelSilver);
    nickelBasin.position.set(0, 0, 0);
    const basinSupport = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.46), matMahogany);
    basinSupport.position.set(0.02, -0.06, 0);

    // Vintage nickel twist spout & soap niche (Photo 7)
    const nickelSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12, 8), matNickelSilver);
    nickelSpout.position.set(0.06, 0.16, 0);
    const soapNiche = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.12), matNickelSilver);
    soapNiche.position.set(0.14, 0.32, 0);
    washNicheGroup.add(nicheBackplate, nicheArch, nickelBasin, basinSupport, nickelSpout, soapNiche);

    // 3. Ornate Carved Oval Vanity Mirror on Right Wall (Photo 2)
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(width / 2 - 0.08, 1.50, -8.15);
    const ovalMirror = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xccddee, roughness: 0.08, metalness: 0.9 }));
    ovalMirror.rotation.z = Math.PI / 2;
    const ovalFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 16), matMahogany);
    ovalFrame.rotation.z = Math.PI / 2;
    const carvedCrest = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), matBrass);
    carvedCrest.position.set(0, 0.25, 0);
    mirrorGroup.add(ovalMirror, ovalFrame, carvedCrest);

    // 4. Double Brass Coat / Hat Hooks on Wall (Photo 3)
    const hook1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.02), matBrass);
    hook1.position.set(width / 2 - 0.08, 1.85, -7.80);
    const hook2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.02), matBrass);
    hook2.position.set(width / 2 - 0.08, 1.85, -8.60);

    // 5. White enameled metal towel holder & chrome grab bar (Photo 7)
    const towelRack = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.36), matNickelSilver);
    towelRack.position.set(width / 2 - 0.10, 1.15, -7.80);
    const grabRail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), matNickelSilver);
    grabRail.position.set(width / 2 - 0.10, 1.10, -8.50);

    // 6. Frosted train window casting natural daylight into restroom (Photo 7)
    const restWindow = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.85, 0.65), new THREE.MeshPhysicalMaterial({ color: 0xdae8f5, roughness: 0.4, transmission: 0.7 }));
    restWindow.position.set(width / 2 - 0.06, 1.5, -8.75);

    // Warm restroom ceiling light
    const bathLight = new THREE.PointLight(0xffdfaa, 0.95, 4.5);
    bathLight.position.set(1.12, height - 0.25, -8.725);

    bathGroup.add(
      toiletBase, toiletSeat, toiletLid, flushPipe, flushTank,
      washNicheGroup, mirrorGroup, hook1, hook2, towelRack, grabRail, restWindow, bathLight
    );
    group.add(bathGroup);

    // 6. Soft Night Lighting along Central Ceiling
    for (let lz = -7.5; lz <= 7.5; lz += 3.8) {
      const lampGroup = new THREE.Group();
      lampGroup.position.set(0, height - 0.15, lz);

      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.06, 12), matBrass);
      const shade = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffe8bb })
      );
      shade.position.set(0, -0.1, 0);

      const light = new THREE.PointLight(0xffdfaa, 0.65, 5.0);
      light.position.set(0, -0.15, 0);

      lampGroup.add(lampBase, shade, light);
      group.add(lampGroup);
    }

    return group;
  };

  return { create };
})();

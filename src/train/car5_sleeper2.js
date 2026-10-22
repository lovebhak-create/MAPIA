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
    // Right exterior wall in berth area (Z = -7.5 to +10.0, length 17.5m)
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, 17.5), matExtGreen);
    wallR.position.set(width / 2 - 0.06, height / 2, 1.25);
    group.add(wallL, wallR);

    // Right exterior wall in Restroom area (Z = -7.5 to -10.0, length 2.5m)
    // Constructed with authentic Pullman dark mahogany interior and single small privacy window
    const rBathWallGroup = new THREE.Group();
    rBathWallGroup.position.set(width / 2 - 0.06, 0, 0);

    const rLower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.90, 2.50), matMahogany);
    rLower.position.set(0, 0.45, -8.75);
    const rSillTrim = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 2.50), matMahogany);
    rSillTrim.position.set(0, 0.90, -8.75);

    const rUpperHeight = height - 2.05;
    const rUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, rUpperHeight, 2.50), matMahogany);
    rUpper.position.set(0, 2.05 + rUpperHeight / 2, -8.75);
    const rHeaderTrim = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 2.50), matMahogany);
    rHeaderTrim.position.set(0, 2.05, -8.75);

    const rSolidNorth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 0.95), matMahogany);
    rSolidNorth.position.set(0, 1.475, -7.975);
    const rSolidSouth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 0.95), matMahogany);
    rSolidSouth.position.set(0, 1.475, -9.525);

    const rWinHeader = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.60), matMahogany);
    rWinHeader.position.set(0, 1.925, -8.75);
    const rWinSill = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.30, 0.60), matMahogany);
    rWinSill.position.set(0, 1.05, -8.75);

    rBathWallGroup.add(rLower, rSillTrim, rUpper, rHeaderTrim, rSolidNorth, rSolidSouth, rWinHeader, rWinSill);
    group.add(rBathWallGroup);

    // End Bulkheads with Interactive Sliding Doors
    const createBulkhead = (zPos) => {
      const bh = new THREE.Group();
      bh.position.set(0, 0, zPos);
      const postL = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
      postL.position.set(-1.125, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
      postR.position.set(1.125, height / 2, 0);
      // Transom spans completely from door top (2.05m) to ceiling (height) - ZERO GAP!
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.0, height - 2.05, 0.12), matMahogany);
      topTransom.position.set(0, 2.05 + (height - 2.05) / 2, 0);
      const transomCasing = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.05, 0.14), matMahogany);
      transomCasing.position.set(0, 2.05, 0);
      bh.add(postL, postR, topTransom, transomCasing);

      // Sliding Mahogany Door with authentic recessed pocket handle
      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.05, 0.05), matMahogany);
      sDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
      dWin.position.set(0, 0.35, 0);
      sDoor.add(dWin);

      if (typeof DoorManager !== 'undefined' && DoorManager.createRecessedHandle) {
        DoorManager.createRecessedHandle(sDoor, 0.36);
      }

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

    // Front wall of Restroom (facing berth section at Z = -7.5) - Solid 100% sealed partition wall!
    const bathWallFront = new THREE.Mesh(new THREE.BoxGeometry(1.14, height, 0.08), matMahogany);
    bathWallFront.position.set(1.12, height / 2, -7.5);
    bathGroup.add(bathWallFront);

    // Aisle-facing Wall (at X = 0.55): Contains the accessible Restroom Door directly facing the aisle!
    // North section of aisle wall (Z = -7.50 to -7.70, length 0.20m)
    const bathWallL_North = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 0.20), matMahogany);
    bathWallL_North.position.set(0.55, height / 2, -7.60);

    // South section of aisle wall (Z = -8.50 to -9.95, length 1.45m)
    const bathWallL_South = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 1.45), matMahogany);
    bathWallL_South.position.set(0.55, height / 2, -9.225);

    // Transom over doorway (Z = -7.70 to -8.50, width 0.80m, Y = 2.05 to height) - ZERO GAP!
    const bathTransom = new THREE.Mesh(new THREE.BoxGeometry(0.80, height - 2.04, 0.08), matMahogany);
    bathTransom.position.set(0.55, 2.05 + (height - 2.05) / 2, -8.10);

    const bathDoorCasing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.84), matMahogany);
    bathDoorCasing.position.set(0.55, 2.05, -8.10);

    const bathThreshold = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.025, 0.80), matBrass);
    bathThreshold.position.set(0.55, 0.015, -8.10);
    bathGroup.add(bathWallRear, bathWallL_North, bathWallL_South, bathTransom, bathDoorCasing, bathThreshold);

    // "TOILET" Brass Plaque on Aisle Wall Door Header facing the aisle
    const matToiletSign = new THREE.MeshStandardMaterial({ color: 0x141618, roughness: 0.4 });
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.10, 0.32), matToiletSign);
    signBox.position.set(0.50, height - 0.22, -8.10);
    const signPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.06, 0.28), matBrass);
    signPlaque.position.set(-0.01, 0, 0);
    signBox.add(signPlaque);
    bathGroup.add(signBox);

    // Interactive Swing Restroom Door on aisle wall opening inward against front wall (Photo 1 & 3)
    const bathDoorPivot = new THREE.Group();
    bathDoorPivot.position.set(0.55, 0, -7.70);

    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.04, 0.80), matMahogany);
    bathDoor.position.set(0, 1.02, -0.40);

    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.25, 0.38), new THREE.MeshPhysicalMaterial({ color: 0xc8d8e6, roughness: 0.35, transmission: 0.6 }));
    doorGlass.position.set(0.02, 0.22, 0);
    const bathPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.24), matBrass);
    bathPlaque.position.set(-0.025, 0.95, 0);
    const doorHandleOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), matBrass);
    doorHandleOuter.position.set(-0.03, 0, -0.32);
    const doorHandleInner = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), matBrass);
    doorHandleInner.position.set(0.03, 0, -0.32);
    bathDoor.add(doorGlass, bathPlaque, doorHandleOuter, doorHandleInner);
    bathDoorPivot.add(bathDoor);
    bathGroup.add(bathDoorPivot);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: bathDoorPivot,
        type: 'swing',
        openAngle: -Math.PI / 2,
        x: 0.55,
        z: -89.0 - 8.10,
        doorBox: {
          minX: 0.45,
          maxX: 0.65,
          minZ: -89.0 - 8.50,
          maxZ: -89.0 - 7.70
        },
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

    // Arched mahogany wall backplate with molded cast rim
    const nicheBackplate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.72, 0.48), matMahogany);
    nicheBackplate.position.set(0.16, 0.28, 0);
    const nicheArch = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16, 1, false, 0, Math.PI), matMahogany);
    nicheArch.rotation.z = Math.PI / 2;
    nicheArch.position.set(0.16, 0.64, 0);

    // Round Sunken Nickel Metal Washbasin Sink (Photo 2 & 7)
    // Deep concave recessed bowl with drain
    const basinRim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 8, 20), matNickelSilver);
    basinRim.rotation.x = Math.PI / 2;
    basinRim.position.set(0, 0.02, 0);

    const basinCavity = new THREE.Mesh(
      new THREE.CylinderGeometry(0.155, 0.08, 0.12, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xc8cbd0, roughness: 0.25, metalness: 0.85, side: THREE.DoubleSide })
    );
    basinCavity.position.set(0, -0.04, 0);

    const basinBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.01, 16), matNickelSilver);
    basinBottom.position.set(0, -0.10, 0);

    const drainNickel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 12), matNickelSilver);
    drainNickel.position.set(0, -0.095, 0);
    const drainHole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.014, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }));
    drainHole.position.set(0, -0.094, 0);

    const basinSupport = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.46), matMahogany);
    basinSupport.position.set(0.02, -0.12, 0);

    // Vintage nickel arched spout & soap niche (Photo 7)
    const nickelSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), matNickelSilver);
    nickelSpout.position.set(0.08, 0.12, 0);
    const spoutNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.08, 8), matNickelSilver);
    spoutNozzle.rotation.z = Math.PI / 3.0;
    spoutNozzle.position.set(0.04, 0.15, 0);

    const soapNiche = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.12), matNickelSilver);
    soapNiche.position.set(0.14, 0.32, 0);

    // Highly Visible Animated Glowing Flowing Water Stream & Basin Pool (interactive on E/click)
    const matWaterStream = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      emissive: 0x3399ee,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.88,
      roughness: 0.1
    });
    const waterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.016, 0.22, 10), matWaterStream);
    waterStream.position.set(0.01, 0.02, 0);
    waterStream.visible = false;

    const matWaterPuddle = new THREE.MeshStandardMaterial({
      color: 0x55bbff,
      emissive: 0x2288dd,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.82
    });
    const waterPuddle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 14), matWaterPuddle);
    waterPuddle.position.set(0, -0.09, 0);
    waterPuddle.visible = false;

    washNicheGroup.add(
      nicheBackplate, nicheArch,
      basinRim, basinCavity, basinBottom, drainNickel, drainHole,
      basinSupport, nickelSpout, spoutNozzle, soapNiche, waterStream, waterPuddle
    );

    if (typeof SinkManager !== 'undefined') {
      SinkManager.registerSink({
        x: 1.42,
        y: 2.02,
        z: -89.0 - 8.15,
        waterStream: waterStream,
        waterPuddle: waterPuddle,
        name: '5호차 세면대'
      });
    }

    // Single small frosted train privacy window on Right Mahogany Wall
    const matFrostedGlass = new THREE.MeshPhysicalMaterial({
      color: 0xc8ddf0,
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.8
    });
    const restWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.60, 0.56), matFrostedGlass);
    restWindow.position.set(width / 2 - 0.06, 1.50, -8.75);

    // Small window mahogany hollow moulded frame casing (4 border trim pieces)
    const fTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.64), matMahogany);
    fTop.position.set(width / 2 - 0.06, 1.82, -8.75);
    const fBottom = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.64), matMahogany);
    fBottom.position.set(width / 2 - 0.06, 1.18, -8.75);
    const fNorth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.68, 0.04), matMahogany);
    fNorth.position.set(width / 2 - 0.06, 1.50, -8.45);
    const fSouth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.68, 0.04), matMahogany);
    fSouth.position.set(width / 2 - 0.06, 1.50, -9.05);

    // Window Sash divider bars (authentic 4-pane Pullman bathroom privacy window)
    const muntinH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.56), matMahogany);
    muntinH.position.set(width / 2 - 0.06, 1.50, -8.75);
    const muntinV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.60, 0.025), matMahogany);
    muntinV.position.set(width / 2 - 0.06, 1.50, -8.75);

    // Warm restroom ceiling light
    const bathLight = new THREE.PointLight(0xffdfaa, 0.95, 4.5);
    bathLight.position.set(1.12, height - 0.25, -8.725);

    bathGroup.add(
      toiletBase, toiletSeat, toiletLid, flushPipe, flushTank,
      washNicheGroup, restWindow, fTop, fBottom, fNorth, fSouth, muntinH, muntinV, bathLight
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

// Car 4: 1st Class Pullman Sleeper Car (1등석 침대차)
// Wide continuous side corridor connected directly to entrance doors,
// with spacious luxury suites featuring large prominent beds, white linen, pillows, quilts, vanities, and armoires.
const Car4_Sleeper1 = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car4_Sleeper1';

    // Position: Centered at Z = -67.0 (Spans Z = -57.0 to Z = -77.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -67.0);

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
      roughness: 0.35,
      metalness: 0.2
    });

    // Bed materials
    const matBedSheet = new THREE.MeshStandardMaterial({
      color: 0xfaf8f2, // Crisp white Pullman linen sheet
      roughness: 0.9,
      metalness: 0.02
    });

    const matBedPillow = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Fluffy white pillows
      roughness: 0.95,
      metalness: 0.01
    });

    const matBedQuilt = new THREE.MeshStandardMaterial({
      color: 0x5a121d, // Luxury deep burgundy velvet quilt
      roughness: 0.7,
      metalness: 0.15
    });

    const matGoldTrim = new THREE.MeshStandardMaterial({
      color: 0xdfb142,
      roughness: 0.35,
      metalness: 0.85
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matPorcelain = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.15,
      metalness: 0.05
    });

    const matMirror = new THREE.MeshStandardMaterial({
      color: 0xbbddff,
      roughness: 0.05,
      metalness: 0.95
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // 1. Floor & Full Carpet
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    const carpetMesh = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, 0.01, length), matCarpet);
    carpetMesh.position.set(0, 0.01, 0);
    group.add(carpetMesh);

    // 2. Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.1, 0.1, length),
      new THREE.MeshStandardMaterial({ color: 0xeadcc6, roughness: 0.8 })
    );
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    // 3. Exterior Side Walls with Windows
    const createSideWall = (xSide) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(xSide * (width / 2 - 0.06), 0, 0);

      // Lower mahogany wainscoting (spans Y = 0.0m to 0.90m)
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, length), matMahogany);
      lower.position.set(0, 0.45, 0);
      wGroup.add(lower);

      // Window sill trim running the full length of the car at Y = 0.90m
      const sillTrim = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, length), matMahogany);
      sillTrim.position.set(0, 0.90, 0);
      wGroup.add(sillTrim);

      // Upper wall above windows - spans completely from Y = 2.05m up to the ceiling (height = 2.85m)
      const upperHeight = height - 2.05; // 0.80m
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.12, upperHeight, length), matMahogany);
      upper.position.set(0, 2.05 + upperHeight / 2, 0);
      wGroup.add(upper);

      // Window header casing moulding trim running the full length of the car at Y = 2.05m
      const headerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, length), matMahogany);
      headerTrim.position.set(0, 2.05, 0);
      wGroup.add(headerTrim);

      // Windows along length
      const numWindows = 8;
      const windowSpan = (length - 4.0) / numWindows;
      for (let i = 0; i < numWindows; i++) {
        const wz = -length / 2 + 2.5 + i * windowSpan;

        // If this is the right wall (xSide === 1) in the bathroom section (i === 0, Z = -7.5 to -10.0):
        if (xSide === 1 && i === 0) {
          // Bathroom exterior wall is a solid mahogany wall with ONLY a single small privacy window!
          const solidNorth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 0.85), matMahogany);
          solidNorth.position.set(0, 1.475, -7.925);
          const solidSouth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 1.05), matMahogany);
          solidSouth.position.set(0, 1.475, -9.475);

          const winHeader = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.60), matMahogany);
          winHeader.position.set(0, 1.925, -8.65);
          const winSill = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.30, 0.60), matMahogany);
          winSill.position.set(0, 1.05, -8.65);

          const matFrostedGlass = new THREE.MeshPhysicalMaterial({
            color: 0xc8ddf0,
            roughness: 0.25,
            metalness: 0.1,
            transmission: 0.7,
            transparent: true,
            opacity: 0.8
          });
          const smallGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.60, 0.56), matFrostedGlass);
          smallGlass.position.set(0, 1.50, -8.65);

          // Small window mahogany hollow moulded frame casing (4 border trim pieces)
          const fTop = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.64), matMahogany);
          fTop.position.set(0, 1.82, -8.65);
          const fBottom = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.64), matMahogany);
          fBottom.position.set(0, 1.18, -8.65);
          const fNorth = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.68, 0.04), matMahogany);
          fNorth.position.set(0, 1.50, -8.35);
          const fSouth = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.68, 0.04), matMahogany);
          fSouth.position.set(0, 1.50, -8.95);

          // Window Sash divider bars (authentic 4-pane Pullman bathroom privacy window)
          const muntinH = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.56), matMahogany);
          muntinH.position.set(0, 1.50, -8.65);
          const muntinV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.60, 0.025), matMahogany);
          muntinV.position.set(0, 1.50, -8.65);

          wGroup.add(solidNorth, solidSouth, winHeader, winSill, smallGlass, fTop, fBottom, fNorth, fSouth, muntinH, muntinV);
          continue;
        }

        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.18, windowSpan * 0.75), matGlass);
        glass.position.set(0, 1.49, wz);
        wGroup.add(glass);

        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.18, windowSpan * 0.25), matMahogany);
        pillar.position.set(0, 1.49, wz + windowSpan * 0.5);
        wGroup.add(pillar);
      }
      return wGroup;
    };
    group.add(createSideWall(-1));
    group.add(createSideWall(1));

    // ==========================================
    // 4. END BULKHEADS WITH CENTER DOORS
    // Seamless connection to Car 3 (Z = +10.0) and Car 5 (Z = -10.0)
    // ==========================================
    const createCarEndBulkhead = (zPos) => {
      const bh = new THREE.Group();
      bh.position.set(0, 0, zPos);

      // Center doorway (width 1.0m, matching gangway from Car 3 / Car 5!)
      const postL = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
      postL.position.set(-1.125, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
      postR.position.set(1.125, height / 2, 0);

      // Transom spans completely from door top (2.05m) to ceiling (height) - ZERO GAP!
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.0, height - 2.05, 0.12), matMahogany);
      topTransom.position.set(0, 2.05 + (height - 2.05) / 2, 0);
      const transomCasing = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.05, 0.14), matMahogany);
      transomCasing.position.set(0, 2.05, 0);

      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.05, 0.05), matMahogany);
      sDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
      dWin.position.set(0, 0.35, 0);
      sDoor.add(dWin);

      if (typeof DoorManager !== 'undefined' && DoorManager.createRecessedHandle) {
        DoorManager.createRecessedHandle(sDoor, 0.36);
      }

      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: sDoor,
          type: 'slide',
          openOffset: 0.92,
          x: 0,
          z: -67.0 + zPos,
          name: zPos > 0 ? '4호차 앞문' : '4호차 뒷문'
        });
      }

      bh.add(postL, postR, topTransom, transomCasing, sDoor);
      return bh;
    };
    group.add(createCarEndBulkhead(length / 2));  // Front door (from Car 3)
    group.add(createCarEndBulkhead(-length / 2)); // Rear door (to Car 5)

    // ==========================================
    // 5. ENTRANCE FOYERS & COMPLETE WALL FINISH (마감 완비)
    // Front Foyer (Z = +7.5 to +10.0)
    // Rear Foyer (Z = -10.0 to -7.5)
    // ==========================================
    // Front Foyer right-side enclosed linen closet (Z = 7.5 to 10.0, X: 0.45 to 1.69)
    const frontClosetWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 2.5), matMahogany);
    frontClosetWall.position.set(0.45, height / 2, 8.75);
    const frontClosetCap = new THREE.Mesh(new THREE.BoxGeometry(1.24, height, 0.1), matMahogany);
    frontClosetCap.position.set(1.07, height / 2, 7.5);
    group.add(frontClosetWall, frontClosetCap);

    // Rear Foyer right-side: 1st Class Luxury Private Restroom (화장실 - Photo 4 Art Deco Masterpiece)
    // Enclosed compactly in the right corner (Z = -9.95 to -7.5, X: 0.55 to 1.69), leaving corridor 100% open!
    const bathGroup = new THREE.Group();

    // Mosaic Luxury Floor (Photo 4)
    const matMosaicFloor = new THREE.MeshStandardMaterial({
      map: Textures.artDecoMosaic,
      roughness: 0.3,
      metalness: 0.1
    });
    const bathFloor = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.02, 2.45), matMosaicFloor);
    bathFloor.position.set(1.12, 0.015, -8.725);
    bathFloor.receiveShadow = true;
    bathGroup.add(bathFloor);

    // Enclosing Partition Walls - Solid rear wall seals the car completely!
    const bathWallRear = new THREE.Mesh(new THREE.BoxGeometry(1.14, height, 0.08), matMahogany);
    bathWallRear.position.set(1.12, height / 2, -9.95);

    // Front partition wall facing Suite 3 - 100% solid, seamless partition sealing the restroom from Suite 3!
    const bathWallFront = new THREE.Mesh(new THREE.BoxGeometry(1.14, height, 0.08), matMahogany);
    bathWallFront.position.set(1.12, height / 2, -7.50);

    // Aisle-facing Wall (at X = 0.55): Contains the accessible Restroom Door directly facing the hallway!
    // North section of aisle wall (Z = -7.50 to -7.70, length 0.20m)
    const bathWallL_North = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 0.20), matMahogany);
    bathWallL_North.position.set(0.55, height / 2, -7.60);

    // South section of aisle wall (Z = -8.50 to -9.95, length 1.45m)
    const bathWallL_South = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 1.45), matMahogany);
    bathWallL_South.position.set(0.55, height / 2, -9.225);

    // Transom over doorway (Z = -7.70 to -8.50, width 0.80m, Y = 2.05 to height) - ZERO GAP!
    const bathTransom = new THREE.Mesh(new THREE.BoxGeometry(0.08, height - 2.05, 0.80), matMahogany);
    bathTransom.position.set(0.55, 2.05 + (height - 2.05) / 2, -8.10);

    // Doorway header casing trim
    const bathDoorCasing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.84), matMahogany);
    bathDoorCasing.position.set(0.55, 2.05, -8.10);

    // Brass Threshold
    const bathThreshold = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.025, 0.80), matBrass);
    bathThreshold.position.set(0.55, 0.015, -8.10);

    // "1등석 화장실 / RESTROOM" Brass Sign Plaque mounted on aisle wall header facing player
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.10, 0.32), new THREE.MeshStandardMaterial({ color: 0x141618, roughness: 0.4 }));
    signBox.position.set(0.50, height - 0.22, -8.10);
    const signPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.06, 0.28), matGoldTrim);
    signPlaque.position.set(-0.01, 0, 0);
    signBox.add(signPlaque);
    bathGroup.add(signBox);

    // Interactive Swing Restroom Door on Aisle Wall (facing player in the hallway!)
    // Pivot at (0.55, 0, -7.70), door spans along -Z to -8.44 (width 0.74m).
    // Swings inward into bathroom against the front partition wall (openAngle: -Math.PI / 2).
    const bathDoorPivot = new THREE.Group();
    bathDoorPivot.position.set(0.55, 0, -7.70);

    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.04, 0.80), matMahogany);
    bathDoor.position.set(0, 1.02, -0.40);

    // Full-length Art Deco Mirror on inner face (facing inside the restroom)
    const bathDoorMirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.35, 0.38), matMirror);
    bathDoorMirror.position.set(0.02, 0.18, 0);

    // Brass Plaque on outer face (facing the aisle)
    const bathPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.07, 0.24), matGoldTrim);
    bathPlaque.position.set(-0.02, 0.45, 0);

    // Handles on the latch edge (at Z = -0.32 relative to door center)
    const doorHandleOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), matBrass);
    doorHandleOuter.position.set(-0.03, 0, -0.32);
    const doorHandleInner = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), matBrass);
    doorHandleInner.position.set(0.03, 0, -0.32);
    bathDoor.add(bathDoorMirror, bathPlaque, doorHandleOuter, doorHandleInner);
    bathDoorPivot.add(bathDoor);
    bathGroup.add(bathDoorPivot);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: bathDoorPivot,
        type: 'swing',
        openAngle: -Math.PI / 2,
        x: 0.55,
        z: -67.0 - 8.10,
        doorBox: {
          minX: 0.45,
          maxX: 0.65,
          minZ: -67.0 - 8.50,
          maxZ: -67.0 - 7.70
        },
        name: '4호차 1등석 화장실 문'
      });
    }

    // Inside 1st Class Luxury Lavatory Fixtures (Photo 4):
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe0e5ea, roughness: 0.15, metalness: 0.95 });
    const matDarkMarble = new THREE.MeshStandardMaterial({ color: 0x141816, roughness: 0.15, metalness: 0.15 });
    const matDarkRosewood = new THREE.MeshStandardMaterial({ color: 0x2b130e, roughness: 0.35, metalness: 0.1 });

    // 1. Curved Black/Dark Marble Vanity Countertop & Cabinet (Mounted on Right Mahogany Wall)
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(1.42, 0, -8.15);

    const vBaseCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.78, 0.70), matMahogany);
    vBaseCabinet.position.set(0, 0.39, 0);
    const vTopMarble = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.74), matDarkMarble);
    vTopMarble.position.set(0, 0.80, 0);

    // Undermount Oval White Porcelain Sink Basin with Inset Drain (Photo 4)
    // Deep concave recessed bowl
    const basinRim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 8, 20), matPorcelain);
    basinRim.rotation.x = Math.PI / 2;
    basinRim.position.set(0, 0.81, 0.04);

    const basinCavity = new THREE.Mesh(
      new THREE.CylinderGeometry(0.155, 0.08, 0.12, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.15, side: THREE.DoubleSide })
    );
    basinCavity.position.set(0, 0.75, 0.04);

    const basinBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.01, 16), matPorcelain);
    basinBottom.position.set(0, 0.69, 0.04);

    const drainGold = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 12), matGoldTrim);
    drainGold.position.set(0, 0.695, 0.04);
    const drainHole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.014, 8), matDarkMarble);
    drainHole.position.set(0, 0.696, 0.04);

    // Polished Chrome/Gold Gooseneck Faucet & Mixer Knobs (Photo 4)
    const faucetArch = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 16, Math.PI), matGoldTrim);
    faucetArch.position.set(0.08, 0.94, 0.04);
    faucetArch.rotation.y = 0;
    const knobL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8), matGoldTrim);
    knobL.position.set(0.14, 0.85, -0.05);
    const knobR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8), matGoldTrim);
    knobR.position.set(0.14, 0.85, 0.13);

    // Luxury Amenities on the Marble Vanity Counter (Photo 4):
    // A. White Orchid Plant in Black Ceramic Pot
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
    pot.position.set(-0.14, 0.87, 0.22);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 6), new THREE.MeshStandardMaterial({ color: 0x224418 }));
    stem.position.set(-0.14, 0.98, 0.22);
    const orchidPetals = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    orchidPetals.position.set(-0.14, 1.08, 0.22);
    pot.add(stem, orchidPetals);

    // B. Glass Fragrance Reed Diffuser with Wooden Sticks
    const diffuserBottle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.05, 0.035), new THREE.MeshPhysicalMaterial({ color: 0x996633, transmission: 0.8 }));
    diffuserBottle.position.set(-0.14, 0.86, -0.22);
    for (let r = 0; r < 4; r++) {
      const reedStick = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.16, 4), new THREE.MeshStandardMaterial({ color: 0xcca878 }));
      reedStick.position.set(-0.14, 0.94, -0.22 + (r - 1.5) * 0.008);
      reedStick.rotation.x = (r - 1.5) * 0.15;
      vanityGroup.add(reedStick);
    }

    // C. Twin Amber Glass Pump Dispenser Bottles on Wall Bracket
    const pumpBracket = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.14), matGoldTrim);
    pumpBracket.position.set(0.20, 1.15, -0.05);
    const pumpBottle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 10), new THREE.MeshPhysicalMaterial({ color: 0x7a431d, transmission: 0.7 }));
    pumpBottle1.position.set(0.20, 1.22, -0.09);
    const pumpBottle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 10), new THREE.MeshPhysicalMaterial({ color: 0x7a431d, transmission: 0.7 }));
    pumpBottle2.position.set(0.20, 1.22, -0.01);

    // D. Black Lacquer Tray with Folded White Luxury Hand Towels
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.14), new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.1 }));
    tray.position.set(-0.12, 0.84, -0.05);
    const towelFold1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    towelFold1.position.set(-0.12, 0.86, -0.08);
    const towelFold2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    towelFold2.position.set(-0.12, 0.86, -0.02);

    vanityGroup.add(
      vBaseCabinet, vTopMarble,
      basinRim, basinCavity, basinBottom, drainGold, drainHole,
      faucetArch, knobL, knobR, pot, diffuserBottle, pumpBracket, pumpBottle1, pumpBottle2, tray, towelFold1, towelFold2
    );

    // Highly Visible Animated Glowing Flowing Water Stream & Basin Pool (interactive on E/click)
    const matWaterStream = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      emissive: 0x3399ee,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.88,
      roughness: 0.1
    });
    const waterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.016, 0.21, 10), matWaterStream);
    waterStream.position.set(0.02, 0.805, 0.04);
    waterStream.visible = false;

    const matWaterPuddle = new THREE.MeshStandardMaterial({
      color: 0x55bbff,
      emissive: 0x2288dd,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.82
    });
    const waterPuddle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 14), matWaterPuddle);
    waterPuddle.position.set(0, 0.702, 0.04);
    waterPuddle.visible = false;

    vanityGroup.add(waterStream, waterPuddle);

    if (typeof SinkManager !== 'undefined') {
      SinkManager.registerSink({
        x: 1.42,
        y: 2.02,
        z: -67.0 - 8.15,
        waterStream: waterStream,
        waterPuddle: waterPuddle,
        name: '4호차 1등석 세면대'
      });
    }

    // 2. Luxury Porcelain Toilet with Dark Rosewood/Mahogany Seat & Lid (Photo 4)
    const toilet = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.44, 16), matPorcelain);
    toilet.position.set(1.12, 0.22, -9.50);
    const tSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 16), matDarkRosewood);
    tSeat.position.set(1.12, 0.45, -9.50);
    const tLid = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.03), matDarkRosewood);
    tLid.position.set(1.12, 0.70, -9.70);
    tLid.rotation.x = -0.15;

    // Flush pipe against sealed rear wall
    const flushPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.45, 8), matChrome);
    flushPipe.position.set(1.12, 1.28, -9.90);
    const flushTank = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.2), matPorcelain);
    flushTank.position.set(1.12, 2.05, -9.85);

    // Brass Toilet Paper Dispenser with Roll
    const tpDispenser = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.85 }));
    tpDispenser.rotation.z = Math.PI / 2;
    tpDispenser.position.set(0.65, 0.55, -9.40);

    // Warm Ambient Light Fixture
    const vLight = new THREE.PointLight(0xffeedd, 0.95, 4.5);
    vLight.position.set(1.12, height - 0.25, -8.65);

    bathGroup.add(
      bathWallRear, bathWallFront, bathWallL_North, bathWallL_South, bathTransom, bathDoorCasing, bathThreshold,
      vanityGroup, toilet, tSeat, tLid, flushPipe, flushTank, tpDispenser, vLight
    );
    group.add(bathGroup);

    // ==========================================
    // 6. CONTINUOUS SIDE CORRIDOR (복도 - Photo 1 & 2 Pullman Hallway)
    // Left side: X = -1.44 to -0.35 (width ~1.1m)
    // Corridor Divider Wall: X = -0.35
    // ==========================================
    const corridorDividerX = -0.35;

    // Brass Handrail along Corridor Left Wall (Photo 1)
    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, length - 1.0, 8), matBrass);
    handrail.rotation.x = Math.PI / 2;
    handrail.position.set(-width / 2 + 0.18, 1.0, 0);
    group.add(handrail);

    // Iconic Pullman "QUIET" Cast-Iron Plaque (Photo 2)
    const matQuietSign = new THREE.MeshStandardMaterial({
      map: Textures.quietSign,
      roughness: 0.4,
      metalness: 0.1
    });
    const quietPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.36), matQuietSign);
    quietPlaque.position.set(corridorDividerX - 0.06, 1.80, 6.4);

    // Metal Mailbox / Ticket Holder underneath the QUIET sign (Photo 2)
    const ticketBox = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.24), matBrass);
    ticketBox.position.set(corridorDividerX - 0.07, 1.55, 6.4);

    // Vintage Bakelite toggle switches on corridor wall (Photo 2)
    const switchPlate = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.08), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
    switchPlate.position.set(corridorDividerX - 0.06, 1.35, 6.4);
    group.add(quietPlaque, ticketBox, switchPlate);

    // Corridor Ceiling Art Deco Flush Lamps (Photo 1 & 2)
    for (let cz = -8.0; cz <= 8.0; cz += 4.0) {
      const lampGroup = new THREE.Group();
      lampGroup.position.set(-0.9, height - 0.15, cz);

      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.05, 12), matBrass);
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffe8bb })
      );
      globe.position.set(0, -0.09, 0);
      const cLight = new THREE.PointLight(0xffdfaa, 0.7, 4.5);
      cLight.position.set(0, -0.12, 0);

      lampGroup.add(lampBase, globe, cLight);
      group.add(lampGroup);
    }

    // ==========================================
    // 7. THREE LUXURY BEDROOM SUITES (방 3개 - Photo 1 & 3 Drawing Room & Compartment)
    // Suite 1: Z = +5.0 (Z = +2.5 to +7.5) - Drawing Room (드로잉 룸)
    // Suite 2: Z =  0.0 (Z = -2.5 to +2.5) - Pullman Stateroom (풀먼 스테이트룸)
    // Suite 3: Z = -5.0 (Z = -7.5 to -2.5) - Compartment (컴파트먼트)
    // ==========================================
    const suiteConfigs = [
      { zCenter: 5.0, roman: 'I', name: 'Suite I — Drawing Room' },
      { zCenter: 0.0, roman: 'II', name: 'Suite II — Pullman Stateroom' },
      { zCenter: -5.0, roman: 'III', name: 'Suite III — Compartment' }
    ];

    const partitionWidth = (width / 2 - 0.06) - corridorDividerX; // 1.44 - (-0.35) = 1.79m
    const partitionCenterX = (corridorDividerX + (width / 2 - 0.06)) / 2; // 0.545m

    // Partition walls at Z = +7.5, +2.5, -2.5, -7.5 (Flawlessly sealed!)
    [7.5, 2.5, -2.5, -7.5].forEach(pz => {
      const pWall = new THREE.Mesh(
        new THREE.BoxGeometry(partitionWidth, height, 0.1),
        matMahogany
      );
      pWall.position.set(partitionCenterX, height / 2, pz);
      group.add(pWall);
    });

    suiteConfigs.forEach((cfg) => {
      const sCenter = cfg.zCenter;

      // Corridor Wall along X = corridorDividerX (-0.35)
      const wallP1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 1.95), matMahogany);
      wallP1.position.set(corridorDividerX, height / 2, sCenter - 1.525);

      const wallP2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 1.95), matMahogany);
      wallP2.position.set(corridorDividerX, height / 2, sCenter + 1.525);

      // Door Transom over doorway spanning all the way down to door top (2.05m) - ZERO GAP!
      const transom = new THREE.Mesh(new THREE.BoxGeometry(0.1, height - 2.05, 1.1), matMahogany);
      transom.position.set(corridorDividerX, 2.05 + (height - 2.05) / 2, sCenter);
      const transomCasing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 1.14), matMahogany);
      transomCasing.position.set(corridorDividerX, 2.05, sCenter);

      // Door frame posts
      const dPostL = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, 0.06), matMahogany);
      dPostL.position.set(corridorDividerX, height / 2, sCenter - 0.55);
      const dPostR = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, 0.06), matMahogany);
      dPostR.position.set(corridorDividerX, height / 2, sCenter + 0.55);

      // Sliding mahogany suite door with recessed brass pocket handle
      const suiteDoor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.05, 1.0), matMahogany);
      suiteDoor.position.set(corridorDividerX - 0.06, 1.025, sCenter);

      // Recessed pocket handles on both inner and outer door faces
      const matHandleBrass = new THREE.MeshStandardMaterial({ color: 0xdfb142, roughness: 0.3, metalness: 0.85 });
      const matHandleCup = new THREE.MeshStandardMaterial({ color: 0x1a160e, roughness: 0.5 });
      [-0.026, 0.026].forEach(hx => {
        const hPlate = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.18, 0.065), matHandleBrass);
        hPlate.position.set(hx, 0, -0.36);
        const hCup = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.12, 0.038), matHandleCup);
        hCup.position.set(hx > 0 ? hx + 0.001 : hx - 0.001, 0, -0.36);
        suiteDoor.add(hPlate, hCup);
      });

      // Register interactive suite door (slides along corridor wall on Z axis, NEVER enters room!)
      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: suiteDoor,
          type: 'slide',
          axis: 'z',
          openOffset: 0.92,
          x: corridorDividerX,
          z: -67.0 + sCenter,
          name: cfg.name + ' 문'
        });
      }

      // Roman Numeral Room Badge next to door (Photo 1: VII, VI, I, II, III)
      const romanPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.18), new THREE.MeshStandardMaterial({ color: 0xefede8, roughness: 0.2, metalness: 0.1 }));
      romanPlate.position.set(corridorDividerX - 0.07, 1.65, sCenter + 0.72);
      const namePlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.32), matBrass);
      namePlate.position.set(corridorDividerX - 0.07, 1.45, sCenter + 0.72);

      group.add(wallP1, wallP2, transom, transomCasing, dPostL, dPostR, suiteDoor, romanPlate, namePlate);

      // ==========================================
      // SUITE INTERIOR FURNITURE (Photo 3 Drawing Room Plan)
      // Room Bounds: X: -0.30 to +1.40, Z: sCenter - 2.40 to sCenter + 2.40
      // ==========================================
      const roomGroup = new THREE.Group();
      roomGroup.position.set(0, 0, sCenter);

      // --- 1. LUXURY BED (Back window corner: X: 0.55 ~ 1.55, z: -2.35 ~ -0.45) ---
      const bedGroup = new THREE.Group();
      bedGroup.position.set(1.05, 0, -1.4);

      // Bed Frame
      const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 1.9), matMahogany);
      bedFrame.position.set(0, 0.2, 0);

      // Headboard (against rear partition wall z = -2.4)
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.85, 0.08), matMahogany);
      headboard.position.set(0, 0.65, -0.95);
      const headboardCrest = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.06, 0.1), matGoldTrim);
      headboardCrest.position.set(0, 1.08, -0.95);

      // Footboard
      const footboard = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.45, 0.08), matMahogany);
      footboard.position.set(0, 0.4, 0.95);

      // Thick Mattress & White Pullman Linen
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 1.8), matBedSheet);
      mattress.position.set(0, 0.42, 0);

      // White Folded Sheet Turndown
      const bedSheetTurn = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.04, 0.35), matBedSheet);
      bedSheetTurn.position.set(0, 0.54, -0.4);

      // Burgundy Velvet Quilt
      const quilt = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.08, 1.2), matBedQuilt);
      quilt.position.set(0, 0.52, 0.3);

      // Gold Bed Runner across foot
      const goldRunner = new THREE.Mesh(new THREE.BoxGeometry(0.97, 0.02, 0.25), matGoldTrim);
      goldRunner.position.set(0, 0.57, 0.65);

      // Two Fluffy White Pillows
      const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.32), matBedPillow);
      pillow1.position.set(-0.22, 0.58, -0.72);
      pillow1.rotation.x = -0.15;
      const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.32), matBedPillow);
      pillow2.position.set(0.22, 0.58, -0.72);
      pillow2.rotation.x = -0.15;

      bedGroup.add(bedFrame, headboard, headboardCrest, footboard, mattress, bedSheetTurn, quilt, goldRunner, pillow1, pillow2);
      roomGroup.add(bedGroup);

      // --- 2. CONVERTIBLE DRAWING ROOM SOFA / DAY COUCH (Photo 3 Diagram "DAY" configuration) ---
      const sofaGroup = new THREE.Group();
      sofaGroup.position.set(1.15, 0, 0.7);
      const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.38, 1.1), matMahogany);
      sofaBase.position.set(0, 0.19, 0);
      const sofaCushion = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.14, 1.06), matBedQuilt);
      sofaCushion.position.set(0, 0.45, 0);
      const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.48, 1.06), matBedQuilt);
      sofaBack.position.set(0.24, 0.65, 0);
      const bolster1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.50, 12), matBedQuilt);
      bolster1.rotation.z = Math.PI / 2;
      bolster1.position.set(0, 0.54, -0.45);
      const bolster2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.50, 12), matBedQuilt);
      bolster2.rotation.z = Math.PI / 2;
      bolster2.position.set(0, 0.54, 0.45);
      sofaGroup.add(sofaBase, sofaCushion, sofaBack, bolster1, bolster2);
      roomGroup.add(sofaGroup);

      // --- 3. BEDSIDE NIGHTSTAND (Separated from bed: X: 0.15, z: -2.15) ---
      const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.65, 0.35), matMahogany);
      nightstand.position.set(0.15, 0.325, -2.15);

      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.03, 12), matBrass);
      lampBase.position.set(0.15, 0.665, -2.15);
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8), matBrass);
      lampStem.position.set(0.15, 0.76, -2.15);
      const lampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.13, 12),
        new THREE.MeshBasicMaterial({ color: 0xffdfaa })
      );
      lampShade.position.set(0.15, 0.88, -2.15);
      const lampLight = new THREE.PointLight(0xffbe6b, 0.7, 3.5);
      lampLight.position.set(0.15, 0.86, -2.15);

      roomGroup.add(nightstand, lampBase, lampStem, lampShade, lampLight);

      // --- 4. WARDROBE / ARMOIRE & LUGGAGE LOCKER (Front corridor corner: X: 0.05, z: +2.05) ---
      const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.1, 0.65), matMahogany);
      wardrobe.position.set(0.05, 1.05, 2.0);
      const wHandle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8), matBrass);
      wHandle1.position.set(0.28, 1.05, 1.95);
      const wHandle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8), matBrass);
      wHandle2.position.set(0.28, 1.05, 2.05);
      roomGroup.add(wardrobe, wHandle1, wHandle2);

      // --- 5. VANITY DESK WITH SINK & OVAL MIRROR (Front window corner: X: 1.25, z: +2.0) ---
      const vanityGroup = new THREE.Group();
      vanityGroup.position.set(1.25, 0, 2.0);

      const vTable = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.82, 0.65), matMahogany);
      vTable.position.set(0, 0.41, 0);

      const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.12, 16), matPorcelain);
      basin.position.set(0, 0.84, 0);

      const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), matBrass);
      faucet.position.set(0.16, 0.94, 0);

      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.75, 0.45), matMirror);
      mirror.position.set(0.24, 1.55, 0);
      const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.79, 0.49), matBrass);
      mirrorFrame.position.set(0.23, 1.55, 0);

      vanityGroup.add(vTable, basin, faucet, mirror, mirrorFrame);
      roomGroup.add(vanityGroup);

      // --- 6. UPHOLSTERED PARLOR ARMCHAIR (Photo 3 Diagram) ---
      const armchair = new THREE.Group();
      armchair.position.set(0.25, 0, 1.25);
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.35, 0.48), matBedQuilt);
      seatCushion.position.set(0, 0.22, 0);
      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.44, 0.1), matBedQuilt);
      seatBack.position.set(0, 0.55, 0.20);
      armchair.add(seatCushion, seatBack);
      roomGroup.add(armchair);

      // --- 7. VELVET WINDOW DRAPERIES (Window side) ---
      const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.25), matBedQuilt);
      curtainL.position.set(width / 2 - 0.15, 1.5, -0.8);
      const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.25), matBedQuilt);
      curtainR.position.set(width / 2 - 0.15, 1.5, 0.8);
      roomGroup.add(curtainL, curtainR);

      group.add(roomGroup);
    });

    return group;
  };

  return { create };
})();

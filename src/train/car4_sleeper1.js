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
    const width = 3.0;
    const height = 2.7;

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

      // Lower mahogany wainscoting
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, length), matMahogany);
      lower.position.set(0, 0.45, 0);
      wGroup.add(lower);

      // Upper wall above windows
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, length), matMahogany);
      upper.position.set(0, height - 0.3, 0);
      wGroup.add(upper);

      // Windows along length
      const numWindows = 8;
      const windowSpan = (length - 4.0) / numWindows;
      for (let i = 0; i < numWindows; i++) {
        const wz = -length / 2 + 2.5 + i * windowSpan;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, windowSpan * 0.75), matGlass);
        glass.position.set(0, 1.5, wz);
        wGroup.add(glass);

        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.2, windowSpan * 0.25), matMahogany);
        pillar.position.set(0, 1.5, wz + windowSpan * 0.5);
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

      // Center doorway (width 1.1m, matching gangway from Car 3 / Car 5!)
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.95, height, 0.12), matMahogany);
      postL.position.set(-1.0, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.95, height, 0.12), matMahogany);
      postR.position.set(1.0, height / 2, 0);
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.12), matMahogany);
      topTransom.position.set(0, height - 0.3, 0);

      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.05, 0.05), matMahogany);
      sDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
      dWin.position.set(0, 0.35, 0);
      sDoor.add(dWin);

      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: sDoor,
          type: 'slide',
          openOffset: 0.88,
          x: 0,
          z: -67.0 + zPos,
          name: zPos > 0 ? '4호차 앞문' : '4호차 뒷문'
        });
      }

      bh.add(postL, postR, topTransom, sDoor);
      return bh;
    };
    group.add(createCarEndBulkhead(length / 2));  // Front door (from Car 3)
    group.add(createCarEndBulkhead(-length / 2)); // Rear door (to Car 5)

    // ==========================================
    // 5. ENTRANCE FOYERS & COMPLETE WALL FINISH (마감 완비)
    // Front Foyer (Z = +7.5 to +10.0)
    // Rear Foyer (Z = -10.0 to -7.5)
    // ==========================================
    // Front Foyer right-side enclosed linen closet (Z = 7.5 to 10.0, X: 0.45 to 1.44)
    const frontClosetWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 2.5), matMahogany);
    frontClosetWall.position.set(0.45, height / 2, 8.75);
    const frontClosetCap = new THREE.Mesh(new THREE.BoxGeometry(0.95, height, 0.1), matMahogany);
    frontClosetCap.position.set(0.95, height / 2, 7.5);
    group.add(frontClosetWall, frontClosetCap);

    // Rear Foyer right-side: 1st Class Luxury Private Restroom (화장실 - Photo 5 Architecture)
    // Enclosed on the right (Z = -10.0 to -7.5, X: 0.20 to 1.44), Corridor continues straight on the left!
    const bathWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 2.5), matMahogany);
    bathWallL.position.set(0.20, height / 2, -8.75);
    const bathWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.5, height, 0.08), matMahogany);
    bathWallFront.position.set(1.15, height / 2, -7.5);
    const bathTransom = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.08), matMahogany);
    bathTransom.position.set(0.55, height - 0.3, -7.5);

    // Luxury Restroom Door (Interactive sliding door)
    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.05, 0.04), matMahogany);
    bathDoor.position.set(0.55, 1.025, -7.5);
    const bathPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.05), matBrass);
    bathPlaque.position.set(0, 0.45, 0.03);
    bathDoor.add(bathPlaque);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: bathDoor,
        type: 'slide',
        openOffset: 0.62,
        x: 0.55,
        z: -67.0 - 7.5,
        name: '4호차 1등석 화장실 문'
      });
    }

    // Inside 1st Class Luxury Lavatory Fixtures:
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe0e5ea, roughness: 0.2, metalness: 0.9 });
    const matMarble = new THREE.MeshStandardMaterial({ color: 0xedeae4, roughness: 0.2 });

    const toilet = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.42, 12), matPorcelain);
    toilet.position.set(0.85, 0.21, -9.2);
    const tSeat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.42), matMahogany);
    tSeat.position.set(0.85, 0.44, -9.2);
    const fPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8), matChrome);
    fPipe.position.set(0.85, 1.25, -9.6);
    const fTank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.2), matPorcelain);
    fTank.position.set(0.85, 1.95, -9.55);

    // Marble Vanity with Inset Sink
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.78, 0.55), matMarble);
    vanity.position.set(0.85, 0.39, -8.0);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), matGoldTrim);
    faucet.position.set(0.85, 0.86, -7.8);
    const vMirror = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.02), matChrome);
    vMirror.position.set(0.85, 1.4, -7.72);
    const vLight = new THREE.PointLight(0xffdfaa, 0.75, 3.5);
    vLight.position.set(0.85, height - 0.3, -8.5);

    group.add(bathWallL, bathWallFront, bathTransom, bathDoor, toilet, tSeat, fPipe, fTank, vanity, faucet, vMirror, vLight);

    // ==========================================
    // 6. CONTINUOUS SIDE CORRIDOR (복도)
    // Left side: X = -1.44 to -0.35 (width ~1.1m)
    // Corridor Divider Wall: X = -0.35
    // ==========================================
    const corridorDividerX = -0.35;

    // Brass Handrail along Corridor Left Wall
    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, length - 1.0, 8), matBrass);
    handrail.rotation.x = Math.PI / 2;
    handrail.position.set(-width / 2 + 0.18, 1.0, 0);
    group.add(handrail);

    // Corridor Ceiling Art Deco Globe Lamps
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
    // 7. THREE LUXURY BEDROOM SUITES (방 3개)
    // Suite 1: Z = +5.0 (Z = +2.5 to +7.5)
    // Suite 2: Z =  0.0 (Z = -2.5 to +2.5)
    // Suite 3: Z = -5.0 (Z = -7.5 to -2.5)
    // ==========================================
    const suiteConfigs = [
      { zCenter: 5.0, name: 'Suite 1 - Drawing Room' },
      { zCenter: 0.0, name: 'Suite 2 - Pullman Stateroom' },
      { zCenter: -5.0, name: 'Suite 3 - Master Bedroom' }
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
      // Perfectly spans Z = sCenter - 2.5 to sCenter + 2.5 with NO GAPS!
      // Wall segment 1: length 1.95m from sCenter - 2.5 to sCenter - 0.55
      const wallP1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 1.95), matMahogany);
      wallP1.position.set(corridorDividerX, height / 2, sCenter - 1.525);

      // Wall segment 2: length 1.95m from sCenter + 0.55 to sCenter + 2.5
      const wallP2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 1.95), matMahogany);
      wallP2.position.set(corridorDividerX, height / 2, sCenter + 1.525);

      // Door Transom over doorway (height 2.1m to 2.7m, width 1.1m)
      const transom = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 1.1), matMahogany);
      transom.position.set(corridorDividerX, height - 0.3, sCenter);

      // Door frame posts
      const dPostL = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, 0.06), matMahogany);
      dPostL.position.set(corridorDividerX, height / 2, sCenter - 0.55);
      const dPostR = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, 0.06), matMahogany);
      dPostR.position.set(corridorDividerX, height / 2, sCenter + 0.55);

      // Open sliding mahogany door
      const suiteDoor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.05, 1.0), matMahogany);
      suiteDoor.position.set(corridorDividerX - 0.06, 1.025, sCenter);

      // Register interactive suite door
      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: suiteDoor,
          type: 'slide',
          openOffset: 0.85,
          x: corridorDividerX,
          z: -67.0 + sCenter,
          name: cfg.name + ' 문'
        });
      }

      // Brass Suite Nameplate
      const namePlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.32), matBrass);
      namePlate.position.set(corridorDividerX - 0.07, 1.55, sCenter - 0.65);

      group.add(wallP1, wallP2, transom, dPostL, dPostR, suiteDoor, namePlate);

      // ==========================================
      // SUITE INTERIOR FURNITURE (NO OVERLAPS!)
      // Room Bounds: X: -0.30 to +1.40, Z: sCenter - 2.40 to sCenter + 2.40
      // ==========================================
      const roomGroup = new THREE.Group();
      roomGroup.position.set(0, 0, sCenter);

      // --- 1. LUXURY BED (Back window corner: X: 0.35 ~ 1.35, z: -2.35 ~ -0.45) ---
      const bedGroup = new THREE.Group();
      bedGroup.position.set(0.85, 0, -1.4);

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

      // --- 2. BEDSIDE NIGHTSTAND (Separated from bed: X: -0.10, z: -2.15) ---
      const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.65, 0.35), matMahogany);
      nightstand.position.set(0.05, 0.325, -2.15);

      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.03, 12), matBrass);
      lampBase.position.set(0.05, 0.665, -2.15);
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8), matBrass);
      lampStem.position.set(0.05, 0.76, -2.15);
      const lampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.13, 12),
        new THREE.MeshBasicMaterial({ color: 0xffdfaa })
      );
      lampShade.position.set(0.05, 0.88, -2.15);
      const lampLight = new THREE.PointLight(0xffbe6b, 0.7, 3.5);
      lampLight.position.set(0.05, 0.86, -2.15);

      roomGroup.add(nightstand, lampBase, lampStem, lampShade, lampLight);

      // --- 3. WARDROBE / ARMOIRE (Front corridor corner: X: -0.05, z: +2.05) ---
      const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.1, 0.65), matMahogany);
      wardrobe.position.set(-0.05, 1.05, 2.0);
      const wHandle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8), matBrass);
      wHandle1.position.set(0.18, 1.05, 1.95);
      const wHandle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8), matBrass);
      wHandle2.position.set(0.18, 1.05, 2.05);
      roomGroup.add(wardrobe, wHandle1, wHandle2);

      // --- 4. VANITY DESK WITH SINK & OVAL MIRROR (Front window corner: X: 1.05, z: +2.0) ---
      const vanityGroup = new THREE.Group();
      vanityGroup.position.set(1.05, 0, 2.0);

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

      // --- 5. UPHOLSTERED ARMCHAIR (Window side: X: 0.95, z: +0.6) ---
      const armchair = new THREE.Group();
      armchair.position.set(0.95, 0, 0.65);
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.38, 0.52), matBedQuilt);
      seatCushion.position.set(0, 0.24, 0);
      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.45, 0.1), matBedQuilt);
      seatBack.position.set(0, 0.55, 0.22);
      armchair.add(seatCushion, seatBack);
      roomGroup.add(armchair);

      // --- 6. VELVET WINDOW DRAPERIES (Window side) ---
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

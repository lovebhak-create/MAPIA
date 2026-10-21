// Car 4: 1st Class Pullman Sleeper Car (1등석 침대차)
// Wide continuous side corridor connected directly to entrance doors,
// with spacious luxury suites featuring large prominent beds, white linen, pillows, quilts, and en-suite vanities.
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

    const matExtGreen = new THREE.MeshStandardMaterial({
      map: Textures.exteriorGreen,
      roughness: 0.5,
      metalness: 0.3
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
      new THREE.BoxGeometry(width - 0.2, 0.1, length),
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
    // 4. END BULKHEADS WITH CENTER DOORS (Vestibule Connection)
    // Connects seamlessly to Car 3 (Z = +10.0) and Car 5 (Z = -10.0)
    // ==========================================
    const createCarEndBulkhead = (zPos) => {
      const bh = new THREE.Group();
      bh.position.set(0, 0, zPos);

      // Center doorway (width 1.1m, matching the vestibule from Car 3 / Car 5!)
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.95, height, 0.12), matMahogany);
      postL.position.set(-1.0, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.95, height, 0.12), matMahogany);
      postR.position.set(1.0, height / 2, 0);
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.12), matMahogany);
      topTransom.position.set(0, height - 0.3, 0);

      bh.add(postL, postR, topTransom);
      return bh;
    };
    group.add(createCarEndBulkhead(length / 2));  // Front door (from Car 3)
    group.add(createCarEndBulkhead(-length / 2)); // Rear door (to Car 5)

    // ==========================================
    // 5. ENTRANCE FOYERS (전실) AT BOTH ENDS
    // Front Foyer (Z = +10.0 to +7.8): Leads directly from center door into corridor!
    // Rear Foyer (Z = -7.8 to -10.0): Leads from corridor out through center door!
    // ==========================================
    // Front Foyer diagonal guide wall (Right side)
    const frontFoyerCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, 1.8), matMahogany);
    frontFoyerCabinet.position.set(0.85, height / 2, 8.9);
    group.add(frontFoyerCabinet);

    // Rear Foyer diagonal guide wall (Right side)
    const rearFoyerCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, 1.8), matMahogany);
    rearFoyerCabinet.position.set(0.85, height / 2, -8.9);
    group.add(rearFoyerCabinet);

    // ==========================================
    // 6. WIDE SIDE CORRIDOR (복도)
    // Runs from Z = +8.0 to Z = -8.0 along the Left side
    // Corridor width: ~1.1m (from X = -1.45 to X = -0.35)
    // Divider wall with suites is located at X = -0.35
    // ==========================================
    const corridorDividerX = -0.35;

    // Brass Handrail along Corridor Outer Wall (Left wall)
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
    // Suite 1: Z = +5.0 (Z = +2.4 to +7.6, Length ~5.2m)
    // Suite 2: Z = 0.0  (Z = -2.6 to +2.6, Length ~5.2m)
    // Suite 3: Z = -5.0 (Z = -7.6 to -2.4, Length ~5.2m)
    // ==========================================
    const suiteConfigs = [
      { zCenter: 5.1, name: 'Suite 1 - Drawing Room' },
      { zCenter: 0.0, name: 'Suite 2 - Pullman Stateroom' },
      { zCenter: -5.1, name: 'Suite 3 - Master Bedroom' }
    ];

    const suiteSpan = 5.0;

    suiteConfigs.forEach((cfg, idx) => {
      const sCenter = cfg.zCenter;
      const sHalf = suiteSpan / 2;

      // Partition wall between suites
      if (idx > 0) {
        const partition = new THREE.Mesh(
          new THREE.BoxGeometry(width / 2 - corridorDividerX, height, 0.1),
          matMahogany
        );
        partition.position.set((corridorDividerX + width / 2) / 2, height / 2, sCenter + sHalf);
        group.add(partition);
      }

      // Front & Back end partitions for the suites section
      if (idx === 0) {
        const frontWall = new THREE.Mesh(
          new THREE.BoxGeometry(width / 2 - corridorDividerX, height, 0.1),
          matMahogany
        );
        frontWall.position.set((corridorDividerX + width / 2) / 2, height / 2, sCenter + sHalf);
        group.add(frontWall);
      }
      if (idx === suiteConfigs.length - 1) {
        const backWall = new THREE.Mesh(
          new THREE.BoxGeometry(width / 2 - corridorDividerX, height, 0.1),
          matMahogany
        );
        backWall.position.set((corridorDividerX + width / 2) / 2, height / 2, sCenter - sHalf);
        group.add(backWall);
      }

      // Corridor Wall along X = corridorDividerX
      // Panel 1
      const wallP1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 2.0), matMahogany);
      wallP1.position.set(corridorDividerX, height / 2, sCenter - 1.4);
      // Panel 2
      const wallP2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 1.8), matMahogany);
      wallP2.position.set(corridorDividerX, height / 2, sCenter + 1.5);
      // Door Transom
      const transom = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 1.2), matMahogany);
      transom.position.set(corridorDividerX, height - 0.3, sCenter);

      // Suite Sliding Mahogany Door (kept open ~0.9m so player can walk in directly!)
      const suiteDoor = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.05, 1.1), matMahogany);
      suiteDoor.position.set(corridorDividerX - 0.05, 1.025, sCenter + 0.6); // Slid open

      // Brass Suite Nameplate
      const namePlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.32), matBrass);
      namePlate.position.set(corridorDividerX - 0.06, 1.55, sCenter - 0.65);

      group.add(wallP1, wallP2, transom, suiteDoor, namePlate);

      // ==========================================
      // INSIDE THE SUITE (방 내부)
      // Room spans X: -0.35 to +1.45 (width 1.8m), Z: sCenter - 2.5 to sCenter + 2.5
      // ==========================================
      const roomGroup = new THREE.Group();
      roomGroup.position.set(0, 0, sCenter);

      // --- A. THE LUXURY BED (대형 럭셔리 침대) ---
      // Width: 1.55m (X: -0.2 to +1.35), Length: 2.0m (Z: -2.3 to -0.3)
      const bedGroup = new THREE.Group();
      bedGroup.position.set(0.55, 0, -1.3);

      // 1. Bed Frame & Legs (Mahogany)
      const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 2.0), matMahogany);
      bedFrame.position.set(0, 0.2, 0);

      // 2. Tall Carved Headboard
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.85, 0.08), matMahogany);
      headboard.position.set(0, 0.65, -0.96);
      const headboardCrest = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.06, 0.1), matGoldTrim);
      headboardCrest.position.set(0, 1.08, -0.96);

      // 3. Footboard
      const footboard = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.45, 0.08), matMahogany);
      footboard.position.set(0, 0.4, 0.96);

      // 4. Thick Mattress
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.22, 1.9), matBedSheet);
      mattress.position.set(0, 0.42, 0);

      // 5. White Folded Bed Sheet turn-down
      const bedSheetTurn = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.04, 0.4), matBedSheet);
      bedSheetTurn.position.set(0, 0.54, -0.4);

      // 6. Luxury Deep Burgundy Quilt / Duvet
      const quilt = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.08, 1.25), matBedQuilt);
      quilt.position.set(0, 0.52, 0.3);

      // Gold Bed Runner across foot of bed
      const goldRunner = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.02, 0.3), matGoldTrim);
      goldRunner.position.set(0, 0.57, 0.65);

      // 7. TWO FLUFFY WHITE PILLOWS (두 개의 푹신한 베개)
      const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.14, 0.38), matBedPillow);
      pillow1.position.set(-0.35, 0.6, -0.7);
      pillow1.rotation.x = -0.15; // Propped against headboard

      const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.14, 0.38), matBedPillow);
      pillow2.position.set(0.35, 0.6, -0.7);
      pillow2.rotation.x = -0.15; // Propped against headboard

      bedGroup.add(bedFrame, headboard, headboardCrest, footboard, mattress, bedSheetTurn, quilt, goldRunner, pillow1, pillow2);
      roomGroup.add(bedGroup);

      // --- B. UPPER FOLD-AWAY PULLMAN BERTH IN CEILING ---
      const upperBerth = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 1.0), matMahogany);
      upperBerth.position.set(0.55, height - 0.25, -1.3);
      const berthHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), matBrass);
      berthHandle.rotation.x = Math.PI / 2;
      berthHandle.position.set(0.55, height - 0.35, -0.75);
      roomGroup.add(upperBerth, berthHandle);

      // --- C. BEDSIDE NIGHTSTAND & SHADED LAMP ---
      const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 0.4), matMahogany);
      nightstand.position.set(-0.15, 0.325, -1.8);
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.04, 12), matBrass);
      lampBase.position.set(-0.15, 0.67, -1.8);
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8), matBrass);
      lampStem.position.set(-0.15, 0.77, -1.8);
      const lampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.14, 12),
        new THREE.MeshBasicMaterial({ color: 0xffdfaa })
      );
      lampShade.position.set(-0.15, 0.9, -1.8);
      const lampLight = new THREE.PointLight(0xffbe6b, 0.75, 4.0);
      lampLight.position.set(-0.15, 0.88, -1.8);

      roomGroup.add(nightstand, lampBase, lampStem, lampShade, lampLight);

      // --- D. EN-SUITE VANITY WITH PORCELAIN SINK & MIRROR ---
      const vanityGroup = new THREE.Group();
      vanityGroup.position.set(1.15, 0, 1.8);
      // Cabinet
      const vCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.82, 0.7), matMahogany);
      vCabinet.position.set(0, 0.41, 0);
      // Porcelain basin
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.14, 16), matPorcelain);
      basin.position.set(0, 0.85, 0);
      // Brass faucet
      const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), matBrass);
      faucet.position.set(0.18, 0.98, 0);
      // Wall Mirror
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.85, 0.55), matMirror);
      mirror.position.set(0.24, 1.5, 0);
      const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.89, 0.59), matBrass);
      mirrorFrame.position.set(0.23, 1.5, 0);

      vanityGroup.add(vCabinet, basin, faucet, mirror, mirrorFrame);
      roomGroup.add(vanityGroup);

      // --- E. COZY VELVET ARMCHAIR & SMALL TABLE ---
      const armchair = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.55), matBedQuilt);
      armchair.position.set(0.2, 0.21, 1.5);
      const armBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.12), matBedQuilt);
      armBack.position.set(0.2, 0.55, 1.75);
      roomGroup.add(armchair, armBack);

      // --- F. VELVET WINDOW DRAPERIES ---
      const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.25), matBedQuilt);
      curtainL.position.set(width / 2 - 0.15, 1.5, -0.8);
      const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.25), matBedQuilt);
      curtainR.position.set(width / 2 - 0.15, 1.5, 0.8);
      const curtainTieL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.26), matGoldTrim);
      curtainTieL.position.set(width / 2 - 0.15, 1.3, -0.8);
      const curtainTieR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.26), matGoldTrim);
      curtainTieR.position.set(width / 2 - 0.15, 1.3, 0.8);
      roomGroup.add(curtainL, curtainR, curtainTieL, curtainTieR);

      group.add(roomGroup);
    });

    return group;
  };

  return { create };
})();

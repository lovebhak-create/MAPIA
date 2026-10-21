// Car 6: Dining Car (식당차 - Dining Saloon & Kitchen Galley)
// White linen tables, art deco shaded lamps, high-back chairs, and full kitchen galley
const Car6_Diner = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car6_Diner';

    // Position: Centered at Z = -111.0 (Spans Z = -101.0 to Z = -121.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -111.0);

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

    const matExtGreen = new THREE.MeshStandardMaterial({
      map: Textures.exteriorGreen,
      roughness: 0.5,
      metalness: 0.3
    });

    const matWhiteLinen = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.85,
      metalness: 0.02
    });

    const matLeatherRed = new THREE.MeshStandardMaterial({
      color: 0x5a181d,
      roughness: 0.6,
      metalness: 0.15
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matStainless = new THREE.MeshStandardMaterial({
      color: 0xd0d5db,
      roughness: 0.3,
      metalness: 0.85
    });

    const matCopper = new THREE.MeshStandardMaterial({
      color: 0xba6a44,
      roughness: 0.35,
      metalness: 0.85
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x222428,
      roughness: 0.8,
      metalness: 0.5
    });

    // 1. Floor & Carpet
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Carpet covers dining room and pantry walkway (Z = -length/2 to +length/2)
    const diningCarpet = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.01, length - 0.4), matCarpet);
    diningCarpet.position.set(0, 0.01, 0);
    group.add(diningCarpet);

    // 2. Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.2, 0.1, length),
      new THREE.MeshStandardMaterial({ color: 0xf3eee3, roughness: 0.7 })
    );
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // 3. Side Walls with Dining Windows
    const createDinerSideWall = (xSide) => {
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

      // Dining windows (in dining room section Z = -3.5 to +8.5)
      const numWindows = 6;
      const windowSpan = 2.0;
      for (let i = 0; i < numWindows; i++) {
        const wz = -2.5 + i * windowSpan;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, 1.5), matGlass);
        glass.position.set(0, 1.5, wz);
        wGroup.add(glass);

        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.2, 0.5), matMahogany);
        pillar.position.set(0, 1.5, wz + 1.0);
        wGroup.add(pillar);
      }

      // Solid kitchen wall portion (Z = -4.5 to -10)
      const kWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 5.5), matExtGreen);
      kWall.position.set(0, 1.5, -7.0);
      wGroup.add(kWall);

      return wGroup;
    };
    group.add(createDinerSideWall(-1));
    group.add(createDinerSideWall(1));

    // End Bulkheads
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
      return bh;
    };
    group.add(createBulkhead(length / 2));
    group.add(createBulkhead(-length / 2));

    // ==========================================
    // 4. DINING SALOON SECTION (Z = -4.0 to +9.0)
    // ==========================================
    const createDiningChair = (x, z, rotY) => {
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      chair.rotation.y = rotY;

      // Legs
      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.38), matMahogany);
      legs.position.set(0, 0.21, 0);

      // Leather seat cushion
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), matLeatherRed);
      cushion.position.set(0, 0.46, 0);

      // High mahogany backrest with curved crest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.06), matMahogany);
      back.position.set(0, 0.72, -0.18);

      chair.add(legs, cushion, back);
      return chair;
    };

    const createDiningTable = (xPos, zPos, isFourPerson = true) => {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(xPos, 0, zPos);

      const tWidth = isFourPerson ? 1.05 : 0.75;
      const tLength = 1.1;

      // Table Pedestal & Cast Iron Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.72, 12), matCastIron);
      base.position.set(0, 0.36, 0);

      // Tabletop with White Tablecloth
      const tabletop = new THREE.Mesh(new THREE.BoxGeometry(tWidth, 0.08, tLength), matWhiteLinen);
      tabletop.position.set(0, 0.74, 0);

      // Overhanging cloth skirt
      const clothSkirt = new THREE.Mesh(new THREE.BoxGeometry(tWidth + 0.02, 0.2, tLength + 0.02), matWhiteLinen);
      clothSkirt.position.set(0, 0.65, 0);

      // Miniature Art Deco Shaded Table Lamp
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.08, 8), matBrass);
      lampBase.position.set(0, 0.8, 0);
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 6), matBrass);
      lampStem.position.set(0, 0.9, 0);
      const lampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffd991 })
      );
      lampShade.position.set(0, 1.02, 0);

      // Warm Amber Table Glow
      const tableLight = new THREE.PointLight(0xffbe6b, 0.55, 3.2);
      tableLight.position.set(0, 0.98, 0);

      // Silverware & Porcelain Plates
      [-0.32, 0.32].forEach(pz => {
        const plate = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 0.015, 12),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
        );
        plate.position.set(0, 0.79, pz);
        tableGroup.add(plate);
      });

      tableGroup.add(base, tabletop, clothSkirt, lampBase, lampStem, lampShade, tableLight);

      // Add facing dining chairs
      tableGroup.add(createDiningChair(0, -0.7, 0));
      tableGroup.add(createDiningChair(0, 0.7, Math.PI));

      return tableGroup;
    };

    // 4 tables on each side: Right side (4-person), Left side (2-person)
    const tablePositionsZ = [-2.5, 0.5, 3.5, 6.5];
    tablePositionsZ.forEach(tz => {
      // Right side tables (x = 1.15)
      group.add(createDiningTable(1.15, tz, true));
      // Left side tables (x = -1.15)
      group.add(createDiningTable(-1.15, tz, false));
    });

    // ==========================================
    // 5. STEWARD BUFFET & WINE SERVERY (Z = -4.5 to -9.8)
    // ==========================================
    // Ornate Mahogany Archway dividing Dining Room and Buffet Saloon
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, -4.2);
    const archPostL = new THREE.Mesh(new THREE.BoxGeometry(0.85, height, 0.12), matMahogany);
    archPostL.position.set(-1.25, height / 2, 0);
    const archPostR = new THREE.Mesh(new THREE.BoxGeometry(0.85, height, 0.12), matMahogany);
    archPostR.position.set(1.25, height / 2, 0);
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.14), matMahogany);
    archTop.position.set(0, height - 0.25, 0);
    const archTrim = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.04, 0.16), matBrass);
    archTrim.position.set(0, height - 0.5, 0);
    archGroup.add(archPostL, archPostR, archTop, archTrim);
    group.add(archGroup);

    // Left Side: 1930s Luxury Pullman Credenza & Wine Display (X = -1.25)
    const credenzaGroup = new THREE.Group();
    credenzaGroup.position.set(-1.25, 0, -7.0);

    // Polished Mahogany Cabinet with brass handles
    const credenzaBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 4.2), matMahogany);
    credenzaBody.position.set(0, 0.475, 0);

    // Marble Top
    const credenzaTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.06, 4.3),
      new THREE.MeshStandardMaterial({ color: 0xefede8, roughness: 0.15, metalness: 0.1 })
    );
    credenzaTop.position.set(0, 0.98, 0);

    // Tiered Mirror Backed Display Shelving
    const mirrorBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.3, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xe0e8f0, roughness: 0.05, metalness: 0.9 })
    );
    mirrorBack.position.set(-0.32, 1.65, 0);

    // Shelves with Crystal Decanters & Fine Wine Bottles
    const wineColors = [0x771122, 0x442211, 0x996611, 0x224422];
    [-1.2, 0, 1.2].forEach((bz, idx) => {
      // Silver Samovar / Coffee Urn at center
      if (idx === 1) {
        const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.45, 12), matStainless);
        urn.position.set(0, 1.25, bz);
        const urnLid = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.1, 12), matBrass);
        urnLid.position.set(0, 1.5, bz);
        const urnSpigot = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), matBrass);
        urnSpigot.rotation.x = Math.PI / 2;
        urnSpigot.position.set(0.12, 1.15, bz);
        credenzaGroup.add(urn, urnLid, urnSpigot);
      } else {
        // Decanters with colored vintage liquor
        const decanter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.28, 8),
          new THREE.MeshStandardMaterial({ color: wineColors[idx], transparent: true, opacity: 0.8, roughness: 0.2 })
        );
        decanter.position.set(0, 1.15, bz);
        const stopper = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), matBrass);
        stopper.position.set(0, 1.32, bz);
        credenzaGroup.add(decanter, stopper);
      }
    });

    credenzaGroup.add(credenzaBody, credenzaTop, mirrorBack);
    group.add(credenzaGroup);

    // Right Side: Steward Service Station & Pastry Buffet (X = +1.25)
    const buffetGroup = new THREE.Group();
    buffetGroup.position.set(1.25, 0, -7.0);

    const buffetBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 4.2), matMahogany);
    buffetBody.position.set(0, 0.475, 0);

    const buffetTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.06, 4.3),
      new THREE.MeshStandardMaterial({ color: 0xefede8, roughness: 0.15, metalness: 0.1 })
    );
    buffetTop.position.set(0, 0.98, 0);

    // Tiered Silver Pastry Stand & Champagne Chiller Bucket
    const chiller = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.22, 12), matBrass);
    chiller.position.set(0, 1.12, -0.9);
    const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x113311 }));
    bottleNeck.position.set(0, 1.25, -0.9);

    const pastryTier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 16), matStainless);
    pastryTier1.position.set(0, 1.10, 0.8);
    const pastryTier2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 16), matStainless);
    pastryTier2.position.set(0, 1.24, 0.8);
    const pastryStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), matBrass);
    pastryStem.position.set(0, 1.18, 0.8);

    buffetGroup.add(buffetBody, buffetTop, chiller, bottleNeck, pastryTier1, pastryTier2, pastryStem);
    group.add(buffetGroup);

    // Warm Ambient Ceiling Chandeliers in Buffet Saloon
    const buffetLight = new THREE.PointLight(0xffdfa0, 0.9, 5.0);
    buffetLight.position.set(0, height - 0.4, -7.0);
    group.add(buffetLight);

    return group;
  };

  return { create };
})();

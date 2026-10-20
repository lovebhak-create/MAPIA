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

    // Carpet covers dining room section (Z = -length/2 + 6 to +length/2)
    const diningCarpet = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.01, length - 6.0), matCarpet);
    diningCarpet.position.set(0, 0.01, 3.0);
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
      const postL = new THREE.Mesh(new THREE.BoxGeometry(1.0, height, 0.12), matMahogany);
      postL.position.set(-1.0, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(1.0, height, 0.12), matMahogany);
      postR.position.set(1.0, height / 2, 0);
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
      // Right side tables (x = 0.95)
      group.add(createDiningTable(0.95, tz, true));
      // Left side tables (x = -0.95)
      group.add(createDiningTable(-0.95, tz, false));
    });

    // ==========================================
    // 5. KITCHEN / GALLEY SECTION (Z = -4.5 to -9.8)
    // ==========================================
    // Dividing Wall with Porthole Swinging Door
    const dividerGroup = new THREE.Group();
    dividerGroup.position.set(0, 0, -4.2);
    const divWallL = new THREE.Mesh(new THREE.BoxGeometry(1.8, height, 0.1), matMahogany);
    divWallL.position.set(0.6, height / 2, 0);
    const divWallR = new THREE.Mesh(new THREE.BoxGeometry(0.3, height, 0.1), matMahogany);
    divWallR.position.set(-1.35, height / 2, 0);
    const divTransom = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.1), matMahogany);
    divTransom.position.set(-0.75, height - 0.3, 0);

    // Swinging Kitchen Door with Brass Porthole
    const kDoor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.0, 0.06), matMahogany);
    kDoor.position.set(-0.75, 1.0, 0);
    const porthole = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16), matBrass);
    porthole.position.set(-0.75, 1.5, 0.04);
    dividerGroup.add(divWallL, divWallR, divTransom, kDoor, porthole);
    group.add(dividerGroup);

    // Stainless Steel Counters along Right Kitchen Wall
    const counterR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.9, 5.0), matStainless);
    counterR.position.set(width / 2 - 0.42, 0.45, -7.0);
    group.add(counterR);

    // Heavy Cast Iron Cooking Range / Stove
    const stoveGroup = new THREE.Group();
    stoveGroup.position.set(-width / 2 + 0.45, 0, -7.5);
    const stoveBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.95, 1.6), matCastIron);
    stoveBase.position.set(0, 0.47, 0);
    // Stove Flue Pipe leading into ceiling
    const stovePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.7, 12), matCastIron);
    stovePipe.position.set(0, 1.8, 0);
    stoveGroup.add(stoveBase, stovePipe);
    group.add(stoveGroup);

    // Copper Pots & Sauté Pans hanging on overhead rack
    const potRack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 3.0), matCastIron);
    potRack.position.set(0.65, 2.1, -7.0);
    group.add(potRack);

    for (let pz = -8.2; pz <= -5.8; pz += 0.6) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.16, 12), matCopper);
      pot.position.set(0.65, 1.9, pz);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 6), matCastIron);
      handle.rotation.x = Math.PI / 2;
      handle.position.set(0.65, 1.95, pz + 0.16);
      group.add(pot, handle);
    }

    // Kitchen Overhead Utility Lamp
    const kLight = new THREE.PointLight(0xfff0d0, 1.1, 6.0);
    kLight.position.set(0, height - 0.3, -7.0);
    group.add(kLight);

    return group;
  };

  return { create };
})();

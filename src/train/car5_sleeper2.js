// Car 5: 2nd Class Section Sleeper Car (2등석 침대차 - Pullman Open Section Berth Car)
// Central aisle flanked by upper and lower berths with privacy curtains
const Car5_Sleeper2 = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car5_Sleeper2';

    // Position: Centered at Z = -89.0 (Spans Z = -79.0 to Z = -99.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -89.0);

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

    // 1. Floor & Central Carpet Runner
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    const aisleCarpet = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.01, length), matCarpet);
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

    // 4. Berth Sections on both sides of central aisle
    // Central aisle: -0.45 to +0.45 (width 0.9m)
    // Left berths: x = -1.45 to -0.45 (width 1.0m)
    // Right berths: x = +0.45 to +1.45 (width 1.0m)
    const sectionLength = 2.2;
    const numSections = 7;

    for (let s = 0; s < numSections; s++) {
      const sz = -length / 2 + 2.5 + s * sectionLength;

      // Divider partition between sections
      [-1, 1].forEach(side => {
        const divider = new THREE.Mesh(new THREE.BoxGeometry(1.0, height, 0.08), matMahogany);
        divider.position.set(side * 0.95, height / 2, sz - sectionLength / 2);
        group.add(divider);

        // Lower Berth (하단 침대: Y = 0.45m)
        const lowerBed = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, sectionLength - 0.15), matBedding);
        lowerBed.position.set(side * 0.95, 0.35, sz);
        const lowerBlanket = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.05, 1.2), matBlanket);
        lowerBlanket.position.set(side * 0.95, 0.47, sz + 0.3);
        const lowerPillow = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.35), matBedding);
        lowerPillow.position.set(side * 0.95, 0.5, sz - 0.8);
        group.add(lowerBed, lowerBlanket, lowerPillow);

        // Upper Berth (상단 침대: Y = 1.55m)
        const upperFrame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, sectionLength - 0.12), matMahogany);
        upperFrame.position.set(side * 0.95, 1.5, sz);
        const upperBed = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.15, sectionLength - 0.2), matBedding);
        upperBed.position.set(side * 0.95, 1.6, sz);
        const upperPillow = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.35), matBedding);
        upperPillow.position.set(side * 0.95, 1.7, sz - 0.8);
        group.add(upperFrame, upperBed, upperPillow);

        // Brass Curtain Rod running along the aisle edge
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, sectionLength, 6), matBrass);
        rod.rotation.x = Math.PI / 2;
        rod.position.set(side * 0.48, height - 0.35, sz);
        group.add(rod);

        // Privacy Curtains (Some fully drawn, some parted)
        const isParted = (s + (side > 0 ? 1 : 0)) % 3 === 0;
        if (isParted) {
          // Bunched/parted curtain on side
          const curtainP = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.1, 0.4), matCurtain);
          curtainP.position.set(side * 0.48, 1.2, sz - 0.8);
          group.add(curtainP);
        } else {
          // Drawn privacy curtain covering the berth section
          const curtainFull = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, sectionLength - 0.1), matCurtain);
          curtainFull.position.set(side * 0.48, 1.2, sz);
          group.add(curtainFull);
        }

        // Section Number Brass Badge
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.15), matBrass);
        badge.position.set(side * 0.47, 1.8, sz - sectionLength / 2 + 0.1);
        group.add(badge);
      });

      // Wooden Berth Access Ladder attached on every other section
      if (s % 2 === 0) {
        const ladderGroup = new THREE.Group();
        ladderGroup.position.set(0.46, 0, sz + 0.4);
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

    // 5. Soft Night Lighting along Central Ceiling
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

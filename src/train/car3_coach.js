// Car 3: Coach Passenger Car (일반 객차)
// Rows of plush velvet seats, overhead brass luggage racks, mahogany trim
const Car3_Coach = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car3_Coach';

    // Position: Centered at Z = -45.0 (Spans Z = -35.0 to Z = -55.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -45.0);

    const length = 20.0;
    const width = 3.0;
    const height = 2.7;

    const matWoodFloor = new THREE.MeshStandardMaterial({
      map: Textures.woodFloor,
      roughness: 0.7,
      metalness: 0.1
    });

    const matCarpetAisle = new THREE.MeshStandardMaterial({
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

    const matVelvetGreen = new THREE.MeshStandardMaterial({
      color: 0x1d472c,
      roughness: 0.8,
      metalness: 0.1
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.7,
      metalness: 0.5
    });

    const matCeilingCream = new THREE.MeshStandardMaterial({
      color: 0xebe4cf,
      roughness: 0.8,
      metalness: 0.05
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // 1. Floor & Carpet Runner
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Central aisle carpet runner
    const aisleCarpet = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.01, length), matCarpetAisle);
    aisleCarpet.position.set(0, 0.01, 0);
    group.add(aisleCarpet);

    // 2. Ceiling with Monitor/Clerestory Roof Profile
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.1, length), matCeilingCream);
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    // 3. Left & Right Walls with Passenger Windows
    const createSideWall = (xSide) => {
      const wallGroup = new THREE.Group();
      wallGroup.position.set(xSide * (width / 2 - 0.06), 0, 0);

      // Lower mahogany wainscoting
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, length), matMahogany);
      lower.position.set(0, 0.45, 0);
      wallGroup.add(lower);

      // Upper wall above windows
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, length), matMahogany);
      upper.position.set(0, height - 0.3, 0);
      wallGroup.add(upper);

      // Window pillars and glass
      const numWindows = 10;
      const windowSpan = (length - 3.0) / numWindows;
      for (let i = 0; i < numWindows; i++) {
        const wz = -length / 2 + 2.0 + i * windowSpan;

        // Window glass
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, windowSpan * 0.75), matGlass);
        glass.position.set(0, 1.5, wz);
        wallGroup.add(glass);

        // Mahogany frame pillar
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.2, windowSpan * 0.25), matMahogany);
        pillar.position.set(0, 1.5, wz + windowSpan * 0.5);
        wallGroup.add(pillar);
      }

      return wallGroup;
    };
    group.add(createSideWall(-1));
    group.add(createSideWall(1));

    // End Bulkheads with Doorways
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

    // 4. Passenger Seats (2x2 seating, velvet upholstery, cast iron legs)
    const createDoubleSeat = (xPos, zPos, faceDir = 1) => {
      const seatGroup = new THREE.Group();
      seatGroup.position.set(xPos, 0, zPos);
      if (faceDir === -1) seatGroup.rotation.y = Math.PI;

      // Base pedestal & cast iron leg
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.08), matCastIron);
      leg.position.set(0, 0.2, 0);

      // Seat cushion (two-passenger wide)
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.55), matVelvetGreen);
      cushion.position.set(0, 0.45, 0);
      cushion.castShadow = true;

      // Reversible seat backrest
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.12), matVelvetGreen);
      backrest.position.set(0, 0.8, -0.22);
      backrest.rotation.x = -0.1;
      backrest.castShadow = true;

      // Aisle-side decorative cast-iron armrest
      const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.48), matCastIron);
      const armX = xPos > 0 ? -0.47 : 0.47;
      armrest.position.set(armX, 0.62, 0);

      seatGroup.add(leg, cushion, backrest, armrest);
      return seatGroup;
    };

    // 9 pairs of seats along each side of the aisle
    const seatSpacing = 1.6;
    for (let i = 0; i < 9; i++) {
      const sz = -length / 2 + 3.0 + i * seatSpacing;
      // Left side seats (double)
      group.add(createDoubleSeat(-0.95, sz, 1));
      // Right side seats (double)
      group.add(createDoubleSeat(0.95, sz, 1));
    }

    // 5. Overhead Brass Luggage Racks
    [-0.95, 0.95].forEach(xSide => {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, length - 4.0), matBrass);
      rack.position.set(xSide, 2.1, 0);
      group.add(rack);

      // Brass support brackets
      for (let bz = -length / 2 + 3.0; bz <= length / 2 - 3.0; bz += 3.2) {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.25, 0.25), matBrass);
        bracket.position.set(xSide * 1.3, 2.0, bz);
        group.add(bracket);
      }
    });

    // 6. Milk-Glass Globe Ceiling Lamps
    for (let lz = -7.0; lz <= 7.0; lz += 3.5) {
      const lampGroup = new THREE.Group();
      lampGroup.position.set(0, height - 0.15, lz);

      const brassBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.08, 12), matBrass);
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff3db })
      );
      globe.position.set(0, -0.14, 0);

      const light = new THREE.PointLight(0xffdfaa, 0.85, 5.5);
      light.position.set(0, -0.2, 0);

      lampGroup.add(brassBase, globe, light);
      group.add(lampGroup);
    }

    return group;
  };

  return { create };
})();

// Car 4: 1st Class Sleeper Car (1등석 침대차 - Pullman Compartment Car)
// Side corridor with private luxury suites, velvet sofa-berths, en-suite sinks, mahogany paneling
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

    const matVelvetRed = new THREE.MeshStandardMaterial({
      color: 0x5a121d,
      roughness: 0.75,
      metalness: 0.15
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matPorcelain = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.2,
      metalness: 0.1
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

    // 3. Side Walls (Exterior)
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), matExtGreen);
    wallL.position.set(-width / 2 + 0.06, height / 2, 0);
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), matExtGreen);
    wallR.position.set(width / 2 - 0.06, height / 2, 0);
    group.add(wallL, wallR);

    // End Bulkheads with Doorways
    const createBulkhead = (zPos) => {
      const bh = new THREE.Group();
      bh.position.set(0, 0, zPos);
      // Corridor opening on the left side (x = -0.9)
      const postMid = new THREE.Mesh(new THREE.BoxGeometry(1.9, height, 0.12), matMahogany);
      postMid.position.set(0.45, height / 2, 0);
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.3, height, 0.12), matMahogany);
      postL.position.set(-1.3, height / 2, 0);
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.12), matMahogany);
      topTransom.position.set(-0.75, height - 0.3, 0);
      bh.add(postMid, postL, topTransom);
      return bh;
    };
    group.add(createBulkhead(length / 2));
    group.add(createBulkhead(-length / 2));

    // 4. Longitudinal Corridor Dividing Wall
    // Corridor runs along Left Side from x = -1.4 to x = -0.6 (width 0.8m)
    // Compartments occupy Right Side from x = -0.5 to x = +1.4 (width 1.9m)
    const corridorDividerX = -0.55;

    // Brass Handrail along Corridor Outer Wall (Left)
    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, length - 1.0, 8), matBrass);
    handrail.rotation.x = Math.PI / 2;
    handrail.position.set(-width / 2 + 0.18, 1.0, 0);
    group.add(handrail);

    // 5. Private Compartment Suites (4 Luxury Suites: A, B, C, D)
    const numSuites = 4;
    const suiteLength = (length - 2.0) / numSuites; // ~4.5m per suite

    for (let i = 0; i < numSuites; i++) {
      const suiteZ = -length / 2 + 1.0 + (i + 0.5) * suiteLength;
      const suiteStartZ = suiteZ - suiteLength / 2;
      const suiteEndZ = suiteZ + suiteLength / 2;

      // Partition walls between suites
      if (i > 0) {
        const partition = new THREE.Mesh(
          new THREE.BoxGeometry(width / 2 - corridorDividerX, height, 0.1),
          matMahogany
        );
        partition.position.set((corridorDividerX + width / 2) / 2, height / 2, suiteStartZ);
        group.add(partition);
      }

      // Corridor Wall with Suite Door & Frosted Transom
      const suiteWallPanel1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, height, (suiteLength - 0.9) / 2),
        matMahogany
      );
      suiteWallPanel1.position.set(corridorDividerX, height / 2, suiteZ - suiteLength / 4 - 0.2);

      const suiteWallPanel2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, height, (suiteLength - 0.9) / 2),
        matMahogany
      );
      suiteWallPanel2.position.set(corridorDividerX, height / 2, suiteZ + suiteLength / 4 + 0.2);

      const doorTransom = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.9), matMahogany);
      doorTransom.position.set(corridorDividerX, height - 0.3, suiteZ);

      // Suite Entrance Door (Slid slightly ajar so player can look inside or walk in!)
      const suiteDoor = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.85), matMahogany);
      suiteDoor.position.set(corridorDividerX - 0.05, 1.0, suiteZ + (i % 2 === 0 ? 0.35 : 0.0));

      // Brass room plate
      const brassPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.18), matBrass);
      brassPlate.position.set(corridorDividerX - 0.06, 1.5, suiteZ - 0.5);

      group.add(suiteWallPanel1, suiteWallPanel2, doorTransom, suiteDoor, brassPlate);

      // --- INSIDE THE SUITE ---
      const suiteGroup = new THREE.Group();
      suiteGroup.position.set(0.4, 0, suiteZ);

      // A. Luxury Velvet Sofa / Lower Berth Bed
      const sofa = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.9), matVelvetRed);
      sofa.position.set(0.0, 0.22, suiteLength / 3);
      sofa.castShadow = true;
      const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.15), matVelvetRed);
      sofaBack.position.set(0.0, 0.65, suiteLength / 3 + 0.4);
      suiteGroup.add(sofa, sofaBack);

      // B. Folded Upper Berth in Ceiling with Brass Latches
      const upperBerth = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.85), matMahogany);
      upperBerth.position.set(0.0, height - 0.3, suiteLength / 3);
      const berthHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8), matBrass);
      berthHandle.rotation.x = Math.PI / 2;
      berthHandle.position.set(0, height - 0.4, suiteLength / 3 - 0.4);
      suiteGroup.add(upperBerth, berthHandle);

      // C. Private Vanity with Porcelain Sink & Mirror
      const vanityGroup = new THREE.Group();
      vanityGroup.position.set(0.6, 0, -suiteLength / 3);
      const vanityBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.6), matMahogany);
      vanityBase.position.set(0, 0.4, 0);
      const sink = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.12, 12), matPorcelain);
      sink.position.set(0, 0.82, 0);
      const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8), matBrass);
      faucet.position.set(0.15, 0.95, 0);
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 0.5), matMirror);
      mirror.position.set(0.24, 1.45, 0);
      vanityGroup.add(vanityBase, sink, faucet, mirror);
      suiteGroup.add(vanityGroup);

      // D. Small Mahogany Table & Armchair
      const table = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.5), matMahogany);
      table.position.set(-0.4, 0.32, -suiteLength / 4);
      const armchair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), matVelvetRed);
      armchair.position.set(-0.4, 0.2, 0);
      suiteGroup.add(table, armchair);

      // E. Warm Suite Reading Lamp
      const sLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 12), matBrass);
      sLamp.position.set(-0.4, 0.75, -suiteLength / 4);
      const sLight = new THREE.PointLight(0xffddaa, 0.7, 4.0);
      sLight.position.set(-0.4, 0.85, -suiteLength / 4);
      suiteGroup.add(sLamp, sLight);

      // F. Suite Panoramic Window with Velvet Curtains
      const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, 1.4), matGlass);
      windowGlass.position.set(width / 2 - 0.46, 1.5, 0);
      const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.2), matVelvetRed);
      curtainL.position.set(width / 2 - 0.5, 1.5, -0.7);
      const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.2), matVelvetRed);
      curtainR.position.set(width / 2 - 0.5, 1.5, 0.7);
      suiteGroup.add(windowGlass, curtainL, curtainR);

      group.add(suiteGroup);
    }

    // 6. Corridor Art Deco Wall Sconces (Along Left Corridor)
    for (let cz = -8.0; cz <= 8.0; cz += 4.0) {
      const sconceGroup = new THREE.Group();
      sconceGroup.position.set(corridorDividerX + 0.05, 1.8, cz);

      const sconceBracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.08), matBrass);
      const sconceShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.12, 8),
        new THREE.MeshBasicMaterial({ color: 0xffe2ad })
      );
      sconceShade.position.set(-0.06, 0.05, 0);

      const cLight = new THREE.PointLight(0xffdfaa, 0.6, 4.5);
      cLight.position.set(-0.1, 0.05, 0);

      sconceGroup.add(sconceBracket, sconceShade, cLight);
      group.add(sconceGroup);
    }

    return group;
  };

  return { create };
})();

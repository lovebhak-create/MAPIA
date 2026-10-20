// Car 2: Baggage & Express Mail Car (수하물차)
// Cargo, crates, trunks, parcels, and mail storage
const Car2_Baggage = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car2_Baggage';

    // Position: Centered at Z = -23.0 (Spans Z = -13.0 to Z = -33.0)
    // Floor level: Y = 1.2m. Interior ceiling: Y = 3.9m.
    group.position.set(0, 1.2, -23.0);

    const length = 20.0;
    const width = 3.0;
    const height = 2.7;

    const matWoodFloor = new THREE.MeshStandardMaterial({
      map: Textures.woodFloor,
      roughness: 0.85,
      metalness: 0.1
    });

    const matExtGreen = new THREE.MeshStandardMaterial({
      map: Textures.exteriorGreen,
      roughness: 0.5,
      metalness: 0.3
    });

    const matRibSteel = new THREE.MeshStandardMaterial({
      map: Textures.rivetedSteel,
      roughness: 0.7,
      metalness: 0.7
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x222428,
      roughness: 0.8,
      metalness: 0.4
    });

    const matCrate = new THREE.MeshStandardMaterial({
      map: Textures.crate,
      roughness: 0.8,
      metalness: 0.1
    });

    const matLuggage = new THREE.MeshStandardMaterial({
      color: 0x5c3317,
      roughness: 0.6,
      metalness: 0.2
    });

    const matLeatherBlack = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.5,
      metalness: 0.2
    });

    const matCanvasMail = new THREE.MeshStandardMaterial({
      color: 0xb5a37f,
      roughness: 0.9,
      metalness: 0.05
    });

    // 1. Floor & Roof
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    const roofCurve = new THREE.CylinderGeometry(width * 0.55, width * 0.55, length, 24, 1, false, 0, Math.PI);
    const roof = new THREE.Mesh(roofCurve, matRibSteel);
    roof.rotation.z = Math.PI / 2;
    roof.rotation.y = Math.PI / 2;
    roof.position.set(0, height, 0);
    roof.scale.set(0.4, 1, 1.0);
    group.add(roof);

    // 2. Left & Right Walls
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), matExtGreen);
    wallL.position.set(-width / 2 + 0.06, height / 2, 0);
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), matExtGreen);
    wallR.position.set(width / 2 - 0.06, height / 2, 0);
    group.add(wallL, wallR);

    // End Walls with Doorways
    const createEndWall = (zPos) => {
      const ewGroup = new THREE.Group();
      ewGroup.position.set(0, 0, zPos);
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.9, height, 0.12), matRibSteel);
      postL.position.set(-1.0, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.9, height, 0.12), matRibSteel);
      postR.position.set(1.0, height / 2, 0);
      const transom = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.12), matRibSteel);
      transom.position.set(0, height - 0.3, 0);
      ewGroup.add(postL, postR, transom);
      return ewGroup;
    };
    group.add(createEndWall(length / 2));
    group.add(createEndWall(-length / 2));

    // Internal Steel Rib Arches every 3 meters
    for (let z = -length / 2 + 3; z < length / 2; z += 3) {
      const ribL = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 0.1), matCastIron);
      ribL.position.set(-width / 2 + 0.15, height / 2, z);
      const ribR = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 0.1), matCastIron);
      ribR.position.set(width / 2 - 0.15, height / 2, z);
      const ribTop = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.1, 0.1), matCastIron);
      ribTop.position.set(0, height - 0.1, z);
      group.add(ribL, ribR, ribTop);
    }

    // 3. Sliding Cargo Side Doors (Cutout look & track)
    [-4, 4].forEach(doorZ => {
      // Left side sliding cargo door
      const doorMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 2.0), matRibSteel);
      doorMeshL.position.set(-width / 2 + 0.14, 1.1, doorZ);
      const barL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 2.2), matCastIron);
      barL.position.set(-width / 2 + 0.2, 1.1, doorZ);
      group.add(doorMeshL, barL);

      // Right side sliding cargo door
      const doorMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 2.0), matRibSteel);
      doorMeshR.position.set(width / 2 - 0.14, 1.1, doorZ);
      group.add(doorMeshR);
    });

    // 4. Cargo, Crates & Trunks Placement
    const createCrateStack = (x, z, rot = 0) => {
      const stack = new THREE.Group();
      stack.position.set(x, 0, z);
      stack.rotation.y = rot;

      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), matCrate);
      c1.position.set(0, 0.45, 0);
      c1.castShadow = true;
      stack.add(c1);

      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), matCrate);
      c2.position.set(0.05, 1.25, 0.05);
      c2.rotation.y = 0.15;
      c2.castShadow = true;
      stack.add(c2);

      return stack;
    };

    const createTrunkStack = (x, z) => {
      const stack = new THREE.Group();
      stack.position.set(x, 0, z);

      // Large leather steamer trunk
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.65), matLuggage);
      t1.position.set(0, 0.3, 0);
      t1.castShadow = true;

      // Medium black suitcase on top
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.45), matLeatherBlack);
      t2.position.set(0.1, 0.75, 0.05);
      t2.rotation.y = -0.2;
      t2.castShadow = true;

      stack.add(t1, t2);
      return stack;
    };

    // Place stacks along left and right walls leaving a clear 1.2m center aisle
    group.add(createCrateStack(-0.85, -6.5, 0.1));
    group.add(createCrateStack(-0.9, -4.2, -0.1));
    group.add(createTrunkStack(0.85, -7.0));
    group.add(createTrunkStack(0.85, -5.0));

    group.add(createCrateStack(0.85, 2.0, 0.2));
    group.add(createCrateStack(0.85, 4.2, -0.15));
    group.add(createTrunkStack(-0.85, 1.5));
    group.add(createTrunkStack(-0.85, 3.5));

    // Mail Sack Rack (U.S. MAIL canvas bags)
    const mailRack = new THREE.Group();
    mailRack.position.set(-0.85, 0, 7.0);
    const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 2.2), matCastIron);
    rackFrame.position.set(0, 0.8, 0);
    for (let mz = -0.7; mz <= 0.7; mz += 0.45) {
      const bag = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), matCanvasMail);
      bag.scale.set(0.8, 1.4, 0.8);
      bag.position.set(0, 0.8, mz);
      mailRack.add(bag);
    }
    group.add(mailRack);

    // Vintage Freight Platform Scale
    const scaleGroup = new THREE.Group();
    scaleGroup.position.set(0.85, 0, 7.0);
    const scalePlatform = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.8), matCastIron);
    scalePlatform.position.set(0, 0.06, 0);
    const scaleColumn = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), matCastIron);
    scaleColumn.position.set(0.3, 0.7, 0);
    const scaleBeam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.04), matCastIron);
    scaleBeam.position.set(0.2, 1.35, 0);
    scaleGroup.add(scalePlatform, scaleColumn, scaleBeam);
    group.add(scaleGroup);

    // 5. Overhead Hanging Cage Bulb Lights
    for (let z = -7.0; z <= 7.0; z += 4.5) {
      const bulbGroup = new THREE.Group();
      bulbGroup.position.set(0, height - 0.25, z);

      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 4), matCastIron);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffeaae })
      );
      bulb.position.set(0, -0.15, 0);

      const cage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true })
      );
      cage.position.set(0, -0.15, 0);

      const light = new THREE.PointLight(0xffd588, 0.9, 6.0);
      light.position.set(0, -0.2, 0);

      bulbGroup.add(cord, bulb, cage, light);
      group.add(bulbGroup);
    }

    return group;
  };

  return { create };
})();

// Car 8: Observation Car (전망차 - Rear Observation Parlor & Platform)
// Panoramic windows, swivel club chairs, writing desk, and rear brass platform with illuminated drumhead
const Car8_Observation = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car8_Observation';

    // Position: Centered at Z = -155.0 (Spans Z = -145.0 to Z = -165.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -155.0);

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

    const matVelvetBlue = new THREE.MeshStandardMaterial({
      color: 0x18334d,
      roughness: 0.7,
      metalness: 0.15
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85
    });

    // 1. Floor & Carpet
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Interior carpet (covers inside, leaving the rear platform wood/metal)
    const intCarpet = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.01, length - 3.5), matCarpet);
    intCarpet.position.set(0, 0.01, 1.75);
    group.add(intCarpet);

    // 2. Ceiling & Roof
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.2, 0.1, length),
      new THREE.MeshStandardMaterial({ color: 0xeee7db, roughness: 0.75 })
    );
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    // 3. Exterior Walls with Panoramic Observation Windows (Z = -7.0 to +10.0)
    const wallLength = length - 3.0; // Leaves 3m for the open observation platform at rear
    const createObsSideWall = (xSide) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(xSide * (width / 2 - 0.06), 0, 1.5);

      // Lower mahogany wainscoting (spans Y = 0.0m to 0.85m)
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, wallLength), matMahogany);
      lower.position.set(0, 0.425, 0);
      wGroup.add(lower);

      // Window sill trim running the full length of the observation car at Y = 0.85m
      const sillTrim = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, wallLength), matMahogany);
      sillTrim.position.set(0, 0.85, 0);
      wGroup.add(sillTrim);

      // Upper wall above windows - spans completely from Y = 2.05m up to the ceiling (height = 2.85m)
      const upperHeight = height - 2.05; // 0.80m
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.12, upperHeight, wallLength), matMahogany);
      upper.position.set(0, 2.05 + upperHeight / 2, 0);
      wGroup.add(upper);

      // Window header casing moulding trim running the full length at Y = 2.05m
      const headerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, wallLength), matMahogany);
      headerTrim.position.set(0, 2.05, 0);
      wGroup.add(headerTrim);

      // Panoramic observation windows
      const numWindows = 8;
      const windowSpan = (wallLength - 2.0) / numWindows;
      for (let i = 0; i < numWindows; i++) {
        const wz = -wallLength / 2 + 1.0 + i * windowSpan;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.25, windowSpan * 0.8), matGlass);
        glass.position.set(0, 1.47, wz);
        wGroup.add(glass);

        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.25, windowSpan * 0.2), matMahogany);
        pillar.position.set(0, 1.47, wz + windowSpan * 0.5);
        wGroup.add(pillar);
      }

      return wGroup;
    };
    group.add(createObsSideWall(-1));
    group.add(createObsSideWall(1));

    // Front Bulkhead (Connecting to Car 7) - Zero-gap transom & recessed pocket handle
    const frontBulkhead = new THREE.Group();
    frontBulkhead.position.set(0, 0, length / 2);
    const postL = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
    postL.position.set(-1.125, height / 2, 0);
    const postR = new THREE.Mesh(new THREE.BoxGeometry(1.25, height, 0.12), matMahogany);
    postR.position.set(1.125, height / 2, 0);

    const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.0, height - 2.05, 0.12), matMahogany);
    topTransom.position.set(0, 2.05 + (height - 2.05) / 2, 0);
    const transomCasing = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.05, 0.14), matMahogany);
    transomCasing.position.set(0, 2.05, 0);
    frontBulkhead.add(postL, postR, topTransom, transomCasing);

    const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.05, 0.05), matMahogany);
    sDoor.position.set(0, 1.025, 0);
    const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
    dWin.position.set(0, 0.35, 0);
    sDoor.add(dWin);

    if (typeof DoorManager !== 'undefined' && DoorManager.createRecessedHandle) {
      DoorManager.createRecessedHandle(sDoor, 0.36);
    }
    frontBulkhead.add(sDoor);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: sDoor,
        type: 'slide',
        openOffset: 0.92,
        x: 0,
        z: -155.0 + length / 2,
        name: '8호차 앞문'
      });
    }

    group.add(frontBulkhead);

    // Rear Interior Partition with French Glass Doors opening to the Observation Platform (Z = -length/2 + 3.0 = -7.0)
    // Zero-gap transom + interactive double swing French doors with brass hardware and closed door collision
    const rearWallGroup = new THREE.Group();
    rearWallGroup.position.set(0, 0, -length / 2 + 3.0);

    const rwL = new THREE.Mesh(new THREE.BoxGeometry(1.15, height, 0.12), matMahogany);
    rwL.position.set(-1.15, height / 2, 0);
    const rwR = new THREE.Mesh(new THREE.BoxGeometry(1.15, height, 0.12), matMahogany);
    rwR.position.set(1.15, height / 2, 0);

    // Transom spans completely down to door top (2.05m) - ZERO GAP!
    const rwTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, height - 2.05, 0.12), matMahogany);
    rwTop.position.set(0, 2.05 + (height - 2.05) / 2, 0);
    const rwCasing = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.05, 0.14), matMahogany);
    rwCasing.position.set(0, 2.05, 0);

    // Double French Glass Doors (Interactive swing open/close!)
    const doorPivotL = new THREE.Group();
    doorPivotL.position.set(-0.55, 0, 0);
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.54, 2.05, 0.05), matMahogany);
    doorL.position.set(0.27, 1.025, 0);
    const doorGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.5, 0.04), matGlass);
    doorGlassL.position.set(0, 0.1, 0);
    const handleL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), matBrass);
    handleL1.position.set(0.22, 0, 0.04);
    const handleL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), matBrass);
    handleL2.position.set(0.22, 0, -0.04);
    doorL.add(doorGlassL, handleL1, handleL2);
    doorPivotL.add(doorL);

    const doorPivotR = new THREE.Group();
    doorPivotR.position.set(0.55, 0, 0);
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.54, 2.05, 0.05), matMahogany);
    doorR.position.set(-0.27, 1.025, 0);
    const doorGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.5, 0.04), matGlass);
    doorGlassR.position.set(0, 0.1, 0);
    const handleR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), matBrass);
    handleR1.position.set(-0.22, 0, 0.04);
    const handleR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), matBrass);
    handleR2.position.set(-0.22, 0, -0.04);
    doorR.add(doorGlassR, handleR1, handleR2);
    doorPivotR.add(doorR);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: doorPivotL,
        secondaryMesh: doorPivotR,
        type: 'swing',
        openAngle: -1.35,
        secondaryOpenAngle: 1.35,
        x: 0,
        z: -155.0 - 7.0,
        doorBox: { minX: -0.55, maxX: 0.55, minZ: -162.20, maxZ: -161.80 },
        name: '전망차 발코니 프렌치 도어'
      });
    }

    rearWallGroup.add(rwL, rwR, rwTop, rwCasing, doorPivotL, doorPivotR);
    group.add(rearWallGroup);

    // ==========================================
    // 4. OBSERVATION PARLOR SALON (INTERIOR)
    // ==========================================
    const createSwivelChair = (x, z, rotY) => {
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      chair.rotation.y = rotY;

      // Brass swivel pedestal
      const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.04, 12), matBrass);
      pedBase.position.set(0, 0.02, 0);
      const pedStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), matBrass);
      pedStem.position.set(0, 0.18, 0);

      // Deep blue velvet seat cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.65), matVelvetBlue);
      seat.position.set(0, 0.44, 0);
      seat.castShadow = true;

      // Curved barrel backrest
      const back = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.55, 16, 1, true, -Math.PI * 0.5, Math.PI),
        matVelvetBlue
      );
      back.position.set(0, 0.68, 0);
      back.scale.set(1.0, 1.0, 0.85);

      chair.add(pedBase, pedStem, seat, back);
      return chair;
    };

    // Pairs of swivel observation chairs facing outward toward windows
    [-1, 1].forEach(side => {
      for (let cz = -5.0; cz <= 7.0; cz += 2.5) {
        // Chair facing slightly diagonal toward window
        group.add(createSwivelChair(side * 1.15, cz, side * (Math.PI / 2 + 0.2)));
      }
    });

    // Elegant Writing Desk with Brass Lamp (Left Wall)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-width / 2 + 0.45, 0, 1.0);
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.75, 1.2), matMahogany);
    deskTop.position.set(0, 0.375, 0);
    // Green banker's lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), matBrass);
    lampStem.position.set(0, 0.85, 0);
    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.18, 8, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x164722, roughness: 0.3 })
    );
    lampShade.rotation.z = Math.PI / 2;
    lampShade.position.set(0, 0.98, 0);
    const deskLight = new THREE.PointLight(0xd9ffb8, 0.6, 3.0);
    deskLight.position.set(0, 0.95, 0);
    deskGroup.add(deskTop, lampStem, lampShade, deskLight);
    group.add(deskGroup);

    // ==========================================
    // 5. REAR OBSERVATION OPEN-AIR PLATFORM & ILLUMINATED DRUMHEAD
    // (Z = -7.0 to -10.0, Length 3m)
    // ==========================================
    const platformGroup = new THREE.Group();
    platformGroup.position.set(0, 0, -8.5);

    // Metal Platform Tread Floor
    const pFloor = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.1, 0.08, 3.0),
      new THREE.MeshStandardMaterial({ map: Textures.rivetedSteel, roughness: 0.8, metalness: 0.7 })
    );
    pFloor.position.set(0, 0.04, 0);
    platformGroup.add(pFloor);

    // Overhanging Roof Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, 0.12, 3.0), matExtGreen);
    canopy.position.set(0, height, 0);
    platformGroup.add(canopy);

    // Ornate Brass Balustrade Railings (Rear & Sides)
    const createRailSegment = (w, h, x, y, z, rotY = 0) => {
      const rGroup = new THREE.Group();
      rGroup.position.set(x, y, z);
      rGroup.rotation.y = rotY;

      // Top handrail
      const topRail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, w, 8), matBrass);
      topRail.rotation.z = Math.PI / 2;
      topRail.position.set(0, h, 0);
      rGroup.add(topRail);

      // Bottom rail
      const botRail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, w, 8), matBrass);
      botRail.rotation.z = Math.PI / 2;
      botRail.position.set(0, 0.1, 0);
      rGroup.add(botRail);

      // Vertical pickets
      const numPickets = Math.floor(w / 0.18);
      for (let p = 0; p <= numPickets; p++) {
        const px = -w / 2 + (p / numPickets) * w;
        const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, h - 0.1, 6), matBrass);
        picket.position.set(px, h / 2, 0);
        rGroup.add(picket);
      }

      return rGroup;
    };

    // Left railing
    platformGroup.add(createRailSegment(2.9, 1.1, -width / 2 + 0.1, 0, 0, Math.PI / 2));
    // Right railing
    platformGroup.add(createRailSegment(2.9, 1.1, width / 2 - 0.1, 0, 0, Math.PI / 2));
    // Rear railing (Left & Right side, center has gate)
    platformGroup.add(createRailSegment(1.0, 1.1, -0.9, 0, -1.45, 0));
    platformGroup.add(createRailSegment(1.0, 1.1, 0.9, 0, -1.45, 0));

    // Corner Support Posts
    [-width / 2 + 0.1, width / 2 - 0.1].forEach(px => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, height, 8), matBrass);
      post.position.set(px, height / 2, -1.45);
      platformGroup.add(post);
    });

    // 6. Iconic Illuminated 1930s Drumhead Logo Sign on Rear Gate
    const drumheadGroup = new THREE.Group();
    drumheadGroup.position.set(0, 0.65, -1.48);

    // Brass outer ring
    const drumRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.03, 8, 24), matBrass);

    // Glowing translucent round face with vintage logo
    const drumCanvas = document.createElement('canvas');
    drumCanvas.width = 256;
    drumCanvas.height = 256;
    const dctx = drumCanvas.getContext('2d');

    // Navy & Gold emblem
    dctx.fillStyle = '#0f2038';
    dctx.beginPath();
    dctx.arc(128, 128, 120, 0, Math.PI * 2);
    dctx.fill();

    dctx.strokeStyle = '#dfb142';
    dctx.lineWidth = 6;
    dctx.stroke();

    dctx.fillStyle = '#dfb142';
    dctx.font = 'bold 22px serif';
    dctx.textAlign = 'center';
    dctx.fillText('THE', 128, 80);
    dctx.font = 'bold 26px serif';
    dctx.fillText('1930 LIMITED', 128, 130);
    dctx.font = 'bold 16px sans-serif';
    dctx.fillText('PACIFIC EXPRESS', 128, 175);

    const drumTex = new THREE.CanvasTexture(drumCanvas);
    const drumFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.35, 24),
      new THREE.MeshBasicMaterial({ map: drumTex })
    );
    drumFace.rotation.y = Math.PI;

    // Drumhead warm glow casting onto the rails behind
    const drumLight = new THREE.PointLight(0xffe89e, 1.2, 8.0);
    drumLight.position.set(0, 0, -0.4);

    drumheadGroup.add(drumRing, drumFace, drumLight);
    platformGroup.add(drumheadGroup);

    group.add(platformGroup);

    // 7. Interior Lighting
    for (let lz = -4.0; lz <= 7.0; lz += 3.5) {
      const ceilLamp = new THREE.Group();
      ceilLamp.position.set(0, height - 0.15, lz);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.06, 12), matBrass);
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfff0d4 })
      );
      globe.position.set(0, -0.1, 0);

      const light = new THREE.PointLight(0xffdfaa, 0.8, 5.5);
      light.position.set(0, -0.15, 0);

      ceilLamp.add(base, globe, light);
      group.add(ceilLamp);
    }

    return group;
  };

  return { create };
})();

// Car 1: 1930s Steam Locomotive (기관차 운전실 & 탄수차)
// Faithfully modeled from 1930s Pennsylvania K4s / American 4-6-2 steam locomotive references
const Car1_Locomotive = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car1_Locomotive';

    // Train coordinate reference:
    // Locomotive sits from Z = +16 (front cowcatcher) to Z = -1.5 (cab rear), Tender sits from Z = -1.5 to Z = -11.5.
    // Car floor level in cab: Y = 1.6m (above driving wheel axles).
    // Eye height for player: 1.65m above floor = Y = 3.25m.

    // --- MATERIALS ---
    const matSteel = new THREE.MeshStandardMaterial({
      map: Textures.rivetedSteel,
      roughness: 0.6,
      metalness: 0.8
    });

    const matBoiler = new THREE.MeshStandardMaterial({
      map: Textures.boilerIron,
      roughness: 0.7,
      metalness: 0.75
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matCopper = new THREE.MeshStandardMaterial({
      color: 0xc87d55,
      roughness: 0.35,
      metalness: 0.85
    });

    const matCastIron = new THREE.MeshStandardMaterial({
      color: 0x1f2124,
      roughness: 0.85,
      metalness: 0.5
    });

    const matWoodFloor = new THREE.MeshStandardMaterial({
      map: Textures.woodFloor,
      roughness: 0.8,
      metalness: 0.1
    });

    const matLeather = new THREE.MeshStandardMaterial({
      color: 0x3d2214,
      roughness: 0.6,
      metalness: 0.1
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // ==========================================
    // 1. CAB STRUCTURE (운전실 구조: W 3.0m, H 2.7m, L 3.2m)
    // ==========================================
    const cabGroup = new THREE.Group();
    cabGroup.position.set(0, 1.6, 0); // Cab floor at Y=1.6m

    // A. Cab Floor (Steel footplate & wood tread)
    const cabFloorGeo = new THREE.BoxGeometry(2.9, 0.1, 3.2);
    const cabFloor = new THREE.Mesh(cabFloorGeo, matWoodFloor);
    cabFloor.position.set(0, -0.05, 0);
    cabFloor.receiveShadow = true;
    cabGroup.add(cabFloor);

    // B. Cab Walls & Roof
    // Left Wall with sliding window
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 3.2), matSteel);
    leftWall.position.set(-1.45, 1.3, 0);
    cabGroup.add(leftWall);

    // Right Wall with sliding window
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 3.2), matSteel);
    rightWall.position.set(1.45, 1.3, 0);
    cabGroup.add(rightWall);

    // Side Windows (Cutout look with frames & glass)
    const createWindow = (x, z) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, 1.7, z);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 1.4), matCastIron);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 1.3), matGlass);
      wGroup.add(frame, glass);
      return wGroup;
    };
    cabGroup.add(createWindow(-1.45, 0.2));
    cabGroup.add(createWindow(1.45, 0.2));

    // Cab Arched Ceiling & Roof (Clean arched box with clerestory)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.12, 3.3), matSteel);
    roof.position.set(0, 2.6, 0);
    cabGroup.add(roof);

    // Curved roof eaves on left and right
    [-1.4, 1.4].forEach(ex => {
      const eave = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 3.3), matSteel);
      eave.position.set(ex, 2.45, 0);
      cabGroup.add(eave);
    });

    // Roof Clerestory Ventilation Hatch
    const hatch = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 1.4), matCastIron);
    hatch.position.set(0, 2.75, 0);
    cabGroup.add(hatch);

    // Rear Cab Archway / Tender Curtain Rod
    const rearArchL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 0.1), matSteel);
    rearArchL.position.set(-1.25, 1.2, -1.55);
    const rearArchR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 0.1), matSteel);
    rearArchR.position.set(1.25, 1.2, -1.55);
    const rearArchTop = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.4, 0.1), matSteel);
    rearArchTop.position.set(0, 2.4, -1.55);
    cabGroup.add(rearArchL, rearArchR, rearArchTop);

    // ==========================================
    // 2. BOILER BACKHEAD (보일러 뒷벽: 화실 및 기계장치)
    // Reference Image 2: Massive curved backhead taking up front wall of cab
    // ==========================================
    const backheadGroup = new THREE.Group();
    backheadGroup.position.set(0, 0, 1.3); // Located at front of cab

    // Massive curved boiler end extending forward into boiler (+Z)
    const backheadMain = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.35, 2.2, 32),
      matBoiler
    );
    backheadMain.rotation.x = Math.PI / 2;
    backheadMain.position.set(0, 1.25, 1.1);
    backheadGroup.add(backheadMain);

    // Backhead face plate (facing the cab and player)
    const backheadPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(1.32, 1.32, 0.08, 32),
      matCastIron
    );
    backheadPlate.rotation.x = Math.PI / 2;
    backheadPlate.position.set(0, 1.25, 0.0);
    backheadGroup.add(backheadPlate);

    // A. Firebox Door (화실 입구) at bottom center
    const fireboxFrame = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.1, 20),
      matCastIron
    );
    fireboxFrame.rotation.x = Math.PI / 2;
    fireboxFrame.position.set(0, 0.5, -0.06);
    backheadGroup.add(fireboxFrame);

    // Burning glowing coals inside firebox
    const fireboxInterior = new THREE.Mesh(
      new THREE.PlaneGeometry(0.65, 0.5),
      new THREE.MeshBasicMaterial({
        map: Textures.fireTexture,
        transparent: false
      })
    );
    fireboxInterior.position.set(0, 0.5, -0.08);
    backheadGroup.add(fireboxInterior);

    // Firebox butterfly split doors (cracked open)
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.04), matCastIron);
    doorL.position.set(-0.16, 0.5, -0.14);
    doorL.rotation.y = -0.3;
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.04), matCastIron);
    doorR.position.set(0.16, 0.5, -0.14);
    doorR.rotation.y = 0.3;
    backheadGroup.add(doorL, doorR);

    // Dynamic firebox orange-red glow
    const fireLight = new THREE.PointLight(0xff6a00, 3.0, 5.0, 1.5);
    fireLight.position.set(0, 0.5, -0.3);
    fireLight.name = 'FireLight';
    backheadGroup.add(fireLight);

    // B. Main Throttle Lever (가감속 대형 대각선 레버 - as seen in Image 2)
    const throttleGroup = new THREE.Group();
    throttleGroup.position.set(0.05, 1.7, -0.18);
    // Lever bar
    const throttleBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.1, 0.02),
      matSteel
    );
    throttleBar.rotation.z = 0.55; // Angle across backhead
    // Handle grip
    const throttleHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8),
      matBrass
    );
    throttleHandle.position.set(0.35, -0.42, 0.03);
    throttleHandle.rotation.x = Math.PI / 2;
    // Ratchet quadrant
    const quadrant = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.02, 6, 16, Math.PI / 2),
      matCastIron
    );
    quadrant.rotation.z = 0.8;
    quadrant.position.set(0, 0, -0.02);

    throttleGroup.add(throttleBar, throttleHandle, quadrant);
    backheadGroup.add(throttleGroup);

    // C. Steam Pressure Gauges Cluster (Top manifold, as seen in Image 2)
    const gaugeY = 2.15;
    const gaugeZ = -0.18;
    const gaugeConfigs = [
      { x: -0.65, tex: Textures.brakeGauge, r: 0.11, label: 'Air Brake' },
      { x: -0.35, tex: Textures.steamGauge, r: 0.13, label: 'Boiler Main' },
      { x: 0.0, tex: Textures.steamGauge, r: 0.16, label: 'Master Steam' }, // Large central dial
      { x: 0.35, tex: Textures.steamGauge, r: 0.13, label: 'Chest Pressure' },
      { x: 0.65, tex: Textures.speedGauge, r: 0.11, label: 'Speedometer' }
    ];

    gaugeConfigs.forEach(g => {
      const gGroup = new THREE.Group();
      gGroup.position.set(g.x, gaugeY, gaugeZ);

      // Brass casing
      const casing = new THREE.Mesh(
        new THREE.CylinderGeometry(g.r, g.r * 1.05, 0.06, 20),
        matBrass
      );
      casing.rotation.x = Math.PI / 2;

      // Face dial
      const face = new THREE.Mesh(
        new THREE.CircleGeometry(g.r * 0.9, 20),
        new THREE.MeshBasicMaterial({ map: g.tex })
      );
      face.position.set(0, 0, -0.032);
      face.rotation.y = Math.PI;

      // Copper pipe connecting to manifold
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.25, 8),
        matCopper
      );
      pipe.position.set(0, -g.r - 0.1, -0.01);

      gGroup.add(casing, face, pipe);
      backheadGroup.add(gGroup);
    });

    // Horizontal steam turret manifold pipe
    const manifold = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 1.6, 12),
      matCopper
    );
    manifold.rotation.z = Math.PI / 2;
    manifold.position.set(0, gaugeY - 0.22, gaugeZ - 0.02);
    backheadGroup.add(manifold);

    // D. Water Level Sight Glasses (수위계 - Left and Right of backhead)
    [-0.55, 0.55].forEach(xPos => {
      const waterGroup = new THREE.Group();
      waterGroup.position.set(xPos, 1.4, gaugeZ);

      const waterBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.55, 0.06),
        new THREE.MeshBasicMaterial({ map: Textures.waterGauge })
      );
      waterBox.rotation.y = Math.PI;

      // Top and bottom brass test cocks with turn keys
      const cockTop = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), matBrass);
      cockTop.position.set(0, 0.3, 0);
      const cockBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), matBrass);
      cockBottom.position.set(0, -0.3, 0);

      // Copper feed line
      const line = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), matCopper);
      line.position.set(0, -0.5, 0);

      waterGroup.add(waterBox, cockTop, cockBottom, line);
      backheadGroup.add(waterGroup);
    });

    // E. Valve Handwheels (황동 밸브 핸들 6개 배치)
    const valveCoords = [
      { x: -0.75, y: 1.7, z: -0.16, r: 0.08, col: matBrass },
      { x: -0.42, y: 1.85, z: -0.16, r: 0.07, col: matBrass },
      { x: 0.42, y: 1.85, z: -0.16, r: 0.07, col: matBrass },
      { x: 0.75, y: 1.7, z: -0.16, r: 0.08, col: matBrass },
      { x: -0.22, y: 1.25, z: -0.14, r: 0.06, col: matCastIron },
      { x: 0.22, y: 1.25, z: -0.14, r: 0.06, col: matCastIron }
    ];

    valveCoords.forEach(vc => {
      const vGroup = new THREE.Group();
      vGroup.position.set(vc.x, vc.y, vc.z);

      const wheelRim = new THREE.Mesh(
        new THREE.TorusGeometry(vc.r, 0.012, 6, 12),
        vc.col
      );
      const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(vc.r * 2, 0.015, 0.015), vc.col);
      const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.015, vc.r * 2, 0.015), vc.col);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), vc.col);
      stem.rotation.x = Math.PI / 2;
      stem.position.set(0, 0, 0.05);

      vGroup.add(wheelRim, spoke1, spoke2, stem);
      backheadGroup.add(vGroup);
    });

    // F. Hydrostatic Lubricator Box (Lower left side, as shown in Image 2)
    const lubGroup = new THREE.Group();
    lubGroup.position.set(-0.85, 0.7, -0.15);
    const lubBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.18), matCastIron);
    const sightFeed1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), matBrass);
    sightFeed1.position.set(-0.06, 0.05, -0.1);
    const sightFeed2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), matBrass);
    sightFeed2.position.set(0.06, 0.05, -0.1);
    lubGroup.add(lubBox, sightFeed1, sightFeed2);
    backheadGroup.add(lubGroup);

    // G. Intricate Copper & Brass Piping Network along Backhead
    const pipePoints1 = [
      new THREE.Vector3(-0.7, 2.0, -0.15),
      new THREE.Vector3(-0.9, 1.5, -0.14),
      new THREE.Vector3(-0.9, 0.3, -0.1)
    ];
    const pipeGeo1 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pipePoints1), 16, 0.02, 8, false);
    backheadGroup.add(new THREE.Mesh(pipeGeo1, matCopper));

    const pipePoints2 = [
      new THREE.Vector3(0.7, 2.0, -0.15),
      new THREE.Vector3(0.95, 1.4, -0.14),
      new THREE.Vector3(0.95, 0.2, -0.1)
    ];
    const pipeGeo2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pipePoints2), 16, 0.02, 8, false);
    backheadGroup.add(new THREE.Mesh(pipeGeo2, matCopper));

    cabGroup.add(backheadGroup);

    // ==========================================
    // 3. ENGINEER & FIREMAN STATIONS
    // ==========================================
    // A. Engineer Station (Right side)
    const engineerStation = new THREE.Group();
    engineerStation.position.set(1.05, 0, 0.3);

    // Reverser Quadrant & Screw Wheel / Johnson Bar
    const reverserWheel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 8, 16), matBrass);
    reverserWheel.position.set(0.2, 1.1, 0.2);
    reverserWheel.rotation.y = Math.PI / 2;
    const reverserStand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 0.35), matCastIron);
    reverserStand.position.set(0.2, 0.5, 0.2);

    // Westinghouse Air Brake Valve Stand & Handle
    const brakePedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.9, 12), matCastIron);
    brakePedestal.position.set(0.1, 0.45, 0.6);
    const brakeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.04), matBrass);
    brakeHandle.position.set(0.05, 0.92, 0.6);

    // Engineer Seat (Folded cantilevered bracket with leather cushion)
    const seatPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), matCastIron);
    seatPost.position.set(0.15, 0.35, -0.4);
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.42), matLeather);
    seatCushion.position.set(0.15, 0.72, -0.4);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.42), matLeather);
    seatBack.position.set(0.32, 0.95, -0.4);

    engineerStation.add(reverserWheel, reverserStand, brakePedestal, brakeHandle, seatPost, seatCushion, seatBack);
    cabGroup.add(engineerStation);

    // B. Fireman Station (Left side)
    const firemanStation = new THREE.Group();
    firemanStation.position.set(-1.05, 0, 0.3);

    // Fireman Seat
    const fSeatPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), matCastIron);
    fSeatPost.position.set(-0.15, 0.35, -0.4);
    const fSeatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.42), matLeather);
    fSeatCushion.position.set(-0.15, 0.72, -0.4);

    // Heavy Coal Shovel (화부 석탄 삽)
    const shovelGroup = new THREE.Group();
    shovelGroup.position.set(-0.25, 0.1, -0.7);
    shovelGroup.rotation.x = 0.3;
    shovelGroup.rotation.z = -0.2;
    const shovelShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), matWoodFloor);
    shovelShaft.position.set(0, 0.6, 0);
    const shovelBlade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.03), matCastIron);
    shovelBlade.position.set(0, 0.15, 0);
    const shovelGrip = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 6, 8), matCastIron);
    shovelGrip.position.set(0, 1.2, 0);
    shovelGroup.add(shovelShaft, shovelBlade, shovelGrip);

    firemanStation.add(fSeatPost, fSeatCushion, shovelGroup);
    cabGroup.add(firemanStation);

    // C. Whistle Pull Cord (interactive pull cord hanging from roof)
    const whistleCord = new THREE.Group();
    whistleCord.name = 'InteractiveWhistle';
    whistleCord.position.set(0.35, 2.3, 0.4);
    const cordWire = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.8, 6), matCopper);
    cordWire.position.set(0, -0.4, 0);
    const cordHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), matBrass);
    cordHandle.position.set(0, -0.85, 0);
    whistleCord.add(cordWire, cordHandle);
    cabGroup.add(whistleCord);

    // D. Cab Warm Illumination
    const cabLight = new THREE.PointLight(0xffdfa4, 1.2, 6.0);
    cabLight.position.set(0, 2.3, 0);
    cabGroup.add(cabLight);

    group.add(cabGroup);

    // ==========================================
    // 4. LOCOMOTIVE EXTERIOR (BOILER, WHEELS, SMOKEBOX)
    // Z = +1.4 to Z = +16.0
    // ==========================================
    const extGroup = new THREE.Group();

    // Giant Boiler Cylinder (Diameter 2.3m, Length 10.5m)
    const boilerLength = 10.5;
    const boilerRadius = 1.15;
    const boilerMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(boilerRadius, boilerRadius, boilerLength, 32),
      matBoiler
    );
    boilerMesh.rotation.x = Math.PI / 2;
    boilerMesh.position.set(0, 2.8, 1.4 + boilerLength / 2);
    boilerMesh.castShadow = true;
    extGroup.add(boilerMesh);

    // Front Smokebox (Z = ~12.5m)
    const smokebox = new THREE.Mesh(
      new THREE.CylinderGeometry(boilerRadius * 1.02, boilerRadius * 1.02, 2.6, 32),
      matCastIron
    );
    smokebox.rotation.x = Math.PI / 2;
    smokebox.position.set(0, 2.8, 12.0);
    extGroup.add(smokebox);

    // Round Smokebox Front Door with hinges
    const smokeboxDoor = new THREE.Mesh(
      new THREE.SphereGeometry(boilerRadius * 1.01, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35),
      matCastIron
    );
    smokeboxDoor.rotation.x = -Math.PI / 2;
    smokeboxDoor.position.set(0, 2.8, 13.3);
    extGroup.add(smokeboxDoor);

    // Front Brass Headlight Lantern
    const headlightGroup = new THREE.Group();
    headlightGroup.position.set(0, 3.7, 13.4);
    const hHousing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.6), matCastIron);
    const hLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.24, 16),
      new THREE.MeshBasicMaterial({ color: 0xfffae0 })
    );
    hLens.position.set(0, 0, 0.31);
    const hLight = new THREE.SpotLight(0xfffae0, 5.0, 60.0, Math.PI / 6, 0.4);
    hLight.position.set(0, 0, 0.4);
    hLight.target.position.set(0, 1.0, 30.0);
    headlightGroup.add(hHousing, hLens, hLight, hLight.target);
    extGroup.add(headlightGroup);

    // Cowcatcher (Pilot wedge grill at track level, Z = 14m)
    const pilotGroup = new THREE.Group();
    pilotGroup.position.set(0, 0.6, 13.8);
    const pilotNose = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.5, 3), matCastIron);
    pilotNose.rotation.x = Math.PI / 2;
    pilotNose.rotation.y = Math.PI;
    pilotNose.scale.set(1.0, 0.6, 0.9);
    pilotGroup.add(pilotNose);
    extGroup.add(pilotGroup);

    // Smokestack (굴뚝) with steam smoke particle system
    const smokestack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.26, 1.2, 16),
      matCastIron
    );
    smokestack.position.set(0, 4.3, 12.0);
    extGroup.add(smokestack);

    // Steam Domes (증기돔, 모래돔, 벨)
    const sandDome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), matBoiler);
    sandDome.position.set(0, 4.0, 8.5);
    sandDome.scale.set(1, 1.2, 1);
    const steamDome = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 12), matBoiler);
    steamDome.position.set(0, 4.05, 5.0);
    steamDome.scale.set(1, 1.25, 1);
    const brassBell = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.35, 12), matBrass);
    brassBell.position.set(0, 4.15, 10.2);
    extGroup.add(sandDome, steamDome, brassBell);

    // Heavy Driving Wheels (6 Giant Drivers, ~1.8m diameter, 3 on each side)
    const wheelRadius = 0.9;
    const wheelPositionsZ = [3.2, 5.6, 8.0];

    [-1.4, 1.4].forEach(xSide => {
      wheelPositionsZ.forEach(zPos => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(xSide, wheelRadius + 0.1, zPos);

        const tire = new THREE.Mesh(
          new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.14, 28),
          matCastIron
        );
        tire.rotation.z = Math.PI / 2;

        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.22, 12),
          matCastIron
        );
        hub.rotation.z = Math.PI / 2;

        // Counterweight wedge
        const counterweight = new THREE.Mesh(
          new THREE.CylinderGeometry(wheelRadius * 0.88, wheelRadius * 0.88, 0.1, 12, 1, false, 0, Math.PI * 0.7),
          matCastIron
        );
        counterweight.rotation.z = Math.PI / 2;

        wheelGroup.add(tire, hub, counterweight);
        extGroup.add(wheelGroup);
      });

      // Side Connecting Rod (Connecting all 3 drivers)
      const sideRod = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.12, 5.4),
        matSteel
      );
      sideRod.position.set(xSide * 1.08, wheelRadius * 0.6 + 0.1, 5.6);
      extGroup.add(sideRod);

      // Main Steam Piston Cylinder at front
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 1.8, 16),
        matCastIron
      );
      cylinder.rotation.x = Math.PI / 2;
      cylinder.position.set(xSide * 1.15, 1.1, 10.8);
      extGroup.add(cylinder);
    });

    group.add(extGroup);

    // ==========================================
    // 5. COAL TENDER (탄수차: 석탄과 물 공급차)
    // Sits directly behind cab from Z = -1.5 to Z = -11.5
    // Length: 10m, Width: 3.1m, Height: 3.2m
    // ==========================================
    const tenderGroup = new THREE.Group();
    tenderGroup.position.set(0, 1.6, -6.5);

    // Tender Floor
    const tenderFloor = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.15, 9.8),
      matCastIron
    );
    tenderFloor.position.set(0, -0.05, 0);
    tenderGroup.add(tenderFloor);

    // Tender Coal Bunker Outer Steel Walls
    const tenderWallL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 9.8), matSteel);
    tenderWallL.position.set(-1.45, 1.05, 0);
    const tenderWallR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 9.8), matSteel);
    tenderWallR.position.set(1.45, 1.05, 0);
    const tenderWallBack = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 0.12), matSteel);
    tenderWallBack.position.set(0, 1.05, -4.85);
    tenderGroup.add(tenderWallL, tenderWallR, tenderWallBack);

    // Giant Mounded Coal Pile (Textures.coal)
    const coalPileGeo = new THREE.ConeGeometry(1.3, 1.8, 16);
    const matCoal = new THREE.MeshStandardMaterial({
      map: Textures.coal,
      roughness: 0.9,
      metalness: 0.2
    });
    const coalPile1 = new THREE.Mesh(coalPileGeo, matCoal);
    coalPile1.scale.set(1.0, 0.9, 2.2);
    coalPile1.position.set(0, 1.4, 1.2);
    const coalPile2 = new THREE.Mesh(coalPileGeo, matCoal);
    coalPile2.scale.set(0.9, 0.8, 1.8);
    coalPile2.position.set(0, 1.3, -1.2);
    tenderGroup.add(coalPile1, coalPile2);

    // Coal Bunker Front Gate / Stoker Chute facing Cab
    const stokerChute = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), matCastIron);
    stokerChute.position.set(0, 0.4, 4.4);
    tenderGroup.add(stokerChute);

    // Safe Catwalk / Walkway along Left Side with Brass Handrails
    // Allows the player to walk seamlessly from the cab to Car 2!
    const catwalk = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.08, 9.8),
      matSteel
    );
    catwalk.position.set(-1.05, 0.02, 0);
    tenderGroup.add(catwalk);

    // Handrail along catwalk
    for (let rz = -4.5; rz <= 4.5; rz += 1.5) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8), matBrass);
      post.position.set(-0.72, 0.55, rz);
      tenderGroup.add(post);
    }
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 9.5, 8), matBrass);
    rail.rotation.x = Math.PI / 2;
    rail.position.set(-0.72, 1.1, 0);
    tenderGroup.add(rail);

    // Tender Rear Water Filler Hatch (round manhole)
    const waterHatch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16), matCastIron);
    waterHatch.position.set(0, 2.2, -4.0);
    tenderGroup.add(waterHatch);

    // Rear gangway plate and steps connecting to Baggage Car (Car 2)
    const rearApron = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 1.5), matSteel);
    rearApron.position.set(-0.4, -0.2, -5.2);
    tenderGroup.add(rearApron);

    group.add(tenderGroup);

    return group;
  };

  return { create };
})();

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
    const width = 3.5;
    const height = 2.85;

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

    // Pullman Deep Crimson/Burgundy Velvet Upholstery (Photo 2 & 4)
    const matVelvetCrimson = new THREE.MeshStandardMaterial({
      color: 0x6e1b24,
      roughness: 0.75,
      metalness: 0.08
    });

    // Crisp White Antimacassar Headrest Linen Covers (Photo 1, 2, 3)
    const matWhiteAntimacassar = new THREE.MeshStandardMaterial({
      color: 0xf6f4ed,
      roughness: 0.9,
      metalness: 0.02
    });

    // Deep Velvet Window Curtains (Photo 1)
    const matCurtainVelvet = new THREE.MeshStandardMaterial({
      color: 0x4a1219,
      roughness: 0.85,
      metalness: 0.05
    });

    // Window Shade / Blind
    const matWindowShade = new THREE.MeshStandardMaterial({
      color: 0x2b1e16,
      roughness: 0.8,
      metalness: 0.05
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
    const aisleCarpet = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.01, length), matCarpetAisle);
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

        // Window upper roller blind / shade (Photo 1 & 3)
        const shade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, windowSpan * 0.74), matWindowShade);
        shade.position.set(0, 1.95, wz);
        wallGroup.add(shade);

        // Velvet Window Curtains framing the windows (Photo 1)
        const curtainLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.15, 0.12), matCurtainVelvet);
        curtainLeft.position.set(-xSide * 0.02, 1.5, wz - windowSpan * 0.34);
        const curtainRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.15, 0.12), matCurtainVelvet);
        curtainRight.position.set(-xSide * 0.02, 1.5, wz + windowSpan * 0.34);
        wallGroup.add(curtainLeft, curtainRight);

        // Mahogany frame pillar
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.2, windowSpan * 0.25), matMahogany);
        pillar.position.set(0, 1.5, wz + windowSpan * 0.5);
        wallGroup.add(pillar);
      }

      return wallGroup;
    };
    group.add(createSideWall(-1));
    group.add(createSideWall(1));

    // End Bulkheads with Doorways & Interactive Sliding Doors
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

      // Sliding Mahogany Door
      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.05, 0.05), matMahogany);
      sDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
      dWin.position.set(0, 0.35, 0);
      sDoor.add(dWin);
      bh.add(sDoor);

      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: sDoor,
          type: 'slide',
          openOffset: 0.92,
          x: 0,
          z: -45.0 + zPos,
          name: zPos > 0 ? '3호차 앞문' : '3호차 뒷문'
        });
      }

      return bh;
    };
    group.add(createBulkhead(length / 2));
    group.add(createBulkhead(-length / 2));

    // 4. Passenger Seats (7 pairs of 2x2 seating, leaving rear section for Lavatory & Side Corridor as in Photo 5)
    const createDoubleSeat = (xPos, zPos, faceDir = 1) => {
      const seatGroup = new THREE.Group();
      seatGroup.position.set(xPos, 0, zPos);
      if (faceDir === -1) seatGroup.rotation.y = Math.PI;

      // Base pedestal & cast iron leg
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.08), matCastIron);
      leg.position.set(0, 0.2, 0);

      // Seat cushion (two-passenger wide, Pullman deep crimson velvet - Photo 2 & 4)
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.16, 0.55), matVelvetCrimson);
      cushion.position.set(0, 0.45, 0);
      cushion.castShadow = true;

      // Reversible seat backrest
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.12), matVelvetCrimson);
      backrest.position.set(0, 0.82, -0.22);
      backrest.rotation.x = -0.1;
      backrest.castShadow = true;

      // Crisp White Linen Antimacassar Headrest Covers (Photo 1, 2, 3)
      const antimacassar = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.22, 0.14), matWhiteAntimacassar);
      antimacassar.position.set(0, 1.05, -0.24);
      antimacassar.rotation.x = -0.1;

      // Aisle-side decorative cast-iron armrest with polished mahogany cap (Photo 2 & 4)
      const armX = xPos > 0 ? -0.47 : 0.47;
      const armrestIron = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, 0.46), matCastIron);
      armrestIron.position.set(armX, 0.60, 0);
      const armrestWood = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.48), matMahogany);
      armrestWood.position.set(armX, 0.75, 0);

      // Wall-side armrest
      const wallArmX = xPos > 0 ? 0.47 : -0.47;
      const wallArmIron = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.44), matCastIron);
      wallArmIron.position.set(wallArmX, 0.60, 0);

      seatGroup.add(leg, cushion, backrest, antimacassar, armrestIron, armrestWood, wallArmIron);
      return seatGroup;
    };

    // 7 pairs of seats (Z = -4.0 to +5.6 relative to car center)
    const seatSpacing = 1.6;
    for (let i = 0; i < 7; i++) {
      const sz = -4.2 + i * seatSpacing;
      group.add(createDoubleSeat(-1.12, sz, 1));
      group.add(createDoubleSeat(1.12, sz, 1));
    }

    // ==========================================
    // 5. RESTROOM / LAVATORY (화장실 - 1930s 미국 열차 객차 끝 화장실 예시 ①, ②, ③ 완벽 구현)
    // Enclosed on the Right (X: -0.26 to 1.69, Z: -9.85 to -6.8), Unobstructed 1.35m Corridor on the Left!
    // ==========================================
    const bathGroup = new THREE.Group();
    bathGroup.position.set(0, 0, -8.3);

    // Floor: Dark non-slip industrial speckled linoleum / rubber floor (Panel ①)
    const matBathFloor = new THREE.MeshStandardMaterial({
      color: 0x24282c,
      roughness: 0.7,
      metalness: 0.2
    });
    const bathFloor = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.02, 3.05), matBathFloor);
    bathFloor.position.set(0.715, 0.01, -0.025);
    bathFloor.receiveShadow = true;
    bathGroup.add(bathFloor);

    // Brass doorway threshold strip (Panel ③)
    const threshold = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.025, 0.08), matBrass);
    threshold.position.set(0.17, 0.015, 1.48);
    bathGroup.add(threshold);

    // Outer Corridor Partition Wall: Rich polished mahogany facing the corridor (Panel ③)
    const bathWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 3.05), matMahogany);
    bathWallL.position.set(-0.30, height / 2, -0.025);

    // Inner Enamel Metal Lining: Cream/light gray enameled metal panels with rivet trim (Panel ① & ②)
    const matCreamEnamel = new THREE.MeshStandardMaterial({ color: 0xeeebe1, roughness: 0.32, metalness: 0.1 });
    const innerLiningL = new THREE.Mesh(new THREE.BoxGeometry(0.02, height - 0.1, 3.01), matCreamEnamel);
    innerLiningL.position.set(-0.25, height / 2, -0.025);
    bathGroup.add(innerLiningL);

    // Front Partition Wall facing passenger seats (at Z = 1.5, with doorway)
    // Doorway opening spans X: -0.26 to +0.60 (clear width 0.86m!)
    const bathWallFront = new THREE.Mesh(new THREE.BoxGeometry(1.09, height, 0.08), matMahogany);
    bathWallFront.position.set(1.145, height / 2, 1.5);
    const bathTransom = new THREE.Mesh(new THREE.BoxGeometry(0.86, height - 2.10, 0.08), matMahogany);
    bathTransom.position.set(0.17, height - (height - 2.10) / 2, 1.5);

    // Inside Lavatory Materials (Panel ① & ②)
    const matPorcelain = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.15, metalness: 0.05 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe0e5ea, roughness: 0.15, metalness: 0.95 });
    const matStainlessSteel = new THREE.MeshStandardMaterial({ color: 0xd2d5d8, roughness: 0.22, metalness: 0.90 });
    const matDarkBakelite = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.35, metalness: 0.1 });

    // Ceiling Flush Dome Light in Corridor Foyer outside the toilet (Panel ③)
    const foyerLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 12), matChrome);
    foyerLampBase.position.set(-0.90, height - 0.05, 1.5);
    const foyerGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfff6dd }));
    foyerGlobe.position.set(-0.90, height - 0.10, 1.5);
    const foyerLight = new THREE.PointLight(0xffdfaa, 0.7, 3.5);
    foyerLight.position.set(-0.90, height - 0.15, 1.5);
    bathGroup.add(foyerLampBase, foyerGlobe, foyerLight);

    // "TOILET" Brass Plaque on Corridor Wall / Door Header (Panel ③)
    const matToiletSign = new THREE.MeshStandardMaterial({ color: 0x141618, roughness: 0.4 });
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.03), matToiletSign);
    signBox.position.set(0.17, height - 0.22, 1.54);
    const signPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.01), matBrass);
    signPlaque.position.set(0, 0, 0.02);
    signBox.add(signPlaque);
    bathGroup.add(signBox);

    // Restroom Door: Slides cleanly into wall so it NEVER blocks the doorway or corridor! (Panel ③)
    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(0.84, 2.05, 0.04), matMahogany);
    bathDoor.position.set(0.17, 1.025, 1.5);

    const doorInnerCream = new THREE.Mesh(new THREE.BoxGeometry(0.80, 1.95, 0.01), matCreamEnamel);
    doorInnerCream.position.set(0, 0, -0.02);
    const doorPlaqueBrass = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.02), matBrass);
    doorPlaqueBrass.position.set(0, 0.45, 0.025);
    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), matChrome);
    doorHandle.position.set(-0.35, 0, 0.03);
    bathDoor.add(doorInnerCream, doorPlaqueBrass, doorHandle);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: bathDoor,
        type: 'slide',
        openOffset: 0.90,
        x: 0.17,
        z: -45.0 - 6.8,
        name: '3호차 화장실 문'
      });
    }

    // ==========================================
    // PANEL ①: 화장실 내부 (변기 공간)
    // ==========================================
    // 1. Heavy Enamel/Porcelain Pedestal Toilet Bowl with Dark Round Seat Ring (Panel ①)
    const toiletBase = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.17, 0.45, 16), matPorcelain);
    toiletBase.position.set(1.05, 0.225, -1.15);
    // Dark bakelite / round toilet seat ring (좌변식 변기)
    const toiletSeatRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 16), matDarkBakelite);
    toiletSeatRing.position.set(1.05, 0.46, -1.15);
    toiletSeatRing.rotation.x = Math.PI / 2;

    // 2. High-Pressure Chrome Water Flush Pipe with Lever Mechanism (Panel ①)
    const flushPipeVert = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.2, 8), matChrome);
    flushPipeVert.position.set(0.80, 1.35, -1.45);
    const flushValve = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 10), matChrome);
    flushValve.position.set(0.80, 1.45, -1.45);
    const flushHandleLever = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8), matChrome);
    flushHandleLever.position.set(0.80, 1.45, -1.36);
    flushHandleLever.rotation.x = Math.PI / 2;
    const flushCrossPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), matChrome);
    flushCrossPipe.position.set(0.92, 0.65, -1.40);
    flushCrossPipe.rotation.z = Math.PI / 2;

    // "FLUSH" Wall Plaque above toilet (Panel ①)
    const flushPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.01), matChrome);
    flushPlaque.position.set(1.05, 1.75, -1.48);

    // 3. Polished Horizontal Metal Grab Rails along wall (Panel ①)
    const grabRailHoriz = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 8), matChrome);
    grabRailHoriz.rotation.x = Math.PI / 2;
    grabRailHoriz.position.set(0.40, 1.15, -1.05);

    // 4. Chrome Cylindrical Sanitary Pedal Waste Bin in Corner (Panel ①)
    const pedalBin = new THREE.Group();
    pedalBin.position.set(0.45, 0.18, -1.25);
    const binCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.36, 14), matChrome);
    const binPedal = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.08), matChrome);
    binPedal.position.set(0, -0.16, 0.11);
    pedalBin.add(binCylinder, binPedal);

    // 5. Metal Toilet Paper Dispenser under window (Panel ①)
    const tpHolder = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.16), matChrome);
    tpHolder.position.set(width / 2 - 0.08, 0.85, -1.15);

    // 6. Large Train Window on the Right Wall (Panel ① & ②)
    const restWindowFrame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.95, 0.72), matChrome);
    restWindowFrame.position.set(width / 2 - 0.06, 1.5, -0.60);
    const restWindowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.88, 0.65), new THREE.MeshPhysicalMaterial({ color: 0xdae8f5, roughness: 0.15, transmission: 0.85 }));
    restWindowGlass.position.set(width / 2 - 0.06, 1.5, -0.60);

    // ==========================================
    // PANEL ②: 세면대 공간 (Mounted against Right Wall, leaves center wide open!)
    // ==========================================
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(1.35, 0, 0.20);

    // 1. Polished Stainless Steel Countertop with Raised Marine Edge Rim (Panel ②)
    const vanityCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.78, 0.76), matCreamEnamel);
    vanityCabinet.position.set(0, 0.39, 0);
    const steelTop = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.04, 0.80), matStainlessSteel);
    steelTop.position.set(0, 0.80, 0);
    // Raised water-retaining marine lip rim
    const marineRim = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.82), matStainlessSteel);
    marineRim.position.set(-0.26, 0.83, 0);

    // Inset White Ceramic Washbasin (Panel ②)
    const ceramicBasin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.12, 16), matPorcelain);
    ceramicBasin.position.set(0, 0.78, 0.02);

    // 3-Hole Chrome Faucet Mixer: Center Spout + Left/Right Cross Handles (Panel ②)
    const vFaucetSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), matChrome);
    vFaucetSpout.position.set(0.16, 0.90, 0.02);
    const vHandleL = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.06), matChrome);
    vHandleL.position.set(0.16, 0.84, -0.10);
    const vHandleR = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.06), matChrome);
    vHandleR.position.set(0.16, 0.84, 0.10);

    vanityGroup.add(vanityCabinet, steelTop, marineRim, ceramicBasin, vFaucetSpout, vHandleL, vHandleR);

    // 2. Rectangular Beveled Vanity Mirror with Chrome Frame on Right Wall
    const vanityMirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.68, 0.48), matChrome);
    vanityMirror.position.set(width / 2 - 0.08, 1.50, 0.20);
    const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.64, 0.44), new THREE.MeshStandardMaterial({ color: 0xccddee, roughness: 0.05, metalness: 0.95 }));
    mirrorGlass.position.set(width / 2 - 0.09, 1.50, 0.20);

    // Glass Shelf for toiletries under mirror (Panel ②)
    const glassShelf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.44), matChrome);
    glassShelf.position.set(width / 2 - 0.11, 1.12, 0.20);

    // Overhead Cylindrical Electric Sconce Light above mirror (Panel ②)
    const sconceBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.28), matChrome);
    sconceBase.position.set(width / 2 - 0.08, 1.90, 0.20);
    const sconceBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 8), new THREE.MeshBasicMaterial({ color: 0xfffaee }));
    sconceBulb.rotation.x = Math.PI / 2;
    sconceBulb.position.set(width / 2 - 0.11, 1.90, 0.20);

    // 3. Wall Amenities: Metal Cup Tumbler Holder, Soap Dish, Towel Ring & Hanging Towel (Panel ②)
    const tumblerHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.030, 0.09, 10), matChrome);
    tumblerHolder.position.set(width / 2 - 0.10, 1.25, -0.15);

    const soapDish = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.10), matChrome);
    soapDish.position.set(width / 2 - 0.10, 1.05, 0.55);

    // Towel Ring with Hanging White Cotton Hand Towel (Panel ②)
    const towelBar = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8), matChrome);
    towelBar.rotation.x = Math.PI / 2;
    towelBar.position.set(width / 2 - 0.10, 1.35, 0.55);
    const hangingTowel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    hangingTowel.position.set(width / 2 - 0.12, 1.15, 0.55);

    // Warm Ambient Light inside Restroom
    const bathLight = new THREE.PointLight(0xffeedd, 0.95, 4.5);
    bathLight.position.set(0.60, height - 0.25, -0.2);

    bathGroup.add(
      bathWallL, bathWallFront, bathTransom, bathDoor,
      toiletBase, toiletSeatRing, flushPipeVert, flushValve, flushHandleLever, flushCrossPipe, flushPlaque,
      grabRailHoriz, pedalBin, tpHolder, restWindowFrame, restWindowGlass,
      vanityGroup, vanityMirror, mirrorGlass, glassShelf, sconceBase, sconceBulb,
      tumblerHolder, soapDish, towelBar, hangingTowel, bathLight
    );
    group.add(bathGroup);

    // 5. Overhead Brass Luggage Racks (좌석 위 짐 선반 - Photo 1, 3, 4)
    const matSuitcaseBrown = new THREE.MeshStandardMaterial({ color: 0x4a2c16, roughness: 0.65 });
    const matSuitcaseTan = new THREE.MeshStandardMaterial({ color: 0x8a6338, roughness: 0.6 });
    const matHatFelt = new THREE.MeshStandardMaterial({ color: 0xdfdcd2, roughness: 0.9 });
    const matShawlWool = new THREE.MeshStandardMaterial({ color: 0x2b3846, roughness: 0.95 });

    [-1.20, 1.20].forEach((xSide, sideIdx) => {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, length - 5.0), matBrass);
      rack.position.set(xSide, 2.1, -0.5);
      group.add(rack);

      // Brass support brackets
      for (let bz = -length / 2 + 3.0; bz <= length / 2 - 3.0; bz += 2.2) {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.25, 0.25), matBrass);
        bracket.position.set(xSide * 1.3, 2.0, bz);
        group.add(bracket);
      }

      // Authentic Vintage Luggage Placed on Racks (Photo 1 & 3)
      // Leather Suitcase 1
      const bag1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.65), sideIdx === 0 ? matSuitcaseBrown : matSuitcaseTan);
      bag1.position.set(xSide, 2.22, 2.0);
      group.add(bag1);

      // Fedora Hat
      const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.015, 12), matHatFelt);
      hatBrim.position.set(xSide, 2.13, 0.2);
      const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.11, 0.09, 12), matHatFelt);
      hatCrown.position.set(xSide, 2.18, 0.2);
      group.add(hatBrim, hatCrown);

      // Travel Shawl / Folded Blanket draped over rack (Photo 1)
      const shawl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.45), matShawlWool);
      shawl.position.set(xSide, 2.14, -2.4);
      group.add(shawl);

      // Leather Suitcase 2
      const bag2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.58), sideIdx === 0 ? matSuitcaseTan : matSuitcaseBrown);
      bag2.position.set(xSide, 2.21, -4.5);
      group.add(bag2);
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

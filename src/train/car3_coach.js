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
      const postL = new THREE.Mesh(new THREE.BoxGeometry(1.0, height, 0.12), matMahogany);
      postL.position.set(-1.0, height / 2, 0);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(1.0, height, 0.12), matMahogany);
      postR.position.set(1.0, height / 2, 0);
      const topTransom = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.12), matMahogany);
      topTransom.position.set(0, height - 0.3, 0);
      bh.add(postL, postR, topTransom);

      // Sliding Mahogany Door
      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.05, 0.05), matMahogany);
      sDoor.position.set(0, 1.025, 0);
      const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.06), matGlass);
      dWin.position.set(0, 0.35, 0);
      sDoor.add(dWin);
      bh.add(sDoor);

      if (typeof DoorManager !== 'undefined') {
        DoorManager.registerDoor({
          mesh: sDoor,
          type: 'slide',
          openOffset: 0.88,
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
      group.add(createDoubleSeat(-0.95, sz, 1));
      group.add(createDoubleSeat(0.95, sz, 1));
    }

    // ==========================================
    // 5. RESTROOM / LAVATORY (화장실 - Photo 1, 5, 6 Architecture)
    // Enclosed on the Right (X: 0.20 to 1.40, Z: -9.8 to -6.8), Aisle diverts on the Left!
    // ==========================================
    const bathGroup = new THREE.Group();
    bathGroup.position.set(0, 0, -8.3);

    // Floor: Blue & White Ceramic Tile Floor (Photo 5)
    const matTileFloor = new THREE.MeshStandardMaterial({
      map: Textures.blueWhiteTile,
      roughness: 0.25,
      metalness: 0.05
    });
    const bathFloor = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.02, 2.95), matTileFloor);
    bathFloor.position.set(0.82, 0.01, 0);
    bathFloor.receiveShadow = true;
    bathGroup.add(bathFloor);

    // Brass threshold strip at doorway
    const threshold = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.025, 0.08), matBrass);
    threshold.position.set(0.55, 0.015, 1.48);
    bathGroup.add(threshold);

    // Partition Wall separating Restroom from Central Aisle (at X = 0.20)
    const bathWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 3.0), matMahogany);
    bathWallL.position.set(0.20, height / 2, 0);

    // 2-tone Interior Wall lining (Warm cream upper, dark Pullman maroon lower wainscot - Photo 6)
    const matWainscotMaroon = new THREE.MeshStandardMaterial({ color: 0x3d1419, roughness: 0.5 });
    const matCreamEnamel = new THREE.MeshStandardMaterial({ color: 0xded7c5, roughness: 0.4 });
    const innerWainscotL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.1, 2.9), matWainscotMaroon);
    innerWainscotL.position.set(0.24, 0.55, 0);
    const innerUpperL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.6, 2.9), matCreamEnamel);
    innerUpperL.position.set(0.24, 1.9, 0);
    const innerChairRailL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 2.9), matMahogany);
    innerChairRailL.position.set(0.24, 1.1, 0);
    bathGroup.add(innerWainscotL, innerUpperL, innerChairRailL);

    // Front Partition Wall facing passenger seats (at Z = 1.5, with doorway)
    const bathWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.5, height, 0.08), matMahogany);
    bathWallFront.position.set(1.15, height / 2, 1.5);
    const bathTransom = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.08), matMahogany);
    bathTransom.position.set(0.55, height - 0.3, 1.5);

    // "TOILET" Transom Signboard above door (Photo 1)
    const matSignBoard = new THREE.MeshStandardMaterial({ color: 0x181c20, roughness: 0.3 });
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.03), matSignBoard);
    signBox.position.set(0.55, height - 0.22, 1.55);
    const signGlass = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.01), new THREE.MeshBasicMaterial({ color: 0xf0efe6 }));
    signGlass.position.set(0, 0, 0.02);
    signBox.add(signGlass);
    bathGroup.add(signBox);

    // Restroom Door with Frosted Window, Mirror & Lower Louver Vent (Photo 1)
    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.05, 0.04), matMahogany);
    bathDoor.position.set(0.55, 1.025, 1.5);

    // Full-height narrow frosted/mirror panel in door
    const doorMirror = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.15, 0.02), new THREE.MeshStandardMaterial({ color: 0xc8d8e6, roughness: 0.1, metalness: 0.85 }));
    doorMirror.position.set(0, 0.28, 0.02);
    const doorLouver = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: 0x221812, roughness: 0.7 }));
    doorLouver.position.set(0, -0.65, 0.02);
    const bathPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.03), matBrass);
    bathPlaque.position.set(0, 0.92, 0.025);
    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), matBrass);
    doorHandle.position.set(-0.25, 0, 0.03);
    bathDoor.add(doorMirror, doorLouver, bathPlaque, doorHandle);

    if (typeof DoorManager !== 'undefined') {
      DoorManager.registerDoor({
        mesh: bathDoor,
        type: 'slide',
        openOffset: 0.65,
        x: 0.55,
        z: -45.0 - 6.8,
        name: '3호차 화장실 문'
      });
    }

    // Inside Lavatory Fixtures (Photo 1 & 6):
    const matPorcelain = new THREE.MeshStandardMaterial({ color: 0xfbfbfb, roughness: 0.15, metalness: 0.05 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe0e5ea, roughness: 0.18, metalness: 0.92 });
    const matDarkWalnut = new THREE.MeshStandardMaterial({ color: 0x331c12, roughness: 0.35, metalness: 0.1 });

    // 1. White Porcelain Pedestal Toilet with dark polished wooden seat and lid (Photo 6)
    const toiletBase = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.44, 16), matPorcelain);
    toiletBase.position.set(0.92, 0.22, -0.9);
    // Dark round wooden toilet seat and lid
    const toiletSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 16), matDarkWalnut);
    toiletSeat.position.set(0.92, 0.45, -0.9);
    const toiletLid = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.03), matDarkWalnut);
    toiletLid.position.set(0.92, 0.68, -1.1);
    toiletLid.rotation.x = -0.15;

    // Vintage iron/wooden flush lever beside toilet (Photo 6)
    const flushLeverStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8), matChrome);
    flushLeverStem.position.set(0.64, 0.58, -0.95);
    flushLeverStem.rotation.z = -0.2;
    const flushLeverKnob = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matDarkWalnut);
    flushLeverKnob.position.set(0.60, 0.74, -0.95);

    // Chrome overhead water flush pipe leading up the wall (Photo 5 & 6)
    const flushPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.45, 8), matChrome);
    flushPipe.position.set(0.92, 1.28, -1.35);
    const flushTank = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.2), matPorcelain);
    flushTank.position.set(0.92, 2.05, -1.3);

    // 2. Wall-mounted washbasin with exposed chrome P-trap and supply pipes (Photo 1)
    const sinkGroup = new THREE.Group();
    sinkGroup.position.set(0.92, 0.75, 0.4);

    const sinkBowl = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.38), matPorcelain);
    sinkBowl.position.set(0, 0, 0);

    // Chrome plumbing: exposed P-trap, drain pipe, floor drain support leg (Photo 1)
    const pTrap = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI), matChrome);
    pTrap.position.set(0, -0.22, 0);
    pTrap.rotation.z = Math.PI;
    const wastePipeDown = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.55, 8), matChrome);
    wastePipeDown.position.set(0.06, -0.45, 0);
    const sinkLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.74, 8), matChrome);
    sinkLeg.position.set(0, -0.37, 0.14);

    // Chrome Water Faucet & handles (Photo 1)
    const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), matChrome);
    faucetStem.position.set(0, 0.14, -0.12);
    const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.12), matChrome);
    faucetSpout.position.set(0, 0.20, -0.06);
    sinkGroup.add(sinkBowl, pTrap, wastePipeDown, sinkLeg, faucetStem, faucetSpout);

    // 3. Vintage Glass Wall Soap Dispenser with Brass Bracket (Photo 6)
    const soapDispenser = new THREE.Group();
    soapDispenser.position.set(0.68, 1.25, 0.4);
    const soapBracket = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.06), matBrass);
    const soapGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshPhysicalMaterial({ color: 0xf5ecd7, transmission: 0.85, roughness: 0.1 }));
    soapGlobe.position.set(0, -0.04, 0);
    soapDispenser.add(soapBracket, soapGlobe);

    // 4. Chrome Paper Towel Dispenser Box on Wall (Photo 1 & 6)
    const towelDispenser = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.24), matChrome);
    towelDispenser.position.set(0.68, 1.72, 0.4);

    // 5. White Enamel Sanitary Waste Bin with Lid & Handle (Photo 6)
    const wasteBin = new THREE.Group();
    wasteBin.position.set(0.55, 0.20, -0.4);
    const binBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.38, 14), new THREE.MeshStandardMaterial({ color: 0xf0efe8, roughness: 0.35 }));
    const binLid = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 14), matChrome);
    binLid.position.set(0, 0.20, 0);
    const binHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.26, 6), matChrome);
    binHandle.rotation.x = Math.PI / 2;
    binHandle.position.set(0, 0.23, 0);
    wasteBin.add(binBody, binLid, binHandle);

    // 6. Beveled Vanity Mirror with Chrome Tubular Sconce Light (Photo 1 & 6)
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.65, 0.44), matChrome);
    mirror.position.set(0.68, 1.45, -0.15);
    const sconceLight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8), new THREE.MeshBasicMaterial({ color: 0xfff6e0 }));
    sconceLight.position.set(0.68, 1.85, -0.15);

    // 7. Frosted train window casting soft daylight into restroom (Photo 6)
    const restWindow = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.85, 0.65), new THREE.MeshPhysicalMaterial({ color: 0xdae8f5, roughness: 0.4, transmission: 0.7 }));
    restWindow.position.set(width / 2 - 0.08, 1.5, -0.6);

    // 8. Dark Brass Wall Grab Handle (Photo 6)
    const grabHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 8), matBrass);
    grabHandle.position.set(0.68, 1.15, -0.65);

    // Warm Restroom Light
    const bathLight = new THREE.PointLight(0xffdfaa, 0.85, 3.8);
    bathLight.position.set(0.85, height - 0.25, 0);

    bathGroup.add(
      bathWallL, bathWallFront, bathTransom, bathDoor,
      toiletBase, toiletSeat, toiletLid, flushLeverStem, flushLeverKnob, flushPipe, flushTank,
      sinkGroup, soapDispenser, towelDispenser, wasteBin, mirror, sconceLight, restWindow, grabHandle, bathLight
    );
    group.add(bathGroup);

    // 5. Overhead Brass Luggage Racks (좌석 위 짐 선반 - Photo 1, 3, 4)
    const matSuitcaseBrown = new THREE.MeshStandardMaterial({ color: 0x4a2c16, roughness: 0.65 });
    const matSuitcaseTan = new THREE.MeshStandardMaterial({ color: 0x8a6338, roughness: 0.6 });
    const matHatFelt = new THREE.MeshStandardMaterial({ color: 0xdfdcd2, roughness: 0.9 });
    const matShawlWool = new THREE.MeshStandardMaterial({ color: 0x2b3846, roughness: 0.95 });

    [-0.95, 0.95].forEach((xSide, sideIdx) => {
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

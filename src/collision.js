// Collision System: AABB obstacle registry with continuous slide response
const Collision = (() => {
  const obstacles = [];
  const playerRadius = 0.28; // Player collision radius (meters)

  const clear = () => {
    obstacles.length = 0;
  };

  const addBox = (minX, maxX, minZ, maxZ, minY = 0.5, maxY = 4.5, name = 'obstacle') => {
    obstacles.push({
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
      minY,
      maxY,
      name
    });
  };

  const addFromMesh = (mesh, name = 'meshObstacle') => {
    const box = new THREE.Box3().setFromObject(mesh);
    addBox(box.min.x, box.max.x, box.min.z, box.max.z, box.min.y, box.max.y, name);
  };

  // Check if a point (x, z) with player radius overlaps any obstacle
  const checkOverlap = (x, z, y = 2.0) => {
    const feetY = y - 1.65;
    const headY = y + 0.15;
    for (let i = 0; i < obstacles.length; i++) {
      const b = obstacles[i];
      // Vertical intersection check: player body [feetY, headY] vs obstacle [minY, maxY]
      if (headY < b.minY || feetY > b.maxY) continue;

      const closestX = Math.max(b.minX, Math.min(x, b.maxX));
      const closestZ = Math.max(b.minZ, Math.min(z, b.maxZ));

      const dx = x - closestX;
      const dz = z - closestZ;
      if (dx * dx + dz * dz < playerRadius * playerRadius) {
        return true;
      }
    }
    return false;
  };

  // Smooth slide collision resolution
  const move = (position, dx, dz, y = 2.0) => {
    // 1. Try X movement
    const targetX = position.x + dx;
    if (!checkOverlap(targetX, position.z, y)) {
      position.x = targetX;
    }

    // 2. Try Z movement
    const targetZ = position.z + dz;
    if (!checkOverlap(position.x, targetZ, y)) {
      position.z = targetZ;
    }
  };

  // Register all furniture, walls, partitions, and boundaries for all 8 cars
  const initTrainObstacles = () => {
    clear();

    // ==========================================
    // 1. TRAIN OUTER WALLS & END BOUNDARIES
    // ==========================================
    // Left outer wall
    addBox(-5.0, -1.35, -165.5, 2.0, 0.5, 4.5, 'LeftOuterWall');
    // Right outer wall
    addBox(1.35, 5.0, -165.5, 2.0, 0.5, 4.5, 'RightOuterWall');
    // Front train boundary (Boiler front)
    addBox(-2.0, 2.0, 0.9, 15.0, 0.5, 4.5, 'FrontBoilerWall');
    // Rear platform boundary
    addBox(-2.0, 2.0, -170.0, -165.0, 0.5, 4.5, 'RearPlatformRail');

    // ==========================================
    // 2. INTER-CAR GANGWAYS / VESTIBULES SIDE RAILS
    // Prevents player from walking through handrails/bellows out of the train!
    // Center footplate walkway is X: -0.48 to +0.48
    // ==========================================
    const vestibuleCenters = [-34.0, -56.0, -78.0, -100.0, -122.0, -144.0];
    vestibuleCenters.forEach((vz, idx) => {
      // Left side wall & handrail
      addBox(-1.5, -0.48, vz - 1.25, vz + 1.25, 0.5, 4.5, `Vestibule_L_${idx + 1}`);
      // Right side wall & handrail
      addBox(0.48, 1.5, vz - 1.25, vz + 1.25, 0.5, 4.5, `Vestibule_R_${idx + 1}`);
    });

    // ==========================================
    // 3. CAR 1: LOCOMOTIVE CAB & TENDER
    // ==========================================
    // Boiler Backhead & Firebox
    addBox(-1.4, 1.4, 0.7, 2.0, 1.0, 4.5, 'BoilerBackhead');
    // Engineer Station
    addBox(0.8, 1.4, -0.2, 0.8, 1.0, 3.5, 'EngineerStation');
    // Fireman Station
    addBox(-1.4, -0.8, -0.2, 0.7, 1.0, 3.5, 'FiremanStation');
    // Tender Coal Bunker (Blocks center & right, leaves left catwalk open [-1.35, -0.65])
    addBox(-0.6, 1.4, -11.5, -1.5, 1.0, 4.5, 'TenderCoalBunker');
    // Tender catwalk outer guard rail
    addBox(-0.75, -0.65, -11.5, -1.5, 1.0, 2.8, 'TenderCatwalkInnerRail');
    // Tender to Baggage Catwalk Connection (Z: -13.0 to -11.5)
    addBox(-0.65, 1.5, -13.2, -11.5, 0.5, 4.5, 'TenderWalkwayRightWall');

    // ==========================================
    // 4. CAR 2: BAGGAGE CAR (Z = -13.0 to -33.0)
    // ==========================================
    // Front bulkhead posts
    addBox(-1.4, -0.55, -13.2, -12.8, 1.0, 4.0, 'Car2_BulkheadFront_L');
    addBox(0.55, 1.4, -13.2, -12.8, 1.0, 4.0, 'Car2_BulkheadFront_R');
    // Rear bulkhead posts
    addBox(-1.4, -0.55, -33.2, -32.8, 1.0, 4.0, 'Car2_BulkheadRear_L');
    addBox(0.55, 1.4, -33.2, -32.8, 1.0, 4.0, 'Car2_BulkheadRear_R');
    // Crate stacks & luggage trunks
    addBox(-1.4, -0.5, -31.5, -26.0, 1.0, 3.0, 'Car2_CratesL1');
    addBox(-1.4, -0.5, -21.0, -18.0, 1.0, 3.0, 'Car2_CratesL2');
    addBox(0.5, 1.4, -31.5, -26.0, 1.0, 3.0, 'Car2_TrunksR1');
    addBox(0.5, 1.4, -21.0, -18.0, 1.0, 3.0, 'Car2_TrunksR2');
    addBox(-1.4, -0.5, -17.5, -15.0, 1.0, 3.0, 'Car2_MailRack');
    addBox(0.5, 1.4, -17.5, -15.0, 1.0, 3.0, 'Car2_Scale');

    // ==========================================
    // 5. CAR 3: COACH CAR (Z = -35.0 to -55.0)
    // Individual seats collision - allows full access between rows!
    // ==========================================
    // Bulkheads
    addBox(-1.4, -0.55, -35.2, -34.8, 1.0, 4.0, 'Car3_BulkheadFront_L');
    addBox(0.55, 1.4, -35.2, -34.8, 1.0, 4.0, 'Car3_BulkheadFront_R');
    addBox(-1.4, -0.55, -55.2, -54.8, 1.0, 4.0, 'Car3_BulkheadRear_L');
    addBox(0.55, 1.4, -55.2, -54.8, 1.0, 4.0, 'Car3_BulkheadRear_R');

    // 9 Individual pairs of seats on Left and Right sides!
    // Each seat is 0.56m deep. Spacing between seats is 1.6m.
    // The ~1.0m space between rows is completely OPEN for walking into!
    for (let i = 0; i < 9; i++) {
      const seatZ = -52.0 + i * 1.6;
      // Left double seat (X: -1.35 to -0.50)
      addBox(-1.35, -0.50, seatZ - 0.28, seatZ + 0.28, 1.0, 2.4, `Car3_SeatL_${i}`);
      // Right double seat (X: 0.50 to 1.35)
      addBox(0.50, 1.35, seatZ - 0.28, seatZ + 0.28, 1.0, 2.4, `Car3_SeatR_${i}`);
    }

    // ==========================================
    // 6. CAR 4: 1ST CLASS SLEEPER (Z = -57.0 to -77.0, center = -67.0)
    // ==========================================
    // Bulkheads
    addBox(-1.4, -0.55, -57.2, -56.8, 1.0, 4.0, 'Car4_BulkheadFront_L');
    addBox(0.55, 1.4, -57.2, -56.8, 1.0, 4.0, 'Car4_BulkheadFront_R');
    addBox(-1.4, -0.55, -77.2, -76.8, 1.0, 4.0, 'Car4_BulkheadRear_L');
    addBox(0.55, 1.4, -77.2, -76.8, 1.0, 4.0, 'Car4_BulkheadRear_R');
    // Foyer linen closets
    addBox(0.40, 1.4, -59.5, -57.0, 1.0, 4.0, 'Car4_FrontCloset');
    addBox(0.40, 1.4, -77.0, -74.5, 1.0, 4.0, 'Car4_RearCloset');
    // Partition walls between suites
    addBox(-0.35, 1.4, -59.55, -59.45, 1.0, 4.0, 'Car4_PartitionFront');
    addBox(-0.35, 1.4, -64.55, -64.45, 1.0, 4.0, 'Car4_Partition1_2');
    addBox(-0.35, 1.4, -69.55, -69.45, 1.0, 4.0, 'Car4_Partition2_3');
    addBox(-0.35, 1.4, -74.55, -74.45, 1.0, 4.0, 'Car4_PartitionRear');
    // Corridor Wall segments (Leaves open doors at Z=[-62.55, -61.45], [-67.55, -66.45], [-72.55, -71.45])
    addBox(-0.42, -0.28, -61.45, -59.5, 1.0, 4.0, 'Car4_CorridorW1');
    addBox(-0.42, -0.28, -64.5, -62.55, 1.0, 4.0, 'Car4_CorridorW2');
    addBox(-0.42, -0.28, -66.45, -64.5, 1.0, 4.0, 'Car4_CorridorW3');
    addBox(-0.42, -0.28, -69.5, -67.55, 1.0, 4.0, 'Car4_CorridorW4');
    addBox(-0.42, -0.28, -71.45, -69.5, 1.0, 4.0, 'Car4_CorridorW5');
    addBox(-0.42, -0.28, -74.5, -72.55, 1.0, 4.0, 'Car4_CorridorW6');
    // Luxury Beds inside suites
    addBox(0.35, 1.35, -64.35, -62.45, 1.0, 2.5, 'Car4_BedSuite1');
    addBox(0.35, 1.35, -69.35, -67.45, 1.0, 2.5, 'Car4_BedSuite2');
    addBox(0.35, 1.35, -74.35, -72.45, 1.0, 2.5, 'Car4_BedSuite3');
    // Bedside Nightstands
    addBox(-0.15, 0.25, -64.35, -63.95, 1.0, 2.0, 'Car4_Nightstand1');
    addBox(-0.15, 0.25, -69.35, -68.95, 1.0, 2.0, 'Car4_Nightstand2');
    addBox(-0.15, 0.25, -74.35, -73.95, 1.0, 2.0, 'Car4_Nightstand3');
    // Vanity Dressing Desks
    addBox(0.80, 1.35, -60.3, -59.7, 1.0, 2.5, 'Car4_Vanity1');
    addBox(0.80, 1.35, -65.3, -64.7, 1.0, 2.5, 'Car4_Vanity2');
    addBox(0.80, 1.35, -70.3, -69.7, 1.0, 2.5, 'Car4_Vanity3');
    // Wardrobes
    addBox(-0.25, 0.20, -60.3, -59.7, 1.0, 3.5, 'Car4_Wardrobe1');
    addBox(-0.25, 0.20, -65.3, -64.7, 1.0, 3.5, 'Car4_Wardrobe2');
    addBox(-0.25, 0.20, -70.3, -69.7, 1.0, 3.5, 'Car4_Wardrobe3');

    // ==========================================
    // 7. CAR 5: 2ND CLASS SLEEPER (Z = -79.0 to -99.0, center = -89.0)
    // Individual berth section dividers & beds
    // ==========================================
    addBox(-1.4, -0.55, -79.2, -78.8, 1.0, 4.0, 'Car5_BulkheadFront_L');
    addBox(0.55, 1.4, -79.2, -78.8, 1.0, 4.0, 'Car5_BulkheadFront_R');
    addBox(-1.4, -0.55, -99.2, -98.8, 1.0, 4.0, 'Car5_BulkheadRear_L');
    addBox(0.55, 1.4, -99.2, -98.8, 1.0, 4.0, 'Car5_BulkheadRear_R');
    for (let s = 0; s < 7; s++) {
      const bz = -96.5 + s * 2.2;
      // Left Lower Berth
      addBox(-1.35, -0.50, bz - 0.95, bz + 0.95, 1.0, 2.2, `Car5_BerthL_${s}`);
      // Right Lower Berth
      addBox(0.50, 1.35, bz - 0.95, bz + 0.95, 1.0, 2.2, `Car5_BerthR_${s}`);
      // Divider wall between sections
      addBox(-1.35, -0.50, bz - 1.14, bz - 1.06, 1.0, 3.5, `Car5_DivL_${s}`);
      addBox(0.50, 1.35, bz - 1.14, bz - 1.06, 1.0, 3.5, `Car5_DivR_${s}`);
    }

    // ==========================================
    // 8. CAR 6: DINING CAR (Z = -101.0 to -121.0, center = -111.0)
    // Individual dining tables & chairs - allows walking into dining booths!
    // ==========================================
    addBox(-1.4, -0.55, -101.2, -100.8, 1.0, 4.0, 'Car6_BulkheadFront_L');
    addBox(0.55, 1.4, -101.2, -100.8, 1.0, 4.0, 'Car6_BulkheadFront_R');
    addBox(-1.4, -0.55, -121.2, -120.8, 1.0, 4.0, 'Car6_BulkheadRear_L');
    addBox(0.55, 1.4, -121.2, -120.8, 1.0, 4.0, 'Car6_BulkheadRear_R');

    // 4 Distinct dining booth tables on each side
    const dinerTableZ = [-113.5, -110.5, -107.5, -104.5];
    dinerTableZ.forEach((tz, idx) => {
      // Left 2-person table + chairs (X: -1.35 to -0.55, depth 1.6m)
      addBox(-1.35, -0.55, tz - 0.8, tz + 0.8, 1.0, 2.2, `Car6_TableL_${idx}`);
      // Right 4-person table + chairs (X: 0.50 to 1.35, depth 1.6m)
      addBox(0.50, 1.35, tz - 0.8, tz + 0.8, 1.0, 2.2, `Car6_TableR_${idx}`);
    });

    // Kitchen / Galley section (Z = -120.5 to -115.2)
    addBox(-0.35, 1.4, -115.4, -115.0, 1.0, 4.0, 'Car6_KitchenWall');
    addBox(0.45, 1.35, -120.5, -115.5, 1.0, 2.5, 'Car6_KitchenCounterR');
    addBox(-1.35, -0.6, -120.5, -117.5, 1.0, 3.0, 'Car6_KitchenStove');

    // ==========================================
    // 9. CAR 7: LOUNGE CAR (Z = -123.0 to -143.0, center = -133.0)
    // Individual club armchairs & tables
    // ==========================================
    addBox(-1.4, -0.55, -123.2, -122.8, 1.0, 4.0, 'Car7_BulkheadFront_L');
    addBox(0.55, 1.4, -123.2, -122.8, 1.0, 4.0, 'Car7_BulkheadFront_R');
    addBox(-1.4, -0.55, -143.2, -142.8, 1.0, 4.0, 'Car7_BulkheadRear_L');
    addBox(0.55, 1.4, -143.2, -142.8, 1.0, 4.0, 'Car7_BulkheadRear_R');

    // Cocktail Bar Counter
    addBox(-1.35, -0.65, -129.2, -125.0, 1.0, 2.5, 'Car7_BarCounter');

    // Individual Club Armchairs (0.7m x 0.7m)
    addBox(0.50, 1.25, -131.4, -130.6, 1.0, 2.0, 'Car7_ChairR1');
    addBox(0.50, 1.25, -133.9, -133.1, 1.0, 2.0, 'Car7_ChairR2');
    addBox(0.50, 1.25, -136.9, -136.1, 1.0, 2.0, 'Car7_ChairR3');
    addBox(0.50, 1.25, -138.9, -138.1, 1.0, 2.0, 'Car7_ChairR4');
    addBox(-1.25, -0.50, -132.9, -132.1, 1.0, 2.0, 'Car7_ChairL1');
    addBox(-1.25, -0.50, -135.4, -134.6, 1.0, 2.0, 'Car7_ChairL2');

    // Coffee Tables
    addBox(0.55, 1.15, -132.6, -131.8, 1.0, 1.8, 'Car7_TableR1');
    addBox(-1.15, -0.55, -134.1, -133.3, 1.0, 1.8, 'Car7_TableL1');

    // Radio Console
    addBox(-1.35, -0.65, -141.0, -139.0, 1.0, 2.5, 'Car7_RadioConsole');

    // ==========================================
    // 10. CAR 8: OBSERVATION CAR (Z = -145.0 to -165.0, center = -155.0)
    // Individual swivel chairs facing panoramic windows
    // ==========================================
    addBox(-1.4, -0.55, -145.2, -144.8, 1.0, 4.0, 'Car8_BulkheadFront_L');
    addBox(0.55, 1.4, -145.2, -144.8, 1.0, 4.0, 'Car8_BulkheadFront_R');

    // Individual Swivel Chairs along both window rows
    [-160.0, -157.5, -155.0, -152.5, -150.0, -147.5].forEach((cz, idx) => {
      // Left swivel chair
      addBox(-1.35, -0.60, cz - 0.35, cz + 0.35, 1.0, 2.0, `Car8_ChairL_${idx}`);
      // Right swivel chair
      addBox(0.60, 1.35, cz - 0.35, cz + 0.35, 1.0, 2.0, `Car8_ChairR_${idx}`);
    });

    // Writing Desk
    addBox(-1.35, -0.75, -154.6, -153.4, 1.0, 2.2, 'Car8_WritingDesk');

    // French Door Partition
    addBox(-1.35, -0.45, -162.2, -161.8, 1.0, 4.0, 'Car8_FrenchDoorWallL');
    addBox(0.45, 1.35, -162.2, -161.8, 1.0, 4.0, 'Car8_FrenchDoorWallR');

    // Rear Observation Deck Railings
    addBox(-1.45, -1.35, -165.2, -162.0, 1.0, 2.5, 'Car8_PlatformRailL');
    addBox(1.35, 1.45, -165.2, -162.0, 1.0, 2.5, 'Car8_PlatformRailR');
    addBox(-1.45, 1.45, -165.2, -164.7, 1.0, 2.5, 'Car8_PlatformRailRear');
  };

  return {
    clear,
    addBox,
    addFromMesh,
    checkOverlap,
    move,
    initTrainObstacles,
    getObstacles: () => obstacles
  };
})();

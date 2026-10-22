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

    // Dynamic Closed Door Blocking (Player cannot walk through closed doors!)
    if (typeof DoorManager !== 'undefined' && DoorManager.isBlockedByClosedDoor) {
      if (DoorManager.isBlockedByClosedDoor(x, z, playerRadius)) {
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
    // 1. TRAIN OUTER WALLS & END BOUNDARIES (Wider 3.5m Train Profile)
    // ==========================================
    // Left outer wall (Expanded to -1.65m)
    addBox(-5.0, -1.65, -165.5, 2.0, 0.5, 4.5, 'LeftOuterWall');
    // Right outer wall (Expanded to +1.65m)
    addBox(1.65, 5.0, -165.5, 2.0, 0.5, 4.5, 'RightOuterWall');
    // Front train boundary (Boiler front)
    addBox(-2.0, 2.0, 0.9, 15.0, 0.5, 4.5, 'FrontBoilerWall');
    // Rear platform boundary
    addBox(-2.0, 2.0, -170.0, -165.0, 0.5, 4.5, 'RearPlatformRail');

    // ==========================================
    // 2. INTER-CAR GANGWAYS / VESTIBULES SIDE RAILS
    // Prevents player from walking through handrails/bellows out of the train!
    // Center footplate walkway is X: -0.68 to +0.68
    // ==========================================
    const vestibuleCenters = [-12.0, -34.0, -56.0, -78.0, -100.0, -122.0, -144.0];
    vestibuleCenters.forEach((vz, idx) => {
      // Left side wall & handrail
      addBox(-1.75, -0.68, vz - 1.25, vz + 1.25, 0.5, 4.5, `Vestibule_L_${idx + 1}`);
      // Right side wall & handrail
      addBox(0.68, 1.75, vz - 1.25, vz + 1.25, 0.5, 4.5, `Vestibule_R_${idx + 1}`);
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
    // 4. CAR 2: BAGGAGE CAR (Z = -13.0 to -33.0, center = -23.0)
    // ==========================================
    // Bulkhead posts
    addBox(-1.65, -0.50, -13.2, -12.8, 1.0, 4.0, 'Car2_BulkheadFront_L');
    addBox(0.50, 1.65, -13.2, -12.8, 1.0, 4.0, 'Car2_BulkheadFront_R');
    addBox(-1.65, -0.50, -33.2, -32.8, 1.0, 4.0, 'Car2_BulkheadRear_L');
    addBox(0.50, 1.65, -33.2, -32.8, 1.0, 4.0, 'Car2_BulkheadRear_R');

    // Baggage Master Cot / Single Bed
    addBox(-1.60, -0.55, -16.8, -14.8, 1.0, 2.0, 'Car2_GuardCot');
    // Baggage Master Desk & Cubbies
    addBox(-1.60, -0.65, -18.6, -17.4, 1.0, 2.5, 'Car2_ClerkDesk');
    // 4-Wheel Baggage Trolley
    addBox(0.65, 1.60, -17.9, -16.1, 1.0, 2.0, 'Car2_TrolleyCart');

    // Cargo Stacks along walls (leaves clear 1.2m central walkway X: -0.55 to +0.55)
    addBox(-1.60, -0.60, -31.0, -24.5, 1.0, 2.2, 'Car2_TrunksL');
    addBox(0.60, 1.60, -31.0, -24.5, 1.0, 3.2, 'Car2_CratesR');

    // ==========================================
    // 5. CAR 3: COACH CAR (Z = -35.0 to -55.0)
    // Individual seats collision - allows full access between rows!
    // ==========================================
    // Bulkheads
    addBox(-1.65, -0.50, -35.2, -34.8, 1.0, 4.0, 'Car3_BulkheadFront_L');
    addBox(0.50, 1.65, -35.2, -34.8, 1.0, 4.0, 'Car3_BulkheadFront_R');
    addBox(-1.65, -0.50, -55.2, -54.8, 1.0, 4.0, 'Car3_BulkheadRear_L');
    addBox(0.50, 1.65, -55.2, -54.8, 1.0, 4.0, 'Car3_BulkheadRear_R');

    // 7 Individual pairs of seats on Left and Right sides!
    for (let i = 0; i < 7; i++) {
      const seatZ = -45.0 + (-4.2 + i * 1.6);
      // Left double seat (X: -1.60 to -0.65)
      addBox(-1.60, -0.65, seatZ - 0.35, seatZ + 0.35, 1.0, 2.4, `Car3_SeatL_${i}`);
      // Right double seat (X: 0.65 to 1.60)
      addBox(0.65, 1.60, seatZ - 0.35, seatZ + 0.35, 1.0, 2.4, `Car3_SeatR_${i}`);
    }

    // Car 3 Restroom Walls & Fixtures (Doorway on aisle wall Z: -53.50 to -52.70 is 100% open for dynamic door!)
    // Central walkway (X: -0.55 to +0.55) has ZERO collision!
    addBox(0.50, 0.60, -52.70, -52.50, 1.0, 4.0, 'Car3_RestroomWallL_North');
    addBox(0.50, 0.60, -54.95, -53.50, 1.0, 4.0, 'Car3_RestroomWallL_South');
    addBox(0.55, 1.69, -54.98, -54.90, 1.0, 4.0, 'Car3_RestroomWallRear');
    addBox(0.55, 1.69, -52.55, -52.45, 1.0, 4.0, 'Car3_RestroomWallFront');
    addBox(0.90, 1.34, -54.90, -54.20, 1.0, 2.2, 'Car3_Toilet');
    addBox(1.20, 1.65, -53.5, -52.8, 1.0, 2.2, 'Car3_Vanity');

    // ==========================================
    // 6. CAR 4: 1ST CLASS SLEEPER (Z = -57.0 to -77.0, center = -67.0)
    // ==========================================
    // Bulkheads
    addBox(-1.65, -0.50, -57.2, -56.8, 1.0, 4.0, 'Car4_BulkheadFront_L');
    addBox(0.50, 1.65, -57.2, -56.8, 1.0, 4.0, 'Car4_BulkheadFront_R');
    addBox(-1.65, -0.50, -77.2, -76.8, 1.0, 4.0, 'Car4_BulkheadRear_L');
    addBox(0.50, 1.65, -77.2, -76.8, 1.0, 4.0, 'Car4_BulkheadRear_R');

    // Foyer linen closet & Luxury Private Restroom Walls (Doorway on aisle wall Z: -75.50 to -74.70 is 100% open for dynamic door!)
    addBox(0.40, 1.65, -59.5, -57.0, 1.0, 4.0, 'Car4_FrontCloset');
    addBox(0.50, 0.60, -74.70, -74.50, 1.0, 4.0, 'Car4_RestroomWallL_North');
    addBox(0.50, 0.60, -76.95, -75.50, 1.0, 4.0, 'Car4_RestroomWallL_South');
    addBox(0.55, 1.69, -76.98, -76.90, 1.0, 4.0, 'Car4_RestroomWallRear');
    addBox(0.55, 1.69, -74.55, -74.45, 1.0, 4.0, 'Car4_RestroomWallFront');
    addBox(0.90, 1.34, -76.90, -76.20, 1.0, 2.2, 'Car4_Toilet');
    addBox(1.20, 1.65, -75.5, -74.8, 1.0, 2.2, 'Car4_RestroomVanity');

    // Partition walls between suites
    addBox(-0.35, 1.65, -59.55, -59.45, 1.0, 4.0, 'Car4_PartitionFront');
    addBox(-0.35, 1.65, -64.55, -64.45, 1.0, 4.0, 'Car4_Partition1_2');
    addBox(-0.35, 1.65, -69.55, -69.45, 1.0, 4.0, 'Car4_Partition2_3');
    addBox(-0.35, 1.65, -74.55, -74.45, 1.0, 4.0, 'Car4_PartitionRear');

    // Corridor Wall segments (Leaves open doors at Z=[-62.55, -61.45], [-67.55, -66.45], [-72.55, -71.45])
    addBox(-0.40, -0.30, -61.45, -59.5, 1.0, 4.0, 'Car4_CorridorW1');
    addBox(-0.40, -0.30, -64.5, -62.55, 1.0, 4.0, 'Car4_CorridorW2');
    addBox(-0.40, -0.30, -66.45, -64.5, 1.0, 4.0, 'Car4_CorridorW3');
    addBox(-0.40, -0.30, -69.5, -67.55, 1.0, 4.0, 'Car4_CorridorW4');
    addBox(-0.40, -0.30, -71.45, -69.5, 1.0, 4.0, 'Car4_CorridorW5');
    addBox(-0.40, -0.30, -74.5, -72.55, 1.0, 4.0, 'Car4_CorridorW6');

    // Luxury Beds inside suites
    addBox(0.55, 1.55, -64.35, -62.45, 1.0, 2.5, 'Car4_BedSuite1');
    addBox(0.55, 1.55, -69.35, -67.45, 1.0, 2.5, 'Car4_BedSuite2');
    addBox(0.55, 1.55, -74.35, -72.45, 1.0, 2.5, 'Car4_BedSuite3');

    // Drawing Room Sofas (Photo 3 Diagram)
    addBox(0.85, 1.55, -61.85, -60.75, 1.0, 2.2, 'Car4_Sofa1');
    addBox(0.85, 1.55, -66.85, -65.75, 1.0, 2.2, 'Car4_Sofa2');
    addBox(0.85, 1.55, -71.85, -70.75, 1.0, 2.2, 'Car4_Sofa3');

    // Bedside Nightstands
    addBox(0.0, 0.35, -64.35, -63.95, 1.0, 2.0, 'Car4_Nightstand1');
    addBox(0.0, 0.35, -69.35, -68.95, 1.0, 2.0, 'Car4_Nightstand2');
    addBox(0.0, 0.35, -74.35, -73.95, 1.0, 2.0, 'Car4_Nightstand3');

    // Vanity Dressing Desks
    addBox(0.95, 1.55, -60.3, -59.7, 1.0, 2.5, 'Car4_Vanity1');
    addBox(0.95, 1.55, -65.3, -64.7, 1.0, 2.5, 'Car4_Vanity2');
    addBox(0.95, 1.55, -70.3, -69.7, 1.0, 2.5, 'Car4_Vanity3');

    // Wardrobes
    addBox(-0.15, 0.30, -60.3, -59.7, 1.0, 3.5, 'Car4_Wardrobe1');
    addBox(-0.15, 0.30, -65.3, -64.7, 1.0, 3.5, 'Car4_Wardrobe2');
    addBox(-0.15, 0.30, -70.3, -69.7, 1.0, 3.5, 'Car4_Wardrobe3');

    // ==========================================
    // 7. CAR 5: 2ND CLASS SLEEPER (Z = -79.0 to -99.0, center = -89.0)
    // Individual berth section dividers & beds
    // ==========================================
    addBox(-1.65, -0.50, -79.2, -78.8, 1.0, 4.0, 'Car5_BulkheadFront_L');
    addBox(0.50, 1.65, -79.2, -78.8, 1.0, 4.0, 'Car5_BulkheadFront_R');
    addBox(-1.65, -0.50, -99.2, -98.8, 1.0, 4.0, 'Car5_BulkheadRear_L');
    addBox(0.50, 1.65, -99.2, -98.8, 1.0, 4.0, 'Car5_BulkheadRear_R');
    for (let s = 0; s < 6; s++) {
      const bz = -93.0 + s * 2.2;
      // Left Lower Berth
      addBox(-1.60, -0.55, bz - 0.95, bz + 0.95, 1.0, 2.2, `Car5_BerthL_${s}`);
      // Right Lower Berth
      addBox(0.55, 1.60, bz - 0.95, bz + 0.95, 1.0, 2.2, `Car5_BerthR_${s}`);
      // Divider wall between sections
      addBox(-1.65, -0.55, bz - 1.14, bz - 1.06, 1.0, 3.5, `Car5_DivL_${s}`);
      addBox(0.55, 1.65, bz - 1.14, bz - 1.06, 1.0, 3.5, `Car5_DivR_${s}`);
    }
    // Car 5 Restroom Walls & Fixtures (Doorway on aisle wall Z: -97.50 to -96.70 is 100% open for dynamic door!)
    // Central walkway (X: -0.55 to +0.55) has ZERO collision!
    addBox(0.50, 0.60, -96.70, -96.50, 1.0, 4.0, 'Car5_RestroomWallL_North');
    addBox(0.50, 0.60, -98.95, -97.50, 1.0, 4.0, 'Car5_RestroomWallL_South');
    addBox(0.55, 1.69, -98.98, -98.90, 1.0, 4.0, 'Car5_RestroomWallRear');
    addBox(0.55, 1.69, -96.55, -96.45, 1.0, 4.0, 'Car5_RestroomWallFront');
    addBox(0.90, 1.34, -98.90, -98.20, 1.0, 2.2, 'Car5_Toilet');
    addBox(1.20, 1.65, -97.5, -96.8, 1.0, 2.2, 'Car5_Vanity');

    // ==========================================
    // 8. CAR 6: DINING CAR (Z = -101.0 to -121.0, center = -111.0)
    // Individual dining tables & chairs - allows walking into dining booths!
    // ==========================================
    addBox(-1.65, -0.50, -101.2, -100.8, 1.0, 4.0, 'Car6_BulkheadFront_L');
    addBox(0.50, 1.65, -101.2, -100.8, 1.0, 4.0, 'Car6_BulkheadFront_R');
    addBox(-1.65, -0.50, -121.2, -120.8, 1.0, 4.0, 'Car6_BulkheadRear_L');
    addBox(0.50, 1.65, -121.2, -120.8, 1.0, 4.0, 'Car6_BulkheadRear_R');

    // 4 Distinct dining booth tables on each side
    const dinerTableZ = [-113.5, -110.5, -107.5, -104.5];
    dinerTableZ.forEach((tz, idx) => {
      // Left 2-person table + chairs (X: -1.60 to -0.65, depth 1.6m)
      addBox(-1.60, -0.65, tz - 0.8, tz + 0.8, 1.0, 2.2, `Car6_TableL_${idx}`);
      // Right 4-person table + chairs (X: 0.65 to 1.60, depth 1.6m)
      addBox(0.65, 1.60, tz - 0.8, tz + 0.8, 1.0, 2.2, `Car6_TableR_${idx}`);
    });

    // Steward Buffet & Wine Servery section (Z = -120.2 to -115.1)
    addBox(-1.65, -0.85, -115.3, -115.1, 1.0, 4.0, 'Car6_ArchPostL');
    addBox(0.85, 1.65, -115.3, -115.1, 1.0, 4.0, 'Car6_ArchPostR');
    addBox(-1.60, -0.90, -120.1, -115.9, 1.0, 2.2, 'Car6_CredenzaL');
    addBox(0.90, 1.60, -120.1, -115.9, 1.0, 2.2, 'Car6_BuffetR');

    // ==========================================
    // 9. CAR 7: LOUNGE CAR (Z = -123.0 to -143.0, center = -133.0)
    // Individual club armchairs & tables
    // ==========================================
    addBox(-1.65, -0.50, -123.2, -122.8, 1.0, 4.0, 'Car7_BulkheadFront_L');
    addBox(0.50, 1.65, -123.2, -122.8, 1.0, 4.0, 'Car7_BulkheadFront_R');
    addBox(-1.65, -0.50, -143.2, -142.8, 1.0, 4.0, 'Car7_BulkheadRear_L');
    addBox(0.50, 1.65, -143.2, -142.8, 1.0, 4.0, 'Car7_BulkheadRear_R');

    // Backbar along Left Wall
    addBox(-1.65, -1.45, -129.2, -124.8, 1.0, 2.5, 'Car7_BackBar');
    // Cocktail Bar Counter (X: -0.90 to -0.50, leaves 0.75m behind and 1.60m wide walkway!)
    addBox(-0.90, -0.50, -129.1, -124.9, 1.0, 2.5, 'Car7_BarCounter');

    // 3 Solid Barstools (Centered at X = -0.20, cannot be walked through!)
    [-128.3, -127.0, -125.7].forEach((bsz, idx) => {
      addBox(-0.38, -0.02, bsz - 0.18, bsz + 0.18, 1.0, 2.0, `Car7_Barstool_${idx + 1}`);
    });

    // Individual Club Armchairs (0.7m x 0.7m)
    addBox(0.70, 1.40, -131.4, -130.6, 1.0, 2.0, 'Car7_ChairR1');
    addBox(0.70, 1.40, -133.9, -133.1, 1.0, 2.0, 'Car7_ChairR2');
    addBox(0.70, 1.40, -136.9, -136.1, 1.0, 2.0, 'Car7_ChairR3');
    addBox(0.70, 1.40, -138.9, -138.1, 1.0, 2.0, 'Car7_ChairR4');
    addBox(-1.40, -0.70, -132.9, -132.1, 1.0, 2.0, 'Car7_ChairL1');
    addBox(-1.40, -0.70, -135.4, -134.6, 1.0, 2.0, 'Car7_ChairL2');

    // Coffee Tables
    addBox(0.75, 1.35, -132.6, -131.8, 1.0, 1.8, 'Car7_TableR1');
    addBox(-1.35, -0.75, -134.1, -133.3, 1.0, 1.8, 'Car7_TableL1');

    // Radio Console
    addBox(-1.60, -0.90, -141.0, -139.0, 1.0, 2.5, 'Car7_RadioConsole');

    // ==========================================
    // 10. CAR 8: OBSERVATION CAR (Z = -145.0 to -165.0, center = -155.0)
    // Individual swivel chairs facing panoramic windows
    // ==========================================
    addBox(-1.65, -0.50, -145.2, -144.8, 1.0, 4.0, 'Car8_BulkheadFront_L');
    addBox(0.50, 1.65, -145.2, -144.8, 1.0, 4.0, 'Car8_BulkheadFront_R');

    // Individual Swivel Chairs along both window rows
    [-160.0, -157.5, -155.0, -152.5, -150.0, -147.5].forEach((cz, idx) => {
      // Left swivel chair
      addBox(-1.50, -0.80, cz - 0.35, cz + 0.35, 1.0, 2.0, `Car8_ChairL_${idx}`);
      // Right swivel chair
      addBox(0.80, 1.50, cz - 0.35, cz + 0.35, 1.0, 2.0, `Car8_ChairR_${idx}`);
    });

    // Writing Desk
    addBox(-1.55, -0.95, -154.6, -153.4, 1.0, 2.2, 'Car8_WritingDesk');

    // French Door Partition
    addBox(-1.65, -0.50, -162.2, -161.8, 1.0, 4.0, 'Car8_FrenchDoorWallL');
    addBox(0.50, 1.65, -162.2, -161.8, 1.0, 4.0, 'Car8_FrenchDoorWallR');

    // Rear Observation Deck Railings
    addBox(-1.65, -1.50, -165.2, -162.0, 1.0, 2.5, 'Car8_PlatformRailL');
    addBox(1.50, 1.65, -165.2, -162.0, 1.0, 2.5, 'Car8_PlatformRailR');
    addBox(-1.65, 1.65, -165.2, -164.7, 1.0, 2.5, 'Car8_PlatformRailRear');
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

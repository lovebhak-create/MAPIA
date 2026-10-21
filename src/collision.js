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
    for (let i = 0; i < obstacles.length; i++) {
      const b = obstacles[i];
      if (y < b.minY || y > b.maxY) continue;

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

    // 1. Train Outer Boundaries
    // Left outer wall
    addBox(-5.0, -1.35, -165.5, 2.0, 0.5, 4.5, 'LeftOuterWall');
    // Right outer wall
    addBox(1.35, 5.0, -165.5, 2.0, 0.5, 4.5, 'RightOuterWall');
    // Front train boundary (Boiler front)
    addBox(-2.0, 2.0, 0.9, 15.0, 0.5, 4.5, 'FrontBoilerWall');
    // Rear platform boundary
    addBox(-2.0, 2.0, -170.0, -165.0, 0.5, 4.5, 'RearPlatformRail');

    // 2. Car 1: Locomotive Cab & Tender
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

    // 3. Car 2: Baggage Car (Z = -13.0 to -33.0)
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

    // 4. Car 3: Coach Car (Z = -35.0 to -55.0)
    // Bulkheads
    addBox(-1.4, -0.55, -35.2, -34.8, 1.0, 4.0, 'Car3_BulkheadFront_L');
    addBox(0.55, 1.4, -35.2, -34.8, 1.0, 4.0, 'Car3_BulkheadFront_R');
    addBox(-1.4, -0.55, -55.2, -54.8, 1.0, 4.0, 'Car3_BulkheadRear_L');
    addBox(0.55, 1.4, -55.2, -54.8, 1.0, 4.0, 'Car3_BulkheadRear_R');
    // Passenger seats Left & Right (center aisle [-0.45, 0.45] open)
    addBox(-1.4, -0.45, -53.5, -36.5, 1.0, 2.5, 'Car3_SeatsLeft');
    addBox(0.45, 1.4, -53.5, -36.5, 1.0, 2.5, 'Car3_SeatsRight');

    // 5. Car 4: 1st Class Sleeper (Z = -57.0 to -77.0)
    // Bulkheads
    addBox(-1.4, -0.55, -57.2, -56.8, 1.0, 4.0, 'Car4_BulkheadFront_L');
    addBox(0.55, 1.4, -57.2, -56.8, 1.0, 4.0, 'Car4_BulkheadFront_R');
    addBox(-1.4, -0.55, -77.2, -76.8, 1.0, 4.0, 'Car4_BulkheadRear_L');
    addBox(0.55, 1.4, -77.2, -76.8, 1.0, 4.0, 'Car4_BulkheadRear_R');
    // Foyer storage cabinets
    addBox(0.35, 1.4, -59.0, -57.0, 1.0, 4.0, 'Car4_FrontFoyerCabinet');
    addBox(0.35, 1.4, -77.0, -75.0, 1.0, 4.0, 'Car4_RearFoyerCabinet');
    // Suite divider wall segments (open doorways at Z=-61.9, Z=-67.0, Z=-72.1)
    addBox(-0.42, -0.28, -60.8, -59.0, 1.0, 4.0, 'Car4_CorridorWall1');
    addBox(-0.42, -0.28, -66.0, -63.0, 1.0, 4.0, 'Car4_CorridorWall2');
    addBox(-0.42, -0.28, -71.1, -68.1, 1.0, 4.0, 'Car4_CorridorWall3');
    addBox(-0.42, -0.28, -75.0, -73.2, 1.0, 4.0, 'Car4_CorridorWall4');
    // Partitions between suites
    addBox(-0.35, 1.4, -64.6, -64.3, 1.0, 4.0, 'Car4_Partition1');
    addBox(-0.35, 1.4, -69.7, -69.4, 1.0, 4.0, 'Car4_Partition2');
    // Luxury Beds inside suites
    addBox(-0.2, 1.4, -64.3, -62.1, 1.0, 2.5, 'Car4_BedSuite1');
    addBox(-0.2, 1.4, -69.4, -67.2, 1.0, 2.5, 'Car4_BedSuite2');
    addBox(-0.2, 1.4, -74.5, -72.3, 1.0, 2.5, 'Car4_BedSuite3');
    // Vanity sinks
    addBox(0.85, 1.4, -60.8, -59.3, 1.0, 2.5, 'Car4_Vanity1');
    addBox(0.85, 1.4, -65.9, -64.4, 1.0, 2.5, 'Car4_Vanity2');
    addBox(0.85, 1.4, -71.0, -69.5, 1.0, 2.5, 'Car4_Vanity3');

    // 6. Car 5: 2nd Class Sleeper (Z = -79.0 to -99.0)
    addBox(-1.4, -0.55, -79.2, -78.8, 1.0, 4.0, 'Car5_BulkheadFront_L');
    addBox(0.55, 1.4, -79.2, -78.8, 1.0, 4.0, 'Car5_BulkheadFront_R');
    addBox(-1.4, -0.55, -99.2, -98.8, 1.0, 4.0, 'Car5_BulkheadRear_L');
    addBox(0.55, 1.4, -99.2, -98.8, 1.0, 4.0, 'Car5_BulkheadRear_R');
    // Berths Left & Right (center aisle [-0.45, 0.45] open)
    addBox(-1.4, -0.45, -97.5, -80.5, 1.0, 3.0, 'Car5_BerthsLeft');
    addBox(0.45, 1.4, -97.5, -80.5, 1.0, 3.0, 'Car5_BerthsRight');

    // 7. Car 6: Dining Car (Z = -101.0 to -121.0)
    addBox(-1.4, -0.55, -101.2, -100.8, 1.0, 4.0, 'Car6_BulkheadFront_L');
    addBox(0.55, 1.4, -101.2, -100.8, 1.0, 4.0, 'Car6_BulkheadFront_R');
    addBox(-1.4, -0.55, -121.2, -120.8, 1.0, 4.0, 'Car6_BulkheadRear_L');
    addBox(0.55, 1.4, -121.2, -120.8, 1.0, 4.0, 'Car6_BulkheadRear_R');
    // Dining tables Left & Right
    addBox(-1.4, -0.45, -114.5, -102.5, 1.0, 2.2, 'Car6_TablesLeft');
    addBox(0.45, 1.4, -114.5, -102.5, 1.0, 2.2, 'Car6_TablesRight');
    // Kitchen wall & counter (leaves door open at [-1.2, -0.45])
    addBox(-0.35, 1.4, -115.4, -115.0, 1.0, 4.0, 'Car6_KitchenWall');
    addBox(0.45, 1.4, -120.5, -115.5, 1.0, 2.5, 'Car6_KitchenCounterR');
    addBox(-1.4, -0.6, -120.5, -117.5, 1.0, 3.0, 'Car6_KitchenStove');

    // 8. Car 7: Lounge Car (Z = -123.0 to -143.0)
    addBox(-1.4, -0.55, -123.2, -122.8, 1.0, 4.0, 'Car7_BulkheadFront_L');
    addBox(0.55, 1.4, -123.2, -122.8, 1.0, 4.0, 'Car7_BulkheadFront_R');
    addBox(-1.4, -0.55, -143.2, -142.8, 1.0, 4.0, 'Car7_BulkheadRear_L');
    addBox(0.55, 1.4, -143.2, -142.8, 1.0, 4.0, 'Car7_BulkheadRear_R');
    // Cocktail Bar Counter & Backbar
    addBox(-1.4, -0.35, -131.5, -124.5, 1.0, 2.5, 'Car7_BarCounter');
    // Club Armchairs & Tables
    addBox(0.45, 1.4, -141.0, -128.5, 1.0, 2.0, 'Car7_LoungeChairsRight');
    addBox(-1.4, -0.45, -138.5, -133.5, 1.0, 2.0, 'Car7_LoungeChairsLeft');
    addBox(-1.4, -0.6, -140.5, -138.5, 1.0, 2.5, 'Car7_RadioConsole');

    // 9. Car 8: Observation Car (Z = -145.0 to -165.0)
    addBox(-1.4, -0.55, -145.2, -144.8, 1.0, 4.0, 'Car8_BulkheadFront_L');
    addBox(0.55, 1.4, -145.2, -144.8, 1.0, 4.0, 'Car8_BulkheadFront_R');
    // Swivel Observation Chairs
    addBox(-1.4, -0.55, -160.5, -146.5, 1.0, 2.0, 'Car8_SwivelChairsLeft');
    addBox(0.55, 1.4, -160.5, -146.5, 1.0, 2.0, 'Car8_SwivelChairsRight');
    // Writing desk
    addBox(-1.4, -0.55, -155.5, -153.0, 1.0, 2.5, 'Car8_WritingDesk');
    // French door partition (center doors open at [-0.4, 0.4])
    addBox(-1.4, -0.45, -162.2, -161.8, 1.0, 4.0, 'Car8_FrenchDoorWallL');
    addBox(0.45, 1.4, -162.2, -161.8, 1.0, 4.0, 'Car8_FrenchDoorWallR');
    // Observation deck railings
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

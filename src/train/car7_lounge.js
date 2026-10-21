// Car 7: Lounge & Club Car (라운지차 - Social Club, Bar & Parlor)
// Cocktail bar, leather club armchairs, circular conversation sofas, vintage radio console
const Car7_Lounge = (() => {
  const create = () => {
    const group = new THREE.Group();
    group.name = 'Car7_Lounge';

    // Position: Centered at Z = -133.0 (Spans Z = -123.0 to Z = -143.0)
    // Floor level: Y = 1.2m
    group.position.set(0, 1.2, -133.0);

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

    const matLeatherBurgundy = new THREE.MeshStandardMaterial({
      color: 0x4e1219,
      roughness: 0.6,
      metalness: 0.15
    });

    const matLeatherCognac = new THREE.MeshStandardMaterial({
      color: 0x6e3c1b,
      roughness: 0.6,
      metalness: 0.15
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9
    });

    const matGold = new THREE.MeshStandardMaterial({
      color: 0xdfb142,
      roughness: 0.35,
      metalness: 0.85
    });

    const matMirror = new THREE.MeshStandardMaterial({
      color: 0xccddee,
      roughness: 0.05,
      metalness: 0.95
    });

    // 1. Floor & Carpet
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, length), matWoodFloor);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    group.add(floor);

    const fullCarpet = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.01, length), matCarpet);
    fullCarpet.position.set(0, 0.01, 0);
    group.add(fullCarpet);

    // 2. Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.2, 0.1, length),
      new THREE.MeshStandardMaterial({ color: 0xeee4d3, roughness: 0.75 })
    );
    ceiling.position.set(0, height, 0);
    group.add(ceiling);

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xaaccdd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // 3. Side Walls with Lounge Windows
    const createLoungeSideWall = (xSide) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(xSide * (width / 2 - 0.06), 0, 0);

      // Lower mahogany wainscoting
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, length), matMahogany);
      lower.position.set(0, 0.45, 0);
      wGroup.add(lower);

      // Upper wall above windows
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, length), matMahogany);
      upper.position.set(0, height - 0.3, 0);
      wGroup.add(upper);

      // Windows
      const numWindows = 8;
      const windowSpan = (length - 4.0) / numWindows;
      for (let i = 0; i < numWindows; i++) {
        const wz = -length / 2 + 2.5 + i * windowSpan;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, windowSpan * 0.75), matGlass);
        glass.position.set(0, 1.5, wz);
        wGroup.add(glass);

        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.2, windowSpan * 0.25), matMahogany);
        pillar.position.set(0, 1.5, wz + windowSpan * 0.5);
        wGroup.add(pillar);
      }

      return wGroup;
    };
    group.add(createLoungeSideWall(-1));
    group.add(createLoungeSideWall(1));

    // End Bulkheads
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

    // ==========================================
    // 4. LUXURIOUS ART DECO COCKTAIL BAR (Z = 4.0 to 8.5)
    // Spacious bartender corridor (0.75m), illuminated 3-tier backbar, crystal decanters
    // ==========================================
    const barGroup = new THREE.Group();
    barGroup.position.set(0, 0, 6.0);

    // Rich Art Deco Bar Counter (shifted to left, leaving spacious 1.25m right corridor and 0.62m bartender corridor)
    // Counter spans X = -0.72 to -0.32 (width 0.40m, center X = -0.52)
    const barCounter = new THREE.Mesh(new THREE.BoxGeometry(0.40, 1.08, 4.2), matMahogany);
    barCounter.position.set(-0.52, 0.54, 0);

    // Polished Countertop with brass edge trim
    const barTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.08, 4.3),
      new THREE.MeshStandardMaterial({ color: 0x221711, roughness: 0.2, metalness: 0.1 })
    );
    barTop.position.set(-0.52, 1.10, 0);

    const barTrim = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.03, 4.32), matBrass);
    barTrim.position.set(-0.52, 1.06, 0);

    // Warm Under-counter Art Deco ambient glow
    const barGlow = new THREE.PointLight(0xffbe6b, 0.85, 3.5);
    barGlow.position.set(-0.25, 0.95, 0);

    // Brass Footrail for seated patrons
    const footrail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 4.0, 8), matBrass);
    footrail.rotation.x = Math.PI / 2;
    footrail.position.set(-0.22, 0.18, 0);

    barGroup.add(barCounter, barTop, barTrim, barGlow, footrail);

    // Swivel Barstools (3 Stools placed neatly at X = -0.05, leaves X: +0.15 to +1.35 completely OPEN!)
    for (let bsz = -1.3; bsz <= 1.3; bsz += 1.3) {
      const stool = new THREE.Group();
      stool.position.set(-0.05, 0, bsz);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 12), matBrass);
      base.position.set(0, 0.02, 0);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.65, 8), matBrass);
      stem.position.set(0, 0.35, 0);
      const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.09, 16), matLeatherBurgundy);
      cushion.position.set(0, 0.72, 0);

      stool.add(base, stem, cushion);
      barGroup.add(stool);
    }

    // --- ILLUMINATED ART DECO BACKBAR (Along Left Wall X = -1.42) ---
    // Warm lit mirror with golden frame
    const backBarFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 4.2), matMahogany);
    backBarFrame.position.set(-1.42, 1.6, 0);

    const backBarMirror = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.5, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xe8e0d5, roughness: 0.1, metalness: 0.9 })
    );
    backBarMirror.position.set(-1.38, 1.6, 0);

    const backBarLight = new THREE.PointLight(0xffdd99, 1.0, 4.0);
    backBarLight.position.set(-1.15, 1.7, 0);

    barGroup.add(backBarFrame, backBarMirror, backBarLight);

    // 3 Tiers of Glass Shelves & Bottles
    const bottleColors = [0x994411, 0x225522, 0x882222, 0xddaa33, 0x113355];
    [1.15, 1.55, 1.95].forEach((sy, tier) => {
      // Glass shelf
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.03, 3.8),
        new THREE.MeshPhysicalMaterial({ color: 0xccddff, transparent: true, opacity: 0.6, roughness: 0.1, transmission: 0.8 })
      );
      shelf.position.set(-1.3, sy, 0);
      barGroup.add(shelf);

      // Decanters & Bottles on each tier
      for (let bz = -1.6; bz <= 1.6; bz += 0.45) {
        const col = bottleColors[Math.abs(Math.floor(bz * 7 + tier)) % bottleColors.length];
        const bottleMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.2, transparent: true, opacity: 0.85 });
        
        // Bottle body
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.26, 10), bottleMat);
        bottle.position.set(-1.3, sy + 0.14, bz);

        // Bottle neck & brass stopper
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.08, 8), bottleMat);
        neck.position.set(-1.3, sy + 0.28, bz);
        const stopper = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matGold);
        stopper.position.set(-1.3, sy + 0.33, bz);

        barGroup.add(bottle, neck, stopper);
      }
    });

    // Bar Counter Accessories (Cocktail Shaker, Ice Bucket, Coupe Glasses)
    const shaker = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.24, 12), matBrass);
    shaker.position.set(-0.52, 1.24, 0.8);

    const iceBucket = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.15, 12), matBrass);
    iceBucket.position.set(-0.52, 1.20, -0.9);

    [-0.3, 0.1, 0.4].forEach(gz => {
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.01, 0.1, 10),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, roughness: 0.1, transmission: 0.9 })
      );
      glass.position.set(-0.42, 1.18, gz);
      barGroup.add(glass);
    });

    barGroup.add(shaker, iceBucket);
    group.add(barGroup);

    // ==========================================
    // 5. PARLOR SEATING & CLUB CHAIRS (Z = -6.5 to +3.0)
    // ==========================================
    const createClubArmchair = (x, z, rotY) => {
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      chair.rotation.y = rotY;

      // Deep wide cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.7), matLeatherCognac);
      seat.position.set(0, 0.25, 0);
      seat.castShadow = true;

      // Rounded plush backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.18), matLeatherCognac);
      back.position.set(0, 0.55, -0.28);
      back.castShadow = true;

      // Rolled armrests
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.68), matLeatherCognac);
      armL.position.set(-0.35, 0.42, 0);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.68), matLeatherCognac);
      armR.position.set(0.35, 0.42, 0);

      chair.add(seat, back, armL, armR);
      return chair;
    };

    const createCoffeeTable = (x, z) => {
      const table = new THREE.Group();
      table.position.set(x, 0, z);

      const top = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.95), matMahogany);
      top.position.set(0, 0.45, 0);

      const brassRim = new THREE.Mesh(new THREE.BoxGeometry(0.67, 0.06, 0.97), matBrass);
      brassRim.position.set(0, 0.45, 0);

      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.85), matMahogany);
      legs.position.set(0, 0.21, 0);

      // Brass ashtray & newspaper
      const ashtray = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8), matBrass);
      ashtray.position.set(0.12, 0.49, 0.1);

      table.add(top, brassRim, legs, ashtray);
      return table;
    };

    // Conversational Grouping 1 (Right Side)
    group.add(createClubArmchair(0.85, 2.0, -Math.PI / 2));
    group.add(createClubArmchair(0.85, -0.5, -Math.PI / 2));
    group.add(createCoffeeTable(0.85, 0.75));

    // Conversational Grouping 2 (Left Side)
    group.add(createClubArmchair(-0.85, 0.5, Math.PI / 2));
    group.add(createClubArmchair(-0.85, -2.0, Math.PI / 2));
    group.add(createCoffeeTable(-0.85, -0.75));

    // Conversational Grouping 3 (Right Side Aft)
    group.add(createClubArmchair(0.85, -3.5, -Math.PI / 2));
    group.add(createClubArmchair(0.85, -5.5, -Math.PI / 2));
    group.add(createCoffeeTable(0.85, -4.5));

    // ==========================================
    // 6. VINTAGE 1930s FLOOR CONSOLE RADIO / PHONOGRAPH
    // ==========================================
    const radioGroup = new THREE.Group();
    radioGroup.position.set(-width / 2 + 0.35, 0, -5.0);
    radioGroup.rotation.y = Math.PI / 2;

    // Rich curved wooden cabinet
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 0.45), matMahogany);
    cabinet.position.set(0, 0.58, 0);

    // Glowing yellow radio tuning dial
    const dial = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 16),
      new THREE.MeshBasicMaterial({ color: 0xffcb6b })
    );
    dial.position.set(0, 0.85, 0.23);

    // Cloth speaker fretwork grille
    const clothGrille = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.45, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x7c6245, roughness: 0.9 })
    );
    clothGrille.position.set(0, 0.4, 0.23);

    // Knobs
    [-0.15, 0.15].forEach(kx => {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), matBrass);
      knob.rotation.x = Math.PI / 2;
      knob.position.set(kx, 0.72, 0.24);
      radioGroup.add(knob);
    });

    radioGroup.add(cabinet, dial, clothGrille);
    group.add(radioGroup);

    // 7. Warm Atmospheric Art Deco Lighting
    for (let lz = -7.0; lz <= 7.0; lz += 3.5) {
      const chandelier = new THREE.Group();
      chandelier.position.set(0, height - 0.15, lz);

      const brassRing = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 8, 16), matBrass);
      brassRing.rotation.x = Math.PI / 2;
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.24, 0.15, 12, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xffdfaa })
      );
      shade.position.set(0, -0.08, 0);

      const light = new THREE.PointLight(0xffbe6b, 0.85, 5.5);
      light.position.set(0, -0.15, 0);

      chandelier.add(brassRing, shade, light);
      group.add(chandelier);
    }

    return group;
  };

  return { create };
})();

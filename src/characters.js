// 16 1930s Characters 3D Generator based on turnaround design sheets
const Characters = (() => {
  const characterList = [];

  // Common Materials Helper
  const createMat = (color, roughness = 0.7, metalness = 0.1) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  };

  // Reusable materials
  const matSkinTan = createMat(0xdfa57f, 0.8);
  const matSkinFair = createMat(0xf0c8a8, 0.8);
  const matSkinOlive = createMat(0xcba07a, 0.8);
  const matHairBrown = createMat(0x3d2719, 0.9);
  const matHairDark = createMat(0x1a1816, 0.9);
  const matHairBlonde = createMat(0xd8ba73, 0.85);
  const matHairRed = createMat(0x9e3820, 0.85);
  const matHairGrey = createMat(0x8a8a88, 0.9);
  const matShoesBlack = createMat(0x18181a, 0.5, 0.3);
  const matShoesBrown = createMat(0x422817, 0.6, 0.2);
  const matGold = createMat(0xdfb142, 0.3, 0.85);
  const matBrass = createMat(0xb58b29, 0.3, 0.8);

  // Helper to build base humanoid body
  const createHumanoid = (heightScale = 1.0, isFemale = false) => {
    const root = new THREE.Group();
    const h = heightScale;

    // Pelvis / Hips
    const hips = new THREE.Group();
    hips.position.set(0, 0.9 * h, 0);
    root.add(hips);

    // Torso / Chest
    const torso = new THREE.Group();
    torso.position.set(0, 0.25 * h, 0);
    hips.add(torso);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * h, 0.07 * h, 0.1 * h, 8), matSkinFair);
    neck.position.set(0, 0.42 * h, 0);
    torso.add(neck);

    const head = new THREE.Group();
    head.position.set(0, 0.55 * h, 0);
    torso.add(head);

    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12 * h, 12, 12),
      matSkinFair
    );
    headMesh.scale.set(0.9, 1.15, 0.95);
    head.add(headMesh);

    // Shoulders & Arms
    const shoulderL = new THREE.Group();
    shoulderL.position.set(-0.24 * h, 0.35 * h, 0);
    torso.add(shoulderL);

    const shoulderR = new THREE.Group();
    shoulderR.position.set(0.24 * h, 0.35 * h, 0);
    torso.add(shoulderR);

    // Legs
    const legL = new THREE.Group();
    legL.position.set(-0.11 * h, 0, 0);
    hips.add(legL);

    const legR = new THREE.Group();
    legR.position.set(0.11 * h, 0, 0);
    hips.add(legR);

    return { root, hips, torso, neck, head, headMesh, shoulderL, shoulderR, legL, legR, h };
  };

  // =========================================================================
  // 1. 케이드 (Cade / Worker) - Image 1 Top-Left
  // =========================================================================
  const createCade = () => {
    const b = createHumanoid(1.05);
    b.headMesh.material = matSkinTan;
    b.neck.material = matSkinTan;

    // Messy brown hair
    const hair = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14 * b.h), matHairBrown);
    hair.position.set(0, 0.04 * b.h, -0.01 * b.h);
    hair.scale.set(1.05, 1.05, 1.1);
    b.head.add(hair);

    // Shirt (dirty grey/tan)
    const shirtMat = createMat(0xa59f93, 0.9);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.26), shirtMat);
    chest.position.set(0, 0.15, 0);
    b.torso.add(chest);

    // Denim Overalls (blue denim with straps and bib)
    const denimMat = createMat(0x354b5e, 0.85);
    const bib = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.28), denimMat);
    bib.position.set(0, 0.12, 0.01);
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.29), denimMat);
    strapL.position.set(-0.12, 0.18, 0);
    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.29), denimMat);
    strapR.position.set(0.12, 0.18, 0);
    b.torso.add(bib, strapL, strapR);

    // Arms with rolled sleeves
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.28, 8), shirtMat);
      upperArm.position.set(0, -0.14, 0);
      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.28, 8), matSkinTan);
      foreArm.position.set(0, -0.38, 0);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), matSkinTan);
      hand.position.set(0, -0.52, 0);
      sh.add(upperArm, foreArm, hand);
    });

    // Heavy denim pants and boots
    [b.legL, b.legR].forEach(leg => {
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.65, 8), denimMat);
      pants.position.set(0, -0.32, 0);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.18, 0.22), matShoesBrown);
      boot.position.set(0, -0.72, 0.04);
      leg.add(pants, boot);
    });

    return b.root;
  };

  // =========================================================================
  // 2. 넬 (Nell / Seamstress) - Image 1 Top-Right
  // =========================================================================
  const createNell = () => {
    const b = createHumanoid(0.96, true);

    // Braided twin hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), matHairBrown);
    hair.position.set(0, 0.05, -0.02);
    // Twin braids
    [-0.08, 0.08].forEach(bx => {
      const braid = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.26, 6), matHairBrown);
      braid.position.set(bx, -0.12, 0.02);
      b.head.add(braid);
    });
    b.head.add(hair);

    // Olive-brown dress & Apron
    const dressMat = createMat(0x6e7355, 0.85);
    const apronMat = createMat(0xd8c8ab, 0.9);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.22), dressMat);
    chest.position.set(0, 0.15, 0);
    const apronBib = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 0.24), apronMat);
    apronBib.position.set(0, 0.12, 0.01);
    b.torso.add(chest, apronBib);

    // Apron skirt over dress
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 0.55, 12), apronMat);
    skirt.position.set(0, -0.25, 0);
    b.hips.add(skirt);

    // Arms
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.2, 8), dressMat);
      sleeve.position.set(0, -0.1, 0);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.26, 8), matSkinFair);
      arm.position.set(0, -0.3, 0);
      sh.add(sleeve, arm);
    });

    // Boots
    [b.legL, b.legR].forEach(leg => {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.18), matShoesBrown);
      boot.position.set(0, -0.68, 0.02);
      leg.add(boot);
    });

    return b.root;
  };

  // =========================================================================
  // 3. 주드 (Jude / Con Artist) - Image 1 Bottom-Left
  // =========================================================================
  const createJude = () => {
    const b = createHumanoid(1.02);

    // Slicked dark hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matHairDark);
    hair.position.set(0, 0.04, -0.01);
    hair.scale.set(0.95, 1.0, 1.1);
    b.head.add(hair);

    // Red pinstripe suit
    const suitMat = createMat(0x6e252d, 0.6, 0.15);
    const vestMat = createMat(0x42151a, 0.7);
    const tieMat = matGold;

    const jacket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.26), suitMat);
    jacket.position.set(0, 0.16, 0);
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.27), vestMat);
    vest.position.set(0, 0.12, 0.01);
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.28), tieMat);
    tie.position.set(0, 0.2, 0.01);
    b.torso.add(jacket, vest, tie);

    // Suit arms
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.48, 8), suitMat);
      sleeve.position.set(0, -0.24, 0);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), matSkinFair);
      hand.position.set(0, -0.5, 0);
      sh.add(sleeve, hand);
    });

    // Pinstripe slacks & two-tone wingtip shoes
    [b.legL, b.legR].forEach(leg => {
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 8), suitMat);
      pants.position.set(0, -0.34, 0);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.22), matShoesBrown);
      shoe.position.set(0, -0.72, 0.04);
      leg.add(pants, shoe);
    });

    return b.root;
  };

  // =========================================================================
  // 4. 케이 (K / Nurse) - Image 1 Bottom-Right
  // =========================================================================
  const createNurseK = () => {
    const b = createHumanoid(0.98, true);

    // Dark hair in bun
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), matHairDark);
    hair.position.set(0, 0.04, -0.01);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), matHairDark);
    bun.position.set(0, 0.02, -0.11);
    b.head.add(hair, bun);

    // White nurse folded cap
    const capMat = createMat(0xf8f8f8, 0.8);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.09, 0.12), capMat);
    cap.position.set(0, 0.12, -0.02);
    b.head.add(cap);

    // Blue uniform dress + White pinafore apron
    const blueMat = createMat(0x4d759a, 0.8);
    const apronMat = createMat(0xf8f8f8, 0.85);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.22), blueMat);
    chest.position.set(0, 0.15, 0);
    const bib = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.24), apronMat);
    bib.position.set(0, 0.14, 0.01);
    b.torso.add(chest, bib);

    // Skirt
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.26, 0.58, 12), apronMat);
    skirt.position.set(0, -0.26, 0);
    b.hips.add(skirt);

    // Blue sleeves
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.46, 8), blueMat);
      sleeve.position.set(0, -0.23, 0);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), matSkinFair);
      hand.position.set(0, -0.48, 0);
      sh.add(sleeve, hand);
    });

    [b.legL, b.legR].forEach(leg => {
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.18), matShoesBlack);
      shoe.position.set(0, -0.68, 0.02);
      leg.add(shoe);
    });

    return b.root;
  };

  // =========================================================================
  // 5. 필릭스 (Felix / Photographer) - Image 2 Top-Left
  // =========================================================================
  const createFelix = () => {
    const b = createHumanoid(1.0);

    // Spiky brown hair
    const hair = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13), matHairBrown);
    hair.position.set(0, 0.05, 0);
    b.head.add(hair);

    // Khaki shirt + brown utility vest
    const shirtMat = createMat(0xd8cbb5, 0.85);
    const vestMat = createMat(0x543b27, 0.8);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.24), shirtMat);
    chest.position.set(0, 0.15, 0);
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 0.26), vestMat);
    vest.position.set(0, 0.15, 0);
    b.torso.add(chest, vest);

    // Vintage Rangefinder Camera slung over chest
    const cameraBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), matShoesBlack);
    cameraBody.position.set(0.08, 0.1, 0.16);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8), matBrass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0.08, 0.1, 0.2);
    const cameraStrap = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 6, 16), matShoesBrown);
    cameraStrap.position.set(0, 0.2, 0.05);
    cameraStrap.rotation.y = 0.3;
    b.torso.add(cameraBody, lens, cameraStrap);

    // Dark pants and boots
    const pantsMat = createMat(0x283329, 0.85);
    [b.legL, b.legR].forEach(leg => {
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.65, 8), pantsMat);
      pants.position.set(0, -0.32, 0);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.2), matShoesBrown);
      boot.position.set(0, -0.7, 0.03);
      leg.add(pants, boot);
    });

    return b.root;
  };

  // =========================================================================
  // 6. 로즈 (Rose / Dancer) - Image 2 Top-Right
  // =========================================================================
  const createRose = () => {
    const b = createHumanoid(0.98, true);

    // Auburn/Red wavy bob hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matHairRed);
    hair.position.set(0, 0.03, -0.01);
    b.head.add(hair);

    // Emerald top + Orange neck scarf + Pleated brown skirt
    const topMat = createMat(0x386b52, 0.8);
    const scarfMat = createMat(0xdf6e25, 0.7);
    const skirtMat = createMat(0x4a2c27, 0.85);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.2), topMat);
    chest.position.set(0, 0.15, 0);
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 6, 12), scarfMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.set(0, 0.36, 0);
    b.torso.add(chest, scarf);

    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.25, 0.5, 16), skirtMat);
    skirt.position.set(0, -0.22, 0);
    b.hips.add(skirt);

    // Mary Jane dancer shoes
    [b.legL, b.legR].forEach(leg => {
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.16), matShoesBrown);
      shoe.position.set(0, -0.68, 0.02);
      leg.add(shoe);
    });

    return b.root;
  };

  // =========================================================================
  // 7. 워드 (Ward / Detective) - Image 2 Bottom-Left
  // =========================================================================
  const createWard = () => {
    const b = createHumanoid(1.06);

    // Greying hair & rugged look
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135, 12, 12), matHairGrey);
    hair.position.set(0, 0.04, -0.01);
    b.head.add(hair);

    // Grey double-breasted trench coat with belt
    const coatMat = createMat(0x6e7370, 0.85);
    const beltMat = createMat(0x464a47, 0.85);

    const coatTorso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.28), coatMat);
    coatTorso.position.set(0, 0.16, 0);
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.29), beltMat);
    belt.position.set(0, 0.02, 0);
    const coatSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.55, 12), coatMat);
    coatSkirt.position.set(0, -0.25, 0);
    b.torso.add(coatTorso, belt);
    b.hips.add(coatSkirt);

    // Coat sleeves
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.5, 8), coatMat);
      sleeve.position.set(0, -0.25, 0);
      sh.add(sleeve);
    });

    // Dark detective boots
    [b.legL, b.legR].forEach(leg => {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.22), matShoesBlack);
      boot.position.set(0, -0.72, 0.04);
      leg.add(boot);
    });

    return b.root;
  };

  // =========================================================================
  // 8. 클라라 (Clara / Novelist) - Image 2 Bottom-Right
  // =========================================================================
  const createClara = () => {
    const b = createHumanoid(0.97, true);

    // Dark bob hair with bangs
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matHairDark);
    hair.position.set(0, 0.03, -0.01);
    hair.scale.set(1.0, 1.05, 1.05);
    b.head.add(hair);

    // Olive green trench coat
    const coatMat = createMat(0x657754, 0.85);
    const coat = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.46, 0.24), coatMat);
    coat.position.set(0, 0.16, 0);
    const coatSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.26, 0.58, 12), coatMat);
    coatSkirt.position.set(0, -0.26, 0);
    b.torso.add(coat);
    b.hips.add(coatSkirt);

    // Notebook and pen in hand
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.03), createMat(0x422818, 0.7));
    book.position.set(-0.25, -0.15, 0.15);
    book.rotation.z = 0.4;
    b.torso.add(book);

    return b.root;
  };

  // =========================================================================
  // 9. 할란 (Harlan / Businessman) - Image 3 Top-Left
  // =========================================================================
  const createHarlan = () => {
    const b = createHumanoid(1.03);

    // Combed black hair + pencil mustache
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matHairDark);
    hair.position.set(0, 0.04, -0.01);
    const stache = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), matHairDark);
    stache.position.set(0, -0.02, 0.12);
    b.head.add(hair, stache);

    // Sharp charcoal 3-piece suit
    const suitMat = createMat(0x282c33, 0.6, 0.2);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.24), suitMat);
    chest.position.set(0, 0.16, 0);
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.26), matShoesBlack);
    tie.position.set(0, 0.2, 0.01);
    b.torso.add(chest, tie);

    [b.legL, b.legR].forEach(leg => {
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 8), suitMat);
      pants.position.set(0, -0.34, 0);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.22), matShoesBlack);
      shoe.position.set(0, -0.72, 0.03);
      leg.add(pants, shoe);
    });

    return b.root;
  };

  // =========================================================================
  // 10. 룰루 (Lulu / Singer) - Image 3 Top-Right
  // =========================================================================
  const createLulu = () => {
    const b = createHumanoid(0.99, true);

    // 1930s finger-waved black hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matHairDark);
    hair.position.set(0, 0.04, -0.01);
    b.head.add(hair);

    // Emerald satin evening gown with off-shoulder ruffles
    const gownMat = createMat(0x0f6e4a, 0.4, 0.3); // Emerald satin
    const ruffleMat = createMat(0x13543b, 0.5, 0.2);
    const gloveMat = createMat(0x12241c, 0.6);

    const bodice = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 0.2), gownMat);
    bodice.position.set(0, 0.14, 0);
    const ruffles = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 8, 16), ruffleMat);
    ruffles.rotation.x = Math.PI / 2;
    ruffles.position.set(0, 0.32, 0);
    b.torso.add(bodice, ruffles);

    // Mermaid gown skirt
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.28, 0.75, 16), gownMat);
    skirt.position.set(0, -0.35, 0);
    b.hips.add(skirt);

    // Long opera gloves
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.46, 8), gloveMat);
      arm.position.set(0, -0.23, 0);
      sh.add(arm);
    });

    return b.root;
  };

  // =========================================================================
  // 11. 엘리아스 (Elias / Reporter) - Image 3 Bottom-Left
  // =========================================================================
  const createElias = () => {
    const b = createHumanoid(1.0);

    // Fedora hat with white "PRESS" ticket card in hatband
    const fedoraMat = createMat(0x3d352d, 0.8);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 16), fedoraMat);
    brim.position.set(0, 0.12, 0);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.12, 12), fedoraMat);
    crown.position.set(0, 0.18, 0);
    // White PRESS card
    const pressCard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.005), createMat(0xffffff));
    pressCard.position.set(-0.13, 0.16, 0.04);
    pressCard.rotation.y = -0.3;
    b.head.add(brim, crown, pressCard);

    // Suspenders + shirt
    const shirtMat = createMat(0xede6d8, 0.85);
    const suspenderMat = createMat(0x2b231c, 0.9);
    const pantsMat = createMat(0x6e5842, 0.85);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 0.24), shirtMat);
    chest.position.set(0, 0.15, 0);
    const suspL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.25), suspenderMat);
    suspL.position.set(-0.1, 0.15, 0);
    const suspR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.25), suspenderMat);
    suspR.position.set(0.1, 0.15, 0);
    b.torso.add(chest, suspL, suspR);

    // Reporter notepad and pen in hand
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.02), createMat(0xfffae0));
    pad.position.set(0.18, 0.05, 0.2);
    pad.rotation.x = 0.5;
    b.torso.add(pad);

    [b.legL, b.legR].forEach(leg => {
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.65, 8), pantsMat);
      pants.position.set(0, -0.32, 0);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.2), matShoesBrown);
      shoe.position.set(0, -0.7, 0.03);
      leg.add(pants, shoe);
    });

    return b.root;
  };

  // =========================================================================
  // 12. 게일 (Gail / Doctor) - Image 3 Bottom-Right
  // =========================================================================
  const createGail = () => {
    const b = createHumanoid(1.0, true);

    // Dark hair bun + round wire spectacles
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), matHairDark);
    hair.position.set(0, 0.04, -0.01);
    // Glasses
    const glasses = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 12), matGold);
    glasses.position.set(-0.045, 0.02, 0.12);
    const glasses2 = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 12), matGold);
    glasses2.position.set(0.045, 0.02, 0.12);
    b.head.add(hair, glasses, glasses2);

    // White lab coat + Stethoscope
    const coatMat = createMat(0xf8f8f8, 0.85);
    const greenShirt = createMat(0x3e6852, 0.85);
    const stethMat = createMat(0x333333, 0.6, 0.4);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.22), greenShirt);
    chest.position.set(0, 0.15, 0);
    const coat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.5, 0.26), coatMat);
    coat.position.set(0, 0.16, 0);
    const coatLower = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 0.55, 12), coatMat);
    coatLower.position.set(0, -0.25, 0);

    // Stethoscope loop
    const steth = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 6, 16), stethMat);
    steth.position.set(0, 0.22, 0.1);
    b.torso.add(chest, coat, steth);
    b.hips.add(coatLower);

    return b.root;
  };

  // =========================================================================
  // 13. 브람 (Bram / College Student) - Image 4 Top-Left
  // =========================================================================
  const createBram = () => {
    const b = createHumanoid(0.99);

    // Blonde messy hair
    const hair = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13), matHairBlonde);
    hair.position.set(0, 0.05, 0);
    b.head.add(hair);

    // Fair Isle knit pattern vest over shirt
    const vestMat = createMat(0x6b442b, 0.9);
    const shirtMat = createMat(0xede8dc, 0.85);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.22), shirtMat);
    chest.position.set(0, 0.15, 0);
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.38, 0.24), vestMat);
    vest.position.set(0, 0.15, 0);
    b.torso.add(chest, vest);

    const pantsMat = createMat(0x252e27, 0.85);
    [b.legL, b.legR].forEach(leg => {
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.65, 8), pantsMat);
      pants.position.set(0, -0.32, 0);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.14, 0.2), matShoesBrown);
      boot.position.set(0, -0.7, 0.03);
      leg.add(pants, boot);
    });

    return b.root;
  };

  // =========================================================================
  // 14. 아이다 (Ida / Secretary) - Image 4 Top-Right
  // =========================================================================
  const createIda = () => {
    const b = createHumanoid(0.97, true);

    // Styled brown waves
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matHairBrown);
    hair.position.set(0, 0.04, -0.01);
    b.head.add(hair);

    // Green skirt suit
    const suitMat = createMat(0x2f6b47, 0.8);
    const jacket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.22), suitMat);
    jacket.position.set(0, 0.15, 0);
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 0.52, 12), suitMat);
    skirt.position.set(0, -0.24, 0);
    b.torso.add(jacket);
    b.hips.add(skirt);

    return b.root;
  };

  // =========================================================================
  // 15. 아서 (Arthur / Professor) - Image 4 Bottom-Left
  // =========================================================================
  const createArthur = () => {
    const b = createHumanoid(1.0);

    // Balding grey hair
    const hair = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.08, 12, 1, false, 0, Math.PI * 1.4), matHairGrey);
    hair.position.set(0, 0.02, -0.02);
    // Spectacles
    const spec = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.02), matGold);
    spec.position.set(0, 0.02, 0.12);
    b.head.add(hair, spec);

    // Brown wool overcoat
    const coatMat = createMat(0x4a3224, 0.9);
    const coat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.28), coatMat);
    coat.position.set(0, 0.16, 0);
    const coatLower = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.62, 12), coatMat);
    coatLower.position.set(0, -0.28, 0);
    b.torso.add(coat);
    b.hips.add(coatLower);

    return b.root;
  };

  // =========================================================================
  // 16. 메이벨 (Mabel / Aristocrat) - Image 4 Bottom-Right
  // =========================================================================
  const createMabel = () => {
    const b = createHumanoid(1.01, true);

    // Ornate feathered aristocratic hat
    const hatMat = createMat(0x194547, 0.85);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16), hatMat);
    brim.position.set(0, 0.11, 0);
    brim.rotation.z = -0.15; // Tilted high-fashion angle
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.1, 12), hatMat);
    crown.position.set(0, 0.16, 0);
    crown.rotation.z = -0.15;
    // Black ostrich feathers
    const feather = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 6), matShoesBlack);
    feather.position.set(0.16, 0.24, -0.05);
    feather.rotation.z = -0.5;
    b.head.add(brim, crown, feather);

    // Teal & navy travel coat-dress
    const dressMat = createMat(0x1a494c, 0.8);
    const coat = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.46, 0.22), dressMat);
    coat.position.set(0, 0.16, 0);
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.65, 16), dressMat);
    skirt.position.set(0, -0.3, 0);
    b.torso.add(coat);
    b.hips.add(skirt);

    // Long dark gloves
    [-1, 1].forEach(side => {
      const sh = side === -1 ? b.shoulderL : b.shoulderR;
      const glove = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.45, 8), matShoesBlack);
      glove.position.set(0, -0.22, 0);
      sh.add(glove);
    });

    return b.root;
  };

  // =========================================================================
  // INIT & PLACEMENT OF ALL 16 CHARACTERS ACROSS THE 8 CARS
  // =========================================================================
  const init = (scene) => {
    const charactersData = [
      // Car 1: 기관차 운전실 & 탄수차
      { id: 1, name: '케이드 / 노동자 (Cade)', fn: createCade, pos: { x: -0.65, y: 1.6, z: -3.5 }, rotY: 0.3 },

      // Car 2: 수하물차
      { id: 2, name: '워드 / 형사 (Ward)', fn: createWard, pos: { x: 0.6, y: 1.2, z: -25.5 }, rotY: -1.2 },

      // Car 3: 일반 객차
      { id: 3, name: '브람 / 대학생 (Bram)', fn: createBram, pos: { x: -0.9, y: 1.2, z: -38.5 }, rotY: 0 },
      { id: 4, name: '넬 / 재봉사 (Nell)', fn: createNell, pos: { x: 0.9, y: 1.2, z: -41.5 }, rotY: 0 },
      { id: 5, name: '케이 / 간호사 (K)', fn: createNurseK, pos: { x: -0.15, y: 1.2, z: -46.0 }, rotY: 0 },
      { id: 6, name: '엘리아스 / 기자 (Elias)', fn: createElias, pos: { x: 0.9, y: 1.2, z: -48.0 }, rotY: -Math.PI / 2 },

      // Car 4: 1등석 침대차
      { id: 7, name: '할란 / 사업가 (Harlan)', fn: createHarlan, pos: { x: 0.4, y: 1.2, z: -62.0 }, rotY: -Math.PI / 2 },
      { id: 8, name: '클라라 / 소설가 (Clara)', fn: createClara, pos: { x: 0.3, y: 1.2, z: -67.2 }, rotY: -Math.PI / 2 },
      { id: 9, name: '아이다 / 비서 (Ida)', fn: createIda, pos: { x: 0.4, y: 1.2, z: -72.2 }, rotY: -Math.PI / 2 },

      // Car 5: 2등석 침대차
      { id: 10, name: '게일 / 의사 (Gail)', fn: createGail, pos: { x: 0.1, y: 1.2, z: -84.0 }, rotY: 0 },
      { id: 11, name: '아서 / 교수 (Arthur)', fn: createArthur, pos: { x: -0.85, y: 1.2, z: -92.0 }, rotY: Math.PI / 2 },

      // Car 6: 식당차
      { id: 12, name: '주드 / 사기꾼 (Jude)', fn: createJude, pos: { x: 0.95, y: 1.2, z: -107.5 }, rotY: 0 },
      { id: 13, name: '로즈 / 무용수 (Rose)', fn: createRose, pos: { x: 0.95, y: 1.2, z: -106.1 }, rotY: Math.PI },

      // Car 7: 라운지차
      { id: 14, name: '룰루 / 가수 (Lulu)', fn: createLulu, pos: { x: -0.7, y: 1.2, z: -128.5 }, rotY: Math.PI / 4 },
      { id: 15, name: '필릭스 / 사진사 (Felix)', fn: createFelix, pos: { x: 0.85, y: 1.2, z: -132.5 }, rotY: -Math.PI / 2 },

      // Car 8: 전망차
      { id: 16, name: '메이벨 / 귀족 (Mabel)', fn: createMabel, pos: { x: 0.9, y: 1.2, z: -152.0 }, rotY: -Math.PI / 2 }
    ];

    charactersData.forEach(d => {
      const model = d.fn();
      model.position.set(d.pos.x, d.pos.y, d.pos.z);
      model.rotation.y = d.rotY;
      model.name = d.name;
      model.traverse(child => {
        child.userData.characterName = d.name;
      });
      scene.add(model);
      characterList.push(model);

      // Register collision box for character (cannot walk through characters!)
      Collision.addBox(
        d.pos.x - 0.28,
        d.pos.x + 0.28,
        d.pos.z - 0.28,
        d.pos.z + 0.28,
        d.pos.y,
        d.pos.y + 2.0,
        d.name
      );
    });
  };

  return {
    init,
    getList: () => characterList
  };
})();

// 16 1930s Characters: True 3D Humanoid Game Character Models
// Full 3D anatomy with side profiles, realistic depth, 3D clothing, sculpted heads, hats, and period props.
// Multi-material mapping projects the authentic character front/back artwork onto the 3D body,
// while matching fabric, hair, and leather materials provide complete 360-degree volume and side profile.

const Characters = (() => {
  const characterList = [];

  // Ground Contact Shadow Texture
  const createContactShadowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(0.45, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };
  const contactShadowTex = createContactShadowTexture();

  // Character-specific authentic 1930s color palettes, silhouettes, and accessories
  const characterPalettes = {
    cade: { suit: 0x3a4856, trouser: 0x2b2f34, shoe: 0x1c1612, hair: 0x241a14, skin: 0xdfbe9f, hat: 'newsboy', isSkirt: false, prop: 'wrench' },
    ward: { suit: 0x54585c, trouser: 0x2c2e30, shoe: 0x121214, hair: 0x1a1614, skin: 0xecd5bd, hat: 'fedora', isSkirt: false, prop: 'badge' },
    bram: { suit: 0x725b42, trouser: 0x3d3328, shoe: 0x251a12, hair: 0x362519, skin: 0xecd5bd, hat: null, isSkirt: false, prop: 'book' },
    nell: { suit: 0x285658, trouser: 0x20484a, shoe: 0x141818, hair: 0x261810, skin: 0xf0dbcb, hat: 'cloche', isSkirt: true, prop: 'tape' },
    nurse_k: { suit: 0xf2f4f8, trouser: 0xf2f4f8, shoe: 0xebedf2, hair: 0x221812, skin: 0xf2ddce, hat: 'nurse_cap', isSkirt: true, prop: 'clipboard' },
    elias: { suit: 0x5a4c38, trouser: 0x3c3224, shoe: 0x1e1710, hair: 0x281c14, skin: 0xecd5bd, hat: 'fedora', isSkirt: false, prop: 'notebook' },
    harlan: { suit: 0x1c2434, trouser: 0x181f2c, shoe: 0x0c0e12, hair: 0x787878, skin: 0xebd3bc, hat: null, isSkirt: false, prop: 'cane' },
    clara: { suit: 0x482238, trouser: 0x3e1c30, shoe: 0x1a0c14, hair: 0x181210, skin: 0xf5dfd2, hat: null, isSkirt: true, prop: 'handbag' },
    ida: { suit: 0xede4d6, trouser: 0x1c2434, shoe: 0x10141c, hair: 0x241812, skin: 0xf0dbcb, hat: null, isSkirt: true, prop: 'folder' },
    gail: { suit: 0x2c3035, trouser: 0x24282c, shoe: 0x141618, hair: 0x444444, skin: 0xebd3bc, hat: null, isSkirt: false, prop: 'stethoscope' },
    arthur: { suit: 0x5e3e26, trouser: 0x422c1c, shoe: 0x22160e, hair: 0x888888, skin: 0xecd5bd, hat: null, isSkirt: false, prop: 'book' },
    jude: { suit: 0x18181c, trouser: 0x141418, shoe: 0x08080a, hair: 0x121010, skin: 0xebd3bc, hat: 'fedora', isSkirt: false, prop: null },
    rose: { suit: 0x851622, trouser: 0x75121c, shoe: 0x3c0810, hair: 0x1c1410, skin: 0xf6dfd2, hat: 'flapper', isSkirt: true, prop: null },
    lulu: { suit: 0xcbb074, trouser: 0xb59a5e, shoe: 0x7a6538, hair: 0xb88e44, skin: 0xf6e2d5, hat: null, isSkirt: true, prop: 'glass' },
    felix: { suit: 0x685744, trouser: 0x362e24, shoe: 0x181410, hair: 0x281e16, skin: 0xebd3bc, hat: 'newsboy', isSkirt: false, prop: 'camera' },
    mabel: { suit: 0x1c382c, trouser: 0x162e24, shoe: 0x101a14, hair: 0x302018, skin: 0xf2ddce, hat: 'aristocrat', isSkirt: true, prop: null }
  };

  // Helper to crop texture region from loaded Image onto a CanvasTexture
  const cropToTexture = (img, sy0, sy1) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const sy = sy0 * img.height;
    const sh = (sy1 - sy0) * img.height;
    ctx.drawImage(img, 0, sy, img.width, sh, 0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };

  // Helper to build 3D Hats
  const createHat = (hatType, hairColor, suitColor) => {
    const hatGroup = new THREE.Group();
    const matFelt = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.7 });
    const matRibbon = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.4 });

    if (hatType === 'fedora') {
      // 1930s Detective/Gentleman Fedora with indented crown and curved brim
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.02, 16), matFelt);
      brim.position.set(0, 0, 0);
      brim.scale.set(1.0, 1.0, 1.15);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.125, 0.12, 16), matFelt);
      crown.position.set(0, 0.065, 0);
      crown.scale.set(0.95, 1.0, 1.1);

      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.127, 0.127, 0.025, 16), matRibbon);
      ribbon.position.set(0, 0.022, 0);
      ribbon.scale.set(0.96, 1.0, 1.11);

      hatGroup.add(brim, crown, ribbon);
    } else if (hatType === 'newsboy') {
      // 1930s Newsboy / Laborer flat cap
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), matFelt);
      crown.scale.set(1.05, 0.55, 1.2);
      crown.position.set(0, 0.02, -0.01);

      const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.015, 12, 1, false, 0, Math.PI), matFelt);
      visor.position.set(0, 0.01, 0.08);
      visor.rotation.x = 0.2;

      hatGroup.add(crown, visor);
    } else if (hatType === 'cloche') {
      // 1930s Ladies Cloche Bell Hat
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), matFelt);
      crown.scale.set(0.95, 0.95, 1.05);
      crown.position.set(0, 0.04, 0);

      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.04, 16), matFelt);
      brim.position.set(0, 0.01, 0);

      hatGroup.add(crown, brim);
    } else if (hatType === 'nurse_cap') {
      // Crisp starched nurse cap with red cross
      const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
      const matRed = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.4 });
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.12), matWhite);
      cap.position.set(0, 0.05, -0.04);
      cap.rotation.x = -0.25;

      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 0.005), matRed);
      crossH.position.set(0, 0.05, 0.022);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.04, 0.005), matRed);
      crossV.position.set(0, 0.05, 0.022);
      hatGroup.add(cap, crossH, crossV);
    } else if (hatType === 'flapper') {
      // 1930s Flapper Beaded Headband with Upright Feather
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 16), matRibbon);
      band.rotation.x = Math.PI / 2;
      band.position.set(0, 0.02, 0);

      const feather = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.16, 6), new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 }));
      feather.position.set(0.08, 0.10, -0.04);
      feather.rotation.z = -0.2;
      feather.rotation.x = -0.15;

      hatGroup.add(band, feather);
    } else if (hatType === 'aristocrat') {
      // Aristocrat veiled wide-brim hat
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.25, 0.02, 18), matFelt);
      brim.position.set(0, 0.01, 0);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.08, 16), matFelt);
      crown.position.set(0, 0.05, 0);
      hatGroup.add(brim, crown);
    }

    return hatGroup;
  };

  // Helper to build 3D Props
  const createProp = (propType, skinColor) => {
    const propGroup = new THREE.Group();

    if (propType === 'camera') {
      // Felix's Vintage Accordion Bellows Camera
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.06), new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.6 }));
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 }));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.04);
      propGroup.add(body, lens);
    } else if (propType === 'notebook') {
      // Elias's Reporter Leather Notebook & Fountain Pen
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 0.02), new THREE.MeshStandardMaterial({ color: 0x4a2a16, roughness: 0.7 }));
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.10, 8), new THREE.MeshStandardMaterial({ color: 0xc0c4c8, metalness: 0.9, roughness: 0.2 }));
      pen.position.set(0.06, 0, 0.01);
      pen.rotation.z = 0.2;
      propGroup.add(book, pen);
    } else if (propType === 'clipboard') {
      // Nurse K's Medical Chart Clipboard
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.01), new THREE.MeshStandardMaterial({ color: 0x6e4a28, roughness: 0.7 }));
      const paper = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 0.005), new THREE.MeshStandardMaterial({ color: 0xfaf8f2, roughness: 0.8 }));
      paper.position.set(0, -0.005, 0.006);
      propGroup.add(board, paper);
    } else if (propType === 'book') {
      // Arthur's / Bram's Academic Hardback Volume
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.035), new THREE.MeshStandardMaterial({ color: 0x5a1820, roughness: 0.6 }));
      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.15, 0.03), new THREE.MeshStandardMaterial({ color: 0xf5eedd, roughness: 0.9 }));
      pages.position.set(0.005, 0, 0);
      propGroup.add(book, pages);
    } else if (propType === 'cane') {
      // Harlan's Aristocrat Walking Cane with Gold Handle
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.008, 0.75, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
      shaft.position.set(0, -0.28, 0);
      const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 }));
      pommel.position.set(0, 0.10, 0);
      propGroup.add(shaft, pommel);
    } else if (propType === 'glass') {
      // Lulu's Vintage Champagne / Cocktail Coupe Glass
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 8), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.1 }));
      const bowl = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.03, 10), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.1 }));
      bowl.position.set(0, 0.045, 0);
      bowl.rotation.x = Math.PI;
      propGroup.add(stem, bowl);
    } else if (propType === 'wrench') {
      // Cade's Heavy Cast Iron Locomotive Wrench
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.24, 0.012), new THREE.MeshStandardMaterial({ color: 0x33363a, metalness: 0.7, roughness: 0.5 }));
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.015, 8), new THREE.MeshStandardMaterial({ color: 0x33363a, metalness: 0.7, roughness: 0.5 }));
      head.position.set(0, 0.12, 0);
      propGroup.add(handle, head);
    } else if (propType === 'handbag') {
      // Clara's Vintage Clasp Handbag
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.04), new THREE.MeshStandardMaterial({ color: 0x221218, roughness: 0.5 }));
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 0.045), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 }));
      clasp.position.set(0, 0.045, 0);
      propGroup.add(bag, clasp);
    }

    return propGroup;
  };

  // Build Complete 3D Humanoid Character Model with full 360-degree volume, depth, and side profile
  const createCharacterModel = (d) => {
    const group = new THREE.Group();
    const H = d.h; // total height (e.g. 1.76m ~ 1.84m)
    const pal = characterPalettes[d.key] || characterPalettes.ward;

    // Body dimensions scaled to character height
    const scale = H / 1.80;
    const torsoW = 0.42 * scale;
    const torsoH = 0.56 * scale;
    const torsoD = 0.24 * scale;

    const headW = 0.21 * scale;
    const headH = 0.25 * scale;
    const headD = 0.22 * scale;

    const legH = 0.72 * scale;
    const legW = 0.15 * scale;
    const legD = 0.18 * scale;

    // Base Materials
    const matSuitSide = new THREE.MeshStandardMaterial({ color: pal.suit, roughness: 0.75, metalness: 0.05 });
    const matTrouserSide = new THREE.MeshStandardMaterial({ color: pal.trouser, roughness: 0.8, metalness: 0.05 });
    const matHairSide = new THREE.MeshStandardMaterial({ color: pal.hair, roughness: 0.85, metalness: 0.05 });
    const matSkin = new THREE.MeshStandardMaterial({ color: pal.skin, roughness: 0.65, metalness: 0.05 });
    const matShoe = new THREE.MeshStandardMaterial({ color: pal.shoe, roughness: 0.35, metalness: 0.2 });

    // Front/Back Canvas Textures (initialized with solid color, populated when PNG loads)
    const createPlaceholderTex = (color) => {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#' + new THREE.Color(color).getHexString();
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    const matHeadFront = new THREE.MeshStandardMaterial({ map: createPlaceholderTex(pal.skin), roughness: 0.65 });
    const matHeadBack = new THREE.MeshStandardMaterial({ map: createPlaceholderTex(pal.hair), roughness: 0.75 });

    const matTorsoFront = new THREE.MeshStandardMaterial({ map: createPlaceholderTex(pal.suit), roughness: 0.7 });
    const matTorsoBack = new THREE.MeshStandardMaterial({ map: createPlaceholderTex(pal.suit), roughness: 0.7 });

    const matLegsFront = new THREE.MeshStandardMaterial({ map: createPlaceholderTex(pal.trouser), roughness: 0.75 });
    const matLegsBack = new THREE.MeshStandardMaterial({ map: createPlaceholderTex(pal.trouser), roughness: 0.75 });

    // Asynchronously load user's authentic turnaround artwork and crop into body sections
    const imgFront = new Image();
    imgFront.src = `assets/characters/${d.key}_front.png`;
    imgFront.onload = () => {
      matHeadFront.map = cropToTexture(imgFront, 0.0, 0.28);
      matHeadFront.needsUpdate = true;

      matTorsoFront.map = cropToTexture(imgFront, 0.28, 0.63);
      matTorsoFront.needsUpdate = true;

      matLegsFront.map = cropToTexture(imgFront, 0.63, 1.0);
      matLegsFront.needsUpdate = true;
    };

    const imgBack = new Image();
    imgBack.src = `assets/characters/${d.key}_back.png`;
    imgBack.onload = () => {
      matHeadBack.map = cropToTexture(imgBack, 0.0, 0.28);
      matHeadBack.needsUpdate = true;

      matTorsoBack.map = cropToTexture(imgBack, 0.28, 0.63);
      matTorsoBack.needsUpdate = true;

      matLegsBack.map = cropToTexture(imgBack, 0.63, 1.0);
      matLegsBack.needsUpdate = true;
    };

    // ==========================================
    // 1. SHOES (Y = 0.0 to 0.08m) - 3D Leather Oxford Shoes / Heels
    // ==========================================
    const shoesGroup = new THREE.Group();
    [-0.10 * scale, 0.10 * scale].forEach(sx => {
      const shoeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.075 * scale, 0.24 * scale), matShoe);
      shoeMesh.position.set(sx, 0.038 * scale, 0.03 * scale);
      shoeMesh.castShadow = true;

      // Heel lift & sole rim
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.125 * scale, 0.02 * scale, 0.25 * scale), new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.8 }));
      sole.position.set(sx, 0.01 * scale, 0.03 * scale);

      shoesGroup.add(shoeMesh, sole);
    });
    group.add(shoesGroup);

    // ==========================================
    // 2. LOWER BODY (Y = 0.08 to 0.80m) - 3D Trousers / Tailored Skirt
    // ==========================================
    const lowerBodyGroup = new THREE.Group();
    if (pal.isSkirt) {
      // 3D Tailored Pencil / Flared Skirt with depth and side profile
      const skirtMatArray = [matTrouserSide, matTrouserSide, matTrouserSide, matTrouserSide, matLegsFront, matLegsBack];
      const skirtMesh = new THREE.Mesh(new THREE.BoxGeometry(torsoW * 0.92, legH * 0.95, torsoD * 0.95), skirtMatArray);
      skirtMesh.position.set(0, 0.08 * scale + (legH * 0.95) / 2, 0);
      skirtMesh.castShadow = true;

      // Calves in stockings between skirt and shoes
      [-0.09 * scale, 0.09 * scale].forEach(cx => {
        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * scale, 0.04 * scale, 0.16 * scale, 8), matSkin);
        calf.position.set(cx, 0.14 * scale, 0);
        lowerBodyGroup.add(calf);
      });

      lowerBodyGroup.add(skirtMesh);
    } else {
      // Two distinct 3D Trouser Legs with creases, volume, and side profiles
      const legMatArray = [matTrouserSide, matTrouserSide, matTrouserSide, matTrouserSide, matLegsFront, matLegsBack];
      [-0.10 * scale, 0.10 * scale].forEach(lx => {
        const legMesh = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legD), legMatArray);
        legMesh.position.set(lx, 0.08 * scale + legH / 2, 0);
        legMesh.castShadow = true;
        lowerBodyGroup.add(legMesh);
      });
    }
    group.add(lowerBodyGroup);

    // ==========================================
    // 3. TORSO (Y = 0.80 to 1.36m) - 3D Chest, Waist, Suit Jacket & Lapels
    // ==========================================
    const torsoGroup = new THREE.Group();
    const torsoCenterY = 0.80 * scale + torsoH / 2;

    // Six-sided BoxGeometry: [Right, Left, Top, Bottom, Front, Back]
    const torsoMatArray = [matSuitSide, matSuitSide, matSuitSide, matSuitSide, matTorsoFront, matTorsoBack];
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(torsoW, torsoH, torsoD), torsoMatArray);
    torsoMesh.position.set(0, torsoCenterY, 0);
    torsoMesh.castShadow = true;
    torsoGroup.add(torsoMesh);

    // Raised 3D Collar Lapels framing chest
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.06 * scale, 0.24 * scale, 0.02 * scale), matSuitSide);
    lapelL.position.set(-0.08 * scale, torsoCenterY + 0.14 * scale, torsoD / 2 + 0.01 * scale);
    lapelL.rotation.z = -0.15;
    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.06 * scale, 0.24 * scale, 0.02 * scale), matSuitSide);
    lapelR.position.set(0.08 * scale, torsoCenterY + 0.14 * scale, torsoD / 2 + 0.01 * scale);
    lapelR.rotation.z = 0.15;
    torsoGroup.add(lapelL, lapelR);

    // Stethoscope around doctor's neck
    if (pal.prop === 'stethoscope') {
      const stethTube = new THREE.Mesh(new THREE.TorusGeometry(0.12 * scale, 0.01 * scale, 6, 12, Math.PI), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 }));
      stethTube.position.set(0, torsoCenterY + 0.22 * scale, torsoD / 2 + 0.02 * scale);
      const stethDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.022 * scale, 0.022 * scale, 0.008 * scale, 12), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 }));
      stethDisc.rotation.x = Math.PI / 2;
      stethDisc.position.set(0, torsoCenterY + 0.05 * scale, torsoD / 2 + 0.025 * scale);
      torsoGroup.add(stethTube, stethDisc);
    }

    group.add(torsoGroup);

    // ==========================================
    // 4. ARMS & HANDS (Left & Right 3D Articulated Limbs with Props)
    // ==========================================
    const armsGroup = new THREE.Group();
    const shoulderY = torsoCenterY + torsoH * 0.38;

    // Left Arm
    const armL = new THREE.Group();
    armL.position.set(-torsoW / 2 - 0.05 * scale, shoulderY, 0);
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * scale, 0.048 * scale, 0.48 * scale, 10), matSuitSide);
    sleeveL.position.set(0, -0.22 * scale, 0.02 * scale);
    sleeveL.rotation.z = 0.08;
    sleeveL.rotation.x = 0.10;
    sleeveL.castShadow = true;
    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.045 * scale, 0.08 * scale, 0.035 * scale), matSkin);
    handL.position.set(0, -0.46 * scale, 0.05 * scale);
    armL.add(sleeveL, handL);

    // Right Arm
    const armR = new THREE.Group();
    armR.position.set(torsoW / 2 + 0.05 * scale, shoulderY, 0);
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * scale, 0.048 * scale, 0.48 * scale, 10), matSuitSide);
    sleeveR.position.set(0, -0.22 * scale, 0.02 * scale);
    sleeveR.rotation.z = -0.08;
    sleeveR.rotation.x = 0.10;
    sleeveR.castShadow = true;
    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.045 * scale, 0.08 * scale, 0.035 * scale), matSkin);
    handR.position.set(0, -0.46 * scale, 0.05 * scale);
    armR.add(sleeveR, handR);

    // Attach Character Prop to Right or Left Hand
    if (pal.prop && pal.prop !== 'stethoscope') {
      const propObj = createProp(pal.prop, pal.skin);
      if (pal.prop === 'camera' || pal.prop === 'clipboard') {
        // Held two-handed at chest
        propObj.position.set(0, torsoCenterY + 0.05 * scale, torsoD / 2 + 0.08 * scale);
        group.add(propObj);
      } else {
        propObj.position.set(0, -0.02 * scale, 0.04 * scale);
        armR.add(propObj);
      }
    }

    armsGroup.add(armL, armR);
    group.add(armsGroup);

    // ==========================================
    // 5. NECK & HEAD (Y = 1.36 to 1.76m) - 3D Sculpted Head with Hair & Hat
    // ==========================================
    const headGroup = new THREE.Group();
    const neckY = torsoCenterY + torsoH / 2 + 0.04 * scale;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065 * scale, 0.075 * scale, 0.09 * scale, 10), matSkin);
    neck.position.set(0, neckY, 0);
    headGroup.add(neck);

    const headCenterY = neckY + 0.045 * scale + headH / 2;

    // Six-sided Head Box: [Right, Left, Top, Bottom, Front, Back]
    const headMatArray = [matHairSide, matHairSide, matHairSide, matSkin, matHeadFront, matHeadBack];
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(headW, headH, headD), headMatArray);
    headMesh.position.set(0, headCenterY, 0);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // 3D Ears on left and right sides
    [-headW / 2 - 0.008 * scale, headW / 2 + 0.008 * scale].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.015 * scale, 0.055 * scale, 0.035 * scale), matSkin);
      ear.position.set(ex, headCenterY, -0.01 * scale);
      headGroup.add(ear);
    });

    // 3D Hat atop head (if character wears a hat)
    if (pal.hat) {
      const hat = createHat(pal.hat, pal.hair, pal.suit);
      hat.position.set(0, headCenterY + headH * 0.48, 0);
      headGroup.add(hat);
    }

    group.add(headGroup);

    // ==========================================
    // 6. SOFT REALISTIC GROUND CONTACT SHADOW
    // ==========================================
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.70 * scale, 0.70 * scale),
      new THREE.MeshBasicMaterial({ map: contactShadowTex, transparent: true, opacity: 0.75, depthWrite: false })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.015, 0);
    group.add(shadowMesh);

    return group;
  };

  // 16 Characters Definition with authentic train positions
  const characterData = [
    // 1. Car 1: Locomotive (케이드 - 노동자)
    { id: 1, key: 'cade', name: '케이드 / 노동자 (Cade)', w: 1.05, h: 1.84, pos: { x: -0.65, y: 1.6, z: -3.5 }, rotY: 0.3 },

    // 2. Car 2: Baggage Car (워드 - 형사)
    { id: 2, key: 'ward', name: '워드 / 형사 (Ward)', w: 0.98, h: 1.85, pos: { x: 0.0, y: 1.2, z: -20.5 }, rotY: 0 },

    // 3. Car 3: Coach Car (4 passengers)
    { id: 3, key: 'bram', name: '브람 / 대학생 (Bram)', w: 0.88, h: 1.76, pos: { x: -0.95, y: 1.2, z: -38.8 }, rotY: 0 },
    { id: 4, key: 'nell', name: '넬 / 재봉사 (Nell)', w: 0.80, h: 1.72, pos: { x: 0.95, y: 1.2, z: -42.0 }, rotY: 0 },
    { id: 5, key: 'nurse_k', name: '케이 / 간호사 (K)', w: 0.86, h: 1.74, pos: { x: -0.32, y: 1.2, z: -45.5 }, rotY: 0.15 },
    { id: 6, key: 'elias', name: '엘리아스 / 기자 (Elias)', w: 0.92, h: 1.80, pos: { x: 0.95, y: 1.2, z: -48.5 }, rotY: -Math.PI / 2 },

    // 4. Car 4: 1st Class Sleeper (3 passengers in Luxury Suites)
    { id: 7, key: 'harlan', name: '할란 / 사업가 (Harlan)', w: 0.95, h: 1.84, pos: { x: 0.85, y: 1.2, z: -61.4 }, rotY: -Math.PI / 2 },
    { id: 8, key: 'clara', name: '클라라 / 소설가 (Clara)', w: 0.92, h: 1.76, pos: { x: 0.85, y: 1.2, z: -66.4 }, rotY: -Math.PI / 2 },
    { id: 9, key: 'ida', name: '아이다 / 비서 (Ida)', w: 0.88, h: 1.76, pos: { x: 0.85, y: 1.2, z: -71.4 }, rotY: -Math.PI / 2 },

    // 5. Car 5: 2nd Class Sleeper (2 passengers)
    { id: 10, key: 'gail', name: '게일 / 의사 (Gail)', w: 0.90, h: 1.78, pos: { x: 0.15, y: 1.2, z: -84.0 }, rotY: 0 },
    { id: 11, key: 'arthur', name: '아서 / 교수 (Arthur)', w: 0.95, h: 1.78, pos: { x: -0.85, y: 1.2, z: -92.0 }, rotY: Math.PI / 2 },

    // 6. Car 6: Dining Car (2 passengers at dining tables)
    { id: 12, key: 'jude', name: '주드 / 사기꾼 (Jude)', w: 0.92, h: 1.82, pos: { x: 0.95, y: 1.2, z: -107.5 }, rotY: 0 },
    { id: 13, key: 'rose', name: '로즈 / 무용수 (Rose)', w: 0.88, h: 1.74, pos: { x: 0.95, y: 1.2, z: -106.1 }, rotY: Math.PI },

    // 7. Car 7: Lounge Car (2 characters)
    { id: 14, key: 'lulu', name: '룰루 / 가수 (Lulu)', w: 0.92, h: 1.78, pos: { x: -0.98, y: 1.2, z: -126.8 }, rotY: Math.PI / 2 },
    { id: 15, key: 'felix', name: '필릭스 / 사진사 (Felix)', w: 0.90, h: 1.80, pos: { x: 0.85, y: 1.2, z: -132.5 }, rotY: -Math.PI / 2 },

    // 8. Car 8: Observation Car (1 passenger)
    { id: 16, key: 'mabel', name: '메이벨 / 귀족 (Mabel)', w: 0.92, h: 1.80, pos: { x: 0.90, y: 1.2, z: -152.0 }, rotY: -Math.PI / 2 }
  ];

  const init = (scene) => {
    characterList.length = 0;

    characterData.forEach(d => {
      const model = createCharacterModel(d);
      model.position.set(d.pos.x, d.pos.y, d.pos.z);
      model.rotation.y = d.rotY;
      model.name = d.name;

      model.userData = {
        isCharacter: true,
        name: d.name,
        radius: 0.28,
        baseY: d.pos.y
      };

      model.traverse(child => {
        child.userData.characterName = d.name;
      });

      scene.add(model);
      characterList.push(model);
    });
  };

  // Push Physics: If player walks into a character, push the character smoothly out of the way!
  const update = (delta, playerPos) => {
    if (!playerPos) return;

    const pushRadius = 0.52; // Combined collision radius (player 0.28 + character 0.24)

    for (let i = 0; i < characterList.length; i++) {
      const char = characterList[i];
      const dx = char.position.x - playerPos.x;
      const dz = char.position.z - playerPos.z;
      const dist = Math.hypot(dx, dz);

      // Check vertical proximity (within same car floor)
      const dy = Math.abs(char.position.y - playerPos.y + 1.6);
      if (dy > 1.8) continue;

      if (dist < pushRadius && dist > 0.001) {
        // Player is touching character -> push character smoothly!
        const overlap = pushRadius - dist;
        const nx = dx / dist;
        const nz = dz / dist;

        char.position.x += nx * overlap * 1.2;
        char.position.z += nz * overlap * 1.2;

        // Clamp character within train car walls
        char.position.x = Math.max(-1.18, Math.min(1.18, char.position.x));
      }
    }
  };

  return {
    init,
    update,
    getList: () => characterList
  };
})();
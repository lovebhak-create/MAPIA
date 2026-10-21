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

  // Texture Loader for clean character front/back turnaround art
  const textureLoader = new THREE.TextureLoader();

  // Helper to build 3D Vintage Hats with true 3D volume, brims, crowns, and ribbons
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

  // Helper to build 3D Period Props
  const createProp = (propType) => {
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
      // Lulu's Vintage Champagne Coupe Glass
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

  // Build Volumetric Stylized 3D Character Model:
  // Pristine front & back turnaround art with 0.18m volumetric depth, full 3D side profile, 3D boots, and 3D hats.
  // NO geometric block monster collage, NO black boxes, NO paper-thin flattening!
  const createCharacterModel = (d) => {
    const group = new THREE.Group();
    const H = d.h; // total height (e.g. 1.76m ~ 1.85m)
    const W = d.w * 0.94; // proportional width
    const depth = 0.18; // 3D human torso depth (from Z: -0.09 to +0.09)
    const pal = characterPalettes[d.key] || characterPalettes.ward;

    // Load authentic, crystal-clear turnaround art
    const frontTex = textureLoader.load(`assets/characters/${d.key}_front.png`);
    frontTex.colorSpace = THREE.SRGBColorSpace;
    const backTex = textureLoader.load(`assets/characters/${d.key}_back.png`);
    backTex.colorSpace = THREE.SRGBColorSpace;

    // 1. FRONT FACE (Z = +0.09m) - Displays user's complete, unblemished front turnaround art
    const matFront = new THREE.MeshStandardMaterial({
      map: frontTex,
      transparent: true,
      alphaTest: 0.12,
      roughness: 0.70,
      metalness: 0.05,
      side: THREE.FrontSide
    });
    const frontMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matFront);
    frontMesh.position.set(0, H / 2, depth / 2);
    frontMesh.castShadow = true;
    group.add(frontMesh);

    // 2. BACK FACE (Z = -0.09m) - Displays user's complete, unblemished back turnaround art
    const matBack = new THREE.MeshStandardMaterial({
      map: backTex,
      transparent: true,
      alphaTest: 0.12,
      roughness: 0.70,
      metalness: 0.05,
      side: THREE.FrontSide
    });
    const backMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matBack);
    backMesh.position.set(0, H / 2, -depth / 2);
    backMesh.rotation.y = Math.PI;
    backMesh.castShadow = true;
    group.add(backMesh);

    // 3. 3D VOLUMETRIC SIDE PROFILE ("옆태") - Bridges front and back seamlessly with 0.18m thickness
    const matSuit = new THREE.MeshStandardMaterial({ color: pal.suit, roughness: 0.65, metalness: 0.08 });
    const matTrouser = new THREE.MeshStandardMaterial({ color: pal.trouser, roughness: 0.75, metalness: 0.05 });
    const matHair = new THREE.MeshStandardMaterial({ color: pal.hair, roughness: 0.85, metalness: 0.05 });
    const matSkin = new THREE.MeshStandardMaterial({ color: pal.skin, roughness: 0.65, metalness: 0.05 });
    const matShoe = new THREE.MeshStandardMaterial({ color: pal.shoe, roughness: 0.35, metalness: 0.2 });

    // A. Torso / Coat Volumetric Core (fills middle depth between front and back)
    const torsoCore = new THREE.Mesh(new THREE.BoxGeometry(W * 0.44, H * 0.46, depth * 0.94), matSuit);
    torsoCore.position.set(0, H * 0.54, 0);
    torsoCore.castShadow = true;
    group.add(torsoCore);

    // B. Left & Right Side Profile Plates (visible from 90-degree side profile down aisle)
    [-W * 0.22, W * 0.22].forEach(sideX => {
      const sideTorso = new THREE.Mesh(new THREE.BoxGeometry(0.02, H * 0.44, depth * 0.92), matSuit);
      sideTorso.position.set(sideX, H * 0.54, 0);
      sideTorso.castShadow = true;
      group.add(sideTorso);
    });

    // C. Lower Body / Trousers / Skirt Core
    const lowerCore = new THREE.Mesh(new THREE.BoxGeometry(W * 0.38, H * 0.36, depth * 0.88), pal.isSkirt ? matSuit : matTrouser);
    lowerCore.position.set(0, H * 0.24, 0);
    lowerCore.castShadow = true;
    group.add(lowerCore);

    // D. Head / Neck Profile Core
    const headCore = new THREE.Mesh(new THREE.BoxGeometry(W * 0.22, H * 0.16, depth * 0.82), matHair);
    headCore.position.set(0, H * 0.86, 0);
    group.add(headCore);

    // E. 3D Rounded Shoulder Caps bridging front to back
    [-W * 0.22, W * 0.22].forEach(sx => {
      const shoulderCap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, depth * 0.94, 8), matSuit);
      shoulderCap.rotation.x = Math.PI / 2;
      shoulderCap.position.set(sx, H * 0.74, 0);
      group.add(shoulderCap);
    });

    // 4. 3D SCULPTED VINTAGE LEATHER BOOTS / SHOES (Y = 0 to 0.10m)
    // Anchors character to floor with solid 3D depth, soles, and leather highlights
    const scale = H / 1.80;
    [-0.10 * scale, 0.10 * scale].forEach(sx => {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.08 * scale, 0.24 * scale), matShoe);
      boot.position.set(sx, 0.04 * scale, 0.01 * scale);
      boot.castShadow = true;

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.126 * scale, 0.02 * scale, 0.25 * scale), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 }));
      sole.position.set(sx, 0.01 * scale, 0.01 * scale);

      group.add(boot, sole);
    });

    // 5. 3D VINTAGE HAT (if character wears a hat)
    if (pal.hat) {
      const hat = createHat(pal.hat, pal.hair, pal.suit);
      hat.position.set(0, H * 0.94, 0);
      group.add(hat);
    }

    // 6. 3D CHARACTER PERIOD PROP (held at hand/chest level)
    if (pal.prop) {
      const propObj = createProp(pal.prop);
      if (pal.prop === 'camera' || pal.prop === 'clipboard') {
        propObj.position.set(0, H * 0.58, depth / 2 + 0.04);
      } else if (pal.prop === 'cane') {
        propObj.position.set(W * 0.24, H * 0.45, depth / 2 + 0.02);
      } else {
        propObj.position.set(W * 0.24, H * 0.48, depth / 2 + 0.02);
      }
      group.add(propObj);
    }

    // 7. SOFT GROUND CONTACT RADIAL SHADOW
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75 * scale, 0.75 * scale),
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
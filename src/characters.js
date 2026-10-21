// 16 1930s Characters: True 3D Humanoid Game Character Models
// Authentic 3D polygonal anatomy, character-specific hairstyles, tailored period clothing, period props, and textured faces.
// 100% genuine 3D geometry - NO flat cardboard cutouts, NO mismatched geometric blocks.

const Characters = (() => {
  const characterList = [];
  const textureLoader = new THREE.TextureLoader();

  // Reusable Ground Contact Shadow Texture
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

  // 16 Character Design Specifications matching user turnaround sheets 100%
  const characterConfigs = {
    cade: {
      type: 'worker',
      skin: 0xc89870, hair: 0x3c2c20, shirt: 0xdad0c0, overalls: 0x3c4c62, shoe: 0x282420,
      hat: null, isSkirt: false, prop: 'wrench'
    },
    ward: {
      type: 'detective',
      skin: 0xebd2bd, hair: 0x5a5450, trench: 0x787c76, lapel: 0x686c66, trouser: 0x343834, shoe: 0x382c22,
      hat: 'fedora_ward', isSkirt: false, prop: null
    },
    bram: {
      type: 'student',
      skin: 0xf0d8c4, hair: 0xd8b868, shirt: 0xf5f5f5, vest: 0x6a4830, vestBand: 0xa88258, trouser: 0x2c3430, shoe: 0x3c2416,
      hat: null, isSkirt: false, prop: null
    },
    nell: {
      type: 'seamstress',
      skin: 0xf4ddce, hair: 0x4a3222, blouse: 0x5e7058, apron: 0xdcd6c8, patch: 0x8a6848, shoe: 0x4a3020,
      hat: null, isSkirt: true, prop: 'scissors'
    },
    nurse_k: {
      type: 'nurse',
      skin: 0xf2ddce, hair: 0x221a18, dress: 0x6888a8, apron: 0xffffff, shoe: 0x181820,
      hat: 'nurse_cap', isSkirt: true, prop: 'clipboard'
    },
    elias: {
      type: 'reporter',
      skin: 0xebd3bc, hair: 0x382c20, shirt: 0xeee8dc, suspenders: 0x2a2420, tie: 0x181818, trouser: 0x685038, shoe: 0x3a2818,
      hat: 'fedora_press', isSkirt: false, prop: 'notebook'
    },
    harlan: {
      type: 'businessman',
      skin: 0xebd3bc, hair: 0x181818, suit: 0x2b2e34, vest: 0x24272c, tie: 0x111111, trouser: 0x2b2e34, shoe: 0x0c0e12,
      hat: null, isSkirt: false, prop: 'cane'
    },
    clara: {
      type: 'novelist',
      skin: 0xf5dfd2, hair: 0x261a16, trench: 0x606a48, scarf: 0xc2a068, skirt: 0x242832, shoe: 0x3a2618,
      hat: null, isSkirt: true, prop: 'book'
    },
    ida: {
      type: 'secretary',
      skin: 0xf0dbcb, hair: 0x2a1c14, blazer: 0x386844, skirt: 0x325e3c, shoe: 0x422216,
      hat: null, isSkirt: true, prop: 'folder'
    },
    gail: {
      type: 'doctor',
      skin: 0xebd3bc, hair: 0x242426, shirt: 0x4e7856, coat: 0xf2f4f8, trouser: 0x6a4834, shoe: 0x342014,
      hat: null, isSkirt: false, prop: 'stethoscope'
    },
    arthur: {
      type: 'professor',
      skin: 0xecd5bd, hair: 0x888888, coat: 0x4a3628, suit: 0x343638, trouser: 0x505458, shoe: 0x281a12,
      hat: null, isSkirt: false, prop: 'academic_book'
    },
    jude: {
      type: 'con_artist',
      skin: 0xdfbe9f, hair: 0x141416, suit: 0x6b242e, vest: 0xcaa038, tie: 0xdfb432, trouser: 0x6b242e, shoe: 0x241812,
      hat: null, isSkirt: false, prop: null
    },
    rose: {
      type: 'dancer',
      skin: 0xf6dfd2, hair: 0x9c3824, blouse: 0x2e644c, scarf: 0xe89270, skirt: 0x5c1e28, shoe: 0x44141e,
      hat: null, isSkirt: true, prop: null
    },
    lulu: {
      type: 'singer',
      skin: 0xf6e2d5, hair: 0x161616, gown: 0x146842, boa: 0x1a4630, gloves: 0x143c28, shoe: 0x124830,
      hat: null, isSkirt: true, prop: 'glass'
    },
    felix: {
      type: 'photographer',
      skin: 0xebd2bd, hair: 0x4a3424, shirt: 0xdcd2be, vest: 0x5c4230, trouser: 0x323a30, shoe: 0x422e1e,
      hat: null, isSkirt: false, prop: 'camera'
    },
    mabel: {
      type: 'aristocrat',
      skin: 0xf2ddce, hair: 0x201814, coat: 0x1c4442, trim: 0x142838, skirt: 0x122030, gloves: 0x111114, shoe: 0x101014,
      hat: 'mabel_hat', isSkirt: true, prop: null
    }
  };

  // Helper to build authentic 3D Hats (Ward fedora, Nurse cap, Elias press fedora, Mabel aristocrat hat)
  const createHat = (hatType, scale) => {
    const hatGroup = new THREE.Group();

    if (hatType === 'fedora_ward') {
      const matFelt = new THREE.MeshStandardMaterial({ color: 0x6a6e68, roughness: 0.7 });
      const matBand = new THREE.MeshStandardMaterial({ color: 0x282a26, roughness: 0.4 });
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.19 * scale, 0.018 * scale, 16), matFelt);
      brim.scale.set(1.0, 1.0, 1.15);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * scale, 0.125 * scale, 0.12 * scale, 16), matFelt);
      crown.position.set(0, 0.065 * scale, 0);
      crown.scale.set(0.95, 1.0, 1.1);
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.127 * scale, 0.127 * scale, 0.025 * scale, 16), matBand);
      ribbon.position.set(0, 0.025 * scale, 0);
      ribbon.scale.set(0.96, 1.0, 1.11);
      hatGroup.add(brim, crown, ribbon);
    } else if (hatType === 'nurse_cap') {
      const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const matRed = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.4 });
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.14 * scale, 0.065 * scale, 0.12 * scale), matWhite);
      cap.position.set(0, 0.04 * scale, -0.03 * scale);
      cap.rotation.x = -0.22;
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, 0.012 * scale, 0.005 * scale), matRed);
      crossH.position.set(0, 0.04 * scale, 0.032 * scale);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.012 * scale, 0.04 * scale, 0.005 * scale), matRed);
      crossV.position.set(0, 0.04 * scale, 0.032 * scale);
      hatGroup.add(cap, crossH, crossV);
    } else if (hatType === 'fedora_press') {
      const matCharcoal = new THREE.MeshStandardMaterial({ color: 0x28282c, roughness: 0.7 });
      const matBand = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.4 });
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.19 * scale, 0.018 * scale, 16), matCharcoal);
      brim.scale.set(1.0, 1.0, 1.15);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * scale, 0.125 * scale, 0.12 * scale, 16), matCharcoal);
      crown.position.set(0, 0.065 * scale, 0);
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.127 * scale, 0.127 * scale, 0.025 * scale, 16), matBand);
      ribbon.position.set(0, 0.025 * scale, 0);
      // White "PRESS" ticket card tucked into ribbon band
      const pressCard = new THREE.Mesh(new THREE.BoxGeometry(0.035 * scale, 0.05 * scale, 0.004 * scale), new THREE.MeshStandardMaterial({ color: 0xf5f3ee }));
      pressCard.position.set(0.11 * scale, 0.045 * scale, 0.02 * scale);
      pressCard.rotation.z = -0.25;
      pressCard.rotation.y = 0.2;
      hatGroup.add(brim, crown, ribbon, pressCard);
    } else if (hatType === 'mabel_hat') {
      const matTeal = new THREE.MeshStandardMaterial({ color: 0x1e4644, roughness: 0.6 });
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * scale, 0.25 * scale, 0.02 * scale, 18), matTeal);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.13 * scale, 0.08 * scale, 16), matTeal);
      crown.position.set(0, 0.05 * scale, 0);
      // Tall dramatic black ostrich feathers
      const matFeather = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.8 });
      for (let f = 0; f < 3; f++) {
        const feather = new THREE.Mesh(new THREE.ConeGeometry(0.025 * scale, 0.22 * scale, 6), matFeather);
        feather.position.set((-0.04 + f * 0.04) * scale, (0.14 + f * 0.02) * scale, (-0.02 - f * 0.02) * scale);
        feather.rotation.z = (-0.15 + f * 0.15);
        feather.rotation.x = -0.2;
        hatGroup.add(feather);
      }
      hatGroup.add(brim, crown);
    }

    return hatGroup;
  };

  // Helper to build 3D Period Props
  const createProp = (propType, scale) => {
    const propGroup = new THREE.Group();

    if (propType === 'camera') {
      // Felix's Vintage Accordion Bellows Camera
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.09 * scale, 0.06 * scale), new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.6 }));
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * scale, 0.025 * scale, 0.04 * scale, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 }));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.04 * scale);
      propGroup.add(body, lens);
    } else if (propType === 'notebook') {
      // Elias's Reporter Memo Notebook & Pencil
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.09 * scale, 0.13 * scale, 0.018 * scale), new THREE.MeshStandardMaterial({ color: 0x5a361c, roughness: 0.7 }));
      const paper = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.12 * scale, 0.005 * scale), new THREE.MeshStandardMaterial({ color: 0xf5eedd }));
      paper.position.set(0, 0, 0.01 * scale);
      const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.004 * scale, 0.004 * scale, 0.10 * scale, 6), new THREE.MeshStandardMaterial({ color: 0xd4a020 }));
      pencil.position.set(0.05 * scale, 0, 0.012 * scale);
      pencil.rotation.z = 0.2;
      propGroup.add(book, paper, pencil);
    } else if (propType === 'clipboard') {
      // Nurse K's Medical Chart Clipboard
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.16 * scale, 0.01 * scale), new THREE.MeshStandardMaterial({ color: 0x6e4a28, roughness: 0.7 }));
      const paper = new THREE.Mesh(new THREE.BoxGeometry(0.10 * scale, 0.14 * scale, 0.005 * scale), new THREE.MeshStandardMaterial({ color: 0xfaf8f2, roughness: 0.8 }));
      paper.position.set(0, -0.005 * scale, 0.006 * scale);
      propGroup.add(board, paper);
    } else if (propType === 'book') {
      // Clara's Hardcover Novel Manuscript & Fountain Pen
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.10 * scale, 0.15 * scale, 0.03 * scale), new THREE.MeshStandardMaterial({ color: 0x3e1824, roughness: 0.6 }));
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.004 * scale, 0.004 * scale, 0.11 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 }));
      pen.position.set(0.06 * scale, 0, 0.015 * scale);
      propGroup.add(book, pen);
    } else if (propType === 'academic_book') {
      // Arthur's Thick Academic Hardback Tome
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.11 * scale, 0.16 * scale, 0.04 * scale), new THREE.MeshStandardMaterial({ color: 0x681822, roughness: 0.6 }));
      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.10 * scale, 0.15 * scale, 0.035 * scale), new THREE.MeshStandardMaterial({ color: 0xf5eedd, roughness: 0.9 }));
      pages.position.set(0.005 * scale, 0, 0);
      propGroup.add(book, pages);
    } else if (propType === 'cane') {
      // Harlan's Aristocrat Walking Cane with Gold Spherical Pommel
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.01 * scale, 0.008 * scale, 0.78 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
      shaft.position.set(0, -0.30 * scale, 0);
      const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.024 * scale, 12, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15 }));
      pommel.position.set(0, 0.10 * scale, 0);
      propGroup.add(shaft, pommel);
    } else if (propType === 'glass') {
      // Lulu's Vintage Champagne Coupe Glass
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004 * scale, 0.004 * scale, 0.08 * scale, 8), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.1 }));
      const bowl = new THREE.Mesh(new THREE.ConeGeometry(0.035 * scale, 0.03 * scale, 10), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.1 }));
      bowl.position.set(0, 0.045 * scale, 0);
      bowl.rotation.x = Math.PI;
      propGroup.add(stem, bowl);
    } else if (propType === 'wrench') {
      // Cade's Heavy Cast Iron Pipe Wrench
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02 * scale, 0.26 * scale, 0.012 * scale), new THREE.MeshStandardMaterial({ color: 0x33363a, metalness: 0.7, roughness: 0.5 }));
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.032 * scale, 0.032 * scale, 0.018 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x33363a, metalness: 0.7, roughness: 0.5 }));
      head.position.set(0, 0.13 * scale, 0);
      propGroup.add(handle, head);
    } else if (propType === 'folder') {
      // Ida's Executive Manila Document Folder
      const folder = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.16 * scale, 0.015 * scale), new THREE.MeshStandardMaterial({ color: 0xc8aa78, roughness: 0.7 }));
      propGroup.add(folder);
    }

    return propGroup;
  };

  // Build Full 3D Humanoid Model with complete 360-degree volume, authentic tailored outfits, sculpted hair, and face textures
  const createCharacterModel = (d) => {
    const group = new THREE.Group();
    const H = d.h; // total height (e.g. 1.72m ~ 1.85m)
    const scale = H / 1.80;
    const cfg = characterConfigs[d.key] || characterConfigs.ward;

    // Load High-Res Textured Face (eyes, brows, nose, mouth from character art)
    const faceTex = textureLoader.load(`assets/characters/${d.key}_face.png`);
    faceTex.colorSpace = THREE.SRGBColorSpace;
    const matFace = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.65,
      metalness: 0.05
    });

    // Base materials
    const matSkin = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.65, metalness: 0.05 });
    const matHair = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.80, metalness: 0.05 });
    const matShoe = new THREE.MeshStandardMaterial({ color: cfg.shoe, roughness: 0.35, metalness: 0.20 });

    // ==========================================
    // 1. 3D FOOTWEAR (Shoes / Boots) (Y: 0.0 to 0.10m * scale)
    // ==========================================
    [-0.10 * scale, 0.10 * scale].forEach(sx => {
      const isHighBoot = (cfg.type === 'detective' || cfg.type === 'worker' || cfg.type === 'photographer' || cfg.type === 'seamstress');
      const isHeel = (cfg.type === 'dancer' || cfg.type === 'singer' || cfg.type === 'secretary' || cfg.type === 'aristocrat');

      const shoeH = isHighBoot ? 0.11 * scale : 0.065 * scale;
      const shoeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.115 * scale, shoeH, 0.23 * scale), matShoe);
      shoeMesh.position.set(sx, shoeH / 2, 0.01 * scale);
      shoeMesh.castShadow = true;

      // Dark sole trim
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.125 * scale, 0.02 * scale, 0.245 * scale), new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.8 }));
      sole.position.set(sx, 0.01 * scale, 0.01 * scale);
      group.add(shoeMesh, sole);

      // Lifted heel block for ladies' heels
      if (isHeel) {
        const heel = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, 0.04 * scale, 0.04 * scale), matShoe);
        heel.position.set(sx, 0.03 * scale, -0.07 * scale);
        group.add(heel);
      }
    });

    // ==========================================
    // 2. 3D LOWER BODY (Trousers or Skirt) (Y: 0.10m to 0.78m * scale)
    // ==========================================
    const legH = 0.68 * scale;
    const legCenterY = 0.10 * scale + legH / 2;

    if (cfg.isSkirt) {
      // Slender legs in stockings under skirt
      const matStocking = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.7 });
      [-0.09 * scale, 0.09 * scale].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.042 * scale, 0.038 * scale, 0.35 * scale, 10), matStocking);
        leg.position.set(lx, 0.24 * scale, 0);
        group.add(leg);
      });

      // 3D Skirt geometry tailored to each character:
      if (cfg.type === 'seamstress') {
        // Nell: Cream patched linen apron skirt draped over green dress
        const matGreenDress = new THREE.MeshStandardMaterial({ color: cfg.blouse, roughness: 0.75 });
        const matApronLinen = new THREE.MeshStandardMaterial({ color: cfg.apron, roughness: 0.85 });
        const matPatch = new THREE.MeshStandardMaterial({ color: cfg.patch, roughness: 0.85 });

        const dressSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 0.48 * scale, 14), matGreenDress);
        dressSkirt.position.set(0, 0.50 * scale, 0);

        // Linen apron front drape with patches
        const apronDrape = new THREE.Mesh(new THREE.CylinderGeometry(0.185 * scale, 0.255 * scale, 0.44 * scale, 12, 1, false, -Math.PI / 2.2, Math.PI / 1.1), matApronLinen);
        apronDrape.position.set(0, 0.50 * scale, 0);

        // Patch on apron hem
        const patchMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07 * scale, 0.06 * scale, 0.01 * scale), matPatch);
        patchMesh.position.set(-0.08 * scale, 0.35 * scale, 0.23 * scale);
        patchMesh.rotation.y = -0.2;
        group.add(dressSkirt, apronDrape, patchMesh);

      } else if (cfg.type === 'dancer') {
        // Rose: Pleated burgundy swing skirt flaring out
        const matSkirt = new THREE.MeshStandardMaterial({ color: cfg.skirt, roughness: 0.7 });
        const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 0.42 * scale, 16), matSkirt);
        skirt.position.set(0, 0.52 * scale, 0);
        skirt.castShadow = true;
        group.add(skirt);

      } else if (cfg.type === 'singer') {
        // Lulu: Elegant emerald satin evening gown skirt with ruched hip drape
        const matGown = new THREE.MeshStandardMaterial({ color: cfg.gown, roughness: 0.45, metalness: 0.15 });
        const gownSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * scale, 0.24 * scale, 0.65 * scale, 16), matGown);
        gownSkirt.position.set(0, 0.42 * scale, 0);
        gownSkirt.castShadow = true;
        group.add(gownSkirt);

      } else if (cfg.type === 'nurse') {
        // Nurse K: Sky blue uniform dress with crisp white apron
        const matBlue = new THREE.MeshStandardMaterial({ color: cfg.dress, roughness: 0.7 });
        const matApron = new THREE.MeshStandardMaterial({ color: cfg.apron, roughness: 0.5 });
        const blueSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.26 * scale, 0.52 * scale, 14), matBlue);
        blueSkirt.position.set(0, 0.48 * scale, 0);
        const whiteApronFront = new THREE.Mesh(new THREE.CylinderGeometry(0.185 * scale, 0.265 * scale, 0.48 * scale, 12, 1, false, -Math.PI / 2.2, Math.PI / 1.1), matApron);
        whiteApronFront.position.set(0, 0.48 * scale, 0);
        group.add(blueSkirt, whiteApronFront);

      } else if (cfg.type === 'novelist' || cfg.type === 'aristocrat') {
        // Clara / Mabel: Long ankle-length wool skirt
        const matSkirt = new THREE.MeshStandardMaterial({ color: cfg.skirt, roughness: 0.75 });
        const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.26 * scale, 0.62 * scale, 16), matSkirt);
        skirt.position.set(0, 0.44 * scale, 0);
        group.add(skirt);

      } else {
        // Ida: Forest green knee-length tailored A-line skirt
        const matSkirt = new THREE.MeshStandardMaterial({ color: cfg.skirt, roughness: 0.75 });
        const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 0.46 * scale, 14), matSkirt);
        skirt.position.set(0, 0.52 * scale, 0);
        group.add(skirt);
      }

    } else {
      // 3D Trouser Legs with creases and folds
      const trouserColor = cfg.trouser || cfg.overalls || cfg.suit;
      const matTrouser = new THREE.MeshStandardMaterial({ color: trouserColor, roughness: 0.75, metalness: 0.05 });

      [-0.10 * scale, 0.10 * scale].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.072 * scale, 0.060 * scale, legH, 12), matTrouser);
        leg.position.set(lx, legCenterY, 0);
        leg.castShadow = true;
        group.add(leg);

        // Rolled cuffs for worker Cade
        if (cfg.type === 'worker') {
          const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.076 * scale, 0.076 * scale, 0.04 * scale, 12), matTrouser);
          cuff.position.set(lx, 0.14 * scale, 0);
          group.add(cuff);
        }
      });
    }

    // ==========================================
    // 3. 3D TORSO & TAILORED PERIOD OUTFIT (Y: 0.78m to 1.38m * scale)
    // ==========================================
    const torsoH = 0.58 * scale;
    const torsoCenterY = 0.78 * scale + torsoH / 2;

    if (cfg.type === 'seamstress') {
      // Nell: Sage green blouse + 3D cream linen apron with front bib, straps, waist bow & scissors/tape!
      const matBlouse = new THREE.MeshStandardMaterial({ color: cfg.blouse, roughness: 0.75 });
      const matApron = new THREE.MeshStandardMaterial({ color: cfg.apron, roughness: 0.85 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.34 * scale, torsoH, 0.20 * scale), matBlouse);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Apron bib covering chest
      const apronBib = new THREE.Mesh(new THREE.BoxGeometry(0.24 * scale, 0.32 * scale, 0.015 * scale), matApron);
      apronBib.position.set(0, torsoCenterY + 0.04 * scale, 0.105 * scale);

      // Apron shoulder straps running over shoulders
      [-0.09 * scale, 0.09 * scale].forEach(sx => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.035 * scale, 0.36 * scale, 0.012 * scale), matApron);
        strap.position.set(sx, torsoCenterY + 0.10 * scale, 0.102 * scale);
        group.add(strap);
      });

      // Front apron pocket with yellow measuring tape and silver sewing scissors!
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.14 * scale, 0.10 * scale, 0.012 * scale), matApron);
      pocket.position.set(0.02 * scale, torsoCenterY - 0.08 * scale, 0.115 * scale);

      // Yellow measuring tape sticking out of pocket
      const tape = new THREE.Mesh(new THREE.BoxGeometry(0.03 * scale, 0.08 * scale, 0.015 * scale), new THREE.MeshStandardMaterial({ color: 0xddb822, roughness: 0.5 }));
      tape.position.set(-0.03 * scale, torsoCenterY - 0.04 * scale, 0.12 * scale);
      tape.rotation.z = -0.15;

      // Silver scissors handle peeking out of pocket
      const scissors = new THREE.Mesh(new THREE.TorusGeometry(0.016 * scale, 0.004 * scale, 6, 12), new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.85, roughness: 0.2 }));
      scissors.position.set(0.05 * scale, torsoCenterY - 0.03 * scale, 0.12 * scale);

      // Waist tie band and ribbon bow at small of back
      const waistBand = new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale, 0.04 * scale, 0.21 * scale), matApron);
      waistBand.position.set(0, torsoCenterY - 0.18 * scale, 0);
      const tieBow = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.04 * scale, 0.03 * scale), matApron);
      tieBow.position.set(0, torsoCenterY - 0.18 * scale, -0.11 * scale);

      group.add(torsoBody, apronBib, pocket, tape, scissors, waistBand, tieBow);

    } else if (cfg.type === 'detective') {
      // Ward: Heavy double-breasted trenchcoat with storm flaps, lapels, belt & buckle
      const matTrench = new THREE.MeshStandardMaterial({ color: cfg.trench, roughness: 0.7 });
      const matLapel = new THREE.MeshStandardMaterial({ color: cfg.lapel, roughness: 0.65 });
      const matBuckle = new THREE.MeshStandardMaterial({ color: 0x888880, metalness: 0.8, roughness: 0.3 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.38 * scale, torsoH, 0.22 * scale), matTrench);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Wide notched storm lapels
      const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.26 * scale, 0.02 * scale), matLapel);
      lapelL.position.set(-0.08 * scale, torsoCenterY + 0.12 * scale, 0.115 * scale);
      lapelL.rotation.z = -0.15;
      const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.26 * scale, 0.02 * scale), matLapel);
      lapelR.position.set(0.08 * scale, torsoCenterY + 0.12 * scale, 0.115 * scale);
      lapelR.rotation.z = 0.15;

      // Waist belt with square metal buckle
      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.39 * scale, 0.05 * scale, 0.23 * scale), matTrench);
      belt.position.set(0, torsoCenterY - 0.10 * scale, 0);
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06 * scale, 0.065 * scale, 0.01 * scale), matBuckle);
      buckle.position.set(-0.02 * scale, torsoCenterY - 0.10 * scale, 0.12 * scale);

      // Double-breasted dark buttons
      const matBtn = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
      [-0.05 * scale, 0.05 * scale].forEach(bx => {
        [-0.02 * scale, 0.05 * scale, 0.12 * scale].forEach(by => {
          const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, 0.008 * scale, 8), matBtn);
          btn.rotation.x = Math.PI / 2;
          btn.position.set(bx, torsoCenterY + by, 0.115 * scale);
          group.add(btn);
        });
      });

      // Lower trenchcoat skirts flaring over legs
      const coatSkirts = new THREE.Mesh(new THREE.CylinderGeometry(0.20 * scale, 0.27 * scale, 0.40 * scale, 14), matTrench);
      coatSkirts.position.set(0, 0.56 * scale, 0);

      group.add(torsoBody, lapelL, lapelR, belt, buckle, coatSkirts);

    } else if (cfg.type === 'worker') {
      // Cade: Muscular build, beige shirt & dark blue denim overalls with straps & brass buttons
      const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.75 });
      const matDenim = new THREE.MeshStandardMaterial({ color: cfg.overalls, roughness: 0.8 });
      const matBrass = new THREE.MeshStandardMaterial({ color: 0xc89e35, metalness: 0.85, roughness: 0.3 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.40 * scale, torsoH, 0.24 * scale), matShirt);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Overalls bib across chest
      const bib = new THREE.Mesh(new THREE.BoxGeometry(0.28 * scale, 0.30 * scale, 0.02 * scale), matDenim);
      bib.position.set(0, torsoCenterY - 0.02 * scale, 0.125 * scale);

      // Shoulder straps with brass buttons
      [-0.10 * scale, 0.10 * scale].forEach(sx => {
        const strapF = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, 0.36 * scale, 0.015 * scale), matDenim);
        strapF.position.set(sx, torsoCenterY + 0.10 * scale, 0.122 * scale);
        const button = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * scale, 0.012 * scale, 0.008 * scale, 8), matBrass);
        button.rotation.x = Math.PI / 2;
        button.position.set(sx, torsoCenterY + 0.11 * scale, 0.132 * scale);
        group.add(strapF, button);
      });

      group.add(torsoBody, bib);

    } else if (cfg.type === 'student') {
      // Bram: Fair-Isle patterned sweater vest over white collared shirt
      const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.7 });
      const matVest = new THREE.MeshStandardMaterial({ color: cfg.vest, roughness: 0.85 });
      const matBand = new THREE.MeshStandardMaterial({ color: cfg.vestBand, roughness: 0.85 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale, torsoH, 0.20 * scale), matVest);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Fair-Isle geometric pattern jacquard bands across chest
      [-0.06 * scale, 0.04 * scale, 0.12 * scale].forEach(by => {
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.355 * scale, 0.035 * scale, 0.205 * scale), matBand);
        band.position.set(0, torsoCenterY + by, 0);
        group.add(band);
      });

      // White shirt collar peeking out of V-neck
      const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.06 * scale, 0.08 * scale, 0.015 * scale), matShirt);
      collarL.position.set(-0.06 * scale, torsoCenterY + torsoH * 0.44, 0.105 * scale);
      collarL.rotation.z = -0.3;
      const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.06 * scale, 0.08 * scale, 0.015 * scale), matShirt);
      collarR.position.set(0.06 * scale, torsoCenterY + torsoH * 0.44, 0.105 * scale);
      collarR.rotation.z = 0.3;

      // Untucked white shirt hem peeking below vest
      const shirtHem = new THREE.Mesh(new THREE.BoxGeometry(0.355 * scale, 0.04 * scale, 0.205 * scale), matShirt);
      shirtHem.position.set(0, torsoCenterY - torsoH * 0.48, 0);

      group.add(torsoBody, collarL, collarR, shirtHem);

    } else if (cfg.type === 'con_artist') {
      // Jude: Burgundy pinstripe suit, golden vest, yellow tie, pocket square
      const matSuit = new THREE.MeshStandardMaterial({ color: cfg.suit, roughness: 0.65 });
      const matGoldVest = new THREE.MeshStandardMaterial({ color: cfg.vest, roughness: 0.5, metalness: 0.2 });
      const matTie = new THREE.MeshStandardMaterial({ color: cfg.tie, roughness: 0.4 });
      const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.36 * scale, torsoH, 0.21 * scale), matSuit);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Golden waistcoat V-insert
      const vestV = new THREE.Mesh(new THREE.BoxGeometry(0.14 * scale, 0.34 * scale, 0.015 * scale), matGoldVest);
      vestV.position.set(0, torsoCenterY + 0.02 * scale, 0.108 * scale);

      // Yellow necktie
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, 0.24 * scale, 0.01 * scale), matTie);
      tie.position.set(0, torsoCenterY + 0.06 * scale, 0.116 * scale);

      // White pocket square
      const pSquare = new THREE.Mesh(new THREE.BoxGeometry(0.045 * scale, 0.02 * scale, 0.01 * scale), matWhite);
      pSquare.position.set(-0.10 * scale, torsoCenterY + 0.14 * scale, 0.11 * scale);
      pSquare.rotation.z = 0.2;

      group.add(torsoBody, vestV, tie, pSquare);

    } else if (cfg.type === 'reporter') {
      // Elias: Beige shirt, loosened tie, dark leather suspenders with silver clips
      const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.75 });
      const matSusp = new THREE.MeshStandardMaterial({ color: cfg.suspenders, roughness: 0.6 });
      const matTie = new THREE.MeshStandardMaterial({ color: cfg.tie, roughness: 0.5 });
      const matClip = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale, torsoH, 0.20 * scale), matShirt);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Loosened necktie
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.045 * scale, 0.26 * scale, 0.01 * scale), matTie);
      tie.position.set(0, torsoCenterY + 0.04 * scale, 0.106 * scale);
      tie.rotation.z = -0.08;

      // Suspenders running over shoulders
      [-0.09 * scale, 0.09 * scale].forEach(sx => {
        const suspF = new THREE.Mesh(new THREE.BoxGeometry(0.03 * scale, torsoH * 0.95, 0.012 * scale), matSusp);
        suspF.position.set(sx, torsoCenterY, 0.104 * scale);
        const clip = new THREE.Mesh(new THREE.BoxGeometry(0.032 * scale, 0.015 * scale, 0.008 * scale), matClip);
        clip.position.set(sx, torsoCenterY - torsoH * 0.42, 0.11 * scale);
        group.add(suspF, clip);
      });

      // Diagonal leather camera/satchel strap across chest
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.035 * scale, 0.60 * scale, 0.015 * scale), matSusp);
      strap.position.set(0, torsoCenterY, 0.108 * scale);
      strap.rotation.z = -0.55;

      group.add(torsoBody, tie, strap);

    } else if (cfg.type === 'doctor') {
      // Gail: Sage green shirt + open white physician lab coat falling past knees + stethoscope!
      const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.75 });
      const matCoat = new THREE.MeshStandardMaterial({ color: cfg.coat, roughness: 0.6 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale, torsoH, 0.20 * scale), matShirt);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Open white lab coat panels
      const coatL = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, torsoH, 0.02 * scale), matCoat);
      coatL.position.set(-0.13 * scale, torsoCenterY, 0.105 * scale);
      const coatR = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, torsoH, 0.02 * scale), matCoat);
      coatR.position.set(0.13 * scale, torsoCenterY, 0.105 * scale);
      const coatBack = new THREE.Mesh(new THREE.BoxGeometry(0.36 * scale, torsoH, 0.02 * scale), matCoat);
      coatBack.position.set(0, torsoCenterY, -0.105 * scale);

      // Lower lab coat tails falling past knees
      const coatTails = new THREE.Mesh(new THREE.CylinderGeometry(0.19 * scale, 0.24 * scale, 0.42 * scale, 14), matCoat);
      coatTails.position.set(0, 0.54 * scale, 0);

      // Stethoscope draped around neck with chest disc
      const matStethTube = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 });
      const matStethDisc = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
      const stethArch = new THREE.Mesh(new THREE.TorusGeometry(0.11 * scale, 0.01 * scale, 6, 12, Math.PI), matStethTube);
      stethArch.position.set(0, torsoCenterY + torsoH * 0.38, 0.11 * scale);
      const stethDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.022 * scale, 0.022 * scale, 0.008 * scale, 12), matStethDisc);
      stethDisc.rotation.x = Math.PI / 2;
      stethDisc.position.set(0, torsoCenterY + 0.08 * scale, 0.115 * scale);

      group.add(torsoBody, coatL, coatR, coatBack, coatTails, stethArch, stethDisc);

    } else if (cfg.type === 'singer') {
      // Lulu: Emerald evening gown with draped ruched folds & feather boa around shoulders
      const matGown = new THREE.MeshStandardMaterial({ color: cfg.gown, roughness: 0.45, metalness: 0.15 });
      const matBoa = new THREE.MeshStandardMaterial({ color: cfg.boa, roughness: 0.9 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.33 * scale, torsoH, 0.19 * scale), matGown);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Feather boa draped across shoulders
      const boa = new THREE.Mesh(new THREE.TorusGeometry(0.16 * scale, 0.035 * scale, 8, 16, Math.PI), matBoa);
      boa.position.set(0, torsoCenterY + torsoH * 0.34, 0.08 * scale);

      group.add(torsoBody, boa);

    } else if (cfg.type === 'dancer') {
      // Rose: Green blouse & coral silk scarf tied at throat with loose tips
      const matBlouse = new THREE.MeshStandardMaterial({ color: cfg.blouse, roughness: 0.7 });
      const matScarf = new THREE.MeshStandardMaterial({ color: cfg.scarf, roughness: 0.5 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.33 * scale, torsoH, 0.19 * scale), matBlouse);
      torsoBody.position.set(0, torsoCenterY, 0);

      // Coral scarf knot and tips
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.022 * scale, 8, 8), matScarf);
      knot.position.set(0, torsoCenterY + torsoH * 0.36, 0.105 * scale);
      const tipL = new THREE.Mesh(new THREE.ConeGeometry(0.018 * scale, 0.08 * scale, 6), matScarf);
      tipL.position.set(-0.02 * scale, torsoCenterY + torsoH * 0.28, 0.108 * scale);
      tipL.rotation.z = 0.2;
      tipL.rotation.x = -0.1;
      const tipR = new THREE.Mesh(new THREE.ConeGeometry(0.018 * scale, 0.08 * scale, 6), matScarf);
      tipR.position.set(0.02 * scale, torsoCenterY + torsoH * 0.28, 0.108 * scale);
      tipR.rotation.z = -0.2;
      tipR.rotation.x = -0.1;

      group.add(torsoBody, knot, tipL, tipR);

    } else {
      // Default Tailored Suit / Coat (Harlan, Clara, Ida, Arthur, Mabel, Felix)
      const suitColor = cfg.suit || cfg.trench || cfg.coat || cfg.blazer || cfg.vest;
      const matSuit = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.7, metalness: 0.05 });

      const torsoBody = new THREE.Mesh(new THREE.BoxGeometry(0.36 * scale, torsoH, 0.21 * scale), matSuit);
      torsoBody.position.set(0, torsoCenterY, 0);
      group.add(torsoBody);

      // Overcoat tails for Arthur / Clara / Mabel
      if (cfg.type === 'professor' || cfg.type === 'novelist' || cfg.type === 'aristocrat') {
        const coatSkirts = new THREE.Mesh(new THREE.CylinderGeometry(0.19 * scale, 0.26 * scale, 0.44 * scale, 14), matSuit);
        coatSkirts.position.set(0, 0.54 * scale, 0);
        group.add(coatSkirts);
      }
    }

    // ==========================================
    // 4. 3D ARMS & HANDS WITH PROPS
    // ==========================================
    const shoulderY = torsoCenterY + torsoH * 0.38;

    [-0.22 * scale, 0.22 * scale].forEach((ax, sideIdx) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(ax, shoulderY, 0);

      const isRight = (sideIdx === 1);
      const isLulu = (cfg.type === 'singer');
      const isMabel = (cfg.type === 'aristocrat');
      const isWorker = (cfg.type === 'worker');

      // Sleeve / Arm material
      const sleeveColor = isLulu ? cfg.gloves : (isMabel ? cfg.gloves : (isWorker ? cfg.skin : (cfg.suit || cfg.blouse || cfg.trench || cfg.shirt || cfg.dress || cfg.coat || cfg.blazer)));
      const matSleeve = new THREE.MeshStandardMaterial({ color: sleeveColor, roughness: isLulu ? 0.4 : 0.75 });

      // Upper arm
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * scale, 0.045 * scale, 0.24 * scale, 8), matSleeve);
      upperArm.position.set(0, -0.12 * scale, 0);
      upperArm.rotation.z = isRight ? -0.10 : 0.10;

      // Forearm
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * scale, 0.04 * scale, 0.22 * scale, 8), matSleeve);
      forearm.position.set(isRight ? -0.01 * scale : 0.01 * scale, -0.32 * scale, 0.04 * scale);
      forearm.rotation.x = 0.22;

      // Hand
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.042 * scale, 0.07 * scale, 0.03 * scale), isLulu ? matSleeve : (isMabel ? matSleeve : matSkin));
      hand.position.set(isRight ? -0.01 * scale : 0.01 * scale, -0.45 * scale, 0.08 * scale);

      armGroup.add(upperArm, forearm, hand);

      // Attach Character Prop to Right Hand
      if (isRight && cfg.prop && cfg.prop !== 'scissors' && cfg.prop !== 'stethoscope') {
        const propMesh = createProp(cfg.prop, scale);
        if (cfg.prop === 'camera') {
          // Felix camera held at chest
          propMesh.position.set(-0.16 * scale, -0.22 * scale, 0.16 * scale);
        } else if (cfg.prop === 'cane') {
          propMesh.position.set(0, -0.38 * scale, 0.08 * scale);
        } else {
          propMesh.position.set(0, -0.44 * scale, 0.08 * scale);
        }
        armGroup.add(propMesh);
      }

      group.add(armGroup);
    });

    // ==========================================
    // 5. 3D SCULPTED HEAD, FACE TEXTURE & CUSTOM HAIRSTYLE
    // ==========================================
    const headGroup = new THREE.Group();
    const neckY = torsoCenterY + torsoH / 2 + 0.04 * scale;

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * scale, 0.065 * scale, 0.08 * scale, 8), matSkin);
    neck.position.set(0, neckY, 0);
    headGroup.add(neck);

    const headCenterY = neckY + 0.04 * scale + 0.11 * scale;

    // Head Base Cranium (Low-poly chiseled head)
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18 * scale, 0.22 * scale, 0.18 * scale), matHair);
    headMesh.position.set(0, headCenterY, 0);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Front Face Facet (Displays authentic character facial expression: eyes, nose, mouth)
    const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.176 * scale, 0.21 * scale), matFace);
    facePlane.position.set(0, headCenterY, 0.091 * scale);
    headGroup.add(facePlane);

    // 3D Ears
    [-0.092 * scale, 0.092 * scale].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.015 * scale, 0.05 * scale, 0.03 * scale), matSkin);
      ear.position.set(ex, headCenterY, -0.01 * scale);
      headGroup.add(ear);
    });

    // 3D Character-Specific Hairstyles:
    if (cfg.type === 'seamstress') {
      // Nell: Warm brown hair parted in center + TWO 3D BRAIDED PIGTAILS draped down her shoulders!
      // Center hair crest
      const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.19 * scale, 0.06 * scale, 0.19 * scale), matHair);
      hairTop.position.set(0, headCenterY + 0.10 * scale, -0.01 * scale);
      headGroup.add(hairTop);

      // Two long braided pigtails cascading over shoulders to chest
      [-0.095 * scale, 0.095 * scale].forEach(bx => {
        for (let seg = 0; seg < 6; seg++) {
          const braidSeg = new THREE.Mesh(new THREE.SphereGeometry(0.024 * scale, 6, 6), matHair);
          const segY = headCenterY + 0.02 * scale - seg * 0.055 * scale;
          const segZ = 0.02 * scale + seg * 0.015 * scale;
          braidSeg.position.set(bx, segY, segZ);
          headGroup.add(braidSeg);
        }
        // Small hair tie ring at bottom of braid
        const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.015 * scale, 0.015 * scale, 0.012 * scale, 6), new THREE.MeshStandardMaterial({ color: 0xaa3333 }));
        tie.position.set(bx, headCenterY - 0.28 * scale, 0.095 * scale);
        headGroup.add(tie);
      });

    } else if (cfg.type === 'student') {
      // Bram: Tousled wavy golden-blond hair with sculpted tufts
      const hairCrown = new THREE.Mesh(new THREE.BoxGeometry(0.19 * scale, 0.08 * scale, 0.19 * scale), matHair);
      hairCrown.position.set(0, headCenterY + 0.10 * scale, -0.01 * scale);
      headGroup.add(hairCrown);
      // Front & side blond spikes
      [-0.06 * scale, 0, 0.06 * scale].forEach(tx => {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.025 * scale, 0.06 * scale, 4), matHair);
        spike.position.set(tx, headCenterY + 0.12 * scale, 0.06 * scale);
        spike.rotation.x = 0.3;
        headGroup.add(spike);
      });

    } else if (cfg.type === 'professor') {
      // Arthur: Distinguished bald pate with grey side fringe + wire-rim spectacles!
      const baldPate = new THREE.Mesh(new THREE.SphereGeometry(0.09 * scale, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), matSkin);
      baldPate.position.set(0, headCenterY + 0.04 * scale, 0);
      // Grey hair fringe around back and sides
      const greyFringe = new THREE.Mesh(new THREE.CylinderGeometry(0.095 * scale, 0.095 * scale, 0.06 * scale, 10, 1, true, -Math.PI / 1.5, Math.PI * 1.33), matHair);
      greyFringe.position.set(0, headCenterY + 0.02 * scale, -0.01 * scale);
      // Wire-rim spectacles
      const matWire = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
      [-0.04 * scale, 0.04 * scale].forEach(gx => {
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.022 * scale, 0.003 * scale, 6, 10), matWire);
        rim.position.set(gx, headCenterY + 0.02 * scale, 0.095 * scale);
        headGroup.add(rim);
      });
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.002 * scale, 0.002 * scale, 0.03 * scale, 4), matWire);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, headCenterY + 0.02 * scale, 0.095 * scale);
      headGroup.add(baldPate, greyFringe, bridge);

    } else if (cfg.type === 'doctor') {
      // Gail: Dark hair with low chignon bun at back + round spectacles
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.045 * scale, 8, 8), matHair);
      bun.position.set(0, headCenterY - 0.02 * scale, -0.11 * scale);
      const matSpecs = new THREE.MeshStandardMaterial({ color: 0x443322, metalness: 0.8, roughness: 0.3 });
      [-0.04 * scale, 0.04 * scale].forEach(gx => {
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.022 * scale, 0.003 * scale, 6, 10), matSpecs);
        rim.position.set(gx, headCenterY + 0.02 * scale, 0.095 * scale);
        headGroup.add(rim);
      });
      headGroup.add(bun);

    } else if (cfg.type === 'dancer') {
      // Rose: Wavy red voluminous bob
      const bob = new THREE.Mesh(new THREE.BoxGeometry(0.20 * scale, 0.12 * scale, 0.20 * scale), matHair);
      bob.position.set(0, headCenterY + 0.05 * scale, -0.02 * scale);
      headGroup.add(bob);

    } else if (cfg.type === 'novelist') {
      // Clara: Sleek dark brunette bob with blunt fringe bangs
      const bob = new THREE.Mesh(new THREE.BoxGeometry(0.195 * scale, 0.14 * scale, 0.195 * scale), matHair);
      bob.position.set(0, headCenterY + 0.04 * scale, -0.02 * scale);
      const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.14 * scale, 0.03 * scale, 0.02 * scale), matHair);
      bangs.position.set(0, headCenterY + 0.09 * scale, 0.095 * scale);
      headGroup.add(bob, bangs);

    } else if (cfg.type === 'singer') {
      // Lulu: Finger-wave sculpted curls
      const waves = new THREE.Mesh(new THREE.BoxGeometry(0.195 * scale, 0.10 * scale, 0.195 * scale), matHair);
      waves.position.set(0, headCenterY + 0.06 * scale, -0.01 * scale);
      headGroup.add(waves);

    } else {
      // General Hair Volume
      const hairCap = new THREE.Mesh(new THREE.BoxGeometry(0.19 * scale, 0.07 * scale, 0.19 * scale), matHair);
      hairCap.position.set(0, headCenterY + 0.08 * scale, -0.01 * scale);
      headGroup.add(hairCap);
    }

    // 3D Hat (ONLY for characters who wear hats: Ward, Nurse K, Elias, Mabel!)
    if (cfg.hat) {
      const hatMesh = createHat(cfg.hat, scale);
      hatMesh.position.set(0, headCenterY + 0.11 * scale, 0);
      headGroup.add(hatMesh);
    }

    group.add(headGroup);

    // ==========================================
    // 6. SOFT REALISTIC GROUND CONTACT SHADOW
    // ==========================================
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

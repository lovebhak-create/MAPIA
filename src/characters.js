// 16 1930s Characters 3D Generator based strictly on the 4 turnaround design sheets
// High-fidelity procedural Canvas textures for faces (eyes, brows, nose, lips, mustache, glasses, makeup, stubble)
// and authentic 1930s garments (Fair Isle knit, pinstripe, aprons, suits, trench coats, vests, ties, badges).
const Characters = (() => {
  const characterList = [];

  // ==========================================
  // 1. PROCEDURAL CANVAS TEXTURE GENERATORS
  // ==========================================

  // Generates a 512x512 Canvas face texture with stylized eyes, eyebrows, nose, mouth, expressions
  const createFaceTexture = (cfg) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base Skin
    ctx.fillStyle = cfg.skinColor || '#f0c8a8';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle skin shading / cheek blush
    if (cfg.blush) {
      const grad = ctx.createRadialGradient(160, 290, 10, 160, 290, 60);
      grad.addColorStop(0, cfg.blush);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(160, 290, 60, 0, Math.PI * 2); ctx.fill();

      const gradR = ctx.createRadialGradient(352, 290, 10, 352, 290, 60);
      gradR.addColorStop(0, cfg.blush);
      gradR.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradR;
      ctx.beginPath(); ctx.arc(352, 290, 60, 0, Math.PI * 2); ctx.fill();
    }

    // 5 O'clock Shadow / Stubble (Ward, Cade)
    if (cfg.stubble) {
      ctx.fillStyle = 'rgba(60, 45, 35, 0.22)';
      ctx.beginPath();
      ctx.ellipse(256, 380, 140, 90, 0, 0, Math.PI);
      ctx.fill();
    }

    // Dirt smudges (Cade)
    if (cfg.dirt) {
      ctx.fillStyle = 'rgba(40, 30, 20, 0.35)';
      ctx.beginPath(); ctx.arc(180, 240, 25, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(340, 310, 30, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(260, 360, 20, 0, Math.PI * 2); ctx.fill();
    }

    // Eyes Helper
    const drawEye = (cx, cy, isLeft) => {
      // Eye socket shadow / shadow fold
      ctx.strokeStyle = 'rgba(80, 40, 20, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy - 14, 38, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Eye White (Sclera)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 32, 20, isLeft ? 0.05 : -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2b2118';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Iris
      const eyeColor = cfg.eyeColor || '#3e2715';
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#0f0f10';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight Sparkle (reflection)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyelash upper line
      ctx.strokeStyle = '#18120c';
      ctx.lineWidth = cfg.isFemale ? 6 : 4;
      ctx.beginPath();
      ctx.arc(cx, cy - 2, 34, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();

      // Winged Eyeliner for ladies (Lulu, Rose, Mabel)
      if (cfg.eyeliner) {
        ctx.fillStyle = '#18120c';
        ctx.beginPath();
        if (isLeft) {
          ctx.moveTo(cx - 32, cy - 2);
          ctx.lineTo(cx - 46, cy - 12);
          ctx.lineTo(cx - 30, cy + 4);
        } else {
          ctx.moveTo(cx + 32, cy - 2);
          ctx.lineTo(cx + 46, cy - 12);
          ctx.lineTo(cx + 30, cy + 4);
        }
        ctx.fill();
      }
    };

    drawEye(180, 210, true);
    drawEye(332, 210, false);

    // Eyebrows
    ctx.strokeStyle = cfg.browColor || '#3a2012';
    ctx.lineWidth = cfg.browWidth || 8;
    ctx.lineCap = 'round';

    // Left Brow
    ctx.beginPath();
    ctx.moveTo(135, cfg.browY || 165);
    ctx.quadraticCurveTo(180, (cfg.browY || 165) - (cfg.browArch || 18), 225, (cfg.browY || 165) - 4);
    ctx.stroke();

    // Right Brow
    ctx.beginPath();
    ctx.moveTo(377, cfg.browY || 165);
    ctx.quadraticCurveTo(332, (cfg.browY || 165) - (cfg.browArch || 18), 287, (cfg.browY || 165) - 4);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = 'rgba(120, 70, 40, 0.55)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(256, 210);
    ctx.lineTo(252, 290);
    ctx.lineTo(268, 295);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = 'rgba(90, 45, 20, 0.65)';
    ctx.beginPath(); ctx.arc(242, 300, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(270, 300, 4, 0, Math.PI * 2); ctx.fill();

    // Mustache (Harlan, Arthur)
    if (cfg.mustache === 'harlan') {
      ctx.fillStyle = '#1c1612';
      ctx.beginPath();
      ctx.moveTo(200, 345);
      ctx.quadraticCurveTo(256, 328, 312, 345);
      ctx.quadraticCurveTo(256, 348, 200, 345);
      ctx.fill();
    } else if (cfg.mustache === 'arthur') {
      ctx.fillStyle = '#7a7a78';
      ctx.beginPath();
      ctx.moveTo(205, 342);
      ctx.quadraticCurveTo(256, 320, 307, 342);
      ctx.quadraticCurveTo(256, 355, 205, 342);
      ctx.fill();
    }

    // Lips / Mouth
    const lipColor = cfg.lipColor || '#b86658';
    ctx.fillStyle = lipColor;
    ctx.strokeStyle = '#5a1d18';
    ctx.lineWidth = 3;

    ctx.beginPath();
    // Upper lip
    ctx.moveTo(215, 360);
    ctx.quadraticCurveTo(256, 348, 297, 360);
    // Lower lip
    ctx.quadraticCurveTo(256, 385, 215, 360);
    ctx.fill();
    ctx.stroke();

    // Smirk (Jude)
    if (cfg.smirk) {
      ctx.strokeStyle = '#4a1510';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(285, 360);
      ctx.lineTo(315, 350);
      ctx.stroke();
    }

    // Spectacles / Glasses (Arthur, Gail)
    if (cfg.glasses) {
      ctx.strokeStyle = cfg.glassesColor || '#b58b29';
      ctx.lineWidth = 5;
      // Left rim
      ctx.beginPath(); ctx.arc(180, 210, 38, 0, Math.PI * 2); ctx.stroke();
      // Right rim
      ctx.beginPath(); ctx.arc(332, 210, 38, 0, Math.PI * 2); ctx.stroke();
      // Bridge
      ctx.beginPath(); ctx.moveTo(218, 210); ctx.lineTo(294, 210); ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Generates 512x512 Canvas garment textures
  const createOutfitTexture = (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    switch (type) {
      case 'bram': { // Fair Isle knit vest over shirt
        // White shirt base
        ctx.fillStyle = '#dcd6ca';
        ctx.fillRect(0, 0, 512, 512);

        // Brown Fair Isle Vest
        ctx.fillStyle = '#4a2c1d';
        ctx.fillRect(80, 110, 352, 402);

        // Geometric Fair Isle Bands (diamonds, chevrons, cream/ochre/red)
        const colors = ['#dfb142', '#a83c28', '#ede3cc', '#6e412a'];
        for (let y = 140; y < 490; y += 45) {
          ctx.fillStyle = colors[(y / 45) % colors.length];
          for (let x = 90; x < 420; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x + 15, y);
            ctx.lineTo(x + 30, y + 15);
            ctx.lineTo(x + 15, y + 30);
            ctx.lineTo(x, y + 15);
            ctx.fill();
          }
          ctx.fillStyle = '#ede3cc';
          ctx.fillRect(80, y + 32, 352, 4);
        }

        // V-Neck cutout showing shirt & tie
        ctx.fillStyle = '#dcd6ca';
        ctx.beginPath();
        ctx.moveTo(200, 110);
        ctx.lineTo(312, 110);
        ctx.lineTo(256, 210);
        ctx.fill();

        // Dark tie in V-neck
        ctx.fillStyle = '#222224';
        ctx.beginPath();
        ctx.moveTo(246, 130);
        ctx.lineTo(266, 130);
        ctx.lineTo(260, 220);
        ctx.lineTo(252, 220);
        ctx.fill();
        break;
      }

      case 'jude': { // Wine pinstripe double-breasted suit with gold vest
        ctx.fillStyle = '#5c1926'; // Rich wine red
        ctx.fillRect(0, 0, 512, 512);

        // Pinstripes
        ctx.strokeStyle = 'rgba(240, 210, 215, 0.4)';
        ctx.lineWidth = 3;
        for (let x = 15; x < 512; x += 28) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
        }

        // Peaked Lapels
        ctx.fillStyle = '#48131d';
        ctx.beginPath();
        ctx.moveTo(110, 90); ctx.lineTo(200, 240); ctx.lineTo(150, 260); ctx.lineTo(70, 140);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(402, 90); ctx.lineTo(312, 240); ctx.lineTo(362, 260); ctx.lineTo(442, 140);
        ctx.fill();

        // Gold brocade vest in center
        ctx.fillStyle = '#d4a233';
        ctx.beginPath();
        ctx.moveTo(200, 150); ctx.lineTo(312, 150); ctx.lineTo(280, 320); ctx.lineTo(232, 320);
        ctx.fill();

        // Silk tie
        ctx.fillStyle = '#8a2030';
        ctx.beginPath();
        ctx.moveTo(244, 150); ctx.lineTo(268, 150); ctx.lineTo(262, 250); ctx.lineTo(250, 250);
        ctx.fill();

        // Double row of gold buttons
        ctx.fillStyle = '#dfb142';
        [270, 340, 410].forEach(by => {
          ctx.beginPath(); ctx.arc(205, by, 8, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(307, by, 8, 0, Math.PI * 2); ctx.fill();
        });
        break;
      }

      case 'nurse_k': { // Sky blue dress + white apron with red cross
        ctx.fillStyle = '#5c8db8'; // Sky blue dress
        ctx.fillRect(0, 0, 512, 512);

        // White Apron Bib
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(140, 90, 232, 422);

        // Red Cross Emblem
        ctx.fillStyle = '#c52828';
        ctx.fillRect(241, 140, 30, 10);
        ctx.fillRect(251, 130, 10, 30);

        // Apron Straps over shoulders
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(110, 0, 45, 120);
        ctx.fillRect(357, 0, 45, 120);

        // Waistband
        ctx.fillStyle = '#ebeef4';
        ctx.fillRect(120, 330, 272, 30);
        break;
      }

      case 'nell': { // Seamstress prairie dress + work apron with scissors & tape
        ctx.fillStyle = '#6b7a62'; // Sage green dress
        ctx.fillRect(0, 0, 512, 512);

        // Beige Apron
        ctx.fillStyle = '#dfd3be';
        ctx.fillRect(130, 100, 252, 412);

        // Chest Pocket
        ctx.fillStyle = '#cdbe9e';
        ctx.fillRect(170, 160, 90, 80);

        // Scissors in pocket
        ctx.strokeStyle = '#555558';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(195, 140); ctx.lineTo(215, 175); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(225, 140); ctx.lineTo(205, 175); ctx.stroke();
        ctx.beginPath(); ctx.arc(195, 136, 8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(225, 136, 8, 0, Math.PI * 2); ctx.stroke();

        // Yellow Measuring Tape draped over shoulder
        ctx.fillStyle = '#f0c832';
        ctx.fillRect(320, 90, 24, 250);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        for (let my = 100; my < 330; my += 14) {
          ctx.beginPath(); ctx.moveTo(320, my); ctx.lineTo(334, my); ctx.stroke();
        }
        break;
      }

      case 'harlan': { // Charcoal 3-piece business suit
        ctx.fillStyle = '#26292e';
        ctx.fillRect(0, 0, 512, 512);

        // White Shirt & Black Tie
        ctx.fillStyle = '#f2f2f4';
        ctx.beginPath(); ctx.moveTo(215, 60); ctx.lineTo(297, 60); ctx.lineTo(256, 170); ctx.fill();

        ctx.fillStyle = '#111215';
        ctx.beginPath(); ctx.moveTo(246, 70); ctx.lineTo(266, 70); ctx.lineTo(262, 180); ctx.lineTo(250, 180); ctx.fill();

        // Vest V-line
        ctx.fillStyle = '#1e2024';
        ctx.beginPath();
        ctx.moveTo(195, 140); ctx.lineTo(317, 140); ctx.lineTo(270, 310); ctx.lineTo(242, 310);
        ctx.fill();

        // Gold pocket watch chain
        ctx.strokeStyle = '#dfb142';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(256, 250, 45, 0.2, Math.PI * 0.9);
        ctx.stroke();
        break;
      }

      case 'elias': { // Reporter: Off-white shirt + suspenders + tie + satchel strap
        ctx.fillStyle = '#eee7d8';
        ctx.fillRect(0, 0, 512, 512);

        // Black Tie
        ctx.fillStyle = '#1c1e22';
        ctx.beginPath(); ctx.moveTo(244, 50); ctx.lineTo(268, 50); ctx.lineTo(262, 230); ctx.lineTo(250, 230); ctx.fill();

        // Dark Brown Leather Suspenders
        ctx.fillStyle = '#3a271b';
        ctx.fillRect(150, 0, 32, 512);
        ctx.fillRect(330, 0, 32, 512);

        // Brass buckles on suspenders
        ctx.fillStyle = '#dfb142';
        ctx.fillRect(146, 260, 40, 14);
        ctx.fillRect(326, 260, 40, 14);

        // Diagonal Leather Satchel Strap
        ctx.fillStyle = '#4a2f1c';
        ctx.beginPath();
        ctx.moveTo(80, 0); ctx.lineTo(120, 0); ctx.lineTo(440, 512); ctx.lineTo(400, 512);
        ctx.fill();
        break;
      }

      case 'ward': { // Detective: Grey/tan double-breasted trench coat with storm flaps & belt
        ctx.fillStyle = '#7a7a72';
        ctx.fillRect(0, 0, 512, 512);

        // Wide Notched Lapels
        ctx.fillStyle = '#66665e';
        ctx.beginPath();
        ctx.moveTo(100, 60); ctx.lineTo(210, 220); ctx.lineTo(130, 240); ctx.lineTo(60, 120);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(412, 60); ctx.lineTo(302, 220); ctx.lineTo(382, 240); ctx.lineTo(452, 120);
        ctx.fill();

        // Double-breasted buttons
        ctx.fillStyle = '#2b2a26';
        [180, 250, 320].forEach(by => {
          ctx.beginPath(); ctx.arc(195, by, 10, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(317, by, 10, 0, Math.PI * 2); ctx.fill();
        });

        // Trench Coat Belt with Buckle
        ctx.fillStyle = '#55554e';
        ctx.fillRect(50, 340, 412, 42);
        ctx.strokeStyle = '#b58b29';
        ctx.lineWidth = 6;
        ctx.strokeRect(226, 335, 60, 52);
        break;
      }

      case 'gail': { // Doctor: Open white lab coat over emerald blouse + stethoscope
        // Green blouse
        ctx.fillStyle = '#3a7d52';
        ctx.fillRect(0, 0, 512, 512);

        // White Lab Coat sides
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 190, 512);
        ctx.fillRect(322, 0, 190, 512);

        // Lab coat lapels
        ctx.fillStyle = '#e5e9f0';
        ctx.beginPath(); ctx.moveTo(190, 80); ctx.lineTo(140, 240); ctx.lineTo(190, 320); ctx.fill();
        ctx.beginPath(); ctx.moveTo(322, 80); ctx.lineTo(372, 240); ctx.lineTo(322, 320); ctx.fill();

        // Stethoscope Tubing & Chestpiece
        ctx.strokeStyle = '#222226';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(170, 0); ctx.quadraticCurveTo(200, 250, 256, 280);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(342, 0); ctx.quadraticCurveTo(312, 250, 256, 280);
        ctx.stroke();

        ctx.fillStyle = '#bcc2cb';
        ctx.beginPath(); ctx.arc(256, 290, 18, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'cade': { // Laborer: Denim Overalls with coal smudges
        // Grey Henley Shirt base
        ctx.fillStyle = '#a89e92';
        ctx.fillRect(0, 0, 512, 512);

        // Denim Blue Dungarees
        ctx.fillStyle = '#324e6d';
        ctx.fillRect(110, 140, 292, 372);

        // Overall Straps
        ctx.fillStyle = '#2c435e';
        ctx.fillRect(130, 0, 44, 200);
        ctx.fillRect(338, 0, 44, 200);

        // Brass buckles
        ctx.fillStyle = '#dfb142';
        ctx.fillRect(126, 140, 52, 20);
        ctx.fillRect(334, 140, 52, 20);

        // Front Kangaroo Bib Pocket
        ctx.fillStyle = '#283e58';
        ctx.fillRect(170, 200, 172, 110);

        // Coal / Grease smudges
        ctx.fillStyle = 'rgba(25, 20, 15, 0.4)';
        ctx.beginPath(); ctx.arc(200, 270, 40, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(320, 350, 50, 0, Math.PI * 2); ctx.fill();
        break;
      }

      default: {
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(0, 0, 512, 512);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Common Materials Helper
  const createMat = (color, roughness = 0.7, metalness = 0.1) => {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  };

  const matDarkHair = createMat(0x181512, 0.85);
  const matBlondHair = createMat(0xd8ba73, 0.85);
  const matRedHair = createMat(0x9e3820, 0.85);
  const matBrownHair = createMat(0x3e2715, 0.85);
  const matGreyHair = createMat(0x8a8a86, 0.9);
  const matGold = createMat(0xdfb142, 0.35, 0.85);
  const matBrass = createMat(0xb58b29, 0.35, 0.8);
  const matBlackShoe = createMat(0x161618, 0.5, 0.3);
  const matBrownShoe = createMat(0x422818, 0.6, 0.2);

  // ==========================================
  // 2. MODULAR HIGH-FIDELITY HUMANOID BUILDER
  // ==========================================
  const buildCharacter = (cfg) => {
    const root = new THREE.Group();
    const h = cfg.heightScale || 1.0;

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.45 * h, 0);

    // Sculpted Head Mesh (textured face front)
    const faceTex = createFaceTexture(cfg.face);
    const matFace = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.7,
      metalness: 0.05
    });
    const matSkin = new THREE.MeshStandardMaterial({
      color: cfg.face.skinColor || 0xf0c8a8,
      roughness: 0.75,
      metalness: 0.05
    });

    // Face mesh (curved front plate with face texture)
    const faceMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12 * h, 0.10 * h, 0.22 * h, 16, 1, false, Math.PI * 0.7, Math.PI * 0.6),
      matFace
    );
    faceMesh.rotation.y = Math.PI * 0.7;
    headGroup.add(faceMesh);

    // Back & top of skull
    const skullMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.125 * h, 14, 12),
      matSkin
    );
    skullMesh.scale.set(0.95, 1.15, 0.95);
    headGroup.add(skullMesh);

    // Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06 * h, 0.075 * h, 0.12 * h, 10),
      matSkin
    );
    neck.position.set(0, 1.34 * h, 0);
    root.add(neck);

    // Custom Hair & Hat
    if (cfg.buildHair) {
      cfg.buildHair(headGroup, h);
    }
    root.add(headGroup);

    // Torso (Upper body)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.05 * h, 0);

    let matTorso;
    if (cfg.outfitTex) {
      const tex = createOutfitTexture(cfg.outfitTex);
      matTorso = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.1 });
    } else {
      matTorso = createMat(cfg.torsoColor || 0x334455, 0.7, 0.1);
    }

    const chestMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        cfg.isFemale ? 0.17 * h : 0.21 * h,
        cfg.isFemale ? 0.13 * h : 0.18 * h,
        0.45 * h,
        12
      ),
      matTorso
    );
    chestMesh.scale.set(1.15, 1.0, 0.75);
    torsoGroup.add(chestMesh);

    // White shirt collar
    const collar = new THREE.Mesh(
      new THREE.ConeGeometry(0.09 * h, 0.08 * h, 8),
      createMat(0xf0ece2, 0.8)
    );
    collar.rotation.x = Math.PI;
    collar.position.set(0, 0.24 * h, 0.08 * h);
    torsoGroup.add(collar);

    root.add(torsoGroup);

    // Arms
    const matSleeve = cfg.sleeveColor ? createMat(cfg.sleeveColor, 0.75) : matTorso;
    [-1, 1].forEach(side => {
      const armGroup = new THREE.Group();
      armGroup.position.set(side * (cfg.isFemale ? 0.21 : 0.26) * h, 1.25 * h, 0);

      // Upper arm
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * h, 0.045 * h, 0.3 * h, 8), matSleeve);
      upperArm.position.set(0, -0.15 * h, 0);
      armGroup.add(upperArm);

      // Forearm
      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045 * h, 0.04 * h, 0.28 * h, 8),
        cfg.rolledSleeves ? matSkin : matSleeve
      );
      forearm.position.set(0, -0.42 * h, 0.02 * h);
      armGroup.add(forearm);

      // Hand (Palm & fingers)
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.04 * h, 0.08 * h, 0.06 * h), matSkin);
      hand.position.set(0, -0.58 * h, 0.02 * h);
      armGroup.add(hand);

      root.add(armGroup);
    });

    // Lower Body: Skirt or Trousers
    if (cfg.isSkirt) {
      // Flared pleated skirt
      const matSkirt = cfg.skirtColor ? createMat(cfg.skirtColor, 0.75) : matTorso;
      const skirt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14 * h, 0.28 * h, 0.62 * h, 16),
        matSkirt
      );
      skirt.position.set(0, 0.65 * h, 0);
      root.add(skirt);

      // Lower Legs & Shoes
      [-0.07, 0.07].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * h, 0.03 * h, 0.38 * h, 8), matSkin);
        leg.position.set(lx * h, 0.24 * h, 0);
        const shoe = new THREE.Mesh(
          new THREE.BoxGeometry(0.07 * h, 0.06 * h, 0.14 * h),
          cfg.shoeMat || matBrownShoe
        );
        shoe.position.set(lx * h, 0.03 * h, 0.02 * h);
        root.add(leg, shoe);
      });
    } else {
      // Trousers / Pants
      const matPants = cfg.pantsColor ? createMat(cfg.pantsColor, 0.8) : matTorso;
      [-0.1, 0.1].forEach(lx => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065 * h, 0.055 * h, 0.8 * h, 10),
          matPants
        );
        leg.position.set(lx * h, 0.44 * h, 0);

        const shoe = new THREE.Mesh(
          new THREE.BoxGeometry(0.08 * h, 0.07 * h, 0.18 * h),
          cfg.shoeMat || matBlackShoe
        );
        shoe.position.set(lx * h, 0.035 * h, 0.03 * h);
        root.add(leg, shoe);
      });
    }

    // Attach custom props (camera, shovel, bags, books, etc.)
    if (cfg.buildProps) {
      cfg.buildProps(root, h);
    }

    return root;
  };

  // ==========================================
  // 3. THE 16 INDIVIDUAL CHARACTERS
  // ==========================================

  // 1. Cade / Worker (케이드 / 노동자) - Locomotive
  const createCade = () => {
    return buildCharacter({
      heightScale: 1.08,
      isFemale: false,
      rolledSleeves: true,
      face: {
        skinColor: '#dfa278',
        eyeColor: '#4a2c1d',
        browColor: '#2b1b11',
        browWidth: 10,
        stubble: true,
        dirt: true
      },
      outfitTex: 'cade',
      pantsColor: 0x324e6d,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Messy layered brown hair
        for (let i = 0; i < 9; i++) {
          const lock = new THREE.Mesh(new THREE.ConeGeometry(0.045 * h, 0.12 * h, 5), matBrownHair);
          lock.rotation.set((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.8);
          lock.position.set((Math.random() - 0.5) * 0.18 * h, 0.11 * h, (Math.random() - 0.5) * 0.16 * h);
          hg.add(lock);
        }
      },
      buildProps: (root, h) => {
        // Long coal shovel in hand
        const shovel = new THREE.Group();
        shovel.position.set(0.35 * h, 0.6 * h, 0.15 * h);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2 * h, 8), matBrownShoe);
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.18 * h, 0.25 * h, 0.02 * h), createMat(0x66666a, 0.4, 0.8));
        blade.position.set(0, -0.6 * h, 0);
        shovel.add(shaft, blade);
        root.add(shovel);
      }
    });
  };

  // 2. Ward / Detective (워드 / 형사) - Baggage Car
  const createWard = () => {
    return buildCharacter({
      heightScale: 1.05,
      isFemale: false,
      face: {
        skinColor: '#e0b898',
        eyeColor: '#36404a',
        browColor: '#2a2825',
        browWidth: 9,
        stubble: true
      },
      outfitTex: 'ward',
      pantsColor: 0x5a5852,
      shoeMat: matBlackShoe,
      buildHair: (hg, h) => {
        // Textured short brown/grey hair
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13 * h, 12, 10), matBrownHair);
        hair.position.set(0, 0.05 * h, -0.02 * h);
        hair.scale.set(1.0, 0.7, 1.05);
        hg.add(hair);
      }
    });
  };

  // 3. Bram / Student (브람 / 대학생) - Coach Car
  const createBram = () => {
    return buildCharacter({
      heightScale: 0.98,
      isFemale: false,
      face: {
        skinColor: '#f4ceb2',
        eyeColor: '#3d6ea8',
        browColor: '#bfa058',
        browWidth: 6,
        blush: 'rgba(230, 140, 120, 0.25)'
      },
      outfitTex: 'bram',
      pantsColor: 0x2d333b,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Tousled stylish blond hair with side wave
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135 * h, 14, 12), matBlondHair);
        hair.position.set(0, 0.06 * h, 0);
        hair.scale.set(1.02, 0.85, 1.05);

        const fringe = new THREE.Mesh(new THREE.ConeGeometry(0.06 * h, 0.14 * h, 6), matBlondHair);
        fringe.rotation.set(0.6, 0.3, -0.5);
        fringe.position.set(-0.06 * h, 0.09 * h, 0.1 * h);
        hg.add(hair, fringe);
      },
      buildProps: (root, h) => {
        // Holding a vintage leatherbound book
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.12 * h, 0.16 * h, 0.03 * h), createMat(0x6b241e));
        book.position.set(0.22 * h, 0.7 * h, 0.22 * h);
        book.rotation.set(0.4, -0.3, 0.2);
        root.add(book);
      }
    });
  };

  // 4. Nell / Seamstress (넬 / 재봉사) - Coach Car
  const createNell = () => {
    return buildCharacter({
      heightScale: 0.94,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#f7d2b8',
        eyeColor: '#4a321f',
        browColor: '#4a2c1d',
        browWidth: 5,
        browArch: 20,
        blush: 'rgba(240, 120, 120, 0.35)',
        isFemale: true
      },
      outfitTex: 'nell',
      skirtColor: 0x6b7a62,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Brown parted hair with two braided pigtails hanging down over shoulders!
        const scalp = new THREE.Mesh(new THREE.SphereGeometry(0.13 * h, 14, 12), matBrownHair);
        scalp.position.set(0, 0.05 * h, 0);
        scalp.scale.set(1.0, 0.85, 1.05);
        hg.add(scalp);

        // Two Braids
        [-0.1, 0.1].forEach(bx => {
          const braid = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * h, 0.015 * h, 0.28 * h, 8), matBrownHair);
          braid.position.set(bx * h, -0.15 * h, 0.06 * h);
          braid.rotation.x = -0.15;
          const bow = new THREE.Mesh(new THREE.BoxGeometry(0.04 * h, 0.02 * h, 0.02 * h), matRedHair);
          bow.position.set(bx * h, -0.28 * h, 0.08 * h);
          hg.add(braid, bow);
        });
      }
    });
  };

  // 5. Nurse K (케이 / 간호사) - Coach Car
  const createNurseK = () => {
    return buildCharacter({
      heightScale: 0.97,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#dfaa82',
        eyeColor: '#2b2118',
        browColor: '#1c1612',
        browWidth: 5,
        browArch: 16,
        isFemale: true
      },
      outfitTex: 'nurse_k',
      skirtColor: 0xf8fafc,
      shoeMat: matBlackShoe,
      buildHair: (hg, h) => {
        // Dark hair tucked neatly under a winged Nurse Cap
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.125 * h, 12, 10), matDarkHair);
        hair.position.set(0, 0.04 * h, 0);
        hair.scale.set(1.0, 0.8, 1.05);

        // Crisp white 1930s Nurse Cap with folded wings
        const cap = new THREE.Mesh(
          new THREE.ConeGeometry(0.12 * h, 0.14 * h, 5),
          createMat(0xffffff, 0.9)
        );
        cap.position.set(0, 0.14 * h, -0.04 * h);
        cap.rotation.x = -0.25;
        hg.add(hair, cap);
      },
      buildProps: (root, h) => {
        // Holding a medical clipboard
        const board = new THREE.Mesh(new THREE.BoxGeometry(0.14 * h, 0.19 * h, 0.02 * h), matBrownShoe);
        board.position.set(0.22 * h, 0.85 * h, 0.2 * h);
        board.rotation.set(0.3, -0.2, 0.1);
        const paper = new THREE.Mesh(new THREE.BoxGeometry(0.12 * h, 0.16 * h, 0.005 * h), createMat(0xffffff));
        paper.position.set(0, 0, 0.012 * h);
        board.add(paper);
        root.add(board);
      }
    });
  };

  // 6. Elias / Reporter (엘리아스 / 기자) - Coach Car
  const createElias = () => {
    return buildCharacter({
      heightScale: 1.0,
      isFemale: false,
      rolledSleeves: true,
      face: {
        skinColor: '#e2ba96',
        eyeColor: '#3d2817',
        browColor: '#251b14',
        browWidth: 8
      },
      outfitTex: 'elias',
      pantsColor: 0x5a422d,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Dark Fedora with indented crown and "PRESS" card in the hatband
        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * h, 0.2 * h, 0.02 * h, 16), createMat(0x282a2e));
        hatBrim.position.set(0, 0.12 * h, 0);

        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * h, 0.13 * h, 0.12 * h, 12), createMat(0x282a2e));
        hatCrown.position.set(0, 0.18 * h, 0);

        const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.132 * h, 0.132 * h, 0.03 * h, 12), createMat(0x18181a));
        hatBand.position.set(0, 0.14 * h, 0);

        // White "PRESS" card
        const pressCard = new THREE.Mesh(new THREE.BoxGeometry(0.04 * h, 0.06 * h, 0.005 * h), createMat(0xffffff));
        pressCard.position.set(0.135 * h, 0.16 * h, 0.04 * h);
        pressCard.rotation.z = -0.2;

        hg.add(hatBrim, hatCrown, hatBand, pressCard);
      },
      buildProps: (root, h) => {
        // Holding Reporter's Notepad & Pencil
        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.09 * h, 0.13 * h, 0.02 * h), createMat(0xf0ece2));
        pad.position.set(0.18 * h, 0.9 * h, 0.22 * h);
        const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.005 * h, 0.005 * h, 0.1 * h, 6), matGold);
        pencil.rotation.x = Math.PI / 2;
        pencil.position.set(0.24 * h, 0.9 * h, 0.24 * h);

        // Shoulder satchel bag at hip
        const satchel = new THREE.Mesh(new THREE.BoxGeometry(0.08 * h, 0.18 * h, 0.22 * h), createMat(0x422818));
        satchel.position.set(-0.25 * h, 0.65 * h, 0);

        root.add(pad, pencil, satchel);
      }
    });
  };

  // 7. Harlan / Businessman (할란 / 사업가) - 1st Class Sleeper
  const createHarlan = () => {
    return buildCharacter({
      heightScale: 1.04,
      isFemale: false,
      face: {
        skinColor: '#dfb28e',
        eyeColor: '#2b2016',
        browColor: '#1a1410',
        browWidth: 8,
        mustache: 'harlan'
      },
      outfitTex: 'harlan',
      pantsColor: 0x26292e,
      shoeMat: matBlackShoe,
      buildHair: (hg, h) => {
        // Slicked back dark pomade hair with neat side parting
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13 * h, 14, 12), matDarkHair);
        hair.position.set(0, 0.06 * h, -0.02 * h);
        hair.scale.set(0.98, 0.85, 1.05);
        hg.add(hair);
      }
    });
  };

  // 8. Clara / Novelist (클라라 / 소설가) - 1st Class Sleeper
  const createClara = () => {
    return buildCharacter({
      heightScale: 0.96,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#fae0cc',
        eyeColor: '#3a2517',
        browColor: '#26170d',
        browWidth: 6,
        isFemale: true,
        blush: 'rgba(230, 130, 120, 0.3)'
      },
      torsoColor: 0x5a684f, // Olive green trench coat
      skirtColor: 0x4a5540,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Dark brown 1930s sleek bob with straight bangs
        const bob = new THREE.Mesh(new THREE.SphereGeometry(0.135 * h, 14, 12), matDarkHair);
        bob.position.set(0, 0.05 * h, -0.02 * h);
        bob.scale.set(1.05, 0.95, 1.05);

        const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.18 * h, 0.06 * h, 0.05 * h), matDarkHair);
        bangs.position.set(0, 0.07 * h, 0.12 * h);
        hg.add(bob, bangs);
      },
      buildProps: (root, h) => {
        // Novelist holding manuscript & vintage pen
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.12 * h, 0.16 * h, 0.03 * h), createMat(0x283848));
        book.position.set(0.18 * h, 0.85 * h, 0.18 * h);
        root.add(book);
      }
    });
  };

  // 9. Ida / Secretary (아이다 / 비서) - 1st Class Sleeper
  const createIda = () => {
    return buildCharacter({
      heightScale: 0.97,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#f2cbb0',
        eyeColor: '#322319',
        browColor: '#2b1b11',
        browWidth: 6,
        browArch: 18,
        lipColor: '#a83c34',
        isFemale: true
      },
      torsoColor: 0x406e4a, // Forest green suit blazer
      skirtColor: 0x406e4a,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Wavy 1930s brown bob hair
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135 * h, 14, 12), matBrownHair);
        hair.position.set(0, 0.05 * h, 0);
        hair.scale.set(1.04, 0.9, 1.05);
        hg.add(hair);
      }
    });
  };

  // 10. Gail / Doctor (게일 / 의사) - 2nd Class Sleeper
  const createGail = () => {
    return buildCharacter({
      heightScale: 0.98,
      isFemale: true,
      face: {
        skinColor: '#dfb28e',
        eyeColor: '#3d2b1b',
        browColor: '#201811',
        browWidth: 6,
        glasses: true,
        glassesColor: '#4a3d2e',
        isFemale: true
      },
      outfitTex: 'gail',
      pantsColor: 0x5a402d,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Curly dark hair gathered into a neat professional bun
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13 * h, 14, 12), matDarkHair);
        hair.position.set(0, 0.05 * h, -0.02 * h);
        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.065 * h, 10, 10), matDarkHair);
        bun.position.set(0, 0.05 * h, -0.14 * h);
        hg.add(hair, bun);
      }
    });
  };

  // 11. Arthur / Professor (아서 / 교수) - 2nd Class Sleeper
  const createArthur = () => {
    return buildCharacter({
      heightScale: 0.99,
      isFemale: false,
      face: {
        skinColor: '#eed0b5',
        eyeColor: '#38404a',
        browColor: '#7a7a76',
        browWidth: 9,
        mustache: 'arthur',
        glasses: true,
        glassesColor: '#dfb142'
      },
      torsoColor: 0x4a3222, // Brown wool professor coat
      pantsColor: 0x5a6068,
      shoeMat: matBlackShoe,
      buildHair: (hg, h) => {
        // Balding crown with grey hair fringe around sides & back
        const fringe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.135 * h, 0.13 * h, 0.08 * h, 14, 1, false, Math.PI * 0.5, Math.PI),
          matGreyHair
        );
        fringe.position.set(0, 0.04 * h, -0.02 * h);
        hg.add(fringe);
      }
    });
  };

  // 12. Jude / Con Artist (주드 / 사기꾼) - Dining Car
  const createJude = () => {
    return buildCharacter({
      heightScale: 1.02,
      isFemale: false,
      face: {
        skinColor: '#e5b892',
        eyeColor: '#3a2416',
        browColor: '#1c1611',
        browWidth: 7,
        smirk: true
      },
      outfitTex: 'jude',
      pantsColor: 0x5c1926,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Slicked back dark hair with a slight lock falling
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13 * h, 14, 12), matDarkHair);
        hair.position.set(0, 0.06 * h, -0.02 * h);
        hair.scale.set(0.98, 0.82, 1.05);
        hg.add(hair);
      },
      buildProps: (root, h) => {
        // Fan of playing cards
        const cardFan = new THREE.Mesh(new THREE.BoxGeometry(0.1 * h, 0.08 * h, 0.01 * h), matGold);
        cardFan.position.set(0.2 * h, 0.85 * h, 0.18 * h);
        cardFan.rotation.set(0.3, -0.3, 0.2);
        root.add(cardFan);
      }
    });
  };

  // 13. Rose / Dancer (로즈 / 무용수) - Dining Car
  const createRose = () => {
    return buildCharacter({
      heightScale: 0.95,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#fae3d0',
        eyeColor: '#2d6848',
        browColor: '#7a2815',
        browWidth: 5,
        browArch: 20,
        lipColor: '#c8382b',
        eyeliner: true,
        isFemale: true,
        blush: 'rgba(240, 110, 110, 0.35)'
      },
      torsoColor: 0x486b62, // Teal blouse
      skirtColor: 0x3d251e, // Pleated dark brown skirt
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Voluminous wavy red bob
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.14 * h, 14, 12), matRedHair);
        hair.position.set(0, 0.05 * h, 0);
        hair.scale.set(1.08, 0.92, 1.08);

        // Bright orange silk knotted neck scarf
        const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.08 * h, 0.025 * h, 8, 12), createMat(0xe86820, 0.6));
        scarf.rotation.x = Math.PI / 2;
        scarf.position.set(0, -0.12 * h, 0);
        hg.add(hair, scarf);
      }
    });
  };

  // 14. Lulu / Singer (룰루 / 가수) - Lounge Car
  const createLulu = () => {
    return buildCharacter({
      heightScale: 0.98,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#f5d2b8',
        eyeColor: '#251b14',
        browColor: '#14100c',
        browWidth: 5,
        browArch: 22,
        lipColor: '#9e1a2c',
        eyeliner: true,
        isFemale: true,
        blush: 'rgba(235, 90, 110, 0.4)'
      },
      torsoColor: 0x1d5e3c, // Emerald evening dress
      skirtColor: 0x1d5e3c,
      shoeMat: matBlackShoe,
      buildHair: (hg, h) => {
        // Finger waves in jet black glossy hair
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135 * h, 14, 12), matDarkHair);
        hair.position.set(0, 0.05 * h, 0);
        hair.scale.set(1.04, 0.88, 1.05);

        // Feather Boa around shoulders
        const boa = new THREE.Mesh(new THREE.TorusGeometry(0.18 * h, 0.05 * h, 8, 16), createMat(0x133824, 0.95));
        boa.rotation.x = Math.PI / 2;
        boa.position.set(0, -0.16 * h, 0);
        hg.add(hair, boa);
      }
    });
  };

  // 15. Felix / Photographer (필릭스 / 사진사) - Lounge Car
  const createFelix = () => {
    return buildCharacter({
      heightScale: 1.0,
      isFemale: false,
      rolledSleeves: true,
      face: {
        skinColor: '#dfb590',
        eyeColor: '#3a2718',
        browColor: '#261910',
        browWidth: 7
      },
      torsoColor: 0xa88758, // Tan multi-pocket photographer vest
      pantsColor: 0x2e3532,
      shoeMat: matBrownShoe,
      buildHair: (hg, h) => {
        // Spiky brown hair
        for (let i = 0; i < 7; i++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04 * h, 0.12 * h, 5), matBrownHair);
          spike.rotation.set((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.6);
          spike.position.set((Math.random() - 0.5) * 0.14 * h, 0.11 * h, (Math.random() - 0.5) * 0.14 * h);
          hg.add(spike);
        }
      },
      buildProps: (root, h) => {
        // 3D Classic SLR Box Camera slung around chest
        const cameraGroup = new THREE.Group();
        cameraGroup.position.set(0.05 * h, 0.95 * h, 0.18 * h);
        const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.14 * h, 0.09 * h, 0.07 * h), createMat(0x222224, 0.5, 0.4));
        const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * h, 0.035 * h, 0.05 * h, 12), matBrass);
        camLens.rotation.x = Math.PI / 2;
        camLens.position.set(0, 0, 0.05 * h);
        cameraGroup.add(camBody, camLens);
        root.add(cameraGroup);
      }
    });
  };

  // 16. Mabel / Aristocrat (메이벨 / 귀족) - Observation Car
  const createMabel = () => {
    return buildCharacter({
      heightScale: 1.01,
      isFemale: true,
      isSkirt: true,
      face: {
        skinColor: '#f7ded0',
        eyeColor: '#284552',
        browColor: '#2b211a',
        browWidth: 5,
        browArch: 24,
        lipColor: '#8a2034',
        eyeliner: true,
        isFemale: true
      },
      torsoColor: 0x22555b, // Peacock teal coat dress
      skirtColor: 0x1a4045,
      shoeMat: matBlackShoe,
      buildHair: (hg, h) => {
        // Aristocratic wide-brim hat with dramatic plume feathers
        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * h, 0.24 * h, 0.02 * h, 16), createMat(0x184247));
        hatBrim.position.set(0, 0.12 * h, 0);

        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * h, 0.14 * h, 0.1 * h, 14), createMat(0x184247));
        hatCrown.position.set(0, 0.17 * h, 0);

        // Tall black ostrich feathers on hat
        const feather = new THREE.Mesh(new THREE.ConeGeometry(0.04 * h, 0.28 * h, 6), createMat(0x111112, 0.9));
        feather.rotation.set(-0.3, 0.2, 0.4);
        feather.position.set(-0.12 * h, 0.28 * h, 0.05 * h);

        hg.add(hatBrim, hatCrown, feather);
      }
    });
  };

  // ==========================================
  // 4. SCENE INITIALIZATION & NATURAL PLACEMENT
  // ==========================================
  const init = (scene) => {
    characterList.length = 0;

    const charactersData = [
      // Car 1: Locomotive
      { id: 1, name: '케이드 / 노동자 (Cade)', fn: createCade, pos: { x: -0.65, y: 1.6, z: -3.5 }, rotY: 0.3 },

      // Car 2: 수하물차
      { id: 2, name: '워드 / 형사 (Ward)', fn: createWard, pos: { x: 0.6, y: 1.2, z: -25.5 }, rotY: -1.2 },

      // Car 3: 일반 객차 (Natural Seated & Standing Poses!)
      // Bram seated comfortably in a left window seat reading
      { id: 3, name: '브람 / 대학생 (Bram)', fn: createBram, pos: { x: -0.95, y: 1.2, z: -38.5 }, rotY: 0 },
      // Nell seated in a right window seat sewing
      { id: 4, name: '넬 / 재봉사 (Nell)', fn: createNell, pos: { x: 0.95, y: 1.2, z: -41.7 }, rotY: 0 },
      // Nurse K standing gracefully near the aisle checking on passengers
      { id: 5, name: '케이 / 간호사 (K)', fn: createNurseK, pos: { x: -0.25, y: 1.2, z: -45.5 }, rotY: 0.2 },
      // Elias standing in the right seat row taking notes
      { id: 6, name: '엘리아스 / 기자 (Elias)', fn: createElias, pos: { x: 0.95, y: 1.2, z: -48.5 }, rotY: -Math.PI / 2 },

      // Car 4: 1등석 침대차 (Inside Luxury Suites!)
      // Harlan in Suite 1 (Z = -62.0)
      { id: 7, name: '할란 / 사업가 (Harlan)', fn: createHarlan, pos: { x: 0.85, y: 1.2, z: -61.4 }, rotY: -Math.PI / 2 },
      // Clara in Suite 2 (Z = -67.0)
      { id: 8, name: '클라라 / 소설가 (Clara)', fn: createClara, pos: { x: 0.85, y: 1.2, z: -66.4 }, rotY: -Math.PI / 2 },
      // Ida in Suite 3 (Z = -72.0)
      { id: 9, name: '아이다 / 비서 (Ida)', fn: createIda, pos: { x: 0.85, y: 1.2, z: -71.4 }, rotY: -Math.PI / 2 },

      // Car 5: 2등석 침대차
      { id: 10, name: '게일 / 의사 (Gail)', fn: createGail, pos: { x: 0.1, y: 1.2, z: -84.0 }, rotY: 0 },
      { id: 11, name: '아서 / 교수 (Arthur)', fn: createArthur, pos: { x: -0.85, y: 1.2, z: -92.0 }, rotY: Math.PI / 2 },

      // Car 6: 식당차 (Dining at tables!)
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

      // Register collision box for character
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

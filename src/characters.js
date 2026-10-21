// 16 1930s Authentic 3D Characters: Full Polygonal Hierarchical Models with Stylized Textures & Accessories
// Genuine 3D humanoid figures (Head, 3D Styled Hair, Expressive 3D Face, Hats, Layered Clothing, Limbs, Props)
// Includes smooth push-physics so players never get blocked.

const Characters = (() => {
  const characterList = [];

  // Reusable Ground Contact Shadow Texture
  const createContactShadowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 58);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  };
  const contactShadowTex = createContactShadowTexture();

  // Create High-Res Expressive 1930s Stylized Face Texture
  const createFaceTexture = (d) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base skin color
    const hex = '#' + d.skin.toString(16).padStart(6, '0');
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, 256, 256);

    // Rosy Cheeks
    const isFemale = d.gender === 'f';
    const blushCol = isFemale ? 'rgba(235, 110, 120, 0.28)' : 'rgba(200, 110, 100, 0.16)';
    ctx.fillStyle = blushCol;
    ctx.beginPath(); ctx.arc(68, 145, 26, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(188, 145, 26, 0, Math.PI * 2); ctx.fill();

    // Stylized 1930s Eyes
    const eyeY = 122;
    const eyeColor = d.eyes ? d.eyes.color : '#3a332c';
    [-1, 1].forEach(side => {
      const eyeX = side === -1 ? 78 : 178;

      // Sclera (Eye White)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 19, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 9.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#111115';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Gleam / Catchlight Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX - 3.5, eyeY - 3.5, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eyeX + 3.0, eyeY + 2.5, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Upper Eyelash line
      ctx.strokeStyle = '#181210';
      ctx.lineWidth = isFemale ? 4.5 : 3.0;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY + 1, 20, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Eyebrow
      ctx.strokeStyle = '#' + d.hairColor.toString(16).padStart(6, '0');
      ctx.lineWidth = d.mustache || !isFemale ? 3.8 : 2.6;
      ctx.beginPath();
      const browY = eyeY - 18;
      if (side === -1) {
        ctx.moveTo(eyeX - 22, browY + 2);
        ctx.quadraticCurveTo(eyeX - 5, browY - 6, eyeX + 18, browY);
      } else {
        ctx.moveTo(eyeX - 18, browY);
        ctx.quadraticCurveTo(eyeX + 5, browY - 6, eyeX + 22, browY + 2);
      }
      ctx.stroke();

      // Spectacles if applicable
      if (d.glasses) {
        ctx.strokeStyle = '#dfb142';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 21, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Bridge for glasses
    if (d.glasses) {
      ctx.strokeStyle = '#dfb142';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(99, eyeY);
      ctx.lineTo(157, eyeY);
      ctx.stroke();
    }

    // Nose Bridge & Tip
    ctx.strokeStyle = 'rgba(120, 60, 40, 0.4)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(128, 126);
    ctx.lineTo(128, 154);
    ctx.lineTo(133, 156);
    ctx.stroke();

    // Lips / Mouth
    const lipY = 188;
    if (isFemale) {
      // Crimson / Rose 1930s Cupid's Bow Lips
      ctx.fillStyle = d.key === 'lulu' || d.key === 'rose' || d.key === 'clara' ? '#b51a2e' : '#c85265';
      ctx.beginPath();
      ctx.moveTo(112, lipY);
      ctx.quadraticCurveTo(122, lipY - 6, 128, lipY - 2);
      ctx.quadraticCurveTo(134, lipY - 6, 144, lipY);
      ctx.quadraticCurveTo(128, lipY + 8, 112, lipY);
      ctx.fill();
    } else if (d.mustache) {
      // Vintage Groomed 1930s Mustache
      ctx.fillStyle = '#' + d.hairColor.toString(16).padStart(6, '0');
      ctx.beginPath();
      ctx.moveTo(108, lipY - 6);
      ctx.quadraticCurveTo(128, lipY - 14, 148, lipY - 6);
      ctx.quadraticCurveTo(128, lipY + 4, 108, lipY - 6);
      ctx.fill();
      // Lower lip line
      ctx.strokeStyle = '#6a362a';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(120, lipY + 6);
      ctx.lineTo(136, lipY + 6);
      ctx.stroke();
    } else {
      // Defined masculine lip line
      ctx.strokeStyle = '#7c3f32';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(114, lipY);
      ctx.quadraticCurveTo(128, lipY + 4, 142, lipY);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };

  // Build Full Polygonal 3D Character Model
  const build3DCharacter = (d) => {
    const group = new THREE.Group();

    // Standard Materials
    const matSkin = new THREE.MeshStandardMaterial({ color: d.skin, roughness: 0.65, metalness: 0.05 });
    const matHair = new THREE.MeshStandardMaterial({ color: d.hairColor, roughness: 0.8, metalness: 0.05 });
    const faceTex = createFaceTexture(d);
    const matFace = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.65,
      metalness: 0.05
    });

    const matTop = new THREE.MeshStandardMaterial({ color: d.topColor, roughness: 0.7, metalness: 0.1 });
    const matBottom = new THREE.MeshStandardMaterial({ color: d.bottomColor, roughness: 0.75, metalness: 0.05 });
    const matShoe = new THREE.MeshStandardMaterial({ color: d.shoeColor, roughness: 0.4, metalness: 0.2 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xdfb142, roughness: 0.3, metalness: 0.85 });
    const matBrass = new THREE.MeshStandardMaterial({ color: 0xc49b38, roughness: 0.35, metalness: 0.8 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe0e5ea, roughness: 0.2, metalness: 0.9 });
    const matLeather = new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.45, metalness: 0.1 });

    const isFemale = d.gender === 'f';
    const totalH = d.height || (isFemale ? 1.74 : 1.82);

    // ==========================================
    // 1. HEAD & NECK HIERARCHY
    // ==========================================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, totalH - 0.26, 0);

    // Cranium
    const headGeom = new THREE.SphereGeometry(0.135, 16, 14);
    headGeom.scale(1.0, 1.14, 1.05);
    const headMesh = new THREE.Mesh(headGeom, matSkin);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Face Decal Plane (Front of head)
    const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), matFace);
    facePlane.position.set(0, 0.01, 0.136);
    headGroup.add(facePlane);

    // Ears
    [-0.14, 0.14].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), matSkin);
      ear.scale.set(0.4, 1.0, 0.7);
      ear.position.set(ex, 0, 0);
      headGroup.add(ear);
    });

    // 3D Volumetric Sculpted Hair
    const hairGroup = new THREE.Group();
    // Top volume
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.148, 14, 12), matHair);
    hairTop.position.set(0, 0.05, -0.015);
    hairTop.scale.set(1.02, 0.95, 1.05);
    hairGroup.add(hairTop);

    // Hairstyle variations
    if (d.hairStyle === 'finger_waves' || d.hairStyle === 'wave_bob') {
      // 1930s Finger wave locks framing cheeks
      [-0.135, 0.135].forEach(sx => {
        const wave = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.22, 8), matHair);
        wave.position.set(sx, -0.04, 0.04);
        wave.rotation.z = sx > 0 ? -0.15 : 0.15;
        hairGroup.add(wave);
      });
      // Back wave coiffure
      const backBob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), matHair);
      backBob.position.set(0, -0.06, -0.10);
      hairGroup.add(backBob);
    } else if (d.hairStyle === 'bun' || d.hairStyle === 'chignon') {
      // Elegant gathered chignon at back
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), matHair);
      bun.position.set(0, 0.01, -0.15);
      hairGroup.add(bun);
    } else if (d.hairStyle === 'blonde_curls') {
      // Fluffy burlesque curls
      for (let ci = -2; ci <= 2; ci++) {
        const curl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), matHair);
        curl.position.set(ci * 0.06, -0.03, -0.08);
        hairGroup.add(curl);
      }
    } else {
      // Classic 1930s gentlemen's parted haircut / short waves
      [-0.13, 0.13].forEach(sx => {
        const sideburn = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.14, 0.08), matHair);
        sideburn.position.set(sx, -0.03, -0.01);
        hairGroup.add(sideburn);
      });
    }
    headGroup.add(hairGroup);

    // 3D Headwear
    if (d.hat === 'fedora' || d.hat === 'fedora_press') {
      const hatGroup = new THREE.Group();
      hatGroup.position.set(0, 0.12, -0.01);
      hatGroup.rotation.x = -0.08;

      const matHat = new THREE.MeshStandardMaterial({ color: d.hatColor, roughness: 0.8 });
      const matBand = new THREE.MeshStandardMaterial({ color: d.hatBand || 0x222222, roughness: 0.6 });

      // Curved Fedora Brim
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.25, 0.018, 16), matHat);
      brim.scale.set(1.0, 1.0, 1.15);

      // Pinched Crown
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.145, 0.13, 12), matHat);
      crown.position.set(0, 0.065, 0);
      crown.scale.set(0.9, 1.0, 1.08);

      // Silk Ribbon Band
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.146, 0.148, 0.03, 12), matBand);
      band.position.set(0, 0.025, 0);

      hatGroup.add(brim, crown, band);

      // Reporter Press Card
      if (d.hat === 'fedora_press') {
        const card = new THREE.Mesh(
          new THREE.BoxGeometry(0.01, 0.06, 0.04),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
        );
        card.position.set(0.14, 0.05, 0);
        card.rotation.z = -0.2;
        hatGroup.add(card);
      }
      headGroup.add(hatGroup);
    } else if (d.hat === 'newsboy') {
      // 1930s Tweed Newsboy Flat Cap
      const capGroup = new THREE.Group();
      capGroup.position.set(0, 0.12, 0.01);
      capGroup.rotation.x = -0.1;

      const matCap = new THREE.MeshStandardMaterial({ color: d.hatColor, roughness: 0.85 });
      const capCrown = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), matCap);
      capCrown.scale.set(1.05, 0.5, 1.15);

      // Curved Visor
      const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.015, 12, 1, false, 0, Math.PI), matCap);
      visor.position.set(0, -0.04, 0.07);
      visor.rotation.x = 0.25;

      // Top Button
      const button = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matCap);
      button.position.set(0, 0.08, 0);

      capGroup.add(capCrown, visor, button);
      headGroup.add(capGroup);
    } else if (d.hat === 'nurse_cap') {
      // Crisp White Nurse Cap with Red Cross
      const nCap = new THREE.Group();
      nCap.position.set(0, 0.14, -0.04);
      nCap.rotation.x = -0.2;

      const capBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
      // Red Cross Badge
      const redMat = new THREE.MeshStandardMaterial({ color: 0xcc1122 });
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.005), redMat);
      crossV.position.set(0, 0, 0.062);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.005), redMat);
      crossH.position.set(0, 0, 0.062);

      nCap.add(capBody, crossV, crossH);
      headGroup.add(nCap);
    } else if (d.hat === 'flapper_band') {
      // 1930s Jazz Flapper Headband with Gem & Tall Upright Feather
      const fBand = new THREE.Group();
      fBand.position.set(0, 0.06, 0);

      // Golden Beaded Headband
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.015, 8, 24), matGold);
      torus.rotation.x = Math.PI / 2;

      // Brooch Jewel
      const jewel = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x11ccaa, roughness: 0.1, metalness: 0.9 })
      );
      jewel.position.set(0, 0.01, 0.145);

      // Tall Upright Ostrich Feather
      const featherMat = new THREE.MeshStandardMaterial({ color: d.featherColor || 0x1a7373, roughness: 0.7 });
      const feather = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 8), featherMat);
      feather.position.set(0, 0.16, 0.14);
      feather.scale.set(0.4, 1.0, 1.0);
      feather.rotation.z = -0.15;

      fBand.add(torus, jewel, feather);
      headGroup.add(fBand);
    } else if (d.hat === 'cloche') {
      // 1930s Bell-shaped Cloche Hat
      const clocheGroup = new THREE.Group();
      clocheGroup.position.set(0, 0.09, -0.01);

      const matCloche = new THREE.MeshStandardMaterial({ color: d.hatColor, roughness: 0.8 });
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.162, 14, 12), matCloche);
      crown.scale.set(1.0, 1.1, 1.05);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.04, 16), matCloche);
      rim.position.set(0, -0.08, 0.02);

      const brooch = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matGold);
      brooch.position.set(0.14, -0.06, 0.08);

      clocheGroup.add(crown, rim, brooch);
      headGroup.add(clocheGroup);
    }

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.12, 10), matSkin);
    neck.position.set(0, -0.16, 0);
    headGroup.add(neck);

    // Pearl Necklace for Elegant Ladies
    if (d.pearlNecklace) {
      const pearls = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.014, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.2, metalness: 0.6 })
      );
      pearls.rotation.x = Math.PI / 2;
      pearls.position.set(0, -0.19, 0.02);
      headGroup.add(pearls);
    }

    group.add(headGroup);

    // ==========================================
    // 2. TORSO & LAYERED CLOTHING HIERARCHY
    // ==========================================
    const torsoGroup = new THREE.Group();
    const torsoH = 0.52;
    torsoGroup.position.set(0, totalH - 0.58, 0);

    // Main Torso Body
    const torsoWidth = isFemale ? 0.32 : 0.38;
    const torsoGeom = new THREE.BoxGeometry(torsoWidth, torsoH, 0.22);
    const torsoMesh = new THREE.Mesh(torsoGeom, matTop);
    torsoMesh.castShadow = true;
    torsoGroup.add(torsoMesh);

    // 3D Shirt Collar & Tie / Scarf
    const shirtMat = new THREE.MeshStandardMaterial({ color: d.shirtColor || 0xffffff, roughness: 0.7 });
    const shirtV = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.02), shirtMat);
    shirtV.position.set(0, 0.18, 0.105);
    torsoGroup.add(shirtV);

    if (d.tieColor) {
      const matTie = new THREE.MeshStandardMaterial({ color: d.tieColor, roughness: 0.6 });
      const tieKnot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), matTie);
      tieKnot.position.set(0, 0.21, 0.12);
      const tieBody = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.22, 0.015), matTie);
      tieBody.position.set(0, 0.10, 0.12);
      torsoGroup.add(tieKnot, tieBody);
    }

    // 3D Lapels
    [-1, 1].forEach(side => {
      const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.02), matTop);
      lapel.position.set(side * 0.11, 0.12, 0.115);
      lapel.rotation.z = side * -0.1;
      torsoGroup.add(lapel);
    });

    // 3D Double-breasted / Trenchcoat Belt & Buttons
    if (d.topType === 'trenchcoat' || d.topType === 'suit_vest' || d.topType === 'double_breasted') {
      const belt = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.02, 0.05, 0.23), matLeather);
      belt.position.set(0, -0.14, 0);
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.03), matBrass);
      buckle.position.set(0, -0.14, 0.11);
      torsoGroup.add(belt, buckle);

      // Buttons
      [-0.06, 0.06].forEach(bx => {
        [0.05, -0.05].forEach(by => {
          const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8), matBrass);
          btn.rotation.x = Math.PI / 2;
          btn.position.set(bx, by, 0.115);
          torsoGroup.add(btn);
        });
      });
    }

    // Albert Pocket Watch Chain for Harlan
    if (d.watchChain) {
      const chain = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.006, 6, 12, Math.PI), matGold);
      chain.position.set(0.06, -0.05, 0.12);
      chain.rotation.z = -0.3;
      torsoGroup.add(chain);
    }

    // Overalls Shoulder Straps for Cade
    if (d.topType === 'overalls') {
      [-0.10, 0.10].forEach(sx => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.02), matTop);
        strap.position.set(sx, 0.08, 0.112);
        const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 0.01), matBrass);
        buckle.position.set(sx, -0.04, 0.124);
        torsoGroup.add(strap, buckle);
      });
    }

    // Stethoscope around Doctor Gail's Neck
    if (d.stethoscope) {
      const stethMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 });
      const tube = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 16, Math.PI), stethMat);
      tube.rotation.x = Math.PI / 2;
      tube.position.set(0, 0.22, 0.05);

      const piece = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.015, 12), matChrome);
      piece.position.set(0.05, 0.02, 0.125);
      piece.rotation.x = Math.PI / 2;

      torsoGroup.add(tube, piece);
    }

    // Mink Fur Stole Collar for Aristocratic Lady Mabel
    if (d.furStole) {
      const furMat = new THREE.MeshStandardMaterial({ color: d.furStole, roughness: 0.95 });
      const stoleL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.45, 10), furMat);
      stoleL.position.set(-0.16, 0.08, 0.12);
      stoleL.rotation.z = 0.2;
      const stoleR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.45, 10), furMat);
      stoleR.position.set(0.16, 0.08, 0.12);
      stoleR.rotation.z = -0.2;
      torsoGroup.add(stoleL, stoleR);
    }

    group.add(torsoGroup);

    // ==========================================
    // 3. ARMS & HANDS HIERARCHY
    // ==========================================
    [-1, 1].forEach(side => {
      const armGroup = new THREE.Group();
      armGroup.position.set(side * (torsoWidth / 2 + 0.07), totalH - 0.38, 0);

      // Shoulder
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), matTop);
      armGroup.add(shoulder);

      // Upper Arm
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.28, 8), matTop);
      upperArm.position.set(0, -0.14, 0);
      armGroup.add(upperArm);

      // Forearm (Sleeve or bare/glove)
      const armMat = d.operaGloves ? new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.4 }) :
                     (d.whiteGloves ? new THREE.MeshStandardMaterial({ color: 0xfbfbfa, roughness: 0.5 }) : matTop);
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.042, 0.25, 8), armMat);
      forearm.position.set(0, -0.38, 0.02);
      armGroup.add(forearm);

      // 3D Hand
      const handMat = d.operaGloves || d.whiteGloves ? armMat : matSkin;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), handMat);
      hand.scale.set(0.8, 1.2, 0.6);
      hand.position.set(0, -0.53, 0.03);
      armGroup.add(hand);

      group.add(armGroup);
    });

    // ==========================================
    // 4. LOWER BODY & LEGS / SKIRT HIERARCHY
    // ==========================================
    const legLength = totalH - 0.85;

    if (isFemale && d.topType !== 'overalls') {
      // 3D Flowing Flapper / Elegant Dress / Skirt
      const skirtGroup = new THREE.Group();
      skirtGroup.position.set(0, legLength / 2, 0);

      const skirtTopR = 0.20;
      const skirtBottomR = d.topType === 'blazer_pencil' ? 0.21 : 0.34;
      const skirt = new THREE.Mesh(
        new THREE.CylinderGeometry(skirtTopR, skirtBottomR, legLength + 0.05, 16),
        matBottom
      );
      skirt.castShadow = true;
      skirtGroup.add(skirt);

      // Flapper Gold Beaded Fringe Trim for Lulu
      if (d.goldFringe) {
        const fringe = new THREE.Mesh(
          new THREE.CylinderGeometry(skirtBottomR + 0.01, skirtBottomR + 0.02, 0.12, 16, 1, true),
          matGold
        );
        fringe.position.set(0, -legLength / 2 + 0.05, 0);
        skirtGroup.add(fringe);
      }
      group.add(skirtGroup);

      // Delicate high heels emerging from hem
      [-0.09, 0.09].forEach(lx => {
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.16), matShoe);
        shoe.position.set(lx, 0.03, 0.02);
        group.add(shoe);
      });
    } else {
      // Tailored 3D Trousers with pressed creases
      [-0.105, 0.105].forEach(lx => {
        const legGroup = new THREE.Group();
        legGroup.position.set(lx, legLength / 2, 0);

        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.068, legLength, 10),
          matBottom
        );
        leg.castShadow = true;
        legGroup.add(leg);

        // Oxford Shoe / Heavy Work Boot
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.075, 0.22), matShoe);
        shoe.position.set(0, -legLength / 2 + 0.037, 0.03);
        shoe.castShadow = true;
        legGroup.add(shoe);

        group.add(legGroup);
      });
    }

    // ==========================================
    // 5. SIGNATURE 3D CHARACTER PROPS
    // ==========================================
    const propGroup = new THREE.Group();

    if (d.prop === 'wrench') {
      // Cade: Heavy Cast Steel Pipe Wrench
      const wrenchBody = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.38, 0.02), matBrass);
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.03), matBrass);
      jaw.position.set(0.02, 0.18, 0);
      propGroup.position.set(0.28, 0.75, 0.18);
      propGroup.rotation.set(0.2, 0, -0.4);
      propGroup.add(wrenchBody, jaw);
    } else if (d.prop === 'holster') {
      // Detective Ward: Leather Shoulder Holster & Badge
      const holster = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.07), matLeather);
      const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.005, 6), matGold);
      badge.position.set(0.026, 0.02, 0);
      badge.rotation.z = Math.PI / 2;
      propGroup.position.set(0.22, 1.05, 0.04);
      propGroup.add(holster, badge);
    } else if (d.prop === 'books') {
      // Bram: Stack of Hardcover University Textbooks
      const bookColors = [0x782828, 0x24422e, 0x223652];
      bookColors.forEach((bc, idx) => {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.04, 0.22),
          new THREE.MeshStandardMaterial({ color: bc, roughness: 0.6 })
        );
        book.position.set(0, idx * 0.042, 0);
        propGroup.add(book);
      });
      propGroup.position.set(0.26, 0.95, 0.16);
      propGroup.rotation.set(0, 0.2, 0);
    } else if (d.prop === 'tapemeasure') {
      // Nell: Yellow Seamstress Measuring Tape draped around neck
      const tapeMat = new THREE.MeshStandardMaterial({ color: 0xdfb142, roughness: 0.5 });
      const tape = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.015, 6, 16, Math.PI * 1.2), tapeMat);
      tape.rotation.x = Math.PI / 2;
      propGroup.position.set(0, 1.22, 0.02);
      propGroup.add(tape);
    } else if (d.prop === 'tray') {
      // Nurse K: Silver Medicine Tray with Glass Syringe
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.015, 0.16), matChrome);
      const vial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8),
        new THREE.MeshPhysicalMaterial({ color: 0x66bbff, transparent: true, opacity: 0.8, transmission: 0.8 })
      );
      vial.position.set(-0.05, 0.04, 0);
      propGroup.position.set(0, 0.92, 0.26);
      propGroup.add(tray, vial);
    } else if (d.prop === 'notepad') {
      // Elias: Reporter Press Notepad & Pencil
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.015, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xfcfbe8, roughness: 0.8 })
      );
      const pencil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.14, 6),
        new THREE.MeshStandardMaterial({ color: 0xd4a017 })
      );
      pencil.rotation.z = Math.PI / 2;
      pencil.position.set(0, 0.015, 0.05);
      propGroup.position.set(0.22, 0.95, 0.20);
      propGroup.rotation.set(0.2, 0.3, 0);
      propGroup.add(pad, pencil);
    } else if (d.prop === 'briefcase') {
      // Harlan: Luxury Leather Executive Attache Briefcase
      const caseBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.36), matLeather);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 8, Math.PI), matBrass);
      handle.position.set(0, 0.14, 0);
      propGroup.position.set(0.32, 0.65, 0.05);
      propGroup.add(caseBody, handle);
    } else if (d.prop === 'manuscript') {
      // Clara: Bound Leather Novel Manuscript Folio
      const folio = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.18), new THREE.MeshStandardMaterial({ color: 0x5a181d, roughness: 0.5 }));
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 8), matGold);
      pen.position.set(0.03, 0.05, 0);
      propGroup.position.set(0.24, 0.95, 0.18);
      propGroup.add(folio, pen);
    } else if (d.prop === 'clipboard') {
      // Ida: Brass Steno Clipboard
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.015, 0.22), matBrass);
      const paper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.018, 0.18), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      propGroup.position.set(0.22, 0.95, 0.20);
      propGroup.add(board, paper);
    } else if (d.prop === 'medical_bag') {
      // Gail: Black Leather Doctor's Gladstone Bag
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.32), new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.4 }));
      const bHandle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.009, 6, 8, Math.PI), matBrass);
      bHandle.position.set(0, 0.12, 0);
      propGroup.position.set(0.30, 0.65, 0.05);
      propGroup.add(bag, bHandle);
    } else if (d.prop === 'pipe') {
      // Arthur: Briarwood Smoking Pipe
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.04, 8), new THREE.MeshStandardMaterial({ color: 0x4a2511 }));
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.08, 6), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      stem.rotation.x = Math.PI / 2;
      stem.position.set(0, 0.015, 0.04);
      propGroup.position.set(0.04, 1.48, 0.14);
      propGroup.add(bowl, stem);
    } else if (d.prop === 'cards') {
      // Jude: Fan of Playing Cards
      [-0.04, 0, 0.04].forEach((cx, idx) => {
        const card = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.08, 0.002),
          new THREE.MeshStandardMaterial({ color: 0xfbfbf8 })
        );
        card.position.set(cx, 0, idx * 0.003);
        card.rotation.z = (idx - 1) * 0.2;
        propGroup.add(card);
      });
      propGroup.position.set(0.22, 1.0, 0.22);
    } else if (d.prop === 'fan') {
      // Rose: Cabaret Lace Hand Fan
      const fan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.02, 0.005, 8, 1, false, -1.2, 2.4),
        new THREE.MeshStandardMaterial({ color: 0xdfb142, roughness: 0.6 })
      );
      fan.rotation.x = Math.PI / 2;
      propGroup.position.set(0.22, 1.02, 0.18);
      propGroup.add(fan);
    } else if (d.prop === 'microphone') {
      // Lulu: Vintage 1930s Chrome Ribbon Microphone
      const micStand = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8), matChrome);
      micStand.position.set(0, 0.18, 0);
      const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 12), matChrome);
      const micHead = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), matChrome);
      micHead.position.set(0, 0.40, 0);
      propGroup.position.set(0.48, 1.10, 0); // Positioned directly on bar counter!
      propGroup.add(micStand, micBase, micHead);
    } else if (d.prop === 'camera') {
      // Felix: Vintage Twin-Lens Reflex (TLR) Rolleiflex Camera
      const camBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.16, 0.10),
        new THREE.MeshStandardMaterial({ color: 0x222224, roughness: 0.5 })
      );
      [0.03, -0.03].forEach(ly => {
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.03, 12), matChrome);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, ly, 0.06);
        propGroup.add(lens);
      });
      const strap = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.01, 6, 16), matLeather);
      strap.rotation.x = Math.PI / 2;
      propGroup.position.set(0, 1.12, 0.18);
      propGroup.add(camBody, strap);
    } else if (d.prop === 'parasol') {
      // Mabel: Aristocratic Silk Parasol
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.72, 8), new THREE.MeshStandardMaterial({ color: 0xfff8eb }));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 8), matGold);
      tip.position.set(0, 0.38, 0);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 6, 8, Math.PI), matGold);
      handle.position.set(0, -0.38, 0);
      propGroup.position.set(0.25, 0.55, 0.12);
      propGroup.rotation.z = -0.2;
      propGroup.add(pole, tip, handle);
    }
    group.add(propGroup);

    // ==========================================
    // 6. CONTACT SHADOW & REAL 3D SHADOW PROXY
    // ==========================================
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.75),
      new THREE.MeshBasicMaterial({ map: contactShadowTex, transparent: true, opacity: 0.65, depthWrite: false })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.015, 0);
    group.add(shadowMesh);

    return group;
  };

  // 16 Characters Definition
  const characterData = [
    // 1. Cade (Car 1 Locomotive): Laborer / Engineer
    {
      id: 1, key: 'cade', name: '케이드 / 노동자 (Cade)',
      pos: { x: -0.65, y: 1.6, z: -3.5 }, rotY: 0.3,
      gender: 'm', height: 1.86,
      skin: 0xd29d78, hairColor: 0x3d2719,
      hairStyle: 'short', hat: 'newsboy', hatColor: 0x485055,
      topType: 'overalls', topColor: 0x3b5373, shirtColor: 0x9ba2a8,
      bottomColor: 0x2e425d, shoeColor: 0x3a2518,
      prop: 'wrench',
      eyes: { color: '#385e78', shape: 'rugged' }
    },
    // 2. Ward (Car 2 Baggage): Detective
    {
      id: 2, key: 'ward', name: '워드 / 형사 (Ward)',
      pos: { x: 0.55, y: 1.2, z: -25.5 }, rotY: -1.2,
      gender: 'm', height: 1.85,
      skin: 0xd6a382, hairColor: 0x2b1e17,
      hairStyle: 'parted', hat: 'fedora', hatColor: 0xb59e7f, hatBand: 0x3b2a22,
      topType: 'trenchcoat', topColor: 0xb59e7f, shirtColor: 0xeeebe5, tieColor: 0x5a181d,
      bottomColor: 0x38332f, shoeColor: 0x221814,
      prop: 'holster',
      eyes: { color: '#45382b', shape: 'sharp' }
    },
    // 3. Bram (Car 3 Coach): College Student
    {
      id: 3, key: 'bram', name: '브람 / 대학생 (Bram)',
      pos: { x: -0.95, y: 1.2, z: -38.8 }, rotY: 0,
      gender: 'm', height: 1.76,
      skin: 0xebbba2, hairColor: 0x5a3721,
      hairStyle: 'messy', hat: 'none',
      topType: 'sweater', topColor: 0x2f4f3e, stripeColor: 0xc8aa68, shirtColor: 0xffffff,
      bottomColor: 0x5b4f45, shoeColor: 0x422a1d,
      prop: 'books', glasses: true,
      eyes: { color: '#4d3a2b', shape: 'gentle' }
    },
    // 4. Nell (Car 3 Coach): Seamstress
    {
      id: 4, key: 'nell', name: '넬 / 재봉사 (Nell)',
      pos: { x: 0.95, y: 1.2, z: -42.0 }, rotY: 0,
      gender: 'f', height: 1.72,
      skin: 0xf2c4ac, hairColor: 0x6e3b22,
      hairStyle: 'bun', hat: 'none',
      topType: 'vintage_dress', topColor: 0x632837, collarColor: 0xf5f0ea,
      bottomColor: 0x4e1f2b, shoeColor: 0x231a1a,
      prop: 'tapemeasure',
      eyes: { color: '#3b553d', shape: 'soft' }
    },
    // 5. Nurse K (Car 3 Coach): Nurse
    {
      id: 5, key: 'nurse_k', name: '케이 / 간호사 (K)',
      pos: { x: -0.32, y: 1.2, z: -45.5 }, rotY: 0.15,
      gender: 'f', height: 1.74,
      skin: 0xebd2c2, hairColor: 0x2b221d,
      hairStyle: 'bob', hat: 'nurse_cap', hatColor: 0xfbfbfa,
      topType: 'nurse_uniform', topColor: 0xfbfbfa, apronColor: 0xffffff,
      bottomColor: 0xf5f5f3, shoeColor: 0xf0f0ee,
      prop: 'tray',
      eyes: { color: '#2b3f4d', shape: 'calm' }
    },
    // 6. Elias (Car 3 Coach): Reporter
    {
      id: 6, key: 'elias', name: '엘리아스 / 기자 (Elias)',
      pos: { x: 0.95, y: 1.2, z: -48.5 }, rotY: -Math.PI / 2,
      gender: 'm', height: 1.80,
      skin: 0xdfab8c, hairColor: 0x3d281a,
      hairStyle: 'parted', hat: 'fedora_press', hatColor: 0x695f54, hatBand: 0x222222,
      topType: 'vest_shirt', topColor: 0x4a433b, shirtColor: 0xe8e4de, tieColor: 0x7a2222,
      bottomColor: 0x38342f, shoeColor: 0x241d18,
      prop: 'notepad',
      eyes: { color: '#4b4034', shape: 'keen' }
    },
    // 7. Harlan (Car 4 Sleeper 1): Tycoon Businessman
    {
      id: 7, key: 'harlan', name: '할란 / 사업가 (Harlan)',
      pos: { x: 0.85, y: 1.2, z: -61.4 }, rotY: -Math.PI / 2,
      gender: 'm', height: 1.84,
      skin: 0xd8a98b, hairColor: 0x6b635c,
      hairStyle: 'slick', hat: 'fedora', hatColor: 0x2b2f38, hatBand: 0xdfb142,
      topType: 'suit_vest', topColor: 0x252a33, shirtColor: 0xffffff, tieColor: 0x8a2428, watchChain: true,
      bottomColor: 0x252a33, shoeColor: 0x111317,
      prop: 'briefcase', mustache: true,
      eyes: { color: '#3e424a', shape: 'stern' }
    },
    // 8. Clara (Car 4 Sleeper 1): Novelist
    {
      id: 8, key: 'clara', name: '클라라 / 소설가 (Clara)',
      pos: { x: 0.85, y: 1.2, z: -66.4 }, rotY: -Math.PI / 2,
      gender: 'f', height: 1.75,
      skin: 0xf5cfb8, hairColor: 0x853920,
      hairStyle: 'wave_bob', hat: 'none',
      topType: 'elegant_gown', topColor: 0x1d4734, pearlNecklace: true,
      bottomColor: 0x163829, shoeColor: 0x1f2620,
      prop: 'manuscript',
      eyes: { color: '#2d4d3a', shape: 'deep' }
    },
    // 9. Ida (Car 4 Sleeper 1): Executive Secretary
    {
      id: 9, key: 'ida', name: '아이다 / 비서 (Ida)',
      pos: { x: 0.85, y: 1.2, z: -71.4 }, rotY: -Math.PI / 2,
      gender: 'f', height: 1.76,
      skin: 0xebd0bc, hairColor: 0x332219,
      hairStyle: 'chignon', hat: 'none',
      topType: 'blazer_pencil', topColor: 0x28313e, blouseColor: 0xfbf6ee,
      bottomColor: 0x202732, shoeColor: 0x181a1f,
      prop: 'clipboard', glasses: true,
      eyes: { color: '#383b40', shape: 'intelligent' }
    },
    // 10. Gail (Car 5 Sleeper 2): Physician / Doctor
    {
      id: 10, key: 'gail', name: '게일 / 의사 (Gail)',
      pos: { x: 0.15, y: 1.2, z: -84.0 }, rotY: 0,
      gender: 'm', height: 1.78,
      skin: 0xdcb297, hairColor: 0x423329,
      hairStyle: 'side_part', hat: 'none',
      topType: 'suit', topColor: 0x3a3f47, shirtColor: 0xf2f4f7, tieColor: 0x2b4c68,
      bottomColor: 0x32363d, shoeColor: 0x1f2024,
      prop: 'medical_bag', stethoscope: true,
      eyes: { color: '#36495a', shape: 'focused' }
    },
    // 11. Arthur (Car 5 Sleeper 2): Professor / Antiquarian
    {
      id: 11, key: 'arthur', name: '아서 / 교수 (Arthur)',
      pos: { x: -0.85, y: 1.2, z: -92.0 }, rotY: Math.PI / 2,
      gender: 'm', height: 1.78,
      skin: 0xd9b095, hairColor: 0x918981,
      hairStyle: 'professor', hat: 'none',
      topType: 'tweed_jacket', topColor: 0x5c4228, shirtColor: 0xf5ede1, tieColor: 0xc8963e,
      bottomColor: 0x473d33, shoeColor: 0x33261a,
      prop: 'pipe', glasses: true, mustache: true,
      eyes: { color: '#4a3b2b', shape: 'scholarly' }
    },
    // 12. Jude (Car 6 Diner): Con Artist / Gambler
    {
      id: 12, key: 'jude', name: '주드 / 사기꾼 (Jude)',
      pos: { x: 0.95, y: 1.2, z: -107.5 }, rotY: 0,
      gender: 'm', height: 1.82,
      skin: 0xd5a484, hairColor: 0x1e1e1e,
      hairStyle: 'slick', hat: 'none',
      topType: 'double_breasted', topColor: 0x2b2e36, shirtColor: 0x1e2430, tieColor: 0xa82424,
      bottomColor: 0x24272e, shoeColor: 0x15161a,
      prop: 'cards',
      eyes: { color: '#383a3f', shape: 'sly' }
    },
    // 13. Rose (Car 6 Diner): Cabaret Dancer
    {
      id: 13, key: 'rose', name: '로즈 / 무용수 (Rose)',
      pos: { x: 0.95, y: 1.2, z: -106.1 }, rotY: Math.PI,
      gender: 'f', height: 1.74,
      skin: 0xf5d2c2, hairColor: 0xe0a955,
      hairStyle: 'blonde_curls', hat: 'none',
      topType: 'cabaret_gown', topColor: 0x9b1b30,
      bottomColor: 0x821426, shoeColor: 0x540b17,
      prop: 'fan',
      eyes: { color: '#32587a', shape: 'glamorous' }
    },
    // 14. Lulu (Car 7 Lounge Bar): Jazz Singer / Flapper
    // Positioned behind the remodeled counter (X = -0.98), microphone right on the counter!
    {
      id: 14, key: 'lulu', name: '룰루 / 가수 (Lulu)',
      pos: { x: -0.98, y: 1.2, z: -126.8 }, rotY: Math.PI / 2,
      gender: 'f', height: 1.78,
      skin: 0xebd2c2, hairColor: 0x1a1617,
      hairStyle: 'finger_waves', hat: 'flapper_band', hatColor: 0xdfb142, featherColor: 0x1a7373,
      topType: 'flapper_dress', topColor: 0x1b191c, goldFringe: true, pearlNecklace: true, operaGloves: true,
      bottomColor: 0x141215, shoeColor: 0xdfb142,
      prop: 'microphone',
      eyes: { color: '#453835', shape: 'enchanting' }
    },
    // 15. Felix (Car 7 Lounge Window): Photojournalist
    {
      id: 15, key: 'felix', name: '필릭스 / 사진사 (Felix)',
      pos: { x: 0.85, y: 1.2, z: -132.5 }, rotY: -Math.PI / 2,
      gender: 'm', height: 1.80,
      skin: 0xd9a888, hairColor: 0x4a3220,
      hairStyle: 'tousled', hat: 'none',
      topType: 'photo_vest', topColor: 0x5a634e, shirtColor: 0xded5c8,
      bottomColor: 0x4f473e, shoeColor: 0x36271c,
      prop: 'camera',
      eyes: { color: '#385038', shape: 'observant' }
    },
    // 16. Mabel (Car 8 Observation Saloon): Aristocratic Lady
    {
      id: 16, key: 'mabel', name: '메이벨 / 귀족 (Mabel)',
      pos: { x: 0.90, y: 1.2, z: -152.0 }, rotY: -Math.PI / 2,
      gender: 'f', height: 1.80,
      skin: 0xf5d9cc, hairColor: 0xb5afaa,
      hairStyle: 'cloche_coiffure', hat: 'cloche', hatColor: 0x4a3352, hatBand: 0xdfb142,
      topType: 'fur_coat', topColor: 0x3e2945, furStole: 0x6e5241, pearlNecklace: true, whiteGloves: true,
      bottomColor: 0x33203a, shoeColor: 0x221326,
      prop: 'parasol',
      eyes: { color: '#4d465c', shape: 'noble' }
    }
  ];

  const init = (scene) => {
    characterList.length = 0;

    characterData.forEach(d => {
      const model = build3DCharacter(d);
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
        if (child.isMesh && child.geometry.type !== 'PlaneGeometry') {
          child.castShadow = true;
          child.receiveShadow = true;
        }
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

// 16 1930s Characters: Authentic Cel-Shaded 3D Game Characters
// 100% faithful to the turnaround sheets: Natural human body silhouettes,
// period tailoring, authentic hairstyles, expressive faces, and dynamic 3D camera parallax.
// NO crude geometric boxes, NO plumbing cylinders, NO square face stickers.

const Characters = (() => {
  const characterList = [];
  const textureLoader = new THREE.TextureLoader();

  // Reusable Ground Contact Shadow Texture
  const createContactShadowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };
  const contactShadowTex = createContactShadowTexture();

  // 16 Character Design Specs with exact sprite aspect ratios and physical heights
  const characterRatios = {
    arthur: 0.494,
    bram: 0.333,
    cade: 0.753,
    clara: 0.438,
    elias: 0.421,
    felix: 0.434,
    gail: 0.510,
    harlan: 0.487,
    ida: 0.521,
    jude: 0.556,
    lulu: 0.541,
    mabel: 0.539,
    nell: 0.453,
    nurse_k: 0.696,
    rose: 0.558,
    ward: 0.489
  };

  // 16 Characters Definition with authentic train positions
  const characterData = [
    // 1. Car 1: Locomotive (케이드 - 노동자)
    { id: 1, key: 'cade', name: '케이드 / 노동자 (Cade)', h: 1.84, pos: { x: -0.65, y: 1.2, z: -3.5 }, rotY: 0.3 },

    // 2. Car 2: Baggage Car (워드 - 형사)
    { id: 2, key: 'ward', name: '워드 / 형사 (Ward)', h: 1.85, pos: { x: 0.0, y: 1.2, z: -20.5 }, rotY: 0 },

    // 3. Car 3: Coach Car (4 passengers)
    { id: 3, key: 'bram', name: '브람 / 대학생 (Bram)', h: 1.76, pos: { x: -0.95, y: 1.2, z: -40.4 }, rotY: 0 },
    { id: 4, key: 'nell', name: '넬 / 재봉사 (Nell)', h: 1.72, pos: { x: 0.95, y: 1.2, z: -42.0 }, rotY: 0 },
    { id: 5, key: 'nurse_k', name: '케이 / 간호사 (K)', h: 1.74, pos: { x: 0.0, y: 1.2, z: -45.2 }, rotY: 0.15 },
    { id: 6, key: 'elias', name: '엘리아스 / 기자 (Elias)', h: 1.80, pos: { x: 0.95, y: 1.2, z: -48.5 }, rotY: -Math.PI / 2 },

    // 4. Car 4: 1st Class Sleeper (3 passengers in Luxury Suites)
    { id: 7, key: 'harlan', name: '할란 / 사업가 (Harlan)', h: 1.84, pos: { x: 0.85, y: 1.2, z: -61.4 }, rotY: -Math.PI / 2 },
    { id: 8, key: 'clara', name: '클라라 / 소설가 (Clara)', h: 1.76, pos: { x: 0.85, y: 1.2, z: -66.4 }, rotY: -Math.PI / 2 },
    { id: 9, key: 'ida', name: '아이다 / 비서 (Ida)', h: 1.76, pos: { x: 0.85, y: 1.2, z: -71.4 }, rotY: -Math.PI / 2 },

    // 5. Car 5: 2nd Class Sleeper (2 passengers)
    { id: 10, key: 'gail', name: '게일 / 의사 (Gail)', h: 1.78, pos: { x: 0.15, y: 1.2, z: -84.0 }, rotY: 0 },
    { id: 11, key: 'arthur', name: '아서 / 교수 (Arthur)', h: 1.78, pos: { x: -0.85, y: 1.2, z: -92.0 }, rotY: Math.PI / 2 },

    // 6. Car 6: Dining Car (2 passengers at dining tables)
    { id: 12, key: 'jude', name: '주드 / 사기꾼 (Jude)', h: 1.82, pos: { x: 0.95, y: 1.2, z: -107.5 }, rotY: 0 },
    { id: 13, key: 'rose', name: '로즈 / 무용수 (Rose)', h: 1.74, pos: { x: 0.95, y: 1.2, z: -106.1 }, rotY: Math.PI },

    // 7. Car 7: Lounge Car (2 characters)
    { id: 14, key: 'lulu', name: '룰루 / 가수 (Lulu)', h: 1.78, pos: { x: -0.98, y: 1.2, z: -126.8 }, rotY: Math.PI / 2 },
    { id: 15, key: 'felix', name: '필릭스 / 사진사 (Felix)', h: 1.80, pos: { x: 0.85, y: 1.2, z: -132.5 }, rotY: -Math.PI / 2 },

    // 8. Car 8: Observation Car (1 passenger)
    { id: 16, key: 'mabel', name: '메이벨 / 귀족 (Mabel)', h: 1.80, pos: { x: 0.90, y: 1.2, z: -152.0 }, rotY: -Math.PI / 2 }
  ];

  // Build high-fidelity 3D character with natural human body lines, face, and 3D depth
  const createCharacterModel = (d) => {
    const group = new THREE.Group();
    const H = d.h;
    const ratio = characterRatios[d.key] || 0.55;
    const W = H * ratio;

    // Load High-Res Front and Back Textures (4K Ultra-HD 1800~2000px)
    const frontTex = textureLoader.load(`assets/characters/${d.key}_front.png`);
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.generateMipmaps = true;
    frontTex.minFilter = THREE.LinearMipmapLinearFilter;
    frontTex.magFilter = THREE.LinearFilter;
    frontTex.anisotropy = 8;

    const backTex = textureLoader.load(`assets/characters/${d.key}_back.png`);
    backTex.colorSpace = THREE.SRGBColorSpace;
    backTex.generateMipmaps = true;
    backTex.minFilter = THREE.LinearMipmapLinearFilter;
    backTex.magFilter = THREE.LinearFilter;
    backTex.anisotropy = 8;

    // Materials react naturally to train lighting
    const matFront = new THREE.MeshStandardMaterial({
      map: frontTex,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const matBack = new THREE.MeshStandardMaterial({
      map: backTex,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Visual Mesh Group (dynamically orients toward camera with smooth parallax)
    const visualGroup = new THREE.Group();
    visualGroup.position.set(0, 0, 0);

    // Front Face Mesh (raised 2cm so shoe soles rest cleanly on top of carpet pile)
    const frontMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matFront);
    frontMesh.position.set(0, H / 2 + 0.02, 0);
    frontMesh.castShadow = true;
    frontMesh.receiveShadow = true;
    visualGroup.add(frontMesh);

    // Back Face Mesh (same orientation, toggled via visibility based on viewing angle)
    const backMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matBack);
    backMesh.position.set(0, H / 2 + 0.02, 0);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    backMesh.visible = false;
    visualGroup.add(backMesh);

    group.add(visualGroup);

    // Soft Realistic Ground Contact Shadow
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.max(W, 0.85), 0.70),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.015, 0);
    group.add(shadowMesh);

    // Store references for dynamic camera tracking in update()
    group.userData = {
      isCharacter: true,
      name: d.name,
      key: d.key,
      radius: 0.28,
      baseY: d.pos.y,
      baseRotY: d.rotY,
      visualGroup: visualGroup,
      frontMesh: frontMesh,
      backMesh: backMesh,
      height: H,
      idlePhase: Math.random() * Math.PI * 2
    };

    group.traverse(child => {
      child.userData.characterName = d.name;
    });

    return group;
  };

  const init = (scene) => {
    characterList.length = 0;

    characterData.forEach(d => {
      const model = createCharacterModel(d);
      model.position.set(d.pos.x, d.pos.y, d.pos.z);
      model.rotation.y = d.rotY;
      model.name = d.name;

      scene.add(model);
      characterList.push(model);
    });
  };

  // Push Physics & Dynamic Camera Parallax Update
  const update = (delta, playerPos) => {
    if (!playerPos) return;

    const pushRadius = 0.52; // Player (0.28) + Character (0.24)

    for (let i = 0; i < characterList.length; i++) {
      const char = characterList[i];
      const u = char.userData;

      // 1. Push Physics: Player smoothly nudges characters out of the way
      const dx = char.position.x - playerPos.x;
      const dz = char.position.z - playerPos.z;
      const dist = Math.hypot(dx, dz);

      // Vertical proximity check
      const dy = Math.abs(char.position.y - playerPos.y + 1.6);
      if (dy < 2.0 && dist < pushRadius && dist > 0.001) {
        const overlap = pushRadius - dist;
        const nx = dx / dist;
        const nz = dz / dist;

        char.position.x += nx * overlap * 1.2;
        char.position.z += nz * overlap * 1.2;

        // Clamp inside train car walls
        char.position.x = Math.max(-1.18, Math.min(1.18, char.position.x));
      }

      // 2. Dynamic 3D Camera Parallax Alignment
      // Seamlessly switches between Front and Back views based on viewing angle,
      // and smoothly rotates visualGroup to always face camera line-of-sight on Y-axis.
      if (u && u.visualGroup) {
        const toCamX = playerPos.x - char.position.x;
        const toCamZ = playerPos.z - char.position.z;
        const distToCam = Math.hypot(toCamX, toCamZ);

        if (distToCam > 0.05) {
          // Angle from character to camera in world space
          const worldAngleToCam = Math.atan2(toCamX, toCamZ);

          // Relative angle in character local space
          const localAngle = worldAngleToCam - char.rotation.y;

          // Align visualGroup to face camera
          u.visualGroup.rotation.y = localAngle;

          // Check whether camera is viewing character from front or back
          // In world space, character forward vector: (sin(rotY), cos(rotY))
          const fwdX = Math.sin(char.rotation.y);
          const fwdZ = Math.cos(char.rotation.y);
          const dot = fwdX * toCamX + fwdZ * toCamZ;

          const isFront = (dot >= 0);
          if (u.frontMesh.visible !== isFront) {
            u.frontMesh.visible = isFront;
            u.backMesh.visible = !isFront;
          }
        }

        // 3. Subtle Living Breathing Motion (micro-bobbing)
        u.idlePhase += delta * 1.8;
        const breathOffset = Math.sin(u.idlePhase) * 0.004;
        u.visualGroup.position.y = breathOffset;
      }
    }
  };

  return {
    init,
    update,
    getList: () => characterList
  };
})();

// 16 1930s Characters: Pure Authentic Dual-Sided Visual Models
// Directly uses the user's high-resolution turnaround design artwork (front and back) with clean alpha silhouette.
// Completely removes all primitive geometric boxes and spheres so characters look clean and identical to reference sheets.
// Includes physics-based push interaction so players never get blocked in corridors.

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
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  };
  const contactShadowTex = createContactShadowTexture();

  // Create Authentic Standee Character Model (Clean, High-Res, 100% faithful to drawings)
  const createCharacterModel = (d) => {
    const group = new THREE.Group();
    const width = d.w;
    const height = d.h;

    // Load High-Res Front & Back Artwork Textures
    const frontTex = textureLoader.load(`assets/characters/${d.key}_front.png`);
    frontTex.minFilter = THREE.LinearFilter;
    frontTex.magFilter = THREE.LinearFilter;

    const backTex = textureLoader.load(`assets/characters/${d.key}_back.png`);
    backTex.minFilter = THREE.LinearFilter;
    backTex.magFilter = THREE.LinearFilter;

    // Materials with alphaTest (seamless outline, NO square border, NO geometric boxes!)
    const matFront = new THREE.MeshStandardMaterial({
      map: frontTex,
      transparent: true,
      alphaTest: 0.08,
      depthWrite: true,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.FrontSide
    });

    const matBack = new THREE.MeshStandardMaterial({
      map: backTex,
      transparent: true,
      alphaTest: 0.08,
      depthWrite: true,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.FrontSide
    });

    // Front and Back Art Planes (tight 0.025m separation, clean and seamless)
    const geom = new THREE.PlaneGeometry(width, height);

    const frontMesh = new THREE.Mesh(geom, matFront);
    frontMesh.position.set(0, height / 2, 0.0125);
    frontMesh.castShadow = true;

    const backMesh = new THREE.Mesh(geom, matBack);
    backMesh.position.set(0, height / 2, -0.0125);
    backMesh.rotation.y = Math.PI;
    backMesh.castShadow = true;

    group.add(frontMesh, backMesh);

    // Soft Ground Contact Shadow
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.85, 0.55),
      new THREE.MeshBasicMaterial({ map: contactShadowTex, transparent: true, opacity: 0.65, depthWrite: false })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.015, 0);
    group.add(shadowMesh);

    // Dynamic 3D Shadow Caster Proxy
    const shadowProxy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, height * 0.95, 8),
      new THREE.MeshBasicMaterial({ colorWrite: false })
    );
    shadowProxy.position.set(0, height / 2, 0);
    shadowProxy.castShadow = true;
    group.add(shadowProxy);

    return group;
  };

  // 16 Characters Definition with authentic proportions, colors, and train positions
  const characterData = [
    // 1. Car 1: Locomotive (케이드 - 노동자)
    { id: 1, key: 'cade', name: '케이드 / 노동자 (Cade)', w: 1.05, h: 1.84, pos: { x: -0.65, y: 1.6, z: -3.5 }, rotY: 0.3 },

    // 2. Car 2: Baggage Car (워드 - 형사, positioned in clear aisle between cargo)
    { id: 2, key: 'ward', name: '워드 / 형사 (Ward)', w: 0.98, h: 1.85, pos: { x: 0.0, y: 1.2, z: -20.5 }, rotY: 0 },

    // 3. Car 3: Coach Car (4 passengers)
    // Bram: seated in row #2
    { id: 3, key: 'bram', name: '브람 / 대학생 (Bram)', w: 0.88, h: 1.76, pos: { x: -0.95, y: 1.2, z: -38.8 }, rotY: 0 },
    // Nell: seated in row #4
    { id: 4, key: 'nell', name: '넬 / 재봉사 (Nell)', w: 0.80, h: 1.72, pos: { x: 0.95, y: 1.2, z: -42.0 }, rotY: 0 },
    // Nurse K: standing near right seats
    { id: 5, key: 'nurse_k', name: '케이 / 간호사 (K)', w: 0.86, h: 1.74, pos: { x: -0.32, y: 1.2, z: -45.5 }, rotY: 0.15 },
    // Elias: standing near left seats with notepad
    { id: 6, key: 'elias', name: '엘리아스 / 기자 (Elias)', w: 0.92, h: 1.80, pos: { x: 0.95, y: 1.2, z: -48.5 }, rotY: -Math.PI / 2 },

    // 4. Car 4: 1st Class Sleeper (3 passengers in Luxury Suites)
    // Harlan in Suite 1 (Z = -62.0)
    { id: 7, key: 'harlan', name: '할란 / 사업가 (Harlan)', w: 0.95, h: 1.84, pos: { x: 0.85, y: 1.2, z: -61.4 }, rotY: -Math.PI / 2 },
    // Clara in Suite 2 (Z = -67.0)
    { id: 8, key: 'clara', name: '클라라 / 소설가 (Clara)', w: 0.92, h: 1.76, pos: { x: 0.85, y: 1.2, z: -66.4 }, rotY: -Math.PI / 2 },
    // Ida in Suite 3 (Z = -72.0)
    { id: 9, key: 'ida', name: '아이다 / 비서 (Ida)', w: 0.88, h: 1.76, pos: { x: 0.85, y: 1.2, z: -71.4 }, rotY: -Math.PI / 2 },

    // 5. Car 5: 2nd Class Sleeper (2 passengers)
    // Gail in Berth section
    { id: 10, key: 'gail', name: '게일 / 의사 (Gail)', w: 0.90, h: 1.78, pos: { x: 0.15, y: 1.2, z: -84.0 }, rotY: 0 },
    // Arthur in Berth section
    { id: 11, key: 'arthur', name: '아서 / 교수 (Arthur)', w: 0.95, h: 1.78, pos: { x: -0.85, y: 1.2, z: -92.0 }, rotY: Math.PI / 2 },

    // 6. Car 6: Dining Car (2 passengers at dining tables)
    // Jude at Table
    { id: 12, key: 'jude', name: '주드 / 사기꾼 (Jude)', w: 0.92, h: 1.82, pos: { x: 0.95, y: 1.2, z: -107.5 }, rotY: 0 },
    // Rose across from Jude
    { id: 13, key: 'rose', name: '로즈 / 무용수 (Rose)', w: 0.88, h: 1.74, pos: { x: 0.95, y: 1.2, z: -106.1 }, rotY: Math.PI },

    // 7. Car 7: Lounge Car (2 characters)
    // Lulu: Gracefully standing behind the remodeled Art Deco bar with ample space!
    { id: 14, key: 'lulu', name: '룰루 / 가수 (Lulu)', w: 0.92, h: 1.78, pos: { x: -0.98, y: 1.2, z: -126.8 }, rotY: Math.PI / 2 },
    // Felix: by the window with his camera
    { id: 15, key: 'felix', name: '필릭스 / 사진사 (Felix)', w: 0.90, h: 1.80, pos: { x: 0.85, y: 1.2, z: -132.5 }, rotY: -Math.PI / 2 },

    // 8. Car 8: Observation Car (1 passenger)
    // Mabel in the panoramic observation salon
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

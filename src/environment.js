// Environment: Railroad Tracks, Moving Telegraph Poles, Parallax Scenery, Steam Particles, Sky
const Environment = (() => {
  let steamParticles = null;
  let poleGroup = null;
  const poleSpacing = 30.0;
  const numPoles = 14;

  const init = (scene) => {
    // 1. Sky & Atmosphere
    scene.background = new THREE.Color(0x090f19);
    scene.fog = new THREE.FogExp2(0x0a101d, 0.0045);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = 40 + Math.random() * 200;
      starPositions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Moonlight
    const moonLight = new THREE.DirectionalLight(0xa5c4e8, 0.5);
    moonLight.position.set(60, 100, 40);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 10;
    moonLight.shadow.camera.far = 300;
    scene.add(moonLight);

    // Distant Moon
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfbfcd4 })
    );
    moon.position.set(180, 140, 120);
    scene.add(moon);

    // Ambient Night Light
    const ambientLight = new THREE.AmbientLight(0x283244, 0.55);
    scene.add(ambientLight);

    // 2. Continuous Railroad Tracks & Ballast (Z = +50m to -230m)
    const trackGroup = new THREE.Group();

    // Gravel Ballast Bed
    const ballastGeo = new THREE.BoxGeometry(4.8, 0.4, 300);
    const ballastMat = new THREE.MeshStandardMaterial({
      color: 0x2b2723,
      roughness: 0.95,
      metalness: 0.1
    });
    const ballast = new THREE.Mesh(ballastGeo, ballastMat);
    ballast.position.set(0, -0.2, -80);
    ballast.receiveShadow = true;
    trackGroup.add(ballast);

    // Steel Rails (Standard American Gauge = 1.435m)
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x88919e,
      roughness: 0.3,
      metalness: 0.9
    });
    [-0.717, 0.717].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 300), railMat);
      rail.position.set(rx, 0.18, -80);
      trackGroup.add(rail);
    });

    // Wooden Railroad Ties (Spaced every 0.65m)
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x2a1a0f,
      roughness: 0.9,
      metalness: 0.1
    });
    const tieGeo = new THREE.BoxGeometry(2.6, 0.14, 0.24);
    for (let tz = 50; tz >= -220; tz -= 0.65) {
      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.position.set(0, 0.05, tz);
      trackGroup.add(tie);
    }

    // Ground Plane (Dusk Prairie / Forest floor)
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x12171c,
      roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.4, -80);
    ground.receiveShadow = true;
    trackGroup.add(ground);

    scene.add(trackGroup);

    // 3. Telegraph Poles with Crossarms along Trackside
    poleGroup = new THREE.Group();
    const matPole = new THREE.MeshStandardMaterial({ color: 0x362516, roughness: 0.9 });
    const matWire = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });

    for (let i = 0; i < numPoles; i++) {
      const pz = 40 - i * poleSpacing;
      const p = new THREE.Group();
      p.position.set(7.5, 0, pz);

      // Main timber pole
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 7.5, 8), matPole);
      mast.position.set(0, 3.75, 0);

      // Crossarms
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.1), matPole);
      arm1.position.set(0, 6.5, 0);
      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.1), matPole);
      arm2.position.set(0, 5.7, 0);

      // Glass insulators
      [-1.0, -0.5, 0.5, 1.0].forEach(ix => {
        const ins = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.04, 0.1, 6),
          new THREE.MeshBasicMaterial({ color: 0x55aa88 })
        );
        ins.position.set(ix, 6.6, 0);
        p.add(ins);
      });

      p.add(mast, arm1, arm2);
      poleGroup.add(p);
    }
    scene.add(poleGroup);

    // 4. Distant Pine Trees and Hill Silhouettes
    const matTree = new THREE.MeshStandardMaterial({ color: 0x0f2419, roughness: 0.9 });
    for (let t = 0; t < 60; t++) {
      const tx = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 80);
      const tz = 50 - Math.random() * 260;
      const th = 8 + Math.random() * 12;

      const tree = new THREE.Mesh(new THREE.ConeGeometry(3.5, th, 5), matTree);
      tree.position.set(tx, th / 2 - 0.4, tz);
      scene.add(tree);
    }

    // 5. Smokestack Steam Smoke Particles
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pData = [];

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 0.4;
      pPos[i * 3 + 1] = 4.8 + Math.random() * 0.5;
      pPos[i * 3 + 2] = 12.0 - Math.random() * 80;

      pData.push({
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.8 + Math.random() * 1.5,
        vz: -20 - Math.random() * 15, // Blown backward by train speed
        life: Math.random() * 3.0,
        maxLife: 3.0
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xdddddd,
      size: 4.5,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    steamParticles = {
      mesh: new THREE.Points(pGeo, pMat),
      geo: pGeo,
      pos: pPos,
      data: pData
    };
    scene.add(steamParticles.mesh);
  };

  const update = (delta, trainSpeed = 24.0) => {
    // 1. Move Telegraph Poles Backward to simulate high-speed forward travel
    if (poleGroup) {
      poleGroup.children.forEach(pole => {
        pole.position.z -= trainSpeed * delta;
        if (pole.position.z < -240) {
          pole.position.z += numPoles * poleSpacing;
        }
      });
    }

    // 2. Animate Steam Particles billowing out of smokestack
    if (steamParticles) {
      const pos = steamParticles.pos;
      const data = steamParticles.data;

      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d.life += delta;

        if (d.life > d.maxLife) {
          // Reset at smokestack top
          d.life = 0;
          pos[i * 3] = (Math.random() - 0.5) * 0.3;
          pos[i * 3 + 1] = 5.0;
          pos[i * 3 + 2] = 12.0;
        } else {
          pos[i * 3] += d.vx * delta;
          pos[i * 3 + 1] += d.vy * delta;
          pos[i * 3 + 2] += (d.vz - trainSpeed) * delta;
        }
      }
      steamParticles.geo.attributes.position.needsUpdate = true;
    }
  };

  return { init, update };
})();

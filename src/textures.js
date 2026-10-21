// Procedural Texture Generator for 1930s Train
const Textures = (() => {
  const createRivetedSteel = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base dark industrial steel
    ctx.fillStyle = '#22252a';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle noise and grime
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const v = Math.floor(Math.random() * 30);
      ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.15)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Plate seams
    ctx.strokeStyle = '#111316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    // Rivets along borders and seams
    const drawRivet = (x, y) => {
      // Shadow
      ctx.beginPath();
      ctx.arc(x + 1, y + 1, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0b0d';
      ctx.fill();
      // Highlight
      ctx.beginPath();
      ctx.arc(x - 1, y - 1, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#4a505b';
      ctx.fill();
      // Center
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#2e333b';
      ctx.fill();
    };

    for (let i = 16; i < 512; i += 32) {
      drawRivet(i, 12);
      drawRivet(i, 500);
      drawRivet(i, 244);
      drawRivet(i, 268);
      drawRivet(12, i);
      drawRivet(500, i);
      drawRivet(244, i);
      drawRivet(268, i);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createBoilerIron = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1b1d20';
    ctx.fillRect(0, 0, 512, 512);

    // Heat stains and soot
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(20 + Math.random() * 25);
      ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.2)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Horizontal boiler bands
    ctx.fillStyle = '#282c33';
    ctx.fillRect(0, 100, 512, 20);
    ctx.fillRect(0, 300, 512, 20);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createWoodPlanks = (color1 = '#4a3319', color2 = '#362410') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const plankHeight = 64;
    for (let y = 0; y < 512; y += plankHeight) {
      ctx.fillStyle = (y / plankHeight) % 2 === 0 ? color1 : color2;
      ctx.fillRect(0, y, 512, plankHeight);

      // Wood grain lines
      for (let i = 0; i < 40; i++) {
        const lineY = y + Math.random() * plankHeight;
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.bezierCurveTo(150, lineY + (Math.random() - 0.5) * 8, 350, lineY + (Math.random() - 0.5) * 8, 512, lineY);
        ctx.stroke();
      }

      // Plank separator gap
      ctx.fillStyle = '#150c05';
      ctx.fillRect(0, y + plankHeight - 2, 512, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createMahogany = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich deep reddish-brown mahogany
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#421a0d');
    grad.addColorStop(0.5, '#562312');
    grad.addColorStop(1, '#3b170b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Fine woodgrain
    for (let i = 0; i < 80; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = 'rgba(25, 8, 4, 0.18)';
      ctx.lineWidth = 1 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(180, y + (Math.random() - 0.5) * 6, 360, y + (Math.random() - 0.5) * 6, 512, y);
      ctx.stroke();
    }

    // Polished varnish sheen
    for (let i = 0; i < 15; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = 'rgba(255, 200, 150, 0.05)';
      ctx.lineWidth = 2 + Math.random() * 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createCarpet = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Deep burgundy carpet base
    ctx.fillStyle = '#4a0e17';
    ctx.fillRect(0, 0, 256, 256);

    // Gold/amber art deco geometric diamond pattern
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 2;

    const size = 32;
    for (let x = 0; x <= 256; x += size) {
      for (let y = 0; y <= 256; y += size) {
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x + size / 2, y + size);
        ctx.lineTo(x, y + size / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = 'rgba(197, 155, 39, 0.15)';
        ctx.fill();
      }
    }

    // Fabric weave noise
    for (let i = 0; i < 5000; i++) {
      const px = Math.random() * 256;
      const py = Math.random() * 256;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)';
      ctx.fillRect(px, py, 1, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createGaugeDial = (title = 'STEAM PSI', maxVal = 300) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Brass/white face
    ctx.fillStyle = '#f2edd9';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    // Dark outer rim
    ctx.strokeStyle = '#2b2317';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Inner ring
    ctx.strokeStyle = '#554836';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(128, 128, 105, 0, Math.PI * 2);
    ctx.stroke();

    // Tick marks and numbers
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const numTicks = 20;

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= numTicks; i++) {
      const angle = startAngle + (i / numTicks) * (endAngle - startAngle);
      const isMajor = i % 5 === 0;
      const r1 = 104;
      const r2 = isMajor ? 88 : 95;

      const x1 = 128 + Math.cos(angle) * r1;
      const y1 = 128 + Math.sin(angle) * r1;
      const x2 = 128 + Math.cos(angle) * r2;
      const y2 = 128 + Math.sin(angle) * r2;

      ctx.beginPath();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (isMajor) {
        const numVal = Math.round((i / numTicks) * maxVal);
        const tx = 128 + Math.cos(angle) * 74;
        const ty = 128 + Math.sin(angle) * 74;
        ctx.fillText(numVal.toString(), tx, ty);
      }
    }

    // Gauge Title Text
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.fillText(title, 128, 165);

    // Indicator needle pointing at ~210 PSI (typical operating pressure)
    const needleAngle = startAngle + (0.7) * (endAngle - startAngle);
    ctx.strokeStyle = '#991111';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(128 + Math.cos(needleAngle) * 90, 128 + Math.sin(needleAngle) * 90);
    ctx.stroke();

    // Center brass cap
    ctx.beginPath();
    ctx.arc(128, 128, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#b58b29';
    ctx.fill();
    ctx.strokeStyle = '#5c430e';
    ctx.lineWidth = 2;
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  };

  const createWaterGauge = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Brass frame
    ctx.fillStyle = '#a6822b';
    ctx.fillRect(0, 0, 64, 256);

    // Glass tube column in center
    ctx.fillStyle = '#1a2b35';
    ctx.fillRect(16, 16, 32, 224);

    // Water level (lower 60% with liquid reflection)
    const waterGrad = ctx.createLinearGradient(16, 0, 48, 0);
    waterGrad.addColorStop(0, '#2d6575');
    waterGrad.addColorStop(0.5, '#489bb3');
    waterGrad.addColorStop(1, '#2d6575');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(16, 100, 32, 140);

    // Meniscus
    ctx.fillStyle = '#7cdcf5';
    ctx.fillRect(16, 98, 32, 4);

    // Glass highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(20, 16, 4, 224);

    // Brass guard rods
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(12, 0, 3, 256);
    ctx.fillRect(49, 0, 3, 256);

    return new THREE.CanvasTexture(canvas);
  };

  const createFireTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 140, 10, 128, 128, 120);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, '#ffe066');
    grad.addColorStop(0.5, '#ff6b08');
    grad.addColorStop(0.8, '#b81400');
    grad.addColorStop(1, '#200200');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Burning coal ember chunks
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 256;
      const y = 80 + Math.random() * 160;
      const r = 4 + Math.random() * 12;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? '#ffea88' : '#1a0500';
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

  const createCoalTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f1114';
    ctx.fillRect(0, 0, 256, 256);

    // Coal lumps
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const size = 6 + Math.random() * 16;
      const gray = Math.floor(10 + Math.random() * 35);

      ctx.fillStyle = `rgb(${gray}, ${gray + 2}, ${gray + 5})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size * (0.8 + Math.random() * 0.4), y + (Math.random() - 0.5) * size);
      ctx.lineTo(x + size * 0.7, y + size * 0.9);
      ctx.lineTo(x - size * 0.2, y + size * 0.6);
      ctx.closePath();
      ctx.fill();

      // Specular edge
      ctx.strokeStyle = `rgba(200, 220, 255, ${0.1 + Math.random() * 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createExteriorGreen = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Classic 1930s Pullman Dark Olive Green
    ctx.fillStyle = '#1b261e';
    ctx.fillRect(0, 0, 512, 512);

    // Gold pinstripe
    ctx.strokeStyle = '#c5a044';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(512, 80);
    ctx.moveTo(0, 432);
    ctx.lineTo(512, 432);
    ctx.stroke();

    // Rivet seams
    for (let x = 16; x < 512; x += 32) {
      ctx.fillStyle = '#0f1511';
      ctx.fillRect(x, 70, 4, 4);
      ctx.fillRect(x, 440, 4, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createCrateTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8c6b45';
    ctx.fillRect(0, 0, 256, 256);

    // Plank lines
    ctx.strokeStyle = '#543e26';
    ctx.lineWidth = 3;
    for (let y = 0; y <= 256; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }

    // Diagonal bracing
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#785b3b';
    ctx.strokeRect(6, 6, 244, 244);
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(246, 246);
    ctx.stroke();

    // Vintage Stencil
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#362412';
    ctx.textAlign = 'center';
    ctx.fillText('FRAGILE', 128, 120);
    ctx.font = 'bold 12px monospace';
    ctx.fillText('RAILWAY EXPRESS', 128, 145);

    return new THREE.CanvasTexture(canvas);
  };

  const createBlueWhiteTile = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base off-white porcelain ceramic tile
    ctx.fillStyle = '#f2f4f7';
    ctx.fillRect(0, 0, 256, 256);

    const tileSize = 32;
    // Octagonal white tiles with deep cobalt blue diamond corner cabochons (Photo 5)
    for (let y = 0; y < 256; y += tileSize) {
      for (let x = 0; x < 256; x += tileSize) {
        // Subtle tile surface gradient
        ctx.strokeStyle = '#c5ccd6';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

        // Cobalt blue diamond in the corner
        ctx.fillStyle = '#1c4278';
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x, y + 5);
        ctx.lineTo(x - 5, y);
        ctx.closePath();
        ctx.fill();

        // Delftware floral center accent on every other tile
        if ((x / tileSize + y / tileSize) % 2 === 0) {
          ctx.fillStyle = 'rgba(28, 66, 120, 0.45)';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createArtDecoMosaic = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Rich dark charcoal / black marble base
    ctx.fillStyle = '#121417';
    ctx.fillRect(0, 0, 256, 256);

    // Intricate gold & ivory mosaic tesserae (Photo 4)
    ctx.strokeStyle = '#c69a42';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 240, 240);
    ctx.strokeRect(18, 18, 220, 220);

    // Concentric diamond fans
    const drawFan = (cx, cy) => {
      for (let r = 12; r <= 48; r += 12) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = r % 24 === 0 ? 'rgba(198, 154, 66, 0.65)' : 'rgba(235, 230, 218, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };
    drawFan(64, 64);
    drawFan(192, 64);
    drawFan(64, 192);
    drawFan(192, 192);
    drawFan(128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const createStainedGlass = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    // Translucent opal cream glass background
    ctx.fillStyle = '#e5dec8';
    ctx.fillRect(0, 0, 256, 384);

    // Outer border lead came
    ctx.strokeStyle = '#22201d';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(128, 192, 118, 180, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Cobalt blue outer ring segments
    ctx.fillStyle = '#1a3c75';
    ctx.beginPath();
    ctx.ellipse(128, 192, 110, 172, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner opal field
    ctx.fillStyle = '#f0ebd8';
    ctx.beginPath();
    ctx.ellipse(128, 192, 88, 145, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brilliant Ruby Red central diamond (Photo 4)
    ctx.fillStyle = '#a61224';
    ctx.beginPath();
    ctx.moveTo(128, 70);
    ctx.lineTo(200, 192);
    ctx.lineTo(128, 314);
    ctx.lineTo(56, 192);
    ctx.closePath();
    ctx.fill();

    // Inner gold lozenge
    ctx.fillStyle = '#d49b28';
    ctx.beginPath();
    ctx.moveTo(128, 120);
    ctx.lineTo(172, 192);
    ctx.lineTo(128, 264);
    ctx.lineTo(84, 192);
    ctx.closePath();
    ctx.fill();

    // Dark Lead came outlines
    ctx.strokeStyle = '#22201d';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Radiating lead lines
    ctx.beginPath();
    ctx.moveTo(128, 12);
    ctx.lineTo(128, 372);
    ctx.moveTo(10, 192);
    ctx.lineTo(246, 192);
    ctx.moveTo(38, 72);
    ctx.lineTo(218, 312);
    ctx.moveTo(218, 72);
    ctx.lineTo(38, 312);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  };

  const createGreenGrating = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Pullman forest green slatted wood base (Photo 7)
    ctx.fillStyle = '#1b3d2b';
    ctx.fillRect(0, 0, 256, 256);

    const slotSize = 16;
    const holeSize = 7;
    // Square drain holes in duckboard
    for (let y = 0; y < 256; y += slotSize) {
      // Wood slat edge highlight
      ctx.strokeStyle = '#2d5a42';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, y, 256, slotSize);

      for (let x = 0; x < 256; x += slotSize) {
        // Deep shadow inside drainage holes
        ctx.fillStyle = '#0a140e';
        ctx.fillRect(x + 4, y + 4, holeSize, holeSize);

        // Highlight rim on hole edge
        ctx.strokeStyle = '#142a1d';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 4, y + 4, holeSize, holeSize);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  return {
    rivetedSteel: createRivetedSteel(),
    boilerIron: createBoilerIron(),
    woodFloor: createWoodPlanks('#533c24', '#3d2b18'),
    mahogany: createMahogany(),
    carpet: createCarpet(),
    steamGauge: createGaugeDial('BOILER PSI', 300),
    brakeGauge: createGaugeDial('AIR BRAKE', 140),
    speedGauge: createGaugeDial('SPEED MPH', 100),
    waterGauge: createWaterGauge(),
    fireTexture: createFireTexture(),
    coal: createCoalTexture(),
    exteriorGreen: createExteriorGreen(),
    crate: createCrateTexture(),
    blueWhiteTile: createBlueWhiteTile(),
    artDecoMosaic: createArtDecoMosaic(),
    stainedGlass: createStainedGlass(),
    greenGrating: createGreenGrating()
  };
})();

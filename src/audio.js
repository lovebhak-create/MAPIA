// Web Audio API Sound Synthesizer for 1930s Steam Train
const SoundManager = (() => {
  let ctx = null;
  let isMuted = false;
  let chugTimer = null;
  let isRunning = false;
  let fireGain = null;
  let railsGain = null;

  const init = () => {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  };

  const startAmbient = () => {
    init();
    if (!ctx || isRunning) return;
    isRunning = true;

    // 1. Continuous Firebox Roar / Low Engine Rumble
    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      fireGain = ctx.createGain();
      fireGain.gain.setValueAtTime(isMuted ? 0 : 0.18, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(fireGain);
      fireGain.connect(ctx.destination);
      whiteNoise.start();

      // 2. Rail Click-Clack loop
      startChugLoop();
    } catch (e) {
      console.warn('Audio init error:', e);
    }
  };

  const startChugLoop = () => {
    let step = 0;
    const chugInterval = 340; // milliseconds per stroke

    const playChugStroke = () => {
      if (!ctx || isMuted || !isRunning) return;

      const t = ctx.currentTime;
      // White noise burst with envelope for steam chuff
      const burstLen = 0.12;
      const osc = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * burstLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      osc.buffer = buf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(step % 2 === 0 ? 320 : 260, t);
      bp.Q.setValueAtTime(2.5, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + burstLen);

      osc.connect(bp);
      bp.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);

      // Iron rail joint click-clack on every 4th stroke
      if (step % 4 === 0) {
        playRailClick(t + 0.04);
        playRailClick(t + 0.12);
      }

      step = (step + 1) % 8;
    };

    chugTimer = setInterval(playChugStroke, chugInterval);
  };

  const playRailClick = (t) => {
    if (!ctx || isMuted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.03);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  };

  // Authentic 1930s 3-Chime Steam Whistle
  const playWhistle = () => {
    init();
    if (!ctx || isMuted) return;

    const t = ctx.currentTime;
    // Typical PRR / American 3-chime chords: ~470 Hz (A#4), ~587 Hz (D5), ~700 Hz (F5)
    const freqs = [466.16, 587.33, 700.0];
    const duration = 2.2;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Slight steam pressure wobble
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.015, t + 0.4);
      osc.frequency.linearRampToValueAtTime(freq * 0.985, t + duration * 0.8);
      osc.frequency.linearRampToValueAtTime(freq * 0.94, t + duration);

      // Lowpass to mellow out harsh sawtooth into rich steam harmonics
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400 + idx * 200, t);

      // Envelope
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.15);
      gain.gain.setValueAtTime(0.12, t + duration - 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    });

    // Whistle steam rush noise
    const noiseLen = duration;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(800, t);
    bp.Q.setValueAtTime(3.0, t);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.05, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(bp);
    bp.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + duration);
  };

  const playDoorSound = () => {
    init();
    if (!ctx || isMuted) return;
    const t = ctx.currentTime;
    // Heavy wooden/metal sliding latch sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  };

  let waterGain = null;
  let waterSource = null;

  const playWaterSound = (start) => {
    init();
    if (!ctx) return;
    if (start) {
      if (waterSource) return;
      try {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        waterSource = ctx.createBufferSource();
        waterSource.buffer = noiseBuffer;
        waterSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(850, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        waterGain = ctx.createGain();
        waterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        waterGain.gain.exponentialRampToValueAtTime(isMuted ? 0.001 : 0.14, ctx.currentTime + 0.15);

        waterSource.connect(filter);
        filter.connect(waterGain);
        waterGain.connect(ctx.destination);
        waterSource.start();
      } catch (e) {}
    } else {
      if (waterGain && waterSource) {
        try {
          waterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          setTimeout(() => {
            if (waterSource) {
              try { waterSource.stop(); } catch (e) {}
              waterSource = null;
            }
          }, 150);
        } catch (e) {}
      }
    }
  };

  const toggleMute = () => {
    isMuted = !isMuted;
    if (fireGain && ctx) {
      fireGain.gain.setValueAtTime(isMuted ? 0 : 0.18, ctx.currentTime);
    }
    if (waterGain && ctx) {
      waterGain.gain.setValueAtTime(isMuted ? 0 : 0.14, ctx.currentTime);
    }
    return isMuted;
  };

  return {
    init,
    startAmbient,
    playWhistle,
    playDoorSound,
    playWaterSound,
    toggleMute,
    getIsMuted: () => isMuted
  };
})();

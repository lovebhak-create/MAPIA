// src/audio.js - 1930s Train Audio & Background Music Engine
// Authentic rhythmic rail clatter ('덜커덩 덜커덩') & User-provided Lo-Fi/Jazz BGM

const SoundManager = (() => {
  let ctx = null;
  let isMuted = false;
  let isRunning = false;

  // Real Audio Elements
  let trainAudio = null;
  let bgmAudio = null;
  let bgmVolume = 0.22; // User's custom music - pleasant, clear, warm
  let trainVolume = 0.18; // Cozy rhythmic '덜커덩... 덜커덩...' without any screech

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

  // Start realistic train rhythmic clatter ('덜커덩') and user's BGM
  const startAmbient = () => {
    init();
    if (isRunning) return;
    isRunning = true;

    // 1. Authentic Rhythmic Train Joint Sound ('덜커덩... 덜커덩...', zero screech/chalkboard scratching)
    try {
      if (!trainAudio) {
        trainAudio = new Audio('assets/audio/train_clack.wav');
        trainAudio.loop = true;
        trainAudio.volume = isMuted ? 0 : trainVolume;
      }
      trainAudio.play().catch(e => {
        console.log('Train ambient audio autoplay waiting for user interaction:', e.message);
      });
    } catch (e) {
      console.warn('Failed to start train clack audio:', e);
    }

    // 2. User's BGM (Lo-Fi/Jazz song uploaded by user)
    try {
      if (!bgmAudio) {
        bgmAudio = new Audio('assets/audio/bgm_default.mp3');
        bgmAudio.loop = true;
        bgmAudio.volume = isMuted ? 0 : bgmVolume;
      }
      bgmAudio.play().catch(e => {
        console.log('BGM autoplay waiting for user interaction:', e.message);
      });
    } catch (e) {
      console.warn('Failed to start BGM audio:', e);
    }
  };

  // Set Custom Background Music (e.g. from musiccreator.ai)
  const setCustomBgm = (audioSource) => {
    try {
      if (bgmAudio) {
        bgmAudio.pause();
      }
      bgmAudio = new Audio(audioSource);
      bgmAudio.loop = true;
      bgmAudio.volume = isMuted ? 0 : bgmVolume;
      bgmAudio.play().then(() => {
        console.log('Custom BGM playing successfully!');
      }).catch(err => {
        console.warn('Custom BGM playback error:', err);
      });
    } catch (e) {
      console.error('Error setting custom BGM:', e);
    }
  };

  // Adjust BGM Volume
  const setBgmVolume = (vol) => {
    bgmVolume = Math.max(0, Math.min(1.0, vol));
    if (bgmAudio && !isMuted) {
      bgmAudio.volume = bgmVolume;
    }
  };

  // Adjust Train Volume
  const setTrainVolume = (vol) => {
    trainVolume = Math.max(0, Math.min(1.0, vol));
    if (trainAudio && !isMuted) {
      trainAudio.volume = trainVolume;
    }
  };

  // Authentic 1930s 3-Chime Steam Whistle
  const playWhistle = () => {
    init();
    if (!ctx || isMuted) return;

    const t = ctx.currentTime;
    const freqs = [466.16, 587.33, 700.0];
    const duration = 2.2;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.015, t + 0.4);
      osc.frequency.linearRampToValueAtTime(freq * 0.985, t + duration * 0.8);
      osc.frequency.linearRampToValueAtTime(freq * 0.94, t + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400 + idx * 200, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.10, t + 0.15);
      gain.gain.setValueAtTime(0.10, t + duration - 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    });
  };

  const playDoorSound = () => {
    init();
    if (!ctx || isMuted) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  };

  const toggleMute = () => {
    isMuted = !isMuted;
    if (trainAudio) {
      trainAudio.volume = isMuted ? 0 : trainVolume;
    }
    if (bgmAudio) {
      bgmAudio.volume = isMuted ? 0 : bgmVolume;
    }
    return isMuted;
  };

  // Add Drag-and-Drop and File Input Listener for Music Files (musiccreator.ai MP3)
  const setupMusicDropHandler = () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.ogg') || file.name.endsWith('.wav')) {
          const reader = new FileReader();
          reader.onload = (readEvent) => {
            const dataUrl = readEvent.target.result;
            try {
              localStorage.setItem('custom_bgm_data', dataUrl);
            } catch (storageErr) {
              console.warn('Storage limit for BGM, playing directly:', storageErr);
            }
            setCustomBgm(dataUrl);
            const textEl = document.getElementById('bgm-text');
            if (textEl) textEl.textContent = `배경음악: ${file.name.slice(0, 15)}…`;
            alert(`🎵 '${file.name}' 배경음악이 성공적으로 적용되었습니다!`);
          };
          reader.readAsDataURL(file);
        }
      }
    });

    // File Input Picker binding
    document.addEventListener('DOMContentLoaded', () => {
      bindHudControls();
    });
    // In case DOM is already loaded
    setTimeout(bindHudControls, 200);
  };

  const bindHudControls = () => {
    const fileInput = document.getElementById('bgm-file-input');
    if (fileInput && !fileInput.dataset.bound) {
      fileInput.dataset.bound = 'true';
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (readEvent) => {
            const dataUrl = readEvent.target.result;
            try {
              localStorage.setItem('custom_bgm_data', dataUrl);
            } catch (err) {}
            setCustomBgm(dataUrl);
            const textEl = document.getElementById('bgm-text');
            if (textEl) textEl.textContent = `배경음악: ${file.name.slice(0, 15)}…`;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const bgmToggle = document.getElementById('btn-bgm-toggle');
    const bgmIcon = document.getElementById('bgm-icon');
    const bgmText = document.getElementById('bgm-text');
    if (bgmToggle && !bgmToggle.dataset.bound) {
      bgmToggle.dataset.bound = 'true';
      bgmToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgmAudio) {
          if (bgmAudio.paused) {
            bgmAudio.play();
            if (bgmIcon) bgmIcon.textContent = '🎵';
            if (bgmText) bgmText.textContent = '배경음악 작게 켬';
          } else {
            bgmAudio.pause();
            if (bgmIcon) bgmIcon.textContent = '🔇';
            if (bgmText) bgmText.textContent = '배경음악 꺼짐';
          }
        } else {
          startAmbient();
        }
      });
    }
  };

  if (typeof window !== 'undefined') {
    setupMusicDropHandler();
    const onFirstUserAction = () => {
      startAmbient();
      window.removeEventListener('click', onFirstUserAction);
      window.removeEventListener('keydown', onFirstUserAction);
      window.removeEventListener('touchstart', onFirstUserAction);
    };
    window.addEventListener('click', onFirstUserAction);
    window.addEventListener('keydown', onFirstUserAction);
    window.addEventListener('touchstart', onFirstUserAction);
  }

  return {
    init,
    startAmbient,
    playWhistle,
    playDoorSound,
    toggleMute,
    setCustomBgm,
    setBgmVolume,
    setTrainVolume,
    getBgmAudio: () => bgmAudio,
    getIsMuted: () => isMuted
  };
})();

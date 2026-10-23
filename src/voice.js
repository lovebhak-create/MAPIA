// src/voice.js - 1930s Train Character Voice & Web Speech TTS Engine
// Provides distinct MBTI and gender-specific voices for all 16 train characters!

const VoiceManager = (() => {
  let isVoiceEnabled = true;
  let voices = [];
  let isVoicesLoaded = false;
  let lastSpokenText = '';
  let lastCharKey = 'bram';

  // 16 Character Distinct Voice Configurations (Fast, natural, crisp speech rates!)
  const charVoiceConfigs = {
    // 1. Bram: INFP / Male / 21 / Timid literary student -> high pitch, fast nervous tempo
    bram: { gender: 'male', pitch: 1.25, rate: 1.28, name: 'Bram' },
    
    // 2. Ward: ISTP / Male / 42 / Cynical detective -> deep baritone, raspy, blunt, steady
    ward: { gender: 'male', pitch: 0.65, rate: 1.30, name: 'Ward' },
    
    // 3. Nell: ISFJ / Female / 35 / Polite seamstress -> warm, gentle, clear tempo
    nell: { gender: 'female', pitch: 1.15, rate: 1.32, name: 'Nell' },
    
    // 4. Nurse K: ISTJ / Female / 28 / Strict clinical nurse -> flat, regulated, fast, clipped syllables
    nurse_k: { gender: 'female', pitch: 1.00, rate: 1.45, name: 'Nurse K' },
    
    // 5. Cade: ESTP / Male / 29 / Aggressive stoker -> low, loud, fiery, fast
    cade: { gender: 'male', pitch: 0.72, rate: 1.48, name: 'Cade' },
    
    // 6. Harlan: ENTJ / Male / 55 / Ruthless monopoly baron -> deep, cold, deliberate baritone
    harlan: { gender: 'male', pitch: 0.70, rate: 1.22, name: 'Harlan' },
    
    // 7. Jude: ESFP / Male / 31 / Flamboyant gambler -> cheerful, lively, rapid-fire cadence
    jude: { gender: 'male', pitch: 1.10, rate: 1.55, name: 'Jude' },
    
    // 8. Clara: INFJ / Female / 27 / Mystery gothic novelist -> breathy, low, dramatic mystery cadence
    clara: { gender: 'female', pitch: 0.85, rate: 1.20, name: 'Clara' },
    
    // 9. Mabel: ESTJ / Female / 48 / Snobbish aristocrat -> high-strung, haughty, sharp, crisp
    mabel: { gender: 'female', pitch: 1.30, rate: 1.40, name: 'Mabel' },
    
    // 10. Gail: ENFJ / Male / 62 / Benevolent doctor -> warm grandfatherly, resonant
    gail: { gender: 'male', pitch: 0.80, rate: 1.22, name: 'Gail' },
    
    // 11. Arthur: INTP / Male / 58 / Eccentric archeologist -> cracked academic tone, excitable, fast
    arthur: { gender: 'male', pitch: 1.15, rate: 1.52, name: 'Arthur' },
    
    // 12. Rose: ISFP / Female / 23 / Melancholic cabaret dancer -> sultry, delicate, melodic, sweet
    rose: { gender: 'female', pitch: 1.20, rate: 1.30, name: 'Rose' },
    
    // 13. Lulu: ENTP / Female / 26 / Vain Broadway diva -> high, theatrical, rapid, diva flair
    lulu: { gender: 'female', pitch: 1.35, rate: 1.52, name: 'Lulu' },
    
    // 14. Felix: ENFP / Male / 25 / Press photographer -> bouncy, boyish excitement, breathless tempo
    felix: { gender: 'male', pitch: 1.20, rate: 1.58, name: 'Felix' },
    
    // 15. Ida: INTJ / Female / 30 / Cold secretary -> measured, emotionless, machine-like cadence
    ida: { gender: 'female', pitch: 0.92, rate: 1.42, name: 'Ida' },
    
    // 16. Elias: ESFJ / Male / 34 / Tabloid journalist -> fast-talking, urgent, sensationalist
    elias: { gender: 'male', pitch: 1.05, rate: 1.60, name: 'Elias' }
  };

  const loadVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) isVoicesLoaded = true;
  };

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Select optimal Korean voice based on gender
  const getVoiceForGender = (gender) => {
    if (!voices || voices.length === 0) loadVoices();
    if (!voices || voices.length === 0) return null;

    const krVoices = voices.filter(v => (v.lang && (v.lang.startsWith('ko') || v.lang.startsWith('KO'))));
    if (krVoices.length === 0) {
      // Fallback to any voice if no Korean voice is installed
      return voices[0];
    }

    if (gender === 'female') {
      const female = krVoices.find(v => (
        v.name.includes('SunHi') ||
        v.name.includes('Female') ||
        v.name.includes('여성') ||
        v.name.includes('Heami') ||
        v.name.includes('Girl')
      ));
      if (female) return female;
    } else {
      const male = krVoices.find(v => (
        v.name.includes('InJoon') ||
        v.name.includes('Male') ||
        v.name.includes('남성') ||
        v.name.includes('Boy')
      ));
      if (male) return male;
    }

    return krVoices[0];
  };

  // Speak dialogue line
  const speak = (charKey, text) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!text || typeof text !== 'string') return;

    lastCharKey = charKey;
    lastSpokenText = text;

    // Filter out parenthesized stage directions like (겁에 질려 손을 떤다) or [웃음]
    let cleanText = text
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/…/g, '... ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior speech immediately

      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = 'ko-KR';

      const config = charVoiceConfigs[charKey] || { gender: 'male', pitch: 1.0, rate: 1.0 };
      utter.pitch = Math.max(0.5, Math.min(2.0, config.pitch));
      utter.rate = Math.max(0.5, Math.min(2.0, config.rate));
      utter.volume = 1.0;

      const matchedVoice = getVoiceForGender(config.gender);
      if (matchedVoice) {
        utter.voice = matchedVoice;
      }

      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  const replay = () => {
    if (lastSpokenText && lastCharKey) {
      speak(lastCharKey, lastSpokenText);
    }
  };

  const stop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleVoice = () => {
    isVoiceEnabled = !isVoiceEnabled;
    if (!isVoiceEnabled) {
      stop();
    }
    return isVoiceEnabled;
  };

  const isEnabled = () => isVoiceEnabled;

  return {
    speak,
    replay,
    stop,
    toggleVoice,
    isEnabled,
    charVoiceConfigs
  };
})();

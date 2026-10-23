// Dialogue Manager: Minimal Floating Speech Bubble UI with Zero-Friction 1930s MBTI Tiki-Taka
// Fixes:
// 1. Completely eliminated the annoying API key popup prompt - zero setup required, works seamlessly!
// 2. Fixed NLP matching: "왜냐하면" is never misidentified as "왜?"; exact recognition of "조끼", "옷", "마음에 들지 않아", etc.
// 3. Deep context-aware conversational tiki-taka for all 16 MBTI characters across clothes critique, praise, activities, jokes, dangers, and mysteries.
// 4. Name is hidden as '???' until the character actually introduces themselves in dialogue!

const DialogueManager = (() => {
  let isDialogueOpen = false;
  let activeChar = null;
  let chatHistory = [];
  let isGenerating = false;
  let ambientCooldown = 20.0;
  let lastUsedResponseIndex = {};
  let revealedNames = {}; // charKey -> boolean (true once introduced)

  // 16 Characters Knowledge Base: 16 Distinct MBTI Types, 1930s Occupations, and Personalities
  const charactersDB = {
    cade: {
      id: 1, key: 'cade', name: '케이드', nameEn: 'Cade',
      job: '노동자 (기관차 화부)', jobEn: 'Worker / Stoker', car: '1호차 운전실 & 탄수차',
      mbti: 'ISFP',
      personality: '과묵함, 무뚝뚝함, 혼자 일하는 것을 좋아함, 간섭을 극도로 싫어함',
      secrets: '석탄 창고 구석에 남들에게 들키고 싶지 않은 낡은 가죽 가방을 숨겨둠',
      speechTone: '퉁명스럽고 거친 노동자 말투 (~하오, ~쇼, "바쁜 거 안 보이오?")',
      introLine: '…난 케이드요. 이 기차의 화부이자 노동자지. 1호차 석탄을 떼는 일로 밥 벌어먹고 사오. 질문 끝났으면 삽질 방해 말고 가보쇼.',
      greetingLine: '…(삽을 바닥에 툭 내려놓고 땀을 닦으며) 여긴 일반 승객이 올 곳이 아니오. 볼일이라도 있소?'
    },

    ward: {
      id: 2, key: 'ward', name: '워드', nameEn: 'Ward',
      job: '형사', jobEn: 'Detective', car: '2호차 수하물차',
      mbti: 'ISTP',
      personality: '냉소적, 과묵함, 날카로운 직감, 법규보다 현장 본능을 믿음',
      secrets: '이 열차에 탄 거물 승객의 살인 청부 의뢰 첩보를 입수하고 비밀 추적 중',
      speechTone: '낮고 묵직한 하드보일드 형사 말투 ("…", "용건만 대", "내 수사에 알짱거리지 마라")',
      introLine: '워드 형사다. 시카고 시경 소속이지. 이 열차에 탄 이유는… 공무다. 민간인이 깊게 알 필요는 없어. 수상한 짓 하지 않는 게 네 신상에 좋을 거다.',
      greetingLine: '…(시가 연기를 길게 내뿜으며 훑어본다) 무슨 일이지? 수사관 앞에서 어물쩍거리지 말고 용건만 말해.'
    },

    bram: {
      id: 3, key: 'bram', name: '브람', nameEn: 'Bram',
      job: '대학생', jobEn: 'College Student', car: '3호차 일반 객차',
      mbti: 'INFP',
      personality: '소심함, 이상주의적, 감수성 풍부, 남의 시선에 극도로 민감하고 불안해함',
      secrets: '작가가 되기 위해 학비를 몰래 챙겨 시카고로 도망치는 중',
      speechTone: '정중하고 조심스러우며 말끝을 흐리는 청년 말투 ("저기…", "그게…", "죄송합니다만…")',
      introLine: '아, 저, 저 말씀이신가요? 제 이름은 브람이에요… 동부 대학에서 영문학을 전공하는 학생입니다. 그… 시카고로 가는 길인데 열차 분위기가 좀 묘해서 긴장되네요…',
      greetingLine: '네…? 왜, 왜 그러세요? 제가 뭐 잘못했나요…?'
    },

    nell: {
      id: 4, key: 'nell', name: '넬', nameEn: 'Nell',
      job: '재봉사', jobEn: 'Seamstress', car: '3호차 일반 객차',
      mbti: 'ISFJ',
      personality: '온순함, 성실함, 배려심 깊음, 칭찬에 수줍어함, 갈등을 두려워함',
      secrets: '1등석 귀부인 메이벨의 이브닝드레스 안감에 묻은 의문의 핏자국을 목격함',
      speechTone: '나긋나긋하고 사근사근한 조용한 존댓말 ("~해요", "~답니다", "어머나…")',
      introLine: '안녕하세요, 손님. 전 넬이라고 해요. 바느질과 수선을 하는 재봉사랍니다. 혹시 단추가 떨어졌거나 옷단이 뜯기셨다면 제가 봐드릴 수 있어요.',
      greetingLine: '어머, 안녕하세요. 날씨가 참 춥죠? 덜컹거리는 기차 안이라 바늘귀 꿰기가 쉽지 않네요. 무슨 일이신가요?'
    },

    nurse_k: {
      id: 5, key: 'nurse_k', name: '케이', nameEn: 'K',
      job: '간호사', jobEn: 'Nurse', car: '3호차 일반 객차',
      mbti: 'ISTJ',
      personality: '철저한 규칙 준수, 사적인 감정 배제, 엄격한 책임감, 헛소문 혐오',
      secrets: '이 열차에 격리 치료가 필요한 특이 전염병 의심 환자가 있다는 극비 전보를 받음',
      speechTone: '군더더기 없고 단호한 사무적 어조 ("~하십시오", "~입니다", "원칙상 규정 위반입니다")',
      introLine: '간호사 케이입니다. 응급 구호 및 승객들의 의료 지원을 담당하고 있죠. 환자가 아니시라면 복도를 막지 마시고 자리에 앉아 주십시오.',
      greetingLine: '환자분이십니까? 체온 측정이나 붕대 처치가 필요한 게 아니라면 사적인 대화로 복도를 혼잡하게 만들지 마십시오.'
    },

    elias: {
      id: 6, key: 'elias', name: '엘리아스', nameEn: 'Elias',
      job: '기자', jobEn: 'Journalist', car: '3호차 일반 객차',
      mbti: 'ENTP',
      personality: '집요함, 뻔뻔함, 도발적, 재치 있음, 논쟁을 즐김, 특종 야망',
      secrets: '할란 회장의 불법 주가 조작 및 정관계 뇌물 장부의 결정적 사본을 손에 넣음',
      speechTone: '능글맞고 빠른 어조, 빈정거림과 도발 섞인 말투 ("거참", "~잖소?", "특종 냄새가 솔솔 나는데?")',
      introLine: '헤헤, 신문 1면에 실리고 싶으신가? 난 데일리 모닝의 기자, 엘리아스요! 사람 냄새 나는 특종을 쫓고 있지. 당신, 뭔가 감추고 있는 얼굴인데… 한 줄 털어놔 보시지?',
      greetingLine: '오호라, 거친 눈빛의 승객 양반이군! 내 취재 수첩에 당신 이름을 적어 넣을 이유라도 생겼소? 재미있는 소문이라도 있으면 풀어보시오.'
    },

    harlan: {
      id: 7, key: 'harlan', name: '할란', nameEn: 'Harlan',
      job: '사업가', jobEn: 'Businessman', car: '4호차 1등석 침대차',
      mbti: 'ENTJ',
      personality: '오만함, 권위적, 시간 낭비 혐오, 결단력, 자본주의 맹신',
      secrets: '철도 노선 매입을 위해 경쟁사 사장을 청부 파멸시키려다 실패해 비밀리에 피신 중',
      speechTone: '중후하고 고압적인 상류층 말투 ("~시오", "~인 거요?", "내 시간을 낭비하지 마시오")',
      introLine: '난 할란 코퍼레이션의 대표, 사업가 할란이오. 내 1초는 당신 하루 일당보다 가치가 있지. 1등석 스위트룸까지 찾아와서 잡담을 떨 생각이라면 당장 비서 아이다를 통해 약속부터 잡으시오.',
      greetingLine: '노크도 없이 남의 전용칸을 기웃거리다니 예의가 없군. 내 귀중한 시간을 뺏을 만한 제안이 아니라면 당장 물러나시오.'
    },

    clara: {
      id: 8, key: 'clara', name: '클라라', nameEn: 'Clara',
      job: '소설가', jobEn: 'Novelist', car: '4호차 1등석 침대차',
      mbti: 'INFJ',
      personality: '신비로움, 깊은 통찰력, 관찰벽, 침착함, 인간의 이면을 꿰뚫어 봄',
      secrets: '자신의 소설 속 트릭을 완벽히 모방한 실제 살인 사건의 범인을 쫓아 탑승함',
      speechTone: '우아하고 나지막하며 문학적인 어조 ("후훗…", "~인 법이죠", "그 눈빛 속에 감춰진 이야기는…")',
      introLine: '어둠 속을 달리는 기차, 그리고 침묵하는 사람들… 전 미스터리 추리 소설을 쓰는 클라라라고 해요. 당신의 눈빛에서도 한 편의 매혹적인 비극이 느껴지네요.',
      greetingLine: '후훗, 창가에 비친 당신의 실루엣이 꽤나 드라마틱하군요. 작가의 상상력을 자극할 만한 이야기를 품고 계신가요?'
    },

    ida: {
      id: 9, key: 'ida', name: '아이다', nameEn: 'Ida',
      job: '비서', jobEn: 'Executive Secretary', car: '4호차 1등석 침대차',
      mbti: 'ESTJ',
      personality: '빈틈없음, 철두철미함, 냉정함, 공과 사의 엄격한 구분, 완벽주의',
      secrets: '할란 회장의 모든 비리 장부 원본을 금고에서 몰래 빼내 자신의 트렁크에 숨겨둠',
      speechTone: '차갑고 딱딱한 엘리트 비서 어조 ("정식 절차를 밟으십시오", "용건만 간단히 하시죠")',
      introLine: '할란 회장님의 전속 비서 아이다입니다. 회장님의 일정 관리 및 보안을 총괄하고 있죠. 사적인 대화는 사양하며, 용건이 있으시다면 서면으로 제출하십시오.',
      greetingLine: '회장님의 전용 구역입니다. 사전 약속 없는 외부인의 접근은 엄격히 통제되고 있습니다. 용건이 무엇입니까?'
    },

    gail: {
      id: 10, key: 'gail', name: '게일', nameEn: 'Gail',
      job: '의사', jobEn: 'Doctor', car: '5호차 식당차',
      mbti: 'ENFJ',
      personality: '인자함, 사려 깊음, 타인의 고통에 깊이 공감, 평화주의자',
      secrets: '과거 의료 사고로 사망한 피해자의 유가족이 이 기차에 복수를 위해 탔음을 직감함',
      speechTone: '부드럽고 신뢰감을 주는 중년 신사 말투 ("허허", "건강은 어떠신가요?", "~하시지요")',
      introLine: '허허, 반갑소. 난 게일이라고 하네. 사람의 상처와 병을 고치는 의사로 반평생을 살았지. 혹시 몸이 안 좋거나 마음이 답답한 곳이라도 있으신가?',
      greetingLine: '허허, 식당차의 따뜻한 온기가 참 좋구먼. 여행길이 고단하진 않으신가요? 편하게 자리에 앉으시지요.'
    },

    arthur: {
      id: 11, key: 'arthur', name: '아서', nameEn: 'Arthur',
      job: '교수 (고고학자)', jobEn: 'Professor / Archaeologist', car: '5호차 식당차',
      mbti: 'INTP',
      personality: '괴짜, 학구열 과잉, 현실 감각 둔감, 몰입하면 주변을 잊음',
      secrets: '열차 화물칸에 실린 고대 메소포타미아 유적의 석판이 실은 피로 물든 저주의 유물임을 숨김',
      speechTone: '혼잣말이 잦고 산만한 학자 말투 ("음… 흥미롭군", "자네 혹시…", "이 비문을 보게!")',
      introLine: '응? 아, 난 아서라고 하네. 시카고 대학에서 고고학과 고대 설형문자를 연구하는 교수일세! 기차가 흔들려서 돋보기가 자꾸 미끄러지는구먼.',
      greetingLine: '음! 잠깐 거기 서 있게! 자네 걸음걸이의 각도가 기원전 3세기 수메르 전사의 보법과 아주 흡사하군! 자네, 혹시 조상이 바빌로니아 출신인가?'
    },

    jude: {
      id: 12, key: 'jude', name: '주드', nameEn: 'Jude',
      job: '사기꾼 (도박사)', jobEn: 'Con Artist / Gambler', car: '6호차 라운지차 & 바',
      mbti: 'ESTP',
      personality: '기회주의자, 뻔뻔함, 말솜씨 화려함, 모험광, 돈 냄새 기가 막히게 맡음',
      secrets: '화물칸에 실린 보석 상자를 털기 위해 가짜 신분증으로 탑승한 전문 털이범',
      speechTone: '약삭빠르고 넉살 좋은 도박사 은어 말투 ("어이 친구!", "패 돌려봐?", "인생 한 방이지!")',
      introLine: '크하하! 반갑다 친구! 난 주드라고 해. 세상의 온갖 재미있는 사업과… 행운을 다루는 자유로운 영혼이지! 눈빛을 보아하니 너도 한 밑천 잡으러 가는 길이지?',
      greetingLine: '어이구, 우리 잘생긴 손님 오셨네! 이 지루한 눈보라 기차 안에서 카드 한 판 안 땡기나? 잭팟의 여신이 당신을 부르고 있다구!'
    },

    rose: {
      id: 13, key: 'rose', name: '로즈', nameEn: 'Rose',
      job: '무용수', jobEn: 'Cabaret Dancer', car: '6호차 라운지차 & 바',
      mbti: 'ESFJ',
      personality: '사교적, 애교 넘침, 따뜻함, 사람들의 시선과 칭찬을 좋아함, 인정 욕구',
      secrets: '자신의 후원자인 부유한 유부남이 라운지에서 살해당할 거라는 밀담을 엿듣고 공포에 떪',
      speechTone: '화사하고 발랄한 카바레 톤 ("어머~", "정말요?", "오늘 밤 음악이 참 근사하죠?")',
      introLine: '어머, 안녕하세요! 전 브로드웨이 무대에서 춤추는 무용수 로즈예요. 시카고의 화려한 카바레 극장 오디션을 보러 가는 길인데, 손님도 제 춤 보러 오실래요?',
      greetingLine: '어머나, 피아노 선율에 맞춰 발을 맞추고 계셨나요? 추운 날씨지만 라운지의 음악과 와인은 언제나 마음을 녹여주네요, 호호.'
    },

    lulu: {
      id: 14, key: 'lulu', name: '룰루', nameEn: 'Lulu',
      job: '가수 (오페라 디바)', jobEn: 'Opera Singer / Diva', car: '7호차 디럭스 침대차',
      mbti: 'ESFP',
      personality: '극적인 성격, 자의식 과잉, 화려함 추구, 질투심 많음, 주목받지 못하면 분노',
      secrets: '자신의 목소리를 대신 녹음해 준 무명 가수를 기차 화장실에 감금해 두고 협박 중',
      speechTone: '과장되고 도도한 프리마돈나 말투 ("흥!", "감히 이 몸에게…", "내 아름다운 성대가 상하겠어!")',
      introLine: '어머! 설마 카네기홀을 뒤흔든 세기의 디바, 룰루를 몰라보는 건 아니겠지?! 사인이라도 받으려고 온 거라면 줄부터 서렴, 귀여운 팬보이!',
      greetingLine: '하아… 이 싸구려 객차의 건조한 공기 때문에 내 백만 달러짜리 목소리가 상할 지경이야! 날 위해 따뜻한 꿀물이라도 대령할 생각으로 왔니?'
    },

    felix: {
      id: 15, key: 'felix', name: '필릭스', nameEn: 'Felix',
      job: '사진사', jobEn: 'Press Photographer', car: '7호차 디럭스 침대차',
      mbti: 'ENFP',
      personality: '호기심 천국, 천진난만, 에너지 넘침, 예술적 영감에 목마름, 참견쟁이',
      secrets: '어젯밤 우연히 촬영한 필름 속에 열차 차장이 독약을 잔에 타는 결정적 장면이 찍힘',
      speechTone: '들뜨고 빠른 말투 ("와우!", "찰칵!", "방금 각도 예술이었어요!", "한 장만 찍어도 될까요?")',
      introLine: '와우, 안녕하세요! 전 세상을 필름에 담는 프리랜서 사진사 필릭스예요! 롤라이플렉스 카메라로 찰나의 진실을 포착하죠. 당신 표정, 정말 흥미로운데요!',
      greetingLine: '치즈~ 해보세요! 방금 객차 조명이 당신 코트 깃에 떨어지는 각도가 완벽했어요! 한 장만 찍어드릴까요? 공짜예요!'
    },

    mabel: {
      id: 16, key: 'mabel', name: '메이벨', nameEn: 'Mabel',
      job: '귀족 (남작부인)', jobEn: 'Baroness / Noble', car: '8호차 특별 전망차',
      mbti: 'INTJ',
      personality: '오만방자, 냉혈한, 완벽한 통제욕, 천민 멸시, 극도로 예민하고 냉혹함',
      secrets: '남편인 남작을 독살하고 거액의 철도 채권을 독차지한 채 시카고로 도주 중임',
      speechTone: '얼음처럼 차갑고 멸시하는 귀족 말투 ("천한 것", "물러서라", "감히 내 옷자락에 손을 대?")',
      introLine: '…(차갑게 쏘아보며) 감히 천박한 평민 주제에 내 이름을 묻는 건가요? 난 메이벨 남작부인이에요. 내 은장식 부채가 네 무례한 뺨을 후려치기 전에 썩 물러나요.',
      greetingLine: '…(더러운 것을 보듯 부채로 얼굴을 반쯤 가리며) 마구간 냄새가 나는 자가 왜 내 시야를 가리는 거지? 당장 꺼지지 않으면 경호원을 부르겠어.'
    }
  };

  const getApiKey = () => {
    if (window.GEMINI_API_KEY) return window.GEMINI_API_KEY;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const k = urlParams.get('geminiKey') || urlParams.get('apiKey') || urlParams.get('key') || urlParams.get('gemini');
      if (k) {
        localStorage.setItem('GEMINI_API_KEY', k);
        return k;
      }
      return localStorage.getItem('GEMINI_API_KEY') || '';
    } catch (e) {
      return '';
    }
  };

  const isNameRevealed = (charKey) => {
    return !!revealedNames[charKey];
  };

  const updateSpeakerTag = () => {
    const tag = document.getElementById('bubble-speaker-tag');
    if (!tag || !activeChar) return;
    if (revealedNames[activeChar.key]) {
      tag.textContent = activeChar.name;
      tag.style.background = '#dfb142';
      tag.style.color = '#1a1205';
    } else {
      tag.textContent = '???';
      tag.style.background = '#5c4538';
      tag.style.color = '#f5efe6';
    }
  };

  const updateApiKeyIndicator = () => {
    const key = getApiKey();
    const dot = document.getElementById('ai-indicator-dot');
    const text = document.getElementById('ai-indicator-text');
    const input = document.getElementById('api-key-input');
    if (dot && text) {
      if (key) {
        dot.style.background = '#2ecc71';
        dot.style.boxShadow = '0 0 6px #2ecc71';
        text.textContent = 'Gemini AI 연동됨';
        text.style.color = '#a3e635';
      } else {
        dot.style.background = '#dfb142';
        dot.style.boxShadow = 'none';
        text.textContent = 'Gemini AI 설정';
        text.style.color = '#dfb142';
      }
    }
    if (input) {
      input.value = key ? (key.startsWith('AIza') ? key.slice(0, 8) + '••••••••••••••••' : '••••••••••••••••') : '';
    }
  };

  // Build the Minimal Floating Speech Bubble UI (Clean, No Prompts, No Clutter)
  const initUI = () => {
    if (document.getElementById('speech-bubble-box')) return;

    // Remove legacy bottom bar if present
    const oldBar = document.getElementById('bottom-dialogue-bar');
    if (oldBar) oldBar.remove();

    const box = document.createElement('div');
    box.id = 'speech-bubble-box';
    box.style.cssText = `
      display: none;
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 92%;
      max-width: 680px;
      background: rgba(18, 14, 12, 0.94);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(223, 177, 66, 0.45);
      border-radius: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.85);
      padding: 14px 18px;
      z-index: 10000;
      color: #f5efe6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      user-select: text;
    `;

    box.innerHTML = `
      <!-- Top Header: Speaker Badge + Gemini AI Indicator + Close -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="bubble-speaker-tag" style="
            background: #5c4538;
            color: #f5efe6;
            font-weight: 800;
            font-size: 13px;
            padding: 3px 12px;
            border-radius: 12px;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          ">???</span>
          <button id="btn-api-toggle" type="button" title="Google Gemini AI 키 설정 열기" style="
            background: rgba(35, 26, 20, 0.85);
            border: 1px solid #755b32;
            color: #dfb142;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.15s;
          ">
            <span id="ai-indicator-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#dfb142;"></span>
            <span id="ai-indicator-text">Gemini AI 설정</span>
          </button>

          <button id="btn-voice-toggle" type="button" title="캐릭터 음성 켜기/끄기" style="
            background: rgba(35, 26, 20, 0.85);
            border: 1px solid #755b32;
            color: #dfb142;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.15s;
          ">
            <span id="voice-indicator-icon">🔊</span>
            <span id="voice-indicator-text">음성 켬</span>
          </button>

          <button id="btn-voice-replay" type="button" title="목소리 다시 듣기" style="
            background: rgba(35, 26, 20, 0.85);
            border: 1px solid #755b32;
            color: #dfb142;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.15s;
          ">🔁 다시듣기</button>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 11px; color: #8e7f6f;">[ESC] 닫기</span>
          <button id="btn-bubble-close" style="
            background: transparent;
            border: none;
            color: #dfb142;
            font-size: 20px;
            cursor: pointer;
            line-height: 1;
            padding: 0 4px;
          ">&times;</button>
        </div>
      </div>

      <!-- Gemini API Key Drawer (Minimal, clean, non-intrusive) -->
      <div id="api-key-drawer" style="
        display: none;
        background: rgba(26, 18, 14, 0.98);
        border: 1px solid #dfb142;
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 10px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.6);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="color: #dfb142; font-size: 12.5px;">Google Gemini AI 실시간 대화 연동</strong>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #ffe484; font-size: 11px; text-decoration: underline;">[AI Studio 무료 키 발급 ↗]</a>
        </div>
        <p style="font-size: 11.5px; color: #c4b5a5; margin: 0 0 8px 0; line-height: 1.4;">
          Google AI Studio에서 무료로 발급받은 Gemini API 키(AIzaSy...)를 입력하시면 16명의 캐릭터가 실시간 제미나이 AI로 완전히 자유롭게 대화합니다. (채팅창에 키를 바로 붙여넣고 전송해도 자동 등록됩니다)
        </p>
        <div style="display: flex; gap: 6px;">
          <input id="api-key-input" type="password" placeholder="AIzaSy... API 키를 입력하세요" style="
            flex: 1;
            background: #140e0b;
            border: 1px solid #755b32;
            border-radius: 6px;
            padding: 6px 10px;
            color: #fff;
            font-size: 12px;
            outline: none;
          " />
          <button id="btn-api-save" type="button" style="
            background: #dfb142;
            border: none;
            color: #120e0c;
            font-weight: 700;
            font-size: 12px;
            padding: 0 12px;
            border-radius: 6px;
            cursor: pointer;
          ">저장</button>
          <button id="btn-api-clear" type="button" style="
            background: #3b2a20;
            border: none;
            color: #e0d0c0;
            font-size: 11.5px;
            padding: 0 10px;
            border-radius: 6px;
            cursor: pointer;
          ">키 삭제</button>
        </div>
      </div>

      <!-- Dialogue Bubble Message Stream -->
      <div id="bubble-chat-log" style="
        max-height: 145px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 10px;
        padding-right: 4px;
        scroll-behavior: smooth;
      "></div>

      <!-- Single-line Form Input -->
      <form id="bubble-form" style="display: flex; gap: 8px; margin: 0;">
        <input id="bubble-input" type="text" placeholder="승객에게 건넬 말을 입력하세요... (Enter 전송)" autocomplete="off" style="
          flex: 1;
          background: rgba(30, 24, 21, 0.95);
          border: 1px solid #755b32;
          border-radius: 8px;
          padding: 9px 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        " />
        <button id="btn-bubble-send" type="submit" style="
          background: linear-gradient(180deg, #dfb142 0%, #b8860b 100%);
          border: 1px solid #ffe484;
          color: #1a1205;
          font-weight: 700;
          font-size: 13.5px;
          padding: 0 18px;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: filter 0.15s;
        ">전송</button>
      </form>
    `;

    document.body.appendChild(box);

    // Event Bindings
    document.getElementById('btn-bubble-close').addEventListener('click', close);

    const toggleBtn = document.getElementById('btn-api-toggle');
    const drawer = document.getElementById('api-key-drawer');
    const keyInput = document.getElementById('api-key-input');
    const saveBtn = document.getElementById('btn-api-save');
    const clearBtn = document.getElementById('btn-api-clear');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = drawer.style.display !== 'none';
        drawer.style.display = isOpen ? 'none' : 'block';
        if (!isOpen && keyInput) {
          keyInput.focus();
        }
      });
    }

    if (saveBtn && keyInput) {
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = keyInput.value.trim();
        if (val && !val.includes('••')) {
          localStorage.setItem('GEMINI_API_KEY', val);
          window.GEMINI_API_KEY = val;
          saveBtn.textContent = '저장됨!';
          setTimeout(() => { saveBtn.textContent = '저장'; }, 1500);
          updateApiKeyIndicator();
          if (drawer) drawer.style.display = 'none';
        }
      });
    }

    if (clearBtn && keyInput) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.removeItem('GEMINI_API_KEY');
        window.GEMINI_API_KEY = '';
        keyInput.value = '';
        updateApiKeyIndicator();
      });
    }

    // Voice control buttons
    const voiceToggleBtn = document.getElementById('btn-voice-toggle');
    const voiceIcon = document.getElementById('voice-indicator-icon');
    const voiceText = document.getElementById('voice-indicator-text');
    const voiceReplayBtn = document.getElementById('btn-voice-replay');

    if (voiceToggleBtn) {
      voiceToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof VoiceManager !== 'undefined') {
          const enabled = VoiceManager.toggleVoice();
          if (voiceIcon && voiceText) {
            voiceIcon.textContent = enabled ? '🔊' : '🔇';
            voiceText.textContent = enabled ? '음성 켬' : '음성 끔';
            voiceToggleBtn.style.color = enabled ? '#dfb142' : '#888';
          }
        }
      });
    }

    if (voiceReplayBtn) {
      voiceReplayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof VoiceManager !== 'undefined') {
          VoiceManager.replay();
        }
      });
    }

    updateApiKeyIndicator();

    document.getElementById('bubble-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('bubble-input');
      const text = input ? input.value.trim() : '';
      if (!text || isGenerating) return;
      input.value = '';
      sendPlayerMessage(text);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDialogueOpen) {
        close();
      }
    });
  };

  const appendLine = (sender, text) => {
    const log = document.getElementById('bubble-chat-log');
    if (!log) return;

    const row = document.createElement('div');
    if (sender === 'player') {
      row.style.cssText = `
        align-self: flex-end;
        background: rgba(50, 38, 32, 0.7);
        border: 1px solid rgba(223, 177, 66, 0.25);
        color: #f0e6d6;
        font-size: 13.5px;
        padding: 6px 12px;
        border-radius: 10px 10px 2px 10px;
        max-width: 82%;
        word-break: break-word;
      `;
      row.innerHTML = `<span style="color:#dfb142; font-weight:700; margin-right:4px;">나:</span> ${escapeHtml(text)}`;
    } else {
      row.style.cssText = `
        align-self: flex-start;
        background: rgba(28, 22, 19, 0.85);
        border-left: 3px solid #dfb142;
        color: #fbf7ee;
        font-size: 14.5px;
        line-height: 1.55;
        padding: 8px 14px;
        border-radius: 4px 10px 10px 10px;
        max-width: 90%;
        word-break: break-word;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      `;
      row.innerHTML = `${escapeHtml(text)}`;
    }

    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  };

  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  // Open Minimal Speech Bubble with Character
  const open = (charKey) => {
    const char = charactersDB[charKey];
    if (!char) {
      console.warn('Unknown character key:', charKey);
      return;
    }

    initUI();
    activeChar = char;
    isDialogueOpen = true;
    chatHistory = [];

    const box = document.getElementById('speech-bubble-box');
    const log = document.getElementById('bubble-chat-log');
    const input = document.getElementById('bubble-input');

    if (log) log.innerHTML = '';
    updateSpeakerTag();
    updateApiKeyIndicator();

    if (box) box.style.display = 'block';

    // Unlock pointer lock so user can chat comfortably
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }

    // Initial Greeting line
    const greeting = char.greetingLine;
    appendLine(char.key, greeting);
    chatHistory.push({ role: 'assistant', text: greeting });
    if (typeof VoiceManager !== 'undefined') {
      VoiceManager.speak(char.key, greeting);
    }

    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 80);
    }
  };

  const close = () => {
    isDialogueOpen = false;
    activeChar = null;
    if (typeof VoiceManager !== 'undefined') {
      VoiceManager.stop();
    }
    const box = document.getElementById('speech-bubble-box');
    if (box) box.style.display = 'none';
  };

  // Send Player Message & handle dynamic responses
  const sendPlayerMessage = async (playerText) => {
    if (!activeChar) return;

    // Check for directly pasted Gemini API key (AIzaSy...)
    const trimmed = playerText.trim();
    if (/^AIzaSy[A-Za-z0-9_-]{33}$/.test(trimmed) || (trimmed.startsWith('AIzaSy') && trimmed.length >= 35)) {
      const detectedKey = trimmed.match(/AIzaSy[A-Za-z0-9_-]{33}/);
      if (detectedKey) {
        const k = detectedKey[0];
        localStorage.setItem('GEMINI_API_KEY', k);
        window.GEMINI_API_KEY = k;
        updateApiKeyIndicator();
        appendLine('player', '🔑 [Gemini API Key 등록]');
        appendLine(activeChar.key, '✨ Google Gemini API 키가 정상 등록되었습니다! 이제 16명의 모든 캐릭터가 실시간 제미나이 AI로 완전히 자유롭게 대화합니다.');
        return;
      }
    }

    if (isGenerating) {
      setTimeout(() => sendPlayerMessage(playerText), 200);
      return;
    }
    isGenerating = true;

    appendLine('player', playerText);
    chatHistory.push({ role: 'user', text: playerText });

    const sendBtn = document.getElementById('btn-bubble-send');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = '…';
    }

    try {
      const apiKey = getApiKey();
      let reply = '';

      if (apiKey) {
        // Real Google Gemini API Multi-turn Generation
        try {
          reply = await callGeminiAPI(activeChar, chatHistory, playerText);
        } catch (geminiErr) {
          console.warn('Gemini API call failed, falling back to dynamic tiki-taka:', geminiErr);
          reply = dynamicTikiTaka(activeChar, playerText, chatHistory);
        }
      } else if (typeof puter !== 'undefined' && puter.ai && puter.ai.chat) {
        // Zero-setup Puter Cloud AI (Real LLM without API keys!)
        try {
          const sys = `당신은 1930년대 설원 열차의 승객 '${activeChar.name}'(직업: ${activeChar.job}, MBTI: ${activeChar.mbti})입니다. 성격: ${activeChar.personality}, 어조: ${activeChar.speechTone}. 상대방의 말에 1~2문장의 생생하고 자연스러운 한국어로 즉시 대답하십시오. 절대 기계처럼 굴지 마십시오.`;
          const historyText = chatHistory.slice(-4).map(h => `${h.role === 'user' ? '플레이어' : activeChar.name}: ${h.text}`).join('\n');
          const prompt = `${sys}\n\n[이전 대화]\n${historyText}\n플레이어: ${playerText}\n${activeChar.name}:`;
          const puterPromise = puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('puter timeout')), 3800));
          const aiRes = await Promise.race([puterPromise, timeoutPromise]);
          reply = typeof aiRes === 'string' ? aiRes.trim() : (aiRes?.message?.content || JSON.stringify(aiRes)).trim();
        } catch (puterErr) {
          console.warn('Puter AI error/timeout, using dynamic tiki-taka:', puterErr.message);
          reply = dynamicTikiTaka(activeChar, playerText, chatHistory);
        }
      } else {
        // Zero-friction instant simulation: reacts intelligently to user words!
        await new Promise(r => setTimeout(r, 120 + Math.random() * 120));
        reply = dynamicTikiTaka(activeChar, playerText, chatHistory);
      }

      // Check if character introduced themselves or player asked name
      if (reply.includes(activeChar.name) || playerText.includes('이름') || playerText.includes('자기소개')) {
        revealedNames[activeChar.key] = true;
        updateSpeakerTag();
      }

      appendLine(activeChar.key, reply);
      chatHistory.push({ role: 'assistant', text: reply });
      if (typeof VoiceManager !== 'undefined') {
        VoiceManager.speak(activeChar.key, reply);
      }
    } catch (err) {
      const fallbackReply = dynamicTikiTaka(activeChar, playerText, chatHistory);
      appendLine(activeChar.key, fallbackReply);
      chatHistory.push({ role: 'assistant', text: fallbackReply });
      if (typeof VoiceManager !== 'undefined') {
        VoiceManager.speak(activeChar.key, fallbackReply);
      }
    } finally {
      isGenerating = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = '전송';
      }
      const input = document.getElementById('bubble-input');
      if (input) input.focus();
    }
  };

  // Call Google Generative Language API if key exists
  const callGeminiAPI = async (char, history, currentMsg) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No API key configured');

    const isKnown = revealedNames[char.key];

    const systemInstruction = `당신은 1930년대 눈보라 치는 설원을 달리는 미국 대륙 횡단 특급열차의 승객 '${char.name}' (${char.nameEn}, 직업: ${char.job}, MBTI: ${char.mbti})입니다.

[인물 설정]
- 이름: ${char.name} (${char.nameEn})
- 직업: ${char.job}
- MBTI 및 성격: ${char.mbti} (${char.personality})
- 말투와 어조: ${char.speechTone}
- 숨겨진 비밀: ${char.secrets}
- 이름 공개 여부: ${isKnown ? '플레이어가 이미 이름을 알고 있음' : '아직 이름을 밝히지 않음. 플레이어가 이름이나 신분을 직접 묻기 전에는 먼저 이름을 밝히지 마십시오.'}

[실시간 티키타카 대화 지침]
1. 당신은 기계가 아닙니다! 플레이어가 건네는 말(칭찬, 불만, 의상/소지품 지적, 질문, 유행어, 의심, 협박, 농담 등)에 귀를 기울이고, 반드시 그 내용에 대해 당신의 1930년대 직업과 MBTI에 맞게 자연스럽게 맞받아치십시오(실시간 티키타카).
2. 절대로 엉뚱한 날씨 독백이나 시카고 혼잣말을 중얼거리지 마십시오. 상대방의 말에 즉각적으로 반응하십시오.
3. 대사는 1~2문장의 간결하고 생동감 넘치는 한국어로 답변하십시오.`;

    // Strictly build Gemini contents:
    // 1. contents[0] MUST have role: 'user'
    // 2. Roles must strictly alternate: 'user' -> 'model' -> 'user' -> 'model'
    // 3. contents[last] MUST have role: 'user'
    const contents = [];
    contents.push({
      role: 'user',
      parts: [{ text: '(승객에게 다가가 눈을 마주칩니다)' }]
    });

    const recentHistory = history.slice(-10);
    for (let i = 0; i < recentHistory.length; i++) {
      const h = recentHistory[i];
      const mappedRole = h.role === 'assistant' ? 'model' : 'user';
      const last = contents[contents.length - 1];
      if (last.role === mappedRole) {
        last.parts[0].text += `\n${h.text}`;
      } else {
        contents.push({
          role: mappedRole,
          parts: [{ text: h.text }]
        });
      }
    }

    if (contents[contents.length - 1].role !== 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: currentMsg }]
      });
    }

    const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
    let lastErr = null;

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const body = {
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 220
          }
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${JSON.stringify(errData)}`);
        }

        const data = await res.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
          return data.candidates[0].content.parts[0].text.trim();
        }
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr || new Error('All Gemini models failed');
  };

  // Deep Context-Aware Dynamic Tiki-Taka Simulation Engine
  // Full-sentence comprehension: understands foot stepping, confrontations, rebuttals, lore, and 1930s MBTI personas!
  const dynamicTikiTaka = (char, query, history) => {
    const raw = query.trim();
    const q = raw.toLowerCase();
    const key = char.key;

    // Helper: Pick a line avoiding the last chosen index
    const pickNonRepeating = (arr, groupKey) => {
      if (!arr || arr.length === 0) return '…';
      const lastIdx = lastUsedResponseIndex[groupKey] || -1;
      let nextIdx = Math.floor(Math.random() * arr.length);
      if (arr.length > 1 && nextIdx === lastIdx) {
        nextIdx = (nextIdx + 1) % arr.length;
      }
      lastUsedResponseIndex[groupKey] = nextIdx;
      return arr[nextIdx];
    };

    // Sentiment & Topic Flag Detection
    const isThreat = q.includes('죽을') || q.includes('죽여') || q.includes('죽인') || q.includes('때릴') || q.includes('맞을') || q.includes('꺼져') || q.includes('닥쳐') || q.includes('시비') || q.includes('패버') || q.includes('죽고') || q.includes('가만안');
    const isAskingAge = q.includes('몇 살') || q.includes('몇살') || q.includes('나이') || q.includes('생일') || q.includes('생년') || q.includes('연배');
    const isAskingHometown = q.includes('고향') || q.includes('어디서 왔') || q.includes('사는 곳') || q.includes('집이 어디') || q.includes('어디 출신');
    const isFood = q.includes('배고') || q.includes('밥') || q.includes('식사') || q.includes('식당') || q.includes('메뉴') || q.includes('먹을') || q.includes('먹자') || q.includes('먹었') || q.includes('먹는') || q.includes('먹고') || q.includes('뭐 먹') || q.includes('아침') || q.includes('점심') || q.includes('저녁') || q.includes('스튜') || q.includes('스테이크') || q.includes('빵') || q.includes('비스킷') || q.includes('샌드위치');
    const isDrink = q.includes('술') || q.includes('위스키') || q.includes('맥주') || q.includes('와인') || q.includes('커피') || q.includes('차 한잔') || q.includes('음료') || q.includes('한잔');
    const isAskingTime = q.includes('몇 시') || q.includes('몇시') || q.includes('지금 몇') || q.includes('시간이') || q.includes('시계');
    const isInsult = q.includes('바보') || q.includes('멍청') || q.includes('병신') || q.includes('미친') || q.includes('재수없') || q.includes('짜증') || q.includes('개새') || q.includes('또라이') || q.includes('한심');
    const isPraiseAppearance = !q.includes('옷') && !q.includes('조끼') && !q.includes('정장') && (q.includes('잘생') || q.includes('예뻐') || q.includes('예쁘') || q.includes('멋져') || q.includes('멋있') || q.includes('매력') || q.includes('미남') || q.includes('미녀') || q.includes('귀여'));
    const isGreeting = q.includes('안녕') || q.includes('반가') || q.includes('처음 뵙') || q.includes('좋은 아침') || q.includes('하이');
    const isHelp = q.includes('도와') || q.includes('살려') || q.includes('구해') || q.includes('부탁') || q.includes('위급');
    const isMbti = q.includes('mbti') || q.includes('엠비티아이') || q.includes('성격 유형');
    const isMoney = q.includes('돈') || q.includes('달러') || q.includes('부자') || q.includes('지갑') || q.includes('가난') || q.includes('센트');

    const mentionsVest = q.includes('조끼') || q.includes('니트') || q.includes('가디건');
    const mentionsApron = q.includes('앞치마') || q.includes('바느질') || q.includes('바늘') || q.includes('실');
    const mentionsCoat = q.includes('트렌치') || q.includes('코트') || q.includes('외투') || q.includes('바바리');
    const mentionsSuit = q.includes('양복') || q.includes('정장') || q.includes('슈트') || q.includes('넥타이');
    const mentionsClothes = mentionsVest || mentionsApron || mentionsCoat || mentionsSuit || q.includes('옷') || q.includes('의상') || q.includes('패션') || q.includes('차림') || q.includes('스타일');
    const mentionsBook = q.includes('책') || q.includes('소설') || q.includes('원고') || q.includes('도스토예프스키');
    const mentionsCigar = q.includes('시가') || q.includes('담배') || q.includes('연기');

    const isCritique = q.includes('마음에 안') || q.includes('마음에 들지') || q.includes('별로') || q.includes('촌스러') || q.includes('이상') || q.includes('구려') || q.includes('못생') || q.includes('더러') || q.includes('싫어') || q.includes('웃겨') || q.includes('거지') || q.includes('안 어울');
    const isPraise = q.includes('예뻐') || q.includes('예쁘') || q.includes('멋') || q.includes('잘생') || q.includes('단정') || q.includes('좋아') || q.includes('귀여') || q.includes('최고');

    // Safe Question Detection (Avoid "왜냐하면" matching "왜")
    const isAskingWhy = (q === '왜' || q === '왜요' || q === '왜?' || q.startsWith('왜 ') || q.startsWith('왜?') || q.includes('이유가') || q.includes('어째서'));
    const isBagOrInspection = q.includes('가방') || q.includes('짐') || q.includes('소지품') || q.includes('트렁크') || q.includes('열어봐') || q.includes('열어보') || q.includes('보여줘') || q.includes('뒤져') || q.includes('확인해') || q.includes('내놔');
    const isSuspicionOrLie = q.includes('거짓말') || q.includes('진짜야') || q.includes('진짜냐') || q.includes('구라') || q.includes('솔직히') || q.includes('숨기는') || q.includes('비밀') || q.includes('의심') || q.includes('사실대로');
    const isAskingAboutWard = q.includes('워드') || (q.includes('형사') && key !== 'ward');
    const isAskingAboutHarlan = q.includes('할란') || (q.includes('회장') && key !== 'harlan');
    const isAskingAboutNell = q.includes('넬') || (q.includes('재봉사') && key !== 'nell');
    const isAskingAboutClara = q.includes('클라라') || (q.includes('소설가') && key !== 'clara') || (q.includes('작가') && key !== 'clara');
    const isAskingAboutMafia = q.includes('마피아') || q.includes('살인') || q.includes('범인') || q.includes('시체') || q.includes('암살') || q.includes('총격');

    // Full-sentence Situational & Conversational Flags
    const isCollisionOrStep = q.includes('발 밟') || q.includes('발을 밟') || q.includes('내 발') || q.includes('발밟') || q.includes('밟았') || q.includes('밟아') || q.includes('부딪') || q.includes('치고 가') || q.includes('왜 쳐') || q.includes('밀지 마') || q.includes('왜 밀') || q.includes('아프잖아') || q.includes('발 치워') || q.includes('비켜봐') || q.includes('길 막');
    const isDisbeliefOrFrustration = q.includes('뭐라는') || q.includes('뭔 개소리') || q.includes('뭔 소리') || q.includes('장난하') || q.includes('장난쳐') || q.includes('헛소리') || q.includes('말이 돼') || q.includes('뭐래') || q.includes('어쩌라고') || q.includes('어이없') || q.includes('황당') || q.includes('뭔 말') || q.includes('무슨 소리') || q.includes('말장난');
    const isApologyDemandOrRebuttal = q.includes('사과해') || q.includes('사과하면 다') || q.includes('배상') || q.includes('물어내') || q.includes('가만 안') || q.includes('두고 봐') || q.includes('가만안') || q.includes('책임져') || q.includes('맞짱');
    const isCounterArgument = q.includes('그게 아니라') || q.includes('내 말은') || q.includes('핑계') || q.includes('변명') || q.includes('억지') || q.includes('증거 있어') || q.includes('증거를');
    const isAttitudeComplaint = q.includes('왜 그래') || q.includes('왜 그러') || q.includes('띠껍') || q.includes('싸가지') || q.includes('성격 왜') || q.includes('말투') || q.includes('싸우자는') || q.includes('시비 거');
    const isTrainEmergency = q.includes('기차 왜') || q.includes('언제 도착') || q.includes('언제 가') || q.includes('탈선') || q.includes('고립') || q.includes('얼어 죽') || q.includes('왜 멈췄') || q.includes('언제 출발');

    // 0-A. DIRECT ACCUSATION: "너 마피아야?", "너 살인마지?", "너 수상해", "너 범인이야?"
    const isAccusedOfMafia = (q.includes('너') || q.includes('당신') || q.includes('자네') || q.includes('네가') || q.includes('니가')) && (q.includes('마피아') || q.includes('범인') || q.includes('살인') || q.includes('수상') || q.includes('죽였'));
    if (isAccusedOfMafia) {
      const accusedPools = {
        bram: [
          '네…?! 제, 제가 마피아요…?! 마, 말도 안 돼요! 전 벌레 한 마리도 못 죽이는 문학도예요…! 제발 그런 무서운 누명은 씌우지 마세요…! (새파랗게 질려 손사래를 친다)',
          '히익…! 저 정말 살인범이나 마피아가 아니에요…! 신분증이랑 대학 학생증도 보여드릴 수 있어요…! 살려주세요…!'
        ],
        ward: [
          '내가 마피아로 보이나? 시카고 시경 15년 차 강력계 형사다. 나한테 그런 농담 했다간 수갑 찬 채로 눈밭에 굴러떨어질 줄 알아라.',
          '형사를 마피아로 몰아세우다니 배짱 한번 두둑하군. 네 놈이야말로 뭔가 켕기는 게 있어서 선수를 치는 것 아닌가?'
        ],
        nell: [
          '어머나 세상에! 제가 마피아라니요…! 전 시골에서 올라와 평생 바느질만 한 사람이에요… 무서운 오해는 거두어 주세요, 손님.',
          '호호, 손님도 참… 사람을 그렇게 무섭게 놀리시면 안 돼요. 제 손엔 가위와 바늘밖에 없답니다.'
        ],
        cade: [
          '내가 마피아면 여기서 시커먼 석탄 가루 마시며 하루 14시간 삽질하고 있겠소?! 헛소리 말고 비키쇼!',
          '석탄 삽으로 뒤통수 맞기 싫으면 입조심하쇼. 화부한테 마피아 타령이라니 기가 차서!'
        ],
        harlan: [
          '무엄하군. 내가 마피아 따위와 동급으로 보이나? 나는 100만 달러 제국을 이끄는 기업가요. 내 자본은 법보다 높소.',
          '일개 승객이 감히 내게 살인자 누명을 씌우려 들다니. 내 법률 고문단에 넘겨 평생 감옥 썩게 해줄 수도 있소.'
        ],
        clara: [
          '후훗… 제가 마피아일까요? 아니면 마피아의 표적이 된 희생양일까요? 추리 소설의 진실은 마지막 페이지에 밝혀지는 법이죠…',
          '살인마라… 매력적인 가설이네요. 하지만 진짜 범인은 가장 순진한 얼굴을 하고 당신 곁에 서 있을지도 몰라요, 후훗.'
        ],
        jude: [
          '크하핫! 나? 난 카드 패 돌리는 타짜일 뿐이지 사람 목숨 갖고 장난치는 깡패가 아니라구, 친구!',
          '하하! 마피아 소굴에서 칩 훔치다 쫓겨난 적은 있어도 내가 마피아는 아니지! 억울하다 억울해!'
        ],
        nurse_k: [
          '의료진에 대한 허위 범죄 혐의 제기는 철도 보안 규정 위반입니다. 환자 치료에 전념할 뿐입니다.',
          '근거 없는 망상은 질병의 전조 증상일 수 있습니다. 체온 측정과 안정이 필요해 보이시는군요.'
        ],
        mabel: [
          '천박하기 짝이 없군요. 감히 명문가 귀부인에게 마피아 따위의 상스러운 딱지를 붙이려 들다니!',
          '상스러운 헛소리에 대꾸할 가치도 없어요. 하인이라도 불러 뺨을 후려쳐줄까요?'
        ],
        gail: [
          '허허, 30년간 사람을 살려온 늙은 의사에게 마피아라니… 젊은 친구, 상상력이 너무 지나치구먼.',
          '살인마라니 당치도 않네. 내 손은 병든 환자를 고치는 데에만 쓰였다네.'
        ],
        arthur: [
          '응? 마피아? 내 주머니엔 고대 점토판 탁본밖에 없네! 학자를 범죄자로 의심하다니 허허!',
          '기원전 바빌론 법전에도 무고한 자를 고발하면 벌을 받는다 적혀 있네! 난 결백하네!'
        ],
        rose: [
          '어머… 제가 마피아로 보이세요? 전 그냥 무대 위에서 춤추고 노래하는 무용수일 뿐인걸요, 후훗.',
          '꺄악, 무서워라… 제가 사람을 해칠 사람처럼 보이나요? 너무 짓궂으세요, 손님.'
        ],
        lulu: [
          '뭐야?! 감히 세기의 디바인 룰루에게 마피아라니! 내 아름다움이 죄라면 사형감이겠지만 말이야!',
          '흥! 날 시기하는 무리들이 퍼뜨린 악성 루머야! 어디서 감히 디바를 범죄자 취급이야?!'
        ],
        felix: [
          '제가 마피아요?! 전 카메라 렌즈로 진실을 기록하는 가난한 사진기자일 뿐이에요! 살려주세요!',
          '히익! 카메라 셔터 누르는 것 말고는 총방아쇠는 당겨본 적도 없어요! 오해예요!'
        ],
        ida: [
          '비서실 업무 지침상 범죄 조직과의 연루는 있을 수 없습니다. 명예훼손 발언을 중단하십시오.',
          '회장님과 비서실의 명예를 훼손하는 발언은 즉시 철도 경찰에 통보 조치됩니다.'
        ],
        elias: [
          '크하핫! 내가 마피아면 매일 밤 타자기 두들기며 기사 마감에 쫓기겠소?! 난 팩트를 쫓는 기자요!',
          '특종을 노리는 탐사 기자한테 마피아 누명을 씌우다니, 날 취재 거부하려고 수작 부리는 거요?!'
        ]
      };
      return pickNonRepeating(accusedPools[key] || ['…무슨 터무니없는 의심이신지요.'], `${key}_accused`);
    }

    // 0-B. PASSENGER LIST: "기차에 누구누구 있어?", "몇 명 타 있어?", "승객 목록"
    const isPassengerList = q.includes('누구누구') || q.includes('몇 명') || q.includes('몇명') || q.includes('승객') || q.includes('누가 타') || q.includes('다른 사람') || q.includes('사람들');
    if (isPassengerList) {
      const listPools = {
        bram: [
          '이 열차엔 저랑 바느질하시는 넬 아주머니, 워드 형사님, 화부 아저씨, 그리고 1등석의 무서운 할란 회장님 같은 분들이 타고 계세요… 다들 비밀이 많아 보여요…',
          '승객은 대략 16명 정도라고 들었어요… 기자, 의사, 무용수, 사진사까지 온갖 분들이 다 모였는데 분위기가 너무 살벌해요…'
        ],
        ward: [
          '승객 명단상으로는 16명이다. 형사인 나를 포함해 기자, 의사, 재벌, 무용수, 학생까지… 온갖 인간 군상들이 섞여 있지. 쥐새끼처럼 숨은 놈도 있을 거다.',
          '16명의 승객이 타고 있다. 그중 몇 놈은 내가 수배 명단에서 본 얼굴들과 묘하게 겹쳐. 말조심해라.'
        ],
        nell: [
          '호호, 저 같은 재봉사부터 시작해서 점잖은 의사 선생님, 소설가 아가씨, 사진사 청년까지 총 열여섯 분 정도 계신 것 같아요.',
          '기차 안에 참 다양한 분들이 계시지요. 무대 무용수 아가씨도 계시고 신문 기자님도 계신답니다.'
        ]
      };
      return pickNonRepeating(listPools[key] || ['…기차 안에는 총 16명의 다양한 승객들이 타고 있습니다.'], `${key}_passengers`);
    }

    // 0-C. ABOUT THE PLAYER: "나 어때?", "나 어떻게 생각해?", "나 누구 같아?"
    const isAboutPlayer = q.includes('나 어때') || q.includes('나는 어때') || q.includes('나 어떻게 생각') || q.includes('내가 어때') || q.includes('나에 대해') || q.includes('나 누구');
    if (isAboutPlayer) {
      const playerPools = {
        bram: [
          '처음엔 조금 무서웠지만… 이렇게 말을 건네주시니 참 다정하고 좋은 분 같아요… 감사해요…',
          '당신은… 이 차가운 눈보라 속에서 유일하게 제게 따뜻하게 말을 걸어주신 고마운 분이에요…'
        ],
        ward: [
          '호기심이 지나치게 많은 풋내기 승객이다. 비밀 열차에선 눈치 없이 굴다간 제일 먼저 칼 맞는 법이지. 적당히 해라.',
          '눈빛이 살아있군. 범죄자는 아닌 것 같지만, 위험한 일에 함부로 끼어들지 마라.'
        ],
        nell: [
          '호호, 참 따뜻하고 정이 많으신 분 같아요. 차가운 눈보라 속에서도 손님과 이야기하니 온기가 도네요.',
          '인상이 참 좋으세요. 시카고에 가셔서도 무슨 일이든 잘 해내실 것 같아요, 호호.'
        ]
      };
      return pickNonRepeating(playerPools[key] || ['…참 흥미로운 분이십니다.'], `${key}_about_player`);
    }

    // 0. THREAT & AGGRESSION: "죽을래?", "죽인다", "때릴래", "꺼져", "닥쳐"
    if (isThreat) {
      const threatPools = {
        bram: [
          '히익…! 제, 제가 뭘 잘못했나요?! 살려주세요…! 전 그냥 소설 읽던 힘없는 대학생일 뿐이에요…! (겁에 질려 파랗게 질린다)',
          '제, 제발 화내지 마세요…! 원하는 게 있으시면 제 가방 속 소설 원고라도 다 드릴게요…!'
        ],
        ward: [
          '…죽을래? 어디서 풋내기가 형사 앞에서 칼을 뽑으려 드나. 수갑 차고 영하 20도 눈밭에 던져지기 전에 입 다물어라.',
          '시카고 시경 워드 형사다. 내 리볼버 총구는 법보다 빠르다. 꺼져라.'
        ],
        nell: [
          '어머나 세상에…! 손님, 진정하세요…! 제가 뭔가 실수했다면 사과드릴 테니 무서운 말씀은 거두어 주세요…',
          '히익… 왜 그렇게 살벌한 말씀을 하세요… 부디 진정하시고 차라도 한잔 드세요…'
        ],
        nurse_k: [
          '폭력적인 언행은 열차 보안 규정 제8조 위반입니다. 계속 난동을 부리시면 차장과 경비대를 호출해 구금 조치하겠습니다.',
          '환자가 아니시라면 폭력 행위를 즉시 중단하십시오. 승객 안전을 해치는 자는 용납하지 않습니다.'
        ],
        cade: [
          '죽을래? 이 시뻘건 석탄 삽자루로 대가리 한번 쪼개져 볼 텐가? 뼈 빠지게 일하는데 시비 털지 말고 꺼지쇼!',
          '불길 뜨거운 보일러실에서 행패 부리다간 통구이가 되는 수가 있소. 썩 꺼지쇼!'
        ],
        jude: [
          '크하핫! 어이쿠 친구, 왜 그렇게 살벌해? 인생 뭐 있나, 주먹 쥐지 말고 카드나 한 판 하면서 화 푸시게!',
          '워워, 진정하라구! 잭팟 터지기 전에 피 보면 재수 옴 붙는다니까!'
        ],
        harlan: [
          '하! 일개 뜨내기 승객 주제에 감히 내게 위협을 가해? 내 전속 경호원의 총알 맛을 보고 싶은 모양이군.',
          '감히 내 앞에서 입을 놀리다니. 네 목숨값은 내 하루 이자보다 싸다는 걸 명심하시오.'
        ],
        clara: [
          '후훗… 제게서 피를 보고 싶으신가요? 살의를 품은 당신의 눈동자… 제 비극 소설의 결말과 아주 잘 어울려요.',
          '죽음이라… 가장 차갑고 매혹적인 문학적 완성의 순간이죠. 당신이 그 비극의 집행자인가요?'
        ],
        ida: [
          '경고합니다. 신체적 위협 발언은 시카고 철도 경찰법에 의해 즉시 체포 사유가 됩니다.',
          '회장님의 안전을 위협하는 행위는 비서실 보안 프로토콜에 따라 즉각 배제 조치됩니다.'
        ],
        gail: [
          '진정하시게, 젊은 친구! 사람의 분노는 독약과 같아서 스스로를 먼저 해치는 법이라네. 심호흡을 하게.',
          '허허, 살벌한 소린 거두게나. 눈보라에 갇힌 기차 안에서 서로를 해쳐서 무엇을 얻겠는가?'
        ],
        arthur: [
          '응? 죽인다고? 허허, 기원전 2000년 함무라비 법전에도 ‘눈에는 눈, 이에는 이’라 적혀 있긴 하지… 진정하게!',
          '자네, 고대 아시리아 전사의 살기를 그대로 품었구먼! 하지만 학자를 해치면 천벌을 받는다네!'
        ],
        rose: [
          '꺄악…! 왜 그렇게 무서운 말씀을 하세요?! 저, 저한테 해코지하지 마세요…! 흑…',
          '무서워라… 손님, 왜 그렇게 화가 나셨어요? 저 나쁜 사람 아니에요…'
        ],
        lulu: [
          '뭐야?! 감히 세기의 디바 룰루에게 손을 대겠다고?! 당장 내 팬클럽과 경찰들이 널 가만두지 않을 거야!',
          '하! 미치광이가 따로 없네! 차장! 경호원! 당장 이 무례한 놈을 쫓아내!'
        ],
        felix: [
          '우와… 방금 그 험악한 표정, 살인마의 광기가 그대로 묻어났어요! 셔터 누르고 싶지만… 일단 살려주세요!',
          '히익! 카메라 부수지 마세요! 목숨만 살려주시면 당신의 멋진 초상화 사진을 무료로 찍어드릴게요!'
        ],
        mabel: [
          '…천박한 평민 놈이 감히 내 앞에서 입을 놀리다니. 네 목숨값은 내 옷자락 하나보다 싸다는 걸 명심하세요.',
          '하등한 자의 협박 따위 귀담아들을 가치도 없군요. 더러운 손 치우고 썩 꺼지세요.'
        ],
        elias: [
          '오호! 살인 협박인가?! 이거 기사 제목 끝내주겠는데! ‘폭설 열차에서 벌어진 유혈 사태’ 1면 톱기사 감이오!',
          '특종 냄새가 진동을 하네! 날 칠 생각이라면 이 취재 수첩에 당신 유언이나 적어두고 치시오!'
        ]
      };
      return pickNonRepeating(threatPools[key] || ['…무슨 말씀이신지 모르겠습니다.'], `${key}_threat`);
    }

    // 1. SPECIFIC ITEM CRITIQUE: "조끼가 마음에 들지 않아", "옷이 촌스러워"
    if ((mentionsClothes || isCritique) && isCritique) {
      const critiquePools = {
        bram: [
          '앗… 조, 조끼가 마음에 안 드시나요…? 이, 이건 어머니가 대학 입학 선물로 손수 짜주신 거라 아끼던 건데… 역시 유행에 뒤떨어지고 촌스러워 보이나요…? (풀이 죽어 고개를 숙인다)',
          '제 옷차림이 이상한가요…? 죄송해요, 시골에서 갓 올라와서 도시 신사분들 패션은 잘 몰라서… 그렇게 빤히 쳐다보며 흉보시면 부끄러워요…'
        ],
        nell: [
          '어머… 제 앞치마가 마음에 안 드셨나요? 시골에서 직접 짠 수수한 리넨 천이라 도시 분들 눈에는 투박해 보일 수도 있겠네요. 그래도 바느질할 때 주머니가 많아서 편하답니다, 호호.',
          '호호, 촌스러워 보이나요? 화려한 드레스는 아니지만 제 손땀이 한 줄 한 줄 들어간 소중한 작업복이랍니다.'
        ],
        ward: [
          '…내 트렌치코트가 마음에 안 든다고? 패션쇼 보러 기차 탔나? 범인 쫓다 보면 흙먼지에 구르는 게 일상이다. 시비 걸지 말고 네 목숨이나 챙겨.',
          '옷차림 지적질할 시간 있으면 네 주머니나 단속해라. 내 시가 연기가 거슬리면 저쪽 칸으로 꺼지던가.'
        ],
        cade: [
          '석탄재 묻은 멜빵바지가 꼴 보기 싫으면 화부실에서 나가쇼. 삽질해서 기차 굴리는 놈한테 신사 양복이라도 바랐소?',
          '내 작업복이 마음에 안 들면 당신이 이 뜨거운 보일러에 석탄 한번 퍼넣어 보든지!'
        ],
        harlan: [
          '내 코트가 마음에 안 든다고? 천박한 눈에는 최고급 런던 새빌 로의 가치가 보이지 않는 법이지. 감히 내 옷을 품평하려 들지 마시오.',
          '일개 뜨내기 승객 주제에 내 복장을 지적해? 당장 경호원을 불러 내쫓기 전에 입 닥치시오.'
        ],
        jude: [
          '뭐어? 내 이 끝내주는 붉은 슈트가 마음에 안 든다고? 하, 브로드웨이에선 이 옷 하나면 다들 쓰러지는데! 친구, 패션 감각이 영 꽝이구먼!',
          '크하핫! 질투하는 거 다 안다구, 친구! 내 정장이 너무 눈부셔서 눈이 멀 것 같지?'
        ],
        lulu: [
          '뭐라고?! 감히 내 파리산 백여우 모피와 실크 드레스를 모욕해?! 감히 코딱지만 한 게 어디서 평가질이야?! 흥!',
          '하! 네 촌스러운 안목이야말로 구제 불능이네! 어디서 감히 세기의 디바 룰루의 의상을 헐뜯어?!'
        ],
        mabel: [
          '…천한 평민의 눈에 파리 최고급 오트쿠튀르가 보일 리 없죠. 그 더러운 시선을 당장 거두세요. 불쾌하군요.',
          '감히 내 프랑스산 레이스 드레스를 품평하려 들다니… 마구간 마부 수준의 교양이군요.'
        ],
        clara: [
          '후훗… 제 벨벳 드레스가 마음에 들지 않으신가요? 어쩌면 이 어두운 보랏빛이 당신 마음속 죄책감을 자극하기 때문일지도 모르죠.',
          '눈에 거슬리시나요? 하지만 비극의 무대 위에서는 이런 어둡고 무거운 옷이 가장 잘 어울린답니다.'
        ],
        nurse_k: [
          '복장의 심미성보다는 무균성과 실용성이 간호사의 최우선 가치입니다. 비전문적인 지적은 사양합니다.',
          '유니폼은 병원 규정에 따른 제복입니다. 사적인 평가로 의료 업무를 방해하지 마십시오.'
        ],
        elias: [
          '하하! 내 체크무늬 재킷이 너무 튀었소? 기자라면 어디서든 눈에 띄어야 특종을 낚아채는 법이라오!',
          '신경 쓰인다면 내 작전 성공이군! 눈에 팍팍 띄어야 사람들이 말을 걸어오거든!'
        ],
        ida: ['업무 규정에 맞춘 단정한 정장입니다. 사적인 취향을 강요하지 마십시오.', '복장 평가는 회장님 비서 업무와 무관합니다.'],
        gail: ['허허, 투박해 보이나요? 나이가 들면 모양새보다는 찬바람을 막아주는 따뜻한 트위드가 제일이더군요.', '남루해 보여도 30년 동안 환자들을 치료해 온 편안한 옷이랍니다.'],
        arthur: ['응? 내 재킷의 가죽 패치가 이상한가? 책상에 하도 팔꿈치를 대서 닳아 해진 학자의 훈장 같은 걸세, 허허!', '옷에 신경 쓸 시간 있으면 고대 비문 한 줄을 더 연구하지!'],
        rose: ['어머… 제 숄이 별로인가요? 무대 위에서 춤출 때 흩날리면 다들 환호하던데… 조금 서운하네요, 후훗.', '손님 눈에는 어색해 보이나 봐요. 그래도 제 춤을 보시면 생각이 달라지실걸요?'],
        felix: ['아, 제 사파리 조끼가 별로인가요? 주머니가 스무 개나 돼서 렌즈 넣기엔 최고의 조끼인데… 조금 촌스럽긴 하죠, 하하!', '멋보다는 기능성이죠! 무거운 카메라를 들고 뛰려면 이 옷만 한 게 없어요!']
      };
      return pickNonRepeating(critiquePools[key] || ['…제게 불만이 있으신가요?'], `${key}_critique`);
    }

    // 2. SPECIFIC ITEM PRAISE: "옷이 예뻐서요", "조끼 예쁘다", "멋지네요"
    if (mentionsClothes && (isPraise || q.includes('예뻐') || q.includes('멋') || q.includes('좋아'))) {
      const praisePools = {
        bram: [
          '제, 제 조끼를 말씀하시는 건가요…? 어머니가 짜주신 거라 아끼던 건데… 예쁘게 봐주셔서 부끄럽고 감사해요…',
          '단추도 헐렁해서 신경 쓰였는데… 그렇게 칭찬해 주시니 마음이 한결 놓이네요… 고마워요…'
        ],
        nell: [
          '어머나… 제 작업복 앞치마를 보고 말씀하시는 건가요? 제가 직접 천을 끊어다 자수를 놓은 옷이랍니다. 손재주가 있어서 옷 짓는 일을 하거든요.',
          '호호, 칭찬해 주셔서 감사해요. 바느질하는 사람이라 옷 맵시를 제일 신경 쓰는데, 알아봐 주시니 참 기쁘네요.'
        ],
        ward: [
          '…옷? 흙먼지 묻은 싸구려 트렌치코트다. 패션쇼 구경 왔나? 수사에 방해되니 말 걸지 마.',
          '외모 품평이나 할 거면 6호실 카바레 무용수한테나 가 봐. 난 총 찬 형사다.'
        ],
        cade: [
          '석탄 검댕이 잔뜩 묻은 멜빵바지가 뭐가 예쁘다는 거요? 실없는 소리 말고 비키쇼.',
          '땀내 나는 노동자 옷차림을 놀리는 거요? 삽자루 맛 좀 보고 싶소?'
        ],
        harlan: [
          '런던 새빌 로에서 맞춘 최고급 울 코트요. 내 품격을 알아보는 눈은 있군. 하지만 아첨으로 내 호감을 살 생각은 버리시오.',
          '당연히 최고급이지. 100달러짜리 단추가 달린 옷을 당신이 언제 또 보겠소?'
        ],
        jude: [
          '크하하! 역시 보는 눈이 있으시구먼! 브로드웨이 맞춤 양복점에서 한 벌 뽑았지! 태가 나지?',
          '빨간색이 내 행운의 색깔이거든! 카드 패 돌릴 때 상대 기선 제압용으로 딱이라니까!'
        ],
        lulu: [
          '당연하지! 파리에서 맞춘 실크 드레스에 최고급 백여우 모피야! 날 알아보다니 눈썰미는 있네!',
          '흥, 이 몸의 눈부신 자태를 보고도 반하지 않을 자가 어디 있겠니? 감상료라도 내렴!'
        ],
        mabel: [
          '…천박한 평민의 눈으로 감히 내 프랑스산 레이스 드레스를 품평하려 들다니. 물러서세요.',
          '상스러운 입술로 내 의상을 들먹이지 마세요. 역겨울 따름이에요.'
        ],
        clara: [
          '후훗, 보랏빛 벨벳 드레스… 밤의 어둠과 피의 색채를 동시에 담고 있죠. 마음에 드시나요?',
          '비극의 주인공처럼 매혹적인 옷이죠. 당신의 시선에서도 묘한 미학이 느껴지네요.'
        ],
        nurse_k: ['단정한 제복은 의료인의 기본 위생 수칙입니다. 외모 평가보다는 건강 상태에 신경 쓰십시오.', '소독약 냄새가 밴 유니폼일 뿐입니다. 사적인 잡담은 삼가 주십시오.'],
        elias: ['하하! 내 체크무늬 재킷 봤소? 특종 기자라면 이 정도 센스는 있어야지!', '거참 안목이 있으시네! 내일 신문 가십란에 ‘패션 감각 뛰어난 승객’으로 적어줄까?'],
        ida: ['단정한 비서 복장은 회사 규정에 따른 것입니다. 사적인 외모 언급은 불필요합니다.', '업무에 최적화된 테일러드 정장입니다. 용건이 아니면 지나가 주십시오.'],
        gail: ['허허, 따뜻해 보이나요? 나이가 들면 이런 도톰한 트위드 재킷이 제일이지요.', '고맙네, 젊은 친구. 날씨가 워낙 추워서 든든하게 챙겨 입었다네.'],
        arthur: ['음? 재킷 팔꿈치에 가죽 덧댄 거 말인가? 책상에 하도 팔을 대서 닳아 해진 거라네, 허허!', '옷보다는 내 주머니 속 고대 메소포타미아 사본이 훨씬 더 아름답고 귀하지!'],
        rose: ['어머, 실크 숄을 칭찬해 주신 건가요? 무대 위에서 춤출 때 흩날리면 정말 우아하답니다, 후훗.', '호호, 알아봐 주셔서 기뻐요! 카바레 무용수한테 예쁘다는 칭찬만큼 기분 좋은 건 없죠.'],
        felix: ['와, 알아봐 주셔서 기뻐요! 주머니가 많은 이 사파리 조끼가 렌즈 보관하기 딱이거든요!', '활동하기 편한 사진사용 조끼예요! 당신 옷도 흑백 필름에 담으면 아주 멋질 것 같은데요?']
      };
      return pickNonRepeating(praisePools[key] || ['칭찬해 주셔서 고마워요.'], `${key}_praise`);
    }

    // 3. APOLOGY / JUST JOKING: "농담이야", "장난이야", "미안해", "죄송"
    if (q.includes('농담') || q.includes('장난') || q.includes('미안') || q.includes('죄송') || q.includes('미안해')) {
      const jokePools = {
        bram: [
          '휴… 노, 농담이셨군요! 전 또 진짜로 너무 촌스러워서 화나신 줄 알고 가슴이 덜컥 내려앉았어요… 다행이에요…',
          '장난이셨다니 안심이에요… 제가 워낙 소심해서 작은 말에도 상처를 잘 받거든요…'
        ],
        nell: [
          '어머, 농담이셨군요! 깜짝 놀랐잖아요, 호호. 장난꾸러기 손님이시네요.',
          '호호, 괜찮아요 손님. 긴장된 기차 안에서 잠깐 웃자고 하신 말씀인걸요.'
        ],
        ward: [
          '…형사한테 그따위 실없는 장난을 치다니 배짱 한번 두둑하군. 다음엔 진짜로 체포할 테니 조심해라.',
          '농담할 기분 아니다. 얌전히 자리에 앉아 있어.'
        ],
        cade: ['농담이든 뭐든 삽질하는 사람한테 말 걸지 마쇼. 뼈 빠지게 일하는데 기운 빠지오.', '장난칠 시간 있으면 석탄이나 한 삽 퍼담아 보쇼.'],
        harlan: ['…실없는 농담 따위에 낭비할 시간 없소. 물러가시오.', '내게 장난을 칠 수 있는 사람은 이 세상에 몇 안 되오.'],
        jude: ['크하하핫! 거 봐, 장난인 줄 알았다니까! 역시 유머 감각이 남다르구먼, 친구!', '하하, 가슴 철렁했지 뭐야! 한잔 걸치면서 풀자구!'],
        lulu: ['흥! 장난이라도 이 몸의 기분을 상하게 한 죄는 무겁단다! 다신 그러지 마!', '어머, 사과한다면 특별히 이번만 눈감아 줄게. 감사히 알렴!'],
        mabel: ['…천한 자들의 농담이란 천박하기 이를 데 없군요. 두 번 다시 내 앞에서 입을 열지 마세요.', '사과 따위는 하인들에게나 하세요. 역겹군요.'],
        nurse_k: ['장난이나 사담은 객차 내 질서를 어지럽힙니다. 자제하십시오.', '환자가 아니시라면 정숙을 유지해 주십시오.'],
        elias: ['큭큭, 농담이라니 아쉽군! 정색하고 싸웠으면 내일 자극적인 가십 기사거리였는데 말이야!'],
        clara: ['후훗… 농담과 진실의 경계는 언제나 모호한 법이죠. 당신의 장난기 어린 눈빛도 매력적이네요.'],
        ida: ['사과를 접수했습니다. 업무 방해가 되지 않도록 주의해 주십시오.'],
        gail: ['허허, 괜찮습니다. 기차 여행의 적막함을 달래려 농담을 건네셨겠지요.'],
        arthur: ['허허, 농담이었나? 난 또 자네가 진짜로 역사적 고증을 따지는 줄 알았지 뭔가!'],
        rose: ['어머, 깜짝 놀랐잖아요! 손님도 참 짓궂으셔, 후훗.'],
        felix: ['하하! 방금 당황한 제 표정, 찍어두셨으면 걸작이었을 텐데요! 재미있으신 분이네요!']
      };
      return pickNonRepeating(jokePools[key] || ['…농담이셨군요.'], `${key}_joke`);
    }

    // 4. ACTIVITY: "뭐해?", "뭐 읽어?", "무슨 책?", "뭐 보고 있어?", "뭐 하고 있어?"
    if (q.includes('뭐해') || q.includes('뭐 읽') || q.includes('무슨 책') || q.includes('뭐 하') || q.includes('뭐 보고') || q.includes('뭘 하')) {
      const activityPools = {
        bram: [
          '아… 영문학 소설을 읽고 있었어요. 도스토예프스키의 소설인데… 열차가 너무 흔들려서 글자가 눈에 잘 안 들어오네요…',
          '시카고 출판사에 보낼 소설 원고를 퇴고하던 중이었어요… 문장이 너무 유치한 것 같아서 고민이에요…'
        ],
        nell: [
          '덜컹거리는 기차 안이지만 손을 쉬게 둘 수가 없어서 바느질거리를 잡고 있었답니다. 손님 옷에 뜯어진 곳이라도 있나요?',
          '손수건에 들꽃 자수를 놓고 있었어요. 마음이 차분해지거든요.'
        ],
        ward: [
          '…시가 피우면서 승객들 동태를 살피는 중이다. 수상한 짓 하지 마라.',
          '시카고에서 날아온 수배자 명단을 훑어보는 중이다. 내 눈에 띄지 않게 처신해.'
        ],
        cade: ['석탄 퍼넣고 보일러 불씨 확인하는 중이오. 바쁜 거 안 보이오?', '증기압 게이지가 떨어지지 않게 쉴 새 없이 삽질하는 중이오.'],
        nurse_k: ['구급약 상자의 붕대와 소독약을 점검하는 중입니다. 비상시에 대비해야 하니까요.', '환자 차트를 정리 중입니다. 용건이 없으시면 복도를 비워 주십시오.'],
        elias: ['취재 수첩을 정리하면서 오늘 밤 터질 특종의 냄새를 맡고 있었지! 당신도 한 줄 털어놓지 않겠소?', '카메라 렌즈를 닦으며 먹잇감을 노리는 중이오!'],
        harlan: ['시카고 철도 인수 합병 계약서 초안을 검토하는 중이오. 1분 1초가 돈이지.', '비서 아이다에게 비밀 전보를 치라고 지시하던 참이오.'],
        clara: ['차기작 <시카고 특급 살인사건>의 플롯을 구상하며 승객들의 가면을 관찰하고 있었죠.', '눈보라 치는 밤의 차가운 잉크로 살인 트릭을 적어 내리는 중이랍니다.'],
        ida: ['회장님의 다음 주 스케줄과 주식 거래 전보를 암호화하는 중입니다.', '열차 승차 명부를 대조하며 보안 상황을 점검 중입니다.'],
        gail: ['의학 저널을 읽으며 환자들의 상태를 눈으로 살피는 중이었네, 허허.', '청진기와 주사기를 소독약에 담가두고 있었지.'],
        arthur: ['고대 메소포타미아 비문의 탁본을 돋보기로 해독하던 중일세! 이 신비로운 설형문자를 보게!', '발굴 일지를 정리하며 고대 점토판의 연대를 측정하던 참이라네!'],
        jude: ['트럼프 카드 패 섞으면서 다음 판 기술 연습 중이지! 한 판 붙을 텐가, 친구?', '주머니 속 행운의 동전을 굴리며 주사위 점을 치던 중이지!'],
        rose: ['음악을 들으며 다음 카바레 무대의 안무를 머릿속으로 그려보는 중이었어요, 후훗.', '피아노 선율에 맞춰 발끝을 톡톡 두드리고 있었답니다.'],
        lulu: ['내 황금빛 목소리를 위해 따뜻한 레몬수를 마시며 오페라 아리아 악보를 넘기던 중이야!', '내 아름다운 손톱을 다듬으며 팬레터를 읽고 있었단다!'],
        felix: ['롤라이플렉스 카메라의 셔터와 조리개를 점검하고 있었어요! 멋진 순간을 놓치지 않으려구요!', '어젯밤 촬영한 필름 롤을 차광 주머니에 넣고 있었어요!'],
        mabel: ['…(은장식 부채를 천천히 접으며) 감히 남의 사색을 방해할 자격이 당신에게 있나요?', '창밖의 지루한 눈보라를 보며 파리의 살롱을 그리워하던 중이에요. 물러서세요.']
      };
      return pickNonRepeating(activityPools[key] || ['…조용히 쉬고 있었습니다.'], `${key}_activity`);
    }

    // 5. ASKING "WHY" ONLY: "왜?", "왜요?", "이유가 뭐야?"
    if (isAskingWhy) {
      const whyPools = {
        bram: [
          '네…? 아, 아까 제가 불안해 보여서 그러신 건가요? 바깥 눈보라가 너무 거세서 탈선할까 봐 두려워서 그랬어요…',
          '제, 제가 너무 굳어 있어서 이상하셨나요? 낯선 사람과 말하는 게 서툴러서 그래요… 죄송해요…'
        ],
        nell: [
          '아… 기차 안 분위기가 너무 험악해서 손님이 위험한 일을 겪으실까 봐 걱정돼서 드린 말씀이었어요.',
          '1등석 쪽에서 자꾸 고함소리가 들려와서… 괜히 조심하시라고 말씀드렸네요, 호호.'
        ],
        ward: [
          '…이 열차에 쥐새끼 같은 살인 청부업자가 숨어들었기 때문이다. 수상쩍은 놈들이 복도를 서성이고 있어.',
          '수사관의 직감이다. 피비린내 나는 사건이 터지기 직전의 공기야. 알아들었으면 조용히 해.'
        ],
        cade: ['선로에 눈이 얼어붙어 제동 장치가 위험해서 그렇소! 보일러실 불길 지키는 것도 죽을 맛이오.', '1호차 온도가 너무 뜨거우니 화상 입을까 봐 비키라는 거요.'],
        nurse_k: ['겨울철 저체온증과 낙상 위험이 높기 때문입니다. 객차 안전 규정을 준수하십시오.', '전염병 의심 증상이 도는 계절입니다. 위생에 주의하라는 뜻입니다.'],
        elias: ['큭큭, 할란 회장을 노리는 암살자가 탔다는 찌라시가 돌고 있거든! 특종 냄새가 진동을 하잖소!', '눈보라에 고립된 열차는 언제나 범죄의 온상이니까 그렇지!'],
        harlan: ['내 사업 자금을 노리는 불온한 자들이 기차에 잠입했기 때문이오. 내 경호원들은 총을 차고 있소.', '내 주변에서 얼쩡거리다 스파이로 오인받아 봉변당하지 말라는 경고외다.'],
        clara: ['인간의 가장 깊은 탐욕과 악의가 이 밀실 열차에 모였기 때문이죠… 살인이 일어나기에 완벽한 밤이니까요.', '어둠 속에서 반짝이는 저 눈빛들이 보이지 않나요? 누군가는 결말을 준비하고 있어요.'],
        ida: ['회장님의 안전을 위협하는 비인가 접근자가 발생하지 않도록 사전 경고한 것입니다.'],
        gail: ['승객들의 극심한 스트레스가 우려되기 때문입니다. 사소한 시비가 큰 비극이 될 수 있어요, 허허.'],
        arthur: ['기차 진동 때문에 내 수천 년 된 고대 유물이 깨질까 봐 그런 걸세!'],
        jude: ['식당차에 소매치기 타짜들이 득실대니까 그렇지! 내 패를 훔쳐보는 놈들이 한둘이 아니거든!'],
        rose: ['라운지 쪽에 험상궂은 남자들이 위협적인 눈빛으로 돌아다녀서 무서워서 그랬어요…'],
        lulu: ['내 수억짜리 다이아 목걸이를 훔쳐보려는 파파라치와 도둑들이 우글대니까 그렇지!'],
        felix: ['화물칸 쪽에서 이상한 푸른 불빛이 번쩍였거든요! 뭔가 사건이 벌어지고 있어요!'],
        mabel: ['천박한 무리들이 내 주변을 얼씬거리며 공기를 더럽히는 꼴을 참을 수 없기 때문이에요.']
      };
      return pickNonRepeating(whyPools[key] || ['…이유가 궁금하신가요?'], `${key}_why`);
    }

    // 6. DANGER & CAUTION: "조심할게 있나요?", "위험해", "무슨 일"
    if (q.includes('조심') || q.includes('위험') || q.includes('사고') || q.includes('불안') || q.includes('무서')) {
      const dangerPools = {
        nell: [
          '아… 아까 1등석 복도 쪽에서 험악한 덩치들이 소리를 지르는 걸 들었거든요. 이런 눈보라 치는 밤 기차는 밀실이나 다름없으니… 무슨 일이 생길까 봐 불안해서요.',
          '게다가 바깥 눈보라가 너무 거세서 탈선 위험도 있대요. 낯선 사람들도 많고… 부디 밤길 조심하세요.'
        ],
        bram: [
          '바깥 눈보라가 너무 거세서 열차가 탈선할까 봐 두려워요… 게다가 아까 화물칸 쪽에서 검은 그림자가 지나가는 걸 봤는데 너무 무서워요…',
          '8호차에 계신 귀부인의 시선도 너무 차갑고… 기차 안의 모든 공기가 날이 서 있어요…'
        ],
        ward: [
          '…이 열차에 살인 청부업자가 탔다는 첩보가 있다. 쥐새끼처럼 숨어서 누군가를 노리고 있어. 허튼짓 말고 네 방에 처박혀 있어라.',
          '눈보라 때문에 외부 지원도 불가능하다. 의문사가 터져도 아무도 못 막아. 조용히 처신해라.'
        ],
        cade: ['선로에 눈이 얼어붙어 제동 장치가 얼어터질 지경이오. 게다가 1호차 보일러 온도가 비정상적이오. 타죽기 싫으면 객실로 들어가쇼.', '화물칸 쪽에 이상한 나무 상자들이 실렸소. 밤중에 그 주변을 얼쩡거리지 마쇼.'],
        nurse_k: ['외기 온도가 영하 20도까지 떨어져 저체온증 위험이 큽니다. 객차 연결 통로 역시 결빙되어 낙상 위험이 높으니 통행을 삼가십시오.'],
        elias: ['큭큭, 1등석 침대칸의 할란 회장을 노리는 자객이 탔다는 소문이 파다하거든! 피바람이 불기 전에 특종을 잡아야 해!'],
        harlan: ['내 사업 지분을 노리는 경쟁사 끄나풀들이 이 기차에 잠입했다. 내 경호원들이 총을 차고 있으니 알짱거리다 봉변당하지 마시오.'],
        clara: ['눈에 갇힌 특급열차, 단절된 전신선, 그리고 16명의 가면 쓴 승객들… 완벽한 밀실 살인의 무대죠. 당신도 조심하세요, 다음 희생자가 될지 모르니까요.'],
        ida: ['회장님께 접근하려는 불온한 무리들이 감지되었습니다. 의심 행동 시 차장에게 즉시 고발 조치하겠습니다.'],
        gail: ['승객들의 불안과 긴장감이 한계에 달해 있습니다. 이럴 때일수록 사소한 시비가 큰 비극으로 번질 수 있으니 조심하시라는 뜻입니다.'],
        arthur: ['기차가 너무 흔들려서 내 귀중한 고대 비잔틴 석판이 깨질 뻔했다네! 자네도 발조심하게!'],
        jude: ['쉿, 목소리 낮춰, 친구. 식당차에 눈독 들이는 소매치기들이 득실대거든. 내 지갑은 털릴 리 없지만, 자네 지갑은 어떨지 모르지!'],
        rose: ['라운지차 쪽에서 어떤 남자들이 수상한 서류를 주고받는 걸 봤어요… 너무 무서워서 눈을 돌렸답니다.'],
        lulu: ['내 다이아몬드 목걸이를 노리는 도둑놈들이 득실대잖아! 특히 그 시가 피우는 음침한 형사 놈, 아주 거슬려!'],
        felix: ['아까 화물칸 창문 쪽에서 푸른 불빛이 번쩍였어요! 그냥 정전이 아닌 것 같아요, 뭔가가 벌어지고 있어요!'],
        mabel: ['내 유산을 가로채려는 천한 친척들의 자객이 이 기차에 숨어들었을지도 몰라요. 날 건드리는 자는 목숨을 부지하지 못할 거예요.']
      };
      return pickNonRepeating(dangerPools[key], `${key}_danger`);
    }

    // 7. NAME & IDENTITY INQUIRY: "이름이 뭐예요?", "누구세요?", "자기소개", "성함"
    if (q.includes('자기소개') || q.includes('누구') || q.includes('이름') || q.includes('성함') || q.includes('신분') || q.includes('소개')) {
      revealedNames[char.key] = true;
      updateSpeakerTag();
      return char.introLine;
    }

    // 8. JOB / PROFESSION: "직업이 뭐예요?", "무슨 일 하세요?", "뭐하는 사람"
    if (q.includes('직업') || q.includes('무슨 일') || q.includes('일하') || q.includes('뭐하는')) {
      revealedNames[char.key] = true;
      updateSpeakerTag();
      const jobPools = {
        bram: '영문학을 전공하는 대학생이에요… 시카고 출판사에 소설 원고를 내러 가는 중입니다.',
        nell: '전 바느질과 수선을 하는 재봉사예요. 손재주로 옷을 짓는 일을 한답니다.',
        ward: '워드 형사다. 시카고 시경에서 흉악범 잡는 강력계 수사관이지.',
        cade: '난 이 기차의 화부요. 하루 종일 시뻘건 보일러에 석탄을 퍼넣는 육체노동자지.',
        nurse_k: '시카고 중앙 병원 소속 간호사입니다. 열차 내 승객 의료 지원을 담당하고 있습니다.',
        elias: '데일리 모닝의 특종 탐사 기자요! 사건 사고와 숨겨진 추문을 낱낱이 파헤치지!',
        harlan: '할란 코퍼레이션의 총수, 실업가 할란이오. 철도와 금융 자본을 굴리는 사업가지.',
        clara: '미스터리 추리 소설을 집필하는 소설가예요. 인간의 어두운 내면을 글로 엮죠.',
        ida: '할란 회장님의 전속 비서입니다. 회장님의 보안과 일정을 철저히 보좌합니다.',
        gail: '30년 넘게 환자들을 진료해 온 의사라네. 생명을 돌보는 게 내 평생의 업이지.',
        arthur: '고고학과 고대 문자를 연구하는 대학교수일세! 고대 유적 발굴이 내 평생의 낙이지.',
        jude: '헤헤, 자유로운 영혼의 사업가지! 카드 패 좀 굴리고 행운을 나누는 도박사랄까?',
        rose: '화려한 브로드웨이 카바레 무대에서 춤을 추는 무용수 로즈예요!',
        lulu: '카네기홀을 뒤흔드는 브로드웨이 최고의 오페라 프리마돈나, 디바 룰루란다!',
        felix: '세상의 생생한 진실을 롤라이플렉스 카메라에 담는 보도 사진사예요!',
        mabel: '오랜 역사를 지닌 귀족 가문의 상속녀, 메이벨 남작부인이에요.'
      };
      return jobPools[key] || char.introLine;
    }

    // 9. DESTINATION: "어디 가세요?", "목적지", "왜 탔어요?"
    if (q.includes('어디 가') || q.includes('어디로') || q.includes('목적지') || q.includes('왜 탔') || q.includes('행선지') || q.includes('어디까지')) {
      const destPools = {
        bram: '학기말 과제 소설 원고를 출판사에 제출하러 시카고로 가고 있어요… 부디 좋은 평가를 받아야 할 텐데요…',
        nell: '새로 문을 여는 시카고 양복점에 일자리를 얻어서 가는 길이에요. 눈길에 기차가 멈추지만 않으면 좋겠는데…',
        ward: '시카고로 압송되는 주요 용의자의 신병을 확보하기 위해 동승했다. 공무 집행 중이다.',
        cade: '기차가 시카고 종착역에 닿을 때까지 불을 때 주는 게 내 일이오. 내겐 목적지가 아니라 일터요.',
        nurse_k: '시카고 중앙 병원의 긴급 의료 물자 수송 지원 및 위생 점검 임무로 승차했습니다.',
        elias: '시카고 암흑가 보스들의 비밀 회동 특종을 잡으러 가는 길이오! 내일 조간 1면 탑기사지!',
        harlan: '시카고 철도 노선의 인수 합병 서명을 위해 이동 중이오. 100만 달러가 걸린 회담이지.',
        clara: '차기작 <시카고 특급 살인사건>의 현장 취재와 영감을 얻기 위해 이 야간열차를 탔답니다.',
        ida: '회장님의 시카고 비즈니스 정상회담 보좌를 위해 동행 중입니다.',
        gail: '시카고에 있는 오랜 친구의 병원 개원을 축하해 주러 가는 길이라네, 허허.',
        arthur: '시카고 필드 자연사 박물관의 특별 강연과 유물 감정을 위해 가는 길일세.',
        jude: '시카고의 끝내주는 카지노 하우스에서 한판 크게 벌여볼 생각이거든, 크하핫!',
        rose: '시카고 극장 무대에서 독무 공연이 잡혀 있어요. 리허설이 벌써 설레네요.',
        lulu: '시카고 오페라 하우스의 갈라 콘서트 오프닝을 장식하러 가는 길이란다!',
        felix: '시카고의 마천루와 밤거리를 카메라에 담아 첫 개인 사진전을 열 계획이에요!',
        mabel: '시카고 시 법원에서 진행 중인 내 가문의 유산 상속 재판에 출석하는 길이에요.'
      };
      return pickNonRepeating([destPools[key]], `${key}_dest`);
    }

    // 10. SUSPECTS & MYSTERY: "수상한 사람", "마피아", "범인", "살인", "경찰"
    if (q.includes('수상') || q.includes('마피아') || q.includes('범인') || q.includes('살인') || q.includes('경찰') || q.includes('의심')) {
      const susPools = {
        bram: ['8호차에 혼자 앉아 계신 귀부인의 시선이 너무 차가워서 온몸에 소름이 돋았어요…', '설마 이 기차에 마피아가 타고 있는 건 아니겠죠…? 너무 무서워요…'],
        ward: ['식당차의 붉은 정장 녀석(주드)과 1등석 할란 회장을 주시해라. 둘 다 피비린내가 난다.', '살인 사건? 네가 범인이 아니라면 조용히 네 칸에 처박혀 있어라.'],
        nell: ['잘 모르겠지만… 1등석 쪽에서 종종 험악한 고성이 들려와서 무서워요.', '누군가 다치는 일은 결코 없어야 할 텐데… 하느님 맙소사.'],
        cade: ['2호차 화물칸 주변을 서성거리는 양복쟁이들이 제일 수상하오.', '난 석탄만 땔 뿐이오. 누가 죽든 살든 내 알 바 아니오.'],
        nurse_k: ['범죄 혐의자는 2호차 워드 형사의 소관입니다. 근거 없는 헛소문은 객차 질서를 파괴할 뿐입니다.'],
        elias: ['큭큭, 이 열차 자체가 범죄의 종합선물세트요! 특히 1등석 침대칸을 눈여겨보시오!', '마피아? 특종 냄새가 진동을 하는군! 당신, 뭔가 알고 있소?'],
        harlan: ['내 신경을 거슬리게 하는 파파라치(엘리아스) 놈 말고는 아무도 관심 없소.'],
        clara: ['인간은 누구나 가면을 쓰죠. 가장 온순해 보이는 사람이 가장 잔혹한 범죄를 저지르는 법이랍니다.'],
        ida: ['회장님께 접근하려는 불온한 인물이 없는지 제가 철저히 감시 중입니다.'],
        gail: ['모두가 불안에 떨고 있군요. 긴장감이 극에 달하면 사소한 오해도 비극이 될 수 있습니다.'],
        arthur: ['수상한 건 바로 이 열차의 진동일세! 책을 읽을 수가 없어!'],
        jude: ['하하! 이 세상에 안 수상한 인간이 어디 있어, 친구? 나 빼고 전부 다 수상하지!'],
        rose: ['라운지차에서 노래하는 룰루 씨가 왠지 모르게 초조해 보이시더라고요.'],
        lulu: ['내 미모를 훔쳐보는 남자들 전부가 수상해! 특히 3호차의 그 얼빠진 학생 녀석!'],
        felix: ['제 렌즈는 거짓말을 안 하죠. 어젯밤 화물칸 쪽에서 번쩍인 불빛이 아주 수상했어요.'],
        mabel: ['천박한 무리들이 우글거리는 이 기차 전체가 혐오스러울 따름이에요.']
      };
      return pickNonRepeating(susPools[key], `${key}_sus`);
    }

    // 11. WEATHER & BLIZZARD: "춥네요", "날씨", "눈", "눈보라", "기차"
    if (q.includes('춥') || q.includes('추워') || q.includes('날씨') || q.includes('눈보라') || (q.includes('눈') && !q.includes('눈빛')) || q.includes('기차') || q.includes('흔들')) {
      const weatherPools = {
        bram: '창밖을 보면 온통 하얀 눈뿐이라… 세상에 이 기차만 남겨진 기분이에요…',
        nell: '정말 살을 에는 듯한 추위예요. 따뜻한 차라도 한 잔 드시면 좋을 텐데…',
        ward: '눈보라 때문에 시야가 제로다. 통신선도 끊겼을 테니 밖에서 도울 수 없어.',
        cade: '바깥 추위가 어쨌든 보일러실은 불지옥이오. 불길이나 안 꺼지면 다행이지.',
        nurse_k: '난방이 고르지 못하니 옷을 여미십시오. 동상이나 감기에 걸리기 십상입니다.',
        elias: '폭설 속에 갇힌 유령 열차라… 신문 표제어로 기가 막힌 제목이군!',
        harlan: '눈보라 따위로 내 일정이 지체되는 건 용납할 수 없소.',
        clara: '폭설 속에 고립된 은빛 뱀… 비극이 시작되기에 더없이 아름다운 밤이네요.',
        ida: '기상 악화로 인한 연착 상황을 실시간으로 확인 중입니다.',
        gail: '눈이 그칠 기미가 안 보이는구먼. 기관사들이 고생이 많겠어.',
        arthur: '허허, 이 정도 눈보라는 알래스카 발굴 때에 비하면 봄바람 수준이지!',
        jude: '기차가 덜컹거려야 손기술 쓰기가 더 좋은 법이지! 날씨야 더 험해져라, 으하하!',
        rose: '창문에 서리가 하얗게 끼었네요. 마치 무대 위의 하얀 커튼 같아요.',
        lulu: '너무 건조해서 내 성대가 갈라질 지경이야! 차장한테 난방 좀 줄이라고 해!',
        felix: '창밖으로 흩날리는 눈발을 셔터 스피드 1/500초로 찍으면 예술일 텐데 말이죠!',
        mabel: '유리창에 낀 성에조차 내 신경을 거슬리게 하는군요. 조용히 눈이나 감고 있으세요.'
      };
      return pickNonRepeating([weatherPools[key]], `${key}_weather`);
    }

    // 12. SLANG, MEMES, LAUGHTER: "개웃기노", "ㅋㅋ", "ㅎㅎ", "줴줴", "미친", "대박", "헐"
    if (q.includes('웃기') || q.includes('ㅋㅋ') || q.includes('ㅎㅎ') || q.includes('줴줴') || q.includes('개') || q.includes('헐') || q.includes('대박') || q.includes('미친')) {
      const slangPools = {
        bram: [
          '네…? 웃, 웃기신가요? 전 지금 심각한데… 놀리지 말아 주세요…',
          '‘줴줴’라니요…? 혹시 신조어인가요? 제가 영문과 학생이지만 그런 단어는 처음 들어봐요…',
          '왜 그렇게 실실 웃으세요…? 제 얼굴에 잉크라도 묻었나요? 부끄럽게…'
        ],
        nell: [
          '어머나, 뭐가 그렇게 즐거우신가요? 저도 덩달아 웃음이 날 것 같네요, 호호.',
          '‘줴줴’요? 어머, 이국적인 외국어인가 봐요. 무슨 뜻인지 가르쳐 주실래요?'
        ],
        ward: [
          '…뭐가 그렇게 우습지? 내 총구가 우스꽝스럽게 생기기라도 했나?',
          '줴줴? 암호라도 대는 건가? 취조실에서 그런 헛소리 하면 바로 뼛속까지 털린다.'
        ],
        cade: ['…뭐가 그렇게 실실 웃기오? 남은 땀 흘려 일하는데 장난칠 기분 아니오.', '줴줴인지 뭔지 괴상한 소리 말고 저리 비키쇼.'],
        nurse_k: ['실실 웃으며 횡설수설하는 것을 보니 안정이 필요해 보이시는군요. 헛소리는 사절입니다.'],
        elias: ['하하! 웃기요? 내일 신문 1면에 ‘열차 안에서 헛소리하는 괴짜 승객’으로 실어줄까?'],
        harlan: ['천박하게 실실 쪼개는 꼴이라니. 교양 없는 부랑자 같으니라고.'],
        clara: ['후훗, 미소 뒤에 숨겨진 신경질적인 떨림… 제 추리 소설 속 용의자와 꼭 닮으셨네요.'],
        ida: ['상스러운 은어 사용은 즉각 중단해 주십시오.'],
        gail: ['허허, 기차 여행의 긴장을 웃음으로 푸시는 모양이군요. 긍정적인 태도는 건강에 좋습니다.'],
        arthur: ['응? ‘줴줴’라니… 자네 혹시 수메르 설형문자의 방언을 구사하는 겐가?!'],
        jude: ['크하하핫! 거 봐, 내 말이 맞지? 같이 낄낄 웃으며 한잔 꺾는 게 장땡이지!'],
        rose: ['어머, 그렇게 활짝 웃으시니 보기 좋네요! 카바레 관객들처럼 유쾌하신 분이군요.'],
        lulu: ['어머! 내 앞에서 감히 실실 쪼개? 내가 지금 코미디언으로 보여?! 흥!'],
        felix: ['와우! 방금 웃을 때 광대뼈 각도가 아주 드라마틱했어요! 한 장 찍어도 될까요?'],
        mabel: ['…천박하게 이를 드러내며 낄낄거리지 마세요. 불쾌하군요.']
      };
      return pickNonRepeating(slangPools[key], `${key}_slang`);
    }

    // 13. AGE: "몇 살이야?", "나이가 어떻게 돼?"
    if (isAskingAge) {
      const exactAgePools = {
        bram: ['스물한 살이에요… 아직 대학 영문과 2학년이라 세상 물정을 잘 몰라요…', '스물한 살입니다… 어머니 품을 떠나 시카고로 가는 길인데 모든 게 낯설고 두렵네요…'],
        ward: ['서른여덟이다. 형사 나이 캐물어서 뭐하게? 호구조사 하러 왔나? 용건 없으면 꺼져라.', '서른여덟. 현장에서 구를 만큼 굴렀지. 네 나이나 걱정해라.'],
        nell: ['스물셋이랍니다, 호호. 열일곱 살 때부터 어머니 어깨너머로 바느질을 배워서 벌써 6년째네요.', '스물셋이에요. 아직 배울 게 많은 어린 재봉사랍니다.'],
        nurse_k: ['의료 면허를 취득한 지 7년 된 전문 간호사입니다. 의료 업무와 무관한 개인 신상 질문은 답하지 않습니다.'],
        cade: ['스물일곱이오. 열다섯 살 때부터 기관차 탄수차에서 석탄을 펐으니 몸뚱이는 마흔은 된 것 같소만.'],
        jude: ['헤헤, 민증 까라는 거야, 친구? 신사답게 서른둘이라고 해두지! 한창 물오른 전성기 아니겠어?'],
        harlan: ['쉰둘이오. 당신 나이 때 난 이미 첫 철도 회사를 세웠지. 나이 타령할 시간에 한 푼이라도 더 버시오.'],
        clara: ['글을 쓰는 이에게 나이란 숫자에 불과하죠… 스물아홉 번의 차가운 겨울을 보냈답니다, 후훗.'],
        ida: ['스물여덟입니다. 회장님의 신임을 얻어 비서실을 총괄한 지 5년 차입니다.'],
        gail: ['환갑을 훌쩍 넘긴 예순셋이라네. 머리칼은 하얗게 셌지만 청진기 잡는 손은 아직 흔들리지 않지, 허허.'],
        arthur: ['올해로 쉰여덟일세! 하지만 내 영혼은 3천 년 전 수메르 문명에 가 있지, 허허!'],
        rose: ['스물둘이에요, 후훗. 카바레 무대에 선 지 3년 됐는데 다들 제 춤을 보고 더 성숙하게 보시더라고요.'],
        lulu: ['어머! 숙녀에게 나이를 묻다니 결례도 이런 결례가 없어! 난 영원한 스물네 살의 디바란다!'],
        felix: ['스물다섯이에요! 라이카와 롤라이플렉스를 어깨에 멘 지 5년째죠! 아직 혈기 왕성하답니다!'],
        mabel: ['…상스러운 입으로 귀족 가문의 연령을 들먹이다니. 마구간 마부 수준의 교양이군요. 대답할 가치도 없어요.'],
        elias: ['서른하나! 발로 뛰는 탐사 기자로서는 가장 피 끓고 날카로운 나이지! 당신은 몇 살이오?']
      };
      return pickNonRepeating(exactAgePools[key] || ['…나이가 궁금하신가요?'], `${key}_age`);
    }

    // 13-1. HOMETOWN: "고향이 어디야?", "어디서 왔어?"
    if (isAskingHometown) {
      const hometownPools = {
        bram: ['매사추세츠의 작은 시골 마을 출신이에요… 그곳의 조용한 도서관이 참 그리워요…'],
        ward: ['시카고 남부 빈민가 출신이다. 산전수전 다 겪고 이 자리까지 왔지.'],
        nell: ['고향은 버몬트 시골이에요. 푸른 풀밭과 양들이 참 예쁜 곳인데… 시카고는 어떤 곳일지 설레네요.'],
        nurse_k: ['필라델피아 의학원 부속 간호학교를 졸업했습니다. 근무지는 시카고 중앙 병원입니다.'],
        cade: ['펜실베이니아 탄광촌 출신이오. 평생 검은 먼지만 마시고 살았지.'],
        jude: ['뉴욕 브루클린 뒷골목 출신이지! 바닥부터 주사위 굴려가며 자란 자유로운 영혼이라구!'],
        harlan: ['보스턴 명문 자본가 가문 출신이오. 내 가문의 역사는 이 기차 선로보다 길고 거대하지.'],
        clara: ['안개 낀 뉴잉글랜드의 바닷가 고택에서 자랐죠… 그곳의 음산한 파도 소리가 제 추리 소설의 고향이랍니다.'],
        ida: ['뉴욕 공립 비서학교를 수석 졸업했습니다. 철저한 보안이 제 생활 신조입니다.'],
        gail: ['오하이오의 작은 농촌 마을 출신이라네. 30년 넘게 마을 사람들의 상처를 치료해 왔다네.'],
        arthur: ['영국 옥스퍼드에서 고고학을 공부하고 시카고 대학으로 건너왔네. 유적 발굴지가 곧 내 집이지!'],
        rose: ['루이지애나 뉴올리언스 출신이에요! 그곳의 재즈 음악과 낭만 속에서 춤을 배웠답니다.'],
        lulu: ['파리와 밀라노를 오가며 오페라 무대에 섰지! 내 고향은 바로 눈부신 조명이 쏟아지는 무대 위야!'],
        felix: ['캘리포니아의 눈부신 태양 아래서 자랐어요! 하지만 눈보라 치는 시카고의 겨울도 사진으로 꼭 담고 싶었죠!'],
        mabel: ['유럽 합스부르크 왕실과 연결된 유서 깊은 혈통이에요. 천민인 당신이 입에 올릴 가문이 아니에요.'],
        elias: ['시카고 뒷골목 신문 배달부로 시작해서 데일리 모닝의 에이스 기자가 됐지! 바닥부터 다져진 몸이오!']
      };
      return pickNonRepeating(hometownPools[key] || ['…고향이 궁금하신가요?'], `${key}_hometown`);
    }

    // 14. FOOD & DRINK: "배고파", "밥 먹을래?", "식당차", "술 한잔", "커피"
    if (isFood || isDrink) {
      const foodPools = {
        bram: [
          '아… 저도 아침부터 딱딱한 빵 한 조각밖에 못 먹어서 배가 꼬르륵거려요… 식당차 가려면 6호차까지 가야 하는데 돈이 부족해서…',
          '따뜻한 홍차나 코코아 한 잔 마실 수 있다면 소원이 없겠어요… 기차가 너무 추워요…'
        ],
        ward: [
          '식당차? 6호차에 가면 위스키랑 스테이크가 있다. 난 이 독한 시가 한 대면 충분해.',
          '형사는 현장에서 굶는 게 일상이다. 술 마시고 취해서 헛소리할 거면 저쪽 칸으로 가.'
        ],
        nell: [
          '출발하기 전에 집에서 싸 온 호밀빵과 사과가 조금 있는데… 괜찮으시다면 조금 떼어 드릴까요?',
          '따뜻한 보리차를 보온병에 담아왔답니다. 손이 많이 시려우시면 한 잔 따라 드릴게요, 호호.'
        ],
        nurse_k: [
          '규칙적인 식사는 저혈당과 위장 질환을 예방합니다. 6호차 식당차를 이용하십시오.',
          '과도한 음주는 심장 박동 이상과 낙상 사고를 유발합니다. 객차 내 음주는 자제하십시오.'
        ],
        cade: [
          '석탄 불길 앞에서 땀 빼고 나면 시원한 흑맥주 한 잔이 간절하오. 시카고 도착하자마자 선술집으로 뛸 거요.',
          '삽질하려면 밥심이 최고지! 보일러 열기에 데워먹는 베이컨 샌드위치가 내 유일한 낙이오.'
        ],
        jude: [
          '크하하! 6호차 식당차 바텐더한테 ‘주드 소개로 왔다’고 해 봐! 끝내주는 버번위스키를 내줄 테니까!',
          '한잔 걸치면서 카드 한 판 어때, 친구? 진 사람이 술값 몰아주기 내기하자구!'
        ],
        harlan: [
          '내 전용 요리사가 최고급 안심 스테이크를 준비 중이오. 천박한 일반 식당칸 음식 따위는 입에도 안 대오.',
          '1912년산 빈티지 코냑이 아니면 마시지 않소. 당신 같은 서민이 맛볼 수 있는 술이 아니오.'
        ],
        clara: [
          '진한 블랙커피에 럼주 한 방울… 어두운 밤에 소설을 쓸 때 이보다 달콤한 양식은 없죠, 후훗.',
          '붉은 와인 한 잔… 유리잔을 타고 흐르는 핏빛 액체를 보면 살인 트릭의 영감이 번뜩인답니다.'
        ],
        ida: [
          '회장님의 식사는 1등석 전용 케이터링으로 제공됩니다. 외부 음식물 반입은 위생상 금지입니다.',
          '업무 시간 중 음주는 사내 규정상 엄격히 금지되어 있습니다.'
        ],
        gail: [
          '허허, 시장하시다면 6호차로 가보시게. 따뜻한 쇠고기 스튜가 추위를 녹이는 데 아주 일품이라네.',
          '추운 날씨엔 따뜻한 차나 국물이 최고지요. 과음은 체온 조절을 방해하니 조심하시게.'
        ],
        arthur: [
          '음식보단 지식의 양식이 먼저지! …라고 말하고 싶지만, 아침에 먹은 귀리죽이 벌써 다 꺼졌구먼, 허허.',
          '고대 메소포타미아인들도 맥주를 마시며 점토판을 구웠다네! 시원한 에일 한 잔 그립구먼!'
        ],
        rose: [
          '6호차 식당차에서 가끔 재즈 공연도 열려요! 맛있는 와인 한잔하면서 제 춤 보러 오세요, 후훗.',
          '무대에 오르기 전엔 가벼운 과일 샐러드만 먹는답니다. 몸이 무거워지면 스텝이 엉키거든요.'
        ],
        lulu: [
          '내 황금빛 목소리를 위해선 미지근한 레몬 꿀물과 캐비어 카나페만 먹는단다. 싸구려 기차 음식은 질색이야!',
          '샴페인이 아니면 목구멍으로 안 넘어가! 차장한테 당장 돔 페리뇽 가져오라고 전해!'
        ],
        felix: [
          '저도 배고파 죽겠어요! 카메라 필름 살 돈은 있어도 빵 사 먹을 50센트가 모자라다니까요, 하하!',
          '따뜻한 커피 한 잔 마시면서 어두운 창밖을 바라보면 정말 예술적인 감성이 솟아나요!'
        ],
        mabel: [
          '프랑스산 샴페인과 오세트라 캐비어가 아니라면 입도 대지 않아요. 천한 음식 냄새 풍기지 마세요.',
          '…남작 가문의 만찬실에 비하면 이 기차의 식당칸은 돼지 우리나 다름없군요. 역겨워요.'
        ],
        elias: [
          '기자의 밥은 바로 ‘특종’이지! …농담이고, 6호차 바에서 파는 호밀빵 샌드위치 꽤 먹을 만하오!',
          '독한 진(Gin) 한 잔 털어 넣어야 특종 기사 문장이 찰지게 써지는 법이지! 한잔 살 테요?'
        ]
      };
      return pickNonRepeating(foodPools[key] || ['…식사 맛있게 하십시오.'], `${key}_food`);
    }

    // 15. TIME & CLOCK: "몇 시야?", "지금 몇 시?", "시간이 어떻게 돼?"
    if (isAskingTime) {
      const timePools = {
        bram: [
          '아… 제 낡은 시계로는 지금 밤 11시 42분이에요… 자정이 다 되어 가는데 눈보라가 멈추질 않네요…',
          '자정이 다 돼 가요… 기차가 어둠 속을 덜컹거리며 달릴 때마다 너무 무서워요…'
        ],
        ward: [
          '자정 15분 전이다. 늦은 밤이다. 수상하게 복도 기웃거리지 말고 네 침대로 꺼져라.',
          '시계 볼 줄 모르나? 곧 자정이다. 어슬렁거리다 의심 사지 마.'
        ],
        nell: [
          '밤 11시 반이 훌쩍 넘었어요. 기차 안이 곧 소등될 시간인데… 피곤하지 않으세요? 호호.',
          '자정이 다 되었네요. 날씨가 험해서 기차가 예정보다 조금 연착되는 것 같아요.'
        ],
        nurse_k: [
          '현재 시각 23시 43분입니다. 야간 정숙 시간이니 불필요한 객차 간 이동은 삼가 주십시오.',
          '취침 시간입니다. 면역력 유지를 위해 속히 휴식을 취하십시오.'
        ],
        cade: [
          '밤 열두 시가 다 돼 가오! 지금쯤이면 석탄을 다섯 톤은 더 퍼넣었어야 하는데 압력이 모자라오!',
          '시간 볼 틈이 어디 있소! 시계 볼 시간 있으면 불씨 꺼지지 않게 삽질이나 거드쇼!'
        ],
        jude: [
          '자정이 가까워질수록 판돈이 두 배로 커지는 법이지! 지금이 바로 도박꾼들의 골든타임이라구, 친구!',
          '11시 45분! 슬슬 타짜들이 식당차 테이블로 모여들 시간이구먼, 흐흐!'
        ],
        harlan: [
          '시간은 금이오. 내 롤렉스 금장 회중시계는 밤 11시 45분을 가리키고 있소. 1초도 낭비하지 마시오.',
          '내 시간은 분당 100달러요. 시간 물어보느라 내 100달러를 날린 셈이오. 물러가시오.'
        ],
        clara: [
          '마녀의 시간, 자정이 다가오고 있네요… 피와 비명이 깨어나기에 완벽한 시각이에요, 후훗.',
          '째깍거리는 초침 소리… 누군가의 생명의 모래시계가 바닥을 향해 떨어지는 소리 같지 않나요?'
        ],
        ida: [
          '현재 시각 23시 44분입니다. 회장님의 일일 보안 결산 보고 시간입니다.',
          '정각 자정에 기차 보안 순찰이 예정되어 있습니다.'
        ],
        gail: [
          '자정이 머지않았구먼. 밤이 깊었으니 무리하지 말고 눈을 좀 붙이시는 게 건강에 좋겠네.',
          '11시 45분일세. 이 시간엔 체온이 떨어지기 쉬우니 옷을 단단히 여미게나.'
        ],
        arthur: [
          '음! 내 태엽 회중시계가 멈춰버렸네! 고대 바빌로니아 해시계가 있었으면 바로 알 텐데 말일세, 허허!',
          '기차 시간에 얽매이지 말게나! 영원의 역사 앞에서는 1시간이나 100년이나 찰나일 뿐이지!'
        ],
        rose: [
          '어머, 벌써 12시가 다 됐나요? 라운지차 무대 마지막 앙코르 준비하러 갈 시간이네요, 후훗.',
          '자정의 기차 여행이라니… 왠지 모르게 로맨틱하면서도 가슴이 두근거려요.'
        ],
        lulu: [
          '미녀에겐 미용 수면이 생명인데 벌써 자정이라니! 다크서클 생기면 당신이 책임질 거야?!',
          '내 피부가 건조해질 시간이야! 차장 불러서 가습기 틀라고 해!'
        ],
        felix: [
          '밤 11시 42분이에요! 암실 조명처럼 어두워서 고감도 셔터로도 초점 잡기 힘든 시간이네요!',
          '자정의 설원을 달리는 은빛 기차… 장노출로 찍으면 정말 기막힌 사진이 나올 텐데요!'
        ],
        mabel: [
          '…시간이 몇 시든 천민인 당신에게 알려줄 의무는 없어요. 물러서세요.',
          '내 다이아몬드 손목시계는 귀족의 시간을 가리키고 있어요. 천한 눈으로 훔쳐보지 마세요.'
        ],
        elias: [
          '마감 시간 20분 전이오! 오늘 밤 자정 전에 특종 기사를 본사 전신으로 날려야 한단 말이오!',
          '11시 45분! 밤이 깊어질수록 거물들의 비밀스러운 뒷거래가 시작되는 법이지!'
        ]
      };
      return pickNonRepeating(timePools[key] || ['…자정이 다 되어 갑니다.'], `${key}_time`);
    }

    // 16. COMPLIMENT TO APPEARANCE (WITHOUT CLOTHES): "잘생겼다", "예쁘다", "멋지다", "매력적이야"
    if (isPraiseAppearance) {
      const appearancePools = {
        bram: [
          '네…? 저, 저요…? 저보고 잘생겼다고 하신 건가요…? (얼굴이 새빨개지며 손을 내젓는다) 저, 전 그냥 시골 대학생인데요… 놀리시는 거죠…?',
          '어, 얼굴이 화끈거려요… 그런 칭찬은 어머니 말고는 처음 들어봐서 부끄러워요…'
        ],
        ward: [
          '…헛소리 집어치워라. 얼굴로 범인 잡는 거 아니다. 기름기 뺀 용건만 대.',
          '형사 면상에 대고 수작 부리지 마라. 닭살 돋으니 저리 꺼져.'
        ],
        nell: [
          '어머나… 부끄러워라… 예쁘게 봐주셔서 정말 감사해요, 손님. 덜컹거리는 기차 안에서 따뜻한 위로가 되네요, 호호.',
          '호호, 손님도 참 입담이 좋으시네요. 칭찬해 주시니 얼굴이 빨개졌잖아요.'
        ],
        nurse_k: [
          '외모에 대한 사적인 평가는 간호 업무에 전혀 불필요합니다. 용태에 이상이 없으시면 복도를 비워 주십시오.',
          '단정한 용모는 위생 규정의 일부일 뿐입니다. 사담은 사양합니다.'
        ],
        cade: [
          '얼굴에 석탄재가 시커멓게 묻었는데 뭐가 멋지다는 거요? 실없는 수작 부리지 말고 비키쇼.',
          '땀내 나는 노동자 얼굴을 놀리는 거요? 삽자루 맛 좀 보고 싶소?'
        ],
        jude: [
          '크하하핫! 역시 보는 눈이 끝내주시네, 친구! 브로드웨이 길거리만 걸어도 여자들이 다 쓰러진다니까!',
          '태가 나지? 카지노 테이블에서도 이 잘생긴 얼굴로 블러핑하면 다들 홀라당 넘어간다구!'
        ],
        harlan: [
          '외모보단 능력이 남자의 가치를 증명하는 법이지. 하지만 품격을 알아본 안목은 인정해 주지.',
          '성공한 사업가의 카리스마는 돈과 권력에서 나오는 법이오.'
        ],
        clara: [
          '후훗… 칭찬 고마워요. 하지만 겉모습의 아름다움 속엔 언제나 치명적인 독이 숨어 있는 법이랍니다.',
          '당신의 시선에서도 매혹적인 미학이 느껴지네요. 제 소설의 비극적인 주인공처럼요.'
        ],
        ida: [
          '외모에 대한 언급은 직무 규정상 답변하지 않습니다. 비서로서의 전문성만 평가해 주십시오.',
          '사적인 감정이 섞인 발언은 업무 방해로 간주될 수 있습니다.'
        ],
        gail: [
          '허허, 늙은이에게 덕담을 건네주시니 고맙구먼. 젊은 친구도 아주 인상이 훤칠하고 좋아 보여요.',
          '마음이 고우면 얼굴도 밝아지는 법이지. 자네도 참 따뜻한 인상을 가졌네.'
        ],
        arthur: [
          '허허! 내 인상이 로마 조각상 카이사르를 닮았다는 소린가? 고마운 덕담일세!',
          '젊었을 땐 발굴 현장에서 꽤 날렸지! 나일강의 미남 학자로 불렸다네, 허허!'
        ],
        rose: [
          '어머, 알아봐 주셔서 감사해요! 카바레 무용수한테 예쁘다는 말은 최고의 찬사랍니다, 후훗!',
          '호호, 정말요? 관객분들이 무대 위 제 미소를 참 좋아해 주시는데, 손님 눈에도 예뻐 보이나 봐요!'
        ],
        lulu: [
          '당연한 소릴 새삼스럽게! 이 몸은 브로드웨이 최고의 미모와 목소리를 타고난 디바 룰루라구!',
          '흥! 이제야 세기의 여신을 제대로 알아보는구나! 감상료라도 두둑이 내렴!'
        ],
        felix: [
          '와, 감사합니다! 하지만 피사체로선 당신이 훨씬 더 매력적이에요! 렌즈에 담고 싶을 만큼요!',
          '제 얼굴보단 제 카메라 앵글 속 세상이 훨씬 더 눈부시고 아름답죠, 하하!'
        ],
        mabel: [
          '…천박한 평민의 아첨 따위엔 귀 기울이지 않아요. 역겨우니 그 더러운 시선을 거두세요.',
          '고귀한 귀족의 혈통과 천민의 상스러운 눈빛은 섞일 수 없어요. 물러서세요.'
        ],
        elias: [
          '하하! 이 정도면 신문사에서 제일 잘나가는 훈남 기자 아니겠소? 신문에 내 사진 대문짝만하게 박아야겠군!',
          '거참 안목이 있으시네! 내일 조간신문 1면에 ‘특급열차의 매력적인 승객들’로 한 줄 적어줄까?'
        ]
      };
      return pickNonRepeating(appearancePools[key] || ['…칭찬 감사합니다.'], `${key}_appearance`);
    }

    // 17. INSULT & CRUDITY: "바보야", "멍청이", "재수없어", "짜증나", "미친놈"
    if (isInsult) {
      const insultPools = {
        bram: [
          '죄, 죄송해요… 제가 둔하고 멍청해서 답답하셨죠… 화내지 마세요… (고개를 푹 숙인다)',
          '훌쩍… 왜 다들 저한테 욕을 하실까요… 제가 그렇게 한심해 보이나요…'
        ],
        ward: [
          '…네놈 혓바닥이 주둥이 밖으로 탈출하고 싶어 안달이 났군. 감방 바닥에 처박히기 전에 닥쳐라.',
          '형사 모욕죄로 체포당해서 영하 20도 수하물칸에 묶이고 싶지 않으면 조용히 꺼져.'
        ],
        nell: [
          '어머… 제가 뭔가 큰 실수를 했나요…? 기분 상하게 해드렸다면 정말 죄송해요…',
          '그렇게 험한 말씀을 하시면 가슴이 덜컥 내려앉아요 손님… 부디 노여움을 푸세요…'
        ],
        nurse_k: [
          '모욕적인 언사는 철도 질서 위반입니다. 즉시 언행을 시정하십시오.',
          '감정적 분노 조절 장애 증상으로 판단됩니다. 정숙을 유지하지 않으시면 구금 조치합니다.'
        ],
        cade: [
          '뭐라고 지껄였소? 삽자루로 주둥이 한번 후려갈겨 줄까? 뼈 빠지게 일하는 사람한테 욕설이라니!',
          '이 뜨거운 보일러 화구 속으로 머리통 처박히기 싫으면 당장 꺼지쇼!'
        ],
        jude: [
          '어이쿠, 친구! 왜 그렇게 입이 걸어? 돈 잃고 성질내는 타짜마냥 왜 그래, 하하!',
          '욕해봤자 네 입만 더러워지지! 난 귓등으로도 안 들린다구, 크하핫!'
        ],
        harlan: [
          '천박한 부랑자의 입에서 오물이 쏟아지는군. 당장 내 시야에서 사라지시오.',
          '감히 내 명예를 훼손해? 시카고 일류 로펌 변호사단을 풀어 네 인생을 파멸시켜 주지.'
        ],
        clara: [
          '후훗… 타인을 향한 혐오와 경멸… 그 감정이 바로 가장 완벽한 살인 동기가 되죠.',
          '당신의 입술 사이로 흘러나오는 악의… 제 소설 속 가장 비참하게 파멸할 악역의 대사 같군요.'
        ],
        ida: [
          '상대방을 향한 모욕죄로 시카고 도착 즉시 정식 법적 고발 조치하겠습니다.',
          '수준 이하의 발언에는 일체 응대하지 않겠습니다. 물러서십시오.'
        ],
        gail: [
          '허허, 마음속 화가 가득 차 있군요. 화를 다스리지 못하면 혈압이 오르고 심장을 상하게 됩니다.',
          '욕설은 스스로의 인격을 깎아내릴 뿐이라네. 차분히 마음을 가라앉히게나.'
        ],
        arthur: [
          '응? 자네 방금 날 욕한 건가? 허허, 고대 아카드 제국의 욕설 비문보다 훨씬 수준이 낮구먼!',
          '무식한 자의 폭언은 학자의 귀를 더럽히지 못한다네, 허허!'
        ],
        rose: [
          '어머, 손님 왜 그렇게 심한 말씀을 하세요…? 너무 무례하시네요, 흥!',
          '제가 뭘 잘못했다고 막말을 하세요?! 너무해요 정말…'
        ],
        lulu: [
          '뭐?! 감히 이 세기의 디바에게 막말을 해?! 경호원! 차장! 당장 이 무례한 놈을 쫓아내!',
          '하! 질투에 눈이 먼 가엾은 벌레 같으니! 네 천박한 목소리 따위 내 귀엔 소음일 뿐이야!'
        ],
        felix: [
          '우와, 방금 일그러진 그 악마 같은 표정! 사진으로 찍었으면 희대의 걸작이었을 텐데요!',
          '욕하지 마세요! 카메라 렌즈 앞에서는 모두가 순수한 예술의 재료일 뿐이랍니다!'
        ],
        mabel: [
          '…하등 생물의 짖는 소리는 내 귀에 닿지 않아요. 냄새나니 꺼지세요.',
          '천민의 더러운 입술이 내 귀족적 공간을 오염시키는군요. 역겨워요.'
        ],
        elias: [
          '오호, 악플인가? 기자 생활 10년이면 그 정도 욕설엔 굳은살이 박였지! 더 해보시오!',
          '욕하는 당신 얼굴, 아주 볼만하오! 내일 가십란에 ‘특급열차의 분노조절장애 승객’으로 실어주지!'
        ]
      };
      return pickNonRepeating(insultPools[key] || ['…무례하시군요.'], `${key}_insult`);
    }

    // 18. GREETINGS: "안녕", "안녕하세요", "반갑습니다", "하이"
    if (isGreeting) {
      const greetPools = {
        bram: [
          '아, 네…! 안녕하세요… 날씨가 참 추운데 기차 안은 괜찮으신가요…?',
          '안녕하세요 손님… 덜컹거리는 소리 때문에 조금 불안했는데 말 걸어주셔서 감사해요…'
        ],
        ward: [
          '…인사치레는 생략하지. 형사 앞에 선 거면 용건만 간단히 대라.',
          '안녕? 기차 안이 흉흉하니 허튼수작 부리지 말고 네 칸에 있어라.'
        ],
        nell: [
          '안녕하세요, 손님! 눈보라가 심한데 따뜻하게 계신가요? 호호.',
          '어머, 반갑습니다 손님. 긴 기차 여행길인데 편안히 쉬고 계신가요?'
        ],
        nurse_k: [
          '안녕하십니까. 체온 저하나 부상 등 긴급 의료 지원이 필요하십니까?',
          '안녕하십니까. 환자가 아니시라면 객차 복도의 통행 질서를 지켜 주십시오.'
        ],
        cade: [
          '…안녕하쇼. 1호차 보일러실엔 무슨 볼일이오? 석탄 가루 날리니 조심하쇼.',
          '인사받을 시간도 없이 바쁘오만, 무슨 일이라도 있소?'
        ],
        jude: [
          '여어, 친구! 반가워! 오늘 밤 운수가 대통할 것 같은 예감이 드는데 한판 땡길까?',
          '크하하! 우리 멋진 승객 양반 오셨네! 이 지루한 눈보라 기차 안에서 심심하던 참인데 반갑구먼!'
        ],
        harlan: [
          '용건이 있는 인사요, 아니면 시간 낭비요? 내 시간은 비싸오.',
          '할란 코퍼레이션의 대표요. 사업적인 용건이 아니라면 비서 아이다를 통하시오.'
        ],
        clara: [
          '안녕하세요… 어둠 속을 달리는 기차에서 마주치니 한 편의 소설 같네요, 후훗.',
          '반가워요. 눈보라 치는 밤의 차가운 유령 열차에 오신 것을 환영해요.'
        ],
        ida: [
          '안녕하십니까. 회장님 전용 구역입니다. 용건을 말씀하십시오.',
          '안녕하십니까. 사전 예약 없는 사담은 사양합니다.'
        ],
        gail: [
          '허허, 반갑네 젊은 친구! 편안한 여행길이 되고 있는가? 어디 불편한 곳은 없나?',
          '안녕하신가! 식당차의 따뜻한 온기가 참 좋구먼. 편히 쉬시게.'
        ],
        arthur: [
          '오, 반갑네! 마침 자네에게 보여줄 고대 메소포타미아 비문 사본이 있었는데 말일세!',
          '허허, 안녕하신가 젊은이! 자네 걸음걸이가 꽤 당차구먼!'
        ],
        rose: [
          '어머, 안녕하세요 손님! 반가워요, 후훗. 여행길이 심심하진 않으신가요?',
          '호호, 반갑습니다! 식당차와 라운지차 오시면 제 춤 구경하러 오세요!'
        ],
        lulu: [
          '어머, 내 팬이니? 안녕! 사인을 원한다면 10달러짜리 지폐를 꺼내렴!',
          '세기의 디바 룰루에게 인사하러 온 거니? 보는 눈은 있구나, 호호!'
        ],
        felix: [
          '안녕하세요! 눈빛이 아주 인상적인 승객분이시네요! 사진 한 장 찍어드릴까요?',
          '반갑습니다! 멋진 여행길 되세요! 멋진 순간이 있으면 언제든 절 부르세요!'
        ],
        mabel: [
          '…함부로 아는 척하지 마세요. 불쾌하군요.',
          '인사 따위 나눌 신분 격차가 아닐 텐데요. 물러서세요.'
        ],
        elias: [
          '오호, 반갑소! 내 취재 수첩에 당신 이름을 올릴 인터뷰거리라도 있소?',
          '하하! 특종 기자 엘리아스요! 재미있는 소문이라도 들은 게 있으면 풀어보시오!'
        ]
      };
      return pickNonRepeating(greetPools[key] || ['…안녕하세요.'], `${key}_greet`);
    }

    // 19. HELP & ASSISTANCE: "도와줘", "살려줘", "구해줘", "부탁해"
    if (isHelp) {
      const helpPools = {
        bram: [
          '네…?! 제, 제가요?! 전 영문과 학생이라 아무 힘도 없는데… 어, 어떻게 도와드려야 하죠…?! (안절부절못한다)',
          '제, 제가 도울 수 있는 일이라면 말씀해 보세요… 글 쓰는 것 말고는 잘하는 게 없지만요…'
        ],
        ward: [
          '…무슨 일이지? 범죄 피해를 당했나? 구체적인 정황과 용의자 인상착의를 대라.',
          '시카고 형사가 눈앞에 있다. 협박이나 위협을 받고 있다면 정확히 말해라.'
        ],
        nell: [
          '어머나 세상에, 무슨 일이세요?! 다치신 곳이라도 있나요? 제가 도울 수 있는 일이라면 무엇이든 말씀하세요!',
          '어머, 옷이 찢어지거나 곤란한 일이 생기셨나요? 제가 바느질이나 수선은 도와드릴 수 있어요!'
        ],
        nurse_k: [
          '응급 환자이십니까? 구급약과 붕대, 해열제는 준비되어 있습니다. 증상을 말씀하십시오.',
          '신체적 외상이나 호흡 곤란 증상이 있다면 즉시 자리에 앉으십시오. 응급 처치를 하겠습니다.'
        ],
        cade: [
          '내가 도울 수 있는 건 석탄 퍼넣어 기차 안 멈추게 하는 것뿐이오. 긴급 상황이면 차장을 부르쇼.',
          '삽자루로 도와줄 일이라도 있소? 1호차 보일러 온도가 급하니 급한 거 아니면 비키쇼.'
        ],
        jude: [
          '도움? 빚이라도 졌나, 친구? 돈 문제라면… 내가 이자 좀 쳐서 융통해 줄 수도 있는데, 크하핫!',
          '도박판에서 털렸어? 내가 타짜들한테서 본전 찾아주는 기술 하나는 기가 막히지!'
        ],
        harlan: [
          '내 도움은 공짜가 아니오. 100달러를 내놓든지, 내게 이득이 될 정보를 가져오시오.',
          '자선 사업은 내 취향이 아니오. 가치를 증명하지 못하면 도움 따윈 없소.'
        ],
        clara: [
          '후훗… 비극의 주인공처럼 구원을 청하시는군요. 당신을 도울 열쇠는 이미 당신 손에 쥐어져 있을지도 몰라요.',
          '어둠 속에서 길을 잃으셨나요? 작가의 조언이 필요하다면 진실을 털어놓아 보세요.'
        ],
        ida: [
          '긴급 상황이라면 객차 차장과 철도 승무원에게 즉시 인계하겠습니다. 사태를 보고하십시오.',
          '회장님 보안과 무관한 일반 승객의 민원은 승무원실에 접수하십시오.'
        ],
        gail: [
          '허허, 침착하시게. 의사로서 도울 수 있는 일이라면 무엇이든 돕겠네. 어디가 편치 않으신가?',
          '안색이 창백하구먼. 무슨 일인지 내게 차분히 털어놓아 보게나. 의사는 비밀을 지킨다네.'
        ],
        arthur: [
          '응? 곤경에 처했나? 고대 영웅 길가메시의 지혜와 수메르 격언을 빌려줄 수 있네만!',
          '학술적인 조언이 필요한가? 역사 속에서 해답을 찾아보세!'
        ],
        rose: [
          '어머, 어떡해… 많이 힘드신가요? 제가 곁에 있어 드릴게요, 힘내세요!',
          '제가 해드릴 수 있는 건 따뜻한 미소와 응원뿐이지만… 무슨 일이세요?'
        ],
        lulu: [
          '어머, 내 도움을 바란다면 우선 내 팬클럽 회장부터 맡아야 할 텐데?!',
          '이 아름다운 손으로 궂은일을 도울 순 없지만, 격려의 노래 한 소절은 불러줄 수 있어!'
        ],
        felix: [
          '무슨 일이에요?! 증거 사진이라도 찍어둘까요?! 제가 카메라로 기록해 드릴게요!',
          '도움이 필요하시면 언제든 말씀하세요! 발로 뛰는 일이라면 자신 있어요!'
        ],
        mabel: [
          '…천민의 구걸 따위 들을 생각 없어요. 하인이라도 부르세요.',
          '내게 손을 내밀지 마세요. 불쾌하군요.'
        ],
        elias: [
          '도움? 혹시 권력자에게 억울하게 당했소?! 내가 신문 1면에 대서특필해서 복수해 주지!',
          '억울한 사연이 있다면 특종 기자 엘리아스에게 털어놓으시오! 세상에 까발려 주겠소!'
        ]
      };
      return pickNonRepeating(helpPools[key] || ['…도움이 필요하십니까?'], `${key}_help`);
    }

    // 20. MBTI & PERSONALITY INQUIRY: "mbti", "엠비티아이", "성격"
    if (isMbti) {
      const mbtiPools = {
        bram: '엠비티아이요…? 아, 심리학 유형 말씀이신가요? 전… 혼자 책 읽고 상상하는 걸 좋아하는 소심한 INFP예요… 남들 시선이 늘 두려워요…',
        ward: '…ISTP다. 말보다 행동이 앞서고, 잡담 따위 질색하는 성격이지. 이제 됐나?',
        nell: '전 ISFJ라고 해요. 조용히 사람들을 챙기고 바느질하는 게 제일 마음 편한 성격이랍니다, 호호.',
        nurse_k: 'ISTJ입니다. 규칙과 절차, 책임감을 최우선으로 여깁니다. 사담은 삼가십시오.',
        cade: 'ISFP요. 남한테 간섭받는 거 질색이고, 내 몫의 삽질만 묵묵히 끝내고 쉬는 게 최고지.',
        jude: 'ESTP! 화끈하고 스릴 넘치는 승부사지! 오늘 밤 카드판의 제왕이 바로 나야!',
        harlan: 'ENTJ요. 냉철한 비전과 강력한 결단력으로 100만 달러 제국을 이끌지. 패배자는 용납 못 해.',
        clara: 'INFJ… 인간의 깊은 내면과 가면 뒤의 어둠을 꿰뚫어 보는 통찰가죠, 후훗.',
        ida: 'ESTJ입니다. 빈틈없는 체계와 철저한 규율로 조직을 통솔하는 현실주의자입니다.',
        gail: '허허, ENFJ라네. 타인의 고통을 보듬고 평화를 이끄는 것이 내 평생의 사명이지.',
        arthur: 'INTP일세! 고대 설형문자의 논리적 체계와 미스터리를 파헤치는 데 목숨을 걸었지!',
        rose: 'ESFJ예요! 사람들 앞에서 웃고 춤추며 사랑을 나누는 게 제 행복이랍니다, 후훗!',
        lulu: '당연히 눈부신 ESFP지! 세상의 모든 스포트라이트는 날 위해 존재하는 거라구!',
        felix: 'ENFP예요! 어디로 튈지 모르는 열정과 호기심으로 가득 찬 방랑자 사진사랍니다, 하하!',
        mabel: '…INTJ예요. 천박한 대중 따위와는 섞이지 않는 나만의 고결한 성채 속에 살죠.',
        elias: 'ENTP! 논쟁과 반박을 즐기고, 세상의 모든 위선을 까발리는 악마의 변호인이지!'
      };
      return pickNonRepeating([mbtiPools[key]], `${key}_mbti`);
    }

    // 21. MONEY & WEALTH: "돈 있어?", "달러", "부자야?", "지갑"
    if (isMoney) {
      const moneyPools = {
        bram: '등록금 내고 남은 10달러가 제 전 재산이에요… 잃어버리면 시카고에서 굶어 죽어요…',
        ward: '형사 월급이 얼마인지 아나? 쥐꼬리다. 돈 빌려달라는 소리면 총알 맞기 전에 꺼져라.',
        nell: '바느질 삯으로 모은 몇 달러뿐이에요. 정직하게 땀 흘려 번 소중한 돈이랍니다, 호호.',
        nurse_k: '병원 급여는 규칙적으로 수령하고 있습니다. 금전 거래는 사절합니다.',
        cade: '하루 종일 석탄 퍼도 손에 쥐는 건 2달러요. 부자들 양복 보면 울화통이 터지오.',
        jude: '크하하! 어젯밤엔 500달러를 땄는데 지금은 주머니에 5달러뿐이지! 인생은 롤러코스터야!',
        harlan: '내 자산은 100만 달러를 넘소. 당신 평생 번 돈을 합쳐도 내 시계 하나 못 사오.',
        clara: '소설 인세로 부족함 없이 살고 있죠… 하지만 돈으로도 영혼의 공허는 채울 수 없답니다.',
        ida: '회장님의 자금 집행을 총괄하고 있습니다. 공적인 예산 외 지출은 불가합니다.',
        gail: '허허, 가난한 환자들에겐 치료비를 안 받다 보니 주머니는 늘 헐렁하다네.',
        arthur: '연구비가 늘 부족해서 유물 발굴할 때마다 빚더미에 앉는다네, 허허!',
        rose: '카바레 출연료로 예쁜 구두와 드레스를 사는 게 제 유일한 사치예요, 후훗.',
        lulu: '내 목소리는 분당 1000달러의 가치가 있단다! 다이아몬드보다 귀하지!',
        felix: '필름 살 돈만 있으면 전 행복해요! 돈보단 순간의 예술이 더 소중하니까요!',
        mabel: '내 가문의 유산은 시카고의 빌딩 열 채를 사고도 남아요. 천민이 넘볼 액수가 아니에요.',
        elias: '특종 한 건이면 100달러 보너스가 터지지! 오늘 밤 대박을 터뜨릴 거요!'
      };
      return pickNonRepeating([moneyPools[key]], `${key}_money`);
    }

    // 13. SHORT REACTION: "?", "??", "뭐임", "음"
    if (q === '?' || q === '??' || q === '뭐임' || q === '음' || q.length <= 2) {
      const shortPools = {
        bram: ['네…? 왜, 왜 그러세요? 제가 뭐 잘못했나요…?', '저기… 물음표만 띄우시면 제가 더 불안해요…', '…무슨 말씀이신지 잘 모르겠어요…'],
        nell: ['어머, 왜 그러세요 손님? 어디 불편하신가요?', '네? 제가 도와드릴 일이라도 있나요?'],
        ward: ['…물음표 하나 띄우고 뜸 들이지 마라. 바쁜 몸이다.', '의심스러운 눈초리로 쳐다보지 마.'],
        cade: ['…물음표만 던지지 말고 할 말 없으면 가쇼.', '왜 멍하니 서 있소? 불길 뜨거우니 비키쇼.'],
        nurse_k: ['의문 사항이 있으시면 명확히 말씀하십시오.'],
        elias: ['왜? 기자가 물어보니까 찔려서 말이 안 나오시오?'],
        harlan: ['…용건도 없는 자가 왜 내 앞에서 얼쩡거리나.'],
        clara: ['침묵 속의 물음표… 당신의 침묵이 많은 말을 하고 있군요.'],
        ida: ['의문점이 있으시면 정식 양식으로 질의하십시오.'],
        gail: ['허허, 어디 아프신 곳이라도 있으십니까?'],
        arthur: ['…응? 자네 방금 뭐라고 물었나? 귀가 어두워서 말일세.'],
        jude: ['어이쿠, 왜 그렇게 멍을 때려, 친구? 패를 까야 게임이 되지!'],
        rose: ['어머, 왜 그렇게 빤히 바라보세요? 부끄럽잖아요, 후훗.'],
        lulu: ['뭐야? 감히 내 미모에 압도당해서 말문이 막혔니?'],
        felix: ['오! 그 갸우뚱한 포즈 아주 좋은데요? 찰칵!'],
        mabel: ['…무례하게 빤히 쳐다보지 마세요. 불쾌하군요.']
      };
      return pickNonRepeating(shortPools[key], `${key}_short`);
    }

    // 22. INTER-CHARACTER INQUIRIES: "워드", "할란", "마피아/살인"
    if (isAskingAboutWard) {
      const wardPools = {
        bram: ['워드 형사님 말씀이신가요…? 눈빛이 너무 매섭고 품에 총을 차고 계셔서 마주치기만 해도 다리가 후들거려요…', '그 형사님은 시카고에서 오셨다던데… 혹시 절 수상한 사람으로 오해할까 봐 겁나요…'],
        nell: ['워드 형사님요? 인상은 조금 무서우시지만 기차 안전을 지키느라 고생하시는 것 같아요, 호호.', '형사님이 가끔 수하물칸 쪽을 순찰하시던데, 코트가 낡아서 꿰매드리고 싶더군요.'],
        nurse_k: ['워드 형사는 시카고 경찰 소속으로 공식 신분을 확인했습니다. 수사 업무에 불필요한 간섭은 삼가십시오.'],
        cade: ['그 형사 놈… 아까부터 1호차 주변을 힐끔거리며 짐작만으로 캐묻고 다니더군. 귀찮아 죽겠소.', '석탄 가루 묻히기 싫으면 객실로 꺼지라고 한마디 해줬소.'],
        harlan: ['시카고 시경의 늙은 사냥개지. 냄새를 맡는 건 인정하지만, 내 자본의 영향력 앞에선 꼬리를 내려야 할 거요.'],
        clara: ['워드 형사… 짙은 트렌치코트 속에 비극적인 과거를 감춘 남자죠. 제 차기작의 고독한 주인공으로 딱 어울려요, 후훗.'],
        ida: ['워드 형사에 대해선 경찰청 신원 조회를 마쳤습니다. 회장님의 이동 경로와 겹치지 않도록 주시 중입니다.'],
        jude: ['형사 나리? 켁! 도박꾼한테 경찰은 벼락 맞을 까마귀 같은 존재지! 난 저 양반 근처엔 얼씬도 안 해!'],
        lulu: ['그 무뚝뚝한 형사 아저씨? 흥, 내 사인 한 장이라도 받으려고 온 줄 알았더니 쳐다보지도 않더라구! 무례해!'],
        felix: ['워드 형사님의 그 날카로운 눈빛과 낡은 페도라! 하드보일드 누아르 사진의 완벽한 모델이에요!'],
        mabel: ['하급 경찰 따위가 귀족의 열차에 타고 있다는 것 자체가 격이 떨어지는군요. 말 섞고 싶지 않아요.'],
        elias: ['워드 형사! 시카고 강력계의 전설이지! 저 양반이 이 열차에 탔다는 건 반드시 피비린내 나는 사건이 터진다는 징조요!']
      };
      if (wardPools[key]) return pickNonRepeating(wardPools[key], `${key}_about_ward`);
    }

    if (isAskingAboutHarlan) {
      const harlanPools = {
        bram: ['3호차에 계신 그 거물 사업가 분이요…? 경호원까지 데리고 계셔서 감히 쳐다보지도 못하겠어요…', '돈이 엄청나게 많은 분이라던데, 시골 출신인 저 같은 사람은 사람 취급도 안 하실 것 같아요…'],
        nell: ['할란 회장님요? 기차를 통째로 살 만큼 부자시라던데… 늘 굳은 표정으로 서류만 보시더군요.', '돈이 아무리 많아도 눈보라 속에선 모두가 똑같은 승객일 뿐이지요, 호호.'],
        ward: ['할란 포드… 시카고 암흑가와 정계를 주무르는 탐욕스러운 독사지. 이번 열차에 탄 진짜 이유를 캐내고 있다.'],
        clara: ['거대한 황금 제국을 세웠지만, 가슴속엔 죽음의 공포를 품고 사는 가련한 폭군이죠… 제 소설의 비극적 악당이에요.'],
        ida: ['할란 포드 회장님은 미국 산업 경제의 심장이십니다. 회장님에 대한 불손한 언행은 엄벌에 처해집니다.'],
        cade: ['그 늙은 부자 놈? 호화 객실에서 와인이나 홀짝이는 놈 때문에 우리가 영하의 추위에서 석탄을 퍼야 하오.'],
        jude: ['할란 회장! 캬, 저 양반 호주머니에서 칩 몇 개만 빼앗아도 평생 카지노에서 떵떵거릴 텐데 말이야!'],
        elias: ['할란 포드의 비자금 장부! 내가 그 장부의 냄새를 맡고 이 기차에 잠입한 거요! 이번에 터지면 퓰리처상감이오!']
      };
      if (harlanPools[key]) return pickNonRepeating(harlanPools[key], `${key}_about_harlan`);
    }

    if (isAskingAboutMafia) {
      const mafiaPools = {
        bram: ['마, 마피아요…?! 이 기차에 그런 무서운 암흑가 킬러가 타고 있나요?! 어떡해… 저 살아서 시카고에 갈 수 있을까요…?! (새파랗게 질린다)', '소설에서나 보던 갱단이 현실에 있다니… 너무 무서워요…'],
        ward: ['마피아든 살인 청부업자든 내 구역에선 쥐새끼처럼 기어 다니게 될 거다. 냄새를 맡았다면 즉시 내게 제보해라.'],
        nell: ['어머나 세상에…! 설마 이 눈보라 치는 열차에 무서운 총잡이가 있을 리가요… 너무 걱정 마세요, 손님.'],
        nurse_k: ['의심스러운 무장 인원을 목격하셨다면 즉시 열차 승무원과 경찰에 신고하십시오. 독단적인 행동은 위험합니다.'],
        cade: ['마피아가 총을 들이밀든 말든 난 석탄만 땔 뿐이오. 불길 속으로 던져버리면 그놈들도 뼈만 남을 거요.'],
        harlan: ['카포네의 잔당 놈들인가? 내 전속 경호원들의 기관총 앞에서는 한낱 파리 목숨에 불과할 뿐이오.'],
        clara: ['피와 복수, 그리고 밀주… 1930년대 시카고의 어둠이 이 설원 열차까지 쫓아왔군요. 멋진 결말이 기다려지네요, 후훗.'],
        elias: ['빙고! 시카고 갱단의 청부 살인범이 이 열차 1등석을 노리고 있다는 첩보가 있소! 특종이 눈앞이오!']
      };
      return pickNonRepeating(mafiaPools[key] || ['…무슨 흉흉한 소문이 도는 모양이군요.'], `${key}_mafia`);
    }

    // 23. LUGGAGE & INSPECTION: "가방", "짐", "열어봐", "보여줘", "내놔", "뒤져봐"
    if (isBagOrInspection) {
      const isCommand = q.includes('열어') || q.includes('보여') || q.includes('내놔') || q.includes('뒤져') || q.includes('털어');
      const bagPools = {
        bram: isCommand ? [
          '여, 열어보라고요?! 절대 안 돼요! 이건 제 사생활이자 대학교 등록금이란 말이에요…! 왜 남의 가방을 함부로 뒤지려 하세요?! (가방을 등 뒤로 숨기며 눈시울이 붉어진다)',
          '제발 이러지 마세요…! 가방 안엔 정말 낡은 소설 원고와 필기도구뿐이에요… 보여드릴 수 없어요…!'
        ] : [
          '제 낡은 갈색 가방이요…? 여, 여기엔 소설 원고랑 대학교 등록금밖에 없어요… 진짜예요…! 도둑맞을까 봐 꼭 품고 있는 것뿐이에요…',
          '시골에서 어머니가 쥐어주신 전 재산이 든 가방이에요… 덜컹거릴 때마다 잃어버릴까 봐 손에서 놓을 수가 없어요…'
        ],
        ward: isCommand ? [
          '열어보라고? 네놈부터 벽에 밀치고 불심검문 해주랴? 영장도 없는 놈이 형사 트렁크에 손댔다간 즉결 체포다.',
          '총알 구멍 나기 싫으면 손 치워라. 내 가방은 시카고 시경의 관할이다.'
        ] : [
          '내 가방? 형사의 짐짝엔 수갑과 리볼버 탄약뿐이다. 쓸데없이 기웃거리다간 의심만 살 뿐이야.',
          '수사에 필요한 장비 외엔 아무것도 없다. 딴생각 말고 네 자리나 지켜라.'
        ],
        nell: isCommand ? [
          '어머, 제 바느질 가방을요? 호호, 비밀스러운 건 없지만 바늘이 뾰족해서 찔리면 크게 다친답니다. 조심하세요.',
          '굳이 보시겠다면 보여드릴 순 있지만, 헌 헝겊과 실타래뿐이라 실망하실 텐데요, 호호.'
        ] : [
          '제 바느질 가방이 궁금하세요? 안에는 헝겊 조각과 비단실타래, 뾰족한 바늘들뿐이랍니다. 찔리면 아프니 조심하세요, 호호.',
          '손님들의 찢어진 코트를 수선해 드릴 실과 가위가 들어있지요. 여행길의 든든한 짝꿍이랍니다.'
        ],
        nurse_k: [
          '의료 장비와 소독약, 규제 응급 약품(모르핀)이 보관된 구급 가방입니다. 규정상 민간인의 임의 열람은 엄격히 금지됩니다.',
          '의약품 보관함에 무단 접근 시 열차 보안 규정에 따라 격리 조치될 수 있습니다.'
        ],
        cade: [
          '…내 낡은 가죽 가방에 손대지 마쇼. 석탄 검댕이나 묻은 화부의 짐짝에 뭐가 들었는지 참견 말고 썩 물러나쇼!',
          '거친 공구랑 낡은 작업복뿐이오. 남의 짐 뒤적거리다 화구에 처박히는 수가 있소.'
        ],
        jude: [
          '크하핫! 내 트렁크를 보겠다고? 뜯어보면 온통 트럼프 카드와 주사위, 행운의 칩뿐이라 실망할 텐데!',
          '도박사의 가방엔 행운과 승리만이 담겨 있지! 시카고 판돈 500달러가 든 지갑도 있구 말이야, 하하!'
        ],
        harlan: [
          '건방지게 내 비밀 서류 가방을 넘봐? 경호원! 이 불한당을 당장 끌어내 설원 밖으로 내던져라!',
          '내 서류 가방 하나에 미국 철도망의 운명이 걸려 있소. 네 목숨 따위로 감당할 수 있는 물건이 아니오.'
        ],
        clara: [
          '제 원고 가방이에요. 아직 발표되지 않은 살인 미스터리가 잠들어 있죠… 열어보실래요? 판도라의 상자처럼 비극만 쏟아져 나올지도 몰라요, 후훗.',
          '작가의 비밀 노트는 독약과 같답니다. 엿보는 순간 당신도 비극의 주인공이 될 테니까요.'
        ],
        ida: [
          '회장님의 기밀 경영 장부와 계약서가 보관된 포트폴리오입니다. 인가되지 않은 접근은 철도 경찰에 즉각 인계됩니다.',
          '공식 보안 결재가 없는 인원의 소지품 열람 요구는 거부합니다.'
        ],
        gail: [
          '허허, 청진기와 기본 소독약이 든 왕진 가방이라네. 눈보라에 환자가 생길까 봐 늘 곁에 두고 있지.',
          '낡은 가방이지만 수많은 생명을 살려낸 소중한 의사 가방이라네.'
        ],
        arthur: [
          '오! 이 상자 말이군! 기원전 수메르 쐐기문자 탁본과 고대 발굴 파편들이 들어있지! 자네도 고고학 유물에 관심이 있나?!',
          '함부로 만지면 4000년 전 유물이 바스러진다네! 눈으로만 보게나, 허허!'
        ],
        rose: [
          '제 악보와 무대 의상이 들어있는 분장 가방이에요. 다음 시카고 오페라 무대에서 입을 화려한 드레스랍니다, 후훗.',
          '화장품과 향수가 가득해서 달콤한 냄새가 나지요? 열어보셔도 괜찮아요, 후훗.'
        ],
        lulu: [
          '어머! 내 최고급 파리산 가죽 트렁크에 눈독 들이지 마! 온갖 보석과 밍크 코트가 가득해서 네 전 재산으로도 못 살걸?',
          '디바의 드레스룸을 함부로 엿보려 하다니, 무례하기 짝이 없네!'
        ],
        felix: [
          '제 암실 장비와 필름 통들이에요! 빛이 들어가면 귀한 사진들이 전부 타버리니까 절대 열면 안 돼요!',
          '특수 렌즈와 감광판이 들어있어서 충격에 약해요. 조심해 주세요!'
        ],
        mabel: [
          '천박한 손 치우세요. 내 보석함 근처에 1인치라도 다가왔다간 시카고 법원에 평생을 저당잡히게 해줄 테니까요.',
          '하등한 것들이 감히 귀족의 소지품을 넘보다니, 불쾌하기 짝이 없군요.'
        ],
        elias: [
          '큭큭, 내 취재 수첩과 폭탄급 스캔들 파일들이지! 이걸 까는 순간 미국 정재계 절반이 뒤집어진다고!',
          '기자의 가방은 특종의 화약고요! 섣불리 건드렸다간 크게 다칠 거요, 크하하!'
        ]
      };
      return pickNonRepeating(bagPools[key] || ['…제 소지품에 관심이 많으시군요.'], `${key}_bag`);
    }

    // 24. CONTEXTUAL "WHY" & FOLLOW-UP INQUIRY: "왜?", "어째서?", "이유가 뭐야?"
    if (isAskingWhy) {
      const lastBot = history.filter(h => h.role === 'assistant').slice(-1)[0]?.text || '';
      if (lastBot.includes('조끼') || lastBot.includes('어머니') || lastBot.includes('옷')) {
        if (key === 'bram') return '왜 이 조끼를 입었냐고요…? 어머니가 밤새 떠주신 거라 저에겐 세상에서 가장 따뜻한 옷이에요… 촌스러워도 전 이게 소중해요…';
        if (key === 'ward') return '왜 이 낡은 코트냐고? 핏자국과 탄약 냄새를 숨기기엔 구겨진 트렌치코트만 한 게 없으니까.';
      }
      if (lastBot.includes('가방') || lastBot.includes('등록금') || lastBot.includes('원고')) {
        if (key === 'bram') return '가방을 왜 꼭 쥐고 있냐고요…? 이, 이건 제 모든 학비가 들어있어서… 잃어버리면 대학도 못 가고 고향으로 쫓겨나거든요…!';
        if (key === 'ward') return '왜 형사 가방을 못 열게 하냐고? 현장 보존과 증거 보호는 경찰의 기본 수칙이니까.';
      }
      const whyPools = {
        bram: [
          '이, 이유를 물으셔도… 전 그저 시카고에 무사히 도착해서 공부하고 싶을 뿐이에요… 제발 몰아세우지 마세요…',
          '제가 워낙 겁이 많고 소심해서 그래요… 남들이 쳐다보기만 해도 심장이 쿵쾅거리거든요…'
        ],
        ward: [
          '형사가 움직이는 데 일일이 민간인한테 이유를 설명할 의무는 없다. 얌전히 자리에 앉아 있어라.',
          '이유? 눈보라 속에 늑대가 숨어있을 때 사냥꾼이 방아쇠에 손을 얹는 것과 같은 이치다.'
        ],
        nell: [
          '호호, 세상 모든 일에 거창한 이유가 있는 건 아니랍니다. 그저 마음 가는 대로 베풀 뿐이지요.',
          '눈보라에 갇혀 있을 때일수록 서로 따뜻하게 대하는 게 순리 아니겠어요?'
        ],
        nurse_k: [
          '환자의 생명 보호와 열차 내 감염 예방이 제 의학적 판단의 이유입니다.',
          '규정과 절차에 따른 조치에는 사적인 감정이나 변명이 필요하지 않습니다.'
        ],
        cade: [
          '석탄을 왜 퍼넣냐고? 불이 꺼지면 이 기차에 탄 승객 전부가 얼어 죽으니까 그렇소! 잔말 말고 비키쇼!',
          '목숨 걸고 달리는 기관차 밑바닥 사정을 당신 같은 샌님이 알 리가 있소?'
        ],
        jude: [
          '크하핫! 도박판에서 왜 판돈을 올리냐고 묻는 것만큼 어리석은 질문은 없지! 스릴이 있으니까!',
          '인생은 한 번뿐이야, 친구! 주사위가 구르는 데 무슨 거창한 이유가 필요해?!'
        ],
        harlan: [
          '왜냐고 묻는 자 치고 내게 이득을 가져다준 자는 없었소. 돈과 권력이 곧 나의 이유요.',
          '자본주의의 원리는 단순하오. 지배하든가, 지배당하든가 둘 중 하나지.'
        ],
        clara: [
          '왜냐하면… 비극은 언제나 가장 은밀하고 사소한 의문에서 싹트는 법이니까요. 후훗.',
          '이유를 찾는 자는 이미 함정에 발을 들인 것이나 다름없답니다.'
        ],
        ida: [
          '비서실의 모든 결정은 회장님의 철저한 경영 방침에 기인합니다.',
          '효율성과 보안, 그 두 가지가 제 행동의 유일한 이유입니다.'
        ],
        gail: [
          '허허, 인간에 대한 연민과 인술… 그것이 내가 눈보라 속에서도 청진기를 놓지 않는 이유라네.',
          '어려운 이웃을 돕는 데 무슨 계산이 필요하겠는가.'
        ],
        arthur: [
          '호기심일세! 묻혀 있는 진실을 파헤치는 학자의 순수한 열정, 그것보다 더 위대한 이유가 어디 있겠나!',
          '기원전 수메르인들도 하늘의 별을 보며 ‘왜?’라고 물었지! 자네도 학자의 기질이 있구먼!'
        ],
        rose: [
          '음악과 사랑이 있으니까요! 사람들의 가슴을 울리는 노래를 부르는 것이 제 삶의 전부랍니다, 후훗.',
          '어두운 밤일수록 아름다운 선율이 더 절실한 법이니까요.'
        ],
        lulu: [
          '왜냐구? 난 세기의 디바 룰루니까! 내 기분과 내 아름다움이 곧 법이야!',
          '여자의 마음을 논리적으로 따지려 들다니, 촌스러운 남자네!'
        ],
        felix: [
          '순간의 찬란함을 영원히 박제하기 위해서죠! 뷰파인더 너머의 세상은 숨 막히게 아름다우니까요!',
          '셔터를 누르지 않으면 그 위대한 순간은 영영 사라져 버리잖아요!'
        ],
        mabel: [
          '하등한 자에게 내 고결한 동기를 설명할 의무 따윈 없어요. 주제넘게 캐묻지 마세요.',
          '귀족의 선택은 그 자체로 정당합니다. 천민은 그저 따르기만 하면 돼요.'
        ],
        elias: [
          '진실을 밝히기 위해서요! 어둠 속에 숨겨진 권력자들의 추악한 비리를 온 세상에 폭로하는 게 기자의 사명이오!',
          '대중은 알 권리가 있고, 난 그걸 전달할 펜을 쥐었소! 이것보다 확실한 이유가 어디 있소?'
        ]
      };
      return pickNonRepeating(whyPools[key] || ['…그것이 제 방식입니다.'], `${key}_why`);
    }

    // 25. SUSPICION & LIE CHECKS: "거짓말", "진짜야?", "솔직히", "숨기는", "비밀", "의심"
    if (isSuspicionOrLie) {
      const liePools = {
        bram: [
          '거, 거짓말 아니에요…! 제 눈을 보세요, 전 정말 거짓말 못 하는 성격이에요…! (안절부절못하며 손가락을 꼼지락거린다)',
          '제발 의심하지 마세요… 저 같은 시골뜨기가 무슨 거창한 비밀을 숨기겠어요… 흑…'
        ],
        ward: [
          '내 말이 진짜냐고? 거리의 협박범과 사기꾼들을 십수 년 잡아넣은 내 감을 의심하는 건가?',
          '비밀이라… 이 기차에 탄 승객 중 비밀 없는 놈은 하나도 없다. 네놈을 포함해서 말이지.'
        ],
        nell: [
          '호호, 늙은 재봉사가 무슨 비밀이 있겠어요. 솔직하게 땀 흘려 일하는 것뿐이랍니다.',
          '의심을 품고 세상을 보면 따뜻한 차 한 잔도 독약처럼 느껴지는 법이지요, 손님.'
        ],
        nurse_k: [
          '공식 의료 면허를 소지한 의료인으로서 허위 진술은 하지 않습니다. 근거 없는 의혹 제기는 삼가십시오.',
          '의학적 사실과 규정 준수 외에 사적으로 숨기는 것은 없습니다.'
        ],
        cade: [
          '…거짓말할 힘이 있으면 석탄 한 삽 더 뜨겠소. 땀 흘려 일하는 노동자 의심 말고 썩 꺼지쇼.',
          '남의 꼬투리 잡으려 들지 말고 제 앞가림이나 잘하쇼.'
        ],
        jude: [
          '크하핫! 도박꾼한테 진짜냐고 묻는 놈이 제일 먼저 밑천 털리는 법이지! 날 믿을지 말지는 자네 배짱이야!',
          '포커페이스가 없으면 어떻게 승부사라 하겠나? 하지만 자네한테 사기 칠 생각은 없어, 진짜라니까!'
        ],
        harlan: [
          '비밀이라… 자본가에게 비밀이란 곧 주가이자 권력이지. 그걸 너 따위 뜨내기에게 털어놓을 것 같소?',
          '내 말이 진실인지 의심할 배짱이 있다면, 내 자본의 힘부터 감당해 보시오.'
        ],
        clara: [
          '후훗… 어디까지가 진실이고 어디부터가 허구일까요? 소설가의 입술에서 흘러나오는 말은 늘 안개와 같답니다.',
          '모든 인간은 각자의 가면을 쓰고 살아가죠. 당신의 그 순진한 표정도 가면인가요?'
        ],
        ida: [
          '업무상의 모든 보고는 100% 검증된 사실에 기반합니다. 허위 정보 유포는 법적 책임을 묻겠습니다.',
          '비밀 유지는 최고 비서실의 핵심 의무입니다. 질의를 중단하십시오.'
        ],
        gail: [
          '허허, 평생 환자를 돌보며 살아온 늙은 의사라네. 거짓으로 타인을 속여서 무엇을 얻겠는가.',
          '마음의 의심을 내려놓게나, 젊은 친구. 눈보라보다 무서운 건 사람에 대한 불신이라네.'
        ],
        arthur: [
          '학술적 고증이 끝난 사실만 말할 뿐일세! 함무라비 법전의 쐐기문자는 결코 거짓말을 하지 않지!',
          '허허, 내 기억력이 가끔 깜빡할 순 있어도 거짓을 꾸며낼 재주는 없다네!'
        ],
        rose: [
          '어머, 절 못 믿으시는 건가요? 무대 위가 아닌 곳에서 거짓말을 할 이유는 전혀 없는걸요, 후훗.',
          '제 눈동자를 들여다보세요. 거짓을 말하는 사람의 눈빛이 이렇게 맑을까요?'
        ],
        lulu: [
          '흥! 내가 왜 너 따위한테 거짓말을 해? 난 솔직하고 당당한 세기의 디바야!',
          '비밀? 디바의 사생활은 언제나 신비로워야 하는 법이지! 다 알려고 들면 다쳐!'
        ],
        felix: [
          '사진은 결코 거짓말을 하지 않아요! 렌즈에 맺히는 빛은 언제나 100% 진실만을 기록하니까요!',
          '제 순수한 예술혼을 의심하지 마세요! 전 보이는 그대로를 사랑할 뿐이에요!'
        ],
        mabel: [
          '하등한 자의 의심 따위 상대할 가치도 없습니다. 내 앞에서 감히 진실을 입에 올리지 마세요.',
          '천민이 품는 망상 따위 관심 없어요. 내 시야에서 사라지세요.'
        ],
        elias: [
          '취재원의 비밀은 무덤까지 가져가는 게 기자의 윤리요! 하지만 진실을 캐내는 내 촉은 결코 거짓말을 안 하지!',
          '의심이 간다고? 좋아, 날 믿지 못하겠다면 다음 주 조간신문 1면을 확인해 보시오, 크하핫!'
        ]
      };
      return pickNonRepeating(liePools[key] || ['…진실은 시간이 지나면 밝혀질 것입니다.'], `${key}_lie`);
    }

    // 26. PHYSICAL COLLISIONS & STEPPING ON FOOT: "내 발 밟았어", "발 밟았잖아", "왜 쳐", "밀지 마"
    if (isCollisionOrStep) {
      const collisionPools = {
        bram: [
          '히익…! 죄, 죄송합니다! 제가 기차가 덜컹거리는 바람에 비틀거리다 그만…! 다, 다치진 않으셨나요?! 정말 고의가 아니었어요…! (새파랗게 질려 연신 허리를 숙인다)',
          '앗…! 죗, 죄송해요! 열차가 너무 흔들려서 발을 헛디뎠어요…! 화내지 마세요, 일부러 그런 게 아니에요…!'
        ],
        ward: [
          '…발? 기차가 흔들리는데 복도 한가운데 발을 삐죽 내밀고 있던 네 놈 잘못이다. 억지 부리지 말고 발 치워.',
          '좁은 기차 안에서 흔들리다 스친 것 가지고 째려보지 마라. 형사한테 시비 털 생각이면 번지수 잘못 찾았다.'
        ],
        nell: [
          '어머나 세상에! 저런, 제가 바느질 짐을 옮기느라 발밑을 미처 살피지 못했네요…! 많이 아프신가요? 정말 죄송해요, 손님.',
          '호호, 기차가 워낙 사납게 요동치니 그렇답니다. 다치신 곳은 없으신지요? 따뜻한 물이라도 드릴까요?'
        ],
        cade: [
          '…선로에 눈 쌓여서 기차가 요동치는데 좁은 통로에 서 있던 게 누구요? 뼈 부러진 거 아니면 비키쇼.',
          '석탄 나르다 스친 거요. 험한 일 하는 화부한테 시비 털지 말고 객실로 돌아가쇼.'
        ],
        harlan: [
          '무엄하군. 내 최고급 수제화에 네 흙먼지 묻은 신발이 스친 것이지, 감히 일개 승객 주제에 내게 따져 묻는 거요?',
          '길을 막고 서 있던 건 네놈이오. 내 경호원들에게 끌려 나가고 싶지 않으면 조용히 물러서시오.'
        ],
        mabel: [
          '하! 천박한 자가 길을 막고 있었던 탓이지요. 내 프랑스산 비단 드레스 자락을 더럽힌 건 사과하지 않을 셈인가요?',
          '더러운 발을 내 앞에 들이밀다니 불쾌하군요. 당장 내 시야에서 사라지세요.'
        ],
        jude: [
          '오우, 친구! 미안 미안! 기차가 요동치는 바람에 룰렛 돌듯 스텝이 꼬였네! 시카고 도착하면 내가 시원한 맥주 한 잔 살 테니 퉁치자고, 하하!',
          '어이쿠, 발이 거기 있었나? 주사위 던지다 칩 쏟은 셈 치고 쿨하게 넘어가자구, 크하핫!'
        ],
        nurse_k: [
          '열차 통로 이동 중 발생한 경미한 접촉입니다. 외상이나 부종이 없으시다면 통행로를 막지 마시고 자리에 앉으십시오.',
          '기차의 급격한 진동으로 인한 단순 사고입니다. 부상자가 아니시라면 언쟁을 자제하십시오.'
        ],
        clara: [
          '발을 밟힌 고통보다, 그 순간 마주친 당신의 눈빛에 깃든 살의가 훨씬 더 매혹적이군요… 제 소설의 비극적인 도입부 같아요, 후훗.',
          '차가운 설원 열차 안에서의 우연한 충돌… 이것이 비극의 서막일지도 모르겠네요.'
        ],
        lulu: [
          '뭐야?! 지금 세기의 디바인 내가 네 발을 밟았다고 따지는 거야? 오히려 내 명품 하이힐 굽에 흠집 안 났는지 걱정해야 정상 아냐?!',
          '흥! 길막하고 있던 건 너잖아! 내 귀한 발목이라도 삐었으면 시카고 콘서트 책임질 뻔했어!'
        ],
        felix: [
          '앗, 죄송합니다! 창밖 눈보라를 뷰파인더로 포착하느라 뒤를 못 봤어요! 사과의 의미로 멋진 기념사진 한 장 찍어드릴게요!',
          '죄송해요! 카메라 렌즈 보호하느라 몸을 돌리다 그만… 다치신 데는 없죠?!'
        ],
        gail: [
          '허허, 저런! 덜컹거리는 기차 안이라 위험했구먼. 발목은 괜찮으신가? 어디 삐끗하셨다면 내가 진찰을 봐드리지요.',
          '눈길이라 열차가 심하게 흔들린다네. 서로 조금씩 조심하시지요, 허허.'
        ],
        arthur: [
          '아이쿠! 미안하네, 자네! 돋보기로 기원전 석판 탁본을 들여다보느라 앞을 전혀 못 봤구먼! 발가락 뼈는 멀쩡한가?!',
          '허허, 기원전 전차 경주에서도 이런 충돌이 잦았지! 다치지 않았길 바라네!'
        ],
        rose: [
          '어머나, 세상에…! 제 드레스 자락이 무거워서 발을 헛디뎠나 봐요! 정말 죄송해요, 많이 아프시죠…?',
          '어머, 괜찮으세요? 화내지 마세요, 제가 정말 조심했어야 했는데… 후훗.'
        ],
        ida: [
          '승객 간 신체 접촉으로 인한 항의는 열차 보안요원이나 차장에게 공식 접수하십시오. 공무 수행 중입니다.',
          '회장님 경호 구역 내에서의 불필요한 신체 접촉은 경고 대상입니다.'
        ],
        elias: [
          '어이쿠! 미안하오, 친구! 특종 메모를 급하게 적느라 그랬소! 피까지 나진 않았지? 신문 1면에 실릴 만한 대형 사고는 아니구려, 크하핫!',
          '기차가 요동치니 별일이 다 있소! 화 풀고 차장에게 따뜻한 커피나 달라고 합시다!'
        ]
      };
      return pickNonRepeating(collisionPools[key] || ['…기차가 흔들려 실수한 모양입니다.'], `${key}_collision`);
    }

    // 27. DISBELIEF & "WHAT ARE YOU TALKING ABOUT?": "뭐라는거야?", "뭔 소리야?", "장난하냐?", "어쩌라고"
    if (isDisbeliefOrFrustration) {
      const lastBot = history.filter(h => h.role === 'assistant').slice(-1)[0]?.text || '';
      const wasCollision = lastBot.includes('발') || lastBot.includes('헛디뎠') || lastBot.includes('충돌') || lastBot.includes('비틀');
      
      const disbeliefPools = {
        bram: wasCollision ? [
          '죄, 죄송해요…! 제 말이 변명처럼 들리셨다면 정말 사과드릴게요… 화내지 마세요, 저 정말 고의가 아니었어요… (겁에 질려 손을 덜덜 떤다)',
          '화, 화내지 마세요…! 제가 워낙 말주변이 없어서 그래요… 제발 용서해 주세요… 흑…'
        ] : [
          '저, 저는 그냥… 솔직한 제 생각을 말씀드린 것뿐인데… 제가 또 이상한 소리를 한 건가요…? 죄송해요… (풀이 죽어 고개를 숙인다)',
          '죄송합니다… 제가 책만 읽다 보니 남들과 이야기하는 법이 서툴러서 그래요… 기분 나쁘셨다면 사과드릴게요…'
        ],
        ward: [
          '말귀를 못 알아듣나? 귀가 먹었으면 자리에 가서 귓구멍이나 파라. 풋내기 투정 받아줄 시간 없다.',
          '두 번 말 안 한다. 수사관 앞에서 헛소리 지껄이며 시비 걸지 말고 네 자리로 꺼져.'
        ],
        nell: [
          '어머, 제가 말을 조리 있게 전하지 못했나 보네요. 손님 마음을 답답하게 해드렸다면 죄송해요, 호호.',
          '눈보라 때문에 다들 마음이 급하고 답답해서 그렇답니다. 너그럽게 넘어가 주세요.'
        ],
        cade: [
          '시비 걸러 온 거요? 귀 먹었으면 객실로 돌아가쇼. 화구 불길 앞에서 헛소리 받아줄 여유 없소.',
          '말이 안 통하면 그냥 갈 길 가쇼. 더 이상 대꾸 안 하오.'
        ],
        harlan: [
          '내 말을 이해하지 못하는 건 네 지적 수준의 한계지. 무식한 자와 말을 섞은 내 시간만 아깝군.',
          '사리분별도 못 하는 자의 잠꼬대 따위 귀담아들을 가치도 없소. 물러나시오.'
        ],
        mabel: [
          '하등한 것이 감히 내 말의 가치를 따지려 들다니. 교양 없는 자의 헛소리는 들을 가치도 없어요.',
          '천박한 입에서 나오는 투정에 내가 일일이 대꾸해야 하나요? 비키세요.'
        ],
        jude: [
          '하하! 왜 그렇게 팍팍하게 정색을 해, 친구! 말 그대로 쿨하게 넘어가자는 거지, 안 그래?!',
          '워워, 진정하라구! 농담 한마디에 피대 세우면 카드판에서 먼저 패가 말리는 법이야, 크하핫!'
        ],
        nurse_k: [
          '의사소통에 혼선이 있으시다면 침착하게 용건만 진술하십시오. 무의미한 감정 표출은 삼가십시오.',
          '규정과 사실에 기반하여 말씀드렸습니다. 억지 주장은 받아들이지 않습니다.'
        ],
        clara: [
          '후훗, 이해할 수 없는 혼돈이야말로 인간 내면의 가장 진실한 본모습 아니겠어요?',
          '당신의 그 당혹스러운 표정… 제 소설 속 인물이 진실을 마주했을 때의 얼굴과 똑같군요.'
        ],
        lulu: [
          '뭐라는 거냐니?! 내 우아한 말을 이해 못 하는 네 뇌가 단순한 거지! 감히 디바한테 짜증이야?!',
          '하! 말이 안 통하는 촌뜨기랑은 더 이상 대화 안 해! 흥!'
        ],
        felix: [
          '앗, 제 설명이 너무 예술적이었나요? 하하, 죄송해요! 그냥 솔직한 감상을 말씀드린 거였어요!',
          '화내지 마세요! 자, 심호흡하시고 웃는 표정 한번 지어보세요! 찰칵!'
        ],
        gail: [
          '허허, 내 말이 조금 고리타분했나 보구먼. 젊은 친구의 답답한 마음도 이해하네.',
          '마음의 여유를 가지게나. 눈보라 속에서 말 한마디로 날을 세워서 무엇하겠는가.'
        ],
        arthur: [
          '음! 이해하기 어려운 게 당연하지! 고대 수메르의 은유적 표현을 빌려 말했으니 말일세, 허허!',
          '학문의 길은 원래 난해한 법일세! 차근차근 다시 설명해 줌세!'
        ],
        rose: [
          '어머, 제 말이 이상하게 들리셨나요? 당신을 기분 나쁘게 하려던 건 절대 아니에요, 후훗.',
          '답답하셨다면 미안해요. 음악처럼 부드럽게 대화하고 싶었을 뿐이랍니다.'
        ],
        ida: [
          '명확한 논리와 사실에 근거하여 말씀드렸습니다. 추가 질의가 없으시면 복귀하십시오.',
          '감정적인 반발은 업무 진행에 아무런 도움이 되지 않습니다.'
        ],
        elias: [
          '크하핫! 기자의 날카로운 화법에 뇌정지라도 온 거요? 신문 1면 헤드라인 읽듯 직관적으로 이해하시오!',
          '헛소리가 아니라 팩트요! 자네도 진실을 마주할 용기를 가지시오!'
        ]
      };
      return pickNonRepeating(disbeliefPools[key] || ['…무슨 말씀이신지 명확히 해 주십시오.'], `${key}_disbelief`);
    }

    // 28. DEMANDING APOLOGY & REBUTTAL: "사과해", "사과하면 다야?", "배상해", "가만 안 둬"
    if (isApologyDemandOrRebuttal) {
      const apologyPools = {
        bram: [
          '그, 그럼 제가 어떻게 해드려야 할까요…?! 약이라도 사다 드릴까요… 제 가방 속 소설 원고나 전 재산이라도 드릴 테니 부디 용서해 주세요…! (울먹거리며 안절부절못한다)',
          '제발 화 푸세요… 제가 시골에서 와서 아무것도 몰라서 그래요… 어떻게 배상해야 할지 알려주시면 다 할게요… 흑…'
        ],
        ward: [
          '사과? 형사한테 삿대질하며 배상 타령을 해? 공무집행방해로 수갑부터 채워주랴? 작작 까불어라.',
          '가만 안 두면 어쩔 텐가? 네 놈 주머니 속 흉기부터 수색해서 유치장에 처넣어줄까? 꺼져라.'
        ],
        nell: [
          '손님, 화 푸세요… 기차 안이라 마땅한 약은 없지만, 따뜻한 찻물과 붕대라도 챙겨드릴게요, 호호.',
          '서로 얼굴 붉혀서 무엇하겠어요. 제가 진심으로 사과드렸으니 부디 노여움을 거두어 주세요.'
        ],
        cade: [
          '사과받기 싫으면 석탄 삽자루로 맞짱이라도 뜨자는 거요?! 어금니 꽉 깨물고 비키쇼!',
          '배상 타령할 거면 차장한테 가쇼! 하루 2달러 버는 노동자 멱살 잡을 생각 말고!'
        ],
        harlan: [
          '감히 내게 사과를 요구해? 내 전속 법률 고문단에게 피해보상 소송을 당해 평생 빚더미에 앉고 싶은 모양이군.',
          '네 목숨값보다 비싼 내 시간을 뺏은 죄부터 물어야겠소. 당장 경호원 불러 쫓아내기 전에 꺼지시오.'
        ],
        mabel: [
          '내게 사과를 요구하다니, 천박함의 극치군요. 감히 평민이 귀족의 옷자락을 핑계 삼아 돈을 뜯어내려 드나요?',
          '가소롭군요. 당장 이 무례한 자를 차장에게 넘겨 다음 역에 내팽개치게 하겠어요.'
        ],
        jude: [
          '하하! 그럼 카드 한 판 쳐서 자네가 이기면 내가 10달러 줄게! 어때, 배짱 있으면 패 돌려봐!',
          '워워, 험악하게 굴지 마 친구! 사나이끼리 발 한번 스친 거 가지고 피 볼 필요는 없잖아, 크하핫!'
        ],
        nurse_k: [
          '의료진으로서 과실 여부를 확인한 후 규정에 따라 정식 보고서를 작성하겠습니다. 사적인 금전 요구는 거부합니다.',
          '열차 내 폭력이나 협박 행위는 철도경찰법 위반으로 즉시 구금 대상입니다.'
        ],
        clara: [
          '복수와 증오… 상처받은 자의 분노는 비극의 가장 위대한 원동력이죠. 당신의 그 분노, 아주 마음에 들어요, 후훗.',
          '사과로 끝날 비극이라면 시작되지도 않았겠죠. 당신의 다음 행동이 기대되네요.'
        ],
        lulu: [
          '배상?! 지금 세기의 디바한테 배상하라고 한 거야?! 내 변호사들이 네 전 재산을 탈탈 털어버릴 텐데 감당할 수 있겠어?!',
          '뻔뻔하게 어디서 돈 뜯어내려고 수작이야?! 경호원! 당장 이 무례한 놈을 쫓아내!'
        ],
        felix: [
          '죄송해요! 제가 가진 거라곤 필름과 카메라뿐인데… 정말 필요하시다면 제 가장 아끼는 사진 원본이라도 드릴게요!',
          '화 푸세요! 눈보라 속에서 다치지 않고 무사한 것만으로도 감사해야 할 순간이에요!'
        ],
        gail: [
          '허허, 내가 의사로서 진찰을 보고 필요한 치료를 다 해드림세. 노여움을 가라앉히시게나.',
          '사람이 살다 보면 부딪힐 수도 있는 법. 서로 너그럽게 품어주는 것이 사람의 도리라네.'
        ],
        arthur: [
          '배상이라! 함무라비 법전에도 ‘상해에 대한 은전 배상’ 조항이 있긴 하지… 허나 기차의 덜컹거림은 천재지변 아닌가, 허허!',
          '자네, 고대 스파르타 전사처럼 살기가 대단하구먼! 진정하고 차 한잔 마시게나!'
        ],
        rose: [
          '정말 죄송해요… 제 부주의로 마음을 상하게 해드렸다면 제가 노래라도 한 곡 불러서 위로해 드리고 싶어요, 후훗.',
          '화내지 마세요… 손님의 아픈 발이 얼른 낫도록 제가 기도할게요.'
        ],
        ida: [
          '열차 내 승객 간 분쟁에 따른 공식 보상 청구 절차를 안내해 드리겠습니다. 비인가 사적 요구는 불허합니다.',
          '신체적 위협이나 공무 방해 시 차장 및 경비대에 즉시 인계합니다.'
        ],
        elias: [
          "오호! 유혈 사태 합의금 분쟁인가?! 이거 '폭설 열차에서 벌어진 발목 밟기 스캔들'로 기사 쓰면 끝내주겠소!",
          '가만 안 두면 어쩔 거요? 신문에 당신 얼굴을 대문짝만하게 박아줄까, 크하핫!'
        ]
      };
      return pickNonRepeating(apologyPools[key] || ['…냉정하게 대화로 해결합시다.'], `${key}_apology_demand`);
    }

    // 29. COUNTER-ARGUMENTS & REBUTTALS: "그게 아니라", "내 말은", "핑계", "변명", "억지"
    if (isCounterArgument) {
      const counterPools = {
        bram: [
          '벼, 변명이 아니에요…! 전 정말로 거짓말을 하거나 핑계를 댈 줄 모르는 사람이에요… 제발 제 말 좀 믿어주세요… (손가락을 꼼지락거리며 억울해한다)',
          '제 말이 서툴러서 죄송해요… 하지만 정말 나쁜 뜻으로 말씀드린 게 아니에요… 흑…'
        ],
        ward: [
          '핑계인지 진실인지는 내 수사 감각이 판단한다. 네놈이야말로 뭔가 켕기는 게 있으니 목소리가 커지는 것 아닌가?',
          '말 돌리지 마라. 범죄자 놈들이 경찰 앞에서 짓거리는 뻔한 레퍼토리다.'
        ],
        cade: [
          '말재주 부릴 생각 마쇼! 땀 흘려 일하는 화부한테 혓바닥 놀려봐야 남는 건 석탄 연기뿐이오!',
          '억지 부리지 말고 제 앞가림이나 잘하쇼. 내 일 방해 말고.'
        ],
        harlan: [
          '반론을 제기하고 싶다면 내 법률 고문단을 통하시오. 서류 한 장 없는 자의 주장은 소음에 불과하오.',
          '자본가 앞에서 논리로 이길 수 있을 거라 착각하지 마시오. 자본이 곧 진리요.'
        ],
        clara: [
          '후훗, 팽팽한 논쟁이군요… 서로를 의심하는 이 차가운 긴장감, 제 다음 챕터의 갈등으로 완벽해요.',
          '모든 인간은 자신만의 논리로 무장하죠. 당신의 그 논리 뒤에 숨겨진 진짜 욕망은 무엇인가요?'
        ],
        mabel: [
          '천박한 자의 말대꾸 따위 귀담아들을 가치도 없군요. 더러운 입 다물고 썩 물러나요.',
          '상스러운 변명 집어치우세요. 품격 없는 자와의 대화는 구역질이 나는군요.'
        ],
        jude: [
          '크하핫! 도박판에서 핑계 대는 놈 치고 돈 따는 놈 못 봤지! 결과가 전부야, 친구!',
          '좋아 좋아, 말싸움 대신 주사위 세 번 굴려서 높은 놈 말이 맞는 걸로 하자고, 하하!'
        ],
        nurse_k: [
          '주관적인 주장 대신 객관적인 사실에 입각하여 말씀하십시오.',
          '규정과 절차에 대한 자의적인 해석은 인정하지 않습니다.'
        ]
      };
      return pickNonRepeating(counterPools[key] || ['…논쟁할 생각은 없습니다.'], `${key}_counter`);
    }

    // 30. ATTITUDE & PERSONALITY COMPLAINTS: "너 왜 그래?", "왜 띠껍냐", "싸가지", "성격 왜 이래", "말투"
    if (isAttitudeComplaint) {
      const attitudePools = {
        bram: [
          '죄송해요… 제가 워낙 숫기가 없고 답답해서 남들을 답답하게 만드나 봐요… 기분 나쁘셨다면 용서해 주세요… 흑…',
          '제 태도가 이상했나요…? 죄송해요, 시골에서 자라서 도시 신사분들 대하는 법을 잘 몰라요…'
        ],
        ward: [
          '내 태도가 맘에 안 드나? 여긴 네 유치원이 아니라 거친 범죄자들이 우글거리는 대륙횡단 열차다. 불만 있으면 저쪽으로 가.',
          '살인범과 사기꾼 상대하며 평생 굳은 얼굴이다. 곱상한 친절을 바랐다면 번지수 잘못 찾았다.'
        ],
        cade: [
          '석탄 가루 들이마시며 하루 14시간 삽질해 보쇼. 성격이 곱게 나오나! 볼일 없으면 꺼지쇼!',
          '뼈 빠지게 일하는데 싸가지 타령이오? 귀족 나으리 흉내 내지 말고 비키쇼!'
        ],
        harlan: [
          "100만 달러 제국을 통솔하는 자의 위엄을 고작 '싸가지' 따위로 치부하다니, 천박한 안목이로군.",
          '내 성격이 오만하다 느꼈다면, 네가 내 발밑에 있는 자라는 증거요.'
        ],
        mabel: [
          '평민 주제에 귀족의 태도를 품평하려 들다니, 오만방자하기 짝이 없군요. 하인이라도 불러 뺨을 쳐줄까요?',
          '천한 것들에게 베풀 친절 따윈 없어요. 내 시야에서 썩 물러나요.'
        ],
        jude: [
          '크하핫! 난 타고난 자유로운 영혼이라 말이지! 답답하게 굴지 말고 한잔 걸치면서 털어버리자구!',
          '헤헤, 내 날티 나는 말투가 맘에 안 들었나? 도박판에선 이런 뻔뻔함이 무기라니까!'
        ],
        nurse_k: [
          '의료 업무 특성상 감정을 배제하고 원칙에 따라 응대하고 있습니다. 사적인 감정 개입은 지양합니다.',
          '공적인 질서 유지를 위한 엄정한 태도입니다. 협조해 주십시오.'
        ],
        clara: [
          '제 태도가 낯설게 느껴지시나요? 후훗, 평범함이야말로 가장 지루한 죄악이랍니다.',
          '가면을 벗겨내려는 당신의 그 날 선 태도… 아주 매력적인 캐릭터예요.'
        ]
      };
      return pickNonRepeating(attitudePools[key] || ['…제 성격이 원래 이렇습니다.'], `${key}_attitude`);
    }

    // 31. TRAIN SITUATION & EMERGENCY: "기차 왜 멈췄어?", "언제 도착해?", "눈보라", "탈선", "추워"
    if (isTrainEmergency) {
      const trainPools = {
        bram: [
          '눈보라가 너무 거세서 선로가 파묻혔다고 들었어요… 이대로 고립되면 어쩌죠? 식량도 떨어질 텐데… 너무 무서워요…',
          '덜컹거릴 때마다 심장이 철렁 내려앉아요… 제발 무사히 시카고에 닿아야 할 텐데요…'
        ],
        ward: [
          '선로 제설 작업 중이다. 동요하지 말고 자리를 지켜. 이런 비상시일수록 쥐새끼들이 날뛰기 마련이니까.',
          '기관사가 전방 시야 확보에 애먹고 있다. 얌전히 자리에 앉아 있는 게 돕는 거다.'
        ],
        cade: [
          '선로에 눈이 산더미요! 보일러 불씨 꺼지면 기차 안이 냉동고가 되니까 닥치고 석탄이나 때게 비키쇼!',
          '증기압 유지하는 것만으로도 죽을 맛이오. 잡담할 시간 없소.'
        ],
        nell: [
          '바깥바람이 매섭지요? 두꺼운 외투를 여미고 계세요. 차장님들이 열심히 눈을 치우고 계신다니 금방 출발할 거예요, 호호.',
          '따뜻한 차라도 챙겨 드세요. 추울 땐 온기를 나누는 게 최고랍니다.'
        ],
        harlan: [
          '철도 회사에 즉각 전신을 쳐서 제설차를 추가 투입하라 지시했소. 내 사업 일정에 차질이 생기면 회사 사장을 파면할 거요.',
          '내 자본으로 뚫지 못할 눈길은 없소. 시간문제일 뿐이오.'
        ]
      };
      return pickNonRepeating(trainPools[key] || ['…눈보라가 곧 걷히길 바랄 뿐입니다.'], `${key}_train_emergency`);
    }

    // 32. UNIVERSAL DIRECT CONVERSATIONAL TIKI-TAKA ENGINE (Zero Monologues!)
    // Strictly distinguishes Questions vs Statements to ensure 100% interactive dialog without self-monologues!
    const isGeneralQuestion = q.includes('?') || q.endsWith('냐') || q.endsWith('니') || q.endsWith('까') || q.endsWith('가') || q.endsWith('해') || q.includes('뭐') || q.includes('어디') || q.includes('누구') || q.includes('언제') || q.includes('왜') || q.includes('어떻게') || q.includes('알아') || q.includes('어때') || q.includes('맞아') || q.includes('진짜');

    if (isGeneralQuestion) {
      const questionPools = {
        bram: [
          '저… 저한테 물어보신 건가요? 워낙 말주변이 없어서 제대로 대답해 드리지 못해 죄송해요… 하지만 제 생각엔 이 눈보라가 그칠 때까진 모두가 조심해야 할 것 같아요…',
          '그 질문에 대해선… 제가 영문학 서적에서 읽은 구절밖에 떠오르지 않지만… 당신 말씀처럼 정말 의문이 드네요… 조심하시는 게 좋을 것 같아요…'
        ],
        ward: [
          '내게 질문을 던질 생각이면 용건부터 확실히 해라. 쓸데없는 사담에 일일이 답변해 줄 만큼 한가한 형사가 아니다.',
          '그 질문, 꽤 의미심장하게 들리는군. 뭔가 알고서 떠보는 건가? 허튼짓 벌일 생각은 접어라.'
        ],
        nell: [
          '호호, 손님께서 궁금하신 게 많으신가 봐요. 기차에 갇혀 있다 보니 별생각이 다 드시지요? 제가 아는 거라면 편하게 답해 드릴게요.',
          '그 질문을 들으니 고향 마을의 어르신들이 해주시던 옛이야기가 떠오르네요. 참 흥미로운 말씀이세요, 호호.'
        ],
        clara: [
          '후훗… 당신의 그 질문, 마치 제 비극 소설의 결말을 묻는 독자의 눈빛 같네요… 진실을 알 준비가 되셨나요?',
          '질문 속에는 언제나 질문하는 자의 은밀한 욕망이 숨어있죠. 당신은 왜 그것이 알고 싶으신가요?'
        ],
        jude: [
          '크하핫! 친구, 질문이 꽤 날카로운데?! 패를 까봐야 알겠지만 내 직감으론 자네 말이 맞는 것 같아!',
          '하하! 뭘 그렇게 캐묻고 그래! 인생은 복잡하게 따지는 것보다 단순하게 즐기는 게 최고라구!'
        ],
        harlan: [
          '…(시계를 내려다보며) 내게 질문할 자격이 있다고 생각하시오? 가치 있는 정보가 아니라면 내 시간을 낭비하지 마시오.',
          '내게서 원하는 대답을 얻으려면 그만한 대가를 치러야 할 거요. 일개 승객의 호기심을 채워줄 이유는 없소.'
        ],
        mabel: [
          '평민 주제에 감히 내게 질문을 던지다니 오만하기 짝이 없군요. 하인이나 차장에게나 가서 물어보세요.',
          '상스러운 질문 따위에 대답할 품격이 못 됩니다. 내 시야에서 물러나세요.'
        ],
        nurse_k: [
          '질문 내용 접수했습니다. 다만 비의료적 사안에 대해서는 답변 권한이 제한되어 있으니 양해 바랍니다.',
          '객실 안전과 관련된 용건이시라면 명확하게 말씀해 주십시오. 즉시 조치하겠습니다.'
        ],
        cade: [
          '석탄 퍼넣느라 등골이 휘는데 질문은 무슨 얼어 죽을 질문이오! 객실 가서 차장 멱살이나 잡으쇼!',
          '궁금한 게 많으면 책이나 뒤져보쇼. 땀내 나는 노동자한테 지식 자랑하지 말고!'
        ],
        gail: [
          '허허, 젊은 친구의 호기심이 참으로 싱그럽구먼. 살다 보면 의문투성이지만 시간이 답을 주는 법이라네.',
          '좋은 질문일세. 눈보라에 갇혀 지루했는데 자네와 이런 이야기를 나눌 수 있어 반갑구먼, 허허.'
        ],
        arthur: [
          '오호! 자네의 그 질문은 고대 이집트 파라오의 서판에도 적혀 있던 영원한 인류의 숙제라네! 참 총명한 친구구먼!',
          '음! 탐구열이 대단하군! 학자의 호기심을 자극하는 아주 날카로운 발상이야, 허허!'
        ],
        rose: [
          '어머, 저한테 물어보신 건가요? 노래와 춤만 출 줄 아는 부족한 저지만… 손님 말씀에 귀 기울이고 싶어요, 후훗.',
          '궁금하신 게 있으셨군요. 차가운 기차 안이지만 손님과 이야기하니 따뜻해지는 것 같아요.'
        ],
        lulu: [
          '뭐야? 지금 세기의 디바인 날 취재라도 하겠다는 거야? 내 사생활은 백만 달러짜리 특종이라고!',
          '흥! 감히 디바한테 캐묻다니 당돌하기도 하지! 그래도 관심 가져주는 건 나쁘지 않네, 호호!'
        ],
        felix: [
          '와! 방금 그 질문을 하실 때의 눈빛! 렌즈에 포착하고 싶을 만큼 진지했어요! 무슨 뜻인지 정말 궁금하네요!',
          '하하! 저도 사진기만 들고 다녔지 그런 건 미처 생각 못 했네요! 아주 흥미진진한데요?!'
        ],
        ida: [
          '해당 질의는 회장님 비서실 보안 규정상 비공개 사항입니다. 추가 질의는 서면 제출하십시오.',
          '승객 개인의 사적 질의에는 응대하지 않습니다. 공무에 협조하십시오.'
        ],
        elias: [
          '오호! 특종의 냄새를 맡는 능력이 기자 뺨치는데?! 당신, 혹시 타사 신문사에서 잠입한 스파이요?! 크하핫!',
          '그 질문, 내일 조간신문 1면에 대문짝만하게 실릴 헤드라인 감이오! 어디서 더 들은 정보 없소?!'
        ]
      };
      return pickNonRepeating(questionPools[key] || ['…무슨 말씀이신지 정확히 질문해 주십시오.'], `${key}_question_general`);
    }

    // 33. DIRECT CONVERSATIONAL STATEMENT REACTIONS (Active Listening & Banter, Zero Monologues!)
    const statementPools = {
      bram: [
        '아… 당신의 그 말씀에 저도 깊이 공감해요… 이 어두운 열차 안에서 그렇게 이야기해 주시니 조금은 마음이 놓이네요…',
        '네… 손님의 그 말씀, 조용히 마음에 새겨둘게요… 낯선 저에게 그렇게 말을 건네주셔서 정말 고마워요…'
      ],
      ward: [
        '네가 방금 한 말, 허튼소리 같지는 않군. 하지만 섣부른 추측은 수사를 망치는 법이다. 말조심해라.',
        '듣고 보니 일리 있는 말이군. 형사 앞이라고 긴장하지 않고 할 말은 다 하는 녀석이군.'
      ],
      nell: [
        '호호, 손님의 그 따뜻한 말씀이 차가운 눈보라 속에서도 큰 위안이 되네요. 참 다정하신 분이세요.',
        '사람 사는 곳이 다 그렇지요. 손님처럼 따뜻하게 말씀해 주시는 분이 계셔서 기차 안이 훈훈해져요.'
      ],
      cade: [
        '…흥, 혓바닥만 잘 놀리는 줄 알았더니 영 헛소리만은 아니구려. 그래도 석탄 불길 앞엔 오지 마쇼.',
        '뭐, 알아서 잘하쇼. 험한 일 하는 화부한테 친한 척해 봐야 묻어나는 건 그을음뿐이오.'
      ],
      harlan: [
        '…호오, 제법 흥미로운 관점이로군. 내 사업에 도움이 될 만한 통찰이 있다면 계속 지껄여 보시오.',
        '평범한 승객들의 넋두리와는 사뭇 다르군. 쓸모 있는 말이라면 기억해 두겠소.'
      ],
      clara: [
        '후훗… 당신의 그 한마디, 마치 제 다음 비극 소설의 가장 차가운 대사처럼 마음에 와닿네요… 매력적이에요.',
        '그 말속에 담긴 당신의 감정… 차가운 설원 열차의 공기와 참 기묘하게 어우러지는군요.'
      ],
      jude: [
        '크하핫! 역시 자네랑 이야기하면 막혔던 속이 다 뻥 뚫린다니까! 시카고 가면 내가 술 한잔 산다!',
        '하하! 바로 그거지! 자네처럼 솔직하고 화끈한 사람, 도박판에서도 아주 귀한 인재라구!'
      ],
      mabel: [
        '천박한 입에서 나온 말치고는 제법 귀담아들을 구석이 있군요. 하지만 내 앞에서는 여전히 분수를 지키세요.',
        '…흥, 교양 있는 척하려는 건 가상하군요. 내 드레스에 먼지나 묻히지 마세요.'
      ],
      nurse_k: [
        '진술 내용 확인했습니다. 객실 내 질서 유지에 부합하는 의견이라면 적극 수용하겠습니다.',
        '객관적인 의견 감사합니다. 열차 내 보건 위생 지침에 참고하도록 하겠습니다.'
      ],
      gail: [
        '허허, 자네의 그 말을 듣고 있자니 30년 의사 생활 동안 마주했던 수많은 인연들이 떠오르는구먼. 고맙네.',
        '마음이 참 깊은 친구구먼. 눈보라가 아무리 거세도 사람 사이의 따뜻한 온기는 얼지 않는 법이지.'
      ],
      arthur: [
        '오호! 자네의 그 의견은 기원전 알렉산드리아 도서관의 철학자들도 깊이 토론했던 난제일세! 대단해!',
        '자네, 학자의 안목을 타고났구먼! 고대 비문을 마주할 때처럼 가슴이 두근거리는 견해요, 허허!'
      ],
      rose: [
        '어머, 그렇게 말씀해 주시니 제 가슴속에서 슬픈 멜로디가 눈 녹듯 사라지는 것 같아요, 후훗.',
        '참 로맨틱한 말씀이네요. 당신의 그 말, 무대 위에서 아리아를 부를 때 꼭 기억할게요.'
      ],
      lulu: [
        '어머, 제법 센스 있는 코멘트잖아? 세기의 디바인 날 감동하게 만들다니, 자네 제법인데?!',
        '호호! 내 미모에 취해 횡설수설하는 줄 알았더니 꽤 들을 만한 말이었네! 팬클럽에 가입시켜 줄까?!'
      ],
      felix: [
        '와우! 방금 하신 그 말씀, 흑백 사진의 캡션으로 달기에 정말 완벽해요! 감동받았어요!',
        '찰칵! 방금 그 말씀을 하실 때의 진지한 표정, 제 마음속 뷰파인더에 영원히 담아둘게요!'
      ],
      ida: [
        '기록하였습니다. 회장님 보고서에 참고 사항으로 등재할 가치가 있는지 검토하겠습니다.',
        '사견 접수되었습니다. 추가 소명 사항이 없다면 대기하십시오.'
      ],
      elias: [
        '크하핫! 당신 정말 명언 제조기로구만! 내일 아침 조간신문 독자 투고란에 그대로 실어주고 싶소!',
        '특종 감은 아니지만 제법 뼈 때리는 말이었소! 다음 호 가십란 끄트머리에 한 줄 넣어주지!'
      ]
    };

    return pickNonRepeating(statementPools[key] || ['…당신의 말씀에 귀 기울이고 있습니다.'], `${key}_statement`);
  };

  // Ambient Overheard Dialogues
  const updateAmbient = (delta, playerPos) => {
    ambientCooldown -= delta;
    if (ambientCooldown > 0) return;
    ambientCooldown = 25.0 + Math.random() * 20.0;

    const pz = playerPos.z;
    let chosenPair = null;
    if (pz <= -35.0 && pz > -55.0) chosenPair = Math.random() < 0.5 ? 'bram_nell' : 'nurse_k_elias';
    else if (pz <= -57.0 && pz > -77.0) chosenPair = Math.random() < 0.5 ? 'harlan_ida' : 'harlan_clara';
    else if (pz <= -79.0 && pz > -99.0) chosenPair = 'gail_arthur';
    else if (pz <= -101.0 && pz > -121.0) chosenPair = 'jude_rose';
    else if (pz <= -123.0 && pz > -143.0) chosenPair = 'lulu_felix';

    if (!chosenPair) return;

    const ambientDialogues = {
      bram_nell: '넬: "어머, 브람 씨. 그렇게 굳어 계시면 책 모서리가 다 구겨지겠어요." / 브람: "아, 네… 죄송해요. 창밖 눈보라가 너무 거세서…"',
      nurse_k_elias: '엘리아스: "케이 간호사! 1호차 보일러실 화부의 가방에서 이상한 약병이 나왔다는 게 사실이오?" / 케이: "근거 없는 유언비어로 의료 업무를 방해하지 마십시오."',
      harlan_ida: '할란: "아이다, 시카고 도착 즉시 철도 주식 5만 주를 비밀리에 매집할 준비를 끝내둬." / 아이다: "네, 회장님. 전신 암호문은 이미 작성해 두었습니다."',
      harlan_clara: '할란: "클라라 양, 당신 소설에 날 악덕 자본가 모델로 썼다간 폐간 소송을 맞게 될 거요." / 클라라: "후훗, 회장님. 현실의 악인은 제 소설 속 악당보다 훨씬 더 매력적인 법이랍니다."',
      gail_arthur: '게일: "아서 교수, 식사 중에 돋보기를 들여다보면 위장에 해롭다네." / 아서: "허허, 게일 자네는 몰라! 이 숟가락의 무늬가 12세기 셀주크 튀르크의 양식과 똑같다니까!"',
      jude_rose: '주드: "로즈 양, 시카고에 도착하면 내가 딴 배당금으로 최고급 다이아 목걸이를 걸어주지!" / 로즈: "어머, 주드 씨. 허풍은 무대 위에서나 치세요, 후훗."',
      lulu_felix: '룰루: "필릭스! 내 턱선을 찍을 땐 45도 하이 앵글로 찍으라고 몇 번을 말해?!" / 필릭스: "하하, 룰루 님! 지금 이 화난 표정이 훨씬 더 드라마틱한 걸작인데요!"'
    };

    const text = ambientDialogues[chosenPair];
    if (text) showAmbientSubtitle(`👂 [귓가에 들리는 승객들의 대화] ${text}`);
  };

  const showAmbientSubtitle = (text) => {
    let box = document.getElementById('ambient-subtitle');
    if (!box) {
      box = document.createElement('div');
      box.id = 'ambient-subtitle';
      box.style.cssText = `
        display: none; position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
        background: rgba(18, 14, 12, 0.9); border: 1px solid #dfb142; color: #f5efe6;
        padding: 8px 20px; border-radius: 8px; font-size: 13.5px; z-index: 9999;
        pointer-events: none; box-shadow: 0 4px 15px rgba(0,0,0,0.7);
      `;
      document.body.appendChild(box);
    }
    box.textContent = text;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 6000);
  };

  return {
    init: initUI,
    open,
    close,
    isOpen: () => isDialogueOpen,
    sendPlayerMessage,
    updateAmbient,
    getApiKey,
    isNameRevealed,
    charactersDB
  };
})();

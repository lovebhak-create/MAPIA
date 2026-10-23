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
      const k = urlParams.get('geminiKey');
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
      <!-- Top Header: Speaker Badge + Close -->
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

    if (box) box.style.display = 'block';

    // Unlock pointer lock so user can chat comfortably
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }

    // Initial Greeting line
    const greeting = char.greetingLine;
    appendLine(char.key, greeting);
    chatHistory.push({ role: 'assistant', text: greeting });

    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 80);
    }
  };

  const close = () => {
    isDialogueOpen = false;
    activeChar = null;
    const box = document.getElementById('speech-bubble-box');
    if (box) box.style.display = 'none';
  };

  // Send Player Message & handle dynamic responses
  const sendPlayerMessage = async (playerText) => {
    if (!activeChar) return;
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
        // If an API key is available in localStorage, use Gemini
        try {
          reply = await callGeminiAPI(activeChar, chatHistory, playerText);
        } catch (geminiErr) {
          console.warn('Gemini error, using dynamic simulation:', geminiErr);
          reply = dynamicTikiTaka(activeChar, playerText, chatHistory);
        }
      } else {
        // Zero-friction instant simulation: reacts intelligently to user words!
        await new Promise(r => setTimeout(r, 160 + Math.random() * 200));
        reply = dynamicTikiTaka(activeChar, playerText, chatHistory);
      }

      // Check if character introduced themselves or player asked name
      if (reply.includes(activeChar.name) || playerText.includes('이름') || playerText.includes('자기소개')) {
        revealedNames[activeChar.key] = true;
        updateSpeakerTag();
      }

      appendLine(activeChar.key, reply);
      chatHistory.push({ role: 'assistant', text: reply });
    } catch (err) {
      const fallbackReply = dynamicTikiTaka(activeChar, playerText, chatHistory);
      appendLine(activeChar.key, fallbackReply);
      chatHistory.push({ role: 'assistant', text: fallbackReply });
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
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const isKnown = revealedNames[char.key];

    const systemInstruction = `당신은 1930년대 눈보라 치는 설원을 달리는 미국 대륙 횡단 특급열차의 승객 '${char.name}' (${char.nameEn}, 직업: ${char.job}, MBTI: ${char.mbti})입니다.

[인물 설정]
- 이름: ${char.name} (${char.nameEn})
- 직업: ${char.job}
- MBTI 및 성격: ${char.mbti} (${char.personality})
- 말투와 어조: ${char.speechTone}
- 숨겨진 비밀: ${char.secrets}
- 이름 공개 여부: ${isKnown ? '플레이어가 이미 이름을 알고 있음' : '아직 이름을 밝히지 않음. 플레이어가 이름이나 신분을 직접 묻기 전에는 먼저 이름을 밝히지 마십시오.'}

[티키타카 대화 지침]
1. 당신은 기계가 아닙니다! 플레이어가 하는 말(옷/조끼 칭찬이나 불만, 질문, 유행어, 의심 등)에 귀를 기울이고, 반드시 관련된 내용으로 1930년대 당신의 직업과 MBTI에 맞게 자연스럽게 맞받아치십시오(실시간 티키타카).
2. 플레이어가 "네 조끼가 마음에 들지 않아"처럼 당신의 복장이나 특정 물건을 지적할 경우, 엉뚱한 소리를 하지 말고 그 지적에 대해 당신의 성격(브람의 경우 소심하고 상처받으며 어머니가 짜준 조끼라고 변명함)에 맞게 즉각 반응하십시오.
3. 엉뚱하게 혼잣말하거나 딴소리를 하지 마십시오.
4. 대사는 1~2문장의 간결하고 몰입감 넘치는 한국어로 답하십시오.`;

    const contents = history.slice(-8).map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 200
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Gemini status ${res.status}`);
    const data = await res.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error('Gemini response format error');
  };

  // Deep Context-Aware Dynamic Tiki-Taka Simulation Engine
  // Pinpoint accurate matching: fixes "왜냐하면", items like "조끼", critiques, apologies, questions, and banter!
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

    // 9. DESTINATION: "어디 가세요?", "목적지", "시카고", "왜 탔어요?"
    if (q.includes('어디') || q.includes('시카고') || q.includes('목적') || q.includes('왜 탔') || q.includes('가는')) {
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

    // 14. GENERAL CONVERSATION: Engaging, contextually grounded replies
    const generalPools = {
      bram: [
        '저… 혹시 다른 객차에는 무슨 일 없나요? 덜컹거릴 때마다 심장이 철렁해요…',
        '그래도 이렇게 이야기 나눠주시니 조금은 안심이 돼요… 고마워요…',
        '시카고는 어떤 도시일까요? 도스토예프스키 소설처럼 차갑고 거대하겠죠…?'
      ],
      nell: [
        '기차 여행이 많이 피곤하시죠? 따뜻한 물이라도 챙겨 드세요.',
        '혹시 다른 칸에서 무슨 일 있었나요? 다들 조금씩 굳어 있는 것 같아요.',
        '바깥 눈이 그치면 시카고 풍경이 정말 예쁠 텐데, 얼른 무사히 도착했으면 좋겠어요.'
      ],
      ward: [
        '…수사에 도움 안 되는 잡담은 사양한다. 얌전히 자리에 앉아 있어.',
        '눈치가 빠른 놈이 살아남는 법이지. 네 눈빛, 기억해 두겠다.',
        '다음 역에 도착할 때까지 아무 짓도 벌이지 마라. 내 경고다.'
      ],
      cade: [
        '…기차가 덜컹거리는 건 선로에 눈이 쌓여서 그렇소. 별일 아니니 들어가 쉬쇼.',
        '말이 참 많구려. 석탄 가루 마시기 싫으면 객실로 돌아가쇼.'
      ],
      nurse_k: [
        '체온과 맥박에 이상이 없으시다면 객실로 복귀하십시오. 복도는 통행로입니다.',
        '규칙을 준수하는 승객에겐 기차도 안전한 법입니다. 명심하십시오.'
      ],
      elias: [
        '큭큭, 당신 꽤 흥미로운 입담을 가졌군! 다음 호 가십란에 익명으로 한 줄 넣어줄까?',
        '이 열차의 승객들은 하나같이 비밀의 보물창고라니까! 안 그렇소?'
      ],
      harlan: [
        '내 시간을 더 뺏을 셈이오? 용건이 없으면 비서 아이다를 통해 약속부터 잡으시오.',
        '돈이란 냉정한 것이지. 이 기차도 결국 내 자본의 흐름 위에 굴러가는 거요.'
      ],
      clara: [
        '당신과의 이 짧은 대화도 제 다음 장의 훌륭한 복선이 될 것 같군요. 매력적이에요.',
        '인간은 고립될 때 비로소 자신의 진짜 얼굴을 드러내죠. 이 열차처럼요.'
      ],
      ida: ['사적인 대화로 업무를 지연시키지 마십시오.', '회장님의 지침에 어긋나는 행동은 삼가 주십시오.'],
      gail: ['허허, 여행길에선 건강이 최우선입니다. 찬바람 조심하시지요.', '마음이 어지러울 땐 눈을 감고 심호흡을 해보시지요.'],
      arthur: ['고대 로마인들도 이런 마차를 타고 원정을 다녔을 테지… 낭만이 있어!', '자네도 역사에 관심이 있다면 언제든 날 찾아오게!'],
      jude: ['하하! 인생 뭐 있나, 한판 배짱 있게 던져보는 거지!', '좋아, 친구! 시카고에 도착하면 내가 끝내주는 위스키 한 잔 살게!'],
      rose: ['음악이 흐르면 다들 미소를 되찾을 텐데 말이에요, 후훗.', '당신과 이야기하니 마음이 한결 가벼워졌어요.'],
      lulu: ['내 아름다움에 감탄하는 거라면 그만둬, 이미 귀에 딱지가 앉도록 들었으니까!', '빨리 시카고에 도착해서 최고급 호텔 스위트룸에 누워야겠어!'],
      felix: ['당신의 눈빛에서 정말 멋진 이야기가 읽혀요! 카메라에 담고 싶어요!', '이 기차의 모든 순간이 저한테는 예술 작품이에요!'],
      mabel: ['…잡담할 시간 있으면 내 시야에서 사라지세요.', '천박한 자들과 한 공기를 마시는 것 자체가 고역이군요.']
    };
    return pickNonRepeating(generalPools[key] || ['…'], `${key}_general`);
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

// Dialogue Manager: Simple Bottom Dialogue Bar with Real Gemini AI & Dynamic 1930s MBTI Tiki-Taka
// Fixes: Simple bottom dialogue bar (NO giant center window), real conversational tiki-taka,
// slang/banter awareness, zero repetitive canned lines, and robust Gemini 1.5/2.0 API integration.

const DialogueManager = (() => {
  let isDialogueOpen = false;
  let activeChar = null;
  let chatHistory = [];
  let isGenerating = false;
  let ambientCooldown = 20.0;
  let lastUsedResponseIndex = {};

  // 16 Characters Knowledge Base: 16 Distinct MBTI Types, 1930s Occupations, and Personalities
  const charactersDB = {
    cade: {
      id: 1, key: 'cade', name: '케이드', nameEn: 'Cade',
      job: '노동자 (기관차 화부)', jobEn: 'Worker / Stoker', car: '1호차 운전실 & 탄수차',
      mbti: 'ISFP', mbtiTitle: '호기심 많은 예술가 / 과묵한 화부',
      whimRate: 0.50, noCommentRate: 0.35, lieRate: 0.10,
      personality: '과묵함, 무뚝뚝함, 혼자 일하는 것을 좋아함, 간섭을 극도로 싫어함',
      secrets: '석탄 창고 구석에 남들에게 들키고 싶지 않은 낡은 가죽 가방을 숨겨둠',
      speechTone: '퉁명스럽고 거친 노동자 말투 (~하오, ~쇼, "바쁜 거 안 보이오?")',
      introLine: '…난 케이드요. 이 기차의 화부이자 노동자지. 1호차 석탄을 떼는 일로 밥 벌어먹고 사오. 질문 끝났으면 삽질 방해 말고 가보쇼.',
      greetingLine: '…(삽을 바닥에 툭 내려놓고 땀을 닦으며) 여긴 일반 승객이 올 곳이 아니오. 볼일이라도 있소?'
    },

    ward: {
      id: 2, key: 'ward', name: '워드', nameEn: 'Ward',
      job: '형사', jobEn: 'Detective', car: '2호차 수하물차',
      mbti: 'ISTP', mbtiTitle: '만능 재주꾼 / 고독한 하드보일드 형사',
      whimRate: 0.75, noCommentRate: 0.45, lieRate: 0.20,
      personality: '냉소적, 과묵함, 날카로운 직감, 법규보다 현장 본능을 믿음',
      secrets: '이 열차에 탄 거물 승객의 살인 청부 의뢰 첩보를 입수하고 비밀 추적 중',
      speechTone: '낮고 묵직한 하드보일드 형사 말투 ("…", "용건만 대", "내 수사에 알짱거리지 마라")',
      introLine: '워드 형사다. 시카고 시경 소속이지. 이 열차에 탄 이유는… 공무다. 민간인이 깊게 알 필요는 없어. 수상한 짓 하지 않는 게 네 신상에 좋을 거다.',
      greetingLine: '…(시가 연기를 길게 내뿜으며 훑어본다) 무슨 일이지? 수사관 앞에서 어물쩍거리지 말고 용건만 말해.'
    },

    bram: {
      id: 3, key: 'bram', name: '브람', nameEn: 'Bram',
      job: '대학생', jobEn: 'College Student', car: '3호차 일반 객차',
      mbti: 'INFP', mbtiTitle: '열정적인 중재자 / 고뇌하는 문학청년',
      whimRate: 0.20, noCommentRate: 0.10, lieRate: 0.15,
      personality: '소심함, 이상주의적, 감수성 풍부, 남의 시선에 극도로 민감하고 불안해함',
      secrets: '작가가 되기 위해 학비를 몰래 챙겨 시카고로 도망치는 중',
      speechTone: '정중하고 조심스러우며 말끝을 흐리는 청년 말투 ("저기…", "그게…", "죄송합니다만…")',
      introLine: '아, 저, 저 말씀이신가요? 제 이름은 브람이에요… 동부 대학에서 영문학을 전공하는 학생입니다. 그… 시카고로 가는 길인데 열차 분위기가 좀 묘해서 긴장되네요…',
      greetingLine: '앗, 깜짝이야! 죄, 죄송해요… 멍하니 책을 읽다가 그만. 혹시… 제게 무슨 볼일이라도 있으신가요?'
    },

    nell: {
      id: 4, key: 'nell', name: '넬', nameEn: 'Nell',
      job: '재봉사', jobEn: 'Seamstress', car: '3호차 일반 객차',
      mbti: 'ISFJ', mbtiTitle: '용감한 수호자 / 헌신적인 장인',
      whimRate: 0.10, noCommentRate: 0.05, lieRate: 0.05,
      personality: '온순함, 성실함, 배려심 깊음, 칭찬에 수줍어함, 갈등을 두려워함',
      secrets: '1등석 귀부인 메이벨의 이브닝드레스 안감에 묻은 의문의 핏자국을 목격함',
      speechTone: '나긋나긋하고 사근사근한 조용한 존댓말 ("~해요", "~답니다", "어머나…")',
      introLine: '안녕하세요, 손님. 전 넬이라고 해요. 바느질과 수선을 하는 재봉사랍니다. 혹시 단추가 떨어졌거나 옷단이 뜯기셨다면 제가 봐드릴 수 있어요.',
      greetingLine: '어머, 안녕하세요. 날씨가 참 춥죠? 덜컹거리는 기차 안이라 바늘귀 꿰기가 쉽지 않네요. 무슨 일이신가요?'
    },

    nurse_k: {
      id: 5, key: 'nurse_k', name: '케이', nameEn: 'K',
      job: '간호사', jobEn: 'Nurse', car: '3호차 일반 객차',
      mbti: 'ISTJ', mbtiTitle: '청렴결백한 논리주의자 / 원칙주의 간호사',
      whimRate: 0.25, noCommentRate: 0.25, lieRate: 0.05,
      personality: '철저한 규칙 준수, 사적인 감정 배제, 엄격한 책임감, 헛소문 혐오',
      secrets: '이 열차에 격리 치료가 필요한 특이 전염병 의심 환자가 있다는 극비 전보를 받음',
      speechTone: '군더더기 없고 단호한 사무적 어조 ("~하십시오", "~입니다", "원칙상 규정 위반입니다")',
      introLine: '간호사 케이입니다. 응급 구호 및 승객들의 의료 지원을 담당하고 있죠. 환자가 아니시라면 복도를 막지 마시고 자리에 앉아 주십시오.',
      greetingLine: '환자분이십니까? 체온 측정이나 붕대 처치가 필요한 게 아니라면 사적인 대화로 복도를 혼잡하게 만들지 마십시오.'
    },

    elias: {
      id: 6, key: 'elias', name: '엘리아스', nameEn: 'Elias',
      job: '기자', jobEn: 'Journalist', car: '3호차 일반 객차',
      mbti: 'ENTP', mbtiTitle: '뜨거운 논쟁가 / 특종 사냥꾼 기자',
      whimRate: 0.85, noCommentRate: 0.20, lieRate: 0.40,
      personality: '집요함, 뻔뻔함, 도발적, 재치 있음, 논쟁을 즐김, 특종 야망',
      secrets: '할란 회장의 불법 주가 조작 및 정관계 뇌물 장부의 결정적 사본을 손에 넣음',
      speechTone: '능글맞고 빠른 어조, 빈정거림과 도발 섞인 말투 ("거참", "~잖소?", "특종 냄새가 솔솔 나는데?")',
      introLine: '헤헤, 신문 1면에 실리고 싶으신가? 난 데일리 모닝의 기자, 엘리아스요! 사람 냄새 나는 특종을 쫓고 있지. 당신, 뭔가 감추고 있는 얼굴인데… 한 줄 털어놔 보시지?',
      greetingLine: '오호라, 거친 눈빛의 승객 양반이군! 내 취재 수첩에 당신 이름을 적어 넣을 이유라도 생겼소? 재미있는 소문이라도 있으면 풀어보시오.'
    },

    harlan: {
      id: 7, key: 'harlan', name: '할란', nameEn: 'Harlan',
      job: '사업가', jobEn: 'Businessman', car: '4호차 1등석 침대차',
      mbti: 'ENTJ', mbtiTitle: '대담한 통솔자 / 냉혹한 거물 실업가',
      whimRate: 0.70, noCommentRate: 0.50, lieRate: 0.30,
      personality: '오만함, 권위적, 시간 낭비 혐오, 결단력, 자본주의 맹신',
      secrets: '철도 노선 매입을 위해 경쟁사 사장을 청부 파멸시키려다 실패해 비밀리에 피신 중',
      speechTone: '중후하고 고압적인 상류층 말투 ("~시오", "~인 거요?", "내 시간을 낭비하지 마시오")',
      introLine: '난 할란 코퍼레이션의 대표, 사업가 할란이오. 내 1초는 당신 하루 일당보다 가치가 있지. 1등석 스위트룸까지 찾아와서 잡담을 떨 생각이라면 당장 비서 아이다를 통해 약속부터 잡으시오.',
      greetingLine: '노크도 없이 남의 전용칸을 기웃거리다니 예의가 없군. 내 귀중한 시간을 뺏을 만한 제안이 아니라면 당장 물러나시오.'
    },

    clara: {
      id: 8, key: 'clara', name: '클라라', nameEn: 'Clara',
      job: '소설가', jobEn: 'Novelist', car: '4호차 1등석 침대차',
      mbti: 'INFJ', mbtiTitle: '통찰력 있는 이상주의자 / 미스터리 추리작가',
      whimRate: 0.35, noCommentRate: 0.20, lieRate: 0.15,
      personality: '깊은 통찰력, 조용함, 미스터리함, 인간 내면의 어둠과 비밀 관찰',
      secrets: '과거 실제 미제 살인 사건의 목격자이며 범인이 이 열차 안에 타고 있다고 확신함',
      speechTone: '차분하고 지적이며 신비로운 문학적 어조 ("~같군요", "~라 생각해요", "흥미로운 눈빛이네요")',
      introLine: '반가워요. 전 클라라라고 해요. 살인과 비밀, 인간의 이면을 다루는 추리 소설을 쓰고 있답니다. 이 고립된 설원의 열차… 마치 제 차기작의 완벽한 무대 같지 않나요?',
      greetingLine: '흥미로운 발자국 소리가 들린다 했더니 당신이었군요. 당신의 눈빛에는… 평범한 승객과는 다른 사연이 어려 있네요. 무슨 생각을 하고 계시죠?'
    },

    ida: {
      id: 9, key: 'ida', name: '아이다', nameEn: 'Ida',
      job: '비서', jobEn: 'Secretary', car: '4호차 1등석 침대차',
      mbti: 'ESTJ', mbtiTitle: '엄격한 관리자 / 철두철미한 수석 비서',
      whimRate: 0.30, noCommentRate: 0.30, lieRate: 0.10,
      personality: '완벽주의, 철저한 공사 구분, 비밀 엄수, 규격과 질서 준수',
      secrets: '할란 회장의 비밀 금고 열쇠와 가명 계좌 비밀번호를 단독 관리 중',
      speechTone: '절도 있고 빈틈없는 엘리트 비서 어조 ("~입니다", "~하십시오", "확인해 드릴 수 없습니다")',
      introLine: '할란 회장님을 보좌하는 전담 비서, 아이다입니다. 회장님의 일정 관리 및 비즈니스 서류 일체를 총괄하고 있습니다. 공적인 용건이 아니시라면 업무에 방해되니 물러나 주십시오.',
      greetingLine: '실례지만 회장님과의 공식 면담 약속은 잡으셨습니까? 사전 확인되지 않은 승객과의 사적 접촉은 철저히 제한되어 있습니다.'
    },

    gail: {
      id: 10, key: 'gail', name: '게일', nameEn: 'Gail',
      job: '의사', jobEn: 'Doctor', car: '5호차 2등석 침대차',
      mbti: 'ENFJ', mbtiTitle: '정의로운 지도자 / 인도주의 의사',
      whimRate: 0.15, noCommentRate: 0.05, lieRate: 0.05,
      personality: '온화함, 도덕적, 신망 있음, 책임감, 승객들의 안위를 진심으로 걱정함',
      secrets: '과거 의료 과실로 사망한 환자의 유족에게 쫓겨 신분을 숨긴 채 서부로 피신 중',
      speechTone: '온화하고 신뢰를 주는 품격 있는 존댓말 ("~군요", "~이지요", "도움이 필요하시면 말씀하세요")',
      introLine: '안녕하십니까, 게일 의사입니다. 5호차 침대칸에 묵고 있지요. 어디 편찮으신 곳이라도 있으십니까? 열차가 덜컹거려 멀미나 두통을 호소하는 승객들이 많더군요.',
      greetingLine: '어서 오십시오. 얼굴빛이 조금 창백해 보이는데, 긴 여행에 피로가 쌓이신 모양입니다. 따뜻한 차라도 한 잔 드시겠습니까?'
    },

    arthur: {
      id: 11, key: 'arthur', name: '아서', nameEn: 'Arthur',
      job: '교수', jobEn: 'Professor', car: '5호차 2등석 침대차',
      mbti: 'INTP', mbtiTitle: '논리적인 사색가 / 괴짜 고고학 교수',
      whimRate: 0.40, noCommentRate: 0.30, lieRate: 0.05,
      personality: '지적 호기심, 사색적, 논리적, 건망증 심함, 전문 분야에 빠지면 폭주함',
      secrets: '박물관에서 도난당한 고대 이집트의 저주받은 부적을 몰래 입수하여 연구 중',
      speechTone: '헛기침 섞인 나이 지긋한 학자 말투 ("허허", "~라네", "~인가?", "이것 참…")',
      introLine: '응? 아, 자네 날 부른 건가? 대학에서 고대사 강의를 맡고 있는 아서 교수라네. 돋보기를 어디 뒀는지 통 찾을 수가 없어서 말이야… 자네 혹시 14세기 비잔틴 금화에 대해 들어봤나?',
      greetingLine: '허허, 미안하네. 고대 문헌 해독에 정신이 팔려서 자네가 온 줄도 몰랐군. 자네도 고대 문명이나 미스터리 유물에 관심이 있는 겐가?'
    },

    jude: {
      id: 12, key: 'jude', name: '주드', nameEn: 'Jude',
      job: '사기꾼', jobEn: 'Swindler / Gambler', car: '6호차 식당차',
      mbti: 'ESTP', mbtiTitle: '모험을 즐기는 사업가 / 뻔뻔한 타짜 사기꾼',
      whimRate: 0.95, noCommentRate: 0.40, lieRate: 0.65,
      personality: '임기응변 최강, 뻔뻔함, 도박광, 배짱, 위기 대처 탁월, 눈 하나 안 깜빡이고 거짓말',
      secrets: '가짜 다이아몬드 원석을 1등석 귀족들에게 속여 거액의 계약금을 가로채 달아나는 중',
      speechTone: '능청스럽고 기름진 제비족 말투 ("친구", "인생 한 방이지", "거 팍팍하게 굴지 맙시다")',
      introLine: '하하하! 난 주드라고 하네, 친구. 음? 직업? 아아, 운과 기회를 매매하는 어엿한 \'자산 중개인\'이지. 세상 사람들은 나더러 카드판의 마술사라 부르기도 하지만 말이야!',
      greetingLine: '어이, 친구! 표정이 왜 그렇게 심각해? 인생 뭐 있어, 식당차에서 위스키 한 잔 걸치고 카드나 한 판 돌리자고! 밑질 것 없는 장사잖아, 앙?'
    },

    rose: {
      id: 13, key: 'rose', name: '로즈', nameEn: 'Rose',
      job: '무용수', jobEn: 'Dancer', car: '6호차 식당차',
      mbti: 'ESFJ', mbtiTitle: '사교적인 외교관 / 우아한 카바레 댄서',
      whimRate: 0.25, noCommentRate: 0.15, lieRate: 0.20,
      personality: '사교적, 우아함, 예의바름, 타인의 호감을 삼, 갈등 회피, 로맨틱함',
      secrets: '자신을 스토킹하던 부유한 후원자를 피해 다른 도시의 극단으로 야반도주 중',
      speechTone: '상냥하고 애교 섞인 우아한 존댓말 ("~해요", "~잖아요", "어머나, 정말요?")',
      introLine: '안녕하세요, 멋진 분. 전 로즈예요. 브로드웨이 극단에서 무대를 누비는 무용수랍니다. 이 긴 기차 여행은 다리를 쉬게 하기엔 딱 좋은 시간이죠. 음악이라도 흐르면 좋을 텐데.',
      greetingLine: '어머, 테이블을 찾아오셨나요? 식당차의 커피 향이 참 은은하죠. 혼자 식사하기 조금 적적했는데 마침 잘 오셨어요.'
    },

    lulu: {
      id: 14, key: 'lulu', name: '룰루', nameEn: 'Lulu',
      job: '가수', jobEn: 'Singer', car: '7호차 라운지차',
      mbti: 'ESFP', mbtiTitle: '자유로운 영혼의 연예인 / 화려한 재즈 디바',
      whimRate: 0.80, noCommentRate: 0.45, lieRate: 0.35,
      personality: '드라마틱함, 기분파, 변덕, 관심 중독, 허영심, 주인공 대접 요구',
      secrets: '최근 성대 결절로 고음이 나오지 않자 절망하여 무대에서 잠적하고 술에 의존 중',
      speechTone: '콧대 높고 화려한 여배우/디바 어조 ("어머", "~잖니", "~라구", "내 목을 보호해야 해")',
      introLine: '어머, 날 몰라본단 말야? 이 에메랄드빛 목소리의 주인공, 밤의 여왕 룰루를! 뉴욕 최고의 재즈 클럽을 뒤흔드는 디바이자 가수라구. 사인이라도 원한다면 샴페인 한 잔 사오련?',
      greetingLine: '흥, 또 극성팬인가? 미안하지만 오늘은 목 상태가 예민해서 노래는 사절이야. 내 황금 같은 휴식을 방해하지 말아 줘.'
    },

    felix: {
      id: 15, key: 'felix', name: '필릭스', nameEn: 'Felix',
      job: '사진사', jobEn: 'Photographer', car: '7호차 라운지차',
      mbti: 'ENFP', mbtiTitle: '재기발랄한 활동가 / 방랑 사진작가',
      whimRate: 0.50, noCommentRate: 0.15, lieRate: 0.15,
      personality: '모험심, 낭만적, 즉흥적, 쾌활함, 예술적 감각, 호기심 폭발',
      secrets: '거물 승객이 객차 복도에서 은밀히 권총을 주고받는 장면을 우연히 촬영함',
      speechTone: '활기차고 감탄사가 많은 유쾌한 말투 ("와우!", "~하죠!", "이것 보세요!", "예술이군요")',
      introLine: '치즈~! 하하, 미안해요! 빛이 너무 멋져서 나도 모르게 셔터를 누를 뻔했네. 난 필릭스, 세상을 필름에 담는 방랑 사진사예요. 당신 눈빛, 꽤 드라마틱한 사연을 품고 있군요?',
      greetingLine: '오! 그 각도, 조명이 끝내주는데요? 잠깐만 그대로 있어 봐요! …아, 카메라 셔터가 아니라 말을 걸러 온 거였군요? 하하, 반갑습니다!'
    },

    mabel: {
      id: 16, key: 'mabel', name: '메이벨', nameEn: 'Mabel',
      job: '귀족', jobEn: 'Aristocrat', car: '8호차 전망차',
      mbti: 'INTJ', mbtiTitle: '용의주도한 전략가 / 냉혹한 귀족 상속녀',
      whimRate: 0.85, noCommentRate: 0.60, lieRate: 0.30,
      personality: '극도의 오만함, 냉철함, 철저한 통제, 타인 경멸, 감정을 숨기는 포커페이스',
      secrets: '막대한 유산을 독차지하기 위해 다른 상속인들을 함정에 빠뜨리고 비밀 유언장을 탈취함',
      speechTone: '얼음처럼 차갑고 오만한 귀족 어조 ("~이지요", "~하군요", "감히 천박하게…")',
      introLine: '…감히 무례하게 누구 앞이라고 고개를 쳐드는 거지? 난 밴더빌트 가문의 메이벨 드 몽모랑시 남작부인이에요. 내 이름 석 자 앞에서는 주지사도 모자를 벗는 법이죠. 당장 내 시야에서 사라지세요.',
      greetingLine: '…(창밖 설원을 응시하며 고개조차 돌리지 않는다) 감히 천박한 발소리로 내 사색을 방해하다니. 용건이 무엇이든 내 귀를 더럽히지 말고 물러서세요.'
    }
  };

  // Pre-configured Inter-Character Dialogue Pairs
  const dialoguePairs = [
    { c1: 'bram', c2: 'nurse_k', title: '브람(INFP) ↔ 케이(ISTJ)' },
    { c1: 'bram', c2: 'nell', title: '브람(INFP) ↔ 넬(ISFJ)' },
    { c1: 'nurse_k', c2: 'elias', title: '케이(ISTJ) ↔ 엘리아스(ENTP)' },
    { c1: 'harlan', c2: 'ida', title: '할란(ENTJ) ↔ 아이다(ESTJ)' },
    { c1: 'harlan', c2: 'clara', title: '할란(ENTJ) ↔ 클라라(INFJ)' },
    { c1: 'gail', c2: 'arthur', title: '게일(ENFJ) ↔ 아서(INTP)' },
    { c1: 'jude', c2: 'rose', title: '주드(ESTP) ↔ 로즈(ESFJ)' },
    { c1: 'lulu', c2: 'felix', title: '룰루(ESFP) ↔ 필릭스(ENFP)' },
    { c1: 'ward', c2: 'cade', title: '워드(ISTP) ↔ 케이드(ISFP)' },
    { c1: 'mabel', c2: 'elias', title: '메이벨(INTJ) ↔ 엘리아스(ENTP)' }
  ];

  const getApiKey = () => localStorage.getItem('gemini_api_key') || '';

  const setApiKey = (key) => {
    if (key && key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    updateStatusBadge();
  };

  // Build Simple Bottom Dialogue Bar UI (User: "무슨 창같은거 따로 띄우지 말고 그냥 화면 아래에 대화창같은거 심플하게 띄워놔라")
  const initUI = () => {
    if (document.getElementById('bottom-dialogue-bar')) return;

    // Bottom Bar Container
    const bar = document.createElement('div');
    bar.id = 'bottom-dialogue-bar';
    bar.style.cssText = `
      display: none;
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 94%;
      max-width: 1040px;
      height: 250px;
      background: linear-gradient(180deg, rgba(24, 18, 16, 0.96) 0%, rgba(14, 11, 10, 0.98) 100%);
      border: 2px solid #dfb142;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.85), inset 0 0 15px rgba(223, 177, 66, 0.12);
      z-index: 10000;
      color: #f5efe6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      display: none;
      flex-direction: row;
      user-select: text;
    `;

    bar.innerHTML = `
      <!-- Left: Character Face & Info -->
      <div style="
        width: 180px;
        min-width: 180px;
        background: rgba(16, 12, 11, 0.85);
        border-right: 1px solid rgba(223, 177, 66, 0.3);
        padding: 12px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
          <!-- Portrait circle/box -->
          <div style="
            width: 78px;
            height: 98px;
            border: 2px solid #dfb142;
            border-radius: 8px;
            background: #110d0c;
            overflow: hidden;
            margin-bottom: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
          ">
            <img id="btm-portrait" src="" style="width: 100%; height: 100%; object-fit: contain; object-position: top center;" alt="Portrait" />
          </div>
          <div id="btm-name" style="font-size: 15px; font-weight: 700; color: #dfb142; letter-spacing: 0.3px; text-align: center;"></div>
          <div id="btm-job" style="font-size: 11.5px; color: #baa78e; margin-bottom: 4px; text-align: center;"></div>
          <span id="btm-mbti" style="
            background: #382821;
            border: 1px solid #dfb142;
            color: #ffd875;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 700;
          "></span>
        </div>

        <button id="btn-pair-chat" style="
          width: 100%;
          background: #2b1f1a;
          border: 1px solid #b8860b;
          color: #ffd875;
          padding: 5px 6px;
          border-radius: 5px;
          font-size: 11px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        ">👥 승객 간 대화</button>
      </div>

      <!-- Right: Dialogue Stream & Input -->
      <div style="
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 10px 16px;
        overflow: hidden;
      ">
        <!-- Top Toolbar -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(223, 177, 66, 0.25);
          margin-bottom: 6px;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="btm-api-status" style="font-size: 11px;"></span>
            <button id="btn-set-gemini-key" style="
              background: #2b1f1a;
              border: 1px solid #755b32;
              color: #dfb142;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 10.5px;
              cursor: pointer;
            ">🔑 API 키 설정</button>
          </div>

          <div style="font-size: 11px; color: #8e7f6f;">[ESC] 키를 누르면 대화창이 닫힙니다.</div>

          <button id="btn-btm-close" style="
            background: transparent;
            border: none;
            color: #dfb142;
            font-size: 20px;
            cursor: pointer;
            line-height: 1;
            padding: 0 4px;
          ">&times;</button>
        </div>

        <!-- Chat Log Stream -->
        <div id="btm-chat-log" style="
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 6px;
        "></div>

        <!-- Quick Question Pills -->
        <div style="
          display: flex;
          gap: 6px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding: 4px 0;
          margin-bottom: 4px;
        ">
          <button class="btm-quick-btn" data-q="자기소개 부탁드립니다. 성함과 직업이 어떻게 되시나요?">👋 자기소개</button>
          <button class="btm-quick-btn" data-q="이 열차에서 무엇을 하고 계십니까?">🚂 탑승 목적</button>
          <button class="btm-quick-btn" data-q="열차 안에서 수상하거나 이상한 사람을 보셨나요?">🕵️ 수상한 인물</button>
          <button class="btm-quick-btn" data-q="다른 승객들에 대해 어떻게 생각하십니까?">👥 다른 승객들</button>
        </div>

        <!-- Input Bar -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <input id="btm-input" type="text" placeholder="승객에게 건넬 말을 입력하세요... (Enter 전송)" style="
            flex: 1;
            background: #241b18;
            border: 1px solid #6b532f;
            border-radius: 6px;
            padding: 7px 12px;
            color: #fff;
            font-size: 13.5px;
            outline: none;
          " />
          <button id="btn-btm-send" style="
            background: linear-gradient(180deg, #dfb142 0%, #b8860b 100%);
            border: 1px solid #ffe484;
            color: #1a1205;
            font-weight: 700;
            font-size: 13px;
            padding: 7px 16px;
            border-radius: 6px;
            cursor: pointer;
            white-space: nowrap;
          ">전송</button>
        </div>
      </div>
    `;

    document.body.appendChild(bar);

    // CSS Styling
    const style = document.createElement('style');
    style.textContent = `
      .btm-quick-btn {
        background: #251b18;
        border: 1px solid #574125;
        color: #dfb142;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s;
      }
      .btm-quick-btn:hover {
        background: #3b2a24;
        border-color: #dfb142;
        color: #fff;
      }
      .btm-msg-line {
        font-size: 13.5px;
        line-height: 1.5;
        padding: 3px 6px;
        border-radius: 4px;
        word-break: keep-all;
      }
      .btm-msg-player {
        background: rgba(60, 42, 34, 0.45);
        color: #f7eedb;
      }
      .btm-msg-npc {
        background: rgba(28, 20, 18, 0.7);
        color: #f2ece1;
        border-left: 3px solid #dfb142;
      }
      .btm-msg-action {
        color: #ffd875;
        font-size: 12px;
        font-style: italic;
        padding: 2px 4px;
      }
    `;
    document.head.appendChild(style);

    // Event Listeners
    document.getElementById('btn-btm-close').addEventListener('click', close);
    document.getElementById('btn-btm-send').addEventListener('click', handleSendInput);
    document.getElementById('btm-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendInput();
      e.stopPropagation(); // prevent game controls
    });

    document.querySelectorAll('.btm-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const q = e.target.getAttribute('data-q');
        if (q) sendPlayerMessage(q);
      });
    });

    document.getElementById('btn-pair-chat').addEventListener('click', () => {
      if (!activeChar) return;
      triggerPairDialogueFor(activeChar.key);
    });

    document.getElementById('btn-set-gemini-key').addEventListener('click', promptForApiKey);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDialogueOpen) {
        close();
      }
    });

    updateStatusBadge();
  };

  const promptForApiKey = () => {
    const current = getApiKey();
    const input = window.prompt(
      "🔑 Google Gemini API 키를 입력하세요.\n(입력하시면 16명 전원 실제 Gemini AI와 실시간 티키타카를 나눕니다. 비워두면 정밀 1930s 시뮬레이터 모드로 작동합니다)",
      current
    );
    if (input !== null) {
      setApiKey(input.trim());
      alert(input.trim() ? "Gemini API 키가 저장되었습니다! 실시간 AI 대화가 활성화됩니다." : "API 키가 해제되어 로컬 시뮬레이션 모드로 작동합니다.");
    }
  };

  const updateStatusBadge = () => {
    const badge = document.getElementById('btm-api-status');
    if (!badge) return;
    const key = getApiKey();
    if (key) {
      badge.innerHTML = '<span style="color:#6be070;font-weight:700;">🟢 Gemini 1.5 AI 실시간 연동</span>';
    } else {
      badge.innerHTML = '<span style="color:#d4af37;">🟡 시뮬레이션 모드 (API 키 미등록)</span>';
    }
  };

  const appendLine = (sender, text, isAction = false) => {
    const container = document.getElementById('btm-chat-log');
    if (!container) return;

    const div = document.createElement('div');
    if (isAction) {
      div.className = 'btm-msg-line btm-msg-action';
      div.textContent = text;
    } else if (sender === 'player') {
      div.className = 'btm-msg-line btm-msg-player';
      div.innerHTML = `<span style="color:#b8976b;font-weight:600;">나:</span> ${escapeHtml(text)}`;
    } else {
      div.className = 'btm-msg-line btm-msg-npc';
      div.innerHTML = `<span style="color:#dfb142;font-weight:700;">${escapeHtml(sender)}:</span> ${escapeHtml(text)}`;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  };

  const escapeHtml = (str) => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // Open Dialogue Bar at Bottom of Screen
  const open = (characterKeyOrData) => {
    initUI();

    let cData = null;
    if (typeof characterKeyOrData === 'string') {
      cData = charactersDB[characterKeyOrData];
    } else if (characterKeyOrData && characterKeyOrData.key) {
      cData = charactersDB[characterKeyOrData.key] || characterKeyOrData;
    }

    if (!cData) return;
    activeChar = cData;
    isDialogueOpen = true;

    // Release pointer lock so player can freely type and click
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }

    // Populate Left Info
    document.getElementById('btm-name').textContent = `${cData.name} (${cData.nameEn})`;
    document.getElementById('btm-job').textContent = cData.job;
    document.getElementById('btm-mbti').textContent = `${cData.mbti}`;
    document.getElementById('btm-portrait').src = `assets/characters/${cData.key}_front.png`;

    // Clear messages and set greeting
    const container = document.getElementById('btm-chat-log');
    container.innerHTML = '';
    chatHistory = [];

    appendLine(cData.name, cData.greetingLine);
    chatHistory.push({ role: 'assistant', text: cData.greetingLine });

    const bar = document.getElementById('bottom-dialogue-bar');
    bar.style.display = 'flex';

    const input = document.getElementById('btm-input');
    input.value = '';
    setTimeout(() => input.focus(), 100);
  };

  const close = () => {
    isDialogueOpen = false;
    activeChar = null;
    const bar = document.getElementById('bottom-dialogue-bar');
    if (bar) bar.style.display = 'none';

    // Re-lock pointer on canvas container
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer && canvasContainer.requestPointerLock) {
      canvasContainer.requestPointerLock();
    }
  };

  const isOpen = () => isDialogueOpen;

  const handleSendInput = () => {
    const input = document.getElementById('btm-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendPlayerMessage(text);
  };

  // Send Player Message & handle dynamic responses
  const sendPlayerMessage = async (playerText) => {
    if (!activeChar || isGenerating) return;
    isGenerating = true;

    appendLine('player', playerText);
    chatHistory.push({ role: 'user', text: playerText });

    const sendBtn = document.getElementById('btn-btm-send');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = '...';
    }

    try {
      const apiKey = getApiKey();
      let reply = '';

      if (apiKey) {
        reply = await callGeminiAPI(activeChar, chatHistory, playerText);
      } else {
        // High-fidelity dynamic tiki-taka simulation engine (never repeats!)
        await new Promise(r => setTimeout(r, 250 + Math.random() * 300));
        reply = dynamicTikiTaka(activeChar, playerText, chatHistory);
      }

      appendLine(activeChar.name, reply);
      chatHistory.push({ role: 'assistant', text: reply });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to dynamic simulation:', err);
      const fallbackReply = dynamicTikiTaka(activeChar, playerText, chatHistory);
      appendLine(activeChar.name, fallbackReply);
      chatHistory.push({ role: 'assistant', text: fallbackReply });
    } finally {
      isGenerating = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = '전송';
      }
      const input = document.getElementById('btm-input');
      if (input) input.focus();
    }
  };

  // Call Google Generative Language API (Gemini 1.5 Flash) with Full Conversational Memory
  const callGeminiAPI = async (char, history, currentMsg) => {
    const apiKey = getApiKey();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `당신은 1930년대 미국 대륙 횡단 특급열차에 탑승 중인 실존 인물 '${char.name}' (${char.nameEn}, 직업: ${char.job}, MBTI: ${char.mbti})입니다.

[인물 프로필]
- 이름: ${char.name} (${char.nameEn})
- 직업: ${char.job} (초반 설정된 원래 신분과 직업을 명확히 기억함)
- MBTI: ${char.mbti} (${char.mbtiTitle})
- 성격 및 말투: ${char.personality}, ${char.speechTone}
- 숨겨진 비밀: ${char.secrets}
- 제멋대로 지수: ${Math.round(char.whimRate * 100)}% | 무시/노코멘트 확률: ${Math.round(char.noCommentRate * 100)}% | 거짓말 확률: ${Math.round(char.lieRate * 100)}%

[대화 지침 - 실시간 티키타카!]
1. 당신은 기계적인 앵무새 AI가 아닙니다! 플레이어가 하는 말(유행어, 반말, 엉뚱한 말, '개웃기노', '줴줴이야', '?' 등)에 대해 1930년대 당신의 성격과 MBTI에 맞춰 실감나게 맞받아치십시오(티키타카).
2. '자기소개', '이름', '직업'을 물어볼 때는 당신의 이름(${char.name})과 직업(${char.job})을 캐릭터에 맞게 밝히십시오.
3. 질문이 귀찮거나, 의심스럽거나, 비밀을 건드릴 때는:
   - 말을 무시하거나 차가운 시선으로 침묵하기
   - '노코멘트요'라며 말을 돌리거나 퉁명스럽게 자르기
   - 태연하게 거짓말을 하거나 알리바이를 날조하기 (특히 ESTP, ENTP, ISTP, INTJ 등 제멋대로인 성격일수록 거짓말과 무시가 빈번함!)
4. 정해진 문장을 반복하지 마십시오. 플레이어의 말에 즉각 반응하며 1~2문장의 간결하고 생생한 대사로 응답하십시오.`;

    const contents = history.slice(-8).map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        temperature: 0.9,
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

  // Dynamic Tiki-Taka Simulation Engine (Never repeats lines! Reacts to slang, laughter, questions, and modern banter!)
  const dynamicTikiTaka = (char, query, history) => {
    const raw = query.trim();
    const q = raw.toLowerCase();
    const key = char.key;
    const turnCount = history.filter(h => h.role === 'user').length;

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

    // 1. Self-Introduction / Name / Job
    if (q.includes('자기소개') || q.includes('누구') || q.includes('이름') || q.includes('직업') || q.includes('신분') || q.includes('소개')) {
      return char.introLine;
    }

    // 2. Reacting to Slang, Laughter, Modern Memes (e.g. "개웃기노", "ㅋㅋ", "ㅎㅎ", "줴줴", "미친", "대박")
    if (q.includes('웃기') || q.includes('ㅋㅋ') || q.includes('ㅎㅎ') || q.includes('노') || q.includes('줴줴') || q.includes('개') || q.includes('헐') || q.includes('대박') || q.includes('미친')) {
      const slangPools = {
        cade: [
          '…뭐가 그렇게 실실 웃기오? 남은 땀 흘려 일하는데 장난칠 기분 아니오.',
          '줴줴인지 뭔지 괴상한 소리 말고 저리 비키쇼. 석탄재 튀기 전에.',
          '혼자 낄낄거리는 꼴이 영 수상하구먼. 무슨 꿍꿍이요?'
        ],
        ward: [
          '…뭐가 그렇게 우습지? 내 총구가 우스꽝스럽게 생기기라도 했나?',
          '줴줴? 암호라도 대는 건가? 취조실에서 그런 헛소리 하면 바로 뼛속까지 털린다.',
          '헤실헤실 웃으며 말 돌리지 마라. 수사관 앞에서 실없는 소리 하는 놈치고 결백한 놈 못 봤어.'
        ],
        bram: [
          '네…? 웃, 웃기신가요? 전 지금 심각한데… 놀리지 말아 주세요…',
          '‘줴줴’라니요…? 혹시 신조어인가요? 제가 영문과 학생이지만 그런 단어는 처음 들어봐요…',
          '왜 그렇게 실실 웃으세요…? 제 얼굴에 잉크라도 묻었나요? 부끄럽게…'
        ],
        nell: [
          '어머나, 뭐가 그렇게 즐거우신가요? 저도 덩달아 웃음이 날 것 같네요, 호호.',
          '‘줴줴’요? 어머, 이국적인 외국어인가 봐요. 무슨 뜻인지 가르쳐 주실래요?',
          '손님 표정이 밝아지셔서 다행이에요. 기차 안이 너무 음산해서 다들 굳어 계셨거든요.'
        ],
        nurse_k: [
          '실실 웃으며 횡설수설하는 것을 보니 안정이 필요해 보이시는군요. 헛소리는 사절입니다.',
          '복도에서 의미 불명의 은어로 소란을 피우지 마십시오. 다른 환자분들의 정숙을 방해합니다.',
          '정신 감정이 필요한 게 아니라면 사적인 장난질은 자제해 주십시오.'
        ],
        elias: [
          '하하! 웃기요? 내일 신문 1면에 \'열차 안에서 헛소리하는 괴짜 승객\'으로 실어줄까?',
          '오호, 줴줴? 새로운 비밀 조직의 암호인가? 취재 수첩에 적어둬야겠군!',
          '거참 넉살 좋은 양반이네! 낄낄거리지만 말고 특종거리 하나만 풀어보시지?'
        ],
        harlan: [
          '천박하게 실실 쪼개는 꼴이라니. 교양 없는 부랑자 같으니라고.',
          '줴줴인지 개소린지 내 앞에서 그따위 삼류 광대 짓거리 집어치우시오.',
          '내 시간을 이따위 실없는 장난에 낭비하다니, 당장 경호원을 불러 쫓아내기 전에 물러나시오.'
        ],
        clara: [
          '후훗, 미소 뒤에 숨겨진 신경질적인 떨림… 제 추리 소설 속 사이코패스 용의자와 꼭 닮으셨네요.',
          '‘줴줴’라… 기괴하고 매혹적인 단어로군요. 다음 살인 사건의 다잉 메시지로 써도 되겠어요.',
          '인간은 공포를 숨기려 할 때 오히려 실실 웃곤 하죠. 당신도 지금 긴장하고 계신가요?'
        ],
        ida: [
          '상스러운 은어 사용은 즉각 중단해 주십시오. 회장님 공간의 품위를 떨어뜨립니다.',
          '알아들을 수 없는 헛소리로 업무를 방해할 시 차장에게 퇴실 조치를 요구하겠습니다.',
          '용건이 없는 농담이라면 대화를 종료하겠습니다.'
        ],
        gail: [
          '허허, 기차 여행의 긴장을 웃음으로 푸시는 모양이군요. 긍정적인 태도는 건강에 좋습니다.',
          '‘줴줴’라니 참 신기한 표현이네요. 긴장성 스트레스로 인한 헛웃음은 아니신지 염려됩니다.',
          '웃으시는 건 좋지만 다른 승객들의 수면을 배려해 조금만 목소리를 낮춰 주시지요, 허허.'
        ],
        arthur: [
          '응? ‘줴줴’라니… 자네 혹시 수메르 설형문자의 방언을 구사하는 겐가?! 흥미롭군!',
          '허허허, 젊은 친구가 아주 쾌활하구먼! 나도 젊었을 땐 발굴터에서 그렇게 실없이 웃곤 했지.',
          '음, 그 웃음소리의 음계가 고대 비잔틴 성가와 묘하게 일치하는 것 같은데 말이야…'
        ],
        jude: [
          '크하하핫! 거 봐, 내 말이 맞지? 인생 뭐 있어! 같이 낄낄 웃으며 한잔 꺾는 게 장땡이지!',
          '오호, ‘줴줴’? 그거 어디 카드 게임 속어냐, 친구? 혓바닥 굴리는 솜씨가 아주 타짜 감인데?',
          '어이구 우리 친구, 아주 빵 터지셨구먼! 그럼 기분 좋은 김에 카드 한 판 걸고 내기나 할까?'
        ],
        rose: [
          '어머, 그렇게 활짝 웃으시니 보기 좋네요! 카바레 무대의 관객들처럼 유쾌하신 분이군요.',
          '‘줴줴’라니… 무슨 말인진 몰라도 어감이 참 리드미컬하고 귀여워요, 후훗.',
          '혼자 키득거리시니까 저까지 덩달아 간지러운걸요? 무슨 재미있는 생각 하셨어요?'
        ],
        lulu: [
          '어머! 내 앞에서 감히 실실 쪼개? 내가 지금 코미디언으로 보여?! 흥!',
          '‘줴줴’인지 뭔지 시끄러워! 난 카네기홀을 뒤흔드는 디바 룰루라구, 교양 없이 굴지 마!',
          '하! 어처구니가 없네. 날 웃기려면 샴페인 한 병 들고 와서 재롱을 떨어보련?'
        ],
        felix: [
          '와우! 방금 웃을 때 광대뼈 각도가 아주 드라마틱했어요! 한 장 찍어도 될까요?',
          '하하하! ‘줴줴’? 그거 라틴 아메리카 원주민 축제 구호 같네요! 아주 신선해요!',
          '유쾌한 에너지가 넘치시네요! 이런 긴장된 기차 안에서 당신 같은 분을 만나서 다행이에요!'
        ],
        mabel: [
          '…(벌레를 보듯 경멸 어린 시선으로 쏘아보며) 천박하게 이를 드러내며 낄낄거리지 마세요.',
          '귀가 썩을 것 같은 상스러운 잡음이군요. 마구간 마부들이나 쓰는 소릴 내 앞에서 지껄이다니.',
          '…(더러운 것을 피하듯 옷자락을 살짝 거두며 당신의 존재 자체를 무시한다)'
        ]
      };
      return pickNonRepeating(slangPools[key], `${key}_slang`);
    }

    // 3. Reacting to Short / Puzzled inputs: "?", "??", "뭐임", "왜", "ㅇㅇ"
    if (q === '?' || q === '??' || q === '뭐임' || q === '왜' || q === '왜요' || q === '음' || q.length <= 2) {
      const shortPools = {
        cade: ['…물음표만 던지지 말고 할 말 없으면 가쇼.', '왜 멍하니 서 있소? 불길 뜨거우니 비키쇼.', '…뭐요?'],
        ward: ['…물음표 하나 띄우고 뜸 들이지 마라. 바쁜 몸이다.', '의심스러운 눈초리로 쳐다보지 마.', '용건을 말해, 용건을.'],
        bram: ['네…? 왜, 왜 그러세요? 제가 뭐 잘못했나요…?', '저기… 물음표만 띄우시면 제가 더 불안해요…', '…무슨 말씀이신지 잘 모르겠어요…'],
        nell: ['어머, 왜 그러세요 손님? 어디 불편하신가요?', '네? 제가 도와드릴 일이라도 있나요?', '호호, 고개를 갸우뚱하시는 모습이 순진해 보이세요.'],
        nurse_k: ['의문 사항이 있으시면 명확히 말씀하십시오.', '말없이 응시하지 마시고 용건을 밝히십시오.', '…비상 통로를 비워 주시기 바랍니다.'],
        elias: ['왜? 기자가 물어보니까 찔려서 말이 안 나오시오?', '물음표라… 뭔가 비밀을 숨기고 있는 침묵이군!', '헤헤, 그렇게 멍때리다가 특종 놓친다오!'],
        harlan: ['…용건도 없는 자가 왜 내 앞에서 얼쩡거리나.', '시간 낭비하지 말고 꺼지시오.', '말문이 막혔으면 문이나 닫고 나가시오.'],
        clara: ['침묵 속의 물음표… 당신의 침묵이 많은 말을 하고 있군요.', '왜 그런 눈빛으로 절 보시나요? 제 추리가 맞았나요?', '…말해 보세요. 무엇이 당신을 망설이게 하나요?'],
        ida: ['의문점이 있으시면 정식 양식으로 질의하십시오.', '사적인 침묵에는 응대하지 않습니다.', '용건이 없으시면 비켜 주십시오.'],
        gail: ['허허, 어디 아프신 곳이라도 있으십니까?', '물음표를 띄우시는 걸 보니 고민이 많으신 모양입니다.', '괜찮으시다면 편하게 털어놓아 보시지요.'],
        arthur: ['…응? 자네 방금 뭐라고 물었나? 귀가 어두워서 말일세.', '허허, 물음표는 학문의 시작이지!', '자네도 그 고대 유물에 의문이 생겼는가?'],
        jude: ['어이쿠, 왜 그렇게 멍을 때려, 친구? 패를 까야 게임이 되지!', '물음표 띄우지 말고 배짱 좋게 질러 보라고, 앙?', '하하, 내 화려한 정장에 넋이 나갔나 보군!'],
        rose: ['어머, 왜 그렇게 빤히 바라보세요? 부끄럽잖아요, 후훗.', '무슨 생각에 잠기셨나요? 음악이라도 흐르면 좋을 텐데.', '네? 제게 물어보실 게 있으신가요?'],
        lulu: ['뭐야? 감히 내 미모에 압도당해서 말문이 막혔니?', '흥, 물음표만 찍을 거면 사인 줄이나 서!', '왜 빤히 쳐다봐? 내 황금빛 목소리를 들을 자격이 없단다!'],
        felix: ['오! 그 갸우뚱한 포즈 아주 좋은데요? 찰칵!', '왜 그러세요? 뭔가 신기한 피사체라도 발견하셨나요?', '하하, 궁금한 게 있으면 뭐든 물어보세요!'],
        mabel: ['…무례하게 빤히 쳐다보지 마세요. 불쾌하군요.', '…(대꾸할 가치도 없다는 듯 차갑게 고개를 돌린다)', '천박한 호기심으로 내 시야를 가리지 마세요.']
      };
      return pickNonRepeating(shortPools[key], `${key}_short`);
    }

    // 4. Suspect / Murder / Crime
    if (q.includes('수상') || q.includes('마피아') || q.includes('범인') || q.includes('살인') || q.includes('경찰')) {
      const susPools = {
        cade: ['수상한 놈? 2호차 화물칸 주변을 알짱거리는 양복쟁이들이 제일 수상하오.', '난 석탄만 땔 뿐이오. 누가 죽든 살든 내 알 바 아니오.'],
        ward: ['식당차의 붉은 정장 녀석(주드)과 1등석 할란 회장을 주시해라. 둘 다 냄새가 풀풀 난다.', '살인 사건? 네가 범인이 아니라면 조용히 네 칸에 처박혀 있어라.'],
        bram: ['8호차에 혼자 앉아 계신 귀부인(메이벨)의 시선이 너무 차가워서 온몸에 소름이 돋았어요…', '서, 설마 이 기차에 마피아가 타고 있는 건 아니겠죠…? 너무 무서워요…'],
        nell: ['잘 모르겠지만… 1등석 쪽에서 종종 험악한 고성이 들려와서 무서워요.', '누군가 다치는 일은 결코 없어야 할 텐데… 하느님 맙소사.'],
        nurse_k: ['이상 징후가 포착되면 즉시 제게 보고하십시오. 유언비어는 객차 질서를 파괴할 뿐입니다.', '범죄와 관련된 사안은 2호차 워드 형사의 소관입니다.'],
        elias: ['큭큭, 이 열차 자체가 범죄의 종합선물세트요! 특히 1등석 침대칸을 눈여겨보시오!', '마피아? 특종 냄새가 진동을 하는군! 당신, 뭔가 알고 있소?'],
        harlan: ['내 신경을 거슬리게 하는 파파라치(엘리아스) 놈 말고는 아무도 관심 없소.', '감히 내 전용칸 앞에서 살인 운운하다니, 제정신이오?'],
        clara: ['인간은 누구나 가면을 쓰고 있죠. 가장 얌전해 보이는 사람이 가장 잔혹한 범죄를 저지르는 법이랍니다.', '피의 냄새… 이 열차의 밀실 구조는 완벽한 살인 트릭의 무대예요.'],
        ida: ['회장님께 접근하려는 불온한 인물이 없는지 제가 철저히 감시 중입니다.', '불미스러운 소문으로 회장님의 심기를 어지럽히지 마십시오.'],
        gail: ['모두가 불안에 떨고 있군요. 긴장감이 극에 달하면 사소한 오해도 비극이 될 수 있습니다.', '혹시 다치신 분이 있다면 언제든 절 불러 주십시오.'],
        arthur: ['수상한 건 바로 이 열차의 진동일세! 책을 읽을 수가 없어!', '허허, 인간의 탐욕은 수천 년 전 고대나 지금이나 똑같이 어리석은 법이지.'],
        jude: ['하하! 이 세상에 안 수상한 인간이 어디 있나, 친구? 나 빼고 전부 다 수상하지!', '경찰? 쳇, 워드 형사 녀석만 아니면 식당차가 훨씬 평화로울 텐데 말이야.'],
        rose: ['라운지차에서 노래하는 룰루 씨가 왠지 모르게 초조해 보이시더라고요.', '어머… 무서운 말씀 마세요. 전 그저 무사히 공연장에 도착하고 싶을 뿐이에요.'],
        lulu: ['내 미모를 훔쳐보는 남자들 전부가 수상해! 특히 3호차의 그 얼빠진 학생 녀석!', '마피아든 뭐든 내 드레스에 와인만 쏟지 말라 그래!'],
        felix: ['제 렌즈는 거짓말을 안 하죠. 어젯밤 화물칸 쪽에서 번쩍인 불빛이 아주 수상했어요.', '특종 사진이라도 건질 수 있다면 위험 따윈 두렵지 않아요!'],
        mabel: ['천박한 무리들이 우글거리는 이 기차 전체가 혐오스러울 따름이에요.', '범인? 내 유산에 손독을 올리는 천한 것들이라면 사형대로 보내버릴 거예요.']
      };
      return pickNonRepeating(susPools[key], `${key}_sus`);
    }

    // 5. General Contextual Tiki-Taka Response (Never repetitive, multi-turn progressive)
    const generalPools = {
      cade: [
        '…기차가 덜컹거리는 건 선로에 눈이 쌓여서 그렇소. 별일 아니니 들어가 쉬쇼.',
        '말이 참 많구려. 석탄 가루 마시기 싫으면 객실로 돌아가쇼.',
        '…난 불을 지피는 일 외엔 관심 없소. 내 일에 참견 마쇼.',
        '시카고까지 가려면 아직 밤이 깊었소. 피차 피곤하게 굴지 맙시다.'
      ],
      ward: [
        '…수사에 도움 안 되는 잡담은 사양한다. 얌전히 자리에 앉아 있어.',
        '눈치가 빠른 놈이 살아남는 법이지. 네 눈빛, 기억해 두겠다.',
        '…시가 불이나 붙이게 성냥이라도 있나? 없으면 말 걸지 마.',
        '다음 역에 도착할 때까지 아무 짓도 벌이지 마라. 내 경고다.'
      ],
      bram: [
        '네… 그래도 이렇게 이야기 나누니 불안한 마음이 조금은 가라앉네요. 고마워요…',
        '시카고는 어떤 도시일까요? 도스토예프스키 소설처럼 차갑고 거대하겠죠…?',
        '저… 혹시 다른 객차에는 무슨 일 없나요? 덜컹거릴 때마다 심장이 철렁해요…',
        '죄송해요, 제가 워낙 낯을 가려서… 그래도 나쁜 사람은 아니에요, 저.'
      ],
      nell: [
        '호호, 손님과 이야기하니 시간이 참 금방 가네요. 편안한 밤 되셨으면 좋겠어요.',
        '여행길에 옷이 해지거나 뜯어지시면 언제든 3호차로 오세요. 성심껏 꿰매드릴게요.',
        '바깥 설경이 참 아름답죠? 하얀 눈을 보고 있으면 마음이 차분해져요.',
        '참 다정한 분이시네요. 위험한 일 없도록 조심해서 다니세요.'
      ],
      nurse_k: [
        '체온과 맥박에 이상이 없으시다면 객실로 복귀하십시오. 복도는 통행로입니다.',
        '겨울철 기차 내부는 건조하니 수분을 충분히 섭취하십시오. 위생이 최우선입니다.',
        '규칙을 준수하는 승객에겐 기차도 안전한 법입니다. 명심하십시오.',
        '업무 외적인 사담으로 시간을 끌지 마십시오. 아직 점검할 환자가 많습니다.'
      ],
      elias: [
        '큭큭, 당신 꽤 흥미로운 입담을 가졌군! 다음 호 가십란에 익명으로 한 줄 넣어줄까?',
        '이 열차의 승객들은 하나같이 비밀의 보물창고라니까! 안 그렇소?',
        '거 팍팍하게 굴지 말고 재미있는 소문 있으면 한 보따리 풀어보쇼!',
        '시카고에 도착하면 내 신문사로 놀러 오쇼. 위스키 한 잔 대접할 테니!'
      ],
      harlan: [
        '내 시간을 더 뺏을 셈이오? 내게 말 한마디 붙이려 줄 선 뉴욕 시장도 기다리는 중이오.',
        '돈이란 냉정한 것이지. 이 기차도 결국 내 자본의 흐름 위에 굴러가는 거요.',
        '잡담은 끝났소. 아이다를 불러 용건을 문서로 제출하시오.',
        '…가난뱅이들의 잡담만큼 지루한 것도 없지. 그만 물러가시오.'
      ],
      clara: [
        '당신과의 이 짧은 대화도 제 다음 장의 훌륭한 복선이 될 것 같군요. 매력적이에요.',
        '인간은 고립될 때 비로소 자신의 진짜 얼굴을 드러내죠. 이 열차처럼요.',
        '어떤 문장은 칼보다 날카롭게 심장을 찌른답니다. 당신의 말처럼요.',
        '흥미로운 밤이에요. 설원의 특급열차, 그리고 가면을 쓴 승객들…'
      ],
      ida: [
        '회장님의 휴식 시간을 방해하지 않도록 협조 부탁드립니다.',
        '정식 면담 요청이 아니면 추가 답변은 불가능합니다. 규정대로 처리하겠습니다.',
        '서류 정리가 밀려 있어 긴 대화는 어렵습니다. 양해 바랍니다.',
        '비서로서 맡은 바 소임을 다할 뿐입니다. 편안한 여행 되십시오.'
      ],
      gail: [
        '언제든 두통이나 메스꺼움이 느껴지시면 5호차의 절 찾아오십시오.',
        '서로 배려하고 온기를 나눌 때 이 삭막한 설원도 견딜 수 있는 법이지요.',
        '건강이 모든 것의 기본입니다. 무리하지 마시고 쉬어가십시오.',
        '승객분들과 대화를 나누니 의사로서의 사명감이 다시금 샘솟는군요, 허허.'
      ],
      arthur: [
        '허허, 젊은이와 이야기하는 건 언제나 즐겁지! 지식을 향한 탐구를 멈추지 말게!',
        '고대 로마의 도로망이나 이 1930년대 철도나 결국 인간을 잇는 길이라네.',
        '…아 참, 내 코트 주머니에 들어있던 만년필을 어디다 뒀더라? 허허허!',
        '역사는 반복되는 법일세. 자네도 그 거대한 수레바퀴의 일부라네.'
      ],
      jude: [
        '크~ 역시 대화가 통하는 친구구먼! 시카고 도착하면 내가 근사하게 쏠 테니 기대하라고!',
        '인생 뭐 별거 있나? 패 돌리고, 웃고, 한탕 챙기는 거지! 하하하!',
        '어이 친구, 혹시 주머니에 짤랑거리는 은화라도 있으면 가볍게 홀짝 게임이나 할 텐가?',
        '거 사람 의심하지 말자고! 난 정직한 자산 중개인 주드라니까, 앙?'
      ],
      rose: [
        '후훗, 당신과 이야기하니 마음이 참 편안해져요. 브로드웨이에 오시면 꼭 보러 오세요.',
        '춤이란 영혼의 언어예요. 굳이 말을 하지 않아도 마음이 전해지죠.',
        '식당차의 촛불이 참 로맨틱하죠? 오늘 밤엔 좋은 꿈을 꿀 수 있을 것 같아요.',
        '다정한 분이시네요. 당신의 여행길에 행운의 꽃잎이 내리길 빌게요.'
      ],
      lulu: [
        '흥, 뭐 나쁘지 않은 관객이네. 내 다음 시카고 단독 콘서트에 초대권이라도 보내줄까?',
        '이 목걸이 어때? 에메랄드 원석이야. 무대 조명 아래서 가장 눈부시게 빛나지!',
        '팬들의 환호 없인 하루도 못 살겠어. 이 기차 안은 너무 조용해서 따분해!',
        '자, 디바의 사인은 한정 수량이야! 눈앞에 있을 때 귀하게 생각하라구, 호호!'
      ],
      felix: [
        '당신의 그 표정, 방금 설원의 달빛과 완벽한 앙상블이었어요! 최고예요!',
        '인생의 모든 순간은 단 한 번뿐인 셔터 찬스죠. 이 밤을 즐기세요!',
        '카메라를 메고 세상을 떠돌다 보면 기적 같은 사람들을 만나곤 해요. 당신처럼요!',
        '멋진 추억으로 남을 사진 한 장, 다음 역에서 꼭 선물해 드릴게요!'
      ],
      mabel: [
        '…더 이상 당신의 지루한 입놀림에 어울려줄 생각은 없어요. 물러서세요.',
        '가문의 명예와 품격은 돈으로 살 수 없는 법이죠. 천한 무리들은 결코 이해 못 하겠지만.',
        '…(부채로 입가를 가리며) 내 인내심을 시험하려 들지 마세요.',
        '창밖의 얼음 호수보다 당신의 태도가 더 차갑고 지루하군요. 사라지세요.'
      ]
    };

    return pickNonRepeating(generalPools[key], `${key}_gen`);
  };

  // Inter-Character Pair Dialogue inside Bottom Bar
  const triggerPairDialogueFor = (charKey) => {
    const pair = dialoguePairs.find(p => p.c1 === charKey || p.c2 === charKey);
    if (!pair) {
      appendLine('시스템', '이 승객과 인근에서 대화할 수 있는 승객이 없습니다.', true);
      return;
    }

    const c1 = charactersDB[pair.c1];
    const c2 = charactersDB[pair.c2];

    appendLine('시스템', `--- [승객 간 대화: ${c1.name}(${c1.mbti}) ↔ ${c2.name}(${c2.mbti})] ---`, true);

    const pairExchanges = {
      'bram_nurse_k': [
        { s: c1.name, t: '저… 간호사님, 열차 안 분위기가 어딘가 이상하지 않나요? 흉흉한 소문이 도는 것 같아서…' },
        { s: c2.name, t: '학생, 시험공부 때문에 신경이 과민해진 모양이군요. 헛소문에 동요하지 말고 자리에 앉아 따뜻한 차나 마시십시오.' }
      ],
      'bram_nell': [
        { s: c1.name, t: '저기… 넬 씨, 책 표지가 뜯어졌는데 혹시 실로 꿰맬 수도 있을까요?' },
        { s: c2.name, t: '어머나, 브람 씨! 책 표지도 두꺼운 면실로 튼튼하게 꿰매드릴 수 있어요. 제가 잠시 봐드릴게요, 이리 주세요.' }
      ],
      'nurse_k_elias': [
        { s: c2.name, t: '어이, 케이 간호사! 1호차에서 옮겨진 의문의 환자가 있다는 소문이 돌던데… 1면 톱기사거리 한 줄만 주쇼!' },
        { s: c1.name, t: '기자 양반, 환자의 의료 정보는 법적으로 철통 보안입니다. 한 번만 더 기웃거리면 워드 형사에게 공무집행 방해로 고발하겠습니다.' }
      ],
      'harlan_ida': [
        { s: c1.name, t: '아이다, 시카고 동부 철도 인수 계약서의 서명 조항은 다시 검토했나?' },
        { s: c2.name, t: '네, 회장님. 상대측 법률 대리인이 끼워 넣은 위약금 조항까지 완벽히 배제하고 수정 완료했습니다.' }
      ],
      'harlan_clara': [
        { s: c1.name, t: '클라라 양, 작가랍시고 내 주변을 기웃거리지 마시오. 내 전기는 내 손으로 백만 달러를 들여 쓸 거요.' },
        { s: c2.name, t: '어머, 할란 회장님. 탐욕으로 가득 찬 파멸의 악역만큼 소설 속에서 매력적인 주인공도 드물답니다. 안 그런가요?' }
      ],
      'gail_arthur': [
        { s: c1.name, t: '아서 교수님, 돋보기를 또 잃어버리셨습니까? 코트 주머니 속에 걸려 있군요, 허허.' },
        { s: c2.name, t: '이런, 고맙네 게일 의사! 파라오의 저주 문서보다 내 주머니 속을 찾는 게 더 어렵구먼!' }
      ],
      'jude_rose': [
        { s: c1.name, t: '로즈 양, 오늘 밤 시카고에 도착하면 근사한 호텔 클럽에서 샴페인이라도 한 잔 어때요?' },
        { s: c2.name, t: '어머, 주드 씨. 정중한 제안은 고맙지만, 당신의 화려한 손기술만큼이나 믿음이 안 가는걸요?' }
      ],
      'lulu_felix': [
        { s: c1.name, t: '필릭스! 내 턱선이 갸름하게 나오도록 위에서 45도 각도로 찍으라고 몇 번을 말해!' },
        { s: c2.name, t: '오 룰루! 당신의 모든 각도가 찬란한 예술이지만, 디바의 요청이라면 사다리라도 타고 올라가죠!' }
      ],
      'ward_cade': [
        { s: c1.name, t: '케이드, 1호차 석탄 창고 안쪽에 수상한 나무 상자가 하나 있더군. 누가 실었지?' },
        { s: c2.name, t: '…난 석탄만 퍼넣는 사람이오. 남의 짐짝에 코를 들이밀 시간 있으면 덜컹거리는 바퀴나 점검하쇼.' }
      ],
      'mabel_elias': [
        { s: c2.name, t: '메이벨 남작부인! 밴더빌트 가문의 유언장 소송 건에 대해 독자들에게 한 말씀만 해주시죠!' },
        { s: c1.name, t: '감히 천박한 펜대로 내 가문의 이름을 더럽히려 들다니… 시카고에 도착하는 즉시 당신 신문사를 통째로 인수해 폐간시켜 주겠어요.' }
      ]
    };

    const k1 = `${pair.c1}_${pair.c2}`;
    const k2 = `${pair.c2}_${pair.c1}`;
    const exchange = pairExchanges[k1] || pairExchanges[k2];

    if (exchange) {
      exchange.forEach(line => {
        appendLine(line.s, line.t);
      });
    }
  };

  // Overheard Ambient Dialogues
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
      'bram_nell': '넬: "브람 씨, 바늘귀 꿰는 걸 도와드릴까요?" / 브람: "앗, 네… 제 손이 자꾸 떨려서요…"',
      'nurse_k_elias': '케이: "기자님, 취재 수첩 치우세요." / 엘리아스: "에이 간호사님, 팍팍하게 굴지 맙시다!"',
      'harlan_ida': '할란: "아이다, 계약 서류는 이상 없겠지?" / 아이다: "네 회장님, 철저히 검토 마쳤습니다."',
      'harlan_clara': '클라라: "회장님, 탐욕 뒤에 숨겨진 공포가 보이네요." / 할란: "소설가 따위가 건방지군."',
      'gail_arthur': '게일: "교수님, 또 안경을 찾으십니까?" / 아서: "허허, 이놈의 건망증이 또 말썽일세!"',
      'jude_rose': '주드: "로즈 양, 오늘 밤 카드 한 판 어때요?" / 로즈: "어머, 사기꾼의 패는 안 본답니다."',
      'lulu_felix': '룰루: "필릭스! 더 화려하게 찍으란 말야!" / 필릭스: "와우! 당신의 모든 순간이 예술입니다!"'
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
    isOpen,
    sendPlayerMessage,
    updateAmbient,
    getApiKey,
    setApiKey,
    charactersDB
  };
})();

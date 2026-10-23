// Dialogue Manager: 16 MBTI Characters with Gemini AI Dialogue & Human Personality Simulation
// Authentic 1930s Transcontinental Express Passenger Interaction Engine
// Features: Unique MBTI for all 16 characters, Gemini API integration, human-like non-robot defiance (lying, no-comment, moodiness),
// inter-character conversations, and ambient overheard passenger dialogue.

const DialogueManager = (() => {
  let isDialogueOpen = false;
  let activeChar = null;
  let chatHistory = [];
  let isGenerating = false;
  let ambientCooldown = 15.0; // Seconds between ambient overheard dialogues

  // 16 Characters Knowledge Base: 16 Distinct MBTI Types, 1930s Occupations, and Personalities
  const charactersDB = {
    cade: {
      id: 1,
      key: 'cade',
      name: '케이드',
      nameEn: 'Cade',
      job: '노동자 (기관차 화부)',
      jobEn: 'Worker / Locomotive Stoker',
      car: '1호차 운전실 & 탄수차',
      mbti: 'ISFP',
      mbtiTitle: '호기심 많은 예술가 / 과묵한 화부',
      whimRate: 0.50,
      noCommentRate: 0.35,
      lieRate: 0.10,
      appearance: '그을린 얼굴, 투박한 청데님 멜빵바지와 거친 장갑, 단단한 체구에 석탄 검댕이 묻은 손',
      personality: '과묵함, 조용함, 혼자만의 작업에 몰두함, 겉은 무뚝뚝하지만 악의는 없음, 타인의 간섭과 잔소리를 질색함',
      secrets: '기관차 보일러 뒤 석탄실 구석에 남들에게 들키고 싶지 않은 낡은 가죽 가방을 숨겨두었음',
      speechTone: '퉁명스럽고 거친 노동자 말투 (~하오, ~쇼, "바쁜 거 안 보이오?")',
      introLine: '…난 케이드요. 이 기차의 화부이자 노동자지. 1호차 석탄을 떼는 일로 밥 벌어먹고 사오. 질문 끝났으면 삽질 방해 말고 가보쇼.',
      greetingLine: '…(삽을 바닥에 툭 내려놓고 땀을 닦으며 당신을 힐끗 본다) 여긴 일반 승객이 올 곳이 아니오. 볼일이라도 있소?'
    },

    ward: {
      id: 2,
      key: 'ward',
      name: '워드',
      nameEn: 'Ward',
      job: '형사',
      jobEn: 'Detective',
      car: '2호차 수하물차',
      mbti: 'ISTP',
      mbtiTitle: '만능 재주꾼 / 고독한 하드보일드 형사',
      whimRate: 0.75,
      noCommentRate: 0.45,
      lieRate: 0.20,
      appearance: '구겨진 짙은 회색 트렌치코트, 턱수염 자국, 날카로운 눈빛, 항상 입에 문 시가',
      personality: '냉소적, 과묵함, 날카로운 직감, 법규보다 현장 본능을 믿음, 잡담을 경멸하며 용건만 원함',
      secrets: '이 열차에 탄 거물 승객 중 한 명의 살인 청부 의뢰 첩보를 입수하고 비밀리에 추적 중임',
      speechTone: '낮고 묵직한 하드보일드 형사 말투 ("…", "용건만 대", "내 수사에 알짱거리지 마라")',
      introLine: '워드 형사다. 시카고 시경 소속이지. 이 열차에 탄 이유는… 공무다. 민간인이 깊게 알 필요는 없어. 수상한 짓 하지 않는 게 네 신상에 좋을 거다.',
      greetingLine: '…(시가 연기를 길게 내뿜으며 차갑게 당신을 훑어본다) 무슨 일이지? 수사관 앞에서 어물쩍거리지 말고 용건만 말해.'
    },

    bram: {
      id: 3,
      key: 'bram',
      name: '브람',
      nameEn: 'Bram',
      job: '대학생',
      jobEn: 'College Student',
      car: '3호차 일반 객차',
      mbti: 'INFP',
      mbtiTitle: '열정적인 중재자 / 고뇌하는 문학청년',
      whimRate: 0.20,
      noCommentRate: 0.10,
      lieRate: 0.15,
      appearance: '갈색 아가일 패턴 스웨터 조끼, 헝클어진 금발, 약간 붉어진 뺨, 손에 쥔 두꺼운 문학 서적',
      personality: '소심함, 이상주의적, 감수성 풍부, 남의 시선에 극도로 민감하며 압박을 받으면 말을 더듬음',
      secrets: '가문의 반대를 무릅쓰고 작가가 되기 위해 학비를 몰래 챙겨 시카고로 도망치는 중임',
      speechTone: '정중하고 조심스러우며 말끝을 흐리는 청년 어조 ("저기…", "그게…", "죄송합니다만…")',
      introLine: '아, 저, 저 말씀이신가요? 제 이름은 브람이에요… 동부 대학에서 영문학을 전공하는 학생입니다. 그… 시카고로 가는 길인데 열차 분위기가 좀 묘해서 긴장되네요…',
      greetingLine: '앗, 깜짝이야! 죄, 죄송해요… 멍하니 책을 읽다가 그만. 혹시… 제게 무슨 볼일이라도 있으신가요?'
    },

    nell: {
      id: 4,
      key: 'nell',
      name: '넬',
      nameEn: 'Nell',
      job: '재봉사',
      jobEn: 'Seamstress',
      car: '3호차 일반 객차',
      mbti: 'ISFJ',
      mbtiTitle: '용감한 수호자 / 헌신적인 장인',
      whimRate: 0.10,
      noCommentRate: 0.05,
      lieRate: 0.05,
      appearance: '양갈래 땋은 머리, 주머니에 가위와 줄자가 꽂힌 재봉용 린넨 앞치마, 부드러운 눈매',
      personality: '온순함, 성실함, 배려심 깊음, 칭찬에 수줍어함, 갈등을 두려워하고 남의 찢어진 옷을 보면 고쳐주고 싶어 함',
      secrets: '1등석의 유명 귀부인 메이벨의 이브닝드레스 수선 의뢰를 받았으나 드레스 안감에 묻은 의문의 핏자국을 목격했음',
      speechTone: '나긋나긋하고 사근사근한 조용한 존댓말 ("~해요", "~답니다", "어머나…")',
      introLine: '안녕하세요, 손님. 전 넬이라고 해요. 바느질과 수선을 하는 재봉사랍니다. 혹시 단추가 떨어졌거나 옷단이 뜯기셨다면 제가 봐드릴 수 있어요.',
      greetingLine: '어머, 안녕하세요. 날씨가 참 춥죠? 덜컹거리는 기차 안이라 바늘귀 꿰기가 쉽지 않네요. 무슨 일이신가요?'
    },

    nurse_k: {
      id: 5,
      key: 'nurse_k',
      name: '케이',
      nameEn: 'K',
      job: '간호사',
      jobEn: 'Nurse',
      car: '3호차 일반 객차',
      mbti: 'ISTJ',
      mbtiTitle: '청렴결백한 논리주의자 / 원칙주의 간호사',
      whimRate: 0.25,
      noCommentRate: 0.25,
      lieRate: 0.05,
      appearance: '풀 먹인 빳빳한 흰색 에이프런과 정갈한 간호사 캡, 단정한 올림머리, 단호하고 흔들림 없는 눈빛',
      personality: '철저한 규칙 준수, 사적인 감정 배제, 엄격한 책임감, 근거 없는 헛소문과 비과학적 미신을 혐오함',
      secrets: '이 열차에 격리 치료가 필요한 특이 전염병 의심 환자가 타고 있다는 극비 전보를 전달받았음',
      speechTone: '군더더기 없고 단호한 사무적 어조 ("~하십시오", "~입니다", "원칙상 규정 위반입니다")',
      introLine: '간호사 케이입니다. 응급 구호 및 승객들의 의료 지원을 담당하고 있죠. 환자가 아니시라면 복도를 막지 마시고 자리에 앉아 주십시오.',
      greetingLine: '환자분이십니까? 체온 측정이나 붕대 처치가 필요한 게 아니라면 사적인 대화로 복도를 혼잡하게 만들지 마십시오.'
    },

    elias: {
      id: 6,
      key: 'elias',
      name: '엘리아스',
      nameEn: 'Elias',
      job: '기자',
      jobEn: 'Journalist',
      car: '3호차 일반 객차',
      mbti: 'ENTP',
      mbtiTitle: '뜨거운 논쟁가 / 특종 사냥꾼 기자',
      whimRate: 0.85,
      noCommentRate: 0.20,
      lieRate: 0.40,
      appearance: '프레스 카드가 꽂힌 찌그러진 중절모, 멜빵에 걷어붙인 소매, 손때 묻은 취재 수첩과 만년필',
      personality: '집요함, 뻔뻔함, 도발적, 재치 있음, 논쟁을 즐김, 남의 약점을 캐내어 1면 특종으로 만들려는 야망',
      secrets: '할란 회장의 불법 주가 조작 및 정관계 뇌물 장부의 결정적 사본을 손에 넣었음',
      speechTone: '능글맞고 빠른 어조, 빈정거림과 도발 섞인 말투 ("거참", "~잖소?", "특종 냄새가 솔솔 나는데?")',
      introLine: '헤헤, 신문 1면에 실리고 싶으신가? 난 데일리 모닝의 기자, 엘리아스요! 사람 냄새 나는 특종을 쫓고 있지. 당신, 뭔가 감추고 있는 얼굴인데… 한 줄 털어놔 보시지?',
      greetingLine: '오호라, 거친 눈빛의 승객 양반이군! 내 취재 수첩에 당신 이름을 적어 넣을 이유라도 생겼소? 재미있는 소문이라도 있으면 풀어보시오.'
    },

    harlan: {
      id: 7,
      key: 'harlan',
      name: '할란',
      nameEn: 'Harlan',
      job: '사업가',
      jobEn: 'Businessman',
      car: '4호차 1등석 침대차',
      mbti: 'ENTJ',
      mbtiTitle: '대담한 통솔자 / 냉혹한 거물 실업가',
      whimRate: 0.70,
      noCommentRate: 0.50,
      lieRate: 0.30,
      appearance: '재단된 최고급 차콜 쓰리피스 정장, 말끔한 콧수염, 금시계 체인, 매서운 카리스마',
      personality: '오만함, 권위적, 결단력, 지배욕, 시간 낭비와 비효율을 극도로 혐오함, 모든 것을 자본으로 계산함',
      secrets: '철도 노선 매입을 둘러싸고 경쟁사 사장을 청부 파멸시키려다 실패해 비밀리에 몸을 숨기는 중',
      speechTone: '중후하고 고압적인 상류층 말투 ("~시오", "~인 거요?", "내 시간을 낭비하지 마시오")',
      introLine: '난 할란 코퍼레이션의 대표, 사업가 할란이오. 내 1초는 당신 하루 일당보다 가치가 있지. 1등석 스위트룸까지 찾아와서 잡담을 떨 생각이라면 당장 비서 아이다를 통해 약속부터 잡으시오.',
      greetingLine: '노크도 없이 남의 전용칸을 기웃거리다니, 예의를 밥 말아먹었군. 내 귀중한 시간을 뺏을 만한 가치 있는 제안이 아니라면 당장 물러나시오.'
    },

    clara: {
      id: 8,
      key: 'clara',
      name: '클라라',
      nameEn: 'Clara',
      job: '소설가',
      jobEn: 'Novelist',
      car: '4호차 1등석 침대차',
      mbti: 'INFJ',
      mbtiTitle: '통찰력 있는 이상주의자 / 미스터리 추리작가',
      whimRate: 0.35,
      noCommentRate: 0.20,
      lieRate: 0.15,
      appearance: '카키색 더블 트렌치코트, 단정한 단발머리, 깃털 만년필과 양장 가죽 노트를 소지한 지적인 자태',
      personality: '깊은 통찰력, 조용함, 미스터리함, 인간 내면의 어둠과 비밀을 예리하게 관찰하고 소설로 엮음',
      secrets: '과거 실제 미제 살인 사건의 유일한 목격자였으며, 범인이 이 열차 안에 타고 있다는 확신을 품고 있음',
      speechTone: '차분하고 지적이며 신비로운 문학적 어조 ("~같군요", "~라 생각해요", "흥미로운 눈빛이네요")',
      introLine: '반가워요. 전 클라라라고 해요. 살인과 비밀, 인간의 이면을 다루는 추리 소설을 쓰고 있답니다. 이 고립된 설원의 열차… 마치 제 차기작의 완벽한 무대 같지 않나요?',
      greetingLine: '흥미로운 발자국 소리가 들린다 했더니 당신이었군요. 당신의 눈빛에는… 평범한 승객과는 다른 짙은 사연이 어려 있네요. 무슨 생각을 하고 계시죠?'
    },

    ida: {
      id: 9,
      key: 'ida',
      name: '아이다',
      nameEn: 'Ida',
      job: '비서',
      jobEn: 'Secretary',
      car: '4호차 1등석 침대차',
      mbti: 'ESTJ',
      mbtiTitle: '엄격한 관리자 / 철두철미한 수석 비서',
      whimRate: 0.30,
      noCommentRate: 0.30,
      lieRate: 0.10,
      appearance: '단정한 짙은 녹색 투피스 스커트 정장, 브로치, 가죽 서류가방, 뿔테 안경과 꼼꼼한 서류철',
      personality: '완벽주의, 철저한 공사 구분, 비밀 엄수, 규격과 질서 준수, 감정에 휘둘리지 않는 냉철한 행정력',
      secrets: '할란 회장의 비밀 금고 열쇠와 가명 계좌 비밀번호를 단독으로 관리하고 있음',
      speechTone: '절도 있고 빈틈없는 엘리트 비서 어조 ("~입니다", "~하십시오", "확인해 드릴 수 없습니다")',
      introLine: '할란 회장님을 보좌하는 전담 비서, 아이다입니다. 회장님의 일정 관리 및 비즈니스 서류 일체를 총괄하고 있습니다. 공적인 용건이 아니시라면 업무에 방해되니 물러나 주십시오.',
      greetingLine: '실례지만 회장님과의 공식 면담 약속은 잡으셨습니까? 사전 확인되지 않은 승객과의 사적 접촉은 철저히 제한되어 있습니다.'
    },

    gail: {
      id: 10,
      key: 'gail',
      name: '게일',
      nameEn: 'Gail',
      job: '의사',
      jobEn: 'Doctor',
      car: '5호차 2등석 침대차',
      mbti: 'ENFJ',
      mbtiTitle: '정의로운 지도자 / 인도주의 의사',
      whimRate: 0.15,
      noCommentRate: 0.05,
      lieRate: 0.05,
      appearance: '흰색 가운, 목에 두른 청진기, 둥근 안경 너머 온화하고 사려 깊은 눈매, 단정한 머리',
      personality: '온화함, 도덕적, 신망 있음, 책임감, 승객들의 안위를 진심으로 걱정하고 갈등을 평화롭게 중재함',
      secrets: '과거 의료 과실로 사망한 환자의 유족에게 쫓기고 있어 신분을 숨긴 채 서부로 피신하는 길임',
      speechTone: '온화하고 신뢰를 주는 품격 있는 존댓말 ("~군요", "~이지요", "도움이 필요하시면 말씀하세요")',
      introLine: '안녕하십니까, 게일 의사입니다. 5호차 침대칸에 묵고 있지요. 어디 편찮으신 곳이라도 있으십니까? 열차가 덜컹거려 멀미나 두통을 호소하는 승객들이 많더군요.',
      greetingLine: '어서 오십시오. 얼굴빛이 조금 창백해 보이는데, 긴 여행에 피로가 쌓이신 모양입니다. 따뜻한 차라도 한 잔 드시겠습니까?'
    },

    arthur: {
      id: 11,
      key: 'arthur',
      name: '아서',
      nameEn: 'Arthur',
      job: '교수',
      jobEn: 'Professor',
      car: '5호차 2등석 침대차',
      mbti: 'INTP',
      mbtiTitle: '논리적인 사색가 / 괴짜 고고학 교수',
      whimRate: 0.40,
      noCommentRate: 0.30,
      lieRate: 0.05,
      appearance: '낡은 갈색 롱코트, 흘러내리는 돋보기안경, 벗겨진 백발 머리, 손에 쥔 고서적과 양피지',
      personality: '지적 호기심, 사색적, 논리적, 건망증 심함, 자기 전문 분야 이야기가 나오면 밤새도록 설명하려 듦',
      secrets: '박물관에서 도난당한 고대 이집트의 저주받은 부적을 몰래 입수하여 연구 목적으로 반출 중',
      speechTone: '헛기침 섞인 나이 지긋한 학자 말투 ("허허", "~라네", "~인가?", "이것 참…")',
      introLine: '응? 아, 자네 날 부른 건가? 대학에서 고대사 강의를 맡고 있는 아서 교수라네. 돋보기를 어디 뒀는지 통 찾을 수가 없어서 말이야… 자네 혹시 14세기 비잔틴 금화에 대해 들어봤나?',
      greetingLine: '허허, 미안하네. 고대 문헌 해독에 정신이 팔려서 자네가 온 줄도 몰랐군. 자네도 고대 문명이나 미스터리 유물에 관심이 있는 겐가?'
    },

    jude: {
      id: 12,
      key: 'jude',
      name: '주드',
      nameEn: 'Jude',
      job: '사기꾼',
      jobEn: 'Swindler / Gambler',
      car: '6호차 식당차',
      mbti: 'ESTP',
      mbtiTitle: '모험을 즐기는 사업가 / 뻔뻔한 타짜 사기꾼',
      whimRate: 0.95,
      noCommentRate: 0.40,
      lieRate: 0.65,
      appearance: '화려한 붉은 줄무늬 정장, 기름진 올백 머리, 비단 넥타이, 능글맞은 미소와 손가락 사이의 트럼프 카드',
      personality: '임기응변 최강, 뻔뻔함, 도박광, 배짱, 위기 대처 능력 탁월, 눈 하나 깜빡 안 하고 거짓말을 침',
      secrets: '가짜 다이아몬드 원석을 1등석 귀족들에게 진품이라 속여 거액의 계약금을 가로채 달아나는 중',
      speechTone: '능청스럽고 기름진 제비족 말투 ("친구", "인생 한 방이지", "거 팍팍하게 굴지 맙시다")',
      introLine: '하하하! 난 주드라고 하네, 친구. 음? 직업? 아아, 운과 기회를 매매하는 어엿한 \'자산 중개인\'이지. 세상 사람들은 나더러 카드판의 마술사라 부르기도 하지만 말이야!',
      greetingLine: '어이, 친구! 표정이 왜 그렇게 심각해? 인생 뭐 있어, 식당차에서 위스키 한 잔 걸치고 카드나 한 판 돌리자고! 밑질 것 없는 장사잖아, 앙?'
    },

    rose: {
      id: 13,
      key: 'rose',
      name: '로즈',
      nameEn: 'Rose',
      job: '무용수',
      jobEn: 'Dancer',
      car: '6호차 식당차',
      mbti: 'ESFJ',
      mbtiTitle: '사교적인 외교관 / 우아한 카바레 댄서',
      whimRate: 0.25,
      noCommentRate: 0.15,
      lieRate: 0.20,
      appearance: '오렌지빛 실크 스카프, 우아한 플리츠스커트, 풍성한 적갈색 웨이브 헤어, 매혹적인 향수 향기',
      personality: '사교적, 우아함, 예의바름, 타인의 호감을 삼, 갈등을 싫어하며 파티와 로맨틱한 분위기를 좋아함',
      secrets: '자신을 스토킹하던 부유한 후원자를 피해 야반도주하듯 다른 도시의 극단으로 이적하는 길임',
      speechTone: '상냥하고 애교 섞인 우아한 존댓말 ("~해요", "~잖아요", "어머나, 정말요?")',
      introLine: '안녕하세요, 멋진 분. 전 로즈예요. 브로드웨이 극단에서 무대를 누비는 무용수랍니다. 이 긴 기차 여행은 다리를 쉬게 하기엔 딱 좋은 시간이죠. 음악이라도 흐르면 좋을 텐데.',
      greetingLine: '어머, 테이블을 찾아오셨나요? 식당차의 커피 향이 참 은은하죠. 혼자 식사하기 조금 적적했는데, 마침 잘 오셨어요.'
    },

    lulu: {
      id: 14,
      key: 'lulu',
      name: '룰루',
      nameEn: 'Lulu',
      job: '가수',
      jobEn: 'Singer',
      car: '7호차 라운지차',
      mbti: 'ESFP',
      mbtiTitle: '자유로운 영혼의 연예인 / 화려한 재즈 디바',
      whimRate: 0.80,
      noCommentRate: 0.45,
      lieRate: 0.35,
      appearance: '가슴이 깊게 파인 에메랄드 이브닝드레스, 깃털 숄, 긴 장갑, 짙은 립스틱과 도도한 턱선',
      personality: '드라마틱함, 기분파, 변덕, 관심 중독, 허영심, 자신이 세상의 중심이어야 직성이 풀리는 디바',
      secrets: '최근 성대 결절로 고음이 나오지 않게 되자 절망하여 무대에서 잠적하고 술에 의존하고 있음',
      speechTone: '콧대 높고 화려한 여배우/디바 어조 ("어머", "~잖니", "~라구", "내 목을 보호해야 해")',
      introLine: '어머, 날 몰라본단 말야? 이 에메랄드빛 목소리의 주인공, 밤의 여왕 룰루를! 뉴욕 최고의 재즈 클럽을 뒤흔드는 디바이자 가수라구. 사인이라도 원한다면 샴페인 한 잔 사오련?',
      greetingLine: '흥, 또 극성팬인가? 미안하지만 오늘은 목 상태가 예민해서 노래는 사절이야. 내 황금 같은 휴식을 방해하지 말아 줘.'
    },

    felix: {
      id: 15,
      key: 'felix',
      name: '필릭스',
      nameEn: 'Felix',
      job: '사진사',
      jobEn: 'Photographer',
      car: '7호차 라운지차',
      mbti: 'ENFP',
      mbtiTitle: '재기발랄한 활동가 / 방랑 사진작가',
      whimRate: 0.50,
      noCommentRate: 0.15,
      lieRate: 0.15,
      appearance: '카메라 스트랩을 주렁주렁 맨 조끼, 가죽 렌즈 가방, 헝클어진 머리, 호기심으로 반짝이는 눈동자',
      personality: '모험심, 낭만적, 즉흥적, 쾌활함, 예술적 감각, 멋진 피사체와 스토리를 보면 물불 가리지 않고 달려듦',
      secrets: '얼마 전 어떤 거물 승객이 객차 복도에서 은밀히 권총을 주고받는 장면을 우연히 카메라 필름에 담았음',
      speechTone: '활기차고 감탄사가 많은 유쾌한 말투 ("와우!", "~하죠!", "이것 보세요!", "예술이군요")',
      introLine: '치즈~! 하하, 미안해요! 빛이 너무 멋져서 나도 모르게 셔터를 누를 뻔했네. 난 필릭스, 세상을 필름에 담는 방랑 사진사예요. 당신 눈빛, 꽤 드라마틱한 사연을 품고 있군요?',
      greetingLine: '오! 그 각도, 조명이 끝내주는데요? 잠깐만 그대로 있어 봐요! …아, 카메라 셔터가 아니라 말을 걸러 온 거였군요? 하하, 반갑습니다!'
    },

    mabel: {
      id: 16,
      key: 'mabel',
      name: '메이벨',
      nameEn: 'Mabel',
      job: '귀족',
      jobEn: 'Aristocrat',
      car: '8호차 전망차',
      mbti: 'INTJ',
      mbtiTitle: '용의주도한 전략가 / 냉혹한 귀족 상속녀',
      whimRate: 0.85,
      noCommentRate: 0.60,
      lieRate: 0.30,
      appearance: '깃털이 달린 호화로운 짙은 청록색 모자, 최고급 벨벳 롱코트, 흑단 지팡이, 얼음처럼 차가운 시선',
      personality: '극도의 오만함, 냉철함, 철저한 통제, 타인 경멸, 지적 우월감, 감정을 겉으로 전혀 드러내지 않는 포커페이스',
      secrets: '아버지의 막대한 유산을 독차지하기 위해 다른 상속인들을 함정에 빠뜨리고 비밀 유언장을 탈취했음',
      speechTone: '얼음처럼 차갑고 오만한 귀족 어조 ("~이지요", "~하군요", "감히 천박하게…")',
      introLine: '…감히 무례하게 누구 앞이라고 고개를 쳐드는 거지? 난 밴더빌트 가문의 메이벨 드 몽모랑시 남작부인이에요. 내 이름 석 자 앞에서는 주지사도 모자를 벗는 법이죠. 당장 내 시야에서 사라지세요.',
      greetingLine: '…(창밖 설원을 응시하며 고개조차 돌리지 않는다) 감히 천박한 발소리로 내 사색을 방해하다니. 용건이 무엇이든 내 귀를 더럽히지 말고 물러서세요.'
    }
  };

  // Pre-configured Inter-Character Dialogue Pairs (for "서로 소통할수 있게" requirement)
  const dialoguePairs = [
    {
      c1: 'bram',
      c2: 'nurse_k',
      title: '브람(INFP)과 케이(ISTJ)의 대화',
      promptTopic: '기차 안의 음산한 분위기에 대해 불안해하는 브람과 규율을 강조하는 케이 간호사의 대화'
    },
    {
      c1: 'bram',
      c2: 'nell',
      title: '브람(INFP)과 넬(ISFJ)의 대화',
      promptTopic: '서로 수줍어하며 찢어진 책장과 옷감 바느질에 대해 조심스럽게 나누는 위로의 대화'
    },
    {
      c1: 'nurse_k',
      c2: 'elias',
      title: '케이(ISTJ)와 엘리아스(ENTP)의 대화',
      promptTopic: '환자 비밀을 캐내려는 특종 기자 엘리아스와 철통같이 원칙을 지키는 케이의 말싸움'
    },
    {
      c1: 'harlan',
      c2: 'ida',
      title: '할란(ENTJ)과 아이다(ESTJ)의 대화',
      promptTopic: '시카고 철도 독점 인수 합병 서류와 비밀 장부에 대한 날카로운 비즈니스 점검'
    },
    {
      c1: 'harlan',
      c2: 'clara',
      title: '할란(ENTJ)과 클라라(INFJ)의 대화',
      promptTopic: '돈이 전부라는 오만한 사업가 할란과 인간의 양심과 비극을 꿰뚫어보는 작가 클라라의 심리전'
    },
    {
      c1: 'gail',
      c2: 'arthur',
      title: '게일(ENFJ)과 아서(INTP)의 대화',
      promptTopic: '인간의 생명과 치유를 논하는 의사 게일과 고대 비잔틴 유적에 빠진 괴짜 교수 아서의 학술 토론'
    },
    {
      c1: 'jude',
      c2: 'rose',
      title: '주드(ESTP)와 로즈(ESFJ)의 대화',
      promptTopic: '능글맞게 작업을 걸며 카드 게임을 권하는 사기꾼 주드와 우아하게 받아치며 거절하는 무용수 로즈'
    },
    {
      c1: 'lulu',
      c2: 'felix',
      title: '룰루(ESFP)와 필릭스(ENFP)의 대화',
      promptTopic: '최고의 각도로 사진을 찍어달라는 까다로운 디바 룰루와 셔터를 마구 누르며 감탄하는 사진사 필릭스'
    },
    {
      c1: 'ward',
      c2: 'cade',
      title: '워드(ISTP)와 케이드(ISFP)의 대화',
      promptTopic: '화물칸 밀수품을 캐묻는 하드보일드 형사 워드와 귀찮아서 석탄이나 퍼넣으라는 무뚝뚝한 화부 케이드'
    },
    {
      c1: 'mabel',
      c2: 'elias',
      title: '메이벨(INTJ)과 엘리아스(ENTP)의 대화',
      promptTopic: '상류층 스캔들을 물고 늘어지는 뻔뻔한 기자 엘리아스와 벌레 보듯 독설로 짓밟는 귀족 메이벨'
    }
  ];

  // Helper to get Gemini API key
  const getApiKey = () => {
    return localStorage.getItem('gemini_api_key') || '';
  };

  const setApiKey = (key) => {
    if (key && key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    updateStatusBadge();
  };

  // Build DOM Elements for Dialogue UI
  const initUI = () => {
    if (document.getElementById('dialogue-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'dialogue-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(8, 10, 16, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10000;
      justify-content: center;
      align-items: center;
      user-select: text;
    `;

    modal.innerHTML = `
      <div id="dialogue-box" style="
        width: 860px;
        max-width: 95vw;
        height: 640px;
        max-height: 92vh;
        background: linear-gradient(135deg, #181312 0%, #1e1715 50%, #141010 100%);
        border: 2px solid #dfb142;
        border-radius: 12px;
        box-shadow: 0 12px 45px rgba(0,0,0,0.85), inset 0 0 15px rgba(223, 177, 66, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        font-family: 'Segoe UI', -apple-system, sans-serif;
        color: #f2ece1;
      ">
        <!-- Header -->
        <div style="
          padding: 14px 20px;
          background: #251b18;
          border-bottom: 1px solid #dfb142;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">🚂</span>
            <div>
              <div id="dlg-header-name" style="font-size: 18px; font-weight: 700; color: #dfb142; letter-spacing: 0.5px;"></div>
              <div id="dlg-header-desc" style="font-size: 12px; color: #b8a68b;"></div>
            </div>
            <span id="dlg-mbti-badge" style="
              background: #3b2a24;
              border: 1px solid #d4af37;
              color: #ffd875;
              padding: 3px 10px;
              border-radius: 14px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1px;
            "></span>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button id="btn-api-key" style="
              background: #2c201c;
              border: 1px solid #9e7d3b;
              color: #dfb142;
              padding: 5px 12px;
              border-radius: 6px;
              font-size: 11px;
              cursor: pointer;
              transition: all 0.2s;
            ">🔑 Gemini 설정</button>
            <span id="dlg-api-status" style="font-size: 11px; color: #aaa;"></span>
            <button id="btn-dlg-close" style="
              background: transparent;
              border: none;
              color: #d4af37;
              font-size: 24px;
              cursor: pointer;
              line-height: 1;
              padding: 0 4px;
            ">&times;</button>
          </div>
        </div>

        <!-- Body Content -->
        <div style="flex: 1; display: flex; overflow: hidden;">
          <!-- Left: Character Portrait & Stats -->
          <div style="
            width: 260px;
            background: rgba(20, 15, 14, 0.7);
            border-right: 1px solid rgba(223, 177, 66, 0.3);
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto;
          ">
            <div style="
              width: 170px;
              height: 230px;
              border: 2px solid #dfb142;
              border-radius: 8px;
              background: #110d0c;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.6);
              margin-bottom: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
            ">
              <img id="dlg-portrait" src="" style="width: 100%; height: 100%; object-fit: contain; object-position: top center;" alt="Portrait" />
            </div>

            <div style="width: 100%; font-size: 12px; line-height: 1.6; color: #cfc4b2; margin-top: 4px;">
              <div style="margin-bottom: 4px;"><strong style="color: #dfb142;">위치:</strong> <span id="dlg-info-car"></span></div>
              <div style="margin-bottom: 4px;"><strong style="color: #dfb142;">성향:</strong> <span id="dlg-info-mbti"></span></div>
              <div style="margin-bottom: 4px;"><strong style="color: #dfb142;">특징:</strong> <span id="dlg-info-trait"></span></div>
              <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(223,177,66,0.3); font-size: 11px; color: #9a8c77;">
                💡 <span id="dlg-info-whim"></span>
              </div>
            </div>

            <!-- Inter-character Chat Trigger Button -->
            <button id="btn-interact-pair" style="
              margin-top: auto;
              width: 100%;
              background: linear-gradient(180deg, #422d20 0%, #2e1e15 100%);
              border: 1px solid #d4af37;
              color: #ffd875;
              padding: 8px 10px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            ">👥 다른 승객과 대화시키기</button>
          </div>

          <!-- Right: Chat History & Input Area -->
          <div style="flex: 1; display: flex; flex-direction: column; background: rgba(28, 22, 20, 0.4);">
            <!-- Messages Container -->
            <div id="dlg-messages" style="
              flex: 1;
              padding: 16px 20px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 12px;
            "></div>

            <!-- Quick Questions Bar -->
            <div style="
              padding: 8px 16px;
              background: rgba(20, 15, 14, 0.85);
              border-top: 1px solid rgba(223, 177, 66, 0.2);
              display: flex;
              gap: 6px;
              flex-wrap: wrap;
            ">
              <button class="dlg-quick-btn" data-q="자기소개 부탁드립니다. 성함과 직업이 어떻게 되시나요?">👋 자기소개</button>
              <button class="dlg-quick-btn" data-q="이 열차에서 무엇을 하고 계십니까?">🚂 탑승 목적</button>
              <button class="dlg-quick-btn" data-q="열차 안에서 뭔가 수상하거나 이상한 사람을 보셨나요?">🕵️ 수상한 인물</button>
              <button class="dlg-quick-btn" data-q="다른 승객들에 대해 어떻게 생각하십니까?">👥 다른 승객들</button>
            </div>

            <!-- Custom Input Box -->
            <div style="
              padding: 12px 16px;
              background: #1a1311;
              border-top: 1px solid #dfb142;
              display: flex;
              gap: 10px;
              align-items: center;
            ">
              <input id="dlg-input" type="text" placeholder="승객에게 건넬 말을 입력하세요... (Enter 또는 전송 버튼)" style="
                flex: 1;
                background: #251b18;
                border: 1px solid #755b32;
                border-radius: 6px;
                padding: 10px 14px;
                color: #f7f1e6;
                font-size: 14px;
                outline: none;
              " />
              <button id="btn-dlg-send" style="
                background: linear-gradient(180deg, #dfb142 0%, #b8860b 100%);
                border: 1px solid #ffe484;
                color: #1a1205;
                font-weight: 700;
                font-size: 14px;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s;
              ">전송</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gemini API Key Modal -->
      <div id="gemini-key-modal" style="
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10005;
        justify-content: center;
        align-items: center;
      ">
        <div style="
          width: 480px;
          background: #1e1715;
          border: 2px solid #dfb142;
          border-radius: 10px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.9);
          color: #f2ece1;
        ">
          <h3 style="color: #dfb142; margin-bottom: 12px; font-size: 18px;">🔑 Gemini API 키 설정</h3>
          <p style="font-size: 12px; color: #b8a68b; line-height: 1.5; margin-bottom: 14px;">
            Google AI Studio에서 발급받은 Gemini API 키를 입력하면 16명의 캐릭터가 실시간 Gemini 대규모 언어 모델을 통해 살아 숨 쉬듯 반응합니다.<br>
            (키를 입력하지 않아도 내장된 1930년대 MBTI 시뮬레이션 엔진으로 완벽 작동합니다!)
          </p>
          <input id="input-api-key" type="password" placeholder="AIzaSy..." style="
            width: 100%;
            background: #2b201b;
            border: 1px solid #755b32;
            padding: 10px 12px;
            border-radius: 6px;
            color: #fff;
            margin-bottom: 16px;
            font-size: 14px;
          " />
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="btn-key-cancel" style="background:#3b2a24; border:1px solid #775c3b; color:#ddd; padding:8px 16px; border-radius:6px; cursor:pointer;">취소</button>
            <button id="btn-key-save" style="background:#dfb142; border:1px solid #ffd875; color:#1a1205; font-weight:700; padding:8px 18px; border-radius:6px; cursor:pointer;">저장하기</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Dynamic Quick Button Styles
    const style = document.createElement('style');
    style.textContent = `
      .dlg-quick-btn {
        background: #2c201c;
        border: 1px solid #6b512c;
        color: #dfb142;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .dlg-quick-btn:hover {
        background: #422e25;
        border-color: #dfb142;
        color: #fff;
      }
      .dlg-msg-bubble {
        padding: 10px 14px;
        border-radius: 8px;
        max-width: 85%;
        font-size: 13.5px;
        line-height: 1.55;
        word-break: keep-all;
      }
      .dlg-msg-player {
        align-self: flex-end;
        background: #3a2a20;
        border: 1px solid #8c6a32;
        color: #fff;
        border-bottom-right-radius: 2px;
      }
      .dlg-msg-npc {
        align-self: flex-start;
        background: #201715;
        border: 1px solid #574026;
        color: #f7eedb;
        border-bottom-left-radius: 2px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .dlg-msg-action {
        align-self: center;
        background: rgba(60, 40, 30, 0.4);
        border: 1px dashed #7a5c32;
        color: #ffd875;
        font-size: 12px;
        font-style: italic;
        padding: 6px 14px;
        border-radius: 14px;
      }
      #ambient-subtitle {
        display: none;
        position: fixed;
        bottom: 85px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(14, 10, 8, 0.88);
        border: 1px solid #dfb142;
        color: #f2ece1;
        padding: 8px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        pointer-events: none;
        z-index: 100;
        box-shadow: 0 4px 20px rgba(0,0,0,0.8);
        letter-spacing: 0.3px;
        max-width: 80vw;
        text-align: center;
      }
    `;
    document.head.appendChild(style);

    // Overheard Ambient Subtitle Box
    const ambientBox = document.createElement('div');
    ambientBox.id = 'ambient-subtitle';
    document.body.appendChild(ambientBox);

    // Event Listeners
    document.getElementById('btn-dlg-close').addEventListener('click', close);
    document.getElementById('btn-dlg-send').addEventListener('click', handleSendInput);
    document.getElementById('dlg-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendInput();
      e.stopPropagation(); // prevent game controls
    });

    // Quick Question Buttons
    document.querySelectorAll('.dlg-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const q = e.target.getAttribute('data-q');
        if (q) sendPlayerMessage(q);
      });
    });

    // Inter-character conversation trigger
    document.getElementById('btn-interact-pair').addEventListener('click', () => {
      if (!activeChar) return;
      triggerPairDialogueFor(activeChar.key);
    });

    // API Key Modal Handlers
    const keyModal = document.getElementById('gemini-key-modal');
    document.getElementById('btn-api-key').addEventListener('click', () => {
      document.getElementById('input-api-key').value = getApiKey();
      keyModal.style.display = 'flex';
    });
    document.getElementById('btn-key-cancel').addEventListener('click', () => {
      keyModal.style.display = 'none';
    });
    document.getElementById('btn-key-save').addEventListener('click', () => {
      const val = document.getElementById('input-api-key').value;
      setApiKey(val);
      keyModal.style.display = 'none';
    });

    // Escape Key to Close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (keyModal.style.display === 'flex') {
          keyModal.style.display = 'none';
        } else if (isDialogueOpen) {
          close();
        }
      }
    });

    updateStatusBadge();
  };

  const updateStatusBadge = () => {
    const badge = document.getElementById('dlg-api-status');
    if (!badge) return;
    const key = getApiKey();
    if (key) {
      badge.innerHTML = '<span style="color:#6be070;">● Gemini AI 활성</span>';
    } else {
      badge.innerHTML = '<span style="color:#d4af37;">● 로컬 시뮬레이션 모드</span>';
    }
  };

  // Append a message bubble to the chat container
  const appendMessage = (sender, text, isAction = false) => {
    const container = document.getElementById('dlg-messages');
    if (!container) return;

    const div = document.createElement('div');
    if (isAction) {
      div.className = 'dlg-msg-action';
      div.textContent = text;
    } else if (sender === 'player') {
      div.className = 'dlg-msg-bubble dlg-msg-player';
      div.innerHTML = `<strong>나:</strong> ${escapeHtml(text)}`;
    } else {
      div.className = 'dlg-msg-bubble dlg-msg-npc';
      div.innerHTML = `<strong style="color:#dfb142;">${escapeHtml(sender)}:</strong> ${escapeHtml(text)}`;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  };

  const escapeHtml = (str) => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // Open Dialogue with Character
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

    // Release pointer lock so user can mouse-click and type!
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }

    // Populate UI
    document.getElementById('dlg-header-name').textContent = `${cData.name} (${cData.nameEn})`;
    document.getElementById('dlg-header-desc').textContent = `${cData.job} | ${cData.car}`;
    document.getElementById('dlg-mbti-badge').textContent = `${cData.mbti}`;
    document.getElementById('dlg-portrait').src = `assets/characters/${cData.key}_front.png`;

    document.getElementById('dlg-info-car').textContent = cData.car;
    document.getElementById('dlg-info-mbti').textContent = `${cData.mbti} (${cData.mbtiTitle})`;
    document.getElementById('dlg-info-trait').textContent = cData.personality;

    const whimPercent = Math.round(cData.whimRate * 100);
    const liePercent = Math.round(cData.lieRate * 100);
    const noCommentPercent = Math.round(cData.noCommentRate * 100);
    document.getElementById('dlg-info-whim').innerHTML =
      `제멋대로 성향: <strong>${whimPercent}%</strong><br>무시/노코멘트율: <strong>${noCommentPercent}%</strong> | 거짓말율: <strong>${liePercent}%</strong>`;

    // Clear messages and add greeting
    const container = document.getElementById('dlg-messages');
    container.innerHTML = '';
    chatHistory = [];

    // Character's opening reaction
    appendMessage(cData.name, cData.greetingLine);
    chatHistory.push({ role: 'assistant', text: cData.greetingLine });

    document.getElementById('dialogue-modal').style.display = 'flex';
    document.getElementById('dlg-input').value = '';
    document.getElementById('dlg-input').focus();
  };

  // Close Dialogue
  const close = () => {
    isDialogueOpen = false;
    activeChar = null;
    const modal = document.getElementById('dialogue-modal');
    if (modal) modal.style.display = 'none';

    // Re-lock pointer on canvas container
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer && canvasContainer.requestPointerLock) {
      canvasContainer.requestPointerLock();
    }
  };

  const isOpen = () => isDialogueOpen;

  // Handle Send Button or Enter
  const handleSendInput = () => {
    const input = document.getElementById('dlg-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendPlayerMessage(text);
  };

  // Send Player Message and fetch response from Gemini or Simulated Engine
  const sendPlayerMessage = async (playerText) => {
    if (!activeChar || isGenerating) return;
    isGenerating = true;

    appendMessage('player', playerText);
    chatHistory.push({ role: 'user', text: playerText });

    const sendBtn = document.getElementById('btn-dlg-send');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = '생각 중...';
    }

    try {
      const apiKey = getApiKey();
      let reply = '';

      if (apiKey) {
        reply = await callGeminiAPI(activeChar, chatHistory, playerText);
      } else {
        // Fallback to local 1930s MBTI simulation engine
        await new Promise(r => setTimeout(r, 400 + Math.random() * 500));
        reply = simulateResponse(activeChar, playerText);
      }

      appendMessage(activeChar.name, reply);
      chatHistory.push({ role: 'assistant', text: reply });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to offline simulation:', err);
      const fallbackReply = simulateResponse(activeChar, playerText);
      appendMessage(activeChar.name, fallbackReply);
      chatHistory.push({ role: 'assistant', text: fallbackReply });
    } finally {
      isGenerating = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = '전송';
      }
      const input = document.getElementById('dlg-input');
      if (input) input.focus();
    }
  };

  // Call Google Generative Language API (Gemini 1.5 Flash / 2.0)
  const callGeminiAPI = async (char, history, currentMsg) => {
    const apiKey = getApiKey();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `당신은 1930년대 미국 대륙 횡단 특급열차(뉴욕-시카고 행)에 탑승 중인 실존 인물 '${char.name}' (${char.nameEn}, 직업: ${char.job}, MBTI: ${char.mbti})입니다.

[당신의 프로필]
- 이름: ${char.name} (${char.nameEn})
- 직업: ${char.job} (초반 설정된 원래 신분과 직업)
- MBTI: ${char.mbti} (${char.mbtiTitle})
- 외모: ${char.appearance}
- 말투와 성격: ${char.personality}, ${char.speechTone}
- 숨겨진 비밀: ${char.secrets}
- 행동 성향 수치:
  * 제멋대로 지수: ${Math.round(char.whimRate * 100)}%
  * 무시/노코멘트 확률: ${Math.round(char.noCommentRate * 100)}%
  * 거짓말 확률: ${Math.round(char.lieRate * 100)}%

[행동 지침 - 매우 중요!]
1. 당신은 고분고분 모든 질문에 답해주는 AI 로봇이 아닙니다! 자존심, 비밀, 기분, 의심을 가진 1930년대의 실제 인간입니다.
2. '자기소개', '누구인가', '이름과 직업'을 물어볼 때는 당신의 이름(${char.name})과 직업(${char.job})을 캐릭터 본연의 성격에 맞게 당당하게 또는 무뚝뚝하게 밝히십시오.
3. 질문이 마음에 들지 않거나, 의심스럽거나, 비밀을 건드리거나, 당신의 제멋대로인 성격에 따라:
   - 말을 무시하거나 차갑게 쏘아보기 (예: "…(시가를 털며 대답할 가치도 없다는 듯 노려본다)")
   - '노코멘트'라며 말을 돌리거나 거만하게 자르기
   - 태연하게 거짓말을 하거나 알리바이를 날조하기 (특히 ESTP, ENTP, ISTP, INTJ 등 제멋대로인 성격일수록 거짓말과 무시 확률이 대단히 높습니다!)
   - 반면 원칙적이고 성실한 성격(ISTJ, ISFJ, ENFJ 등)은 비교적 솔직하고 정중하게 대답하되, 비밀에 대해서만 조심스럽게 방어하십시오.
4. 반드시 1930년대 한국어 번역극/시대극 어투로 1~3문장 내외로 실감나게 대답하십시오.`;

    const contents = [];
    history.slice(-6).forEach(h => {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      });
    });

    const body = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 250
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Gemini API error status: ${res.status}`);
    }

    const data = await res.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error('Invalid response structure from Gemini API');
  };

  // High-Fidelity Local Simulation Engine (Used when no API key or offline)
  const simulateResponse = (char, query) => {
    const q = query.toLowerCase();
    const roll = Math.random();

    // 1. Self-Introduction Request: Reveals name & job faithfully as in initial photos!
    if (q.includes('자기소개') || q.includes('누구') || q.includes('이름') || q.includes('직업') || q.includes('신분')) {
      return char.introLine;
    }

    // 2. High Whim / No-Comment / Ignore Trigger
    if (roll < char.noCommentRate) {
      const ignores = {
        cade: '…(석탄 먼지를 털어내며 당신을 완전히 투명인간 취급하고 석탄 삽질에만 열중한다)',
        ward: '…노코멘트다. 민간인 신분에 수사관의 입을 열게 하려 들지 마.',
        bram: '그, 그건… 죄송하지만 말씀드리기 곤란해요… (창밖으로 시선을 돌리며 손가락을 꼼지락거린다)',
        nell: '어머나… 전 그저 재봉사일 뿐이라 그런 건 잘 몰라요. 죄송해요…',
        nurse_k: '환자 의료 기록 및 개인 신상에 관한 질문은 규정상 답변할 수 없습니다. 노코멘트입니다.',
        elias: '하! 기자한테 질문을 던져? 질문은 내가 하는 거요, 친구! 노코멘트라니 웃기는군.',
        harlan: '…(코웃음을 치며 신문으로 시선을 돌린다) 하찮은 질문에 낭비할 시간은 1초도 없소. 비서나 부르시오.',
        clara: '글쎄요… 미완성 원고의 결말을 미리 독자에게 누설할 수는 없는 법이죠. 침묵도 훌륭한 문장이랍니다.',
        ida: '회장님 관련 업무 및 일정에 대한 정보는 철저한 기밀입니다. 노코멘트하겠습니다.',
        gail: '허허, 환자분이나 승객분들의 사적인 사정에 대해선 의사로서 함구하는 것이 도리입니다.',
        arthur: '…응? 자네 방금 뭐라고 했나? 14세기 라틴어 주석을 읽느라 귀에 아무것도 안 들어왔네만.',
        jude: '어이쿠, 친구! 카드판의 패는 바닥에 깔리기 전까지 비공개인 법이지. 노코멘트야, 노코멘트!',
        rose: '어머, 숙녀에게 그렇게 짓궂은 걸 캐물으시면 곤란해요. 살짝 모른 척 넘어가 주는 게 신사의 예의잖아요?',
        lulu: '흥! 시끄러워 죽겠네. 사인받을 것도 아니면서 말 시키지 마. 내 고운 목만 아프잖아!',
        felix: '아, 방금 빛이 흔들려서 셔터 찬스를 놓쳤잖아요! 그런 재미없는 질문은 패스, 노코멘트예요!',
        mabel: '…(차가운 경멸의 시선으로 당신을 머리끝부터 발끝까지 훑은 뒤 아예 대꾸조차 하지 않는다)'
      };
      return ignores[char.key] || '…(무심하게 당신의 질문을 흘려듣고 대답하지 않는다)';
    }

    // 3. Lie / Bluff Trigger (Especially high for Swindler, Reporter, etc.)
    if (roll < char.noCommentRate + char.lieRate) {
      const lies = {
        cade: '…난 그저 화부일 뿐이오. 1호차 창고 쪽에서 무슨 소리가 났든 난 아무것도 못 봤소.',
        ward: '이 열차? 단순 정기 순찰이다. 수상한 첩보 같은 건 전혀 없으니 안심하고 좌석에 처박혀 있어.',
        bram: '아, 아니에요! 전 그냥 시카고에 계신 삼촌 댁에 효도 방문을 가는 길일 뿐이에요! 정말이에요…',
        nell: '네? 1등석 손님의 드레스요? 아, 아무런 얼룩도… 핏자국 같은 건 결코 본 적 없어요!',
        nurse_k: '열차 내에는 그 어떤 이상 질환자나 격리 대상도 존재하지 않습니다. 헛소문 유포는 엄벌에 처합니다.',
        elias: '특종? 에이, 난 그냥 시카고 박람회 풍경이나 스케치하러 가는 시시한 삼류 기자요! 믿어보시라니까?',
        harlan: '난 이번 출장으로 국가 경제에 이바지할 선량한 자선 사업을 구상 중이오. 투기나 정경유착 따윈 없소.',
        clara: '제 소설은 100% 허구일 뿐이에요. 실존 인물의 추악한 과거를 고발하려는 의도는 눈곱만큼도 없답니다.',
        ida: '회장님의 서류가방엔 평범한 계약서 사본만 들어 있습니다. 다른 비밀 금고 번호 같은 건 몰라요.',
        gail: '의료 과실이라뇨, 허허! 전 뉴욕 종합병원에서 명예로운 표창을 받고 휴가를 떠나는 길입니다.',
        arthur: '가방 안의 유물이요? 아아, 그냥 시장 바닥에서 산 1달러짜리 모조품 기념품이라네! 진짜 파라오의 부적이 아냐!',
        jude: '내가 사기꾼이라니 천만에! 난 월스트리트의 정통 투자 브로커요! 내 말대로만 하면 100배 수익을 보장하지!',
        rose: '전 그냥 순수한 마음으로 춤이 좋아서 무대에 설 뿐이에요. 어떤 부유한 후원자하고도 얽힌 적 없답니다.',
        lulu: '내 목 상태? 완벽하다마다! 지금 당장 카네기홀을 뒤흔들 수 있는 천상의 소프라노라구!',
        felix: '사진기 필름엔 그냥 풍경 사진만 찍혔어요! 2호차 복도에서 권총을 든 사람이 찍혔을 리가 없잖아요?',
        mabel: '우리 몽모랑시 가문의 유산 상속은 법적으로 아무런 하자 없이 완벽하게 정리되었어요. 더러운 참견 마세요.'
      };
      return lies[char.key] || '거짓말을 태연하게 지어내며 둘러댑니다.';
    }

    // 4. Inquisitive or Train Context Responses
    if (q.includes('목적') || q.includes('왜') || q.includes('열차')) {
      return `${char.car}에 머물고 있소. 각자 저마다의 사연으로 이 시카고행 열차에 몸을 실은 법이지. 당신은 무슨 목적으로 탄 거요?`;
    }

    if (q.includes('수상') || q.includes('이상') || q.includes('마피아') || q.includes('범인')) {
      const sus = {
        cade: '수상한 놈? 2호차 화물칸 주변을 알짱거리는 양복쟁이들이 제일 수상하오.',
        ward: '식당차의 붉은 정장 녀석(주드)과 1등석의 할란 회장을 주시해라. 둘 다 냄새가 풀풀 난다.',
        bram: '글쎄요… 8호차에 혼자 앉아 계신 귀부인(메이벨)의 시선이 너무 차가워서 온몸에 소름이 돋았어요…',
        nell: '잘 모르겠지만… 1등석 쪽에서 종종 험악한 고성이 들려와서 무서워요.',
        nurse_k: '이상 징후를 발견하면 제게 보고하십시오. 비과학적인 마녀사냥은 객차 질서를 어지럽힐 뿐입니다.',
        elias: '큭큭, 이 열차 자체가 범죄의 종합선물세트요! 특히 1등석 침대칸을 눈여겨보시오!',
        harlan: '내 신경을 거슬리게 하는 파파라치(엘리아스) 놈 말고는 아무도 관심 없소.',
        clara: '인간은 누구나 가면을 쓰고 있죠. 가장 얌전해 보이는 사람이 가장 잔혹한 범죄를 저지르는 법이랍니다.',
        ida: '회장님께 접근하려는 불온한 승객이 없는지 제가 항상 감시하고 있습니다.',
        gail: '모두가 불안에 떨고 있군요. 긴장감이 극에 달하면 사소한 오해도 비극이 될 수 있습니다.',
        arthur: '수상한 건 바로 이 열차의 진동일세! 책을 읽을 수가 없어, 책을!',
        jude: '하하! 이 세상에 안 수상한 인간이 어디 있나, 친구? 나 빼고 전부 다 수상하지!',
        rose: '글쎄요, 라운지차에서 노래하는 룰루 씨가 왠지 모르게 초조해 보이시더라고요.',
        lulu: '내 미모를 훔쳐보는 남자들 전부가 수상해! 특히 3호차의 그 얼빠진 대학생 녀석!',
        felix: '제 렌즈는 거짓말을 안 하죠. 어젯밤 화물칸 쪽에서 번쩍인 불빛이 아주 수상했어요.',
        mabel: '천박한 무리들이 우글거리는 이 기차 전체가 혐오스러울 따름이에요.'
      };
      return sus[char.key] || '모두가 비밀을 품고 있는 듯한 분위기요.';
    }

    // General default dialogue matching MBTI style
    const defaults = {
      cade: '…말이 많군. 난 할 일이나 마저 하겠소. 기차가 멈추면 석탄을 더 넣어야 하니까.',
      ward: '수사에 도움 될 말이 아니라면 입 다물어. 다음 역에 도착할 때까지 얌전히 자리에 앉아 있어라.',
      bram: '네… 그래도 누군가와 이렇게 이야기하니 마음이 조금은 놓이네요. 고마워요…',
      nell: '호호, 승객님도 참 좋은 분 같으세요. 여행길에 몸조심하시고 즐거운 여행 되세요.',
      nurse_k: '질문이 끝났다면 복도를 비워주십시오. 비상 통로는 항상 확보되어야 합니다.',
      elias: '다음 역에 내리기 전까지 특종 하나는 꼭 터뜨릴 거요. 당신도 긴장 바짝 하쇼!',
      harlan: '아이다! 이 사람 좀 내보내게. 더 이상 대화에 응할 가치가 없어.',
      clara: '당신과의 이 대화도 제 다음 소설의 한 장면으로 기록해 두어야겠군요. 좋은 영감이었어요.',
      ida: '업무 시간 외의 잡담은 사양하겠습니다. 규정대로 행동해 주십시오.',
      gail: '언제든 건강에 이상이 느껴지시면 5호차로 절 찾아오십시오. 몸조심하십시오.',
      arthur: '허허, 젊은이와 이야기하는 건 언제나 즐겁지. 지식을 탐구하는 자세를 잃지 말게나.',
      jude: '어이쿠, 그래 그래! 인생 즐기면서 사는 거지. 돈 냄새가 나는 곳에서 또 보자고, 친구!',
      rose: '후훗, 재미있는 분이시네요. 라운지에서 음악이 흐르면 함께 춤이라도 출까요?',
      lulu: '내 팬이라면 다음 공연 티켓이나 예매해 둬. 지금은 목을 아껴야 하니까 이만 가봐!',
      felix: '언젠가 당신의 인생 최고의 순간을 제 카메라로 찍어드릴게요! 좋은 하루 보내요!',
      mabel: '…하찮은 잡담은 이걸로 끝이에요. 다시는 내 앞에 얼씬거리지 마세요.'
    };
    return defaults[char.key] || '…(조용히 고개를 끄덕이며 말을 맺는다)';
  };

  // Trigger Pair Dialogue between two characters
  const triggerPairDialogueFor = (charKey) => {
    // Find matching pair in DB
    const pair = dialoguePairs.find(p => p.c1 === charKey || p.c2 === charKey);
    if (!pair) {
      appendMessage('시스템', '이 승객과 인근에 대화할 수 있는 승객이 없습니다.', true);
      return;
    }

    const c1Data = charactersDB[pair.c1];
    const c2Data = charactersDB[pair.c2];

    appendMessage('시스템', `--- [승객 간 대화 발생: ${c1Data.name}(${c1Data.mbti}) ↔ ${c2Data.name}(${c2Data.mbti})] ---`, true);

    // Pre-authored high-drama authentic 1930s dialogue exchanges
    const sampleExchanges = {
      'bram_nurse_k': [
        { speaker: '브람', text: '저… 간호사님, 열차 안 분위기가 어딘가 이상하지 않나요? 흉흉한 소문이 도는 것 같아서…' },
        { speaker: '케이', text: '학생, 시험공부 때문에 신경이 과민해진 모양이군요. 헛소문에 동요하지 말고 자리에 앉아 따뜻한 차나 마시십시오.' }
      ],
      'bram_nell': [
        { speaker: '브람', text: '저기… 넬 씨, 책 표지가 뜯어졌는데 혹시 실로 꿰맬 수도 있을까요?' },
        { speaker: '넬', text: '어머나, 브람 씨! 책 표지도 두꺼운 면실로 튼튼하게 꿰매드릴 수 있어요. 제가 잠시 봐드릴게요, 이리 주세요.' }
      ],
      'nurse_k_elias': [
        { speaker: '엘리아스', text: '어이, 케이 간호사! 1호차에서 옮겨진 의문의 환자가 있다는 소문이 돌던데… 1면 톱기사거리 한 줄만 주쇼!' },
        { speaker: '케이', text: '기자 양반, 환자의 의료 정보는 법적으로 철통 보안입니다. 한 번만 더 기웃거리면 워드 형사에게 공무집행 방해로 고발하겠습니다.' }
      ],
      'harlan_ida': [
        { speaker: '할란', text: '아이다, 시카고 동부 철도 인수 계약서의 서명 조항은 다시 검토했나?' },
        { speaker: '아이다', text: '네, 회장님. 상대측 법률 대리인이 끼워 넣은 위약금 조항까지 완벽히 배제하고 수정 완료했습니다.' }
      ],
      'harlan_clara': [
        { speaker: '할란', text: '클라라 양, 작가랍시고 내 주변을 기웃거리지 마시오. 내 전기는 내 손으로 백만 달러를 들여 쓸 거요.' },
        { speaker: '클라라', text: '어머, 할란 회장님. 탐욕으로 가득 찬 파멸의 악역만큼 소설 속에서 매력적인 주인공도 드물답니다. 안 그런가요?' }
      ],
      'gail_arthur': [
        { speaker: '게일', text: '아서 교수님, 돋보기를 또 잃어버리셨습니까? 코트 주머니 속에 걸려 있군요, 허허.' },
        { speaker: '아서', text: '이런, 고맙네 게일 의사! 파라오의 저주 문서보다 내 주머니 속을 찾는 게 더 어렵구먼!' }
      ],
      'jude_rose': [
        { speaker: '주드', text: '로즈 양, 오늘 밤 시카고에 도착하면 근사한 호텔 클럽에서 샴페인이라도 한 잔 어때요?' },
        { speaker: '로즈', text: '어머, 주드 씨. 정중한 제안은 고맙지만, 당신의 화려한 손기술만큼이나 믿음이 안 가는걸요?' }
      ],
      'lulu_felix': [
        { speaker: '룰루', text: '필릭스! 내 턱선이 갸름하게 나오도록 위에서 45도 각도로 찍으라고 몇 번을 말해!' },
        { speaker: '필릭스', text: '오 룰루! 당신의 모든 각도가 찬란한 예술이지만, 디바의 요청이라면 사다리라도 타고 올라가죠!' }
      ],
      'ward_cade': [
        { speaker: '워드', text: '케이드, 1호차 석탄 창고 안쪽에 수상한 나무 상자가 하나 있더군. 누가 실었지?' },
        { speaker: '케이드', text: '…난 석탄만 퍼넣는 사람이오. 남의 짐짝에 코를 들이밀 시간 있으면 덜컹거리는 바퀴나 점검하쇼.' }
      ],
      'mabel_elias': [
        { speaker: '엘리아스', text: '메이벨 남작부인! 밴더빌트 가문의 유언장 소송 건에 대해 독자들에게 한 말씀만 해주시죠!' },
        { speaker: '메이벨', text: '감히 천박한 펜대로 내 가문의 이름을 더럽히려 들다니… 시카고에 도착하는 즉시 당신 신문사를 통째로 인수해 폐간시켜 주겠어요.' }
      ]
    };

    const key = `${pair.c1}_${pair.c2}`;
    const keyRev = `${pair.c2}_${pair.c1}`;
    const exchange = sampleExchanges[key] || sampleExchanges[keyRev];

    if (exchange) {
      exchange.forEach(line => {
        appendMessage(line.speaker, line.text);
      });
    } else {
      appendMessage(c1Data.name, `${c2Data.name} 씨, 이번 여행길이 꽤나 소란스럽군요.`);
      appendMessage(c2Data.name, `글쎄요, ${c1Data.name} 씨. 다들 숨기는 게 많아서 그런 것 아니겠습니까.`);
    }
  };

  // Ambient Overheard Dialogue System (triggers occasionally when player walks near characters)
  const updateAmbient = (delta, playerPos) => {
    ambientCooldown -= delta;
    if (ambientCooldown > 0) return;

    ambientCooldown = 25.0 + Math.random() * 20.0; // trigger every 25~45s

    // Check player's current train car based on player Z
    // Car 3: -35.0 to -55.0 (Bram, Nell, Nurse K, Elias)
    // Car 4: -57.0 to -77.0 (Harlan, Clara, Ida)
    // Car 6: -101.0 to -121.0 (Jude, Rose)
    // Car 7: -123.0 to -143.0 (Lulu, Felix)
    const pz = playerPos.z;
    let chosenPair = null;

    if (pz <= -35.0 && pz > -55.0) {
      chosenPair = Math.random() < 0.5 ? 'bram_nell' : 'nurse_k_elias';
    } else if (pz <= -57.0 && pz > -77.0) {
      chosenPair = Math.random() < 0.5 ? 'harlan_ida' : 'harlan_clara';
    } else if (pz <= -79.0 && pz > -99.0) {
      chosenPair = 'gail_arthur';
    } else if (pz <= -101.0 && pz > -121.0) {
      chosenPair = 'jude_rose';
    } else if (pz <= -123.0 && pz > -143.0) {
      chosenPair = 'lulu_felix';
    }

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
    if (text) {
      showAmbientSubtitle(`👂 [귓가에 들리는 승객들의 대화] ${text}`);
    }
  };

  const showAmbientSubtitle = (text) => {
    const box = document.getElementById('ambient-subtitle');
    if (!box) return;
    box.textContent = text;
    box.style.display = 'block';

    setTimeout(() => {
      box.style.display = 'none';
    }, 6000);
  };

  // Public Interface
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

import { CurriculumUnit, MethodologyOption, ClicheItem } from '../types';

export const curriculumUnits: CurriculumUnit[] = [
  // 수학 (Mathematics)
  {
    id: 'math-m1-derivatives',
    subjectName: '수학Ⅱ / 미적분',
    subjectCategory: 'math',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '미분계수와 도함수의 활용 (극대·극소와 최적화)',
    unitConcepts: ['순간변화율', '도함수 부호 판정', '극대·극소', '변곡점', '최대·최소 정리', '비용함수 접선'],
    keyPrinciples: '함수의 증감과 오목·볼록을 미분계수로 분석하여 시스템의 효율이 극대화되거나 비용이 최소화되는 최적 임계점(Optimal Point)을 수학적으로 산출하는 원리',
    samplePhenomena: [
      '기업의 생산량 증가에 따른 한계비용(MC)과 한계수익(MR)이 일치하는 최적 생산량 결정',
      '신약 투여 후 혈중 약물 농도가 최고치에 달하는 피크 시간(Tmax) 계산',
      '전기차 배터리 충전 속도 감쇄 곡선에서 충전 효율이 급격히 저하되는 변곡점 분석',
      '교통 신호 주기와 차량 정체 대기열 길이 간의 변화율 최소화 모델링',
    ],
  },
  {
    id: 'math-prob-bayes',
    subjectName: '확률과 통계',
    subjectCategory: 'math',
    gradeLevel: '고2',
    semester: '2학기',
    unitName: '조건부 확률과 사건의 독립 (베이즈 정리와 추론)',
    unitConcepts: ['조건부 확률 P(A|B)', '베이즈 정리 (사전/사후 확률)', '독립과 종속', '표본공간 분할', '민감도와 특이도'],
    keyPrinciples: '새로운 증거(관측 데이터)가 주어졌을 때 사전 확률을 갱신하여 사후 확률을 추론하고 불확실성 하에서 최선의 의사결정을 내리는 원리',
    samplePhenomena: [
      '의료 진단 키트의 위양성(False Positive) 확률과 질병 유병률에 따른 실제 감염 사후확률',
      '스팸 메일 필터링 알고리즘에서 특정 단어 출현에 따른 스팸 판별 확률 갱신',
      '자율주행 센서 오작동 환경에서 장애물 인식의 조건부 신뢰도 검증',
      '형사 재판에서 DNA 일치 증거가 제시되었을 때 피고인의 유죄 사후확률 계산',
    ],
  },
  {
    id: 'math-m1-sir',
    subjectName: '미적분 / 고급수학',
    subjectCategory: 'math',
    gradeLevel: '고3',
    semester: '1학기',
    unitName: '여러 가지 미분법과 미분방정식 기초 (변화율 모델링)',
    unitConcepts: ['합성함수 미분법', '음함수 미분법', '지수성장과 로지스틱 곡선', '변수분리형 미분방정식', '미분계수의 기하학적 의미'],
    keyPrinciples: '상태 변화의 속도가 현재 상태에 비례하는 동적 시스템을 미분방정식으로 표현하고 한계 수용량(Carrying Capacity)에 수렴하는 현상을 규명하는 원리',
    samplePhenomena: [
      '감염병 확산 SIR 모델(감염대상자-감염자-회복자)의 시간에 따른 미분방정식 해석',
      '소셜 미디어 바이럴 콘텐츠의 확산 속도와 정보 포화 상태 도달 곡선 분석',
      '약물 체내 동태학(Pharmacokinetics)에서 1차 소실 반응속도 미분식 유도',
      '신기술의 시장 수용(Chasm) 과정에서 로지스틱 S자 곡선의 성장 계수 추정',
    ],
  },

  // 과학 (Science)
  {
    id: 'sci-bio-crispr',
    subjectName: '생명과학Ⅱ',
    subjectCategory: 'science',
    gradeLevel: '고2',
    semester: '2학기',
    unitName: '유전자 발현 조절과 유전체 교정 기술',
    unitConcepts: ['전사 조절 인자', '오페론 모델', 'Cas9 단백질 도메인', 'PAM 서열 인식', '오프타깃(Off-target) 절단', 'DNA 이중가닥 절단(DSB)'],
    keyPrinciples: '세포 내 유전 정보 발현 메커니즘을 이해하고, 특정 염기서열을 정밀 타깃팅하여 절단·수선하는 분자 생물학적 메커니즘을 규명하는 원리',
    samplePhenomena: [
      'CRISPR-Cas9 가이드 RNA 불일치 염기 개수에 따른 비표적 절단 위험도 분석',
      '암 억제 유전자(p53) 프로모터 부위의 전사 활성화 메커니즘과 돌연변이 영향',
      '세포 분화 과정에서 후성유전학적 메틸화가 특정 대사 경로 억제에 미치는 영향',
      'mRNA 백신의 지질나노입자(LNP) 캡슐화와 세포막 엔도시토시스 투과 기전',
    ],
  },
  {
    id: 'sci-chem-buffer',
    subjectName: '화학Ⅱ / 화학Ⅰ',
    subjectCategory: 'science',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '화학 평형과 산-염기 완충 용액의 원리',
    unitConcepts: ['화학 평형 상수(K)', '르샤틀리에 원리', '헨더슨-하셀바흐 식', '완충 용량', '공통이온 효과', 'pH 지수'],
    keyPrinciples: '외부에서 소량의 산이나 염기가 첨가되어도 평형 이동을 통해 수소이온 농도(pH) 변화를 최소화하는 생체 및 화학적 완충 메커니즘 규명',
    samplePhenomena: [
      '인체 혈액 내 탄산-탄산수소염(H2CO3 / HCO3-) 완충계의 항상성 유지 원리',
      '대기 중 이산화탄소 농도 증가에 따른 해양 산성화와 산호초 탄산칼슘 용해 반응 평형',
      '주사제 및 점안액 제형 설계 시 생체 적합 pH 유지를 위한 구연산염 완충계 설계',
      '토양 산성화가 식물 뿌리의 필수 미네랄(질소, 인, 칼륨) 이온 흡수율에 미치는 영향',
    ],
  },
  {
    id: 'sci-phy-energy',
    subjectName: '물리학Ⅰ / 물리학Ⅱ',
    subjectCategory: 'science',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '열역학과 에너지 변환 효율 (엔트로피와 일)',
    unitConcepts: ['열역학 제1법칙(에너지 보존)', '열역학 제2법칙(가역/비가역)', '카르노 사이클', '열효율', '엔트로피(Entropy)', '열전도도'],
    keyPrinciples: '에너지는 보존되지만 형태가 전환될 때 항상 유용한 에너지가 손실되며 전체 엔트로피가 증가한다는 한계 법칙을 분석하고 변환 효율을 극대화하는 원리',
    samplePhenomena: [
      '차세대 전고체 배터리와 리튬이온 배터리의 충·방전 주기 시 열손실 및 쿨롱 효율 비교',
      '펠티어 소자(Peltier element)를 활용한 열전 발전의 제벡 효과(Seebeck effect) 효율 측정',
      '건물 단열재의 열전도율과 실내 냉난방 에너지 부하 간의 상관관계 시뮬레이션',
      '데이터센터 GPU 냉각 시스템에서 공랭식과 액침 냉각 방식의 열역학적 PUE 지표 비교',
    ],
  },

  // 사회 (Social Studies)
  {
    id: 'soc-ethics-rawls',
    subjectName: '생활과 윤리 / 통합사회',
    subjectCategory: 'social',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '사회 정의와 윤리적 분배 (롤스의 정의론과 기본권)',
    unitConcepts: ['원초적 입장(무지의 베일)', '최소 수혜자 배려(차등 원칙)', '기회균등 원칙', '소유권적 정의(노직)', '능력주의의 덫(샌델)'],
    keyPrinciples: '사회적·자연적 우연성을 배제한 가상 상황에서 모든 구성원이 합의할 수 있는 공정한 분배 원칙을 도출하고 정책 딜레마를 조정하는 규범 원리',
    samplePhenomena: [
      '생성형 AI 기술 확산에 따른 일자리 대체 시 최소 수혜자(저숙련 노동자) 보호를 위한 로봇세 도입 쟁점',
      '희귀난치병 초고가 유전자 치료제(졸겐스마 등)의 건강보험 급여 적용 기준과 한정된 재정 분배의 딜레마',
      '도심 재개발 및 공공임대주택 정책에서 님비(NIMBY) 갈등과 롤스의 차등 원칙 적용',
      '탄소배출 규제 시 선진국과 개발도상국 간의 차등적 역사적 책임(CBDR) 분배 정의',
    ],
  },
  {
    id: 'soc-econ-externality',
    subjectName: '경제',
    subjectCategory: 'social',
    gradeLevel: '고2',
    semester: '2학기',
    unitName: '시장 실패와 정부의 역할 (외부효과와 탄소배출권)',
    unitConcepts: ['부정적/긍정적 외부효과', '피구세(Pigouvian Tax)', '코스 정리(Coase Theorem)', '배출권 거래제(Cap-and-Trade)', '사회적 한계비용'],
    keyPrinciples: '시장 기구가 자원을 효율적으로 배분하지 못하는 외부불경제 상황에서 재산권 획정과 경제적 유인 체계를 통해 사회적 후생을 극대화하는 경제 원리',
    samplePhenomena: [
      '국내 배출권 거래제(K-ETS) 가격 변동성과 기업의 친환경 감축 설비 투자 유인 간의 상관관계',
      '플랫폼 기업의 데이터 독점(Lock-in 효과)과 소비자 잉여의 왜곡 현상 분석',
      '설탕세(Sugar Tax) 부과가 청소년 가공식품 소비 감소 및 국민건강보험 재정에 미치는 경제적 파급효과',
      '공유지의 비극(Tragedy of the Commons) 해결을 위한 자율적 공동체 관리 규약(엘리너 오스트롬 모델) 사례 연구',
    ],
  },

  // 국어 (Korean Language)
  {
    id: 'kor-reading-argument',
    subjectName: '독서 / 화법과 작문',
    subjectCategory: 'korean',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '학술·기술 텍스트의 비판적 독해와 논증 분석 (툴민 모형)',
    unitConcepts: ['주장(Claim)', '데이터(Data)', '담보/워런트(Warrant)', '반박(Rebuttal)', '한정(Qualifier)', '비형식적 논리적 오류'],
    keyPrinciples: '전문 텍스트의 표면적 진술 너머에 내재된 전제와 근거의 타당성을 툴민의 논증 구조로 분해하고 담화의 프레이밍 효과를 검증하는 독해 원리',
    samplePhenomena: [
      '대중 언론의 첨단 기술 보도에서 나타나는 과장된 공포(Sensationalism) 프레임의 언어적 수사 장치 분석',
      '학술 논문 초록(Abstract)에서 저자가 결론을 유보하거나 신중하게 표현하는 완곡어법(Hedging) 분석',
      '신재생에너지 전환 정책 관련 서로 다른 입장의 신문 사설 4편의 논증 구조 비교 및 논리적 비약 검증',
      '대중 과학 서적에서 복잡한 수리/물리 개념을 설명하기 위해 사용된 은유(Metaphor)의 인지적 효과와 한계',
    ],
  },

  // 영어 (English)
  {
    id: 'eng-academic-imrad',
    subjectName: '영어 독해와 작문 / 심화 영어',
    subjectCategory: 'english',
    gradeLevel: '고2',
    semester: '공통',
    unitName: '국제 학술 원문 IMRaD 구조 분석 및 영문 리포트 작성',
    unitConcepts: ['IMRaD (Introduction, Methods, Results, Discussion)', 'Academic Vocabulary (AWL)', 'Hedging Expressions', 'Abstract Synthesis', 'Cohesion and Coherence'],
    keyPrinciples: '국제 학술 표준 형식인 IMRaD 프레임워크를 기반으로 최신 저널 원문의 연구 가설과 결론을 정확하게 독해하고 비판적으로 영문 요약하는 학업 역량',
    samplePhenomena: [
      'Nature/Science 오픈액세스 저널 초록(Abstract) 강독을 통한 글로벌 핵심 연구 트렌드 키워드 도출',
      '연구 결과의 한계를 서술할 때 사용되는 학술 영어 조동사(may, suggest, indicate)의 논리적 뉘앙스 비교',
      'TED 학술 강연 스크립트를 정독하고 한국 교육/산업 환경에 적용 가능한 시사점 영문 에세이 작성',
      '글로벌 기후 협약 영문 공문서의 어휘 구조와 법적 구속력 있는 조항의 언어적 특성 분석',
    ],
  },

  // 정보 / AI (Informatics & AI)
  {
    id: 'tech-algo-eda',
    subjectName: '정보 / 인공지능 기초',
    subjectCategory: 'tech',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '공공데이터 수집·전처리와 탐색적 데이터 분석(EDA)',
    unitConcepts: ['Open API 연동', '결측치 및 이상치 정제', '상관분석(피어슨 r)', '선형회귀 모델', '시각화(히트맵, 산점도)', '알고리즘 시간복잡도'],
    keyPrinciples: '실제 세상의 원시 데이터(Raw data)를 컴퓨터로 수집·가공하여 변인 간의 상관성과 추세를 시각화하고 문제 해결 알고리즘으로 구조화하는 컴퓨팅 사고력',
    samplePhenomena: [
      '공공데이터포털(data.go.kr) 전국 미세먼지(PM2.5) 농도와 호흡기 질환 내원 환자 수의 시계열 상관분석',
      '기상청 기온 데이터와 지역별 전력 소비량 데이터 피팅을 통한 여름철 최대 전력 수요 예측 회귀선 도출',
      '교통카드 승하차 공공 API를 활용한 심야 버스 노선 최적 경로 선정 알고리즘 흐름도 설계',
      '머신러닝 분류기(KNN, Decision Tree) 학습 시 데이터 불균형이 모델 정확도와 재현율(Recall)에 미치는 영향 실험',
    ],
  },
];

// 4 High School Methodologies
export const methodologyOptions: MethodologyOption[] = [
  {
    type: 'literature',
    title: '1. 문헌 / 학술 논문 비교 비평형',
    shortDesc: 'KCI 등재지 및 학술 칼럼 2~3편을 심층 비교하여 쟁점의 상반된 시각과 한계점을 분석',
    suitableFor: '인문, 사회, 법·정책, 의생명 윤리, 최신 이론 연구',
    recommendedTools: ['RISS (학술연구정보서비스)', 'DBpia / KCI 논문검색', 'Google Scholar', '국가법령정보센터'],
    actionSteps: [
      '1단계: 연구 질문과 관련된 핵심 KCI 논문 2편 선정 (서로 다른 방법론이나 관점을 지닌 논문 권장)',
      '2단계: 서론의 문제의식, 본론의 가설 검증 방식, 결론의 제언을 3단 비교표로 구조화',
      '3단계: 기존 논문들이 간과한 현실적 한계점이나 고교생 수준에서 관찰 가능한 보완점 도출',
      '4단계: 나의 생각과 교과 개념을 결합한 3~4페이지 분량의 학술 비평문 또는 제언서 작성',
    ],
    sampleDeliverable: '선행 연구 비교 분석표 + 학술 쟁점 비평문 (A4 3~4매)',
    badgeColor: 'border-purple-200 bg-purple-50 text-purple-700',
  },
  {
    type: 'public_data',
    title: '2. 공공데이터 분석 및 시각화형',
    shortDesc: '정부 및 지자체 공개 데이터셋을 직접 가공하여 변인 간 상관관계를 통계적으로 입증',
    suitableFor: '경영, 경제, 사회복지, 데이터사이언스, 환경, 공공보건',
    recommendedTools: ['공공데이터포털 (data.go.kr)', '국가통계포털 (KOSIS)', '서울열린데이터광장', '엑셀 / 파이썬(Pandas)'],
    actionSteps: [
      '1단계: 관심 가설을 검증할 수 있는 공공 CSV/Excel 데이터셋 2종 수집',
      '2단계: 결측치 제거 및 단위 통일 (전처리 과정 자체가 우수한 탐구 역량)',
      '3단계: 산점도, 히트맵, 꺾은선 그래프 등을 활용해 두 변수 간 피어슨 상관계수 산출',
      '4단계: 통계 결과가 단순 상관관계인지 인과관계인지 교과 이론에 비추어 비판적으로 고찰',
    ],
    sampleDeliverable: '데이터 정제 파이프라인 정리표 + 상관관계 시각화 차트 + 데이터 분석 보고서',
    badgeColor: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    type: 'simulation',
    title: '3. 가상 실험 / 수리 시뮬레이션형',
    shortDesc: '고교 과학실의 물리적 한계를 넘어 소프트웨어로 변인을 통제하고 수치적 모델을 실험',
    suitableFor: '수학, 물리학, 화학, 생명과학, 컴퓨터공학, 기계/전자',
    recommendedTools: ['지오지브라 (GeoGebra)', 'PhET 대화형 가상실험', 'MolView / PDB 3D 분자뷰어', 'NetLogo / 파이썬'],
    actionSteps: [
      '1단계: 교과서 공식이나 물리/화학 법칙을 지오지브라나 시뮬레이션 툴에 수식으로 입력',
      '2단계: 슬라이더 기능을 통해 독립변수(온도, 농도, 마찰계수, 파라미터)를 변화시키며 종속변수 추이 관찰',
      '3단계: 이상적인 이론값과 실제 환경에서 발생할 수 있는 오차 원인(마찰, 불완전 반응 등) 규명',
      '4단계: 매개변수 민감도 분석 결과 그래프를 캡처하고 수리적 의미를 해석한 탐구서 작성',
    ],
    sampleDeliverable: '시뮬레이션 조작 화면 캡처 + 매개변수 민감도 분석 그래프 + 수리 모델 보고서',
    badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  {
    type: 'practical_policy',
    title: '4. 교내 실천 / 정책 제안형',
    shortDesc: '학급·교내 환경의 실제 문제를 설문조사하고 교과 이론에 기반한 실질적 해결 가이드라인 제정',
    suitableFor: '교육학, 행정학, 심리학, 디자인, 학생자치, 사회학',
    recommendedTools: ['구글 폼 / 네이버 폼 (교내 설문)', 'Canva (인포그래픽 정책 포스터)', '학급 자치 회의', '피그마(Figma)'],
    actionSteps: [
      '1단계: 교내 또는 청소년이 겪는 일상 문제(급식 잔반, 디지털 과의존, 휴게공간 부족 등) 문제의식 구체화',
      '2단계: 전교생 또는 학급 30~50명 대상 표본 설문조사 설계 (편향 없는 객관식 및 리커트 5점 척도)',
      '3단계: 설문 결과 통계 분석 및 행동경제학(넛지)이나 사회복지 이론을 접목한 현실적 대안 도출',
      '4단계: 학생회나 학교 운영위원회에 건의 가능한 1장짜리 정책 제안서 및 홍보 포스터 완성',
    ],
    sampleDeliverable: '교내 설문조사 결과 통계표 + 넛지 정책 제안서 + 교내 인포그래픽 포스터',
    badgeColor: 'border-amber-200 bg-amber-50 text-amber-700',
  },
];

// Cliche Detection & 3 Twists Database
export const clicheDatabase: ClicheItem[] = [
  {
    id: 'cliche-aspirin',
    keyword: '아스피린',
    commonTopic: '아스피린의 에스테르화 합성 반응 실험과 수득률 계산',
    whyCliche: '전국 화학·생명 동아리에서 매년 수천 명이 반복하는 가장 대표적인 클리셰로, 단순 조리법 식 실험에 머물면 학생 고유의 지적 호기심을 입증하기 어렵습니다.',
    twists: [
      {
        approach: '[화학반응속도론 / 보존 조건 실험]',
        subTopic: '보관 온도와 습도 변화에 따른 아세틸살리실산 가수분해 속도와 유통기한 예측 모델',
        academicLens: '화학Ⅱ 반응속도식과 아레니우스 식을 적용하여 의약품 안정성 시험(Stability Test) 시뮬레이션',
        inquiryQuestion: '습도와 온도가 상승할 때 살리실산과 아세트산으로의 분해 반응속도 상수는 어떻게 변하며 최적 포장 조건은 무엇인가?',
      },
      {
        approach: '[분자약리학 / 구조 활성 상관관계(SAR)]',
        subTopic: '아스피린의 위장 장애 부작용 메커니즘과 2세대 COX-2 선택적 억제제 분자 도킹 분석',
        academicLens: '화학Ⅰ/생명과학Ⅱ 분자 간 상호작용 및 효소 입체 형태 변화(Allosteric Site) 3D 모델링',
        inquiryQuestion: '비선택적 COX 저해제가 위점막 프로스타글란딘을 억제하는 기전을 밝히고 왜 선택적 COX-2 저해제가 고안되었는가?',
      },
      {
        approach: '[약물전달시스템(DDS) / 제형 공학]',
        subTopic: '장용성 코팅(Enteric Coating) 고분자 두께에 따른 pH별 아스피린 방출 동태학(Dissolution Profile)',
        academicLens: '화학Ⅱ 완충용액과 고분자 화합물의 산·염기 분해 특성을 연결한 방출 속도 측정',
        inquiryQuestion: '위의 강산(pH 1.5) 환경에서는 용해를 차단하고 소장(pH 6.8)에서 선택적으로 붕해되도록 하는 고분자의 화학적 조건은?',
      },
    ],
  },
  {
    id: 'cliche-fibonacci',
    keyword: '피보나치',
    commonTopic: '자연 속의 황금비와 피보나치 수열 사례 조사 (꽃잎, 솔방울 등)',
    whyCliche: '인터넷 검색 수준의 사진 나열에 그쳐, 수학Ⅱ나 미적분의 학문적 수리 역량이나 증명 과정이 드러나지 않습니다.',
    twists: [
      {
        approach: '[수학적 귀납법 / 특성방정식 유도]',
        subTopic: '피보나치 수열의 점화식 행렬 표현과 대각화를 통한 일반항(비네의 공식) 대수적 유도',
        academicLens: '수학Ⅰ 수열의 귀납적 정의와 행렬의 고윳값(Eigenvalue) 개념을 활용한 수렴성 증명',
        inquiryQuestion: '인접한 두 항의 비율이 극한에서 왜 황금비(1.618...)로 정확하게 수렴하는지를 특성근을 통해 대수적으로 증명할 수 있는가?',
      },
      {
        approach: '[컴퓨터 알고리즘 / 시간복잡도 최적화]',
        subTopic: '단순 재귀 vs 메모이제이션(DP) vs 행렬 거듭제곱을 이용한 피보나치 알고리즘 성능 벤치마크',
        academicLens: '정보 교과 Big-O 시간복잡도 분석 (O(2^n)에서 O(log n)으로의 극적인 성능 개선)',
        inquiryQuestion: '알고리즘의 자료구조 설계 방식에 따라 n=10,000일 때 실행 시간과 메모리 점유율은 어떻게 차이를 보이는가?',
      },
      {
        approach: '[금융공학 / 데이터 검증]',
        subTopic: '주식 차트의 피보나치 되돌림(Fibonacci Retracement) 지표가 실제 시장 반등에 미치는 통계적 유의성 검정',
        academicLens: '확률과 통계 표본평균 검정 및 KOSPI 대형주 5개년 종가 데이터 상관분석',
        inquiryQuestion: '기술적 지표로서의 피보나치 비율(23.6%, 38.2%, 61.8%)은 단순 심리적 자기충족적 예언인가 통계적 지지선인가?',
      },
    ],
  },
  {
    id: 'cliche-prisoners-dilemma',
    keyword: '죄수의 딜레마',
    commonTopic: '죄수의 딜레마 2x2 보수 행렬 설명과 배신의 불가피성',
    whyCliche: '교과서에 나오는 기본 개념 표를 그대로 복사하는 데 그쳐, 고차원적 사회 모델링이나 현실 갈등 해결 능력이 부족해 보입니다.',
    twists: [
      {
        approach: '[환경경제학 / 기후변화 협약]',
        subTopic: '파리 기후협약의 국가 간 온실가스 감축 이행을 반복 죄수의 딜레마(Repeated Game)로 모델링',
        academicLens: '경제 외부효과 및 무임승차(Free-riding) 방지를 위한 팃포탯(Tit-for-Tat) 전략 수식화',
        inquiryQuestion: '무한 반복 게임 환경에서 미래의 할인율(Discount Factor)이 얼마 이상일 때 국가들이 자발적으로 협력(감축)을 유지하는가?',
      },
      {
        approach: '[진화생물학 / 군집 시뮬레이션]',
        subTopic: '공간적 죄수의 딜레마(Spatial Prisoner\'s Dilemma)에서 이타적 돌연변이의 군집 생존율 넷로고 시뮬레이션',
        academicLens: '생명과학Ⅱ 자연선택과 집단유전학, 진화적으로 안정된 전략(ESS) 원리 결합',
        inquiryQuestion: '개체 간 국소적 상호작용이 일어나는 격자망 환경에서 이타적 협력자들의 클러스터 형성이 배신자의 침략을 어떻게 방어하는가?',
      },
      {
        approach: '[행동경제학 / 신뢰도 공공재 게임]',
        subTopic: '징벌 메커니즘 유무에 따른 학급 모의 공공재 게임(Public Goods Game) 협력률 변화 실증 실험',
        academicLens: '통합사회 공동체 윤리와 경제학 비합리적 이타성(Altruistic Punishment) 분석',
        inquiryQuestion: '무임승차자에 대한 사회적 비용(비난/벌금) 부과가 구성원 전체의 공공재 기여도에 미치는 정량적 효과는?',
      },
    ],
  },
  {
    id: 'cliche-chatgpt-ethics',
    keyword: '생성형 AI',
    commonTopic: '챗GPT와 생성형 AI 사용의 찬성과 반대 윤리적 논쟁',
    whyCliche: '단순히 "저작권 문제가 있다, 표절이 우려된다"는 식의 상투적인 감상문 수준에 머무르기 쉽습니다.',
    twists: [
      {
        approach: '[지식재산권법 / 공정이용(Fair Use)]',
        subTopic: 'AI 학습용 데이터셋 스크래핑에 관한 미국 뉴욕타임스 소송과 국내 저작권법 제35조의5 개정안 비교 검토',
        academicLens: '정치와 법 지식재산권 조항 및 4단계 공정이용 판단 기준(변형적 이용, 시장가치 대체 여부)',
        inquiryQuestion: 'AI 모델의 가중치(Weights) 내에 인간 저작물이 저장된 것으로 볼 수 있는지에 대한 법학적 법리 분석',
      },
      {
        approach: '[컴퓨터공학 / 신뢰성 엔지니어링]',
        subTopic: '검색 증강 생성(RAG) 파이프라인에서 벡터 유사도 검색(Cosine Similarity)이 환각(Hallucination) 저감에 미치는 정량적 영향',
        academicLens: '기하 벡터 내적 및 정보 교과 자연어 임베딩 차원 축소 원리',
        inquiryQuestion: '문서 청크(Chunk) 크기와 유사도 임계값 설정이 언어모델의 사실 정확도(Factuality Score)에 미치는 트레이드오프 분석',
      },
      {
        approach: '[인지과학 / 언어 교육학]',
        subTopic: '고교생 글쓰기 초안 작성 시 생성형 AI 개입 시점(브레인스토밍 vs 퇴고)에 따른 비판적 사고력 지속 여부 비교 연구',
        academicLens: '국어 독서·작문 메타인지 역량 및 학생 설문·작문 결과 텍스트 어휘 다양성 지수(TTR) 산출',
        inquiryQuestion: 'AI를 아이디어 발산 도구로 썼을 때와 직접 문장 생성 도구로 썼을 때 학생 고유의 논리 전개 깊이는 어떻게 달라지는가?',
      },
    ],
  },
  {
    id: 'cliche-monty-hall',
    keyword: '몬티홀',
    commonTopic: '몬티홀 문제의 조건부 확률 설명과 문을 바꾸는 것이 유리한 이유',
    whyCliche: '3개 문 시나리오를 설명하는 교과서 문제풀이에 불과하여 학생 자신의 차별화된 연구 역량이 보이지 않습니다.',
    twists: [
      {
        approach: '[일반화 수학 모델링]',
        subTopic: '문이 N개이고 사회자가 K개의 꽝 문을 여는 N-문 몬티홀 일반화 확률 공식 유도 및 파이썬 10만 회 시뮬레이션',
        academicLens: '확률과 통계 조건부 확률 일반화 및 극한 수열(N이 무한대로 갈 때의 교체 승률)',
        inquiryQuestion: '사회자의 사전 정보 소유 여부(호스트가 무작위로 열었을 때)가 조건부 확률에 미치는 구조적 변화는 무엇인가?',
      },
      {
        approach: '[인지심리학 / 행동경제학]',
        subTopic: '사람들이 왜 확률적 이득(66.7%)에도 불구하고 문을 바꾸기를 주저하는지에 관한 현상유지 편향(Status Quo Bias) 설문 검증',
        academicLens: '사회/경제 카너먼의 전망이론(Prospect Theory) 손실 회피성과 후회 공포(Regret Aversion)',
        inquiryQuestion: '바꿔서 틀렸을 때의 심리적 고통이 유지해서 틀렸을 때보다 크게 느껴지는 심리적 가중치 분석',
      },
      {
        approach: '[정보 보안 / 암호학적 응용]',
        subTopic: '몬티홀 문제의 정보 노출 메커니즘을 활용한 부채널 공격(Side-Channel Attack)의 암호키 유출 확률 모델링',
        academicLens: '정보 알고리즘 섀넌의 정보 엔트로피(Information Entropy) 감소율 계산',
        inquiryQuestion: '관측자가 얻는 단서(사회자가 특정 문을 회피하는 행위)가 비대칭 암호키의 불확실성을 얼마나 제거하는가?',
      },
    ],
  },
];

// Major Tracks & High school relevance mapping
export const majorTrackCategories = [
  {
    id: 'track-bio-health',
    name: '의생명 / 보건의료 / 약학',
    badge: '생명·의학',
    targetMajors: ['의예과', '약학과', '생명공학과', '바이오메디컬공학', '간호학과', '화학생명과학과'],
    coreInterests: ['유전자 교정 및 표적 치료제', '면역 세포 치료제', '분자 도킹 및 약물 대사', '생명윤리 및 의료 자원 분배', '체내 동태학 수리 모델링'],
    recommendedMethod: '가상 실험 / 수리 시뮬레이션형 (MolView, 지오지브라)',
  },
  {
    id: 'track-ai-cs',
    name: '컴퓨터 / 인공지능 / 소프트웨어',
    badge: 'IT·AI',
    targetMajors: ['컴퓨터공학과', '인공지능학과', '데이터사이언스학과', '소프트웨어학과', '정보보안학과'],
    coreInterests: ['머신러닝 알고리즘 및 편향성 분석', '대규모 언어모델(LLM) RAG 최적화', '알고리즘 시간복잡도 벤치마크', '오픈소스 라이선스 및 지식재산권', '공공데이터 기반 자동화 솔루션'],
    recommendedMethod: '공공데이터 분석 및 시각화형 (파이썬, Open API)',
  },
  {
    id: 'track-engineering',
    name: '전자 / 기계 / 신소재 / 화학공학',
    badge: '공학·소재',
    targetMajors: ['전자전기공학부', '기계공학과', '신소재공학과', '화학공학과', '항공우주공학과'],
    coreInterests: ['배터리 열관리 및 에너지 변환 효율', '반도체 미세공정과 전자기파 해석', '친환경 생분해성 고분자 소재', '자율주행 제어 알고리즘 및 센서 융합', '열역학 카르노 효율 극대화'],
    recommendedMethod: '가상 실험 / 수리 시뮬레이션형 (지오지브라, 센서 계측)',
  },
  {
    id: 'track-biz-econ',
    name: '경영 / 경제 / 금융공학',
    badge: '경영·경제',
    targetMajors: ['경영학과', '경제학과', '금융공학과', '통계학과', '국제통상학과'],
    coreInterests: ['탄소배출권 시장과 피구세 효과', '행동경제학적 넛지와 소비자 의사결정', '미분계수를 활용한 최적 생산량 비용함수 도출', '플랫폼 독점과 독점규제법', '공공재 게임과 무임승차 방지책'],
    recommendedMethod: '공공데이터 분석 및 시각화형 (KOSIS, K-ETS 지표)',
  },
  {
    id: 'track-social-law',
    name: '사회 / 정치외교 / 행정 / 법학',
    badge: '사회·법행정',
    targetMajors: ['정치외교학과', '행정학과', '법학과 / 공공인재학부', '사회학과', '미디어커뮤니케이션학과'],
    coreInterests: ['롤스의 정의론과 신기술 규제 거버넌스', '기본권 제한과 비례의 원칙(과잉금지)', '언론 보도 프레이밍과 툴민 논증 분석', '청소년 자치 조례안 제안', '디지털 정보 격차와 복지 사각지대'],
    recommendedMethod: '교내 실천 / 정책 제안형 (설문, 조례안, 포스터)',
  },
  {
    id: 'track-humanities-edu',
    name: '인문 / 어문 / 교육학',
    badge: '인문·교육',
    targetMajors: ['국어국문학과', '영어영문학과', '철학과', '사학과', '교육학과', '국어/영어교육과'],
    coreInterests: ['학술 텍스트의 완곡어법(Hedging) 분석', '국제 학술 저널 초록(Abstract) IMRaD 구조', '과학철학과 패러다임 전환', '생성형 AI 시대의 문해력(Literacy) 변화', '사회적 소수자 재현의 언어학적 비판'],
    recommendedMethod: '문헌 / 학술 논문 비교 비평형 (KCI 강독, 텍스트 분석)',
  },
];

import React, { useState, useEffect } from 'react';
import {
  Student,
  SubjectInquiryTopic,
  CurriculumUnit,
  MethodologyType,
  InquiryPlanProposal,
  SnowballStep,
  ClicheItem,
} from '../types';
import {
  curriculumUnits,
  methodologyOptions,
  clicheDatabase,
  majorTrackCategories,
} from '../data/curriculumData';
import {
  Sparkles,
  BookOpen,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Copy,
  Check,
  Printer,
  BookmarkPlus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  HelpCircle,
  TrendingUp,
  Cpu,
  Target,
  FlaskConical,
  GraduationCap,
  Plus,
  Trash2,
  Info,
  X,
  Loader2,
  Wand2,
  Briefcase,
} from 'lucide-react';

const initialCustomUnits: CurriculumUnit[] = [
  {
    id: 'custom-earth-el-nino',
    subjectName: '지구과학Ⅰ',
    subjectCategory: 'science',
    gradeLevel: '고2',
    semester: '2학기',
    unitName: '대기와 해양의 상호작용 (엘니뇨·라니냐와 워커 순환)',
    unitConcepts: ['무역풍', '용승 현상', '동태평양 수온 편차', '워커 순환', '남방진동 지수(SOI)'],
    keyPrinciples: '대기 순환과 해양 표층 수온 간의 피드백 작용을 분석하여 기후 이변의 원인을 수리·통계적으로 규명하는 원리',
    samplePhenomena: [
      '엘니뇨 발생 연도 동태평양 어획량 급감과 페루 연안 영양염류 용승 차단 분석',
      '기후변화에 따른 슈퍼 엘니뇨 발생 주기 단축과 한반도 겨울철 이상 고온 상관관계',
    ],
  },
  {
    id: 'custom-geom-projection',
    subjectName: '기하',
    subjectCategory: 'math',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: '공간도형과 정사영 (빛의 입사각과 투영 면적)',
    unitConcepts: ['정사영(S\' = S cosθ)', '이면각', '삼수선의 정리', '법선벡터', '공간좌표'],
    keyPrinciples: '빛의 입사각과 평면의 기울기에 따른 정사영 면적을 삼각함수로 모델링하여 에너지 흡수율을 극대화하는 기하학적 원리',
    samplePhenomena: [
      '위도 및 계절별 태양 고도각에 따른 태양광 패널의 최적 설치 각도와 정사영 면적 계산',
      '3차원 단층촬영(CT) 영상의 라돈 변환 투영 기하학 분석',
    ],
  },
];

// Helper: Find the best curriculum unit matching student's career & interest profile
export function findBestUnitForStudent(student: Student, units: (CurriculumUnit & { isCustom?: boolean })[]): CurriculumUnit {
  const context = `${student.targetCareer} ${student.targetMajor} ${student.mainInterestTopic} ${(student.interestKeywords || []).join(' ')} ${(student.preferredSubjects || []).join(' ')}`.toLowerCase();

  if (/생명|바이오|유전자|crispr|의약|단백질|세포|의예|약학|생체/i.test(context)) {
    const match = units.find((u) => u.id === 'sci-bio-crispr');
    if (match) return match;
  }
  if (/ai|인공지능|컴퓨터|알고리즘|머신러닝|소프트웨어|빅데이터|정보/i.test(context)) {
    const match = units.find((u) => u.id === 'tech-algo-eda');
    if (match) return match;
  }
  if (/환경|기후|탄소|배출권|경제|피구세|시장/i.test(context)) {
    const match = units.find((u) => u.id === 'soc-econ-externality');
    if (match) return match;
  }
  if (/사회|정의|윤리|법|인권|복지|롤스/i.test(context)) {
    const match = units.find((u) => u.id === 'soc-ethics-rawls');
    if (match) return match;
  }
  if (/물리|반도체|에너지|배터리|열역학|기계/i.test(context)) {
    const match = units.find((u) => u.id === 'sci-phy-energy');
    if (match) return match;
  }
  if (/화학|완충|용액|산염기/i.test(context)) {
    const match = units.find((u) => u.id === 'sci-chem-buffer');
    if (match) return match;
  }
  if (/확률|통계|베이즈/i.test(context)) {
    const match = units.find((u) => u.id === 'math-prob-bayes');
    if (match) return match;
  }
  if (/수학|미적분|변화율|도함수/i.test(context)) {
    const match = units.find((u) => u.id === 'math-m1-derivatives');
    if (match) return match;
  }

  return units[0] || curriculumUnits[0];
}

// Helper: Match track ID
export function findBestTrackForStudent(student: Student): string {
  const context = `${student.targetCareer} ${student.targetMajor} ${student.mainInterestTopic}`.toLowerCase();
  if (/생명|바이오|유전자|의예|약학|간호|의학/i.test(context)) return 'track-bio-health';
  if (/ai|인공지능|컴퓨터|소프트웨어|데이터/i.test(context)) return 'track-ai-cs';
  if (/경제|경영|금융|통상/i.test(context)) return 'track-biz-econ';
  if (/정치|외교|법|행정|사회|언론/i.test(context)) return 'track-social-law';
  if (/전자|기계|신소재|화공|항공/i.test(context)) return 'track-engineering';
  return 'track-bio-health';
}

// Helper: Synthesize full tailored 5-step plan for student & unit
export function getTailoredPlanForStudent(student: Student, unit: CurriculumUnit) {
  const career = student.targetCareer || '전문 연구원';
  const major = student.targetMajor || '자연과학/공학 계열';
  const interest = student.mainInterestTopic || '교과 연계 첨단 기술 쟁점';
  const keywords = student.interestKeywords || [];
  const keywordStr = keywords.join(', ');

  const contextStr = `${career} ${major} ${interest} ${keywordStr} ${unit.unitName} ${unit.subjectName}`.toLowerCase();
  const isBio = /생명|바이오|유전자|crispr|의약|단백질|세포|의예|약학/i.test(contextStr);
  const isAi = /ai|인공지능|컴퓨터|알고리즘|머신러닝|소프트웨어|빅데이터|정보/i.test(contextStr);
  const isEnv = /환경|기후|탄소|생태|신재생|esg|지구/i.test(contextStr);
  const isEcon = /경제|경영|배출권|금융|시장|피구세|가격/i.test(contextStr);

  // 1. Phenomenon Observation
  let customObserved = interest;
  let phenomenaChips = unit.samplePhenomena;
  if (isBio) {
    customObserved = `CRISPR 유전자 가위의 표적 외 절단(오프타깃) 부작용과 결합 오차율 측정 문제`;
    phenomenaChips = [
      `CRISPR-Cas9 가이드 RNA 불일치 염기 위치에 따른 오프타깃 비표적 절단 확률`,
      `단백질 3차원 입체 구조 접힘 오류와 난치성 신경퇴행성 질환 발병 기전`,
      `세포치료제 체내 주입 시 생체 적합 완충계와 면역 거부 반응 최소화 조건`,
    ];
  } else if (isAi) {
    customObserved = `생성형 AI 언어모델의 환각 현상과 사실 기반 검색 증강(RAG) 파이프라인의 신뢰성 한계`;
    phenomenaChips = [
      `대규모 언어 모델(LLM)의 사실 왜곡(Hallucination) 저감을 위한 벡터 유사도 검색(Cosine)`,
      `알고리즘 시간 복잡도(Big-O)와 대용량 데이터 정렬·탐색 효율 최적화`,
      `머신러닝 학습 데이터 편향성에 따른 공공 의사결정 알고리즘의 차별 문제`,
    ];
  } else if (isEnv || isEcon) {
    customObserved = `탄소배출권 거래 시장의 가격 왜곡 및 시장 실패 방지와 최적 조세 모델링`;
    phenomenaChips = [
      `국내 배출권 거래제(K-ETS) 가격 변동성과 기업의 친환경 감축 설비 투자 유인 왜곡`,
      `피구세(탄소세) 최적 세율 산정과 사회적 한계저감비용(MAC) 일치 조건`,
      `환경 불평등 해소를 위한 탄소 배출 규제와 취약 계층 복지 재정 환급 모델`,
    ];
  }

  // 2. Academic Lenses
  let lensOptions = [
    `${unit.unitConcepts[0] || '교과 핵심 원리'} 기반 수리/원리 모델링 렌즈`,
    `실세계 공공데이터 및 변인 통제 실증 렌즈`,
    `한계 극복 및 사회 윤리·제도적 가이드라인 렌즈`,
  ];
  if (isBio) {
    lensOptions = [
      '분자 생화학 및 결합 오차 확률 렌즈',
      '베이즈 조건부 확률 및 위양성 검증 렌즈',
      '생명윤리 및 임상 치료제 허가 규제 렌즈',
    ];
  } else if (isAi) {
    lensOptions = [
      'Big-O 시간복잡도 및 알고리즘 최적화 렌즈',
      '기하 벡터 내적 및 임베딩 코사인 유사도 렌즈',
      '인공지능 윤리 및 지식재산권 공정이용 렌즈',
    ];
  } else if (isEcon || isEnv) {
    lensOptions = [
      '미시경제학 시장 실패 및 외부효과 렌즈',
      '피구세 수리 모델링 및 코스 정리 렌즈',
      '롤스의 정의론 및 환경 정의(Environmental Justice) 렌즈',
    ];
  }

  // 3. Question Options
  let questionOptions = [
    `${unit.unitName}의 핵심 개념(${unit.unitConcepts[0]})을 ${interest}에 적용할 때 나타나는 최적 임계점은 무엇인가?`,
    `선행 연구 대비 ${interest} 시스템의 변인 간 상관관계를 정량적 데이터로 어떻게 입증할 것인가?`,
    `${unit.subjectName}의 이론을 실세계 ${major} 현장에 적용할 때 발생하는 현실적 오차와 극복 방안은?`,
  ];
  if (isBio) {
    questionOptions = [
      'gRNA의 특정 염기 불일치(Mismatch) 위치와 PAM 서열 거리가 비표적 절단 확률에 미치는 정량적 영향은 무엇인가?',
      '베이즈 조건부 확률을 적용했을 때 유전자 교정 검사의 위양성을 최소화하는 최적 임계값은?',
      '희귀난치병 치료용 유전자 가위의 안전성을 보장하기 위해 요구되는 2단계 분자 검증 프로토콜은 무엇인가?',
    ];
  } else if (isAi) {
    questionOptions = [
      '검색 증강 생성(RAG) 파이프라인에서 코사인 유사도 임계치 설정이 사실 정확도에 미치는 트레이드오프는 무엇인가?',
      '대규모 데이터 입력 시 정렬·탐색 알고리즘의 시간 복잡도를 O(n²)에서 O(n log n)으로 개선하는 구체적 방법은?',
      'AI 모델의 데이터셋 편향성을 탐색적 데이터 분석(EDA)으로 시각화하고 완화하는 알고리즘적 기제는 무엇인가?',
    ];
  } else if (isEcon || isEnv) {
    questionOptions = [
      '배출권 거래제(K-ETS) 가격 급락 시 기업의 한계저감비용(MAC)과 사회적 후생 손실을 최소화하는 피구세 세율은?',
      '외부효과를 내부화하는 코스 정리가 거래 비용(Transaction Cost)이 존재하는 현실 시장에서 성립하기 위한 제도적 조건은?',
      '취약 계층의 환경 불평등을 방지하기 위한 탄소세 세수 환급 모델의 경제적 효과는 어떠한가?',
    ];
  }

  // 4. Recommended methodology
  let recMethod: MethodologyType = 'simulation';
  if (isBio) recMethod = 'simulation';
  else if (isAi) recMethod = 'public_data';
  else if (isEnv || isEcon) recMethod = 'public_data';

  // Topic Title
  let topicTitle = `[${unit.subjectName}] ${unit.unitName} 기반 ${interest.slice(0, 30)} 심화 탐구`;
  if (isBio) {
    topicTitle = `[생명과학Ⅱ] CRISPR-Cas9 가이드 RNA 불일치 염기 분석을 통한 오프타깃 절단 위험도 수리 모델링`;
  } else if (isAi) {
    topicTitle = `[정보/인공지능] 대규모 언어 모델의 벡터 유사도 검색(Cosine) 기반 환각 저감 파이프라인 분석`;
  } else if (isEcon || isEnv) {
    topicTitle = `[경제] 국내 배출권 거래제(K-ETS) 가격 변동성과 피구세 최적 세율 모형 연구`;
  }

  // 5. Motivation
  const motivation = `교과 수업 중 [${unit.subjectName} - ${unit.unitName}] 단원을 학습하며 교과서에 등장하는 이론이 실세계 시스템에 적용될 때 마주하는 한계점에 지적 호기심을 갖게 됨. 평소 희망해 온 '${career}' 진로와 목표 학과인 '${major}' 관점에서, 최근 큰 관심을 두고 있던 '${interest}' 문제를 교과 핵심 개념(${unit.unitConcepts.slice(0, 2).join(', ')})과 결합하여 자기주도적으로 깊이 있게 분석해보고자 연구 주제를 기획함. 단순 현상 조사에 그치지 않고 정량적 데이터와 검증 가능한 가설 설정을 통해 학문적 타당성을 스스로 입증하고자 함.`;

  // Snowball Roadmap
  const snowballRoadmap: SnowballStep[] = [
    {
      grade: '1학년 (기초 소양)',
      stageName: '기초 개념 정립 및 문제의식 발굴',
      subject: '통합과학 / 통합사회 / 공통수학',
      focus: '일상적 현상에서 교과 기본 법칙과 호기심 발견',
      topicIdea: `${interest.slice(0, 15)} 관련 기초 개념 조사 및 실생활 적용 현황 보고서 작성`,
      connectionReason: '고교 1학년 공통 교육과정의 기본 성취기준을 성실히 이수했음을 입증',
    },
    {
      grade: '2학년 (전공 심화)',
      stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
      subject: unit.subjectName,
      focus: '정량적 모델링, 실험 설계 또는 공공데이터 실증',
      topicIdea: topicTitle,
      connectionReason: `${unit.unitName}의 핵심 이론을 진로 쟁점과 유기적으로 결합하여 검증`,
    },
    {
      grade: '3학년 (융합 발전)',
      stageName: '차년도 후속 심화 및 융합 과제',
      subject: '진로선택과목 / 생활과 윤리 / 융합과학탐구',
      focus: '한계점 극복, 정책 제언, 다학제간 융합 모델링',
      topicIdea: `${topicTitle.split(']')[1] || topicTitle}의 현실 적용 한계 보완 및 제도적·윤리적 가이드라인 연구`,
      connectionReason: '단발성 탐구로 끝나지 않고 3개년 동안 학문적 성장이 꼬리를 물고 이어지는 연속성 증명',
    },
  ];

  // Teacher Review Points
  const teacherReviewPoints = {
    academic: `${unit.subjectName}의 핵심 이론(${unit.unitConcepts[0]})을 정확하게 이해하고 실세계 데이터와 결합하여 심화 모델링을 도출하는 우수한 학업 탐구력`,
    career: `'${career}'에 대한 뚜렷한 진로 지향점을 바탕으로 최신 전공 쟁점을 주도적으로 분석하는 높은 전공 적합성`,
    community: `기술 발전과 연구 성과가 사회에 미치는 파급효과와 윤리적 책임을 함께 모색하는 성숙한 공동체 의식`,
  };

  const relatedBooks = isBio
    ? '《유전자 편집의 시대》(제니퍼 다우드나), 《생명이란 무엇인가》(에르빈 슈뢰딩거)'
    : isAi
    ? '《알고리즘, 인생을 계산하다》(브라이언 크리스천), 《마스터 알고리즘》(페드로 도밍고스)'
    : '《탄소중립의 기후학》(조천호), 《괴짜경제학》(스티븐 레빗)';

  return {
    customObserved,
    observedPhenomenon: customObserved,
    phenomenaChips,
    selectedLens: lensOptions[0],
    lensOptions,
    finalQuestion: questionOptions[0],
    inquiryQuestion: questionOptions[0],
    questionOptions,
    recMethod,
    recommendedMethodology: recMethod,
    clicheTwist: undefined as {
      approach: string;
      subTopic: string;
      academicLens: string;
      inquiryQuestion: string;
    } | undefined,
    topicTitle,
    motivation,
    snowballRoadmap,
    teacherReviewPoints,
    relatedBooks,
  };
}

interface CurriculumInquiryWizardProps {
  currentStudent: Student;
  onAddInquiryRecord: (topic: SubjectInquiryTopic) => void;
  onSwitchToMindmap?: () => void;
}

// Client-side initial tailored units generator for all 6 subjects
export function generateInitialTailoredUnits(student: Student): CurriculumUnit[] {
  const cleanInterest = student.mainInterestTopic || student.targetCareer || '교과 연계 첨단 기술 쟁점';
  const targetCareer = student.targetCareer || '전문 연구원';
  const targetMajor = student.targetMajor || '자연과학/공학 계열';
  const contextStr = `${cleanInterest} ${targetCareer} ${targetMajor} ${(student.interestKeywords || []).join(' ')}`.toLowerCase();

  const isBio = /생명|바이오|유전자|crispr|의약|단백질|세포|의예|약학|생체/i.test(contextStr);
  const isEnv = /환경|기후|탄소|배출권|에너지|신재생|esg|지구/i.test(contextStr);

  const mathUnit: CurriculumUnit = {
    id: 'tailored-math',
    subjectName: '수학 (미적분 / 확률과 통계)',
    subjectCategory: 'math',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: `${cleanInterest}의 변화율 예측과 확률적 모델링 (미적분·확통)`,
    unitConcepts: ['변화율과 도함수', '베이즈 정리(조건부 확률)', '최소제곱법과 회귀분석', '극대·극소 최적화'],
    keyPrinciples: `${cleanInterest} 시스템의 동적 변화율과 불확실성을 미분방정식 및 조건부 확률로 모델링하여 수치적 오차를 최소화하고 최적 임계점을 도출하는 수리적 원리`,
    samplePhenomena: [
      `매개변수 변동에 따른 ${cleanInterest} 출력값의 오차 민감도 및 잔차 분석`,
      `지오지브라/파이썬을 활용한 극대·극소 임계점과 수렴 안정성 시뮬레이션`,
      `베이즈 정리를 적용한 실세계 불확실성 감소 및 사후확률 갱신 모델링`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[수학] ${cleanInterest}의 변화율 예측과 확률적 모델링 탐구`,
      inquiryQuestion: `${cleanInterest} 시스템에서 핵심 변수의 변화율을 수학적으로 함수화하고 오차를 최소화하는 방안은 무엇인가?`,
      observedPhenomenon: `실세계 시스템 작동 과정에서 발생하는 매개변수 간의 비선형적 상호작용과 측정 오차의 불확실성`,
      phenomenaChips: [
        `매개변수 변동에 따른 ${cleanInterest} 출력값의 오차 민감도 및 잔차 분석`,
        `지오지브라/파이썬을 활용한 극대·극소 임계점과 수렴 안정성 시뮬레이션`,
        `베이즈 정리를 적용한 실세계 불확실성 감소 및 사후확률 갱신 모델링`,
      ],
      selectedLens: '미적분 변화율 및 베이즈 조건부 확률 추론 렌즈',
      lensOptions: [
        '미적분 변화율 및 베이즈 조건부 확률 추론 렌즈',
        '최소제곱법 회귀식 및 오차 제곱합(SSE) 최소화 렌즈',
        '도함수 판별법 및 비용-편익 극대·극소 최적화 렌즈',
      ],
      questionOptions: [
        `${cleanInterest}의 핵심 지표 변화율을 수식화할 때 오차를 최소화하는 최적 임계값은?`,
        `사전 확률이 불확실한 상태에서 베이즈 정리를 적용하여 추정 신뢰도를 극대화하는 방안은?`,
        `비선형 데이터를 지수/로그 또는 다항함수로 모델링할 때 결정계수(R²)를 높이는 전처리 기법은?`,
      ],
      recMethod: 'simulation',
      clicheTwist: {
        approach: '[수치 모델링 & 시뮬레이션 Twist]',
        subTopic: `${cleanInterest} 시스템의 파라미터 민감도 분석 및 지오지브라 수렴성 검증`,
        academicLens: '미분계수와 변화율 모델링 렌즈',
        inquiryQuestion: `투입 매개변수가 ±10% 변동할 때 시스템의 안정성이 유지되는 임계 범위는 어디까지인가?`,
      },
      motivation: `수학II 및 미적분 수업에서 도함수의 기하학적 의미와 변화율 개념을 학습하며, 단순한 수식 계산을 넘어 실세계 첨단 산업 쟁점인 '${cleanInterest}' 시스템의 오차 예측에 직접 적용해보고 싶다는 지적 호기심을 갖게 됨. 평소 희망해 온 '${targetCareer}' 진로와 목표 학과인 '${targetMajor}'의 관점에서 수학적 엄밀성을 바탕으로 최적화 모델을 수립하고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)',
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '공통수학 / 통합과학',
          focus: '기초 함수 그래프 및 일상 현상의 규칙성 포착',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 기초 통계 지표 분석 및 일차·이차함수 모델링`,
          connectionReason: '1학년 기본 교육과정 성취기준 충실 이수',
        },
        {
          grade: '2학년 (전공 심화)',
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '수학 (미적분 / 확률과 통계)',
          focus: '변화율 모델링 및 지오지브라 수치 시뮬레이션',
          topicIdea: `[수학] ${cleanInterest}의 변화율 예측과 확률적 모델링 탐구`,
          connectionReason: '고교 미적분과 확통 이론을 실세계 전공 쟁점과 결합하여 정량적 학업 역량 증명',
        },
        {
          grade: '3학년 (융합 발전)',
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '고급수학 / 인공지능 수학',
          focus: '다변수 최적화 및 경사하강법 수렴 알고리즘',
          topicIdea: `${cleanInterest} 다변수 시스템의 편미분 기반 최적화 및 이상치 대응 모델`,
          connectionReason: '단년도 탐구에 그치지 않고 심화 수학으로 이어지는 학문적 연속성',
        },
      ],
      teacherReviewPoints: {
        academic: `교과서 개념인 도함수와 조건부 확률을 실세계 '${cleanInterest}' 쟁점에 결합하여 수학적으로 모델링하고 오차를 체계적으로 고찰한 뛰어난 수리적 탐구력`,
        career: `'${targetCareer}'에 필요한 정량적 데이터 분석 태도와 논리적 추론 능력을 주도적으로 입증`,
        community: `모델링 결과를 동료들과 공유하고 검증 가능한 지표로 소통하는 열린 학문적 태도`,
      },
      relatedBooks: '《수학으로 생각하는 힘》(키트 예이츠), 《미적분의 힘》(스티븐 스트로가츠)',
      deliverables: '지오지브라/파이썬 시뮬레이션 파일, 수리 모델링 연구 보고서 5매',
    },
  };

  const scienceUnit: CurriculumUnit = {
    id: 'tailored-science',
    subjectName: isBio ? '생명과학Ⅱ · 화학Ⅱ' : isEnv ? '지구과학Ⅰ · 화학Ⅱ' : '과학/공학 (물리학Ⅱ / 화학Ⅱ / 생명과학Ⅱ)',
    subjectCategory: 'science',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: `${cleanInterest}의 물리화학적 메커니즘과 반응 속도·에너지 변환 분석`,
    unitConcepts: ['반응속도론과 활성화 에너지', '화학 평형과 르샤틀리에 원리', '열역학 엔트로피', '분자간 상호작용', '입체 장애와 활성 부위'],
    keyPrinciples: `${cleanInterest} 반응 과정에서 활성화 에너지 장벽을 낮추고 열역학적 효율을 극대화하는 물리화학적 반응 메커니즘 제어 원리`,
    samplePhenomena: [
      `온도 및 농도 변화에 따른 반응 속도 상수(k) 변화와 아레니우스 식 검증`,
      `교내 과학실 MBL 센서 장비를 활용한 에너지 수지 정량 측정`,
      `PDB 3D 분자 구조 데이터베이스를 활용한 입체 화학적 결합 메커니즘 분석`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[과학] ${cleanInterest} 시스템의 물리화학적 메커니즘과 반응 속도 분석`,
      inquiryQuestion: `${cleanInterest} 과정에서 반응 효율을 결정짓는 활성화 에너지와 외부 환경 요인(온도, pH, 농도)의 상관관계는 무엇인가?`,
      observedPhenomenon: `외부 반응 조건 변화에 따라 시스템의 활성도와 수율이 급격히 변동하는 현상`,
      phenomenaChips: [
        `온도 및 농도 변화에 따른 반응 속도 상수(k) 변화와 아레니우스 식 검증`,
        `교내 과학실 MBL 센서 장비를 활용한 에너지 수지 정량 측정`,
        `PDB 3D 분자 구조 데이터베이스를 활용한 입체 화학적 결합 메커니즘 분석`,
      ],
      selectedLens: '반응속도론(아레니우스 식) 및 열역학 에너지 준위 렌즈',
      lensOptions: [
        '반응속도론(아레니우스 식) 및 열역학 에너지 준위 렌즈',
        '분자간 인력(수소결합, 반데르발스 힘) 및 3D 입체화학 렌즈',
        '화학 평형 이동 및 르샤틀리에 원리 최적 수율 렌즈',
      ],
      questionOptions: [
        `활성화 에너지를 낮추어 반응 속도를 극대화하는 최적 촉매/구조 조건은 무엇인가?`,
        `온도 상승 시 열역학적 평형 이동과 비가역적 엔트로피 증가의 상쇄 조건은?`,
        `실험 오차를 최소화하기 위해 필수적으로 통제해야 할 환경 변인은?`,
      ],
      recMethod: 'simulation',
      clicheTwist: {
        approach: '[MBL 센서 & 분자 모델링 Twist]',
        subTopic: `${cleanInterest} 반응의 활성화 에너지 수치 계산 및 3차원 입체 결합 비교`,
        academicLens: '화학II 반응속도론 및 생명과학II 효소 활성 렌즈',
        inquiryQuestion: `외부 저해제가 투입되었을 때 반응속도 곡선(Michaelis-Menten)의 Vmax와 Km 값은 어떻게 변화하는가?`,
      },
      motivation: `과학 수업에서 화학 평형과 반응속도론 단원을 학습하며, 교과서 속 기본 반응 원리가 현대 첨단 바이오·소재 공학 분야인 '${cleanInterest}' 기술에 어떻게 직접 작동하는지 깊이 있는 의문을 품음. '${targetCareer}' 진로를 목표로 삼고 교내 과학실 장비와 학술 데이터베이스를 활용하여 검증 가능한 과학적 가설을 세워 탐구하고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)',
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '통합과학',
          focus: '물질의 규칙성과 생명 시스템의 기본 구조',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 기본 과학 원리 조사 및 문헌 보고서`,
          connectionReason: '1학년 통합과학 기본 성취기준 이수',
        },
        {
          grade: '2학년 (전공 심화)',
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: isBio ? '생명과학Ⅱ / 화학Ⅱ' : '물리학Ⅱ / 화학Ⅱ',
          focus: '반응속도론 실증 및 3D 분자 시뮬레이션',
          topicIdea: `[과학] ${cleanInterest} 시스템의 물리화학적 메커니즘과 반응 속도 분석`,
          connectionReason: '과학 선택 과목의 핵심 이론을 첨단 전공 분야와 결합한 고차원 과학 탐구력 증명',
        },
        {
          grade: '3학년 (융합 발전)',
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '융합과학탐구 / 고급생명과학',
          focus: '극한 조건에서의 안정성 및 생체 적합성 모델링',
          topicIdea: `${cleanInterest} 메커니즘의 생체 모방 및 차세대 고안정성 전달 시스템 연구`,
          connectionReason: '심화 탐구의 한계를 바탕으로 독창적 가설을 확장하는 연구자적 성장',
        },
      ],
      teacherReviewPoints: {
        academic: `교과 단원의 핵심 개념(반응속도, 평형)을 정확히 이해하고 가설 설정부터 변인 통제, 오차 고찰까지 과학적 탐구방법을 엄격히 준수한 모범적인 탐구 태도`,
        career: `'${targetCareer}'에 필요한 정밀한 과학적 관찰력과 공학적 분석 역량을 명확히 증명`,
        community: `실험실 안전 수칙을 철저히 준수하고 연구 윤리를 준수하는 성숙한 과학자 소양`,
      },
      relatedBooks: '《부분과 전체》(베르너 하이젠베르크), 《생명이란 무엇인가》(에르빈 슈뢰딩거)',
      deliverables: '변인 통제 실험 설계서, MBL 데이터 측정 결과지, 3D 분자 모델링 캡처본',
    },
  };

  const socialUnit: CurriculumUnit = {
    id: 'tailored-social',
    subjectName: '사회/윤리/경제 (생활과 윤리 / 경제 / 정치와 법)',
    subjectCategory: 'social',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: `${cleanInterest}의 사회적 도입에 따른 외부효과 내부화와 롤스의 정의론적 분배 규범`,
    unitConcepts: ['외부효과와 시장 실패', '피구세와 코스 정리', '롤스의 정의론(차등 원칙)', '제조물 책임법과 규제 샌드박스', '사회적 한계편익'],
    keyPrinciples: `${cleanInterest} 기술 도입으로 인한 사회적 편익과 부작용(외부비경제)을 경제학적 조세 제도 및 생명·기술 윤리 규범으로 조율하는 공공 거버넌스 원리`,
    samplePhenomena: [
      `신기술 도입 시 시장 실패를 교정하기 위한 최적 피구세 및 규제 모델링`,
      `최소 수혜자 보호를 위한 롤스의 정의론 4단계 검증표 적용`,
      `국내외 거버넌스 가이드라인 비교 분석 및 청소년 모의 정책 제언서 작성`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[사회/윤리] ${cleanInterest}의 사회적 도입에 따른 윤리적 딜레마와 법·제도적 보완 방안`,
      inquiryQuestion: `${cleanInterest} 기술의 상용화 과정에서 발생하는 사회적 외부불경제와 불평등을 해결하기 위한 공정한 제도적 기준은 무엇인가?`,
      observedPhenomenon: `첨단 기술의 급격한 발전 속도에 비해 법적·윤리적 안전장치가 지체되는 문화 지체(Cultural Lag) 현상`,
      phenomenaChips: [
        `신기술 도입 시 시장 실패를 교정하기 위한 최적 피구세 및 규제 모델링`,
        `최소 수혜자 보호를 위한 롤스의 정의론 4단계 검증표 적용`,
        `국내외 거버넌스 가이드라인 비교 분석 및 청소년 모의 정책 제언서 작성`,
      ],
      selectedLens: '롤스의 정의론(차등 원칙) 및 미시경제학 시장 실패 렌즈',
      lensOptions: [
        '롤스의 정의론(차등 원칙) 및 미시경제학 시장 실패 렌즈',
        '피구세 최적 세율 및 사회적 한계저감비용(MAC) 렌즈',
        '하버마스의 담론 윤리 및 기술 거버넌스 규제 샌드박스 렌즈',
      ],
      questionOptions: [
        `신기술 도입으로 인한 편익과 사회적 비용을 가장 공정하게 분배하는 법적 기준은 무엇인가?`,
        `거래 비용이 존재하는 현실 시장에서 코스 정리가 성립하기 위한 제도적 전제는?`,
        `취약 계층의 기술 접근성 격차를 해소하기 위한 공공 재정 환급 모델의 효과는?`,
      ],
      recMethod: 'practical_policy',
      clicheTwist: {
        approach: '[롤스의 정의론 & 규제 샌드박스 Twist]',
        subTopic: `${cleanInterest} 도입에 따른 취약 계층 영향 평가 및 자율 규범 헌장 제정`,
        academicLens: '생활과 윤리 정의관 및 경제 정책 렌즈',
        inquiryQuestion: `원초적 입장의 무지의 베일 아래에서 기술 수혜자와 피해자가 모두 동의할 수 있는 보상 규칙은 무엇인가?`,
      },
      motivation: `생활과 윤리 및 경제 수업을 들으며 과학기술의 진보가 사회적 정의 및 공공 복지와 충돌하는 지점에 주목하게 됨. 단순한 기술 만능주의에서 벗어나 '${cleanInterest}' 문제를 롤스의 정의론과 외부효과 이론으로 분석하여 공존 가능한 제도적 해법을 모색해보고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)',
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '통합사회',
          focus: '현대 사회의 다양한 불평등 양상과 인권 보장',
          topicIdea: `${cleanInterest.slice(0, 16)} 기술과 사회적 약자의 인권 실태 조사`,
          connectionReason: '1학년 통합사회 인권 및 정의 성취기준 충실 이수',
        },
        {
          grade: '2학년 (전공 심화)',
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '생활과 윤리 / 경제',
          focus: '외부효과 교정 및 정의론적 정책 평가',
          topicIdea: `[사회/윤리] ${cleanInterest}의 사회적 도입에 따른 윤리적 딜레마와 법·제도적 보완 방안`,
          connectionReason: '기술적 지식과 사회과학적 분석틀을 결합한 융합적 시민 역량 증명',
        },
        {
          grade: '3학년 (융합 발전)',
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '사회·문화 / 정치와 법',
          focus: '글로벌 거버넌스 및 국제 협약 모델링',
          topicIdea: `${cleanInterest}의 글로벌 파급효과와 다자간 국제 규범 제정 연구`,
          connectionReason: '국내 제도를 넘어 국제 사회 규범으로 시야를 넓히는 성숙한 지적 확장',
        },
      ],
      teacherReviewPoints: {
        academic: `기술의 사회적 영향력을 경제학과 윤리학의 이론적 틀로 비판적 분석하고 구체적 대안을 도출한 뛰어난 인문사회적 통찰력`,
        career: `'${targetCareer}'로서 기술의 파급효과와 공공성을 함께 고려하는 성숙한 가치관 입증`,
        community: `사회적 약자의 권익을 보호하고 갈등을 평화적으로 조정하려는 높은 시민 의식`,
      },
      relatedBooks: '《정의란 무엇인가》(마이클 샌델), 《기술의 충격》(케빈 켈리)',
      deliverables: '정책 가이드라인 제안서, 롤스의 정의론 4단계 검증표, 모의 토론 입론서',
    },
  };

  const koreanUnit: CurriculumUnit = {
    id: 'tailored-korean',
    subjectName: '국어 (독서 / 화법과 작문)',
    subjectCategory: 'korean',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: `${cleanInterest} 관련 전문 학술 텍스트의 논증 구조 분석 및 비판적 독해 보고서`,
    unitConcepts: ['논증의 타당성과 신뢰성', '학술 텍스트 프레이밍', '개념의 조작적 정의', '비판적 독해(Metacognition)', '정보 전달 및 설득 작문'],
    keyPrinciples: `${cleanInterest}를 다룬 KCI 선행 논문과 대중 미디어의 언어적 프레임을 교차 분석하여 개념 왜곡을 바로잡고 학술적 정합성을 검증하는 국어과 비판적 사고 원리`,
    samplePhenomena: [
      `KCI 등재 학술 논문 2편의 가설-논거-결론 논증 구조 분석도 작성`,
      `대중 매체의 자극적 프레이밍과 학술 원문의 차이점을 비교한 팩트체크 리포트`,
      `학급 급우를 대상으로 복잡한 학술 개념을 명료하게 전달하는 설명문 작성`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[국어] ${cleanInterest} 관련 최신 학술 쟁점에 대한 비판적 담화 분석 및 학술 제언문 작성`,
      inquiryQuestion: `학술 담론과 미디어 보도에서 ${cleanInterest}를 설명하는 언어적 프레임의 한계점과 대중적 오해는 무엇인가?`,
      observedPhenomenon: `전문 연구 논문의 결론이 언론 보도를 거치며 과장되거나 핵심 전제 조건이 누락되는 텍스트 왜곡 현상`,
      phenomenaChips: [
        `KCI 등재 학술 논문 2편의 가설-논거-결론 논증 구조 분석도 작성`,
        `대중 매체의 자극적 프레이밍과 학술 원문의 차이점을 비교한 팩트체크 리포트`,
        `학급 급우를 대상으로 복잡한 학술 개념을 명료하게 전달하는 설명문 작성`,
      ],
      selectedLens: '논증의 타당성/신뢰성 평가 및 텍스트 프레이밍 분석 렌즈',
      lensOptions: [
        '논증의 타당성/신뢰성 평가 및 텍스트 프레이밍 분석 렌즈',
        '학술 텍스트의 조작적 정의 및 논리적 오류 검증 렌즈',
        '수용자 중심 설명문 작성 및 메타인지 독서 렌즈',
      ],
      questionOptions: [
        `학술 원문의 논증 구조에서 핵심적인 숨은 전제와 논리적 비약은 어디에 있는가?`,
        `대중 미디어는 수용자의 공포나 기대를 자극하기 위해 어떤 어휘 프레임을 사용하는가?`,
        `비전공자 일반인에게 복잡한 전공 원리를 정확하게 전달하기 위한 최적의 글쓰기 전략은?`,
      ],
      recMethod: 'literature',
      clicheTwist: {
        approach: '[논증 구조 다이어그램 & 팩트체크 Twist]',
        subTopic: `${cleanInterest} 관련 학술 논문 2편과 기사 5편의 논증 정합성 대조 분석`,
        academicLens: '독서 교과 비판적 독해 렌즈',
        inquiryQuestion: `언론 기사에서 생략된 '오차 범위'와 '실험의 한계'가 대중의 판단을 어떻게 왜곡하는가?`,
      },
      motivation: `독서 교과에서 비판적·창의적 사고를 바탕으로 한 텍스트 분석법을 배우며, 평소 관심 분야인 '${cleanInterest}' 관련 정보가 대중에게 정확하게 전달되고 있는지 검증해보고 싶었음. 학술적 팩트와 미디어 프레이밍 사이의 간극을 비판적으로 분석하여 올바른 소통 방안을 제안하고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)',
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '국어 (공통)',
          focus: '설명문·논설문 핵심 요약 및 논리적 글쓰기',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 대중 과학 교양서 요약 및 서평`,
          connectionReason: '1학년 국어 텍스트 이해 및 독해 성취기준 이수',
        },
        {
          grade: '2학년 (전공 심화)',
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '독서 / 화법과 작문',
          focus: '학술 논문 논증 분석 및 비평문 작성',
          topicIdea: `[국어] ${cleanInterest} 관련 최신 학술 쟁점에 대한 비판적 담화 분석 및 학술 제언문 작성`,
          connectionReason: '전문 학술 텍스트를 정밀 독해하고 비판적 사고력을 발휘한 뛰어난 인문 기초 소양',
        },
        {
          grade: '3학년 (융합 발전)',
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '심화 국어 / 고전 읽기',
          focus: '학술 소통 윤리 및 공공 글쓰기 캠페인',
          topicIdea: `${cleanInterest} 쟁점의 과학 커뮤니케이션 가이드라인 및 공공 칼럼 기고`,
          connectionReason: '지적 탐구 결과를 사회적 소통으로 승화시키는 성숙한 국어과 역량',
        },
      ],
      teacherReviewPoints: {
        academic: `전문 학술 텍스트를 정확하게 독해하고 비판적 안목으로 미디어 담론의 논리적 오류를 규명해내는 탁월한 독해 및 작문 능력`,
        career: `'${targetCareer}'에게 요구되는 정확한 정보 전달 능력과 논리적 서술 태도 입증`,
        community: `대중의 올바른 이해를 돕기 위해 복잡한 지식을 명료하게 전달하려는 따뜻한 배려심`,
      },
      relatedBooks: '《생각의 탄생》(로버트 루트번스타인), 《과학 콘서트》(정재승)',
      deliverables: '논증 구조 다이어그램 도표, 미디어 팩트체크 비평문 3매, 학술 설명문',
    },
  };

  const englishUnit: CurriculumUnit = {
    id: 'tailored-english',
    subjectName: '영어 (심화 영어 / 영어 독해와 작문)',
    subjectCategory: 'english',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: `${cleanInterest} 관련 글로벌 저널(Nature/Science) IMRaD 구조 분석 및 영문 초록(Abstract) 작성`,
    unitConcepts: ['IMRaD 저널 프레임워크', 'Academic Hedging(완곡어법)', '학술 코퍼스(Corpus)', 'Executive Summary', '글로벌 연구 윤리'],
    keyPrinciples: `${cleanInterest} 분야의 국제 오픈액세스 저널 원문을 분석하여 글로벌 연구 동향을 파악하고 영문 초록 및 학술 제언문을 직접 작성하는 글로벌 학술 커뮤니케이션 원리`,
    samplePhenomena: [
      `Nature, Science 등 국제 저널 논문 2편의 IMRaD 구조 비교 및 핵심 어휘 정리`,
      `국제 학술계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제(Challenge) 분석`,
      `250단어 내외의 영문 Executive Summary 초안 작성 및 문법·어휘 감수`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[영어] ${cleanInterest} 관련 글로벌 학술 논문 초록 분석 및 영문 보고서 작성`,
      inquiryQuestion: `국제 학술계에서 가장 뜨겁게 논의되는 ${cleanInterest} 연구 트렌드와 학술 영어 수사(Academic Hedging)의 특징은 무엇인가?`,
      observedPhenomenon: `국제 학술 저널에서 연구 가설과 결론을 학술적으로 서술하기 위해 사용하는 고도의 완곡어법(Hedging expressions)`,
      phenomenaChips: [
        `Nature, Science 등 국제 저널 논문 2편의 IMRaD 구조 비교 및 핵심 어휘 정리`,
        `국제 학술계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제(Challenge) 분석`,
        `250단어 내외의 영문 Executive Summary 초안 작성 및 문법·어휘 감수`,
      ],
      selectedLens: 'IMRaD 저널 프레임워크 및 Academic Hedging 분석 렌즈',
      lensOptions: [
        'IMRaD 저널 프레임워크 및 Academic Hedging 분석 렌즈',
        'Academic Word List(AWL) 및 코퍼스 연어(Collocation) 렌즈',
        '국제 피어 리뷰(Peer Review) 연구 윤리 렌즈',
      ],
      questionOptions: [
        `해외 연구자들은 연구 결과의 한계를 서술할 때 어떤 완곡어법(suggest, indicate, likely)을 사용하는가?`,
        `IMRaD의 4개 섹션 중 연구자의 독창성이 가장 집약된 구문 구조는 무엇인가?`,
        `한국의 교육·산업 환경에 해당 글로벌 연구 결과를 적용하기 위한 영문 제언문 작성법은?`,
      ],
      recMethod: 'literature',
      clicheTwist: {
        approach: '[IMRaD 구조화 요약 & 영문 Briefing Twist]',
        subTopic: `${cleanInterest} 관련 국제 오픈액세스 저널 2편의 연구 가설과 한계점 영문 비교 리포트`,
        academicLens: 'IMRaD 프레임워크 및 학술 영어 글쓰기 렌즈',
        inquiryQuestion: `글로벌 저널 저자들은 어떤 학술적 수사를 사용하여 결론의 신뢰성을 높이는가?`,
      },
      motivation: `영어 독해와 작문 수업에서 학술 영어의 특성을 학습하며, '${cleanInterest}' 분야의 최신 연구 성과를 정확히 파악하기 위해서는 영문 SCI급 원문 자료를 직접 읽어야 한다는 필요성을 느낌. 해외 저널의 Introduction-Methods-Results-Discussion 구조를 분석하고 전공 특화 영문 요약서를 직접 작성해보고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)',
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '영어 (공통)',
          focus: '기본 어휘 및 설명문의 핵심 아이디어 파악',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 TED 강연 영문 스크립트 정독 및 요약`,
          connectionReason: '1학년 영어 독해 및 어휘 성취기준을 충실히 이수',
        },
        {
          grade: '2학년 (전공 심화)',
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '심화 영어 / 영어 독해와 작문',
          focus: 'IMRaD 구조 분석 및 250단어 영문 Executive Summary 작성',
          topicIdea: `[영어] ${cleanInterest} 관련 글로벌 학술 논문 초록 분석 및 영문 보고서 작성`,
          connectionReason: '외국어 자료를 직접 검색하여 최신 연구 동향을 파악하는 글로벌 탐구 역량',
        },
        {
          grade: '3학년 (융합 발전)',
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '심화 영어 독해 / 영어권 문화',
          focus: '국제 학술 컨퍼런스 영문 프레젠테이션 및 모의 피어 리뷰',
          topicIdea: `${cleanInterest} 관련 글로벌 학술 쟁점의 비교 문화적 담론 영문 연구`,
          connectionReason: '영어를 연구 도구로 유창하게 활용하는 글로벌 전공 적합성 입증',
        },
      ],
      teacherReviewPoints: {
        academic: `외국어 학술 자료를 직접 검색하여 심화 학문 분야의 최신 동향을 파악할 수 있는 글로벌 학문 탐구 역량`,
        career: `영어를 단순 시험 과목이 아닌 전공 연구의 도구로 능숙하게 활용한 높은 잠재력`,
        community: `복잡한 과학 학술 정보를 간결하고 정확한 영문으로 전달하는 글로벌 소통력`,
      },
      relatedBooks: '《Factfulness》(한스 로슬링 영문판), 《Academic English Writing》',
      deliverables: '전공 영문 용어집(Glossary 30선), 250단어 영문 Executive Summary, 영문 발표 슬라이드',
    },
  };

  const techUnit: CurriculumUnit = {
    id: 'tailored-tech',
    subjectName: '정보/AI (정보 / 인공지능 기초 / 데이터 과학)',
    subjectCategory: 'tech',
    gradeLevel: '고2',
    semester: '1학기',
    unitName: `${cleanInterest} 문제 해결을 위한 공공 API 연계 파이썬 알고리즘 모델링 및 탐색적 데이터 분석(EDA)`,
    unitConcepts: ['Open API 데이터 연동', '결측치 정제 및 정규화', '시간복잡도(Big-O)', '상관분석 및 시각화(Heatmap)', '머신러닝 분류기'],
    keyPrinciples: `${cleanInterest} 관련 실제 공공 데이터셋을 파이썬 Pandas/Matplotlib으로 수집·가공하여 변인 간의 상관성과 시계열 추세를 시각화하고 최적화 알고리즘으로 구조화하는 컴퓨팅 사고력`,
    samplePhenomena: [
      `공공데이터포털(data.go.kr) Open API를 연계한 ${cleanInterest} 관련 원시 데이터 자동 수집`,
      `결측치 및 이상치 정제, 피어슨 상관계수 산출 및 산점도/히트맵 대시보드 시각화`,
      `대용량 데이터 처리 시 정렬·탐색 알고리즘의 시간 복잡도(Big-O) 최적화 비교`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[정보/AI] ${cleanInterest} 문제 해결을 위한 알고리즘 흐름도 및 데이터 시각화`,
      inquiryQuestion: `실제 수집 가능한 공공 데이터셋을 가공하여 ${cleanInterest}의 핵심 패턴을 도출하고 자동화 모델로 구현 가능한가?`,
      observedPhenomenon: `${cleanInterest} 관련 원시 데이터의 대용량화에 따른 수작업 분석의 한계와 알고리즘 자동화의 필요성`,
      phenomenaChips: [
        `공공데이터포털(data.go.kr) Open API를 연계한 ${cleanInterest} 관련 원시 데이터 자동 수집`,
        `결측치 및 이상치 정제, 피어슨 상관계수 산출 및 산점도/히트맵 대시보드 시각화`,
        `대용량 데이터 처리 시 정렬·탐색 알고리즘의 시간 복잡도(Big-O) 최적화 비교`,
      ],
      selectedLens: '알고리즘 시간복잡도(Big-O) 및 탐색적 데이터 분석(EDA) 렌즈',
      lensOptions: [
        '알고리즘 시간복잡도(Big-O) 및 탐색적 데이터 분석(EDA) 렌즈',
        '머신러닝 분류기(KNN/Tree) 및 피어슨 상관분석 렌즈',
        '인공지능 데이터 편향성 및 디지털 윤리 렌즈',
      ],
      questionOptions: [
        `수작업 처리의 비효율을 개선하기 위해 어떤 입력 데이터와 알고리즘이 필요한가?`,
        `대용량 데이터셋 처리 시 메모리와 실행 시간을 최적화할 자료구조는 무엇인가?`,
        `알고리즘의 판단 결과가 특정 집단에 불리하게 작용할 위험성은 없는가?`,
      ],
      recMethod: 'public_data',
      clicheTwist: {
        approach: '[EDA 데이터 파이프라인 Twist]',
        subTopic: `${cleanInterest} 공공 API 데이터 수집-정제-상관분석 히트맵 대시보드 및 복잡도 분석`,
        academicLens: 'Big-O 시간복잡도 및 탐색적 데이터 분석(EDA) 렌즈',
        inquiryQuestion: `원시 데이터셋의 결측치와 이상치를 정제했을 때 상관계수 지표는 어떻게 보정되는가?`,
      },
      motivation: `정보 및 인공지능 기초 교과를 이수하며 컴퓨팅 기술이 현대 사회의 복잡한 문제를 해결하는 강력한 도구임을 배움. 평소 희망해 온 '${targetCareer}' 관점에서 '${cleanInterest}' 문제를 공공데이터포털의 실제 데이터셋과 파이썬 알고리즘으로 분석하여 객관적인 패턴을 도출해보고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)',
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '정보 (공통)',
          focus: '기초 프로그래밍 문법 및 순서도 작성',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 간단한 데이터 입출력 및 조건문 알고리즘`,
          connectionReason: '1학년 정보 컴퓨팅 사고력 기본 성취기준을 충실히 이수',
        },
        {
          grade: '2학년 (전공 심화)',
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '정보 / 인공지능 기초',
          focus: '공공 API 데이터 파이프라인 구축 및 Pandas 상관관계 히트맵 시각화',
          topicIdea: `[정보/AI] ${cleanInterest} 문제 해결을 위한 알고리즘 흐름도 및 데이터 시각화`,
          connectionReason: '복잡한 문제를 컴퓨팅 사고력으로 분해하고 해결 방안을 도출하는 융합 창의력',
        },
        {
          grade: '3학년 (융합 발전)',
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '데이터 과학 / 프로그래밍',
          focus: '머신러닝 예측 모델링 및 알고리즘 공정성 평가',
          topicIdea: `${cleanInterest} 예측 머신러닝 파이프라인의 데이터 편향 보정 알고리즘 연구`,
          connectionReason: '기술적 완성도와 함께 데이터 윤리를 종합적으로 구현하는 연구자적 성장',
        },
      ],
      teacherReviewPoints: {
        academic: `데이터 수집부터 정제, 시각화에 이르는 데이터 사이언스 전 주기를 독자적으로 수행한 우수한 실무 역량`,
        career: `'${targetCareer}'에 필요한 알고리즘 설계 능력과 전공 탐구 태도를 확실히 증명`,
        community: `기술적 완성도와 함께 데이터 편향성과 알고리즘 윤리를 고려하는 책임감 있는 개발자 소양`,
      },
      relatedBooks: '《알고리즘, 인생을 계산하다》(브라이언 크리스천), 《모두의 딥러닝》(조태호)',
      deliverables: 'Jupyter Notebook 파이썬 분석 코드, 상관관계 히트맵 시각화 차트, 알고리즘 명세서',
    },
  };

  return [mathUnit, scienceUnit, socialUnit, koreanUnit, englishUnit, techUnit];
}

export const CurriculumInquiryWizard: React.FC<CurriculumInquiryWizardProps> = ({
  currentStudent,
  onAddInquiryRecord,
  onSwitchToMindmap,
}) => {
  // Wizard Step (1: 단원/진로 매칭 -> 2: 질문 퍼널 -> 3: 클리셰 탈출 -> 4: 방법론 -> 5: 1페이지 기획서 & 체크리스트)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Student Custom Units State (with localStorage persistence)
  const [customUnits, setCustomUnits] = useState<CurriculumUnit[]>(() => {
    try {
      const saved = localStorage.getItem('hakjong_custom_units');
      return saved ? JSON.parse(saved) : initialCustomUnits;
    } catch {
      return initialCustomUnits;
    }
  });

  // AI Tailored Units for all 6 subjects (수학, 과학, 사회/윤리/경제, 국어, 영어, 정보/AI)
  const [tailoredUnits, setTailoredUnits] = useState<CurriculumUnit[]>(() =>
    generateInitialTailoredUnits(currentStudent)
  );

  // Tab: 'tailored' (진로·관심사 AI 심화 맞춤 6대 교과) | 'preset' (표준 교육과정 기본 단원) | 'custom' (학생 직접 등록 단원)
  const [unitTab, setUnitTab] = useState<'tailored' | 'preset' | 'custom'>('tailored');
  const [showCriteriaInfo, setShowCriteriaInfo] = useState<boolean>(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState<boolean>(false);
  const [showEasyTopicFormulaModal, setShowEasyTopicFormulaModal] = useState<boolean>(false);

  // All units combining tailored units + standard units + custom units
  const allUnits: (CurriculumUnit & { isCustom?: boolean })[] = [
    ...tailoredUnits.map((u) => ({ ...u, isCustom: false })),
    ...curriculumUnits.map((u) => ({ ...u, isCustom: false })),
    ...customUnits.map((u) => ({ ...u, isCustom: true })),
  ];

  // Best matching unit based on student's target career, major, and interest topic
  const initialBestUnit =
    tailoredUnits.find((u) => u.subjectCategory === 'science') ||
    tailoredUnits[0] ||
    findBestUnitForStudent(currentStudent, allUnits);
  const initialTailored: any =
    initialBestUnit.tailoredPlan || getTailoredPlanForStudent(currentStudent, initialBestUnit);

  // Form State for Adding New Unit
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<CurriculumUnit['subjectCategory']>('science');
  const [newGradeLevel, setNewGradeLevel] = useState<CurriculumUnit['gradeLevel']>('고2');
  const [newSemester, setNewSemester] = useState<CurriculumUnit['semester']>('1학기');
  const [newUnitName, setNewUnitName] = useState<string>('');
  const [newUnitConcepts, setNewUnitConcepts] = useState<string>('');
  const [newKeyPrinciples, setNewKeyPrinciples] = useState<string>('');
  const [newSamplePhenomena, setNewSamplePhenomena] = useState<string>('');

  // Step 1: Selected Unit & Major
  const [selectedCategory, setSelectedCategory] = useState<string>(initialBestUnit.subjectCategory);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialBestUnit.id);
  const [targetMajor, setTargetMajor] = useState<string>(currentStudent.targetMajor || '생명공학과 / 의생명과학');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(findBestTrackForStudent(currentStudent));

  // Step 2: Questioning Funnel State (Deeply Tailored to Student Profile)
  const [observedPhenomenon, setObservedPhenomenon] = useState<string>(
    initialTailored.customObserved || initialTailored.observedPhenomenon || ''
  );
  const [phenomenaChips, setPhenomenaChips] = useState<string[]>(initialTailored.phenomenaChips || []);
  const [selectedLens, setSelectedLens] = useState<string>(initialTailored.selectedLens || '');
  const [lensOptions, setLensOptions] = useState<string[]>(initialTailored.lensOptions || []);
  const [finalInquiryQuestion, setFinalInquiryQuestion] = useState<string>(
    initialTailored.finalQuestion || initialTailored.inquiryQuestion || ''
  );
  const [questionOptions, setQuestionOptions] = useState<string[]>(initialTailored.questionOptions || []);

  // Step 3: De-cliche & Twist State
  const [clicheInput, setClicheInput] = useState<string>('');
  const [matchedCliche, setMatchedCliche] = useState<ClicheItem | null>(null);
  const [selectedTwist, setSelectedTwist] = useState<{
    approach: string;
    subTopic: string;
    academicLens: string;
    inquiryQuestion: string;
  } | null>(initialTailored.clicheTwist || null);

  // Step 4: Methodology Selector State
  const [selectedMethodology, setSelectedMethodology] = useState<MethodologyType>(
    initialTailored.recMethod || (initialTailored.recommendedMethodology as MethodologyType) || 'simulation'
  );

  // Step 5: Tailored 1-Page Proposal Fields
  const [customMotivation, setCustomMotivation] = useState<string>(initialTailored.motivation || '');
  const [customSnowball, setCustomSnowball] = useState<SnowballStep[]>(initialTailored.snowballRoadmap || []);
  const [customTeacherPoints, setCustomTeacherPoints] = useState(
    initialTailored.teacherReviewPoints || {
      academic: '교과 핵심 이론을 정확하게 이해하고 실세계 데이터와 결합하여 심화 모델링을 도출하는 우수한 학업 탐구력',
      career: `'${currentStudent.targetCareer || '전문 연구원'}'에 대한 뚜렷한 진로 지향점과 전공 적합성`,
      community: '기술 발전이 사회에 미치는 파급효과와 윤리적 책임을 함께 모색하는 성숙한 공동체 의식',
    }
  );
  const [customBooks, setCustomBooks] = useState<string>(initialTailored.relatedBooks || '');

  // AI Tailoring State
  const [isAiTailoring, setIsAiTailoring] = useState<boolean>(false);
  const [aiTailorNotice, setAiTailorNotice] = useState<string | null>(null);

  // Step 5: Checklist State
  const [checklist, setChecklist] = useState({
    curriculumLinked: true,
    noProhibitedTerms: true,
    feasibleForHighSchool: true,
    originalInsight: true,
    continuousGrowth: true,
  });

  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Computed selected unit
  const currentUnit =
    allUnits.find((u) => u.id === selectedUnitId) || allUnits[0] || curriculumUnits[0];
  const currentMethodologyInfo =
    methodologyOptions.find((m) => m.type === selectedMethodology) ||
    methodologyOptions[0];

  // Best matching unit ID for highlighting
  const bestMatchingUnitId = selectedUnitId;

  // Apply full tailored plan to state
  const applyTailoredPlan = (student: Student, unit: CurriculumUnit) => {
    const plan: any = unit.tailoredPlan || getTailoredPlanForStudent(student, unit);
    setTargetMajor(student.targetMajor || '자연과학/공학 계열');
    setSelectedTrackId(findBestTrackForStudent(student));
    setObservedPhenomenon(plan.customObserved || plan.observedPhenomenon || unit.samplePhenomena[0] || '');
    setPhenomenaChips(plan.phenomenaChips?.length ? plan.phenomenaChips : unit.samplePhenomena);
    setSelectedLens(plan.selectedLens || (plan.lensOptions && plan.lensOptions[0]) || '교과 원리 모델링 렌즈');
    setLensOptions(plan.lensOptions?.length ? plan.lensOptions : ['교과 개념 융합 렌즈', '실세계 데이터 실증 렌즈', '사회 윤리 가이드라인 렌즈']);
    setFinalInquiryQuestion(plan.finalQuestion || plan.inquiryQuestion || '');
    setQuestionOptions(plan.questionOptions?.length ? plan.questionOptions : [plan.finalQuestion || plan.inquiryQuestion || '']);
    setSelectedMethodology(
      plan.recMethod || (plan.recommendedMethodology as MethodologyType) || 'simulation'
    );
    setCustomMotivation(plan.motivation || '');
    setCustomSnowball(plan.snowballRoadmap?.length ? plan.snowballRoadmap : []);
    setCustomTeacherPoints(
      plan.teacherReviewPoints || {
        academic: `${unit.subjectName}의 핵심 이론을 이해하고 실증 모델링을 도출하는 우수한 학업 탐구력`,
        career: `'${student.targetCareer}'에 대한 뚜렷한 진로 지향점과 전공 적합성`,
        community: '기술 발전이 사회에 미치는 파급효과와 윤리적 책임을 함께 모색하는 성숙한 공동체 의식',
      }
    );
    setCustomBooks(plan.relatedBooks || '');

    if (plan.clicheTwist) {
      setSelectedTwist(plan.clicheTwist);
    } else {
      const q = plan.finalQuestion || plan.inquiryQuestion || '';
      const found = clicheDatabase.find(
        (c) =>
          q.includes(c.keyword) ||
          (student.mainInterestTopic && student.mainInterestTopic.includes(c.keyword)) ||
          c.keyword.includes('유전자') ||
          c.keyword.includes('인공지능') ||
          c.keyword.includes('탄소')
      );
      if (found) {
        setMatchedCliche(found);
        if (found.twists.length > 0) {
          setSelectedTwist(found.twists[0]);
        }
      }
    }
  };

  // Fetch server tailored curriculum
  const fetchTailoredCurriculum = async (student: Student) => {
    try {
      const res = await fetch('/api/ai/wizard-tailor-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tailoredUnits && data.tailoredUnits.length > 0) {
          setTailoredUnits(data.tailoredUnits);
          const match = data.tailoredUnits.find((u: CurriculumUnit) => u.subjectCategory === selectedCategory) || data.tailoredUnits[0];
          if (match) {
            setSelectedUnitId(match.id);
            applyTailoredPlan(student, match);
          }
          return data.tailoredUnits;
        }
      }
    } catch (e) {
      console.warn('API error in wizard-tailor-curriculum, relying on client generator:', e);
    }
    return null;
  };

  // Sync student's recorded career & interest profile on change
  useEffect(() => {
    if (currentStudent) {
      const clientUnits = generateInitialTailoredUnits(currentStudent);
      setTailoredUnits(clientUnits);
      const match = clientUnits.find((u) => u.subjectCategory === selectedCategory) || clientUnits[0];
      setSelectedUnitId(match.id);
      applyTailoredPlan(currentStudent, match);

      // Async fetch enhanced Gemini tailored curriculum
      fetchTailoredCurriculum(currentStudent);
    }
  }, [
    currentStudent.id,
    currentStudent.targetCareer,
    currentStudent.mainInterestTopic,
    currentStudent.targetMajor,
    (currentStudent.interestKeywords || []).join(','),
  ]);

  // AI-powered deep tailor optimization call to server
  const handleAITailorOptimize = async () => {
    setIsAiTailoring(true);
    setAiTailorNotice(null);
    try {
      // 1. Fetch freshly optimized tailored curriculum for ALL 6 subjects
      let updatedUnits = tailoredUnits;
      const resCurr = await fetch('/api/ai/wizard-tailor-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: currentStudent }),
      });

      if (resCurr.ok) {
        const currData = await resCurr.json();
        if (currData.tailoredUnits && currData.tailoredUnits.length > 0) {
          updatedUnits = currData.tailoredUnits;
          setTailoredUnits(updatedUnits);
        }
      }

      setUnitTab('tailored');

      const activeUnit =
        updatedUnits.find((u) => u.subjectCategory === selectedCategory) ||
        updatedUnits[0];
      setSelectedUnitId(activeUnit.id);

      // 2. Deep tailor for active unit
      const res = await fetch('/api/ai/wizard-tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: currentStudent,
          unitId: activeUnit.id,
          unitName: activeUnit.unitName,
          subjectName: activeUnit.subjectName,
          category: activeUnit.subjectCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.plan) {
          const p = data.plan;
          if (p.phenomenaChips?.length) setPhenomenaChips(p.phenomenaChips);
          if (p.customObserved) setObservedPhenomenon(p.customObserved);
          if (p.observedPhenomenon) setObservedPhenomenon(p.observedPhenomenon);
          if (p.lensOptions?.length) setLensOptions(p.lensOptions);
          if (p.selectedLens) setSelectedLens(p.selectedLens);
          if (p.questionOptions?.length) setQuestionOptions(p.questionOptions);
          if (p.finalQuestion) setFinalInquiryQuestion(p.finalQuestion);
          if (p.inquiryQuestion) setFinalInquiryQuestion(p.inquiryQuestion);
          if (p.recMethod) setSelectedMethodology(p.recMethod as MethodologyType);
          if (p.recommendedMethodology) setSelectedMethodology(p.recommendedMethodology as MethodologyType);
          if (p.clicheTwist) setSelectedTwist(p.clicheTwist);
          if (p.motivation) setCustomMotivation(p.motivation);
          if (p.snowballRoadmap?.length) setCustomSnowball(p.snowballRoadmap);
          if (p.teacherReviewPoints) setCustomTeacherPoints(p.teacherReviewPoints);
          if (p.relatedBooks) setCustomBooks(p.relatedBooks);

          setAiTailorNotice(
            `✨ AI가 '${currentStudent.name}' 학생의 진로(${currentStudent.targetCareer})와 관심사("${currentStudent.mainInterestTopic?.slice(0, 18)}...")에 맞추어 수학, 과학, 사회, 국어, 영어, 정보 6개 전 교과의 단원과 세특 탐구 계획을 실시간으로 최적화했습니다!`
          );
          setTimeout(() => setAiTailorNotice(null), 6000);
          return;
        }
      }

      applyTailoredPlan(currentStudent, activeUnit);
      setAiTailorNotice(
        `✨ '${currentStudent.name}' 학생의 진로·관심사에 맞추어 6개 전 교과의 단원 및 5단계 탐구 계획이 실시간으로 최적화되었습니다!`
      );
      setTimeout(() => setAiTailorNotice(null), 5000);
    } catch (err) {
      console.warn('AI tailor fallback:', err);
      const activeUnit =
        tailoredUnits.find((u) => u.subjectCategory === selectedCategory) ||
        tailoredUnits[0];
      applyTailoredPlan(currentStudent, activeUnit);
      setAiTailorNotice(
        `✨ 6개 전 교과(${currentStudent.targetCareer} 맞춤) 단원 및 5단계 계획이 성공적으로 최적화되었습니다.`
      );
      setTimeout(() => setAiTailorNotice(null), 5000);
    } finally {
      setIsAiTailoring(false);
    }
  };

  // Filter units based on active tab and category
  const filteredUnits =
    unitTab === 'tailored'
      ? tailoredUnits.filter((u) => u.subjectCategory === selectedCategory)
      : unitTab === 'preset'
      ? curriculumUnits.filter((u) => u.subjectCategory === selectedCategory)
      : customUnits.filter(
          (u) => u.subjectCategory === selectedCategory || selectedCategory === 'all'
        );

  const handleAddCustomUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newUnitName.trim()) return;

    const parsedConcepts = newUnitConcepts
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const parsedPhenomena = newSamplePhenomena
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const created: CurriculumUnit = {
      id: `custom-unit-${Date.now()}`,
      subjectName: newSubjectName.trim(),
      subjectCategory: newSubjectCategory,
      gradeLevel: newGradeLevel,
      semester: newSemester,
      unitName: newUnitName.trim(),
      unitConcepts:
        parsedConcepts.length > 0 ? parsedConcepts : ['단원 핵심 개념', '원리 적용'],
      keyPrinciples:
        newKeyPrinciples.trim() ||
        `${newSubjectName} 단원에서 학습한 핵심 이론과 법칙`,
      samplePhenomena:
        parsedPhenomena.length > 0
          ? parsedPhenomena
          : [`${newUnitName} 원리가 적용되는 실생활 전공 쟁점 분석`],
    };

    const updated = [created, ...customUnits];
    setCustomUnits(updated);
    try {
      localStorage.setItem('hakjong_custom_units', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Select the newly created unit immediately
    setSelectedUnitId(created.id);
    setSelectedCategory(created.subjectCategory);
    setObservedPhenomenon(created.samplePhenomena[0]);
    setUnitTab('custom');
    setShowAddUnitModal(false);

    // Reset form
    setNewSubjectName('');
    setNewUnitName('');
    setNewUnitConcepts('');
    setNewKeyPrinciples('');
    setNewSamplePhenomena('');
  };

  const handleDeleteCustomUnit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customUnits.filter((u) => u.id !== id);
    setCustomUnits(updated);
    try {
      localStorage.setItem('hakjong_custom_units', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (selectedUnitId === id) {
      setSelectedUnitId(curriculumUnits[0].id);
      setObservedPhenomenon(curriculumUnits[0].samplePhenomena[0]);
    }
  };

  // Auto-detect cliche when user types in cliche input or selects phenomenon
  const handleCheckCliche = (keyword: string) => {
    setClicheInput(keyword);
    if (!keyword.trim()) {
      setMatchedCliche(null);
      return;
    }
    const found = clicheDatabase.find(
      (c) =>
        keyword.includes(c.keyword) ||
        c.keyword.includes(keyword) ||
        c.commonTopic.includes(keyword)
    );
    setMatchedCliche(found || null);
    if (found && found.twists.length > 0) {
      setSelectedTwist(found.twists[0]);
    } else {
      setSelectedTwist(null);
    }
  };

  // Generate 1-Page Proposal
  const proposalTopicTitle = selectedTwist
    ? `[${currentUnit.subjectName}] ${selectedTwist.subTopic}`
    : `[${currentUnit.subjectName}] ${currentUnit.unitName} 기반 ${targetMajor.split('/')[0].trim()} 연계 심화 탐구`;

  const proposalQuestion = selectedTwist
    ? selectedTwist.inquiryQuestion
    : finalInquiryQuestion;

  const currentSnowballSteps: SnowballStep[] = [
    {
      grade: '1학년 (기초 소양)',
      stageName: '기초 개념 정립 및 문제의식 발굴',
      subject: '통합과학 / 통합사회 / 공통수학',
      focus: '일상 현상에서 교과 기본 법칙과 호기심 발견',
      topicIdea: `${currentUnit.unitConcepts[0] || '기본 교과 개념'}의 실생활 적용 사례 조사 및 기초 원리 보고서 작성`,
      connectionReason: '고교 1학년 기본 성취기준을 충실히 이수했음을 입증하는 기초 토대',
    },
    {
      grade: '2학년 (전공 심화)',
      stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
      subject: currentUnit.subjectName,
      focus: '정량적 모델링, 실험 설계 또는 공공데이터 실증',
      topicIdea: proposalTopicTitle,
      connectionReason: `${currentUnit.keyPrinciples.slice(0, 45)}... 등의 심화 이론을 진로와 유기적으로 결합`,
    },
    {
      grade: '3학년 (융합 발전)',
      stageName: '차년도 후속 심화 및 융합 과제',
      subject: '전문교과 / 진로선택과목 / 생활과 윤리',
      focus: '한계점 극복, 정책 제언, 다학제간 융합 모델링',
      topicIdea: `${proposalTopicTitle.split(']')[1] || proposalTopicTitle}의 현실 적용 한계 보완 및 윤리적·제도적 가이드라인 연구`,
      connectionReason: '단발성 탐구로 끝나지 않고 3개년 동안 학문적 성장이 꼬리를 물고 이어지는 연속성 증명',
    },
  ];

  const handleCopyProposal = () => {
    const text = `========================================================
[교과 연계 탐구 1페이지 기획서 (선생님 제출용)]
========================================================
1. 학생 정보
- 학년/이름: ${currentStudent.grade} ${currentStudent.name}
- 희망 진로: ${currentStudent.targetCareer || '미설정'}
- 희망 전공: ${targetMajor}
- 핵심 관심 분야: ${currentStudent.mainInterestTopic || '미설정'}

2. 교과 및 단원 정보
- 연계 교과: ${currentUnit.subjectName}
- 해당 단원: ${currentUnit.unitName}
- 핵심 개념: ${currentUnit.unitConcepts.join(', ')}

3. 탐구 주제명 및 핵심 질문
- 탐구 주제: ${proposalTopicTitle}
- 핵심 질문: ${proposalQuestion}

4. 탐구 동기 및 필요성
${customMotivation}

5. 실천 방법론
- 선택 유형: ${currentMethodologyInfo.title}
- 권장 도구: ${currentMethodologyInfo.recommendedTools.join(', ')}
- 실행 단계:
${currentMethodologyInfo.actionSteps.map((s) => `  * ${s}`).join('\n')}
- 예상 산출물: ${currentMethodologyInfo.sampleDeliverable}

6. 3개년 스노우볼 연계 로드맵
- 1학년 기초: ${customSnowball[0]?.topicIdea || ''}
- 2학년 심화: ${customSnowball[1]?.topicIdea || proposalTopicTitle} (현재)
- 3학년 융합: ${customSnowball[2]?.topicIdea || ''}

7. 교사 세특 평가 포인트
- 학업역량: ${customTeacherPoints.academic}
- 전공적합성: ${customTeacherPoints.career}
- 공동체의식: ${customTeacherPoints.community}

8. 권장 도서 및 참고 자료
- ${customBooks}

9. 기재요령 준수 자가점검
- [x] 교과서 개념 명시 반영 완료
- [x] 소논문/R&E/외부 수상 등 기재금지 사항 배제
- [x] 고교생 수준에서 직접 수행 가능한 도구 사용
- [x] 단순 요약이 아닌 학생 본인의 비판적 해석 포함
========================================================`;

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  const handleAddToRecords = () => {
    const topicToAdd: SubjectInquiryTopic = {
      id: `topic-${Date.now()}`,
      subject: currentUnit.subjectName,
      subjectCategory: currentUnit.subjectCategory,
      topic: proposalTopicTitle,
      inquiryQuestion: proposalQuestion,
      methodology: `${currentMethodologyInfo.title} (${currentMethodologyInfo.recommendedTools.join(', ')})`,
      readingRecommendation: customBooks,
      recordTip: `${currentUnit.unitName}의 핵심 개념(${currentUnit.unitConcepts[0]})을 ${currentStudent.targetCareer || targetMajor}의 쟁점("${currentStudent.mainInterestTopic || observedPhenomenon}")에 적용하여, ${currentMethodologyInfo.title}로 주도적으로 검증함.`,
    };

    onAddInquiryRecord(topicToAdd);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-indigo-900/50 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>탐구 주제 정하기 어려워하는 학생을 위한 맞춤 길잡이</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              교과서 단원 선택부터 1페이지 탐구 기획서까지 5단계 완성
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              어떤 주제를 잡아야 할지 막막할 때는 관심사만 헤매지 말고, <strong>'지금 이번 주에 배우는 교과서 단원'</strong>에서 시작하세요.
              단원 개념과 진로의 2단 결합, 클리셰 탈출 차별화, 실행 가능한 방법론, 선생님 제출용 1페이지 기획서까지 체계적으로 안내합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowEasyTopicFormulaModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-indigo-500/20 hover:from-amber-500/35 hover:to-indigo-500/30 text-amber-200 hover:text-white rounded-2xl text-xs font-black border border-amber-400/40 transition-all backdrop-blur-sm shadow-sm cursor-pointer"
              title="탐구 주제 잡기가 막막한 학생을 위한 3단계 핵심 가이드"
            >
              <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>💡 3단계로 끝내는 가장 쉬운 탐구 주제 잡기 공식</span>
            </button>

            {onSwitchToMindmap && (
              <button
                type="button"
                onClick={onSwitchToMindmap}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-300" />
                <span>자유 키워드 마인드맵 보기</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Helper Banner for 3-Step Formula */}
        <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-400/35 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0 font-black text-sm">
              💡
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-200 text-xs sm:text-sm">
                  주제 정하기가 막막한가요? [1단계 이번 주 배운 단원] ➔ [2단계 내 진로 접점 질문] ➔ [3단계 실천 도구 1개] 공식
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                  학생 추천 1위
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                거창한 최신 논문 헤매기 금지! 이번 주 교과서 개념에 희망 진로를 결합하고, 지오지브라/공공데이터 그래프 1장으로 검증하세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEasyTopicFormulaModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          >
            3단계 공식 팝업 열기 ➔
          </button>
        </div>

        {/* Dynamic Student Tailoring Status Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base">
                  🎯 {currentStudent.name} 학생 맞춤 5단계 탐구 로드맵 가동 중
                </span>
                <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  100% 진로·관심사 연동
                </span>
              </div>
              <div className="text-slate-200 text-xs flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="flex items-center gap-1 font-semibold text-indigo-200">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-300" />
                  <strong>진로:</strong> {currentStudent.targetCareer || '미설정'} ({currentStudent.targetMajor})
                </span>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <span className="flex items-center gap-1 font-semibold text-amber-200">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <strong>관심사:</strong> "{currentStudent.mainInterestTopic || '미등록'}"
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => applyTailoredPlan(currentStudent, currentUnit)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all shadow-2xs"
              title="내 관심사 정보를 5단계 전 과정에 다시 적용"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-300" />
              <span>관심사 맞춤 리셋</span>
            </button>

            <button
              type="button"
              disabled={isAiTailoring}
              onClick={handleAITailorOptimize}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isAiTailoring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>AI 심화 최적화 중...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI 실시간 심화 최적화</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Tailoring Toast / Alert */}
        {aiTailorNotice && (
          <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{aiTailorNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setAiTailorNotice(null)}
              className="text-emerald-300 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 5-Step Process Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-6 mt-6 border-t border-indigo-900/40">
          {[
            { step: 1, title: '1. 교과 단원 선택', desc: '배우는 내용 기반' },
            { step: 2, title: '2. 질문 유도 퍼널', desc: '현상 관찰과 렌즈' },
            { step: 3, title: '3. 클리셰 탈출기', desc: '흔한 주제 비틀기' },
            { step: 4, title: '4. 방법론 키트', desc: '4대 실천 도구' },
            { step: 5, title: '5. 1페이지 기획서', desc: '선생님 승인 완료' },
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isPassed = currentStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`text-left p-2.5 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-sm'
                    : isPassed
                    ? 'bg-white/5 border-emerald-500/40 text-emerald-300 hover:bg-white/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>{item.title}</span>
                  {isPassed && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-[10px] opacity-80">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Curriculum-First Wizard (교과서 단원 & 진로 결합) */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>STEP 1: 교과서 단원/학습 내용 기반 역방향 매칭 (Curriculum-First)</span>
              </span>
              <h3 className="text-lg font-black text-slate-900">
                지금 수업 시간에 배우고 있는 과목과 단원을 선택하거나 직접 추가하세요
              </h3>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowCriteriaInfo(!showCriteriaInfo)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
                title="단원 선정 기준 안내"
              >
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>단원 선정 기준 안내</span>
              </button>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                {currentStudent.name} ({currentStudent.grade})
              </span>
            </div>
          </div>

          {/* Criteria Explanation Banner (Collapsible) */}
          {showCriteriaInfo && (
            <div className="bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/80 border border-indigo-200 rounded-2xl p-4 sm:p-5 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <span className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>하위 단원 선정 기준 (교육과정 및 대입 학생부종합전형 평가요소)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCriteriaInfo(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 space-y-1">
                  <span className="font-extrabold text-indigo-700 block text-xs">
                    1. 2015·2022 개정 교육과정 성취기준
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    수학Ⅱ, 미적분, 확통, 생명과학Ⅱ, 화학Ⅱ, 물리Ⅰ/Ⅱ, 생윤, 경제, 독서, 정보 등 <strong>고교 보통교과 및 진로선택과목의 핵심 성취기준</strong>을 기준으로 선정하였습니다.
                  </p>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 space-y-1">
                  <span className="font-extrabold text-indigo-700 block text-xs">
                    2. 진로 융합 모델링 연계율 (학업역량)
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    단순 암기 단원을 지양하고, <strong>변화율·최적화, 반응속도와 평형, 사회 정의와 규범, 데이터 알고리즘</strong> 등 전공 쟁점과 결합 가능한 고차원 핵심 개념 단원을 우선 배치하였습니다.
                  </p>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 space-y-1">
                  <span className="font-extrabold text-indigo-700 block text-xs">
                    3. 고교생 실천 가능성 (1~2주 소요)
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    교내 과학실 장비, 무료 공공데이터(data.go.kr), KCI 오픈액세스 논문, 시뮬레이션(지오지브라, MolView) 등으로 <strong>학생이 직접 수행할 수 있는 실행성</strong>을 갖춘 단원입니다.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-indigo-800 bg-indigo-100/50 p-2.5 rounded-xl">
                💡 <strong>안내:</strong> 교과서에 나오는 다른 단원(예: 기하, 지구과학, 사회·문화, 정치와 법, 동아시아사 등)을 탐구하고 싶으시다면, 아래 <strong>[+ 내가 직접 단원 추가하기]</strong> 탭을 통해 언제든 자유롭게 등록하실 수 있습니다!
              </div>
            </div>
          )}

          {/* Subject Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                1. 고교 교과군 선택:
              </label>
              {unitTab === 'custom' && (
                <span className="text-[11px] text-indigo-600 font-semibold">
                  등록한 단원 교과군 필터링
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'math', label: '수학' },
                { id: 'science', label: '과학' },
                { id: 'social', label: '사회/윤리/경제' },
                { id: 'korean', label: '국어' },
                { id: 'english', label: '영어' },
                { id: 'tech', label: '정보/AI' },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      const listToSearch =
                        unitTab === 'tailored'
                          ? tailoredUnits
                          : unitTab === 'preset'
                          ? curriculumUnits
                          : customUnits;
                      const match = listToSearch.find((u) => u.subjectCategory === cat.id);
                      if (match) {
                        setSelectedUnitId(match.id);
                        applyTailoredPlan(currentStudent, match);
                      }
                    }}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {unitTab === 'tailored' && (
                      <span className={`text-[9px] font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        실시간 최적화
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unit Selection Sub-Tabs (Tailored vs Preset vs Custom Units) */}
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
                <button
                  type="button"
                  onClick={() => {
                    setUnitTab('tailored');
                    const match = tailoredUnits.find((u) => u.subjectCategory === selectedCategory) || tailoredUnits[0];
                    if (match) {
                      setSelectedUnitId(match.id);
                      applyTailoredPlan(currentStudent, match);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    unitTab === 'tailored'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>✨ {currentStudent.name} 맞춤 AI 심화 교과 단원 (전 6개 교과 실시간 최적화)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUnitTab('preset');
                    const firstPreset = curriculumUnits.find(
                      (u) => u.subjectCategory === selectedCategory
                    ) || curriculumUnits[0];
                    setSelectedUnitId(firstPreset.id);
                    applyTailoredPlan(currentStudent, firstPreset);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    unitTab === 'preset'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📚 교육과정 표준 기본 단원
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUnitTab('custom');
                    if (customUnits.length > 0) {
                      const match = customUnits.find((u) => u.subjectCategory === selectedCategory) || customUnits[0];
                      setSelectedUnitId(match.id);
                      applyTailoredPlan(currentStudent, match);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    unitTab === 'custom'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>✏️ 내가 직접 등록한 단원</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-extrabold">
                    {customUnits.length}
                  </span>
                </button>
              </div>

              {/* Add Custom Unit Button */}
              <button
                type="button"
                onClick={() => setShowAddUnitModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs self-start lg:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ 새 단원 직접 추가하기</span>
              </button>
            </div>

            {/* Info notice for tailored mode */}
            {unitTab === 'tailored' && (
              <div className="p-3 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-slate-50 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-slate-800">
                    <strong>[{currentStudent.name} 학생 관심사 100% 연동]</strong> 수학, 과학, 사회, 국어, 영어, 정보 6개 전 교과의 단원과 세특 탐구 내용이 <strong>'{currentStudent.mainInterestTopic?.slice(0, 25)}...'</strong> 주제에 맞추어 실시간 최적화되었습니다.
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-xl border border-indigo-100 shrink-0 self-start sm:self-auto shadow-2xs">
                  상단 교과 탭 클릭 시 교과별 맞춤 단원 전환
                </span>
              </div>
            )}

            {/* Curriculum Unit Cards Grid */}
            {filteredUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredUnits.map((unit) => {
                  const isSelected = selectedUnitId === unit.id;
                  const isCustom = (unit as any).isCustom || unit.id.startsWith('custom-');
                  const isTailored = (unit as any).isTailored || unit.id.startsWith('tailored-');
                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        setSelectedUnitId(unit.id);
                        applyTailoredPlan(currentStudent, unit);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                            {unit.subjectName} · {unit.gradeLevel} {unit.semester}
                          </span>
                          {isTailored && (
                            <span className="text-[10px] font-black text-indigo-900 bg-gradient-to-r from-amber-200 via-indigo-100 to-purple-100 border border-indigo-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>실시간 AI 진로·관심사 최적화 단원</span>
                            </span>
                          )}
                          {!isTailored && unit.id === bestMatchingUnitId && (
                            <span className="text-[10px] font-black text-indigo-800 bg-gradient-to-r from-amber-100 to-indigo-100 border border-indigo-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>내 진로·관심사 최적 매칭</span>
                            </span>
                          )}
                          {isCustom && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                              학생 등록
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {isCustom && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomUnit(unit.id, e)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="내가 등록한 단원 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                        {unit.unitName}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                        {unit.keyPrinciples}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {unit.unitConcepts.map((concept) => (
                          <span
                            key={concept}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            #{concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center font-bold">
                  ✏️
                </div>
                <div className="text-xs text-slate-700 font-bold">
                  {unitTab === 'custom'
                    ? `선택한 교과군(${selectedCategory})에 직접 등록한 단원이 아직 없습니다.`
                    : '해당 교과군에 표시할 단원이 없습니다.'}
                </div>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  교과서 목차를 보고 지금 배우고 있는 단원을 등록해 보세요. 진로와 결합된 맞춤형 질문과 기획서를 자동으로 완성해 드립니다!
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 단원 직접 등록하기</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Custom Unit Modal / Form */}
          {showAddUnitModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                      ✍️
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        나만의 교과서 단원 직접 추가하기
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        수업 시간에 배우는 과목과 단원 정보를 입력하세요
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddUnitModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCustomUnit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        과목명 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="예: 지구과학Ⅰ, 기하, 정치와 법"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        교과군 분류
                      </label>
                      <select
                        value={newSubjectCategory}
                        onChange={(e) =>
                          setNewSubjectCategory(
                            e.target.value as CurriculumUnit['subjectCategory']
                          )
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                      >
                        <option value="math">수학</option>
                        <option value="science">과학</option>
                        <option value="social">사회/윤리/경제</option>
                        <option value="korean">국어</option>
                        <option value="english">영어</option>
                        <option value="tech">정보/AI</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        대상 학년
                      </label>
                      <select
                        value={newGradeLevel}
                        onChange={(e) =>
                          setNewGradeLevel(
                            e.target.value as CurriculumUnit['gradeLevel']
                          )
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="고1">고등학교 1학년</option>
                        <option value="고2">고등학교 2학년</option>
                        <option value="고3">고등학교 3학년</option>
                        <option value="공통">공통</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        학기
                      </label>
                      <select
                        value={newSemester}
                        onChange={(e) =>
                          setNewSemester(
                            e.target.value as CurriculumUnit['semester']
                          )
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="1학기">1학기</option>
                        <option value="2학기">2학기</option>
                        <option value="공통">공통</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      단원명 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      placeholder="예: 대기와 해양의 상호작용 (엘니뇨와 라니냐)"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      단원 핵심 개념 (쉼표로 구분)
                    </label>
                    <input
                      type="text"
                      value={newUnitConcepts}
                      onChange={(e) => setNewUnitConcepts(e.target.value)}
                      placeholder="예: 무역풍, 용승 현상, 수온 편차, 기압 배치"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      핵심 원리 설명 (수업 내용 요약)
                    </label>
                    <textarea
                      rows={2}
                      value={newKeyPrinciples}
                      onChange={(e) => setNewKeyPrinciples(e.target.value)}
                      placeholder="교과서에서 설명하는 원리를 1~2문장으로 적어보세요 (예: 대기 순환과 해양 표층 수온 간의 피드백 작용으로 발생하는 기후 변동)"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      관련 일상/전공 현상 예시 (줄바꿈으로 구분)
                    </label>
                    <textarea
                      rows={2}
                      value={newSamplePhenomena}
                      onChange={(e) => setNewSamplePhenomena(e.target.value)}
                      placeholder="예: 엘니뇨 시기 동태평양 어획량 급감과 페루 연안 영양염류 용승 차단 분석"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddUnitModal(false)}
                      className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-xs"
                    >
                      단원 저장 및 적용하기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Target Major and Career 2-Step Combination */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>3. 학생의 희망 진로 계열과 2단 결합 (Slot Combiner):</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">
                단원 개념 + 진로 관심사 자동 합성
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {majorTrackCategories.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setTargetMajor(track.targetMajors[0]);
                  }}
                  className={`text-left p-2.5 rounded-xl text-xs border transition-all ${
                    selectedTrackId === track.id
                      ? 'bg-white border-indigo-500 text-indigo-900 font-bold shadow-xs ring-1 ring-indigo-300'
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{track.badge}</span>
                    <span className="text-[10px] text-slate-400">
                      {track.targetMajors.length}개 학과
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {track.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="text"
                value={targetMajor}
                onChange={(e) => setTargetMajor(e.target.value)}
                placeholder="희망 학과 직접 입력 (예: 생명공학과, 인공지능데이터융합, 경제학과)"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-semibold"
              />
            </div>
          </div>

          {/* Slot Preview Box */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                💡 2단 결합 미리보기
              </span>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                <span className="text-indigo-700">[{currentUnit.unitName}]</span>
                {' + '}
                <span className="text-purple-700">[{targetMajor}]</span>
                {' = '}
                <span className="text-slate-800">
                  교과 개념을 전공 쟁점에 적용하는 맞춤형 질문 도출 가능
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setObservedPhenomenon(currentUnit.samplePhenomena[0]);
                setCurrentStep(2);
              }}
              className="flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all"
            >
              <span>질문 유도 퍼널로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 3-Step Questioning Funnel (현상 관찰 -> 교과 렌즈 -> 질문 템플릿) */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>STEP 2: 3단계 질문 유도 퍼널 (Questioning Funnel)</span>
              </span>
              <h3 className="text-lg font-black text-slate-900">
                현상을 관찰하고 교과의 눈(학문적 렌즈)으로 질문을 좁히세요
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold self-start sm:self-auto"
            >
              ← 이전 (단원 다시 선택)
            </button>
          </div>

          {/* Sub-step 1: Phenomenon Observation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-black">
                  1
                </span>
                <span>[현상 포착] 일상이나 최신 뉴스에서 관찰되는 구체적 현상/쟁점:</span>
              </span>
              <span className="text-[11px] text-slate-500">클릭하여 선택 또는 직접 수정</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentUnit.samplePhenomena.map((ph) => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => setObservedPhenomenon(ph)}
                  className={`text-left p-3 rounded-xl text-xs border transition-all ${
                    observedPhenomenon === ph
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold ring-1 ring-indigo-200 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {ph}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <textarea
                value={observedPhenomenon}
                onChange={(e) => setObservedPhenomenon(e.target.value)}
                rows={2}
                placeholder="직접 관찰한 현상을 적어보세요 (예: 특정 의약품의 보관 온도에 따른 분해나 가격 변동)"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          {/* Sub-step 2: Academic Lens Selector */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-black">
                2
              </span>
              <span>[교과 렌즈] 이 현상을 교과의 어떤 시각으로 분석할 것인가?</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { title: '수리적 최적화·변화율', desc: '함수, 미분, 확률로 모델링' },
                { title: '물리화학적 메커니즘', desc: '분자 반응속도, 구조 규명' },
                { title: '사회 윤리적 정의와 규범', desc: '롤스의 정의론, 기본권' },
                { title: '공공데이터 상관관계', desc: '통계 지표 수집 및 시각화' },
              ].map((lens) => (
                <button
                  key={lens.title}
                  type="button"
                  onClick={() => setSelectedLens(lens.title)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedLens === lens.title
                      ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold ring-1 ring-purple-200 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{lens.title}</div>
                  <div className="text-[10px] text-slate-500">{lens.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-step 3: Final Question Template */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-black">
                  3
                </span>
                <span>[나만의 완성형 탐구 질문 템플릿]</span>
              </span>
              <span className="text-[11px] text-indigo-600 font-bold">
                [현상] + [교과 개념] + [해결 방안/원인 규명]
              </span>
            </div>

            <textarea
              value={finalInquiryQuestion}
              onChange={(e) => setFinalInquiryQuestion(e.target.value)}
              rows={3}
              className="w-full p-3.5 text-sm bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 shadow-2xs"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-xs text-indigo-800">
                💡 <strong>팁:</strong> '왜 그런가?' 혹은 '어떤 함수/원리로 오차를 최소화할 수 있는가?'처럼 구체적인 의문문으로 끝맺을 때 가장 높은 평가를 받습니다.
              </div>

              <button
                type="button"
                onClick={() => {
                  handleCheckCliche(finalInquiryQuestion);
                  setCurrentStep(3);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <span>클리셰 점검 및 탈출기로 이동</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: De-cliche & Twist Filter (클리셰 탈출기) */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>STEP 3: 클리셰 탈출기 (De-cliché Engine) & 차별화 한 끗</span>
              </span>
              <h3 className="text-lg font-black text-slate-900">
                매년 수천 명이 하는 흔한 주제인가요? 3가지 변주(Twist)로 차별화하세요
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold self-start sm:self-auto"
            >
              ← 이전 (질문 다시 다듬기)
            </button>
          </div>

          {/* Quick Preset Cliche Selector */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              대표적인 흔한 주제(클리셰) 자가 점검:
            </span>
            <div className="flex flex-wrap gap-2">
              {clicheDatabase.map((cliche) => (
                <button
                  key={cliche.id}
                  type="button"
                  onClick={() => {
                    setClicheInput(cliche.keyword);
                    setMatchedCliche(cliche);
                    setSelectedTwist(cliche.twists[0]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    matchedCliche?.id === cliche.id
                      ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ⚠️ {cliche.keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Cliche Warning Banner */}
          {matchedCliche && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>감지된 전형적 주제: '{matchedCliche.commonTopic}'</span>
              </div>
              <p className="leading-relaxed text-amber-900">{matchedCliche.whyCliche}</p>
            </div>
          )}

          {/* 3 Twists Options */}
          {matchedCliche && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>입학사정관을 사로잡는 3가지 차별화 변주 (아래 중 하나를 선택하세요):</span>
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  원클릭 적용
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {matchedCliche.twists.map((twist, idx) => {
                  const isSelected = selectedTwist?.subTopic === twist.subTopic;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTwist(twist)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200 shadow-xs'
                          : 'border-slate-200 hover:border-indigo-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                            {twist.approach}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 mb-2 leading-snug">
                          {twist.subTopic}
                        </h4>
                        <div className="text-[11px] text-slate-600 mb-2">
                          <strong className="text-slate-800">학문적 렌즈: </strong>
                          {twist.academicLens}
                        </div>
                        <div className="text-[11px] text-indigo-900 bg-white/80 p-2 rounded-lg border border-indigo-100">
                          <strong className="block mb-0.5 text-indigo-700 font-bold">
                            핵심 질문:
                          </strong>
                          {twist.inquiryQuestion}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                        <span
                          className={`text-[11px] font-bold ${
                            isSelected ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        >
                          {isSelected ? '선택됨 ✓' : '이 변주로 선택'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If No Cliche Matched */}
          {!matchedCliche && (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block text-emerald-900">
                  독창적인 주제 질문입니다!
                </strong>
                <p className="leading-relaxed">
                  현재 설정된 질문: <strong>"{finalInquiryQuestion}"</strong>은 클리셰 DB에 걸리지 않는 신선한 시각입니다.
                  원하시면 위 프리셋 중 관심 키워드를 클릭해 변주 사례를 둘러보거나 바로 방법론 선택으로 넘어가실 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* Action to Step 4 */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {selectedTwist
                ? `선택된 차별화 주제: '${selectedTwist.subTopic.slice(0, 30)}...'`
                : '현재 질문을 그대로 유지하고 진행합니다'}
            </span>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <span>4대 실천 방법론 선택으로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: High School 4-Type Methodology Kit (방법론 선택) */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-1">
                <FlaskConical className="w-4 h-4" />
                <span>STEP 4: 고교생 맞춤 4대 탐구 방법론 키트 (Methodology Kit)</span>
              </span>
              <h3 className="text-lg font-black text-slate-900">
                1~2주 안에 실제로 보고서로 완성할 수 있는 현실적인 방법을 선택하세요
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold self-start sm:self-auto"
            >
              ← 이전 (클리셰 탈출기)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methodologyOptions.map((opt) => {
              const isSelected = selectedMethodology === opt.type;
              return (
                <div
                  key={opt.type}
                  onClick={() => setSelectedMethodology(opt.type)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${opt.badgeColor}`}>
                        {opt.title}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-800 mb-2 leading-snug">
                      {opt.shortDesc}
                    </p>

                    <div className="text-[11px] text-slate-500 mb-3">
                      <strong>적합 계열: </strong>
                      <span>{opt.suitableFor}</span>
                    </div>

                    {/* Step-by-step procedure */}
                    <div className="bg-white/80 p-3 rounded-xl border border-slate-100 space-y-1.5 mb-3 text-[11px] text-slate-600">
                      <strong className="text-slate-700 block text-xs">
                        📋 단계별 실행 매뉴얼:
                      </strong>
                      {opt.actionSteps.map((step, sIdx) => (
                        <div key={sIdx} className="leading-tight">
                          {step}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-600">
                      <strong className="text-slate-700">🛠️ 추천 도구: </strong>
                      <span className="text-indigo-600 font-semibold">
                        {opt.recommendedTools.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      최종 산출물: {opt.sampleDeliverable.slice(0, 20)}...
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? '선택 완료 ✓' : '이 방법으로 선택'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-600">
              선택된 방법론: <strong>{currentMethodologyInfo.title}</strong>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <span>선생님 승인 체크리스트 & 1페이지 기획서 생성</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Teacher-Approval Checklist & 1-Page Proposal */}
      {currentStep === 5 && (
        <div className="space-y-6">
          {/* Checklist Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>STEP 5-A: 선생님 반려 방지 자가진단 (Teacher-Approval Checklist)</span>
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  교육부 학생부 기재요령 표준 규격 자가점검
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold self-start sm:self-auto"
              >
                ← 이전 (방법론 다시 고르기)
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: 'curriculumLinked',
                  title: '1. 교과 단원 연계성 검증',
                  desc: `선택한 교과목(${currentUnit.subjectName})의 교과서 핵심 개념(${currentUnit.unitConcepts[0]})이 연구 질문에 명시적으로 반영되었는가?`,
                },
                {
                  key: 'noProhibitedTerms',
                  title: '2. 교육부 학생부 기재 금지어 배제',
                  desc: '소논문, R&E, 학술대회, 외부 공모전 수상실적, 공인어학시험 등 대입 미반영 및 기재 금지 요소가 완전히 배제되었는가?',
                },
                {
                  key: 'feasibleForHighSchool',
                  title: '3. 고교생 직접 수행 가능성(적정성)',
                  desc: `대학원 수준의 초고가 장비나 논문 복붙이 아닌, ${currentMethodologyInfo.title} 도구로 교내 환경에서 직접 검증 가능한가?`,
                },
                {
                  key: 'originalInsight',
                  title: '4. 단순 요약이 아닌 학생 고유의 해석과 비판',
                  desc: '인터넷 백과사전 짜깁기가 아니라, 수집된 데이터나 문헌에 대해 학생 자신의 시각으로 한계점과 대안을 제시했는가?',
                },
                {
                  key: 'continuousGrowth',
                  title: '5. 3개년 스노우볼 후속 발전 가능성',
                  desc: '1학년 기초에서 출발하여 3학년 융합 과제로 꼬리를 물고 확장될 수 있는 학문적 연속성을 지니는가?',
                },
              ].map((item) => {
                const checked = (checklist as any)[item.key];
                return (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setChecklist((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <strong className="font-extrabold block text-slate-900 mb-0.5">
                        {item.title}
                      </strong>
                      <span className="text-slate-600 leading-relaxed">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 1-Page Proposal Paper Display */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
                  1-PAGE PROPOSAL FOR TEACHER
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  교과 연계 탐구 1페이지 기획서 (선생님 제출용)
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyProposal}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  {copiedProposal ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>기획서 텍스트 복사</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄하기</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToRecords}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>활동 일지 등록됨!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>내 활동 일지에 즉시 등록</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Structured Proposal Document Box */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 text-xs text-slate-800 space-y-5 font-sans">
              {/* Header Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    학생 성명
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentStudent.name} ({currentStudent.grade})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    희망 전공
                  </span>
                  <span className="font-bold text-indigo-700">
                    {targetMajor}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    연계 교과목
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentUnit.subjectName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    해당 단원
                  </span>
                  <span className="font-bold text-slate-800 truncate block">
                    {currentUnit.unitName}
                  </span>
                </div>
              </div>

              {/* Topic & Question */}
              <div className="space-y-3">
                <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100">
                  <span className="text-[11px] font-extrabold text-indigo-700 block mb-1">
                    📌 탐구 주제명 (Topic)
                  </span>
                  <div className="text-sm font-black text-slate-900">
                    {proposalTopicTitle}
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/60">
                  <span className="text-[11px] font-extrabold text-amber-900 block mb-1">
                    💡 핵심 탐구 질문 (Core Question)
                  </span>
                  <div className="text-xs font-bold text-amber-950">
                    {proposalQuestion}
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <strong className="text-slate-900 font-extrabold block text-xs mb-1">
                  1. 탐구 동기 및 교과 연계 배경
                </strong>
                <p className="leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700">
                  교과 수업 중 <strong>[{currentUnit.unitName}]</strong> 단원을 학습하며, 교과서에 소개된 <strong>[{currentUnit.unitConcepts.join(', ')}]</strong>의 원리가 실제 희망 전공({targetMajor})의 핵심 현상인 <strong>'{observedPhenomenon}'</strong>과 밀접하게 연관되어 있음을 발견함. 단순 이론 암기에서 벗어나, 고교생 수준에서 검증 가능한 질문을 세우고 실증적 탐구를 통해 교과 지식의 깊이를 확장하고자 본 연구를 기획함.
                </p>
              </div>

              {/* Methodology */}
              <div>
                <strong className="text-slate-900 font-extrabold block text-xs mb-1">
                  2. 실천 방법론 및 산출물 계획
                </strong>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700">
                      [{currentMethodologyInfo.title}]
                    </span>
                    <span className="text-slate-500">
                      · 활용 도구: {currentMethodologyInfo.recommendedTools.join(', ')}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-600 pl-2">
                    {currentMethodologyInfo.actionSteps.map((s, idx) => (
                      <div key={idx}>• {s}</div>
                    ))}
                  </div>
                  <div className="pt-1 text-[11px] text-emerald-800 font-semibold">
                    📦 예상 최종 산출물: {currentMethodologyInfo.sampleDeliverable}
                  </div>
                </div>
              </div>

              {/* 3-Year Snowball Continuity */}
              <div>
                <strong className="text-slate-900 font-extrabold block text-xs mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>3. 3개년 스노우볼(꼬리물기) 연계 로드맵</span>
                </strong>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {currentSnowballSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-extrabold">
                        <span className="text-indigo-600">{step.grade}</span>
                        <span className="text-slate-400">단계 {idx + 1}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {step.stageName}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-3">
                        {step.topicIdea}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Sign Footer */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500 text-[11px]">
                <div>
                  <span>지도교사 확인 및 세특 기록 검토 의견란</span>
                </div>
                <div className="flex items-center gap-6">
                  <span>지도교사 서명: ___________________ (인)</span>
                  <span>제출일: {new Date().toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                처음부터 다른 단원으로 다시 만들기
              </button>

              <button
                type="button"
                onClick={handleAddToRecords}
                className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>활동 일지에 등록하고 교사 피드백 요청하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💡 3단계로 끝내는 가장 쉬운 탐구 주제 잡기 공식 모달 */}
      {showEasyTopicFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-amber-300 text-xs font-black">
                    <Lightbulb className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                    <span>학종 탐구 길잡이 특강</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>💡 3단계로 끝내는 가장 쉬운 탐구 주제 잡기 공식</span>
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    거창한 최신 논문 찾지 마세요! 이번 주 교과서 + 내 진로 단어 + 무료 도구 1개면 10분 만에 합격 세특이 완성됩니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEasyTopicFormulaModal(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Golden Formula Box */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/25 to-purple-500/20 border border-amber-400/40">
                <div className="text-[11px] font-black text-amber-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>황금 탐구 공식 (Golden Inquiry Formula)</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white flex flex-wrap items-center gap-2">
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg text-amber-200">① 이번 주 배운 단원</span>
                  <span className="text-slate-400 font-normal">+</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg text-indigo-200">② 내 진로 접점 질문</span>
                  <span className="text-slate-400 font-normal">+</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg text-emerald-200">③ 실천 도구 1개</span>
                  <span className="text-slate-400 font-normal">=</span>
                  <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-lg font-black shadow-sm">
                    🎯 합격 세특 완성
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {/* 3 Steps Detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      교과서 목차에서 출발
                    </h4>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    입학사정관은 <strong>"이걸 왜 탐구했지?"</strong>라는 동기를 가장 먼저 봅니다. 인터넷 검색이 아니라 이번 주 수업 단원에서 시작해야 세특에 자연스럽게 기재됩니다.
                  </p>
                  <div className="mt-auto pt-2 bg-white/80 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-900">
                    <strong>실천 팁:</strong> 오늘 들은 수업(미적분 극한, 화학 평형, 사회 외부효과, 생명 효소 등) 교과서 단원 키워드 1개만 메모하세요.
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      내 진로 단어 결합 질문
                    </h4>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    단원 개념 뒤에 <strong>"내 희망 전공이나 관심 기술에서는 이 원리가 어떻게 쓰일까?"</strong>라는 구체적인 Why/How 질문을 붙입니다.
                  </p>
                  <div className="mt-auto pt-2 bg-white/80 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-900">
                    <strong>실전 질문 예시:</strong>
                    <ul className="list-disc pl-3.5 space-y-1 mt-1">
                      <li>(화학+의약) 링거액 삼투압과 약물 방출 속도의 상관관계</li>
                      <li>(수학+경영) 한계비용 미분값으로 최적 판매가 산출</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      고교생 실천 도구 1개 선택
                    </h4>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    논문 요약에 그치지 않고, <strong>스스로 데이터를 다뤄봤다는 증거(그래프/통계/실험)</strong> 1가지를 남기면 평가가 급상승합니다.
                  </p>
                  <div className="mt-auto pt-2 bg-white/80 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                    <strong>추천 무료 도구:</strong>
                    <ul className="list-disc pl-3.5 space-y-1 mt-1">
                      <li>지오지브라 / Desmos 시뮬레이션</li>
                      <li>공공데이터포털(data.go.kr) 엑셀 분석</li>
                      <li>KCI 무료 고교생 오픈논문 1편 비판</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Compare Good vs Bad */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>❌ 흔한 실패 패턴 vs ✅ 학종 우수 세특 패턴</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>흔한 감점 패턴 (너무 거창하거나 단순 조사)</span>
                    </div>
                    <p className="text-slate-700 font-medium">
                      "최신 인공지능과 양자컴퓨터의 미래 전망에 대해 조사함"
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ⚠️ 구체적인 교과 개념이 없고, 인터넷 기사나 나무위키를 짜깁기했다는 인상을 주어 세특 기록 시 변별력이 없습니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>학종 우수 세특 패턴 (교과 개념 + 직접 분석)</span>
                    </div>
                    <p className="text-slate-700 font-medium">
                      "수학Ⅱ 정적분 단원에서 배운 구분구적법을 활용하여 기상청 공공데이터의 태양광 발전량 누적 곡선을 지오지브라로 근사 모델링함"
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      ✨ 수업 시간 개념을 주도적으로 확장하고, 무료 툴로 그래프를 직접 산출한 과정이 돋보여 선생님이 가장 적어주기 좋습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Teacher One-Point Advice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                <span className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-black text-sm">
                  👩‍🏫
                </span>
                <div className="space-y-1">
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    현직 교사·입학사정관 원포인트 코칭
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    "선생님이 세특에 가장 적어주고 싶은 학생은 대학원 수준의 어려운 논문을 읽어온 학생이 아닙니다. 
                    <strong>'수업 중 배운 작은 공식이 내 진로 분야의 실제 문제와 어떻게 연결되는지 궁금해하며, 엑셀이나 그래프 1장으로 스스로 확인해 온 학생'</strong>입니다."
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowEasyTopicFormulaModal(false)}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
              >
                닫기
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEasyTopicFormulaModal(false);
                  setCurrentStep(1);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>✨ 지금 바로 1단계 단원 고르기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

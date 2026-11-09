import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'hakjong-compass' });
});

// Check if a real (non-placeholder) Gemini API key is provided
const hasRealApiKey =
  Boolean(process.env.GEMINI_API_KEY) &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  !process.env.GEMINI_API_KEY?.startsWith('MY_');

// Initialize Google Gen AI client with telemetry header if real API key is present
const ai = hasRealApiKey
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper: Generate Level 4 concrete action and methodology nodes for Mind Map
function createConcreteActionChildren(
  stepNum: number,
  category: string,
  cleanInterest: string,
  subjectBadge: string
) {
  const isMath = category === 'math';
  const isSci = category === 'science';
  const isSoc = category === 'social';
  const isKor = category === 'korean' || category === 'humanities';
  const isEng = category === 'english';
  const isTech = category === 'tech';

  const baseId = `${category}-act-${stepNum}-${Math.random().toString(36).slice(2, 6)}`;
  const color =
    isMath ? '#38bdf8' : isSci ? '#34d399' : isSoc ? '#fbbf24' : isKor ? '#a78bfa' : isEng ? '#c084fc' : '#fb7185';

  if (stepNum === 1) {
    return [
      {
        id: `${baseId}-1`,
        text: `[변인 정의] ${cleanInterest.slice(0, 14)} 독립·종속변수 조작적 정의 및 통제변인 리스트`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: `${cleanInterest} 현상에 관여하는 핵심 독립변수를 조작적으로 정의하고 외생 변인을 철저히 통제하는 실험/모델링 변인 설계`,
        inquiryQuestion: '연구 대상 시스템의 순수한 인과관계를 분리하여 입증하기 위한 핵심 통제 변인은 무엇인가?',
        methodology: '변인 통제 설계서 작성 및 가설 진술문 검토',
        recordTip: '현상 속에서 과학적·수학적 변수를 분해하여 조작적으로 정의하는 추상화 역량 부각',
      },
      {
        id: `${baseId}-2`,
        text: `[가설 수립] 교과 핵심 원리에 기반한 검증 가능 가설 진술문 작성`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: '단순 추측을 지양하고 교과서 개념(도함수/반응속도/롤스정의/IMRaD/알고리즘)에 기반한 반증 가능 가설 도출',
        inquiryQuestion: '선행 연구 데이터와 대비하여 본 연구에서 새롭게 검증하고자 하는 대립가설은 무엇인가?',
        methodology: '연구 가설 진술문 작성 및 이론적 배경 매핑',
        recordTip: '선행 지식에 비추어 타당한 가설을 주도적으로 수립한 논리적 사고력 입증',
      },
    ];
  }

  if (stepNum === 2) {
    return [
      {
        id: `${baseId}-1`,
        text: `[선행 논문 분석] KCI/국제 저널 선행 연구 2편 방법론 비교 Matrix 작성`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: 'RISS/DBpia 검색 논문 2편의 연구 설계, 수식, 한계점을 발췌하여 본 탐구와의 차별성을 3단 표로 구조화',
        inquiryQuestion: '기존 선행 연구들이 간과한 한계점과 고교생 수준에서 관찰 가능한 차별점은 무엇인가?',
        methodology: '선행 연구 비교 분석표(Matrix) 작성 및 한계점 비판',
        recordTip: '학술 문헌을 비판적으로 독해하고 연구의 독창적 가치를 정립한 연구자적 안목',
      },
      {
        id: `${baseId}-2`,
        text: `[교과 개념 연계] 교과서 핵심 수식/이론 유도 과정과 전공 쟁점 심화 매핑`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: '정규 교과 단원 개념을 대학 수준의 학술 이론과 유기적으로 연결하여 개념 관계도(Concept Map) 작성',
        inquiryQuestion: '교과서에 소개된 기초 법칙이 최신 학술 연구에서 어떻게 확장·응용되고 있는가?',
        methodology: '교과 개념 연계 맵 작성 및 지도 교사 피드백 수렴',
        recordTip: '교과서 원리를 대학 수준의 학술 개념과 접목하여 깊이 있게 이해한 우수한 학업 역량',
      },
    ];
  }

  if (stepNum === 3) {
    if (isMath) {
      return [
        {
          id: `${baseId}-1`,
          text: `[도구 프로토콜] 지오지브라 슬라이더 파라미터 민감도 분석 & 파이썬 시뮬레이션`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '지오지브라에서 슬라이더 변수 a, b를 동적 조작하며 임계치 변화에 따른 접선의 기울기 변동 및 수렴성 관찰',
          inquiryQuestion: '매개변수가 특정 임계치를 넘을 때 함수의 점근선과 수렴성은 어떻게 변하는가?',
          methodology: '지오지브라 동적 워크시트 제작 및 스크린샷 캡처, 파이썬 수치 시뮬레이션 코드 작성',
          recordTip: '컴퓨팅 도구를 활용하여 수학적 직관을 시각적으로 구현해내는 우수한 실증력',
        },
        {
          id: `${baseId}-2`,
          text: `[데이터 피팅] 공공 통계 원시 데이터 추출 및 최소제곱법 회귀식 산출`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '공공데이터포털(data.go.kr)에서 CSV 데이터를 수집하고 산점도를 그린 후 최소제곱법 회귀곡선 수식 유도',
          inquiryQuestion: '실제 관측 데이터에 가장 근접하는 1차/2차 다항 회귀방정식은 무엇인가?',
          methodology: 'Excel/파이썬 Pandas를 활용한 산점도 및 추세선 회귀식 산출',
          recordTip: '실제 데이터를 수학 공식과 연결하여 피팅하는 데이터 분석 실무 역량',
        },
        {
          id: `${baseId}-3`,
          text: `[오차 검증] 잔차 제곱합(RSS) 계산 및 모델 적합도(R²) 평가`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '관측값과 예측값의 잔차(Residual) 분포도를 작성하고 결정계수(R-squared)로 수학적 설명력 검증',
          inquiryQuestion: '수립된 수학적 모델이 현실 데이터를 몇 퍼센트나 설명할 수 있는가?',
          methodology: '잔차 분포도 작성 및 통계적 유의성 검토',
          recordTip: '자신의 수리 모델을 통계적 오차 지표로 냉철하게 검증하는 정직한 연구 윤리',
        },
      ];
    }
    if (isSci) {
      return [
        {
          id: `${baseId}-1`,
          text: `[변인 통제] 조작 변인과 통제 변인 설정 및 대조군 실험 프로토콜`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '온도, 농도, 조도 등 외생 변인을 일정하게 유지하는 구체적 실험 순서도 및 안전 매뉴얼 수립',
          inquiryQuestion: '예상치 못한 환경 외란을 차단할 수 있는 블라인드 대조군 설계는 무엇인가?',
          methodology: '실험 프로토콜 5단계 수립 및 교내 과학실 기자재 대여 신청',
          recordTip: '실험 설계의 정밀성과 변인 통제의 엄격함을 철저히 준수한 과학적 탐구 태도',
        },
        {
          id: `${baseId}-2`,
          text: `[측정 데이터] MBL 디지털 센서 반응 수치 및 분자 시뮬레이션 정량 측정`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '시간 경과에 따른 정량적 수치 변화를 5회 반복 측정하여 평균값, 표준편차 및 분자 3D 결합각 산출',
          inquiryQuestion: '반복 측정 간의 오차 범위는 통계적으로 허용 가능한 수준인가?',
          methodology: 'MBL 센서 측정 및 엑셀 데이터 테이블 입력, MolView 3D 분자 구조 시각화',
          recordTip: '단발성 실험이 아닌 다회 반복 측정을 통해 데이터의 신뢰도를 확보한 성실성',
        },
        {
          id: `${baseId}-3`,
          text: `[오차 분석] 실험 기구 분해능 한계에 따른 불확도 계산 및 보정`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '디지털 계측 장비의 최소 눈금 한계 및 열손실 요인을 정량 보정하여 유효숫자 단위 오차 산출',
          inquiryQuestion: '장비의 분해능 한계로 인해 발생할 수 있는 최대 오차 범위는 얼마인가?',
          methodology: '불확도 전파 법칙 적용 및 오차 보정치 산출',
          recordTip: '오차 발생 원인을 장비의 물리적 한계와 결부지어 과학적으로 해석해낸 분석력',
        },
      ];
    }
    if (isSoc) {
      return [
        {
          id: `${baseId}-1`,
          text: `[정책 비교] 국내 법령 조문과 EU/OECD 가이드라인 규제 조항 대비표 작성`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '국가법령정보센터 관련 법률안과 해외 규제 샌드박스 가이드라인의 조문별 장단점 대비표 제작',
          inquiryQuestion: '국내 포지티브 규제 체계와 글로벌 네거티브 규제 체계의 실효성 차이는 무엇인가?',
          methodology: '법령 조문 비교표 작성 및 정책 쟁점 분석 보고서 집필',
          recordTip: '철학적 규범 윤리와 실정법 조항을 융합하여 입체적으로 법리를 분석한 학업 역량',
        },
        {
          id: `${baseId}-2`,
          text: `[공공 데이터] KOSIS 소득/환경 통계 지표 상관분석 및 비용편익 분석`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '국가통계포털(KOSIS)에서 최근 5개년 수혜/피해 계층 데이터를 추출하여 정책의 경제적 타당성 검토',
          inquiryQuestion: '정책 도입에 따른 사회적 편익이 규제 준수 비용을 상회하는가?',
          methodology: 'Excel 비용편익분석(B/C Ratio) 간이 모델링 및 산점도 작성',
          recordTip: '사회적 약자 보호와 경제적 효율성을 통계 데이터로 균형 있게 검토한 정책 분석력',
        },
        {
          id: `${baseId}-3`,
          text: `[공청회 설계] 모의 이해관계자 3자 공청회 대본 및 정책 제안서 초안`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '정부, 기업, 시민단체 3자의 입장을 가상 시뮬레이션하여 상생 절충 조례안 작성',
          inquiryQuestion: '공공 안전을 보장하면서도 기술 혁신 유인을 저해하지 않는 타협안은 무엇인가?',
          methodology: '학급 모의 공청회 대본 작성 및 정책 제안서 완성',
          recordTip: '다양한 이해관계자의 입장을 균형 있게 청취하고 현실적 대안을 제시하는 협업 역량',
        },
      ];
    }
    if (isKor) {
      return [
        {
          id: `${baseId}-1`,
          text: `[논증 도식화] 툴민(Toulmin) 논증 모형을 적용한 사설 3편 타당성 분해`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '주장(Claim), 데이터(Data), 담보(Warrant) 3요소로 신문 사설을 분해하고 비형식적 논리 오류 검출',
          inquiryQuestion: '사설의 논리 전개에서 데이터와 주장 사이의 담보가 충분히 객관적인가?',
          methodology: '툴민 논증 구조도 다이어그램 작성 및 논리적 비약 검토',
          recordTip: '논증의 타당성과 설득력을 학문적 분석틀로 정밀하게 검증한 국어과 고차 사고력',
        },
        {
          id: `${baseId}-2`,
          text: `[프레이밍 분석] 언론 보도 텍스트 어휘 빈도 분석 및 프레임 편향 검증`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '주요 일간지 기사 10건에서 감정적 형용사와 과장된 수사 표현의 출현 빈도를 정량 집계',
          inquiryQuestion: '언론의 보도 프레임이 대중의 합리적 의사결정에 미치는 왜곡 효과는 무엇인가?',
          methodology: '텍스트 마이닝 워드클라우드 분석 및 비판적 담화 분석(CDA)',
          recordTip: '미디어 텍스트 뒤에 숨겨진 프레임과 수사적 장치를 날카롭게 포착한 비판적 문해력',
        },
        {
          id: `${baseId}-3`,
          text: `[학술 에세이] 과학철학적 비판이 담긴 4매 분량의 논증적 제언문 집필`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '기술 결정론을 극복하고 인간 중심의 가치를 제언하는 논리적 소논설문 완성 및 학급 발표',
          inquiryQuestion: '비전공자 청중에게 과학적 진실과 윤리적 과제를 어떻게 설득력 있게 전달할 것인가?',
          methodology: 'A4 4매 분량의 논증적 에세이 작성 및 5분 스피치 대본 완성',
          recordTip: '전문 지식을 명료하고 호소력 있는 문체로 풀어내는 우수한 작문 및 의사소통 역량',
        },
      ];
    }
    if (isEng) {
      return [
        {
          id: `${baseId}-1`,
          text: `[저널 강독] Nature/Science SCI급 오픈액세스 논문 2편 IMRaD 원문 분석`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: 'Introduction-Methods-Results-Discussion 4단 구조별 핵심 문장 추출 및 저자의 가설 검증 흐름 파악',
          inquiryQuestion: '국제 학술계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제는 무엇인가?',
          methodology: 'Google Scholar 검색 쿼리 작성 및 SCI 논문 원문 발췌 독해',
          recordTip: '해외 원문 자료를 능동적으로 탐색하여 글로벌 연구 트렌드를 파악하는 진취성',
        },
        {
          id: `${baseId}-2`,
          text: `[용어집 제작] 전공 특화 Academic Word List(AWL) 30선 및 완곡어법 해설`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: '저자가 결론을 신중하게 진술할 때 사용하는 완곡어법(Hedging: may suggest, indicate 등) 정리',
          inquiryQuestion: '저자들은 어떤 학술적 수사를 사용하여 연구 결론의 한계를 신중하게 서술하는가?',
          methodology: '전공 특화 영문 용어집(Glossary 30선) 제작 및 구문 분석 노트',
          recordTip: '고급 학술 영어 구문과 완곡어법을 정확히 이해하고 자기화한 탁월한 어학 역량',
        },
        {
          id: `${baseId}-3`,
          text: `[Executive Summary] 250단어 영문 구조화 요약서 작성 및 피어 리뷰`,
          category,
          color,
          subject: subjectBadge,
          nodeType: 'action' as const,
          detail: 'Background - Key Findings - Implications의 3단 구조로 250단어 영문 리포트 집필 및 영어 발표',
          inquiryQuestion: '논문의 핵심 결론을 명료하고 정확한 학술 영어로 어떻게 재구성할 것인가?',
          methodology: '영문 요약문 초안 작성 및 문법 검사기/사전을 통한 어휘 감수',
          recordTip: '복잡한 과학 학술 정보를 간결하고 정확한 영문으로 전달하는 글로벌 소통력',
        },
      ];
    }
    return [
      {
        id: `${baseId}-1`,
        text: `[API 파이프라인] 공공데이터포털 JSON Open API 연계 파이썬 수집 스크립트`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: '공공데이터포털(data.go.kr) 인증키를 발급받아 파이썬 requests로 실시간 데이터를 JSON으로 파싱',
        inquiryQuestion: '대용량 API 응답 데이터를 어떻게 효율적으로 메모리에 적재할 것인가?',
        methodology: 'Python Requests & JSON 파싱 스크립트 작성',
        recordTip: '공공 API를 직접 호출하고 원시 데이터를 수집하는 뛰어난 컴퓨팅 실무력',
      },
      {
        id: `${baseId}-2`,
        text: `[결측치 정제 & EDA] Pandas 데이터 정제 및 상관관계 히트맵 시각화`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: 'Pandas fillna/dropna로 결측치를 보정하고 피어슨 상관계수 행렬을 Seaborn 히트맵으로 도출',
        inquiryQuestion: '시각화된 상관관계 지표가 가설과 어떻게 일치하며 숨겨진 패턴은 무엇인가?',
        methodology: 'Jupyter Notebook 환경에서 Python Pandas/Matplotlib 스크립트 작성',
        recordTip: '데이터 수집부터 정제, 시각화에 이르는 데이터 사이언스 전 주기를 독자 수행',
      },
      {
        id: `${baseId}-3`,
        text: `[알고리즘 최적화] Big-O 시간복잡도 비교 및 분류 모델 정확도 평가`,
        category,
        color,
        subject: subjectBadge,
        nodeType: 'action' as const,
        detail: '자료구조(리스트 vs 해시)에 따른 실행 시간을 측정하고 머신러닝 분류기 정확도/재현율 평가',
        inquiryQuestion: '대용량 데이터셋 처리 시 메모리와 실행 시간을 최적화할 자료구조는 무엇인가?',
        methodology: 'Timeit 모듈 활용 알고리즘 벤치마킹 및 혼동행렬(Confusion Matrix) 도출',
        recordTip: '단순 코딩을 넘어 알고리즘의 시간·공간 복잡도를 수리적으로 분석한 전공 적합성',
      },
    ];
  }

  // Step 4
  return [
    {
      id: `${baseId}-1`,
      text: `[오차 요인 & 한계 극복] 실험·모델링 한계점 분석 및 차년도 후속 연구 질문 도출`,
      category,
      color,
      subject: subjectBadge,
      nodeType: 'action' as const,
      detail: '이상적 가정의 한계점을 객관적으로 비판하고, 차년도 3학년 진로선택과목에서 수행할 융합 심화 연구 질문 제언',
      inquiryQuestion: '본 탐구 결과의 한계를 보완하기 위해 3학년 때 다학제간으로 확장할 수 있는 연구 질문은?',
      methodology: '오차 요인 분석표 및 후속 연구 기획서 작성',
      recordTip: '오차 요인을 객관적으로 고찰하고 후속 과제를 논리적으로 도출한 성숙한 메타인지 역량',
    },
    {
      id: `${baseId}-2`,
      text: `[학생부 세특 500자 완성 문안] 동기-과정-성장-배움이 담긴 교과 세특 추천 문안`,
      category,
      color,
      subject: subjectBadge,
      nodeType: 'action' as const,
      detail: '교육부 학생부 기재요령을 100% 준수한 450~500자 분량의 격조 있는 교과 세특 추천 문안 작성',
      inquiryQuestion: '나의 지적 성장과 전공 탐구 열정을 입학사정관에게 가장 신뢰감 있게 전달하는 문안은?',
      methodology: '500자 완성형 세특 포트폴리오 문안 작성 및 지도 교사 제출',
      recordTip: '학교생활기록부 교과 세특에 즉시 반영 가능한 완성형 포트폴리오',
    },
  ];
}

// Fallback high-quality curriculum-aligned recommendations if API key is not provided or API is unreachable
function getCurriculumFallback(interest: string, targetMajor: string, grade: string, selectedSubjects: string[]) {
  const cleanInterest = interest || targetMajor || '인공지능과 데이터 과학';
  return {
    majorOverview: `${cleanInterest} 분야는 고교 교육과정의 수학적 모델링, 과학적 탐구 원리, 인문학적·사회적 윤리 고찰이 유기적으로 융합되는 대표적인 학문입니다. 학생부종합전형에서는 단순 지식 습득을 넘어 교과 개념을 실생활 문제에 적용하고 자기주도적으로 심화 탐구한 과정이 높이 평가됩니다.`,
    subjects: [
      {
        subject: '수학 (미적분 / 확률과 통계)',
        subjectCategory: 'math',
        topic: `${cleanInterest}의 변화율 예측과 확률적 의사결정 모델링 탐구`,
        inquiryQuestion: `해당 분야의 복합적 변수를 수학적 함수 및 확률 분포로 모델링할 때 오차를 최소화하는 방안은 무엇인가?`,
        methodology: '수학II/미적분의 변화율·최적화 개념 적용, R/파이썬 또는 지오지브라를 활용한 수치 시뮬레이션 및 오차 분석',
        readingRecommendation: '《수학으로 생각하는 힘》(키트 예이츠), 《통계의 미학》(최제호)',
        recordTip: '교과서에 나오는 정규분포 및 미분계수의 기하학적 의미를 전공 관심사와 연결하여 지적 호기심과 논리적 문제해결력을 입증할 수 있도록 서술',
      },
      {
        subject: '과학/공학 (통합과학 / 물리학·생명과학)',
        subjectCategory: 'science',
        topic: `${cleanInterest} 시스템의 물리적 메커니즘과 에너지 변환 효율 분석`,
        inquiryQuestion: `기존 시스템 대비 신기술 도입 시 열역학적 효율 및 생태계/생체 안정성 측면의 트레이드오프는 어떠한가?`,
        methodology: '선행 연구 논문(KCI) 비교 분석, 교내 과학 실험 장비를 활용한 소규모 모의 실험 및 변인 통제 보고서 작성',
        readingRecommendation: '《부분과 전체》(베르너 하이젠베르크), 《생명이란 무엇인가》(에르빈 슈뢰딩거)',
        recordTip: '실험 설계 시 가설 설정의 타당성과 오차 원인을 스스로 분석하고 개선책을 제시한 과학적 탐구 역량 강조',
      },
      {
        subject: '국어 (독서 / 화법과 작문)',
        subjectCategory: 'korean',
        topic: `${cleanInterest} 관련 최신 학술 쟁점에 대한 비판적 담화 분석 및 학술 제언문 작성`,
        inquiryQuestion: `미디어와 학술 담론에서 해당 기술/개념을 설명하는 프레임의 한계점과 대중적 오해는 무엇인가?`,
        methodology: '전문 학술 칼럼과 대중 기사 5편의 텍스트 구조 분석, 타당성·신뢰성 평가 기준을 적용한 비평문 작성',
        readingRecommendation: '《과학 콘서트》(정재승), 《생각의 탄생》(로버트 루트번스타인)',
        recordTip: '전문 텍스트를 정확하게 독해하고 비판적 안목으로 사회적 함의를 도출해내는 학업 기초 역량 제시',
      },
      {
        subject: '사회/윤리 (통합사회 / 생활과 윤리 / 경제)',
        subjectCategory: 'social',
        topic: `${cleanInterest}의 사회적 도입에 따른 윤리적 딜레마와 법·제도적 보완 방안`,
        inquiryQuestion: `혁신 기술 및 정책 도입 시 발생하는 수혜 집단과 소외 집단 간의 갈등을 어떻게 공정하게 조정할 것인가?`,
        methodology: '국내외 가이드라인(EU, OECD 등) 비교 고찰, 가상의 롤플레잉 토론 및 규제 샌드박스 정책 제안서 작성',
        readingRecommendation: '《정의란 무엇인가》(마이클 샌델), 《기술의 충격》(케빈 켈리)',
        recordTip: '단순 찬반 논쟁을 넘어 사회적 약자 보호와 공동체적 가치를 함께 모색하는 성숙한 시민 의식 부각',
      },
      {
        subject: '영어 (영어독해와 작문 / 심화 영어)',
        subjectCategory: 'english',
        topic: `${cleanInterest} 관련 글로벌 학술 논문(Nature/Science 등) 초록(Abstract) 분석 및 영문 보고서 작성`,
        inquiryQuestion: `국제 학술계에서 가장 뜨겁게 논의되는 글로벌 표준과 최근 연구 트렌드의 공통 키워드는 무엇인가?`,
        methodology: '국제 오픈액세스 저널 논문 2편 선정, 핵심 문맥 어휘 분석 및 연구 질문-가설-결론의 영문 구조화 요약',
        readingRecommendation: 'TED Talks 관련 강연 스크립트 정독, 《Factfulness》(한스 로슬링 영문판)',
        recordTip: '외국어 자료를 직접 검색하여 심화 학문 분야의 최신 동향을 파악할 수 있는 글로벌 학문 탐구 역량 표현',
      },
      {
        subject: '정보/융합 (정보 / 인공지능 기초 / 융합과학탐구)',
        subjectCategory: 'tech',
        topic: `${cleanInterest} 문제 해결을 위한 알고리즘 흐름도 설계 및 데이터 시각화 프로젝트`,
        inquiryQuestion: `실제 수집 가능한 공공 데이터셋을 가공하여 핵심 패턴을 도출하고 자동화 모델로 구현 가능한가?`,
        methodology: '공공데이터포털(data.go.kr) Open API 연계, 파이썬 Pandas/Matplotlib 또는 오렌지3을 활용한 탐색적 데이터 분석(EDA)',
        readingRecommendation: '《알고리즘, 인생을 계산하다》(브라이언 크리스천), 《모두의 딥러닝》(조태호)',
        recordTip: '복잡한 문제를 컴퓨팅 사고력(추상화, 알고리즘화)으로 분해하고 해결 방안을 도출하는 융합 창의력 기재',
      },
    ],
    mindmap: {
      id: 'root-1',
      text: cleanInterest,
      category: 'root',
      nodeType: 'root',
      color: '#4f46e5',
      detail: `학생 관심 분야: ${cleanInterest} (희망 진로: ${targetMajor || '관련 학과'}, 대상: ${grade})`,
      children: [
        {
          id: 'branch-math',
          text: '[수학] 미적분 · 확률과 통계',
          category: 'math',
          color: '#0284c7',
          subject: '수학 (미적분/확률과 통계)',
          nodeType: 'subject',
          detail: '수치 최적화 및 정량적 데이터 기반 검증',
          children: [
            {
              id: 'math-topic-1',
              text: `${cleanInterest}의 변화율 예측과 수리적 최적화 모델링`,
              category: 'math',
              color: '#38bdf8',
              subject: '수학 (미적분/확률과 통계)',
              nodeType: 'topic',
              detail: '해당 분야의 복합적 변수를 수학적 함수 및 확률 분포로 모델링하여 오차를 최소화하는 방안 탐구',
              inquiryQuestion: '해당 분야의 복합적 변수를 수학적 함수 및 확률 분포로 모델링할 때 오차를 최소화하는 방안은 무엇인가?',
              methodology: '수학II/미적분의 변화율·최적화 개념 적용, R/파이썬 또는 지오지브라를 활용한 수치 시뮬레이션 및 회귀분석',
              readingRecommendation: '《수학으로 생각하는 힘》(키트 예이츠), 《통계의 미학》(최제호)',
              recordTip: '교과서에 나오는 정규분포 및 미분계수의 기하학적 의미를 전공 관심사와 연결하여 지적 호기심과 논리적 문제해결력을 입증할 수 있도록 서술',
              children: [
                {
                  id: 'math-step-1',
                  text: '1단계: [문제 도출] 변인 정의 및 수리 모델 가설 설정',
                  category: 'math',
                  color: '#0284c7',
                  subject: '수학 (미적분/확률과 통계)',
                  detail: '독립변수와 종속변수를 조작적으로 정의하고 변화율에 관한 검증 가능 가설 수립',
                  inquiryQuestion: '해당 시스템의 핵심 변화율을 결정짓는 주요 수학적 매개변수는 무엇인가?',
                  methodology: '선행 문헌 데이터 추출 및 수학적 가설 진술문 작성',
                  readingRecommendation: '《수학, 인문으로 수를 읽다》',
                  recordTip: '현상 속에서 수학적 함수 관계를 포착해내는 수리적 문제 발견 역량 부각',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(1, 'math', cleanInterest, '수학 (미적분/확률과 통계)'),
                },
                {
                  id: 'math-step-2',
                  text: '2단계: [이론 고찰] 미적분·확통 교과 개념 및 선행 논문 분석',
                  category: 'math',
                  color: '#0284c7',
                  subject: '수학 (미적분/확률과 통계)',
                  detail: '도함수의 부호와 극대·극소, 조건부 확률(베이즈 정리) 공식을 학술 논문 수식과 비교 검토',
                  inquiryQuestion: '교과서의 미분방정식/확률 분포가 선행 학술 논문에서 어떻게 응용되고 있는가?',
                  methodology: 'KCI 등재 수리 모델링 논문 2편 수식 유도 과정 추적 및 검토',
                  readingRecommendation: '《미적분의 힘》(스티븐 스트로가츠)',
                  recordTip: '교과 단원 개념을 심화 학술 수식과 유기적으로 결합한 학업 성취도 입증',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(2, 'math', cleanInterest, '수학 (미적분/확률과 통계)'),
                },
                {
                  id: 'math-step-3',
                  text: '3단계: [실증 방법] 지오지브라/파이썬 수치 시뮬레이션 및 데이터 피팅',
                  category: 'math',
                  color: '#0284c7',
                  subject: '수학 (미적분/확률과 통계)',
                  detail: '공공 통계 데이터를 기반으로 산점도를 그리고 최소제곱법 회귀함수 및 시뮬레이션 구현',
                  inquiryQuestion: '매개변수 변화에 따른 결과값의 수렴/발산 추이를 그래프로 어떻게 시각화할 것인가?',
                  methodology: '지오지브라 슬라이더 기능 활용 파라미터 민감도 분석 및 파이썬 시뮬레이션',
                  readingRecommendation: '《파이썬으로 배우는 통계학》',
                  recordTip: '도구를 직접 활용하여 수치 데이터를 조작하고 시각화해내는 실증적 탐구력 기술',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(3, 'math', cleanInterest, '수학 (미적분/확률과 통계)'),
                },
                {
                  id: 'math-step-4',
                  text: '4단계: [결론·세특] 오차 분석, 모델 한계 극복 및 학생부 세특 기록화',
                  category: 'math',
                  color: '#0284c7',
                  subject: '수학 (미적분/확률과 통계)',
                  detail: '잔차 제곱합(RSS) 계산, 단순 선형 근사의 한계점 비판 및 차년도 비선형 모델 제언',
                  inquiryQuestion: '수학적 모델의 현실 적용 한계와 이를 극복하기 위한 후속 과제는 무엇인가?',
                  methodology: '상대오차 계산, 탐구 동기-실천-성장이 담긴 세특 포트폴리오 문안 작성',
                  readingRecommendation: '《통계의 미학》',
                  recordTip: '오차 요인을 수학적으로 고찰하고 후속 과제를 논리적으로 도출한 메타인지 역량',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(4, 'math', cleanInterest, '수학 (미적분/확률과 통계)'),
                },
              ],
            },
          ],
        },
        {
          id: 'branch-science',
          text: '[과학] 물리학 · 화학 · 생명과학',
          category: 'science',
          color: '#059669',
          subject: '과학/공학 (통합과학/생명과학/화학)',
          nodeType: 'subject',
          detail: '실험 설계 및 원리적 기작 규명',
          children: [
            {
              id: 'sci-topic-1',
              text: `${cleanInterest} 시스템의 물리화학적 메커니즘과 반응 효율 검증`,
              category: 'science',
              color: '#34d399',
              subject: '과학/공학 (통합과학/생명과학/화학)',
              nodeType: 'topic',
              detail: '기존 시스템 대비 신기술 도입 시 열역학적 효율 및 생태계/생체 안정성 측면의 트레이드오프 분석',
              inquiryQuestion: '기존 시스템 대비 신기술 도입 시 열역학적 효율 및 생태계/생체 안정성 측면의 트레이드오프는 어떠한가?',
              methodology: '선행 연구 논문(KCI) 비교 분석, 교내 과학 실험 장비를 활용한 소규모 모의 실험 및 변인 통제 보고서 작성',
              readingRecommendation: '《부분과 전체》(베르너 하이젠베르크), 《생명이란 무엇인가》(에르빈 슈뢰딩거)',
              recordTip: '실험 설계 시 가설 설정의 타당성과 오차 원인을 스스로 분석하고 개선책을 제시한 과학적 탐구 역량 강조',
              children: [
                {
                  id: 'sci-step-1',
                  text: '1단계: [문제 도출] 물리화학적 핵심 인과 가설 설정',
                  category: 'science',
                  color: '#059669',
                  subject: '과학/공학 (통합과학/생명과학/화학)',
                  detail: '시스템 내 에너지 전달 효율 및 화학 반응 속도에 영향을 주는 조작 변인과 통제 변인 설정',
                  inquiryQuestion: '반응 속도와 효율을 저해하는 핵심 물리화학적 장애 요인은 무엇인가?',
                  methodology: '선행 연구 사례 문헌 비교 및 실험 가설 진술문 구체화',
                  readingRecommendation: '《화학의 시대》',
                  recordTip: '일상적 현상에서 과학적 메커니즘을 발견하고 검증 가능한 가설로 변환한 창의성 기술',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(1, 'science', cleanInterest, '과학/공학 (통합과학/생명과학/화학)'),
                },
                {
                  id: 'sci-step-2',
                  text: '2단계: [이론 고찰] 르샤틀리에 원리 및 KCI 선행 논문 분석',
                  category: 'science',
                  color: '#059669',
                  subject: '과학/공학 (통합과학/생명과학/화학)',
                  detail: '화학 평형 이동, 효소 활성 에너지, 에너지 보존 법칙 등 교과 핵심 이론과 선행 연구 매핑',
                  inquiryQuestion: '최신 연구에서 제안된 신기술 분자 구조는 어떻게 반응 장벽을 낮추는가?',
                  methodology: 'PDB/NCBI 3D 분자 구조 데이터베이스 및 KCI 논문 2편 강독',
                  readingRecommendation: '《생명 최초의 30억 년》',
                  recordTip: '교과서 원리를 최신 과학 논문의 분자 수준 메커니즘과 연계 해석한 심화 탐구력',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(2, 'science', cleanInterest, '과학/공학 (통합과학/생명과학/화학)'),
                },
                {
                  id: 'sci-step-3',
                  text: '3단계: [실증 방법] 변인 통제 모의실험 및 반응 수치 정량 측정',
                  category: 'science',
                  color: '#059669',
                  subject: '과학/공학 (통합과학/생명과학/화학)',
                  detail: '온도, 농도, 촉매 유무에 따른 반응 속도 측정 또는 분자 시뮬레이션 툴 활용 정량 데이터 획득',
                  inquiryQuestion: '대조군 대비 실험군에서 나타나는 정량적 수치 차이와 오차 범위는 얼마인가?',
                  methodology: '교내 과학실 MBL 센서 또는 오픈소스 분자 시뮬레이션 소프트웨어 활용',
                  readingRecommendation: '《실험 과학 탐구 매뉴얼》',
                  recordTip: '정밀한 변인 통제와 안전 수칙 준수, 데이터 수집의 성실성을 실험 과정에서 증명',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(3, 'science', cleanInterest, '과학/공학 (통합과학/생명과학/화학)'),
                },
                {
                  id: 'sci-step-4',
                  text: '4단계: [결론·세특] 오차 원인 분석, 한계 극복 및 세특 보고서 완성',
                  category: 'science',
                  color: '#059669',
                  subject: '과학/공학 (통합과학/생명과학/화학)',
                  detail: '센서 감도 및 열손실로 인한 오차 분석, 생체 적합성/환경 안정성 종합 평가서 작성',
                  inquiryQuestion: '실험 장비의 한계점을 극복하기 위해 설계할 수 있는 2단계 후속 실험 프로토콜은?',
                  methodology: '불확도 계산 및 500자 세특 포트폴리오 문안 완성',
                  readingRecommendation: '《부분과 전체》',
                  recordTip: '실험 결과의 한계를 객관적으로 평가하고 대안적 가설을 제언한 연구자적 자질 기술',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(4, 'science', cleanInterest, '과학/공학 (통합과학/생명과학/화학)'),
                },
              ],
            },
          ],
        },
        {
          id: 'branch-social',
          text: '[사회] 통합사회 · 윤리 · 경제 · 법',
          category: 'social',
          color: '#d97706',
          subject: '사회/윤리 (통합사회/생활과 윤리/경제)',
          nodeType: 'subject',
          detail: '사회 윤리적 쟁점과 법·제도적 가이드라인',
          children: [
            {
              id: 'soc-topic-1',
              text: `${cleanInterest} 도입에 따른 윤리적 딜레마와 법·제도적 보완 방안`,
              category: 'social',
              color: '#fbbf24',
              subject: '사회/윤리 (통합사회/생활과 윤리/경제)',
              nodeType: 'topic',
              detail: '혁신 기술 및 정책 도입 시 발생하는 수혜 집단과 소외 집단 간의 갈등 조정 방안 연구',
              inquiryQuestion: '혁신 기술 및 정책 도입 시 발생하는 수혜 집단과 소외 집단 간의 갈등을 어떻게 공정하게 조정할 것인가?',
              methodology: '국내외 가이드라인(EU, OECD 등) 비교 고찰, 가상의 롤플레잉 토론 및 규제 샌드박스 정책 제안서 작성',
              readingRecommendation: '《정의란 무엇인가》(마이클 샌델), 《기술의 충격》(케빈 켈리)',
              recordTip: '단순 찬반 논쟁을 넘어 사회적 약자 보호와 공동체적 가치를 함께 모색하는 성숙한 시민 의식 부각',
              children: [
                {
                  id: 'soc-step-1',
                  text: '1단계: [문제 도출] 기술 양극화와 사회적 갈등 쟁점 발문 도출',
                  category: 'social',
                  color: '#d97706',
                  subject: '사회/윤리 (통합사회/생활과 윤리/경제)',
                  detail: '신기술 도입 시 발생하는 경제적 불평등 및 윤리적 딜레마 현황 통계 조사',
                  inquiryQuestion: '기술 수혜 계층과 소외 계층 사이의 구조적 격차를 유발하는 제도적 원인은?',
                  methodology: '통계청 소득분위별 기술 접근성 지표 및 해외 피해 사례 수집',
                  readingRecommendation: '《기술의 충격》',
                  recordTip: '현대 사회문제를 통계 데이터와 사회학적 관점으로 날카롭게 포착한 문제의식',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(1, 'social', cleanInterest, '사회/윤리 (통합사회/생활과 윤리/경제)'),
                },
                {
                  id: 'soc-step-2',
                  text: '2단계: [이론 고찰] 롤스의 정의론 및 국내외 법령 조항 비교',
                  category: 'social',
                  color: '#d97706',
                  subject: '사회/윤리 (통합사회/생활과 윤리/경제)',
                  detail: '차등 원칙과 기회 균등의 원리를 적용하여 EU 가이드라인과 국내 관련 법령 조항 대비 분석',
                  inquiryQuestion: '국내 포지티브 규제 체계와 글로벌 네거티브 규제 체계의 장단점은 무엇인가?',
                  methodology: '국가법령정보센터 법률안과 EU 입법안 조문 비교표 작성',
                  readingRecommendation: '《정의란 무엇인가》',
                  recordTip: '철학적 규범 윤리와 실정법 조항을 융합하여 입체적으로 법리를 분석한 학업 역량',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(2, 'social', cleanInterest, '사회/윤리 (통합사회/생활과 윤리/경제)'),
                },
                {
                  id: 'soc-step-3',
                  text: '3단계: [실증 방법] 모의 정책 공청회 및 규제 샌드박스 설계',
                  category: 'social',
                  color: '#d97706',
                  subject: '사회/윤리 (통합사회/생활과 윤리/경제)',
                  detail: '정부, 기업, 시민단체 3자 입장 가상 시뮬레이션 및 상생 절충안 도출',
                  inquiryQuestion: '공공 안전을 보장하면서도 기업의 기술 혁신 유인을 저해하지 않는 타협안은?',
                  methodology: '학급 모의 공청회 토론 대본 작성 및 정책 제안서 초안 작성',
                  readingRecommendation: '《로봇 시대의 법과 윤리》',
                  recordTip: '다양한 이해관계자의 입장을 균형 있게 청취하고 현실적 대안을 제시하는 협업 역량',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(3, 'social', cleanInterest, '사회/윤리 (통합사회/생활과 윤리/경제)'),
                },
                {
                  id: 'soc-step-4',
                  text: '4단계: [결론·세특] 청소년 시민 가이드라인 제언 및 세특 정리',
                  category: 'social',
                  color: '#d97706',
                  subject: '사회/윤리 (통합사회/생활과 윤리/경제)',
                  detail: '학교 및 지역사회 차원에서 실천 가능한 디지털 윤리 조례안 제언문 완성',
                  inquiryQuestion: '공동체의 지속가능성을 위해 시민들이 지켜야 할 자율 규범의 핵심 덕목은?',
                  methodology: '정책 제언문 교내 게시판 공유 및 500자 세특 기재 문안 완성',
                  readingRecommendation: '《아픔이 길이 되려면》',
                  recordTip: '공동체적 연대감과 사회적 약자에 대한 공감 능력을 바탕으로 실천적 대안을 도출함',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(4, 'social', cleanInterest, '사회/윤리 (통합사회/생활과 윤리/경제)'),
                },
              ],
            },
          ],
        },
        {
          id: 'branch-korean',
          text: '[국어] 독서 · 문학 · 화법과 작문',
          category: 'korean',
          color: '#7c3aed',
          subject: '국어 (독서/화법과 작문)',
          nodeType: 'subject',
          detail: '학술 텍스트 비판적 독해와 비평문 작성',
          children: [
            {
              id: 'kor-topic-1',
              text: `${cleanInterest} 관련 최신 학술 담론 비판적 독해 및 학술 제언문 작성`,
              category: 'humanities',
              color: '#a78bfa',
              subject: '국어 (독서/화법과 작문)',
              nodeType: 'topic',
              detail: '전문 학술 칼럼과 대중 기사의 프레임 구조를 분석하고 논리적 오류와 타당성을 평가하는 비평문 완성',
              inquiryQuestion: '미디어와 학술 담론에서 해당 기술/개념을 설명하는 프레임의 한계점과 대중적 오해는 무엇인가?',
              methodology: '전문 학술 칼럼과 대중 기사 5편의 텍스트 구조 분석, 타당성·신뢰성 평가 기준을 적용한 비평문 작성',
              readingRecommendation: '《과학 콘서트》(정재승), 《생각의 탄생》(로버트 루트번스타인)',
              recordTip: '전문 텍스트를 정확하게 독해하고 비판적 안목으로 사회적 함의를 도출해내는 학업 기초 역량 제시',
              children: [
                {
                  id: 'kor-step-1',
                  text: '1단계: [문제 도출] 대중 매체 보도의 프레이밍 편향 분석 발문',
                  category: 'humanities',
                  color: '#7c3aed',
                  subject: '국어 (독서/화법과 작문)',
                  detail: '자극적 헤드라인과 통계 과장으로 인한 대중의 공포/환상 형성 과정 문제 제기',
                  inquiryQuestion: '언론의 보도 프레임이 대중의 과학적 의사결정에 미치는 왜곡 효과는?',
                  methodology: '주요 일간지 및 인터넷 기사 10건 표본 추출 및 어휘 빈도 분석',
                  readingRecommendation: '《말이 칼이 될 때》',
                  recordTip: '미디어 텍스트 뒤에 숨겨진 프레임과 수사적 장치를 날카롭게 포착한 비판적 문해력',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(1, 'korean', cleanInterest, '국어 (독서/화법과 작문)'),
                },
                {
                  id: 'kor-step-2',
                  text: '2단계: [이론 고찰] 텍스트 구조 분석 및 비판적 담화 분석(CDA)',
                  category: 'humanities',
                  color: '#7c3aed',
                  subject: '국어 (독서/화법과 작문)',
                  detail: '주장-근거-전제의 논리적 정합성 평가 및 비형식적 오류(성급한 일반화 등) 검토',
                  inquiryQuestion: '학술 칼럼의 논리 구조와 언론 보도의 서사 구조 간의 질적 차이는 무엇인가?',
                  methodology: '툴민(Toulmin) 논증 모형을 적용한 논증 구조 도식화',
                  readingRecommendation: '《생각의 탄생》',
                  recordTip: '논증의 타당성과 설득력을 학문적 분석틀로 정밀하게 검증한 국어과 고차 사고력',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(2, 'korean', cleanInterest, '국어 (독서/화법과 작문)'),
                },
                {
                  id: 'kor-step-3',
                  text: '3단계: [실증 방법] 과학철학적 관점의 비평문 작성 및 교내 발표',
                  category: 'humanities',
                  color: '#7c3aed',
                  subject: '국어 (독서/화법과 작문)',
                  detail: '기술 결정론을 극복하고 인간 중심의 가치를 제언하는 논리적 소논설문 집필',
                  inquiryQuestion: '비전공자 청중에게 과학적 진실과 윤리적 과제를 어떻게 설득력 있게 전달할 것인가?',
                  methodology: 'A4 4매 분량의 논증적 에세이 작성 및 학급 5분 스피치 진행',
                  readingRecommendation: '《과학 혁명의 구조》',
                  recordTip: '전문 지식을 명료하고 호소력 있는 문체로 풀어내는 우수한 작문 및 의사소통 역량',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(3, 'korean', cleanInterest, '국어 (독서/화법과 작문)'),
                },
                {
                  id: 'kor-step-4',
                  text: '4단계: [결론·세특] 동료 피드백 반영 리비전 및 세특 문안 정리',
                  category: 'humanities',
                  color: '#7c3aed',
                  subject: '국어 (독서/화법과 작문)',
                  detail: '동료 학생들의 반론 질문을 수용하여 논리적 약점을 보완한 최종 수정본 완성',
                  inquiryQuestion: '타자의 비판적 시각을 수용하여 내 논리를 어떻게 더 견고하게 다듬었는가?',
                  methodology: '동료 평가 피드백 분석표 작성 및 500자 세특 기재 문안 완성',
                  readingRecommendation: '《유혹하는 글쓰기》',
                  recordTip: '타인의 비판을 겸허히 수용하고 주장의 완성도를 높여가는 지적 개방성과 성장성',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(4, 'korean', cleanInterest, '국어 (독서/화법과 작문)'),
                },
              ],
            },
          ],
        },
        {
          id: 'branch-english',
          text: '[영어] 심화 영어 · 영어독해와 작문',
          category: 'english',
          color: '#9333ea',
          subject: '영어 (영어독해와 작문/심화 영어)',
          nodeType: 'subject',
          detail: '글로벌 학술 저널 초록 독해 및 영문 리포트',
          children: [
            {
              id: 'eng-topic-1',
              text: `${cleanInterest} 글로벌 저널(Nature/Science) 초록(Abstract) 분석`,
              category: 'humanities',
              color: '#c084fc',
              subject: '영어 (영어독해와 작문/심화 영어)',
              nodeType: 'topic',
              detail: '국제 오픈액세스 저널 논문 2편을 선정하여 핵심 어휘를 파악하고 영문 구조화 요약서 작성',
              inquiryQuestion: '국제 학술계에서 가장 뜨겁게 논의되는 글로벌 표준과 최근 연구 트렌드의 공통 키워드는 무엇인가?',
              methodology: '국제 오픈액세스 저널 논문 2편 선정, 핵심 문맥 어휘 분석 및 연구 질문-가설-결론의 영문 구조화 요약',
              readingRecommendation: 'TED Talks 관련 강연 스크립트 정독, 《Factfulness》(한스 로슬링 영문판)',
              recordTip: '외국어 자료를 직접 검색하여 심화 학문 분야의 최신 동향을 파악할 수 있는 글로벌 학문 탐구 역량 표현',
              children: [
                {
                  id: 'eng-step-1',
                  text: '1단계: [문제 도출] 글로벌 학술 저널 원문 선정 및 핵심 발문',
                  category: 'humanities',
                  color: '#9333ea',
                  subject: '영어 (영어독해와 작문/심화 영어)',
                  detail: 'Nature, Science 등 국제 SCI급 저널에서 최근 3개년 오픈액세스 논문 탐색',
                  inquiryQuestion: '국제 학계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제는?',
                  methodology: 'Google Scholar 검색 쿼리 작성 및 대표 논문 2편 선정',
                  readingRecommendation: '《Academic English Writing》',
                  recordTip: '해외 원문 자료를 능동적으로 탐색하여 글로벌 연구 트렌드를 파악하는 진취성',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(1, 'english', cleanInterest, '영어 (영어독해와 작문/심화 영어)'),
                },
                {
                  id: 'eng-step-2',
                  text: '2단계: [이론 고찰] IMRaD 구조 분석 및 전공 Academic Vocabulary 정리',
                  category: 'humanities',
                  color: '#9333ea',
                  subject: '영어 (영어독해와 작문/심화 영어)',
                  detail: 'Introduction, Methods, Results, Discussion 4단 구조별 논리 전개 및 고급 접속사 분석',
                  inquiryQuestion: '저자들은 어떤 학술적 수사(Hedging expressions)를 사용하여 결론을 서술하는가?',
                  methodology: '전공 특화 영문 용어집(Glossary 30선) 제작 및 구문 분석',
                  readingRecommendation: '《Factfulness》(영문 원서)',
                  recordTip: '고급 학술 영어 구문과 완곡어법(Hedging)을 정확히 이해하고 자기화한 어학 역량',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(2, 'english', cleanInterest, '영어 (영어독해와 작문/심화 영어)'),
                },
                {
                  id: 'eng-step-3',
                  text: '3단계: [실증 방법] 영문 구조화 요약서(Executive Summary) 작성',
                  category: 'humanities',
                  color: '#9333ea',
                  subject: '영어 (영어독해와 작문/심화 영어)',
                  detail: 'Background - Key Findings - Implications의 3단 구조로 250단어 영문 리포트 집필',
                  inquiryQuestion: '논문의 핵심 결론을 명료하고 정확한 학술 영어로 어떻게 재구성할 것인가?',
                  methodology: '영문 요약문 초안 작성 및 문법 검사기/사전을 통한 어휘 감수',
                  readingRecommendation: 'TED Talks 영문 스크립트',
                  recordTip: '복잡한 과학 학술 정보를 간결하고 정확한 영문으로 전달하는 글로벌 소통력',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(3, 'english', cleanInterest, '영어 (영어독해와 작문/심화 영어)'),
                },
                {
                  id: 'eng-step-4',
                  text: '4단계: [결론·세특] 글로벌 연구 동향 브리핑 발표 및 세특 정리',
                  category: 'humanities',
                  color: '#9333ea',
                  subject: '영어 (영어독해와 작문/심화 영어)',
                  detail: '영문 프레젠테이션 슬라이드 제작 및 교내 영어 발표를 통한 동료 공유',
                  inquiryQuestion: '국제 연구 결과가 한국 사회 및 교육과정에 주는 시사점은 무엇인가?',
                  methodology: '3분 영문 스피치 및 500자 세특 기재 문안 완성',
                  readingRecommendation: '《English for Science and Engineering》',
                  recordTip: '영어를 단순 시험 과목이 아닌 전공 연구의 도구로 능숙하게 활용한 잠재력 기술',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(4, 'english', cleanInterest, '영어 (영어독해와 작문/심화 영어)'),
                },
              ],
            },
          ],
        },
        {
          id: 'branch-tech',
          text: '[정보] 정보 · 인공지능 기초 · 데이터과학',
          category: 'tech',
          color: '#e11d48',
          subject: '정보/융합 (정보/인공지능 기초)',
          nodeType: 'subject',
          detail: '공공데이터 분석 및 알고리즘 시뮬레이션',
          children: [
            {
              id: 'tech-topic-1',
              text: `${cleanInterest} 문제 해결을 위한 알고리즘 흐름도 및 데이터 시각화`,
              category: 'tech',
              color: '#fb7185',
              subject: '정보/융합 (정보/인공지능 기초)',
              nodeType: 'topic',
              detail: '공공데이터포털 Open API를 연계하여 실제 데이터를 수집하고 파이썬으로 핵심 패턴을 시각화',
              inquiryQuestion: '실제 수집 가능한 공공 데이터셋을 가공하여 핵심 패턴을 도출하고 자동화 모델로 구현 가능한가?',
              methodology: '공공데이터포털(data.go.kr) Open API 연계, 파이썬 Pandas/Matplotlib 또는 오렌지3을 활용한 탐색적 데이터 분석(EDA)',
              readingRecommendation: '《알고리즘, 인생을 계산하다》(브라이언 크리스천), 《모두의 딥러닝》(조태호)',
              recordTip: '복잡한 문제를 컴퓨팅 사고력(추상화, 알고리즘화)으로 분해하고 해결 방안을 도출하는 융합 창의력 기재',
              children: [
                {
                  id: 'tech-step-1',
                  text: '1단계: [문제 도출] 데이터 기반 문제 정의 및 요구사항 분석',
                  category: 'tech',
                  color: '#e11d48',
                  subject: '정보/융합 (정보/인공지능 기초)',
                  detail: '해당 전공 영역의 병목 현상을 자동화 또는 데이터 분석으로 해결할 필요성 도출',
                  inquiryQuestion: '수작업 처리의 비효율을 개선하기 위해 어떤 입력 데이터와 알고리즘이 필요한가?',
                  methodology: '유스케이스(Use-Case) 다이어그램 및 데이터 요구사항 명세서 작성',
                  readingRecommendation: '《알고리즘, 인생을 계산하다》',
                  recordTip: '문제를 컴퓨터가 처리할 수 있는 형태로 분해하고 모델링하는 추상화 역량 부각',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(1, 'tech', cleanInterest, '정보/융합 (정보/인공지능 기초)'),
                },
                {
                  id: 'tech-step-2',
                  text: '2단계: [이론 고찰] 알고리즘 시간복잡도(Big-O) 및 공공 API 스키마 검토',
                  category: 'tech',
                  color: '#e11d48',
                  subject: '정보/융합 (정보/인공지능 기초)',
                  detail: '정렬/탐색 알고리즘의 효율성 비교 및 공공데이터포털 JSON API 응답 규격 분석',
                  inquiryQuestion: '대용량 데이터셋 처리 시 메모리와 실행 시간을 최적화할 자료구조는?',
                  methodology: '리스트, 딕셔너리, 해시테이블 자료구조 성능 비교표 작성',
                  readingRecommendation: '《모두의 딥러닝》',
                  recordTip: '단순 코딩을 넘어 알고리즘의 시간·공간 복잡도를 수리적으로 분석한 전공 적합성',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(2, 'tech', cleanInterest, '정보/융합 (정보/인공지능 기초)'),
                },
                {
                  id: 'tech-step-3',
                  text: '3단계: [실증 방법] 파이썬 데이터 파이프라인 구축 및 대시보드 시각화',
                  category: 'tech',
                  color: '#e11d48',
                  subject: '정보/융합 (정보/인공지능 기초)',
                  detail: 'Pandas 결측치 전처리, 상관관계 히트맵 시각화 및 자동화 처리 함수 구현',
                  inquiryQuestion: '시각화된 상관관계 지표가 가설과 어떻게 일치하며 숨겨진 패턴은 무엇인가?',
                  methodology: 'Jupyter Notebook 환경에서 Python 스크립트 작성 및 시각화 차트 도출',
                  readingRecommendation: '《파이썬 데이터 분석 실무 테크닉 100》',
                  recordTip: '데이터 수집부터 정제, 시각화에 이르는 데이터 사이언스 전 주기를 독자 수행',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(3, 'tech', cleanInterest, '정보/융합 (정보/인공지능 기초)'),
                },
                {
                  id: 'tech-step-4',
                  text: '4단계: [결론·세특] 코드 리팩토링, 알고리즘 윤리 검토 및 세특 정리',
                  category: 'tech',
                  color: '#e11d48',
                  subject: '정보/융합 (정보/인공지능 기초)',
                  detail: '예외 처리(Exception handling) 추가 및 데이터 편향에 따른 차별 가능성 윤리적 고찰',
                  inquiryQuestion: '알고리즘의 판단 결과가 특정 집단에 불리하게 작용할 위험성은 없는가?',
                  methodology: 'GitHub 포트폴리오 정리 및 500자 세특 기재 문안 완성',
                  readingRecommendation: '《대량살상 수학무기》',
                  recordTip: '기술적 완성도와 함께 디지털 윤리와 사회적 파급력을 고려하는 책임감 있는 개발자 소양',
                  nodeType: 'process_step',
                  children: createConcreteActionChildren(4, 'tech', cleanInterest, '정보/융합 (정보/인공지능 기초)'),
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

// 1. API: AI 교과 연계 탐구주제 및 마인드맵 생성
app.post('/api/ai/recommend-topics', async (req, res) => {
  console.log('[API HIT] /api/ai/recommend-topics, body:', req.body);
  try {
    const { interest, grade = '고등학교 2학년', targetMajor = '', selectedSubjects = [], customKeywords = '' } = req.body;

    if (!interest && !targetMajor) {
      return res.status(400).json({ error: '관심 분야 또는 희망 전공을 입력해주세요.' });
    }

    if (!hasRealApiKey || !ai) {
      const fallback = getCurriculumFallback(interest, targetMajor, grade, selectedSubjects);
      return res.json(fallback);
    }

    const prompt = `당신은 대한민국 고등학교 학생부 종합전형(학종) 전문 진로진학 수석 컨설턴트이자 교과 교육과정 전문가입니다.
학생 정보:
- 관심 분야/연구 키워드: ${interest}
- 희망 전공: ${targetMajor || '관련 계열'}
- 학년: ${grade}
- 중점 교과: ${selectedSubjects.length > 0 ? selectedSubjects.join(', ') : '국어, 수학, 영어, 사회, 과학, 정보'}
- 추가 고려사항: ${customKeywords || '없음'}

2022/2015 개정 교육과정 및 최신 대입 학생부 종합전형 평가요소(학업역량, 진로역량, 공동체역량)를 엄격히 반영하여 교과별 연계 탐구 주제와 마인드맵 트리 데이터를 생성해주세요.
반드시 교육부 학생부 기재요령(소논문/R&E 표기 금지, 외부 수상 배제, 교과 수업 내 활동 중심)을 준수해야 합니다.

반드시 유효한 JSON 형식으로만 응답하세요:
{
  "majorOverview": "이 전공 및 관심 분야가 고교 교과와 어떻게 유기적으로 연결되는지에 대한 총평 (3~4문장)",
  "subjects": [
    {
      "subject": "교과목명 (예: 수학I/II 또는 미적분, 확률과 통계 등)",
      "subjectCategory": "math | science | korean | social | english | tech",
      "topic": "구체적이고 학술적인 탐구 주제명",
      "inquiryQuestion": "핵심 탐구 질문 (왜, 어떻게에 대한 호기심)",
      "methodology": "실천 가능한 구체적 탐구 방법론 (논문/문헌 분석, 데이터 시뮬레이션, 실험 프로토콜, 모델링 등)",
      "readingRecommendation": "연계 권장 도서 1~2권 및 학술 키워드",
      "recordTip": "학생부 세특 기록에 기재될 때 돋보이는 역량 포인트"
    }
  ],
  "mindmap": {
    "id": "root-1",
    "text": "중심 키워드",
    "category": "root",
    "color": "#4f46e5",
    "detail": "중심 테마 개요",
    "children": [
      {
        "id": "branch-1",
        "text": "1차 브랜치 (예: 수리적 모델링)",
        "category": "math",
        "color": "#0284c7",
        "detail": "설명",
        "children": [
          {
            "id": "leaf-1",
            "text": "세부 탐구 과제명",
            "category": "math",
            "color": "#38bdf8",
            "detail": "구체적 활동 및 산출물 설명"
          }
        ]
      }
    ]
  }
}
*주의: subjects 배열은 최소 5개(국어, 수학, 영어, 과학, 사회/정보) 이상 상세히 포함해야 합니다.`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned empty text');
    }

    const data = JSON.parse(text);
    const fallback = getCurriculumFallback(interest, targetMajor, grade, selectedSubjects);

    if (!data.mindmap || !data.mindmap.children || data.mindmap.children.length === 0) {
      data.mindmap = fallback.mindmap;
    } else {
      const hasDeepBranches = data.mindmap.children.some((c: any) => c.children?.[0]?.children?.length > 0);
      if (!hasDeepBranches) {
        data.mindmap = fallback.mindmap;
      }
    }

    return res.json(data);
  } catch (error) {
    console.error('Error in recommend-topics, serving curriculum fallback:', (error as any)?.message || error);
    const { interest = '', targetMajor = '', grade = '고등학교 2학년', selectedSubjects = [] } = req.body || {};
    const fallback = getCurriculumFallback(interest, targetMajor, grade, selectedSubjects);
    return res.json(fallback);
  }
});

// 2. API: 교사용 세특 피드백 및 학생부 기재 문안 추천
app.post('/api/ai/coach-feedback', async (req, res) => {
  try {
    const {
      studentName = '학생',
      grade = '고2',
      major = '미정',
      subject = '공통',
      activityTitle,
      activityContent,
      teacherNotes = '',
    } = req.body;

    if (!activityTitle || !activityContent) {
      return res.status(400).json({ error: '탐구 주제와 활동 내용을 입력해주세요.' });
    }

    if (!hasRealApiKey || !ai) {
      return res.json({
        evaluation: {
          academicCompetency: '교과 기본 개념을 전공 분야 실생활 쟁점에 능동적으로 연계하려는 지적 호기심과 문제의식이 돋보임.',
          careerCompetency: '희망 전공에서 요구되는 기초 학업 역량과 연구 방법론에 대한 관심이 뚜렷하게 관찰됨.',
          communityCompetency: '개인적 연구에 그치지 않고 탐구 결과를 학급 급우들과 공유하고 사회적 기여 가능성을 모색함.',
        },
        coachingAdvice: `[지도 조언]
1. 탐구 동기가 구체적이어서 좋습니다. 다만 문헌 조사의 비중이 크므로, 수학적 모델이나 공공 데이터 분석을 직접 곁들이면 훨씬 설득력 있는 결과물이 됩니다.
2. 참고한 자료의 출처를 신뢰성 있는 학술 논문이나 정부 보고서로 확장해 보세요.
3. 후속 활동으로 '${activityTitle}'의 결과를 비판적으로 재검증하는 2단계 탐구를 권장합니다.`,
        draftRecord: `교과 단원과 연계하여 '${activityTitle}'를 주제로 자기주도적 심화 탐구를 수행함. 관련 문헌 및 통계 자료를 다각도로 분석하여 핵심 메커니즘을 도출하였으며, 기존 학설의 한계점을 비판적으로 고찰하는 탐구력을 발휘함. 특히 탐구 과정에서 부딪힌 개념적 모호성을 교사와의 질의 및 전공 서적 탐독을 통해 주도적으로 해결하는 지적 끈기가 돋보임. 이를 학급 내 발표를 통해 급우들의 이해를 돕는 등 전공 역량과 소통 역량을 고루 겸비한 학생임.`,
      });
    }

    const prompt = `당신은 대한민국 고등학교 교사이자 입학사정관 출신의 학생부 종합전형 세특 작성 전문가입니다.
학생의 탐구 활동 내용을 분석하고, 교사가 학생을 지도할 때 줄 수 있는 피드백과 학교생활기록부 교과 세부능력 및 특기사항(세특) 추천 문안을 작성해주세요.

[학생 정보]
- 이름: ${studentName} (${grade}, 희망전공: ${major})
- 교과목: ${subject}
- 탐구 활동 제목: ${activityTitle}
- 학생이 작성한 활동 내용:
${activityContent}
- 지도 교사 메모/방향: ${teacherNotes || '없음'}

[작성 가이드라인]
1. 교육부 학교생활기록부 기재요령 준수 (소논문, R&E, 공인어학성적, 교외 수상실적 일체 언급 금지).
2. 학생의 '구체적 동기 -> 심화 탐구 과정 -> 지적 성장 및 변화'의 스토리라인을 명확히 할 것.
3. 세특 추천 문안(draftRecord)은 450~500자 내외로 격조 있고 신뢰감 주는 문체(~함, ~을 보임)로 서술할 것.

반드시 유효한 JSON 형식으로 응답하세요:
{
  "evaluation": {
    "academicCompetency": "학업역량 (탐구력, 지적호기심, 자기주도성 평가)",
    "careerCompetency": "진로역량 (전공 관련 교과 연계 및 지식 발전 정도)",
    "communityCompetency": "공동체역량 (협업, 소통, 윤리적 태도)"
  },
  "coachingAdvice": "교사가 학생에게 전달할 1:1 지도 코멘트 및 후속 탐구 발전 방향 (구체적 조언 3가지 포함)",
  "draftRecord": "학교생활기록부 교과세특에 그대로 또는 수정하여 입력할 수 있는 완성형 문안 (약 450자)"
}`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error) {
    console.error('Error coaching feedback, serving fallback:', (error as any)?.message || error);
    return res.json({
      evaluation: {
        academicCompetency: '교과 심화 개념을 전공 관심사와 주도적으로 연결한 지적 탐구력이 우수함.',
        careerCompetency: '희망 전공에 필요한 기초 연구 소양과 자료 분석 태도가 체계적임.',
        communityCompetency: '탐구 결과를 학급과 공유하고 사회적 함의를 고민하는 태도를 보임.',
      },
      coachingAdvice: '탐구 질문이 참신합니다. 데이터 정량 분석과 신뢰성 있는 원문 출처를 보강하면 더욱 경쟁력 있는 포트폴리오가 됩니다.',
      draftRecord: `교과 학습 내용에 머무르지 않고 '${req.body.activityTitle || '전공 연계 심화 주제'}'를 설정하여 주도적인 탐구를 기획함. 관련 개념을 다각도로 분석하여 핵심 질문에 대한 과학적/논리적 해결책을 도출하였으며, 비판적 사고력과 끈기 있는 탐구 태도를 보임. 탐구 성과를 논리정연하게 정리하여 교과와 진로를 아우르는 우수한 학업 역량을 입증함.`,
    });
  }
});

// 2.5 API: 특정 탐구 주제를 3~5개 세부 질문 및 파생 연구 영역으로 AI 확장
app.post('/api/ai/expand-topic', async (req, res) => {
  try {
    const {
      topicTitle = '',
      subject = '',
      inquiryQuestion = '',
      methodology = '',
      targetMajor = '',
      grade = '고등학교 2학년',
    } = req.body;

    if (!topicTitle) {
      return res.status(400).json({ error: '확장할 탐구 주제명이 필요합니다.' });
    }

    const cleanTitle = topicTitle.replace(/\[.*?\]/g, '').trim();

    // Fallback generator
    const getFallbackSubQuestions = () => {
      const isMath = /수학|미적|확률|통계|기하|수치/i.test(`${subject} ${topicTitle}`);
      const isSci = /과학|생명|화학|물리|지구/i.test(`${subject} ${topicTitle}`);
      const isSoc = /사회|윤리|경제|법|정치/i.test(`${subject} ${topicTitle}`);
      const isTech = /정보|ai|인공지능|알고리즘|컴퓨터|데이터/i.test(`${subject} ${topicTitle}`);

      return {
        topicTitle,
        subject,
        overview: `'${cleanTitle}' 주제는 고교 ${subject} 교과의 핵심 원리를 깊이 있게 입증할 수 있는 우수한 연구 주제입니다. 학생부종합전형에서는 단편적인 현상 조사에 그치지 않고, 아래 4가지 파생 연구 영역으로 질문을 좁혀 구체적 변인과 데이터 기반의 심화 검증을 진행할 때 가장 돋보입니다.`,
        subQuestions: [
          {
            id: `sub-${Date.now()}-1`,
            title: isMath
              ? `[수리적 최적화] 매개변수 민감도 및 오차 함수 모델링`
              : isSci
              ? `[물리화학적 메커니즘] 외부 환경 요인에 따른 반응 효율 정량 비교`
              : isSoc
              ? `[제도적 형평성] 최소 수혜자 관점에서의 사회적 손실 비용 산출`
              : isTech
              ? `[알고리즘 최적화] 입력 데이터 규모에 따른 시간·공간 복잡도 벤치마크`
              : `[개념 심화] 핵심 변인 간 인과관계의 수학적/논리적 모델링`,
            subQuestion: `${cleanTitle} 시스템에서 외부 조건이 변화할 때 나타나는 출력값의 오차를 최소화하는 수학적/원리적 임계점은 무엇인가?`,
            researchArea: isMath ? '수치해석 및 최적화' : isSci ? '반응속도론 및 열역학' : isSoc ? '미시경제학 외부효과' : '알고리즘 복잡도',
            methodology: isMath
              ? '지오지브라 슬라이더 기능 활용 매개변수 민감도 분석 및 잔차 제곱합 계산'
              : isSci
              ? '교내 센서 계측 및 PDB 3D 분자 모델링 뷰어를 활용한 입체구조 비교'
              : isSoc
              ? '국내외 정책 조례안 3건 비교 및 롤스의 정의론 4단계 분석표 작성'
              : '파이썬 스크립트 작성 및 Big-O 시간복잡도 실행 시간 측정 그래프 작성',
            relatedConcepts: [
              isMath ? '변화율' : isSci ? '평형 이동' : isSoc ? '차등 원칙' : 'Big-O',
              isMath ? '극대·극소' : isSci ? '활성화 에너지' : isSoc ? '사회적 잉여' : '탐색 알고리즘',
            ],
            readingRecommendation: isMath ? '《미적분의 힘》' : isSci ? '《부분과 전체》' : isSoc ? '《정의란 무엇인가》' : '《알고리즘, 인생을 계산하다》',
            recordTip: '단순 이론 조사를 넘어 독립변수와 종속변수를 스스로 설정하고 정량적 오차를 분석한 연구자적 자질 기술',
          },
          {
            id: `sub-${Date.now()}-2`,
            title: `[실증 데이터 분석] 공공데이터 연계 상관분석 및 가설 검증`,
            subQuestion: `실제 공개된 통계 지표(최근 3개년 데이터)에서 두 핵심 변수 사이에 유의미한 피어슨 상관계수(r)가 관찰되는가?`,
            researchArea: '탐색적 데이터 분석(EDA) 및 계량통계',
            methodology: '공공데이터포털(data.go.kr) 또는 통계청(KOSIS) CSV 데이터 추출, 엑셀/파이썬 산점도 및 회귀선 시각화',
            relatedConcepts: ['산점도', '피어슨 상관계수', '결측치 정제'],
            readingRecommendation: '《통계의 미학》(최제호)',
            recordTip: '정부 공개 원시 데이터를 직접 전처리하고 수치적으로 가설을 입증한 실증적 탐구 역량 강조',
          },
          {
            id: `sub-${Date.now()}-3`,
            title: `[한계 극복 및 대안 제언] 기존 모델의 한계점 규명과 후속 과제`,
            subQuestion: `선행 연구 및 교과서 원리를 실세계에 적용할 때 발생하는 현실적 제약 조건과 오차 요인은 무엇이며 어떻게 보완할 수 있는가?`,
            researchArea: '연구 방법론 비판 및 메타인지',
            methodology: 'KCI 선행 연구 논문 2편 강독을 통한 전제 조건 비교, 오차 발생 원인 분석 보고서 작성',
            relatedConcepts: ['변인 통제', '불확도', '오차 요인 분석'],
            readingRecommendation: '《생각의 탄생》(로버트 루트번스타인)',
            recordTip: '자신의 연구 결과에 안주하지 않고 한계점을 객관적으로 비판하고 후속 탐구로 확장한 메타인지 능력',
          },
          {
            id: `sub-${Date.now()}-4`,
            title: `[사회적·윤리적 함의] 전공 기술의 사회적 파급효과와 규범 가이드라인`,
            subQuestion: `해당 기술/개념이 상용화되었을 때 발생 가능한 윤리적 딜레마를 해결하기 위한 공동체적 자율 가이드라인은 무엇인가?`,
            researchArea: '과학기술철학 및 공공정책 거버넌스',
            methodology: '유네스코 및 국내외 윤리 지침서 대조, 청소년 자치 행동 강령 5대 조항 제정',
            relatedConcepts: ['책임 윤리', '공동체 역량', '규제 샌드박스'],
            readingRecommendation: '《기술의 충격》(케빈 켈리)',
            recordTip: '전공 지식의 기술적 성취뿐만 아니라 사회적 약자 보호와 윤리적 책임을 아우르는 성숙한 시민 의식 부각',
          },
        ],
      };
    };

    if (!hasRealApiKey || !ai) {
      return res.json(getFallbackSubQuestions());
    }

    const prompt = `당신은 대한민국 고등학교 학생부 종합전형(학종) 전문 수석 진로진학 컨설턴트이자 교과 교육과정 전문가입니다.
학생이 선정한 교과 탐구 주제를 더욱 깊이 있게 발전시키기 위해, 3~5개의 구체적인 '세부 탐구 질문(Sub-questions)'과 '파생 연계 연구 영역(Related Research Areas)'을 생성해주세요.

[주제 정보]
- 탐구 주제: ${topicTitle}
- 교과목: ${subject}
- 핵심 탐구 질문: ${inquiryQuestion}
- 기존 방법론: ${methodology || '미정'}
- 희망 전공: ${targetMajor || '관련 계열'}
- 학년: ${grade}

[작성 원칙]
1. 단순 질문 나열이 아니라, 고등학생이 교과서 개념을 실세계/전공 쟁점에 적용하여 1~2주 내에 직접 탐구할 수 있는 구체적인 가설/질문일 것.
2. 3~5개의 세부 질문은 상호 보완적인 연구 영역(예: 수리 모델링/오차 분석, 실험 메커니즘 규명, 공공데이터 분석, 사회 윤리적 쟁점 등)을 균형 있게 다룰 것.
3. 교육부 학생부 기재요령(소논문, R&E 등 금지어 배제)을 철저히 준수할 것.

반드시 유효한 JSON 형식으로만 응답하세요:
{
  "topicTitle": "${topicTitle}",
  "subject": "${subject}",
  "overview": "이 주제를 왜 이러한 3~5개 세부 영역으로 심화 확장해야 하는지에 대한 컨설팅 총평 (2~3문장)",
  "subQuestions": [
    {
      "id": "sub-1",
      "title": "[연구영역명] 세부 연구 제목",
      "subQuestion": "핵심 세부 탐구 질문 (왜/어떻게에 대한 의문문)",
      "researchArea": "연계 연구 분야 (예: 반응속도론, 확률 모델링, 공공데이터 분석, 규제 거버넌스)",
      "methodology": "구체적 실천 방법론 (활용 도구, 데이터셋 또는 실험 프로토콜)",
      "relatedConcepts": ["교과 개념 1", "교과 개념 2"],
      "readingRecommendation": "추천 도서 또는 논문 키워드",
      "recordTip": "학생부 교과세특에 기록될 때 돋보이는 역량 포인트"
    }
  ]
}
*주의: subQuestions 배열은 3개 이상 5개 이하로 상세하게 작성해야 합니다.`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.text;
    if (!text) throw new Error('Gemini API returned empty text');

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error) {
    console.error('Error in expand-topic, serving fallback:', (error as any)?.message || error);
    const {
      topicTitle = '',
      subject = '',
      inquiryQuestion = '',
      methodology = '',
      targetMajor = '',
      grade = '고등학교 2학년',
    } = req.body || {};

    const cleanTitle = topicTitle.replace(/\[.*?\]/g, '').trim() || '교과 연계 탐구 주제';

    const fallback = {
      topicTitle,
      subject,
      overview: `'${cleanTitle}' 주제는 고교 ${subject} 교과의 핵심 원리를 깊이 있게 입증할 수 있는 우수한 연구 주제입니다. 학생부종합전형에서는 단편적인 현상 조사에 그치지 않고, 아래 4가지 파생 연구 영역으로 질문을 좁혀 구체적 변인과 데이터 기반의 심화 검증을 진행할 때 가장 돋보입니다.`,
      subQuestions: [
        {
          id: `sub-${Date.now()}-1`,
          title: `[수리·원리적 최적화] 매개변수 민감도 및 오차 함수 분석`,
          subQuestion: `${cleanTitle} 시스템에서 외부 조건이 변화할 때 나타나는 출력값의 오차를 최소화하는 수학적/원리적 임계점은 무엇인가?`,
          researchArea: '수치해석 및 최적화',
          methodology: '지오지브라 슬라이더 기능 활용 매개변수 민감도 분석 및 수식 모델링',
          relatedConcepts: ['변화율', '오차 분석', '함수 최적화'],
          readingRecommendation: '《수학으로 생각하는 힘》(키트 예이츠)',
          recordTip: '단순 이론 조사를 넘어 독립변수와 종속변수를 스스로 설정하고 정량적 오차를 분석한 연구자적 자질 기술',
        },
        {
          id: `sub-${Date.now()}-2`,
          title: `[실증 데이터 분석] 공공데이터 연계 상관분석 및 가설 검증`,
          subQuestion: `실제 공개된 통계 지표에서 두 핵심 변수 사이에 유의미한 상관관계가 통계적으로 관찰되는가?`,
          researchArea: '탐색적 데이터 분석(EDA)',
          methodology: '공공데이터포털(data.go.kr) CSV 데이터셋 정제 및 엑셀 상관분석 차트 시각화',
          relatedConcepts: ['산점도', '피어슨 상관계수', '결측치 정제'],
          readingRecommendation: '《통계의 미학》(최제호)',
          recordTip: '정부 공개 원시 데이터를 직접 전처리하고 수치적으로 가설을 입증한 실증적 탐구 역량 강조',
        },
        {
          id: `sub-${Date.now()}-3`,
          title: `[한계 극복 및 대안 제언] 기존 모델의 한계점 규명과 후속 과제`,
          subQuestion: `교과서 원리를 실세계에 적용할 때 발생하는 현실적 제약 조건과 오차 요인은 무엇이며 어떻게 보완할 수 있는가?`,
          researchArea: '연구 방법론 비판 및 메타인지',
          methodology: 'KCI 선행 연구 논문 2편 강독을 통한 전제 조건 비교 및 보완점 도출',
          relatedConcepts: ['변인 통제', '불확도', '오차 요인'],
          readingRecommendation: '《생각의 탄생》(로버트 루트번스타인)',
          recordTip: '자신의 연구 결과에 안주하지 않고 한계점을 객관적으로 비판하고 후속 탐구로 확장한 메타인지 능력',
        },
        {
          id: `sub-${Date.now()}-4`,
          title: `[사회적·윤리적 함의] 전공 기술의 사회적 파급효과와 규범 가이드라인`,
          subQuestion: `해당 기술/개념이 상용화되었을 때 발생 가능한 윤리적 딜레마를 해결하기 위한 공동체적 자율 가이드라인은 무엇인가?`,
          researchArea: '과학기술철학 및 공공정책',
          methodology: '국내외 윤리 지침서 대조 및 청소년 자치 행동 강령 5대 조항 제정',
          relatedConcepts: ['책임 윤리', '공동체 역량', '사회적 정의'],
          readingRecommendation: '《기술의 충격》(케빈 켈리)',
          recordTip: '전공 지식의 기술적 성취뿐만 아니라 사회적 약자 보호와 윤리적 책임을 아우르는 성숙한 시민 의식 부각',
        },
      ],
    };

    return res.json(fallback);
  }
});

// 3. API: 마인드맵 특정 노드 심화 브랜치 및 탐구 단계 AI 확장
app.post('/api/ai/expand-mindmap', async (req, res) => {
  try {
    const {
      rootTopic = '',
      nodeText = '',
      nodeSubject = '',
      nodeType = '',
      category = 'science',
      mode = 'expand',
    } = req.body;

    if (!nodeText) return res.status(400).json({ error: '노드 텍스트가 필요합니다.' });

    // Clean node text to remove brackets/noise
    const cleanText = nodeText
      .replace(/\[.*?\]/g, '')
      .replace(/[0-9]+단계\s*:\s*/g, '')
      .trim();

    // Subject detection
    const combinedContext = `${nodeSubject} ${category} ${nodeText}`.toLowerCase();
    const isMath = /math|수학|미적|확률|통계|기하|수치|방정식/i.test(combinedContext);
    const isSci = /sci|과학|생명|물리|화학|지구|실험|바이오/i.test(combinedContext);
    const isSoc = /soc|사회|윤리|경제|법|정책|제도|정의/i.test(combinedContext);
    const isKor = /kor|국어|문학|독서|화법|작문|담론/i.test(combinedContext);
    const isEng = /eng|영어|원서|저널|abstract|글로벌/i.test(combinedContext);
    const isTech = /tech|정보|알고리즘|ai|인공지능|컴퓨터|코딩|데이터/i.test(combinedContext);

    const subjectBadge = isMath
      ? '수학 (미적분/확통)'
      : isSci
      ? '과학 (생명/물리/화학)'
      : isSoc
      ? '사회 (윤리/경제/법)'
      : isKor
      ? '국어 (독서/작문)'
      : isEng
      ? '영어 (심화영어/작문)'
      : '정보 (정보/AI기초)';

    const effectiveCategory = isMath
      ? 'math'
      : isSci
      ? 'science'
      : isSoc
      ? 'social'
      : isKor
      ? 'humanities'
      : isEng
      ? 'humanities'
      : 'tech';

    // Hierarchy Level Detection:
    const isProcessStep =
      nodeType === 'process_step' ||
      /1단계|2단계|3단계|4단계|문제\s*도출|이론\s*고찰|실증\s*방법|결론\s*도출/i.test(nodeText);

    const isSubjectLevel =
      nodeType === 'subject' ||
      /^\[(수학|과학|사회|국어|영어|정보)\]/i.test(nodeText);

    const isActionLevel =
      nodeType === 'action' ||
      /\[(변인|현상|성취기준|학술|원서|개념|데이터|모델링|실험|오차|후속|문안|파라미터|융합|학술제)\]/i.test(nodeText);

    const getHierarchicalNodes = () => {
      // SCENARIO 1: Requested 4-Stage Inquiry Process OR expanding a Topic node
      if (mode === 'process_steps' || (!isProcessStep && !isSubjectLevel && !isActionLevel)) {
        return [
          {
            id: `step-${Date.now()}-1`,
            text: '1단계: [문제 도출] 핵심 연구 발문 및 가설 설정',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'process_step',
            detail: `${cleanText}에 관한 실세계 문제 현상을 관찰하고 조작 변인과 종속 변인을 수학적/과학적으로 명확히 정의하여 검증 가능한 가설 진술문 작성`,
            inquiryQuestion: `${cleanText} 현상에서 원인과 결과의 인과관계를 설명하는 핵심 가설은 무엇인가?`,
            methodology: '공공 통계 지표 및 선행 사례 조사를 통한 연구 필요성 정립, 가설 진술문 작성',
            readingRecommendation: isMath ? '《수학으로 생각하는 힘》' : isSci ? '《부분과 전체》' : isSoc ? '《정의란 무엇인가》' : isKor ? '《생각의 탄생》' : isEng ? '《Factfulness》' : '《알고리즘, 인생을 계산하다》',
            recordTip: '일상의 호기심을 학문적 탐구 발문으로 구체화한 자기주도적 문제발견 역량',
          },
          {
            id: `step-${Date.now()}-2`,
            text: '2단계: [이론 고찰] 교과 단원 개념 융합 및 선행 논문 분석',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'process_step',
            detail: `고교 교과서 단원 개념과 KCI/PubMed 등재 선행 학술 논문을 교차 검토하여 이론적 토대와 선행 연구의 한계점 규명`,
            inquiryQuestion: '교과 단원 개념이 실제 최신 학술 논문에서 어떤 수식과 메커니즘으로 심화 발전하고 있는가?',
            methodology: '학술 데이터베이스(DBpia/RISS) 선행 논문 2편 핵심 기전 분석 및 교과 개념 융합 맵 작성',
            readingRecommendation: isMath ? '《미적분의 힘》' : isSci ? '《생명 최초의 30억 년》' : isSoc ? '《기술의 충격》' : isKor ? '《과학 혁명의 구조》' : isEng ? '《Academic English Writing》' : '《모두의 딥러닝》',
            recordTip: '고교 교육과정 지식을 대학 수준의 학술 논문과 접목하여 깊이 있게 이해한 학업 역량',
          },
          {
            id: `step-${Date.now()}-3`,
            text: '3단계: [실증 방법] 구체적 실험·데이터 시뮬레이션·모델링',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'process_step',
            detail: isMath
              ? '지오지브라/파이썬을 활용한 매개변수 변화율 수치 모델링 및 함수 피팅'
              : isSci
              ? '교내 과학 실험실 변인 통제 모의실험 및 반응 수치 정량 측정'
              : isSoc
              ? '정부 공공데이터 시계열 추세 분석 및 국내외 정책 가이드라인 비교'
              : isKor
              ? '전문 학술 텍스트와 언론 보도의 담론 프레이밍 비교 도표 작성'
              : isEng
              ? 'Nature/Science 영문 원문 초록(Abstract) IMRaD 구조 분석 및 영문 리포트'
              : '공공데이터 Open API 연계 및 파이썬 데이터 처리 알고리즘 구현',
            inquiryQuestion: '가설을 객관적으로 입증하기 위해 어떤 정량적 데이터와 도구를 사용하여 검증할 것인가?',
            methodology: '정량 데이터 수집, 회귀분석/알고리즘 구현 또는 실험군-대조군 프로토콜 수행',
            readingRecommendation: isMath ? '《파이썬으로 배우는 통계학》' : isSci ? '《실험 과학 탐구 매뉴얼》' : isSoc ? '《로봇 시대의 법과 윤리》' : isKor ? '《말이 칼이 될 때》' : isEng ? '《TED Talks 원문 스크립트》' : '《파이썬 데이터 분석 실무 테크닉 100》',
            recordTip: '추상적 이론에 머물지 않고 도구와 데이터를 활용하여 실증적으로 문제를 해결한 탐구 실천력',
          },
          {
            id: `step-${Date.now()}-4`,
            text: '4단계: [결론 도출] 오차 분석, 한계 극복 및 학생부 세특 기록화',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'process_step',
            detail: '탐구 결과의 타당성 평가, 장비 및 환경적 한계로 인한 오차 원인 규명, 차년도 후속 탐구 과제 제시 및 세특 작성',
            inquiryQuestion: '탐구 결과를 통해 도출한 최종 결론과 향후 개선해야 할 학문적 과제는 무엇인가?',
            methodology: '오차율 산출, 선행 연구와의 결과 차이 고찰, 동기-과정-성장이 담긴 세특 포트폴리오 정리',
            readingRecommendation: '《통계의 미학》, 《유혹하는 글쓰기》',
            recordTip: '실패나 오차를 숨기지 않고 과학적/논리적으로 원인을 분석하여 한 단계 더 성장한 메타인지 역량',
          },
        ];
      }

      // SCENARIO 2: Expanding a Process Step (1단계, 2단계, 3단계, 4단계)
      if (isProcessStep) {
        const stepNum = /1단계|문제\s*도출/i.test(nodeText)
          ? 1
          : /2단계|이론\s*고찰/i.test(nodeText)
          ? 2
          : /3단계|실증\s*방법/i.test(nodeText)
          ? 3
          : 4;

        if (stepNum === 1) {
          return [
            {
              id: `act-${Date.now()}-1`,
              text: '[변인 정의] 조작·통제 변인 설정 및 인과관계 가설 수립',
              category: effectiveCategory,
              subject: subjectBadge,
              nodeType: 'action',
              detail: `${cleanText} 현상에 영향을 미치는 독립변수를 세분화하고 통제변인을 물리화학적/수학적으로 조작적 정의`,
              inquiryQuestion: '변인 간의 상호작용을 분리하여 순수한 인과관계를 증명할 수 있는 조건은?',
              methodology: '변인 통제 설계서 작성 및 가설 진술문 검토',
              recordTip: '실험 설계의 논리적 엄밀성과 변인 통제 능력을 입증',
            },
            {
              id: `act-${Date.now()}-2`,
              text: '[현상 진단] 공공 통계 포털 기반 실태 데이터 추출 및 문제 시각화',
              category: effectiveCategory,
              subject: subjectBadge,
              nodeType: 'action',
              detail: '통계청(KOSIS), 공공데이터포털 또는 국제기구(WHO/OECD)의 최근 5개년 실태 통계 추출 및 차트화',
              inquiryQuestion: '데이터에 나타난 최근 5개년의 급격한 이상치 또는 변곡점의 배경은?',
              methodology: 'Excel/R을 활용한 시계열 추세선 그래프 작성',
              recordTip: '사회적·과학적 난제를 신뢰성 있는 공공 통계로 실증한 데이터 탐색 역량',
            },
            {
              id: `act-${Date.now()}-3`,
              text: '[성취기준 맵] 교과서 핵심 단원 성취기준과 연구 질문 정합성 검토',
              category: effectiveCategory,
              subject: subjectBadge,
              nodeType: 'action',
              detail: '2022/2015 교육과정 교과서 단원 목표와 본 연구 질문의 연계성을 분석하여 세특 기재 기반 구축',
              inquiryQuestion: '교과 단원의 핵심 개념이 연구 문제 해결의 이론적 출발점이 될 수 있는가?',
              methodology: '교육과정 성취기준 연계 맵 작성 및 지도 교사 사전 피드백 수렴',
              recordTip: '정규 교과 수업 내용에 뿌리를 두고 심화 주제로 확장해 나간 학종 모범 탐구 태도',
            },
          ];
        }

        if (stepNum === 2) {
          return [
            {
              id: `act-${Date.now()}-1`,
              text: '[학술 논문] KCI/PubMed 등재 선행 연구의 연구 방법론 비교 분석',
              category: effectiveCategory,
              subject: subjectBadge,
              nodeType: 'action',
              detail: '선행 연구 2~3편의 Abstract와 연구 설계 파트를 비교하여 공통 한계점과 본 탐구의 차별성 도출',
              inquiryQuestion: '선행 연구들이 해결하지 못한 미개척 영역은 무엇이며 본 탐구는 이를 어떻게 보완하는가?',
              methodology: 'DBpia/RISS 검색 논문 비교 분석 표(Matrix) 작성',
              recordTip: '학술 문헌을 비판적으로 독해하고 연구의 독창적 가치를 정립한 연구자적 안목',
            },
            {
              id: `act-${Date.now()}-2`,
              text: '[전공 원서 발췌] 대학 전공 추천 도서 심화 챕터 비평문 작성',
              category: effectiveCategory,
              subject: subjectBadge,
              nodeType: 'action',
              detail: '대학교 1~2학년 전공 개론서의 관련 챕터를 발췌 정독하고 고교 개념과의 수준 차이를 메우는 해설문 작성',
              inquiryQuestion: '교과서에 생략된 심화 메커니즘을 전공 서적에서는 어떻게 설명하고 있는가?',
              methodology: '전공 서적 독서 카드 작성 및 핵심 수식/원리 요약 노트 제작',
              recordTip: '지적 갈증을 해소하기 위해 주도적으로 전공 원서를 탐독하는 탁월한 학구열',
            },
            {
              id: `act-${Date.now()}-3`,
              text: '[개념 융합도] 2개 교과 개념 결합 수식 도출 및 개념도 작성',
              category: effectiveCategory,
              subject: subjectBadge,
              nodeType: 'action',
              detail: '자연과학 현상을 수학적 함수로 나타내거나 과학 기술의 위험도를 사회적 효용 함수로 모델링',
              inquiryQuestion: '서로 다른 교과 단원의 원리를 결합할 때 나타나는 시너지 방정식은 무엇인가?',
              methodology: '융합 개념 관계도 작성 및 융합 모델링 수식 유도',
              recordTip: '단일 교과에 갇히지 않고 여러 교과를 넘나드는 융복합적 문제해결력 과시',
            },
          ];
        }

        if (stepNum === 3) {
          if (isMath) {
            return [
              {
                id: `act-${Date.now()}-1`,
                text: '[수식 모델링] 변수 간 상관함수 수식화 및 미분계수 산출',
                category: 'math',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '수집된 데이터 좌표로부터 다항함수 또는 지수·로그 함수를 도출하고 극값과 변화율 계산',
                inquiryQuestion: '변화율이 0이 되는 임계점의 실제 물리적/경제적 의미는?',
                methodology: '최소제곱법을 적용한 회귀곡선 수식 유도',
                recordTip: '미적분의 기하학적·대수적 의미를 실세계 데이터에 정확하게 적용한 수리력',
              },
              {
                id: `act-${Date.now()}-2`,
                text: '[시뮬레이션] 지오지브라/파이썬을 통한 매개변수 변화 시각화',
                category: 'math',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '슬라이더 인터페이스를 구성하여 파라미터 a, b의 변화에 따른 그래프 곡률 및 면적 변동 관찰',
                inquiryQuestion: '매개변수가 특정 임계치를 넘을 때 그래프의 점근선과 수렴성은 어떻게 변하는가?',
                methodology: '지오지브라 동적 워크시트 제작 및 스크린샷 캡처',
                recordTip: '컴퓨팅 도구를 활용하여 수학적 직관을 시각적으로 구현해내는 역량',
              },
              {
                id: `act-${Date.now()}-3`,
                text: '[오차 검증] 잔차 제곱합(RSS) 계산 및 모델 적합도(R²) 평가',
                category: 'math',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '실제 관측값과 수식 예측값 간의 잔차(Residual)를 구하고 결정계수(R-squared)로 설명력 검증',
                inquiryQuestion: '수립된 수학적 모델이 현실 데이터를 몇 퍼센트나 설명할 수 있는가?',
                methodology: '잔차 분포도 작성 및 통계적 유의성 검토',
                recordTip: '자신의 모델을 맹신하지 않고 통계적 지표로 냉철하게 검증하는 연구 윤리',
              },
            ];
          }

          if (isSci) {
            return [
              {
                id: `act-${Date.now()}-1`,
                text: '[변인 통제] 조작 변인과 통제 변인 설정 및 대조군 실험 프로토콜',
                category: 'science',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '온도, 농도, 조도 등 외생 변인을 항구적으로 일정하게 유지하는 구체적 실험 순서도 작성',
                inquiryQuestion: '예상치 못한 환경 외란을 차단할 수 있는 블라인드 대조군 설계는?',
                methodology: '실험 프로토콜 5단계 수립 및 교내 과학실 기자재 대여 신청',
                recordTip: '실험 설계의 정밀성과 변인 통제의 엄격함을 철저히 준수한 과학적 태도',
              },
              {
                id: `act-${Date.now()}-2`,
                text: '[측정 데이터] 반응 속도 및 흡광도/전압 수치 정량 측정',
                category: 'science',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '시간 경과에 따른 정량적 수치 변화를 5회 반복 측정하여 평균값과 표준편차 도출',
                inquiryQuestion: '반복 실험 간의 측정 오차는 통계적으로 허용 가능한 수준인가?',
                methodology: 'MBL 센서 측정 및 엑셀 데이터 테이블 입력',
                recordTip: '단발성 실험이 아닌 다회 반복 측정을 통해 데이터의 신뢰도를 확보한 성실성',
              },
              {
                id: `act-${Date.now()}-3`,
                text: '[오차 분석] 실험 기구 분해능 한계에 따른 불확도 계산 및 보정',
                category: 'science',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '디지털 계측 장비의 최소 눈금 한계 및 온도 변화에 따른 물리적 오차 요인 정량 보정',
                inquiryQuestion: '장비의 분해능 한계로 인해 발생할 수 있는 최대 오차 범위는 얼마인가?',
                methodology: '불확도 전파 법칙 적용 및 오차 보정치 산출',
                recordTip: '오차 발생 원인을 장비의 물리적 한계와 결부지어 과학적으로 해석해낸 분석력',
              },
            ];
          }

          if (isSoc) {
            return [
              {
                id: `act-${Date.now()}-1`,
                text: '[공공데이터 추출] 통계청 KOSIS 및 정부 공시자료 시계열 정제',
                category: 'social',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '공공 정책 시행 전후 3개년의 경제적 지표 및 복지 지출 통계 데이터를 시계열로 정리',
                inquiryQuestion: '새로운 법제도 도입 이후 수혜 집단과 비용 부담 집단의 변화 추이는?',
                methodology: 'KOSIS 통계표 다운로드 및 전후 차이 분석표 작성',
                recordTip: '정부 공공데이터를 직접 수집하여 정책의 실효성을 객관적으로 검증한 탐구력',
              },
              {
                id: `act-${Date.now()}-2`,
                text: '[제도/판례 비교] 국내 법령과 해외(EU/미국) 가이드라인 조항 대비표',
                category: 'social',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '국내 포지티브 규제 법조문과 EU/미국의 네거티브 규제 조항을 1:1로 매핑하여 장단점 분석',
                inquiryQuestion: '글로벌 스탠다드와 국내 규제 환경 사이의 괴리를 해소할 절충안은?',
                methodology: '법령 조문 비교 분석 매트릭스 작성',
                recordTip: '국내외 법제를 비교 검토하여 균형 잡힌 정책 대안을 모색한 사회과학적 소양',
              },
              {
                id: `act-${Date.now()}-3`,
                text: '[정책 제언] 수혜자-비수혜자 딜레마를 해소하는 실천 조례안 입안',
                category: 'social',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '사회적 약자의 권익을 보호하면서도 산업 혁신을 저해하지 않는 5개 조항의 가상 조례안 성안',
                inquiryQuestion: '이해관계자 간의 갈등을 최소화하는 상생 펀드 또는 지원금 모델은?',
                methodology: '조례안 입법 이유서 및 5개 조항 법률안 작성',
                recordTip: '사회적 연대와 공동체 번영을 위한 실천적 정책 대안을 구체적 조문화한 역량',
              },
            ];
          }

          if (isKor) {
            return [
              {
                id: `act-${Date.now()}-1`,
                text: '[담론 텍스트 분석] 전문 학술지 vs 언론 보도의 프레이밍 차이 도표화',
                category: 'humanities',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '학술 논문의 조건부 수사(Hedging)와 대중 기사의 자극적 단정 표현의 빈도를 비교 계량화',
                inquiryQuestion: '언론의 언어적 프레임이 대중의 공포심과 과대 기대를 어떻게 부추기는가?',
                methodology: '텍스트 마이닝 어휘 빈도 분석 및 프레이밍 대비표 작성',
                recordTip: '미디어 텍스트의 숨은 의도를 언어학적·수사학적으로 정밀하게 해체한 문해력',
              },
              {
                id: `act-${Date.now()}-2`,
                text: '[비판적 서평] 학술 논문의 전제와 논리적 비약에 대한 반론문 작성',
                category: 'humanities',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '권위 있는 학술 텍스트라 할지라도 암묵적으로 전제된 가치관의 한계점을 논리적으로 비판',
                inquiryQuestion: '해당 저자의 주장에서 증명되지 않은 은폐된 전제(Hidden assumption)는 무엇인가?',
                methodology: '툴민 논증 분석틀 적용 및 비판적 논평문(A4 3매) 작성',
                recordTip: '권위에 무비판적으로 동조하지 않고 학문적 반론을 제기하는 독립적 비판 사고력',
              },
              {
                id: `act-${Date.now()}-3`,
                text: '[학술 에세이] 교과 개념과 인문학적 가치를 융합한 비평문 교내 발표',
                category: 'humanities',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '과학기술과 인간 존엄성의 조화를 다룬 소논설문을 학급 발표 시간에 공유하고 질의응답 진행',
                inquiryQuestion: '어떻게 감정적 호소와 이성적 논증을 결합하여 청중을 설득할 것인가?',
                methodology: '학술 발표 슬라이드 제작 및 동료 질의응답 피드백 정리',
                recordTip: '복잡한 인문·과학 융합 쟁점을 청중의 눈높이에 맞게 전달하는 탁월한 스피치 능력',
              },
            ];
          }

          if (isEng) {
            return [
              {
                id: `act-${Date.now()}-1`,
                text: '[원문 IMRaD 분석] Nature/Science 연구 논문의 초록 및 결론 원문 강독',
                category: 'humanities',
                subject: subjectBadge,
                nodeType: 'action',
                detail: 'Introduction부터 Discussion까지 논문의 4단 구조별 핵심 연결어와 논리 비약을 원문으로 대조',
                inquiryQuestion: '글로벌 연구진이 사용하는 학술적 완곡어법(Hedging expressions)의 종류는?',
                methodology: '원문 형광펜 구문 분석 및 논리 흐름도 작성',
                recordTip: '영문 학술 논문의 원문을 직접 강독하며 전문 어휘와 논리 구조를 흡수한 외국어 역량',
              },
              {
                id: `act-${Date.now()}-2`,
                text: '[전문 어휘집] 전공 핵심 Academic Collocations 30선 정리',
                category: 'humanities',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '전공 분야 논문에서 빈번히 등장하는 연어(Collocation) 및 전치사 결합 패턴 30선 추출',
                inquiryQuestion: '자연스러운 학술 영작문을 위해 필수적인 동사-명사 결합 패턴은 무엇인가?',
                methodology: '영문 코퍼스(Corpus) 검색 및 어휘집 제작',
                recordTip: '기계적 단어 암기를 넘어 학술 문맥 속 연어 관계를 체득한 실질적 어학 실력',
              },
              {
                id: `act-${Date.now()}-3`,
                text: '[영문 브리프] 연구 질문, 방법, 결론을 200단어 영문 Executive Summary로 작성',
                category: 'humanities',
                subject: subjectBadge,
                nodeType: 'action',
                detail: '핵심 내용을 200단어 내외의 정갈한 학술 영어로 압축 요약하고 문법 감수 진행',
                inquiryQuestion: '군더더기 없는 명료하고 응집성 높은(Cohesive) 영문 초록을 쓰는 방법은?',
                methodology: '영문 요약문 초안 작성 및 Grammarly 감수',
                recordTip: '복잡한 연구 결과를 국제 표준 양식에 맞추어 영문으로 요약 보고할 수 있는 글로벌 역량',
              },
            ];
          }

          return [
            {
              id: `act-${Date.now()}-1`,
              text: '[데이터 파이프라인] 공공데이터 REST API 연동 및 Pandas 결측치 전처리',
              category: 'tech',
              subject: subjectBadge,
              nodeType: 'action',
              detail: 'API 호출을 통해 JSON 데이터를 수집하고 파이썬 결측치 대체 및 이상치 필터링 수행',
              inquiryQuestion: '데이터 정제 과정에서 데이터 손실을 최소화하면서 노이즈를 제거하는 기법은?',
              methodology: '파이썬 스크립트 작성 및 데이터프레임 요약 통계 출력',
              recordTip: '실제 현업 개발에서 쓰이는 데이터 수집 및 정제 파이프라인을 독자 구축한 역량',
            },
            {
              id: `act-${Date.now()}-2`,
              text: '[알고리즘 구현] 최적화 파이썬 스크립트 작성 및 시간복잡도 O(N) 분석',
              category: 'tech',
              subject: subjectBadge,
              nodeType: 'action',
              detail: '이중 반복문의 병목 현상을 해시맵 또는 동적 계획법으로 개선하여 연산 속도 10배 단축',
              inquiryQuestion: '대용량 데이터 환경에서 알고리즘의 실행 속도를 보장하기 위한 자료구조 선택은?',
              methodology: 'timeit 모듈을 활용한 수행 시간 벤치마크 테스트',
              recordTip: '기능 구현에 그치지 않고 알고리즘의 복잡도를 분석하여 성능을 최적화한 컴퓨팅 사고력',
            },
            {
              id: `act-${Date.now()}-3`,
              text: '[인터랙티브 시각화] Streamlit/Plotly 기반 대화형 탐구 대시보드 배포',
              category: 'tech',
              subject: subjectBadge,
              nodeType: 'action',
              detail: '사용자가 필터를 조작하며 탐구 결과를 웹 화면에서 실시간으로 확인할 수 있는 대시보드 제작',
              inquiryQuestion: '비전공자 사용자에게 데이터 분석 결과를 직관적으로 전달하는 UI 구성은?',
              methodology: 'Streamlit 웹 앱 프로토타이핑 및 학급 급우 시연',
              recordTip: '자신의 코드를 사용자가 편리하게 인터랙션할 수 있는 완성도 높은 소프트웨어로 발전시킴',
            },
          ];
        }

        // stepNum === 4
        return [
          {
            id: `act-${Date.now()}-1`,
            text: '[오차 요인 고찰] 측정 장비 분해능 및 표본 편향에 따른 한계점 역학적 분석',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'action',
            detail: '실험 장비의 한계, 표본 추출의 한계로 인해 발생한 오차의 크기를 수량화하고 원인 분석',
            inquiryQuestion: '이상적인 이론값과 실제 측정값 사이에 발생한 잔차의 주된 원인은 무엇인가?',
            methodology: '오차 원인 요인 분석도(Fishbone diagram) 작성',
            recordTip: '실험 결과를 왜곡하지 않고 오차의 원인을 객관적이고 과학적으로 규명한 연구 윤리',
          },
          {
            id: `act-${Date.now()}-2`,
            text: '[후속 연구 제언] 현실적 제약을 극복하기 위한 차년도 2단계 심화 연구 로드맵 구상',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'action',
            detail: '현재 탐구의 한계를 발판 삼아 3학년 또는 타 교과에서 연계 확장할 후속 연구 질문 2가지 도출',
            inquiryQuestion: '대학에 진학하여 심화 연구 장비를 다루게 된다면 어떤 추가 검증을 수행할 것인가?',
            methodology: '2단계 후속 탐구 계획서 및 진로 로드맵 연계서 작성',
            recordTip: '일회성 탐구로 끝내지 않고 지속적인 지적 호기심으로 발전시켜 나가는 학문적 지구력',
          },
          {
            id: `act-${Date.now()}-3`,
            text: '[세특 500자 완성] 탐구 동기-실천 과정-배우고 느낀 점 중심의 학생부 문안 초안 작성',
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'action',
            detail: '교육부 학생부 기재요령에 부합하도록 소논문 명칭 배제, 교과 성취기준 및 성장 스토리 중심 서술',
            inquiryQuestion: '입학사정관의 눈길을 사로잡는 나만의 차별화된 학문적 성장의 핵심 문장은?',
            methodology: 'STAR(Situation-Task-Action-Result) 기법 기반 480자 세특 포트폴리오 완성',
            recordTip: '자신의 역량을 입학사정관에게 신뢰감 있게 전달하는 완성도 높은 세특 포트폴리오 구축',
          },
        ];
      }

      // SCENARIO 3: Expanding a Subject Level node ([수학], [과학], etc.)
      if (isSubjectLevel) {
        if (isMath) {
          return [
            {
              id: `top-${Date.now()}-1`,
              text: `${cleanText}의 비선형 미분방정식 동적 안정성 모델링`,
              category: 'math',
              subject: subjectBadge,
              nodeType: 'topic',
              detail: '미적분의 변화율과 위상평면 분석을 활용하여 복합 시스템의 평형점과 수렴 안정성 탐구',
              inquiryQuestion: '시스템이 외란에 흔들리지 않고 안정 상태를 유지하는 수학적 조건은?',
              methodology: '지오지브라 미분방정식 방향장(Slope Field) 시각화',
              recordTip: '고교 미적분을 뛰어넘어 동적 시스템의 수리적 안정성을 모델링한 우수한 수리역량',
            },
            {
              id: `top-${Date.now()}-2`,
              text: `${cleanText}의 베이즈 추론과 결합 확률분포 분석`,
              category: 'math',
              subject: subjectBadge,
              nodeType: 'topic',
              detail: '조건부 확률과 베이즈 정리를 적용하여 새로운 데이터 유입 시 사후 확률의 갱신 과정 모델링',
              inquiryQuestion: '사전 정보의 불확실성이 데이터 누적에 따라 어떻게 감소하는가?',
              methodology: '파이썬 NumPy를 활용한 베이즈 업데이트 확률 시뮬레이션',
              recordTip: '확률과 통계 교과를 실세계 불확실성 의사결정에 수학적으로 적용한 통찰력',
            },
          ];
        }

        if (isSci) {
          return [
            {
              id: `top-${Date.now()}-1`,
              text: `${cleanText} 시스템의 열역학적 엔트로피와 에너지 변환 효율성 분석`,
              category: 'science',
              subject: subjectBadge,
              nodeType: 'topic',
              detail: '열역학 제1법칙 및 제2법칙을 바탕으로 시스템의 에너지 손실 메커니즘과 비가역 과정 고찰',
              inquiryQuestion: '시스템 내 열손실을 최소화하고 카르노 효율에 근접시키는 물리적 조건은?',
              methodology: '에너지 수지 계산 및 교내 과학실 MBL 열량 측정 실험',
              recordTip: '물리학과 화학의 열역학 이론을 신기술 에너지 보존 문제에 적용한 공학적 시야',
            },
            {
              id: `top-${Date.now()}-2`,
              text: `${cleanText} 분자간 상호작용과 입체화학적 결합 에너지 규명`,
              category: 'science',
              subject: subjectBadge,
              nodeType: 'topic',
              detail: '수소결합, 반데르발스 힘, 정전기적 인력을 바탕으로 물질 간의 3차원 분자 도킹 메커니즘 시뮬레이션',
              inquiryQuestion: '분자 구조의 미세한 변형이 결합 친화도에 미치는 영향은?',
              methodology: 'PDB 3D 분자 구조 데이터베이스 분석 및 결합 에너지 비교',
              recordTip: '화학II 및 생명과학II 분자 구조 개념을 3차원적으로 시각화하고 정량 해석한 탐구력',
            },
          ];
        }

        return [
          {
            id: `top-${Date.now()}-1`,
            text: `${cleanText}의 사회 제도적 쟁점과 공공 거버넌스 가이드라인 제언`,
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'topic',
            detail: '신기술 도입에 따른 법적 규제 샌드박스와 사회적 약자 보호 가이드라인 비교 분석',
            inquiryQuestion: '기술 혁신과 인간 존엄성 보호 사이의 제도적 균형점은 어디인가?',
            methodology: '국내외 정책 보고서 분석 및 모의 정책 제안서 작성',
            recordTip: '사회적 갈등을 법과 제도의 관점에서 합리적으로 조율하는 정책적 소양',
          },
          {
            id: `top-${Date.now()}-2`,
            text: `${cleanText}의 공공데이터 기반 상관분석 및 알고리즘 프로토타입`,
            category: effectiveCategory,
            subject: subjectBadge,
            nodeType: 'topic',
            detail: '공공데이터포털 Open API를 호출하여 핵심 변수 간 상관관계를 분석하고 파이썬으로 해결책 프로토타이핑',
            inquiryQuestion: '데이터에 숨겨진 구조적 패턴을 컴퓨팅 알고리즘으로 어떻게 자동 해결할 것인가?',
            methodology: 'Python Pandas EDA 및 알고리즘 흐름도 설계',
            recordTip: '데이터 분석과 소프트웨어 설계를 결합하여 실질적 문제를 해결하는 융합 창의력',
          },
        ];
      }

      // SCENARIO 4: Expanding an Action Level node (Depth 4+)
      return [
        {
          id: `adv-${Date.now()}-1`,
          text: '[파라미터 극한 검증] 시스템의 임계점(Break-even point) 및 이상치 반응 평가',
          category: effectiveCategory,
          subject: subjectBadge,
          nodeType: 'action',
          detail: '투입 파라미터나 외생 변수를 극한 조건(±50% 변동)으로 설정하여 모델의 견고성(Robustness) 검증',
          inquiryQuestion: '예측하지 못한 돌발 변수가 발생했을 때 시스템이 붕괴하지 않고 견딜 수 있는 임계치는?',
          methodology: '몬테카를로 시뮬레이션 또는 극단치 스트레스 테스트 수행',
          recordTip: '정상 상태뿐만 아니라 극한 상황까지 고려하는 시스템 아키텍트적 심화 탐구력',
        },
        {
          id: `adv-${Date.now()}-2`,
          text: '[학제 간 융합 제언] 인문학적 가치관과 공학적 효율성의 균형 가이드라인 수립',
          category: effectiveCategory,
          subject: subjectBadge,
          nodeType: 'action',
          detail: '기술적 성능 지표에 매몰되지 않고 환경적 지속가능성과 인간 중심 가치를 아우르는 헌장 제정',
          inquiryQuestion: '과학기술 연구자가 반드시 견지해야 할 윤리적 자기통제의 기준선은?',
          methodology: '유네스코 과학기술 윤리 선언문 대조 및 연구자 행동 강령 제언문 작성',
          recordTip: '지적 탐구에 그치지 않고 사회적 책임감을 내면화한 균형 잡힌 인성 및 공동체 역량',
        },
        {
          id: `adv-${Date.now()}-3`,
          text: '[교내 학술제 발표] 인포그래픽 포스터 제작 및 교사·동료 피드백 기반 리비전 완성',
          category: effectiveCategory,
          subject: subjectBadge,
          nodeType: 'action',
          detail: '탐구 전 과정을 한 장의 학술 인포그래픽 포스터로 압축하고 모의 학술제 질의응답을 거쳐 최종 리비전 완성',
          inquiryQuestion: '복잡한 연구 결과를 시각적 인포그래픽과 간결한 화법으로 대중에게 어떻게 전달할 것인가?',
          methodology: 'Canva/Figma 기반 A1 학술 포스터 디자인 및 피드백 수정 보고서 작성',
          recordTip: '자신의 연구 성과를 동료들과 공유하고 적극적으로 피드백을 수용하여 발전시키는 소통 능력',
        },
      ];
    };

    return res.json({ newNodes: getHierarchicalNodes() });
  } catch (error) {
    console.error('Error expanding mindmap:', (error as any)?.message || error);
    return res.status(500).json({ error: '마인드맵 확장 중 오류가 발생했습니다.' });
  }
});

// 3-1. API: 학생 관심사 기반 6개 전 교과 4~5단계 심화 마인드맵 전체 동적 생성
app.post('/api/ai/generate-mindmap', async (req, res) => {
  try {
    const {
      student = {},
      rootTopic = '',
      targetMajor = '',
      grade = '고등학교 2학년',
      preferredSubjects = [],
    } = req.body;

    const interest =
      rootTopic ||
      student.mainInterestTopic ||
      student.targetCareer ||
      '인공지능 및 바이오 융합 탐구';
    const major = targetMajor || student.targetMajor || '자연과학/공학 계열';
    const studentGrade = grade || student.grade || '고등학교 2학년';
    const subjects = preferredSubjects.length
      ? preferredSubjects
      : student.preferredSubjects || [];

    const fallback = getCurriculumFallback(interest, major, studentGrade, subjects);
    return res.json({
      success: true,
      interest,
      mindmap: fallback.mindmap,
      subjects: fallback.subjects,
    });
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return res.status(500).json({ error: '마인드맵 생성 중 오류가 발생했습니다.' });
  }
});

// 4. API: InquiryLogManager 탐구 활동 기록 AI 초안 작성 ('동기', '과정', '결과')
app.post('/api/ai/draft-inquiry-log', async (req, res) => {
  const {
    student = {},
    title = '',
    subject = '통합교과',
    category = '교과세특',
    gradeSemester = '2학년 1학기',
    currentMotivation = '',
    currentProcess = '',
    currentInsights = '',
    mode = 'all', // 'all' | 'motivation' | 'process' | 'insights'
  } = req.body;

  const studentName = student.name || '학생';
  const targetMajor = student.targetMajor || '자연과학/공학 계열';
  const targetCareer = student.targetCareer || '전문 연구원';
  const mainInterest = student.mainInterestTopic || '교과 연계 첨단 기술 및 사회적 문제';
  const keywords =
    Array.isArray(student.interestKeywords) && student.interestKeywords.length > 0
      ? student.interestKeywords.join(', ')
      : '융합 탐구, 모델링, 실증 분석';
  const grade = student.grade || '고등학교 2학년';

  const cleanTitle = (title || '').replace(/\[.*?\]/g, '').trim();
  const effectiveSubject = subject || '과학/수학';

  // Domain heuristic detection
  const contextStr = `${title} ${subject} ${targetMajor} ${targetCareer} ${mainInterest} ${keywords}`.toLowerCase();
  const isBio = /생명|바이오|유전자|crispr|의약|단백질|의예|약학|세포|면역/i.test(contextStr);
  const isAi = /ai|인공지능|컴퓨터|소프트웨어|알고리즘|머신러닝|딥러닝|빅데이터|정보/i.test(contextStr);
  const isEnv = /환경|기후|탄소|생태|신재생|esg|오염|지구/i.test(contextStr);
  const isEcon = /경제|경영|금융|시장|무역|소비자|가격|정책|화폐/i.test(contextStr);
  const isMath = /수학|미적분|확률|통계|기하|수치|방정식/i.test(contextStr);

  const generateFallback = () => {
    let draftTitle = title;
    if (!draftTitle || draftTitle.trim() === '') {
      if (isBio) draftTitle = `[${effectiveSubject}] ${keywords.split(',')[0] || '유전자 발현'} 메커니즘 분석과 생명윤리적 고찰`;
      else if (isAi) draftTitle = `[${effectiveSubject}] 알고리즘 시간 복잡도와 최적화 모델링 탐구`;
      else if (isEnv) draftTitle = `[${effectiveSubject}] 환경 데이터 기반 탄소 저감 효율성 수리 모델링`;
      else if (isEcon) draftTitle = `[${effectiveSubject}] 시장 불확실성 하에서의 합리적 의사결정 모형 분석`;
      else if (isMath) draftTitle = `[${effectiveSubject}] 실생활 변화율 예측을 위한 함수의 연속성과 미분 모델링`;
      else draftTitle = `[${effectiveSubject}] ${mainInterest.slice(0, 20)} 관련 핵심 메커니즘 탐구`;
    }

    const activeSubjectTerm = effectiveSubject.includes('수학')
      ? '수학적 모델링과 변화율 분석'
      : effectiveSubject.includes('과학') || effectiveSubject.includes('생명') || effectiveSubject.includes('화학') || effectiveSubject.includes('물리')
      ? '과학적 탐구 방법론과 가설 검증'
      : effectiveSubject.includes('사회') || effectiveSubject.includes('경제') || effectiveSubject.includes('윤리')
      ? '사회 구조적 쟁점과 통계 데이터 분석'
      : effectiveSubject.includes('정보')
      ? '알고리즘적 사고와 데이터 자동화'
      : '교과 핵심 이론과 실생활 연계 고찰';

    const draftMotivation = currentMotivation && currentMotivation.length > 20
      ? `${currentMotivation.trim()}\n\n[진로 융합 보완] 평소 '${targetCareer}'을(를) 지향하며 '${targetMajor}' 진학을 준비해 온 관점에서, 교과 수업 중 다룬 핵심 원리와 '${mainInterest}' 간의 연결 고리를 발견함. 특히 단순 이론 학습을 넘어 실세계 현상에서 발생하는 불확실성과 변인 간 상관관계를 교과 개념으로 정량화하고 검증하고자 탐구를 시작함.`
      : `교과 수업 중 ${activeSubjectTerm} 단원을 학습하며 교과서에 제시된 원리가 실세계 복합 시스템에 어떻게 적용되는지에 대한 지적 호기심을 갖게 됨. 평소 '${targetCareer}'을(를) 꿈꾸며 관심을 두었던 '${mainInterest}' 분야의 최근 쟁점(${keywords})을 접하고, 이를 교과에서 배운 개념과 결합하여 자기주도적으로 깊이 있게 탐구해보고자 연구 주제를 기획함.`;

    const draftProcess = currentProcess && currentProcess.length > 20
      ? `${currentProcess.trim()}\n\n[추가 실천 단계] 교내 학술 DB(KCI)에서 선행 연구 논문 2편을 선정하여 기존 연구의 한계점과 변인 통제 방식을 비교 분석함. 수집된 자료를 바탕으로 ${activeSubjectTerm}을 적용하여 정량적 데이터 시뮬레이션을 수행하고 가설의 타당성을 입증함.`
      : `1단계 [이론 고찰 및 문제 정의]: 교과서의 핵심 개념을 재정립하고, KCI 등 학술 데이터베이스를 통해 '${cleanTitle || mainInterest}' 관련 선행 연구 논문 2편을 분석하여 기존 연구의 전제 조건과 해결 과제를 도출함.\n\n2단계 [자료 수집 및 정량 모델링]: 실제 공공 데이터 및 실험 매개변수를 수집하고, 독립변수와 종속변수를 명확히 설정하여 변인 통제 환경을 설계함. 수치 계산 도구(엑셀/파이썬/지오지브라)를 활용해 데이터 시뮬레이션 및 상관관계를 분석함.\n\n3단계 [결과 해석 및 한계 분석]: 도출된 결과값을 이론적 예측치와 비교하고, 오차가 발생한 물리적·환경적 요인을 정밀 분석하여 모델의 신뢰도를 객관적으로 평가함.`;

    const draftInsights = currentInsights && currentInsights.length > 20
      ? `${currentInsights.trim()}\n\n[성장 및 후속 연계] 본 탐구를 통해 단편적 지식 암기에서 벗어나 문제를 스스로 정의하고 검증하는 학문적 주도성을 확립함. 향후 상위 연계 교과목에서 다루는 심화 원리를 결합하여 2단계 후속 탐구로 발전시킬 계획임.`
      : `이번 탐구를 통해 교과서 속 추상적인 수식과 원리가 실세계 '${targetMajor}' 현장의 핵심 난제를 해결하는 강력한 도구가 됨을 체감함. 특히 데이터 분석과 오차 원인 규명 과정에서 실패를 두려워하지 않는 과학적·논리적 탐구 태도의 중요성을 깊이 깨달음. 탐구 과정에서 새롭게 도출된 의문을 해결하기 위해, 차기 학기 연계 과목과 연결하여 심화 후속 연구를 지속적으로 수행하겠다는 포부를 다짐.`;

    const draftBooks = isBio
      ? '《유전자 편집의 시대》(제니퍼 다우드나), 《생명이란 무엇인가》(에르빈 슈뢰딩거)'
      : isAi
      ? '《알고리즘, 인생을 계산하다》(브라이언 크리스천), 《마스터 알고리즘》(페드로 도밍고스)'
      : isEnv
      ? '《침묵의 봄》(레이첼 카슨), 《탄소중립의 기후학》(조천호)'
      : isEcon
      ? '《괴짜경제학》(스티븐 레빗), 《넛지》(리처드 탈러)'
      : isMath
      ? '《미적분의 힘》(스티븐 스트로가츠), 《통계의 미학》(최제호)'
      : '《부분과 전체》(베르너 하이젠베르크), 《생각의 탄생》(로버트 루트번스타인)';

    const draftDeliverables = '탐구 분석 보고서 (A4 5매), 데이터 시뮬레이션 결과 시트, 핵심 인포그래픽 포스터';

    return {
      title: draftTitle,
      motivation: draftMotivation,
      process: draftProcess,
      insights: draftInsights,
      relatedBooks: draftBooks,
      deliverables: draftDeliverables,
    };
  };

  try {
    if (!hasRealApiKey || !ai) {
      return res.json(generateFallback());
    }

    const prompt = `당신은 대한민국 고등학교 교육과정 및 학생부종합전형(학종) 학교생활기록부 교과 세부능력 및 특기사항(세특) 작성 최고 권위자입니다.
학생의 진로 희망과 핵심 관심사를 바탕으로, 탐구 활동 일지의 '동기', '과정', '결과(배운 점)' 항목 초안을 전문적이고 교육부 규정에 적합하게 작성해주세요.

[학생 프로필]
- 이름: ${studentName} (${grade})
- 희망 진로(직업): ${targetCareer}
- 목표 학과(전공): ${targetMajor}
- 핵심 관심 연구 분야 / 최근 호기심: ${mainInterest}
- 관심 키워드: ${keywords}

[탐구 활동 개요]
- 활동 주제명: ${title || '(주제가 아직 없으므로 학생의 관심사와 교과에 맞춰 추천)'}
- 연계 교과목: ${subject}
- 학생부 영역: ${category}
- 이수 학기: ${gradeSemester}
${currentMotivation ? `- 기존 작성된 동기 내용: "${currentMotivation}" (이를 존중하고 심화 보완)` : ''}
${currentProcess ? `- 기존 작성된 과정 내용: "${currentProcess}" (이를 존중하고 심화 보완)` : ''}
${currentInsights ? `- 기존 작성된 결과 내용: "${currentInsights}" (이를 존중하고 심화 보완)` : ''}
${mode !== 'all' ? `- 중점 작성 요청 항목: ${mode} (해당 항목을 더욱 심혈을 기울여 상세히 작성)` : ''}

[작성 지침 - 엄격 준수]
1. 고등학교 학생부 기재요령 준수: 소논문, R&E, 사설 대회/인증시험, 외부 수상실적 등 금지어 일체 배제.
2. 교과 연계성: 교과 수업 중 배운 개념·원리(예: 교과서 단원, 수식, 법칙)에서 출발하는 동기.
3. 구체적 실천성: 단순 '인터넷 검색'이나 '자료 조사'가 아닌, 1단계(이론 고찰/선행 연구 분석), 2단계(자료 수집/수리 모델링/변인 통제 실험/데이터 분석), 3단계(결과 검증 및 오차 분석) 등 구체적이고 학업 역량이 드러나는 방법론 서술.
4. 지적 성장 및 후속 연계: 단순 소감("유익했다")이 아닌, 새로운 깨달음, 진로 시각의 심화, 차기 학기 후속 탐구 과제 제시.

반드시 아래 JSON 형식으로만 응답하세요. 마크다운 코드블록(\`\`\`json)은 포함하거나 제외해도 되나 JSON 파싱이 가능해야 합니다:
{
  "title": "구체적인 탐구 주제명 (교과명과 핵심 내용 포함)",
  "motivation": "1. 탐구 동기 및 핵심 문제의식 (교과 수업 연계, 250~350자 내외)",
  "process": "2. 탐구 과정 및 실천 방법론 (단계별 구체적 실천 과정, 350~500자 내외)",
  "insights": "3. 배운 점, 지적 성장 및 후속 탐구 계획 (250~350자 내외)",
  "relatedBooks": "연계 도서 및 참고 자료 (도서명 및 저자 2권 추천)",
  "deliverables": "산출물 및 증빙 자료 요약 (예: 탐구 보고서 5매, 수치 시뮬레이션 시트 등)"
}`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 5000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const text = response.text || '';
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.json({
      title: parsed.title || title || `${subject} 심화 탐구`,
      motivation: parsed.motivation || '',
      process: parsed.process || '',
      insights: parsed.insights || '',
      relatedBooks: parsed.relatedBooks || '',
      deliverables: parsed.deliverables || '',
    });
  } catch (error) {
    console.error('Error generating inquiry log draft, serving curriculum fallback:', (error as any)?.message || error);
    return res.json(generateFallback());
  }
});

// Helper: Generate tailored curriculum units for ALL 6 SUBJECTS based on student career & interest
function generateTailoredUnitsForStudent(student: any) {
  const targetCareer = student?.targetCareer || '전문 연구원';
  const targetMajor = student?.targetMajor || '자연과학/공학 계열';
  const mainInterest = student?.mainInterestTopic || '교과 연계 첨단 기술 쟁점';
  const keywords = Array.isArray(student?.interestKeywords) && student.interestKeywords.length > 0
    ? student.interestKeywords.join(', ')
    : '심화 원리, 정량 모델링, 오차 분석';

  const contextStr = `${targetCareer} ${targetMajor} ${mainInterest} ${keywords}`.toLowerCase();
  const isBio = /생명|바이오|유전자|crispr|의약|단백질|세포|의예|약학|간호|의학/i.test(contextStr);
  const isAi = /ai|인공지능|컴퓨터|알고리즘|머신러닝|소프트웨어|빅데이터|코딩|데이터/i.test(contextStr);
  const isEnvOrEcon = /환경|기후|탄소|생태|신재생|esg|지구|경제|경영|배출권|금융|시장|피구세/i.test(contextStr);
  const isPhysicsOrRobotics = /물리|반도체|에너지|배터리|열역학|기계|로봇|모빌리티|항공|우주/i.test(contextStr);

  const cleanInterest = mainInterest.slice(0, 32);

  // 1. Math Unit
  const mathUnit = {
    id: 'tailored-unit-math',
    subjectName: '수학 (미적분 / 확률과 통계)',
    subjectCategory: 'math' as const,
    gradeLevel: '고2' as const,
    semester: '1학기' as const,
    unitName: `${cleanInterest}의 변화율 예측 및 수리 최적화 모델링 (미적분/확통)`,
    unitConcepts: ['순간변화율과 도함수', '극대·극소 최적화', '조건부 확률(베이즈 정리)', '회귀분석 최소제곱법', '잔차와 오차 분산'],
    keyPrinciples: `${cleanInterest} 시스템의 동적 변화율을 수학적 함수 및 확률 분포로 모델링하고, 미분계수와 최적화 기법을 적용하여 예측 오차를 최소화하는 수리적 원리`,
    samplePhenomena: [
      `${cleanInterest}의 핵심 변인 간 상관관계 및 시간에 따른 변화율 추이 분석`,
      `시스템 효율 극대화 및 비용/위험 최소화를 위한 극값(극대·극소) 임계 조건 도출`,
      `불확실한 관측 데이터가 주어졌을 때 베이즈 정리를 적용한 사후 확률 갱신 모델링`,
      `공공 통계 데이터를 기반으로 한 최소제곱법 회귀선 도출 및 잔차 제곱합(RSS) 오차 분석`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[수학] ${cleanInterest}의 변화율 예측과 수리적 최적화 모델링`,
      inquiryQuestion: `${cleanInterest} 시스템의 복합 변수를 수학적 함수로 모델링할 때 예측 오차를 최소화하는 최적 임계점은 무엇인가?`,
      observedPhenomenon: `${cleanInterest} 관련 실세계 데이터에서 관찰되는 비선형적 변화율과 예측 오차 발생 현상`,
      phenomenaChips: [
        `${cleanInterest}의 핵심 변인 간 상관관계 및 시간에 따른 변화율 추이 분석`,
        `시스템 효율 극대화 및 비용/위험 최소화를 위한 극값(극대·극소) 임계 조건 도출`,
        `불확실한 관측 데이터가 주어졌을 때 베이즈 정리를 적용한 사후 확률 갱신 모델링`,
      ],
      selectedLens: '도함수의 부호 판정 및 극대·극소 최적화 렌즈',
      lensOptions: [
        '도함수의 부호 판정 및 극대·극소 최적화 렌즈',
        '베이즈 조건부 확률 및 불확실성 사후 추론 렌즈',
        '회귀분석 잔차 분석 및 수치 시뮬레이션 렌즈',
      ],
      questionOptions: [
        `${cleanInterest} 시스템에서 매개변수 변화에 따른 변화율이 0이 되는 최적 극값은 어디인가?`,
        `새로운 관측 데이터가 주어졌을 때 베이즈 정리를 통해 사후 신뢰도를 어떻게 갱신할 것인가?`,
        `단순 선형 회귀모델의 잔차 분석을 통해 비선형 항을 추가해야 하는 수학적 근거는 무엇인가?`,
      ],
      recMethod: 'simulation' as const,
      clicheTwist: {
        approach: '[정량 수리 모델링 Twist]',
        subTopic: `${cleanInterest}의 파라미터 민감도 분석 및 지오지브라/파이썬 수치 시뮬레이션`,
        academicLens: '미적분 극대·극소 및 최소제곱법 잔차 분석',
        inquiryQuestion: `변수 변화에 따른 결과값의 수렴 및 발산 구간을 어떻게 수학적으로 증명할 것인가?`,
      },
      motivation: `교과 수업 중 미분계수와 최적화 단원을 학습하며, 수학 공식이 교과서 속 문제풀이에 머무르지 않고 평소 희망해 온 '${targetCareer}' 및 '${targetMajor}' 분야의 핵심 쟁점인 '${cleanInterest}' 시스템에 어떻게 적용될 수 있는지 깊은 지적 호기심을 갖게 됨. 단순 정성적 조사를 넘어 지오지브라와 수리 모델링을 통해 최적 임계점을 정량적으로 도출하고 오차를 분석해보고자 본 탐구를 기획함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)' as const,
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '공통수학 / 통합교과',
          focus: '함수의 증감과 일상 데이터의 그래프 표현',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 기초 통계 조사 및 일상 속 함수 모델링`,
          connectionReason: '1학년 수학 기본 성취기준을 충실히 이수했음을 입증',
        },
        {
          grade: '2학년 (전공 심화)' as const,
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '수학Ⅱ / 미적분',
          focus: '도함수의 부호 판정 및 매개변수 최적화 수리 모델링',
          topicIdea: `[수학] ${cleanInterest}의 변화율 예측과 수리적 최적화 모델링`,
          connectionReason: '선택 과목의 미적분·확통 핵심 원리를 진로 쟁점과 유기적으로 결합하여 검증',
        },
        {
          grade: '3학년 (융합 발전)' as const,
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '인공지능 수학 / 고급 수학',
          focus: '경사하강법 및 다변수 함수의 최적화 알고리즘 구현',
          topicIdea: `${cleanInterest}의 다변수 손실 함수 최적화와 경사하강법 시뮬레이션`,
          connectionReason: '단발성 탐구로 끝나지 않고 3개년 동안 학문적 성장이 꼬리를 물고 이어지는 연속성 증명',
        },
      ],
      teacherReviewPoints: {
        academic: `교과서의 미분 및 확률 개념을 전공 쟁점과 유기적으로 결합하여 정량적 수리 모델로 구현해내는 뛰어난 학업 탐구력`,
        career: `'${targetCareer}'에 필요한 수리적 문제 해결 역량과 데이터 분석 태도를 주도적으로 발휘하는 높은 전공 적합성`,
        community: `수학적 예측 모델의 현실 적용 한계와 데이터 편향 가능성을 비판적으로 검토하는 성숙한 연구 윤리 의식`,
      },
      relatedBooks: '《수학으로 생각하는 힘》(키트 예이츠), 《미적분의 힘》(스티븐 스트로가츠)',
      deliverables: '수리 최적화 모델링 보고서, 지오지브라 시뮬레이션 조작 화면 캡처, 오차 분석표',
    },
  };

  // 2. Science Unit
  const scienceSubject = isBio
    ? '생명과학Ⅱ / 화학Ⅱ'
    : isPhysicsOrRobotics
    ? '물리학Ⅰ/Ⅱ / 화학Ⅱ'
    : isEnvOrEcon
    ? '지구과학Ⅰ / 물리학Ⅰ'
    : '과학 (통합과학 / 물리학·생명과학·화학)';

  const scienceUnit = {
    id: 'tailored-unit-science',
    subjectName: scienceSubject,
    subjectCategory: 'science' as const,
    gradeLevel: '고2' as const,
    semester: '1학기' as const,
    unitName: `${cleanInterest} 시스템의 물리화학적 메커니즘과 반응·에너지 변환 효율 분석`,
    unitConcepts: ['에너지 보존과 변환 효율', '화학 평형과 르샤틀리에 원리', '반응 속도와 활성화 에너지', '엔트로피와 열역학 법칙', '변인 통제'],
    keyPrinciples: `${cleanInterest} 시스템의 물리화학적 원리와 분자/에너지 수준의 메커니즘을 규명하고, 실험 및 가상 시뮬레이션을 통해 시스템의 작동 효율과 안정성을 극대화하는 과학적 탐구 원리`,
    samplePhenomena: [
      `${cleanInterest} 시스템 도입 시 나타나는 에너지 전달 손실 및 효율 저하 현상 분석`,
      `온도, 농도, 압력 등 환경 변인 변화에 따른 시스템의 화학 평형 이동 추이`,
      `선행 연구 대비 신소재/신기술 적용 시 열역학적 효율 및 생체/환경 안정성 트레이드오프`,
      `교내 과학실 MBL 센서 및 분자 시뮬레이션을 통한 변인 통제 모의실험 결과 분석`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[과학] ${cleanInterest} 시스템의 물리화학적 메커니즘과 반응 효율 검증`,
      inquiryQuestion: `기존 시스템 대비 ${cleanInterest} 신기술 도입 시 열역학적 효율 및 안정성 측면의 트레이드오프는 어떠한가?`,
      observedPhenomenon: `${cleanInterest} 시스템의 에너지 변환 및 반응 과정에서 발생하는 열손실 및 불안정성 현상`,
      phenomenaChips: [
        `${cleanInterest} 시스템 도입 시 나타나는 에너지 전달 손실 및 효율 저하 현상 분석`,
        `온도, 농도, 압력 등 환경 변인 변화에 따른 시스템의 화학 평형 이동 추이`,
        `선행 연구 대비 신소재/신기술 적용 시 열역학적 효율 및 안정성 트레이드오프`,
      ],
      selectedLens: '열역학 제1·2법칙 및 에너지 변환 효율 렌즈',
      lensOptions: [
        '열역학 제1·2법칙 및 에너지 변환 효율 렌즈',
        '화학 평형 이동 및 르샤틀리에 원리 렌즈',
        '분자 수준 메커니즘 및 활성화 에너지 장벽 렌즈',
      ],
      questionOptions: [
        `반응 속도와 효율을 저해하는 핵심 물리화학적 장애 요인은 무엇인가?`,
        `선행 연구에서 제안된 신기술 분자 구조는 어떻게 반응 장벽을 낮추는가?`,
        `실험 장비의 한계점을 극복하기 위해 설계할 수 있는 2단계 후속 실험 프로토콜은?`,
      ],
      recMethod: 'simulation' as const,
      clicheTwist: {
        approach: '[변인통제 모의실험 Twist]',
        subTopic: `${cleanInterest}의 환경 변인(온도·압력·농도)에 따른 반응 속도 및 에너지 손실 정량 측정`,
        academicLens: '화학 평형 이동 및 열역학 엔트로피 렌즈',
        inquiryQuestion: `외생 변인의 교란 속에서도 시스템의 정상 상태(Steady-State)를 유지하는 최적 완충 조건은?`,
      },
      motivation: `교과 수업 중 화학 평형 및 열역학 단원을 학습하며 교과서에 나오는 기본 원리가 '${cleanInterest}' 시스템에 적용될 때 마주하는 에너지 손실 및 제어 한계점에 주목하게 됨. 평소 희망해 온 '${targetCareer}' 관점에서 교내 MBL 센서와 분자 시뮬레이션을 활용하여 변인 간 인과관계를 객관적으로 입증하고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)' as const,
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '통합과학',
          focus: '에너지 보존 법칙 및 물질의 물리화학적 특성 관찰',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 기초 에너지 흐름 및 실생활 적용 보고서`,
          connectionReason: '1학년 통합과학 기본 성취기준을 충실히 이수했음을 입증',
        },
        {
          grade: '2학년 (전공 심화)' as const,
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: scienceSubject,
          focus: '반응 속도론 및 분자 시뮬레이션을 통한 정량 메커니즘 규명',
          topicIdea: `[과학] ${cleanInterest} 시스템의 물리화학적 메커니즘과 반응 효율 검증`,
          connectionReason: '선택 과학 과목의 핵심 이론을 전공 쟁점과 결합하여 심층 실증',
        },
        {
          grade: '3학년 (융합 발전)' as const,
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '융합과학탐구 / 고급과학',
          focus: '나노 스케일 인터페이스 및 열역학적 최적화 프로토콜',
          topicIdea: `${cleanInterest}의 열역학적 비가역 손실 최소화를 위한 차세대 소재 설계 연구`,
          connectionReason: '3개년 동안 학문적 성장이 유기적으로 이어지는 연구의 연속성 증명',
        },
      ],
      teacherReviewPoints: {
        academic: `과학적 이론을 실험 설계와 연결하여 오차 원인을 스스로 분석하고 개선책을 제시한 뛰어난 탐구 역량`,
        career: `'${targetCareer}'에서 요구되는 정밀한 변인 통제와 데이터 수집의 성실성을 입증`,
        community: `기술 발전이 가져올 생태계 및 환경적 안정성을 함께 고려하는 성숙한 연구자적 자질`,
      },
      relatedBooks: '《부분과 전체》(베르너 하이젠베르크), 《생명이란 무엇인가》(에르빈 슈뢰딩거)',
      deliverables: 'MBL 센서 측정 데이터 시트, 3D 분자 구조 시뮬레이션 캡처, 과학 탐구 보고서 초안',
    },
  };

  // 3. Social Unit
  const socialUnit = {
    id: 'tailored-unit-social',
    subjectName: '사회/윤리/경제 (생활과 윤리 / 경제 / 사회문화)',
    subjectCategory: 'social' as const,
    gradeLevel: '고2' as const,
    semester: '1학기' as const,
    unitName: `${cleanInterest} 도입에 따른 윤리적 딜레마와 규제 샌드박스·외부효과 보완 방안`,
    unitConcepts: ['롤스의 정의론(차등 원칙)', '부정적 외부효과와 피구세', '코스 정리', '정보 비대칭성과 시장 실패', '위험사회론과 기술 윤리'],
    keyPrinciples: `${cleanInterest} 혁신 기술 도입 시 발생하는 수혜 집단과 소외 집단 간의 갈등을 조정하고, 시장의 외부효과를 내부화하여 지속가능한 사회적 합의를 이끌어내는 규범·경제학적 원리`,
    samplePhenomena: [
      `${cleanInterest} 신기술 확산 시 나타나는 사회적 불평등 및 취약 계층 소외 현상`,
      `시장 기구가 해결하지 못하는 외부불경제 상황과 정부의 피구세/보조금 정책 효과`,
      `신기술 상용화를 촉진하는 규제 샌드박스와 공공 안전 확보 간의 상충 딜레마`,
      `국내외 가이드라인(EU, OECD 등) 비교 고찰 및 모의 정책 공청회 조례안 설계`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[사회/윤리] ${cleanInterest} 도입에 따른 윤리적 딜레마와 법·제도적 보완 방안`,
      inquiryQuestion: `${cleanInterest} 혁신 기술 도입 시 발생하는 수혜 집단과 소외 집단 간의 갈등을 어떻게 공정하게 조정할 것인가?`,
      observedPhenomenon: `${cleanInterest} 상용화 과정에서 발생하는 윤리적 책임 소재 모호성 및 경제적 불평등 심화 현상`,
      phenomenaChips: [
        `${cleanInterest} 신기술 확산 시 나타나는 사회적 불평등 및 취약 계층 소외 현상`,
        `신기술 상용화를 촉진하는 규제 샌드박스와 공공 안전 확보 간의 상충 딜레마`,
        `국내외 가이드라인(EU, OECD 등) 비교 고찰 및 모의 정책 공청회 조례안 설계`,
      ],
      selectedLens: '롤스의 정의론 및 사회적 약자 보호(차등 원칙) 렌즈',
      lensOptions: [
        '롤스의 정의론 및 사회적 약자 보호(차등 원칙) 렌즈',
        '미시경제학 시장 실패 및 피구세 외부효과 내부화 렌즈',
        '법철학적 책임 귀속 및 규제 샌드박스 법리 렌즈',
      ],
      questionOptions: [
        `기술 수혜 계층과 소외 계층 사이의 구조적 격차를 유발하는 제도적 원인은 무엇인가?`,
        `공공 안전을 보장하면서도 기업의 기술 혁신 유인을 저해하지 않는 타협안은?`,
        `공동체의 지속가능성을 위해 시민들이 지켜야 할 자율 규범의 핵심 덕목은 무엇인가?`,
      ],
      recMethod: 'practical_policy' as const,
      clicheTwist: {
        approach: '[규제 샌드박스 설계 Twist]',
        subTopic: `${cleanInterest}의 공공 안전과 산업 혁신을 양립시키는 단계적 정책 가이드라인`,
        academicLens: '롤스의 정의론 차등 원칙 및 피구세 외부효과 내부화 렌즈',
        inquiryQuestion: `사회적 약자 보호를 담보하면서도 혁신 기업의 투자 유인을 저해하지 않는 타협안은?`,
      },
      motivation: `사회 교과에서 사회 정의와 시장 실패 단원을 학습하며, '${cleanInterest}' 같은 첨단 혁신이 사회에 도입될 때 발생하는 규범적 혼란과 불평등 문제에 주목하게 됨. 단순 찬반 토론을 넘어 롤스의 차등 원칙과 국내외 규제 법령을 비교 분석하여 실효성 있는 정책 조례안을 설계해보고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)' as const,
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '통합사회',
          focus: '현대 사회 갈등과 인권 보장의 기본 원리',
          topicIdea: `${cleanInterest.slice(0, 16)} 기술 발전과 사회적 소외 계층의 권리 현황`,
          connectionReason: '1학년 통합사회 인권 및 정의 성취기준을 충실히 이수',
        },
        {
          grade: '2학년 (전공 심화)' as const,
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '생활과 윤리 / 경제',
          focus: '롤스의 차등 원칙 및 피구세 모델링을 통한 정책 대안 도출',
          topicIdea: `[사회/윤리] ${cleanInterest} 도입에 따른 윤리적 딜레마와 법·제도적 보완 방안`,
          connectionReason: '철학적 규범 윤리와 실정법 조항을 융합하여 입체적으로 법리를 분석',
        },
        {
          grade: '3학년 (융합 발전)' as const,
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '사회·문화 / 정치와 법',
          focus: '글로벌 규범 조화 및 디지털 시민 권리 장전 제언',
          topicIdea: `${cleanInterest}의 글로벌 표준화와 시민 참여형 자율 규제 거버넌스 모델 연구`,
          connectionReason: '지역 사회를 넘어 글로벌 차원의 법제도적 통찰로 발전',
        },
      ],
      teacherReviewPoints: {
        academic: `철학적 규범 윤리와 경제학적 시장 분석을 융합하여 입체적인 시각으로 정책을 입안한 탁월한 역량`,
        career: `'${targetCareer}'에 필요한 사회적 책임감과 정책 조정 능력을 훌륭히 발휘`,
        community: `공동체적 연대감과 사회적 약자에 대한 공감을 바탕으로 현실적인 실천 대안을 도출`,
      },
      relatedBooks: '《정의란 무엇인가》(마이클 샌델), 《기술의 충격》(케빈 켈리)',
      deliverables: '모의 정책 공청회 대본, 규제 샌드박스 정책 제안서 초안, 조례안 문안',
    },
  };

  // 4. Korean Unit
  const koreanUnit = {
    id: 'tailored-unit-korean',
    subjectName: '국어 (독서 / 화법과 작문)',
    subjectCategory: 'korean' as const,
    gradeLevel: '고2' as const,
    semester: '1학기' as const,
    unitName: `${cleanInterest} 관련 최신 학술 담론 비판적 독해 및 미디어 프레이밍 텍스트 비평문 작성`,
    unitConcepts: ['툴민(Toulmin) 논증 모델', '주장-근거-담보의 정합성', '비판적 담화 분석(CDA)', '미디어 프레이밍 효과', '비형식적 논리적 오류'],
    keyPrinciples: `${cleanInterest} 관련 대중 매체 보도와 전문 학술 칼럼의 담화 구조를 분석하여 내재된 전제와 프레임 편향을 비판적으로 검증하고 타당한 학술 비평문을 작성하는 고급 문해력`,
    samplePhenomena: [
      `${cleanInterest} 관련 자극적 언론 헤드라인의 프레이밍과 대중의 과학적 오해 형성 과정`,
      `전문 학술 논문 초록(Abstract)의 IMRaD 논리 전개와 완곡어법(Hedging) 표현 분석`,
      `상반된 입장의 신문 사설 3편에 툴민 논증 모형을 적용한 논리적 비약 및 오류 검증`,
      `비전공자 청중에게 과학적 진실과 사회적 과제를 설득력 있게 전달하는 학술 에세이 집필`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[국어] ${cleanInterest} 관련 전문 학술 담론 비판적 독해 및 미디어 프레이밍 비평`,
      inquiryQuestion: `미디어와 학술 담론에서 ${cleanInterest}를 설명하는 프레임의 한계점과 대중적 오해는 무엇인가?`,
      observedPhenomenon: `언론 매체에서 ${cleanInterest} 관련 과학적 사실을 자극적인 은유와 단정적 어조로 왜곡 보도하는 현상`,
      phenomenaChips: [
        `${cleanInterest} 관련 자극적 언론 헤드라인의 프레이밍과 대중의 과학적 오해 형성 과정`,
        `상반된 입장의 신문 사설 3편에 툴민 논증 모형을 적용한 논리적 비약 및 오류 검증`,
        `비전공자 청중에게 과학적 진실과 사회적 과제를 설득력 있게 전달하는 학술 에세이 집필`,
      ],
      selectedLens: '툴민(Toulmin) 논증 모형 및 비판적 담화 분석(CDA) 렌즈',
      lensOptions: [
        '툴민(Toulmin) 논증 모형 및 비판적 담화 분석(CDA) 렌즈',
        '과학철학적 인식론 및 텍스트 프레이밍 렌즈',
        '수사학적 은유 및 대중 소통의 신뢰성 렌즈',
      ],
      questionOptions: [
        `언론의 보도 프레임이 대중의 과학적 의사결정에 미치는 왜곡 효과는 무엇인가?`,
        `학술 칼럼의 논리 구조와 언론 보도의 서사 구조 간의 질적 차이는 무엇인가?`,
        `타자의 비판적 시각을 수용하여 내 논리를 어떻게 더 견고하게 다듬었는가?`,
      ],
      recMethod: 'literature' as const,
      clicheTwist: {
        approach: '[툴민 모형 담화분석 Twist]',
        subTopic: `${cleanInterest} 보도 사설 3편의 주장-데이터-담보 논리적 정합성 및 프레이밍 비평`,
        academicLens: '비판적 담화 분석(CDA) 및 툴민 논증 모델 렌즈',
        inquiryQuestion: `언론의 보도 프레임이 대중의 합리적 의사결정에 미치는 왜곡 효과를 어떻게 극복할 것인가?`,
      },
      motivation: `국어 독서 단원에서 학술 텍스트의 비판적 독해 단원을 학습하며, 언론이나 대중 매체에서 다루어지는 '${cleanInterest}' 관련 정보가 자극적인 프레임으로 왜곡되어 전달되는 현상에 문제의식을 느낌. 툴민의 논증 모형을 적용하여 기사와 사설의 논리적 허점을 분석하고 과학적 진실을 전달하는 균형 잡힌 학술 비평문을 완성하고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)' as const,
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '국어 (공통)',
          focus: '사실과 의견 구별 및 논설문의 기본 구조 파악',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 대중 기사의 어휘 사용과 설득 전략 분석`,
          connectionReason: '1학년 국어 사실적·추론적 독해 성취기준을 충실히 이수',
        },
        {
          grade: '2학년 (전공 심화)' as const,
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '독서 / 화법과 작문',
          focus: '툴민 모형 적용 텍스트 구조 분석 및 비판적 학술 에세이 집필',
          topicIdea: `[국어] ${cleanInterest} 관련 전문 학술 담론 비판적 독해 및 미디어 프레이밍 비평`,
          connectionReason: '논증의 타당성과 설득력을 학문적 분석틀로 정밀하게 검증',
        },
        {
          grade: '3학년 (융합 발전)' as const,
          stageName: '차년도 후속 심화 및 융합 과제',
          subject: '심화 국어 / 고전과 윤리',
          focus: '과학기술 시대의 인문학적 성찰 및 학술 소통 저널 발간',
          topicIdea: `${cleanInterest}의 언어적 프레이밍이 공공 정책 수립에 미치는 영향 비평`,
          connectionReason: '인문학적 사유를 바탕으로 과학기술 담론을 비평하는 융합 인재상 증명',
        },
      ],
      teacherReviewPoints: {
        academic: `전문 텍스트를 정확하게 독해하고 비판적 안목으로 사회적 함의를 도출해내는 학업 기초 역량`,
        career: `전문 지식을 명료하고 호소력 있는 문체로 풀어내는 우수한 작문 및 의사소통 역량`,
        community: `타인의 비판을 겸허히 수용하고 주장의 완성도를 높여가는 지적 개방성과 성장성`,
      },
      relatedBooks: '《과학 콘서트》(정재승), 《생각의 탄생》(로버트 루트번스타인)',
      deliverables: '툴민 논증 구조도 다이어그램, 언론 보도 어휘 분석표, 학술 비평문 초안',
    },
  };

  // 5. English Unit
  const englishUnit = {
    id: 'tailored-unit-english',
    subjectName: '영어 (심화 영어 / 영어 독해와 작문)',
    subjectCategory: 'english' as const,
    gradeLevel: '고2' as const,
    semester: '공통' as const,
    unitName: `${cleanInterest} 관련 국제 학술 저널(Nature/Science) IMRaD 초록 분석 및 영문 리포트 작성`,
    unitConcepts: ['IMRaD 논문 구조', 'Academic Word List(AWL)', 'Hedging 완곡어법', 'Executive Summary 영문 요약', '글로벌 학술 피어 리뷰'],
    keyPrinciples: `${cleanInterest} 관련 국제 SCI급 오픈액세스 저널 원문을 직접 탐색하고 연구 가설-방법-결론을 영문 구조화 요약서로 작성하여 글로벌 학술 소통 역량을 입증하는 원리`,
    samplePhenomena: [
      `Nature, Science 등 국제 저널 최근 3개년 오픈액세스 논문 2편 선정 및 핵심 어휘 정리`,
      `국제 학술계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제(Challenge) 분석`,
      `Background-Key Findings-Implications 3단 구조로 250단어 영문 Executive Summary 작성`,
      `국제 연구 결과가 한국 사회 및 교육과정에 주는 시사점에 관한 3분 영문 프레젠테이션`,
    ],
    isTailored: true,
    tailoredPlan: {
      topicTitle: `[영어] ${cleanInterest} 글로벌 저널(Nature/Science) 초록(Abstract) 분석 및 영문 리포트`,
      inquiryQuestion: `국제 학술계에서 ${cleanInterest} 분야의 가장 긴급한 연구 트렌드와 공통 키워드는 무엇인가?`,
      observedPhenomenon: `국제 학술 저널의 IMRaD 구조에서 연구 가설을 입증하기 위해 사용하는 정교한 학술 영어 수사 장치`,
      phenomenaChips: [
        `Nature, Science 등 국제 저널 최근 3개년 오픈액세스 논문 2편 선정 및 핵심 어휘 정리`,
        `국제 학술계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제(Challenge) 분석`,
        `Background-Key Findings-Implications 3단 구조로 250단어 영문 Executive Summary 작성`,
      ],
      selectedLens: 'IMRaD 구조 분석 및 Academic Hedging 완곡어법 렌즈',
      lensOptions: [
        'IMRaD 구조 분석 및 Academic Hedging 완곡어법 렌즈',
        'Academic Word List(AWL) 전공 전문 어휘망 렌즈',
        '글로벌 표준 연구 윤리 및 피어 리뷰 렌즈',
      ],
      questionOptions: [
        `국제 학계가 해당 분야에서 가장 긴급하게 해결하고자 하는 연구 난제는 무엇인가?`,
        `저자들은 어떤 학술적 수사(Hedging expressions)를 사용하여 결론을 서술하는가?`,
        `국제 연구 결과가 한국 사회 및 교육과정에 주는 시사점은 무엇인가?`,
      ],
      recMethod: 'literature' as const,
      clicheTwist: {
        approach: '[IMRaD 구조화 요약 Twist]',
        subTopic: `${cleanInterest} 관련 국제 오픈액세스 저널 2편의 연구 가설과 한계점 영문 비교 리포트`,
        academicLens: 'IMRaD 프레임워크 및 Academic Hedging 분석 렌즈',
        inquiryQuestion: `저자들은 어떤 학술적 수사(Hedging)를 사용하여 연구 결론의 한계를 신중하게 서술하는가?`,
      },
      motivation: `영어 독해와 작문 수업에서 학술 영어의 특성을 학습하며, '${cleanInterest}' 분야의 최신 연구 성과를 가장 정확히 파악하기 위해서는 영문 SCI급 원문 자료를 직접 읽어야 한다는 필요성을 느낌. 해외 저널의 Introduction-Methods-Results-Discussion 구조를 분석하고 전공 특화 영문 요약서를 직접 작성해보고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)' as const,
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '영어 (공통)',
          focus: '기본 어휘 및 설명문의 핵심 아이디어 파악',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 TED 강연 영문 스크립트 정독 및 요약`,
          connectionReason: '1학년 영어 독해 및 어휘 성취기준을 충실히 이수',
        },
        {
          grade: '2학년 (전공 심화)' as const,
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '심화 영어 / 영어 독해와 작문',
          focus: 'IMRaD 구조 분석 및 250단어 영문 Executive Summary 작성',
          topicIdea: `[영어] ${cleanInterest} 글로벌 저널(Nature/Science) 초록(Abstract) 분석 및 영문 리포트`,
          connectionReason: '외국어 자료를 직접 검색하여 최신 연구 동향을 파악하는 글로벌 탐구 역량',
        },
        {
          grade: '3학년 (융합 발전)' as const,
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

  // 6. Tech/Informatics Unit
  const techUnit = {
    id: 'tailored-unit-tech',
    subjectName: '정보/AI (정보 / 인공지능 기초 / 데이터 과학)',
    subjectCategory: 'tech' as const,
    gradeLevel: '고2' as const,
    semester: '1학기' as const,
    unitName: `${cleanInterest} 문제 해결을 위한 공공 API 연계 파이썬 알고리즘 모델링 및 탐색적 데이터 분석(EDA)`,
    unitConcepts: ['Open API 데이터 연동', '결측치 정제 및 정규화', '시간복잡도(Big-O)', '상관분석 및 시각화(Heatmap)', '머신러닝 분류기'],
    keyPrinciples: `${cleanInterest} 관련 실제 공공 데이터셋을 파이썬 Pandas/Matplotlib으로 수집·가공하여 변인 간의 상관성과 시계열 추세를 시각화하고 최적화 알고리즘으로 구조화하는 컴퓨팅 사고력`,
    samplePhenomena: [
      `공공데이터포털(data.go.kr) Open API를 연계한 ${cleanInterest} 관련 원시 데이터 자동 수집`,
      `결측치 및 이상치 정제, 피어슨 상관계수 산출 및 산점도/히트맵 대시보드 시각화`,
      `대용량 데이터 처리 시 정렬·탐색 알고리즘의 시간 복잡도(Big-O) 최적화 비교`,
      `학습 데이터 편향성에 따른 알고리즘의 판단 왜곡 및 AI 윤리적 가이드라인 검토`,
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
      recMethod: 'public_data' as const,
      clicheTwist: {
        approach: '[EDA 데이터 파이프라인 Twist]',
        subTopic: `${cleanInterest} 공공 API 데이터 수집-정제-상관분석 히트맵 대시보드 및 복잡도 분석`,
        academicLens: 'Big-O 시간복잡도 및 탐색적 데이터 분석(EDA) 렌즈',
        inquiryQuestion: `원시 데이터셋의 결측치와 이상치를 정제했을 때 상관계수 지표는 어떻게 보정되는가?`,
      },
      motivation: `정보 및 인공지능 기초 교과를 이수하며 컴퓨팅 기술이 현대 사회의 복잡한 문제를 해결하는 강력한 도구임을 배움. 평소 희망해 온 '${targetCareer}' 관점에서 '${cleanInterest}' 문제를 공공데이터포털의 실제 데이터셋과 파이썬 알고리즘으로 분석하여 객관적인 패턴을 도출해보고자 함.`,
      snowballRoadmap: [
        {
          grade: '1학년 (기초 소양)' as const,
          stageName: '기초 개념 정립 및 문제의식 발굴',
          subject: '정보 (공통)',
          focus: '기초 프로그래밍 문법 및 순서도 작성',
          topicIdea: `${cleanInterest.slice(0, 16)} 관련 간단한 데이터 입출력 및 조건문 알고리즘`,
          connectionReason: '1학년 정보 컴퓨팅 사고력 기본 성취기준을 충실히 이수',
        },
        {
          grade: '2학년 (전공 심화)' as const,
          stageName: '현재 탐구 과제 (선택 과목 정밀 연계)',
          subject: '정보 / 인공지능 기초',
          focus: '공공 API 데이터 파이프라인 구축 및 Pandas 상관관계 히트맵 시각화',
          topicIdea: `[정보/AI] ${cleanInterest} 문제 해결을 위한 알고리즘 흐름도 및 데이터 시각화`,
          connectionReason: '복잡한 문제를 컴퓨팅 사고력으로 분해하고 해결 방안을 도출하는 융합 창의력',
        },
        {
          grade: '3학년 (융합 발전)' as const,
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

// 5-1. API: 6개 교과군(수학, 과학, 사회, 국어, 영어, 정보) 전체 맞춤 단원 생성 API
app.post('/api/ai/wizard-tailor-curriculum', async (req, res) => {
  try {
    const { student = {} } = req.body;
    const targetCareer = student.targetCareer || '전문 연구원';
    const targetMajor = student.targetMajor || '자연과학/공학 계열';
    const mainInterest = student.mainInterestTopic || '교과 연계 첨단 기술 쟁점';

    const defaultTailoredUnits = generateTailoredUnitsForStudent(student);

    if (!hasRealApiKey || !ai) {
      return res.json({
        success: true,
        interest: mainInterest,
        targetCareer,
        targetMajor,
        tailoredUnits: defaultTailoredUnits,
      });
    }

    // Call Gemini with timeout race to optionally enhance titles
    const prompt = `당신은 대한민국 고교 교육과정 및 학생부종합전형 수석 컨설턴트입니다.
학생 정보:
- 희망 진로: ${targetCareer}
- 목표 학과: ${targetMajor}
- 핵심 관심 분야: ${mainInterest}

2022/2015 개정 교육과정 기준 6개 교과군(수학, 과학, 사회/윤리, 국어, 영어, 정보/AI)에 대해 학생의 관심사를 반영한 맞춤 단원명과 핵심 개념을 제안해주세요.
반드시 유효한 JSON 형식으로만 응답하세요:
{
  "units": [
    {
      "subjectCategory": "math | science | social | korean | english | tech",
      "subjectName": "교과목명",
      "unitName": "학생 관심사 결합 구체적 심화 단원명",
      "unitConcepts": ["개념1", "개념2", "개념3", "개념4", "개념5"],
      "keyPrinciples": "핵심 성취 원리 (1~2문장)",
      "samplePhenomena": ["현상1", "현상2", "현상3", "현상4"]
    }
  ]
}`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 5000)
    );

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const text = response.text || '';
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed && Array.isArray(parsed.units) && parsed.units.length >= 5) {
        // Merge Gemini unit names into our complete 5-step tailored plans
        const mergedUnits = defaultTailoredUnits.map((defUnit) => {
          const match = parsed.units.find((u: any) => u.subjectCategory === defUnit.subjectCategory);
          if (match) {
            return {
              ...defUnit,
              subjectName: match.subjectName || defUnit.subjectName,
              unitName: match.unitName || defUnit.unitName,
              unitConcepts: match.unitConcepts?.length ? match.unitConcepts : defUnit.unitConcepts,
              keyPrinciples: match.keyPrinciples || defUnit.keyPrinciples,
              samplePhenomena: match.samplePhenomena?.length ? match.samplePhenomena : defUnit.samplePhenomena,
            };
          }
          return defUnit;
        });

        return res.json({
          success: true,
          interest: mainInterest,
          targetCareer,
          targetMajor,
          tailoredUnits: mergedUnits,
        });
      }
    } catch (e) {
      console.warn('Gemini curriculum tailor timeout or error, serving high-precision generator:', (e as any)?.message);
    }

    return res.json({
      success: true,
      interest: mainInterest,
      targetCareer,
      targetMajor,
      tailoredUnits: defaultTailoredUnits,
    });
  } catch (error) {
    console.error('Error in wizard-tailor-curriculum:', error);
    const { student = {} } = req.body || {};
    return res.json({
      success: true,
      interest: student.mainInterestTopic || '교과 연계 첨단 기술 쟁점',
      tailoredUnits: generateTailoredUnitsForStudent(student),
    });
  }
});

// 5-2. API: CurriculumInquiryWizard 단일 단원 5단계 심화 최적화
app.post('/api/ai/wizard-tailor', async (req, res) => {
  const { student = {}, unitId = '', unitName = '', subjectName = '' } = req.body;

  const targetCareer = student.targetCareer || '전문 연구원';
  const targetMajor = student.targetMajor || '자연과학/공학 계열';
  const mainInterest = student.mainInterestTopic || '교과 연계 첨단 기술 쟁점';

  const defaultUnits = generateTailoredUnitsForStudent(student);
  const matchedUnit = defaultUnits.find(
    (u) =>
      u.id === unitId ||
      u.subjectName === subjectName ||
      u.subjectCategory === req.body.unit?.subjectCategory
  ) || defaultUnits[0];

  const fallbackPlan = matchedUnit.tailoredPlan;

  try {
    if (!hasRealApiKey || !ai) {
      return res.json({ success: true, plan: fallbackPlan });
    }

    const prompt = `대한민국 고등학교 학생부종합전형(학종) 전문 컨설턴트로서, 아래 학생의 진로와 관심사에 맞추어 '교과 단원 연계 5단계 탐구 길잡이' 전체 내용을 완벽하게 작성해주세요.

[학생 프로필]
- 진로 희망(목표 직업): ${targetCareer}
- 목표 학과: ${targetMajor}
- 핵심 관심 연구 분야 / 최근 호기심: ${mainInterest}
- 현재 선택된 단원: ${unitName} (${subjectName})

다음 JSON 형식으로만 응답해주세요:
{
  "topicTitle": "구체적이고 학술적인 탐구 주제명 ([교과명] 포함)",
  "inquiryQuestion": "학생의 관심사와 단원 개념이 결합된 핵심 탐구 질문 1개",
  "observedPhenomenon": "현상 관찰 진술문",
  "phenomenaChips": ["맞춤 관찰 현상 예시 1", "맞춤 관찰 현상 예시 2", "맞춤 관찰 현상 예시 3"],
  "selectedLens": "대표 학문적 렌즈",
  "lensOptions": ["학문적 렌즈 1", "학문적 렌즈 2", "학문적 렌즈 3"],
  "questionOptions": ["핵심 질문 옵션 1", "핵심 질문 옵션 2", "핵심 질문 옵션 3"],
  "recommendedMethodology": "simulation" 또는 "public_data" 또는 "literature" 또는 "practical_policy",
  "clicheTwist": {
    "approach": "[차별화 접근법 명칭]",
    "subTopic": "비틀기 세부 주제명",
    "academicLens": "적용 학문적 렌즈",
    "inquiryQuestion": "차별화된 심화 질문"
  },
  "motivation": "교과 수업 중 호기심과 학생의 진로를 연결한 구체적인 탐구 동기 (250~350자)",
  "snowballRoadmap": [
    {
      "grade": "1학년 (기초 소양)",
      "stageName": "기초 개념 정립 및 문제의식 발굴",
      "subject": "통합교과",
      "focus": "기초 원리 탐색",
      "topicIdea": "1학년 연계 주제 아이디어",
      "connectionReason": "연계 이유"
    },
    {
      "grade": "2학년 (전공 심화)",
      "stageName": "현재 탐구 과제",
      "subject": "${subjectName}",
      "focus": "정량 심화 분석",
      "topicIdea": "2학년 현재 주제 아이디어",
      "connectionReason": "연계 이유"
    },
    {
      "grade": "3학년 (융합 발전)",
      "stageName": "차년도 후속 심화 과제",
      "subject": "진로선택/융합교과",
      "focus": "한계 극복 및 후속 연구",
      "topicIdea": "3학년 후속 주제 아이디어",
      "connectionReason": "연계 이유"
    }
  ],
  "teacherReviewPoints": {
    "academic": "학업역량 세특 기재 포인트",
    "career": "진로역량 세특 기재 포인트",
    "community": "공동체역량 세특 기재 포인트"
  },
  "relatedBooks": "도서 2권 (예: 《도서명》(저자))",
  "deliverables": "구체적 산출물 명칭"
}`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 5000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.text || '';
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.json({ success: true, plan: parsed });
  } catch (error) {
    console.error('Error in wizard-tailor, serving fallback:', (error as any)?.message || error);
    return res.json({ success: true, plan: fallbackPlan });
  }
});

// Mount Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`학종나침반 (Hakjong Compass) server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

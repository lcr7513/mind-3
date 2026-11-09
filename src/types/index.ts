export type UserRole = 'student' | 'teacher';

export type SubjectCategory = 'math' | 'science' | 'korean' | 'social' | 'english' | 'tech';

export interface Student {
  id: string;
  name: string;
  grade: string;
  classNum: string;
  targetMajor: string;
  targetCareer: string;
  interestKeywords: string[];
  avatar: string;
  school: string;
  status: 'active' | 'review_needed';
  mainInterestTopic?: string;
  preferredSubjects?: string[];
  onboardingCompleted?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  role: string;
  avatar: string;
  school: string;
}

export interface SubjectInquiryTopic {
  id: string;
  subject: string;
  subjectCategory: SubjectCategory;
  topic: string;
  inquiryQuestion: string;
  methodology: string;
  readingRecommendation: string;
  recordTip: string;
}

export interface MindMapNode {
  id: string;
  text: string;
  category: string;
  color: string;
  detail?: string;
  subject?: string;
  inquiryQuestion?: string;
  methodology?: string;
  readingRecommendation?: string;
  recordTip?: string;
  nodeType?: 'root' | 'subject' | 'topic' | 'process_step' | 'action';
  children?: MindMapNode[];
  status?: 'planned' | 'in_progress' | 'completed';
}

export interface TeacherFeedback {
  author: string;
  date: string;
  academicCompetency: string;
  careerCompetency: string;
  communityCompetency: string;
  coachingAdvice: string;
  draftRecord: string;
}

export interface InquiryActivityRecord {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  category: '교과세특' | '자율활동' | '동아리활동' | '진로활동';
  gradeSemester: string;
  date: string;
  motivation: string;
  process: string;
  insights: string;
  relatedBooks: string;
  deliverables: string;
  status: 'draft' | 'submitted' | 'reviewed';
  teacherFeedback?: TeacherFeedback;
}

export interface RoadmapMilestone {
  id: string;
  gradeSemester: '1학년 1학기' | '1학년 2학기' | '2학년 1학기' | '2학년 2학기' | '3학년 1학기';
  stage: '기초 탐색기' | '심화 탐구기' | '융합 발전기';
  category: '교과세특' | '동아리' | '진로탐색' | '심화독서';
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  keyCompetency: string;
  linkedSubject?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  recipientId: string;
  content: string;
  timestamp: string;
  relatedActivityId?: string;
  tag?: '질문' | '피드백' | '세특검토' | '상담요청';
}

export interface CurriculumUnit {
  id: string;
  subjectName: string;
  subjectCategory: SubjectCategory;
  gradeLevel: '고1' | '고2' | '고3' | '공통';
  semester: '1학기' | '2학기' | '공통';
  unitName: string;
  unitConcepts: string[];
  keyPrinciples: string;
  samplePhenomena: string[];
  isTailored?: boolean;
  tailoredPlan?: {
    topicTitle: string;
    inquiryQuestion: string;
    observedPhenomenon: string;
    phenomenaChips: string[];
    selectedLens: string;
    lensOptions: string[];
    questionOptions: string[];
    recMethod: MethodologyType;
    clicheTwist?: {
      approach: string;
      subTopic: string;
      academicLens: string;
      inquiryQuestion: string;
    };
    motivation: string;
    snowballRoadmap: SnowballStep[];
    teacherReviewPoints: {
      academic: string;
      career: string;
      community: string;
    };
    relatedBooks: string;
    deliverables?: string;
  };
}

export type MethodologyType = 'literature' | 'public_data' | 'simulation' | 'practical_policy';

export interface MethodologyOption {
  type: MethodologyType;
  title: string;
  shortDesc: string;
  suitableFor: string;
  recommendedTools: string[];
  actionSteps: string[];
  sampleDeliverable: string;
  badgeColor: string;
}

export interface ClicheItem {
  id: string;
  keyword: string;
  commonTopic: string;
  whyCliche: string;
  twists: {
    approach: string;
    subTopic: string;
    academicLens: string;
    inquiryQuestion: string;
  }[];
}

export interface SnowballStep {
  grade: '1학년 (기초 소양)' | '2학년 (전공 심화)' | '3학년 (융합 발전)';
  stageName: string;
  subject: string;
  focus: string;
  topicIdea: string;
  connectionReason: string;
}

export interface InquiryPlanProposal {
  id: string;
  studentName: string;
  grade: string;
  targetMajor: string;
  subject: string;
  unitName: string;
  topicTitle: string;
  inquiryQuestion: string;
  motivation: string;
  academicConcepts: string[];
  methodologyType: MethodologyType;
  methodologyName: string;
  methodologyProcess: string;
  readingRecommendation: string;
  deliverables: string;
  expectedInsight: string;
  snowballSteps: SnowballStep[];
  checklist: {
    curriculumLinked: boolean;
    noProhibitedTerms: boolean;
    feasibleForHighSchool: boolean;
    originalInsight: boolean;
    continuousGrowth: boolean;
  };
}


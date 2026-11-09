import React, { useState } from 'react';
import { SubjectInquiryTopic, MindMapNode } from '../types';
import { presetFields } from '../data/mockData';
import { MindMapCanvas } from './MindMapCanvas';
import {
  Sparkles,
  BookOpen,
  Compass,
  ArrowRight,
  Layers,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Share2,
  BookmarkPlus,
  HelpCircle,
  Lightbulb,
  Edit3,
  Eraser,
  CheckCircle2,
  GitBranch,
  Maximize2,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react';

export interface TopicSubQuestion {
  id: string;
  title: string;
  subQuestion: string;
  researchArea: string;
  methodology: string;
  relatedConcepts: string[];
  readingRecommendation: string;
  recordTip: string;
}

export interface TopicExpansionData {
  topicTitle: string;
  subject: string;
  overview: string;
  subQuestions: TopicSubQuestion[];
}

interface AiTopicGeneratorProps {
  currentGrade: string;
  defaultMajor?: string;
  defaultInterest?: string;
  defaultKeywords?: string;
  defaultSelectedSubjects?: string[];
  onApplyMindMap: (mindmap: MindMapNode) => void;
  onAddInquiryRecord: (topic: SubjectInquiryTopic) => void;
  onSwitchToWizard?: () => void;
}

export const AiTopicGenerator: React.FC<AiTopicGeneratorProps> = ({
  currentGrade,
  defaultMajor = '',
  defaultInterest = '',
  defaultKeywords = '',
  defaultSelectedSubjects,
  onApplyMindMap,
  onAddInquiryRecord,
  onSwitchToWizard,
}) => {
  const [interest, setInterest] = useState<string>(
    defaultInterest || '크리스퍼 유전자 가위와 난치병 치료 메커니즘'
  );
  const [targetMajor, setTargetMajor] = useState<string>(
    defaultMajor || '생명공학과 / 의생명과학'
  );
  const [grade, setGrade] = useState<string>(currentGrade || '고등학교 2학년');
  const [customKeywords, setCustomKeywords] = useState<string>(
    defaultKeywords || '수학적 모델링, 오프타깃 부작용, 생명윤리'
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    defaultSelectedSubjects && defaultSelectedSubjects.length > 0
      ? defaultSelectedSubjects
      : [
          '수학 (미적분/확률과 통계)',
          '과학 (생명과학/화학)',
          '사회 (생활과 윤리/정치와 법)',
          '국어 (독서/화법과 작문)',
          '영어 (심화영어)',
          '정보/융합',
        ]
  );

  // Sync when student's recorded career profile changes
  React.useEffect(() => {
    if (defaultInterest) setInterest(defaultInterest);
    if (defaultMajor) setTargetMajor(defaultMajor);
    if (defaultKeywords) setCustomKeywords(defaultKeywords);
    if (defaultSelectedSubjects && defaultSelectedSubjects.length > 0) {
      setSelectedSubjects(defaultSelectedSubjects);
    }
  }, [defaultInterest, defaultMajor, defaultKeywords, defaultSelectedSubjects]);

  const [showPresetExplorer, setShowPresetExplorer] = useState<boolean>(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedOverview, setGeneratedOverview] = useState<string | null>(null);
  const [generatedSubjects, setGeneratedSubjects] = useState<SubjectInquiryTopic[]>([]);
  const [generatedMindMap, setGeneratedMindMap] = useState<MindMapNode | null>(null);
  const [activeTab, setActiveTab] = useState<'mindmap' | 'curriculum'>('mindmap');
  const [addedTopicIds, setAddedTopicIds] = useState<Set<string>>(new Set());
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Topic AI Expansion State (3-5 Sub-questions & related research areas)
  const [expandedModalTopic, setExpandedModalTopic] = useState<SubjectInquiryTopic | null>(null);
  const [expansionDataMap, setExpansionDataMap] = useState<Record<string, TopicExpansionData>>({});
  const [isExpandingTopic, setIsExpandingTopic] = useState<boolean>(false);
  const [addedSubQuestionIds, setAddedSubQuestionIds] = useState<Set<string>>(new Set());
  const [addedMindMapSubIds, setAddedMindMapSubIds] = useState<Set<string>>(new Set());

  const availableSubjects = [
    '수학 (미적분/확률과 통계)',
    '과학 (생명과학/화학)',
    '사회 (생활과 윤리/정치와 법)',
    '국어 (독서/화법과 작문)',
    '영어 (심화영어)',
    '정보/융합',
  ];

  const toggleSubject = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleClearInputs = () => {
    setInterest('');
    setTargetMajor('');
    setCustomKeywords('');
  };

  // AI Expand Topic into 3-5 Sub-questions
  const handleExpandTopic = async (topic: SubjectInquiryTopic) => {
    setExpandedModalTopic(topic);
    if (expansionDataMap[topic.id]) {
      return;
    }

    setIsExpandingTopic(true);
    try {
      const res = await fetch('/api/ai/expand-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: topic.topic,
          subject: topic.subject,
          subjectCategory: topic.subjectCategory,
          inquiryQuestion: topic.inquiryQuestion,
          methodology: topic.methodology,
          targetMajor,
          grade,
        }),
      });

      const data = await res.json();
      setExpansionDataMap((prev) => ({
        ...prev,
        [topic.id]: data,
      }));
    } catch (err) {
      console.error('Failed to expand topic with AI:', err);
    } finally {
      setIsExpandingTopic(false);
    }
  };

  // Add generated sub-question to inquiry activity records
  const handleAddSubQuestionToRecord = (topic: SubjectInquiryTopic, sub: TopicSubQuestion) => {
    const cleanTitle = sub.title.replace(/\[.*?\]/g, '').trim();
    const newRecordTopic: SubjectInquiryTopic = {
      id: `sub-topic-${Date.now()}`,
      subject: topic.subject,
      subjectCategory: topic.subjectCategory,
      topic: `[${topic.subject} 세부과제] ${cleanTitle}`,
      inquiryQuestion: sub.subQuestion,
      methodology: `${sub.researchArea} (${sub.methodology})`,
      readingRecommendation: sub.readingRecommendation || topic.readingRecommendation,
      recordTip: sub.recordTip,
    };

    onAddInquiryRecord(newRecordTopic);
    setAddedSubQuestionIds((prev) => new Set([...prev, sub.id]));
  };

  // Add generated sub-question as sub-branch to current MindMap
  const handleAddSubQuestionToMindMap = (topic: SubjectInquiryTopic, sub: TopicSubQuestion) => {
    if (!generatedMindMap) return;

    const newSubNode: MindMapNode = {
      id: `subnode-${Date.now()}`,
      text: sub.title,
      category: topic.subjectCategory,
      color: '#6366f1',
      subject: topic.subject,
      nodeType: 'topic',
      detail: sub.researchArea,
      inquiryQuestion: sub.subQuestion,
      methodology: sub.methodology,
      readingRecommendation: sub.readingRecommendation,
      recordTip: sub.recordTip,
    };

    const updateTree = (node: MindMapNode): MindMapNode => {
      // Find matching branch or topic
      if (
        node.text.includes(topic.subject) ||
        node.text.includes(topic.topic.slice(0, 15)) ||
        (node.subject && node.subject.includes(topic.subject))
      ) {
        return {
          ...node,
          children: [...(node.children || []), newSubNode],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateTree),
        };
      }
      return node;
    };

    const updated = updateTree(generatedMindMap);
    setGeneratedMindMap(updated);
    onApplyMindMap(updated);
    setAddedMindMapSubIds((prev) => new Set([...prev, sub.id]));
  };

  const handleGenerate = async () => {
    if (!interest.trim() && !targetMajor.trim()) return;
    setIsLoading(true);
    setAppliedNotice(false);

    try {
      const res = await fetch('/api/ai/recommend-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interest: interest.trim(),
          targetMajor: targetMajor.trim(),
          grade,
          selectedSubjects,
          customKeywords: customKeywords.trim(),
        }),
      });

      const data = await res.json();
      setGeneratedOverview(data.majorOverview || '');
      const mappedTopics: SubjectInquiryTopic[] = (data.subjects || []).map((s: any, idx: number) => ({
        id: `topic-${Date.now()}-${idx}`,
        subject: s.subject,
        subjectCategory: s.subjectCategory || 'science',
        topic: s.topic,
        inquiryQuestion: s.inquiryQuestion,
        methodology: s.methodology,
        readingRecommendation: s.readingRecommendation,
        recordTip: s.recordTip,
      }));
      setGeneratedSubjects(mappedTopics);
      if (data.mindmap) {
        setGeneratedMindMap(data.mindmap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToStudentMindMap = () => {
    if (generatedMindMap) {
      onApplyMindMap(generatedMindMap);
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 3000);
    }
  };

  const handleAddActivity = (topic: SubjectInquiryTopic) => {
    onAddInquiryRecord(topic);
    setAddedTopicIds((prev) => new Set([...prev, topic.id]));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Strategy Description */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>AI 교과 연계 탐구 네비게이터 & 마인드맵</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            학생의 관심 분야를 국어·수학·영어·사회·과학·정보 교과별 탐구 주제와 마인드맵으로 전환합니다
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              대학 입학사정관은 단순한 전공 지식 나열보다, <strong>'고등학교 정규 수업 시간에 배운 교과 개념을 자신의 진로 관심사와 융합하여 스스로 심화 탐구한 과정'</strong>을 가장 높이 평가합니다.
              자유롭게 관심 연구 주제를 입력하시면 각 교과목별 실천 과제와 직관적인 마인드맵을 즉시 구성합니다.
            </p>
            {onSwitchToWizard && (
              <button
                type="button"
                onClick={onSwitchToWizard}
                className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-md shrink-0 transition-all"
              >
                <Lightbulb className="w-4 h-4 text-slate-950" />
                <span>주제 잡기 어렵다면? 단원별 길잡이</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Input Form Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        {/* Freedom of Custom Input Callout Notice */}
        <div className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
              ✍️
            </span>
            <div className="text-xs text-indigo-950">
              <strong className="font-extrabold text-indigo-900 text-sm block mb-0.5">
                관심 연구 분야는 100% 자유 직접 입력이 가능합니다!
              </strong>
              <p className="text-indigo-800 leading-relaxed">
                아래 예시 키워드에 국한되지 않습니다. 인문, 사회, 자연과학, 공학, 의약학, 예술, 융합 등 학생이 탐구하고자 하는 어떤 독창적인 주제도 직접 타이핑하여 입력하실 수 있습니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearInputs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Eraser className="w-3.5 h-3.5 text-slate-500" />
            입력창 비우기 (초기화)
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>1. 관심 연구 분야 / 자유 연구 주제</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">자유 입력창</span>
            </div>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="예: 식물 유전자 교정과 스마트팜 수확량 예측, 자율주행 트롤리 딜레마, 행동경제학 넛지 등"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              2. 희망 전공 / 학과 계열 <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={targetMajor}
              onChange={(e) => setTargetMajor(e.target.value)}
              placeholder="예: 생명공학과 / 컴퓨터공학과 / 환경경제학과 / 자유전공학부"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">학생 학년</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
            >
              <option value="고등학교 1학년">고등학교 1학년 (기초 소양 & 융합)</option>
              <option value="고등학교 2학년">고등학교 2학년 (전공 심화 & 교과 연계)</option>
              <option value="고등학교 3학년">고등학교 3학년 (개별 심층 연구 & 융합 발전)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              강조하고 싶은 세부 역량 / 보강 키워드
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="예: 수리적 모델링, 오프타깃 부작용 분석, 생명윤리, 실험 설계 등"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Collapsible Inspiration Presets */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPresetExplorer(!showPresetExplorer)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>주제 선정이 고민된다면? 6개 계열별 추천 키워드 모음 (클릭하여 열기)</span>
            </span>
            {showPresetExplorer ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showPresetExplorer && (
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2.5">
                {presetFields.map((p, idx) => (
                  <button
                    key={p.category}
                    type="button"
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeCategoryIndex === idx
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.category}
                  </button>
                ))}
              </div>

              {/* Category chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presetFields[activeCategoryIndex].fields.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setInterest(f);
                      setShowPresetExplorer(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 rounded-xl border border-slate-200 transition-all font-medium flex items-center gap-1"
                  >
                    <span>{f}</span>
                    <span className="text-[10px] text-indigo-400">적용</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Select Subjects */}
        <div>
          <span className="block text-xs font-bold text-slate-800 mb-2">
            교과별 탐구 추천을 생성할 고교 과목:
          </span>
          <div className="flex flex-wrap gap-2">
            {availableSubjects.map((subj) => {
              const active = selectedSubjects.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => toggleSubject(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {subj} {active ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || (!interest.trim() && !targetMajor.trim())}
            className="flex items-center gap-2 py-3.5 px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                AI가 교과별 심화 주제 및 마인드맵을 설계하는 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                '{interest || '입력한 주제'}' 교과 연계 마인드맵 및 탐구 추천 생성
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {(generatedOverview || generatedSubjects.length > 0) && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          {/* Result Header & Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI 교과 연계 탐구 분석 완료</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                '{interest}' 중심 고교 교과별 연계 탐구 마인드맵
              </h3>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setActiveTab('mindmap')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'mindmap'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  교과별 마인드맵
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'curriculum'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  교과별 세특 카드 ({generatedSubjects.length})
                </button>
              </div>

              {generatedMindMap && (
                <button
                  onClick={handleApplyToStudentMindMap}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
                  title="현재 생성된 마인드맵을 학생의 대표 탐구 맵으로 확정 저장합니다"
                >
                  {appliedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      내 마인드맵에 저장 완료!
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      내 마인드맵에 저장
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Academic Overview Box */}
          {generatedOverview && (
            <div className="bg-indigo-50/60 border border-indigo-100/90 rounded-2xl p-4 text-xs sm:text-sm text-indigo-950 leading-relaxed flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-1">
                  입학사정관 및 교육과정 연계 관점 총평:
                </strong>
                {generatedOverview}
              </div>
            </div>
          )}

          {/* Tab 1: Interactive Mind Map */}
          {activeTab === 'mindmap' && (
            <div>
              {generatedMindMap ? (
                <MindMapCanvas
                  rootNode={generatedMindMap}
                  onUpdateMindMap={(updated) => setGeneratedMindMap(updated)}
                  onAddInquiryRecord={onAddInquiryRecord}
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
                  마인드맵 데이터를 생성 중입니다...
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Detailed Cross-Curricular Cards */}
          {activeTab === 'curriculum' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedSubjects.map((topic) => {
                const isAdded = addedTopicIds.has(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 bg-white shadow-sm hover:shadow transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Subject Badge & Expand Action */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                          {topic.subject}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleExpandTopic(topic)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition-all hover:shadow-2xs"
                          title="이 주제를 클릭하여 3~5개 세부 탐구 질문으로 AI 확장합니다"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>AI 세부질문 확장</span>
                        </button>
                      </div>

                      {/* Topic Title (Clickable to Expand) */}
                      <h4
                        onClick={() => handleExpandTopic(topic)}
                        className="text-sm font-extrabold text-slate-900 mb-2 leading-snug hover:text-indigo-600 cursor-pointer transition-colors flex items-center justify-between group"
                        title="클릭하여 AI 세부 연구 질문 확장하기"
                      >
                        <span>{topic.topic}</span>
                        <Maximize2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0 ml-2" />
                      </h4>

                      {/* Inquiry Question */}
                      <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-xs text-amber-950 mb-3">
                        <span className="font-bold block mb-0.5">
                          💡 핵심 탐구 질문:
                        </span>
                        {topic.inquiryQuestion}
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-xs text-slate-600">
                        <div>
                          <strong className="text-slate-800">🔬 탐구 방법론: </strong>
                          <span>{topic.methodology}</span>
                        </div>
                        <div>
                          <strong className="text-slate-800">📚 추천 도서/문헌: </strong>
                          <span className="text-indigo-600 font-semibold">
                            {topic.readingRecommendation}
                          </span>
                        </div>
                        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                          <strong className="font-bold">📝 학생부 세특 기록 포인트: </strong>
                          {topic.recordTip}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleExpandTopic(topic)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-all shadow-2xs"
                      >
                        <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                        <span>세부질문 확장 (3~5개)</span>
                      </button>

                      <button
                        onClick={() => handleAddActivity(topic)}
                        disabled={isAdded}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-slate-100 text-slate-500 cursor-default'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            활동 일지에 추가됨
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            내 활동 일지에 담기
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Topic AI Expansion Modal (3-5 Sub-questions & Related Research Areas) */}
      {expandedModalTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    {expandedModalTopic.subject}
                  </span>
                  <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI 세부 연구 질문·연계 확장 (Topic Expansion)
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {expandedModalTopic.topic}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExpandedModalTopic(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Loading state */}
            {isExpandingTopic && !expansionDataMap[expandedModalTopic.id] ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <div className="text-sm font-bold text-slate-800">
                  AI가 '{expandedModalTopic.topic}'에 대한 3~5개 세부 연구 질문을 생성하는 중...
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  교과서 개념과 전공 쟁점을 융합하여 입학사정관이 주목하는 구체적인 실천 질문과 파생 연구 영역을 설계하고 있습니다.
                </p>
              </div>
            ) : (
              <>
                {/* Overview Note */}
                {expansionDataMap[expandedModalTopic.id]?.overview && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-2xl p-4 text-xs text-indigo-950 flex items-start gap-2.5 leading-relaxed">
                    <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold block mb-0.5">
                        AI 진로진학 수석 컨설턴트 확장 조언:
                      </strong>
                      {expansionDataMap[expandedModalTopic.id].overview}
                    </div>
                  </div>
                )}

                {/* 3-5 Sub-Questions List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-indigo-600" />
                      <span>
                        파생 연구 영역 및 세부 탐구 질문 (
                        {expansionDataMap[expandedModalTopic.id]?.subQuestions.length || 0}개):
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      관심 있는 세부 질문을 골라 활동 일지에 추가하세요
                    </span>
                  </div>

                  {expansionDataMap[expandedModalTopic.id]?.subQuestions.map((sub, sIdx) => {
                    const isSubAdded = addedSubQuestionIds.has(sub.id);
                    const isMindMapAdded = addedMindMapSubIds.has(sub.id);
                    return (
                      <div
                        key={sub.id || sIdx}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-black text-slate-900 leading-snug">
                            {sub.title}
                          </h4>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                            {sub.researchArea}
                          </span>
                        </div>

                        {/* Core Sub-Question */}
                        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 text-xs text-amber-950">
                          <strong className="block mb-0.5 font-bold text-amber-900">
                            💡 세부 탐구 질문:
                          </strong>
                          {sub.subQuestion}
                        </div>

                        {/* Methodology & Concepts */}
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div>
                            <strong className="text-slate-700">🔬 실천 방법론: </strong>
                            <span>{sub.methodology}</span>
                          </div>
                          {sub.readingRecommendation && (
                            <div>
                              <strong className="text-slate-700">📚 추천 문헌: </strong>
                              <span className="text-indigo-600 font-semibold">
                                {sub.readingRecommendation}
                              </span>
                            </div>
                          )}
                          <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 text-[11px] text-emerald-950">
                            <strong className="font-bold">📝 세특 기재 포인트: </strong>
                            {sub.recordTip}
                          </div>
                        </div>

                        {/* Concept chips */}
                        {sub.relatedConcepts && sub.relatedConcepts.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {sub.relatedConcepts.map((concept, cIdx) => (
                              <span
                                key={cIdx}
                                className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium"
                              >
                                #{concept}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddSubQuestionToMindMap(expandedModalTopic, sub)}
                            disabled={isMindMapAdded}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isMindMapAdded
                                ? 'bg-slate-100 text-slate-400 cursor-default'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {isMindMapAdded ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>마인드맵에 추가됨</span>
                              </>
                            ) : (
                              <>
                                <GitBranch className="w-3 h-3 text-indigo-600" />
                                <span>마인드맵에 브랜치로 추가</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddSubQuestionToRecord(expandedModalTopic, sub)}
                            disabled={isSubAdded}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSubAdded
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                            }`}
                          >
                            {isSubAdded ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>활동 일지에 추가 완료</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>이 세부 질문으로 일지 담기</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                확장된 질문은 교과 세특 일지 및 마인드맵에 즉시 연동됩니다
              </span>
              <button
                type="button"
                onClick={() => setExpandedModalTopic(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

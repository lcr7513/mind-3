import React, { useState } from 'react';
import { RoadmapMilestone, Student } from '../types';
import {
  Compass,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Filter,
  Layers,
  Sparkles,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface CareerRoadmapProps {
  student: Student;
  milestones: RoadmapMilestone[];
  onAddMilestone: (milestone: RoadmapMilestone) => void;
  onUpdateStatus: (id: string, newStatus: RoadmapMilestone['status']) => void;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  student,
  milestones,
  onAddMilestone,
  onUpdateStatus,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New milestone form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gradeSemester, setGradeSemester] = useState<RoadmapMilestone['gradeSemester']>('2학년 2학기');
  const [category, setCategory] = useState<RoadmapMilestone['category']>('교과세특');
  const [stage, setStage] = useState<RoadmapMilestone['stage']>('심화 탐구기');
  const [keyCompetency, setKeyCompetency] = useState<string>('진로역량 (전공 관련 교과 탐구)');
  const [linkedSubject, setLinkedSubject] = useState<string>('생명과학II');

  const semesters = ['1학년 1학기', '1학년 2학기', '2학년 1학기', '2학년 2학기', '3학년 1학기'];
  const categories = ['교과세특', '동아리', '진로탐색', '심화독서'];

  const filteredMilestones = milestones.filter((m) => {
    if (selectedSemester !== 'all' && m.gradeSemester !== selectedSemester) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMilestone: RoadmapMilestone = {
      id: `road-${Date.now()}`,
      gradeSemester,
      stage,
      category,
      title: title.trim(),
      description: description.trim(),
      status: 'planned',
      keyCompetency,
      linkedSubject: linkedSubject.trim() || undefined,
    };

    onAddMilestone(newMilestone);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const getCategoryColor = (cat: RoadmapMilestone['category']) => {
    switch (cat) {
      case '교과세특':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case '동아리':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case '진로탐색':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case '심화독서':
        return 'text-purple-700 bg-purple-50 border-purple-200';
    }
  };

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                  {student.grade} · {student.classNum}
                </span>
              </div>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                희망 진로: {student.targetMajor} ({student.targetCareer})
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {student.interestKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">3개년 학종 로드맵 달성도</span>
              <span className="font-bold text-indigo-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>총 {milestones.length}개 탐구 과제</span>
              <span>완료 {completedCount}건</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Stage Narrative Architecture Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs mb-1">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>1학년: 기초 탐색기</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            공통 교육과정(통합과학, 통합사회 등)을 통한 폭넓은 융합적 소양 함양 및 전공에 대한 기초 지적 호기심 발현
          </p>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>2학년: 전공 심화기</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            일반선택 및 진로선택 과목에서 전공 관련 심화 개념 탐구, 정량적 수리 모델링 및 실험 설계 실천
          </p>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
              3
            </span>
            <span>3학년: 융합 발전기</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            개별화된 심층 연구 주제 도출, 사회적 기여 및 타 학문과의 융합적 문제 해결 역량 과시
          </p>
        </div>
      </div>

      {/* Filter and Add Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">전체 학기 보기</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">전체 영역 보기</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          새 로드맵 마일스톤 추가
        </button>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {filteredMilestones.map((m, idx) => (
          <div
            key={m.id}
            className={`border rounded-2xl p-5 bg-white transition-all shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4 ${
              m.status === 'completed'
                ? 'border-emerald-200/80 bg-emerald-50/20'
                : m.status === 'in_progress'
                ? 'border-amber-200/80 bg-amber-50/10'
                : 'border-slate-200'
            }`}
          >
            <div className="space-y-2 flex-1">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {m.gradeSemester}
                </span>
                <span className={`font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(m.category)}`}>
                  {m.category}
                </span>
                {m.linkedSubject && (
                  <span className="text-slate-500 font-medium">
                    · {m.linkedSubject}
                  </span>
                )}
                <span className="text-slate-400 font-medium">
                  · {m.stage}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Key Competency */}
              <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>핵심 입증 역량: {m.keyCompetency}</span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <span className="text-xs text-slate-400 hidden sm:inline">상태:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => onUpdateStatus(m.id, 'planned')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    m.status === 'planned'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  계획
                </button>
                <button
                  onClick={() => onUpdateStatus(m.id, 'in_progress')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    m.status === 'in_progress'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-amber-700'
                  }`}
                >
                  진행중
                </button>
                <button
                  onClick={() => onUpdateStatus(m.id, 'completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    m.status === 'completed'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-emerald-700'
                  }`}
                >
                  완료
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Milestone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">새 로드맵 마일스톤 등록</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  탐구 활동 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 생명과학II: High-fidelity Cas9 단백질 구조 변이 분석"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">학기</label>
                  <select
                    value={gradeSemester}
                    onChange={(e) => setGradeSemester(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">활동 영역</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">연계 교과목</label>
                  <input
                    type="text"
                    value={linkedSubject}
                    onChange={(e) => setLinkedSubject(e.target.value)}
                    placeholder="예: 미적분, 생명과학II"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">핵심 입증 역량</label>
                  <input
                    type="text"
                    value={keyCompetency}
                    onChange={(e) => setKeyCompetency(e.target.value)}
                    placeholder="예: 학업역량 (수리 모델링)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  탐구 계획 및 목표 상세
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="탐구하고자 하는 핵심 질문과 예상 산출물 요약"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                >
                  마일스톤 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

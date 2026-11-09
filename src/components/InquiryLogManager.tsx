import React, { useState } from 'react';
import { InquiryActivityRecord, Student, Teacher } from '../types';
import {
  FileText,
  Plus,
  BookOpen,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Tag,
  Paperclip,
  ExternalLink,
  Loader2,
  Wand2,
  Edit3,
  Compass,
  AlertCircle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

interface InquiryLogManagerProps {
  student: Student;
  teacher: Teacher;
  records: InquiryActivityRecord[];
  onAddRecord: (record: InquiryActivityRecord) => void;
  onUpdateRecord?: (record: InquiryActivityRecord) => void;
  onSubmitForReview: (recordId: string) => void;
  onOpenChatWithActivity?: (activityId: string) => void;
}

export const InquiryLogManager: React.FC<InquiryLogManagerProps> = ({
  student,
  teacher,
  records,
  onAddRecord,
  onUpdateRecord,
  onSubmitForReview,
  onOpenChatWithActivity,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(records[0]?.id || null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [subject, setSubject] = useState<string>('수학 (미적분)');
  const [category, setCategory] = useState<InquiryActivityRecord['category']>('교과세특');
  const [gradeSemester, setGradeSemester] = useState<string>('2학년 1학기');
  const [motivation, setMotivation] = useState<string>('');
  const [process, setProcess] = useState<string>('');
  const [insights, setInsights] = useState<string>('');
  const [relatedBooks, setRelatedBooks] = useState<string>('');
  const [deliverables, setDeliverables] = useState<string>('');

  // AI Drafting States
  const [aiDraftLoading, setAiDraftLoading] = useState<string | null>(null); // 'all' | 'motivation' | 'process' | 'insights' | null
  const [aiDraftNotice, setAiDraftNotice] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const handleOpenNewModal = () => {
    setEditingRecordId(null);
    resetForm();
    setAiDraftNotice(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: InquiryActivityRecord) => {
    setEditingRecordId(record.id);
    setTitle(record.title);
    setSubject(record.subject);
    setCategory(record.category);
    setGradeSemester(record.gradeSemester);
    setMotivation(record.motivation);
    setProcess(record.process);
    setInsights(record.insights);
    setRelatedBooks(record.relatedBooks || '');
    setDeliverables(record.deliverables || '');
    setAiDraftNotice(null);
    setIsModalOpen(true);
  };

  const handleTriggerAiDraft = async (mode: 'all' | 'motivation' | 'process' | 'insights') => {
    setAiDraftLoading(mode);
    setAiDraftNotice(null);
    try {
      const response = await fetch('/api/ai/draft-inquiry-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          title: title.trim(),
          subject: subject.trim(),
          category,
          gradeSemester,
          currentMotivation: motivation.trim(),
          currentProcess: process.trim(),
          currentInsights: insights.trim(),
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 초안 생성 서버 응답 오류');
      }

      const data = await response.json();

      if (mode === 'all') {
        if (!title.trim() && data.title) {
          setTitle(data.title);
        }
        if (data.motivation) setMotivation(data.motivation);
        if (data.process) setProcess(data.process);
        if (data.insights) setInsights(data.insights);
        if (data.relatedBooks && !relatedBooks.trim()) setRelatedBooks(data.relatedBooks);
        if (data.deliverables && !deliverables.trim()) setDeliverables(data.deliverables);
        setAiDraftNotice({
          type: 'success',
          message: '학생의 진로와 관심 분야를 반영한 동기·과정·결과 맞춤 초안이 전체 작성되었습니다. 내용을 자유롭게 검토하고 다듬어보세요.',
        });
      } else if (mode === 'motivation') {
        if (data.motivation) setMotivation(data.motivation);
        setAiDraftNotice({
          type: 'success',
          message: '진로 연계 및 지적 호기심이 반영된 탐구 동기 초안이 작성되었습니다.',
        });
      } else if (mode === 'process') {
        if (data.process) setProcess(data.process);
        setAiDraftNotice({
          type: 'success',
          message: '교과 개념 적용 및 구체적 탐구 방법론이 포함된 과정 초안이 작성되었습니다.',
        });
      } else if (mode === 'insights') {
        if (data.insights) setInsights(data.insights);
        setAiDraftNotice({
          type: 'success',
          message: '지적 성장 및 차기 연계 탐구 계획이 포함된 결과/배운점 초안이 작성되었습니다.',
        });
      }
    } catch (err) {
      console.error(err);
      setAiDraftNotice({
        type: 'error',
        message: 'AI 초안 생성 중 일시적인 문제가 발생했습니다. 기본 추천 템플릿을 적용합니다.',
      });
    } finally {
      setAiDraftLoading(null);
    }
  };

  const handleCreate = (e: React.FormEvent, submitNow: boolean) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingRecordId && onUpdateRecord) {
      const existing = records.find((r) => r.id === editingRecordId);
      const updatedRecord: InquiryActivityRecord = {
        id: editingRecordId,
        studentId: student.id,
        title: title.trim(),
        subject: subject.trim(),
        category,
        gradeSemester,
        date: existing?.date || new Date().toISOString().split('T')[0],
        motivation: motivation.trim(),
        process: process.trim(),
        insights: insights.trim(),
        relatedBooks: relatedBooks.trim(),
        deliverables: deliverables.trim(),
        status: submitNow ? 'submitted' : (existing?.status === 'reviewed' ? 'reviewed' : 'draft'),
        teacherFeedback: existing?.teacherFeedback,
      };
      onUpdateRecord(updatedRecord);
      setExpandedRecordId(editingRecordId);
    } else {
      const newRecord: InquiryActivityRecord = {
        id: `act-${Date.now()}`,
        studentId: student.id,
        title: title.trim(),
        subject: subject.trim(),
        category,
        gradeSemester,
        date: new Date().toISOString().split('T')[0],
        motivation: motivation.trim(),
        process: process.trim(),
        insights: insights.trim(),
        relatedBooks: relatedBooks.trim(),
        deliverables: deliverables.trim(),
        status: submitNow ? 'submitted' : 'draft',
      };
      onAddRecord(newRecord);
      setExpandedRecordId(newRecord.id);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingRecordId(null);
    setTitle('');
    setMotivation('');
    setProcess('');
    setInsights('');
    setRelatedBooks('');
    setDeliverables('');
    setAiDraftNotice(null);
  };

  const studentRecords = records.filter((r) => r.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>탐구 활동 일지 및 세특 포트폴리오</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            교과 수업 중 느낀 호기심과 실천 과정을 체계적으로 기록하고, 담당 선생님께 검토를 요청하여
            1:1 피드백과 세특 초안을 받을 수 있습니다.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          신규 탐구 활동 작성하기
        </button>
      </div>

      {/* Record List */}
      <div className="space-y-4">
        {studentRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">등록된 탐구 활동 일지가 없습니다</p>
            <p className="text-xs text-slate-400 mt-1">
              '신규 탐구 활동 작성하기' 또는 AI 추천 메뉴에서 관심 교과 탐구 과제를 담아보세요.
            </p>
          </div>
        ) : (
          studentRecords.map((record) => {
            const isExpanded = expandedRecordId === record.id;
            return (
              <div
                key={record.id}
                className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                  record.status === 'reviewed'
                    ? 'border-indigo-200 ring-1 ring-indigo-50/50'
                    : record.status === 'submitted'
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Accordion Summary */}
                <div
                  onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {record.subject}
                      </span>
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {record.category}
                      </span>
                      <span className="text-slate-400">· {record.gradeSemester}</span>
                      <span className="text-slate-400">· {record.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{record.title}</h3>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-3">
                    {record.status === 'reviewed' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        교사 피드백 완료
                      </span>
                    ) : record.status === 'submitted' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        피드백 검토 대기
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        작성 중 (임시저장)
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-slate-100 space-y-6">
                    {/* Inquiry Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          💡 탐구 동기 및 핵심 문제의식
                        </span>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                          {record.motivation || '작성된 동기가 없습니다.'}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          🔬 탐구 과정 및 실천 방법론
                        </span>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                          {record.process || '작성된 과정이 없습니다.'}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          🌱 배운 점, 지적 성장 및 변화
                        </span>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                          {record.insights || '작성된 소감이 없습니다.'}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">
                            📚 연계 도서 및 참고 자료
                          </span>
                          <p className="text-indigo-600 font-medium">
                            {record.relatedBooks || '없음'}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">
                            📂 산출물 및 증빙 자료
                          </span>
                          <p className="text-slate-600">
                            {record.deliverables || '탐구 보고서 제출 완료'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Feedback Section */}
                    {record.teacherFeedback ? (
                      <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border border-indigo-200/90 rounded-2xl p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-100">
                          <div className="flex items-center gap-2">
                            <img
                              src={teacher.avatar}
                              alt={teacher.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <span className="text-xs font-bold text-indigo-950">
                                {record.teacherFeedback.author}
                              </span>
                              <span className="text-[11px] text-indigo-600 ml-2">
                                {record.teacherFeedback.date}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => onOpenChatWithActivity?.(record.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 shadow-xs transition-colors self-start sm:self-auto"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            선생님께 1:1 추가 질문하기
                          </button>
                        </div>

                        {/* 3 Core Competency Assessment */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 text-xs">
                            <span className="font-bold text-indigo-900 block mb-1">
                              🎯 학업역량 평가
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {record.teacherFeedback.academicCompetency}
                            </p>
                          </div>
                          <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 text-xs">
                            <span className="font-bold text-indigo-900 block mb-1">
                              🧭 진로역량 평가
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {record.teacherFeedback.careerCompetency}
                            </p>
                          </div>
                          <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 text-xs">
                            <span className="font-bold text-indigo-900 block mb-1">
                              🤝 공동체역량 평가
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {record.teacherFeedback.communityCompetency}
                            </p>
                          </div>
                        </div>

                        {/* Coaching Advice */}
                        <div className="bg-white/90 p-3.5 rounded-xl border border-indigo-100 text-xs">
                          <span className="font-bold text-indigo-950 block mb-1">
                            💬 지도교사 코멘트 및 후속 탐구 방향
                          </span>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {record.teacherFeedback.coachingAdvice}
                          </p>
                        </div>

                        {/* School Record Draft (세특 문안) */}
                        <div className="bg-white p-4 rounded-xl border-2 border-indigo-300/80 shadow-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              학교생활기록부 교과 세특 추천 기재 문안
                            </span>
                            <span className="text-[11px] text-slate-400">
                              글자수: 약 {record.teacherFeedback.draftRecord.length}자
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed font-sans bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                            {record.teacherFeedback.draftRecord}
                          </p>
                        </div>
                      </div>
                    ) : record.status === 'draft' ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-600">
                          작성을 완료하셨나요? AI 초안 기능으로 보완하거나 지도교사에게 제출하여 세특 첨삭을 받아보세요.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(record)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>수정 및 AI 초안 보완</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onSubmitForReview(record.id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>지도교사에게 제출하기</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                        <span>
                          ⏳ 지도교사가 현재 탐구 내용을 검토 중입니다. 검토가 완료되면 피드백 알림이 발송됩니다.
                        </span>
                        <button
                          onClick={() => onOpenChatWithActivity?.(record.id)}
                          className="text-xs font-semibold text-amber-900 underline hover:no-underline cursor-pointer"
                        >
                          상담창에서 문의하기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Inquiry Activity Modal with AI Draft Assistant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{editingRecordId ? '탐구 활동 일지 수정 및 AI 보완' : '새 탐구 활동 일지 작성'}</span>
                  {editingRecordId && (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      수정 모드
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  교과 연계 탐구 내용을 학생부 기재 요소(동기, 과정, 성장)에 맞추어 기록합니다.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200/90 rounded-2xl p-4 sm:p-4.5 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950 flex items-center gap-1.5">
                      <span>진로·관심사 맞춤 AI 초안 작성</span>
                      <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Gemini AI
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      학생의 진로 희망과 핵심 관심사를 바탕으로 '동기', '과정', '결과' 항목을 교육부 세특 기준에 맞추어 작성합니다.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={aiDraftLoading !== null}
                  onClick={() => handleTriggerAiDraft('all')}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  {aiDraftLoading === 'all' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AI 초안 생성 중...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>전체 항목 AI 초안 자동 작성</span>
                    </>
                  )}
                </button>
              </div>

              {/* Student Context Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] border-t border-indigo-100/80">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Compass className="w-3 h-3 text-indigo-500" />
                  적용 진로 맥락:
                </span>
                <span className="bg-white text-indigo-900 border border-indigo-200/80 px-2 py-0.5 rounded-md font-bold">
                  {student.targetCareer || student.targetMajor || '진로 미설정'}
                </span>
                {student.mainInterestTopic && (
                  <span className="bg-white text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium truncate max-w-xs" title={student.mainInterestTopic}>
                    "{student.mainInterestTopic}"
                  </span>
                )}
                {student.interestKeywords?.slice(0, 3).map((kw, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100/80 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {aiDraftNotice && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    aiDraftNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {aiDraftNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{aiDraftNotice.message}</span>
                </div>
              )}
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  탐구 활동 주제명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: [확률과 통계] 베이즈 정리를 활용한 CRISPR 오프타깃 확률 모델링 (비워두고 AI 초안을 누르면 추천됩니다)"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">연계 교과목</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="예: 수학, 생명과학, 영어"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">학생부 영역</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="교과세특">교과세특 (세부능력및특기사항)</option>
                    <option value="진로활동">진로활동 (창체)</option>
                    <option value="동아리활동">동아리활동 (창체)</option>
                    <option value="자율활동">자율활동 (창체)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">이수 학기</label>
                  <select
                    value={gradeSemester}
                    onChange={(e) => setGradeSemester(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1학년 1학기">1학년 1학기</option>
                    <option value="1학년 2학기">1학년 2학기</option>
                    <option value="2학년 1학기">2학년 1학기</option>
                    <option value="2학년 2학기">2학년 2학기</option>
                    <option value="3학년 1학기">3학년 1학기</option>
                  </select>
                </div>
              </div>

              {/* 1. Motivation with AI Draft button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>1. 탐구 동기 및 핵심 의문점 (교과 수업 연계)</span>
                    <span className="text-slate-400 font-normal text-[11px]">({motivation.length}자)</span>
                  </label>
                  <button
                    type="button"
                    disabled={aiDraftLoading !== null}
                    onClick={() => handleTriggerAiDraft('motivation')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                  >
                    {aiDraftLoading === 'motivation' ? (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                    )}
                    <span>AI 동기 초안 작성</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="수업 중 어떤 개념에서 호기심이 생겼는지, 왜 이 주제를 깊이 파고들게 되었는지 서술 (상단 AI 초안 작성 버튼을 누르면 자동 완성됩니다)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {/* 2. Process with AI Draft button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>2. 탐구 과정 및 실천 방법론 (구체적 실험/분석/독서)</span>
                    <span className="text-slate-400 font-normal text-[11px]">({process.length}자)</span>
                  </label>
                  <button
                    type="button"
                    disabled={aiDraftLoading !== null}
                    onClick={() => handleTriggerAiDraft('process')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                  >
                    {aiDraftLoading === 'process' ? (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                    )}
                    <span>AI 과정 초안 작성</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  placeholder="학술 자료 분석, 수리적 모델링 식 도출, 코딩 시뮬레이션, 변인 통제 등 구체적인 실천 과정 서술"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />
              </div>

              {/* 3. Insights with AI Draft button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>3. 배운 점, 지적 성장 및 향후 후속 탐구 계획</span>
                    <span className="text-slate-400 font-normal text-[11px]">({insights.length}자)</span>
                  </label>
                  <button
                    type="button"
                    disabled={aiDraftLoading !== null}
                    onClick={() => handleTriggerAiDraft('insights')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                  >
                    {aiDraftLoading === 'insights' ? (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                    )}
                    <span>AI 결과/성장 초안 작성</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={insights}
                  onChange={(e) => setInsights(e.target.value)}
                  placeholder="탐구 결과를 통해 무엇을 새롭게 알게 되었고, 자신의 진로 및 사고방식에 어떤 변화가 있었는지 서술"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    연계 도서 및 학술 논문
                  </label>
                  <input
                    type="text"
                    value={relatedBooks}
                    onChange={(e) => setRelatedBooks(e.target.value)}
                    placeholder="예: 《통계의 미학》(최제호), KCI 논문"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    산출물 및 증빙 자료 요약
                  </label>
                  <input
                    type="text"
                    value={deliverables}
                    onChange={(e) => setDeliverables(e.target.value)}
                    placeholder="예: 탐구 보고서 (6매), 엑셀 시뮬레이션"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreate(e, false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  {editingRecordId ? '수정 내용 저장' : '임시 저장'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreate(e, true)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm cursor-pointer"
                >
                  지도교사에게 제출
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

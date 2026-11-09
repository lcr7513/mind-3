import React, { useState } from 'react';
import { Student, Teacher, InquiryActivityRecord, TeacherFeedback } from '../types';
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  FileCheck,
  Send,
  Edit3,
  BookOpen,
  Award,
  ChevronRight,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface TeacherCoachingPanelProps {
  teacher: Teacher;
  students: Student[];
  records: InquiryActivityRecord[];
  onSaveFeedback: (recordId: string, feedback: TeacherFeedback) => void;
  onOpenChatWithStudent: (studentId: string, activityId?: string) => void;
}

export const TeacherCoachingPanel: React.FC<TeacherCoachingPanelProps> = ({
  teacher,
  students,
  records,
  onSaveFeedback,
  onOpenChatWithStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Coaching Form State
  const [academicCompetency, setAcademicCompetency] = useState<string>('');
  const [careerCompetency, setCareerCompetency] = useState<string>('');
  const [communityCompetency, setCommunityCompetency] = useState<string>('');
  const [coachingAdvice, setCoachingAdvice] = useState<string>('');
  const [draftRecord, setDraftRecord] = useState<string>('');
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentRecords = records.filter((r) => r.studentId === selectedStudentId);

  // Auto select record when student changes
  const activeRecord =
    studentRecords.find((r) => r.id === selectedRecordId) ||
    studentRecords.find((r) => r.status === 'submitted') ||
    studentRecords[0] ||
    null;

  // When active record changes, populate existing feedback if any
  React.useEffect(() => {
    if (activeRecord) {
      if (activeRecord.teacherFeedback) {
        setAcademicCompetency(activeRecord.teacherFeedback.academicCompetency);
        setCareerCompetency(activeRecord.teacherFeedback.careerCompetency);
        setCommunityCompetency(activeRecord.teacherFeedback.communityCompetency);
        setCoachingAdvice(activeRecord.teacherFeedback.coachingAdvice);
        setDraftRecord(activeRecord.teacherFeedback.draftRecord);
      } else {
        setAcademicCompetency('');
        setCareerCompetency('');
        setCommunityCompetency('');
        setCoachingAdvice('');
        setDraftRecord('');
      }
    }
  }, [activeRecord?.id]);

  // AI Helper Call
  const handleGenerateAiFeedback = async () => {
    if (!activeRecord) return;
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/ai/coach-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          grade: selectedStudent.grade,
          major: selectedStudent.targetMajor,
          subject: activeRecord.subject,
          activityTitle: activeRecord.title,
          activityContent: `[탐구 동기]\n${activeRecord.motivation}\n\n[탐구 과정]\n${activeRecord.process}\n\n[배운 점]\n${activeRecord.insights}\n\n[도서/자료]\n${activeRecord.relatedBooks}`,
          teacherNotes,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setAcademicCompetency(data.evaluation.academicCompetency || '');
        setCareerCompetency(data.evaluation.careerCompetency || '');
        setCommunityCompetency(data.evaluation.communityCompetency || '');
      }
      if (data.coachingAdvice) {
        setCoachingAdvice(data.coachingAdvice);
      }
      if (data.draftRecord) {
        setDraftRecord(data.draftRecord);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord) return;

    const feedback: TeacherFeedback = {
      author: `${teacher.name} 교사 (${teacher.role})`,
      date: new Date().toISOString().split('T')[0],
      academicCompetency,
      careerCompetency,
      communityCompetency,
      coachingAdvice,
      draftRecord,
    };

    onSaveFeedback(activeRecord.id, feedback);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const pendingCount = records.filter((r) => r.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{teacher.name} 선생님</h2>
              <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-semibold border border-indigo-100">
                {teacher.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              담당 교과: {teacher.subject} · {teacher.school}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl self-start sm:self-auto">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-amber-900 font-semibold">
            검토 대기 중인 학생 탐구 일지: {pendingCount}건
          </span>
        </div>
      </div>

      {/* Main 2-Column Split: Student List & Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Selector & Student's Activities (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              담당 지도 학생 목록 ({students.length}명)
            </span>

            <div className="space-y-2">
              {students.map((st) => {
                const isSelected = st.id === selectedStudentId;
                const studentPending = records.filter(
                  (r) => r.studentId === st.id && r.status === 'submitted'
                ).length;

                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStudentId(st.id);
                      setSelectedRecordId(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/50 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{st.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {st.grade.replace('고등학교 ', '')}
                          </span>
                        </div>
                        <span className="text-[11px] text-indigo-600 font-medium truncate block max-w-[140px]">
                          {st.targetMajor}
                        </span>
                      </div>
                    </div>

                    {studentPending > 0 ? (
                      <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                        검토 {studentPending}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student's Activities List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {selectedStudent.name} 학생의 탐구 기록
              </span>
              <button
                onClick={() => onOpenChatWithStudent(selectedStudent.id)}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                1:1 상담창
              </button>
            </div>

            <div className="space-y-2">
              {studentRecords.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  등록된 탐구 일지가 없습니다.
                </p>
              ) : (
                studentRecords.map((r) => {
                  const isActive = activeRecord?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRecordId(r.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isActive
                          ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-indigo-700 text-[11px]">
                          {r.subject}
                        </span>
                        {r.status === 'reviewed' ? (
                          <span className="text-[10px] text-emerald-700 font-medium">완료 ✓</span>
                        ) : r.status === 'submitted' ? (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            검토 요청!
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">작성중</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 line-clamp-2 leading-tight">
                        {r.title}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {r.date} · {r.gradeSemester}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Review Workspace & AI Generator (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeRecord ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Record Header */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {activeRecord.subject}
                    </span>
                    <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {activeRecord.category}
                    </span>
                    <span className="text-slate-400">· {activeRecord.gradeSemester}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeRecord.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenChatWithStudent(selectedStudent.id, activeRecord.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    학생과 대화
                  </button>
                </div>
              </div>

              {/* Student's Raw Work Summary */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs space-y-3">
                <span className="font-bold text-slate-700 block text-xs">
                  📋 학생이 제출한 탐구 기록 원문:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <strong className="text-slate-800 block mb-0.5">탐구 동기:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{activeRecord.motivation}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">탐구 과정 및 방법:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{activeRecord.process}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">배운 점 및 지적 성장:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{activeRecord.insights}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">연계 도서 및 산출물:</strong>
                    <p className="text-indigo-600 font-medium">{activeRecord.relatedBooks}</p>
                    <p className="text-slate-500 mt-1">{activeRecord.deliverables}</p>
                  </div>
                </div>
              </div>

              {/* AI Assistant Call Button */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI 세특 코칭 도우미 (교육부 기재요령 표준 준수)
                  </span>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    학생의 탐구 과정을 분석하여 3대 핵심역량 평가, 1:1 지도 조언, 500자 세특 추천 문안을 자동 생성합니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiFeedback}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0 disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      AI 피드백 및 세특 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      AI 피드백 및 세특 추천 생성
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Editor Form */}
              <form onSubmit={handleSaveFeedback} className="space-y-4">
                <span className="text-xs font-bold text-slate-800 block">
                  교사 세특 첨삭 및 평가 입력 (자유롭게 수정 가능)
                </span>

                {/* 3 Core Competencies */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      1. 학업역량 (탐구력·자기주도성)
                    </label>
                    <textarea
                      rows={3}
                      value={academicCompetency}
                      onChange={(e) => setAcademicCompetency(e.target.value)}
                      placeholder="교과 기본 개념의 심화 적용 및 수리적/과학적 탐구력 평가"
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      2. 진로역량 (전공 관심·지식 발전)
                    </label>
                    <textarea
                      rows={3}
                      value={careerCompetency}
                      onChange={(e) => setCareerCompetency(e.target.value)}
                      placeholder="전공 관련 학문 분야에 대한 이해도 및 자료 분석 역량"
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      3. 공동체역량 (협업·소통·윤리)
                    </label>
                    <textarea
                      rows={3}
                      value={communityCompetency}
                      onChange={(e) => setCommunityCompetency(e.target.value)}
                      placeholder="나눔, 소통, 윤리적 책임감 및 학급 기여도"
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Coaching Advice */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    학생 전달용 1:1 지도 코멘트 및 후속 탐구 방향
                  </label>
                  <textarea
                    rows={3}
                    value={coachingAdvice}
                    onChange={(e) => setCoachingAdvice(e.target.value)}
                    placeholder="학생이 보완해야 할 점, 2단계 후속 탐구로 확장할 주제 제언"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* School Record Draft (세특 문안) */}
                <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-indigo-950">
                      학교생활기록부 교과 세특 기재 문안 (약 450~500자)
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      {draftRecord.length}자
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={draftRecord}
                    onChange={(e) => setDraftRecord(e.target.value)}
                    placeholder="교육부 표준 규격: ~함, ~을 보임 형태의 문체로 입력"
                    className="w-full p-3 text-xs border border-indigo-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    {savedSuccess && (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        피드백이 학생에게 성공적으로 전송되었습니다!
                      </span>
                    )}
                  </span>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    피드백 저장 및 학생에게 전송
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center text-slate-400 text-xs">
              왼쪽 목록에서 검토할 학생의 탐구 일지를 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

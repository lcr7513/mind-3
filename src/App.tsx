import React, { useState } from 'react';
import {
  UserRole,
  Student,
  Teacher,
  InquiryActivityRecord,
  RoadmapMilestone,
  ChatMessage,
  MindMapNode,
  SubjectInquiryTopic,
  TeacherFeedback,
} from './types';
import {
  mockStudents,
  mockTeachers,
  initialMindMaps,
  mockInquiryRecords,
  mockRoadmap,
  mockChatMessages,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { CurriculumInquiryWizard } from './components/CurriculumInquiryWizard';
import { AiTopicGenerator } from './components/AiTopicGenerator';
import { CareerRoadmap } from './components/CareerRoadmap';
import { InquiryLogManager } from './components/InquiryLogManager';
import { TeacherCoachingPanel } from './components/TeacherCoachingPanel';
import { LiveChatModal } from './components/LiveChatModal';
import { ExportReportModal } from './components/ExportReportModal';
import { StudentCareerProfileModal } from './components/StudentCareerProfileModal';
import {
  Sparkles,
  Compass,
  FileText,
  Users,
  MessageSquare,
  Printer,
  HelpCircle,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Edit3,
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('hakjong_students');
      return saved ? JSON.parse(saved) : mockStudents;
    } catch {
      return mockStudents;
    }
  });
  const [currentStudentId, setCurrentStudentId] = useState<string>(mockStudents[0].id);
  const teacher = mockTeachers[0];

  const [activeNav, setActiveNav] = useState<string>('wizard');

  // Application State
  const [mindmaps, setMindmaps] = useState<Record<string, MindMapNode>>(initialMindMaps);
  const [records, setRecords] = useState<InquiryActivityRecord[]>(mockInquiryRecords);
  const [roadmaps, setRoadmaps] = useState<Record<string, RoadmapMilestone[]>>(mockRoadmap);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [chatActivityId, setChatActivityId] = useState<string | undefined>(undefined);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  // Save student profile handler
  const handleSaveStudentProfile = (updated: Student, targetTab?: 'wizard' | 'ai-topics') => {
    const updatedList = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(updatedList);
    try {
      localStorage.setItem('hakjong_students', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    // Automatically generate and update student's mindmap with 4~5 levels of concrete inquiry tools and protocols
    fetch('/api/ai/generate-mindmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: updated,
        rootTopic: updated.mainInterestTopic,
        targetMajor: updated.targetMajor,
        grade: updated.grade,
        preferredSubjects: updated.preferredSubjects,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mindmap) {
          setMindmaps((prev) => ({
            ...prev,
            [updated.id]: data.mindmap,
          }));
        }
      })
      .catch((err) => console.warn('Auto mindmap refresh on profile save failed:', err));

    if (targetTab) {
      setActiveNav(targetTab);
    }
  };
  const currentStudentMilestones = roadmaps[currentStudentId] || [];
  const currentStudentMindMap = mindmaps[currentStudentId] || initialMindMaps['student-1'];

  // Apply MindMap from AI Generator
  const handleApplyMindMap = (newMindMap: MindMapNode) => {
    setMindmaps((prev) => ({
      ...prev,
      [currentStudentId]: newMindMap,
    }));
  };

  // Add inquiry activity from AI recommendation
  const handleAddInquiryFromTopic = (topic: SubjectInquiryTopic) => {
    const newRecord: InquiryActivityRecord = {
      id: `act-${Date.now()}`,
      studentId: currentStudentId,
      title: `[${topic.subject}] ${topic.topic}`,
      subject: topic.subject,
      category: '교과세특',
      gradeSemester: '2학년 2학기',
      date: new Date().toISOString().split('T')[0],
      motivation: `교과 수업 중 핵심 질문("${topic.inquiryQuestion}")에 대한 지적 호기심을 바탕으로 심화 탐구 기획`,
      process: `탐구 방법론: ${topic.methodology}`,
      insights: `탐구를 통해 교과 개념과 전공 융합 역량을 확인하고 후속 과제 도출 예정`,
      relatedBooks: topic.readingRecommendation,
      deliverables: '탐구 기획서 및 연구 보고서 초안',
      status: 'draft',
    };

    setRecords((prev) => [newRecord, ...prev]);
  };

  // Add manual inquiry activity
  const handleAddRecord = (record: InquiryActivityRecord) => {
    setRecords((prev) => [record, ...prev]);
  };

  // Update existing inquiry activity
  const handleUpdateRecord = (updated: InquiryActivityRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  // Submit activity for teacher review
  const handleSubmitForReview = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'submitted' as const } : r))
    );

    // Auto notify in chat
    const submittedRecord = records.find((r) => r.id === recordId);
    if (submittedRecord) {
      const autoMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentStudent.id,
        senderName: currentStudent.name,
        senderRole: 'student',
        recipientId: teacher.id,
        content: `선생님, '${submittedRecord.title}' 탐구 일지 작성을 완료하여 검토 및 피드백을 요청드렸습니다!`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        relatedActivityId: recordId,
        tag: '세특검토',
      };
      setChatMessages((prev) => [...prev, autoMsg]);
    }
  };

  // Teacher saves feedback
  const handleSaveTeacherFeedback = (recordId: string, feedback: TeacherFeedback) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'reviewed' as const,
              teacherFeedback: feedback,
            }
          : r
      )
    );

    // Auto notification in chat
    const updatedRecord = records.find((r) => r.id === recordId);
    if (updatedRecord) {
      const autoMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: teacher.id,
        senderName: `${teacher.name} 교사`,
        senderRole: 'teacher',
        recipientId: updatedRecord.studentId,
        content: `'${updatedRecord.title}' 탐구에 대한 세특 첨삭 및 지도 코멘트를 작성해 두었습니다. 피드백 패널을 확인해 보세요!`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        relatedActivityId: recordId,
        tag: '피드백',
      };
      setChatMessages((prev) => [...prev, autoMsg]);
    }
  };

  // Roadmap updates
  const handleAddMilestone = (milestone: RoadmapMilestone) => {
    setRoadmaps((prev) => ({
      ...prev,
      [currentStudentId]: [...(prev[currentStudentId] || []), milestone],
    }));
  };

  const handleUpdateMilestoneStatus = (id: string, newStatus: RoadmapMilestone['status']) => {
    setRoadmaps((prev) => ({
      ...prev,
      [currentStudentId]: (prev[currentStudentId] || []).map((m) =>
        m.id === id ? { ...m, status: newStatus } : m
      ),
    }));
  };

  // Chat send
  const handleSendMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);

    // Optional simulated smart reply when student sends a message and is in student mode
    if (msg.senderRole === 'student') {
      setTimeout(() => {
        const autoTeacherReply: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: teacher.id,
          senderName: `${teacher.name} 교사`,
          senderRole: 'teacher',
          recipientId: msg.senderId,
          content: `${msg.senderName} 학생, 메시지 잘 받았습니다! 문의한 내용 검토하고 피드백 메모 남겨두겠습니다.`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          relatedActivityId: msg.relatedActivityId,
          tag: '피드백',
        };
        setChatMessages((prev) => [...prev, autoTeacherReply]);
      }, 1500);
    }
  };

  const handleOpenChatWithActivity = (activityId: string) => {
    setChatActivityId(activityId);
    setIsChatOpen(true);
  };

  const handleOpenChatWithStudent = (studentId: string, activityId?: string) => {
    setCurrentStudentId(studentId);
    setChatActivityId(activityId);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={(role) => setCurrentRole(role)}
        students={students}
        currentStudentId={currentStudentId}
        onSelectStudent={(id) => setCurrentStudentId(id)}
        teacher={teacher}
        activeNav={activeNav}
        onSelectNav={(nav) => setActiveNav(nav)}
        onOpenChat={() => {
          setChatActivityId(undefined);
          setIsChatOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Helper Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                currentRole === 'student' ? 'bg-indigo-600' : 'bg-emerald-600'
              } animate-pulse`}
            />
            <div className="text-xs">
              <strong className="text-slate-800">
                현재 접속: {currentRole === 'student' ? '학생 모드' : '교사 지도 모드'}
              </strong>
              <span className="text-slate-500 ml-2">
                {currentRole === 'student'
                  ? `${currentStudent.name} (${currentStudent.grade} · ${currentStudent.targetMajor})`
                  : `${teacher.name} 교사 (${teacher.role} · 한국과학예술고)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              포트폴리오 요약서 인쇄/PDF
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold border border-indigo-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              실시간 세특 상담톡
            </button>
          </div>
        </div>

        {/* Student Career & Interest Profile Card (Crucial for personalized inquiry) */}
        {currentRole === 'student' && (
          <div className="mb-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-indigo-900/60 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span>나의 진로희망 & 관심 분야 프로필</span>
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  {currentStudent.name} ({currentStudent.grade} · {currentStudent.school})
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5 text-sm sm:text-base font-black text-white">
                  <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{currentStudent.targetCareer || '진로 목표를 설정하세요'}</span>
                </div>
                <span className="text-indigo-400 font-bold hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-indigo-200">
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>목표 학과: {currentStudent.targetMajor || '희망 학과를 설정하세요'}</span>
                </div>
              </div>

              {/* Core Interest Topic Box */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3.5 text-xs text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>내가 등록한 핵심 관심 연구 분야 / 최근 호기심:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  "{currentStudent.mainInterestTopic || '아직 등록된 관심사가 없습니다. 우측 버튼을 눌러 관심 분야를 등록해보세요!'}"
                </p>
              </div>

              {/* Keywords and Preferred Subjects */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {currentStudent.interestKeywords?.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 px-2 py-0.5 rounded-lg font-medium"
                  >
                    #{kw}
                  </span>
                ))}
                {currentStudent.preferredSubjects?.map((subj, idx) => (
                  <span
                    key={`subj-${idx}`}
                    className="text-[10px] bg-slate-800/90 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg font-bold"
                  >
                    📚 {subj.split('(')[0].trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-100 text-indigo-950 rounded-2xl text-xs font-black transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>내 진로·관심사 수정하기</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('wizard')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold border border-indigo-400/40 transition-all shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>맞춤 탐구 길잡이 시작</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 0: Curriculum-First Guided Wizard */}
        {activeNav === 'wizard' && (
          <CurriculumInquiryWizard
            currentStudent={currentStudent}
            onAddInquiryRecord={handleAddInquiryFromTopic}
            onSwitchToMindmap={() => setActiveNav('ai-topics')}
          />
        )}

        {/* Tab 1: AI Topic Generator & Mind Map */}
        {activeNav === 'ai-topics' && (
          <AiTopicGenerator
            currentGrade={currentStudent.grade}
            defaultMajor={currentStudent.targetMajor}
            defaultInterest={currentStudent.mainInterestTopic}
            defaultKeywords={(currentStudent.interestKeywords || []).join(', ')}
            defaultSelectedSubjects={currentStudent.preferredSubjects}
            onApplyMindMap={handleApplyMindMap}
            onAddInquiryRecord={handleAddInquiryFromTopic}
            onSwitchToWizard={() => setActiveNav('wizard')}
          />
        )}

        {/* Tab 2: Career Roadmap */}
        {activeNav === 'roadmap' && (
          <CareerRoadmap
            student={currentStudent}
            milestones={currentStudentMilestones}
            onAddMilestone={handleAddMilestone}
            onUpdateStatus={handleUpdateMilestoneStatus}
          />
        )}

        {/* Tab 3: Student Inquiry Activity Logs & Portfolio */}
        {activeNav === 'inquiry-logs' && (
          <InquiryLogManager
            student={currentStudent}
            teacher={teacher}
            records={records}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onSubmitForReview={handleSubmitForReview}
            onOpenChatWithActivity={handleOpenChatWithActivity}
          />
        )}

        {/* Tab 4: Teacher Coaching Dashboard */}
        {activeNav === 'teacher-panel' && (
          <TeacherCoachingPanel
            teacher={teacher}
            students={students}
            records={records}
            onSaveFeedback={handleSaveTeacherFeedback}
            onOpenChatWithStudent={handleOpenChatWithStudent}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            학종나침반 (Hakjong Compass) · 고등학교 학생부 종합전형 AI 진로·교과 연계 탐구 플랫폼
          </p>
          <p className="text-[11px] text-slate-400">
            2022/2015 개정 교육과정 및 교육부 학교생활기록부 기재요령 표준 규격 준수
          </p>
        </div>
      </footer>

      {/* Floating Chat Modal */}
      <LiveChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserRole={currentRole}
        student={currentStudent}
        teacher={teacher}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        selectedActivityId={chatActivityId}
        activities={records}
      />

      {/* Export / Print Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        student={currentStudent}
        teacher={teacher}
        records={records}
        milestones={currentStudentMilestones}
        mindmap={currentStudentMindMap}
      />

      {/* Student Career & Interest Profile Setup Modal */}
      <StudentCareerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={currentStudent}
        onSaveProfile={handleSaveStudentProfile}
      />
    </div>
  );
}

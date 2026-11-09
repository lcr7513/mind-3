import React from 'react';
import { UserRole, Student, Teacher } from '../types';
import {
  Compass,
  GraduationCap,
  Users,
  MessageSquare,
  Printer,
  Sparkles,
  Layers,
  FileText,
  MapPin,
  ChevronDown,
  Lightbulb,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  students: Student[];
  currentStudentId: string;
  onSelectStudent: (id: string) => void;
  teacher: Teacher;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenChat: () => void;
  onOpenExportModal: () => void;
  onOpenProfile?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  students,
  currentStudentId,
  onSelectStudent,
  teacher,
  activeNav,
  onSelectNav,
  onOpenChat,
  onOpenExportModal,
  onOpenProfile,
  unreadCount = 2,
}) => {
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  학종나침반
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-100">
                  AI 탐구·세특
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                고교 학생부 종합전형 맞춤형 로드맵 & 마인드맵
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectNav('wizard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'wizard'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>교과 단원별 탐구 길잡이</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeNav === 'wizard' ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                추천
              </span>
            </button>

            <button
              onClick={() => onSelectNav('ai-topics')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'ai-topics'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI 교과 연계 & 마인드맵
            </button>

            <button
              onClick={() => onSelectNav('roadmap')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'roadmap'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              맞춤형 진로 로드맵
            </button>

            <button
              onClick={() => onSelectNav('inquiry-logs')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'inquiry-logs'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              활동 일지 및 세특
            </button>

            {currentRole === 'teacher' && (
              <button
                onClick={() => onSelectNav('teacher-panel')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeNav === 'teacher-panel'
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                교사 지도·첨삭 대시보드
              </button>
            )}
          </nav>

          {/* Right Tools: Role Toggle, Student Selector, Chat, Export */}
          <div className="flex items-center gap-2.5">
            {/* Student Persona Dropdown & Profile Quick Trigger */}
            {currentRole === 'student' && (
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <select
                    value={currentStudentId}
                    onChange={(e) => onSelectStudent(e.target.value)}
                    className="text-xs font-semibold pl-2.5 pr-7 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.targetMajor.split('/')[0].trim()})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {onOpenProfile && (
                  <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors shadow-2xs"
                    title="진로희망 및 관심 분야 기록·수정"
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">관심사 설정</span>
                  </button>
                )}
              </div>
            )}

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onChangeRole('student')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>학생 모드</span>
              </button>
              <button
                onClick={() => {
                  onChangeRole('teacher');
                  onSelectNav('teacher-panel');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>교사 모드</span>
              </button>
            </div>

            {/* Live Chat Button */}
            <button
              onClick={onOpenChat}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="교사-학생 실시간 세특 코칭 채팅"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Export / Print Button */}
            <button
              onClick={onOpenExportModal}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex"
              title="포트폴리오 요약서 인쇄 및 PDF 저장"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => onSelectNav('wizard')}
            className={`py-1 px-1.5 rounded-lg ${activeNav === 'wizard' ? 'text-indigo-600 font-bold bg-indigo-50' : ''}`}
          >
            단원별 길잡이
          </button>
          <button
            onClick={() => onSelectNav('ai-topics')}
            className={`py-1 px-1.5 rounded-lg ${activeNav === 'ai-topics' ? 'text-indigo-600 font-bold bg-indigo-50' : ''}`}
          >
            마인드맵
          </button>
          <button
            onClick={() => onSelectNav('roadmap')}
            className={`py-1 px-2 rounded-lg ${activeNav === 'roadmap' ? 'text-indigo-600 font-bold' : ''}`}
          >
            진로 로드맵
          </button>
          <button
            onClick={() => onSelectNav('inquiry-logs')}
            className={`py-1 px-2 rounded-lg ${activeNav === 'inquiry-logs' ? 'text-indigo-600 font-bold' : ''}`}
          >
            활동 일지
          </button>
          {currentRole === 'teacher' && (
            <button
              onClick={() => onSelectNav('teacher-panel')}
              className={`py-1 px-2 rounded-lg ${activeNav === 'teacher-panel' ? 'text-indigo-600 font-bold' : ''}`}
            >
              교사 첨삭
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

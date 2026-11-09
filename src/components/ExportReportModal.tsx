import React from 'react';
import { Student, Teacher, InquiryActivityRecord, RoadmapMilestone, MindMapNode } from '../types';
import { Printer, Download, X, Award, FileText, CheckCircle2 } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  teacher: Teacher;
  records: InquiryActivityRecord[];
  milestones: RoadmapMilestone[];
  mindmap: MindMapNode;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  student,
  teacher,
  records,
  milestones,
  mindmap,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const studentRecords = records.filter((r) => r.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Modal Controls Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">학생부 종합전형 탐구 포트폴리오 및 세특 요약서</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              인쇄 및 PDF 저장
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0">
          {/* Document Title Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              HAKJONG COMPASS PORTFOLIO REPORT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              학생부 종합전형 진로·교과 연계 탐구 포트폴리오
            </h1>
            <p className="text-xs text-slate-500">
              한국과학예술고등학교 진로진학상담부 인증 서식 · 발행일자:{' '}
              {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* Student & Teacher Info Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <table className="w-full border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <th className="bg-slate-100 p-2.5 border border-slate-300 text-left font-semibold text-slate-700 w-28">
                    학생 성명
                  </th>
                  <td className="p-2.5 border border-slate-300 font-bold text-slate-900">
                    {student.name} ({student.grade} {student.classNum})
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-100 p-2.5 border border-slate-300 text-left font-semibold text-slate-700">
                    희망 전공 / 진로
                  </th>
                  <td className="p-2.5 border border-slate-300 text-indigo-700 font-medium">
                    {student.targetMajor} ({student.targetCareer})
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-100 p-2.5 border border-slate-300 text-left font-semibold text-slate-700">
                    소속 학교
                  </th>
                  <td className="p-2.5 border border-slate-300 text-slate-800">
                    {student.school}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <th className="bg-slate-100 p-2.5 border border-slate-300 text-left font-semibold text-slate-700 w-28">
                    지도 교사
                  </th>
                  <td className="p-2.5 border border-slate-300 font-bold text-slate-900">
                    {teacher.name} 교사 ({teacher.role})
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-100 p-2.5 border border-slate-300 text-left font-semibold text-slate-700">
                    핵심 탐구 주제
                  </th>
                  <td className="p-2.5 border border-slate-300 text-slate-800 font-medium">
                    {mindmap.text}
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-100 p-2.5 border border-slate-300 text-left font-semibold text-slate-700">
                    관심 키워드
                  </th>
                  <td className="p-2.5 border border-slate-300 text-slate-600">
                    {student.interestKeywords.join(', ')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3-Year Career Inquiry Roadmap */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
              1. 3개년 학종 진로 로드맵 마일스톤
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-center">
                  <th className="border border-slate-300 p-2 w-28">시기</th>
                  <th className="border border-slate-300 p-2 w-24">영역</th>
                  <th className="border border-slate-300 p-2">탐구 활동명 및 계획</th>
                  <th className="border border-slate-300 p-2 w-44">입증 핵심 역량</th>
                  <th className="border border-slate-300 p-2 w-20">진행 상태</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m) => (
                  <tr key={m.id} className="text-slate-800">
                    <td className="border border-slate-300 p-2 text-center font-medium">
                      {m.gradeSemester}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-medium">
                      {m.category}
                    </td>
                    <td className="border border-slate-300 p-2">
                      <strong className="block text-slate-900">{m.title}</strong>
                      <span className="text-[11px] text-slate-600">{m.description}</span>
                    </td>
                    <td className="border border-slate-300 p-2 text-indigo-700 font-medium">
                      {m.keyCompetency}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-semibold">
                      {m.status === 'completed' ? '완료 ✓' : m.status === 'in_progress' ? '진행중' : '계획'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inquiry Activities & Teacher Record Drafts */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
              2. 교과별 세특 탐구 활동 상세 및 지도교사 피드백
            </h2>

            {studentRecords.map((r, idx) => (
              <div
                key={r.id}
                className="border border-slate-300 rounded-xl p-5 space-y-3 text-xs bg-slate-50/30"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900">
                    #{idx + 1}. [{r.subject}] {r.title}
                  </span>
                  <span className="text-slate-500">
                    {r.gradeSemester} · {r.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <strong className="block text-slate-900 mb-0.5">· 탐구 동기:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{r.motivation}</p>
                  </div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">· 탐구 과정 및 실천:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{r.process}</p>
                  </div>
                </div>

                {r.teacherFeedback && (
                  <div className="bg-indigo-50/70 p-3.5 rounded-lg border border-indigo-200 space-y-2 mt-2">
                    <span className="font-bold text-indigo-950 block">
                      📌 [지도교사 세특 기재 추천 문안]
                    </span>
                    <p className="text-slate-800 leading-relaxed font-sans bg-white p-3 rounded border border-indigo-100">
                      {r.teacherFeedback.draftRecord}
                    </p>
                    <div className="text-[11px] text-indigo-700 flex items-center justify-between">
                      <span>지도 교사: {r.teacherFeedback.author}</span>
                      <span>평가일: {r.teacherFeedback.date}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Signoff Footer */}
          <div className="pt-8 text-center text-xs text-slate-500 space-y-1 border-t border-slate-200">
            <p>위 내용은 학교생활기록부 기재요령 및 대입 공정성 가이드라인을 준수하여 작성되었습니다.</p>
            <p className="font-bold text-slate-800">
              한국과학예술고등학교 진로진학상담부장 강수진 (인)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Student, Teacher, InquiryActivityRecord, UserRole } from '../types';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Paperclip,
  CheckCheck,
  Tag,
  Clock,
  User,
  GraduationCap,
} from 'lucide-react';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  student: Student;
  teacher: Teacher;
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  selectedActivityId?: string;
  activities: InquiryActivityRecord[];
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  student,
  teacher,
  messages,
  onSendMessage,
  selectedActivityId,
  activities,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<ChatMessage['tag']>('피드백');
  const [activeActivityId, setActiveActivityId] = useState<string | undefined>(selectedActivityId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedActivityId) {
      setActiveActivityId(selectedActivityId);
    }
  }, [selectedActivityId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const currentActivity = activities.find((a) => a.id === activeActivityId);

  // Quick prompt templates
  const studentQuickPrompts = [
    '선생님, 보고서 수식 모델링 부분에 대해 조언 여쭙고 싶습니다.',
    '마인드맵에 2학기 연계 주제를 새로 추가했는데 확인 부탁드립니다.',
    '작성해주신 세특 초안 확인했습니다. 정말 감사드립니다!',
  ];

  const teacherQuickPrompts = [
    '보고서의 문제의식이 아주 훌륭합니다. 수리적 전개를 조금 더 구체화해 보세요.',
    '피드백 패널에 세특 표준 문안을 남겨두었으니 확인해 보세요.',
    '내일 방과 후 진학상담실에서 대면으로 2단계 탐구 계획을 논의합시다.',
  ];

  const handleSend = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const senderRole = currentUserRole;
    const senderId = currentUserRole === 'student' ? student.id : teacher.id;
    const senderName = currentUserRole === 'student' ? student.name : `${teacher.name} 교사`;
    const recipientId = currentUserRole === 'student' ? teacher.id : student.id;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      recipientId,
      content,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      relatedActivityId: activeActivityId,
      tag: selectedTag,
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[640px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUserRole === 'student' ? teacher.avatar : student.avatar}
                alt="Partner"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">
                  {currentUserRole === 'student'
                    ? `${teacher.name} 선생님 (진로진학)`
                    : `${student.name} 학생 (${student.grade})`}
                </h3>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  실시간 세특 코칭 채널
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {currentUserRole === 'student' ? teacher.subject : student.targetMajor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Linked Activity Info Bar */}
        {currentActivity && (
          <div className="bg-indigo-50/80 border-b border-indigo-100 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-medium truncate">
              <span className="font-bold bg-indigo-200/60 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">
                연계 탐구
              </span>
              <span className="truncate">{currentActivity.title}</span>
            </div>
            <button
              onClick={() => setActiveActivityId(undefined)}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline shrink-0 ml-2"
            >
              해제
            </button>
          </div>
        )}

        {/* Message History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/60">
          <div className="text-center my-2">
            <span className="text-[11px] text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
              교사-학생 간 안전한 1:1 진로·교과 세특 코칭 대화방입니다
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            const linked = activities.find((a) => a.id === msg.relatedActivityId);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                  isMe ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                  <span className="font-semibold">{msg.senderName}</span>
                  {msg.tag && (
                    <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.2 rounded">
                      #{msg.tag}
                    </span>
                  )}
                  <span>·</span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {linked && (
                    <div
                      className={`text-[11px] pb-1.5 mb-1.5 border-b font-medium ${
                        isMe ? 'border-indigo-400/40 text-indigo-100' : 'border-slate-100 text-indigo-600'
                      }`}
                    >
                      📎 [참조 활동] {linked.title}
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-slate-100/80 px-4 py-2 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold text-slate-500 shrink-0">빠른 질문/답변:</span>
          {(currentUserRole === 'student' ? studentQuickPrompts : teacherQuickPrompts).map(
            (prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 rounded-lg text-[11px] transition-colors shrink-0"
              >
                {prompt}
              </button>
            )
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          {/* Tags */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">말머리:</span>
            {(['피드백', '세특검토', '질문', '상담요청'] as ChatMessage['tag'][]).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                currentUserRole === 'student'
                  ? '선생님께 탐구 관련 궁금한 점이나 피드백 요청 메시지를 입력하세요...'
                  : '학생에게 전할 조언이나 지도 코멘트를 입력하세요...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>전송</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useMemo } from 'react';
import { MindMapNode, SubjectInquiryTopic } from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  Circle,
  Download,
  Info,
  ChevronRight,
  X,
  Layers,
  BookmarkPlus,
  Lightbulb,
  FlaskConical,
  GraduationCap,
  FileText,
  Filter,
} from 'lucide-react';

interface MindMapCanvasProps {
  rootNode: MindMapNode;
  onUpdateMindMap: (updatedRoot: MindMapNode) => void;
  onSelectNodeDetail?: (node: MindMapNode) => void;
  onAddInquiryRecord?: (topic: SubjectInquiryTopic) => void;
}

interface PositionedNode {
  node: MindMapNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  parent?: PositionedNode;
  children: PositionedNode[];
  isExpanded: boolean;
}

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  rootNode,
  onUpdateMindMap,
  onSelectNodeDetail,
  onAddInquiryRecord,
}) => {
  const [zoom, setZoom] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 340, y: 320 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  const [isExpandingAi, setIsExpandingAi] = useState<boolean>(false);
  const [newNodeText, setNewNodeText] = useState<string>('');
  const [isAddingCustomNode, setIsAddingCustomNode] = useState<boolean>(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [addedActivityNotice, setAddedActivityNotice] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Subject Filter definitions
  const subjectFilters = [
    { id: 'all', label: '전체 교과 보기', icon: '🌐' },
    { id: 'math', label: '수학 연계', icon: '📐' },
    { id: 'science', label: '과학/공학 연계', icon: '🔬' },
    { id: 'social', label: '사회/윤리/경제 연계', icon: '⚖️' },
    { id: 'korean', label: '국어/인문 연계', icon: '📖' },
    { id: 'english', label: '영어/글로벌 연계', icon: '🌍' },
    { id: 'tech', label: '정보/IT/융합 연계', icon: '💻' },
  ];

  // Toggle node collapse
  const toggleCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Filter root's level-1 branches if a subject filter is active
  const filteredRootChildren = useMemo(() => {
    const children = rootNode.children || [];
    if (selectedSubjectFilter === 'all') return children;
    return children.filter((c) => {
      const cat = c.category.toLowerCase();
      const txt = c.text.toLowerCase();
      if (selectedSubjectFilter === 'math') return cat === 'math' || txt.includes('수학');
      if (selectedSubjectFilter === 'science') return cat === 'science' || txt.includes('과학') || txt.includes('생명') || txt.includes('물리') || txt.includes('화학');
      if (selectedSubjectFilter === 'social') return cat === 'social' || txt.includes('사회') || txt.includes('윤리') || txt.includes('경제') || txt.includes('법');
      if (selectedSubjectFilter === 'korean') return cat === 'korean' || cat === 'humanities' || txt.includes('국어') || txt.includes('독서') || txt.includes('문학');
      if (selectedSubjectFilter === 'english') return cat === 'english' || txt.includes('영어') || txt.includes('영문');
      if (selectedSubjectFilter === 'tech') return cat === 'tech' || txt.includes('정보') || txt.includes('인공지능') || txt.includes('데이터');
      return true;
    });
  }, [rootNode, selectedSubjectFilter]);

  // Two-sided Tree Layout Calculator
  const { positionedNodes, links } = useMemo(() => {
    const pNodes: PositionedNode[] = [];
    const pLinks: { from: { x: number; y: number }; to: { x: number; y: number }; color: string }[] = [];

    const getSubtreeHeight = (node: MindMapNode): number => {
      if (collapsedNodeIds.has(node.id) || !node.children || node.children.length === 0) {
        return 76;
      }
      const childrenHeight = node.children.reduce((acc, c) => acc + getSubtreeHeight(c), 0);
      return Math.max(76, childrenHeight + 16 * (node.children.length - 1));
    };

    const rootChildren = filteredRootChildren;
    const rightChildren = rootChildren.slice(0, Math.ceil(rootChildren.length / 2));
    const leftChildren = rootChildren.slice(Math.ceil(rootChildren.length / 2));

    const rootWidth = Math.min(280, Math.max(200, rootNode.text.length * 12 + 40));
    const rootPNode: PositionedNode = {
      node: rootNode,
      x: 0,
      y: 0,
      width: rootWidth,
      height: 72,
      depth: 0,
      children: [],
      isExpanded: true,
    };
    pNodes.push(rootPNode);

    const layoutSide = (children: MindMapNode[], direction: 1 | -1) => {
      const totalH = children.reduce((acc, c) => acc + getSubtreeHeight(c), 0);
      let currentY = -totalH / 2;

      const placeBranch = (node: MindMapNode, parentX: number, depth: number, parentP: PositionedNode) => {
        const h = getSubtreeHeight(node);
        const nodeY = currentY + h / 2;

        // Smart dynamic node sizing
        const textLen = node.text.length;
        const nodeWidth = depth === 1 ? Math.min(260, Math.max(180, textLen * 9 + 48)) : Math.min(250, Math.max(170, textLen * 8.5 + 40));
        const nodeHeight = depth === 1 ? 60 : 54;
        const xOffset = direction * (parentP.width / 2 + 130 + (depth > 1 ? 30 : 0));
        const nodeX = parentX + xOffset;

        const isCollapsed = collapsedNodeIds.has(node.id);

        const currentPNode: PositionedNode = {
          node,
          x: nodeX,
          y: nodeY,
          width: nodeWidth,
          height: nodeHeight,
          depth,
          parent: parentP,
          children: [],
          isExpanded: !isCollapsed,
        };
        pNodes.push(currentPNode);

        const fromX = direction === 1 ? parentP.x + parentP.width / 2 : parentP.x - parentP.width / 2;
        const toX = direction === 1 ? nodeX - nodeWidth / 2 : nodeX + nodeWidth / 2;
        pLinks.push({
          from: { x: fromX, y: parentP.y },
          to: { x: toX, y: nodeY },
          color: node.color || '#6366f1',
        });

        if (!isCollapsed && node.children && node.children.length > 0) {
          const originalCurrentY = currentY;
          node.children.forEach((child) => {
            placeBranch(child, nodeX, depth + 1, currentPNode);
          });
          currentY = originalCurrentY + h;
        } else {
          currentY += h + 10;
        }
      };

      children.forEach((child) => {
        placeBranch(child, 0, 1, rootPNode);
      });
    };

    layoutSide(rightChildren, 1);
    layoutSide(leftChildren, -1);

    return { positionedNodes: pNodes, links: pLinks };
  }, [rootNode, filteredRootChildren, collapsedNodeIds]);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.mindmap-node-interactive')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.0, Math.max(0.35, Number((prev + delta).toFixed(2)))));
  };

  const handleResetView = () => {
    setZoom(0.95);
    setPan({ x: 340, y: 320 });
    setSelectedSubjectFilter('all');
  };

  // AI Expand Node (clean, non-repeating, hierarchical)
  const handleAiExpand = async (targetNode: MindMapNode, mode: 'expand' | 'process_steps' = 'expand') => {
    setIsExpandingAi(true);
    try {
      const res = await fetch('/api/ai/expand-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootTopic: rootNode.text,
          nodeText: targetNode.text,
          nodeSubject: targetNode.subject || targetNode.category,
          nodeType: targetNode.nodeType,
          category: targetNode.category,
          mode,
        }),
      });
      const data = await res.json();
      if (data.newNodes && data.newNodes.length > 0) {
        const newChildren: MindMapNode[] = data.newNodes.map((n: any, idx: number) => ({
          id: `${targetNode.id}-ai-${Date.now()}-${idx}`,
          text: n.text,
          category: n.category || targetNode.category,
          color: targetNode.color,
          detail: n.detail,
          subject: n.subject || targetNode.subject,
          inquiryQuestion: n.inquiryQuestion,
          methodology: n.methodology,
          readingRecommendation: n.readingRecommendation,
          recordTip: n.recordTip,
          nodeType: n.nodeType || (mode === 'process_steps' ? 'process_step' : 'action'),
          status: 'planned',
        }));

        const insertRecursive = (curr: MindMapNode): MindMapNode => {
          if (curr.id === targetNode.id) {
            return {
              ...curr,
              children: [...(curr.children || []), ...newChildren],
            };
          }
          if (!curr.children) return curr;
          return {
            ...curr,
            children: curr.children.map(insertRecursive),
          };
        };

        const updated = insertRecursive(rootNode);
        onUpdateMindMap(updated);

        setCollapsedNodeIds((prev) => {
          const next = new Set(prev);
          next.delete(targetNode.id);
          return next;
        });

        setSelectedNode((prev) =>
          prev && prev.id === targetNode.id
            ? { ...prev, children: [...(prev.children || []), ...newChildren] }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExpandingAi(false);
    }
  };

  // Add custom sub task
  const handleAddCustomChild = (parentNode: MindMapNode) => {
    if (!newNodeText.trim()) return;
    const customChild: MindMapNode = {
      id: `custom-${Date.now()}`,
      text: newNodeText.trim(),
      category: parentNode.category,
      color: parentNode.color,
      detail: '학생 직접 등록 실천 과제',
      nodeType: 'action',
      status: 'planned',
    };

    const insertRecursive = (curr: MindMapNode): MindMapNode => {
      if (curr.id === parentNode.id) {
        return {
          ...curr,
          children: [...(curr.children || []), customChild],
        };
      }
      if (!curr.children) return curr;
      return {
        ...curr,
        children: curr.children.map(insertRecursive),
      };
    };

    const updated = insertRecursive(rootNode);
    onUpdateMindMap(updated);
    setNewNodeText('');
    setIsAddingCustomNode(false);
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      next.delete(parentNode.id);
      return next;
    });
  };

  // Add to Activity Portfolio
  const handleAddToPortfolio = (node: MindMapNode) => {
    if (!onAddInquiryRecord) return;

    const topicObj: SubjectInquiryTopic = {
      id: `topic-${Date.now()}`,
      subject: node.subject || `${getCategoryBadge(node.category).label}`,
      subjectCategory: (node.category as any) || 'science',
      topic: node.text,
      inquiryQuestion: node.inquiryQuestion || node.detail || `${node.text}에 대한 심화 탐구`,
      methodology: node.methodology || '선행 연구 문헌 고찰 및 실험/데이터 시뮬레이션 분석',
      readingRecommendation: node.readingRecommendation || '관련 대학 전공 권장 도서 및 KCI 학술 논문',
      recordTip: node.recordTip || '교과서 단원 개념을 전공 관심사와 주도적으로 연결한 탐구 역량 강조',
    };

    onAddInquiryRecord(topicObj);
    setAddedActivityNotice(true);
    setTimeout(() => setAddedActivityNotice(false), 3000);
  };

  // Toggle node status
  const handleCycleStatus = (targetNode: MindMapNode) => {
    const nextStatus =
      targetNode.status === 'completed'
        ? 'planned'
        : targetNode.status === 'in_progress'
        ? 'completed'
        : 'in_progress';

    const updateStatusRecursive = (curr: MindMapNode): MindMapNode => {
      if (curr.id === targetNode.id) {
        return { ...curr, status: nextStatus };
      }
      if (!curr.children) return curr;
      return { ...curr, children: curr.children.map(updateStatusRecursive) };
    };

    const updated = updateStatusRecursive(rootNode);
    onUpdateMindMap(updated);
    if (selectedNode?.id === targetNode.id) {
      setSelectedNode({ ...selectedNode, status: nextStatus });
    }
  };

  // Category badge & label
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'math':
        return { label: '수학 연계', icon: '📐', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
      case 'science':
        return { label: '과학/공학 연계', icon: '🔬', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'social':
        return { label: '사회/윤리/경제', icon: '⚖️', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'humanities':
      case 'korean':
        return { label: '국어/인문 연계', icon: '📖', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'english':
        return { label: '영어/글로벌', icon: '🌍', bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' };
      case 'tech':
        return { label: '정보/IT/융합', icon: '💻', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      default:
        return { label: '핵심 주제', icon: '🎯', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    }
  };

  return (
    <div className="relative w-full h-[680px] bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden select-none shadow-inner flex flex-col">
      {/* Top Filter Bar: Subject Switcher */}
      <div className="z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            교과별 필터:
          </span>
          {subjectFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedSubjectFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
                selectedSubjectFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Floating Zoom & Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
            title="확대"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-medium text-slate-500 px-1 min-w-[32px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
            title="축소"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />
          <button
            onClick={handleResetView}
            className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors text-[11px] font-medium px-1.5"
            title="화면 중앙 정렬"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Canvas Map Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="absolute origin-center transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* SVG Links */}
          <svg
            className="overflow-visible pointer-events-none absolute top-0 left-0"
            style={{ width: 1, height: 1 }}
          >
            {links.map((link, idx) => {
              const dx = (link.to.x - link.from.x) * 0.5;
              const pathD = `M ${link.from.x} ${link.from.y} C ${link.from.x + dx} ${link.from.y}, ${link.to.x - dx} ${link.to.y}, ${link.to.x} ${link.to.y}`;
              return (
                <path
                  key={idx}
                  d={pathD}
                  fill="none"
                  stroke={link.color}
                  strokeWidth="2.5"
                  strokeOpacity="0.45"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {positionedNodes.map((pNode) => {
            const isRoot = pNode.depth === 0;
            const isSubjectLevel = pNode.depth === 1;
            const isSelected = selectedNode?.id === pNode.node.id;
            const hasChildren = pNode.node.children && pNode.node.children.length > 0;
            const isCollapsed = collapsedNodeIds.has(pNode.node.id);
            const badge = getCategoryBadge(pNode.node.category);

            const isStep = pNode.node.nodeType === 'process_step' || /1단계|2단계|3단계|4단계/i.test(pNode.node.text);
            const isAction = pNode.node.nodeType === 'action' || /\[(변인|현상|성취기준|학술|원서|개념|데이터|모델링|실험|오차|후속|문안|파라미터|융합|학술제)\]/i.test(pNode.node.text);

            return (
              <div
                key={pNode.node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(pNode.node);
                  onSelectNodeDetail?.(pNode.node);
                }}
                    className={`mindmap-node-interactive absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group ${
                      isSelected ? 'z-30' : 'z-10'
                    }`}
                    style={{
                      left: pNode.x,
                      top: pNode.y,
                      width: pNode.width,
                    }}
                  >
                    <div
                      className={`relative p-3 rounded-2xl border transition-all text-left shadow-sm ${
                        isRoot
                          ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white border-indigo-700 shadow-indigo-100 shadow-lg ring-4 ring-indigo-200/60'
                          : isSubjectLevel
                          ? isSelected
                            ? 'bg-white border-indigo-600 border-l-4 border-l-indigo-600 ring-4 ring-indigo-500/20 shadow-md text-slate-900'
                            : 'bg-white hover:bg-indigo-50/40 border-slate-300 border-l-4 border-l-indigo-500 text-slate-800 hover:border-indigo-400 shadow-xs'
                          : isStep
                          ? isSelected
                            ? 'bg-amber-50/80 border-amber-500 border-l-4 border-l-amber-600 ring-2 ring-amber-400/30 shadow-md text-slate-900'
                            : 'bg-white hover:bg-amber-50/30 border-slate-200 border-l-4 border-l-amber-500 text-slate-800 hover:border-amber-400'
                          : isAction
                          ? isSelected
                            ? 'bg-slate-50 border-slate-400 border-l-4 border-l-slate-600 ring-2 ring-slate-400/20 shadow-md text-slate-800'
                            : 'bg-white hover:bg-slate-50 border-slate-200 border-l-4 border-l-slate-400 text-slate-700 hover:border-slate-300'
                          : isSelected
                          ? 'bg-white border-indigo-600 border-l-4 border-l-sky-500 ring-2 ring-indigo-500/30 shadow-md text-slate-800'
                          : 'bg-white hover:bg-slate-50 border-slate-200 border-l-4 border-l-sky-400 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {/* Category & Status Indicator */}
                      {!isRoot && (
                        <div className="flex items-center justify-between mb-1.5 text-[10px]">
                          <div className="flex items-center gap-1 overflow-hidden">
                            <span
                              className={`font-bold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {isSubjectLevel ? badge.label : pNode.node.subject || badge.label}
                            </span>
                            {isStep ? (
                              <span className="font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] shrink-0">
                                ⚡ 탐구단계
                              </span>
                            ) : isAction ? (
                              <span className="font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[9px] shrink-0">
                                📌 실천과제
                              </span>
                            ) : isSubjectLevel ? null : (
                              <span className="font-semibold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200 text-[9px] shrink-0">
                                🎯 탐구주제
                              </span>
                            )}
                          </div>

                          {pNode.node.status && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCycleStatus(pNode.node);
                              }}
                              className="hover:scale-110 transition-transform ml-1"
                              title="상태 변경 (계획/진행중/완료)"
                            >
                              {pNode.node.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : pNode.node.status === 'in_progress' ? (
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-300" />
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Node Title */}
                      <div
                        className={`font-semibold tracking-tight leading-snug line-clamp-2 ${
                          isRoot
                            ? 'text-sm text-center font-extrabold text-white py-1'
                            : isSubjectLevel
                            ? 'text-xs font-bold text-slate-900'
                            : isStep
                            ? 'text-xs font-bold text-slate-900'
                            : 'text-xs'
                        }`}
                      >
                        {pNode.node.text}
                      </div>

                      {/* Expand/Collapse Toggle Button for branches */}
                      {hasChildren && !isRoot && (
                        <button
                          onClick={(e) => toggleCollapse(pNode.node.id, e)}
                          className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-slate-300 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm hover:bg-slate-100 hover:border-indigo-500 transition-colors z-20"
                        >
                          {isCollapsed ? '+' : '−'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
      </div>

      {/* Selected Node Rich Detail Drawer */}
      {selectedNode && (
        <div className="absolute top-14 right-4 bottom-4 w-92 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl z-40 flex flex-col p-5 overflow-y-auto animate-in fade-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                  getCategoryBadge(selectedNode.category).bg
                } ${getCategoryBadge(selectedNode.category).text} ${
                  getCategoryBadge(selectedNode.category).border
                }`}
              >
                {getCategoryBadge(selectedNode.category).label}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                {selectedNode.text}
              </h4>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 space-y-3 text-xs text-slate-600 flex-1 overflow-y-auto pr-1">
            {/* Inquiry Question */}
            {selectedNode.inquiryQuestion && (
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                <span className="font-bold text-amber-950 block mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  핵심 탐구 질문 (Inquiry Question)
                </span>
                <p className="text-amber-900 leading-relaxed font-medium">
                  {selectedNode.inquiryQuestion}
                </p>
              </div>
            )}

            {/* Methodology & Practical Tools */}
            {selectedNode.methodology && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                  🔬 구체적 실천 방법론 & 연구 도구
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{selectedNode.methodology}</p>
                
                {/* Detected tools chips */}
                {(() => {
                  const txt = `${selectedNode.methodology} ${selectedNode.detail || ''}`.toLowerCase();
                  const detected = [
                    /geogebra|지오지브라/i.test(txt) && '지오지브라(GeoGebra)',
                    /python|파이썬/i.test(txt) && 'Python / NumPy',
                    /pandas|팬더스/i.test(txt) && 'Pandas EDA',
                    /mbl|센서|열량계/i.test(txt) && '과학실 MBL 센서',
                    /riss|dbpia|kci|학술/i.test(txt) && 'RISS/DBpia 학술 논문',
                    /pdb|3d|분자|단백질/i.test(txt) && 'PDB 3D 분자 모델러',
                    /api|공공데이터/i.test(txt) && '공공데이터 REST API',
                    /canva|figma|포스터/i.test(txt) && 'Canva/Figma 학술 포스터',
                    /베이즈|조건부|확률/i.test(txt) && '베이즈 확률 모델',
                    /미적분|도함수|변화율/i.test(txt) && '미적분 변화율 수식화',
                  ].filter(Boolean) as string[];

                  if (detected.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-200">
                      {detected.map((t) => (
                        <span key={t} className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md">
                          🛠️ {t}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* General Detail: Protocol & Specific Action Guide */}
            {selectedNode.detail && selectedNode.detail !== selectedNode.inquiryQuestion && (
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950 block mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  📌 세부 실행 프로토콜 및 가이드
                </span>
                <p className="text-indigo-900 leading-relaxed text-[11px]">{selectedNode.detail}</p>
              </div>
            )}

            {/* Reading Recommendation */}
            {selectedNode.readingRecommendation && (
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                <span className="font-bold text-purple-900 block mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  연계 추천 도서 및 학술 키워드
                </span>
                <p className="text-purple-950 font-semibold leading-relaxed">
                  {selectedNode.readingRecommendation}
                </p>
              </div>
            )}

            {/* Record Tip */}
            {selectedNode.recordTip && (
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
                <span className="font-bold text-emerald-950 block mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  학생부 세특 500자 기록 포인트
                </span>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  {selectedNode.recordTip}
                </p>
              </div>
            )}

            {selectedNode.subject && (
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">연계 교과목</span>
                <span className="font-semibold text-slate-800">{selectedNode.subject}</span>
              </div>
            )}

            {selectedNode.status && (
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">탐구 진행 상태</span>
                <button
                  onClick={() => handleCycleStatus(selectedNode)}
                  className="flex items-center gap-1 font-semibold text-xs text-indigo-600 hover:underline"
                >
                  {selectedNode.status === 'completed'
                    ? '탐구 완료 ✓'
                    : selectedNode.status === 'in_progress'
                    ? '진행 중 ⏳'
                    : '계획 수립 📝'}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
            {/* Add to Portfolio Button */}
            {onAddInquiryRecord && (
              <button
                onClick={() => handleAddToPortfolio(selectedNode)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {addedActivityNotice ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    활동 일지에 성공적으로 추가됨!
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4 text-indigo-600" />
                    이 탐구를 내 활동 일지에 담기
                  </>
                )}
              </button>
            )}

            {/* 4-Stage Inquiry Process Button: Available for Root, Subject, and Topic nodes */}
            {(!selectedNode.nodeType || selectedNode.nodeType === 'topic' || selectedNode.nodeType === 'subject' || selectedNode.nodeType === 'root') && (
              <button
                onClick={() => handleAiExpand(selectedNode, 'process_steps')}
                disabled={isExpandingAi}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                <Layers className="w-3.5 h-3.5" />
                {isExpandingAi ? '4단계 프로세스 생성 중...' : '⚡ 4단계 탐구 진행 과정 자동 완성'}
              </button>
            )}

            <button
              onClick={() => handleAiExpand(selectedNode, 'expand')}
              disabled={isExpandingAi}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isExpandingAi
                ? 'AI 세부 과제 도출 중...'
                : selectedNode.nodeType === 'process_step'
                ? '✨ 이 단계의 초구체적 실행 과제 도출 (+3)'
                : selectedNode.nodeType === 'action'
                ? '🔬 심화 검증 및 차년도 연계 과제 도출 (+3)'
                : '✨ AI 하위 탐구 심화 확장 (+3)'}
            </button>

            {!isAddingCustomNode ? (
              <button
                onClick={() => setIsAddingCustomNode(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                직접 하위 실천 과제 추가
              </button>
            ) : (
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  value={newNodeText}
                  onChange={(e) => setNewNodeText(e.target.value)}
                  placeholder="예: 지오지브라 그래프 시뮬레이션"
                  className="w-full px-2.5 py-1.5 text-xs border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomChild(selectedNode)}
                />
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAddCustomChild(selectedNode)}
                    className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => setIsAddingCustomNode(false)}
                    className="py-1 px-2.5 bg-slate-200 text-slate-700 rounded-lg text-xs"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

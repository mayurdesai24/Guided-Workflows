import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Activity, BarChart2, History, MoreHorizontal, Calendar, User, Layers, Loader2, Trash2, Clock, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Timer } from 'lucide-react';
import { Workflow, Run } from '../types';
import { ChatPanel } from '../components/ChatPanel';
import { formatDuration } from '../constants';

interface HomeProps {
  workflows: Workflow[];
  runs: Run[];
  onCreateRun: (workflowId: string) => string;
  onDeleteWorkflow: (workflowId: string) => void;
  layoutMode: 'modern' | 'classic';
  onAddComment: (runId: string, text: string) => void;
}

const WorkflowDescription = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // Check if scrollHeight (full content) is greater than clientHeight (visible area)
        // Adding a small threshold (1px) handles potential sub-pixel rendering differences
        setIsTruncated(element.scrollHeight > element.clientHeight + 1);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text]);

  return (
    <p 
      ref={textRef} 
      className="text-sm text-slate-500 line-clamp-2 mb-6" 
      title={isTruncated ? text : undefined}
    >
      {text}
    </p>
  );
};

export const Home: React.FC<HomeProps> = ({ workflows, runs, onCreateRun, onDeleteWorkflow, layoutMode, onAddComment }) => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeChatRunId, setActiveChatRunId] = useState<string | null>(null);
  
  // Activity Feed State
  const [activityPage, setActivityPage] = useState(1);
  const ACTIVITIES_PER_PAGE = 5;

  // Close menu on click outside
  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Helper for initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper for relative time
  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Sort: Active runs first
  const sortedWorkflows = [...workflows].sort((a, b) => {
    const aActive = !!a.activeRunId;
    const bActive = !!b.activeRunId;
    return aActive === bActive ? 0 : aActive ? -1 : 1;
  });

  // Aggregate and sort activities
  const allActivities = useMemo(() => {
    return runs.flatMap(run => {
      const wf = workflows.find(w => w.id === run.workflowId);
      return run.history.map(step => ({
        id: `${run.id}-${step.stepId}-${step.completedAt}`,
        workflowName: wf?.name || 'Deleted Workflow',
        stepName: step.stepName,
        user: step.completedBy,
        timestamp: step.completedAt,
        initials: getInitials(step.completedBy)
      }));
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [runs, workflows]);

  const totalPages = Math.ceil(allActivities.length / ACTIVITIES_PER_PAGE);
  const currentActivities = allActivities.slice((activityPage - 1) * ACTIVITIES_PER_PAGE, activityPage * ACTIVITIES_PER_PAGE);

  const activeRunsCount = runs.filter(r => r.status === 'In Progress').length;
  const completedRunsCount = runs.filter(r => r.status === 'Completed').length;

  const handleRunClick = (e: React.MouseEvent, wf: Workflow) => {
    e.stopPropagation();
    if (wf.activeRunId) {
      navigate(`/run/${wf.activeRunId}`);
    } else {
      const newRunId = onCreateRun(wf.id);
      navigate(`/run/${newRunId}`);
    }
  };

  const handleCardClick = (wfId: string) => {
    navigate(`/workflows/${wfId}`);
  };

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteWorkflow(id);
    setActiveMenuId(null);
  };
  
  const handleChatClick = (e: React.MouseEvent, runId: string) => {
    e.stopPropagation();
    setActiveChatRunId(runId);
  }

  // Helper to get unique KPI tags
  const getWorkflowKPISummary = (wf: Workflow) => {
    const tags = new Set<string>();
    wf.sections.forEach(s => s.steps.forEach(st => {
      if (st.kpiTags) st.kpiTags.forEach(t => tags.add(t));
    }));
    return Array.from(tags).slice(0, 2); // Return top 2
  };

  // Mock logged-in user for validation
  const CURRENT_USER = "Alex Rivera";

  const activeChatRun = activeChatRunId ? runs.find(r => r.id === activeChatRunId) : null;
  const activeChatWorkflow = activeChatRun ? workflows.find(w => w.id === activeChatRun.workflowId) : null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Workflow Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg font-light">Where Your Process Playbook Meets Intelligent Orchestration.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-slate-50 text-slate-600"><Layers className="w-8 h-8" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Workflows</p>
              <p className="text-xl font-bold text-slate-900">{workflows.length}</p>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600"><Activity className="w-8 h-8" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Runs</p>
              <p className="text-xl font-bold text-indigo-600">{activeRunsCount}</p>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600"><Calendar className="w-8 h-8" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed (M)</p>
              <p className="text-xl font-bold text-emerald-600">{completedRunsCount}</p>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600"><User className="w-8 h-8" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Tasks</p>
              <p className="text-xl font-bold text-amber-600">3</p>
            </div>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Column: Workflows Grid */}
        <div className="flex-1 w-full">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> My Workflows
             </h2>
           </div>
           
           <div className={`grid gap-6 ${layoutMode === 'modern' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
            {sortedWorkflows.map((wf) => {
              const isActive = !!wf.activeRunId;
              const activeRun = runs.find(r => r.id === wf.activeRunId);
              const kpiTags = getWorkflowKPISummary(wf);
              
              // Get current step details if active
              const currentStep = activeRun ? wf.sections[activeRun.currentSectionIndex]?.steps[activeRun.currentStepIndex] : null;
              const isAssignedToUser = currentStep ? currentStep.owners.includes(CURRENT_USER) : true;

              let progress = 0;
              if(activeRun) {
                  progress = Math.round((activeRun.completedSteps / activeRun.totalSteps) * 100);
                  // Mock fix for demo data consistency
                  if (wf.name === "Month End Close" && progress < 60 && progress > 30) progress = 54; 
                  if (wf.name === "Weekly Sales Pipeline Review") progress = 47;
              }

              const activeRunComments = activeRun?.comments || [];
              const timeSpentDisplay = activeRun ? formatDuration((activeRun.totalDuration || 0) + (activeRun.timeSpentOnCurrentStep || 0)) : null;

              return (
                <div 
                  key={wf.id} 
                  onClick={() => handleCardClick(wf.id)}
                  className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl cursor-pointer ${isActive ? 'border-indigo-200 shadow-md' : 'border-slate-200 shadow-sm hover:border-indigo-100'}`}
                >
                  
                  {/* Header Status Strip */}
                  {isActive && <div className="absolute top-0 left-6 right-6 h-1 bg-indigo-500 rounded-b-lg shadow-sm z-10"></div>}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-500 border border-slate-100">
                          {wf.metadata.cadence}
                       </span>
                       {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> In Progress
                          </span>
                       ) : (
                          <div className="relative">
                            <div 
                              onClick={(e) => handleMenuToggle(e, wf.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 cursor-pointer transition-colors"
                            >
                               <MoreHorizontal className="w-5 h-5" />
                            </div>
                            
                            {activeMenuId === wf.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                 <button 
                                   onClick={(e) => handleDeleteClick(e, wf.id)}
                                   className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                 >
                                   <Trash2 className="w-4 h-4" /> Delete
                                 </button>
                              </div>
                            )}
                          </div>
                       )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{wf.name}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{wf.metadata.category}</p>
                    
                    {/* Smart Truncated Description */}
                    <WorkflowDescription text={wf.metadata.objective} />

                    {/* Progress Section */}
                    {isActive && activeRun && (
                       <div className="mb-5 bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
                          <div className="flex justify-between text-xs font-semibold text-indigo-900 mb-1.5">
                            <div className="flex items-center gap-2">
                               <span>Progress</span>
                               {timeSpentDisplay && (
                                <span className="flex items-center gap-1 font-normal opacity-70">
                                    <Timer className="w-3 h-3" /> {timeSpentDisplay}
                                </span>
                               )}
                            </div>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-white rounded-full h-1.5 border border-indigo-100/50 overflow-hidden">
                            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                          </div>
                       </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                             {getInitials(wf.metadata.owner)}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-0.5">Owner</span>
                              <span className="text-xs font-semibold text-slate-700 leading-none truncate max-w-[120px]">{wf.metadata.owner}</span>
                           </div>
                        </div>

                        {/* KPI Badges */}
                        <div className="flex -space-x-2">
                           {kpiTags.length > 0 ? kpiTags.map((tag, i) => (
                              <div key={i} title={tag} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-help">
                                 <BarChart2 className="w-3.5 h-3.5" />
                              </div>
                           )) : <span className="text-[10px] text-slate-300 italic">No KPIs</span>}
                        </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex gap-3">
                     {isActive && !isAssignedToUser ? (
                        <div className="flex-1 relative group">
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            >
                               <Clock className="w-4 h-4" />
                               In Progress
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-[200px] bg-slate-800 text-white text-xs font-medium rounded py-1.5 px-3 z-50 shadow-xl">
                                Action pending on {currentStep?.owners.join(', ') || 'another user'}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                        </div>
                     ) : (
                        <button 
                            onClick={(e) => handleRunClick(e, wf)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                              isActive 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200' 
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                            }`}
                        >
                            {isActive ? <Play className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />}
                            {isActive ? 'Execute Step' : 'Run Workflow'}
                        </button>
                     )}
                     
                     {isActive && activeRun && (
                        <button 
                            onClick={(e) => handleChatClick(e, activeRun.id)}
                            className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 rounded-lg transition-all shadow-sm relative" 
                            title="Active Collaboration"
                        >
                            <MessageSquare className="w-5 h-5" />
                            {activeRunComments.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>
                            )}
                        </button>
                     )}

                     <div onClick={(e) => e.stopPropagation()}>
                        <Link to={`/history?workflowId=${wf.id}`} className="block p-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 rounded-lg transition-all shadow-sm" title="View History">
                            <History className="w-5 h-5" />
                        </Link>
                     </div>
                  </div>
                </div>
              );
            })}

            {/* Create Workflow Shortcut */}
            <Link to="/workflows/create" className="group flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer min-h-[350px]">
               <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 group-hover:shadow-md transition-all mb-4">
                 <Plus className="w-8 h-8" />
               </div>
               <span className="text-lg font-bold text-slate-600 group-hover:text-indigo-700">Create Workflow</span>
               <span className="text-sm text-slate-400 mt-1">Define a new process</span>
            </Link>
           </div>
        </div>

        {/* Right Column: Activity Feed (Only in Modern Mode) */}
        {layoutMode === 'modern' && (
           <div className="w-full xl:w-[400px] shrink-0">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-indigo-600" /> Activity Feed
                </h2>
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-2 flex-1">
                   {currentActivities.length > 0 ? (
                     <div className="divide-y divide-slate-100">
                        {currentActivities.map((activity) => (
                           <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3 group">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                 <span className="text-xs font-bold text-indigo-600">{activity.initials}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-sm text-slate-800 leading-tight">
                                    <span className="font-semibold">{activity.user}</span> completed step
                                 </p>
                                 <p className="text-sm font-bold text-indigo-600 truncate mt-0.5">{activity.stepName}</p>
                                 <p className="text-xs text-slate-400 mt-1 truncate italic">{activity.workflowName}</p>
                              </div>
                              <div className="shrink-0 flex flex-col items-end justify-start">
                                 <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                                   {getRelativeTime(activity.timestamp)}
                                 </span>
                                 <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                   ) : (
                     <div className="p-8 text-center text-slate-400 text-sm italic">
                        No recent activity found.
                     </div>
                   )}
                </div>
                
                {/* Pagination Footer */}
                {totalPages > 1 && (
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                     <button 
                       onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                       disabled={activityPage === 1}
                       className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-all"
                     >
                       <ChevronLeft className="w-4 h-4" />
                     </button>
                     <span className="text-xs font-bold text-slate-500">Page {activityPage} of {totalPages}</span>
                     <button 
                       onClick={() => setActivityPage(p => Math.min(totalPages, p + 1))}
                       disabled={activityPage === totalPages}
                       className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-all"
                     >
                       <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                )}
             </div>
           </div>
        )}
      </div>

      {/* Chat Drawer */}
      {activeChatRun && activeChatWorkflow && (
        <ChatPanel 
          isOpen={!!activeChatRunId}
          onClose={() => setActiveChatRunId(null)}
          workflowName={activeChatWorkflow.name}
          comments={activeChatRun.comments || []}
          onAddComment={(text) => onAddComment(activeChatRun.id, text)}
          currentUser={CURRENT_USER}
        />
      )}
    </div>
  );
};
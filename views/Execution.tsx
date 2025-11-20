

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, Info, FileText, CheckSquare, ArrowLeft, ExternalLink, Tag, Filter, RotateCcw, Lock, UserCheck, MessageSquare, Flag } from 'lucide-react';
import { Workflow, Run, Step } from '../types';
import { BiIcon } from '../components/BiIcon';
import { ChatPanel } from '../components/ChatPanel';

interface ExecutionProps {
  workflows: Workflow[];
  runs: Run[];
  onUpdateRun: (run: Run) => void;
  onAddComment: (runId: string, text: string) => void;
}

export const Execution: React.FC<ExecutionProps> = ({ workflows, runs, onUpdateRun, onAddComment }) => {
  const { runId } = useParams();
  const navigate = useNavigate();
  
  const run = runs.find(r => r.id === runId);
  const workflow = workflows.find(w => w.id === run?.workflowId);

  // Local State
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Navigation State
  const [viewingStepCoords, setViewingStepCoords] = useState<{sectionIndex: number, stepIndex: number} | null>(null);

  // Derived state
  const activeSectionIndex = run?.currentSectionIndex ?? 0;
  const activeStepIndex = run?.currentStepIndex ?? 0;

  const currentSectionIndex = viewingStepCoords ? viewingStepCoords.sectionIndex : activeSectionIndex;
  const currentStepIndex = viewingStepCoords ? viewingStepCoords.stepIndex : activeStepIndex;
  
  const currentSection = workflow?.sections[currentSectionIndex];
  const currentStep = currentSection?.steps[currentStepIndex];
  
  const isHistoryView = viewingStepCoords !== null;
  const historyEntry = isHistoryView && run && currentStep 
    ? run.history.find(h => h.stepId === currentStep.id) 
    : null;

  // Current User Mock
  const CURRENT_USER = "Alex Rivera";

  useEffect(() => {
    if (currentStep && !isHistoryView) {
      setNotes('');
      const initialChecklist: Record<string, boolean> = {};
      currentStep.checklist.forEach(item => {
        initialChecklist[item.id] = item.checked;
      });
      setChecklistState(initialChecklist);
    }
  }, [currentStep?.id, isHistoryView]);

  if (!run || !workflow || !currentStep) {
    return <div className="p-8 text-center">Run not found or invalid state. <button onClick={() => navigate('/')} className="text-indigo-600 underline">Go Home</button></div>;
  }

  const allStepsCount = workflow.sections.reduce((acc, sec) => acc + sec.steps.length, 0);
  const currentGlobalStep = workflow.sections.slice(0, activeSectionIndex).reduce((acc, sec) => acc + sec.steps.length, 0) + activeStepIndex + 1;
  const progressPercent = Math.round(((currentGlobalStep - 1) / allStepsCount) * 100);
  const isLastStep = currentGlobalStep === allStepsCount;

  const isChecklistComplete = currentStep.checklist.every(item => checklistState[item.id]);
  const isNotesComplete = !currentStep.requiresNotes || notes.trim().length > 0;
  const canComplete = isChecklistComplete && isNotesComplete;

  const handleCompleteStep = () => {
    if (!canComplete || isHistoryView) return;

    const nextStepIndex = activeStepIndex + 1;
    let nextSectionIndex = activeSectionIndex;
    let isRunComplete = false;

    if (nextStepIndex >= currentSection!.steps.length) {
      nextSectionIndex++;
      if (nextSectionIndex >= workflow.sections.length) {
        isRunComplete = true;
      }
    }

    const updatedRun: Run = {
      ...run,
      completedSteps: run.completedSteps + 1,
      currentSectionIndex: isRunComplete ? activeSectionIndex : nextSectionIndex, 
      currentStepIndex: isRunComplete ? activeStepIndex : (nextStepIndex >= currentSection!.steps.length ? 0 : nextStepIndex),
      status: isRunComplete ? 'Completed' : 'In Progress',
      endTime: isRunComplete ? new Date().toISOString() : undefined,
      outcome: isLastStep && outcome.trim() ? outcome : undefined, // Save outcome if last step
      history: [
        ...run.history,
        {
          stepId: currentStep.id,
          stepName: currentStep.name,
          sectionTitle: currentSection!.title,
          completedAt: new Date().toISOString(),
          completedBy: CURRENT_USER, 
          notes: notes,
          checklistState: currentStep.checklist.map(c => ({ ...c, checked: checklistState[c.id] })),
          filterValuesUsed: [...currentStep.filterPresets],
          reportsSnapshot: [...currentStep.reports]
        }
      ]
    };

    onUpdateRun(updatedRun);
    
    if (isRunComplete) {
      navigate('/'); 
    }
  };

  const handleStepNavigation = (sIdx: number, stIdx: number) => {
    const isFuture = sIdx > activeSectionIndex || (sIdx === activeSectionIndex && stIdx > activeStepIndex);
    if (isFuture) return;

    const isActive = sIdx === activeSectionIndex && stIdx === activeStepIndex;
    setViewingStepCoords(isActive ? null : { sectionIndex: sIdx, stepIndex: stIdx });
  };

  const stepOwners = currentStep.owners;
  const completedBy = historyEntry?.completedBy;
  // Check if completer was one of the owners
  const isCompletedByOwner = completedBy && stepOwners.includes(completedBy);

  return (
    <div className="flex h-full -m-8">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100">
          <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-indigo-600 text-sm mb-4 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">{workflow.name}</h2>
          <div className="mt-6">
             <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">
               <span>Workflow Progress</span>
               <span>{progressPercent}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {workflow.sections.map((section, sIdx) => (
            <div key={section.id}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.steps.map((step, stepIdx) => {
                  const isCompleted = sIdx < activeSectionIndex || (sIdx === activeSectionIndex && stepIdx < activeStepIndex);
                  const isActiveExec = sIdx === activeSectionIndex && stepIdx === activeStepIndex;
                  const isFuture = !isCompleted && !isActiveExec;
                  
                  const isViewing = sIdx === currentSectionIndex && stepIdx === currentStepIndex;

                  return (
                    <div 
                      key={step.id}
                      onClick={() => handleStepNavigation(sIdx, stepIdx)}
                      className={`relative flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                        isViewing ? 'bg-indigo-50 ring-1 ring-indigo-200 shadow-sm' : 'hover:bg-slate-50'
                      } ${isFuture ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : isActiveExec ? (
                          <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.3)]">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className={`text-sm font-medium leading-tight ${isViewing ? 'text-indigo-900' : 'text-slate-700'}`}>
                           {step.name}
                         </p>
                         <div className="flex gap-1 mt-2 opacity-70">
                            {step.reports.map((r,i) => <BiIcon key={i} tool={r.tool} size={14} />)}
                         </div>
                         {isActiveExec && !isViewing && (
                           <span className="inline-block mt-2 text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-sm">
                             Current Task
                           </span>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-slate-50/50 overflow-y-auto p-8 flex flex-col items-center relative">
        {isHistoryView && (
           <div className="absolute top-0 left-0 w-full bg-slate-800 text-white px-6 py-3 shadow-md flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                 <Lock className="w-4 h-4 text-slate-400" />
                 <span className="text-sm font-medium">Viewing history (Read Only)</span>
              </div>
              <button 
                onClick={() => setViewingStepCoords(null)}
                className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded font-bold hover:bg-slate-100 flex items-center gap-1 shadow-sm"
              >
                 <RotateCcw className="w-3 h-3" />
                 Return to Active Step
              </button>
           </div>
        )}

        <div className={`w-full max-w-4xl space-y-6 pb-10 ${isHistoryView ? 'mt-12' : ''}`}>
          
          {/* Header Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
             {isHistoryView && <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 transform rotate-45 translate-x-12 -translate-y-12 border border-slate-100"></div>}
             
             {/* Chat Button Overlay */}
             <div className="absolute top-8 right-8 z-20">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-bold border border-indigo-100 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                  {run.comments && run.comments.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                      {run.comments.length}
                    </span>
                  )}
                </button>
             </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                 <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">{currentSection.title}</span>
                 <h1 className="text-3xl font-bold text-slate-900 mt-3 tracking-tight">{currentStep.name}</h1>
              </div>
            </div>
            
            {/* Owners Display */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border ${isHistoryView ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                  <UserCheck className="w-3 h-3" />
                  <span>Owners: <span className="font-bold">{stepOwners.join(', ')}</span></span>
                  {isHistoryView && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />
                  )}
              </div>
              {isHistoryView && !isCompletedByOwner && completedBy && (
                  <span className="text-[10px] text-slate-400 italic pr-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">Completed by: {completedBy}</span>
              )}
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 flex items-start gap-4">
               <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                 <Info className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-bold text-indigo-900 mb-1">Guidance</h4>
                 <p className="text-sm text-indigo-800/80 leading-relaxed">{currentStep.guidance}</p>
                 {currentStep.kpiTags && currentStep.kpiTags.length > 0 && (
                   <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-indigo-200/30">
                      <span className="text-xs font-bold text-indigo-900/50 uppercase tracking-wider mr-1">Impacts:</span>
                      {currentStep.kpiTags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100 shadow-sm">
                          <Tag className="w-3 h-3 text-indigo-400" /> {tag}
                        </span>
                      ))}
                   </div>
                 )}
               </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4 overflow-x-auto pb-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                   <Filter className="w-3 h-3" />
                   Required Filters
                </div>
                <div className="h-4 w-px bg-slate-200 shrink-0"></div>
                {currentStep.filterPresets.length > 0 ? (
                  <div className="flex gap-2">
                    {currentStep.filterPresets.map((fp, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{fp.key}</span>
                         <span className="text-xs font-bold text-slate-700">{fp.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No preset filters</span>
                )}
            </div>
          </div>

          {/* Report Gallery */}
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1 mt-8 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Linked Reports ({currentStep.reports.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {currentStep.reports.map((report) => (
               <div key={report.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                  <div className="h-40 bg-slate-100 flex items-center justify-center relative bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-opacity group-hover:opacity-70" />
                     
                     <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-110">
                        <div className="bg-white p-3 rounded-xl shadow-lg">
                          <BiIcon tool={report.tool} size={32} />
                        </div>
                     </div>

                     <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="px-6 py-2.5 bg-white text-slate-900 rounded-lg font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600">
                          <ExternalLink className="w-4 h-4" /> Launch {report.tool}
                        </button>
                     </div>
                  </div>
                  <div className="p-4 border-t border-slate-100">
                       <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors" title={report.name}>{report.name}</h4>
                       <p className="text-xs text-slate-400 mt-1 font-mono">ID: {report.id}</p>
                  </div>
               </div>
             ))}
          </div>

          {/* Action Area */}
          <div className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-sm ${isHistoryView ? 'opacity-90 bg-slate-50/50' : ''}`}>
             <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
               <CheckSquare className="w-5 h-5 text-indigo-600" />
               {isHistoryView ? 'Execution Record' : 'Completion Requirements'}
             </h3>
             
             <div className="space-y-3 mb-8">
               {currentStep.checklist.map(item => {
                 const isChecked = isHistoryView 
                    ? historyEntry?.checklistState.find(c => c.id === item.id)?.checked 
                    : checklistState[item.id];

                 return (
                   <label key={item.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${isHistoryView ? 'bg-white border-slate-200 cursor-default' : 'border-slate-100 hover:bg-slate-50 hover:border-indigo-200 cursor-pointer group'}`}>
                      <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}>
                         {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                         <input 
                           type="checkbox" 
                           className="hidden" 
                           disabled={isHistoryView}
                           checked={isChecked || false}
                           onChange={() => !isHistoryView && setChecklistState(prev => ({...prev, [item.id]: !prev[item.id]}))}
                         />
                      </div>
                      <div>
                        <span className={`text-sm ${isChecked ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{item.label}</span>
                      </div>
                   </label>
                 );
               })}
               {currentStep.checklist.length === 0 && (
                 <p className="text-sm text-slate-400 italic pl-1">No specific checklist items.</p>
               )}
             </div>

             <div className="mb-8">
               <label className="block text-sm font-bold text-slate-700 mb-3">
                 Notes / Findings {currentStep.requiresNotes && !isHistoryView && <span className="text-rose-500">*</span>}
               </label>
               {isHistoryView ? (
                 <div className="w-full p-5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-slate-800 italic relative">
                    <span className="absolute top-3 left-3 text-amber-200 text-4xl opacity-50 select-none">"</span>
                    <p className="relative z-10 pl-6">{historyEntry?.notes || "No notes recorded."}</p>
                 </div>
               ) : (
                 <>
                   <textarea 
                     className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[100px] resize-y bg-slate-50 focus:bg-white"
                     placeholder="Enter your analysis findings or confirmation..."
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                   />
                   {currentStep.requiresNotes && notes.trim().length === 0 && (
                     <div className="flex items-center gap-1 text-xs text-amber-600 mt-2 font-medium animate-pulse">
                       <Info className="w-3 h-3" /> Notes are required to complete this step.
                     </div>
                   )}
                 </>
               )}
             </div>

             {/* Outcome Placeholder (Only on last step and not in history view) */}
             {isLastStep && !isHistoryView && (
                <div className="mb-8 pt-6 border-t border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-indigo-600" />
                        Final Outcome / Decision
                    </label>
                    <textarea 
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[80px] resize-y bg-slate-50 focus:bg-white"
                        placeholder="Record the outcome of the current workflow execution with business decision if taken"
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                    />
                </div>
             )}

             <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                {isHistoryView ? (
                   <div className="w-full flex items-center justify-between">
                      <span className="text-sm text-slate-500 font-medium">Completed on {historyEntry ? new Date(historyEntry.completedAt).toLocaleString() : 'Unknown'}</span>
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </span>
                   </div>
                ) : (
                  <>
                    <div className="text-xs text-slate-500 max-w-xs">
                      {!canComplete && "Complete all checklist items and required notes to proceed."}
                    </div>
                    <button 
                      onClick={handleCompleteStep}
                      disabled={!canComplete}
                      className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all ${
                        canComplete 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:scale-[1.02]' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>{isLastStep ? 'Finish Workflow' : 'Mark Step Complete'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* Collaboration Panel */}
      <ChatPanel 
         isOpen={isChatOpen} 
         onClose={() => setIsChatOpen(false)}
         workflowName={workflow.name}
         comments={run.comments || []}
         onAddComment={(text) => onAddComment(run.id, text)}
         currentUser={CURRENT_USER}
      />
    </div>
  );
};
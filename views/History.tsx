
import React, { useState, useEffect } from 'react';
import { Run, Workflow, StepResult } from '../types';
import { CheckCircle2, AlertOctagon, Search, Filter, Eye, Download, ArrowLeft, Calendar, User, ListFilter, CheckSquare, MessageSquareQuote, Flag, MessageSquare } from 'lucide-react';
import { BiIcon } from '../components/BiIcon';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChatPanel } from '../components/ChatPanel';

interface HistoryProps {
  workflows: Workflow[];
  runs: Run[];
}

export const History: React.FC<HistoryProps> = ({ workflows, runs }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const initialWfId = searchParams.get('workflowId');

  // Consistent user identity for chat alignment
  const CURRENT_USER = "Alex Rivera";

  useEffect(() => {
    if (initialWfId) {
      const wf = workflows.find(w => w.id === initialWfId);
      if (wf) setSearchTerm(wf.name);
    }
  }, [initialWfId, workflows]);

  const getWfName = (id: string) => workflows.find(w => w.id === id)?.name || 'Unknown Workflow';

  // If a run is selected, show the Detail/Audit View
  if (selectedRun) {
    const wf = workflows.find(w => w.id === selectedRun.workflowId);
    const startDate = new Date(selectedRun.startTime);
    const endDate = selectedRun.endTime ? new Date(selectedRun.endTime) : null;
    
    return (
      <div className="space-y-6 relative">
        <div className="flex items-center justify-between">
            <button 
            onClick={() => { setSelectedRun(null); setIsChatOpen(false); }}
            className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium mb-4"
            >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to History Log
            </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-2xl font-bold text-slate-900">{wf?.name}</h1>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    selectedRun.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                    {selectedRun.status}
                 </span>
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-4">
                 <span className="flex items-center gap-1"><User className="w-4 h-4" /> Executed by: {selectedRun.executedBy}</span>
                 <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Run ID: {selectedRun.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-bold border border-indigo-100 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat History
                  {selectedRun.comments && selectedRun.comments.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                      {selectedRun.comments.length}
                    </span>
                  )}
                </button>
                <button 
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                title="This is the complete audit trail for this workflow execution."
                >
                <Download className="w-4 h-4" /> Export PDF
                </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-100">
             <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Start Time</p>
                <p className="text-slate-900 font-medium">{startDate.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">End Time</p>
                <p className="text-slate-900 font-medium">{endDate ? endDate.toLocaleString() : '-'}</p>
             </div>
             <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Duration</p>
                <p className="text-slate-900 font-medium">
                  {endDate ? Math.round((endDate.getTime() - startDate.getTime()) / 60000) + ' min' : 'In Progress'}
                </p>
             </div>
             <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Completion</p>
                <p className="text-slate-900 font-medium">{selectedRun.completedSteps} / {selectedRun.totalSteps} Steps</p>
             </div>
          </div>
        </div>
        
        {/* Outcome Display Card */}
        {selectedRun.outcome && (
          <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
             <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm">
                  <Flag className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Final Outcome & Decision</h3>
             </div>
             <div className="pl-1">
               <p className="text-slate-700 text-base leading-relaxed">{selectedRun.outcome}</p>
             </div>
          </div>
        )}

        {/* Audit Trail Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <ListFilter className="w-5 h-5 text-slate-500" />
               Execution Audit Trail
             </h3>
          </div>
          <div className="divide-y divide-slate-100">
             {selectedRun.history.length === 0 ? (
               <div className="p-8 text-center text-slate-400 italic">No steps completed yet.</div>
             ) : (
               selectedRun.history.map((step: StepResult, idx) => (
                 <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">{step.sectionTitle}</span>
                          <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                             {step.stepName}
                             <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </h4>
                       </div>
                       <div className="text-right text-sm text-slate-500">
                          <p>{new Date(step.completedAt).toLocaleString()}</p>
                          <p className="text-xs">by {step.completedBy}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Left: Data & Reports */}
                       <div className="space-y-4">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                             <p className="text-xs font-semibold text-slate-500 mb-2">REPORTS ACCESSED</p>
                             <div className="space-y-2">
                                {step.reportsSnapshot.map((rep, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-slate-100">
                                     <BiIcon tool={rep.tool} size={16} />
                                     <span>{rep.name}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                          
                          {step.filterValuesUsed.length > 0 && (
                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                               <p className="text-xs font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                                 <Filter className="w-3 h-3" />
                                 FILTERS APPLIED
                               </p>
                               <div className="flex flex-wrap gap-2">
                                  {step.filterValuesUsed.map((f, i) => (
                                    <span key={i} className="px-2 py-1 bg-white text-indigo-600 text-xs rounded border border-indigo-200 font-medium">
                                       {f.key}: {f.value}
                                    </span>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>

                       {/* Right: User Input */}
                       <div className="space-y-4">
                          {step.checklistState.length > 0 && (
                             <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">CHECKLIST</p>
                                <ul className="space-y-1">
                                   {step.checklistState.map(item => (
                                      <li key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
                                         {item.checked ? <CheckSquare className="w-4 h-4 text-green-600" /> : <AlertOctagon className="w-4 h-4 text-slate-300" />}
                                         <span className={item.checked ? '' : 'text-slate-400'}>{item.label}</span>
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          )}
                          
                          {step.notes && (
                             <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                                  <MessageSquareQuote className="w-3 h-3" />
                                  USER COMMENTS
                                </p>
                                <div className="p-4 bg-yellow-50 border border-yellow-200 text-slate-800 text-sm rounded-lg shadow-sm relative">
                                   <div className="absolute -left-1.5 top-4 w-3 h-3 bg-yellow-50 border-l border-b border-yellow-200 transform rotate-45"></div>
                                   {step.notes}
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))
             )}

             {/* Visual End Marker */}
             {selectedRun.status === 'Completed' && (
                 <div className="p-6 bg-slate-50/30">
                    <div className="flex justify-between items-center opacity-60">
                       <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Workflow End</span>
                          <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                             Process Completed
                             <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
                             </div>
                          </h4>
                       </div>
                       <div className="text-right text-sm text-slate-400 font-medium">
                          <p>{selectedRun.endTime ? new Date(selectedRun.endTime).toLocaleString() : ''}</p>
                       </div>
                    </div>
                 </div>
             )}
          </div>
        </div>

        {/* Chat Drawer */}
        <ChatPanel 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          workflowName={wf?.name || ''}
          comments={selectedRun.comments || []}
          onAddComment={() => {}} // Read only in history
          currentUser={CURRENT_USER}
        />
      </div>
    );
  }

  // --- Main List View ---

  const completedRuns = runs.filter(r => r.status !== 'In Progress');

  // Filter logic
  const filteredRuns = completedRuns.filter(r => {
    const wfName = getWfName(r.workflowId).toLowerCase();
    const matchesSearch = wfName.includes(searchTerm.toLowerCase()) || r.executedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Run History & Audit Trail</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by workflow name or user..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="relative">
           <button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300"
           >
              <Filter className="w-4 h-4" /> 
              {statusFilter === 'All' ? 'Filter by Status' : statusFilter}
           </button>
           {isFilterOpen && (
             <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {['All', 'Completed', 'Aborted'].map(status => (
                   <button 
                     key={status}
                     className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === status ? 'font-bold text-indigo-600' : 'text-slate-700'}`}
                     onClick={() => {
                       setStatusFilter(status);
                       setIsFilterOpen(false);
                     }}
                   >
                     {status}
                   </button>
                ))}
             </div>
           )}
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Run ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Executed By</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {filteredRuns.map((run) => {
                  const startDate = new Date(run.startTime);
                  const endDate = run.endTime ? new Date(run.endTime) : new Date();
                  const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

                  return (
                    <tr key={run.id} className="hover:bg-slate-50 transition-colors group">
                       <td className="px-6 py-4 text-sm font-mono text-slate-500">{run.id}</td>
                       <td className="px-6 py-4 text-sm font-medium text-slate-900">{getWfName(run.workflowId)}</td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            run.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                             {run.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                             {run.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {run.executedBy.charAt(0)}
                             </div>
                             {run.executedBy}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600 max-w-[250px] truncate" title={run.outcome || 'No outcome recorded'}>
                          {run.outcome ? (
                             <span className="text-slate-700">{run.outcome}</span>
                          ) : (
                             <span className="text-slate-400 italic">-</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">{startDate.toLocaleDateString()} <span className="text-slate-400 text-xs">{startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></td>
                       <td className="px-6 py-4 text-sm text-slate-600">{durationMinutes} min</td>
                       <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedRun(run)}
                            className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ml-auto" 
                            title="View Audit Details"
                          >
                             <Eye className="w-4 h-4" /> View Details
                          </button>
                       </td>
                    </tr>
                  )
               })}
               {filteredRuns.length === 0 && (
                 <tr>
                   <td colSpan={8} className="px-6 py-8 text-center text-slate-400 italic">No history found matching your criteria.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

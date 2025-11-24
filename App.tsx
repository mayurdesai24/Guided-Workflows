

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Execution } from './views/Execution';
import { WorkflowEditor } from './views/WorkflowEditor';
import { History } from './views/History';
import { INITIAL_WORKFLOWS, INITIAL_RUNS } from './constants';
import { Workflow, Run, Comment } from './types';

const App: React.FC = () => {
  // In a real app, this would be in a Context or Redux store
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [runs, setRuns] = useState<Run[]>(INITIAL_RUNS);
  const [layoutMode, setLayoutMode] = useState<'modern' | 'classic'>('modern');

  const handleCreateRun = (workflowId: string) => {
    const wf = workflows.find(w => w.id === workflowId);
    if (!wf) return '';

    // Generate a mock run
    const newRunId = `run-${Date.now()}`;
    const newRun: Run = {
      id: newRunId,
      workflowId: workflowId,
      status: 'In Progress',
      executedBy: 'Current User',
      startTime: new Date().toISOString(),
      currentSectionIndex: 0,
      currentStepIndex: 0,
      completedSteps: 0,
      totalSteps: wf.sections.reduce((acc, s) => acc + s.steps.length, 0),
      history: [],
      comments: [],
      totalDuration: 0,
      timeSpentOnCurrentStep: 0
    };

    setRuns([newRun, ...runs]);
    
    // Update workflow state to reflect active run
    setWorkflows(workflows.map(w => 
      w.id === workflowId ? { ...w, activeRunId: newRunId, status: 'In Progress' } : w
    ));

    return newRunId;
  };

  const handleUpdateRun = (updatedRun: Run) => {
    setRuns(runs.map(r => r.id === updatedRun.id ? updatedRun : r));
    
    // If completed, update workflow status
    if (updatedRun.status === 'Completed') {
      setWorkflows(workflows.map(w => 
        w.id === updatedRun.workflowId 
        ? { ...w, activeRunId: undefined, status: 'Completed', lastRunDate: 'Just now' } 
        : w
      ));
    } else {
      // Ensure progress is reflected if we wanted to show % on dashboard from run data
      // (Already handled by Home reading the run directly)
    }
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    setWorkflows(prev => {
      const exists = prev.find(w => w.id === workflow.id);
      if (exists) {
        return prev.map(w => w.id === workflow.id ? workflow : w);
      }
      return [...prev, workflow];
    });
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  const handleAddComment = (runId: string, text: string) => {
    setRuns(prev => prev.map(r => {
      if (r.id === runId) {
        const newComment: Comment = {
          id: `c-${Date.now()}`,
          userId: 'current-user',
          userName: 'Alex Rivera', // Mocked current user
          text,
          timestamp: new Date().toISOString()
        };
        return { ...r, comments: [...(r.comments || []), newComment] };
      }
      return r;
    }));
  };

  return (
    <Router>
      <Layout layoutMode={layoutMode} onToggleLayout={() => setLayoutMode(prev => prev === 'modern' ? 'classic' : 'modern')}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                workflows={workflows} 
                runs={runs} 
                onCreateRun={handleCreateRun} 
                onDeleteWorkflow={handleDeleteWorkflow} 
                layoutMode={layoutMode} 
                onAddComment={handleAddComment}
              />
            } 
          />
          <Route 
            path="/run/:runId" 
            element={
              <Execution 
                workflows={workflows} 
                runs={runs} 
                onUpdateRun={handleUpdateRun} 
                onAddComment={handleAddComment}
              />
            } 
          />
          <Route path="/workflows/create" element={<WorkflowEditor workflows={workflows} onSave={handleSaveWorkflow} />} />
          <Route path="/workflows/:workflowId" element={<WorkflowEditor workflows={workflows} onSave={handleSaveWorkflow} />} />
          <Route path="/history" element={<History workflows={workflows} runs={runs} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
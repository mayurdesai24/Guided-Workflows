
import React, { useState, useEffect, useRef } from 'react';
import { Plus, GripVertical, Trash2, Save, Info, Layers, FileText, ChevronDown, ChevronRight, ArrowLeft, Edit2, Check, Sparkles, Wand2, Loader2, Bot, Search, X } from 'lucide-react';
import { BITool, Workflow, Section, Step, FilterPreset, Report } from '../types';
import { BiIcon } from '../components/BiIcon';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

// --- Mock Report Library ---
const MOCK_REPORT_LIBRARY: Omit<Report, 'id'>[] = [
  { name: 'Global Sales Overview', tool: 'Tableau' },
  { name: 'Monthly Financial Statement', tool: 'PowerBI' },
  { name: 'Supply Chain Logistics', tool: 'Qlik' },
  { name: 'Executive Dashboard', tool: 'External' },
  { name: 'Marketing Campaign Performance', tool: 'Tableau' },
  { name: 'HR Headcount & Attrition', tool: 'PowerBI' },
  { name: 'Customer Churn Analysis', tool: 'Qlik' },
  { name: 'IT Infrastructure Health', tool: 'External' },
  { name: 'Regional Revenue Forecast', tool: 'Tableau' },
  { name: 'OpEx vs CapEx Summary', tool: 'PowerBI' },
  { name: 'Inventory Turnover Rates', tool: 'Qlik' },
  { name: 'Vendor Scorecard', tool: 'External' },
  { name: 'Daily Active Users (DAU)', tool: 'Tableau' },
  { name: 'Social Media Engagement', tool: 'PowerBI' },
  { name: 'Call Center Metrics', tool: 'Qlik' },
  { name: 'Regulatory Compliance Audit', tool: 'External' },
  { name: 'Product Margin Analysis', tool: 'Tableau' },
  { name: 'Cash Flow Projection', tool: 'PowerBI' },
  { name: 'Procurement Spend Analysis', tool: 'Qlik' },
  { name: 'Cloud Usage & Billing', tool: 'External' },
  { name: 'Sales Pipeline Velocity', tool: 'Tableau' },
  { name: 'Employee Satisfaction Survey', tool: 'PowerBI' },
  { name: 'Manufacturing Yield Rates', tool: 'Qlik' },
  { name: 'Data Governance Quality', tool: 'External' },
  { name: 'Website Traffic Heatmap', tool: 'Tableau' },
  { name: 'Quarterly Business Review', tool: 'PowerBI' },
  { name: 'Risk Management Heatmap', tool: 'Qlik' },
  { name: 'System Uptime Monitor', tool: 'External' },
  { name: 'E-commerce Conversion Funnel', tool: 'Tableau' },
  { name: 'Profit & Loss (P&L)', tool: 'PowerBI' },
  { name: 'Accounts Receivable Aging', tool: 'Qlik' },
  { name: 'Strategic Initiatives Tracker', tool: 'External' },
  { name: 'Retail Store Performance', tool: 'Tableau' },
  { name: 'Logistics Delivery Times', tool: 'PowerBI' },
  { name: 'Customer Support Tickets', tool: 'Qlik' },
  { name: 'Audit Trail Log', tool: 'External' },
  { name: 'Brand Sentiment Analysis', tool: 'Tableau' },
  { name: 'Training Completion Rates', tool: 'PowerBI' },
  { name: 'Warehouse Capacity', tool: 'Qlik' },
  { name: 'API Latency Dashboard', tool: 'External' },
  { name: 'Market Share Trends', tool: 'Tableau' },
  { name: 'Budget vs Actuals', tool: 'PowerBI' },
  { name: 'Lead Generation Source', tool: 'Qlik' },
  { name: 'Cybersecurity Threats', tool: 'External' },
  { name: 'Product Return Analysis', tool: 'Tableau' },
  { name: 'Energy Consumption', tool: 'PowerBI' },
  { name: 'Fleet Maintenance', tool: 'Qlik' },
  { name: 'Compliance Training Status', tool: 'External' },
  { name: 'Project Portfolio Status', tool: 'Tableau' },
  { name: 'Net Promoter Score (NPS)', tool: 'PowerBI' }
];

interface WorkflowEditorProps {
  workflows: Workflow[];
  onSave: (workflow: Workflow) => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflows, onSave }) => {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  
  // Mode State
  const [showModeSelection, setShowModeSelection] = useState(!workflowId);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Editor State
  const [workflowName, setWorkflowName] = useState('');
  const [owner, setOwner] = useState('');
  const [cadence, setCadence] = useState('Monthly');
  const [objective, setObjective] = useState('');
  const [category, setCategory] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  
  // UI State for renaming
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const sectionInputRef = useRef<HTMLInputElement>(null);

  // UI State for Report Selection
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [reportSearchTerm, setReportSearchTerm] = useState('');

  // Load existing workflow if editing
  useEffect(() => {
    if (workflowId) {
      const existingWf = workflows.find(w => w.id === workflowId);
      if (existingWf) {
        setWorkflowName(existingWf.name);
        setOwner(existingWf.metadata.owner);
        setCadence(existingWf.metadata.cadence);
        setObjective(existingWf.metadata.objective);
        setCategory(existingWf.metadata.category);
        
        // Add UI state for expanded sections
        const loadedSections = existingWf.sections.map(s => ({
            ...s,
            isExpanded: true
        }));
        setSections(loadedSections);
        
        if (loadedSections.length > 0 && loadedSections[0].steps.length > 0) {
          setActiveStepId(loadedSections[0].steps[0].id);
        }
        setShowModeSelection(false);
        setShowOnboarding(false);
      }
    } else {
        // If direct navigation to create without mode selection state (e.g. refresh), ensure mode selection is shown
        if (!showModeSelection && sections.length === 0) {
            setShowModeSelection(true);
        }
    }
  }, [workflowId, workflows]);

  // Focus input when editing section
  useEffect(() => {
    if (editingSectionId && sectionInputRef.current) {
      sectionInputRef.current.focus();
    }
  }, [editingSectionId]);

  // Reset report search when changing steps
  useEffect(() => {
    setIsAddingReport(false);
    setReportSearchTerm('');
  }, [activeStepId]);

  // AI Generation Logic
  const handleGenerateWorkflow = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setGenerationError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = ai.models;

      const prompt = `
        You are an expert enterprise process architect. Create a detailed workflow structure based on the user's request.
        
        User Request: "${aiPrompt}"

        Return STRICT JSON only. Do not include markdown formatting like \`\`\`json. 
        The JSON must match this schema:
        {
          "name": "string (Workflow Name)",
          "metadata": {
            "owner": "string (suggested owner role/name)",
            "cadence": "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Ad-hoc",
            "category": "string (e.g. Finance > Reporting)",
            "objective": "string (brief description)"
          },
          "sections": [
            {
              "title": "string (Phase Name)",
              "steps": [
                {
                  "name": "string (Actionable Step Name)",
                  "owners": ["string (Role or Name)"],
                  "guidance": "string (Detailed instructions for the user)",
                  "requiresNotes": boolean,
                  "kpiTags": ["string", "string"],
                  "checklist": [{"label": "string"}],
                  "filterPresets": [{"key": "string", "value": "string", "type": "Date / Period" | "Region / Entity" | "Scenario" | "Custom"}],
                  "reports": [{"name": "string (Report Name)", "tool": "Tableau" | "PowerBI" | "Qlik" | "External"}]
                }
              ]
            }
          ]
        }
      `;

      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
      });
      
      const text = response.text || "{}";
      const data = JSON.parse(text);

      // Map AI response to Internal State with generated IDs
      setWorkflowName(data.name || "Generated Workflow");
      setOwner(data.metadata?.owner || "Unassigned");
      setCadence(data.metadata?.cadence || "Monthly");
      setCategory(data.metadata?.category || "General");
      setObjective(data.metadata?.objective || "");

      const generatedSections = (data.sections || []).map((sec: any) => ({
        id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: sec.title || "New Section",
        isExpanded: true,
        steps: (sec.steps || []).map((step: any) => ({
          id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: step.name || "New Step",
          owners: step.owners || (step.owner ? [step.owner] : ["Unassigned"]),
          guidance: step.guidance || "",
          requiresNotes: step.requiresNotes ?? true,
          kpiTags: step.kpiTags || [],
          checklist: (step.checklist || []).map((cl: any) => ({
             id: `cl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
             label: cl.label,
             checked: false
          })),
          filterPresets: step.filterPresets || [],
          reports: (step.reports || []).map((rep: any) => ({
             id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
             name: rep.name,
             tool: rep.tool
          }))
        }))
      }));

      setSections(generatedSections);
      
      // Set active step to first one if exists
      if (generatedSections.length > 0 && generatedSections[0].steps.length > 0) {
          setActiveStepId(generatedSections[0].steps[0].id);
      }

      setShowModeSelection(false);
      setShowOnboarding(false); // Skip onboarding if AI generated

    } catch (err) {
      console.error("AI Generation Error:", err);
      setGenerationError("Failed to generate workflow. Please try again or use manual mode.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualStart = () => {
      // Initialize empty state for new workflow
      setWorkflowName('');
      setOwner('');
      setCadence('Monthly');
      setObjective('');
      setCategory('');
      setSections([
        {
          id: 'sec-1',
          title: 'Phase 1',
          isExpanded: true,
          steps: [
            {
              id: 'step-1',
              name: 'New Step',
              owners: [],
              reports: [],
              guidance: '',
              checklist: [],
              filterPresets: [],
              requiresNotes: true,
              kpiTags: []
            }
          ]
        }
      ]);
      setActiveStepId('step-1');
      setShowModeSelection(false);
      setShowOnboarding(true);
  };

  const handleSave = () => {
    if (!workflowName.trim()) {
      alert("Please provide a workflow name.");
      return;
    }
    
    const existingWorkflow = workflowId ? workflows.find(w => w.id === workflowId) : undefined;
    
    const newWorkflow: Workflow = {
      id: workflowId || `wf-${Date.now()}`,
      name: workflowName,
      // Preserve status/active run data if editing, else default to 'Not Started'
      status: existingWorkflow ? existingWorkflow.status : 'Not Started',
      activeRunId: existingWorkflow ? existingWorkflow.activeRunId : undefined,
      lastRunDate: existingWorkflow ? existingWorkflow.lastRunDate : undefined,
      metadata: {
        owner,
        cadence: cadence as any,
        category,
        objective
      },
      // Clean up UI-specific properties like 'isExpanded' before saving
      sections: sections.map(({ isExpanded, ...rest }) => ({
        ...rest,
        steps: rest.steps.map((step: any) => ({
           id: step.id,
           name: step.name,
           owners: step.owners,
           reports: step.reports,
           guidance: step.guidance,
           checklist: step.checklist,
           filterPresets: step.filterPresets,
           requiresNotes: step.requiresNotes,
           kpiTags: step.kpiTags
        }))
      }))
    };

    onSave(newWorkflow);
    navigate('/');
  };

  // Helpers to find and update the active step
  const getActiveStep = () => {
    for (const sec of sections) {
      const step = sec.steps.find((s: any) => s.id === activeStepId);
      if (step) return step;
    }
    return null;
  };

  const updateActiveStep = (updates: Partial<Step>) => {
    setSections(sections.map(sec => ({
      ...sec,
      steps: sec.steps.map((s: any) => s.id === activeStepId ? { ...s, ...updates } : s)
    })));
  };

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const finishSectionEdit = () => {
    setEditingSectionId(null);
  };

  const activeStep = getActiveStep();

  // Filter Preset Logic
  const addFilterPreset = () => {
    if (!activeStepId) return;
    const newFilter: FilterPreset = { key: '', value: '', type: 'Date / Period' };
    updateActiveStep({ filterPresets: [...activeStep.filterPresets, newFilter] });
  };

  const updateFilterPreset = (index: number, field: keyof FilterPreset, value: string) => {
    if (!activeStep) return;
    const newFilters = [...activeStep.filterPresets];
    newFilters[index] = { ...newFilters[index], [field]: value };
    updateActiveStep({ filterPresets: newFilters });
  };

  const removeFilterPreset = (index: number) => {
    if (!activeStep) return;
    const newFilters = activeStep.filterPresets.filter((_: any, i: number) => i !== index);
    updateActiveStep({ filterPresets: newFilters });
  };

  // Report Logic
  const addSelectedReport = (reportBase: Omit<Report, 'id'>) => {
    if(!activeStep) return;
    const newReport: Report = { 
      id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
      name: reportBase.name, 
      tool: reportBase.tool 
    };
    updateActiveStep({ reports: [...activeStep.reports, newReport] });
    setIsAddingReport(false);
    setReportSearchTerm('');
  };
  
  const removeReport = (reportId: string) => {
     if(!activeStep) return;
     updateActiveStep({ reports: activeStep.reports.filter((r: Report) => r.id !== reportId)});
  };

  // Checklist Logic
  const addChecklist = () => {
    if (!activeStep) return;
    const newItem = { id: `cl-${Date.now()}`, label: '', checked: false };
    updateActiveStep({ checklist: [...activeStep.checklist, newItem] });
  };

  const updateChecklist = (id: string, label: string) => {
     if(!activeStep) return;
     updateActiveStep({ checklist: activeStep.checklist.map((c: any) => c.id === id ? {...c, label} : c) });
  };

  // Filter mock reports based on search
  const filteredReports = MOCK_REPORT_LIBRARY.filter(r => 
    r.name.toLowerCase().includes(reportSearchTerm.toLowerCase()) || 
    r.tool.toLowerCase().includes(reportSearchTerm.toLowerCase())
  );

  // Render Mode Selection
  if (showModeSelection) {
      return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Create New Workflow</h1>
                <p className="text-slate-500">Choose how you want to build your new process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Option */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-8 flex flex-col relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
                   
                   <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                       <Sparkles className="w-6 h-6" />
                   </div>
                   
                   <h2 className="text-xl font-bold text-slate-900 mb-2">AI Generator</h2>
                   <p className="text-slate-500 mb-6 flex-1">
                       Describe your process in plain English and let our AI architect the entire workflow structure, including steps, reports, and KPIs.
                   </p>

                   {isGenerating ? (
                       <div className="flex flex-col items-center justify-center py-8 space-y-3">
                           <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                           <p className="text-sm font-bold text-indigo-600 animate-pulse">Architecting workflow...</p>
                       </div>
                   ) : (
                       <div className="space-y-4">
                           <textarea 
                             className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm resize-none"
                             rows={3}
                             placeholder="e.g., I need a quarterly compliance review process for GDPR including data access logs review and incident reporting..."
                             value={aiPrompt}
                             onChange={(e) => setAiPrompt(e.target.value)}
                           />
                           {generationError && <p className="text-xs text-rose-500 font-medium">{generationError}</p>}
                           <button 
                             onClick={handleGenerateWorkflow}
                             disabled={!aiPrompt.trim()}
                             className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                           >
                               <Wand2 className="w-4 h-4" /> Generate Draft
                           </button>
                       </div>
                   )}
                </div>

                {/* Manual Option */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-8 flex flex-col relative overflow-hidden group cursor-pointer" onClick={handleManualStart}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>

                   <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-6">
                       <Edit2 className="w-6 h-6" />
                   </div>
                   
                   <h2 className="text-xl font-bold text-slate-900 mb-2">Manual Builder</h2>
                   <p className="text-slate-500 mb-8 flex-1">
                       Start with a blank canvas. Define your phases, steps, and rules manually for complete granular control over the process execution.
                   </p>

                   <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition-all mt-auto">
                       Start from Scratch
                   </button>
                </div>
            </div>
        </div>
      );
  }

  // --- MAIN EDITOR RENDER ---

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Onboarding Banner (Only for Manual Start) */}
      {showOnboarding && (
        <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex items-start justify-between">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Info className="w-6 h-6 text-indigo-300" /> 
                Welcome to Workflow Definition
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-indigo-100 text-sm">
                <div className="space-y-2">
                   <div className="flex items-start gap-2">
                      <Layers className="w-4 h-4 mt-1 text-indigo-400" />
                      <p><strong>Section:</strong> A major phase of the workflow (e.g., Pre-Close Checks). Organize your steps logically within these containers.</p>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-1 text-indigo-400" />
                      <p><strong>Step:</strong> An actionable item. A step may contain <em>one or more</em> analytical reports that need review.</p>
                   </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowOnboarding(false)}
              className="bg-white text-indigo-900 px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shadow-md"
            >
              Got it
            </button>
          </div>
          {/* Decor */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-800 rounded-full opacity-50"></div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><ArrowLeft className="w-5 h-5"/></button>
           <div>
               <h1 className="text-2xl font-bold text-slate-900">{workflowId ? 'Edit Workflow' : 'Create New Workflow'}</h1>
               {!workflowId && sections.length > 0 && !showOnboarding && (
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1 w-fit mt-1">
                       {sections.length > 1 ? <Sparkles className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />} 
                       {sections.length > 1 ? 'AI Draft Generated' : 'Draft Mode'}
                   </span>
               )}
           </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm"
            title="Saves metadata, sections, and steps and returns to home screen."
            onClick={handleSave}
          >
            <Save className="w-4 h-4" /> Save Workflow
          </button>
        </div>
      </div>

      {/* Metadata Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group" title="Defines workflow purpose and ownership.">
         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow">Defines workflow purpose and ownership.</div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="md:col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Workflow Name</label>
               <input 
                 type="text" 
                 value={workflowName} 
                 onChange={(e) => setWorkflowName(e.target.value)}
                 placeholder="e.g., Month End Close"
                 className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900" 
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner</label>
               <input 
                 type="text" 
                 value={owner}
                 onChange={(e) => setOwner(e.target.value)}
                 placeholder="e.g., Maria Gomez"
                 className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cadence</label>
               <select 
                 value={cadence}
                 onChange={(e) => setCadence(e.target.value)}
                 className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
               >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
                <option>Quarterly</option>
                <option>Ad-hoc</option>
              </select>
             </div>
             <div className="md:col-span-3">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Objective</label>
               <input 
                 type="text" 
                 value={objective}
                 onChange={(e) => setObjective(e.target.value)}
                 placeholder="e.g., Ensure accurate monthly financial reporting"
                 className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
               <input
                 type="text"
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 placeholder="e.g., Finance > Close"
                 className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               />
             </div>
         </div>
      </div>

      <div className="flex gap-6 h-[700px]">
        
        {/* Left Panel: Structure Builder */}
        <div className="w-80 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Structure</h3>
             <button 
               className="text-blue-600 text-xs font-bold hover:bg-blue-50 px-2 py-1 rounded transition-colors" 
               title="Create a new workflow phase."
               onClick={() => setSections([...sections, { id: `sec-${Date.now()}`, title: 'New Phase', isExpanded: true, steps: [] }])}
             >
               + ADD SECTION
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                   {/* Section Header */}
                   <div className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <div onClick={() => toggleSection(section.id)} className="cursor-pointer">
                         {section.isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingSectionId === section.id ? (
                          <div className="flex items-center gap-1">
                              <input
                                ref={sectionInputRef}
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                onBlur={finishSectionEdit}
                                onKeyDown={(e) => e.key === 'Enter' && finishSectionEdit()}
                                className="w-full px-1 py-0.5 bg-white border border-blue-400 rounded text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                              <button onClick={finishSectionEdit} className="text-green-600"><Check className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                             <span className="font-semibold text-sm text-slate-700 truncate cursor-pointer" onClick={() => toggleSection(section.id)}>
                               {section.title}
                             </span>
                             <button 
                               onClick={() => setEditingSectionId(section.id)}
                               className="p-1 text-slate-400 hover:text-blue-600 transition-all"
                               title="Rename Section"
                             >
                               <Edit2 className="w-3 h-3" />
                             </button>
                          </div>
                        )}
                      </div>
                      
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                   </div>
                   
                   {/* Steps List */}
                   {section.isExpanded && (
                     <div className="p-2 space-y-2 bg-slate-50/50">
                        {section.steps.map((step: Step) => (
                          <div 
                            key={step.id} 
                            onClick={() => setActiveStepId(step.id)}
                            className={`p-2 rounded border shadow-sm flex items-center gap-2 cursor-pointer transition-all group ${
                              activeStepId === step.id 
                              ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-200' 
                              : 'bg-white border-slate-200 hover:border-blue-300'
                            }`}
                          >
                             <GripVertical className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                             <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate ${activeStepId === step.id ? 'text-blue-700' : 'text-slate-700'}`}>{step.name}</p>
                             </div>
                             {/* Multi-report indicators */}
                             <div className="flex -space-x-1.5 shrink-0">
                                {step.reports.map((r: Report, i: number) => (
                                  <div key={i} className="ring-1 ring-white rounded-full">
                                     <BiIcon tool={r.tool as BITool} size={16} />
                                  </div>
                                ))}
                             </div>
                          </div>
                        ))}
                        <button 
                          className="w-full py-2 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Add a step using one or multiple reports."
                          onClick={() => {
                            const newStepId = `step-${Date.now()}`;
                            setSections(sections.map(s => s.id === section.id ? { 
                              ...s, 
                              steps: [...s.steps, { id: newStepId, name: 'New Step', owners: [], reports: [], filterPresets: [], checklist: [] }] 
                            } : s));
                            setActiveStepId(newStepId);
                          }}
                        >
                          + Add Step
                        </button>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Right Panel: Step Editor */}
        {activeStep ? (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-800">Step Configuration</h3>
                  <p className="text-xs text-slate-500">Editing Step ID: {activeStep.id}</p>
                </div>
                <div className="flex items-center gap-2">
                   <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
                      <span>Step Enabled</span>
                   </label>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Name & Guidance */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Step Name</label>
                    <input 
                      type="text" 
                      value={activeStep.name} 
                      onChange={(e) => updateActiveStep({ name: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Guidance / Instructions</label>
                    <textarea 
                      rows={2} 
                      value={activeStep.guidance || ''}
                      onChange={(e) => updateActiveStep({ guidance: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    />
                  </div>
                </div>

                {/* Linked Reports - Multi Select Support */}
                <div className="border-t border-slate-100 pt-6">
                   <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-bold text-slate-700">Linked Reports</label>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded" title="A step may require reviewing one or multiple reports.">Multi-report Enabled</span>
                   </div>
                   
                   <div className="space-y-3">
                      {activeStep.reports.map((report: Report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors">
                           <div className="flex items-center gap-3">
                              <BiIcon tool={report.tool} size={32} />
                              <div>
                                 <input 
                                   className="text-sm font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0" 
                                   value={report.name} 
                                   onChange={(e) => {
                                     // Deep update for report name would go here
                                     const updatedReports = activeStep.reports.map((r: Report) => 
                                        r.id === report.id ? { ...r, name: e.target.value } : r
                                     );
                                     updateActiveStep({ reports: updatedReports });
                                   }}
                                 />
                                 <p className="text-xs text-slate-500">Asset ID: {report.id}</p>
                              </div>
                           </div>
                           <button onClick={() => removeReport(report.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      
                       {/* Search & Add Report Interface */}
                       {isAddingReport ? (
                         <div className="border border-blue-200 rounded-lg bg-white shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                               <Search className="w-4 h-4 text-slate-400" />
                               <input 
                                 type="text"
                                 autoFocus
                                 value={reportSearchTerm}
                                 onChange={(e) => setReportSearchTerm(e.target.value)}
                                 placeholder="Search reports in catalog..."
                                 className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
                               />
                               <button onClick={() => setIsAddingReport(false)} className="text-slate-400 hover:text-slate-600">
                                 <X className="w-4 h-4" />
                               </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                               {filteredReports.length > 0 ? (
                                 filteredReports.map((report, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => addSelectedReport(report)}
                                      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-none"
                                    >
                                       <BiIcon tool={report.tool as BITool} size={24} />
                                       <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold text-slate-800 truncate">{report.name}</p>
                                          <p className="text-xs text-slate-500">{report.tool}</p>
                                       </div>
                                       <Plus className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100" />
                                    </div>
                                 ))
                               ) : (
                                 <div className="p-4 text-center text-xs text-slate-400 italic">
                                    No reports found matching "{reportSearchTerm}"
                                 </div>
                               )}
                            </div>
                         </div>
                       ) : (
                         <button 
                            onClick={() => setIsAddingReport(true)}
                            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                         >
                             <Plus className="w-4 h-4" /> Add Report Link
                         </button>
                       )}
                   </div>
                </div>

                {/* Filters & Presets */}
                <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        Filter Presets
                        <Info className="w-4 h-4 text-slate-300" title="These filters must appear during execution and in the run history." />
                      </label>
                      <div className="space-y-3">
                         {activeStep.filterPresets.map((preset: FilterPreset, index: number) => (
                           <div key={index} className="flex gap-2 items-start">
                              <div className="flex-1 space-y-1">
                                 <input 
                                   type="text" 
                                   value={preset.key} 
                                   onChange={(e) => updateFilterPreset(index, 'key', e.target.value)}
                                   placeholder="Key" 
                                   className="w-full p-2 border border-slate-300 rounded text-xs" 
                                 />
                              </div>
                              <div className="flex-1 space-y-1">
                                 <input 
                                   type="text" 
                                   value={preset.value} 
                                   onChange={(e) => updateFilterPreset(index, 'value', e.target.value)}
                                   placeholder="Value" 
                                   className="w-full p-2 border border-slate-300 rounded text-xs" 
                                 />
                              </div>
                              <div className="w-24">
                                 <select 
                                   value={preset.type}
                                   onChange={(e) => updateFilterPreset(index, 'type', e.target.value)}
                                   className="w-full p-2 border border-slate-300 rounded text-xs bg-slate-50"
                                 >
                                   <option>Date / Period</option>
                                   <option>Region / Entity</option>
                                   <option>Scenario</option>
                                   <option>Custom</option>
                                 </select>
                              </div>
                              <button onClick={() => removeFilterPreset(index)} className="mt-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                           </div>
                         ))}
                         <button onClick={addFilterPreset} className="text-xs text-blue-600 font-bold flex items-center gap-1">+ ADD FILTER</button>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Completion Rules</label>
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Require Notes</span>
                            <input 
                              type="checkbox" 
                              checked={activeStep.requiresNotes} 
                              onChange={(e) => updateActiveStep({ requiresNotes: e.target.checked })}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                            />
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Checklist Items</span>
                            <span className="text-xs text-slate-400">{activeStep.checklist.length} Defined</span>
                         </div>
                         <div className="pl-2 border-l-2 border-slate-200 space-y-2 mt-2">
                            {activeStep.checklist.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-1">
                                <input 
                                  type="text" 
                                  value={item.label} 
                                  onChange={(e) => updateChecklist(item.id, e.target.value)}
                                  className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white" 
                                />
                              </div>
                            ))}
                            <button onClick={addChecklist} className="text-xs text-blue-500 hover:underline">+ Add Item</button>
                         </div>
                      </div>
                      <div className="mt-4">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Step Owner(s) <span className="text-[10px] font-normal lowercase">(comma separated)</span></label>
                         <input 
                           type="text" 
                           value={activeStep.owners ? activeStep.owners.join(', ') : ''} 
                           onChange={(e) => updateActiveStep({ owners: e.target.value.split(',').map(s => s.trim()) })}
                           placeholder="e.g. Alex Rivera, John Doe"
                           className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                         />
                      </div>
                   </div>
                </div>

             </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
            Select a step to edit or create a new one.
          </div>
        )}

      </div>
    </div>
  );
};

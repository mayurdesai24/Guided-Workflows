

export type BITool = 'Tableau' | 'PowerBI' | 'Qlik' | 'External';

export interface Report {
  id: string;
  name: string;
  tool: BITool;
  url?: string;
}

export type FilterType = 'Date / Period' | 'Region / Entity' | 'Scenario' | 'Custom';

export interface FilterPreset {
  key: string;
  value: string;
  type: FilterType;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface Step {
  id: string;
  name: string;
  reports: Report[];
  guidance: string;
  checklist: ChecklistItem[];
  filterPresets: FilterPreset[];
  requiresNotes: boolean;
  owners: string[]; 
  kpiTags?: string[]; 
}

export interface Section {
  id: string;
  title: string;
  steps: Step[];
}

export interface WorkflowMetadata {
  objective: string;
  cadence: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Ad-hoc';
  category: string;
  owner: string; // Process owner remains singular or main contact
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed'; 
  metadata: WorkflowMetadata;
  sections: Section[];
  activeRunId?: string; 
  lastRunDate?: string;
}

// Audit Trail Data Structures
export interface StepResult {
  stepId: string;
  stepName: string; 
  sectionTitle: string; 
  completedAt: string;
  completedBy: string;
  notes: string;
  checklistState: ChecklistItem[];
  filterValuesUsed: FilterPreset[]; 
  reportsSnapshot: Report[]; 
}

export interface Run {
  id: string;
  workflowId: string;
  status: 'In Progress' | 'Completed' | 'Aborted';
  executedBy: string;
  startTime: string;
  endTime?: string;
  currentSectionIndex: number;
  currentStepIndex: number;
  history: StepResult[];
  totalSteps: number;
  completedSteps: number;
  comments: Comment[]; // Added for collaboration per execution
  outcome?: string; // Added for final business decision
}
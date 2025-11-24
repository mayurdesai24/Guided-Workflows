
import { Workflow, Run } from './types';

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return '0s';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)));

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

// --- Mock Workflows ---

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Month End Close',
    status: 'In Progress',
    activeRunId: 'run-101', 
    lastRunDate: 'Feb 2025',
    metadata: {
      objective: 'A comprehensive financial close process designed to ensure accuracy and compliance across all global entities. This workflow guides the finance team through critical steps including sub-ledger verification, intercompany reconciliations, currency revaluation, and final consolidated reporting. It ensures that all GL entries are posted, variances are analyzed against forecasts, and regulatory requirements are met before the books are officially closed for the period.',
      cadence: 'Monthly',
      category: 'Finance > Close & Consolidation',
      owner: 'Maria Gomez',
    },
    sections: [
      {
        id: 'sec-1-1',
        title: 'System & Data Prep',
        steps: [
          {
            id: 'step-1-1-1',
            name: 'Verify ERP Data Loads',
            owners: ['Alex Rivera', 'IT Ops'],
            requiresNotes: true,
            reports: [
              { id: 'rep-1a', name: 'ERP Load Status Dashboard', tool: 'External' },
              { id: 'rep-1b', name: 'Source System Row Counts', tool: 'Tableau' }
            ],
            guidance: 'Confirm that all sub-ledger feeds from SAP and Oracle have completed successfully.',
            kpiTags: ['Data Completeness', 'System Health'],
            checklist: [
              { id: 'cl-1-1', label: 'GL Interface Complete', checked: false },
              { id: 'cl-1-2', label: 'Sub-ledgers Posted', checked: false }
            ],
            filterPresets: [{ key: 'Period', value: 'Current Month', type: 'Date / Period' }]
          },
          {
            id: 'step-1-1-2',
            name: 'Execute Currency Revaluation',
            owners: ['Alex Rivera'],
            requiresNotes: false,
            reports: [
               { id: 'rep-1c', name: 'FX Rates Master', tool: 'External' }
            ],
            guidance: 'Ensure latest month-end exchange rates are applied before consolidation.',
            kpiTags: ['FX Impact'],
            checklist: [{ id: 'cl-1-3', label: 'Rates Validated', checked: false }],
            filterPresets: []
          }
        ]
      },
      {
        id: 'sec-1-2',
        title: 'Reconciliations',
        steps: [
          {
             id: 'step-1-2-1',
             name: 'Bank Reconciliation',
             owners: ['Maria Gomez', 'Alex Rivera'],
             requiresNotes: true,
             reports: [{ id: 'rep-2a', name: 'Cash Position & Bank Rec', tool: 'PowerBI' }],
             guidance: 'Match all cash entries against bank statements. Investigate unreconciled items > $1k.',
             kpiTags: ['Cash Flow', 'Audit'],
             checklist: [
               { id: 'cl-2-1', label: 'All accounts matched', checked: false },
               { id: 'cl-2-2', label: 'Sign-off attached', checked: false }
             ],
             filterPresets: []
          },
          {
             id: 'step-1-2-2',
             name: 'Intercompany Matching',
             owners: ['Alex Rivera'],
             requiresNotes: true,
             reports: [{ id: 'rep-2b', name: 'Intercompany Mismatch Report', tool: 'Qlik' }],
             guidance: 'Resolve any IC mismatches between entities before elimination runs.',
             kpiTags: ['Consolidation'],
             checklist: [{ id: 'cl-2-3', label: 'Mismatches < 1%', checked: false }],
             filterPresets: []
          }
        ]
      },
      {
        id: 'sec-1-3',
        title: 'Financial Review',
        steps: [
           {
            id: 'step-1-3-1',
            name: 'P&L Variance Analysis',
            owners: ['Alex Rivera'],
            requiresNotes: true,
            reports: [
              { id: 'rep-3a', name: 'Consolidated P&L', tool: 'Tableau' },
              { id: 'rep-3b', name: 'Revenue by Region', tool: 'PowerBI' }
            ],
            guidance: 'Analyze variance vs Forecast. Provide commentary for any line item deviating > 5%.',
            kpiTags: ['EBITDA', 'Revenue'],
            checklist: [
              { id: 'cl-3-1', label: 'Review Revenue variance explanations', checked: false },
              { id: 'cl-3-2', label: 'Validate OpEx accruals', checked: false },
              { id: 'cl-3-3', label: 'Confirm Gross Margin trends', checked: false }
            ],
            filterPresets: [{ key: 'Scenario', value: 'Actual vs Forecast', type: 'Scenario' }]
           }
        ]
      }
    ]
  },
  {
    id: 'wf-2',
    name: 'Weekly Sales Pipeline Review',
    status: 'In Progress',
    activeRunId: 'run-202',
    lastRunDate: 'Yesterday',
    metadata: {
      objective: 'A structured weekly assessment of the global sales pipeline to drive forecast accuracy and revenue predictability. This process involves reviewing open opportunities in CRM, identifying stalled deals in the negotiation phase, and validating commit numbers with regional VPs. The goal is to ensure data hygiene, accelerate deal velocity, and provide executive leadership with a reliable 30-day forecast.',
      cadence: 'Weekly',
      category: 'Sales > Pipeline',
      owner: 'Alex Rivera',
    },
    sections: [
      {
        id: 'sec-2-1',
        title: 'Pipeline Health',
        steps: [
          {
            id: 'step-2-1-1',
            name: 'Review Open Opportunities',
            owners: ['Alex Rivera'],
            requiresNotes: true,
            reports: [{ id: 'rep-4', name: 'Sales Pipeline by Stage', tool: 'PowerBI' }],
            guidance: 'Focus on opportunities stuck in "Negotiation" for > 30 days.',
            kpiTags: ['Pipeline Value', 'Deal Velocity'],
            checklist: [{ id: 'cl-5', label: 'Stalled deals identified', checked: false }],
            filterPresets: [{ key: 'Region', value: 'Global', type: 'Region / Entity' }]
          }
        ]
      },
      {
        id: 'sec-2-2',
        title: 'Forecast Validation',
        steps: [
          {
            id: 'step-2-2-1',
            name: 'Validate 30-Day Forecast',
            owners: ['Sarah Chen'],
            requiresNotes: true,
            reports: [{ id: 'rep-5', name: '30-Day Sales Forecast Detail', tool: 'External' }],
            guidance: 'Confirm commitment amounts with regional VPs.',
            kpiTags: ['Forecast Accuracy'],
            checklist: [{ id: 'cl-6', label: 'Forecast submitted', checked: false }],
            filterPresets: []
          }
        ]
      }
    ]
  },
  {
    id: 'wf-3',
    name: 'Operational Risk Monitoring',
    status: 'Completed', 
    lastRunDate: '3 days ago',
    metadata: {
      objective: 'A proactive risk management framework focused on identifying, assessing, and mitigating operational anomalies in real-time. This workflow monitors critical data pipelines for latency and quality issues, tracks Key Risk Indicators (KRIs) for deviations, and formalizes the incident logging process. It empowers the risk committee to respond swiftly to control failures and system outages, ensuring business continuity and compliance with internal governance standards.',
      cadence: 'Weekly',
      category: 'Risk & Compliance',
      owner: 'Priya Nair',
    },
    sections: [
      {
        id: 'sec-3-1',
        title: 'Data Quality Monitoring',
        steps: [
          {
            id: 'step-3-1-1',
            name: 'Review ETL Pipeline Health',
            owners: ['Alex Rivera'],
            requiresNotes: true,
            reports: [
              { id: 'rep-6', name: 'ETL Job Health & Latency', tool: 'Tableau' },
              { id: 'rep-7', name: 'ETL Error Log Summary', tool: 'External' }
            ],
            guidance: 'Check for critical job failures or latency > 1 hour.',
            kpiTags: ['Data Latency', 'System Health'],
            checklist: [
              { id: 'cl-7', label: 'Critical jobs verified', checked: false },
              { id: 'cl-8', label: 'Latency acceptable', checked: false }
            ],
            filterPresets: [{ key: 'Environment', value: 'Production', type: 'Custom' }]
          },
          {
            id: 'step-3-1-2',
            name: 'Review Data Quality Exceptions',
            owners: ['Priya Nair'],
            requiresNotes: false,
            reports: [
               { id: 'rep-8', name: 'Data Quality Exceptions Summary', tool: 'Qlik' }
            ],
            guidance: 'Review null value spikes in core transaction tables.',
            kpiTags: ['Data Quality', 'Exceptions'],
            checklist: [],
            filterPresets: []
          }
        ]
      },
      {
        id: 'sec-3-2',
        title: 'KPI Exception Analysis',
        steps: [
           {
             id: 'step-3-2-1',
             name: 'Analyze Operational Risk KPIs',
             owners: ['Priya Nair'],
             requiresNotes: false,
             reports: [{ id: 'rep-9', name: 'Operational Risk KPIs Overview', tool: 'PowerBI' }],
             guidance: 'Identify any KRIs trending red.',
             kpiTags: ['KRI', 'Risk Exposure'],
             checklist: [],
             filterPresets: []
           },
           {
            id: 'step-3-2-2',
            name: 'Investigate Transaction Anomalies',
             owners: ['Priya Nair'],
             requiresNotes: true,
             reports: [
               { id: 'rep-10', name: 'Transaction Anomaly Detection', tool: 'External' },
               { id: 'rep-11', name: 'Transaction Trend Outliers', tool: 'Qlik' }
             ],
             guidance: 'Cross-reference outliers with known maintenance windows.',
             kpiTags: ['Fraud Detection', 'Anomalies'],
             checklist: [{ id: 'cl-9', label: 'Anomalies logged', checked: false }],
             filterPresets: []
           },
           {
             id: 'step-3-2-3',
             name: 'Review Control Failures',
             owners: ['Priya Nair'],
             requiresNotes: true,
             reports: [{ id: 'rep-12', name: 'Control Failure Summary', tool: 'Tableau' }],
             guidance: 'Assess impact of any failed SOX controls.',
             kpiTags: ['Compliance', 'SOX'],
             checklist: [{ id: 'cl-10', label: 'Impact assessment complete', checked: false }],
             filterPresets: []
           }
        ]
      },
      {
        id: 'sec-3-3',
        title: 'Incident Documentation & Submission',
        steps: [
          {
            id: 'step-3-3-1',
            name: 'Log Risk Incidents',
            owners: ['Priya Nair'],
            requiresNotes: true,
            reports: [{ id: 'rep-13', name: 'Risk Incident Register', tool: 'External' }],
            guidance: 'Ensure all confirmed incidents are logged in the register.',
            kpiTags: ['Incident Management'],
            checklist: [{ id: 'cl-11', label: 'Incidents logged', checked: false }],
            filterPresets: []
           },
           {
            id: 'step-3-3-2',
            name: 'Review & Submit Incident Summary',
            owners: ['Priya Nair'],
            requiresNotes: false,
            reports: [{ id: 'rep-14', name: 'Risk Incident Summary & Escalation', tool: 'Qlik' }],
            guidance: 'Final review before submission to Risk Committee.',
            kpiTags: ['Reporting'],
            checklist: [{ id: 'cl-12', label: 'Summary approved', checked: false }],
            filterPresets: []
          }
        ]
      }
    ]
  }
];

// --- Mock Runs ---

// Workflow 1 is "In Progress" (Updated Month End Close)
export const INITIAL_RUNS: Run[] = [
  {
    id: 'run-101',
    workflowId: 'wf-1',
    status: 'In Progress',
    executedBy: 'Alex Rivera',
    startTime: '2025-02-24T08:00:00Z',
    currentSectionIndex: 2, // Financial Review
    currentStepIndex: 0, // P&L Variance Analysis
    completedSteps: 4, // 2 prep + 2 reconciliations
    totalSteps: 5,
    totalDuration: 10800000, // 3 hours in ms (approx)
    timeSpentOnCurrentStep: 450000, // 7.5 mins so far
    comments: [
      { id: 'c1', userId: 'user1', userName: 'Maria Gomez', text: 'Alex, ensure FX rates are updated before running revaluation.', timestamp: '2025-02-24T08:10:00Z' }
    ],
    history: [
       {
        stepId: 'step-1-1-1',
        stepName: 'Verify ERP Data Loads',
        sectionTitle: 'System & Data Prep',
        completedAt: '2025-02-24T09:00:00Z',
        completedBy: 'Alex Rivera',
        notes: 'All source systems (SAP, Oracle, Netsuite) loaded successfully. Row counts validated.',
        checklistState: [
          {id: 'cl-1-1', label: 'GL Interface Complete', checked: true},
          {id: 'cl-1-2', label: 'Sub-ledgers Posted', checked: true}
        ],
        filterValuesUsed: [{ key: 'Period', value: 'Current Month', type: 'Date / Period' }],
        reportsSnapshot: [
            { id: 'rep-1a', name: 'ERP Load Status Dashboard', tool: 'External' },
            { id: 'rep-1b', name: 'Source System Row Counts', tool: 'Tableau' }
        ],
        duration: 3600000 // 1 hour
       },
       {
        stepId: 'step-1-1-2',
        stepName: 'Execute Currency Revaluation',
        sectionTitle: 'System & Data Prep',
        completedAt: '2025-02-24T09:45:00Z',
        completedBy: 'Alex Rivera',
        notes: 'FX rates for GBP, EUR, and JPY updated. Revaluation process completed without errors.',
        checklistState: [{ id: 'cl-1-3', label: 'Rates Validated', checked: true }],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-1c', name: 'FX Rates Master', tool: 'External' }],
        duration: 2700000 // 45 mins
       },
       {
        stepId: 'step-1-2-1',
        stepName: 'Bank Reconciliation',
        sectionTitle: 'Reconciliations',
        completedAt: '2025-02-24T11:15:00Z',
        completedBy: 'Maria Gomez',
        notes: 'All major accounts reconciled. One small variance ($45) in the operating account, flagged for adjustment next month.',
        checklistState: [
           { id: 'cl-2-1', label: 'All accounts matched', checked: true },
           { id: 'cl-2-2', label: 'Sign-off attached', checked: true }
        ],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-2a', name: 'Cash Position & Bank Rec', tool: 'PowerBI' }],
        duration: 3600000 // 1 hour (gap included in timestamps but duration tracks active time)
       },
       {
        stepId: 'step-1-2-2',
        stepName: 'Intercompany Matching',
        sectionTitle: 'Reconciliations',
        completedAt: '2025-02-24T13:30:00Z',
        completedBy: 'Alex Rivera',
        notes: 'Intercompany mismatches resolved. Eliminations are ready for the final consolidation run.',
        checklistState: [{ id: 'cl-2-3', label: 'Mismatches < 1%', checked: true }],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-2b', name: 'Intercompany Mismatch Report', tool: 'Qlik' }],
        duration: 900000 // 15 mins active
       }
    ]
  },
  // New Active Run for Sales Pipeline (Workflow 2)
  {
    id: 'run-202',
    workflowId: 'wf-2',
    status: 'In Progress',
    executedBy: 'Alex Rivera',
    startTime: '2025-02-25T09:00:00Z',
    currentSectionIndex: 1, // Forecast Validation
    currentStepIndex: 0, // Validate 30-Day Forecast
    completedSteps: 1,
    totalSteps: 2,
    totalDuration: 1200000, // 20 mins
    timeSpentOnCurrentStep: 0,
    comments: [],
    history: [
       {
        stepId: 'step-2-1-1',
        stepName: 'Review Open Opportunities',
        sectionTitle: 'Pipeline Health',
        completedAt: '2025-02-25T09:20:00Z',
        completedBy: 'Alex Rivera',
        notes: 'Completed pipeline review. Handing off for forecast validation.',
        checklistState: [
          {id: 'cl-5', label: 'Stalled deals identified', checked: true},
        ],
        filterValuesUsed: [{ key: 'Region', value: 'Global', type: 'Region / Entity' }],
        reportsSnapshot: [{ id: 'rep-4', name: 'Sales Pipeline by Stage', tool: 'PowerBI' }],
        duration: 1200000 // 20 mins
       }
    ]
  },
  // Past runs for Sales Pipeline (Workflow 2)
  {
    id: 'run-55',
    workflowId: 'wf-2',
    status: 'Completed',
    executedBy: 'Alex Rivera',
    startTime: '2025-02-17T10:00:00Z',
    endTime: '2025-02-17T10:45:00Z',
    currentSectionIndex: 1,
    currentStepIndex: 0,
    completedSteps: 2,
    totalSteps: 2,
    totalDuration: 2700000, // 45 mins
    timeSpentOnCurrentStep: 0,
    comments: [
      { id: 'c3', userId: 'user3', userName: 'Sarah Chen', text: 'I noticed the pipeline is a bit weak in EMEA this week.', timestamp: '2025-02-17T10:05:00Z' },
      { id: 'c4', userId: 'user2', userName: 'Alex Rivera', text: 'Agreed, looking into the legal hold-ups now.', timestamp: '2025-02-17T10:10:00Z' }
    ],
    outcome: 'Forecast adjusted down by 5% due to EMEA legal delays. Regional VPs notified.',
    history: [
      {
        stepId: 'step-2-1-1',
        stepName: 'Review Open Opportunities',
        sectionTitle: 'Pipeline Health',
        completedAt: '2025-02-17T10:20:00Z',
        completedBy: 'Alex Rivera',
        notes: 'Investigated pipeline stall. Found 3 key opportunities in EMEA > 45 days negotiation. Notes from Salesforce indicate awaiting legal approval.',
        checklistState: [{id: 'cl-5', label: 'Stalled deals identified', checked: true}],
        filterValuesUsed: [{ key: 'Region', value: 'Global', type: 'Region / Entity' }],
        reportsSnapshot: [{ id: 'rep-4', name: 'Sales Pipeline by Stage', tool: 'PowerBI' }],
        duration: 1200000 // 20 mins
      },
      {
        stepId: 'step-2-2-1',
        stepName: 'Validate 30-Day Forecast',
        sectionTitle: 'Forecast Validation',
        completedAt: '2025-02-17T10:45:00Z',
        completedBy: 'Alex Rivera',
        notes: 'Due to the legal delays identified in the previous step, I removed the $150k from this month\'s commit. Forecast adjusted down by 5%. Regional VP aligned.',
        checklistState: [{id: 'cl-6', label: 'Forecast submitted', checked: true}],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-5', name: '30-Day Sales Forecast Detail', tool: 'External' }],
        duration: 1500000 // 25 mins
      }
    ]
  },
  // Past Run for Operational Risk (Workflow 3) - COMPLETE HISTORY
  {
    id: 'run-301',
    workflowId: 'wf-3',
    status: 'Completed',
    executedBy: 'Priya Nair',
    startTime: '2025-02-21T14:00:00Z',
    endTime: '2025-02-21T15:15:00Z',
    currentSectionIndex: 2,
    currentStepIndex: 1,
    completedSteps: 7,
    totalSteps: 7,
    totalDuration: 4500000, // 75 mins
    timeSpentOnCurrentStep: 0,
    comments: [
        { id: 'c5', userId: 'user4', userName: 'Priya Nair', text: 'Starting the risk review. Seeing some ETL latency alerts.', timestamp: '2025-02-21T14:02:00Z' },
        { id: 'c6', userId: 'user5', userName: 'IT Ops', text: 'We are aware of the latency. Job #445 is retrying. Should be clear in 10 mins.', timestamp: '2025-02-21T14:05:00Z' },
        { id: 'c7', userId: 'user4', userName: 'Priya Nair', text: 'Thanks. Proceeding with other checks.', timestamp: '2025-02-21T14:06:00Z' }
    ],
    outcome: 'No material risk incidents identified. One control failure logged (Data Completeness) but impact was $0. Incident #INC-998 created for tracking.',
    history: [
      {
        stepId: 'step-3-1-1',
        stepName: 'Review ETL Pipeline Health',
        sectionTitle: 'Data Quality Monitoring',
        completedAt: '2025-02-21T14:10:00Z',
        completedBy: 'Priya Nair',
        notes: 'Daily ETL batch completed successfully. Job #445 had a minor delay but auto-retried. Latency of 15 minutes is within SLA.',
        checklistState: [
          { id: 'cl-7', label: 'Critical jobs verified', checked: true },
          { id: 'cl-8', label: 'Latency acceptable', checked: true }
        ],
        filterValuesUsed: [{ key: 'Environment', value: 'Production', type: 'Custom' }],
        reportsSnapshot: [
           { id: 'rep-6', name: 'ETL Job Health & Latency', tool: 'Tableau' },
           { id: 'rep-7', name: 'ETL Error Log Summary', tool: 'External' }
        ],
        duration: 600000 // 10m
      },
      {
        stepId: 'step-3-1-2',
        stepName: 'Review Data Quality Exceptions',
        sectionTitle: 'Data Quality Monitoring',
        completedAt: '2025-02-21T14:20:00Z',
        completedBy: 'Priya Nair',
        notes: 'Found 500 unexpected null values in the `customer_id` column in the staging transaction table. Flagging for investigation.',
        checklistState: [],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-8', name: 'Data Quality Exceptions Summary', tool: 'Qlik' }],
        duration: 600000 // 10m
      },
      {
        stepId: 'step-3-2-1',
        stepName: 'Analyze Operational Risk KPIs',
        sectionTitle: 'KPI Exception Analysis',
        completedAt: '2025-02-21T14:30:00Z',
        completedBy: 'Priya Nair',
        notes: 'Risk Exposure KPI spiked to $2M. This correlates with the null customer IDs found in the previous step (defaulting to High Risk category).',
        checklistState: [],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-9', name: 'Operational Risk KPIs Overview', tool: 'PowerBI' }],
        duration: 600000 // 10m
      },
      {
        stepId: 'step-3-2-2',
        stepName: 'Investigate Transaction Anomalies',
        sectionTitle: 'KPI Exception Analysis',
        completedAt: '2025-02-21T14:45:00Z',
        completedBy: 'Priya Nair',
        notes: 'Confirmed the spike is a data quality artifact, not real fraud. The nulls are from a new feed. IT is deploying a patch.',
        checklistState: [{ id: 'cl-9', label: 'Anomalies logged', checked: true }],
        filterValuesUsed: [],
        reportsSnapshot: [
           { id: 'rep-10', name: 'Transaction Anomaly Detection', tool: 'External' },
           { id: 'rep-11', name: 'Transaction Trend Outliers', tool: 'Qlik' }
        ],
        duration: 900000 // 15m
      },
      {
        stepId: 'step-3-2-3',
        stepName: 'Review Control Failures',
        sectionTitle: 'KPI Exception Analysis',
        completedAt: '2025-02-21T14:55:00Z',
        completedBy: 'Priya Nair',
        notes: 'One SOX control (Data Completeness Check) formally failed due to the nulls. Must escalate per policy.',
        checklistState: [{ id: 'cl-10', label: 'Impact assessment complete', checked: true }],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-12', name: 'Control Failure Summary', tool: 'Tableau' }],
        duration: 600000 // 10m
      },
      {
        stepId: 'step-3-3-1',
        stepName: 'Log Risk Incidents',
        sectionTitle: 'Incident Documentation & Submission',
        completedAt: '2025-02-21T15:05:00Z',
        completedBy: 'Priya Nair',
        notes: 'Logged Incident #INC-998 regarding the Control Failure. Noted that financial impact is $0 (data error only).',
        checklistState: [{ id: 'cl-11', label: 'Incidents logged', checked: true }],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-13', name: 'Risk Incident Register', tool: 'External' }],
        duration: 600000 // 10m
      },
      {
        stepId: 'step-3-3-2',
        stepName: 'Review & Submit Incident Summary',
        sectionTitle: 'Incident Documentation & Submission',
        completedAt: '2025-02-21T15:15:00Z',
        completedBy: 'Priya Nair',
        notes: 'Summary report generated and emailed to Risk Committee with the root cause analysis attached.',
        checklistState: [{ id: 'cl-12', label: 'Summary approved', checked: true }],
        filterValuesUsed: [],
        reportsSnapshot: [{ id: 'rep-14', name: 'Risk Incident Summary & Escalation', tool: 'Qlik' }],
        duration: 600000 // 10m
      }
    ]
  },
  { 
    id: 'run-54', 
    workflowId: 'wf-2', 
    status: 'Completed', 
    executedBy: 'Alex Rivera', 
    startTime: '2025-02-10T10:00:00Z', 
    endTime: '2025-02-10T11:10:00Z', 
    currentSectionIndex: 1, 
    currentStepIndex: 0, 
    completedSteps: 2, 
    totalSteps: 2, 
    totalDuration: 4200000,
    timeSpentOnCurrentStep: 0,
    comments: [
      { id: 'c8', userId: 'user2', userName: 'Alex Rivera', text: 'Smooth run this week. All opportunities are up to date.', timestamp: '2025-02-10T10:10:00Z' }
    ], 
    history: [], 
    outcome: 'Forecast confirmed.' 
  },
  { id: 'run-53', workflowId: 'wf-2', status: 'Completed', executedBy: 'Alex Rivera', startTime: '2025-02-03T09:00:00Z', endTime: '2025-02-03T09:45:00Z', currentSectionIndex: 1, currentStepIndex: 0, completedSteps: 2, totalSteps: 2, totalDuration: 2700000, timeSpentOnCurrentStep: 0, comments: [], history: [], outcome: 'Forecast confirmed.' },
  { id: 'run-52', workflowId: 'wf-2', status: 'Completed', executedBy: 'Alex Rivera', startTime: '2025-01-27T10:00:00Z', endTime: '2025-01-27T10:50:00Z', currentSectionIndex: 1, currentStepIndex: 0, completedSteps: 2, totalSteps: 2, totalDuration: 3000000, timeSpentOnCurrentStep: 0, comments: [], history: [], outcome: 'Forecast confirmed.' },
  { id: 'run-51', workflowId: 'wf-2', status: 'Completed', executedBy: 'Alex Rivera', startTime: '2025-01-20T10:00:00Z', endTime: '2025-01-20T11:00:00Z', currentSectionIndex: 1, currentStepIndex: 0, completedSteps: 2, totalSteps: 2, totalDuration: 3600000, timeSpentOnCurrentStep: 0, comments: [], history: [], outcome: 'Forecast confirmed.' },
];

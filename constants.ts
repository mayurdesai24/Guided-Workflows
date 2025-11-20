
import { Workflow, Run } from './types';

// --- Mock Workflows ---

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Month End Close',
    status: 'In Progress',
    activeRunId: 'run-101', 
    lastRunDate: 'Feb 2025',
    metadata: {
      objective: 'Ensure accurate monthly financial reporting',
      cadence: 'Monthly',
      category: 'Finance > Close & Consolidation',
      owner: 'Maria Gomez',
    },
    sections: [
      {
        id: 'sec-1-1',
        title: 'Pre-Close Checks',
        steps: [
          {
            id: 'step-1-1-1',
            name: 'Validate Source Data Completeness',
            owners: ['Alex Rivera', 'Tech Support'],
            requiresNotes: true,
            reports: [
              { id: 'rep-1', name: 'Finance Data Completeness Check', tool: 'External' }
            ],
            guidance: 'Ensure all ERP extracts have been loaded for the period.',
            kpiTags: ['Data Integrity', 'Completeness'],
            checklist: [
              { id: 'cl-1', label: 'General Ledger loaded', checked: false },
              { id: 'cl-2', label: 'Sub-ledger reconciliation done', checked: false }
            ],
            filterPresets: [{ key: 'Period', value: 'Current Month', type: 'Date / Period' }]
          }
        ]
      },
      {
        id: 'sec-1-2',
        title: 'P&L Review',
        steps: [
          {
            id: 'step-1-2-1',
            name: 'Review Monthly Revenue Variance',
            owners: ['Alex Rivera'],
            requiresNotes: true,
            reports: [
              { id: 'rep-2', name: 'Monthly Revenue Variance', tool: 'Qlik' }
            ],
            guidance: 'Check for any variance > 5% against forecast.',
            kpiTags: ['Revenue', 'Variance Analysis'],
            checklist: [
              { id: 'cl-3', label: 'Variance explained', checked: false }
            ],
            filterPresets: [{ key: 'Scenario', value: 'Actual vs Forecast', type: 'Scenario' }]
          }
        ]
      },
      {
        id: 'sec-1-3',
        title: 'Balance Sheet Review',
        steps: [
           {
            id: 'step-1-3-1',
            name: 'Validate AR Aging',
            owners: ['Alex Rivera'],
            requiresNotes: false,
            reports: [
              { id: 'rep-3', name: 'AR Aging by Customer', tool: 'Tableau' }
            ],
            guidance: 'Review overdue accounts > 90 days.',
            kpiTags: ['Accounts Receivable', 'Risk'],
            checklist: [
              { id: 'cl-4', label: 'High risk accounts flagged', checked: false }
            ],
            filterPresets: []
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
      objective: 'Weekly sales pipeline assessment',
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
      objective: 'Identify and escalate operational risks',
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

// Workflow 1 is "In Progress" (Last Step: 2 completed out of 3)
export const INITIAL_RUNS: Run[] = [
  {
    id: 'run-101',
    workflowId: 'wf-1',
    status: 'In Progress',
    executedBy: 'Alex Rivera',
    startTime: '2025-02-24T08:00:00Z',
    currentSectionIndex: 2, // Balance Sheet Review (Section 3)
    currentStepIndex: 0, // Validate AR Aging (Step 1 of Section 3)
    completedSteps: 2, // Completed Pre-Close Checks (1) + P&L Review (1)
    totalSteps: 3, // Total steps
    comments: [
      { id: 'c1', userId: 'user1', userName: 'Maria Gomez', text: 'Alex, please double check the SAP extracts this month.', timestamp: '2025-02-24T08:15:00Z' },
      { id: 'c2', userId: 'user2', userName: 'Alex Rivera', text: 'Will do. Source data looks cleaner than last month.', timestamp: '2025-02-24T08:20:00Z' }
    ],
    history: [
       {
        stepId: 'step-1-1-1',
        stepName: 'Validate Source Data Completeness',
        sectionTitle: 'Pre-Close Checks',
        completedAt: '2025-02-24T09:30:00Z',
        completedBy: 'Alex Rivera',
        notes: 'Confirmed that all ERP source extracts from SAP and Oracle have successfully loaded. Row counts match the control totals from last night. Data is ready for P&L aggregation.',
        checklistState: [
          {id: 'cl-1', label: 'General Ledger loaded', checked: true},
          {id: 'cl-2', label: 'Sub-ledger reconciliation done', checked: true}
        ],
        filterValuesUsed: [{ key: 'Period', value: 'Current Month', type: 'Date / Period' }],
        reportsSnapshot: [{ id: 'rep-1', name: 'Finance Data Completeness Check', tool: 'External' }]
       },
       {
        stepId: 'step-1-2-1',
        stepName: 'Review Monthly Revenue Variance',
        sectionTitle: 'P&L Review',
        completedAt: '2025-02-24T10:15:00Z',
        completedBy: 'Alex Rivera',
        notes: 'Revenue is within 2% variance. No major anomalies found in top-line numbers.',
        checklistState: [
          {id: 'cl-3', label: 'Variance explained', checked: true}
        ],
        filterValuesUsed: [{ key: 'Scenario', value: 'Actual vs Forecast', type: 'Scenario' }],
        reportsSnapshot: [{ id: 'rep-2', name: 'Monthly Revenue Variance', tool: 'Qlik' }]
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
        reportsSnapshot: [{ id: 'rep-4', name: 'Sales Pipeline by Stage', tool: 'PowerBI' }]
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
        reportsSnapshot: [{ id: 'rep-4', name: 'Sales Pipeline by Stage', tool: 'PowerBI' }]
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
        reportsSnapshot: [{ id: 'rep-5', name: '30-Day Sales Forecast Detail', tool: 'External' }]
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
        ]
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
        reportsSnapshot: [{ id: 'rep-8', name: 'Data Quality Exceptions Summary', tool: 'Qlik' }]
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
        reportsSnapshot: [{ id: 'rep-9', name: 'Operational Risk KPIs Overview', tool: 'PowerBI' }]
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
        ]
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
        reportsSnapshot: [{ id: 'rep-12', name: 'Control Failure Summary', tool: 'Tableau' }]
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
        reportsSnapshot: [{ id: 'rep-13', name: 'Risk Incident Register', tool: 'External' }]
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
        reportsSnapshot: [{ id: 'rep-14', name: 'Risk Incident Summary & Escalation', tool: 'Qlik' }]
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
    comments: [
      { id: 'c8', userId: 'user2', userName: 'Alex Rivera', text: 'Smooth run this week. All opportunities are up to date.', timestamp: '2025-02-10T10:10:00Z' }
    ], 
    history: [], 
    outcome: 'Forecast confirmed.' 
  },
  { id: 'run-53', workflowId: 'wf-2', status: 'Completed', executedBy: 'Alex Rivera', startTime: '2025-02-03T09:00:00Z', endTime: '2025-02-03T09:45:00Z', currentSectionIndex: 1, currentStepIndex: 0, completedSteps: 2, totalSteps: 2, comments: [], history: [], outcome: 'Forecast confirmed.' },
  { id: 'run-52', workflowId: 'wf-2', status: 'Completed', executedBy: 'Alex Rivera', startTime: '2025-01-27T10:00:00Z', endTime: '2025-01-27T10:50:00Z', currentSectionIndex: 1, currentStepIndex: 0, completedSteps: 2, totalSteps: 2, comments: [], history: [], outcome: 'Forecast confirmed.' },
  { id: 'run-51', workflowId: 'wf-2', status: 'Completed', executedBy: 'Alex Rivera', startTime: '2025-01-20T10:00:00Z', endTime: '2025-01-20T11:00:00Z', currentSectionIndex: 1, currentStepIndex: 0, completedSteps: 2, totalSteps: 2, comments: [], history: [], outcome: 'Forecast confirmed.' },
];

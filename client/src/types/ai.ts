// Response type for MVP Plan generation
export interface MvpPlanResponse {
  executiveSummary: string;
  problemStatement: string;
  targetAudience: string;
  valueProposition: string;
  mvpScope: string;
  keyFeatures: string[];
  successCriteria: string;
  potentialChallenges: string;
  nextSteps: string;
}

// Response type for feature ideas generation
export interface FeatureIdea {
  name: string;
  description: string;
  value: string;
  priority: string;
  difficulty: string;
  reasoning: string;
}

export interface FeaturesResponse {
  featureIdeas: FeatureIdea[];
}

// Response type for milestone generation
export interface Milestone {
  title: string;
  description: string;
  duration: number;
  order: number;
  deliverables: string[];
  technical_notes: string;
  validation_steps: string[];
}

export interface MilestonesResponse {
  milestones: Milestone[];
}

// Response type for KPI generation
export interface Kpi {
  name: string;
  description: string;
  target: string;
  timeframe: string;
  importance: string;
  implementation: string;
  implementation_advice?: string;
  interpretation: string;
  benchmarks: string;
}

export interface KpisResponse {
  kpis: Kpi[];
}

// Response type for flow diagram generation
export interface DiagramsResponse {
  userFlowDiagram: string;
  dataFlowDiagram: string;
  systemArchitectureDiagram: string;
  explanation: string;
}
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type ValidationMethodType = {
  id?: number;
  name: string;
  description: string;
  isSelected: boolean;
};

export type FeatureType = {
  id?: number;
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  difficulty: "Easy" | "Medium" | "Hard";
  includeInMvp: boolean;
};

export type CompetitorType = {
  id?: number;
  name: string;
};

export type CompetitiveFeatureType = {
  id?: number;
  name: string;
  yourMvp: boolean;
  competitorsHasFeature: Record<number, boolean>;
};

export type MilestoneType = {
  id?: number;
  title: string;
  description: string;
  duration: number;
  order: number;
};

export type KpiType = {
  id?: number;
  name: string;
  description: string;
  target: string;
  timeframe: string;
};

export type ProjectType = {
  id?: number;
  name: string;
  industry: string;
  audience: string;
  problemStatement: string;
  keyBenefits: string[];
  additionalNotes?: string;
  currentStep: StepType;
};

export type StepType = 
  | "projectInfo"
  | "ideaExploration"
  | "mvpPlan"
  | "flowDiagram"
  | "powerPoint"
  | "readme"
  | "reviewExport";

export type FlowNodeType = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { 
    label: string;
    type?: string;
    description?: string;
    color?: string;
    isDragging?: boolean;
  };
  draggable?: boolean;
};

export type FlowEdgeType = {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
};

export type FlowDiagramType = {
  id?: number;
  title: string;
  description?: string;
  nodes: FlowNodeType[];
  edges: FlowEdgeType[];
};

interface ProjectContextType {
  // Project state
  currentProject: ProjectType | null;
  setCurrentProject: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  
  // Project features
  features: FeatureType[];
  setFeatures: React.Dispatch<React.SetStateAction<FeatureType[]>>;
  
  // Validation methods
  validationMethods: ValidationMethodType[];
  setValidationMethods: React.Dispatch<React.SetStateAction<ValidationMethodType[]>>;
  
  // Competitors
  competitors: CompetitorType[];
  setCompetitors: React.Dispatch<React.SetStateAction<CompetitorType[]>>;
  
  // Competitive features
  competitiveFeatures: CompetitiveFeatureType[];
  setCompetitiveFeatures: React.Dispatch<React.SetStateAction<CompetitiveFeatureType[]>>;
  
  // Milestones
  milestones: MilestoneType[];
  setMilestones: React.Dispatch<React.SetStateAction<MilestoneType[]>>;
  
  // KPIs
  kpis: KpiType[];
  setKpis: React.Dispatch<React.SetStateAction<KpiType[]>>;
  
  // Flow diagram
  flowDiagram: FlowDiagramType | null;
  setFlowDiagram: React.Dispatch<React.SetStateAction<FlowDiagramType | null>>;
  
  // Actions
  createProject: (project: ProjectType) => Promise<ProjectType>;
  updateProject: (project: Partial<ProjectType>) => Promise<ProjectType | undefined>;
  saveProgress: () => Promise<boolean>;
  
  // Loading state
  isLoading: boolean;
  showHelp: boolean;
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  // Use React.useState instead of useState to avoid naming conflicts
  const [currentProject, setCurrentProject] = React.useState<ProjectType | null>(null);
  const [features, setFeatures] = React.useState<FeatureType[]>([]);
  const [validationMethods, setValidationMethods] = React.useState<ValidationMethodType[]>([]);
  const [competitors, setCompetitors] = React.useState<CompetitorType[]>([]);
  const [competitiveFeatures, setCompetitiveFeatures] = React.useState<CompetitiveFeatureType[]>([]);
  const [milestones, setMilestones] = React.useState<MilestoneType[]>([]);
  const [kpis, setKpis] = React.useState<KpiType[]>([]);
  const [flowDiagram, setFlowDiagram] = React.useState<FlowDiagramType | null>(null);
  const [showHelp, setShowHelp] = React.useState(false);
  
  // Cache mutation references to prevent recreation on each render
  const createProjectMutation = React.useRef(
    useMutation({
      mutationFn: async (project: ProjectType) => {
        return await apiRequest("/api/projects", {
          method: "POST", 
          data: project
        });
      },
      onSuccess: (data) => {
        setCurrentProject(data);
        queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
        toast({
          title: "Project created",
          description: "Your new project has been created successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive",
        });
      },
    })
  ).current;

  // Update a project - use useRef to maintain stable reference
  const updateProjectMutation = React.useRef(
    useMutation({
      mutationFn: async (project: Partial<ProjectType>) => {
        if (!currentProject?.id) return undefined;
        return await apiRequest(`/api/projects/${currentProject.id}`, {
          method: "PATCH", 
          data: project
        });
      },
      onSuccess: (data) => {
        if (data) {
          setCurrentProject(prev => prev ? { ...prev, ...data } : data);
          queryClient.invalidateQueries({ queryKey: ['/api/projects', currentProject?.id] });
        }
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update project. Please try again.",
          variant: "destructive",
        });
      },
    })
  ).current;

  // Save all project progress - use useRef to maintain stable reference
  const saveProgressMutation = React.useRef(
    useMutation({
      mutationFn: async () => {
        if (!currentProject?.id) return false;
        
        // Update project
        await apiRequest(`/api/projects/${currentProject.id}`, {
          method: "PATCH",
          data: currentProject
        });
        
        // Save features if any exist - simplified for now
        return true;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/projects', currentProject?.id] });
        toast({
          title: "Progress saved",
          description: "Your project progress has been saved successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }
    })
  ).current;

  // Check if anything is loading
  const isLoading = 
    createProjectMutation.isPending || 
    updateProjectMutation.isPending || 
    saveProgressMutation.isPending;

  // Create a new project - use useCallback to prevent recreating this function
  const createProject = React.useCallback(async (project: ProjectType): Promise<ProjectType> => {
    return createProjectMutation.mutateAsync(project);
  }, [createProjectMutation]);

  // Update the current project - use useCallback to prevent recreating this function
  const updateProject = React.useCallback(async (project: Partial<ProjectType>): Promise<ProjectType | undefined> => {
    return updateProjectMutation.mutateAsync(project);
  }, [updateProjectMutation]);

  // Save all project progress - use useCallback to prevent recreating this function
  const saveProgress = React.useCallback(async (): Promise<boolean> => {
    return saveProgressMutation.mutateAsync();
  }, [saveProgressMutation]);

  // Create a stable value reference to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    currentProject,
    setCurrentProject,
    features,
    setFeatures,
    validationMethods,
    setValidationMethods,
    competitors,
    setCompetitors,
    competitiveFeatures,
    setCompetitiveFeatures,
    milestones,
    setMilestones,
    kpis,
    setKpis,
    flowDiagram,
    setFlowDiagram,
    createProject,
    updateProject,
    saveProgress,
    isLoading,
    showHelp,
    setShowHelp
  }), [
    currentProject, features, validationMethods, competitors,
    competitiveFeatures, milestones, kpis, flowDiagram,
    createProject, updateProject, saveProgress, isLoading, showHelp
  ]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

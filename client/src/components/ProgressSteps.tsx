import React from "react";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { StepType } from "@/contexts/ProjectContext";

interface ProgressStepsProps {
  currentStep: StepType | string;
  projectId?: number;
}

interface Step {
  id: StepType | string;
  name: string;
  number: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, projectId }) => {
  const steps: Step[] = [
    { id: "projectInfo", name: "Project Information", number: 1 },
    { id: "ideaExploration", name: "Idea Exploration", number: 2 },
    { id: "mvpPlan", name: "MVP Plan", number: 3 },
    { id: "flowDiagram", name: "Flow Diagram", number: 4 },
    { id: "powerPoint", name: "PowerPoint", number: 5 },
    { id: "readme", name: "README", number: 6 },
    { id: "reviewExport", name: "Review & Export", number: 7 },
  ];

  const getStepStatus = (step: Step) => {
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === step.id);

    if (stepIndex < currentStepIndex) {
      return "completed";
    } else if (stepIndex === currentStepIndex) {
      return "active";
    } else {
      return "inactive";
    }
  };

  const getStepUrl = (step: Step) => {
    const urlMap: Record<string, string> = {
      "projectInfo": `/project-info/${projectId || ''}`,
      "ideaExploration": `/idea-exploration/${projectId}`,
      "mvpPlan": `/mvp-plan/${projectId}`,
      "flowDiagram": `/flow-diagram/${projectId}`,
      "powerPoint": `/powerpoint/${projectId}`,
      "readme": `/readme/${projectId}`,
      "reviewExport": `/review-export/${projectId}`,
    };

    return urlMap[step.id] || "/";
  };

  return (
    <div className="space-y-3">
      {steps.map((step) => {
        const status = getStepStatus(step);
        
        return (
          <div key={step.id} className="flex items-center">
            <Link href={getStepUrl(step)}>
              <div 
                className={`
                  rounded-full w-8 h-8 flex items-center justify-center text-sm cursor-pointer
                  ${status === 'completed' ? 'bg-secondary text-white' : 
                    status === 'active' ? 'bg-primary text-white' : 
                    'bg-neutral-200 text-neutral-600'}
                `}
              >
                {status === 'completed' ? <Check className="h-4 w-4" /> : step.number}
              </div>
            </Link>
            <div className="ml-3 text-sm font-medium text-neutral-700">{step.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;

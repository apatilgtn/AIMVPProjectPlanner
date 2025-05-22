import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import { ProjectType } from "@/contexts/ProjectContext";

interface ProjectSummaryProps {
  project?: ProjectType | null;
  onViewFullSummary?: () => void;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  project,
  onViewFullSummary,
}) => {
  const { currentProject } = useProject();
  const projectData = project || currentProject;

  if (!projectData) {
    return (
      <div className="text-sm text-neutral-500 italic">
        No project information available
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-neutral-200">
      <h3 className="text-md font-medium text-neutral-800 mb-2">Project Summary</h3>
      <div className="text-sm text-neutral-600 space-y-2">
        <p>
          <span className="font-medium">Project:</span>{" "}
          <span>{projectData.name}</span>
        </p>
        <p>
          <span className="font-medium">Industry:</span>{" "}
          <span>{projectData.industry}</span>
        </p>
        <p>
          <span className="font-medium">Target Audience:</span>{" "}
          <span>{projectData.audience}</span>
        </p>
        {onViewFullSummary && (
          <p 
            className="text-xs text-primary cursor-pointer hover:underline"
            onClick={onViewFullSummary}
          >
            View full details
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectSummary;

import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import ProgressSteps from "@/components/ProgressSteps";
import ProjectSummary from "@/components/ProjectSummary";
import { useLocation, useParams } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarProps {
  currentStep: string;
  projectId?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, projectId }) => {
  const { currentProject } = useProject();
  const [showFullSummary, setShowFullSummary] = React.useState(false);
  
  const handleViewFullSummary = () => {
    setShowFullSummary(true);
  };

  return (
    <aside className="lg:w-1/4 mb-6 lg:mb-0 lg:mr-6">
      <div className="bg-white rounded-lg shadow-md p-4 lg:sticky lg:top-6">
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Your Progress</h2>
        
        {/* Progress Steps Component */}
        <ProgressSteps currentStep={currentStep} projectId={projectId} />
        
        {/* Project Summary Component */}
        {currentProject && (
          <ProjectSummary 
            project={currentProject} 
            onViewFullSummary={handleViewFullSummary}
          />
        )}
      </div>

      {/* Full Summary Dialog */}
      {showFullSummary && currentProject && (
        <Dialog open={showFullSummary} onOpenChange={setShowFullSummary}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
              <DialogDescription>
                Complete overview of your project information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-neutral-800">Project Name</h3>
                <p className="text-neutral-600">{currentProject.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800">Industry</h3>
                <p className="text-neutral-600">{currentProject.industry}</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800">Target Audience</h3>
                <p className="text-neutral-600">{currentProject.audience}</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800">Problem Statement</h3>
                <p className="text-neutral-600">{currentProject.problemStatement}</p>
              </div>
              {currentProject.keyBenefits && currentProject.keyBenefits.length > 0 && (
                <div>
                  <h3 className="font-medium text-neutral-800">Key Benefits</h3>
                  <ul className="list-disc list-inside text-neutral-600">
                    {currentProject.keyBenefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              {currentProject.additionalNotes && (
                <div>
                  <h3 className="font-medium text-neutral-800">Additional Notes</h3>
                  <p className="text-neutral-600">{currentProject.additionalNotes}</p>
                </div>
              )}
            </div>
            <Button onClick={() => setShowFullSummary(false)} className="mt-4">Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </aside>
  );
};

export default Sidebar;

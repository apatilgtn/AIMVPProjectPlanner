import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import PowerPointPreview from "@/components/PowerPointPreview";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

const PowerPoint = () => {
  const { projectId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    currentProject, 
    updateProject,
    saveProgress,
    isLoading 
  } = useProject();

  // Redirect if no project is loaded
  useEffect(() => {
    if (!currentProject && projectId) {
      // In a real app, we would try to fetch the project first
      toast({
        title: "Error",
        description: "No project found. Please start from the beginning.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [currentProject, projectId, navigate, toast]);

  const handlePrevious = async () => {
    if (currentProject) {
      try {
        // Save current progress before navigating
        await updateProject({ currentStep: "flowDiagram" });
        await saveProgress();
        navigate(`/flow-diagram/${projectId}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNext = async () => {
    try {
      // Update project step and save progress
      if (currentProject) {
        await updateProject({ currentStep: "readme" });
        await saveProgress();
        navigate(`/readme/${projectId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export/powerpoint`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Export successful",
          description: `PowerPoint presentation "${data.fileName}" has been generated.`,
        });
      } else {
        throw new Error(data.message || "Export failed");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export PowerPoint",
        variant: "destructive",
      });
    }
  };

  if (!currentProject) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar currentStep="powerPoint" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-neutral-800">PowerPoint Presentation</h2>
            <div className="text-neutral-500 text-sm flex items-center">
              <span className="mr-1">⏱️</span>
              Estimated time: 10-15 min
            </div>
          </div>

          <div className="mb-8">
            <p className="text-neutral-600 mb-6">
              Based on your project information, we've generated a PowerPoint presentation that you can use
              to present your MVP plan to stakeholders, investors, or team members.
            </p>
            
            <div className="mb-6">
              <PowerPointPreview />
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleExport}
                disabled={isLoading}
                className="px-6"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PowerPoint
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between pt-6 mt-8 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous: Flow Diagram
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isLoading}
              className="px-6"
            >
              Next: README
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPoint;

import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import MvpTimeline from "@/components/MvpTimeline";
import KpiDefinition from "@/components/KpiDefinition";
import { ArrowLeft, ArrowRight } from "lucide-react";

const MvpPlan = () => {
  const { projectId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    currentProject, 
    updateProject,
    milestones,
    kpis,
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
        await updateProject({ currentStep: "ideaExploration" });
        await saveProgress();
        navigate(`/idea-exploration/${projectId}`);
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
    // Validate that at least some milestones are defined
    if (milestones.length === 0) {
      toast({
        title: "Incomplete information",
        description: "Please define at least one milestone for your MVP timeline before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Validate that at least one KPI is defined
    if (kpis.length === 0) {
      toast({
        title: "Incomplete information",
        description: "Please define at least one Key Performance Indicator (KPI) before proceeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update project step and save progress
      if (currentProject) {
        await updateProject({ currentStep: "flowDiagram" });
        await saveProgress();
        navigate(`/flow-diagram/${projectId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
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
      <Sidebar currentStep="mvpPlan" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-neutral-800">MVP Plan</h2>
            <div className="text-neutral-500 text-sm flex items-center">
              <span className="mr-1">⏱️</span>
              Estimated time: 15-20 min
            </div>
          </div>

          <div className="mb-8">
            <p className="text-neutral-600 mb-6">
              Now, let's outline your MVP development plan. Define your project timeline and the key performance 
              indicators (KPIs) that will help you measure success.
            </p>
            
            <div className="mb-10">
              <MvpTimeline />
            </div>
            
            <div className="mb-8">
              <KpiDefinition />
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
              Previous: Idea Exploration
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isLoading}
              className="px-6"
            >
              Next: Flow Diagram
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MvpPlan;

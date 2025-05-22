import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import FeatureExploration from "@/components/FeatureExploration";
import ValidationMethods from "@/components/ValidationMethods";
import CompetitorComparison from "@/components/CompetitorComparison";
import { ArrowLeft, ArrowRight } from "lucide-react";

const IdeaExploration = () => {
  const { projectId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    currentProject, 
    updateProject,
    features,
    validationMethods,
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
        await updateProject({ currentStep: "projectInfo" });
        await saveProgress();
        navigate(`/project-info/${projectId}`);
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
    // Validate only if the user has added any features - we can't include 
    // features in the MVP if none exist
    if (features.length > 0) {
      // Validate that at least some features are defined for MVP
      const mvpFeatures = features.filter(f => f.includeInMvp);
      if (mvpFeatures.length === 0) {
        toast({
          title: "Incomplete information",
          description: "Please mark at least one feature to include in your MVP before proceeding.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // No features yet, ask user to add some
      toast({
        title: "Add features",
        description: "Please add at least one feature for your MVP before proceeding.",
        variant: "destructive", 
      });
      return;
    }

    // Only check validation methods if any exist
    if (validationMethods.length > 0) {
      // Validate that at least one validation method is selected
      const selectedMethods = validationMethods.filter(m => m.isSelected);
      if (selectedMethods.length === 0) {
        toast({
          title: "Incomplete information",
          description: "Please select at least one validation method before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // Update project step and save progress
      if (currentProject) {
        await updateProject({ currentStep: "mvpPlan" });
        await saveProgress();
        navigate(`/mvp-plan/${projectId}`);
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
      <Sidebar currentStep="ideaExploration" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-neutral-800">Idea Exploration</h2>
            <div className="text-neutral-500 text-sm flex items-center">
              <span className="mr-1">⏱️</span>
              Estimated time: 15-20 min
            </div>
          </div>

          <div className="mb-8">
            <p className="text-neutral-600 mb-4">
              In this step, we'll explore potential features for your MVP and methods to validate your ideas. 
              Focus on core functionality that addresses your users' primary needs.
            </p>
            
            {/* Feature Exploration Component */}
            <FeatureExploration />
            
            {/* Validation Methods Component */}
            <ValidationMethods />
            
            {/* Competitor Comparison Component */}
            <CompetitorComparison />
          </div>
          
          <div className="flex justify-between pt-6 mt-8 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous: Project Info
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isLoading}
              className="px-6"
            >
              Next: MVP Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaExploration;

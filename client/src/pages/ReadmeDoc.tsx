import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import ReadmePreview from "@/components/ReadmePreview";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

const ReadmeDoc = () => {
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
        await updateProject({ currentStep: "powerPoint" });
        await saveProgress();
        navigate(`/powerpoint/${projectId}`);
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
        await updateProject({ currentStep: "reviewExport" });
        await saveProgress();
        navigate(`/review-export/${projectId}`);
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
      const response = await fetch(`/api/projects/${projectId}/export/readme`);
      const data = await response.json();
      
      if (data.success) {
        // Create a downloadable text blob
        const blob = new Blob([data.content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement("a");
        a.href = url;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export successful",
          description: "README.md has been downloaded",
        });
      } else {
        throw new Error(data.message || "Export failed");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export README",
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
      <Sidebar currentStep="readme" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-neutral-800">README Documentation</h2>
            <div className="text-neutral-500 text-sm flex items-center">
              <span className="mr-1">⏱️</span>
              Estimated time: 10-15 min
            </div>
          </div>

          <div className="mb-8">
            <p className="text-neutral-600 mb-6">
              We've generated README documentation for your project. This provides essential information
              for developers, contributors, and users about your MVP project.
            </p>
            
            <div className="mb-6">
              <ReadmePreview />
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleExport}
                disabled={isLoading}
                className="px-6"
              >
                <Download className="mr-2 h-4 w-4" />
                Export README.md
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
              Previous: PowerPoint
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isLoading}
              className="px-6"
            >
              Next: Review & Export
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadmeDoc;

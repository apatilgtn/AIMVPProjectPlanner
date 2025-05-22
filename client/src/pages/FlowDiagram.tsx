import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import FlowDiagramCreator from "@/components/FlowDiagramCreator";
import { ArrowLeft, ArrowRight, Clock, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const FlowDiagram = () => {
  const { projectId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    currentProject, 
    updateProject,
    flowDiagram,
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
        await updateProject({ currentStep: "mvpPlan" });
        await saveProgress();
        navigate(`/mvp-plan/${projectId}`);
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
    // Validate that a flow diagram is created
    if (!flowDiagram || !flowDiagram.nodes || flowDiagram.nodes.length < 2) {
      toast({
        title: "Incomplete information",
        description: "Please create a flow diagram with at least two nodes before proceeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update project step and save progress
      if (currentProject) {
        await updateProject({ currentStep: "powerPoint" });
        await saveProgress();
        navigate(`/powerpoint/${projectId}`);
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-neutral-600 text-xs">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-screen">
      <Sidebar currentStep="flowDiagram" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter px-0 sm:px-2 max-w-full">
        <Card className="border-0 sm:border shadow-none sm:shadow-sm rounded-none sm:rounded-lg mb-4">
          <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0 gap-4">
            <div>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                Flow Diagram
                <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4 bg-blue-50 text-blue-700 hover:bg-blue-100">
                  Visual Designer
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Create an interactive flow diagram to visualize user journeys
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-neutral-500 text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    15-20 min
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-60">
                  <p className="text-xs">Estimated time to complete this section</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>

          <CardContent className="px-4 pt-0 pb-2">
            <p className="text-xs text-neutral-600 mb-3">
              Create a visual flow diagram that represents the user journey and key interactions with your MVP.
              This will help clarify the user experience and system behavior.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-sm p-2 mb-4">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-medium text-blue-700">How to use the diagram editor</h3>
                  <ul className="text-[11px] text-blue-700 list-disc pl-4 space-y-0.5 mt-1">
                    <li>Click "Add Node" to create new steps in your flow</li>
                    <li>Drag to connect nodes and create transitions</li>
                    <li>Click on any node to edit its properties</li>
                    <li>Use node types to distinguish between different kinds of steps</li>
                    <li>Click the save icon when you've finished creating your diagram</li>
                  </ul>
                </div>
              </div>
            </div>
              
            <FlowDiagramCreator />
              
            <div className="mt-3 text-[11px] text-neutral-500 italic flex items-start">
              <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <p>
                A good user flow should show how users move through your MVP from start to finish, 
                including any decision points or alternative paths.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 py-3 flex justify-between border-t border-neutral-100">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="h-8 text-xs px-3"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Previous: MVP Plan
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isLoading}
              className="h-8 text-xs px-3"
            >
              Next: PowerPoint
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FlowDiagram;

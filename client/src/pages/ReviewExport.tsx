import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import ExportButtons from "@/components/ExportButtons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Home, Check, ChevronRight, Rocket } from "lucide-react";

const ReviewExport = () => {
  const { projectId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    currentProject, 
    features,
    milestones,
    kpis,
    flowDiagram,
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
        await updateProject({ currentStep: "readme" });
        await saveProgress();
        navigate(`/readme/${projectId}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDone = async () => {
    if (currentProject) {
      try {
        // Save progress and mark project as completed
        await saveProgress();
        navigate("/");
        
        toast({
          title: "Congratulations!",
          description: "Your MVP planning is complete. You can now proceed with implementation.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Stats for the project
  const mvpFeatureCount = features.filter(f => f.includeInMvp).length;
  const totalDuration = milestones.reduce((total, m) => total + m.duration, 0);

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
      <Sidebar currentStep="reviewExport" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-neutral-800">Review & Export</h2>
            <div className="text-neutral-500 text-sm flex items-center">
              <span className="mr-1">🎉</span>
              Final Step
            </div>
          </div>

          <div className="mb-8">
            <p className="text-neutral-600 mb-6">
              Congratulations! You've completed planning your MVP. Review your plan and export the documents you need.
            </p>
            
            {/* Project Summary Card */}
            <Card className="mb-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle>{currentProject.name}</CardTitle>
                <CardDescription>
                  {currentProject.industry} • Target Audience: {currentProject.audience}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-md border border-neutral-100 shadow-sm">
                    <p className="text-sm font-medium text-neutral-800">Features</p>
                    <p className="text-xl font-bold text-primary">{mvpFeatureCount}</p>
                    <p className="text-xs text-neutral-500">core MVP features</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-neutral-100 shadow-sm">
                    <p className="text-sm font-medium text-neutral-800">Timeline</p>
                    <p className="text-xl font-bold text-primary">{totalDuration} weeks</p>
                    <p className="text-xs text-neutral-500">estimated development</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-neutral-100 shadow-sm">
                    <p className="text-sm font-medium text-neutral-800">Success Metrics</p>
                    <p className="text-xl font-bold text-primary">{kpis.length}</p>
                    <p className="text-xs text-neutral-500">defined KPIs</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-neutral-800">Project Completeness</p>
                  
                  <div className="space-y-1 text-sm">
                    <ChecklistItem 
                      label="Project Information" 
                      complete={true} 
                    />
                    <ChecklistItem 
                      label="Feature Definition" 
                      complete={features.length > 0} 
                    />
                    <ChecklistItem 
                      label="MVP Timeline" 
                      complete={milestones.length > 0} 
                    />
                    <ChecklistItem 
                      label="Success Metrics" 
                      complete={kpis.length > 0} 
                    />
                    <ChecklistItem 
                      label="Flow Diagram" 
                      complete={!!flowDiagram && flowDiagram.nodes.length > 0} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Export Options */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Export Options</CardTitle>
                <CardDescription>
                  Download your MVP planning materials in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExportButtons projectId={Number(projectId)} />
              </CardContent>
            </Card>
            
            {/* Next Steps */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Implementation Guide</CardTitle>
                <CardDescription>
                  Steps to move forward with your MVP implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 mt-2">
                  <li className="flex">
                    <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-neutral-800">Set Up Development Environment</p>
                      <p className="text-sm text-neutral-600">
                        Create a repository and set up the development environment based on the README documentation.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-neutral-800">Kick-Off Development</p>
                      <p className="text-sm text-neutral-600">
                        Share the PowerPoint presentation with your team and stakeholders to align everyone on the MVP vision.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-neutral-800">Follow the Timeline</p>
                      <p className="text-sm text-neutral-600">
                        Use the milestones you've defined to track progress and stay on schedule.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium text-neutral-800">Measure Success</p>
                      <p className="text-sm text-neutral-600">
                        After launching your MVP, track the KPIs you've defined to measure success and gather insights.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">5</div>
                    <div>
                      <p className="font-medium text-neutral-800">Iterate and Expand</p>
                      <p className="text-sm text-neutral-600">
                        Based on feedback and KPI data, plan the next iteration of your product beyond the MVP.
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between pt-6 mt-8 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous: README
            </Button>
            
            <Button 
              onClick={handleDone} 
              disabled={isLoading}
              className="px-6 bg-green-600 hover:bg-green-700"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Finish & Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChecklistItemProps {
  label: string;
  complete: boolean;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, complete }) => {
  return (
    <div className="flex items-center">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-2 ${
        complete ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'
      }`}>
        {complete ? <Check className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </div>
      <span className={complete ? 'text-neutral-800' : 'text-neutral-500'}>
        {label}
      </span>
    </div>
  );
};

export default ReviewExport;

import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, LineChart, ArrowRight, CheckCircle2, Calendar } from "lucide-react";

const PowerPointPreview: React.FC = () => {
  const { currentProject, features, kpis, milestones, flowDiagram } = useProject();

  // Get features included in MVP
  const mvpFeatures = features.filter(f => f.includeInMvp);
  
  // Select 3 KPIs for the preview
  const topKpis = kpis.slice(0, 3);

  if (!currentProject) {
    return <div>No project data available</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">PowerPoint Preview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slide 1: Title */}
        <PreviewSlide title="Title Slide">
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-bold text-primary mb-2">{currentProject.name}</h1>
            <p className="text-sm text-neutral-600 mb-4">MVP Project Presentation</p>
            <div className="text-xs text-neutral-500">[Company Name]</div>
          </div>
        </PreviewSlide>
        
        {/* Slide 2: Problem Statement */}
        <PreviewSlide title="Problem Statement">
          <div className="h-full flex flex-col p-4">
            <h3 className="text-lg font-medium text-primary mb-3">The Problem</h3>
            <p className="text-sm text-neutral-700 mb-4 flex-grow">
              {currentProject.problemStatement || "Problem statement will appear here"}
            </p>
            
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <Users className="h-4 w-4 text-neutral-500 mr-2" />
                <p className="text-sm font-medium">Target Audience:</p>
              </div>
              <p className="text-xs text-neutral-600 ml-6">{currentProject.audience}</p>
            </div>
          </div>
        </PreviewSlide>
        
        {/* Slide 3: Solution & Features */}
        <PreviewSlide title="Proposed Solution">
          <div className="h-full flex flex-col p-4">
            <h3 className="text-lg font-medium text-primary mb-3">Our Solution</h3>
            
            <div className="space-y-2 flex-grow">
              {mvpFeatures.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{feature.name}</p>
                    {feature.description && (
                      <p className="text-xs text-neutral-500">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {mvpFeatures.length > 4 && (
                <p className="text-xs text-neutral-500 italic">
                  +{mvpFeatures.length - 4} more features...
                </p>
              )}
            </div>
            
            <div className="mt-2 text-xs text-neutral-600">
              <p>Industry: {currentProject.industry}</p>
            </div>
          </div>
        </PreviewSlide>
        
        {/* Slide 4: Flow Diagram */}
        <PreviewSlide title="User Flow">
          <div className="h-full flex flex-col items-center justify-center p-2 bg-neutral-50">
            {flowDiagram && flowDiagram.nodes.length > 0 ? (
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-700 mb-2">{flowDiagram.title}</p>
                <div className="relative w-full h-28 border border-dashed border-neutral-300 rounded-md bg-white flex items-center justify-center">
                  <p className="text-xs text-neutral-500">Flow diagram visualization</p>
                  {/* Simplified visual representation */}
                  <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
                    <div className="flex justify-center items-center space-x-3">
                      <div className="w-12 h-8 bg-green-100 rounded flex items-center justify-center text-xs">Start</div>
                      <ArrowRight className="h-3 w-3 text-neutral-400" />
                      <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-xs">Process</div>
                      <ArrowRight className="h-3 w-3 text-neutral-400" />
                      <div className="w-12 h-8 bg-red-100 rounded flex items-center justify-center text-xs">End</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-neutral-500">Flow diagram will appear here</p>
                <p className="text-xs text-neutral-400">Create your flow diagram in the previous step</p>
              </div>
            )}
          </div>
        </PreviewSlide>
        
        {/* Slide 5: Timeline */}
        <PreviewSlide title="Implementation Timeline">
          <div className="h-full flex flex-col p-4">
            <h3 className="text-lg font-medium text-primary mb-3">Development Roadmap</h3>
            
            <div className="space-y-2 flex-grow">
              {milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="flex">
                  <Calendar className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      {milestone.title || `Milestone ${index + 1}`}
                      <span className="font-normal text-neutral-500 ml-1">
                        ({milestone.duration} {milestone.duration === 1 ? 'week' : 'weeks'})
                      </span>
                    </p>
                    {milestone.description && (
                      <p className="text-xs text-neutral-500">{milestone.description}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {milestones.length > 3 && (
                <p className="text-xs text-neutral-500 italic">
                  +{milestones.length - 3} more milestones...
                </p>
              )}
            </div>
            
            <div className="mt-2 text-xs font-medium text-neutral-700">
              <p>Total Duration: {milestones.reduce((total, m) => total + m.duration, 0)} weeks</p>
            </div>
          </div>
        </PreviewSlide>
        
        {/* Slide 6: KPIs */}
        <PreviewSlide title="Success Metrics">
          <div className="h-full flex flex-col p-4">
            <h3 className="text-lg font-medium text-primary mb-3">Key Performance Indicators</h3>
            
            <div className="space-y-3 flex-grow">
              {topKpis.map((kpi, index) => (
                <div key={index} className="flex">
                  <LineChart className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{kpi.name}</p>
                    <p className="text-xs text-neutral-600">
                      Target: {kpi.target} ({kpi.timeframe})
                    </p>
                  </div>
                </div>
              ))}
              
              {kpis.length > 3 && (
                <p className="text-xs text-neutral-500 italic">
                  +{kpis.length - 3} more KPIs...
                </p>
              )}
            </div>
            
            <div className="mt-2 text-xs text-neutral-600">
              <p>These metrics will help us evaluate the success of our MVP</p>
            </div>
          </div>
        </PreviewSlide>
        
        {/* Slide 7: Next Steps */}
        <PreviewSlide title="Next Steps">
          <div className="h-full flex flex-col p-4">
            <h3 className="text-lg font-medium text-primary mb-3">Moving Forward</h3>
            
            <div className="space-y-2 flex-grow">
              <div className="flex">
                <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">1</div>
                <p className="text-sm text-neutral-700">Launch MVP to target audience</p>
              </div>
              <div className="flex">
                <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">2</div>
                <p className="text-sm text-neutral-700">Collect user feedback and analyze KPIs</p>
              </div>
              <div className="flex">
                <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">3</div>
                <p className="text-sm text-neutral-700">Iterate based on insights</p>
              </div>
              <div className="flex">
                <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">4</div>
                <p className="text-sm text-neutral-700">Plan for next phase of development</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-center font-medium text-primary">
              <p>Thank You!</p>
              <p className="text-xs text-neutral-600 mt-1">Questions & Discussion</p>
            </div>
          </div>
        </PreviewSlide>
      </div>
      
      <div className="text-sm text-neutral-600 italic mt-4">
        <p>
          Note: This is a preview of your PowerPoint presentation. The actual exported file 
          will be professionally formatted and may include additional slides or details based on your project data.
        </p>
      </div>
    </div>
  );
};

interface PreviewSlideProps {
  title: string;
  children: React.ReactNode;
}

const PreviewSlide: React.FC<PreviewSlideProps> = ({ title, children }) => {
  return (
    <Card className="overflow-hidden border border-neutral-200 hover:shadow-md transition-shadow">
      <div className="bg-neutral-100 border-b border-neutral-200 py-1 px-3 flex items-center">
        <FileText className="h-3 w-3 text-neutral-500 mr-2" />
        <p className="text-xs text-neutral-600">{title}</p>
      </div>
      <CardContent className="p-0">
        <div className="aspect-video">{children}</div>
      </CardContent>
    </Card>
  );
};

export default PowerPointPreview;

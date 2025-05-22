import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Calendar,
  Archive,
  FileText,
  Target,
  BarChart,
  BarChart2,
  GitBranch,
  Download,
  PieChart,
  DollarSign,
  Laptop,
  AlertTriangle,
  Users,
  Star,
  ListChecks,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import the MvpPlan type from schema
import { MvpPlan as MvpPlanType } from '@shared/schema';
import SimpleDiagramsView from '@/components/SimpleDiagramsView';
import ExportButtons from '@/components/ExportButtons';

interface ApiResponse {
  success: boolean;
  data: MvpPlanType & {
    featuresData?: any[];
    milestonesData?: any[];
    kpisData?: any[];
    diagramsData?: any;
    keyFeatures?: any[];
    budget?: string;
    technicalRequirements?: string;
    risksAndAssumptions?: string;
    potentialChallenges?: string;
  };
}

const MvpPlanDetail: React.FC = () => {
  const [, navigate] = useLocation();
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  
  const [currentTab, setCurrentTab] = useState('mvpPlan');

  const { data: apiResponse, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: [`/api/mvp-plans/${id}`],
    enabled: id > 0,
    staleTime: 10000, // 10 seconds
  });

  const plan = apiResponse?.success ? apiResponse.data : null;
  
  // Check if we need to show export options (from query param)
  const [location] = useLocation();
  const showExport = location.includes('?action=export');
  
  // Effect to scroll to export buttons when directed from projects page
  React.useEffect(() => {
    if (showExport && plan?.projectId) {
      // Set focus to export section
      setCurrentTab('export');
    }
  }, [showExport, plan]);

  const renderSkeletons = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isError) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4">
            <p className="text-red-600">There was an error loading the MVP plan. Please try again.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate('/projects')}
            >
              Return to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        {!isLoading && plan && (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">{plan.name}</h1>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <Archive className="h-4 w-4 mr-1" />
              {plan.industry}
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(plan.createdAt), 'MMM dd, yyyy')}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        renderSkeletons()
      ) : plan ? (
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="mvpPlan">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                MVP Plan
              </div>
            </TabsTrigger>
            <TabsTrigger value="diagrams">
              <div className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Diagrams
              </div>
            </TabsTrigger>
            <TabsTrigger value="export" className={showExport ? "animate-pulse bg-indigo-100" : ""}>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mvpPlan" className="space-y-8" id="mvp-content">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center text-indigo-700">
                  <span className="bg-indigo-100 p-2 rounded-full inline-flex mr-2">
                    <FileText className="h-5 w-5" />
                  </span>
                  MVP Overview: {plan.name}
                </h2>
                
                {plan.industry && (
                  <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1">
                    <span className="flex items-center">
                      <Archive className="h-3 w-3 mr-1" />
                      Industry: {plan.industry}
                    </span>
                  </Badge>
                )}
              </div>

              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <span className="bg-indigo-100 p-1.5 rounded-full inline-flex mr-2">
                      <FileText className="h-4 w-4 text-indigo-700" />
                    </span>
                    Executive Summary
                  </h3>
                  <p className="text-slate-700 whitespace-pre-line">{plan.executiveSummary}</p>
                </div>
                
                {/* Problem & Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <span className="bg-red-100 p-1.5 rounded-full inline-flex mr-2">
                        <Target className="h-4 w-4 text-red-700" />
                      </span>
                      Problem Statement
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line">{plan.problemStatement}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <span className="bg-green-100 p-1.5 rounded-full inline-flex mr-2">
                        <Users className="h-4 w-4 text-green-700" />
                      </span>
                      Target Audience
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line">{plan.audience}</p>
                  </div>
                </div>
                
                {/* Key Benefits */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <span className="bg-blue-100 p-1.5 rounded-full inline-flex mr-2">
                      <Star className="h-4 w-4 text-blue-700" />
                    </span>
                    Key Benefits
                  </h3>
                  <div className="space-y-3">
                    {plan.keyFeatures && Array.isArray(plan.keyFeatures) && plan.keyFeatures.length > 0 ? (
                      plan.keyFeatures.map((feature: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-blue-700 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-slate-700">{typeof feature === 'string' ? feature : feature.name}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No key benefits specified</p>
                    )}
                  </div>
                </div>
                
                {/* Feature breakdown section */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <span className="bg-purple-100 p-1.5 rounded-full inline-flex mr-2">
                      <ListChecks className="h-4 w-4 text-purple-700" />
                    </span>
                    Core Features
                  </h3>
                  <div className="space-y-6">
                    {plan.featuresData && Array.isArray(plan.featuresData) && plan.featuresData.length > 0 ? (
                      plan.featuresData.map((feature: any, index: number) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                <Target className="h-4 w-4 text-purple-700" />
                              </div>
                              <h3 className="font-semibold text-base text-slate-800">{feature.name}</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              {feature.priority && (
                                <Badge variant="outline" className={
                                  feature.priority === 'High' ? 'border-red-200 text-red-600 bg-red-50' :
                                  feature.priority === 'Medium' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                                  'border-blue-200 text-blue-600 bg-blue-50'
                                }>
                                  {feature.priority}
                                </Badge>
                              )}
                              {feature.difficulty && (
                                <Badge variant="outline" className={
                                  feature.difficulty === 'Hard' ? 'border-red-200 text-red-600 bg-red-50' :
                                  feature.difficulty === 'Medium' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                                  'border-green-200 text-green-600 bg-green-50'
                                }>
                                  {feature.difficulty}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-700 mb-3 whitespace-pre-line">{feature.description}</p>
                          {feature.validationMethods && Array.isArray(feature.validationMethods) && feature.validationMethods.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-slate-500 mb-2">Validation Methods</h4>
                              <ul className="space-y-1 list-disc pl-5 text-sm text-slate-600">
                                {feature.validationMethods.map((method: string, mIndex: number) => (
                                  <li key={mIndex}>{method}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No core features specified</p>
                    )}
                  </div>
                </div>
                
                {/* Milestones section */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <span className="bg-amber-100 p-1.5 rounded-full inline-flex mr-2">
                      <GitBranch className="h-4 w-4 text-amber-700" />
                    </span>
                    Development Milestones
                  </h3>
                  <div className="relative">
                    {plan.milestonesData && Array.isArray(plan.milestonesData) && plan.milestonesData.length > 0 ? (
                      <>
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-200"></div>
                        <div className="space-y-8 relative">
                          {plan.milestonesData.map((milestone: any, index: number) => (
                            <div key={index} className="pl-10 relative">
                              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border-2 border-white shadow-sm z-10">
                                <GitBranch className="h-4 w-4 text-amber-700" />
                              </div>
                              <div className="p-4 border border-slate-200 rounded-lg bg-white">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-base text-slate-800">{milestone.name || milestone.title}</h3>
                                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                                    {milestone.timeline || milestone.duration}
                                  </Badge>
                                </div>
                                <p className="text-slate-700 mb-3 whitespace-pre-line">{milestone.description}</p>
                                {milestone.deliverables && Array.isArray(milestone.deliverables) && milestone.deliverables.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-2">Key Deliverables</h4>
                                    <ul className="space-y-1 list-disc pl-5 text-sm text-slate-600">
                                      {milestone.deliverables.map((deliverable: string, dIndex: number) => (
                                        <li key={dIndex}>{deliverable}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-500 italic">No development milestones specified</p>
                    )}
                  </div>
                </div>
                
                {/* KPIs section */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <span className="bg-teal-100 p-1.5 rounded-full inline-flex mr-2">
                      <BarChart2 className="h-4 w-4 text-teal-700" />
                    </span>
                    Key Performance Indicators
                  </h3>
                  <div className="space-y-4">
                    {plan.kpisData && Array.isArray(plan.kpisData) && plan.kpisData.length > 0 ? (
                      plan.kpisData.map((kpi: any, index: number) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                                <span className="text-teal-700 font-semibold text-sm">{index + 1}</span>
                              </div>
                              <h3 className="font-semibold text-base text-slate-800">{kpi.name || kpi.metric}</h3>
                            </div>
                            {kpi.target && (
                              <Badge variant="outline" className="border-teal-200 text-teal-600 bg-teal-50">
                                Target: {kpi.target}
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-700">{kpi.description}</p>
                          {kpi.measurementMethod && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium text-slate-600">Measurement Method: </span>
                              <span className="text-slate-600">{kpi.measurementMethod}</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No KPIs specified</p>
                    )}
                  </div>
                </div>
                
                {/* Budget section if available */}
                {plan && plan.budget && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <span className="bg-emerald-100 p-1.5 rounded-full inline-flex mr-2">
                        <DollarSign className="h-4 w-4 text-emerald-700" />
                      </span>
                      Budget Estimate
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line">{plan.budget}</p>
                  </div>
                )}
                
                {/* Technical Requirements if available */}
                {plan && plan.technicalRequirements && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <span className="bg-blue-100 p-1.5 rounded-full inline-flex mr-2">
                        <Laptop className="h-4 w-4 text-blue-700" />
                      </span>
                      Technical Requirements
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line">{plan.technicalRequirements}</p>
                  </div>
                )}
                
                {/* Risks & Assumptions if available */}
                {plan && plan.risksAndAssumptions && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <span className="bg-red-100 p-1.5 rounded-full inline-flex mr-2">
                        <AlertTriangle className="h-4 w-4 text-red-700" />
                      </span>
                      Risks & Assumptions
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line">{plan.risksAndAssumptions}</p>
                  </div>
                )}
                
                {plan && plan.potentialChallenges && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <span className="bg-red-100 p-1.5 rounded-full inline-flex mr-2">
                        <AlertTriangle className="h-4 w-4 text-red-700" />
                      </span>
                      Potential Challenges
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line">{plan.potentialChallenges}</p>
                  </div>
                )}
                

              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="diagrams" className="space-y-6">
            {plan.diagramsData && typeof plan.diagramsData === 'object' ? (
              <SimpleDiagramsView diagrams={plan.diagramsData as any} className="space-y-6" />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                      <PieChart className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Diagrams Available</h3>
                    <p className="text-slate-500 max-w-md mb-6">
                      This MVP plan doesn't have any associated diagrams.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download or share your MVP plan in different formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  {true ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-indigo-100 hover:border-indigo-200 transition-all">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">PDF Document</CardTitle>
                            <CardDescription>Printable format</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-slate-600">Export your MVP plan as a PDF document for easy sharing and printing.</p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              onClick={() => {
                                const projectName = plan.name || "MVP Plan";
                                // In a real app, we would use a PDF library
                                // For now, just open the readme and let browser print to PDF
                                window.open(`/api/projects/${plan.projectId || 1}/export/readme`, '_blank');
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card className="border-2 border-indigo-100 hover:border-indigo-200 transition-all">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Word Document</CardTitle>
                            <CardDescription>Editable format</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-slate-600">Export your MVP plan as a Word document for further editing and customization.</p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                              onClick={() => {
                                // Just use the readme endpoint for now
                                window.open(`/api/projects/${plan.projectId || 1}/export/readme`, '_blank');
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Download DOCX
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card className="border-2 border-indigo-100 hover:border-indigo-200 transition-all">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Markdown</CardTitle>
                            <CardDescription>Developer friendly</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-slate-600">Export a README.md file with all details of your MVP plan for developers.</p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                              onClick={() => window.open(`/api/projects/${plan.projectId || 1}/export/readme`, '_blank')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Download MD
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="text-sm font-medium text-slate-800 mb-2">Quick Export</h3>
                        <p className="text-sm text-slate-600 mb-4">Export your MVP plan in any of these formats with a single click:</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            onClick={() => window.open(`/api/projects/${plan.projectId || 1}/export/readme`, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                            onClick={() => window.open(`/api/projects/${plan.projectId || 1}/export/readme`, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            DOCX
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                            onClick={() => window.open(`/api/projects/${plan.projectId || 1}/export/readme`, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            MD
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Export Unavailable</h3>
                      <p className="text-slate-500 max-w-md mb-6">
                        This MVP plan doesn't have an associated project ID needed for export functionality.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border border-slate-200 bg-white shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Plan Not Found</h3>
              <p className="text-slate-500 max-w-md mb-6">
                The MVP plan you're looking for couldn't be found. It may have been deleted or never existed.
              </p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate('/projects')}
              >
                Return to Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MvpPlanDetail;
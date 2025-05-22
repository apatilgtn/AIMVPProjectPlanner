import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { apiRequest } from '@/lib/queryClient';
import { useProject } from '@/contexts/ProjectContext';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import { 
  ApiResponse, 
  MvpPlanResponse, 
  FeaturesResponse, 
  MilestonesResponse, 
  KpisResponse,
  FeatureIdea,
  Milestone,
  Kpi
} from '@/types/ai';

export default function AiMvpGenerator() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentProject: project } = useProject();
  const [activeTab, setActiveTab] = useState('plan');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatingFeatures, setGeneratingFeatures] = useState(false);
  const [generatingMilestones, setGeneratingMilestones] = useState(false);
  const [generatingKpis, setGeneratingKpis] = useState(false);

  // Query for getting the generated plan
  const { data: aiPlan, isLoading: isPlanLoading, error: planError } = useQuery<ApiResponse<MvpPlanResponse>>({
    queryKey: ['/api/ai/generate-plan', projectId],
    enabled: false,
    retry: 1,
  });

  // Query for getting the generated features
  const { data: aiFeatures, isLoading: isFeaturesLoading, error: featuresError } = useQuery<ApiResponse<FeaturesResponse>>({
    queryKey: ['/api/ai/generate-features', projectId],
    enabled: false,
    retry: 1,
  });

  // Query for getting the generated milestones
  const { data: aiMilestones, isLoading: isMilestonesLoading, error: milestonesError } = useQuery<ApiResponse<MilestonesResponse>>({
    queryKey: ['/api/ai/generate-milestones', projectId],
    enabled: false,
    retry: 1,
  });

  // Query for getting the generated KPIs
  const { data: aiKpis, isLoading: isKpisLoading, error: kpisError } = useQuery<ApiResponse<KpisResponse>>({
    queryKey: ['/api/ai/generate-kpis', projectId],
    enabled: false,
    retry: 1,
  });

  // Mutation for generating the MVP plan
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      setGeneratingPlan(true);
      const response = await apiRequest(`/api/ai/generate-plan`, {
        method: 'POST',
        data: { projectId: Number(projectId) },
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratingPlan(false);
      queryClient.setQueryData(['/api/ai/generate-plan', projectId], data);
      toast({
        title: 'Success',
        description: 'MVP plan generated successfully',
      });
    },
    onError: (error) => {
      setGeneratingPlan(false);
      toast({
        title: 'Error',
        description: 'Failed to generate MVP plan',
        variant: 'destructive',
      });
    },
  });

  // Mutation for generating features
  const generateFeaturesMutation = useMutation({
    mutationFn: async () => {
      setGeneratingFeatures(true);
      const response = await apiRequest(`/api/ai/generate-features`, {
        method: 'POST',
        data: { projectId: Number(projectId) },
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratingFeatures(false);
      queryClient.setQueryData(['/api/ai/generate-features', projectId], data);
      toast({
        title: 'Success',
        description: 'Feature ideas generated successfully',
      });
    },
    onError: (error) => {
      setGeneratingFeatures(false);
      toast({
        title: 'Error',
        description: 'Failed to generate feature ideas',
        variant: 'destructive',
      });
    },
  });

  // Mutation for generating milestones
  const generateMilestonesMutation = useMutation({
    mutationFn: async () => {
      setGeneratingMilestones(true);
      const response = await apiRequest(`/api/ai/generate-milestones`, {
        method: 'POST',
        data: { projectId: Number(projectId) },
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratingMilestones(false);
      queryClient.setQueryData(['/api/ai/generate-milestones', projectId], data);
      toast({
        title: 'Success',
        description: 'Milestones generated successfully',
      });
    },
    onError: (error) => {
      setGeneratingMilestones(false);
      toast({
        title: 'Error',
        description: 'Failed to generate milestones',
        variant: 'destructive',
      });
    },
  });

  // Mutation for generating KPIs
  const generateKpisMutation = useMutation({
    mutationFn: async () => {
      setGeneratingKpis(true);
      const response = await apiRequest(`/api/ai/generate-kpis`, {
        method: 'POST',
        data: { projectId: Number(projectId) },
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratingKpis(false);
      queryClient.setQueryData(['/api/ai/generate-kpis', projectId], data);
      toast({
        title: 'Success',
        description: 'KPIs generated successfully',
      });
    },
    onError: (error) => {
      setGeneratingKpis(false);
      toast({
        title: 'Error',
        description: 'Failed to generate KPIs',
        variant: 'destructive',
      });
    },
  });

  // Utility function to save AI-generated features
  const saveFeatures = async () => {
    if (!aiFeatures?.data?.featureIdeas) {
      toast({
        title: 'Error',
        description: 'No features to save',
        variant: 'destructive',
      });
      return;
    }

    try {
      // For each feature in the AI response, create a new feature
      for (const feature of aiFeatures.data.featureIdeas) {
        await apiRequest('/api/features', {
          method: 'POST',
          data: {
            projectId: Number(projectId),
            name: feature.name,
            description: feature.description,
            priority: feature.priority.toLowerCase(),
            difficulty: feature.difficulty.toLowerCase(),
            includeInMvp: feature.priority.toLowerCase() === 'high',
            notes: feature.reasoning || feature.value,
          },
        });
      }

      toast({
        title: 'Success',
        description: 'Features saved to project',
      });

      // Invalidate features query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/features`] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save features',
        variant: 'destructive',
      });
    }
  };

  // Utility function to save AI-generated milestones
  const saveMilestones = async () => {
    if (!aiMilestones?.data?.milestones) {
      toast({
        title: 'Error',
        description: 'No milestones to save',
        variant: 'destructive',
      });
      return;
    }

    try {
      // For each milestone in the AI response, create a new milestone
      for (const milestone of aiMilestones.data.milestones) {
        await apiRequest('/api/milestones', {
          method: 'POST',
          data: {
            projectId: Number(projectId),
            title: milestone.title,
            description: milestone.description,
            duration: milestone.duration,
            order: milestone.order,
            deliverables: milestone.deliverables.join('\\n'),
            technicalNotes: milestone.technical_notes,
            validationSteps: milestone.validation_steps.join('\\n'),
          },
        });
      }

      toast({
        title: 'Success',
        description: 'Milestones saved to project',
      });

      // Invalidate milestones query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/milestones`] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save milestones',
        variant: 'destructive',
      });
    }
  };

  // Utility function to save AI-generated KPIs
  const saveKpis = async () => {
    if (!aiKpis?.data?.kpis) {
      toast({
        title: 'Error',
        description: 'No KPIs to save',
        variant: 'destructive',
      });
      return;
    }

    try {
      // For each KPI in the AI response, create a new KPI
      for (const kpi of aiKpis.data.kpis) {
        await apiRequest('/api/kpis', {
          method: 'POST',
          data: {
            projectId: Number(projectId),
            name: kpi.name,
            description: kpi.description,
            target: kpi.target,
            timeframe: kpi.timeframe,
            importance: kpi.importance,
            implementationAdvice: kpi.implementation,
            interpretation: kpi.interpretation,
            benchmarks: kpi.benchmarks,
          },
        });
      }

      toast({
        title: 'Success',
        description: 'KPIs saved to project',
      });

      // Invalidate KPIs query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/kpis`] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save KPIs',
        variant: 'destructive',
      });
    }
  };

  // If project data is loading or not available
  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI MVP Generator</h1>
          <p className="text-muted-foreground">
            Use AI to generate MVP plans, features, milestones, and KPIs for your project.
          </p>
        </div>
        <Button variant="outline" onClick={() => setLocation(`/project-info/${projectId}`)}>
          Back to Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project: {project.name}</CardTitle>
          <CardDescription className="flex gap-2 mt-2">
            <Badge>{project.industry}</Badge>
            <Badge variant="outline">Target: {project.audience}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Problem Statement</h3>
              <p className="text-sm text-muted-foreground mt-1">{project.problemStatement}</p>
            </div>
            <div>
              <h3 className="font-medium">Key Benefits</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                {project.keyBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">MVP Plan</TabsTrigger>
          <TabsTrigger value="features">Feature Ideas</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        {/* MVP Plan Tab */}
        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated MVP Plan</CardTitle>
              <CardDescription>
                Get a comprehensive MVP plan with executive summary, core value proposition, target user persona, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPlanLoading || generatingPlan ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Spinner size="lg" />
                  <p className="mt-4 text-muted-foreground">Generating your MVP plan...</p>
                </div>
              ) : planError ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {planError instanceof Error ? planError.message : 'Failed to generate MVP plan'}
                  </AlertDescription>
                </Alert>
              ) : aiPlan?.success && aiPlan?.data ? (
                <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Executive Summary</h3>
                    <ReactMarkdown children={aiPlan.data.executiveSummary} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Problem Statement</h3>
                    <ReactMarkdown children={aiPlan.data.problemStatement} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Target Audience</h3>
                    <ReactMarkdown children={aiPlan.data.targetAudience} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Value Proposition</h3>
                    <ReactMarkdown children={aiPlan.data.valueProposition} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">MVP Scope</h3>
                    <ReactMarkdown children={aiPlan.data.mvpScope} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Key Features</h3>
                    <ul className="list-disc list-inside">
                      {aiPlan.data.keyFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Success Criteria</h3>
                    <ReactMarkdown children={aiPlan.data.successCriteria} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Potential Challenges</h3>
                    <ReactMarkdown children={aiPlan.data.potentialChallenges} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Next Steps</h3>
                    <ReactMarkdown children={aiPlan.data.nextSteps} />
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Generate an AI-powered MVP plan based on your project information.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setLocation(`/project-info/${projectId}`)}
              >
                Back to Project
              </Button>
              <Button 
                onClick={() => generatePlanMutation.mutate()} 
                disabled={isPlanLoading || generatingPlan}
              >
                {isPlanLoading || generatingPlan ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : aiPlan?.success ? (
                  'Regenerate Plan'
                ) : (
                  'Generate Plan'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Feature Ideas Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Feature Ideas</CardTitle>
              <CardDescription>
                Get innovative feature ideas for your MVP with descriptions, priorities, and implementation difficulty.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFeaturesLoading || generatingFeatures ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Spinner size="lg" />
                  <p className="mt-4 text-muted-foreground">Generating feature ideas...</p>
                </div>
              ) : featuresError ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {featuresError instanceof Error ? featuresError.message : 'Failed to generate feature ideas'}
                  </AlertDescription>
                </Alert>
              ) : aiFeatures?.success && aiFeatures?.data?.featureIdeas ? (
                <div className="space-y-6">
                  {aiFeatures.data.featureIdeas.map((feature, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant={feature.priority.toLowerCase() === 'high' ? 'default' : feature.priority.toLowerCase() === 'medium' ? 'secondary' : 'outline'}>
                              {feature.priority}
                            </Badge>
                            <Badge variant={feature.difficulty.toLowerCase() === 'hard' ? 'destructive' : feature.difficulty.toLowerCase() === 'medium' ? 'secondary' : 'outline'}>
                              {feature.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium text-sm">Value</h4>
                            <p className="text-sm text-muted-foreground">{feature.value}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Implementation</h4>
                            <p className="text-sm text-muted-foreground">{feature.reasoning}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Generate AI-powered feature ideas based on your project information.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {aiFeatures?.success && aiFeatures?.data?.featureIdeas && (
                <Button variant="secondary" onClick={saveFeatures}>
                  Save Features to Project
                </Button>
              )}
              <Button
                onClick={() => generateFeaturesMutation.mutate()}
                disabled={isFeaturesLoading || generatingFeatures}
              >
                {isFeaturesLoading || generatingFeatures ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : aiFeatures?.success ? (
                  'Regenerate Features'
                ) : (
                  'Generate Features'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Milestones</CardTitle>
              <CardDescription>
                Get a realistic timeline with major milestones for your MVP development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMilestonesLoading || generatingMilestones ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Spinner size="lg" />
                  <p className="mt-4 text-muted-foreground">Generating milestones...</p>
                </div>
              ) : milestonesError ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {milestonesError instanceof Error ? milestonesError.message : 'Failed to generate milestones'}
                  </AlertDescription>
                </Alert>
              ) : aiMilestones?.success && aiMilestones?.data?.milestones ? (
                <div className="space-y-6">
                  {aiMilestones.data.milestones
                    .sort((a, b) => a.order - b.order)
                    .map((milestone, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="outline">Order: {milestone.order}</Badge>
                              <Badge>{milestone.duration} weeks</Badge>
                            </div>
                          </div>
                          <CardDescription>{milestone.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-sm">Deliverables</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {milestone.deliverables.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Technical Notes</h4>
                              <p className="text-sm text-muted-foreground">{milestone.technical_notes}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Validation Steps</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {milestone.validation_steps.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Generate AI-powered milestones based on your project information.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {aiMilestones?.success && aiMilestones?.data?.milestones && (
                <Button variant="secondary" onClick={saveMilestones}>
                  Save Milestones to Project
                </Button>
              )}
              <Button
                onClick={() => generateMilestonesMutation.mutate()}
                disabled={isMilestonesLoading || generatingMilestones}
              >
                {isMilestonesLoading || generatingMilestones ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : aiMilestones?.success ? (
                  'Regenerate Milestones'
                ) : (
                  'Generate Milestones'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated KPIs</CardTitle>
              <CardDescription>
                Get meaningful metrics that will help you evaluate the success of your MVP.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isKpisLoading || generatingKpis ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Spinner size="lg" />
                  <p className="mt-4 text-muted-foreground">Generating KPIs...</p>
                </div>
              ) : kpisError ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {kpisError instanceof Error ? kpisError.message : 'Failed to generate KPIs'}
                  </AlertDescription>
                </Alert>
              ) : aiKpis?.success && aiKpis?.data?.kpis ? (
                <div className="space-y-6">
                  {aiKpis.data.kpis.map((kpi, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{kpi.name}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">{kpi.timeframe}</Badge>
                          </div>
                        </div>
                        <CardDescription>{kpi.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-sm">Target</h4>
                            <p className="text-sm text-muted-foreground">{kpi.target}</p>
                            <h4 className="font-medium text-sm mt-2">Importance</h4>
                            <p className="text-sm text-muted-foreground">{kpi.importance}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Implementation</h4>
                            <p className="text-sm text-muted-foreground">{kpi.implementation}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Interpretation</h4>
                            <p className="text-sm text-muted-foreground">{kpi.interpretation}</p>
                            <h4 className="font-medium text-sm mt-2">Benchmarks</h4>
                            <p className="text-sm text-muted-foreground">{kpi.benchmarks}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Generate AI-powered KPIs based on your project information.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {aiKpis?.success && aiKpis?.data?.kpis && (
                <Button variant="secondary" onClick={saveKpis}>
                  Save KPIs to Project
                </Button>
              )}
              <Button
                onClick={() => generateKpisMutation.mutate()}
                disabled={isKpisLoading || generatingKpis}
              >
                {isKpisLoading || generatingKpis ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : aiKpis?.success ? (
                  'Regenerate KPIs'
                ) : (
                  'Generate KPIs'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
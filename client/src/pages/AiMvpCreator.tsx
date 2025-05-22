import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { MvpPlanResponse, FeaturesResponse, MilestonesResponse, KpisResponse } from '@/types/ai';
import { toast } from '@/hooks/use-toast';

// Define schema for form validation
const formSchema = z.object({
  projectName: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
  industry: z.string().min(2, { message: 'Industry must be at least 2 characters' }),
  targetAudience: z.string().min(2, { message: 'Target audience must be at least 2 characters' }),
  problemStatement: z.string().min(10, { message: 'Problem statement must be at least 10 characters' }),
  keyBenefits: z.string().min(10, { message: 'Key benefits must be at least 10 characters' }),
  additionalNotes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AiMvpCreator() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('input');
  const [aiPlan, setAiPlan] = useState<{ success: boolean; data: MvpPlanResponse } | null>(null);
  const [aiFeatures, setAiFeatures] = useState<{ success: boolean; data: FeaturesResponse } | null>(null);
  const [aiMilestones, setAiMilestones] = useState<{ success: boolean; data: MilestonesResponse } | null>(null);
  const [aiKpis, setAiKpis] = useState<{ success: boolean; data: KpisResponse } | null>(null);
  
  // Form handling
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      industry: '',
      targetAudience: '',
      problemStatement: '',
      keyBenefits: '',
      additionalNotes: ''
    }
  });

  // Generate MVP Plan Mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform keyBenefits string into array
      const keyBenefitsArray = data.keyBenefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');
      
      return await apiRequest('/api/ai/generate-plan', {
        method: 'POST',
        data: {
          ...data,
          keyBenefits: keyBenefitsArray
        }
      });
    },
    onSuccess: (data) => {
      setAiPlan(data);
      
      // If plan generation is successful, trigger feature, milestone, and KPI generation
      if (data.success) {
        generateFeaturesMutation.mutate(form.getValues());
        generateMilestonesMutation.mutate(form.getValues());
        generateKpisMutation.mutate(form.getValues());
        setActiveTab('plan');
        toast({
          title: 'MVP Plan Generated',
          description: 'Your MVP plan has been generated successfully.'
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate MVP plan',
        variant: 'destructive'
      });
    }
  });

  // Generate Features Mutation
  const generateFeaturesMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform keyBenefits string into array
      const keyBenefitsArray = data.keyBenefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');
      
      return await apiRequest('/api/ai/generate-features', {
        method: 'POST',
        data: {
          ...data,
          keyBenefits: keyBenefitsArray
        }
      });
    },
    onSuccess: (data) => {
      setAiFeatures(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate features',
        variant: 'destructive'
      });
    }
  });

  // Generate Milestones Mutation
  const generateMilestonesMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform keyBenefits string into array
      const keyBenefitsArray = data.keyBenefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');
      
      return await apiRequest('/api/ai/generate-milestones', {
        method: 'POST',
        data: {
          ...data,
          keyBenefits: keyBenefitsArray
        }
      });
    },
    onSuccess: (data) => {
      setAiMilestones(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate milestones',
        variant: 'destructive'
      });
    }
  });

  // Generate KPIs Mutation
  const generateKpisMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform keyBenefits string into array
      const keyBenefitsArray = data.keyBenefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');
      
      return await apiRequest('/api/ai/generate-kpis', {
        method: 'POST',
        data: {
          ...data,
          keyBenefits: keyBenefitsArray
        }
      });
    },
    onSuccess: (data) => {
      setAiKpis(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate KPIs',
        variant: 'destructive'
      });
    }
  });

  // Export to PDF
  const exportToPdf = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'PDF export will be available in the next update.'
    });
  };

  // Export to Markdown
  const exportToMarkdown = () => {
    let markdownContent = `# MVP Plan: ${form.getValues().projectName}\n\n`;
    
    if (aiPlan?.success && aiPlan.data) {
      markdownContent += `## Executive Summary\n${aiPlan.data.executiveSummary}\n\n`;
      markdownContent += `## Problem Statement\n${aiPlan.data.problemStatement}\n\n`;
      markdownContent += `## Target Audience\n${aiPlan.data.targetAudience}\n\n`;
      markdownContent += `## Value Proposition\n${aiPlan.data.valueProposition}\n\n`;
      markdownContent += `## MVP Scope\n${aiPlan.data.mvpScope}\n\n`;
      
      markdownContent += `## Key Features\n`;
      aiPlan.data.keyFeatures.forEach(feature => {
        markdownContent += `- ${feature}\n`;
      });
      markdownContent += '\n';
      
      markdownContent += `## Success Criteria\n${aiPlan.data.successCriteria}\n\n`;
      markdownContent += `## Potential Challenges\n${aiPlan.data.potentialChallenges}\n\n`;
      markdownContent += `## Next Steps\n${aiPlan.data.nextSteps}\n\n`;
    }
    
    if (aiFeatures?.success && aiFeatures.data?.featureIdeas) {
      markdownContent += `## Detailed Feature Breakdown\n\n`;
      aiFeatures.data.featureIdeas.forEach(feature => {
        markdownContent += `### ${feature.name}\n`;
        markdownContent += `**Priority:** ${feature.priority} | **Difficulty:** ${feature.difficulty}\n\n`;
        markdownContent += `${feature.description}\n\n`;
        markdownContent += `**Value:** ${feature.value}\n\n`;
        markdownContent += `**Implementation Notes:** ${feature.reasoning}\n\n`;
      });
    }
    
    if (aiMilestones?.success && aiMilestones.data?.milestones) {
      markdownContent += `## Development Timeline\n\n`;
      aiMilestones.data.milestones
        .sort((a, b) => a.order - b.order)
        .forEach(milestone => {
          markdownContent += `### ${milestone.title} (${milestone.duration} weeks)\n`;
          markdownContent += `${milestone.description}\n\n`;
          
          markdownContent += `**Deliverables:**\n`;
          milestone.deliverables.forEach(item => {
            markdownContent += `- ${item}\n`;
          });
          markdownContent += '\n';
          
          markdownContent += `**Technical Notes:** ${milestone.technical_notes}\n\n`;
          
          markdownContent += `**Validation Steps:**\n`;
          milestone.validation_steps.forEach(item => {
            markdownContent += `- ${item}\n`;
          });
          markdownContent += '\n';
        });
    }
    
    if (aiKpis?.success && aiKpis.data?.kpis) {
      markdownContent += `## Key Performance Indicators\n\n`;
      aiKpis.data.kpis.forEach(kpi => {
        markdownContent += `### ${kpi.name}\n`;
        markdownContent += `${kpi.description}\n\n`;
        markdownContent += `**Target:** ${kpi.target}\n`;
        markdownContent += `**Timeframe:** ${kpi.timeframe}\n`;
        markdownContent += `**Implementation Guide:** ${kpi.implementation_advice}\n\n`;
      });
    }
    
    // Create a blob and download
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.getValues().projectName.replace(/\s+/g, '_')}_MVP_Plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Successful',
      description: 'Your MVP plan has been exported to Markdown.'
    });
  };

  // Generate all plans together
  const onSubmit = (data: FormValues) => {
    generatePlanMutation.mutate(data);
  };

  const isGenerating = 
    generatePlanMutation.isPending || 
    generateFeaturesMutation.isPending || 
    generateMilestonesMutation.isPending || 
    generateKpisMutation.isPending;

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI MVP Plan Creator</h1>
            <p className="text-muted-foreground">
              Generate a complete MVP plan using AI
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Project Input</TabsTrigger>
            <TabsTrigger value="plan" disabled={!aiPlan?.success}>MVP Plan</TabsTrigger>
            <TabsTrigger value="export" disabled={!aiPlan?.success}>Export</TabsTrigger>
          </TabsList>

          {/* Input Form Tab */}
          <TabsContent value="input" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Provide basic information about your project to generate a complete MVP plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., TaskMaster Pro" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your product or service
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Productivity, Healthcare, E-commerce" {...field} />
                          </FormControl>
                          <FormDescription>
                            The industry your product serves
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Small business owners, Students, Remote workers" {...field} />
                          </FormControl>
                          <FormDescription>
                            The primary users of your product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="problemStatement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Statement</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What specific problem does your MVP solve?" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Clearly describe the problem your product addresses
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="keyBenefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Benefits</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List the main benefits of your product, one per line" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The main value propositions of your product (one per line)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other information that might be helpful" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Constraints, technical requirements, or other relevant details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Generating MVP Plan...
                        </>
                      ) : (
                        'Generate Complete MVP Plan'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MVP Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            {/* MVP Overview */}
            <Card>
              <CardHeader>
                <CardTitle>MVP Overview</CardTitle>
                <CardDescription>
                  Complete plan for {form.getValues().projectName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!aiPlan?.success ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to generate MVP plan. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert space-y-6">
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>
                  Prioritized features for your MVP
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generateFeaturesMutation.isPending ? (
                  <div className="flex justify-center py-6">
                    <Spinner size="lg" />
                  </div>
                ) : !aiFeatures?.success ? (
                  <div className="grid grid-cols-1 gap-4">
                    {aiPlan?.success && (
                      <ul className="list-disc list-inside pl-4 space-y-2">
                        {aiPlan.data.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiFeatures.data.featureIdeas.map((feature, index) => (
                      <Card key={index} className="border shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{feature.name}</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant={feature.priority.toLowerCase() === 'high' ? 'default' : feature.priority.toLowerCase() === 'medium' ? 'secondary' : 'outline'}>
                                {feature.priority}
                              </Badge>
                              <Badge variant={feature.difficulty.toLowerCase() === 'hard' ? 'destructive' : feature.difficulty.toLowerCase() === 'medium' ? 'secondary' : 'outline'}>
                                {feature.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="text-xs mt-1">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs">
                          <p className="font-semibold mt-1">Value:</p>
                          <p className="text-muted-foreground">{feature.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <Card>
              <CardHeader>
                <CardTitle>Development Timeline</CardTitle>
                <CardDescription>
                  Suggested milestones for your MVP development
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generateMilestonesMutation.isPending ? (
                  <div className="flex justify-center py-6">
                    <Spinner size="lg" />
                  </div>
                ) : !aiMilestones?.success ? (
                  <Alert>
                    <AlertTitle>Timeline Unavailable</AlertTitle>
                    <AlertDescription>
                      Timeline information couldn't be generated. Please try refreshing.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    {aiMilestones.data.milestones
                      .sort((a, b) => a.order - b.order)
                      .map((milestone, index) => (
                        <Card key={index} className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{milestone.title}</CardTitle>
                              <Badge>{milestone.duration} weeks</Badge>
                            </div>
                            <CardDescription className="text-xs mt-1">
                              {milestone.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-xs">
                            <div className="space-y-2">
                              <div>
                                <p className="font-semibold">Deliverables:</p>
                                <ul className="list-disc list-inside pl-2">
                                  {milestone.deliverables.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KPIs Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>
                  Metrics to measure the success of your MVP
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generateKpisMutation.isPending ? (
                  <div className="flex justify-center py-6">
                    <Spinner size="lg" />
                  </div>
                ) : !aiKpis?.success ? (
                  <Alert>
                    <AlertTitle>KPIs Unavailable</AlertTitle>
                    <AlertDescription>
                      KPI information couldn't be generated. Please try refreshing.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiKpis.data.kpis.map((kpi, index) => (
                      <Card key={index} className="border shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{kpi.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {kpi.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs space-y-2">
                          <div>
                            <p className="font-semibold">Target:</p>
                            <p className="text-muted-foreground">{kpi.target}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Timeframe:</p>
                            <p className="text-muted-foreground">{kpi.timeframe}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('export')}
                >
                  Export Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Your MVP Plan</CardTitle>
                <CardDescription>
                  Download your plan in different formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Markdown Export</CardTitle>
                      <CardDescription>
                        Export your plan as a Markdown file
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Download a complete Markdown document with all sections of your MVP plan. 
                        Perfect for sharing on GitHub or other platforms that support Markdown.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={exportToMarkdown}
                      >
                        Export as Markdown
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">PDF Export</CardTitle>
                      <CardDescription>
                        Export your plan as a professional PDF
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Generate a well-formatted PDF document suitable for presentations and 
                        sharing with stakeholders. Includes all sections in a professional layout.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={exportToPdf}
                        disabled={true}
                      >
                        Coming Soon
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('plan')}
                >
                  Back to Plan
                </Button>
                <Button
                  onClick={() => setLocation('/')}
                >
                  Start New Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
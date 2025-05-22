import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'wouter';
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
import { Progress } from '@/components/ui/progress';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { MvpPlanResponse, FeaturesResponse, MilestonesResponse, KpisResponse, DiagramsResponse } from '@/types/ai';
import { toast } from '@/hooks/use-toast';
import { exportToPdf, exportToDocx } from '@/lib/documentUtils';
import DiagramsView from '@/components/DiagramsView';
import SimpleDiagramsView from '@/components/SimpleDiagramsView';
import { insertMvpPlanSchema } from '@shared/schema';
import { 
  BrainCircuit, 
  Sparkles, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  BarChart4, 
  Download, 
  Timer, 
  Clock,
  Rocket,
  Zap,
  FileText,
  Network,
  File,
  Eye,
  ArrowLeft
} from 'lucide-react';

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

export default function SimpleMvpCreator() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('input');
  const [aiPlan, setAiPlan] = useState<{ success: boolean; data: MvpPlanResponse } | null>(null);
  const [aiFeatures, setAiFeatures] = useState<{ success: boolean; data: FeaturesResponse } | null>(null);
  const [aiMilestones, setAiMilestones] = useState<{ success: boolean; data: MilestonesResponse } | null>(null);
  const [aiKpis, setAiKpis] = useState<{ success: boolean; data: KpisResponse } | null>(null);
  const [aiDiagrams, setAiDiagrams] = useState<{ success: boolean; data: DiagramsResponse } | null>(null);
  const [generationSteps, setGenerationSteps] = useState<{
    plan: 'idle' | 'loading' | 'complete' | 'error';
    features: 'idle' | 'loading' | 'complete' | 'error';
    milestones: 'idle' | 'loading' | 'complete' | 'error';
    kpis: 'idle' | 'loading' | 'complete' | 'error';
    diagrams: 'idle' | 'loading' | 'complete' | 'error';
  }>({
    plan: 'idle',
    features: 'idle',
    milestones: 'idle',
    kpis: 'idle',
    diagrams: 'idle'
  });
  
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
      
      setGenerationSteps(prev => ({ ...prev, plan: 'loading' }));
      
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
      setGenerationSteps(prev => ({ ...prev, plan: 'complete' }));
      
      // If plan generation is successful, trigger feature, milestone, and KPI generation
      if (data.success) {
        generateFeaturesMutation.mutate(form.getValues());
        generateMilestonesMutation.mutate(form.getValues());
        generateKpisMutation.mutate(form.getValues());
        setActiveTab('generation');
      }
    },
    onError: (error) => {
      setGenerationSteps(prev => ({ ...prev, plan: 'error' }));
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
      
      setGenerationSteps(prev => ({ ...prev, features: 'loading' }));
      
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
      setGenerationSteps(prev => ({ ...prev, features: 'complete' }));
      checkAllComplete();
    },
    onError: (error) => {
      setGenerationSteps(prev => ({ ...prev, features: 'error' }));
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
      
      setGenerationSteps(prev => ({ ...prev, milestones: 'loading' }));
      
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
      setGenerationSteps(prev => ({ ...prev, milestones: 'complete' }));
      checkAllComplete();
    },
    onError: (error) => {
      setGenerationSteps(prev => ({ ...prev, milestones: 'error' }));
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
      
      setGenerationSteps(prev => ({ ...prev, kpis: 'loading' }));
      
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
      setGenerationSteps(prev => ({ ...prev, kpis: 'complete' }));
      // Start generating diagrams once KPIs are done
      if (data.success) {
        generateDiagramsMutation.mutate(form.getValues());
      }
      checkAllComplete();
    },
    onError: (error) => {
      setGenerationSteps(prev => ({ ...prev, kpis: 'error' }));
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate KPIs',
        variant: 'destructive'
      });
    }
  });
  
  // Generate Diagrams Mutation
  const generateDiagramsMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform keyBenefits string into array
      const keyBenefitsArray = data.keyBenefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');
      
      // Combine the features from the AI-generated features if available
      const features = aiFeatures?.success && aiFeatures.data?.featureIdeas 
        ? aiFeatures.data.featureIdeas.map(f => ({
            name: f.name,
            description: f.description,
            priority: f.priority,
            difficulty: f.difficulty
          }))
        : [];
      
      setGenerationSteps(prev => ({ ...prev, diagrams: 'loading' }));
      
      return await apiRequest('/api/ai/generate-diagrams', {
        method: 'POST',
        data: {
          ...data,
          keyBenefits: keyBenefitsArray,
          features
        }
      });
    },
    onSuccess: (data) => {
      setAiDiagrams(data);
      setGenerationSteps(prev => ({ ...prev, diagrams: 'complete' }));
      checkAllComplete();
    },
    onError: (error) => {
      setGenerationSteps(prev => ({ ...prev, diagrams: 'error' }));
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate diagrams',
        variant: 'destructive'
      });
    }
  });

  // Save generated MVP plan to database
  const saveMvpPlanMutation = useMutation({
    mutationFn: async () => {
      const formValues = form.getValues();
      
      if (!aiPlan?.success || !aiPlan.data) {
        throw new Error('MVP Plan not generated yet');
      }
      
      // Prepare plan data for saving
      const planData = {
        name: formValues.projectName,
        industry: formValues.industry,
        audience: formValues.targetAudience,
        problemStatement: formValues.problemStatement,
        executiveSummary: aiPlan.data.executiveSummary,
        valueProposition: aiPlan.data.valueProposition,
        mvpScope: aiPlan.data.mvpScope,
        keyFeatures: aiPlan.data.keyFeatures,
        successCriteria: aiPlan.data.successCriteria,
        potentialChallenges: aiPlan.data.potentialChallenges,
        nextSteps: aiPlan.data.nextSteps,
        featuresData: aiFeatures?.success ? aiFeatures.data : null,
        milestonesData: aiMilestones?.success ? aiMilestones.data : null,
        kpisData: aiKpis?.success ? aiKpis.data : null,
        diagramsData: aiDiagrams?.success ? aiDiagrams.data : null
      };
      
      return await apiRequest('/api/mvp-plans', {
        method: 'POST',
        data: planData
      });
    },
    onSuccess: () => {
      toast({
        title: 'Plan Saved',
        description: 'Your MVP plan has been saved to the database'
      });
    },
    onError: (error) => {
      console.error('Error saving MVP plan:', error);
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your MVP plan',
        variant: 'destructive'
      });
    }
  });

  // Effect to handle restoration of state when returning from diagrams view
  useEffect(() => {
    // Check if we're returning from diagrams view
    const returnFlag = sessionStorage.getItem('navigatingToDiagrams');
    
    if (returnFlag === 'true') {
      // We're returning from diagrams, restore the saved state
      try {
        // Restore form values
        const savedFormValues = JSON.parse(sessionStorage.getItem('mvpFormValues') || '{}');
        if (savedFormValues.projectName) {
          Object.entries(savedFormValues).forEach(([key, value]) => {
            form.setValue(key as any, value as any);
          });
        }
        
        // Restore generated data
        const savedPlanData = sessionStorage.getItem('aiPlanData');
        if (savedPlanData) {
          setAiPlan({ success: true, data: JSON.parse(savedPlanData) });
        }
        
        const savedFeaturesData = sessionStorage.getItem('aiFeaturesData');
        if (savedFeaturesData) {
          setAiFeatures({ success: true, data: JSON.parse(savedFeaturesData) });
        }
        
        const savedMilestonesData = sessionStorage.getItem('aiMilestonesData');
        if (savedMilestonesData) {
          setAiMilestones({ success: true, data: JSON.parse(savedMilestonesData) });
        }
        
        const savedKpisData = sessionStorage.getItem('aiKpisData');
        if (savedKpisData) {
          setAiKpis({ success: true, data: JSON.parse(savedKpisData) });
        }
        
        const savedDiagramsData = sessionStorage.getItem('aiDiagramsData');
        if (savedDiagramsData) {
          setAiDiagrams({ success: true, data: JSON.parse(savedDiagramsData) });
        }
        
        // Restore active tab
        const savedActiveTab = sessionStorage.getItem('activeTab');
        if (savedActiveTab) {
          setActiveTab(savedActiveTab);
        }
        
        // Set generation steps to complete for all steps that have data
        const newGenerationSteps = { ...generationSteps };
        if (savedPlanData) newGenerationSteps.plan = 'complete';
        if (savedFeaturesData) newGenerationSteps.features = 'complete';
        if (savedMilestonesData) newGenerationSteps.milestones = 'complete';
        if (savedKpisData) newGenerationSteps.kpis = 'complete';
        if (savedDiagramsData) newGenerationSteps.diagrams = 'complete';
        setGenerationSteps(newGenerationSteps);
        
        // Clear navigation flag
        sessionStorage.removeItem('navigatingToDiagrams');
      } catch (error) {
        console.error('Error restoring data from session storage:', error);
      }
    }
  }, [form]);

  // Check if all generations are complete
  const checkAllComplete = () => {
    if (
      generationSteps.plan === 'complete' &&
      generationSteps.features === 'complete' &&
      generationSteps.milestones === 'complete' &&
      generationSteps.kpis === 'complete' &&
      generationSteps.diagrams === 'complete'
    ) {
      // Delay to allow user to see the completion
      setTimeout(() => {
        setActiveTab('plan');
        
        // Save the plan to the database
        saveMvpPlanMutation.mutate();
        
        toast({
          title: 'MVP Plan Generated',
          description: 'Your complete MVP plan has been generated successfully!'
        });
      }, 1000);
    }
  };

  // Export to PDF
  const handlePdfExport = async () => {
    try {
      await exportToPdf(
        form.getValues().projectName,
        aiPlan,
        aiFeatures,
        aiMilestones,
        aiKpis,
        aiDiagrams
      );
      
      toast({
        title: 'PDF Generated',
        description: 'Your MVP plan has been exported as a PDF'
      });
    } catch (error) {
      console.error('PDF export error:', error);
      
      toast({
        title: 'Export Failed',
        description: 'There was an error generating your PDF. Please try again.',
        variant: 'destructive'
      });
    }
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
        markdownContent += `**Implementation Guide:** ${kpi.implementation_advice || kpi.implementation}\n\n`;
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

  // Calculate overall progress
  const calculateProgress = () => {
    const steps = [
      generationSteps.plan,
      generationSteps.features,
      generationSteps.milestones,
      generationSteps.kpis,
      generationSteps.diagrams
    ];
    
    const completedSteps = steps.filter(step => step === 'complete').length;
    const loadingSteps = steps.filter(step => step === 'loading').length;
    
    // Each step counts for 20% of the total (5 steps total)
    // Complete steps count fully, loading steps count as half completed
    return (completedSteps * 20) + (loadingSteps * 10);
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3 text-slate-800">
            Create Your MVP Plan
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Transform your idea into a complete MVP plan in minutes. Just fill in the details below and let our AI do the heavy lifting.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1">
            <TabsTrigger 
              value="input" 
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              Project Input
            </TabsTrigger>
            <TabsTrigger 
              value="generation" 
              disabled={generationSteps.plan !== 'loading' && generationSteps.plan !== 'complete'}
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generation
            </TabsTrigger>
            <TabsTrigger 
              value="plan" 
              disabled={!aiPlan?.success}
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              MVP Plan
            </TabsTrigger>
            <TabsTrigger 
              value="diagrams" 
              disabled={!aiDiagrams?.success}
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Network className="mr-2 h-4 w-4" />
              Diagrams
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              disabled={!aiPlan?.success}
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Input Form Tab */}
          <TabsContent value="input" className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-indigo-600" />
                  Project Information
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Provide basic information about your project to generate a complete MVP plan
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Project Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., TaskMaster Pro" 
                                {...field} 
                                className="bg-white border-slate-300 focus:border-indigo-400" 
                              />
                            </FormControl>
                            <FormDescription className="text-slate-500 text-xs">
                              The name of your product or service
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Industry</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Productivity, Healthcare, E-commerce" 
                                {...field} 
                                className="bg-white border-slate-300 focus:border-indigo-400" 
                              />
                            </FormControl>
                            <FormDescription className="text-slate-500 text-xs">
                              The industry your product serves
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Target Audience</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Small business owners, Students, Remote workers" 
                              {...field} 
                              className="bg-white border-slate-300 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500 text-xs">
                            The primary users of your product
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="problemStatement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Problem Statement</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What specific problem does your MVP solve?" 
                              className="min-h-[100px] bg-white border-slate-300 focus:border-indigo-400" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500 text-xs">
                            Clearly describe the problem your product addresses
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="keyBenefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Key Benefits</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List the main benefits of your product, one per line" 
                              className="min-h-[100px] bg-white border-slate-300 focus:border-indigo-400" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500 text-xs">
                            The main value propositions of your product (one per line)
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other information that might be helpful" 
                              className="min-h-[100px] bg-white border-slate-300 focus:border-indigo-400" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500 text-xs">
                            Constraints, technical requirements, or other relevant details
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 text-base shadow-md transition-all duration-200"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Spinner className="mr-2 h-5 w-5" />
                          Generating MVP Plan...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Generate Complete MVP Plan
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generation Tab */}
          <TabsContent value="generation" className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                  AI Generation in Progress
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Claude AI is building your comprehensive MVP plan
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="space-y-4">
                  <p className="text-center text-slate-700 text-lg mb-8">
                    Overall Progress: {Math.round(calculateProgress())}%
                  </p>
                  <Progress value={calculateProgress()} className="h-2 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="w-8 h-8 mr-4 flex items-center justify-center">
                      {generationSteps.plan === 'idle' && <Target className="h-6 w-6 text-slate-400" />}
                      {generationSteps.plan === 'loading' && <Spinner className="h-6 w-6 text-amber-500" />}
                      {generationSteps.plan === 'complete' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                      {generationSteps.plan === 'error' && <Target className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-slate-800">Generating Core MVP Plan</h4>
                      <p className="text-xs text-slate-500">Creating executive summary, problem definition, scope and value proposition</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {generationSteps.plan === 'idle' && <Badge variant="outline" className="border-slate-300 text-slate-500">Waiting</Badge>}
                      {generationSteps.plan === 'loading' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Processing</Badge>}
                      {generationSteps.plan === 'complete' && (
                        <>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Complete</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            onClick={() => {
                              setActiveTab('plan');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Results
                          </Button>
                        </>
                      )}
                      {generationSteps.plan === 'error' && <Badge variant="destructive">Error</Badge>}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="w-8 h-8 mr-4 flex items-center justify-center">
                      {generationSteps.features === 'idle' && <Target className="h-6 w-6 text-slate-400" />}
                      {generationSteps.features === 'loading' && <Spinner className="h-6 w-6 text-amber-500" />}
                      {generationSteps.features === 'complete' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                      {generationSteps.features === 'error' && <Target className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-slate-800">Defining Key Features</h4>
                      <p className="text-xs text-slate-500">Identifying priority features with implementation recommendations</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {generationSteps.features === 'idle' && <Badge variant="outline" className="border-slate-300 text-slate-500">Waiting</Badge>}
                      {generationSteps.features === 'loading' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Processing</Badge>}
                      {generationSteps.features === 'complete' && (
                        <>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Complete</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            onClick={() => {
                              setActiveTab('plan');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Results
                          </Button>
                        </>
                      )}
                      {generationSteps.features === 'error' && <Badge variant="destructive">Error</Badge>}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="w-8 h-8 mr-4 flex items-center justify-center">
                      {generationSteps.milestones === 'idle' && <Target className="h-6 w-6 text-slate-400" />}
                      {generationSteps.milestones === 'loading' && <Spinner className="h-6 w-6 text-amber-500" />}
                      {generationSteps.milestones === 'complete' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                      {generationSteps.milestones === 'error' && <Target className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-slate-800">Mapping Development Timeline</h4>
                      <p className="text-xs text-slate-500">Creating project milestones and realistic implementation schedule</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {generationSteps.milestones === 'idle' && <Badge variant="outline" className="border-slate-300 text-slate-500">Waiting</Badge>}
                      {generationSteps.milestones === 'loading' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Processing</Badge>}
                      {generationSteps.milestones === 'complete' && (
                        <>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Complete</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            onClick={() => {
                              setActiveTab('plan');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Results
                          </Button>
                        </>
                      )}
                      {generationSteps.milestones === 'error' && <Badge variant="destructive">Error</Badge>}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="w-8 h-8 mr-4 flex items-center justify-center">
                      {generationSteps.kpis === 'idle' && <Target className="h-6 w-6 text-slate-400" />}
                      {generationSteps.kpis === 'loading' && <Spinner className="h-6 w-6 text-amber-500" />}
                      {generationSteps.kpis === 'complete' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                      {generationSteps.kpis === 'error' && <Target className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-slate-800">Establishing Success Metrics</h4>
                      <p className="text-xs text-slate-500">Defining key performance indicators for measuring MVP success</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {generationSteps.kpis === 'idle' && <Badge variant="outline" className="border-slate-300 text-slate-500">Waiting</Badge>}
                      {generationSteps.kpis === 'loading' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Processing</Badge>}
                      {generationSteps.kpis === 'complete' && (
                        <>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Complete</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            onClick={() => {
                              setActiveTab('plan');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Results
                          </Button>
                        </>
                      )}
                      {generationSteps.kpis === 'error' && <Badge variant="destructive">Error</Badge>}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="w-8 h-8 mr-4 flex items-center justify-center">
                      {generationSteps.diagrams === 'idle' && <Target className="h-6 w-6 text-slate-400" />}
                      {generationSteps.diagrams === 'loading' && <Spinner className="h-6 w-6 text-amber-500" />}
                      {generationSteps.diagrams === 'complete' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                      {generationSteps.diagrams === 'error' && <Target className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-slate-800">Generating System Diagrams</h4>
                      <p className="text-xs text-slate-500">Creating user flow, data flow, and system architecture diagrams</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {generationSteps.diagrams === 'idle' && <Badge variant="outline" className="border-slate-300 text-slate-500">Waiting</Badge>}
                      {generationSteps.diagrams === 'loading' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Processing</Badge>}
                      {generationSteps.diagrams === 'complete' && (
                        <>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Complete</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            onClick={() => {
                              setActiveTab('plan');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Results
                          </Button>
                        </>
                      )}
                      {generationSteps.diagrams === 'error' && <Badge variant="destructive">Error</Badge>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-slate-600 text-sm italic">
                    {generationSteps.plan === 'complete' && generationSteps.features === 'complete' && 
                     generationSteps.milestones === 'complete' && generationSteps.kpis === 'complete' && 
                     generationSteps.diagrams === 'complete' ? (
                      "MVP plan generation complete! Redirecting to results..."
                    ) : (
                      "This may take a minute or two. Our AI is carefully crafting each component of your MVP plan."
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MVP Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            {/* MVP Overview */}
            <Card className="border border-slate-200 bg-white shadow overflow-hidden">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <Rocket className="mr-2 h-5 w-5 text-indigo-600" />
                    MVP Overview: {form.getValues().projectName}
                  </CardTitle>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {aiMilestones?.success ? 
                        `${aiMilestones.data.milestones.reduce((acc, m) => acc + m.duration, 0)} weeks` :
                        "Timeline pending"
                      }
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-slate-500 flex items-center">
                  <Target className="h-4 w-4 mr-1 text-slate-400" />
                  Industry: {form.getValues().industry}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {!aiPlan?.success ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to generate MVP plan. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="prose prose-sm max-w-none space-y-8">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center mb-3">
                        <BrainCircuit className="mr-2 h-5 w-5 text-indigo-600" />
                        Executive Summary
                      </h3>
                      <div className="text-slate-700">
                        <ReactMarkdown>{aiPlan.data.executiveSummary}</ReactMarkdown>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-3">
                          <Target className="mr-2 h-4 w-4 text-red-500" />
                          Problem Statement
                        </h3>
                        <div className="text-slate-700">
                          <ReactMarkdown>{aiPlan.data.problemStatement}</ReactMarkdown>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-3">
                          <Target className="mr-2 h-4 w-4 text-green-500" />
                          Target Audience
                        </h3>
                        <div className="text-slate-700">
                          <ReactMarkdown>{aiPlan.data.targetAudience}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center mb-3">
                        <Zap className="mr-2 h-4 w-4 text-amber-500" />
                        Value Proposition
                      </h3>
                      <div className="text-slate-700">
                        <ReactMarkdown>{aiPlan.data.valueProposition}</ReactMarkdown>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center mb-3">
                        <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                        MVP Scope
                      </h3>
                      <div className="text-slate-700">
                        <ReactMarkdown>{aiPlan.data.mvpScope}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Key Features
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Prioritized features for your MVP implementation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {generateFeaturesMutation.isPending ? (
                  <div className="flex justify-center py-6">
                    <Spinner size="lg" />
                  </div>
                ) : !aiFeatures?.success ? (
                  <div className="grid grid-cols-1 gap-4">
                    {aiPlan?.success && (
                      <ul className="list-disc list-inside pl-4 space-y-2 text-indigo-100">
                        {aiPlan.data.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiFeatures.data.featureIdeas.map((feature, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 bg-slate-50">
                          <div className="flex justify-between items-start">
                            <h4 className="text-slate-800 font-bold">{feature.name}</h4>
                            <div className="flex gap-2">
                              <Badge className={
                                feature.priority.toLowerCase() === 'high' 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                  : feature.priority.toLowerCase() === 'medium' 
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }>
                                {feature.priority}
                              </Badge>
                              <Badge className={
                                feature.difficulty.toLowerCase() === 'hard' 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                  : feature.difficulty.toLowerCase() === 'medium' 
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }>
                                {feature.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs mt-2 text-slate-600">
                            {feature.description}
                          </p>
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                          <div className="text-xs space-y-2">
                            <p className="font-semibold text-slate-700">Value:</p>
                            <p className="text-slate-600">{feature.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <Card className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Timer className="mr-2 h-5 w-5 text-blue-600" />
                  Development Timeline
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Suggested milestones for your MVP development
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
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
                        <div key={index} className="flex relative">
                          {/* Timeline connector */}
                          {index < aiMilestones.data.milestones.length - 1 && (
                            <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-slate-300"></div>
                          )}
                          
                          {/* Milestone marker */}
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center z-10 mt-2 shrink-0">
                            {index + 1}
                          </div>
                          
                          {/* Milestone content */}
                          <div className="ml-4 bg-white border border-slate-200 rounded-lg w-full shadow-sm overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b border-slate-200">
                              <div className="flex justify-between items-start">
                                <h4 className="text-slate-800 font-bold">{milestone.title}</h4>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  <Clock className="h-3 w-3 mr-1" /> 
                                  {milestone.duration} weeks
                                </Badge>
                              </div>
                              <p className="text-xs mt-2 text-slate-600">
                                {milestone.description}
                              </p>
                            </div>
                            <div className="p-4 text-xs text-slate-700">
                              <div className="space-y-2">
                                <p className="font-semibold text-slate-700">Deliverables:</p>
                                <ul className="list-disc list-inside pl-2 space-y-1">
                                  {milestone.deliverables.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KPIs Section */}
            <Card className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5 text-purple-600" />
                  Key Performance Indicators
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Metrics to measure the success of your MVP
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiKpis.data.kpis.map((kpi, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                          <h4 className="text-slate-800 font-bold flex items-center">
                            <Target className="h-4 w-4 mr-2 text-purple-600" />
                            {kpi.name}
                          </h4>
                          <p className="text-xs mt-2 text-slate-600">
                            {kpi.description}
                          </p>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="text-xs space-y-3">
                            <div>
                              <p className="font-semibold text-slate-700">Target:</p>
                              <p className="text-slate-600">{kpi.target}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700">Timeframe:</p>
                              <p className="text-slate-600">{kpi.timeframe}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-slate-200 p-4 bg-white flex space-x-4">
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setActiveTab('export')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export MVP Plan
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setActiveTab('diagrams');
                  }}
                >
                  <Network className="mr-2 h-4 w-4" />
                  View Diagrams
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Diagrams Tab */}
          <TabsContent value="diagrams" className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow overflow-hidden">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Network className="mr-2 h-5 w-5 text-indigo-600" />
                  System Diagrams
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Visual representations of your MVP architecture and flows
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!aiDiagrams?.success ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Spinner size="lg" />
                    <p className="mt-4 text-slate-500">Loading diagrams...</p>
                  </div>
                ) : (
                  <SimpleDiagramsView diagrams={aiDiagrams.data} />
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  onClick={() => setActiveTab('plan')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Download className="mr-2 h-5 w-5 text-indigo-600" />
                  Export Your MVP Plan
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Download your plan in different formats
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                      <h3 className="text-slate-800 font-bold flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                        Markdown Export
                      </h3>
                      <p className="text-xs mt-2 text-slate-600">
                        Export your plan as a Markdown file
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-600">
                        Download a complete Markdown document with all sections of your MVP plan. 
                        Perfect for sharing on GitHub or other platforms that support Markdown.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={exportToMarkdown}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export as Markdown
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                      <h3 className="text-slate-800 font-bold flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                        PDF Export
                      </h3>
                      <p className="text-xs mt-2 text-slate-600">
                        Export your plan as a professional PDF
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-600">
                        Generate a well-formatted PDF document suitable for presentations and 
                        sharing with stakeholders. Includes all sections in a professional layout.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={() => handlePdfExport()}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export as PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                      <h3 className="text-slate-800 font-bold flex items-center">
                        <File className="h-5 w-5 mr-2 text-indigo-600" />
                        Word Export
                      </h3>
                      <p className="text-xs mt-2 text-slate-600">
                        Export your plan as an HTML file for Word
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-600">
                        Export your MVP plan as an HTML file that can be opened in Microsoft Word
                        and then saved as a DOCX document with all formatting preserved.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={() => {
                          try {
                            exportToDocx(
                              form.getValues().projectName,
                              aiPlan,
                              aiFeatures,
                              aiMilestones,
                              aiKpis,
                              aiDiagrams
                            );
                            
                            toast({
                              title: 'HTML Generated',
                              description: 'Your MVP plan has been exported as HTML for Word'
                            });
                          } catch (error) {
                            console.error('HTML for Word export error:', error);
                            
                            toast({
                              title: 'Export Failed',
                              description: 'There was an error generating your HTML file. Please try again.',
                              variant: 'destructive'
                            });
                          }
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export for Word
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-slate-700 mb-4">
                    Your MVP plan for <span className="text-indigo-600 font-bold">{form.getValues().projectName}</span> is ready to download
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-100"
                      onClick={() => setActiveTab('plan')}
                    >
                      Back to Plan
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => saveMvpPlanMutation.mutate()}
                      disabled={saveMvpPlanMutation.isPending}
                    >
                      {saveMvpPlanMutation.isPending ? (
                        <Spinner className="mr-2 h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      {saveMvpPlanMutation.isPending ? 'Saving...' : 'Save to Database'}
                    </Button>
                    
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        form.reset();
                        setAiPlan(null);
                        setAiFeatures(null);
                        setAiMilestones(null);
                        setAiKpis(null);
                        setAiDiagrams(null);
                        setActiveTab('input');
                        setGenerationSteps({
                          plan: 'idle',
                          features: 'idle',
                          milestones: 'idle',
                          kpis: 'idle',
                          diagrams: 'idle'
                        });
                      }}
                    >
                      <Zap className="mr-2 h-4 w-4 text-yellow-300" />
                      Create New MVP Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
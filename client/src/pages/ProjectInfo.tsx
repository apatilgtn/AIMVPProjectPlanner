import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useProject, ProjectType } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProjectHeader from "@/components/ProjectHeader";

// Form schema
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  industry: z.string().min(1, "Industry is required"),
  audience: z.string().min(1, "Target audience is required"),
  problemStatement: z.string().min(1, "Problem statement is required"),
  additionalNotes: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectInfo = () => {
  const { projectId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    currentProject, 
    setCurrentProject,
    createProject,
    updateProject,
    isLoading 
  } = useProject();
  
  // Setup form with validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      industry: "",
      audience: "",
      problemStatement: "",
      additionalNotes: "",
    },
  });

  // Load project data into form if available
  useEffect(() => {
    if (currentProject) {
      form.reset({
        name: currentProject.name,
        industry: currentProject.industry,
        audience: currentProject.audience,
        problemStatement: currentProject.problemStatement,
        additionalNotes: currentProject.additionalNotes,
      });
    }
  }, [currentProject, form]);

  // Initialize project if needed
  useEffect(() => {
    const initializeProject = async () => {
      if (projectId && !currentProject) {
        try {
          // In a real app, we would fetch the project from the server here
          // For now, we'll create a new one if it doesn't exist

          const newProject: ProjectType = {
            name: "Untitled Project",
            industry: "",
            audience: "",
            problemStatement: "",
            keyBenefits: [],
            currentStep: "projectInfo"
          };
          
          await createProject(newProject);
        } catch (error) {
          console.error("Failed to initialize project:", error);
          toast({
            title: "Error",
            description: "Failed to initialize project. Please try again.",
            variant: "destructive",
          });
          navigate("/");
        }
      }
    };

    initializeProject();
  }, [projectId, currentProject, createProject, navigate, toast]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // Update project with form data
      const updatedProject = {
        ...data,
        currentStep: "ideaExploration" as const
      };
      
      await updateProject(updatedProject);
      
      // Navigate to next step
      navigate(`/idea-exploration/${projectId}`);
      
      toast({
        title: "Project information saved",
        description: "Your project details have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!currentProject && projectId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading project information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar currentStep="projectInfo" projectId={Number(projectId)} />
      
      <div className="lg:w-3/4 slide-enter">
        <Card className="bg-white rounded-lg shadow-md p-6">
          <ProjectHeader 
            title="Project Information"
            project={currentProject}
            estimatedTime="5-10 min"
          />

          <div className="mb-8">
            <p className="text-neutral-600 mb-6">
              Let's start by gathering the basic information about your project. 
              This will help set the foundation for your MVP planning.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology, Healthcare, Education" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Who is this product for?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Statement <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What problem does your product solve?" 
                          className="resize-none" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other relevant information about your project" 
                          className="resize-none" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-6 mt-6 border-t border-neutral-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="px-6"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="px-6"
                    disabled={isLoading}
                  >
                    Next: Idea Exploration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectInfo;

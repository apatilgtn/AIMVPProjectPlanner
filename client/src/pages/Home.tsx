import { useState } from "react";
import { useLocation } from "wouter";
import { useProject, ProjectType } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Rocket, ArrowRight, Plus, ArrowRightCircle } from "lucide-react";

const Home = () => {
  const [location, navigate] = useLocation();
  const { createProject } = useProject();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNewProject = async () => {
    setIsCreating(true);
    try {
      // Create a new blank project with default values
      const newProject: ProjectType = {
        name: "Untitled Project",
        industry: "",
        audience: "",
        problemStatement: "",
        keyBenefits: [],
        currentStep: "projectInfo"
      };
      
      const createdProject = await createProject(newProject);
      navigate(`/project-info/${createdProject.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-neutral-900">
          MVP Planning Assistant
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Create comprehensive Minimum Viable Product plans with flow diagrams, presentations, and documentation.
        </p>
      </div>

      <Card className="mb-10 bg-gradient-to-br from-primary-50 to-white border-primary-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary-100 rounded-full p-4 flex-shrink-0">
              <Rocket className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold mb-2">Start a New MVP Project</h2>
              <p className="text-neutral-600 mb-4">
                Begin planning your Minimum Viable Product with our guided step-by-step process. 
                Define your project, explore ideas, create timelines, and generate all the 
                necessary documentation.
              </p>
              <Button 
                onClick={handleCreateNewProject} 
                className="mt-2"
                disabled={isCreating}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Creating Project..." : "Create New Project"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-12">
        <FeatureCard 
          icon={<div className="bg-blue-100 rounded-full p-3"><ArrowRightCircle className="h-6 w-6 text-blue-600" /></div>}
          title="Step-by-Step Process"
          description="Follow our guided process to turn your idea into a fully-developed MVP plan."
        />
        <FeatureCard 
          icon={<div className="bg-green-100 rounded-full p-3"><ArrowRightCircle className="h-6 w-6 text-green-600" /></div>}
          title="Visual Diagrams"
          description="Create professional flow diagrams to visualize your user journey and system interactions."
        />
        <FeatureCard 
          icon={<div className="bg-purple-100 rounded-full p-3"><ArrowRightCircle className="h-6 w-6 text-purple-600" /></div>}
          title="Export Documents"
          description="Generate PowerPoint presentations and README documentation for implementation."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it Works</CardTitle>
          <CardDescription>
            Our MVP Planning Assistant guides you through a comprehensive 7-step process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Step number={1} title="Project Information" description="Define your project basics, including name, industry, and target audience." />
            <Step number={2} title="Idea Exploration" description="Brainstorm features and validate your ideas through competitive analysis." />
            <Step number={3} title="MVP Plan Development" description="Create a development timeline and define success metrics." />
            <Step number={4} title="Flow Diagram Creation" description="Visualize the user journey through your MVP." />
            <Step number={5} title="PowerPoint Generation" description="Create a professional presentation to pitch your MVP." />
            <Step number={6} title="README Documentation" description="Generate comprehensive documentation for implementation." />
            <Step number={7} title="Review & Export" description="Review all materials and export them for use." />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateNewProject} className="w-full" disabled={isCreating}>
            {isCreating ? "Creating Project..." : "Get Started Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-neutral-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => {
  return (
    <div className="flex items-start">
      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div className="ml-4">
        <h4 className="font-medium text-neutral-800">{title}</h4>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
    </div>
  );
};

export default Home;

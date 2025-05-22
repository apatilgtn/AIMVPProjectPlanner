import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HelpDialogProps {
  onClose: () => void;
  currentStep: string;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ onClose, currentStep }) => {
  const helpContent = getHelpContent(currentStep);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-neutral-800">{helpContent.title}</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4 text-neutral-600">
          <p>{helpContent.description}</p>
          {helpContent.sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-medium text-neutral-800 mb-1">{section.title}</h4>
              <p className="text-sm">{section.content}</p>
              {section.list && (
                <ul className="text-sm list-disc list-inside pl-2 mt-1">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={onClose}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function getHelpContent(step: string) {
  switch (step) {
    case "home":
      return {
        title: "AI MVP Creator",
        description: "Welcome to the AI-powered MVP planning tool",
        sections: [
          {
            title: "Quick Start",
            content: "Fill out the basic project information in the form and click 'Generate Complete MVP Plan' to get started. Our AI will do the rest!",
          },
          {
            title: "What You'll Get",
            content: "Our AI will generate a complete MVP plan including:",
            list: [
              "Executive summary and value proposition",
              "Feature recommendations with priorities",
              "Development timeline with milestones",
              "Key performance indicators (KPIs)",
            ],
          },
          {
            title: "Export Options",
            content: "After generating your plan, you can export it to Markdown format for easy sharing and reference.",
          },
        ],
      };
    case "project-info":
      return {
        title: "Project Information Help",
        description: "In this step, you'll define the basic details of your MVP project.",
        sections: [
          {
            title: "Project Details",
            content: "Enter your project name, industry, and target audience to provide context for your MVP planning.",
          },
          {
            title: "Problem Statement",
            content: "Clearly articulate the problem your product aims to solve. A well-defined problem statement keeps your MVP focused.",
          },
          {
            title: "Target Audience",
            content: "Define your primary user group in detail. The more specific you are, the better you can tailor your MVP to their needs.",
          },
        ],
      };
    case "idea-exploration":
      return {
        title: "Idea Exploration Help",
        description: "In this step, you'll define the core features for your MVP and explore validation methods.",
        sections: [
          {
            title: "Feature Brainstorming",
            content: "Add all potential features for your product. For each feature, specify:",
            list: [
              "Priority level (how important it is for users)",
              "Implementation difficulty",
              "Whether to include in the MVP",
            ],
          },
          {
            title: "Validation Strategy",
            content: "Select methods to validate your idea before full development. This reduces the risk of building something users don't want.",
          },
          {
            title: "Competitive Analysis",
            content: "Compare your planned features with competitors to identify gaps and opportunities in the market.",
          },
        ],
      };
    case "mvp-plan":
      return {
        title: "MVP Plan Help",
        description: "This step helps you outline a strategic plan for your MVP development.",
        sections: [
          {
            title: "Development Timeline",
            content: "Break down your MVP development into key milestones with realistic timeframes.",
          },
          {
            title: "Success Metrics",
            content: "Define key performance indicators (KPIs) that will help you measure the success of your MVP.",
            list: [
              "Acquisition metrics (new users/customers)",
              "Engagement metrics (active users, session duration)",
              "Retention metrics (returning users)",
              "Revenue metrics (if applicable)",
            ],
          },
          {
            title: "Resource Planning",
            content: "Estimate the resources needed to build your MVP, including team members, budget, and tools.",
          },
        ],
      };
    case "flow-diagram":
      return {
        title: "Flow Diagram Help",
        description: "Create visual representations of user journeys and system interactions.",
        sections: [
          {
            title: "Creating Nodes",
            content: "Add nodes to represent steps in your user journey or system process. Different node types help distinguish different actions.",
          },
          {
            title: "Connecting Elements",
            content: "Draw connections between nodes to show the flow of information or user actions.",
          },
          {
            title: "Diagram Layout",
            content: "Arrange your nodes in a logical manner, typically flowing from top to bottom or left to right.",
          },
        ],
      };
    case "powerpoint":
      return {
        title: "PowerPoint Generation Help",
        description: "Generate a professional presentation to showcase your MVP plan.",
        sections: [
          {
            title: "Presentation Structure",
            content: "Your presentation will include slides covering your project's key aspects:",
            list: [
              "Problem statement and target audience",
              "Proposed solution and value proposition",
              "Key features and user benefits",
              "Market analysis and competitive advantage",
              "Implementation timeline and next steps",
            ],
          },
          {
            title: "Customization",
            content: "Review and edit the generated content to ensure it accurately represents your MVP vision.",
          },
        ],
      };
    case "readme":
      return {
        title: "README Documentation Help",
        description: "Create comprehensive documentation for your MVP project implementation.",
        sections: [
          {
            title: "Documentation Sections",
            content: "Your README will include these essential sections:",
            list: [
              "Project overview and purpose",
              "Installation instructions",
              "Usage guidelines",
              "API documentation (if applicable)",
              "Contribution guidelines",
              "License information",
            ],
          },
          {
            title: "Formatting",
            content: "Use markdown formatting to create well-structured, readable documentation.",
          },
        ],
      };
    case "review-export":
      return {
        title: "Review & Export Help",
        description: "Review all your MVP planning materials and export them for use.",
        sections: [
          {
            title: "Final Review",
            content: "Check all aspects of your MVP plan for consistency and completeness.",
          },
          {
            title: "Export Options",
            content: "Download your documents in various formats for sharing with team members, stakeholders, or investors.",
          },
          {
            title: "Next Steps",
            content: "Consider feedback mechanisms and iteration plans as you move forward with your MVP implementation.",
          },
        ],
      };
    default:
      return {
        title: "AI MVP Creator Help",
        description: "This streamlined tool helps you quickly generate a comprehensive MVP plan using AI.",
        sections: [
          {
            title: "AI-Powered Generation",
            content: "Our AI will generate a complete MVP plan based on minimal input from you, including:",
            list: [
              "Executive summary and value proposition",
              "Feature recommendations with priorities",
              "Development timeline with milestones",
              "Key performance indicators (KPIs)",
              "Risk assessment and mitigation strategies",
            ],
          },
          {
            title: "Simple Process",
            content: "1. Fill out the basic project information form. 2. Click 'Generate Complete MVP Plan'. 3. Review the AI-generated plan. 4. Export to your preferred format.",
          },
          {
            title: "Legacy Mode",
            content: "If you prefer the manual step-by-step approach, you can switch to Legacy Mode using the button in the top navigation bar.",
          },
        ],
      };
  }
}

export default HelpDialog;

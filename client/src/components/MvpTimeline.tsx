import React, { useState } from "react";
import { useProject, MilestoneType } from "@/contexts/ProjectContext";
import { PlusCircle, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MvpTimeline: React.FC = () => {
  const { milestones, setMilestones } = useProject();
  const [expanded, setExpanded] = useState<string | null>("milestone-0");

  // Add a new milestone
  const addMilestone = () => {
    const newMilestone: MilestoneType = {
      title: "",
      description: "",
      duration: 2, // Default 2 weeks
      order: milestones.length
    };
    
    const updatedMilestones = [...milestones, newMilestone];
    setMilestones(updatedMilestones);
    setExpanded(`milestone-${milestones.length}`);
  };

  // Update a milestone
  const updateMilestone = (index: number, field: keyof MilestoneType, value: any) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setMilestones(updatedMilestones);
  };

  // Move milestone up
  const moveMilestoneUp = (index: number) => {
    if (index <= 0) return;
    
    const updatedMilestones = [...milestones];
    const temp = updatedMilestones[index];
    updatedMilestones[index] = { ...updatedMilestones[index - 1], order: index };
    updatedMilestones[index - 1] = { ...temp, order: index - 1 };
    setMilestones(updatedMilestones.sort((a, b) => a.order - b.order));
  };

  // Move milestone down
  const moveMilestoneDown = (index: number) => {
    if (index >= milestones.length - 1) return;
    
    const updatedMilestones = [...milestones];
    const temp = updatedMilestones[index];
    updatedMilestones[index] = { ...updatedMilestones[index + 1], order: index };
    updatedMilestones[index + 1] = { ...temp, order: index + 1 };
    setMilestones(updatedMilestones.sort((a, b) => a.order - b.order));
  };

  // Remove a milestone
  const removeMilestone = (index: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);
    
    // Update order for remaining milestones
    updatedMilestones.forEach((m, i) => {
      m.order = i;
    });
    
    setMilestones(updatedMilestones);
  };

  // Calculate total duration
  const totalDuration = milestones.reduce((total, milestone) => total + milestone.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-800">Development Timeline</h3>
        <div className="text-sm text-neutral-500">
          Total Duration: <span className="font-medium">{totalDuration} weeks</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline indicator */}
        <div className="absolute top-8 bottom-12 left-7 w-0.5 bg-primary opacity-30 z-0"></div>
        
        {/* Milestones */}
        <Accordion
          type="single"
          collapsible
          value={expanded || undefined}
          onValueChange={(value) => setExpanded(value)}
          className="space-y-4"
        >
          {milestones.map((milestone, index) => (
            <AccordionItem 
              key={index} 
              value={`milestone-${index}`}
              className="border border-neutral-200 rounded-lg bg-white overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-neutral-50">
                <div className="flex items-center space-x-3 text-left">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center z-10">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-800">
                      {milestone.title || `Milestone ${index + 1}`}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Duration: {milestone.duration} week{milestone.duration !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor={`milestone-title-${index}`}>Milestone Title</Label>
                    <Input
                      id={`milestone-title-${index}`}
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, "title", e.target.value)}
                      placeholder="e.g., Design Phase, MVP Development, Testing"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`milestone-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`milestone-desc-${index}`}
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, "description", e.target.value)}
                      placeholder="What will be accomplished during this milestone"
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`milestone-duration-${index}`}>Duration (weeks)</Label>
                    <Input
                      id={`milestone-duration-${index}`}
                      type="number"
                      min="1"
                      value={milestone.duration}
                      onChange={(e) => updateMilestone(index, "duration", parseInt(e.target.value) || 1)}
                      className="mt-1 w-full"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveMilestoneUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveMilestoneDown(index)}
                      disabled={index === milestones.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Button
          onClick={addMilestone}
          variant="outline"
          className="mt-4 w-full flex items-center justify-center border-dashed"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Milestone
        </Button>
      </div>
      
      {milestones.length > 0 && (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-4">
            <div className="text-sm">
              <h4 className="font-medium text-blue-800">Timeline Summary</h4>
              <div className="mt-2 space-y-1 text-blue-700">
                <p>• Number of milestones: {milestones.length}</p>
                <p>• Total development time: {totalDuration} weeks ({(totalDuration / 4).toFixed(1)} months)</p>
                <p>• Estimated completion date: {getEstimatedCompletionDate(totalDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to calculate estimated completion date
function getEstimatedCompletionDate(weeks: number): string {
  const today = new Date();
  const completionDate = new Date(today);
  completionDate.setDate(today.getDate() + weeks * 7);
  
  return completionDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default MvpTimeline;

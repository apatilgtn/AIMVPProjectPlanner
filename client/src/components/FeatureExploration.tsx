import React, { useState } from "react";
import { useProject, FeatureType } from "@/contexts/ProjectContext";
import { PlusCircle, Trash } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FeatureExploration: React.FC = () => {
  const { currentProject, features, setFeatures } = useProject();
  const [sortBy, setSortBy] = useState<"priority" | "difficulty" | "impact">("priority");

  const addFeature = () => {
    const newFeature: FeatureType = {
      name: "",
      description: "",
      priority: "Medium",
      difficulty: "Medium",
      includeInMvp: true
    };
    setFeatures([...features, newFeature]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const updateFeature = (index: number, field: keyof FeatureType, value: any) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  const sortFeatures = (features: FeatureType[]) => {
    return [...features].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
        return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
      } else if (sortBy === "difficulty") {
        const difficultyOrder = { "Easy": 0, "Medium": 1, "Hard": 2 };
        return (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
      } else {
        // For "impact", sort by priority and then by whether it's included in MVP
        if (a.includeInMvp !== b.includeInMvp) {
          return a.includeInMvp ? -1 : 1;
        }
        const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
        return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
      }
    });
  };

  const sortedFeatures = sortFeatures(features);

  if (!currentProject) {
    return <div>No project selected</div>;
  }

  return (
    <div className="mb-8 border border-neutral-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">Feature Brainstorming</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          What problem does your product solve? 
          <span className="text-red-500">*</span>
        </label>
        <Textarea 
          className="w-full"
          rows={3}
          placeholder="Describe the core problem your MVP will address..."
          value={currentProject.problemStatement || ""}
          onChange={(e) => {
            if (currentProject) {
              const updatedProject = { ...currentProject, problemStatement: e.target.value };
              // This would typically update the project context
            }
          }}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          What are the key benefits of your solution?
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {currentProject.keyBenefits && currentProject.keyBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <Input 
                className="flex-grow"
                placeholder="Enter a key benefit..."
                value={benefit}
                onChange={(e) => {
                  if (currentProject) {
                    const newBenefits = [...currentProject.keyBenefits];
                    newBenefits[index] = e.target.value;
                    // Update project context with new benefits
                  }
                }}
              />
              <button 
                className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded"
                onClick={() => {
                  if (currentProject) {
                    const newBenefits = [...currentProject.keyBenefits];
                    newBenefits.splice(index, 1);
                    // Update project context with new benefits
                  }
                }}
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button 
            className="flex items-center text-primary hover:bg-primary-light hover:bg-opacity-10 px-3 py-1 rounded text-sm"
            onClick={() => {
              if (currentProject) {
                const newBenefits = [...(currentProject.keyBenefits || []), ""];
                // Update project context with new benefits
              }
            }}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add another benefit
          </button>
        </div>
      </div>
      
      <div className="border-t border-neutral-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-neutral-800">Potential Features</h4>
          <div className="flex items-center">
            <span className="text-sm text-neutral-600 mr-2">Sort by:</span>
            <Select 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value as "priority" | "difficulty" | "impact")}
            >
              <SelectTrigger className="text-sm border border-neutral-300 rounded">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="impact">User Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          {sortedFeatures.map((feature, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex justify-between">
                <div className="w-2/3">
                  <div className="mb-3">
                    <Input 
                      className="w-full font-medium"
                      placeholder="Feature name..."
                      value={feature.name}
                      onChange={(e) => updateFeature(index, "name", e.target.value)}
                    />
                  </div>
                  <Textarea 
                    className="w-full text-sm"
                    rows={2}
                    placeholder="Describe this feature..."
                    value={feature.description || ""}
                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                  />
                </div>
                <div className="w-1/3 pl-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Priority</label>
                    <Select 
                      value={feature.priority} 
                      onValueChange={(value) => updateFeature(index, "priority", value)}
                    >
                      <SelectTrigger className="w-full text-sm border border-neutral-300 rounded">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Difficulty</label>
                    <Select 
                      value={feature.difficulty} 
                      onValueChange={(value) => updateFeature(index, "difficulty", value)}
                    >
                      <SelectTrigger className="w-full text-sm border border-neutral-300 rounded">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id={`feature-mvp-${index}`}
                      checked={feature.includeInMvp}
                      onCheckedChange={(checked) => 
                        updateFeature(index, "includeInMvp", checked === true)
                      }
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`feature-mvp-${index}`}
                      className="text-xs font-medium text-neutral-700 cursor-pointer"
                    >
                      Include in MVP
                    </label>
                  </div>
                  <div className="pt-2">
                    <button 
                      className="text-red-500 hover:text-red-700 text-xs flex items-center"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash className="h-3 w-3 mr-1" />
                      Remove feature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button 
            className="w-full flex items-center justify-center text-primary hover:bg-primary-light hover:bg-opacity-10 px-4 py-3 rounded border border-dashed border-primary"
            onClick={addFeature}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add a new feature
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureExploration;

import React from "react";
import { useProject, ValidationMethodType } from "@/contexts/ProjectContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface ValidationMethod {
  id: string;
  name: string;
  description: string;
}

const ValidationMethods: React.FC = () => {
  const { validationMethods, setValidationMethods } = useProject();
  const [additionalMethods, setAdditionalMethods] = React.useState("");

  const defaultValidationMethods: ValidationMethod[] = [
    {
      id: "user-interviews",
      name: "User Interviews",
      description: "One-on-one discussions with potential users to gather qualitative feedback"
    },
    {
      id: "online-surveys",
      name: "Online Surveys",
      description: "Quantitative data collection from a wider audience sample"
    },
    {
      id: "prototype-testing",
      name: "Prototype Testing",
      description: "Create an interactive prototype to test key user flows"
    },
    {
      id: "competitor-analysis",
      name: "Competitor Analysis",
      description: "Examine similar products to identify gaps and opportunities"
    },
    {
      id: "landing-page",
      name: "Landing Page Test",
      description: "Create a simple landing page to gauge interest via sign-ups"
    },
    {
      id: "ab-testing",
      name: "A/B Testing",
      description: "Test variations of key features to determine the most effective approach"
    }
  ];

  const toggleValidationMethod = (id: string) => {
    const methodIndex = validationMethods.findIndex(method => method.name === id);
    
    if (methodIndex >= 0) {
      // Method exists, toggle its selection
      const updatedMethods = [...validationMethods];
      updatedMethods[methodIndex] = {
        ...updatedMethods[methodIndex],
        isSelected: !updatedMethods[methodIndex].isSelected
      };
      setValidationMethods(updatedMethods);
    } else {
      // Method doesn't exist, add it
      const methodInfo = defaultValidationMethods.find(m => m.id === id);
      if (methodInfo) {
        const newMethod: ValidationMethodType = {
          name: methodInfo.id,
          description: methodInfo.description,
          isSelected: true
        };
        setValidationMethods([...validationMethods, newMethod]);
      }
    }
  };

  const isMethodSelected = (id: string): boolean => {
    const method = validationMethods.find(method => method.name === id);
    return method ? method.isSelected : false;
  };

  return (
    <div className="mb-8 border border-neutral-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">Idea Validation Strategy</h3>
      <p className="text-neutral-600 mb-4">Select methods you will use to validate your MVP ideas before full development:</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        {defaultValidationMethods.map((method) => (
          <div 
            key={method.id}
            className="border border-neutral-200 rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
            onClick={() => toggleValidationMethod(method.id)}
          >
            <label className="flex items-start cursor-pointer">
              <Checkbox 
                className="mt-1 mr-2"
                checked={isMethodSelected(method.id)}
                onCheckedChange={() => toggleValidationMethod(method.id)}
              />
              <div>
                <h4 className="font-medium text-neutral-800">{method.name}</h4>
                <p className="text-sm text-neutral-600">{method.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Additional validation methods or notes
        </label>
        <Textarea 
          className="w-full"
          rows={2}
          placeholder="Any other validation methods you plan to use..."
          value={additionalMethods}
          onChange={(e) => setAdditionalMethods(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ValidationMethods;

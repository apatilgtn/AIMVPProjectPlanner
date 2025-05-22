import React, { useState } from "react";
import { useProject, KpiType } from "@/contexts/ProjectContext";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const kpiCategories = [
  {
    name: "Acquisition",
    description: "Metrics related to attracting new users/customers",
    examples: ["New user sign-ups", "App downloads", "Website visitors", "Conversion rate"]
  },
  {
    name: "Engagement",
    description: "Metrics related to user interaction with your product",
    examples: ["Active users (DAU/MAU)", "Session duration", "Feature usage", "User actions"]
  },
  {
    name: "Retention",
    description: "Metrics related to keeping users over time",
    examples: ["Churn rate", "Retention rate", "Recurring users", "Account lifespan"]
  },
  {
    name: "Revenue",
    description: "Metrics related to monetization",
    examples: ["MRR/ARR", "Average revenue per user", "Conversion to paid", "Transaction value"]
  },
  {
    name: "Satisfaction",
    description: "Metrics related to user experience and satisfaction",
    examples: ["NPS score", "CSAT score", "App store rating", "Customer feedback"]
  }
];

const KpiDefinition: React.FC = () => {
  const { kpis, setKpis } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Add a new KPI
  const addKpi = () => {
    const newKpi: KpiType = {
      name: "",
      description: "",
      target: "",
      timeframe: "3 months"
    };
    setKpis([...kpis, newKpi]);
  };

  // Add a suggested KPI
  const addSuggestedKpi = (name: string) => {
    const newKpi: KpiType = {
      name,
      description: "",
      target: "",
      timeframe: "3 months"
    };
    setKpis([...kpis, newKpi]);
  };

  // Update a KPI
  const updateKpi = (index: number, field: keyof KpiType, value: string) => {
    const updatedKpis = [...kpis];
    updatedKpis[index] = { ...updatedKpis[index], [field]: value };
    setKpis(updatedKpis);
  };

  // Remove a KPI
  const removeKpi = (index: number) => {
    const updatedKpis = [...kpis];
    updatedKpis.splice(index, 1);
    setKpis(updatedKpis);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Success Metrics (KPIs)</h3>
        <p className="text-neutral-600 mb-6">
          Define measurable Key Performance Indicators (KPIs) that will help you evaluate the success of your MVP.
        </p>
      </div>

      {/* KPI Category Selection Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Suggested KPI Categories</CardTitle>
          <CardDescription>
            Select a category to see suggested KPIs for your MVP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {kpiCategories.map((category, index) => (
              <div 
                key={index}
                className={`
                  p-3 border rounded-md cursor-pointer transition
                  ${selectedCategory === category.name 
                    ? 'border-primary bg-primary-50' 
                    : 'border-neutral-200 hover:border-primary-200'
                  }
                `}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
              >
                <h4 className="font-medium text-sm">{category.name}</h4>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested KPIs based on selected category */}
      {selectedCategory && (
        <Card className="mb-6 border-dashed border-primary-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-md">{selectedCategory} KPI Suggestions</CardTitle>
            <CardDescription>
              {kpiCategories.find(c => c.name === selectedCategory)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {kpiCategories
                .find(c => c.name === selectedCategory)
                ?.examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 text-left"
                    onClick={() => addSuggestedKpi(example)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Defined KPIs */}
      <div className="space-y-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border border-neutral-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="w-5/6">
                    <Label htmlFor={`kpi-name-${index}`}>KPI Name</Label>
                    <Input
                      id={`kpi-name-${index}`}
                      value={kpi.name}
                      onChange={(e) => updateKpi(index, "name", e.target.value)}
                      placeholder="e.g., User Acquisition Rate, Engagement Score"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeKpi(index)}
                    className="text-neutral-400 hover:text-red-500 h-9 w-9 mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor={`kpi-desc-${index}`}>Description</Label>
                  <Textarea
                    id={`kpi-desc-${index}`}
                    value={kpi.description}
                    onChange={(e) => updateKpi(index, "description", e.target.value)}
                    placeholder="How will you measure this KPI and why is it important?"
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`kpi-target-${index}`}>Target Value</Label>
                    <Input
                      id={`kpi-target-${index}`}
                      value={kpi.target}
                      onChange={(e) => updateKpi(index, "target", e.target.value)}
                      placeholder="e.g., 1000 users, 15% conversion rate"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`kpi-timeframe-${index}`}>Timeframe</Label>
                    <Select 
                      value={kpi.timeframe}
                      onValueChange={(value) => updateKpi(index, "timeframe", value)}
                    >
                      <SelectTrigger id={`kpi-timeframe-${index}`} className="mt-1">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 month">1 month</SelectItem>
                        <SelectItem value="3 months">3 months</SelectItem>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="1 year">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          onClick={addKpi}
          variant="outline"
          className="w-full flex items-center justify-center border-dashed"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add KPI
        </Button>
      </div>
      
      {kpis.length > 0 && (
        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-4">
            <div className="text-sm">
              <h4 className="font-medium text-green-800">KPI Summary</h4>
              <div className="mt-2 space-y-1 text-green-700">
                <p>• Number of defined KPIs: {kpis.length}</p>
                <p>• Categories covered: {Array.from(new Set(kpis.map(k => {
                  // Try to detect category based on KPI name
                  for (const cat of kpiCategories) {
                    if (cat.examples.some(ex => k.name.toLowerCase().includes(ex.toLowerCase()))) {
                      return cat.name;
                    }
                  }
                  return "Custom";
                }))).join(", ")}</p>
                <p>• Main timeframe: {
                  (() => {
                    // Count occurrences of each timeframe
                    const timeframeCounts: Record<string, number> = {};
                    kpis.forEach(kpi => {
                      timeframeCounts[kpi.timeframe] = (timeframeCounts[kpi.timeframe] || 0) + 1;
                    });
                    
                    // Find the most common timeframe
                    let maxCount = 0;
                    let mostCommonTimeframe = "Mixed";
                    
                    Object.entries(timeframeCounts).forEach(([timeframe, count]) => {
                      if (count > maxCount) {
                        maxCount = count;
                        mostCommonTimeframe = timeframe;
                      }
                    });
                    
                    return mostCommonTimeframe;
                  })()
                }</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KpiDefinition;

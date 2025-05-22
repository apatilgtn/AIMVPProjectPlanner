import React, { useState } from "react";
import { useProject, CompetitorType, CompetitiveFeatureType } from "@/contexts/ProjectContext";
import { PlusCircle, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const CompetitorComparison: React.FC = () => {
  const { competitors, setCompetitors, competitiveFeatures, setCompetitiveFeatures } = useProject();
  
  const addCompetitor = () => {
    const newCompetitor: CompetitorType = {
      name: `Competitor ${competitors.length + 1}`
    };
    setCompetitors([...competitors, newCompetitor]);
  };

  const updateCompetitorName = (index: number, name: string) => {
    const newCompetitors = [...competitors];
    newCompetitors[index] = { ...newCompetitors[index], name };
    setCompetitors(newCompetitors);
  };

  const addFeature = () => {
    // Create empty feature initially
    const newFeature: CompetitiveFeatureType = {
      name: "New Feature",
      yourMvp: false,
      competitorsHasFeature: competitors.reduce((obj, comp, idx) => {
        obj[idx] = false;
        return obj;
      }, {} as Record<number, boolean>)
    };
    setCompetitiveFeatures([...competitiveFeatures, newFeature]);
  };

  const updateFeatureName = (index: number, name: string) => {
    const newFeatures = [...competitiveFeatures];
    newFeatures[index] = { ...newFeatures[index], name };
    setCompetitiveFeatures(newFeatures);
  };

  const toggleFeatureAvailability = (featureIndex: number, columnIndex: number) => {
    const newFeatures = [...competitiveFeatures];
    const feature = newFeatures[featureIndex];
    
    if (columnIndex === -1) {
      // Toggle for your MVP
      feature.yourMvp = !feature.yourMvp;
    } else {
      // Toggle for a competitor
      const competitorsHasFeature = { ...feature.competitorsHasFeature };
      competitorsHasFeature[columnIndex] = !competitorsHasFeature[columnIndex];
      feature.competitorsHasFeature = competitorsHasFeature;
    }
    
    setCompetitiveFeatures(newFeatures);
  };

  return (
    <div className="border border-neutral-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">Competitive Analysis</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-2 px-3 text-left text-sm font-medium text-neutral-700">Feature / Competitor</th>
              <th className="py-2 px-3 text-center text-sm font-medium text-neutral-700">Your MVP</th>
              {competitors.map((competitor, index) => (
                <th key={index} className="py-2 px-3 text-center text-sm font-medium text-neutral-700">
                  <Input 
                    className="w-full text-center border-b border-dashed border-neutral-400 bg-transparent focus:border-primary py-1"
                    placeholder={`Competitor ${index + 1}`}
                    value={competitor.name}
                    onChange={(e) => updateCompetitorName(index, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitiveFeatures.map((feature, featureIndex) => (
              <tr key={featureIndex} className="border-b border-neutral-200">
                <td className="py-3 px-3 text-sm text-neutral-800">
                  <Input 
                    className="w-full border-b border-dashed border-neutral-400 bg-transparent focus:border-primary py-1"
                    placeholder="Feature name"
                    value={feature.name}
                    onChange={(e) => updateFeatureName(featureIndex, e.target.value)}
                  />
                </td>
                <td 
                  className="py-3 px-3 text-center cursor-pointer"
                  onClick={() => toggleFeatureAvailability(featureIndex, -1)}
                >
                  {feature.yourMvp ? (
                    <span className="text-secondary"><Check className="inline h-5 w-5" /></span>
                  ) : (
                    <span className="text-neutral-300"><X className="inline h-5 w-5" /></span>
                  )}
                </td>
                {competitors.map((_, competitorIndex) => (
                  <td 
                    key={competitorIndex}
                    className="py-3 px-3 text-center cursor-pointer"
                    onClick={() => toggleFeatureAvailability(featureIndex, competitorIndex)}
                  >
                    {feature.competitorsHasFeature[competitorIndex] ? (
                      <span className="text-secondary"><Check className="inline h-5 w-5" /></span>
                    ) : (
                      <span className="text-neutral-300"><X className="inline h-5 w-5" /></span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-3 px-3 text-sm text-neutral-800">
                <div className="flex items-center">
                  <Input 
                    className="w-full border-b border-dashed border-neutral-400 bg-transparent focus:border-primary py-1"
                    placeholder="Add a feature to compare"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        addFeature();
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <button 
                    className="ml-2 text-primary hover:text-primary-dark"
                    onClick={addFeature}
                    type="button"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td className="py-3 px-3 text-center">
              </td>
              {competitors.map((_, index) => (
                <td key={index} className="py-3 px-3 text-center">
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <button 
          className="text-primary flex items-center hover:bg-primary-light hover:bg-opacity-10 px-3 py-1 rounded text-sm"
          onClick={addCompetitor}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add competitor
        </button>
        <div className="text-sm text-neutral-500">Click cells to toggle feature availability</div>
      </div>
    </div>
  );
};

export default CompetitorComparison;

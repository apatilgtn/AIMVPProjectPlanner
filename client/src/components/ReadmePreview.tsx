import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";

const ReadmePreview: React.FC = () => {
  const { 
    currentProject, 
    features, 
    milestones,
    kpis
  } = useProject();
  
  if (!currentProject) {
    return <div>No project data available</div>;
  }
  
  // Get features included in MVP
  const mvpFeatures = features.filter(f => f.includeInMvp);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">README Preview</h3>
      
      <Card className="border border-neutral-200">
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none">
            <h1 id="project-name">{currentProject.name}</h1>
            
            <h2 id="overview">Overview</h2>
            <p>{currentProject.problemStatement}</p>
            
            <h2 id="features">Features</h2>
            {mvpFeatures.length > 0 ? (
              <ul>
                {mvpFeatures.map((feature, index) => (
                  <li key={index}>
                    <strong>{feature.name}</strong>: {feature.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p><em>No features defined for the MVP yet.</em></p>
            )}
            
            <h2 id="installation">Installation</h2>
            <pre><code>{`# Clone the repository
git clone https://github.com/yourusername/${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to the project directory
cd ${currentProject.name.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Start the development server
npm start`}</code></pre>
            
            <h2 id="usage">Usage</h2>
            <p>
              This application allows users to {currentProject.problemStatement.toLowerCase().startsWith('to ') ? currentProject.problemStatement.substring(3) : currentProject.problemStatement}.
            </p>
            
            {milestones.length > 0 && (
              <>
                <h2 id="roadmap">Roadmap</h2>
                <ol>
                  {milestones.map((milestone, index) => (
                    <li key={index}>
                      <strong>{milestone.title || `Phase ${index + 1}`}</strong> ({milestone.duration} {milestone.duration === 1 ? 'week' : 'weeks'}):
                      {milestone.description && ` ${milestone.description}`}
                    </li>
                  ))}
                </ol>
              </>
            )}
            
            {kpis.length > 0 && (
              <>
                <h2 id="success-metrics">Success Metrics</h2>
                <ul>
                  {kpis.map((kpi, index) => (
                    <li key={index}>
                      <strong>{kpi.name}</strong>: Target {kpi.target} within {kpi.timeframe}
                      {kpi.description && <div><em>{kpi.description}</em></div>}
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            <h2 id="contributing">Contributing</h2>
            <ol>
              <li>Fork the Project</li>
              <li>Create your Feature Branch (<code>git checkout -b feature/AmazingFeature</code>)</li>
              <li>Commit your Changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
              <li>Push to the Branch (<code>git push origin feature/AmazingFeature</code>)</li>
              <li>Open a Pull Request</li>
            </ol>
            
            <h2 id="license">License</h2>
            <p>Distributed under the MIT License. See <code>LICENSE</code> for more information.</p>
            
            <h2 id="contact">Contact</h2>
            <p>Project Link: <a href={`https://github.com/yourusername/${currentProject.name.toLowerCase().replace(/\s+/g, '-')}`}>
              https://github.com/yourusername/{currentProject.name.toLowerCase().replace(/\s+/g, '-')}
            </a></p>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-neutral-600 italic mt-4">
        <p>
          Note: This is a preview of your README.md file. The actual exported file will be in Markdown format and can be used directly in your project repository.
        </p>
      </div>
    </div>
  );
};

export default ReadmePreview;

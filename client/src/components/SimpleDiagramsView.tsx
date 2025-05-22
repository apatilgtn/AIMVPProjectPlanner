import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserFlowDiagram from './UserFlowDiagram';
import DataFlowDiagram from './DataFlowDiagram';
import SystemArchitectureDiagram from './SystemArchitectureDiagram';

export interface DiagramsResponse {
  userFlow?: {
    diagram?: string;
    explanation: string;
  };
  dataFlow?: {
    diagram?: string;
    explanation: string;
  };
  systemArchitecture?: {
    diagram?: string;
    explanation: string;
  };
}

interface SimpleDiagramsViewProps {
  diagrams: DiagramsResponse;
  className?: string;
}

const SimpleDiagramsView: React.FC<SimpleDiagramsViewProps> = ({ diagrams, className = '' }) => {
  const userFlowExplanation = diagrams.userFlow?.explanation || "User flow information not available";
  const dataFlowExplanation = diagrams.dataFlow?.explanation || "Data flow information not available";
  const systemArchExplanation = diagrams.systemArchitecture?.explanation || "System architecture information not available";
  
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>User Flow</CardTitle>
          <CardDescription>How users will interact with your MVP</CardDescription>
        </CardHeader>
        <CardContent>
          <UserFlowDiagram 
            explanation={userFlowExplanation} 
            className="w-full" 
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Flow</CardTitle>
          <CardDescription>How data moves through your MVP</CardDescription>
        </CardHeader>
        <CardContent>
          <DataFlowDiagram 
            explanation={dataFlowExplanation} 
            className="w-full" 
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
          <CardDescription>Technical structure of your MVP</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemArchitectureDiagram 
            explanation={systemArchExplanation} 
            className="w-full" 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDiagramsView;
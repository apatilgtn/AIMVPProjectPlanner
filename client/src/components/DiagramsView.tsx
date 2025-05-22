import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiagramsResponse } from '@/types/ai';
import MermaidDiagram from './MermaidDiagram';
import { BookOpen, Layers, Database, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagramsViewProps {
  diagrams: DiagramsResponse;
  className?: string;
}

const DiagramsView = ({ diagrams, className = '' }: DiagramsViewProps) => {
  const [activeTab, setActiveTab] = useState('user-flow');

  return (
    <Card className={cn('border-slate-200 bg-white shadow', className)}>
      <CardHeader className="border-b border-slate-200 bg-slate-50">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
          <Network className="mr-2 h-5 w-5 text-indigo-600" />
          System Diagrams
        </CardTitle>
        <CardDescription className="text-slate-500">
          Visual representations of your application's architecture and flow
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 bg-slate-100 p-1">
            <TabsTrigger
              value="user-flow"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              User Flow
            </TabsTrigger>
            <TabsTrigger
              value="data-flow"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Database className="mr-2 h-4 w-4" />
              Data Flow
            </TabsTrigger>
            <TabsTrigger
              value="system-architecture"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Layers className="mr-2 h-4 w-4" />
              Architecture
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-flow" className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                <BookOpen className="mr-2 h-4 w-4 text-indigo-600" />
                User Flow Diagram
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                The user flow diagram illustrates the end-to-end journey a user takes through the application.
              </p>
              <MermaidDiagram
                chart={diagrams.userFlowDiagram}
                className="bg-white p-4 rounded-lg overflow-auto max-h-[600px] border border-slate-200"
              />
              <p className="text-sm text-slate-600 mt-4 italic">
                Please refer to the interactive diagram in the web application.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="data-flow" className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                <Database className="mr-2 h-4 w-4 text-indigo-600" />
                Data Flow Diagram
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                This diagram shows how information moves through the system, including data processing and storage.
              </p>
              <MermaidDiagram
                chart={diagrams.dataFlowDiagram}
                className="bg-white p-4 rounded-lg overflow-auto max-h-[600px] border border-slate-200"
              />
              <p className="text-sm text-slate-600 mt-4 italic">
                Please refer to the interactive diagram in the web application.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="system-architecture" className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                <Layers className="mr-2 h-4 w-4 text-indigo-600" />
                System Architecture Diagram
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                The system architecture diagram provides a high-level overview of the technical components.
              </p>
              <MermaidDiagram
                chart={diagrams.systemArchitectureDiagram}
                className="bg-white p-4 rounded-lg overflow-auto max-h-[600px] border border-slate-200"
              />
              <p className="text-sm text-slate-600 mt-4 italic">
                Please refer to the interactive diagram in the web application.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Design Explanation</h3>
          <div className="text-slate-700 text-sm whitespace-pre-line">
            {diagrams.explanation}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagramsView;
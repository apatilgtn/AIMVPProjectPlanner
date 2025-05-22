import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { Network, ArrowLeft } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import SimpleDiagramsView from '@/components/SimpleDiagramsView';
import { DiagramsResponse } from '@/types/ai';

const MvpDiagramViewer = () => {
  const [, navigate] = useLocation();
  const [diagrams, setDiagrams] = useState<DiagramsResponse | null>(null);
  const [match, params] = useRoute<{ planId?: string }>('/diagrams/:planId?');
  
  // Get plan ID from route params or session storage as fallback
  const planId = params?.planId || sessionStorage.getItem('lastViewedPlanId') || '';
  
  // Set lastViewedPlanId in sessionStorage for future reference
  useEffect(() => {
    if (params?.planId) {
      sessionStorage.setItem('lastViewedPlanId', params.planId);
    }
  }, [params?.planId]);

  // Sample data for testing the diagram components
  const sampleDiagrams: DiagramsResponse = {
    userFlowDiagram: "graph TD\n  A[User] --> B[Sign Up/Login]\n  B --> C[Dashboard]\n  C --> D[Create MVP Plan]\n  D --> E[View Results]",
    dataFlowDiagram: "graph LR\n  A[User Input] --> B[API]\n  B --> C[Database]\n  C --> B\n  B --> D[Client]",
    systemArchitectureDiagram: "graph TD\n  A[Frontend] --> B[API Gateway]\n  B --> C[Backend Services]\n  C --> D[Database]",
    explanation: "User Flow: The diagram shows how users navigate through the application starting with sign-up/login, then to the dashboard, creating MVP plans, and finally viewing results.\n\nData Flow: This diagram illustrates how user input flows through the API to the database and back to the client.\n\nSystem Architecture: The system architecture shows the key components including the frontend, API gateway, backend services, and database."
  };

  useEffect(() => {
    // Set the sample diagrams (in a real app, this would come from an API)
    setDiagrams(sampleDiagrams);
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => {
            // Force navigating back to the plan view and not resetting
            window.history.pushState({}, '', '/');
            window.location.reload();
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plan
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">MVP Diagrams Viewer</h1>
      </div>

      <div className="mb-8">
        <Card className="border border-slate-200 bg-white shadow overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Network className="mr-2 h-5 w-5 text-indigo-600" />
              System Diagrams Demo
            </CardTitle>
            <CardDescription className="text-slate-500">
              Here are the simplified HTML-based diagrams for your MVP plan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!diagrams ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Spinner size="lg" />
                <p className="mt-4 text-slate-500">Loading diagrams...</p>
              </div>
            ) : (
              <SimpleDiagramsView diagrams={diagrams} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MvpDiagramViewer;
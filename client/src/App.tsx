import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import SimpleMvpCreator from "@/pages/SimpleMvpCreator";
import MvpDiagramViewer from "@/pages/MvpDiagramViewer";
import ProjectsPage from "@/pages/ProjectsPage";
import MvpPlanDetail from "@/pages/MvpPlanDetail";
import MembersPage from "@/pages/MembersPage";
import AuthPage from "@/pages/auth-page";
import PlaceholderPage from "@/pages/PlaceholderPage";
import { MessageSquare, BarChart, FileText, Users, Archive, Settings, Loader2 } from 'lucide-react';

// Protected route component
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return isAuthenticated ? <Component {...rest} /> : null;
};

function Router() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/">
        <ProtectedRoute component={SimpleMvpCreator} />
      </Route>
      <Route path="/diagrams/:planId?">
        <ProtectedRoute component={MvpDiagramViewer} />
      </Route>
      <Route path="/messages">
        <ProtectedRoute component={() => (
          <PlaceholderPage 
            title="Messages" 
            icon={<MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />} 
            description="Team communication and feedback" 
          />
        )} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={() => (
          <PlaceholderPage 
            title="Analytics" 
            icon={<BarChart className="h-5 w-5 text-indigo-600 mr-2" />} 
            description="Project metrics and insights" 
          />
        )} />
      </Route>
      <Route path="/documents">
        <ProtectedRoute component={() => (
          <PlaceholderPage 
            title="Documents" 
            icon={<FileText className="h-5 w-5 text-indigo-600 mr-2" />} 
            description="Project documentation and resources" 
          />
        )} />
      </Route>
      <Route path="/members">
        <ProtectedRoute component={MembersPage} />
      </Route>
      <Route path="/projects">
        <ProtectedRoute component={ProjectsPage} />
      </Route>
      <Route path="/mvp-plan/:id">
        <ProtectedRoute component={MvpPlanDetail} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={() => (
          <PlaceholderPage 
            title="Settings" 
            icon={<Settings className="h-5 w-5 text-indigo-600 mr-2" />} 
            description="Configure your account and preferences" 
          />
        )} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

import React, { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  HelpCircle, 
  LogOut,
  Sparkles, 
  Zap, 
  Settings, 
  MessageSquare, 
  Users, 
  BarChart, 
  FileText, 
  Archive,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HelpDialog from "./HelpDialog";
import logoImage from "../assets/logo.png";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location, navigate] = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Skip authentication checks on the auth page
  const isAuthPage = location === '/auth';

  useEffect(() => {
    if (!isAuthPage) {
      checkAuth();
    }
  }, [location]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        setIsAuthenticated(true);
        setUsername(user.username);
      } else {
        setIsAuthenticated(false);
        setUsername(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUsername(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate('/auth');
      } else {
        toast({
          title: "Logout failed",
          description: "There was an error logging out.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const handleHelp = () => {
    setShowHelp(true);
  };

  // Don't render the layout on the auth page
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-slate-50 text-slate-700 border-r border-slate-200 fixed top-0 left-0 overflow-y-auto">
        <div className="p-4 flex items-center border-b border-slate-200">
          <img src={logoImage} alt="MVP Assistant Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-lg font-bold text-indigo-600">
            MVP Assistant
          </h1>
        </div>
        
        <div className="p-4">
          <h2 className="text-xs uppercase font-bold text-slate-400 mb-4">Workspace</h2>
          <nav className="space-y-1">
            <Link href="/">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/' || location === '/diagrams' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Zap className="h-5 w-5 mr-3" />
                <span className="font-medium">MVP Planner</span>
              </div>
            </Link>
            <Link href="/messages">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/messages' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <MessageSquare className="h-5 w-5 mr-3" />
                <span>Messages</span>
              </div>
            </Link>
            <Link href="/analytics">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <BarChart className="h-5 w-5 mr-3" />
                <span>Analytics</span>
              </div>
            </Link>
            <Link href="/documents">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/documents' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <FileText className="h-5 w-5 mr-3" />
                <span>Documents</span>
              </div>
            </Link>
          </nav>
        </div>
        
        <div className="p-4 mt-4">
          <h2 className="text-xs uppercase font-bold text-slate-400 mb-4">Team</h2>
          <nav className="space-y-1">
            <Link href="/members">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/members' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Users className="h-5 w-5 mr-3" />
                <span>Members</span>
              </div>
            </Link>
            <Link href="/projects">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/projects' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Archive className="h-5 w-5 mr-3" />
                <span>Projects</span>
              </div>
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200 absolute bottom-0 left-0 w-full">
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/settings">
              <div className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${location === '/settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Settings className="h-5 w-5 mr-2" />
                <span>Settings</span>
              </div>
            </Link>
            <button 
              onClick={handleHelp}
              className="flex items-center py-2 px-3 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              <span>Help</span>
            </button>
          </div>
          {isAuthenticated && (
            <div className="p-3 bg-slate-100 rounded-md flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-indigo-600 rounded-full p-1">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">{username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 p-1 rounded"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 py-3 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logoImage} alt="MVP Assistant Logo" className="h-9 w-9 mr-3" />
              <h1 className="text-xl font-bold text-slate-800">
                AI MVP Planning Assistant
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500 flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
                <span>Powered by Claude AI</span>
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow p-6 bg-slate-50 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Help Dialog */}
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} currentStep={location.split('/')[1] || 'home'} />}
    </div>
  );
};

export default Layout;

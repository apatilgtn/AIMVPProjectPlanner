import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface PlaceholderPageProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon, description }) => {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>

      <Card className="border border-slate-200 bg-white shadow">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            {icon}
            {title}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Coming Soon</h3>
            <p className="text-slate-500 max-w-md">
              This feature is currently in development and will be available in a future update.
              Stay tuned for more exciting features!
            </p>
            <Button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate('/')}
            >
              Return to MVP Planner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
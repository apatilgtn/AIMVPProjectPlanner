import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Archive, Calendar, Eye, FileText, Star, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface MvpPlan {
  id: number;
  projectId: number;
  name: string;
  industry: string;
  audience: string;
  executiveSummary: string;
  createdAt: string;
  // Other fields may be included but we don't need to define them all here
}

const ProjectsPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);

  // Define API response type
  interface ApiResponse {
    success: boolean;
    data: MvpPlan[];
  }
  
  // Fetch MVP plans from the database
  const { data: apiResponse, isLoading, isError, refetch } = useQuery<ApiResponse>({
    queryKey: ['/api/mvp-plans'],
    staleTime: 10000, // 10 seconds
  });
  
  // Extract the MVP plans from the API response
  const mvpPlans = apiResponse?.success ? apiResponse.data : [];

  const handleViewPlan = (id: number) => {
    // Navigate to the detailed view of the MVP plan
    navigate(`/mvp-plan/${id}`);
  };

  const handleExport = (plan: MvpPlan) => {
    // Navigate to the export options of the MVP plan
    if (!plan.projectId) {
      toast({
        title: 'Export Failed',
        description: 'This plan does not have an associated project ID for export.',
        variant: 'destructive'
      });
      return;
    }
    
    navigate(`/mvp-plan/${plan.id}?action=export`);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      // In the future, this should delete the plan
      await apiRequest(`/api/mvp-plans/${id}`, {
        method: 'DELETE',
      });
      await refetch();
      toast({
        title: 'Plan Deleted',
        description: 'Your MVP plan has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting MVP plan:', error);
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting your MVP plan.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="border border-slate-200 bg-white shadow">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
        <CardFooter className="border-t border-slate-200 p-4 flex justify-between bg-slate-50">
          <Skeleton className="h-10 w-24" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardFooter>
      </Card>
    ));
  };

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
        <h1 className="text-2xl font-bold text-slate-800">Saved MVP Plans</h1>
      </div>

      {isError && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4">
            <p className="text-red-600">There was an error loading your saved MVP plans. Please try again.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {isLoading ? (
          renderSkeletons()
        ) : mvpPlans && mvpPlans.length > 0 ? (
          mvpPlans.map((plan) => (
            <Card key={plan.id} className="border border-slate-200 bg-white shadow">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">{plan.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Archive className="h-4 w-4 text-slate-400 mr-1" />
                      {plan.industry}
                    </CardDescription>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(plan.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Target Audience</h3>
                  <p className="text-slate-700">{plan.audience}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Executive Summary</h3>
                  <p className="text-slate-700 line-clamp-3">{plan.executiveSummary}</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-200 p-4 flex justify-between bg-slate-50">
                <Button 
                  variant="outline" 
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={() => handleViewPlan(plan.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Plan
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                    onClick={() => handleExport(plan)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(plan.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="border border-slate-200 bg-white shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Archive className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Saved Plans</h3>
                <p className="text-slate-500 max-w-md mb-6">
                  You haven't saved any MVP plans yet. Generate and save an MVP plan to see it here.
                </p>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => navigate('/')}
                >
                  Create New MVP Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
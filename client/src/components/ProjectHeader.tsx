import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { ProjectType } from '@/contexts/ProjectContext';

interface ProjectHeaderProps {
  title: string;
  subtitle?: string;
  project?: ProjectType | null;
  estimatedTime?: string;
  showAiButton?: boolean;
}

const ProjectHeader = ({ 
  title, 
  subtitle, 
  project, 
  estimatedTime = "5-10 min",
  showAiButton = true 
}: ProjectHeaderProps) => {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-medium text-neutral-800">{title}</h2>
        {subtitle && <p className="text-neutral-600 text-sm mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        {showAiButton && project && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => setLocation(`/ai-generator/${project.id}`)}
          >
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </Button>
        )}
        
        {estimatedTime && (
          <div className="text-neutral-500 text-sm flex items-center whitespace-nowrap">
            <span className="mr-1">⏱️</span>
            Estimated time: {estimatedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SimpleDiagramViewProps {
  title: string;
  description: string;
  explanation: string;
  className?: string;
}

const SimpleDiagramView: React.FC<SimpleDiagramViewProps> = ({
  title,
  description,
  explanation,
  className = '',
}) => {
  return (
    <Card className={cn('border-slate-200 bg-white p-5 shadow-sm', className)}>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      
      <div className="bg-slate-50 p-4 border border-slate-200 rounded-md mb-4">
        <div className="flex flex-col items-center justify-center">
          {/* Simplified diagram visualization */}
          <div className="w-full max-w-lg">
            {/* System diagram boxes */}
            <div className="border-2 border-indigo-500 rounded-md p-3 bg-white mb-4">
              <div className="text-center font-medium text-indigo-600">Frontend / User Interface</div>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-6 bg-indigo-500"></div>
            </div>
            
            <div className="border-2 border-indigo-500 rounded-md p-3 bg-white mb-4">
              <div className="text-center font-medium text-indigo-600">API / Backend Services</div>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-6 bg-indigo-500"></div>
            </div>
            
            <div className="border-2 border-indigo-500 rounded-md p-3 bg-white">
              <div className="text-center font-medium text-indigo-600">Database / Storage</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-slate-700 whitespace-pre-line">
        <p><strong>Explanation:</strong></p>
        <p>{explanation}</p>
      </div>
    </Card>
  );
};

export default SimpleDiagramView;
import React from 'react';
import { Database, Monitor, Server, ArrowRight, ArrowDown } from 'lucide-react';

interface DataFlowDiagramProps {
  explanation: string;
  className?: string;
}

const DataFlowDiagram: React.FC<DataFlowDiagramProps> = ({ explanation, className = '' }) => {
  return (
    <div className={`${className} w-full overflow-auto`}>
      <div className="min-w-[600px] h-[300px] bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between h-full">
          {/* Client */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center shadow-sm w-36">
              <Monitor className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-sm font-medium text-slate-700">Client</div>
              <div className="text-xs text-slate-500 mt-1 text-center">User Interface</div>
            </div>
          </div>

          {/* API Layer */}
          <div className="flex flex-col items-center mx-4">
            <div className="mb-2">
              <ArrowRight className="h-6 w-6 text-slate-400 mx-2" />
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col items-center shadow-sm w-36">
              <Server className="h-8 w-8 text-indigo-500 mb-2" />
              <div className="text-sm font-medium text-slate-700">API</div>
              <div className="text-xs text-slate-500 mt-1 text-center">Business Logic</div>
            </div>
            <div className="mt-2">
              <ArrowDown className="h-6 w-6 text-slate-400 rotate-180" />
            </div>
          </div>

          {/* Database */}
          <div className="flex flex-col items-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center shadow-sm w-36">
              <Database className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-sm font-medium text-slate-700">Database</div>
              <div className="text-xs text-slate-500 mt-1 text-center">Data Storage</div>
            </div>
          </div>
        </div>

        {/* Arrows for the return path */}
        <div className="flex justify-center mt-4">
          <div className="w-full max-w-md flex items-center justify-between px-12">
            <ArrowRight className="h-6 w-6 text-slate-400 transform rotate-180" />
            <ArrowRight className="h-6 w-6 text-slate-400 transform rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowDiagram;
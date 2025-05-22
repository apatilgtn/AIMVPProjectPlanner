import React from 'react';
import { Database, Box, Layers, Globe, Server, ArrowDown } from 'lucide-react';

interface SystemArchitectureDiagramProps {
  explanation: string;
  className?: string;
}

const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ explanation, className = '' }) => {
  return (
    <div className={`${className} w-full overflow-auto`}>
      <div className="min-w-[600px] h-[350px] bg-white p-4 rounded-lg border border-slate-200">
        {/* Frontend Layer */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center shadow-sm w-80">
            <Globe className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-slate-700">Frontend</div>
              <div className="text-xs text-slate-500">React + TypeScript + TailwindCSS</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ArrowDown className="h-6 w-6 text-slate-400" />
        </div>
        
        {/* API Layer */}
        <div className="flex justify-center my-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center shadow-sm w-80">
            <Server className="h-6 w-6 text-indigo-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-slate-700">API Gateway</div>
              <div className="text-xs text-slate-500">Express.js RESTful API</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ArrowDown className="h-6 w-6 text-slate-400" />
        </div>
        
        {/* Services Layer */}
        <div className="flex justify-center my-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center shadow-sm w-80">
            <Layers className="h-6 w-6 text-purple-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-slate-700">Backend Services</div>
              <div className="text-xs text-slate-500">Anthropic Claude AI Integration</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ArrowDown className="h-6 w-6 text-slate-400" />
        </div>
        
        {/* Database Layer */}
        <div className="flex justify-center mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center shadow-sm w-80">
            <Database className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-slate-700">Database</div>
              <div className="text-xs text-slate-500">PostgreSQL with Drizzle ORM</div>
            </div>
          </div>
        </div>
        
        {/* Storage Components - Side */}
        <div className="absolute -right-4 top-1/3 transform -translate-y-1/2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-center shadow-sm w-36 mb-4">
            <Box className="h-5 w-5 text-orange-500 mr-2" />
            <div>
              <div className="text-xs font-medium text-slate-700">File Storage</div>
              <div className="text-[10px] text-slate-500">Document Export</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitectureDiagram;
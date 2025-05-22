import React from 'react';
import { Eye, ArrowRight, User, PanelRight, Plus, Search, Settings } from 'lucide-react';

interface UserFlowDiagramProps {
  explanation: string;
  className?: string;
}

const UserFlowDiagram: React.FC<UserFlowDiagramProps> = ({ explanation, className = '' }) => {
  return (
    <div className={`${className} w-full overflow-auto`}>
      <div className="min-w-[600px] h-[300px] bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between h-full">
          {/* Main Flow */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center w-28">
              <User className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-xs font-medium text-slate-700">User</div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center w-28">
              <Search className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-xs font-medium text-slate-700">Explore MVP Ideas</div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center w-28">
              <Settings className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-xs font-medium text-slate-700">Configure Project</div>
            </div>
          </div>

          {/* Center Flow */}
          <div className="flex flex-col items-center space-y-4 mx-8">
            <div className="h-10"></div> {/* Spacer */}
            <ArrowRight className="h-5 w-5 text-slate-400 rotate-90" />
            <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-3 text-center w-36 text-indigo-800 font-medium">
              <Plus className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-xs font-medium">Create MVP Plan</div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 rotate-90" />
            <div className="h-10"></div> {/* Spacer */}
          </div>

          {/* Output Flow */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center w-28">
              <Eye className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-xs font-medium text-slate-700">View Results</div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center w-28">
              <PanelRight className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-xs font-medium text-slate-700">Export Plan</div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center w-28">
              <svg className="h-6 w-6 mx-auto mb-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-xs font-medium text-green-700">Implement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFlowDiagram;
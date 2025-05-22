import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram = ({ chart, className = '' }: MermaidDiagramProps) => {
  const [loading, setLoading] = useState(true);
  const [svgCode, setSvgCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#4f46e5',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#818cf8',
        lineColor: '#6366f1',
        secondaryColor: '#6366f1',
        tertiaryColor: '#f8fafc'
      }
    });

    const renderChart = async () => {
      if (!chart) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { svg } = await mermaid.render('mermaid-diagram', chart);
        setSvgCode(svg);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        console.error('Mermaid rendering error:', err);
      }
    };

    renderChart();
  }, [chart]);

  if (loading) {
    return (
      <div className={cn('flex justify-center items-center h-40', className)}>
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4 bg-red-50 border border-red-200 rounded-lg text-red-800', className)}>
        <h4 className="font-medium mb-2">Failed to render diagram</h4>
        <p className="text-sm opacity-80">{error}</p>
        <pre className="mt-4 text-xs p-2 bg-slate-100 rounded overflow-auto border border-slate-200">{chart}</pre>
      </div>
    );
  }

  if (!svgCode) {
    return (
      <div className={cn('p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700', className)}>
        <p className="text-center">No diagram data available.</p>
      </div>
    );
  }

  return (
    <div 
      className={cn('mermaid-diagram', className)} 
      ref={mermaidRef}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};

export default MermaidDiagram;
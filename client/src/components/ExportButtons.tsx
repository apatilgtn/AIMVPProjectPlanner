import React from "react";
import { Download, FileText, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  projectId: number;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = React.useState<string | null>(null);

  const exportFlowDiagram = async () => {
    try {
      setIsExporting("flowDiagram");
      const response = await apiRequest("GET", `/api/projects/${projectId}/export/flowdiagram`);
      const data = await response.json();
      
      if (data.success) {
        // Create a downloadable SVG blob
        const svgContent = createSvgFromData(data.data);
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement("a");
        a.href = url;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export successful",
          description: "Flow diagram has been downloaded",
        });
      } else {
        throw new Error(data.message || "Export failed");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export flow diagram",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportPowerPoint = async () => {
    try {
      setIsExporting("powerPoint");
      const response = await apiRequest("GET", `/api/projects/${projectId}/export/powerpoint`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Export successful",
          description: `PowerPoint presentation "${data.fileName}" has been generated`,
        });
        
        // In a real implementation, we would handle the download here
        // For now, we'll just show a success message
      } else {
        throw new Error(data.message || "Export failed");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export PowerPoint",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportReadme = async () => {
    try {
      setIsExporting("readme");
      const response = await apiRequest("GET", `/api/projects/${projectId}/export/readme`);
      const data = await response.json();
      
      if (data.success) {
        // Create a downloadable text blob
        const blob = new Blob([data.content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement("a");
        a.href = url;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export successful",
          description: "README.md has been downloaded",
        });
      } else {
        throw new Error(data.message || "Export failed");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export README",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  // Helper function to create SVG from flow data
  const createSvgFromData = (data: any): string => {
    // This is a simplified implementation
    // In a real app, we would use a proper SVG generator library
    
    const width = 800;
    const height = 600;
    
    let svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
    `;
    
    // Add nodes
    if (data.nodes) {
      data.nodes.forEach((node: any) => {
        const x = node.position.x;
        const y = node.position.y;
        const color = node.data.color || "#e0f2fe";
        
        svg += `
          <g transform="translate(${x}, ${y})">
            <rect width="150" height="60" rx="5" fill="${color}" stroke="#888" stroke-width="1"/>
            <text x="75" y="30" text-anchor="middle" alignment-baseline="middle" font-family="Arial" font-size="12">${node.data.label}</text>
          </g>
        `;
      });
    }
    
    // Add edges
    if (data.edges) {
      data.edges.forEach((edge: any) => {
        const sourceNode = data.nodes.find((n: any) => n.id === edge.source);
        const targetNode = data.nodes.find((n: any) => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const startX = sourceNode.position.x + 75;
          const startY = sourceNode.position.y + 30;
          const endX = targetNode.position.x + 75;
          const endY = targetNode.position.y + 30;
          
          svg += `
            <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#888" stroke-width="1" marker-end="url(#arrowhead)"/>
          `;
        }
      });
    }
    
    // Add arrow marker definition
    svg += `
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#888"/>
        </marker>
      </defs>
    `;
    
    svg += "</svg>";
    return svg;
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Button
        variant="outline"
        onClick={exportFlowDiagram}
        disabled={isExporting !== null}
        className="flex items-center"
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting === "flowDiagram" ? "Exporting..." : "Flow Diagram"}
      </Button>
      
      <Button
        variant="outline"
        onClick={exportPowerPoint}
        disabled={isExporting !== null}
        className="flex items-center"
      >
        <Presentation className="mr-2 h-4 w-4" />
        {isExporting === "powerPoint" ? "Exporting..." : "PowerPoint"}
      </Button>
      
      <Button
        variant="outline"
        onClick={exportReadme}
        disabled={isExporting !== null}
        className="flex items-center"
      >
        <FileText className="mr-2 h-4 w-4" />
        {isExporting === "readme" ? "Exporting..." : "README.md"}
      </Button>
    </div>
  );
};

export default ExportButtons;

import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  NodeTypes,
  Panel,
  useReactFlow,
  MiniMap,
  ConnectionMode,
  NodeDragHandler,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Save, Trash2, Undo, Redo, Download, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Custom node types
const CustomNode = ({ data, selected, dragging, id }: any) => {
  const nodeStyle: React.CSSProperties = {
    background: data.color || 'white',
    borderColor: selected ? 'var(--primary)' : dragging ? 'var(--primary-light)' : 'transparent',
    borderWidth: selected ? '2px' : dragging ? '1px' : '0px',
    borderStyle: 'solid',
    borderRadius: '6px',
    padding: '8px 12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    minWidth: '130px',
    transition: 'all 0.2s ease',
    opacity: dragging ? 0.8 : 1,
    cursor: 'grab',
  };

  // Determine node shape and icon based on type
  let nodeShape = null;
  let nodeIcon = null;
  
  switch (data.type) {
    case 'decision':
      nodeShape = <div className="absolute -z-10 w-full h-full bg-yellow-50 rotate-45 transform-origin-center rounded-sm left-0 top-0"></div>;
      break;
    case 'start':
      nodeStyle.borderRadius = '16px';
      nodeStyle.background = '#d1fae5';
      break;
    case 'end':
      nodeStyle.borderRadius = '16px';
      nodeStyle.background = '#fee2e2';
      break;
  }

  return (
    <div 
      className={`relative ${selected ? 'shadow-md' : 'shadow-sm'}`} 
      style={nodeStyle}
      data-nodeid={id}
    >
      {nodeShape}
      <div className="flex flex-col z-10 relative">
        <div className="font-medium text-xs">{data.label}</div>
        {data.description && (
          <div className="text-[10px] mt-1 text-gray-600 line-clamp-2">{data.description}</div>
        )}
        {data.type && (
          <Badge variant="secondary" className="self-start mt-1 text-[9px] py-0 px-1 h-4">
            {data.type}
          </Badge>
        )}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Form schema for node
const nodeFormSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  type: z.string(),
  description: z.string().optional(),
});

type NodeFormValues = z.infer<typeof nodeFormSchema>;

const FlowDiagramCreator: React.FC = () => {
  const { flowDiagram, setFlowDiagram } = useProject();
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [diagramTitle, setDiagramTitle] = useState('User Journey Map');
  const [diagramDescription, setDiagramDescription] = useState('Visualizes how users interact with the MVP');
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Initialize form
  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: {
      label: '',
      type: 'process',
      description: '',
    },
  });

  // Load diagram from context if available
  React.useEffect(() => {
    if (flowDiagram) {
      setNodes(flowDiagram.nodes);
      setEdges(flowDiagram.edges);
      setDiagramTitle(flowDiagram.title);
      if (flowDiagram.description) {
        setDiagramDescription(flowDiagram.description);
      }
    } else {
      // Initialize with starter nodes if no diagram exists
      const initialNodes: Node[] = [
        {
          id: '1',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: { label: 'Start', type: 'start', color: '#d1fae5' }, // Light green
          draggable: true,
        },
        {
          id: '2',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: { label: 'Process', type: 'process', color: '#e0f2fe' }, // Light blue
          draggable: true,
        },
        {
          id: '3',
          type: 'custom',
          position: { x: 250, y: 300 },
          data: { label: 'End', type: 'end', color: '#fee2e2' }, // Light red
          draggable: true,
        },
      ];

      const initialEdges: Edge[] = [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          markerEnd: { type: MarkerType.Arrow },
          animated: false,
          style: { strokeWidth: 1.5 }
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
          markerEnd: { type: MarkerType.Arrow },
          animated: false,
          style: { strokeWidth: 1.5 }
        },
      ];

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [flowDiagram, setNodes, setEdges]);

  // Save diagram to context
  const saveDiagram = useCallback(() => {
    if (nodes.length === 0) return;

    // Ensure nodes have required properties to match FlowNodeType
    const typedNodes = nodes.map(node => ({
      ...node,
      type: node.type || 'custom', // Ensure type is never undefined
    }));
    
    const diagramData = {
      title: diagramTitle,
      description: diagramDescription,
      nodes: typedNodes,
      edges,
    };

    setFlowDiagram(diagramData as any); // Type cast to fix incompatibility
    
    toast({
      title: "Diagram saved",
      description: "Your flow diagram has been saved successfully.",
    });
  }, [nodes, edges, diagramTitle, diagramDescription, setFlowDiagram, toast]);

  // Handle node drag start for better dragging UX
  const onNodeDragStart: NodeDragHandler = useCallback((_, node) => {
    // Update other nodes to show which one is being dragged
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isDragging: n.id === node.id,
        },
      }))
    );
  }, [setNodes]);

  // Handle node drag stop
  const onNodeDragStop: NodeDragHandler = useCallback((_, node) => {
    // Reset dragging state for all nodes
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isDragging: false,
        },
      }))
    );
  }, [setNodes]);

  // Add node
  const addNode = (nodeData: NodeFormValues) => {
    if (!reactFlowInstance) return;
    
    // Get center of viewport to place new node
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = reactFlowInstance.project({ x: reactFlowWrapper.current?.clientWidth || 500, y: 0 }).x / 2;
    const centerY = reactFlowInstance.project({ x: 0, y: reactFlowWrapper.current?.clientHeight || 500 }).y / 2;
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: centerX, y: centerY },
      data: {
        label: nodeData.label,
        type: nodeData.type,
        description: nodeData.description,
        color: getNodeColor(nodeData.type),
      },
      draggable: true,
    };

    setNodes((nds) => [...nds, newNode]);
    setShowNodeForm(false);
    form.reset();
  };

  // Update node
  const updateNode = (nodeData: NodeFormValues) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: nodeData.label,
              type: nodeData.type,
              description: nodeData.description,
              color: getNodeColor(nodeData.type),
            },
          };
        }
        return node;
      })
    );

    setSelectedNode(null);
    setShowNodeForm(false);
    form.reset();
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    
    // Remove node
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    
    // Remove edges connected to this node
    setEdges((eds) => 
      eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)
    );
    
    setSelectedNode(null);
  };

  // Handle node click
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    form.setValue('label', node.data.label);
    form.setValue('type', node.data.type || 'process');
    form.setValue('description', node.data.description || '');
    setShowNodeForm(true);
  };

  // Handle connection
  const onConnect = useCallback((connection: Connection) => {
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      markerEnd: { type: MarkerType.Arrow },
      animated: false,
      style: { strokeWidth: 1.5 }
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  // Get node color based on type
  const getNodeColor = (type: string): string => {
    switch (type) {
      case 'start':
        return '#d1fae5'; // Light green
      case 'end':
        return '#fee2e2'; // Light red
      case 'decision':
        return '#fef3c7'; // Light yellow
      case 'input':
        return '#dbeafe'; // Light blue
      case 'output':
        return '#e0e7ff'; // Light purple
      default:
        return '#e0f2fe'; // Light blue (process)
    }
  };

  // Fit view to see all nodes
  const fitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  };

  // Center selected node
  const centerSelectedNode = () => {
    if (selectedNode && reactFlowInstance) {
      reactFlowInstance.setCenter(
        selectedNode.position.x,
        selectedNode.position.y,
        { duration: 800 }
      );
    }
  };

  return (
    <div className="w-full h-[600px] border border-neutral-200 rounded-md overflow-hidden bg-slate-50" ref={reactFlowWrapper}>
      <div className="flex h-full">
        <div className="w-full h-full flex flex-col">
          <div className="px-3 py-2 border-b border-neutral-200 bg-white">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Diagram Title"
                  value={diagramTitle}
                  onChange={(e) => setDiagramTitle(e.target.value)}
                  className="font-medium text-xs h-7"
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="px-2 h-7" onClick={saveDiagram}>
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Save Diagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1.5">
              <Textarea
                placeholder="Brief description of this diagram"
                value={diagramDescription}
                onChange={(e) => setDiagramDescription(e.target.value)}
                className="text-xs resize-none h-10 py-1 px-2 min-h-0"
              />
            </div>
          </div>
          
          <div className="flex-grow relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
              minZoom={0.2}
              maxZoom={4}
              connectionMode={ConnectionMode.Loose}
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              <Background size={1} gap={16} color="#f1f5f9" />
              <MiniMap 
                nodeStrokeWidth={3}
                zoomable
                pannable
                nodeColor={(node) => {
                  return node.data.color || '#e0f2fe';
                }}
                maskColor="rgba(241, 245, 249, 0.5)"
                className="bg-white border border-slate-200 rounded-md shadow-sm"
              />
              <Controls showInteractive={false} className="bg-white shadow-sm border border-slate-200 rounded-md">
                <Panel position="bottom-left" className="bg-white shadow-sm border border-slate-200 rounded-md p-1 -ml-1 -mb-1 flex flex-col gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fitView}>
                          <Maximize2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Fit View</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {selectedNode && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={centerSelectedNode}>
                            <Minimize2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Center Selected</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Panel>
              </Controls>
              <Panel position="top-right" className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-7 text-xs shadow-sm"
                        onClick={() => { setSelectedNode(null); setShowNodeForm(true); }}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> Add Node
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Add a new node</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {selectedNode && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="destructive" className="h-7 text-xs shadow-sm" onClick={deleteSelectedNode}>
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Delete selected node</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* Node form dialog */}
      <Dialog open={showNodeForm} onOpenChange={setShowNodeForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{selectedNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
            <DialogDescription className="text-xs">
              {selectedNode 
                ? 'Update the properties of this node.' 
                : 'Create a new node for your flow diagram.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(selectedNode ? updateNode : addNode)} className="space-y-3">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Node label" {...field} className="h-8 text-xs" />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      The main text that appears on the node
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Node Type</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select a node type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="start" className="text-xs">Start</SelectItem>
                        <SelectItem value="process" className="text-xs">Process</SelectItem>
                        <SelectItem value="decision" className="text-xs">Decision</SelectItem>
                        <SelectItem value="input" className="text-xs">Input</SelectItem>
                        <SelectItem value="output" className="text-xs">Output</SelectItem>
                        <SelectItem value="end" className="text-xs">End</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-[10px]">
                      The type affects the node's appearance and meaning
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of this node" 
                        className="resize-none text-xs h-16 min-h-0"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Additional details to display below the node label
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="gap-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowNodeForm(false);
                    setSelectedNode(null);
                    form.reset();
                  }}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs">
                  {selectedNode ? 'Update' : 'Add'} Node
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlowDiagramCreator;

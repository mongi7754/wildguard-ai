import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Circle, 
  AlertTriangle, 
  Crosshair,
  Filter,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GraphNode {
  id: string;
  type: 'animal' | 'poacher' | 'route' | 'market' | 'weapon' | 'location';
  label: string;
  x: number;
  y: number;
  riskScore: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

const mockNodes: GraphNode[] = [
  { id: 'n1', type: 'animal', label: 'Elephant Herd A', x: 30, y: 25, riskScore: 0.8 },
  { id: 'n2', type: 'animal', label: 'Rhino Group', x: 60, y: 35, riskScore: 0.95 },
  { id: 'n3', type: 'poacher', label: 'Suspect #127', x: 45, y: 50, riskScore: 0.9 },
  { id: 'n4', type: 'route', label: 'Northern Trail', x: 25, y: 55, riskScore: 0.7 },
  { id: 'n5', type: 'market', label: 'Black Market Hub', x: 75, y: 65, riskScore: 0.85 },
  { id: 'n6', type: 'location', label: 'Sector 7 Camp', x: 50, y: 20, riskScore: 0.6 },
  { id: 'n7', type: 'weapon', label: 'Confiscated Rifle', x: 35, y: 70, riskScore: 0.5 },
  { id: 'n8', type: 'poacher', label: 'Suspect #089', x: 70, y: 45, riskScore: 0.75 },
];

const mockEdges: GraphEdge[] = [
  { source: 'n3', target: 'n2', type: 'targeting', weight: 0.9 },
  { source: 'n3', target: 'n4', type: 'uses_route', weight: 0.8 },
  { source: 'n3', target: 'n5', type: 'connected_to', weight: 0.7 },
  { source: 'n8', target: 'n1', type: 'targeting', weight: 0.6 },
  { source: 'n8', target: 'n5', type: 'connected_to', weight: 0.85 },
  { source: 'n7', target: 'n3', type: 'belonged_to', weight: 1 },
  { source: 'n4', target: 'n6', type: 'leads_to', weight: 0.5 },
];

const nodeColors = {
  animal: 'bg-primary',
  poacher: 'bg-danger',
  route: 'bg-accent',
  market: 'bg-purple-500',
  weapon: 'bg-orange-500',
  location: 'bg-blue-500'
};

const nodeEmojis = {
  animal: '🐘',
  poacher: '👤',
  route: '🛤️',
  market: '💰',
  weapon: '🔫',
  location: '📍'
};

export default function IntelligenceGraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [zoom, setZoom] = useState(1);

  const filteredNodes = activeFilter === 'all' 
    ? mockNodes 
    : mockNodes.filter(n => n.type === activeFilter);

  const filteredEdges = mockEdges.filter(e => 
    filteredNodes.find(n => n.id === e.source) && 
    filteredNodes.find(n => n.id === e.target)
  );

  return (
    <AppLayout title="Intelligence Graph">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 mb-3">
            <Network className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="font-display text-xl font-bold">Global Intelligence Graph</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered threat relationship mapping
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          {Object.keys(nodeColors).map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(type)}
              className="capitalize shrink-0"
            >
              {nodeEmojis[type as keyof typeof nodeEmojis]} {type}
            </Button>
          ))}
        </div>

        {/* Graph Visualization */}
        <Card variant="glow" className="overflow-hidden">
          <div className="relative aspect-square bg-forest-dark" style={{ transform: `scale(${zoom})` }}>
            {/* Grid */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {filteredEdges.map((edge, i) => {
                const source = filteredNodes.find(n => n.id === edge.source);
                const target = filteredNodes.find(n => n.id === edge.target);
                if (!source || !target) return null;

                return (
                  <motion.line
                    key={i}
                    x1={`${source.x}%`}
                    y1={`${source.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={edge.type === 'targeting' ? 'hsl(0, 72%, 51%)' : 'hsl(var(--primary))'}
                    strokeWidth={edge.weight * 2}
                    strokeOpacity={0.5}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {filteredNodes.map((node, i) => (
              <motion.div
                key={node.id}
                className="absolute cursor-pointer"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedNode(node)}
              >
                <div className={cn(
                  "relative -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110",
                  nodeColors[node.type],
                  selectedNode?.id === node.id && "ring-2 ring-white ring-offset-2 ring-offset-background"
                )}>
                  <span className="text-lg">{nodeEmojis[node.type]}</span>
                  {node.riskScore > 0.8 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="icon-sm" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => setZoom(1)}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="tactical" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    nodeColors[selectedNode.type]
                  )}>
                    <span className="text-lg">{nodeEmojis[selectedNode.type]}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedNode.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedNode.type}</p>
                  </div>
                </div>
                <Badge variant={selectedNode.riskScore > 0.8 ? 'danger' : selectedNode.riskScore > 0.5 ? 'warning' : 'success'}>
                  Risk: {Math.round(selectedNode.riskScore * 100)}%
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Connections:</p>
                {mockEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((edge, i) => {
                  const connectedId = edge.source === selectedNode.id ? edge.target : edge.source;
                  const connectedNode = mockNodes.find(n => n.id === connectedId);
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs bg-secondary/50 rounded-lg p-2">
                      <span>{nodeEmojis[connectedNode?.type as keyof typeof nodeEmojis]}</span>
                      <span className="flex-1">{connectedNode?.label}</span>
                      <Badge variant="outline" className="text-[10px]">{edge.type}</Badge>
                    </div>
                  );
                })}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setSelectedNode(null)}>
                Close
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="tactical" className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{mockNodes.length}</p>
            <p className="text-[10px] text-muted-foreground">Nodes</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <p className="text-2xl font-bold text-accent">{mockEdges.length}</p>
            <p className="text-[10px] text-muted-foreground">Connections</p>
          </Card>
          <Card variant="tactical" className="p-3 text-center">
            <p className="text-2xl font-bold text-danger">
              {mockNodes.filter(n => n.riskScore > 0.8).length}
            </p>
            <p className="text-[10px] text-muted-foreground">High Risk</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

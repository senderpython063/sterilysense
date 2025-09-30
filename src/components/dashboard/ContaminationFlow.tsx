import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, TrendingUp, AlertTriangle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowData {
  id: string;
  source: string;
  intermediate: string;
  destination: string;
  riskLevel: 'high' | 'medium' | 'low';
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  severity: number;
}

const ContaminationFlow: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
  const [flowData, setFlowData] = useState<FlowData[]>([
    {
      id: 'flow1',
      source: 'High-Touch Surfaces',
      intermediate: 'Low UV (< 70%) + High Humidity (> 65%)',
      destination: 'Critical Risk Zone',
      riskLevel: 'high',
      count: 127,
      percentage: 78,
      trend: 'up',
      severity: 95
    },
    {
      id: 'flow2',
      source: 'Medium-Touch Surfaces', 
      intermediate: 'Medium UV (70-85%) + Med Humidity (45-65%)',
      destination: 'Moderate Risk Zone',
      riskLevel: 'medium',
      count: 68,
      percentage: 45,
      trend: 'stable',
      severity: 65
    },
    {
      id: 'flow3',
      source: 'Low-Touch Surfaces',
      intermediate: 'High UV (> 85%) + Low Humidity (< 45%)',
      destination: 'Minimal Risk Zone',
      riskLevel: 'low',
      count: 234,
      percentage: 18,
      trend: 'down',
      severity: 25
    },
    {
      id: 'flow4',
      source: 'Door/Entry Points',
      intermediate: 'Variable UV + Motion Interference',
      destination: 'Dynamic Risk Zone',
      riskLevel: 'high',
      count: 89,
      percentage: 72,
      trend: 'up',
      severity: 85
    },
    {
      id: 'flow5',
      source: 'Medical Equipment',
      intermediate: 'Targeted UV + Controlled Environment',
      destination: 'Sterile Zone',
      riskLevel: 'low',
      count: 156,
      percentage: 12,
      trend: 'down',
      severity: 15
    }
  ]);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowData(prev => prev.map(flow => ({
        ...flow,
        count: Math.max(5, flow.count + Math.round((Math.random() - 0.5) * 10)),
        percentage: Math.max(5, Math.min(95, flow.percentage + (Math.random() - 0.5) * 5)),
        severity: Math.max(10, Math.min(100, flow.severity + (Math.random() - 0.5) * 3))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'hsl(var(--danger))';
      case 'medium': return 'hsl(var(--warning))';
      case 'low': return 'hsl(var(--success))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-danger" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-success rotate-180" />;
      default: return <div className="w-3 h-3 bg-muted rounded-full" />;
    }
  };

  const filteredFlows = selectedRisk === 'all' ? flowData : flowData.filter(flow => flow.riskLevel === selectedRisk);

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <GitBranch className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Advanced Contamination Flow Map</h3>
              <p className="text-sm text-muted-foreground">Interactive Risk Pathway Analysis</p>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(['all', 'high', 'medium', 'low'] as const).map((risk) => (
              <Button
                key={risk}
                variant={selectedRisk === risk ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk(risk)}
                className="text-xs capitalize"
              >
                {risk === 'all' ? 'All Risks' : `${risk} Risk`}
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Flow Visualization */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredFlows.map((flow, i) => (
              <motion.div
                key={flow.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Flow Container */}
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/30 bg-muted/10 hover:bg-muted/20 transition-all">
                  {/* Source */}
                  <div className="flex-shrink-0 w-48">
                    <Badge className="bg-primary/20 text-primary w-full justify-center py-2">
                      {flow.source}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1 text-center">
                      {flow.count} detections
                    </div>
                  </div>

                  {/* Animated Flow Arrow */}
                  <div className="flex-1 relative h-8">
                    <div 
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{ backgroundColor: getRiskColor(flow.riskLevel) }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${getRiskColor(flow.riskLevel)} 0%, transparent 100%)`
                      }}
                      animate={{ 
                        width: [
                          `${flow.percentage}%`,
                          `${Math.min(100, flow.percentage + 10)}%`,
                          `${flow.percentage}%`
                        ]
                      }}
                      transition={{ 
                        duration: 2 / animationSpeed, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    
                    {/* Flow particles animation */}
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <motion.div
                          key={idx}
                          className="absolute w-2 h-2 rounded-full opacity-60"
                          style={{ backgroundColor: getRiskColor(flow.riskLevel) }}
                          animate={{
                            x: ['-10%', '100%'],
                            opacity: [0, 1, 1, 0]
                          }}
                          transition={{
                            duration: 3 / animationSpeed,
                            repeat: Infinity,
                            delay: idx * 0.5,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Percentage indicator */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-mono bg-background/80 px-2 py-1 rounded">
                      {flow.percentage.toFixed(1)}%
                    </div>
                  </div>

                  {/* Intermediate Condition */}
                  <div className="flex-shrink-0 w-64">
                    <Badge className="bg-warning/20 text-warning w-full justify-center py-2 text-center">
                      {flow.intermediate}
                    </Badge>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {getTrendIcon(flow.trend)}
                      <span className="text-xs text-muted-foreground">
                        Severity: {flow.severity.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex-shrink-0 w-48">
                    <Badge 
                      className={`w-full justify-center py-2 ${
                        flow.riskLevel === 'high' ? 'bg-danger/20 text-danger' :
                        flow.riskLevel === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-success/20 text-success'
                      }`}
                    >
                      {flow.destination}
                    </Badge>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {flow.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 text-danger" />}
                      <span className="text-xs text-muted-foreground">
                        Risk: {flow.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border border-border/30 p-3">
            <div className="text-sm text-muted-foreground">Total Pathways</div>
            <div className="text-2xl font-bold text-primary">{filteredFlows.length}</div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-3">
            <div className="text-sm text-muted-foreground">High Risk Cases</div>
            <div className="text-2xl font-bold text-danger">
              {flowData.filter(f => f.riskLevel === 'high').reduce((sum, f) => sum + f.count, 0)}
            </div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-3">
            <div className="text-sm text-muted-foreground">Avg. Severity</div>
            <div className="text-2xl font-bold text-warning">
              {(filteredFlows.reduce((sum, f) => sum + f.severity, 0) / filteredFlows.length).toFixed(1)}%
            </div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-3">
            <div className="text-sm text-muted-foreground">Improvement Rate</div>
            <div className="text-2xl font-bold text-success">
              {flowData.filter(f => f.trend === 'down').length}/{flowData.length}
            </div>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-primary">AI Risk Pathway Insight</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {flowData.filter(f => f.riskLevel === 'high').length > 2 
              ? "⚠️ Critical: Multiple high-risk pathways detected. Recommend increasing UV intensity in high-touch zones and reducing ambient humidity."
              : "✅ Optimal: Most contamination pathways are under control. Current UV protocols are effective."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ContaminationFlow;

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Timer, 
  Maximize2,
  PlayCircle,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts';

interface CycleData {
  id: string;
  startTime: string;
  endTime: string;
  beforeScore: number;
  afterScore: number;
  uvIntensity: number;
  duration: number;
  bacterialReduction: number;
  efficiency: number;
  location: string;
  status: 'completed' | 'running' | 'scheduled';
}

const EnhancedHygieneScores: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState<string>('cycle_3');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showComparison, setShowComparison] = useState(true);

  const [cycles, setCycles] = useState<CycleData[]>([
    {
      id: 'cycle_1',
      startTime: '09:15 AM',
      endTime: '09:20 AM',
      beforeScore: 28,
      afterScore: 91,
      uvIntensity: 89,
      duration: 5,
      bacterialReduction: 94,
      efficiency: 98,
      location: 'Door Handle Area',
      status: 'completed'
    },
    {
      id: 'cycle_2',
      startTime: '10:30 AM',
      endTime: '10:36 AM',
      beforeScore: 15,
      afterScore: 96,
      uvIntensity: 92,
      duration: 6,
      bacterialReduction: 97,
      efficiency: 99,
      location: 'Bed Rail Zone',
      status: 'completed'
    },
    {
      id: 'cycle_3',
      startTime: '11:45 AM',
      endTime: '11:52 AM',
      beforeScore: 45,
      afterScore: 88,
      uvIntensity: 85,
      duration: 7,
      bacterialReduction: 89,
      efficiency: 95,
      location: 'Medical Equipment',
      status: 'running'
    },
    {
      id: 'cycle_4',
      startTime: '1:00 PM',
      endTime: 'Scheduled',
      beforeScore: 62,
      afterScore: 0,
      uvIntensity: 0,
      duration: 0,
      bacterialReduction: 0,
      efficiency: 0,
      location: 'Patient Room Central',
      status: 'scheduled'
    }
  ]);

  // Real-time updates for running cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCycles(prev => prev.map(cycle => {
        if (cycle.status === 'running') {
          return {
            ...cycle,
            afterScore: Math.min(95, cycle.afterScore + Math.random() * 2),
            uvIntensity: 85 + Math.random() * 10,
            bacterialReduction: Math.min(98, cycle.bacterialReduction + Math.random() * 1),
            efficiency: Math.min(99, cycle.efficiency + Math.random() * 0.5)
          };
        }
        return cycle;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentCycle = cycles.find(c => c.id === selectedCycle)!;
  
  // Data for radial charts
  const beforeData = [
    { name: 'Before', value: currentCycle.beforeScore, fill: 'hsl(var(--danger))' }
  ];
  
  const afterData = [
    { name: 'After', value: currentCycle.afterScore, fill: 'hsl(var(--success))' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const improvement = currentCycle.afterScore - currentCycle.beforeScore;

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Advanced Hygiene Score Analysis</h3>
              <p className="text-sm text-muted-foreground">Before & After UV Disinfection Results</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              {showComparison ? 'Hide' : 'Show'} Comparison
            </Button>
            <Badge className={`bg-${getScoreColor(currentCycle.afterScore)}/20 text-${getScoreColor(currentCycle.afterScore)}`}>
              Grade: {getScoreGrade(currentCycle.afterScore)}
            </Badge>
          </div>
        </div>

        {/* Cycle Selector */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {cycles.map((cycle) => (
            <Button
              key={cycle.id}
              variant={selectedCycle === cycle.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCycle(cycle.id)}
              className="flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                {cycle.status === 'running' && <PlayCircle className="w-3 h-3 animate-pulse" />}
                {cycle.status === 'scheduled' && <Timer className="w-3 h-3" />}
                {cycle.status === 'completed' && <Shield className="w-3 h-3" />}
                Cycle {cycle.id.split('_')[1]}
              </div>
            </Button>
          ))}
        </div>

        {/* Main Comparison View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Before Score */}
          <Card className="glass-card border border-danger/30 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-danger rounded-full" />
                <h4 className="text-lg font-semibold text-danger">Before UV Treatment</h4>
              </div>
              
              <div className="relative w-48 h-48 mx-auto mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={beforeData} innerRadius="60%" outerRadius="90%" startAngle={90} endAngle={450}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="hsl(var(--danger))" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-danger">{currentCycle.beforeScore}</div>
                    <div className="text-sm text-muted-foreground">Hygiene Score</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge variant="outline" className="bg-danger/20 text-danger">
                    {currentCycle.beforeScore < 50 ? 'Critical' : currentCycle.beforeScore < 70 ? 'High' : 'Medium'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="font-mono text-danger">{getScoreGrade(currentCycle.beforeScore)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* After Score */}
          <Card className="glass-card border border-success/30 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <h4 className="text-lg font-semibold text-success">After UV Treatment</h4>
              </div>
              
              <div className="relative w-48 h-48 mx-auto mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={afterData} innerRadius="60%" outerRadius="90%" startAngle={90} endAngle={450}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="hsl(var(--success))" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div 
                      className="text-4xl font-bold text-success"
                      animate={currentCycle.status === 'running' ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {currentCycle.status === 'running' ? 
                        currentCycle.afterScore.toFixed(0) : 
                        currentCycle.status === 'scheduled' ? '---' : currentCycle.afterScore
                      }
                    </motion.div>
                    <div className="text-sm text-muted-foreground">
                      {currentCycle.status === 'running' ? 'Live Update' : 'Hygiene Score'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className={`bg-${getScoreColor(currentCycle.afterScore)}/20 text-${getScoreColor(currentCycle.afterScore)}`}>
                    {currentCycle.status === 'running' ? 'Processing...' : currentCycle.status === 'scheduled' ? 'Pending' : 'Sterilized'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className={`font-mono text-${getScoreColor(currentCycle.afterScore)}`}>
                    {currentCycle.status === 'scheduled' ? '---' : getScoreGrade(currentCycle.afterScore)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Improvement Metrics */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
              <Card className="glass-card border border-border/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Improvement</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  +{improvement > 0 ? improvement.toFixed(0) : '0'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((improvement / currentCycle.beforeScore) * 100).toFixed(1)}% increase
                </div>
              </Card>

              <Card className="glass-card border border-border/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-warning" />
                  <span className="text-sm text-muted-foreground">UV Intensity</span>
                </div>
                <div className="text-2xl font-bold text-warning">
                  {currentCycle.uvIntensity.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Optimal: 85-95%
                </div>
              </Card>

              <Card className="glass-card border border-border/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-muted-foreground">Duration</span>
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {currentCycle.duration > 0 ? `${currentCycle.duration}min` : '--'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentCycle.status === 'running' ? 'In progress...' : 'Completed'}
                </div>
              </Card>

              <Card className="glass-card border border-border/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">Efficiency</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  {currentCycle.efficiency > 0 ? `${currentCycle.efficiency.toFixed(0)}%` : '--'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Bacterial reduction: {currentCycle.bacterialReduction.toFixed(0)}%
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cycle Details */}
        <Card className="glass-card border border-border/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Cycle Details: {currentCycle.location}</h4>
            <Badge variant="outline" className="font-mono">
              {currentCycle.startTime} → {currentCycle.endTime}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Location</div>
              <div className="font-medium">{currentCycle.location}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Status</div>
              <div className="font-medium capitalize">{currentCycle.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Bacterial Reduction</div>
              <div className="font-medium">{currentCycle.bacterialReduction.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Next Scheduled</div>
              <div className="font-medium">
                {cycles.find(c => c.status === 'scheduled')?.startTime || 'None'}
              </div>
            </div>
          </div>

          {currentCycle.status === 'running' && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>Estimated 2 min remaining</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </Card>
      </div>
    </Card>
  );
};

export default EnhancedHygieneScores;
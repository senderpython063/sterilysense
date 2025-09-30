import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface HygieneScore {
  location: string;
  before: number;
  after: number;
  improvement: number;
  status: 'improved' | 'worsened' | 'stable';
  lastCycle: string;
}

const HygieneScoreCards: React.FC = () => {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunningCycle, setIsRunningCycle] = useState(false);
  const [scores, setScores] = useState<HygieneScore[]>([
    {
      location: 'Door Handle',
      before: 45,
      after: 88,
      improvement: 95.6,
      status: 'improved',
      lastCycle: '10:15 AM'
    },
    {
      location: 'Bed Rail',
      before: 62,
      after: 91,
      improvement: 46.8,
      status: 'improved',
      lastCycle: '10:15 AM'
    },
    {
      location: 'IV Stand',
      before: 78,
      after: 95,
      improvement: 77.3,
      status: 'improved',
      lastCycle: '10:15 AM'
    },
    {
      location: 'Monitor Screen',
      before: 35,
      after: 82,
      improvement: 135.7,
      status: 'improved',
      lastCycle: '10:15 AM'
    },
    {
      location: 'Light Switch',
      before: 58,
      after: 89,
      improvement: 53.4,
      status: 'improved',
      lastCycle: '10:15 AM'
    },
    {
      location: 'Cabinet Handle',
      before: 41,
      after: 85,
      improvement: 107.3,
      status: 'improved',
      lastCycle: '10:15 AM'
    }
  ]);

  const runNewCycle = async () => {
    setIsRunningCycle(true);
    
    // Simulate UV cycle duration
    setTimeout(() => {
      const newScores = scores.map(score => {
        const newBefore = 30 + Math.random() * 50; // Random contamination
        const newAfter = Math.min(95, newBefore + 30 + Math.random() * 40); // UV improvement
        const improvement = ((newAfter - newBefore) / newBefore) * 100;
        
        return {
          ...score,
          before: Math.round(newBefore),
          after: Math.round(newAfter),
          improvement: Math.round(improvement * 10) / 10,
          status: improvement > 0 ? 'improved' as const : 'stable' as const,
          lastCycle: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      
      setScores(newScores);
      setCurrentCycle(prev => prev + 1);
      setIsRunningCycle(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-success/20';
    if (score >= 60) return 'bg-warning/20';
    return 'bg-danger/20';
  };

  const getImprovementIcon = (status: string) => {
    switch (status) {
      case 'improved': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'worsened': return <TrendingDown className="w-4 h-4 text-danger" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Before & After Hygiene Scores</h3>
              <p className="text-sm text-muted-foreground">Cycle #{currentCycle} Results</p>
            </div>
          </div>
          
          <Button
            onClick={runNewCycle}
            disabled={isRunningCycle}
            className="bg-gradient-primary border-0"
          >
            {isRunningCycle ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 mr-2" />
              </motion.div>
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isRunningCycle ? 'Running UV Cycle...' : 'Run New Cycle'}
          </Button>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores.map((score, index) => (
            <motion.div
              key={score.location}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="glass-card border border-border/30 hover:border-primary/50 transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{score.location}</h4>
                    <Badge variant="outline" className="text-xs font-mono">
                      {score.lastCycle}
                    </Badge>
                  </div>

                  {/* Before & After Display */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Before</div>
                      <div className={`text-2xl font-bold ${getScoreColor(score.before)}`}>
                        {score.before}%
                      </div>
                    </div>
                    
                    <div className="flex items-center mx-3">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">After</div>
                      <div className={`text-2xl font-bold ${getScoreColor(score.after)}`}>
                        {score.after}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Progress 
                      value={score.after} 
                      className="h-2"
                    />
                  </div>

                  {/* Improvement Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getImprovementIcon(score.status)}
                      <span className="text-sm font-medium text-success">
                        +{score.improvement}%
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(score.after)}`}>
                      {score.after >= 80 ? 'Excellent' : score.after >= 60 ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card border border-border/30 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {Math.round(scores.reduce((sum, s) => sum + s.improvement, 0) / scores.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Improvement</div>
            </div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(scores.reduce((sum, s) => sum + s.after, 0) / scores.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Hygiene Score</div>
            </div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {scores.filter(s => s.after >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Excellent Zones</div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default HygieneScoreCards;
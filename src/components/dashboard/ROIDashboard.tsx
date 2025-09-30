import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Droplets, Zap, Clock, TrendingUp, Leaf } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ROIMetrics {
  chemicalsSaved: number;
  energyUsed: number;
  laborSaved: number;
  costSavings: number;
  totalCycles: number;
  co2Reduced: number;
  waterSaved: number;
}

const ROIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>({
    chemicalsSaved: 2.4,
    energyUsed: 0.8,
    laborSaved: 3.2,
    costSavings: 485,
    totalCycles: 24,
    co2Reduced: 15.6,
    waterSaved: 120
  });

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        chemicalsSaved: prev.chemicalsSaved + (Math.random() * 0.1),
        energyUsed: prev.energyUsed + (Math.random() * 0.05),
        laborSaved: prev.laborSaved + (Math.random() * 0.2),
        costSavings: prev.costSavings + Math.floor(Math.random() * 5),
        totalCycles: prev.totalCycles + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const savingsData = [
    { name: 'Chemical Costs', value: 220, color: 'hsl(var(--primary))' },
    { name: 'Labor Costs', value: 185, color: 'hsl(var(--secondary))' },
    { name: 'Water Costs', value: 80, color: 'hsl(var(--success))' }
  ];

  const efficiencyData = [
    { month: 'Jan', traditional: 100, sterilysense: 35 },
    { month: 'Feb', traditional: 98, sterilysense: 32 },
    { month: 'Mar', traditional: 105, sterilysense: 28 },
    { month: 'Apr', traditional: 102, sterilysense: 31 },
    { month: 'May', traditional: 108, sterilysense: 29 },
    { month: 'Jun', traditional: 95, sterilysense: 26 }
  ];

  const getTimeframeMultiplier = () => {
    switch (timeframe) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
    }
  };

  const multiplier = getTimeframeMultiplier();

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">ROI Dashboard</h3>
              <p className="text-sm text-muted-foreground">Resources & Energy Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeframe === period 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border border-border/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Droplets className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">Chemicals Saved</div>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {(metrics.chemicalsSaved * multiplier).toFixed(1)}L
              </div>
              <div className="text-xs text-muted-foreground">
                🌿 ${Math.round(metrics.chemicalsSaved * multiplier * 12)} saved
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border border-border/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Zap className="w-4 h-4 text-warning" />
                </div>
                <div className="text-sm text-muted-foreground">Energy Used</div>
              </div>
              <div className="text-2xl font-bold text-warning mb-1">
                {(metrics.energyUsed * multiplier).toFixed(1)} kWh
              </div>
              <div className="text-xs text-muted-foreground">
                ⚡ 68% efficient vs traditional
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border border-border/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div className="text-sm text-muted-foreground">Labor Saved</div>
              </div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {(metrics.laborSaved * multiplier).toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground">
                👷 {Math.round(metrics.totalCycles * multiplier)} cycles automated
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border border-border/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-success/20">
                  <DollarSign className="w-4 h-4 text-success" />
                </div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </div>
              <div className="text-2xl font-bold text-success mb-1">
                ${Math.round(metrics.costSavings * multiplier)}
              </div>
              <div className="text-xs text-muted-foreground">
                📈 +{Math.round(((metrics.costSavings * multiplier) / 1000) * 100)}% ROI
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cost Savings Breakdown */}
          <Card className="glass-card border border-border/30 p-4">
            <h4 className="font-semibold text-foreground mb-4">Cost Savings Breakdown</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={savingsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {savingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid teal',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  labelStyle={{ color: 'white' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Efficiency Comparison */}
          <Card className="glass-card border border-border/30 p-4">
            <h4 className="font-semibold text-foreground mb-4">Cost Comparison (Monthly)</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'grey',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Legend />
                <Bar dataKey="traditional" fill="white" name="Traditional Methods" />
                <Bar dataKey="sterilysense" fill="hsl(var(--primary))" name="SterilySense" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Environmental Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Leaf className="w-5 h-5 text-success" />
              <h4 className="font-semibold text-foreground">CO₂ Reduced</h4>
            </div>
            <div className="text-2xl font-bold text-success mb-2">
              {(metrics.co2Reduced * multiplier).toFixed(1)} kg
            </div>
            <Progress value={75} className="h-2 mb-2" />
            <div className="text-sm text-muted-foreground">
              Equivalent to planting {Math.round(metrics.co2Reduced * multiplier / 2)} trees
            </div>
          </Card>

          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Water Saved</h4>
            </div>
            <div className="text-2xl font-bold text-primary mb-2">
              {Math.round(metrics.waterSaved * multiplier)}L
            </div>
            <Progress value={85} className="h-2 mb-2" />
            <div className="text-sm text-muted-foreground">
              {Math.round((metrics.waterSaved * multiplier) / 200)} households daily use
            </div>
          </Card>

          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-success" />
              <h4 className="font-semibold text-foreground">Efficiency</h4>
            </div>
            <div className="text-2xl font-bold text-success mb-2">
              98.5%
            </div>
            <Progress value={98.5} className="h-2 mb-2" />
            <div className="text-sm text-muted-foreground">
              System uptime this {timeframe}
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default ROIDashboard;
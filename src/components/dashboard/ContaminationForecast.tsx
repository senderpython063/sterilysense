import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Clock, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface ForecastData {
  time: string;
  hour: number;
  doorHandle: number;
  bedRail: number;
  ivStand: number;
  monitor: number;
  doorHandleUpper: number;
  doorHandleLower: number;
  alert?: string;
}

const ContaminationForecast: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'contamination' | 'confidence'>('contamination');
  const [forecastHours, setForecastHours] = useState(6);

  // Generate LSTM-like forecast data
  const generateForecastData = (): ForecastData[] => {
    const data: ForecastData[] = [];
    const now = new Date();
    
    for (let i = 0; i <= forecastHours; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Simulate contamination patterns with daily cycles
      const dayPhase = (time.getHours() + i) % 24;
      const baseLevel = 30 + Math.sin((dayPhase / 24) * 2 * Math.PI) * 15;
      
      // Add some realistic variation and trends
      const doorHandle = Math.max(5, Math.min(95, baseLevel + Math.random() * 20 - 10 + (i * 2)));
      const bedRail = Math.max(5, Math.min(95, baseLevel - 10 + Math.random() * 15 - 7.5 + (i * 1.5)));
      const ivStand = Math.max(5, Math.min(95, baseLevel - 5 + Math.random() * 12 - 6 + (i * 1)));
      const monitor = Math.max(5, Math.min(95, baseLevel + 5 + Math.random() * 10 - 5 + (i * 0.8)));
      
      // Confidence intervals
      const doorHandleUpper = Math.min(100, doorHandle + 8 + Math.random() * 4);
      const doorHandleLower = Math.max(0, doorHandle - 8 - Math.random() * 4);
      
      let alert = '';
      if (doorHandle > 80) alert = '⚠️ Door Handle critical in ' + i + 'h';
      else if (bedRail > 75) alert = '⚡ Bed Rail high risk in ' + i + 'h';
      
      data.push({
        time: timeStr,
        hour: i,
        doorHandle: Math.round(doorHandle),
        bedRail: Math.round(bedRail),
        ivStand: Math.round(ivStand),
        monitor: Math.round(monitor),
        doorHandleUpper: Math.round(doorHandleUpper),
        doorHandleLower: Math.round(doorHandleLower),
        alert
      });
    }
    
    return data;
  };

  const [forecastData, setForecastData] = useState(generateForecastData());

  const updateForecast = () => {
    setForecastData(generateForecastData());
  };

  const getAlertLevel = (value: number) => {
    if (value >= 80) return 'high';
    if (value >= 60) return 'medium';
    return 'low';
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const nextAlert = forecastData.find(d => d.alert);

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Contamination Forecast</h3>
              <p className="text-sm text-muted-foreground">LSTM Time-Series Prediction</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForecastHours(6)}
              className={forecastHours === 6 ? 'bg-primary/20' : ''}
            >
              6h
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForecastHours(12)}
              className={forecastHours === 12 ? 'bg-primary/20' : ''}
            >
              12h
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForecastHours(24)}
              className={forecastHours === 24 ? 'bg-primary/20' : ''}
            >
              24h
            </Button>
            <Button onClick={updateForecast} size="sm" className="bg-gradient-primary">
              <Target className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Alert Banner */}
        {nextAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-warning/20 border border-warning/50"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-warning-foreground">{nextAlert.alert}</div>
                <div className="text-sm text-warning-foreground/80">
                  Recommended: Schedule preventive UV cycle
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-warning text-warning">
                Schedule Cycle
              </Button>
            </div>
          </motion.div>
        )}

        {/* Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="doorHandleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="bedRailGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="ivStandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="monitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                label={{ value: 'Contamination Risk (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Legend />
              
              {/* Confidence Band for Door Handle */}
              <Area
              type={"monotone"}
                dataKey="doorHandleUpper"
                stroke="yellow"        // yellow stroke
                strokeWidth={3}        // stroke width 3
                fill="orange"          // yellow fill
                stackId="1"
                opacity={0.5}
              />
              <Area
              type={"monotone"}
                dataKey="doorHandleLower"
                stroke="white"         // green stroke
                strokeWidth={3}        // stroke width 3
                fill="red"           // green fill
                stackId="1"
                opacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="doorHandle"
                stroke="aqua"
                strokeWidth={3}
                fill="teal"
                name="Door Handle"
                opacity={1}
              />
              <Line
                type="monotone"
                dataKey="bedRail"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                name="Bed Rail"
              />
              <Line
                type="monotone"
                dataKey="ivStand"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="IV Stand"
              />
              <Line
                type="monotone"
                dataKey="monitor"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                name="Monitor"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Door Handle', value: forecastData[forecastData.length - 1]?.doorHandle, key: 'doorHandle' },
            { name: 'Bed Rail', value: forecastData[forecastData.length - 1]?.bedRail, key: 'bedRail' },
            { name: 'IV Stand', value: forecastData[forecastData.length - 1]?.ivStand, key: 'ivStand' },
            { name: 'Monitor', value: forecastData[forecastData.length - 1]?.monitor, key: 'monitor' }
          ].map((item) => (
            <Card key={item.key} className="glass-card border border-border/30 p-4">
              <div className="text-center">
                <div className={`text-xl font-bold ${getAlertColor(getAlertLevel(item.value || 0))}`}>
                  {item.value}%
                </div>
                <div className="text-sm text-muted-foreground mb-2">{item.name}</div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getAlertColor(getAlertLevel(item.value || 0))}`}
                >
                  {getAlertLevel(item.value || 0).toUpperCase()}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ContaminationForecast;
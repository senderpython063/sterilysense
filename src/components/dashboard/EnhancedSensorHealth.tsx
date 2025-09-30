import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Camera, 
  Zap, 
  Thermometer, 
  Gauge, 
  Wifi, 
  Battery,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface SensorStatus {
  id: string;
  name: string;
  type: 'camera' | 'uv' | 'humidity' | 'temperature' | 'motion' | 'air_quality';
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  uptime: number;
  lastMaintenance: string;
  batteryLevel?: number;
  signalStrength: number;
  performance: number;
  location: string;
  historicalData: { time: string; value: number }[];
}

const EnhancedSensorHealth: React.FC = () => {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const [sensors, setSensors] = useState<SensorStatus[]>([
    {
      id: 'cam_001',
      name: 'Main Camera',
      type: 'camera',
      status: 'online',
      uptime: 99.8,
      lastMaintenance: '7 days ago',
      signalStrength: 95,
      performance: 92,
      location: 'Room Center',
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h`,
        value: 90 + Math.random() * 10
      }))
    },
    {
      id: 'uv_001',
      name: 'UV Lamp Array',
      type: 'uv',
      status: 'online',
      uptime: 98.5,
      lastMaintenance: '3 days ago',
      signalStrength: 100,
      performance: 88,
      location: 'Ceiling Mount',
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h`,
        value: 85 + Math.random() * 15
      }))
    },
    {
      id: 'hum_001',
      name: 'Humidity Sensor',
      type: 'humidity',
      status: 'warning',
      uptime: 95.2,
      lastMaintenance: '12 days ago',
      batteryLevel: 78,
      signalStrength: 88,
      performance: 75,
      location: 'Wall Mount',
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h`,
        value: 70 + Math.random() * 20
      }))
    },
    {
      id: 'temp_001',
      name: 'Temperature Monitor',
      type: 'temperature',
      status: 'online',
      uptime: 99.1,
      lastMaintenance: '5 days ago',
      batteryLevel: 92,
      signalStrength: 91,
      performance: 94,
      location: 'Wall Mount',
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h`,
        value: 88 + Math.random() * 12
      }))
    },
    {
      id: 'motion_001',
      name: 'Motion Detector',
      type: 'motion',
      status: 'maintenance',
      uptime: 87.3,
      lastMaintenance: '1 hour ago',
      batteryLevel: 45,
      signalStrength: 72,
      performance: 60,
      location: 'Door Frame',
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h`,
        value: 50 + Math.random() * 30
      }))
    },
    {
      id: 'air_001',
      name: 'Air Quality Monitor',
      type: 'air_quality',
      status: 'online',
      uptime: 96.8,
      lastMaintenance: '8 days ago',
      batteryLevel: 86,
      signalStrength: 89,
      performance: 91,
      location: 'HVAC Vent',
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h`,
        value: 85 + Math.random() * 15
      }))
    }
  ]);

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        performance: Math.max(40, Math.min(100, sensor.performance + (Math.random() - 0.5) * 3)),
        signalStrength: Math.max(50, Math.min(100, sensor.signalStrength + (Math.random() - 0.5) * 2)),
        batteryLevel: sensor.batteryLevel ? Math.max(20, sensor.batteryLevel - Math.random() * 0.1) : undefined,
        historicalData: [
          { time: 'now', value: sensor.performance },
          ...sensor.historicalData.slice(0, 23)
        ]
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'uv': return <Zap className="w-4 h-4" />;
      case 'humidity': return <Gauge className="w-4 h-4" />;
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      case 'motion': return <Activity className="w-4 h-4" />;
      case 'air_quality': return <Wifi className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'warning': return 'warning';
      case 'maintenance': return 'secondary';
      case 'offline': return 'danger';
      default: return 'muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-3 h-3" />;
      case 'warning': return <AlertTriangle className="w-3 h-3" />;
      case 'maintenance': return <Settings className="w-3 h-3" />;
      case 'offline': return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const overallHealth = sensors.reduce((acc, sensor) => acc + sensor.performance, 0) / sensors.length;
  const onlineSensors = sensors.filter(s => s.status === 'online').length;

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Advanced Sensor Health Matrix</h3>
              <p className="text-sm text-muted-foreground">Real-time System Monitoring & Diagnostics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
            >
              {showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}
            </Button>
            <Badge className={`bg-${getStatusColor('online')}/20 text-${getStatusColor('online')}`}>
              {onlineSensors}/{sensors.length} Online
            </Badge>
          </div>
        </div>

        {/* Overall System Health */}
        <div className="mb-6 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Overall System Health</span>
            <span className="text-2xl font-bold text-primary">{overallHealth.toFixed(1)}%</span>
          </div>
          <Progress value={overallHealth} className="h-3 mb-2" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-success">{onlineSensors}</div>
              <div className="text-muted-foreground">Active Sensors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                {sensors.filter(s => s.status === 'warning').length}
              </div>
              <div className="text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">
                {sensors.filter(s => s.status === 'maintenance').length}
              </div>
              <div className="text-muted-foreground">Maintenance</div>
            </div>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {sensors.map((sensor) => (
            <motion.div
              key={sensor.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`glass-card border cursor-pointer transition-all ${
                  selectedSensor === sensor.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/30 hover:border-border/60'
                }`}
                onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-${getStatusColor(sensor.status)}/20`}>
                        {getSensorIcon(sensor.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{sensor.name}</div>
                        <div className="text-xs text-muted-foreground">{sensor.location}</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`bg-${getStatusColor(sensor.status)}/20 text-${getStatusColor(sensor.status)}`}
                    >
                      {getStatusIcon(sensor.status)}
                      {sensor.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {/* Performance */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Performance</span>
                        <span>{sensor.performance.toFixed(1)}%</span>
                      </div>
                      <Progress value={sensor.performance} className="h-2" />
                    </div>

                    {/* Signal Strength */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Signal</span>
                        <span>{sensor.signalStrength}%</span>
                      </div>
                      <Progress value={sensor.signalStrength} className="h-2" />
                    </div>

                    {/* Battery (if applicable) */}
                    {sensor.batteryLevel && (
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span>Battery</span>
                          <span className="flex items-center gap-1">
                            <Battery className="w-3 h-3" />
                            {sensor.batteryLevel.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={sensor.batteryLevel} className="h-2" />
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-muted-foreground pt-2">
                      <span>Uptime: {sensor.uptime}%</span>
                      <span>Last Maint: {sensor.lastMaintenance}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Sensor View */}
        <AnimatePresence>
          {selectedSensor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-border/30 rounded-lg p-4"
            >
              {(() => {
                const sensor = sensors.find(s => s.id === selectedSensor)!;
                return (
                  <div>
                    <h4 className="font-semibold mb-4">
                      {sensor.name} - Detailed Diagnostics
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sensor.historicalData}>
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--popover-foreground))'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diagnostics Panel */}
        <AnimatePresence>
          {showDiagnostics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-muted/20 rounded-lg"
            >
              <h4 className="font-semibold mb-3">System Diagnostics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Network Status</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span className="font-mono">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packet Loss:</span>
                      <span className="font-mono">0.02%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bandwidth:</span>
                      <span className="font-mono">98.5 Mbps</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">System Resources</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>CPU Usage:</span>
                      <span className="font-mono">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory:</span>
                      <span className="font-mono">2.1/4.0 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span className="font-mono">15.8/32 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default EnhancedSensorHealth;
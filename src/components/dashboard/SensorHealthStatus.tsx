import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  Camera, 
  Zap, 
  Thermometer, 
  Droplets, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sensor {
  id: string;
  name: string;
  type: 'uv' | 'camera' | 'motion' | 'humidity' | 'temperature';
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  health: number;
  lastCalibrated: string;
  lastMaintenance: string;
  nextMaintenance: string;
  uptime: number;
  location: string;
  readings?: {
    current: number;
    unit: string;
    range: [number, number];
  };
}

const SensorHealthStatus: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([
    {
      id: 'uv-01',
      name: 'UV Intensity Sensor #1',
      type: 'uv',
      status: 'online',
      health: 94,
      lastCalibrated: '7 days ago',
      lastMaintenance: '2 months ago',
      nextMaintenance: 'In 1 month',
      uptime: 99.2,
      location: 'Door Handle Zone',
      readings: { current: 85.4, unit: 'mW/cm²', range: [70, 100] }
    },
    {
      id: 'cam-01',
      name: 'AI Camera Feed #1',
      type: 'camera',
      status: 'online',
      health: 98,
      lastCalibrated: '3 days ago',
      lastMaintenance: '1 month ago',
      nextMaintenance: 'In 2 months',
      uptime: 99.8,
      location: 'Main Room',
      readings: { current: 1920, unit: 'pixels', range: [1080, 1920] }
    },
    {
      id: 'motion-01',
      name: 'Motion Detector #1',
      type: 'motion',
      status: 'online',
      health: 91,
      lastCalibrated: '14 days ago',
      lastMaintenance: '3 weeks ago',
      nextMaintenance: 'In 3 weeks',
      uptime: 98.5,
      location: 'Entry Point',
      readings: { current: 0, unit: 'detections/hr', range: [0, 50] }
    },
    {
      id: 'humidity-01',
      name: 'Humidity Sensor #1',
      type: 'humidity',
      status: 'warning',
      health: 76,
      lastCalibrated: '45 days ago',
      lastMaintenance: '2 months ago',
      nextMaintenance: 'Overdue',
      uptime: 95.3,
      location: 'Bed Rail Area',
      readings: { current: 68.2, unit: '%', range: [40, 70] }
    },
    {
      id: 'temp-01',
      name: 'Temperature Sensor #1',
      type: 'temperature',
      status: 'maintenance',
      health: 45,
      lastCalibrated: '90 days ago',
      lastMaintenance: '4 months ago',
      nextMaintenance: 'Scheduled Tomorrow',
      uptime: 87.1,
      location: 'IV Stand Area',
      readings: { current: 22.8, unit: '°C', range: [18, 25] }
    },
    {
      id: 'uv-02',
      name: 'UV Lamp Health Monitor',
      type: 'uv',
      status: 'online',
      health: 88,
      lastCalibrated: '10 days ago',
      lastMaintenance: '1 month ago',
      nextMaintenance: 'In 6 weeks',
      uptime: 97.8,
      location: 'Central Unit',
      readings: { current: 78.9, unit: 'mW/cm²', range: [70, 100] }
    }
  ]);

  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    criticalAlerts: 1,
    warnings: 2,
    avgHealth: 82
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        health: Math.max(0, Math.min(100, sensor.health + (Math.random() - 0.5) * 2)),
        uptime: Math.max(80, Math.min(100, sensor.uptime + (Math.random() - 0.3) * 0.5)),
        readings: sensor.readings ? {
          ...sensor.readings,
          current: Math.max(sensor.readings.range[0], 
                   Math.min(sensor.readings.range[1], 
                   sensor.readings.current + (Math.random() - 0.5) * 5))
        } : undefined
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'uv': return <Zap className="w-5 h-5" />;
      case 'camera': return <Camera className="w-5 h-5" />;
      case 'motion': return <Activity className="w-5 h-5" />;
      case 'humidity': return <Droplets className="w-5 h-5" />;
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      default: return <Wifi className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-success';
      case 'warning': return 'text-warning';
      case 'offline': return 'text-danger';
      case 'maintenance': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge className="bg-success text-success-foreground">Online</Badge>;
      case 'warning': return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'offline': return <Badge className="bg-danger text-danger-foreground">Offline</Badge>;
      case 'maintenance': return <Badge className="bg-accent text-accent-foreground">Maintenance</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-danger';
  };

  const calibrateSensor = (sensorId: string) => {
    setSensors(prev => prev.map(sensor => 
      sensor.id === sensorId 
        ? { ...sensor, lastCalibrated: 'Just now', health: Math.min(100, sensor.health + 10) }
        : sensor
    ));
  };

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sensor Health & Status</h3>
              <p className="text-sm text-muted-foreground">System Reliability Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {systemStatus.avgHealth}% Healthy
            </Badge>
            <Button size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Overall Status</span>
            </div>
            <div className="text-xl font-bold text-success">Operational</div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <span className="text-sm text-muted-foreground">Critical Alerts</span>
            </div>
            <div className="text-xl font-bold text-danger">{systemStatus.criticalAlerts}</div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="text-sm text-muted-foreground">Warnings</span>
            </div>
            <div className="text-xl font-bold text-warning">{systemStatus.warnings}</div>
          </Card>
          
          <Card className="glass-card border border-border/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Avg Uptime</span>
            </div>
            <div className="text-xl font-bold text-primary">
              {Math.round(sensors.reduce((sum, s) => sum + s.uptime, 0) / sensors.length)}%
            </div>
          </Card>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sensors.map((sensor) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
            >
              <Card className={`glass-card border transition-all duration-300 ${
                selectedSensor === sensor.id 
                  ? 'border-primary/50 shadow-glow' 
                  : 'border-border/30 hover:border-primary/30'
              }`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(sensor.status)} bg-current/20`}>
                        {getSensorIcon(sensor.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{sensor.name}</h4>
                        <p className="text-sm text-muted-foreground">{sensor.location}</p>
                      </div>
                    </div>
                    {getStatusBadge(sensor.status)}
                  </div>

                  {/* Health & Uptime */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Health</span>
                        <span className={`text-sm font-medium ${getHealthColor(sensor.health)}`}>
                          {sensor.health.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={sensor.health} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="text-sm font-medium text-primary">
                          {sensor.uptime.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={sensor.uptime} className="h-2" />
                    </div>
                  </div>

                  {/* Current Readings */}
                  {sensor.readings && (
                    <div className="mb-3">
                      <div className="text-sm text-muted-foreground mb-1">Current Reading</div>
                      <div className="text-lg font-bold text-primary">
                        {sensor.readings.current.toFixed(1)} {sensor.readings.unit}
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedSensor === sensor.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border/30 pt-3 mt-3"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-muted-foreground">Last Calibrated</div>
                            <div className="font-medium">{sensor.lastCalibrated}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Last Maintenance</div>
                            <div className="font-medium">{sensor.lastMaintenance}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Next Maintenance</div>
                            <div className={`font-medium ${
                              sensor.nextMaintenance.includes('Overdue') ? 'text-danger' : 'text-foreground'
                            }`}>
                              {sensor.nextMaintenance}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Sensor ID</div>
                            <div className="font-mono text-xs">{sensor.id}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              calibrateSensor(sensor.id);
                            }}
                          >
                            <Settings className="w-3 h-3 mr-2" />
                            Calibrate
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="w-3 h-3 mr-2" />
                            Schedule Maintenance
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SensorHealthStatus;
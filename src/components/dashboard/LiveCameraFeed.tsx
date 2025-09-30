import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
  level: 'high' | 'medium' | 'low';
}

const LiveCameraFeed: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [frame, setFrame] = useState(0);

  // Enhanced real-time detection simulation with more realistic behavior
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate YOLO model confidence fluctuations and realistic movement
      const newDetections: Detection[] = [
        {
          x: 120 + Math.sin(frame * 0.1) * 15 + Math.random() * 10,
          y: 80 + Math.cos(frame * 0.08) * 10 + Math.random() * 8,
          width: 80 + Math.random() * 20,
          height: 60 + Math.random() * 15,
          confidence: 0.85 + Math.sin(frame * 0.2) * 0.1 + Math.random() * 0.05,
          label: 'Door Handle',
          level: Math.random() > 0.6 ? 'high' : 'medium'
        },
        {
          x: 300 + Math.sin(frame * 0.15) * 20 + Math.random() * 8,
          y: 150 + Math.cos(frame * 0.12) * 12 + Math.random() * 6,
          width: 90 + Math.random() * 15,
          height: 45 + Math.random() * 10,
          confidence: 0.78 + Math.cos(frame * 0.18) * 0.12 + Math.random() * 0.08,
          label: 'Bed Rail',
          level: Math.random() > 0.4 ? 'medium' : 'low'
        },
        {
          x: 450 + Math.sin(frame * 0.08) * 25 + Math.random() * 12,
          y: 200 + Math.cos(frame * 0.1) * 18 + Math.random() * 10,
          width: 70 + Math.random() * 12,
          height: 55 + Math.random() * 8,
          confidence: 0.92 + Math.sin(frame * 0.25) * 0.06 + Math.random() * 0.03,
          label: 'IV Stand',
          level: Math.random() > 0.8 ? 'medium' : 'low'
        },
        // Additional dynamic detections
        ...(Math.random() > 0.7 ? [{
          x: 200 + Math.random() * 100,
          y: 120 + Math.random() * 80,
          width: 60 + Math.random() * 20,
          height: 40 + Math.random() * 15,
          confidence: 0.65 + Math.random() * 0.25,
          label: 'Hand Contact',
          level: (Math.random() > 0.5 ? 'high' : 'medium') as 'high' | 'medium' | 'low'
        }] : [])
      ];
      
      setDetections(newDetections);
      setFrame(prev => prev + 1);
    }, 1500); // Faster updates for more realism

    return () => clearInterval(interval);
  }, [isLive, frame]);

  const getDetectionColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-danger bg-danger/20 text-danger-foreground';
      case 'medium': return 'border-warning bg-warning/20 text-warning-foreground';
      case 'low': return 'border-success bg-success/20 text-success-foreground';
      default: return 'border-muted bg-muted/20 text-muted-foreground';
    }
  };

  const getDetectionIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card border border-border/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live AI Camera Feed</h3>
              <p className="text-sm text-muted-foreground">YOLO Contamination Detection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-success rounded-full"
              />
            )}
            <Badge variant={isLive ? "default" : "secondary"} className="font-mono">
              {isLive ? 'LIVE' : 'PAUSED'}
            </Badge>
          </div>
        </div>

        {/* Enhanced Camera Feed Container with realistic elements */}
        <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {/* Realistic camera background with medical equipment */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-muted/20">
            <div className="absolute inset-0 opacity-30">
              <svg width="100%" height="100%" viewBox="0 0 640 360">
                {/* Room walls and floor */}
                <rect x="20" y="20" width="600" height="320" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                <rect x="30" y="300" width="580" height="40" fill="currentColor" opacity="0.1" />
                
                {/* Medical equipment outlines */}
                <rect x="100" y="70" width="120" height="80" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                <text x="160" y="115" textAnchor="middle" className="text-xs fill-current opacity-60">Hospital Bed</text>
                
                <rect x="280" y="110" width="100" height="90" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                <text x="330" y="160" textAnchor="middle" className="text-xs fill-current opacity-60">Monitor</text>
                
                <rect x="450" y="150" width="80" height="120" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                <text x="490" y="215" textAnchor="middle" className="text-xs fill-current opacity-60">IV Stand</text>
                
                {/* Door and windows */}
                <rect x="20" y="120" width="15" height="80" fill="currentColor" opacity="0.2" />
                <text x="15" y="165" textAnchor="middle" className="text-xs fill-current opacity-60">Door</text>
                
                {/* Floor grid for depth */}
                <defs>
                  <pattern id="floor-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect x="30" y="300" width="580" height="40" fill="url(#floor-pattern)" />
                
                {/* Camera info overlay */}
                <text x="320" y="350" textAnchor="middle" className="text-sm fill-current opacity-60 font-mono">
                  YOLO v8 | Real-time Object Detection | 1920x1080@30fps
                </text>
              </svg>
            </div>
            
            {/* Subtle scan lines effect for realism */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-primary"
                  style={{ top: `${i * 5}%` }}
                />
              ))}
            </div>
          </div>

          {/* YOLO Detection Overlays */}
          <AnimatePresence>
            {detections.map((detection, index) => (
              <motion.div
                key={`${frame}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute border-2 rounded ${getDetectionColor(detection.level)}`}
                style={{
                  left: detection.x,
                  top: detection.y,
                  width: detection.width,
                  height: detection.height
                }}
              >
                <div className="absolute -top-8 left-0 flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    className={`${getDetectionColor(detection.level)} text-xs font-mono px-2 py-1`}
                  >
                    {getDetectionIcon(detection.level)}
                    {detection.label}
                  </Badge>
                </div>
                <div className="absolute -bottom-6 right-0">
                  <Badge variant="outline" className="text-xs font-mono bg-background/80">
                    {(detection.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Frame counter */}
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="font-mono bg-background/80">
              Frame {frame.toString().padStart(6, '0')}
            </Badge>
          </div>

          {/* FPS indicator */}
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="font-mono bg-background/80">
              30 FPS
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant={isLive ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="font-medium"
          >
            {isLive ? 'Pause Feed' : 'Start Feed'}
          </Button>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-danger rounded border border-danger"></div>
              <span className="text-muted-foreground">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded border border-warning"></div>
              <span className="text-muted-foreground">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded border border-success"></div>
              <span className="text-muted-foreground">Clean</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveCameraFeed;
// Data service for contamination monitoring dashboard
export interface SensorReading {
  id: string;
  temperature: number;
  humidity: number;
  particleCount: number;
}

export interface Zone {
  id: number;
  name: string;
  contamination: number;
  status: 'safe' | 'moderate' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  sensors: SensorReading[];
  lastUpdated: string;
}

export interface Alert {
  id: number;
  zone: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  acknowledged: boolean;
}

export interface AIInsight {
  id: number;
  title: string;
  insight: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}

export interface Analytics {
  overallHealth: number;
  criticalZones: number;
  activeFeaturesCount: number;
  totalFeatures: number;
  energyEfficiency: number;
  detectionAccuracy: number;
  complianceScore: number;
  trends: {
    healthImprovement: number;
    energySavings: number;
    costReduction: number;
  };
}

export interface DashboardData {
  zones: Zone[];
  alerts: Alert[];
  aiInsights: AIInsight[];
  analytics: Analytics;
}

export interface Anomaly {
  id: number;
  zone: string;
  severity: 'low' | 'medium' | 'high';
  score: number;
  timestamp: string;
  type: string;
  description: string;
  sensorId: string;
  value: number;
  threshold: number;
  status: 'active' | 'monitoring' | 'resolved';
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    label: string;
    min?: number;
    max?: number;
    default?: number | string;
    type?: 'select' | 'multiselect' | 'number';
    options?: string[];
  }>;
}

export interface SimulationResult {
  contaminationReduction: number;
  energyConsumption: number;
  costImpact: number;
  timeToEffect: number;
  recommendation: string;
  riskFactors: string[];
}

class DataService {
  private baseUrl = '/data';
  private cache = new Map<string, any>();
  private subscribers = new Map<string, Set<(data: any) => void>>();

  async fetchSensorData(): Promise<DashboardData> {
    const cacheKey = 'sensor-data';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}/sensor-data.json`);
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      return this.getMockSensorData();
    }
  }

  async fetchAnomalyData(): Promise<{ anomalies: Anomaly[]; detection_stats: any; radar_zones: any[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/anomaly-data.json`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch anomaly data:', error);
      return { anomalies: [], detection_stats: {}, radar_zones: [] };
    }
  }

  async fetchSimulationScenarios(): Promise<{ scenarios: SimulationScenario[]; results: Record<string, SimulationResult> }> {
    try {
      const response = await fetch(`${this.baseUrl}/simulation-scenarios.json`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch simulation scenarios:', error);
      return { scenarios: [], results: {} };
    }
  }

  subscribe(dataType: string, callback: (data: any) => void) {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set());
    }
    this.subscribers.get(dataType)!.add(callback);
  }

  unsubscribe(dataType: string, callback: (data: any) => void) {
    this.subscribers.get(dataType)?.delete(callback);
  }

  private notifySubscribers(dataType: string, data: any) {
    this.subscribers.get(dataType)?.forEach(callback => callback(data));
  }

  // Real-time data simulation
  startRealTimeUpdates() {
    setInterval(async () => {
      const data = await this.fetchSensorData();
      // Simulate small random changes
      data.zones.forEach(zone => {
        const change = (Math.random() - 0.5) * 5; // ±2.5% change
        zone.contamination = Math.max(0, Math.min(100, zone.contamination + change));
        
        // Update status based on contamination levels
        if (zone.contamination > 80) zone.status = 'critical';
        else if (zone.contamination > 60) zone.status = 'warning';
        else if (zone.contamination > 30) zone.status = 'moderate';
        else zone.status = 'safe';
        
        // Update trend
        zone.trend = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';
        
        // Update sensor readings
        zone.sensors.forEach(sensor => {
          sensor.temperature += (Math.random() - 0.5) * 0.5;
          sensor.humidity += (Math.random() - 0.5) * 3;
          sensor.particleCount += Math.floor((Math.random() - 0.5) * 100);
        });
      });
      
      this.cache.set('sensor-data', data);
      this.notifySubscribers('sensor-data', data);
    }, 5000); // Update every 5 seconds
  }

  async exportReport(format: 'pdf' | 'excel' | 'json' = 'json'): Promise<void> {
    const data = await this.fetchSensorData();
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: data.analytics,
      zones: data.zones,
      alerts: data.alerts,
      insights: data.aiInsights
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `contamination-report-${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  async acknowledgeAlert(alertId: number): Promise<void> {
    const data = await this.fetchSensorData();
    const alert = data.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.cache.set('sensor-data', data);
      this.notifySubscribers('sensor-data', data);
    }
  }

  async runSimulation(scenarioId: string, parameters: Record<string, any>): Promise<SimulationResult> {
    const { results } = await this.fetchSimulationScenarios();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Apply parameter modifications to base results
    const baseResult = results[scenarioId];
    if (!baseResult) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    // Modify results based on parameters (basic simulation)
    const modifiedResult = { ...baseResult };
    
    // Example parameter influence
    if (parameters.uvIntensity && scenarioId === 'uv-increase') {
      const factor = parameters.uvIntensity / 15; // Base is 15%
      modifiedResult.contaminationReduction = Math.round(baseResult.contaminationReduction * factor);
      modifiedResult.energyConsumption = Math.round(baseResult.energyConsumption * factor);
    }

    return modifiedResult;
  }

  private getMockSensorData(): DashboardData {
    return {
      zones: [
        { id: 1, name: 'Production Floor', contamination: 75, status: 'warning', trend: 'up', sensors: [], lastUpdated: new Date().toISOString() },
        { id: 2, name: 'Clean Room A', contamination: 12, status: 'safe', trend: 'down', sensors: [], lastUpdated: new Date().toISOString() },
        { id: 3, name: 'Storage Area', contamination: 35, status: 'moderate', trend: 'stable', sensors: [], lastUpdated: new Date().toISOString() },
        { id: 4, name: 'Laboratory', contamination: 8, status: 'safe', trend: 'down', sensors: [], lastUpdated: new Date().toISOString() },
        { id: 5, name: 'Packaging Zone', contamination: 92, status: 'critical', trend: 'up', sensors: [], lastUpdated: new Date().toISOString() },
      ],
      alerts: [
        { id: 1, zone: 'Packaging Zone', type: 'critical', message: 'HVAC failure detected', timestamp: new Date().toISOString(), severity: 'high', acknowledged: false },
        { id: 2, zone: 'Production Floor', type: 'warning', message: 'Humidity spike detected', timestamp: new Date().toISOString(), severity: 'medium', acknowledged: false }
      ],
      aiInsights: [
        { id: 1, title: 'Root Cause', insight: 'HVAC system failure detected', confidence: 94.5, timestamp: new Date().toISOString(), actionable: true }
      ],
      analytics: {
        overallHealth: 87,
        criticalZones: 2,
        activeFeaturesCount: 8,
        totalFeatures: 10,
        energyEfficiency: 94,
        detectionAccuracy: 96.5,
        complianceScore: 98.7,
        trends: { healthImprovement: 2, energySavings: 12, costReduction: 8 }
      }
    };
  }
}

export const dataService = new DataService();

export interface BacteriumData {
  name: string;
  count: number;
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  cfu: number;
}

export interface TileData {
  x: number;
  y: number;
  spotName: string;
  sampleDate: string;
  totalCFU: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  bacteria: BacteriumData[];
  notes: string;
  timeSeriesData: TimeSeriesPoint[];
  temperature: number;
  humidity: number;
  lastCleaned: string;
}

export const CONFIG = {
  ROOM_W: 20,
  ROOM_H: 15,
  TILE_SIZE: 1,
  MAX_CFU: 500,
  ANIMATION_DURATION: 800,
  VIEW_MODES: {
    TOP: 'top',
    ISO: 'iso', 
    WALK: 'walk'
  }
} as const;

export const COLORS = {
  LOW: 0x2563eb,      // Blue
  MEDIUM_LOW: 0x06b6d4, // Cyan  
  MEDIUM: 0x10b981,    // Green
  MEDIUM_HIGH: 0xf59e0b, // Amber
  HIGH: 0xef4444,      // Red
  CRITICAL: 0xdc2626   // Dark Red
} as const;

export function generateEnhancedDataset(): Record<string, TileData> {
  const data: Record<string, TileData> = {};
  const hotspots = [
    { x: 2, y: 2, cfu: 450, notes: "Main entrance - High foot traffic contamination", severity: "critical" as const },
    { x: 18, y: 13, cfu: 380, notes: "Equipment splash zone - Requires immediate attention", severity: "high" as const },
    { x: 10, y: 7, cfu: 280, notes: "Central pathway - Moderate contamination", severity: "medium" as const },
    { x: 15, y: 3, cfu: 150, notes: "Secondary work area - Low contamination", severity: "low" as const },
    { x: 5, y: 12, cfu: 320, notes: "Near ventilation unit - Elevated levels", severity: "high" as const }
  ];

  // For more realistic flow, use sharper falloff and some random noise
  for (let x = 0; x < CONFIG.ROOM_W; x++) {
    for (let y = 0; y < CONFIG.ROOM_H; y++) {
      const id = `${x}_${y}`;
      let cfu = Math.floor(Math.random() * 10) + 5; // Lower base
      let severity: TileData['severity'] = 'low';
      let notes = "Normal background contamination levels";

      // Calculate influence from hotspots with sharper falloff and a little noise
      let maxInfluence = 0;
      hotspots.forEach(hotspot => {
        const dx = x - hotspot.x;
        const dy = y - hotspot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Sharper falloff, but allow some long-range effect
        const influence = Math.exp(-distance / 2.5) + 0.15 * Math.exp(-distance / 8);
        maxInfluence = Math.max(maxInfluence, influence);
        cfu += Math.round(hotspot.cfu * influence * (0.95 + Math.random() * 0.1));
      });

      // Add a subtle "wave" for future animation (optional, not used yet)
      const wave = Math.sin((x + y) / 3 + Date.now() / 100000) * 8;
      cfu += Math.round(wave);

      cfu = Math.max(0, Math.min(cfu, CONFIG.MAX_CFU));

      // Determine severity and notes based on CFU
      if (cfu > 350) {
        severity = 'critical';
        notes = "Critical contamination level - Immediate cleaning required";
      } else if (cfu > 200) {
        severity = 'high';
        notes = "High contamination - Schedule deep cleaning";
      } else if (cfu > 100) {
        severity = 'medium';
        notes = "Moderate contamination - Monitor closely";
      }

      // Generate realistic bacteria distribution
      const bacteria: BacteriumData[] = [
        { name: "Staphylococcus aureus", count: Math.floor(cfu * 0.3 + Math.random() * 10), color: "#ef4444" },
        { name: "Escherichia coli", count: Math.floor(cfu * 0.25 + Math.random() * 8), color: "#f59e0b" },
        { name: "Bacillus subtilis", count: Math.floor(cfu * 0.2 + Math.random() * 6), color: "#10b981" },
        { name: "Pseudomonas aeruginosa", count: Math.floor(cfu * 0.15 + Math.random() * 5), color: "#06b6d4" },
        { name: "Enterococcus faecalis", count: Math.floor(cfu * 0.1 + Math.random() * 3), color: "#8b5cf6" }
      ];

      // Generate time series data (last 7 days)
      const timeSeriesData: TimeSeriesPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const variation = Math.random() * 0.4 + 0.8; // ±20% variation
        timeSeriesData.push({
          date: date.toISOString().split('T')[0],
          cfu: Math.round(cfu * variation)
        });
      }

      data[id] = {
        x, y,
        spotName: `Tile ${x + 1}-${y + 1}`,
        sampleDate: new Date().toISOString().split('T')[0],
        totalCFU: cfu,
        severity,
        bacteria,
        notes,
        timeSeriesData,
        temperature: Math.round(Math.random() * 10 + 20), // 20-30°C
        humidity: Math.round(Math.random() * 20 + 40), // 40-60%
        lastCleaned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    }
  }
  return data;
}

export function getEnhancedColorForCFU(cfu: number): number {
  // Use a more perceptually uniform color scale: blue → cyan → green → yellow → orange → red → dark red
  const normalized = Math.min(cfu / CONFIG.MAX_CFU, 1);
  if (normalized < 0.12) {
    return lerpColor(COLORS.LOW, COLORS.MEDIUM_LOW, normalized / 0.12);
  } else if (normalized < 0.28) {
    return lerpColor(COLORS.MEDIUM_LOW, COLORS.MEDIUM, (normalized - 0.12) / 0.16);
  } else if (normalized < 0.48) {
    return lerpColor(COLORS.MEDIUM, COLORS.MEDIUM_HIGH, (normalized - 0.28) / 0.2);
  } else if (normalized < 0.7) {
    return lerpColor(COLORS.MEDIUM_HIGH, COLORS.HIGH, (normalized - 0.48) / 0.22);
  } else {
    return lerpColor(COLORS.HIGH, COLORS.CRITICAL, (normalized - 0.7) / 0.3);
  }
}

function lerpColor(color1: number, color2: number, factor: number): number {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;
  
  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return (r << 16) | (g << 8) | b;
}

export function getRecommendation(severity: TileData['severity']): string {
  switch (severity) {
    case 'critical':
      return 'Immediate deep cleaning and disinfection required. Consider temporary area closure.';
    case 'high':
      return 'Schedule enhanced cleaning within 24 hours. Increase monitoring frequency.';
    case 'medium':
      return 'Standard cleaning protocol. Monitor for trends over next sampling period.';
    default:
      return 'Maintain current cleaning schedule. Continue routine monitoring.';
  }
}

export { voiceService } from './voice-service';

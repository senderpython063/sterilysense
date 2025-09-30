// Synthetic SterilySense Dataset for Dashboard Visualizations

export interface SensorReading {
  id: string;
  timestamp: string;
  camera_id: string;
  image_filename: string;
  yolo_detection_confidence: number;
  detection_bbox_area_cm2: number;
  hygiene_score_before: number;
  hygiene_score_after: number;
  cycle_id: string;
  bacterial_count_cfu: number;
  forecast_contamination_level: number;
  chemicals_energy_savings_usd: number;
  cleaning_duration_sec: number;
  ai_insight: string;
  humidity_percent: number;
  uv_intensity_mw_cm2: number;
  sensor_status: 'online' | 'offline' | 'calibrating';
  uv_lamp_status: 'active' | 'inactive' | 'maintenance';
  sensor_id: string;
  contamination_flow_source: string;
  contamination_flow_destination: string;
  contamination_flow_intensity: number;
  tile_x: number;
  tile_y: number;
  surface_name: string;
  last_cleaned_timestamp: string;
}

export interface ContaminationForecast {
  timestamp: string;
  predicted_contamination: number;
  confidence_lower: number;
  confidence_upper: number;
  location: string;
}

// Generate realistic time-series data
const generateTimestamp = (hoursAgo: number): string => {
  const now = new Date();
  now.setHours(now.getHours() - hoursAgo);
  return now.toISOString();
};

// Generate synthetic sensor readings
export const generateSensorData = (count: number = 1000): SensorReading[] => {
  const locations = ['Door Handle', 'Bed Rail', 'IV Stand', 'Monitor Screen', 'Light Switch', 'Cabinet Handle', 'Sink Faucet', 'Window Sill'];
  const surfaces = ['High-Touch Surface', 'Medium-Touch Surface', 'Low-Touch Surface'];
  const insights = [
    'High contamination detected. UV cycle recommended.',
    'Bacterial load reduced by 85% after UV treatment.',
    'Humidity levels elevated. Extended UV cycle suggested.',
    'Optimal UV intensity achieved. Contamination eliminated.',
    'Motion detected. UV cycle paused for safety.',
    'TiO₂ coating effectiveness confirmed. No reapplication needed.',
    'Sensor calibration within normal range.',
    'Predicted contamination spike in 2 hours. Preventive cycle initiated.'
  ];

  return Array.from({ length: count }, (_, i) => {
    const hoursAgo = Math.random() * 168; // Past week
    const location = locations[Math.floor(Math.random() * locations.length)];
    const uvIntensity = 65 + Math.random() * 35; // 65-100%
    const humidity = 35 + Math.random() * 40; // 35-75%
    const bacterialBefore = 200 + Math.random() * 2800; // 200-3000 CFU
    const reductionFactor = 0.7 + (uvIntensity / 100) * 0.25; // Better UV = more reduction
    const bacterialAfter = bacterialBefore * (1 - reductionFactor);
    
    return {
      id: `sensor_${i + 1}`,
      timestamp: generateTimestamp(hoursAgo),
      camera_id: `cam_${Math.floor(Math.random() * 8) + 1}`,
      image_filename: `frame_${Date.now()}_${i}.jpg`,
      yolo_detection_confidence: 0.7 + Math.random() * 0.3,
      detection_bbox_area_cm2: 2 + Math.random() * 8,
      hygiene_score_before: Math.max(0, 100 - (bacterialBefore / 30)),
      hygiene_score_after: Math.max(0, 100 - (bacterialAfter / 30)),
      cycle_id: `cycle_${Math.floor(i / 10) + 1}`,
      bacterial_count_cfu: bacterialAfter,
      forecast_contamination_level: Math.random() * 100,
      chemicals_energy_savings_usd: Math.random() * 50,
      cleaning_duration_sec: 180 + Math.random() * 240,
      ai_insight: insights[Math.floor(Math.random() * insights.length)],
      humidity_percent: humidity,
      uv_intensity_mw_cm2: uvIntensity,
      sensor_status: Math.random() > 0.05 ? 'online' : 'offline',
      uv_lamp_status: Math.random() > 0.1 ? 'active' : 'inactive',
      sensor_id: `uv_sensor_${Math.floor(Math.random() * 12) + 1}`,
      contamination_flow_source: location,
      contamination_flow_destination: locations[Math.floor(Math.random() * locations.length)],
      contamination_flow_intensity: Math.random() * 100,
      tile_x: Math.floor(Math.random() * 12),
      tile_y: Math.floor(Math.random() * 12),
      surface_name: surfaces[Math.floor(Math.random() * surfaces.length)],
      last_cleaned_timestamp: generateTimestamp(Math.random() * 24)
    };
  });
};

// Generate contamination forecast data
export const generateForecastData = (): ContaminationForecast[] => {
  const locations = ['Door Handle', 'Bed Rail', 'IV Stand', 'Monitor Screen'];
  const data: ContaminationForecast[] = [];
  
  for (let i = 0; i < 24; i++) { // Next 24 hours
    locations.forEach(location => {
      const baseContamination = 30 + Math.sin(i * 0.2) * 20 + Math.random() * 15;
      data.push({
        timestamp: generateTimestamp(-i),
        predicted_contamination: Math.max(0, Math.min(100, baseContamination)),
        confidence_lower: Math.max(0, baseContamination - 10),
        confidence_upper: Math.min(100, baseContamination + 10),
        location
      });
    });
  }
  
  return data;
};

// Real-time mock data
export const mockLiveCameraFeed = {
  streamUrl: '/api/camera/live',
  detections: [
    { x: 150, y: 200, width: 80, height: 60, confidence: 0.89, label: 'High Contamination' },
    { x: 300, y: 150, width: 60, height: 45, confidence: 0.72, label: 'Medium Contamination' },
    { x: 450, y: 300, width: 70, height: 55, confidence: 0.95, label: 'Clean Zone' }
  ]
};

// ROI calculations
export const calculateROI = (data: SensorReading[]) => {
  const totalCycles = new Set(data.map(d => d.cycle_id)).size;
  const totalSavings = data.reduce((sum, d) => sum + d.chemicals_energy_savings_usd, 0);
  const totalCleaningTime = data.reduce((sum, d) => sum + d.cleaning_duration_sec, 0) / 3600; // Convert to hours
  const avgUVIntensity = data.reduce((sum, d) => sum + d.uv_intensity_mw_cm2, 0) / data.length;
  
  return {
    chemicalsSaved: (totalCycles * 0.05).toFixed(1), // 50ml per cycle avoided
    energyUsed: ((avgUVIntensity * totalCleaningTime) / 1000).toFixed(1), // kWh
    laborSaved: ((totalCycles * 5) / 60).toFixed(1), // 5 mins per manual clean
    costSavings: totalSavings.toFixed(0),
    totalCycles
  };
};

// Export the generated data
export const sensorData = generateSensorData(1000);
export const forecastData = generateForecastData();
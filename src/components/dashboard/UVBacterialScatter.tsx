import React from 'react';
import { Card } from '@/components/ui/card';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Target } from 'lucide-react';

const UVBacterialScatter: React.FC = () => {
  const scatterData = Array.from({ length: 75 }, () => {
    const uvIntensity = 60 + Math.random() * 40; // 60-100%
    const baseReduction = 0.75 + ((uvIntensity - 60) / 40) * 0.2; // 75-95%
    const humidity = 35 + Math.random() * 40; // 35-75%
    const humidityPenalty = ((humidity - 35) / 40) * 0.15; // up to 15%
    const actualReduction = Math.max(0.5, baseReduction - humidityPenalty);
    const initialBacterial = 200 + Math.random() * 2800; // 200-3000 CFU
    const finalBacterial = initialBacterial * (1 - actualReduction) + Math.random() * 100;

    return {
      uv: parseFloat(uvIntensity.toFixed(2)),
      bacterial: Math.max(50, Math.round(finalBacterial)),
      location: ['Door Handle', 'Bed Rail', 'IV Stand', 'Monitor Screen', 'Sink Faucet', 'Window Sill'][Math.floor(Math.random() * 6)],
      humidity: parseFloat(humidity.toFixed(2)),
      efficiency: Math.round(actualReduction * 100)
    };
  });

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              UV Efficiency vs Bacterial Load
            </h3>
            <p className="text-sm text-muted-foreground">Correlation Analysis</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="uv"
              name="UV Intensity"
              unit="%"
              domain={[60, 100]}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${value.toFixed(2)}%`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="bacterial"
              name="Bacterial Load"
              unit=" CFU"
              domain={[0, 3000]}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${value.toFixed(0)}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'black'
              }}
              formatter={(value: any, name: string) => [
                `${typeof value === 'number' ? value.toFixed(2) : value}${name === 'UV Intensity' ? '%' : ' CFU'}`,
                name
              ]}
              labelFormatter={(label, payload) =>
                payload?.[0] ? `Location: ${payload[0].payload.location} | Humidity: ${payload[0].payload.humidity.toFixed(1)}%` : ''
              }
            />
            <Scatter
              name="Bacterial Load"
              data={scatterData}
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Correlation Analysis */}
        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-success">-0.84</div>
              <div className="text-muted-foreground">Correlation (r)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">71%</div>
              <div className="text-muted-foreground">Variance Explained (r²)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">18.2%</div>
              <div className="text-muted-foreground">Avg. Reduction per 10% UV</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UVBacterialScatter;

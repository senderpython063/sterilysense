import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Upload, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DateFilterPanelProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onDataUpload: (file: File) => void;
}

const DateFilterPanel: React.FC<DateFilterPanelProps> = ({ onDateRangeChange, onDataUpload }) => {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filterActive, setFilterActive] = useState(false);

  const handleDateFilter = () => {
    onDateRangeChange(new Date(startDate), new Date(endDate));
    setFilterActive(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      onDataUpload(file);
    }
  };

  const presetRanges = [
    { label: 'Last 24h', days: 1 },
    { label: 'Last 7d', days: 7 },
    { label: 'Last 30d', days: 30 },
    { label: 'Last 90d', days: 90 }
  ];

  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    onDateRangeChange(start, end);
    setFilterActive(true);
  };

  return (
    <Card className="glass-card border border-border/50 mb-6">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Range Picker */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1 rounded border border-border bg-background text-foreground text-sm"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1 rounded border border-border bg-background text-foreground text-sm"
              />
              <Button onClick={handleDateFilter} size="sm" className="ml-2">
                <Filter className="w-3 h-3 mr-1" />
                Apply Filter
              </Button>
            </div>
          </div>

          {/* Preset Range Buttons */}
          <div className="flex items-center gap-2">
            {presetRanges.map((range) => (
              <Button
                key={range.days}
                variant="outline"
                size="sm"
                onClick={() => handlePresetRange(range.days)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Data Upload */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="data-upload"
              />
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Upload className="w-3 h-3 mr-1" />
                Upload Data
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => {
            // Example: pull some fake rows (replace with your real data later)
            const rows = [
              ["Date", "Score", "Status"],
              ["2025-09-23", "120", "Safe"],
              ["2025-09-22", "98", "Medium"],
              ["2025-09-21", "143", "High"],
            ];

            // Convert rows → CSV
            const csv = rows.map(r => r.join(",")).join("\n");
            
            // Create blob
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);

            // Trigger download
            const a = document.createElement("a");
            a.href = url;
            a.download = "dashboard_export.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}>
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          </div>

          {/* Status Badge */}
          {filterActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Badge className="bg-success/20 text-success">
                Filter Active
              </Badge>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DateFilterPanel;
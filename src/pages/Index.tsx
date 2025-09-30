import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Activity, Shield, Phone, MessageCircle } from 'lucide-react';
import DateFilterPanel from '@/components/dashboard/DateFilterPanel';
import Enhanced3DRoomView from '@/components/dashboard/Enhanced3DRoomView';
import LiveCameraFeed from '@/components/dashboard/LiveCameraFeed';
import EnhancedHygieneScores from '@/components/dashboard/EnhancedHygieneScores';
import ContaminationForecast from '@/components/dashboard/ContaminationForecast';
import ROIDashboard from '@/components/dashboard/ROIDashboard';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import EnhancedSensorHealth from '@/components/dashboard/EnhancedSensorHealth';
import UVBacterialScatter from '@/components/dashboard/UVBacterialScatter';
import ContaminationFlow from '@/components/dashboard/ContaminationFlow';
import AnalysisSwitcher from '@/components/dashboard/AnalysisSwitcher';
import { VoiceAssistantButton } from '../components/VoiceAssistantButton';

const Index = () => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
    console.log('Date range changed:', { startDate, endDate });
  };

  const handleDataUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-between">
      {/* Main Dashboard */}
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">SterilySense</h1>
                <p className="text-muted-foreground">AI-Powered UV Disinfection Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-success text-success-foreground animate-pulse-glow">
                <Activity className="w-3 h-3 mr-1" />
                System Online
              </Badge>
              <Badge variant="outline" className="font-mono">
                IIT Pals Team
              </Badge>
            </div>
          </div>
        </div>

        {/* Voice Assistant Button */}
        <div className="flex justify-end mb-6">
          <VoiceAssistantButton />
        </div>

        {/* Date Filter & Upload Panel */}
        <DateFilterPanel 
          onDateRangeChange={handleDateRangeChange}
          onDataUpload={handleDataUpload}
        />

        {/* Dashboard Grid */}
        <div className="space-y-8">
          {/* Row 1: 3D Room View (Full Width) */}
          <Enhanced3DRoomView />

          {/* Row 2: Live Feed & Enhanced Hygiene Scores */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LiveCameraFeed />
            <EnhancedHygieneScores />
          </div>

          {/* Row 3: Forecast & ROI */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ContaminationForecast />
            <AnalysisSwitcher/>
          </div>

          {/* Row 4: AI Insights (Full Width) */}
          <AIInsightPanel />

          {/* Row 5: Enhanced Sensor Health & Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <EnhancedSensorHealth />
            <div className="space-y-6">
              <UVBacterialScatter />
              <ContaminationFlow />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-10 p-6 bg-card rounded-xl shadow-lg relative">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Customer Support Info */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Customer Support</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <span className="font-bold text-foreground ">Service Provider 1 :</span> 
                <span className="ml-2">lokey V - hardware Mechanic</span> 
                <span className="ml-2">📞 +91 98765 43210</span>
              </li>
              <li>
                <span className="font-bold text-foreground">Service Provider 2 :</span> 
                <span className="ml-2">Jaya prakash - Software Mechanic</span> 
                <span className="ml-2">📞 +91 91234 56789</span>
              </li>
            </ul>
          </div>

          {/* Floating Buttons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a 
              href="https://wa.me/7305714848" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>
            <a 
              href="tel:+917305714848"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              Call Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

// components/dashboard/AnalysisSwitcher.tsx
import React, { useState } from 'react';
import ROIDashboard from './ROIDashboard.tsx';
import BacteriaDashboard from './BacteriaDashboard.tsx'; // create this component for bacteria analysis

const AnalysisSwitcher: React.FC = () => {
  const [analysis, setAnalysis] = useState<'roi' | 'bacteria'>('roi');

  return (
    <div>
      {/* Dropdown */}
      <div className="mb-4">
        <select
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value as 'roi' | 'bacteria')}
           className="border border-blue-500 bg-black-100 text-blue-800 px-3 py-1 rounded text-sm"
        >
          <option value="roi">ROI Dashboard</option>
          <option value="bacteria">Bacteria Classification</option>
        </select>
      </div>

      {/* Conditional rendering */}
      {analysis === 'roi' && <ROIDashboard />}
      {analysis === 'bacteria' && <BacteriaDashboard />}
    </div>
  );
};

export default AnalysisSwitcher;

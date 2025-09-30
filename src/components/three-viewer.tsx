import { useRef, useEffect, useState } from 'react';
import { ThreeScene } from '../lib/three-scene';
import { TileData, CONFIG } from '../lib/bacteria-data';
import { Eye, Box, User } from 'lucide-react';

interface ThreeViewerProps {
  dataset: Record<string, TileData>;
  onTileHover: (data: TileData, event: MouseEvent) => void;
  onTileSelect: (data: TileData) => void;
  onClearHover: () => void;
  onExportImage: () => void;
  onExportData: () => void;
}

export function ThreeViewer({ 
  dataset, 
  onTileHover, 
  onTileSelect, 
  onClearHover,
  onExportImage,
  onExportData
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);
  const [currentView, setCurrentView] = useState<string>(CONFIG.VIEW_MODES.ISO);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    sceneRef.current = new ThreeScene(containerRef.current, dataset);

    // Setup mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
      sceneRef.current?.handleMouseMove(event, onTileHover, onClearHover);
    };

    const handleMouseClick = (event: MouseEvent) => {
      sceneRef.current?.handleMouseClick(event, onTileSelect);
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleMouseClick);

    // Hide loading screen after initialization
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleMouseClick);
      sceneRef.current?.dispose();
    };
  }, [dataset]); // Remove handler dependencies to prevent re-initialization

  useEffect(() => {
    const handleResize = () => {
      sceneRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewChange = (mode: string) => {
    setCurrentView(mode);
    sceneRef.current?.setViewMode(mode);
  };

  const handleReset = () => {
    sceneRef.current?.reset();
    setCurrentView(CONFIG.VIEW_MODES.ISO);
  };

  const handleExportImage = () => {
    sceneRef.current?.exportImage();
    onExportImage();
  };

  return (
    <div className="flex-1 relative glass-card rounded-xl overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-sm font-medium">Initializing 3D Environment...</div>
            <div className="text-xs text-muted-foreground mt-1">Loading bacteria data and rendering models</div>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3 glass-card rounded-full px-4 py-2">
          <i className="fas fa-cube text-primary"></i>
          <span className="text-sm font-medium" data-testid="room-info">Room: 20 ft × 15 ft</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Selector */}
          <div className="glass-card rounded-lg p-1 flex">
            <button 
              onClick={() => handleViewChange(CONFIG.VIEW_MODES.TOP)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                currentView === CONFIG.VIEW_MODES.TOP 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="button-top-view"
            >
              <Eye className="w-3 h-3 inline mr-1" />
              Top
            </button>
            <button 
              onClick={() => handleViewChange(CONFIG.VIEW_MODES.ISO)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                currentView === CONFIG.VIEW_MODES.ISO 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="button-iso-view"
            >
              <Box className="w-3 h-3 inline mr-1" />
              3D
            </button>
            <button 
              onClick={() => handleViewChange(CONFIG.VIEW_MODES.WALK)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                currentView === CONFIG.VIEW_MODES.WALK 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="button-walk-view"
            >
              <User className="w-3 h-3 inline mr-1" />
              Walk
            </button>
          </div>
          
          {/* Export Controls */}
          <div className="glass-card rounded-lg p-1 flex">
            <button 
              onClick={handleExportImage}
              className="px-3 py-1 rounded text-xs transition-all text-muted-foreground hover:text-foreground" 
              title="Export Image"
              data-testid="button-export-image"
            >
              <i className="fas fa-camera"></i>
            </button>
            <button 
              onClick={onExportData}
              className="px-3 py-1 rounded text-xs transition-all text-muted-foreground hover:text-foreground" 
              title="Export Data"
              data-testid="button-export-data"
            >
              <i className="fas fa-download"></i>
            </button>
          </div>
          
          <button 
            onClick={handleReset}
            className="glass-card rounded-lg px-3 py-2 text-xs transition-all hover:bg-white/10"
            data-testid="button-reset"
          >
            <i className="fas fa-refresh"></i> Reset
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-20 glass-card rounded-lg p-4 w-48">
        <div className="text-xs font-medium mb-2 flex items-center gap-2">
          <i className="fas fa-palette text-primary"></i>
          CFU Heatmap
        </div>
        <div className="heatmap-legend h-3 rounded-full mb-2"></div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>Low</span>
          <span>High</span>
          <span>500+</span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span>Critical ({'>'}300 CFU)</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" data-testid="three-viewer-container" />
    </div>
  );
}

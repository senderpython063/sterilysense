"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Camera positions
const cameraPositions: Record<string, [number, number, number]> = {
  top: [0, 60, 0],
  "3d": [40, 40, 40],
  walk: [0, 10, 40],
};

// Bacteria list
const bacteriaList = [
  "Staphylococcus aureus",
  "Escherichia coli",
  "Bacillus subtilis",
  "Pseudomonas aeruginosa",
  "Enterococcus faecalis",
  "Salmonella enterica",
  "Listeria monocytogenes",
  "Clostridium perfringens",
];

// Utility to get random bacteria
const getRandomBacteria = () => {
  const count = Math.floor(Math.random() * 300);
  let danger: "low" | "medium" | "high" = "low";
  if (count > 200) danger = "high";
  else if (count > 100) danger = "medium";
  return {
    name: bacteriaList[Math.floor(Math.random() * bacteriaList.length)],
    count,
    danger,
  };
};

// Walls
const Walls = () => (
  <>
    <mesh position={[0, 10, -30]}><boxGeometry args={[60, 20, 1]} /><meshStandardMaterial color="#d3d3d3" /></mesh>
    <mesh position={[0, 10, 30]}><boxGeometry args={[60, 20, 1]} /><meshStandardMaterial color="#d3d3d3" /></mesh>
    <mesh position={[-30, 10, 0]}><boxGeometry args={[1, 20, 60]} /><meshStandardMaterial color="#d3d3d3" /></mesh>
    {/* <mesh position={[30, 10, 0]}><boxGeometry args={[1, 20, 60]} /><meshStandardMaterial color="#d3d3d3" /></mesh> */}
  </>
);

// Floor tiles with multiple bacteria
const Floor = ({ selectedTile, setSelectedTile }: any) => {
  const tileSize = 6;
  const gridSize = 10;

  const tiles = Array.from({ length: gridSize * gridSize }, (_, i) => {
    // Generate 3-5 bacteria per tile
    const bacteria = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, getRandomBacteria);

    // Tile score based on bacteria danger
    const dangerValues: Record<string, number> = { low: 20, medium: 50, high: 90 };
    const tileScore = Math.round(bacteria.reduce((acc, b) => acc + dangerValues[b.danger], 0) / bacteria.length);

    // Severity color for the tile (average)
    let severity: "low" | "medium" | "high" = "low";
    if (tileScore > 70) severity = "high";
    else if (tileScore > 40) severity = "medium";

    return { id: i, bacteria, tileScore, severity };
  });

  const severityColors: Record<string, string> = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#ef4444",
  };

  return (
    <group position={[-(gridSize * tileSize) / 2 + tileSize / 2, 0, -(gridSize * tileSize) / 2 + tileSize / 2]}>
      {tiles.map((tile, index) => {
        const x = (index % gridSize) * tileSize;
        const z = Math.floor(index / gridSize) * tileSize;

        return (
          <mesh
            key={tile.id}
            position={[x, 0.01, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={() => setSelectedTile(tile)}
          >
            <planeGeometry args={[tileSize, tileSize]} />
            <meshStandardMaterial
              color={severityColors[tile.severity]}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Right panel styles
const BacteriaBadge = ({ danger, name }: { danger: string; name: string }) => {
  const color =
    danger === "high" ? "bg-red-500" :
    danger === "medium" ? "bg-yellow-400" :
    "bg-green-400";
  return (
    <span className={`${color} text-white px-2 py-1 rounded-full text-xs mr-2 mb-1 inline-block`}>
      {name} ({danger})
    </span>
  );
};

export default function ContaminationFlow() {
  const [viewMode, setViewMode] = useState<"top" | "3d" | "walk">("3d");
  const [selectedTile, setSelectedTile] = useState<any>(null);

  return (
    <Card className="p-4 relative bg-[#0d1117] text-white shadow-xl flex gap-4">
      {/* 3D Room */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold text-indigo-400">Contamination Flow</h2>
          <div className="flex gap-2">
            {(["top", "3d", "walk"] as const).map((mode) => (
              <Button key={mode} size="sm" variant={viewMode === mode ? "default" : "outline"} onClick={() => setViewMode(mode)}>
                {mode.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-gray-800">
          <Canvas shadows camera={{ position: cameraPositions[viewMode] || [40, 40, 40], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
            <Floor selectedTile={selectedTile} setSelectedTile={setSelectedTile} />
            <Walls />
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>
      </div>

      {/* Right Panel Analytics */}
<div className="w-[380px] bg-gradient-to-b from-gray-950 to-gray-900 p-6 rounded-xl shadow-2xl flex-shrink-0 overflow-y-auto max-h-[600px] border border-gray-800">
  <h3 className="text-2xl font-extrabold text-indigo-400 mb-6 border-b border-indigo-600 pb-2 tracking-wide">
    🧫 Tile Analytics
  </h3>

  {selectedTile ? (
    <motion.div
      key={selectedTile.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Tile Info */}
      <div>
        <div className="text-lg font-semibold text-gray-300 mb-1">Tile Number</div>
        <div className="text-3xl font-bold text-white tracking-wide">
          #{selectedTile.id + 1}
        </div>
      </div>

      {/* Tile Score */}
      <div>
        <div className="text-lg font-semibold text-gray-300 mb-2">Tile Score</div>
        <div className="text-4xl font-extrabold text-yellow-300 drop-shadow-sm">
          {selectedTile.tileScore}%
        </div>
        <div className="w-full h-5 bg-gray-700 rounded-full mt-3 shadow-inner">
          <div
            className={`h-5 rounded-full transition-all duration-500 ${
              selectedTile.tileScore > 70
                ? "bg-red-500"
                : selectedTile.tileScore > 40
                ? "bg-yellow-400"
                : "bg-green-500"
            }`}
            style={{ width: `${selectedTile.tileScore}%` }}
          />
        </div>
      </div>

      {/* Bacteria List */}
      <div>
        <div className="text-lg font-semibold text-gray-300 mb-3">
          Detected Bacteria
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedTile.bacteria.map((b: any, i: number) => {
            const color =
              b.danger === "high"
                ? "bg-red-500/90 border border-red-400"
                : b.danger === "medium"
                ? "bg-yellow-400/90 border border-yellow-300"
                : "bg-green-500/90 border border-green-400";
            return (
              <span
                key={i}
                className={`${color} text-black font-semibold px-3 py-1.5 rounded-full text-sm shadow-lg`}
              >
                {b.name} <span className="opacity-80">({b.danger})</span>
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  ) : (
    <div className="text-gray-400 text-lg mt-10 text-center leading-relaxed">
      👉 Click on a tile in the 3D room to see detailed bacteria analytics.
    </div>
  )}
</div>
    </Card>
  );
}

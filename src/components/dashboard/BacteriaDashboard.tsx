"use client";
import * as React from "react";
import { Card } from "../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, Leaf, ShieldCheck, Bug } from "lucide-react";
import { motion } from "framer-motion";
import { TooltipProps } from "recharts";

// Custom tooltip for Pie Chart
const PieCustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold text-lg">{payload[0].name}</p>
        <p className="text-yellow-300">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for Bar Chart
const BarCustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold">{label}</p>
        <p className="text-yellow-300">{`Risk Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const MotionCard = motion(Card);

const BacteriaDashboard: React.FC = () => {
  // Data for Pie Chart (main severity groups)
  const pieData = [
    { name: "High Risk: Bacillus anthracis", value: 1000, color: "#ef4444" },
    { name: "Medium Risk: Escherichia coli (EHEC O157:H7)", value: 300, color: "#eab308" },
    { name: "Low Risk: Lactobacillus spp.", value: 500, color: "#22c55e" },
    { name: "No Risk: Rhizobium spp.", value: 200, color: "#3b82f6" },
  ];

  // Expanded Bar Chart dataset (7 bacteria)
  const barData = [
    { bacteria: "Bacillus anthracis", risk: 1000 },
    { bacteria: "Escherichia coli (EHEC O157:H7)", risk: 300 },
    { bacteria: "Lactobacillus spp.", risk: 500 },
    { bacteria: "Rhizobium spp.", risk: 200 },
    { bacteria: "Salmonella enterica", risk: 600 },
    { bacteria: "Clostridium botulinum", risk: 450 },
    { bacteria: "Staphylococcus aureus", risk: 700 },
  ];

  // Colors for Bar Chart
  const colors = ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#f97316", "#9333ea", "#06b6d4"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          🦠 Bacteria Risk Dashboard
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Analysis of bacteria severity levels in the room environment
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MotionCard className="p-5 glass-card border border-border/30 bg-gradient-to-r from-red-500/20 to-red-500/10">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span className="text-sm">High Risk</span>
          </div>
          <div className="text-3xl font-bold text-red-500">1000</div>
        </MotionCard>

        <MotionCard className="p-5 glass-card border border-border/30 bg-gradient-to-r from-yellow-500/20 to-yellow-500/10">
          <div className="flex items-center gap-3 mb-2">
            <Bug className="w-6 h-6 text-yellow-500" />
            <span className="text-sm">Medium Risk</span>
          </div>
          <div className="text-3xl font-bold text-yellow-500">300</div>
        </MotionCard>

        <MotionCard className="p-5 glass-card border border-border/30 bg-gradient-to-r from-green-500/20 to-green-500/10">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-sm">Low Risk</span>
          </div>
          <div className="text-3xl font-bold text-green-500">500</div>
        </MotionCard>

        <MotionCard className="p-5 glass-card border border-border/30 bg-gradient-to-r from-blue-500/20 to-blue-500/10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="text-sm">No Risk</span>
          </div>
          <div className="text-3xl font-bold text-blue-500">200</div>
        </MotionCard>
      </div>

      {/* Pie Chart */}
      <MotionCard className="p-6 glass-card border border-border/30">
        <h4 className="font-semibold text-lg mb-4 text-center">
          🥧 Severity Distribution
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={3}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieCustomTooltip />} />
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </MotionCard>

      {/* Bar Chart */}
      {/* <MotionCard className="p-6 glass-card border border-border/30">
        <h4 className="font-semibold text-lg mb-4 text-center">
          📊 Bacteria Risk Analysis
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="bacteria"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
            <Tooltip content={<BarCustomTooltip />} />
            <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </MotionCard> */}
    </div>
  );
};

export default BacteriaDashboard;

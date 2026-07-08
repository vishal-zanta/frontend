import React from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis,
  Tooltip, Legend,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  labelStyle: { fontSize: "12px", fontWeight: 600, color: "#0f172a" },
  itemStyle: { fontSize: "11px", color: "#475569" },
};

const legendStyle = { fontSize: "11px", paddingTop: "8px" };

export function BarChartCard({ data, xKey, bars, height = 280, legend = true, yLabelFontSize = 10, xLabelFontSize = 10 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: xLabelFontSize }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: yLabelFontSize }} stroke="#94a3b8" />
        {legend && <Legend wrapperStyle={legendStyle} />}
        <Tooltip {...tooltipStyle} />
        {bars.map(b => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[4, 4, 0, 0]} maxBarSize={40} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StackedBarChartCard({ data, xKey, bars, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <Legend wrapperStyle={legendStyle} />
        <Tooltip {...tooltipStyle} />
        {bars.map(b => (
          <Bar key={b.key} dataKey={b.key} name={b.label} stackId="a" fill={b.color} radius={b.last ? [4, 4, 0, 0] : 0} maxBarSize={40} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineChartCard({ data, xKey, lines, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <Legend wrapperStyle={legendStyle} />
        <Tooltip {...tooltipStyle} />
        {lines.map(l => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaChartCard({ data, xKey, areas, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {areas.map(a => (
            <linearGradient key={a.key} id={`grad-${a.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={a.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={a.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <Legend wrapperStyle={legendStyle} />
        <Tooltip {...tooltipStyle} />
        {areas.map(a => (
          <Area key={a.key} type="monotone" dataKey={a.key} name={a.label} stroke={a.color} fill={`url(#grad-${a.key})`} strokeWidth={2} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PieChartCard({ data, height = 280, innerRadius = 50, outerRadius = 90 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Legend wrapperStyle={legendStyle} />
        <Tooltip {...tooltipStyle} />
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadarChartCard({ data, xKey, series, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey={xKey} tick={{ fontSize: 10 }} stroke="#64748b" />
        <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
        <Legend wrapperStyle={legendStyle} />
        <Tooltip {...tooltipStyle} />
        {series.map(s => (
          <Radar key={s.key} dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.3} strokeWidth={2} />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function ScatterChartCard({ data, height = 280, xLabel, yLabel }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name={xLabel} tick={{ fontSize: 10 }} stroke="#94a3b8" label={{ value: xLabel, position: "bottom", fontSize: 11, fill: "#64748b" }} />
        <YAxis type="number" dataKey="y" name={yLabel} tick={{ fontSize: 10 }} stroke="#94a3b8" label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
        <ZAxis type="number" dataKey="z" range={[60, 400]} />
        <Legend wrapperStyle={legendStyle} />
        <Tooltip {...tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#1d4ed8" fillOpacity={0.6} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
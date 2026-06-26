import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import api from "../services/api";

const severityColors = {
  Critical: "#EF4444",
  High: "#F97316",
  Medium: "#F59E0B",
  Low: "#10B981",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;

  return (
    <div
      style={{
        background: "#0F172A",
        border: `1px solid ${entry.color}55`,
        padding: "12px 16px",
        borderRadius: 10,
        color: "#fff",
        fontSize: 13,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ color: entry.color, fontWeight: 700, margin: "0 0 6px" }}>
        {entry.severity}
      </p>
      <p style={{ color: "#94A3B8", margin: 0 }}>
        Threats:{" "}
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
          {entry.value}
        </span>
      </p>
    </div>
  );
}

function ThreatSeverityChart() {
  const [data, setData] = useState([
    { severity: "Critical", value: 0, color: "#EF4444" },
    { severity: "High", value: 0, color: "#F97316" },
    { severity: "Medium", value: 0, color: "#F59E0B" },
    { severity: "Low", value: 0, color: "#10B981" },
  ]);

  useEffect(() => {
    api
      .get("/threat-alerts")
      .then((response) => {
        const raw = response.data || [];

        const counts = {
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0,
        };

        raw.forEach((item) => {
          const level = String(item.threat_level || "Low").trim();

          if (level === "Critical") counts.Critical += 1;
          else if (level === "High") counts.High += 1;
          else if (level === "Medium") counts.Medium += 1;
          else counts.Low += 1;
        });

        setData([
          { severity: "Critical", value: counts.Critical, color: severityColors.Critical },
          { severity: "High", value: counts.High, color: severityColors.High },
          { severity: "Medium", value: counts.Medium, color: severityColors.Medium },
          { severity: "Low", value: counts.Low, color: severityColors.Low },
        ]);
      })
      .catch((error) => {
        console.error("Threat alerts API error:", error);
      });
  }, []);

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomXTick = ({ x, y, payload }) => {
    const entry = data.find((d) => d.severity === payload.value);

    return (
      <g transform={`translate(${x},${y})`}>
        <circle cx={0} cy={4} r={4} fill={entry?.color ?? "#94A3B8"} />
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={12}
          fontFamily="Inter, sans-serif"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #334155",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
            Threat Severity Distribution
          </h2>
          <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
            Active threats by severity level
          </p>
        </div>

        <div
          style={{
            background: "#0F172A",
            border: "1px solid #334155",
            borderRadius: 10,
            padding: "6px 14px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, margin: 0 }}>
            {total}
          </p>
          <p
            style={{
              color: "#64748B",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "2px 0 0",
            }}
          >
            Total
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {data.map((d) => (
          <div key={d.severity} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: d.color,
                display: "inline-block",
              }}
            />
            <span style={{ color: "#94A3B8", fontSize: 12 }}>{d.severity}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
          barCategoryGap="35%"
        >
          <defs>
            {data.map((e) => (
              <linearGradient
                key={e.severity}
                id={`grad-${e.severity}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={e.color} stopOpacity={1} />
                <stop offset="100%" stopColor={e.color} stopOpacity={0.3} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E293B"
            vertical={false}
          />

          <XAxis
            dataKey="severity"
            axisLine={false}
            tickLine={false}
            tick={<CustomXTick />}
            height={40}
          />

          <YAxis
            stroke="#334155"
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickCount={6}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(148,163,184,0.04)" }}
          />

          <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={72}>
            {data.map((e) => (
              <Cell
                key={e.severity}
                fill={`url(#grad-${e.severity})`}
                stroke={e.color}
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              style={{
                fill: "#94A3B8",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid #1E293B",
        }}
      >
        {data.map((d) => (
          <div
            key={d.severity}
            style={{
              background: "#0F172A",
              borderRadius: 10,
              padding: "10px 8px",
              border: `1px solid ${d.color}33`,
              textAlign: "center",
            }}
          >
            <p style={{ color: d.color, fontSize: 20, fontWeight: 700, margin: 0 }}>
              {d.value}
            </p>
            <p
              style={{
                color: "#64748B",
                fontSize: 10,
                margin: "3px 0 0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {d.severity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThreatSeverityChart;
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "High Risk", value: 10, color: "#EF4444" },
  { name: "Medium Risk", value: 20, color: "#F59E0B" },
  { name: "Safe Users", value: 70, color: "#10B981" },
];

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
        {entry.name}
      </p>
      <p style={{ color: "#94A3B8", margin: 0 }}>
        Users:{" "}
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
          {entry.value}%
        </span>
      </p>
    </div>
  );
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.07) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
      fontFamily="Inter, sans-serif"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function RiskDistributionChart() {
  const total = data.reduce((s, d) => s + d.value, 0);

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
          marginBottom: 8,
        }}
      >
        <div>
          <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
            Risk Distribution
          </h2>
          <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
            User risk classification overview
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

      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <defs>
              {data.map((e) => (
                <linearGradient
                  key={e.name}
                  id={`pg-${e.name.replace(/\s/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={e.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={e.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={115}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
              stroke="none"
            >
              {data.map((e) => (
                <Cell
                  key={e.name}
                  fill={`url(#pg-${e.name.replace(/\s/g, "")})`}
                  stroke={e.color}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <p style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 700, margin: 0 }}>
            {total}
          </p>
          <p
            style={{
              color: "#64748B",
              fontSize: 10,
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Users
          </p>
        </div>
      </div>
    </div>
  );
}

export default RiskDistributionChart;
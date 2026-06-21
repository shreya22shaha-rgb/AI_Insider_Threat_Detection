import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { month: "Jan", threats: 5 },
  { month: "Feb", threats: 8 },
  { month: "Mar", threats: 12 },
  { month: "Apr", threats: 9 },
  { month: "May", threats: 15 },
  { month: "Jun", threats: 18 },
  { month: "Jul", threats: 14 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #3B82F655",
        padding: "12px 16px",
        borderRadius: 10,
        color: "#fff",
        fontSize: 13,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p
        style={{
          color: "#38BDF8",
          fontWeight: 700,
          margin: "0 0 6px",
        }}
      >
        {label}
      </p>
      <p style={{ color: "#94A3B8", margin: 0 }}>
        Threats:{" "}
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
          {payload[0].value}
        </span>
      </p>
    </div>
  );
}

function CustomDot({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#38BDF822" />
      <circle cx={cx} cy={cy} r={5} fill="#38BDF8" stroke="#0F172A" strokeWidth={2} />
    </g>
  );
}

function ThreatTrendChart() {
  const total = data.reduce((s, d) => s + d.threats, 0);
  const max = Math.max(...data.map((d) => d.threats));
  const avg = (total / data.length).toFixed(1);
  const peak = data.find((d) => d.threats === max);

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
            Threat Detection Trend
          </h2>
          <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
            Monthly threat incidents over time
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Total", value: total, color: "#38BDF8" },
            { label: "Avg/Mo", value: avg, color: "#A78BFA" },
            { label: "Peak", value: max, color: "#F97316" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "6px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ color: kpi.color, fontSize: 18, fontWeight: 700, margin: 0 }}>
                {kpi.value}
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
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
          />

          <YAxis
            stroke="#334155"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickCount={6}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <ReferenceLine
            y={parseFloat(avg)}
            stroke="#A78BFA"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Avg ${avg}`,
              fill: "#A78BFA",
              fontSize: 11,
              position: "insideTopRight",
            }}
          />

          <ReferenceLine x={peak?.month} stroke="#F9731633" strokeWidth={1} />

          <Area
            type="monotone"
            dataKey="threats"
            stroke="url(#lineGrad)"
            strokeWidth={3}
            fill="url(#areaGrad)"
            dot={<CustomDot />}
            activeDot={{ r: 7, fill: "#38BDF8", stroke: "#0F172A", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThreatTrendChart;
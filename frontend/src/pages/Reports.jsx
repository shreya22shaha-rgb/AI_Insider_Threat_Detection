import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  Label,
} from "recharts";
import { FaChartLine, FaChartPie, FaChartBar } from "react-icons/fa";

const COLORS = ["#EF4444", "#F97316", "#F59E0B", "#10B981", "#38BDF8", "#A78BFA"];
const DEFAULT_ACTIVITY_DATE = "2026-06-22";

function StatMini({ title, value, color }) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "8px 16px",
        textAlign: "center",
        minWidth: 80,
      }}
    >
      <div style={{ color, fontSize: 20, fontWeight: 700 }}>{value}</div>
      <div
        style={{
          color: "#64748B",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #334155",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        {icon}
        <h3 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 16px" }}>{subtitle}</p>
      <div style={{ minHeight: 300, width: "100%" }}>{children}</div>
    </div>
  );
}

function EmptyChartState({ message, height = 280 }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
        border: "1px dashed #334155",
        borderRadius: 12,
        background: "#0F172A",
        padding: 16,
      }}
    >
      {message}
    </div>
  );
}

function Reports() {
  const [riskTrend, setRiskTrend] = useState([]);
  const [threatClassification, setThreatClassification] = useState([]);
  const [activitiesByDate, setActivitiesByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(DEFAULT_ACTIVITY_DATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      api.get("/risk-trend").catch(() => ({ data: [] })),
      api.get("/threat-classification").catch(() => ({ data: [] })),
      api
        .get("/activities-by-date", { params: { selected_date: selectedDate } })
        .catch(() => ({ data: [] })),
    ])
      .then(([trendRes, classRes, activityRes]) => {
        setRiskTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
        setThreatClassification(Array.isArray(classRes.data) ? classRes.data : []);
        setActivitiesByDate(Array.isArray(activityRes.data) ? activityRes.data : []);
      })
      .catch(() => {
        setError("Failed to load reports data.");
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const trendChartData = useMemo(() => {
    return riskTrend.map((item, idx) => ({
      name: item.employee_name || `User ${idx + 1}`,
      score: Number(item.current_score ?? 0),
      previous: Number(item.previous_score ?? 0),
    }));
  }, [riskTrend]);

  const pieData = useMemo(() => {
    return threatClassification.map((item, idx) => ({
      name: item.threat_classification || item.threat_type || `Threat ${idx + 1}`,
      value: 1,
    }));
  }, [threatClassification]);

  const activityBarData = useMemo(() => {
    if (!Array.isArray(activitiesByDate) || activitiesByDate.length === 0) return [];

    const grouped = activitiesByDate.reduce((acc, item) => {
      const key = item.activity_type || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([activity, count]) => ({
      date: activity,
      count,
    }));
  }, [activitiesByDate]);

  const totalTrend = trendChartData.length;
  const totalThreatTypes = pieData.length;
  const totalDates = activityBarData.length;
  const totalThreats = pieData.reduce((sum, item) => sum + (item.value ?? 0), 0);

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Reports</h1>
            <p className="dashboard-subtitle">
              Analyze trends, compare severity levels, and review security reporting metrics.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            REPORT CENTER
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          <StatMini title="Trend Points" value={totalTrend} color="#38BDF8" />
          <StatMini title="Threat Types" value={totalThreatTypes} color="#F97316" />
          <StatMini title="Activity Types" value={totalDates} color="#10B981" />
        </div>

        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <label htmlFor="report-date" style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
            Select Date:
          </label>

          <input
            id="report-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              background: "#0F172A",
              border: "1px solid #334155",
              color: "#F1F5F9",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
            }}
          />

          <span style={{ color: "#64748B", fontSize: 12 }}>
            Default test date: {DEFAULT_ACTIVITY_DATE}
          </span>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "40px 0" }}>
            Loading reports...
          </div>
        ) : error ? (
          <div
            style={{
              color: "#FCA5A5",
              background: "#111827",
              border: "1px solid #7f1d1d",
              borderRadius: 10,
              padding: 14,
            }}
          >
            {error}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <ChartCard
                title="Risk Trend Analysis"
                subtitle="Current employee risk scores from backend"
                icon={<FaChartLine color="#38BDF8" size={15} />}
              >
                {trendChartData.length === 0 ? (
                  <EmptyChartState message="No risk trend data available." height={320} />
                ) : (
                  <div style={{ width: "100%", height: 320, minWidth: 0, minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748B" tick={{ fontSize: 11 }} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #334155",
                            color: "#F1F5F9",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          name="Current Score"
                          stroke="#38BDF8"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#38BDF8" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="previous"
                          name="Previous Score"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#F59E0B" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartCard>
            </div>

            <div className="reports-grid">
              <ChartCard
                title="Threat Classification"
                subtitle="AI-detected threat categories across employees"
                icon={<FaChartPie color="#F97316" size={15} />}
              >
                {pieData.length === 0 ? (
                  <EmptyChartState message="No threat classification data available." height={300} />
                ) : (
                  <div style={{ width: "100%", height: 300, minWidth: 0, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={4}
                          cornerRadius={4}
                          isAnimationActive={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}

                          <Label
                            position="center"
                            content={({ viewBox }) => {
                              if (!viewBox || viewBox.cx == null || viewBox.cy == null) return null;
                              const { cx, cy } = viewBox;
                              return (
                                <g>
                                  <text
                                    x={cx}
                                    y={cy - 6}
                                    fill="#E5E7EB"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    style={{ fontSize: 16, fontWeight: 700 }}
                                  >
                                    {totalThreats}
                                  </text>
                                  <text
                                    x={cx}
                                    y={cy + 12}
                                    fill="#9CA3AF"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    style={{ fontSize: 11 }}
                                  >
                                    total threats
                                  </text>
                                </g>
                              );
                            }}
                          />
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #334155",
                            color: "#F1F5F9",
                          }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartCard>

              <ChartCard
                title="Activities by Date"
                subtitle={`Activity volume for ${selectedDate}`}
                icon={<FaChartBar color="#10B981" size={15} />}
              >
                {activityBarData.length === 0 ? (
                  <EmptyChartState
                    message={`No activity-by-date data available for ${selectedDate}. Try 2026-06-22, 2026-06-12, or 2026-06-06.`}
                    height={300}
                  />
                ) : (
                  <div style={{ width: "100%", height: 300, minWidth: 0, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityBarData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748B" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #334155",
                            color: "#F1F5F9",
                          }}
                        />
                        <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Reports;
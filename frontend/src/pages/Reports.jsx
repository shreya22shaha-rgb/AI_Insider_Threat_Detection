import { useEffect, useState } from "react";
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
} from "recharts";
import { FaChartLine, FaChartPie, FaChartBar } from "react-icons/fa";

const COLORS = ["#EF4444", "#F97316", "#F59E0B", "#10B981", "#38BDF8", "#A78BFA"];

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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        {icon}
        <h3 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 16px" }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Reports() {
  const [riskTrend, setRiskTrend] = useState([]);
  const [threatClassification, setThreatClassification] = useState([]);
  const [activitiesByDate, setActivitiesByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    Promise.all([
      api.get("/risk-trend").catch(() => ({ data: [] })),
      api.get("/threat-classification").catch(() => ({ data: [] })),
      api.get("/activities-by-date").catch(() => ({ data: [] })),
    ])
      .then(([trendRes, classRes, activityRes]) => {
        setRiskTrend(Array.isArray(trendRes.data) ? trendRes.data : trendRes.data?.trend || []);
        setThreatClassification(
          Array.isArray(classRes.data) ? classRes.data : classRes.data?.classifications || []
        );
        setActivitiesByDate(
          Array.isArray(activityRes.data) ? activityRes.data : activityRes.data?.activities || []
        );
      })
      .catch((err) => {
        console.error("Reports API error:", err);
        setError("Failed to load reports data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const trendChartData = riskTrend.map((item, idx) => ({
    name: item.employee_name || item.name || `User ${idx + 1}`,
    score: item.risk_score ?? item.score ?? 0,
  }));

  const classificationCounts = threatClassification.reduce((acc, item) => {
    const key = item.threat_type || item.classification || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(classificationCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const activityBarData = activitiesByDate.map((item, idx) => ({
    date: item.date || item.label || `Day ${idx + 1}`,
    count: item.count || item.activities || item.total || 0,
  }));

  const totalTrend = trendChartData.length;
  const totalThreatTypes = pieData.length;
  const totalDates = activityBarData.length;

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

        {/* Top Stats */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          <StatMini title="Trend Points" value={totalTrend} color="#38BDF8" />
          <StatMini title="Threat Types" value={totalThreatTypes} color="#F97316" />
          <StatMini title="Date Groups" value={totalDates} color="#10B981" />
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
            {/* Full width line chart */}
            <div style={{ marginBottom: 20 }}>
              <ChartCard
                title="Risk Trend Analysis"
                subtitle="Risk score trend from backend risk-trend endpoint"
                icon={<FaChartLine color="#38BDF8" size={15} />}
              >
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip
                        contentStyle={{
                          background: "#0F172A",
                          border: "1px solid #334155",
                          color: "#F1F5F9",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#38BDF8"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#38BDF8" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Two charts */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <ChartCard
                title="Threat Classification"
                subtitle="Distribution of classified threat categories"
                icon={<FaChartPie color="#F97316" size={15} />}
              >
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label
                      >
                        {pieData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#0F172A",
                          border: "1px solid #334155",
                          color: "#F1F5F9",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard
                title="Activities by Date"
                subtitle="Activity volume grouped over time"
                icon={<FaChartBar color="#10B981" size={15} />}
              >
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={activityBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="date" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
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
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Reports;
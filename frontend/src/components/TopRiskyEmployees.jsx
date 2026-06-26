import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaUsers } from "react-icons/fa";
import api from "../services/api";

function SkeletonRow() {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 72,
      }}
    >
      <div style={{ width: "70%" }}>
        <div
          style={{
            height: 16,
            width: "40%",
            background: "linear-gradient(90deg, #1E293B 25%, #334155 50%, #1E293B 75%)",
            backgroundSize: "200% 100%",
            borderRadius: 8,
            marginBottom: 10,
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 10,
            width: "55%",
            background: "linear-gradient(90deg, #1E293B 25%, #334155 50%, #1E293B 75%)",
            backgroundSize: "200% 100%",
            borderRadius: 8,
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        />
      </div>

      <div
        style={{
          height: 18,
          width: 36,
          background: "linear-gradient(90deg, #1E293B 25%, #334155 50%, #1E293B 75%)",
          backgroundSize: "200% 100%",
          borderRadius: 8,
          animation: "pulse 1.2s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function TopRiskyEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/top-risky-employees")
      .then((response) => {
        setEmployees(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error("Top risky employees API error:", err);
        setError("Failed to load top risky employees.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #334155",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <style>{`
        @keyframes pulse {
          0% { background-position: 200% 0; opacity: 0.6; }
          50% { opacity: 1; }
          100% { background-position: -200% 0; opacity: 0.6; }
        }
      `}</style>

      <div style={{ marginBottom: 18 }}>
        <h2 style={{ color: "#F1F5F9", fontSize: 18, margin: 0 }}>
          Top Risky Employees
        </h2>
        <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 6, marginBottom: 0 }}>
          Live ranking based on high risk activity counts
        </p>
      </div>

      {loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : error ? (
        <div
          style={{
            background: "#0F172A",
            border: "1px solid #475569",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#FCA5A5",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : employees.length === 0 ? (
        <div
          style={{
            background: "#0F172A",
            border: "1px solid #334155",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#94A3B8",
            fontSize: 14,
          }}
        >
          No risky employees found.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {employees
            .slice()
            .sort((a, b) => (b.high_risk_count || 0) - (a.high_risk_count || 0))
            .map((employee, index) => (
              <div
                key={`${employee.employee_name}-${index}`}
                style={{
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.borderColor = "#475569";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#334155";
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      color: "#F8FAFC",
                      fontSize: 15,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    #{index + 1} {employee.employee_name}
                  </p>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: 12,
                      margin: "6px 0 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FaUsers size={12} />
                    Employee Risk Profile
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#F97316",
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  <FaExclamationTriangle />
                  {employee.high_risk_count}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default TopRiskyEmployees;
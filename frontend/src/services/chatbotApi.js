import api from "./api";

/* ------------------------------------------------------------------ */
/*  STATIC REPLIES                                                     */
/* ------------------------------------------------------------------ */

const HELP_REPLY = `🤖 I can help you with:

📊 Dashboard Summary
👥 Employee Statistics
⚠️ Risk Scores
🛡️ Security Health
📈 Executive Summary
🚨 Threat Alerts
📋 Activity Logs
📄 Reports
👤 Profile / Settings
🛡️ Project Overview

Type your question naturally, for example:
• show dashboard summary
• how many employees are there
• medium risk count
• who are the high risk employees
• show threat alerts
• what does this project do`;

const GREETING_REPLY = `👋 Hello!

I'm your AI Security Assistant. How can I help you today?

• Dashboard Summary
• Security Health
• Dynamic Risk Score
• Executive Summary
• Threat Alerts`;

const THANKS_REPLY = `You're welcome! 🙂

If you need another security report or dashboard summary, just ask.`;

const GOODBYE_REPLY = `👋 Goodbye! Stay safe.`;

const IDENTITY_REPLY = `🤖 I'm the AI Security Assistant.

I help you analyze:
• Security dashboards
• Risk scores
• Employee activity
• Threat alerts
• Reports`;

const EXPLAIN_PROJECT_REPLY = `🛡️ About this system

AI Insider Threat Detection monitors employee activity, detects suspicious behavior, calculates dynamic risk scores, and helps administrators identify and prevent insider threats before they cause damage.`;

const CONNECTION_ERROR_REPLY = `⚠️ I couldn't connect to the server.

Please try again in a few moments.`;

/* ------------------------------------------------------------------ */
/*  INTENT RULES                                                       */
/* ------------------------------------------------------------------ */

const INTENT_RULES = [
  {
    intent: "greeting",
    keywords: [
      "hello",
      "hi",
      "hii",
      "hey",
      "yo",
      "good morning",
      "good afternoon",
      "good evening",
      "morning",
      "namaste",
      "sup",
      "whats up",
      "what's up",
    ],
  },

  {
    intent: "thanks",
    keywords: [
      "thanks",
      "thank you",
      "thankyou",
      "thx",
      "ty",
      "awesome",
      "great",
      "nice",
      "cool",
      "perfect",
      "good job",
      "well done",
      "appreciate it",
    ],
  },

  {
    intent: "goodbye",
    keywords: [
      "bye",
      "goodbye",
      "good bye",
      "exit",
      "quit",
      "see you",
      "see ya",
      "talk later",
      "close chat",
      "end chat",
    ],
  },

  {
    intent: "identity",
    keywords: [
      "who are you",
      "what are you",
      "your name",
      "are you a bot",
      "are you human",
      "are you ai",
      "who is this assistant",
    ],
  },

  {
    intent: "explain-project",
    keywords: [
      "what is insider threat detection",
      "explain this project",
      "what does this system do",
      "explain this system",
      "what is this project",
      "how does this work",
      "about this project",
      "about this system",
      "what is this app",
      "what is this platform",
      "project overview",
      "system overview",
    ],
  },

  {
    intent: "help",
    keywords: [
      "help",
      "what can you do",
      "supported commands",
      "commands",
      "options",
      "support",
      "features",
      "menu",
    ],
  },

  {
    intent: "dashboard-summary",
    keywords: [
      "dashboard summary",
      "show dashboard summary",
      "dashboard overview",
      "dashboard stats",
      "dashboard statistics",
      "ai dashboard",
      "open dashboard",
      "summary of dashboard",
      "overview of dashboard",
      "show dashboard",
      "dashboard",
      "overview",
    ],
  },

  {
    intent: "total-activities",
    keywords: [
      "total activities",
      "total activity",
      "activity count",
      "activities count",
      "how many activities",
      "number of activities",
      "total logs",
      "how many logs",
      "activity total",
    ],
  },

  {
    intent: "total-employees",
    keywords: [
      "total employees",
      "total employee",
      "employee count",
      "employees count",
      "how many employees",
      "number of employees",
      "total staff",
      "staff count",
      "how many users",
      "user count",
      "total users",
      "headcount",
    ],
  },

  {
    intent: "high-risk-count",
    keywords: [
      "high risk count",
      "how many high risk",
      "count of high risk",
      "high-risk count",
      "number of high risk employees",
      "high risk cases",
      "high risk total",
      "high risk employees count",
    ],
  },

  {
    intent: "medium-risk-count",
    keywords: [
      "medium risk count",
      "how many medium risk",
      "count of medium risk",
      "medium-risk count",
      "number of medium risk employees",
      "medium risk total",
      "medium risk cases",
    ],
  },

  {
    intent: "low-risk-count",
    keywords: [
      "low risk count",
      "how many low risk",
      "count of low risk",
      "low-risk count",
      "number of low risk employees",
      "low risk total",
      "low risk cases",
    ],
  },

  {
    intent: "critical-count",
    keywords: [
      "critical employees",
      "critical count",
      "how many critical",
      "critical risk",
      "critical users",
      "critical employee count",
      "critical total",
    ],
  },

  {
    intent: "security-health-score",
    keywords: [
      "security health",
      "security health score",
      "health score",
      "security score",
      "is the system secure",
      "security overview",
      "health overview",
      "current health",
      "show health score",
      "health",
    ],
  },

  {
    intent: "dynamic-risk-score",
    keywords: [
      "dynamic risk score",
      "show dynamic risk score",
      "risk scores",
      "all risk scores",
      "employee risk scores",
      "risk score list",
      "show all risk",
      "display risk scores",
      "risk details",
      "dynamic risk",
    ],
  },

  {
    intent: "high-risk-employees",
    keywords: [
      "high risk employees",
      "high-risk employees",
      "show high risk employees",
      "display high risk employees",
      "who is highest risk",
      "highest risk employee",
      "top risk employee",
      "show risky users",
      "risky employees",
      "riskiest employee",
      "most risky employee",
    ],
  },

  {
    intent: "executive-summary",
    keywords: [
      "executive summary",
      "generate executive summary",
      "overall summary",
      "overall analysis",
      "ai summary",
      "today summary",
      "today's summary",
      "summary report",
      "show executive summary",
    ],
  },

  {
    intent: "threat-alerts",
    keywords: [
      "threat alerts",
      "show alerts",
      "active alerts",
      "alerts",
      "security alerts",
      "active threats",
      "show active alerts",
      "recent alerts",
      "threat analysis",
      "high severity alerts",
      "alert list",
    ],
  },

  {
    intent: "insider-threat-rules",
    keywords: [
      "insider threat rules",
      "threat rules",
      "active rules",
      "detection rules",
      "security rules",
      "insider rules",
      "show rules",
    ],
  },

  {
    intent: "users-list",
    keywords: [
      "show users",
      "list users",
      "all users",
      "user list",
      "show employees",
      "employee list",
      "list employees",
      "employees list",
      "all employees",
    ],
  },

  {
    intent: "activity-logs",
    keywords: [
      "activity logs",
      "show activity logs",
      "activity log",
      "recent activity",
      "recent activities",
      "activity history",
      "user activity",
      "login activity",
      "show activities",
      "logs",
    ],
  },

  {
    intent: "risk-trend",
    keywords: [
      "risk trend",
      "risk trends",
      "risk trend analysis",
      "risk over time",
      "score trend",
      "trend analysis",
      "risk comparison",
    ],
  },

  {
    intent: "threat-classification",
    keywords: [
      "threat classification",
      "threat classifications",
      "threat type",
      "threat types",
      "threat category",
      "classification of threats",
      "types of threats",
    ],
  },

  {
    intent: "reports",
    keywords: [
      "reports",
      "open reports",
      "generate report",
      "show reports",
      "latest report",
      "report page",
      "export report",
    ],
  },

  {
    intent: "settings-profile",
    keywords: [
      "my profile",
      "profile",
      "my role",
      "my email",
      "my username",
      "account settings",
      "settings",
      "current user",
      "who am i",
      "profile info",
    ],
  },
];

const ABBREVIATION_MAP = {
  dash: "dashboard-summary",
  dashboard: "dashboard-summary",
  health: "security-health-score",
  alerts: "threat-alerts",
  alert: "threat-alerts",
  users: "users-list",
  logs: "activity-logs",
  reports: "reports",
};

function matchesWholeWord(text, word) {
  return new RegExp(`\\b${word}\\b`, "i").test(text);
}

function detectIntent(message) {
  const text = message.toLowerCase().trim();

  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.intent;
    }
  }

  for (const [abbr, intent] of Object.entries(ABBREVIATION_MAP)) {
    if (matchesWholeWord(text, abbr)) {
      return intent;
    }
  }

  if (text.includes("medium") && text.includes("risk")) return "medium-risk-count";
  if (text.includes("high") && text.includes("risk") && text.includes("count")) return "high-risk-count";
  if (text.includes("low") && text.includes("risk")) return "low-risk-count";
  if (text.includes("critical")) return "critical-count";
  if (text.includes("activity")) return "total-activities";
  if (text.includes("employee") && (text.includes("count") || text.includes("total"))) return "total-employees";
  if (text.includes("profile") || text.includes("role") || text.includes("email")) return "settings-profile";
  if (text.includes("summary")) return "executive-summary";
  if (text.includes("alert")) return "threat-alerts";
  if (text.includes("report")) return "reports";
  if (text.includes("risk score")) return "dynamic-risk-score";
  if (text === "high risk") return "high-risk-count";
  if (text === "medium risk") return "medium-risk-count";
  if (text === "low risk") return "low-risk-count";

  return null;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function toTitle(label) {
  return label
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatKeyValueObject(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      const label = toTitle(key);
      const safeValue =
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : value ?? "N/A";
      return `• ${label}: ${safeValue}`;
    })
    .join("\n");
}

function getDashboardTotals(data) {
  return {
    totalActivities: data?.total_activities ?? data?.totalActivities ?? data?.activities ?? 0,
    highRisk: data?.high_risk ?? data?.highRisk ?? 0,
    mediumRisk: data?.medium_risk ?? data?.mediumRisk ?? 0,
    lowRisk: data?.low_risk ?? data?.lowRisk ?? 0,
  };
}

function getHealthTotals(data) {
  return {
    totalEmployees: data?.total_employees ?? data?.totalEmployees ?? 0,
    criticalEmployees: data?.critical_employees ?? data?.criticalEmployees ?? 0,
    highRiskEmployees: data?.high_risk_employees ?? data?.highRiskEmployees ?? 0,
    mediumRiskEmployees: data?.medium_risk_employees ?? data?.mediumRiskEmployees ?? 0,
    lowRiskEmployees: data?.low_risk_employees ?? data?.lowRiskEmployees ?? 0,
    score: data?.security_score ?? data?.overall_score ?? data?.score ?? 0,
    status: data?.security_status ?? data?.status ?? "Unknown",
    recommendation:
      data?.recommendation ??
      "Continue monitoring high-risk employees and review new alerts regularly.",
  };
}

function getDashboardStatus({ highRisk, mediumRisk }) {
  if (highRisk >= 10) return { emoji: "🔴", label: "Critical" };
  if (highRisk > 0) return { emoji: "🟠", label: "Needs Attention" };
  if (mediumRisk > 0) return { emoji: "🟡", label: "Fair" };
  return { emoji: "🟢", label: "Healthy" };
}

function getScoreIndicator(score) {
  const numericScore = Number(score) || 0;
  if (numericScore >= 90) return { emoji: "🟢", label: "Excellent" };
  if (numericScore >= 75) return { emoji: "🟢", label: "Good" };
  if (numericScore >= 50) return { emoji: "🟡", label: "Fair" };
  return { emoji: "🔴", label: "Poor" };
}

/* ------------------------------------------------------------------ */
/*  FORMATTERS                                                         */
/* ------------------------------------------------------------------ */

function formatDashboardSummary(data) {
  const totals = getDashboardTotals(data);
  const { totalActivities, highRisk, mediumRisk, lowRisk } = totals;
  const status = getDashboardStatus(totals);

  return `📊 Dashboard Summary

• Total Activities: ${totalActivities}
• High Risk: ${highRisk}
• Medium Risk: ${mediumRisk}
• Low Risk: ${lowRisk}

Security Status: ${status.emoji} ${status.label}`;
}

function formatTotalActivities(data) {
  const { totalActivities } = getDashboardTotals(data);

  if (totalActivities === 0) {
    return "There are currently no recorded activities in the system.";
  }
  if (totalActivities === 1) {
    return "You currently have a total of 1 recorded activity.";
  }
  return `You currently have a total of ${totalActivities} recorded activities.`;
}

function formatTotalEmployees(data) {
  const { totalEmployees } = getHealthTotals(data);

  if (totalEmployees === 0) {
    return "There are currently no employees recorded in the system.";
  }
  if (totalEmployees === 1) {
    return "You currently have a total of 1 employee in the system.";
  }
  return `You currently have a total of ${totalEmployees} employees in the system.`;
}

function formatHighRiskCount(data) {
  const { highRisk } = getDashboardTotals(data);
  return `There are currently ${highRisk} high-risk cases in the dashboard summary.`;
}

function formatMediumRiskCount(data) {
  const { mediumRisk } = getDashboardTotals(data);
  return `There are currently ${mediumRisk} medium-risk cases in the dashboard summary.`;
}

function formatLowRiskCount(data) {
  const { lowRisk } = getDashboardTotals(data);
  return `There are currently ${lowRisk} low-risk cases in the dashboard summary.`;
}

function formatCriticalCount(data) {
  const { criticalEmployees } = getHealthTotals(data);
  return `There are currently ${criticalEmployees} critical employees in the system.`;
}

function formatSecurityHealthScore(data) {
  const totals = getHealthTotals(data);
  const {
    score,
    recommendation,
    totalEmployees,
    criticalEmployees,
    highRiskEmployees,
    mediumRiskEmployees,
    lowRiskEmployees,
    status,
  } = totals;
  const indicator = getScoreIndicator(score);

  return `🛡️ Current Security Health Score

${indicator.emoji} ${indicator.label}
Security Score: ${score}%
Status: ${status}

Breakdown:
• Total Employees: ${totalEmployees}
• Critical: ${criticalEmployees}
• High Risk: ${highRiskEmployees}
• Medium Risk: ${mediumRiskEmployees}
• Low Risk: ${lowRiskEmployees}

Recommendation:
${recommendation}`;
}

function formatDynamicRiskScore(data) {
  const list = Array.isArray(data) ? data : data?.results ?? [];

  if (list.length === 0) {
    return "⚠️ No dynamic risk score data available.";
  }

  return `⚠️ Dynamic Risk Score

${list
  .map((item, i) => {
    const name = item.employee_name || item.name || `Employee ${i + 1}`;
    const score = item.risk_score ?? item.score ?? "N/A";
    return `${i + 1}. ${name} — Risk Score: ${score}`;
  })
  .join("\n")}`;
}

function formatHighRiskEmployees(data) {
  const list = Array.isArray(data) ? data : data?.results ?? [];

  const highRisk = list
    .filter((item) => Number(item.risk_score ?? item.score ?? 0) >= 60)
    .sort((a, b) => (b.risk_score ?? b.score ?? 0) - (a.risk_score ?? a.score ?? 0));

  if (highRisk.length === 0) {
    return "👥 No high-risk employees found at this time.";
  }

  return `👥 High-Risk Employees

${highRisk
  .map((item, i) => {
    const name = item.employee_name || item.name || `Employee ${i + 1}`;
    const score = item.risk_score ?? item.score ?? "N/A";
    return `${i + 1}. ${name} — Risk Score: ${score}`;
  })
  .join("\n")}`;
}

function formatExecutiveSummary(data) {
  if (typeof data === "string") {
    return `📈 Executive Summary

${data}`;
  }
  if (typeof data === "object" && data !== null) {
    return `📈 Executive Summary

${formatKeyValueObject(data)}`;
  }
  return `📈 Executive Summary

${String(data)}`;
}

function formatThreatAlerts(data) {
  const list = Array.isArray(data) ? data : data?.alerts ?? [];

  if (list.length === 0) {
    return "🚨 No active threat alerts at this time.";
  }

  return `🚨 Active Alerts (${list.length})

${list
  .slice(0, 10)
  .map((item, i) => {
    const name = item.employee_name || item.user || item.name || `Alert ${i + 1}`;
    const severity = item.severity || item.threat_level || "N/A";
    const message = item.message || item.description || "No description available";
    return `${i + 1}. ${name} — ${severity}: ${message}`;
  })
  .join("\n")}`;
}

function formatInsiderThreatRules(data) {
  const list = Array.isArray(data) ? data : data?.rules ?? [];

  if (list.length === 0) {
    return "🛡️ No active insider threat rules found.";
  }

  return `🛡️ Insider Threat Rules (${list.length})

${list
  .map((item, i) => {
    const name = item.rule_name || item.name || `Rule ${i + 1}`;
    return `${i + 1}. ${name}`;
  })
  .join("\n")}`;
}

function formatUsersList(data) {
  const list = Array.isArray(data) ? data : data?.users ?? [];

  if (list.length === 0) {
    return "👥 No users found in the system.";
  }

  return `👥 Users (${list.length})

${list
  .slice(0, 15)
  .map((item, i) => {
    const username = item.username || item.name || `User ${i + 1}`;
    const role = item.role || "N/A";
    return `${i + 1}. ${username} — ${role}`;
  })
  .join("\n")}`;
}

function formatActivityLogs(data) {
  const list = Array.isArray(data) ? data : data?.logs ?? data?.activities ?? [];

  if (list.length === 0) {
    return "📋 No activity logs found.";
  }

  return `📋 Recent Activity Logs (showing ${Math.min(10, list.length)} of ${list.length})

${list
  .slice(0, 10)
  .map((item, i) => {
    const name = item.employee_name || item.user || item.username || `Entry ${i + 1}`;
    const type = item.activity_type || item.type || "Activity";
    const time = item.timestamp || item.time || item.created_at || "";
    return `${i + 1}. ${name} — ${type}${time ? ` (${time})` : ""}`;
  })
  .join("\n")}`;
}

function formatRiskTrend(data) {
  const list = Array.isArray(data) ? data : data?.trends ?? [];

  if (list.length === 0) {
    return "📈 No risk trend data available.";
  }

  return `📈 Risk Trend

${list
  .map((item, i) => {
    const name = item.employee_name || item.name || `Employee ${i + 1}`;
    const current = item.current_score ?? item.current ?? "N/A";
    const previous = item.previous_score ?? item.previous ?? "N/A";
    return `${i + 1}. ${name} — Current: ${current}, Previous: ${previous}`;
  })
  .join("\n")}`;
}

function formatThreatClassification(data) {
  const list = Array.isArray(data) ? data : data?.classifications ?? [];

  if (list.length === 0) {
    return "🧩 No threat classification data available.";
  }

  return `🧩 Threat Classification (${list.length})

${list
  .map((item, i) => {
    const label =
      item.threat_classification ||
      item.threat_type ||
      item.category ||
      `Type ${i + 1}`;
    return `${i + 1}. ${label}`;
  })
  .join("\n")}`;
}

function formatSettingsProfile(data) {
  const username = data?.username ?? "N/A";
  const email = data?.email ?? "N/A";
  const role = data?.role ?? "N/A";

  return `👤 Your Profile

• Username: ${username}
• Email: ${email}
• Role: ${role}`;
}

/* ------------------------------------------------------------------ */
/*  ENDPOINT + FORMATTER MAPS                                          */
/* ------------------------------------------------------------------ */

const INTENT_ENDPOINT_MAP = {
  "dashboard-summary": "/dashboard",
  "total-activities": "/dashboard",
  "total-employees": "/security-health-score",
  "high-risk-count": "/dashboard",
  "medium-risk-count": "/dashboard",
  "low-risk-count": "/dashboard",
  "critical-count": "/security-health-score",
  "security-health-score": "/security-health-score",
  "dynamic-risk-score": "/dynamic-risk-score",
  "high-risk-employees": "/dynamic-risk-score",
  "executive-summary": "/executive-summary",
  "threat-alerts": "/threat-alerts",
  "insider-threat-rules": "/insider-threat-rules",
  "users-list": "/users",
  "activity-logs": "/activity-logs",
  "risk-trend": "/risk-trend",
  "threat-classification": "/threat-classification",
  "settings-profile": "/users/me",
};

const FORMATTERS = {
  "dashboard-summary": formatDashboardSummary,
  "total-activities": formatTotalActivities,
  "total-employees": formatTotalEmployees,
  "high-risk-count": formatHighRiskCount,
  "medium-risk-count": formatMediumRiskCount,
  "low-risk-count": formatLowRiskCount,
  "critical-count": formatCriticalCount,
  "security-health-score": formatSecurityHealthScore,
  "dynamic-risk-score": formatDynamicRiskScore,
  "high-risk-employees": formatHighRiskEmployees,
  "executive-summary": formatExecutiveSummary,
  "threat-alerts": formatThreatAlerts,
  "insider-threat-rules": formatInsiderThreatRules,
  "users-list": formatUsersList,
  "activity-logs": formatActivityLogs,
  "risk-trend": formatRiskTrend,
  "threat-classification": formatThreatClassification,
  "settings-profile": formatSettingsProfile,
};

const STATIC_REPLIES = {
  greeting: GREETING_REPLY,
  thanks: THANKS_REPLY,
  goodbye: GOODBYE_REPLY,
  identity: IDENTITY_REPLY,
  "explain-project": EXPLAIN_PROJECT_REPLY,
  help: HELP_REPLY,
};

/* ------------------------------------------------------------------ */
/*  QUICK ACTIONS                                                      */
/* ------------------------------------------------------------------ */

export const QUICK_ACTIONS = [
  { label: "📊 Dashboard", message: "Show dashboard summary" },
  { label: "🛡️ Security Health", message: "Show security health score" },
  { label: "⚠️ Risk Score", message: "Show dynamic risk score" },
  { label: "📈 Executive Summary", message: "Show executive summary" },
  { label: "🚨 Alerts", message: "Show threat alerts" },
  { label: "👥 Users", message: "Show users" },
];

/* ------------------------------------------------------------------ */
/*  MAIN ENTRY POINT                                                   */
/* ------------------------------------------------------------------ */

export async function getChatbotReply(message) {
  const intent = detectIntent(message);

  if (!intent) {
    return { ok: true, reply: HELP_REPLY };
  }

  if (STATIC_REPLIES[intent]) {
    return { ok: true, reply: STATIC_REPLIES[intent] };
  }

  if (intent === "reports") {
    return {
      ok: true,
      reply: "📄 Opening the Reports page for you...",
      navigateTo: "/reports",
    };
  }

  try {
    const endpoint = INTENT_ENDPOINT_MAP[intent];
    const formatter = FORMATTERS[intent];

    if (!endpoint || !formatter) {
      return { ok: true, reply: HELP_REPLY };
    }

    const response = await api.get(endpoint);
    return { ok: true, reply: formatter(response.data) };
  } catch (error) {
    return {
      ok: false,
      reply: CONNECTION_ERROR_REPLY,
      error,
    };
  }
}
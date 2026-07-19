const QUICK_ACTIONS = [
  { label: "📊 Dashboard Summary", value: "Show dashboard summary" },
  { label: "🛡️ Security Health", value: "Show security health score" },
  { label: "⚠️ Risk Scores", value: "Show dynamic risk score" },
  { label: "🚨 Threat Alerts", value: "Show threat alerts" },
  { label: "👥 High-Risk Employees", value: "Display high-risk employees" },
  { label: "📈 Executive Summary", value: "Generate executive summary" },
];

function ChatQuickActions({ onSelect, visible }) {
  if (!visible) return null;

  return (
    <div className="chat-quick-actions">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.value}
          type="button"
          className="chat-quick-btn"
          onClick={() => onSelect(action.value)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default ChatQuickActions;
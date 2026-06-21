import "../styles/StatCard.css";

function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendType = "neutral",
  accent = "blue",
}) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__top">
        <div className="stat-card__icon-wrap">
          <div className="stat-icon">{icon}</div>
        </div>

        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trendType}`}>
            {trend}
          </div>
        )}
      </div>

      <div className="stat-card__content">
        <h3 className="stat-card__title">{title}</h3>
        <h2 className="stat-card__value">{value}</h2>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
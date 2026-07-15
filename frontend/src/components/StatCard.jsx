import { useEffect, useState } from "react";
import "../styles/StatCard.css";

function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendType = "neutral",
  accent = "blue",
  riskLevel = "low",
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericValue = Number(value) || 0;
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * numericValue);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className={`stat-card stat-card--${accent} stat-card--risk-${riskLevel}`}>
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
        <h2 className="stat-card__value">{displayValue}</h2>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
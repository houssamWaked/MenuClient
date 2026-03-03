import './MetricCard.css';

export function MetricCard({ metric }) {
  return (
    <article className="metric-card">
      <strong>{metric.value}</strong>
      <span>{metric.label}</span>
    </article>
  );
}

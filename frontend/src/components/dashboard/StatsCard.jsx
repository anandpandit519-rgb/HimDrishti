export default function StatsCard({
  icon,
  value,
  label,
  variant = "blue",
}) {
  return (
    <div className="stat">

      <div className={`ico ${variant}`}>
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>

    </div>
  );
}
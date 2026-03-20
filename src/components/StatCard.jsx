import React from "react";

export default function StatCard({ id, value, label, variant, style }) {
  return (
    <div
      id={id}
      className={`stat-card stat-card--${variant}`}
      style={style}
    >
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

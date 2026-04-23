import React from "react";

const STATUS_STYLES = {
  paid: "status-badge status-badge--paid",
  pending: "status-badge status-badge--pending",
  draft: "status-badge status-badge--draft",
};

export default function StatusBadge({ status }) {
  const safeStatus = status || "draft";
  return (
    <span className={STATUS_STYLES[safeStatus] || STATUS_STYLES.draft}>
      <span className="status-badge__dot" aria-hidden="true" />
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

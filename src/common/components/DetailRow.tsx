const DetailRow: React.FC<{icon?: React.ReactNode; label: string; value?: React.ReactNode; className?: string }> = ({
  icon,
  label,
  value,
  className = "",
}) => (
  <div className={`rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 ${className}`}>
    <div className="mb-1 flex text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
      {icon && <span className="mr-2">{icon}</span>}{label}
    </div>
    <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">{value || "-"}</div>
  </div>
);


export default DetailRow;
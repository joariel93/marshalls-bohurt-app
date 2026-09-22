export default function MobileListSkeleton({ items = 6 }) {
  return (
    <div className="flex flex-column gap-1 overflow-auto flex-1">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex align-items-center gap-2 p-2 border-round surface-card"
          style={{ border: '1px solid var(--surface-border)', opacity: 0.7 }}
        >
          <div className="border-circle flex-shrink-0 surface-300" style={{ width: '0.75rem', height: '0.75rem' }} />
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="surface-300 border-round mb-1" style={{ width: '60%', height: '0.75rem' }} />
            <div className="surface-300 border-round" style={{ width: '40%', height: '0.6rem' }} />
          </div>
          <div className="border-circle surface-300" style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
      ))}
    </div>
  );
}

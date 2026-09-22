export default function MobileDetailSkeleton() {
  return (
    <div className="page-container" style={{ padding: '0.25rem' }}>
      <div className="p-2 border-round surface-card mb-2" style={{ border: '1px solid var(--surface-border)' }}>
        <div className="flex align-items-center gap-2 mb-2">
          <div className="border-circle surface-300" style={{ width: '2rem', height: '2rem' }} />
          <div className="surface-300 border-round" style={{ width: '60%', height: '1rem' }} />
        </div>
        <div className="surface-300 border-round mb-2" style={{ width: '90%', height: '0.75rem' }} />
        <div className="surface-300 border-round mb-2" style={{ width: '70%', height: '0.75rem' }} />
        <div className="surface-300 border-round" style={{ width: '100%', height: '150px' }} />
      </div>
    </div>
  );
}

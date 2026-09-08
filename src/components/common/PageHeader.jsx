export default function PageHeader({ title, subtitle, onBack }) {
  return (
    <div className="flex align-items-center gap-1 mb-1">
      {onBack && (
        <button
          onClick={onBack}
          className="p-button p-button-text p-button-rounded p-button-sm text-color-secondary flex-shrink-0"
          style={{ minWidth: '2rem', padding: '0.25rem' }}
        >
          <i className="pi pi-arrow-left" style={{ fontSize: '0.85rem' }} />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="page-title m-0 truncate">{title}</h1>
        {subtitle && <p className="page-subtitle m-0 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}

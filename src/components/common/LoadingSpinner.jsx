export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '10rem' }}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />
      <p className="mt-3 text-color-secondary">{text}</p>
    </div>
  );
}

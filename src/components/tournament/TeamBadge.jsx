import { colorTextoParaFondo } from '../../utils/colorUtils';

export default function TeamBadge({ equipo, onClick, selected }) {
  const colorPrincipal = equipo.colores?.[0]?.hex || '#ffffff';
  const colorTexto = colorTextoParaFondo(colorPrincipal);

  return (
    <div
      onClick={onClick}
      className="flex align-items-center gap-2 p-2 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-200"
      style={{
        border: selected ? `2px solid var(--primary-color)` : '2px solid var(--surface-border)',
        background: selected ? 'var(--surface-hover)' : 'var(--surface-card)',
      }}
    >
      <div
        className="flex align-items-center justify-content-center border-circle font-bold flex-shrink-0"
        style={{
          width: '2rem',
          height: '2rem',
          backgroundColor: colorPrincipal,
          color: colorTexto,
          fontSize: '0.8rem',
        }}
      >
        {equipo.nombre?.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-column">
        <span className="font-semibold text-sm">{equipo.nombre}</span>
        <div className="flex gap-1 mt-1">
          {(equipo.colores || []).slice(0, 3).map((c, i) => (
            <div
              key={i}
              className="border-circle border-1 border-white-alpha-30"
              style={{ width: '0.75rem', height: '0.75rem', backgroundColor: c.hex }}
              title={c.nombre}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

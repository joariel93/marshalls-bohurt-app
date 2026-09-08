export default function CombatPreview({ combates, equipos, onConfirm }) {
  const getEquipo = (id) => equipos.find(e => e.id_equipo === id);
  const getName = (id) => {
    if (!id) return 'TBD';
    const eq = getEquipo(id);
    if (eq) return eq.nombre;
    if (id.startsWith('_key_')) return 'Ganador llave anterior';
    return id;
  };

  return (
    <div className="flex flex-column gap-2 flex-1" style={{ minHeight: 0 }}>
      <div className="text-sm font-bold">{combates.length} combate{combates.length !== 1 ? 's' : ''} generado{combates.length !== 1 ? 's' : ''}</div>
      <div className="flex flex-column gap-1 overflow-auto flex-1">
        {combates.map((c, idx) => (
          <div key={idx} className="flex align-items-center gap-2 p-1 border-round text-xs"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
            <span className="font-bold text-color-secondary flex-shrink-0" style={{ width: '1.2rem' }}>#{idx + 1}</span>
            {c.instancia && <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-color-secondary)', fontSize: '0.6rem', minWidth: '3.5rem' }}>{c.instancia}</span>}
            <span className="flex-1 text-right truncate">{c.autoAvance ? 'BYE' : getName(c.idEquipoA)}</span>
            <span className="font-bold text-color-secondary flex-shrink-0">VS</span>
            <span className="flex-1 truncate">{c.autoAvance ? 'BYE' : getName(c.idEquipoB)}</span>
            {c.grupo && <span className="text-xs px-1 border-round flex-shrink-0" style={{ background: 'var(--surface-hover)', fontSize: '0.65rem' }}>{c.grupo}</span>}
          </div>
        ))}
      </div>
      <button className="p-button p-button-success w-full p-button-sm" onClick={onConfirm} style={{ fontSize: '0.85rem' }}>
        <i className="pi pi-check mr-1" />Confirmar y crear combates
      </button>
    </div>
  );
}

export default function CombatResult({
  equipoA,
  equipoB,
  idEquipoGanador,
  scoreA,
  scoreB,
  draws,
  rounds,
  onCerrarCombate,
  onBack,
  closing,
}) {
  const ganador = idEquipoGanador === equipoA?.id ? equipoA : equipoB;
  const esEmpate = !idEquipoGanador;
  const colorA = equipoA?.colores?.[0]?.hex || '#666';
  const colorB = equipoB?.colores?.[0]?.hex || '#666';

  return (
    <div className="flex flex-column align-items-center gap-2 p-2 border-round w-full"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
      <i className="pi pi-trophy text-2xl" style={{ color: 'var(--primary-color)' }} />

      {esEmpate ? (
        <h3 className="m-0 text-center" style={{ color: 'var(--yellow-500)', fontSize: '0.95rem' }}>¡Combate empatado!</h3>
      ) : (
        <>
          <h3 className="m-0 text-center" style={{ color: 'var(--green-400)', fontSize: '0.95rem' }}>
            ¡{ganador?.nombre} gana!
          </h3>
          <div className="border-circle flex-shrink-0" style={{ width: '1rem', height: '1rem', backgroundColor: ganador?.colores?.[0]?.hex }} />
        </>
      )}

      <div className="flex align-items-center gap-3 p-2 border-round w-full" style={{ background: 'var(--surface-section)' }}>
        <div className="text-center flex-1">
          <div className="flex align-items-center justify-content-center gap-1 mb-1">
            <div className="border-circle" style={{ width: '0.5rem', height: '0.5rem', backgroundColor: colorA }} />
            <span className="text-xs text-color-secondary">{equipoA?.nombre}</span>
          </div>
          <div className="text-2xl font-bold">{scoreA}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-color-secondary">Empates</div>
          <div className="text-lg" style={{ color: 'var(--yellow-500)' }}>{draws}</div>
        </div>
        <div className="text-center flex-1">
          <div className="flex align-items-center justify-content-center gap-1 mb-1">
            <div className="border-circle" style={{ width: '0.5rem', height: '0.5rem', backgroundColor: colorB }} />
            <span className="text-xs text-color-secondary">{equipoB?.nombre}</span>
          </div>
          <div className="text-2xl font-bold">{scoreB}</div>
        </div>
      </div>

      <div className="text-xs text-color-secondary text-center w-full" style={{ maxHeight: '3rem', overflow: 'auto' }}>
        {rounds.map((r, i) => (
          <span key={i} className="mr-1">
            R{r.round}: {r.idEquipoGanador === equipoA?.id ? equipoA?.nombre : r.idEquipoGanador === equipoB?.id ? equipoB?.nombre : 'E'}
            {i < rounds.length - 1 ? ' · ' : ''}
          </span>
        ))}
      </div>

      <button className="p-button p-button-success w-full" style={{ padding: '0.4rem', fontSize: '0.85rem' }}
        onClick={onCerrarCombate} disabled={closing}>
        {closing ? <><i className="pi pi-spin pi-spinner mr-1" />Cerrando...</> : <><i className="pi pi-check mr-1" />Cerrar combate</>}
      </button>

      <button className="p-button p-button-text p-button-sm w-full" style={{ fontSize: '0.75rem', padding: '0.2rem' }} onClick={onBack}>
        Volver a la lista
      </button>
    </div>
  );
}

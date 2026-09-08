export default function RoundResult({
  roundNumber,
  equipoA,
  equipoB,
  idEquipoGanador,
  puntosGanador,
  puntosPerdedor,
  scoreA,
  scoreB,
  draws,
  isFinal,
  onNext,
  onClose,
}) {
  const esEmpate = !idEquipoGanador;
  const ganadorNombre = idEquipoGanador === equipoA?.id ? equipoA?.nombre : equipoB?.nombre;

  return (
    <div className="flex flex-column align-items-center gap-2 p-2 border-round w-full"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
      <h4 className="m-0 text-sm">Round {roundNumber}</h4>

      {esEmpate ? (
        <div className="flex align-items-center gap-2">
          <span className="text-sm font-bold">{equipoA?.nombre}</span>
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: 'var(--yellow-500)' }}>EMPATE</div>
            <div className="text-xs text-color-secondary">{puntosGanador}-{puntosPerdedor}</div>
          </div>
          <span className="text-sm font-bold">{equipoB?.nombre}</span>
        </div>
      ) : (
        <>
          <div className="text-sm font-bold" style={{ color: 'var(--green-400)' }}>{ganadorNombre}</div>
          <div className="text-xs text-color-secondary">{puntosGanador}-{puntosPerdedor} pts</div>
        </>
      )}

      <div className="flex align-items-center gap-3 p-2 border-round" style={{ background: 'var(--surface-section)' }}>
        <div className="text-center">
          <div className="text-xs text-color-secondary">{equipoA?.nombre}</div>
          <div className="text-xl font-bold">{scoreA}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-color-secondary">Empates</div>
          <div className="text-base" style={{ color: 'var(--yellow-500)' }}>{draws}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-color-secondary">{equipoB?.nombre}</div>
          <div className="text-xl font-bold">{scoreB}</div>
        </div>
      </div>

      <button className="p-button w-full" style={{ padding: '0.4rem', fontSize: '0.85rem' }} onClick={onNext}>
        <i className={isFinal ? 'pi pi-flag mr-1' : 'pi pi-arrow-right mr-1'} />
        {isFinal ? 'Cerrar combate' : `Siguiente round ${roundNumber < 4 ? `(${roundNumber + 1})` : '(Definitivo)'}`}
      </button>

      {onClose && (
        <button className="p-button p-button-text p-button-sm w-full" style={{ fontSize: '0.75rem', padding: '0.2rem' }}
          onClick={onClose}>Volver a la lista</button>
      )}
    </div>
  );
}

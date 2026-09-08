import { useState, useCallback, useRef } from 'react';
import Shield from './Shield';
import Timer from './Timer';

function TeamShields({ equipo, fighters, onFighterPress, isActive }) {
  const colors = equipo.colores || [];
  const size = 42;

  return (
    <div className="flex flex-column align-items-center gap-1">
      <div className="flex align-items-center gap-1">
        {colors.map((c, i) => (
          <div key={i} className="border-circle border-1 border-white-alpha-30"
            style={{ width: '0.35rem', height: '0.35rem', backgroundColor: c.hex }} />
        ))}
        <span className="font-bold text-xs">{equipo.nombre}</span>
      </div>
      <div className="flex flex-wrap gap-0 justify-content-center">
        {fighters.map(f => (
          <Shield
            key={f.idUsuario}
            number={f.numero_peleador || 0}
            color1={colors[0]?.hex || '#666'}
            color2={colors[1]?.hex || '#888'}
            color3={colors[2]?.hex || '#aaa'}
            size={size}
            down={f.enPie === false}
            yellowCard={f.amonestado}
            redCard={f.expulsado}
            onClick={isActive ? () => onFighterPress(f) : undefined}
            selectable={isActive && f.enPie !== false}
          />
        ))}
      </div>
    </div>
  );
}

export default function RoundArena({
  equipoA,
  equipoB,
  fightersA,
  fightersB,
  isActive,
  timerDuration,
  timerRunning,
  onToggleTimer,
  onFinalizarRound,
  onFighterAction,
}) {
  const [selectedFighter, setSelectedFighter] = useState(null);
  const selectedRef = useRef(null);

  const handleFighterPress = useCallback((fighter) => {
    selectedRef.current = fighter;
    setSelectedFighter(fighter);
  }, []);

  const closeModal = useCallback(() => {
    selectedRef.current = null;
    setSelectedFighter(null);
  }, []);

  const handleBajar = useCallback(() => {
    const fighter = selectedRef.current;
    if (fighter) {
      onFighterAction(fighter, 'bajar');
      closeModal();
    }
  }, [onFighterAction, closeModal]);

  const handleAmarilla = useCallback(() => {
    const fighter = selectedRef.current;
    if (fighter && window.confirm(`¿Amonestar con tarjeta amarilla al peleador #${fighter.numero_peleador}? No podrá participar en el próximo round.`)) {
      onFighterAction(fighter, 'amarilla');
      closeModal();
    }
  }, [onFighterAction, closeModal]);

  const handleDescalificacion = useCallback(() => {
    const fighter = selectedRef.current;
    if (fighter && window.confirm(`¿DESCALIFICAR al peleador #${fighter.numero_peleador}? No podrá participar en el resto del torneo.`)) {
      onFighterAction(fighter, 'descalificacion');
      closeModal();
    }
  }, [onFighterAction, closeModal]);

  return (
    <div className="flex flex-column align-items-center gap-2 w-full">
      <div className="flex align-items-start justify-content-center gap-2 w-full">
        <div className="flex-1">
          <TeamShields
            equipo={equipoA}
            fighters={fightersA}
            onFighterPress={handleFighterPress}
            isActive={isActive}
          />
        </div>

        <div className="flex flex-column align-items-center gap-1" style={{ minWidth: '100px' }}>
          <Timer
            duration={timerDuration}
            running={timerRunning}
            onComplete={() => {
              if (timerRunning) onToggleTimer();
            }}
          />

          <div className="flex gap-2">
            {!isActive ? (
              <button className="p-button p-button-success" onClick={onToggleTimer}>
                <i className="pi pi-play mr-2" />
                Comenzar round
              </button>
            ) : (
              <>
                <button
                  className={`p-button ${timerRunning ? 'p-button-warning' : 'p-button-outlined'}`}
                  onClick={onToggleTimer}
                >
                  {timerRunning ? (
                    <>
                      <i className="pi pi-pause mr-2" />
                      Pausa
                    </>
                  ) : (
                    <>
                      <i className="pi pi-play mr-2" />
                      Reanudar
                    </>
                  )}
                </button>
                <button
                  className="p-button p-button-danger"
                  onClick={onFinalizarRound}
                  disabled={isActive && timerRunning}
                >
                  <i className="pi pi-flag mr-2" />
                  Finalizar round
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          <TeamShields
            equipo={equipoB}
            fighters={fightersB}
            onFighterPress={handleFighterPress}
            isActive={isActive}
          />
        </div>
      </div>

      {selectedFighter && (
        <div
          className="fixed top-0 left-0 w-full h-full z-5 flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={closeModal}
        >
          <div
            className="border-round"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              minWidth: '14rem',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 text-center" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <div className="font-bold text-lg">
                Peleador #{selectedFighter.numero_peleador}
              </div>
            </div>

            <button
              className="w-full flex align-items-center gap-3 p-3 text-left border-none cursor-pointer"
              style={{ background: 'transparent', color: 'var(--text-color)', borderBottom: '1px solid var(--surface-border)' }}
              onClick={handleBajar}
            >
              <i className="pi pi-arrow-down" style={{ color: '#ef4444', fontSize: '1.2rem', width: '1.5rem' }} />
              <span>Bajar</span>
            </button>

            <button
              className="w-full flex align-items-center gap-3 p-3 text-left border-none cursor-pointer"
              style={{ background: 'transparent', color: 'var(--text-color)', borderBottom: '1px solid var(--surface-border)' }}
              onClick={handleAmarilla}
            >
              <div
                className="border-round"
                style={{ width: '1.2rem', height: '1.2rem', background: '#eab308', marginLeft: '0.15rem', marginRight: '0.15rem' }}
              />
              <span>Amarilla</span>
            </button>

            <button
              className="w-full flex align-items-center gap-3 p-3 text-left border-none cursor-pointer"
              style={{ background: 'transparent', color: 'var(--text-color)' }}
              onClick={handleDescalificacion}
            >
              <div
                className="border-round"
                style={{ width: '1.2rem', height: '1.2rem', background: '#ef4444', marginLeft: '0.15rem', marginRight: '0.15rem' }}
              />
              <span>Descalificación</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

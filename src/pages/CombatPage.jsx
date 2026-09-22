import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import PageHeader from '../components/common/PageHeader';
import MobileListSkeleton from '../components/common/skeletons/MobileListSkeleton';

function MiniTeamLine({ equipo }) {
  if (!equipo) return <span className="text-xs text-color-secondary italic">TBD</span>;
  const color = equipo.colores?.[0]?.hex || '#666';
  const isLight = color === '#ffffff';
  return (
    <div className="flex align-items-center gap-1">
      <div className="border-circle flex-shrink-0" style={{ width: '0.6rem', height: '0.6rem', backgroundColor: color }} />
      <span className="text-xs truncate">{equipo.nombre}</span>
    </div>
  );
}

export default function CombatPage() {
  const { torneo, combates, cargarCombates, loading } = useTournament();
  const navigate = useNavigate();
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);

  useEffect(() => {
    if (!torneo) { navigate('/otp', { replace: true }); return; }
    cargarCombates();
  }, [torneo, cargarCombates, navigate]);

  const { pendientes, finalizados } = useMemo(() => {
    const p = combates.filter(c => !c.finalizado);
    const f = combates.filter(c => c.finalizado);
    return { pendientes: p, finalizados: f };
  }, [combates]);

  const combatesVisibles = mostrarFinalizados ? combates : pendientes;

  const handleSelectCombat = (combate) => {
    if (combate.bloqueado) return;
    navigate(`/combat/${combate.id}`);
  };

  if (!torneo || loading) return (
    <div className="page-container" style={{ padding: '0.25rem' }}>
      <PageHeader title="Combates" subtitle="Cargando..." onBack={() => navigate('/home')} />
      <MobileListSkeleton />
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '0.25rem' }}>
      <PageHeader title="Combates" subtitle={torneo.nombre} onBack={() => navigate('/home')} />

      <div className="flex align-items-center justify-content-between mb-1">
        <div className="flex align-items-center gap-1">
          {[
            { v: false, l: 'Pendientes', n: pendientes.length },
            { v: true, l: 'Finalizados', n: finalizados.length },
          ].map(t => (
            <span key={t.l} className={`cursor-pointer text-xs border-round ${mostrarFinalizados === t.v ? 'font-bold' : ''}`}
              style={{
                background: mostrarFinalizados === t.v ? 'var(--primary-color)' : 'transparent',
                padding: '0.15rem 0.5rem',
              }}
              onClick={() => setMostrarFinalizados(t.v)}>
              {t.l} ({t.n})
            </span>
          ))}
        </div>
        <button className="p-button p-button-text p-button-sm" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          onClick={() => navigate('/stats')}>
          <i className="pi pi-chart-bar mr-1" />Estadísticas
        </button>
      </div>

      {combatesVisibles.length === 0 ? (
        <div className="flex flex-column align-items-center justify-content-center flex-1 gap-2">
          {!mostrarFinalizados && finalizados.length > 0 && combates.length > 0 ? (
            <>
              <i className="pi pi-trophy text-3xl" style={{ color: 'var(--primary-color)' }} />
              <p className="text-sm font-bold text-center" style={{ color: 'var(--green-400)' }}>¡Torneo finalizado!</p>
              <p className="text-color-secondary text-xs text-center">Todos los combates fueron completados.</p>
              <div className="flex gap-2">
                <button className="p-button p-button-sm" style={{ fontSize: '0.75rem' }}
                  onClick={() => navigate('/stats')}>
                  <i className="pi pi-chart-bar mr-1" />Estadísticas
                </button>
                <button className="p-button p-button-outlined p-button-sm" style={{ fontSize: '0.75rem' }}
                  onClick={() => setMostrarFinalizados(true)}>
                  Ver combates ({finalizados.length})
                </button>
              </div>
            </>
          ) : (
            <>
              <i className="pi pi-check-circle text-3xl" style={{ color: 'var(--green-400)' }} />
              <p className="text-color-secondary text-xs">
                {mostrarFinalizados ? 'No hay combates finalizados.' : 'No hay combates pendientes.'}
              </p>
              {!mostrarFinalizados && finalizados.length > 0 && (
                <button className="p-button p-button-outlined p-button-sm" style={{ fontSize: '0.75rem' }}
                  onClick={() => setMostrarFinalizados(true)}>
                  Ver finalizados ({finalizados.length})
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-column gap-1 overflow-auto flex-1">
          {combatesVisibles.map(combate => (
            <div key={combate.id} className="flex align-items-center gap-2 p-1 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-200 text-xs"
              style={{
                border: combate.finalizado ? '1px solid var(--green-800)' : combate.bloqueado ? '1px solid var(--orange-800)' : '1px solid var(--surface-border)',
                background: 'var(--surface-card)',
                opacity: combate.bloqueado ? 0.7 : 1,
              }}
              onClick={() => handleSelectCombat(combate)}>
              <span className="font-bold text-color-secondary flex-shrink-0" style={{ width: '1.5rem' }}>#{combate.orden}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-column">
                  {combate.instancia && <span className="text-xs text-color-secondary" style={{ fontSize: '0.55rem' }}>{combate.instancia}</span>}
                  <MiniTeamLine equipo={combate.equipoA} />
                </div>
              </div>
              <span className="text-xs text-color-secondary font-bold flex-shrink-0">VS</span>
              <div className="flex-1 min-w-0">
                {combate.equipoB ? (
                  <MiniTeamLine equipo={combate.equipoB} />
                ) : (
                  <span className="text-xs text-color-secondary italic">Descansa</span>
                )}
              </div>
              {combate.bloqueado ? (
                <span className="flex-shrink-0"><i className="pi pi-lock" style={{ color: 'var(--orange-500)', fontSize: '0.7rem' }} /></span>
              ) : combate.finalizado && combate.resultado ? (
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--green-400)' }}>
                  {combate.resultado.nombreGanador} ({combate.resultado.roundsGanadosGanador}-{combate.resultado.roundsGanadosPerdedor})
                </span>
              ) : (
                <span className="flex-shrink-0"><i className="pi pi-play" style={{ color: 'var(--blue-500)', fontSize: '0.6rem' }} /></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

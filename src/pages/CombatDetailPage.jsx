import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { combatService } from '../services/apiService';
import PageHeader from '../components/common/PageHeader';
import MobileDetailSkeleton from '../components/common/skeletons/MobileDetailSkeleton';
import TimerSetup from '../components/combat/TimerSetup';
import FighterSelector from '../components/combat/FighterSelector';
import RoundArena from '../components/combat/RoundArena';
import RoundResult from '../components/combat/RoundResult';
import CombatResult from '../components/combat/CombatResult';

export default function CombatPage() {
  const { torneo, combates, cargarCombates, loading } = useTournament();
  const navigate = useNavigate();
  const { combatId } = useParams();

  const [phase, setPhase] = useState('timer-setup');
  const [timerDuration, setTimerDuration] = useState(180);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedA, setSelectedA] = useState([]);
  const [selectedB, setSelectedB] = useState([]);
  const [fightersState, setFightersState] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [draws, setDraws] = useState(0);
  const [roundsHistory, setRoundsHistory] = useState([]);
  const [yellows, setYellows] = useState({ teamA: [], teamB: [] });
  const [reds, setReds] = useState({ teamA: [], teamB: [] });
  const [closing, setClosing] = useState(false);
  const [pendingRound5, setPendingRound5] = useState(null);

  useEffect(() => {
    if (!torneo) {
      navigate('/otp', { replace: true });
      return;
    }
    if (combates.length === 0) {
      cargarCombates();
    }
  }, [torneo, combates.length, cargarCombates, navigate]);

  const combate = useMemo(() => {
    if (!combates.length) return null;
    return combates.find(c => c.id === combatId) || null;
  }, [combates, combatId]);

  const teamA = combate?.equipoA || null;
  const teamB = combate?.equipoB || null;

  const fightersA = useMemo(() => {
    if (!teamA) return [];
    return teamA.peleadores || [];
  }, [teamA]);

  const fightersB = useMemo(() => {
    if (!teamB) return [];
    return teamB.peleadores || [];
  }, [teamB]);

  const availableA = useMemo(() => {
    return fightersA.filter(f => !reds.teamA.includes(f.id_usuario) && f.descalificado !== 1);
  }, [fightersA, reds.teamA]);

  const availableB = useMemo(() => {
    return fightersB.filter(f => !reds.teamB.includes(f.id_usuario) && f.descalificado !== 1);
  }, [fightersB, reds.teamB]);

  const maxSelectableThisRound = currentRound === 5 ? 1 : 5;

  const isFifthRound = currentRound === 5;

  const handleToggleFighterA = useCallback((id) => {
    setSelectedA(prev => {
      const fighter = fightersA.find(f => f.id_usuario === id);
      if (!fighter) return prev;
      const isSuspended = yellows.teamA.includes(id) || reds.teamA.includes(id);
      if (isSuspended) return prev;

      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= maxSelectableThisRound) return prev;
      return [...prev, id];
    });
  }, [fightersA, yellows.teamA, reds.teamA, maxSelectableThisRound]);

  const handleToggleFighterB = useCallback((id) => {
    setSelectedB(prev => {
      const fighter = fightersB.find(f => f.id_usuario === id);
      if (!fighter) return prev;
      const isSuspended = yellows.teamB.includes(id) || reds.teamB.includes(id);
      if (isSuspended) return prev;

      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= maxSelectableThisRound) return prev;
      return [...prev, id];
    });
  }, [fightersB, yellows.teamB, reds.teamB, maxSelectableThisRound]);

  const handleIniciarRound = useCallback(() => {
    if (selectedA.length === 0 || selectedB.length === 0) return;

    if (isFifthRound && (selectedA.length !== 1 || selectedB.length !== 1)) return;

    const allSelected = [
      ...selectedA.map(id => {
        const f = fightersA.find(x => x.id_usuario === id);
        return { id_usuario: id, numero_peleador: f?.numero_peleador || 0, equipo: 'A' };
      }),
      ...selectedB.map(id => {
        const f = fightersB.find(x => x.id_usuario === id);
        return { id_usuario: id, numero_peleador: f?.numero_peleador || 0, equipo: 'B' };
      }),
    ];

    const state = allSelected.map(f => ({
      idUsuario: f.id_usuario,
      numero_peleador: f.numero_peleador,
      equipo: f.equipo,
      enPie: true,
      amonestado: false,
      expulsado: false,
    }));

    setFightersState(state);
    setTimerRunning(false);
    setPhase('active');
  }, [selectedA, selectedB, fightersA, fightersB, isFifthRound]);

  const handleTimerToggle = useCallback(() => {
    setTimerRunning(prev => !prev);
  }, []);
  const handleFighterAction = useCallback((fighter, action) => {
    setFightersState(prev => {
      const next = prev.map(f => {
        if (f.idUsuario !== fighter.idUsuario) return f;

        if (f.enPie === false && action === 'bajar') {
          return { ...f, enPie: true, amonestado: false, expulsado: false };
        }

        switch (action) {
          case 'bajar':
            return { ...f, enPie: false, amonestado: false, expulsado: false };
          case 'amarilla':
            return { ...f, enPie: false, amonestado: true, expulsado: false };
          case 'descalificacion':
            return { ...f, enPie: false, amonestado: true, expulsado: true };
          default:
            return f;
        }
      });
      return next;
    });
  }, []);

  const finalizeRound = useCallback((idEquipoGanador, puntosGanador, puntosPerdedor) => {
    const pausedState = [...fightersState];

    const roundData = {
      round: currentRound,
      idEquipoGanador,
      puntosGanador,
      puntosPerdedor,
      peleadores: pausedState.map(f => ({
        idUsuario: f.idUsuario,
        enPie: f.enPie,
        amonestado: f.amonestado,
        expulsado: f.expulsado,
      })),
    };

    setRoundsHistory(prev => [...prev, roundData]);

    if (idEquipoGanador === teamA?.id) {
      setScoreA(prev => prev + 1);
    } else if (idEquipoGanador === teamB?.id) {
      setScoreB(prev => prev + 1);
    } else {
      setDraws(prev => prev + 1);
    }

    const newYellows = { teamA: [], teamB: [] };
    const newReds = { teamA: [...reds.teamA], teamB: [...reds.teamB] };

    pausedState.forEach(f => {
      const teamKey = f.equipo === 'A' ? 'teamA' : 'teamB';
      if (f.expulsado) {
        if (!newReds[teamKey].includes(f.idUsuario)) {
          newReds[teamKey].push(f.idUsuario);
        }
      }
      if (f.amonestado && !f.expulsado) {
        if (!newYellows[teamKey].includes(f.idUsuario)) {
          newYellows[teamKey].push(f.idUsuario);
        }
      }
    });

    setYellows(newYellows);
    setReds(newReds);
    setTimerRunning(false);
    setPhase('result');
  }, [fightersState, currentRound, teamA, teamB, reds]);

  const handleFinalizarRound = useCallback(() => {
    const pausedState = [...fightersState];
    const stateA = pausedState.filter(f => f.equipo === 'A');
    const stateB = pausedState.filter(f => f.equipo === 'B');
    const standingA = stateA.filter(f => f.enPie).length;
    const standingB = stateB.filter(f => f.enPie).length;

    if (standingA > standingB) {
      finalizeRound(teamA?.id, standingA, standingB);
    } else if (standingB > standingA) {
      finalizeRound(teamB?.id, standingB, standingA);
    } else if (isFifthRound) {
      setPendingRound5({ standingA, standingB });
      setTimerRunning(false);
      setPhase('tiebreak');
    } else {
      finalizeRound(null, standingA, standingB);
    }
  }, [fightersState, isFifthRound, teamA, teamB, finalizeRound]);

  const handleElegirGanadorRound5 = useCallback((idEquipo) => {
    if (!pendingRound5) return;
    const { standingA, standingB } = pendingRound5;
    const ganoA = idEquipo === teamA?.id;
    const puntosGanador = ganoA ? standingA : standingB;
    const puntosPerdedor = ganoA ? standingB : standingA;
    setPendingRound5(null);
    finalizeRound(idEquipo, puntosGanador, puntosPerdedor);
  }, [pendingRound5, teamA, finalizeRound]);

  const handleNextRound = useCallback(() => {
    const prevSelected = {
      A: selectedA.filter(id => !yellows.teamA.includes(id) && !reds.teamA.includes(id)),
      B: selectedB.filter(id => !yellows.teamB.includes(id) && !reds.teamB.includes(id)),
    };

    setSelectedA(prevSelected.A);
    setSelectedB(prevSelected.B);
    setCurrentRound(prev => prev + 1);
    setFightersState([]);
    setPhase('selection');
  }, [yellows, reds, selectedA, selectedB]);

  const handleCerrarCombate = useCallback(async () => {
    if (!combate) return;
    setClosing(true);

    const lastRound = roundsHistory[roundsHistory.length - 1];
    let idEquipoGanador = lastRound?.idEquipoGanador;
    if (scoreA >= 2) idEquipoGanador = teamA?.id;
    else if (scoreB >= 2) idEquipoGanador = teamB?.id;

    if (!idEquipoGanador) {
      alert('No se pudo determinar un ganador del combate.');
      setClosing(false);
      return;
    }

    try {
      const allRounds = [...roundsHistory];
      for (const rd of allRounds) {
        if (!combate.finalizado) {
          await combatService.grabarRound(torneo.id, combate.id, {
            orden: combate.orden,
            round: rd.round,
            idEquipoGanador: rd.idEquipoGanador,
            puntosGanador: rd.puntosGanador,
            puntosPerdedor: rd.puntosPerdedor,
            peleadores: rd.peleadores,
          });
        }
      }

      if (!combate.finalizado) {
        await combatService.cerrarCombate(torneo.id, combate.id, idEquipoGanador);
      }

      setPhase('closed');
    } catch (err) {
      alert(err.message || 'Error al cerrar combate');
    } finally {
      setClosing(false);
    }
  }, [combate, roundsHistory, scoreA, scoreB, torneo, teamA, teamB]);

  const handleBackToList = useCallback(() => {
    navigate('/combat');
  }, [navigate]);

  if (!torneo || loading) return <MobileDetailSkeleton />;

  if (!combate) {
    return (
      <div className="page-container">
        <PageHeader title="Combate" onBack={() => navigate('/combat')} />
        <div className="flex flex-column align-items-center justify-content-center flex-1 gap-3">
          <p className="text-color-secondary">Combate no encontrado.</p>
          <button className="p-button" onClick={() => navigate('/combat')}>
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (combate.bloqueado) {
    return (
      <div className="page-container">
        <PageHeader
          title={`Combate #${combate.orden}`}
          subtitle={`${combate.equipoA?.nombre || 'TBD'} vs ${combate.equipoB?.nombre || 'TBD'}`}
          onBack={handleBackToList}
        />
        <div className="flex flex-column align-items-center justify-content-center flex-1 gap-3">
          <i className="pi pi-lock text-4xl" style={{ color: 'var(--orange-400)' }} />
          <p className="text-color-secondary text-center">
            Este combate está bloqueado hasta que se complete el resultado del combate anterior.
          </p>
          <button className="p-button" onClick={handleBackToList}>
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!teamB) {
    return (
      <div className="page-container">
        <PageHeader
          title={`Combate #${combate.orden}`}
          subtitle={teamA?.nombre}
          onBack={handleBackToList}
        />
        <div className="flex flex-column align-items-center justify-content-center flex-1 gap-3">
          <i className="pi pi-clock text-4xl" style={{ color: 'var(--blue-400)' }} />
          <p className="text-color-secondary text-center">
            <strong>{teamA?.nombre}</strong> descansa esta ronda y avanza automáticamente.
          </p>
          <button className="p-button" onClick={handleBackToList}>
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (combate.finalizado) {
    const ganoA = combate.resultado?.idEquipoGanador === teamA?.id;
    const roundsGanadosGanador = combate.resultado?.roundsGanadosGanador || 0;
    const roundsGanadosPerdedor = combate.resultado?.roundsGanadosPerdedor || 0;
    const rounds = combate.resultado?.rounds || [];
    const empates = rounds.filter(r => r.idEquipoGanador !== teamA?.id && r.idEquipoGanador !== teamB?.id).length;

    return (
      <div className="page-container">
        <PageHeader
          title={`Combate #${combate.orden}`}
          subtitle={`${teamA?.nombre} vs ${teamB?.nombre}`}
          onBack={handleBackToList}
        />
        <CombatResult
          equipoA={teamA}
          equipoB={teamB}
          idEquipoGanador={combate.resultado?.idEquipoGanador}
          scoreA={ganoA ? roundsGanadosGanador : roundsGanadosPerdedor}
          scoreB={ganoA ? roundsGanadosPerdedor : roundsGanadosGanador}
          draws={empates}
          rounds={rounds}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  const fightersInArenaA = fightersState.filter(f => f.equipo === 'A');
  const fightersInArenaB = fightersState.filter(f => f.equipo === 'B');

  return (
    <div className="page-container" style={{ maxWidth: '600px', padding: '0.5rem' }}>
      <PageHeader
        title={`Combate #${combate.orden}`}
        subtitle={`${teamA?.nombre || 'TBD'} vs ${teamB?.nombre || 'TBD'}${combate.instancia ? ' · ' + combate.instancia : ''}`}
        onBack={phase === 'timer-setup' ? handleBackToList : undefined}
      />

      {phase === 'timer-setup' && (
        <div className="flex-1 flex align-items-center justify-content-center">
          <TimerSetup
            value={timerDuration}
            onChange={setTimerDuration}
            onConfirm={() => setPhase('selection')}
          />
        </div>
      )}

      {phase === 'selection' && (
        <div className="flex flex-column gap-1 flex-1" style={{ minHeight: 0 }}>
          <div className="text-center">
            <span className="text-xs text-color-secondary">
              {isFifthRound ? 'Round 5 - Pelea de campeones (1 vs 1)' : `Round ${currentRound}`}
            </span>
            {isFifthRound && (
              <span className="text-xs ml-1" style={{ color: 'var(--yellow-500)' }}>Seleccioná 1 por equipo</span>
            )}
          </div>

          <FighterSelector
            equipoA={teamA}
            equipoB={teamB}
            fightersA={availableA}
            fightersB={availableB}
            selectedA={selectedA}
            selectedB={selectedB}
            onToggleA={handleToggleFighterA}
            onToggleB={handleToggleFighterB}
            maxSelectable={maxSelectableThisRound}
            suspendedA={yellows.teamA}
            suspendedB={yellows.teamB}
            expelledA={reds.teamA}
            expelledB={reds.teamB}
            onIniciar={handleIniciarRound}
          />
        </div>
      )}

      {phase === 'active' && (
        <div className="flex-1 flex flex-column" style={{ minHeight: 0 }}>
          <div className="text-center mb-1">
            <span className="text-xs text-color-secondary">
              {isFifthRound ? 'Pelea de campeones' : `Round ${currentRound}`}
            </span>
          </div>

          <RoundArena
            equipoA={teamA}
            equipoB={teamB}
            fightersA={fightersInArenaA}
            fightersB={fightersInArenaB}
            isActive={true}
            timerDuration={timerDuration}
            timerRunning={timerRunning}
            onToggleTimer={handleTimerToggle}
            onFinalizarRound={handleFinalizarRound}
            onFighterAction={handleFighterAction}
          />
        </div>
      )}

      {phase === 'tiebreak' && (
        <div className="flex-1 flex align-items-center justify-content-center">
          <div className="flex flex-column align-items-center gap-3 p-4 border-round w-full"
            style={{ maxWidth: '360px', background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
            <h4 className="m-0 text-sm">Round 5 - Definir ganador</h4>
            <p className="text-color-secondary text-xs text-center m-0">
              No hay un último en pie. Seleccioná el equipo ganador del combate.
            </p>
            <div className="flex flex-column gap-2 w-full">
              <button className="p-button w-full" onClick={() => handleElegirGanadorRound5(teamA?.id)}>
                <i className="pi pi-check mr-1" /> Gana {teamA?.nombre}
              </button>
              <button className="p-button w-full" onClick={() => handleElegirGanadorRound5(teamB?.id)}>
                <i className="pi pi-check mr-1" /> Gana {teamB?.nombre}
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="flex-1 flex align-items-center justify-content-center">
          <RoundResult
            roundNumber={currentRound}
            equipoA={teamA}
            equipoB={teamB}
            idEquipoGanador={roundsHistory[roundsHistory.length - 1]?.idEquipoGanador}
            puntosGanador={roundsHistory[roundsHistory.length - 1]?.puntosGanador || 0}
            puntosPerdedor={roundsHistory[roundsHistory.length - 1]?.puntosPerdedor || 0}
            scoreA={scoreA}
            scoreB={scoreB}
            draws={draws}
            isFinal={scoreA >= 2 || scoreB >= 2 || currentRound >= 5}
            onNext={scoreA >= 2 || scoreB >= 2 || currentRound >= 5 ? handleCerrarCombate : handleNextRound}
            onClose={handleBackToList}
          />
        </div>
      )}

      {phase === 'closed' && (
        <div className="flex-1 flex align-items-center justify-content-center">
          <CombatResult
            equipoA={teamA}
            equipoB={teamB}
            idEquipoGanador={scoreA >= 2 ? teamA?.id : scoreB >= 2 ? teamB?.id : null}
            scoreA={scoreA}
            scoreB={scoreB}
            draws={draws}
            rounds={roundsHistory}
            onBack={handleBackToList}
          />
        </div>
      )}
    </div>
  );
}

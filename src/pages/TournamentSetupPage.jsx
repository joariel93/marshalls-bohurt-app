import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { tournamentService } from '../services/apiService';
import { generarLiga, generarEliminatoriaDirecta, generarGruposYEliminatoria } from '../utils/combatGenerator';
import { getEquiposAsignadosPorGrupo } from '../utils/groupUtils';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GroupEditor from '../components/tournament/GroupEditor';
import BracketEditor from '../components/tournament/BracketEditor';
import CombatPreview from '../components/tournament/CombatPreview';

export default function TournamentSetupPage() {
  const { torneo, equipos, setEquipos, cargarCombates } = useTournament();
  const navigate = useNavigate();
  const [tipoOrganizacion, setTipoOrganizacion] = useState(null);
  const [gruposData, setGruposData] = useState(null);
  const [combatesGenerados, setCombatesGenerados] = useState(null);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!torneo) navigate('/otp', { replace: true }); }, [torneo, navigate]);

  const handleToggleSemilla = async (eq, val) => {
    try {
      await tournamentService.setCabezaSerie(torneo.id, eq.id_equipo, val);
      setEquipos((prev) => prev.map((e) => (e.id_equipo === eq.id_equipo ? { ...e, es_cabeza_serie: val } : e)));
    } catch (err) {
      setError(err.message || 'Error al actualizar cabeza de serie');
    }
  };

  const handleSeleccionarTipo = (tipo) => {
    setTipoOrganizacion(tipo); setCombatesGenerados(null); setGruposData(null); setError('');
    if (tipo === 'liga') setCombatesGenerados(generarLiga(equipos));
  };

  const handleGenerarEliminatoria = (orden) => {
    const r = generarEliminatoriaDirecta(orden, true, true);
    setCombatesGenerados(r.combates);
  };

  const handleGuardarGrupos = (grupos) => {
    setGruposData(grupos);
    setCombatesGenerados(generarGruposYEliminatoria(getEquiposAsignadosPorGrupo(grupos)));
  };

  const handleConfirmarCombates = async () => {
    if (!combatesGenerados || combatesGenerados.length === 0) { setError('No hay combates para crear'); return; }
    setCreando(true); setError('');
    try {
      await tournamentService.eliminarCombates(torneo.id);
      if (gruposData) await tournamentService.guardarGrupos(torneo.id, gruposData.flatMap(g => g.equipos.map(e => ({ id_equipo: e.id_equipo, grupo: g.numero }))));
      await tournamentService.crearCombates(torneo.id, combatesGenerados);
      await cargarCombates();
      navigate('/combat', { replace: true });
    } catch (err) { setError(err.message || 'Error al crear combates'); } finally { setCreando(false); }
  };

  const handleVolver = () => {
    setCombatesGenerados(null);
    if (tipoOrganizacion !== 'eliminatoria') setTipoOrganizacion(null);
  };

  if (!torneo) return <LoadingSpinner />;

  const porClub = {};
  equipos.forEach((e) => {
    const c = e.club || 'Sin club';
    (porClub[c] = porClub[c] || []).push(e);
  });

  return (
    <div className="page-container" style={{ padding: '0.25rem' }}>
      <PageHeader title="Organizar torneo" subtitle={torneo.nombre} onBack={() => navigate('/fighters')} />

      {error && <div className="p-2 mb-1 border-round text-xs" style={{ background: 'var(--red-900)', color: 'var(--red-200)' }}>{error}</div>}

      {!tipoOrganizacion ? (
        <div className="flex flex-column gap-2 flex-1 overflow-auto">
          <div className="p-2 border-round" style={{ border: '1px solid var(--surface-border)', background: 'var(--surface-card)' }}>
            <div className="flex align-items-center justify-content-between mb-1">
              <span className="text-xs font-bold">Equipos inscriptos</span>
              <span className="text-xs text-color-secondary">Tocá para marcar cabeza de serie</span>
            </div>
            {Object.entries(porClub).map(([club, eqs]) => (
              <div key={club} className="mb-1">
                <div className="text-xs text-color-secondary mb-0">{club}</div>
                {eqs.map((e) => (
                  <div key={e.id_equipo} className="flex align-items-center gap-2 p-1">
                    <div className="border-circle flex-shrink-0" style={{ width: '0.5rem', height: '0.5rem', backgroundColor: e.colores?.[0]?.hex || '#666' }} />
                    <span className="text-xs flex-1 truncate">{e.nombre}</span>
                    <span
                      onClick={() => handleToggleSemilla(e, !e.es_cabeza_serie)}
                      className="text-xs px-1 py-0 border-round cursor-pointer"
                      style={{
                        background: e.es_cabeza_serie ? 'var(--yellow-500)' : 'var(--surface-hover)',
                        color: e.es_cabeza_serie ? '#000' : 'var(--text-color-secondary)',
                        fontWeight: e.es_cabeza_serie ? 'bold' : 'normal',
                      }}
                    >
                      {e.es_cabeza_serie ? '★ Cabeza de serie' : 'Cabeza de serie'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="text-xs text-color-secondary mb-0">Tipo de organización:</p>
          {[
            { id: 'liga', icon: 'pi-sync', title: 'Liga', desc: 'Todos contra todos' },
            { id: 'eliminatoria', icon: 'pi-arrow-right', title: 'Eliminatoria', desc: 'Eliminación directa' },
            { id: 'grupos', icon: 'pi-th-large', title: 'Grupos + Eliminatoria', desc: 'Fase de grupos más bracket' },
          ].map((tp) => (
            <div key={tp.id} className="flex align-items-center gap-2 p-2 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-200"
              style={{ border: '1px solid var(--surface-border)', background: 'var(--surface-card)' }}
              onClick={() => handleSeleccionarTipo(tp.id)}>
              <i className={`pi ${tp.icon}`} style={{ color: 'var(--primary-color)', fontSize: '1rem', width: '1.5rem', textAlign: 'center' }} />
              <div>
                <div className="text-sm font-bold">{tp.title}</div>
                <div className="text-xs text-color-secondary">{tp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ) : tipoOrganizacion === 'eliminatoria' && !combatesGenerados ? (
        <BracketEditor torneoId={torneo.id} equipos={equipos} onConfirm={handleGenerarEliminatoria} onBack={() => setTipoOrganizacion(null)} />
      ) : tipoOrganizacion === 'grupos' && !gruposData ? (
        <GroupEditor equipos={equipos} onSave={handleGuardarGrupos} onBack={() => setTipoOrganizacion(null)} />
      ) : combatesGenerados ? (
        <CombatPreview combates={combatesGenerados} equipos={equipos} onConfirm={handleConfirmarCombates} />
      ) : <LoadingSpinner />}

      {creando && (
        <div className="fixed top-0 left-0 w-full h-full flex align-items-center justify-content-center z-5" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <LoadingSpinner text="Creando combates..." />
        </div>
      )}

      {combatesGenerados && tipoOrganizacion !== 'grupos' && (
        <button className="p-button p-button-outlined p-button-sm w-full mt-1" style={{ fontSize: '0.8rem' }} onClick={handleVolver}>
          Volver
        </button>
      )}
    </div>
  );
}

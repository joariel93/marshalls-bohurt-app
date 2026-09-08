import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { tournamentService } from '../services/apiService';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { esColorClaro } from '../utils/colorUtils';

function AddFighterModal({ onClose, onAdd, idTorneo, idEquipo, equiposEnTorneo }) {
  const [dni, setDni] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nombre: '', apellido: '', dni: '' });
  const [creando, setCreando] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);

  const handleBuscar = async () => {
    if (!dni || dni.length < 6) { setError('Ingresá un DNI válido'); return; }
    setError(''); setBuscando(true); setResultado(null);
    try {
      const user = await tournamentService.buscarUsuarioPorDni(dni);
      if (user) {
        const yaEnOtroEquipo = equiposEnTorneo.some(eq =>
          eq.id_equipo !== idEquipo && eq.peleadores?.some(p => p.id_usuario === user.idUsuario)
        );
        if (yaEnOtroEquipo) {
          const otro = equiposEnTorneo.find(eq => eq.id_equipo !== idEquipo && eq.peleadores?.some(p => p.id_usuario === user.idUsuario));
          setError(`Ya inscripto en "${otro?.nombre}". Dar de baja primero.`);
          setResultado({ ...user, bloqueado: true });
        } else {
          setResultado(user);
        }
      } else {
        setModoCreacion(true);
        setFormData(prev => ({ ...prev, dni }));
      }
    } catch (err) { setError(err.message || 'Error al buscar'); }
    finally { setBuscando(false); }
  };

  const handleCrear = async () => {
    if (!formData.nombre || !formData.apellido || !formData.dni) { setError('Completá todos los campos'); return; }
    setCreando(true); setError('');
    try {
      const nuevo = await tournamentService.crearUsuarioRapido(formData);
      await tournamentService.inscribirPeleador(idTorneo, idEquipo, nuevo.id_usuario);
      onAdd({ ...nuevo, numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 });
      onClose();
    } catch (err) { setError(err.message); }
    finally { setCreando(false); }
  };

  const handleSeleccionar = async () => {
    if (!resultado || resultado.bloqueado) return;
    try {
      await tournamentService.inscribirPeleador(idTorneo, idEquipo, resultado.idUsuario);
      onAdd({ ...resultado, id_usuario: resultado.idUsuario, numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 });
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-5 flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="border-round w-11" style={{ maxWidth: '360px', background: 'var(--surface-card)', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="flex align-items-center justify-content-between p-3" style={{ borderBottom: '1px solid var(--surface-border)' }}>
          <h3 className="m-0 text-base">{modoCreacion ? 'Nuevo peleador' : 'Agregar peleador'}</h3>
          <button className="p-button p-button-text p-button-sm" onClick={onClose}><i className="pi pi-times" /></button>
        </div>
        <div className="p-3">
          {error && <div className="p-2 mb-2 border-round text-xs" style={{ background: 'var(--red-900)', color: 'var(--red-200)' }}>{error}</div>}
          {!modoCreacion ? (
            <>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Buscar por DNI..." value={dni} onChange={e => setDni(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                  className="flex-1" style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-section)', color: 'var(--text-color)', fontSize: '0.85rem' }} />
                <button className="p-button p-button-sm" onClick={handleBuscar} disabled={buscando || !dni}>
                  {buscando ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-search" />}
                </button>
              </div>
              {resultado && !resultado.bloqueado && (
                <div className="flex align-items-center gap-2 p-2 border-round cursor-pointer hover:surface-hover"
                  style={{ border: '1px solid var(--surface-border)' }} onClick={handleSeleccionar}>
                  <i className="pi pi-user" style={{ color: 'var(--primary-color)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{resultado.nombre} {resultado.apellido}</div>
                    <div className="text-xs text-color-secondary">DNI: {resultado.dni}</div>
                  </div>
                  <span className="text-xs text-color-secondary">Seleccionar</span>
                </div>
              )}
              <p className="text-center text-xs text-color-secondary mt-2 mb-0">
                ¿No está? <button className="p-button p-button-link p-0 text-xs" onClick={() => setModoCreacion(true)}>Crear nuevo</button>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-column gap-2 mb-2">
                {['nombre', 'apellido', 'dni'].map(f => (
                  <input key={f} type="text" placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={formData[f]}
                    onChange={e => setFormData(prev => ({ ...prev, [f]: e.target.value }))}
                    className="w-full" style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-section)', color: 'var(--text-color)', fontSize: '0.85rem' }} />
                ))}
              </div>
              <div className="flex gap-2">
                <button className="p-button p-button-outlined p-button-sm flex-1" onClick={() => setModoCreacion(false)}>Volver</button>
                <button className="p-button p-button-sm flex-1" onClick={handleCrear} disabled={creando}>
                  {creando ? <><i className="pi pi-spin pi-spinner mr-1" />Creando...</> : 'Crear'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FighterNumberPage() {
  const { torneo, equipos, setEquipos, cargarEquiposConPeleadores, loading } = useTournament();
  const navigate = useNavigate();
  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoalicionModal, setShowCoalicionModal] = useState(false);
  const [coalicionNombre, setCoalicionNombre] = useState('');
  const [errores, setErrores] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!torneo) navigate('/otp', { replace: true }); }, [torneo, navigate]);
  useEffect(() => { if (torneo && equipos.length === 0) cargarEquiposConPeleadores();   }, [torneo, equipos.length, cargarEquiposConPeleadores]);

  const handleRemoveTeam = async (idx) => {
    const eq = equipos[idx];
    if (!eq || !confirm(`¿Eliminar a "${eq.nombre}" del torneo? Se perderán todos sus peleadores inscriptos.`)) return;
    try {
      await tournamentService.eliminarEquipo(torneo.id, eq.id_equipo);
      const newEquipos = [...equipos];
      newEquipos.splice(idx, 1);
      setEquipos(newEquipos);
      if (selectedTeamIdx >= newEquipos.length) setSelectedTeamIdx(Math.max(0, newEquipos.length - 1));
    } catch (err) { alert(err.message); }
  };

  const handleCreateCoalicion = async () => {
    if (!coalicionNombre.trim()) return;
    try {
      const nuevo = await tournamentService.crearEquipoCoalicion(torneo.id, coalicionNombre.trim());
      setEquipos(prev => [...prev, { id_equipo: nuevo.id_equipo, nombre: nuevo.nombre, logo: null, colores: [{ hex: '#000000' }, { hex: '#ffffff' }], peleadores: [] }]);
      setCoalicionNombre('');
      setShowCoalicionModal(false);
    } catch (err) { alert(err.message); }
  };

  const getErroresEquipo = useCallback((equipo) => {
    const numeros = (equipo.peleadores || []).filter(p => p.numero_peleador > 0).map(p => p.numero_peleador);
    const duplicados = numeros.filter((n, i) => numeros.indexOf(n) !== i);
    return { duplicados: [...new Set(duplicados)], sinNumero: (equipo.peleadores || []).filter(p => p.numero_peleador === 0).length > 0, tieneErrores: duplicados.length > 0 || (equipo.peleadores || []).filter(p => p.numero_peleador === 0).length > 0 };
  }, []);

  const duplicadosEntreEquipos = useCallback(() => {
    const dniMap = {};
    equipos.forEach(eq => { (eq.peleadores || []).forEach(p => { if (p.dni) { if (!dniMap[p.dni]) dniMap[p.dni] = []; dniMap[p.dni].push(eq.nombre); } }); });
    return Object.entries(dniMap).filter(([, nombres]) => nombres.length > 1).map(([dni, nombres]) => ({ dni, equipos: [...new Set(nombres)] }));
  }, [equipos]);

  const handleChangeNumero = (equipoIdx, idUsuario, numero) => {
    const newEquipos = [...equipos];
    const peleador = newEquipos[equipoIdx].peleadores.find(p => p.id_usuario === idUsuario);
    if (peleador) peleador.numero_peleador = numero;
    setEquipos(newEquipos); setErrores({});
  };

  const handleRemoveFighter = async (equipoIdx, idUsuario) => {
    if (!confirm('¿Eliminar este peleador del equipo?')) return;
    try {
      await tournamentService.eliminarPeleador(torneo.id, equipos[equipoIdx].id_equipo, idUsuario);
      const newEquipos = [...equipos];
      newEquipos[equipoIdx] = { ...newEquipos[equipoIdx], peleadores: newEquipos[equipoIdx].peleadores.filter(p => p.id_usuario !== idUsuario) };
      setEquipos(newEquipos);
    } catch (err) { alert(err.message); }
  };

  const handleAddFighter = (nuevoPeleador) => {
    const newEquipos = [...equipos];
    const equipo = { ...newEquipos[selectedTeamIdx] };
    equipo.peleadores = [...(equipo.peleadores || []), nuevoPeleador];
    newEquipos[selectedTeamIdx] = equipo;
    setEquipos(newEquipos);
  };

  const handleSaveAndContinue = async () => {
    const newErrores = {};
    let hayErrores = false;
    equipos.forEach((eq, idx) => { const err = getErroresEquipo(eq); if (err.tieneErrores) { newErrores[idx] = err; hayErrores = true; } });
    const dup = duplicadosEntreEquipos();
    if (dup.length > 0) hayErrores = true;
    if (hayErrores) { setErrores(newErrores); return; }
    setSaving(true);
    try {
      const numeros = equipos.flatMap(eq => (eq.peleadores || []).map(p => ({ idEquipo: eq.id_equipo, idUsuario: p.id_usuario, numeroPeleador: p.numero_peleador })));
      await tournamentService.guardarNumerosPeleadores(torneo.id, numeros);
      navigate('/tournament-setup', { replace: true });
    } catch (err) { alert(err.message); } finally { setSaving(false); }
  };

  if (!torneo || loading) return <LoadingSpinner />;

  const equipoActual = equipos[selectedTeamIdx];
  const dupEntre = duplicadosEntreEquipos();

  const todosCompletos = equipos.length > 0 && equipos.every(eq => (eq.peleadores || []).length > 0 && (eq.peleadores || []).every(p => p.numero_peleador > 0));

  return (
    <div className="page-container" style={{ padding: '0.25rem', maxWidth: '100%' }}>
      <PageHeader title="Asignar peleadores" subtitle={torneo.nombre} onBack={() => navigate('/home')} />

      {dupEntre.length > 0 && (
        <div className="p-2 mb-1 border-round text-xs" style={{ background: 'var(--red-900)', color: 'var(--red-200)' }}>
          <strong>Peleadores duplicados:</strong> {dupEntre.map(d => `DNI ${d.dni} en ${d.equipos.join(', ')}`).join(' · ')}
        </div>
      )}

      <div className="flex gap-1 flex-1" style={{ minHeight: 0 }}>
        <div className="flex flex-column gap-1 overflow-auto" style={{ width: '5rem', flexShrink: 0 }}>
          {equipos.map((eq, idx) => {
            const err = errores[idx];
            const color = eq.colores?.[0]?.hex || '#666';
            const isLight = esColorClaro(color);
            return (
              <button key={eq.id_equipo} onClick={() => setSelectedTeamIdx(idx)}
                className="flex align-items-center gap-1 p-1 border-round cursor-pointer transition-colors transition-duration-200 border-none text-left relative"
                style={{
                  border: selectedTeamIdx === idx ? '2px solid var(--primary-color)' : '2px solid transparent',
                  background: selectedTeamIdx === idx ? 'var(--surface-hover)' : 'var(--surface-card)',
                  color: 'var(--text-color)',
                }}>
                <div className="border-circle flex align-items-center justify-content-center flex-shrink-0 font-bold text-xs"
                  style={{ width: '1.5rem', height: '1.5rem', backgroundColor: color, color: isLight ? '#000' : '#fff' }}>
                  {eq.nombre?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs truncate">{eq.nombre}</div>
                  <div className="text-xs text-color-secondary">{eq.peleadores?.length || 0}P</div>
                </div>
                {err && <i className="pi pi-exclamation-triangle flex-shrink-0" style={{ color: 'var(--yellow-500)', fontSize: '0.6rem' }} />}
                <i className="pi pi-trash flex-shrink-0 cursor-pointer"
                  style={{ fontSize: '0.55rem', color: 'var(--red-500)', opacity: 0.6, padding: '0.15rem' }}
                  onClick={e => { e.stopPropagation(); handleRemoveTeam(idx); }} />
              </button>
            );
          })}
          <button
            className="flex align-items-center justify-content-center gap-1 p-1 border-round cursor-pointer border-none"
            style={{ border: '1px dashed var(--surface-border)', background: 'transparent', color: 'var(--text-color-secondary)', fontSize: '0.65rem' }}
            onClick={() => { setCoalicionNombre(''); setShowCoalicionModal(true); }}>
            <i className="pi pi-plus" style={{ fontSize: '0.55rem' }} />Equipo
          </button>
        </div>

        {equipoActual && (
          <div className="flex flex-column flex-1 min-w-0 overflow-auto">
            <div className="flex align-items-center justify-content-between mb-1">
              <div className="flex align-items-center gap-1">
                {equipoActual.colores?.map((c, i) => (
                  <div key={i} className="border-circle border-1 border-white-alpha-30" style={{ width: '0.5rem', height: '0.5rem', backgroundColor: c.hex }} />
                ))}
                <span className="font-bold text-sm">{equipoActual.nombre}</span>
              </div>
              <button className="p-button p-button-outlined p-button-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setShowAddModal(true)}>
                <i className="pi pi-plus mr-1" style={{ fontSize: '0.6rem' }} />Agregar
              </button>
            </div>

            {errores[selectedTeamIdx] && (
              <div className="p-1 mb-1 border-round text-xs" style={{ background: 'var(--yellow-900)', color: 'var(--yellow-200)' }}>
                {errores[selectedTeamIdx].sinNumero && 'Faltan números · '}
                {errores[selectedTeamIdx].duplicados.length > 0 && `Duplicados: ${errores[selectedTeamIdx].duplicados.join(',')}`}
              </div>
            )}

            <div className="flex flex-column gap-1 flex-1 overflow-auto">
              {(equipoActual.peleadores || []).length === 0 ? (
                <p className="text-color-secondary text-xs text-center p-2">Sin peleadores</p>
              ) : (
                (equipoActual.peleadores || []).map(fighter => (
                  <div key={fighter.id_usuario} className="flex align-items-center gap-1 p-1 border-round"
                    style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
                    <input type="number" min="0" value={fighter.numero_peleador || ''}
                      onChange={e => handleChangeNumero(selectedTeamIdx, fighter.id_usuario, e.target.value === '' ? 0 : Number(e.target.value))}
                      className="text-center font-bold flex-shrink-0"
                      style={{ width: '2.25rem', height: '2rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-section)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                      placeholder="-" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">{fighter.nombre} {fighter.apellido}</div>
                      {fighter.dni && <div className="text-xs text-color-secondary">DNI {fighter.dni}</div>}
                    </div>
                    {fighter.cantidad_amarillas > 0 && <span className="text-xs font-bold px-1 border-round" style={{ background: '#eab308', color: '#000' }}>{fighter.cantidad_amarillas}A</span>}
                    {fighter.descalificado === 1 && <span className="text-xs font-bold px-1 border-round" style={{ background: '#ef4444', color: '#fff' }}>EXP</span>}
                    <button className="p-button p-button-text p-button-sm p-button-danger flex-shrink-0" style={{ padding: '0.15rem', minWidth: '1.5rem' }}
                      onClick={() => handleRemoveFighter(selectedTeamIdx, fighter.id_usuario)}>
                      <i className="pi pi-times" style={{ fontSize: '0.7rem' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button className="p-button p-button-success w-full mt-1" style={{ padding: '0.5rem', fontSize: '0.85rem' }}
        onClick={handleSaveAndContinue} disabled={!todosCompletos || saving}>
        {saving ? <><i className="pi pi-spin pi-spinner mr-1" />Guardando...</> : <><i className="pi pi-check mr-1" />Confirmar y continuar</>}
      </button>

      {showAddModal && equipoActual && (
        <AddFighterModal onClose={() => setShowAddModal(false)} onAdd={handleAddFighter}
          idTorneo={torneo.id} idEquipo={equipoActual.id_equipo} equiposEnTorneo={equipos} />
      )}

      {showCoalicionModal && (
        <div className="fixed top-0 left-0 w-full h-full z-5 flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => { if (e.target === e.currentTarget) setShowCoalicionModal(false); }}>
          <div className="border-round w-11" style={{ maxWidth: '320px', background: 'var(--surface-card)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex align-items-center justify-content-between p-3" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <h3 className="m-0 text-base">Equipo coalición</h3>
              <button className="p-button p-button-text p-button-sm" onClick={() => setShowCoalicionModal(false)}><i className="pi pi-times" /></button>
            </div>
            <div className="p-3 flex flex-column gap-3">
              <div>
                <label className="text-xs font-semibold">Nombre del equipo</label>
                <input type="text" value={coalicionNombre} onChange={e => setCoalicionNombre(e.target.value)}
                  className="w-full mt-1" placeholder="Ej: Coalición A"
                  style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-section)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleCreateCoalicion()} />
              </div>
              <div className="text-xs text-color-secondary">
                Colores: <span className="mx-1 border-round" style={{ display: 'inline-block', width: '0.65rem', height: '0.65rem', background: '#000', verticalAlign: 'middle' }} /> Negro
                · <span className="mx-1 border-round" style={{ display: 'inline-block', width: '0.65rem', height: '0.65rem', background: '#fff', border: '1px solid #666', verticalAlign: 'middle' }} /> Blanco
                · Fecha: {torneo.fechaTorneo || 'hoy'}
              </div>
              <button className="p-button w-full" onClick={handleCreateCoalicion} disabled={!coalicionNombre.trim()}>
                <i className="pi pi-plus mr-1" />Crear equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

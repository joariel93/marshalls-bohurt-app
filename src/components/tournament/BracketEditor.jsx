import { useState } from 'react';
import { tournamentService } from '../../services/apiService';

function TeamChip({ equipo, onDragStart, onDrop }) {
  if (!equipo) return null;
  const color = equipo.colores?.[0]?.hex || '#666';
  return (
    <div
      draggable
      onDragStart={() => onDragStart(equipo.id_equipo)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(equipo.id_equipo)}
      className="flex align-items-center gap-1 p-1 border-round cursor-grab flex-1 min-w-0"
      style={{ border: '1px dashed var(--surface-border)', background: 'var(--surface-section)' }}
      title="Arrastrá para reordenar"
    >
      <div className="border-circle flex-shrink-0" style={{ width: '0.6rem', height: '0.6rem', backgroundColor: color }} />
      <span className="text-xs truncate">{equipo.nombre}</span>
      {equipo.es_cabeza_serie && (
        <i className="pi pi-star-fill flex-shrink-0" style={{ color: 'var(--yellow-500)', fontSize: '0.6rem' }} />
      )}
    </div>
  );
}

export default function BracketEditor({ torneoId, equipos, onConfirm, onBack }) {
  const [orden, setOrden] = useState([...equipos]);
  const [draggedId, setDraggedId] = useState(null);
  const [organizando, setOrganizando] = useState(false);
  const [error, setError] = useState('');

  const handleAuto = async () => {
    setOrganizando(true);
    setError('');
    try {
      const res = await tournamentService.sorteo(torneoId, { tipo: 'eliminatoria', tercerPuesto: true });
      const ids = res.ordenEquipos || [];
      const map = new Map(equipos.map((e) => [e.id_equipo, e]));
      const nuevo = ids.map((id) => map.get(id)).filter(Boolean);
      const incluidos = new Set(nuevo.map((e) => e.id_equipo));
      equipos.forEach((e) => { if (!incluidos.has(e.id_equipo)) nuevo.push(e); });
      setOrden(nuevo);
    } catch (err) {
      setError(err.message || 'Error al organizar');
    } finally {
      setOrganizando(false);
    }
  };

  const swap = (idA, idB) => {
    setOrden((prev) => {
      const arr = [...prev];
      const iA = arr.findIndex((e) => e.id_equipo === idA);
      const iB = arr.findIndex((e) => e.id_equipo === idB);
      if (iA === -1 || iB === -1 || iA === iB) return prev;
      [arr[iA], arr[iB]] = [arr[iB], arr[iA]];
      return arr;
    });
  };

  const matches = [];
  for (let i = 0; i < orden.length; i += 2) {
    matches.push({ a: orden[i], b: orden[i + 1] || null });
  }

  return (
    <div className="flex flex-column gap-2 flex-1" style={{ minHeight: 0 }}>
      <div className="flex align-items-center gap-2">
        <button className="p-button p-button-outlined p-button-sm" onClick={handleAuto} disabled={organizando}>
          {organizando ? <i className="pi pi-spin pi-spinner mr-1" /> : <i className="pi pi-sitemap mr-1" />}Auto-organizar
        </button>
        <span className="text-xs text-color-secondary">Arrastrá para reordenar la primera ronda</span>
      </div>

      {error && <div className="p-1 border-round text-xs" style={{ background: 'var(--red-900)', color: 'var(--red-200)' }}>{error}</div>}

      <div className="flex flex-column gap-1 overflow-auto flex-1">
        {matches.map((m, i) => (
          <div key={i} className="flex align-items-center gap-1 p-1 border-round"
            style={{ border: '1px solid var(--surface-border)', background: 'var(--surface-card)' }}>
            <span className="text-xs text-color-secondary flex-shrink-0" style={{ width: '2rem' }}>#{i + 1}</span>
            <TeamChip equipo={m.a} onDragStart={setDraggedId} onDrop={(id) => swap(draggedId, id)} />
            <span className="text-xs font-bold text-color-secondary flex-shrink-0">VS</span>
            {m.b ? (
              <TeamChip equipo={m.b} onDragStart={setDraggedId} onDrop={(id) => swap(draggedId, id)} />
            ) : (
              <span className="text-xs text-color-secondary italic flex-1 p-1">BYE</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {onBack && <button className="p-button p-button-outlined p-button-sm" onClick={onBack}>Volver</button>}
        <button className="p-button p-button-sm flex-1" onClick={() => onConfirm(orden)} disabled={orden.length < 2}>
          <i className="pi pi-check mr-1" />Continuar
        </button>
      </div>
    </div>
  );
}

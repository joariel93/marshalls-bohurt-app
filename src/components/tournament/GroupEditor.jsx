import { useState } from 'react';
import TeamBadge from './TeamBadge';
import { distribuirAleatoriamente } from '../../utils/groupUtils';

export default function GroupEditor({ equipos, gruposIniciales, onSave, onBack }) {
  const cantEquipos = equipos.length;
  const maxGrupos = Math.max(2, Math.min(6, Math.floor(cantEquipos / 2)));
  const [cantidadGrupos, setCantidadGrupos] = useState(gruposIniciales?.length || 2);
  const [grupos, setGrupos] = useState(() => gruposIniciales?.length > 0 ? gruposIniciales : distribuirAleatoriamente(equipos, 2));
  const [draggingEquipo, setDraggingEquipo] = useState(null);

  const handleRandomizar = () => setGrupos(distribuirAleatoriamente(equipos, cantidadGrupos));

  const handleCambiarCantidad = (n) => {
    if (n < 2 || n > maxGrupos) return;
    setCantidadGrupos(n); setGrupos(distribuirAleatoriamente(equipos, n));
  };

  const handleDrop = (grupoDestino) => {
    if (!draggingEquipo) return;
    const nuevos = grupos.map(g => ({ ...g, equipos: [...g.equipos] }));
    if (draggingEquipo.grupoOrigen) {
      const o = nuevos.find(g => g.numero === draggingEquipo.grupoOrigen);
      if (o) o.equipos = o.equipos.filter(e => e.id_equipo !== draggingEquipo.equipo.id_equipo);
    }
    const d = nuevos.find(g => g.numero === grupoDestino);
    if (d && !d.equipos.find(e => e.id_equipo === draggingEquipo.equipo.id_equipo)) d.equipos.push(draggingEquipo.equipo);
    setGrupos(nuevos); setDraggingEquipo(null);
  };

  return (
    <div className="flex flex-column gap-1 flex-1" style={{ minHeight: 0 }}>
      <div className="flex align-items-center gap-1 text-xs">
        <span className="text-color-secondary">Grupos:</span>
        <button className="p-button p-button-outlined p-button-sm" style={{ padding: '0.1rem 0.4rem', minWidth: '1.5rem' }}
          onClick={() => handleCambiarCantidad(cantidadGrupos - 1)} disabled={cantidadGrupos <= 2}>
          <i className="pi pi-minus" style={{ fontSize: '0.6rem' }} />
        </button>
        <span className="font-bold">{cantidadGrupos}</span>
        <button className="p-button p-button-outlined p-button-sm" style={{ padding: '0.1rem 0.4rem', minWidth: '1.5rem' }}
          onClick={() => handleCambiarCantidad(cantidadGrupos + 1)} disabled={cantidadGrupos >= maxGrupos}>
          <i className="pi pi-plus" style={{ fontSize: '0.6rem' }} />
        </button>
        <button className="p-button p-button-text p-button-sm ml-auto" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }} onClick={handleRandomizar}>
          <i className="pi pi-refresh mr-1" />Randomizar
        </button>
      </div>

      <div className="grid m-0 flex-1" style={{ minHeight: 0, overflow: 'auto' }}>
        {grupos.map(g => (
          <div key={g.numero} className="col-6 p-1" onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(g.numero)}>
            <div className="p-1 border-round h-full" style={{ border: '1px solid var(--surface-border)', background: 'var(--surface-card)', minHeight: '4rem' }}>
              <div className="text-xs font-bold text-center mb-1">{g.nombre}</div>
              <div className="flex flex-column gap-1">
                {g.equipos.map(eq => (
                  <div key={eq.id_equipo} draggable onDragStart={() => setDraggingEquipo({ equipo: eq, grupoOrigen: g.numero })}>
                    <TeamBadge equipo={eq} />
                  </div>
                ))}
                {g.equipos.length === 0 && <p className="text-xs text-color-secondary text-center m-0">Vacío</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 justify-content-end mt-1">
        {onBack && <button className="p-button p-button-outlined p-button-sm" style={{ fontSize: '0.75rem' }} onClick={onBack}>Volver</button>}
        <button className="p-button p-button-sm" style={{ fontSize: '0.75rem' }} onClick={() => onSave(grupos)}>Guardar grupos</button>
      </div>
    </div>
  );
}

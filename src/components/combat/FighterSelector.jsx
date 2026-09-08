import { useState } from 'react';
import Shield from './Shield';

function FighterGrid({ equipo, fighters, selectedIds, onToggle, maxSelectable, suspendedIds, expelledIds, active }) {
  const isMaxReached = selectedIds.length >= (maxSelectable || Infinity);
  const colors = equipo.colores || [];

  if (!active) return null;

  return (
    <div className="flex flex-column gap-1" style={{ maxHeight: '12rem', overflow: 'auto' }}>
      {fighters.length === 0 ? (
        <p className="text-color-secondary text-xs text-center p-1">Sin peleadores</p>
      ) : (
        <div className="flex flex-wrap gap-1 justify-content-center">
          {fighters.map(f => {
            const isSuspended = suspendedIds.includes(f.id_usuario);
            const isExpelled = expelledIds.includes(f.id_usuario);
            const isSelected = selectedIds.includes(f.id_usuario);
            const isDisabled = isSuspended || isExpelled || (!isSelected && isMaxReached);
            return (
              <div key={f.id_usuario} className="flex flex-column align-items-center gap-0">
                <Shield
                  number={f.numero_peleador || 0}
                  color1={colors[0]?.hex}
                  color2={colors[1]?.hex || '#666'}
                  color3={colors[2]?.hex || '#888'}
                  size={42}
                  selected={isSelected}
                  yellowCard={isSuspended}
                  redCard={isExpelled}
                  selectable={!isDisabled || isSelected}
                  onClick={() => { if (!isDisabled || isSelected) onToggle(f.id_usuario); }}
                />
                <div className="text-xs mt-0 text-center">
                  {isSuspended && <span style={{ color: '#eab308', fontSize: '0.55rem' }}>Amar</span>}
                  {isExpelled && <span style={{ color: '#ef4444', fontSize: '0.55rem' }}>EXP</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FighterSelector({
  equipoA,
  equipoB,
  fightersA,
  fightersB,
  selectedA,
  selectedB,
  onToggleA,
  onToggleB,
  maxSelectable,
  suspendedA,
  suspendedB,
  expelledA,
  expelledB,
  onIniciar,
}) {
  const [openTeam, setOpenTeam] = useState(null);

  const TeamButton = ({ equipo, count, isOpen, onClick }) => {
    const color = equipo.colores?.[0]?.hex || '#666';
    return (
      <button
        className="flex align-items-center gap-1 p-1 border-round cursor-pointer border-none text-left w-full transition-colors transition-duration-200"
        style={{
          background: isOpen ? 'var(--surface-hover)' : 'var(--surface-card)',
          border: isOpen ? '1px solid var(--primary-color)' : '1px solid var(--surface-border)',
          color: 'var(--text-color)',
        }}
        onClick={onClick}
      >
        <div className="border-circle flex-shrink-0" style={{ width: '0.85rem', height: '0.85rem', backgroundColor: color }} />
        <span className="text-xs font-bold flex-1 truncate">{equipo.nombre}</span>
        <span className="text-xs text-color-secondary flex-shrink-0">{count}/{maxSelectable}</span>
        <i className={`pi pi-chevron-${isOpen ? 'up' : 'down'} text-xs text-color-secondary flex-shrink-0`} style={{ fontSize: '0.65rem' }} />
      </button>
    );
  };

  return (
    <div className="flex flex-column gap-1 flex-1" style={{ minHeight: 0 }}>
      <div className="flex gap-1">
        <div className="flex-1 flex flex-column">
          <TeamButton
            equipo={equipoA}
            count={selectedA.length}
            isOpen={openTeam === 'A'}
            onClick={() => setOpenTeam(openTeam === 'A' ? null : 'A')}
          />
          <FighterGrid
            equipo={equipoA}
            fighters={fightersA}
            selectedIds={selectedA}
            onToggle={onToggleA}
            maxSelectable={maxSelectable}
            suspendedIds={suspendedA}
            expelledIds={expelledA}
            active={openTeam === 'A'}
          />
        </div>
        <div className="flex-1 flex flex-column">
          <TeamButton
            equipo={equipoB}
            count={selectedB.length}
            isOpen={openTeam === 'B'}
            onClick={() => setOpenTeam(openTeam === 'B' ? null : 'B')}
          />
          <FighterGrid
            equipo={equipoB}
            fighters={fightersB}
            selectedIds={selectedB}
            onToggle={onToggleB}
            maxSelectable={maxSelectable}
            suspendedIds={suspendedB}
            expelledIds={expelledB}
            active={openTeam === 'B'}
          />
        </div>
      </div>

      <button
        className="p-button p-button-success w-full"
        style={{ padding: '0.4rem', fontSize: '0.85rem' }}
        onClick={onIniciar}
        disabled={selectedA.length === 0 || selectedB.length === 0}
      >
        <i className="pi pi-play mr-1" />
        {maxSelectable === 1 ? 'Iniciar pelea de campeones' : 'Iniciar round'}
      </button>
    </div>
  );
}

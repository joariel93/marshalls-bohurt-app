import TeamBadge from './TeamBadge';

export default function TeamList({ equipos, selectedTeam, onSelectTeam }) {
  if (!equipos || equipos.length === 0) {
    return <p className="text-color-secondary text-center p-4">No hay equipos inscriptos.</p>;
  }

  return (
    <div className="flex flex-column gap-2">
      {equipos.map(equipo => (
        <TeamBadge
          key={equipo.id_equipo}
          equipo={equipo}
          selected={selectedTeam?.id_equipo === equipo.id_equipo}
          onClick={() => onSelectTeam(equipo)}
        />
      ))}
    </div>
  );
}

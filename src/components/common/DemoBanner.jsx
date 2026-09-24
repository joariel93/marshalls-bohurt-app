import { useTournament } from '../../contexts/TournamentContext';

export default function DemoBanner() {
  const { torneo } = useTournament();

  if (!torneo?.isDemo) return null;

  return (
    <div
      className="w-full text-center py-2 px-3 text-sm font-bold"
      style={{
        background: 'var(--orange-500)',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      MODO DEMO - Los cambios se guardan solo en esta sesión
    </div>
  );
}

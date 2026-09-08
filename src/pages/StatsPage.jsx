import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { tournamentService } from '../services/apiService';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatsTable from '../components/tournament/StatsTable';

export default function StatsPage() {
  const { torneo } = useTournament();
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!torneo) {
      navigate('/otp', { replace: true });
      return;
    }
    const fetchStats = async () => {
      try {
        const data = await tournamentService.getEstadisticas(torneo.id);
        setEstadisticas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [torneo, navigate]);

  if (!torneo || loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <PageHeader
        title="Estadísticas"
        subtitle={torneo.nombre}
        onBack={() => navigate('/combat')}
      />

      <StatsTable estadisticas={estadisticas} />
    </div>
  );
}

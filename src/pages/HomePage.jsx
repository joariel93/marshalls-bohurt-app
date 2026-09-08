import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTournament } from '../contexts/TournamentContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  const { limpiarTorneo } = useTournament();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="flex justify-content-end mb-1">
        <button className="p-button p-button-text p-button-sm text-color-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => { logout(); navigate('/login', { replace: true }); }}>
          <i className="pi pi-sign-out mr-1" />Salir
        </button>
      </div>
      <div className="flex flex-column align-items-center justify-content-center flex-1 gap-4">
        <div className="text-center">
          <div className="flex align-items-center justify-content-center border-circle mx-auto mb-2"
            style={{ width: '3rem', height: '3rem', background: 'var(--surface-card)', border: '2px solid var(--surface-border)' }}>
            <i className="pi pi-user" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }} />
          </div>
          <h2 className="m-0 text-base">Hola, {user?.nombre || 'Marshall'}</h2>
        </div>
        <button className="p-button p-button-lg w-full flex align-items-center justify-content-center gap-2"
          style={{ height: '3.5rem', maxWidth: '280px', fontSize: '1rem' }}
          onClick={() => { limpiarTorneo(); navigate('/otp'); }}>
          <i className="pi pi-sign-in" />Ingresar a torneo
        </button>
      </div>
    </div>
  );
}

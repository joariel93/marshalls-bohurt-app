import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="page-container flex align-items-center justify-content-center">
        <div className="flex flex-column align-items-center gap-3">
          <i className="pi pi-spin pi-spinner text-3xl" />
          <span className="text-color-secondary">Cargando sesión...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

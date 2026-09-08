import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LoginPage() {
  const { loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle('mock-token');
      navigate('/home', { replace: true });
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    }
  };

  return (
    <div className="page-container justify-content-center align-items-center text-center">
      <div className="flex flex-column align-items-center gap-4 w-full" style={{ maxWidth: '320px' }}>
        <div
          className="flex align-items-center justify-content-center border-circle"
          style={{
            width: '5rem',
            height: '5rem',
            background: 'var(--primary-color)',
            fontSize: '2.5rem',
            color: 'var(--primary-color-text)',
          }}
        >
          <i className="pi pi-shield" />
        </div>

        <div>
          <h1 className="text-2xl font-bold m-0">Buhurt Marshalls</h1>
          <p className="text-color-secondary mt-2">App para árbitros de combates</p>
        </div>

        {error && (
          <div className="p-3 w-full border-round" style={{ background: 'var(--red-900)', color: 'var(--red-200)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Iniciando sesión..." />
        ) : (
          <button
            onClick={handleLogin}
            className="p-button w-full flex align-items-center justify-content-center gap-2"
            style={{ height: '3rem' }}
          >
            <i className="pi pi-google" style={{ fontSize: '1.2rem' }} />
            Ingresar con Google
          </button>
        )}

        <p className="text-color-secondary text-xs mt-4">
          MVP - Login simulado
        </p>
      </div>
    </div>
  );
}

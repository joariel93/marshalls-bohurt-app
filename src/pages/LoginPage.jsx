import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../utils/validation';

export default function LoginPage() {
  const { loginWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      await loginWithEmail(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
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

        <form onSubmit={handleEmailLogin} className="flex flex-column gap-2 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-section)', color: 'var(--text-color)' }}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-section)', color: 'var(--text-color)' }}
            required
          />
          <button
            type="submit"
            className="p-button w-full flex align-items-center justify-content-center gap-2"
            style={{ height: '3rem' }}
            disabled={loading}
          >
            {loading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-sign-in" />}
            Ingresar
          </button>
        </form>

      </div>
    </div>
  );
}

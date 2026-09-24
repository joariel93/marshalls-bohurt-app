import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import OTPInput from '../components/common/OTPInput';
import PageHeader from '../components/common/PageHeader';

export default function OTPPage() {
  const { validarOTP, loading } = useTournament();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (codigo) => {
    setError('');
    try {
      const result = await validarOTP(codigo);
      if (result.accesoValido) {
        navigate(result.torneo.organizado ? '/combat' : '/fighters', { replace: true });
      } else {
        setError(result.mensaje || 'Código inválido');
      }
    } catch (err) { setError('Error al validar el código.'); }
  };

  return (
    <div className="page-container">
      <PageHeader title="Ingresar a torneo" subtitle="Código OTP del organizador" onBack={() => navigate('/home')} />
      <div className="flex flex-column align-items-center justify-content-center flex-1 gap-3">
        {error && <div className="p-2 w-full border-round text-center text-xs" style={{ background: 'var(--red-900)', color: 'var(--red-200)', maxWidth: '18rem' }}>{error}</div>}
        <OTPInput onSubmit={handleSubmit} loading={loading} />
        <div className="text-center mt-2">
          <p className="text-color-secondary text-xs mb-1">Para probar sin torneo real:</p>
          <button
            className="p-button p-button-outlined p-button-sm flex align-items-center justify-content-center gap-2"
            onClick={() => handleSubmit('!!!!!!')}
            disabled={loading}
          >
            <i className="pi pi-play-circle" /> Entrar en modo demo
          </button>
        </div>
      </div>
    </div>
  );
}

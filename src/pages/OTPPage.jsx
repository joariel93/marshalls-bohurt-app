import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { USE_MOCKS } from '../services/apiService';
import OTPInput from '../components/common/OTPInput';
import PageHeader from '../components/common/PageHeader';

export default function OTPPage() {
  const { validarOTP, crearTorneo, loading } = useTournament();
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

  const handleCrearTorneo = async () => {
    const nombre = window.prompt('Nombre del nuevo torneo', 'Nuevo Torneo');
    if (nombre === null) return;
    setError('');
    try {
      await crearTorneo((nombre || '').trim() || 'Nuevo Torneo');
      navigate('/fighters', { replace: true });
    } catch { setError('Error al crear el torneo.'); }
  };

  return (
    <div className="page-container">
      <PageHeader title="Ingresar a torneo" subtitle="Código OTP del organizador" onBack={() => navigate('/home')} />
      <div className="flex flex-column align-items-center justify-content-center flex-1 gap-3">
        {error && <div className="p-2 w-full border-round text-center text-xs" style={{ background: 'var(--red-900)', color: 'var(--red-200)', maxWidth: '18rem' }}>{error}</div>}
        <OTPInput onSubmit={handleSubmit} loading={loading} />
        <div className="text-center mt-2">
          <p className="text-color-secondary text-xs mb-1">Códigos de prueba:</p>
          <div className="flex gap-1 justify-content-center">
            {[{ code: 'ABC123', label: 'Organizado' }, { code: 'DEF456', label: 'Sin organizar' }].map(t => (
              <span key={t.code} className="text-xs p-1 border-round cursor-pointer hover:surface-hover"
                style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}
                onClick={() => handleSubmit(t.code)}>
                {t.code} - {t.label}
              </span>
            ))}
          </div>
          {USE_MOCKS && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
              <button
                className="p-button p-button-outlined p-button-sm w-full flex align-items-center justify-content-center gap-2"
                onClick={handleCrearTorneo}
                disabled={loading}
              >
                <i className="pi pi-plus" /> Crear torneo desde cero
              </button>
              <p className="text-color-secondary text-xs mt-1 mb-0">
                Sin equipos pre-cargados: agregás equipos y peleadores manualmente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

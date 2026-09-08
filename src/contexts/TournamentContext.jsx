import { createContext, useContext, useState, useCallback } from 'react';
import { tournamentService } from '../services/apiService';

const TournamentContext = createContext(null);

export function TournamentProvider({ children }) {
  const [torneo, setTorneo] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [combates, setCombates] = useState([]);
  const [combateActual, setCombateActual] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);

  const validarOTP = useCallback(async (codigo) => {
    setLoading(true);
    try {
      const result = await tournamentService.validarOTP(codigo);
      if (result.accesoValido) {
        setTorneo(result.torneo);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const crearTorneo = useCallback(async (nombre) => {
    setLoading(true);
    try {
      const torneo = await tournamentService.crearTorneoVacio(nombre);
      setTorneo(torneo);
      setEquipos([]);
      setCombates([]);
      setCombateActual(null);
      setGrupos([]);
      return torneo;
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarEquiposConPeleadores = useCallback(async () => {
    if (!torneo) return;
    setLoading(true);
    try {
      const data = await tournamentService.getEquiposConPeleadores(torneo.id);
      setEquipos(data);
    } finally {
      setLoading(false);
    }
  }, [torneo]);

  const cargarCombates = useCallback(async () => {
    if (!torneo) return;
    setLoading(true);
    try {
      const data = await tournamentService.getCombates(torneo.id);
      setCombates(data.combates || []);
    } finally {
      setLoading(false);
    }
  }, [torneo]);

  const cargarGrupos = useCallback(async () => {
    if (!torneo) return;
    const data = await tournamentService.getGrupos(torneo.id);
    setGrupos(data);
  }, [torneo]);

  const limpiarTorneo = useCallback(() => {
    setTorneo(null);
    setEquipos([]);
    setCombates([]);
    setCombateActual(null);
    setGrupos([]);
  }, []);

  return (
    <TournamentContext.Provider value={{
      torneo, equipos, combates, combateActual, grupos, loading,
      validarOTP,
      crearTorneo,
      cargarEquiposConPeleadores,
      cargarCombates,
      cargarGrupos,
      setCombateActual,
      setCombates,
      setEquipos,
      setGrupos,
      limpiarTorneo,
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) throw new Error('useTournament debe usarse dentro de TournamentProvider');
  return context;
}

import apiClient from '../api/apiClient';
import {
  DEMO_TORNEO_ID,
  DEMO_CODE,
  getDemoTorneo,
  getDemoEquipos,
  guardarNumerosPeleadores as demoGuardarNumeros,
  eliminarPeleador as demoEliminarPeleador,
  inscribirPeleador as demoInscribirPeleador,
  crearEquipoCoalicion as demoCrearEquipo,
  eliminarEquipo as demoEliminarEquipo,
  setCabezaSerie as demoSetCabezaSerie,
  crearCombates as demoCrearCombates,
  eliminarCombates as demoEliminarCombates,
  getDemoCombates,
  getDemoGrupos,
  guardarGrupos as demoGuardarGrupos,
  getDemoEstadisticas,
  grabarRound as demoGrabarRound,
  cerrarCombate as demoCerrarCombate,
  buscarUsuarioPorUsername as demoBuscarUsuario,
  crearUsuarioRapido as demoCrearUsuario,
  resetDemoState,
} from '../api/demoStore';
import { encryptDni, decryptDni } from '../utils/dniCrypto';

const isDemo = (idTorneo) => idTorneo === DEMO_TORNEO_ID;

// ==== Auth ====

const authService = {
  async loginWithEmail(email, password) {
    const { data } = await apiClient.post('/v1/marshall/auth/login', { email, password });
    return data;
  },

  async getProfile() {
    const { data } = await apiClient.get('/v1/auth/me');
    return data;
  },

  async logout() {
    const { data } = await apiClient.post('/v1/auth/logout');
    return data;
  },
};

// ==== Tournament ====

function mapFighter(f) {
  return {
    id_usuario: f.idUsuario,
    nombre: f.nombre,
    apellido: f.apellido,
    dni: f.username ? decryptDni(f.username) : '',
    numero_peleador: f.numeroPeleador,
    cantidad_amarillas: f.cantidadAmarillas,
    descalificado: f.descalificado ? 1 : 0,
  };
}

function mapCombatTeam(e) {
  return {
    id: e.id,
    nombre: e.nombre,
    logo: e.logo,
    colores: e.colores || [],
    peleadores: (e.peleadores || []).map(mapFighter),
  };
}

function mapEquipo(e) {
  return {
    id_equipo: e.id,
    nombre: e.nombre,
    logo: e.logo,
    colores: e.colores || [],
    peleadores: (e.peleadores || []).map(mapFighter),
    posicion: e.posicion,
    id_club: e.idClub || null,
    club: e.club || null,
    es_cabeza_serie: !!e.esCabezaSerie,
  };
}

function mapResultado(r) {
  return {
    idEquipoGanador: r.idEquipoGanador,
    nombreGanador: r.nombreGanador,
    roundsGanadosGanador: r.roundsGanadosGanador,
    roundsGanadosPerdedor: r.roundsGanadosPerdedor,
    rounds: (r.rounds || []).map((rd) => ({
      round: rd.round,
      idEquipoGanador: rd.idEquipoGanador,
      puntosGanador: rd.puntosGanador,
      puntosPerdedor: rd.puntosPerdedor,
    })),
  };
}

function mapCombat(c) {
  return {
    id: c.id,
    orden: c.orden,
    link: c.link,
    fase: c.fase || null,
    grupo: c.grupo || null,
    nivel: c.nivel ?? null,
    finalizado: c.finalizado,
    bloqueado: false,
    instancia: c.ronda || null,
    idLlave: null,
    equipoA: c.equipoA ? mapCombatTeam(c.equipoA) : null,
    equipoB: c.equipoB ? mapCombatTeam(c.equipoB) : null,
    resultado: c.resultado ? mapResultado(c.resultado) : null,
  };
}

const NIVEL_INSTANCIA = {
  Final: 0,
  '3er Puesto': 0,
  Semifinal: 1,
  Cuartos: 2,
  Octavos: 3,
  Dieciseisavos: 4,
};

function nivelDeInstancia(instancia) {
  if (!instancia) return null;
  for (const [key, value] of Object.entries(NIVEL_INSTANCIA)) {
    if (instancia.startsWith(key)) return value;
  }
  return null;
}

function mapEliminatoriaCombate(c, index) {
  const mapSlot = (idEquipo, dependsOn, esTercerPuesto) => {
    if (idEquipo && !idEquipo.startsWith('_key_') && !idEquipo.startsWith('_w_')) {
      return { idEquipo, origen: 'equipo', idCombateOrigen: null };
    }
    if (dependsOn !== null && dependsOn !== undefined) {
      return { idEquipo: null, origen: esTercerPuesto ? 'perdedor' : 'ganador', idCombateOrigen: String(dependsOn) };
    }
    return { idEquipo: null, origen: 'equipo', idCombateOrigen: null };
  };

  const a = mapSlot(c.idEquipoA, c.dependsOnA, c.esTercerPuesto);
  const b = mapSlot(c.idEquipoB, c.dependsOnB, c.esTercerPuesto);

  return {
    tempId: String(index),
    idEquipoA: a.idEquipo,
    idEquipoB: b.idEquipo,
    origenA: a.origen,
    origenB: b.origen,
    idCombateOrigenA: a.idCombateOrigen,
    idCombateOrigenB: b.idCombateOrigen,
    orden: index + 1,
    fase: 'eliminatoria',
    grupo: null,
    ronda: c.instancia || null,
    nivel: nivelDeInstancia(c.instancia),
    autoAvance: !!c.autoAvance,
  };
}

const tournamentService = {
  async validarOTP(codigo) {
    if (codigo === DEMO_CODE) {
      resetDemoState();
      return { accesoValido: true, torneo: getDemoTorneo(), isDemo: true };
    }
    const { data } = await apiClient.post('/v1/marshall/torneo/acceso', { codigo });
    return data;
  },

  async crearTorneoVacio(nombre) {
    // Easter egg demo no requiere crear torneo vacío; se usa el torneo demo fijo.
    throw new Error('Crear torneo no está disponible (solo modo demo fijo)');
  },

  async getEquiposConPeleadores(idTorneo) {
    if (isDemo(idTorneo)) return getDemoEquipos(idTorneo);
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/equipos`);
    return data.map(mapEquipo);
  },

  async guardarNumerosPeleadores(idTorneo, numeros) {
    if (isDemo(idTorneo)) return demoGuardarNumeros(idTorneo, numeros);
    const { data } = await apiClient.put(`/v1/marshall/torneo/${idTorneo}/equipos/peleadores/numeros`, { numeros });
    return data;
  },

  async eliminarPeleador(idTorneo, idEquipo, idUsuario) {
    if (isDemo(idTorneo)) return demoEliminarPeleador(idTorneo, idEquipo, idUsuario);
    const { data } = await apiClient.delete(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}/peleador/${idUsuario}`);
    return data;
  },

  async buscarUsuarioPorDni(dni) {
    const username = encryptDni(dni);
    // El modo demo no busca por DNI cifrado; delegamos siempre al backend real.
    const { data } = await apiClient.get('/v1/marshall/usuarios', { params: { username } });
    if (!data) return null;
    return { idUsuario: data.idUsuario, nombre: data.nombre, apellido: data.apellido, dni: decryptDni(data.username) };
  },

  async crearUsuarioRapido({ nombre, apellido, dni }) {
    const username = encryptDni(dni);
    const { data } = await apiClient.post('/v1/marshall/usuarios', {
      nombre,
      apellido,
      username,
      idTipoUsuario: 4,
    });
    return { idUsuario: data.idUsuario, nombre: data.nombre, apellido: data.apellido, dni };
  },

  async inscribirPeleador(idTorneo, idEquipo, idUsuario) {
    if (isDemo(idTorneo)) return demoInscribirPeleador(idTorneo, idEquipo, idUsuario);
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}/peleador`, { idUsuario });
    return data;
  },

  async getCombates(idTorneo) {
    if (isDemo(idTorneo)) return getDemoCombates(idTorneo);
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/combates`);
    return {
      idTorneo: data.idTorneo,
      nombre: data.nombre,
      combates: (data.combates || []).map(mapCombat),
      equipos: (data.equipos || []).map(mapCombatTeam),
    };
  },

  async getEstadisticas(idTorneo) {
    if (isDemo(idTorneo)) return getDemoEstadisticas(idTorneo);
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/estadisticas`);
    return data;
  },

  async getGrupos(idTorneo) {
    if (isDemo(idTorneo)) return getDemoGrupos(idTorneo);
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/grupos`);
    return data;
  },

  async guardarGrupos(idTorneo, grupos) {
    if (isDemo(idTorneo)) return demoGuardarGrupos(idTorneo, grupos);
    const { data } = await apiClient.put(`/v1/marshall/torneo/${idTorneo}/grupos`, { grupos });
    return data;
  },

  async crearEstructura(idTorneo, combates) {
    if (isDemo(idTorneo)) {
      return demoCrearCombates(idTorneo, combates);
    }
    const payload = combates.map(mapEliminatoriaCombate);
    await apiClient.post(`/v1/marshall/torneo/${idTorneo}/estructura`, { combates: payload });
    return { mensaje: 'Estructura creada exitosamente' };
  },

  async eliminarCombates(idTorneo) {
    if (isDemo(idTorneo)) return demoEliminarCombates(idTorneo);
    const { data } = await apiClient.delete(`/v1/marshall/torneo/${idTorneo}/combates`);
    return data;
  },

  async eliminarEquipo(idTorneo, idEquipo) {
    if (isDemo(idTorneo)) return demoEliminarEquipo(idTorneo, idEquipo);
    const { data } = await apiClient.delete(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}`);
    return data;
  },

  async crearEquipoCoalicion(idTorneo, nombreEquipo) {
    if (isDemo(idTorneo)) return demoCrearEquipo(idTorneo, nombreEquipo);
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/equipo`, { nombre: nombreEquipo });
    return data;
  },

  async setCabezaSerie(idTorneo, idEquipo, esCabezaSerie) {
    if (isDemo(idTorneo)) return demoSetCabezaSerie(idTorneo, idEquipo, esCabezaSerie);
    const { data } = await apiClient.put(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}/cabeza-serie`, { esCabezaSerie });
    return data;
  },

  async sorteo(idTorneo, config) {
    if (isDemo(idTorneo)) {
      const eqs = getDemoEquipos(idTorneo);
      const shuffled = [...eqs].sort(() => Math.random() - 0.5);
      if (config?.tipo === 'grupos') {
        const n = config.cantidadGrupos || 2;
        const grupos = Array.from({ length: n }, (_, i) => ({
          numero: i + 1,
          nombre: `Grupo ${String.fromCharCode(65 + i)}`,
          equipos: [],
        }));
        shuffled.forEach((e, i) => grupos[i % n].equipos.push(e.id_equipo));
        return { grupos: grupos.map((g) => ({ ...g, equipos: g.equipos })) };
      }
      return { ordenEquipos: shuffled.map((e) => e.id_equipo) };
    }
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/sorteo`, config);
    return data;
  },
};

// ==== Combat ====

const combatService = {
  async grabarRound(idTorneo, idCombate, roundData) {
    if (isDemo(idTorneo)) return demoGrabarRound(idTorneo, idCombate, roundData);
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/combate/${idCombate}/round`, roundData);
    return data;
  },

  async cerrarCombate(idTorneo, idCombate, idEquipoGanador) {
    if (isDemo(idTorneo)) return demoCerrarCombate(idTorneo, idCombate, idEquipoGanador);
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/combate/${idCombate}/cerrar`, { idEquipoGanador });
    return data;
  },
};

export { authService, tournamentService, combatService, DEMO_TORNEO_ID };

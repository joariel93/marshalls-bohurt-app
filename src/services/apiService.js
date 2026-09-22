import {
  usuarios,
  torneos,
  torneoEquipo,
  torneoEquipoPeleador,
  equipos,
  colores,
  combates,
  roundCombate,
  roundPeleador,
  equiposPorGrupo,
  organizacionTorneo,
  torneoLuchador,
  bracketTemplate,
} from '../api/mocks/data';
import apiClient from '../api/apiClient';
import { encryptDni, decryptDni } from '../utils/dniCrypto';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL || 'marshall@test.com';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const generarPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const findByDni = (dni) => usuarios.find(u => u.dni === dni) || null;
const findEquipo = (id) => equipos.find(e => e.id_equipo === id) || null;
const findUsuario = (id) => usuarios.find(u => u.id_usuario === id) || null;
const findTorneo = (id) => torneos.find(t => t.id_torneo === id) || null;

function getColoresEquipo(equipo) {
  return [equipo.id_color1, equipo.id_color2, equipo.id_color3]
    .map(id => colores.find(c => c.id_color === id))
    .filter(Boolean);
}

function getPeleadoresEquipoEnTorneo(idTorneo, idEquipo) {
  return torneoEquipoPeleador
    .filter(tep => tep.id_torneo === idTorneo && tep.id_equipo === idEquipo)
    .map(tep => {
      const usuario = findUsuario(tep.id_usuario);
      return {
        ...tep,
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        dni: usuario?.dni || '',
      };
    });
}

function getEquiposEnTorneo(idTorneo) {
  return torneoEquipo
    .filter(te => te.id_torneo === idTorneo)
    .map(te => {
      const equipo = findEquipo(te.id_equipo);
      if (!equipo) return null;
      return {
        ...te,
        nombre: equipo.nombre,
        logo: equipo.logo,
        colores: getColoresEquipo(equipo),
        peleadores: getPeleadoresEquipoEnTorneo(idTorneo, te.id_equipo),
      };
    })
    .filter(Boolean);
}

function isPlaceholder(id) {
  return id && (id.startsWith('_w_') || id.startsWith('_key_'));
}

function getCombatesTorneo(idTorneo) {
  const torneoCombates = combates.filter(c => c.id_torneo === idTorneo).sort((a, b) => a.orden - b.orden);

  return torneoCombates.map(c => {
    const getDepInfo = (side) => {
      const depKey = side === 'A' ? '_dependsOnA' : '_dependsOnB';
      const placeholderKey = side === 'A' ? 'id_equipo_a' : 'id_equipo_b';
      if (!c[placeholderKey] || !isPlaceholder(c[placeholderKey])) return null;

      const depId = c[depKey];
      if (!depId) return { bloqueado: true, nombre: 'TBD' };

      const depCombat = combates.find(cb => cb.id_combate === depId);
      const depResuelto = depCombat && depCombat.id_equipo_ganador !== null;
      if (depResuelto) {
        const winner = findEquipo(depCombat.id_equipo_ganador);
        return { bloqueado: false, nombre: winner?.nombre || 'TBD' };
      }
      return { bloqueado: true, nombre: 'Ganador #' + (torneoCombates.findIndex(tc => tc.id_combate === depId) + 1) };
    };

    const depA = getDepInfo('A');
    const depB = getDepInfo('B');
    const bloqueado = !!(depA?.bloqueado || depB?.bloqueado);

    let teamA, teamB;
    if (c.id_equipo_a && !isPlaceholder(c.id_equipo_a)) teamA = findEquipo(c.id_equipo_a);
    if (c.id_equipo_b && !isPlaceholder(c.id_equipo_b)) teamB = findEquipo(c.id_equipo_b);

    const ganador = c.id_equipo_ganador ? findEquipo(c.id_equipo_ganador) : null;
    const finalizado = c.id_equipo_ganador !== null;

    const rounds = roundCombate
      .filter(rc => rc.id_torneo === idTorneo && rc.id_combate === c.id_combate)
      .sort((a, b) => a.round - b.round)
      .map(rc => ({
        round: rc.round,
        idEquipoGanador: rc.id_equipo_ganador,
        puntosGanador: rc.puntos_ganador,
        puntosPerdedor: rc.puntos_perdedor,
      }));

    const makeTeam = (real, side) => {
      const dep = side === 'A' ? depA : depB;
      const rawId = side === 'A' ? c.id_equipo_a : c.id_equipo_b;
      if (real) {
        return {
          id: real.id_equipo,
          nombre: real.nombre,
          logo: real.logo,
          colores: getColoresEquipo(real),
          peleadores: getPeleadoresEquipoEnTorneo(idTorneo, real.id_equipo),
        };
      }
      if (rawId && isPlaceholder(rawId)) {
        return {
          id: rawId,
          nombre: dep?.nombre || c[side === 'A' ? '_nombreA' : '_nombreB'] || 'TBD',
          logo: null,
          colores: [],
          peleadores: [],
          placeholder: !dep?.bloqueado,
        };
      }
      if (!rawId) return null;
      return { id: rawId, nombre: 'TBD', logo: null, colores: [], peleadores: [] };
    };

    return {
      id: c.id_combate,
      orden: c.orden,
      link: c.link,
      finalizado,
      bloqueado,
      instancia: c._instancia || null,
      idLlave: c._idLlave || null,
      equipoA: makeTeam(teamA, 'A'),
      equipoB: c.id_equipo_b === null ? null : makeTeam(teamB, 'B'),
      resultado: finalizado && ganador ? {
        idEquipoGanador: ganador.id_equipo,
        nombreGanador: ganador.nombre,
        roundsGanadosGanador: c.cantidad_round_ganados_ganador,
        roundsGanadosPerdedor: c.cantidad_round_ganados_perdedor,
        rounds,
      } : null,
    };
  });
}

function torneoEstaOrganizado(idTorneo) {
  return combates.some(c => c.id_torneo === idTorneo);
}

const mockAuthService = {
  async loginWithEmail(email, password) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(500);
    return usuarios[0];
  },

  async getProfile() {
    await delay(300);
    return usuarios[0];
  },

  async logout() {
    await delay(200);
    return { message: 'Sesión cerrada' };
  },
};

function propagarAutoAvance(idTorneo, fromCombatId, equipoId) {
    const fromCombat = combates.find(c => c.id_combate === fromCombatId);
    if (!fromCombat || !fromCombat._idLlave) return;

    const llave = bracketTemplate.find(k => k.idLlave === fromCombat._idLlave);
    if (!llave) return;

    const parents = bracketTemplate.filter(k => k.idLlaveA === llave.idLlave || k.idLlaveB === llave.idLlave);
    parents.forEach(parent => {
      if (parent.esTercerPuesto) return; // BYE has no loser, skip 3rd place

      const parentCombat = combates.find(c =>
        c.id_torneo === idTorneo && c._idLlave === parent.idLlave && !c.id_equipo_ganador
      );
      if (!parentCombat) return;

      if (parent.idLlaveA === llave.idLlave) {
        parentCombat.id_equipo_a = equipoId;
      }
      if (parent.idLlaveB === llave.idLlave) {
        parentCombat.id_equipo_b = equipoId;
      }

      if (parentCombat.id_equipo_a && parentCombat.id_equipo_b &&
          !isPlaceholder(parentCombat.id_equipo_a) && !isPlaceholder(parentCombat.id_equipo_b) &&
          parentCombat.id_equipo_a === parentCombat.id_equipo_b) {
        parentCombat.id_equipo_ganador = parentCombat.id_equipo_a;
        parentCombat.cantidad_round_ganados_ganador = 1;
        propagarAutoAvance(idTorneo, parentCombat.id_combate, parentCombat.id_equipo_a);
      }
    });
  }

const mockTournamentService = {
  async validarOTP(codigo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(800);
    const torneo = torneos.find(t => t.password === codigo);
    if (!torneo) {
      return { accesoValido: false, mensaje: 'Código de acceso inválido' };
    }
    const organizado = torneoEstaOrganizado(torneo.id_torneo);
    return {
      accesoValido: true,
      torneo: {
        id: torneo.id_torneo,
        nombre: torneo.nombre,
        localizacion: torneo.localizacion,
        fechaTorneo: torneo.fecha_torneo,
        modalidad: torneo.id_modalidad,
        categoria: torneo.id_categoria,
        genero: torneo.id_genero,
        idTipoTorneo: torneo.id_tipo_torneo,
        organizado,
      },
    };
  },

  async crearTorneoVacio(nombre) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(600);
    const id = `torneo-nuevo-${Date.now()}`;
    const password = generarPassword();
    const nuevo = {
      id_torneo: id,
      nombre: nombre || 'Nuevo Torneo',
      localizacion: '',
      fecha_torneo: new Date().toISOString().split('T')[0],
      fecha_cierre_inscripcion: null,
      id_modalidad: 1,
      id_categoria: 1,
      id_genero: 1,
      id_tipo_torneo: null,
      password,
      passwordJugadores: null,
    };
    torneos.push(nuevo);
    return {
      id: nuevo.id_torneo,
      nombre: nuevo.nombre,
      localizacion: nuevo.localizacion,
      fechaTorneo: nuevo.fecha_torneo,
      modalidad: nuevo.id_modalidad,
      categoria: nuevo.id_categoria,
      genero: nuevo.id_genero,
      idTipoTorneo: nuevo.id_tipo_torneo,
      organizado: false,
      password,
    };
  },

  async getEquiposConPeleadores(idTorneo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(500);
    return getEquiposEnTorneo(idTorneo);
  },

  async guardarNumerosPeleadores(idTorneo, numeros) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(400);
    numeros.forEach(({ idEquipo, idUsuario, numeroPeleador }) => {
      const tep = torneoEquipoPeleador.find(
        t => t.id_torneo === idTorneo && t.id_equipo === idEquipo && t.id_usuario === idUsuario
      );
      if (tep) tep.numero_peleador = numeroPeleador;
    });
    return { mensaje: 'Números guardados exitosamente' };
  },

  async eliminarPeleador(idTorneo, idEquipo, idUsuario) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    const idx = torneoEquipoPeleador.findIndex(
      t => t.id_torneo === idTorneo && t.id_equipo === idEquipo && t.id_usuario === idUsuario
    );
    if (idx !== -1) torneoEquipoPeleador.splice(idx, 1);
    return { mensaje: 'Peleador eliminado' };
  },

  async buscarUsuarioPorDni(dni) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    const user = findByDni(dni);
    if (!user) return null;
    return { idUsuario: user.id_usuario, nombre: user.nombre, apellido: user.apellido, dni: user.dni };
  },

  async crearUsuarioRapido({ nombre, apellido, dni }) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(400);
    const id = `user-rapido-${Date.now()}`;
    const nuevo = { id_usuario: id, nombre, apellido, dni, id_tipo_usuario: 4 };
    usuarios.push(nuevo);
    return nuevo;
  },

  async inscribirPeleador(idTorneo, idEquipo, idUsuario) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    const existeEnOtroEquipo = torneoEquipoPeleador.find(
      t => t.id_torneo === idTorneo && t.id_usuario === idUsuario && t.id_equipo !== idEquipo
    );
    if (existeEnOtroEquipo) {
      const otroEquipo = findEquipo(existeEnOtroEquipo.id_equipo);
      throw new Error(`El peleador ya está inscripto en el equipo "${otroEquipo?.nombre}"`);
    }
    const yaInscripto = torneoEquipoPeleador.find(
      t => t.id_torneo === idTorneo && t.id_equipo === idEquipo && t.id_usuario === idUsuario
    );
    if (yaInscripto) return yaInscripto;

    const nuevo = {
      id_torneo: idTorneo,
      id_equipo: idEquipo,
      id_usuario: idUsuario,
      numero_peleador: 0,
      cantidad_amarillas: 0,
      descalificado: 0,
    };
    torneoEquipoPeleador.push(nuevo);
    return nuevo;
  },

  async getCombates(idTorneo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(500);
    const torneo = findTorneo(idTorneo);
    const eqs = getEquiposEnTorneo(idTorneo);
    return {
      idTorneo,
      nombre: torneo?.nombre || '',
      combates: getCombatesTorneo(idTorneo),
      equipos: eqs,
    };
  },

  async getEstadisticas(idTorneo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(500);
    const torneo = findTorneo(idTorneo);
    const equiposStats = torneoEquipo
      .filter(te => te.id_torneo === idTorneo)
      .map(te => {
        const eq = findEquipo(te.id_equipo);
        return {
          id: te.id_equipo,
          nombre: eq?.nombre || '',
          logo: eq?.logo,
          combates: te.cantidad_combates,
          victorias: te.cantidad_victorias,
          derrotas: te.cantidad_derrotas,
          roundsGanados: te.cantidad_rounds_ganados,
          roundsPerdidos: te.cantidad_rounds_perdidos,
        };
      })
      .sort((a, b) => b.victorias - a.victorias || a.derrotas - b.derrotas);

    return {
      idTorneo,
      nombre: torneo?.nombre || '',
      equipos: equiposStats,
    };
  },

  async getGrupos(idTorneo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    return equiposPorGrupo.filter(g => g.id_torneo === idTorneo);
  },

  async guardarGrupos(idTorneo, grupos) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(400);
    const idx = equiposPorGrupo.findIndex(g => g.id_torneo === idTorneo);
    const nuevos = grupos.map(g => ({ ...g, id_torneo: idTorneo }));
    if (idx !== -1) {
      equiposPorGrupo.splice(idx, 1, ...nuevos);
    } else {
      equiposPorGrupo.push(...nuevos);
    }
    return { mensaje: 'Grupos guardados exitosamente' };
  },

  async crearCombates(idTorneo, combatesData) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(600);
    const ids = combatesData.map((c, i) => `combate-gen-${Date.now()}-${i}`);

    combatesData.forEach((c, i) => {
      const id = ids[i];
      const resolve = (val, depIdx) => {
        if (val && val.startsWith('_key_') && depIdx !== null && depIdx !== undefined && ids[depIdx]) {
          return `_key_${ids[depIdx]}`;
        }
        if (val && val.startsWith('_w_') && depIdx !== null && depIdx !== undefined && ids[depIdx]) {
          return `_w_${ids[depIdx]}`;
        }
        return val;
      };

      combates.push({
        id_torneo: idTorneo,
        id_combate: id,
        orden: i + 1,
        id_equipo_a: c.idEquipoA === null ? null : resolve(c.idEquipoA, c.dependsOnA),
        id_equipo_b: c.idEquipoB === null ? null : resolve(c.idEquipoB, c.dependsOnB),
        id_equipo_ganador: null,
        cantidad_round_ganados_ganador: 0,
        cantidad_round_ganados_perdedor: 0,
        link: null,
        _dependsOnA: c.dependsOnA !== null && c.dependsOnA !== undefined ? ids[c.dependsOnA] : null,
        _dependsOnB: c.dependsOnB !== null && c.dependsOnB !== undefined ? ids[c.dependsOnB] : null,
        _nombreA: c.nombreEquipoA,
        _nombreB: c.nombreEquipoB,
        _idLlave: c.idLlave || null,
        _instancia: c.instancia || null,
        _autoAvance: c.autoAvance || false,
        _esTercerPuesto: c.esTercerPuesto || false,
      });
    });

    combatesData.forEach((c, i) => {
      if (c.autoAvance && c.idEquipoA) {
        const id = ids[i];
        const combat = combates.find(cb => cb.id_combate === id);
        if (combat) {
          combat.id_equipo_ganador = c.idEquipoA;
          combat.cantidad_round_ganados_ganador = 1;
        }
        propagarAutoAvance(idTorneo, id, c.idEquipoA);
      }
    });

    return { mensaje: 'Combates creados exitosamente', ids };
  },

  async eliminarCombates(idTorneo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    const idxCombates = [];
    combates.forEach((c, i) => { if (c.id_torneo === idTorneo) idxCombates.push(i); });
    idxCombates.reverse().forEach(i => combates.splice(i, 1));
    return { mensaje: 'Combates eliminados exitosamente' };
  },

  async eliminarEquipo(idTorneo, idEquipo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    const teIdx = torneoEquipo.findIndex(t => t.id_torneo === idTorneo && t.id_equipo === idEquipo);
    if (teIdx !== -1) torneoEquipo.splice(teIdx, 1);
    for (let i = torneoEquipoPeleador.length - 1; i >= 0; i--) {
      if (torneoEquipoPeleador[i].id_torneo === idTorneo && torneoEquipoPeleador[i].id_equipo === idEquipo) {
        torneoEquipoPeleador.splice(i, 1);
      }
    }
    return { mensaje: 'Equipo eliminado del torneo' };
  },

  async crearEquipoCoalicion(idTorneo, nombreEquipo) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(400);
    const torneo = torneos.find(t => t.id_torneo === idTorneo);
    const idEquipo = `equipo-coal-${Date.now()}`;
    equipos.push({
      id_equipo: idEquipo,
      nombre: nombreEquipo,
      logo: null,
      fecha_creacion: torneo?.fecha_torneo || new Date().toISOString().split('T')[0],
      id_color1: 1, // Negro
      id_color2: 2, // Blanco
      id_color3: 1, // Negro
      id_categoria: 1,
      id_modalidad: 1,
      id_genero: 1,
    });
    torneoEquipo.push({
      id_equipo: idEquipo,
      id_torneo: idTorneo,
      posicion: null,
      cantidad_combates: 0,
      cantidad_victorias: 0,
      cantidad_derrotas: 0,
      cantidad_rounds_ganados: 0,
      cantidad_rounds_perdidos: 0,
    });
    return { id_equipo: idEquipo, nombre: nombreEquipo, mensaje: 'Equipo coalición creado' };
  },

  async setCabezaSerie() {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(200);
    return { mensaje: 'Cabeza de serie actualizada' };
  },

  async sorteo(idTorneo, config) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(300);
    const eqs = getEquiposEnTorneo(idTorneo);
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
  },
};

const mockCombatService = {
  async getCombate(idTorneo, idCombate) {
    await delay(300);
    return combates.find(c => c.id_torneo === idTorneo && c.id_combate === idCombate) || null;
  },

  async grabarRound(idTorneo, idCombate, roundData) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(400);
    const { orden, round, idEquipoGanador, puntosGanador, puntosPerdedor, peleadores } = roundData;

    const existe = roundCombate.find(
      r => r.id_torneo === idTorneo && r.id_combate === idCombate && r.round === round
    );
    if (existe) throw new Error('El round ya fue registrado para este combate');

    roundCombate.push({
      id_torneo: idTorneo,
      id_combate: idCombate,
      orden,
      round,
      id_equipo_ganador: idEquipoGanador,
      puntos_ganador: puntosGanador || 0,
      puntos_perdedor: puntosPerdedor || 0,
    });

    peleadores.forEach(p => {
      const idx = roundPeleador.findIndex(
        rp => rp.id_torneo === idTorneo && rp.id_combate === idCombate && rp.round === round && rp.id_usuario === p.idUsuario
      );
      const entry = {
        id_torneo: idTorneo,
        id_combate: idCombate,
        orden,
        round,
        id_usuario: p.idUsuario,
        en_pie: p.enPie ? 1 : 0,
        amonestado: p.amonestado ? 1 : 0,
        expulsado: p.expulsado ? 1 : 0,
      };
      if (idx !== -1) roundPeleador[idx] = entry;
      else roundPeleador.push(entry);

      if (p.amonestado) {
        const tep = torneoEquipoPeleador.find(
          t => t.id_torneo === idTorneo && t.id_usuario === p.idUsuario
        );
        if (tep) tep.cantidad_amarillas += 1;
      }
      if (p.expulsado) {
        const tep = torneoEquipoPeleador.find(
          t => t.id_torneo === idTorneo && t.id_usuario === p.idUsuario
        );
        if (tep) tep.descalificado = 1;
      }
    });

    return { mensaje: 'Round registrado exitosamente' };
  },

  async cerrarCombate(idTorneo, idCombate, idEquipoGanador) {
    if (!USE_MOCKS) throw new Error('API no implementada');
    await delay(400);
    const combat = combates.find(c => c.id_torneo === idTorneo && c.id_combate === idCombate);
    if (!combat) throw new Error('Combate no encontrado');
    if (combat.id_equipo_ganador) throw new Error('El combate ya fue cerrado');
    if (!idEquipoGanador || isPlaceholder(idEquipoGanador)) throw new Error('idEquipoGanador inválido');

    const rounds = roundCombate.filter(
      r => r.id_torneo === idTorneo && r.id_combate === idCombate
    );
    if (rounds.length === 0) throw new Error('No se puede cerrar un combate sin rounds');

    const realWinnerId = idEquipoGanador;
    const perdedor = idEquipoGanador === combat.id_equipo_a ? combat.id_equipo_b : combat.id_equipo_a;

    const ganadosGanador = rounds.filter(r => r.id_equipo_ganador === idEquipoGanador).length;
    const ganadosPerdedor = rounds.filter(r => r.id_equipo_ganador === perdedor).length;

    combat.id_equipo_ganador = realWinnerId;
    combat.cantidad_round_ganados_ganador = ganadosGanador;
    combat.cantidad_round_ganados_perdedor = ganadosPerdedor;

    const teGanador = torneoEquipo.find(
      t => t.id_torneo === idTorneo && t.id_equipo === realWinnerId
    );
    if (teGanador) {
      teGanador.cantidad_combates += 1;
      teGanador.cantidad_victorias += 1;
      teGanador.cantidad_rounds_ganados += ganadosGanador;
      teGanador.cantidad_rounds_perdidos += ganadosPerdedor;
    }

    if (!isPlaceholder(perdedor)) {
      const tePerdedor = torneoEquipo.find(
        t => t.id_torneo === idTorneo && t.id_equipo === perdedor
      );
      if (tePerdedor) {
        tePerdedor.cantidad_combates += 1;
        tePerdedor.cantidad_derrotas += 1;
        tePerdedor.cantidad_rounds_ganados += ganadosPerdedor;
        tePerdedor.cantidad_rounds_perdidos += ganadosGanador;
      }
    }

    // Bracket propagation via keys
    if (combat._idLlave) {
      const llave = bracketTemplate.find(k => k.idLlave === combat._idLlave);
      if (llave) {
        const parents = bracketTemplate.filter(k => k.idLlaveA === llave.idLlave || k.idLlaveB === llave.idLlave);
        parents.forEach(parent => {
          const parentCombat = combates.find(c =>
            c.id_torneo === idTorneo && c._idLlave === parent.idLlave && !c.id_equipo_ganador
          );
          if (!parentCombat) return;

          const isFeederA = parent.idLlaveA === llave.idLlave;
          if (parent.esTercerPuesto) {
            if (!isPlaceholder(perdedor) && isFeederA) parentCombat.id_equipo_a = perdedor;
            if (!isPlaceholder(perdedor) && !isFeederA) parentCombat.id_equipo_b = perdedor;
            // Auto-close 3rd place if only one real team
            const otherSide = isFeederA ? parentCombat.id_equipo_b : parentCombat.id_equipo_a;
            const otherDep = isFeederA ? parentCombat._dependsOnB : parentCombat._dependsOnA;
            if (otherSide && isPlaceholder(otherSide) && otherDep) {
              const otherCombat = combates.find(c => c.id_combate === otherDep);
              if (otherCombat && otherCombat.id_equipo_ganador && !isPlaceholder(otherCombat.id_equipo_ganador)) {
                parentCombat.id_equipo_ganador = isFeederA ? parentCombat.id_equipo_a : parentCombat.id_equipo_b;
              }
            }
          } else {
            if (isFeederA) parentCombat.id_equipo_a = realWinnerId;
            else parentCombat.id_equipo_b = realWinnerId;
          }
        });
      }
    }

    // Resolve old _w_ placeholders
    const wPlaceholder = `_w_${idCombate}`;
    combates.forEach(c => {
      if (c.id_torneo !== idTorneo) return;
      if (c.id_equipo_a === wPlaceholder) c.id_equipo_a = realWinnerId;
      if (c.id_equipo_b === wPlaceholder) c.id_equipo_b = realWinnerId;
    });

    return {
      mensaje: 'Combate cerrado exitosamente',
      roundsGanadosGanador: ganadosGanador,
      roundsGanadosPerdedor: ganadosPerdedor,
    };
  },
};

// ==== Implementación real (HTTP) ====

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

const realAuthService = {
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

const realTournamentService = {
  async validarOTP(codigo) {
    const { data } = await apiClient.post('/v1/marshall/torneo/acceso', { codigo });
    return data;
  },

  async getEquiposConPeleadores(idTorneo) {
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/equipos`);
    return data.map(mapEquipo);
  },

  async guardarNumerosPeleadores(idTorneo, numeros) {
    const { data } = await apiClient.put(`/v1/marshall/torneo/${idTorneo}/equipos/peleadores/numeros`, { numeros });
    return data;
  },

  async eliminarPeleador(idTorneo, idEquipo, idUsuario) {
    const { data } = await apiClient.delete(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}/peleador/${idUsuario}`);
    return data;
  },

  async buscarUsuarioPorDni(dni) {
    const username = encryptDni(dni);
    const { data } = await apiClient.get('/v1/marshall/usuarios', { params: { username } });
    if (!data) return null;
    return { idUsuario: data.idUsuario, nombre: data.nombre, apellido: data.apellido, dni: decryptDni(data.username) };
  },

  async crearUsuarioRapido({ nombre, apellido, dni }) {
    const { data } = await apiClient.post('/v1/marshall/usuarios', {
      nombre,
      apellido,
      username: encryptDni(dni),
    });
    return { id_usuario: data.id, nombre: data.nombre, apellido: data.apellido, dni, id_tipo_usuario: 4 };
  },

  async inscribirPeleador(idTorneo, idEquipo, idUsuario) {
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}/peleador`, { idUsuario });
    return data;
  },

  async getCombates(idTorneo) {
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/combates`);
    return { combates: (data.combates || []).map(mapCombat) };
  },

  async getEstadisticas(idTorneo) {
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/estadisticas`);
    return data;
  },

  async getGrupos(idTorneo) {
    const { data } = await apiClient.get(`/v1/marshall/torneo/${idTorneo}/grupos`);
    return data.map((g) => ({ id_equipo: g.idEquipo, grupo: g.grupo }));
  },

  async guardarGrupos(idTorneo, grupos) {
    const { data } = await apiClient.put(`/v1/marshall/torneo/${idTorneo}/grupos`, {
      grupos: grupos.map((g) => ({ idEquipo: g.id_equipo, grupo: g.grupo })),
    });
    return data;
  },

  async crearCombates(idTorneo, combatesData) {
    const esEliminatoria = combatesData.length > 0 && combatesData[0].idLlave !== undefined;
    const combates = esEliminatoria
      ? combatesData.map(mapEliminatoriaCombate)
      : combatesData.map((c, i) => ({
          tempId: String(i),
          idEquipoA: c.idEquipoA || null,
          idEquipoB: c.idEquipoB || null,
          origenA: 'equipo',
          origenB: 'equipo',
          orden: i + 1,
          fase: c.fase || 'liga',
          grupo: c.grupo ?? null,
          ronda: null,
          nivel: null,
          autoAvance: false,
        }));

    await apiClient.post(`/v1/marshall/torneo/${idTorneo}/estructura`, { combates });
    return { mensaje: 'Combates creados exitosamente', ids: [] };
  },

  async eliminarCombates(idTorneo) {
    const { data } = await apiClient.delete(`/v1/marshall/torneo/${idTorneo}/combates`);
    return data;
  },

  async eliminarEquipo(idTorneo, idEquipo) {
    const { data } = await apiClient.delete(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}`);
    return data;
  },

  async crearEquipoCoalicion(idTorneo, nombreEquipo) {
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/equipo`, { nombre: nombreEquipo });
    return { id_equipo: data.id, nombre: data.nombre, mensaje: data.mensaje };
  },

  async setCabezaSerie(idTorneo, idEquipo, esCabezaSerie) {
    const { data } = await apiClient.put(`/v1/marshall/torneo/${idTorneo}/equipo/${idEquipo}/cabeza-serie`, { esCabezaSerie });
    return data;
  },

  async sorteo(idTorneo, config) {
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/sorteo`, config);
    return data;
  },

  async crearTorneoVacio() {
    throw new Error('Crear torneo no está disponible contra el backend real (solo modo demo)');
  },
};

const realCombatService = {
  async grabarRound(idTorneo, idCombate, roundData) {
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/combate/${idCombate}/round`, roundData);
    return data;
  },

  async cerrarCombate(idTorneo, idCombate, idEquipoGanador) {
    const { data } = await apiClient.post(`/v1/marshall/torneo/${idTorneo}/combate/${idCombate}/cerrar`, { idEquipoGanador });
    return data;
  },
};

const authService = USE_MOCKS ? mockAuthService : realAuthService;
const tournamentService = USE_MOCKS ? mockTournamentService : realTournamentService;
const combatService = USE_MOCKS ? mockCombatService : realCombatService;

export { authService, tournamentService, combatService, USE_MOCKS };

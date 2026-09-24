import {
  usuarios,
  torneos,
  torneoEquipo,
  torneoEquipoPeleador,
  equipos,
  colores,
  combates,
  roundCombate,
  equiposPorGrupo,
  bracketTemplate,
} from './mocks/data';

export const DEMO_TORNEO_ID = 'demo-torneo';
export const DEMO_CODE = '!!!!!!';

// Estado mutable en memoria. Se pierde al refrescar la página.
let demoState = {
  torneo: {
    id: DEMO_TORNEO_ID,
    nombre: 'Torneo Demo',
    localizacion: 'Modo demostración',
    fechaTorneo: '2026-12-01',
    modalidad: 'Buhurt',
    categoria: '5 vs 5',
    genero: 'Masculino',
    idTipoTorneo: 1,
    organizado: true,
  },
  usuarios: JSON.parse(JSON.stringify(usuarios)),
  equipos: JSON.parse(JSON.stringify(equipos)),
  torneoEquipo: JSON.parse(JSON.stringify(torneoEquipo)).map(te => ({
    ...te,
    posicion: te.posicion ?? null,
    cantidad_combates: te.cantidad_combates ?? 0,
    cantidad_victorias: te.cantidad_victorias ?? 0,
    cantidad_derrotas: te.cantidad_derrotas ?? 0,
    cantidad_rounds_ganados: te.cantidad_rounds_ganados ?? 0,
    cantidad_rounds_perdidos: te.cantidad_rounds_perdidos ?? 0,
    cantidad_hombres_en_pie: te.cantidad_hombres_en_pie ?? 0,
    es_cabeza_serie: te.es_cabeza_serie ?? 0,
  })),
  torneoEquipoPeleador: JSON.parse(JSON.stringify(torneoEquipoPeleador)),
  combates: JSON.parse(JSON.stringify(combates)),
  roundCombate: JSON.parse(JSON.stringify(roundCombate)),
  roundPeleador: [],
  equiposPorGrupo: JSON.parse(JSON.stringify(equiposPorGrupo)),
};

export function resetDemoState() {
  demoState = {
    torneo: {
      id: DEMO_TORNEO_ID,
      nombre: 'Torneo Demo',
      localizacion: 'Modo demostración',
      fechaTorneo: '2026-12-01',
      modalidad: 'Buhurt',
      categoria: '5 vs 5',
      genero: 'Masculino',
      idTipoTorneo: 1,
      organizado: true,
    },
    usuarios: JSON.parse(JSON.stringify(usuarios)),
    equipos: JSON.parse(JSON.stringify(equipos)),
    torneoEquipo: JSON.parse(JSON.stringify(torneoEquipo)).map(te => ({
      ...te,
      posicion: te.posicion ?? null,
      cantidad_combates: te.cantidad_combates ?? 0,
      cantidad_victorias: te.cantidad_victorias ?? 0,
      cantidad_derrotas: te.cantidad_derrotas ?? 0,
      cantidad_rounds_ganados: te.cantidad_rounds_ganados ?? 0,
      cantidad_rounds_perdidos: te.cantidad_rounds_perdidos ?? 0,
      cantidad_hombres_en_pie: te.cantidad_hombres_en_pie ?? 0,
      es_cabeza_serie: te.es_cabeza_serie ?? 0,
    })),
    torneoEquipoPeleador: JSON.parse(JSON.stringify(torneoEquipoPeleador)),
    combates: JSON.parse(JSON.stringify(combates)),
    roundCombate: JSON.parse(JSON.stringify(roundCombate)),
    roundPeleador: [],
    equiposPorGrupo: JSON.parse(JSON.stringify(equiposPorGrupo)),
  };
}

function findUsuario(id) {
  return demoState.usuarios.find(u => u.id_usuario === id) || null;
}

function findEquipo(id) {
  return demoState.equipos.find(e => e.id_equipo === id) || null;
}

function getColoresEquipo(equipo) {
  return [equipo.id_color1, equipo.id_color2, equipo.id_color3]
    .map(id => colores.find(c => c.id_color === id))
    .filter(Boolean);
}

function getPeleadoresEquipoEnTorneo(idTorneo, idEquipo) {
  return demoState.torneoEquipoPeleador
    .filter(tep => tep.id_torneo === idTorneo && tep.id_equipo === idEquipo)
    .map(tep => {
      const usuario = findUsuario(tep.id_usuario);
      return {
        ...tep,
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        dni: usuario?.dni || usuario?.username || '',
      };
    });
}

export function getDemoTorneo() {
  return { ...demoState.torneo, isDemo: true };
}

export function getDemoEquipos(idTorneo) {
  return demoState.torneoEquipo
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

export function guardarNumerosPeleadores(idTorneo, numeros) {
  numeros.forEach(({ idEquipo, idUsuario, numeroPeleador }) => {
    const tep = demoState.torneoEquipoPeleador.find(
      t => t.id_torneo === idTorneo && t.id_equipo === idEquipo && t.id_usuario === idUsuario
    );
    if (tep) tep.numero_peleador = numeroPeleador;
  });
  return { mensaje: 'Números guardados exitosamente' };
}

export function eliminarPeleador(idTorneo, idEquipo, idUsuario) {
  const idx = demoState.torneoEquipoPeleador.findIndex(
    t => t.id_torneo === idTorneo && t.id_equipo === idEquipo && t.id_usuario === idUsuario
  );
  if (idx !== -1) demoState.torneoEquipoPeleador.splice(idx, 1);
  return { mensaje: 'Peleador eliminado' };
}

export function inscribirPeleador(idTorneo, idEquipo, idUsuario) {
  const existe = demoState.torneoEquipoPeleador.some(
    t => t.id_torneo === idTorneo && t.id_equipo === idEquipo && t.id_usuario === idUsuario
  );
  if (existe) return { error: 'El peleador ya está inscripto en el equipo' };
  demoState.torneoEquipoPeleador.push({
    id_torneo: idTorneo,
    id_equipo: idEquipo,
    id_usuario: idUsuario,
    numero_peleador: 0,
    cantidad_amarillas: 0,
    descalificado: 0,
  });
  return { mensaje: 'Peleador inscripto exitosamente' };
}

export function crearEquipoCoalicion(idTorneo, nombreEquipo) {
  const idEquipo = `equipo-coal-${Date.now()}`;
  demoState.equipos.push({
    id_equipo: idEquipo,
    nombre: nombreEquipo,
    logo: null,
    fecha_creacion: demoState.torneo.fechaTorneo,
    id_color1: 1,
    id_color2: 2,
    id_color3: 1,
    id_categoria: 1,
    id_modalidad: 1,
    id_genero: 1,
  });
  demoState.torneoEquipo.push({
    id_equipo: idEquipo,
    id_torneo: idTorneo,
    posicion: null,
    cantidad_combates: 0,
    cantidad_victorias: 0,
    cantidad_derrotas: 0,
    cantidad_rounds_ganados: 0,
    cantidad_rounds_perdidos: 0,
    cantidad_hombres_en_pie: 0,
    es_cabeza_serie: 0,
  });
  return { id_equipo: idEquipo, nombre: nombreEquipo, mensaje: 'Equipo coalición creado' };
}

export function eliminarEquipo(idTorneo, idEquipo) {
  const teIdx = demoState.torneoEquipo.findIndex(t => t.id_torneo === idTorneo && t.id_equipo === idEquipo);
  if (teIdx !== -1) demoState.torneoEquipo.splice(teIdx, 1);
  for (let i = demoState.torneoEquipoPeleador.length - 1; i >= 0; i--) {
    const tep = demoState.torneoEquipoPeleador[i];
    if (tep.id_torneo === idTorneo && tep.id_equipo === idEquipo) {
      demoState.torneoEquipoPeleador.splice(i, 1);
    }
  }
  return { mensaje: 'Equipo eliminado del torneo' };
}

export function setCabezaSerie(idTorneo, idEquipo, esCabezaSerie) {
  const te = demoState.torneoEquipo.find(t => t.id_torneo === idTorneo && t.id_equipo === idEquipo);
  if (te) te.es_cabeza_serie = esCabezaSerie ? 1 : 0;
  return { mensaje: 'Cabeza de serie actualizada' };
}

function isPlaceholder(id) {
  return id && (id.startsWith('_w_') || id.startsWith('_key_'));
}

function propagarAutoAvance(idTorneo, fromCombatId, equipoId) {
  const fromCombat = demoState.combates.find(c => c.id_combate === fromCombatId);
  if (!fromCombat || !fromCombat._idLlave) return;

  const llave = bracketTemplate.find(k => k.idLlave === fromCombat._idLlave);
  if (!llave) return;

  const parents = bracketTemplate.filter(k => k.idLlaveA === llave.idLlave || k.idLlaveB === llave.idLlave);
  parents.forEach(parent => {
    if (parent.esTercerPuesto) return;

    const parentCombat = demoState.combates.find(c =>
      c.id_torneo === idTorneo && c._idLlave === parent.idLlave && !c.id_equipo_ganador
    );
    if (!parentCombat) return;

    if (parent.idLlaveA === llave.idLlave) parentCombat.id_equipo_a = equipoId;
    if (parent.idLlaveB === llave.idLlave) parentCombat.id_equipo_b = equipoId;

    if (parentCombat.id_equipo_a && parentCombat.id_equipo_b &&
        !isPlaceholder(parentCombat.id_equipo_a) && !isPlaceholder(parentCombat.id_equipo_b) &&
        parentCombat.id_equipo_a === parentCombat.id_equipo_b) {
      parentCombat.id_equipo_ganador = parentCombat.id_equipo_a;
      parentCombat.cantidad_round_ganados_ganador = 1;
      propagarAutoAvance(idTorneo, parentCombat.id_combate, parentCombat.id_equipo_a);
    }
  });
}

export function crearCombates(idTorneo, combatesData) {
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

    demoState.combates.push({
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
      const combat = demoState.combates.find(cb => cb.id_combate === id);
      if (combat) {
        combat.id_equipo_ganador = c.idEquipoA;
        combat.cantidad_round_ganados_ganador = 1;
      }
      propagarAutoAvance(idTorneo, id, c.idEquipoA);
    }
  });

  return { mensaje: 'Combates creados exitosamente', ids };
}

export function eliminarCombates(idTorneo) {
  for (let i = demoState.combates.length - 1; i >= 0; i--) {
    if (demoState.combates[i].id_torneo === idTorneo) demoState.combates.splice(i, 1);
  }
  return { mensaje: 'Combates eliminados exitosamente' };
}

export function getDemoCombates(idTorneo) {
  const torneoCombates = demoState.combates.filter(c => c.id_torneo === idTorneo).sort((a, b) => a.orden - b.orden);

  return {
    combates: torneoCombates.map(c => {
      const getDepInfo = (side) => {
        const depKey = side === 'A' ? '_dependsOnA' : '_dependsOnB';
        const placeholderKey = side === 'A' ? 'id_equipo_a' : 'id_equipo_b';
        if (!c[placeholderKey] || !isPlaceholder(c[placeholderKey])) return null;

        const depId = c[depKey];
        if (!depId) return { bloqueado: true, nombre: 'TBD' };

        const depCombat = demoState.combates.find(cb => cb.id_combate === depId);
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

      const rounds = demoState.roundCombate
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
    }),
  };
}

export function getDemoGrupos(idTorneo) {
  return demoState.equiposPorGrupo.filter(g => g.id_torneo === idTorneo);
}

export function guardarGrupos(idTorneo, grupos) {
  for (let i = demoState.equiposPorGrupo.length - 1; i >= 0; i--) {
    if (demoState.equiposPorGrupo[i].id_torneo === idTorneo) {
      demoState.equiposPorGrupo.splice(i, 1);
    }
  }
  demoState.equiposPorGrupo.push(...grupos.map(g => ({ ...g, id_torneo: idTorneo })));
  return { mensaje: 'Grupos guardados exitosamente' };
}

export function getDemoEstadisticas(idTorneo) {
  const equiposStats = demoState.torneoEquipo
    .filter(te => te.id_torneo === idTorneo)
    .map(te => {
      const eq = findEquipo(te.id_equipo);
      return {
        id: te.id_equipo,
        nombre: eq?.nombre || 'Equipo',
        combates: te.cantidad_combates,
        victorias: te.cantidad_victorias,
        derrotas: te.cantidad_derrotas,
        roundsGanados: te.cantidad_rounds_ganados,
        roundsPerdidos: te.cantidad_rounds_perdidos,
      };
    });
  return { equipos: equiposStats };
}

export function grabarRound(idTorneo, idCombate, roundData) {
  const maxOrden = demoState.roundCombate
    .filter(rc => rc.id_torneo === idTorneo && rc.id_combate === idCombate)
    .reduce((max, rc) => Math.max(max, rc.orden), 0);

  demoState.roundCombate.push({
    id_torneo: idTorneo,
    id_combate: idCombate,
    orden: maxOrden + 1,
    round: roundData.round,
    id_equipo_ganador: roundData.idEquipoGanador,
    puntos_ganador: roundData.puntosGanador,
    puntos_perdedor: roundData.puntosPerdedor,
    hombres_en_pie_a: roundData.hombresEnPieA ?? 0,
    hombres_en_pie_b: roundData.hombresEnPieB ?? 0,
  });

  if (Array.isArray(roundData.peleadores)) {
    roundData.peleadores.forEach(p => {
      demoState.roundPeleador.push({
        id_torneo: idTorneo,
        id_combate: idCombate,
        orden: maxOrden + 1,
        round: roundData.round,
        id_usuario: p.idUsuario,
        en_pie: p.enPie ? 1 : 0,
        amonestado: p.amonestado ? 1 : 0,
        expulsado: p.expulsado ? 1 : 0,
      });
    });
  }

  return { mensaje: 'Round registrado exitosamente' };
}

export function cerrarCombate(idTorneo, idCombate, idEquipoGanador) {
  const combate = demoState.combates.find(c => c.id_torneo === idTorneo && c.id_combate === idCombate);
  if (!combate) return { error: 'Combate no encontrado' };

  combate.id_equipo_ganador = idEquipoGanador;

  const rounds = demoState.roundCombate.filter(rc => rc.id_torneo === idTorneo && rc.id_combate === idCombate);
  const ganadosGanador = rounds.filter(r => r.id_equipo_ganador === idEquipoGanador).length;
  const ganadosPerdedor = rounds.length - ganadosGanador;
  combate.cantidad_round_ganados_ganador = ganadosGanador;
  combate.cantidad_round_ganados_perdedor = ganadosPerdedor;

  // Actualizar stats de equipos
  const idPerdedor = combate.id_equipo_a === idEquipoGanador ? combate.id_equipo_b : combate.id_equipo_a;
  const teGanador = demoState.torneoEquipo.find(te => te.id_torneo === idTorneo && te.id_equipo === idEquipoGanador);
  const tePerdedor = demoState.torneoEquipo.find(te => te.id_torneo === idTorneo && te.id_equipo === idPerdedor);
  if (teGanador) {
    teGanador.cantidad_combates += 1;
    teGanador.cantidad_victorias += 1;
    teGanador.cantidad_rounds_ganados += ganadosGanador;
    teGanador.cantidad_rounds_perdidos += ganadosPerdedor;
  }
  if (tePerdedor) {
    tePerdedor.cantidad_combates += 1;
    tePerdedor.cantidad_derrotas += 1;
    tePerdedor.cantidad_rounds_ganados += ganadosPerdedor;
    tePerdedor.cantidad_rounds_perdidos += ganadosGanador;
  }

  propagarAutoAvance(idTorneo, idCombate, idEquipoGanador);
  return { mensaje: 'Combate cerrado exitosamente' };
}

export function buscarUsuarioPorUsername(username) {
  const u = demoState.usuarios.find(us => us.username === username);
  if (!u) return null;
  return {
    idUsuario: u.id_usuario,
    nombre: u.nombre,
    apellido: u.apellido,
    username: u.username,
  };
}

export function crearUsuarioRapido({ nombre, apellido, username }) {
  const idUsuario = `user-demo-${Date.now()}`;
  demoState.usuarios.push({
    id_usuario: idUsuario,
    username,
    nombre,
    apellido,
    id_tipo_usuario: 4,
  });
  return {
    idUsuario,
    nombre,
    apellido,
    username,
  };
}

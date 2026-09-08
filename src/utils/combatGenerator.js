import { bracketTemplate } from '../api/mocks/data';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getStartingKeys(n) {
  const niveles = [...new Set(bracketTemplate.map(k => k.capacidadMax).filter(c => c > 2))]
    .sort((a, b) => a - b);
  const target = niveles.find(c => c >= n);
  if (!target) return bracketTemplate.filter(k => k.capacidadMax === 32);
  return bracketTemplate.filter(k => k.capacidadMax === target);
}

function getAncestorKeys(leafIds, tercerPuesto) {
  const used = new Set();
  const queue = [...leafIds];
  while (queue.length > 0) {
    const id = queue.shift();
    used.add(id);
    const parents = bracketTemplate.filter(k => k.idLlaveA === id || k.idLlaveB === id);
    parents.forEach(p => {
      if (!used.has(p.idLlave)) queue.push(p.idLlave);
    });
  }
  if (tercerPuesto) used.add(2);
  return bracketTemplate.filter(k => used.has(k.idLlave) && k.idLlaveA && k.idLlaveB);
}

export function generarLiga(equipos) {
  const combates = [];
  for (let i = 0; i < equipos.length; i++) {
    for (let j = i + 1; j < equipos.length; j++) {
      combates.push({ idEquipoA: equipos[i].id_equipo, idEquipoB: equipos[j].id_equipo });
    }
  }
  return combates;
}

export function generarEliminatoriaDirecta(equipos, tercerPuesto = true, ordenado = false) {
  const shuffled = ordenado ? [...equipos] : shuffle([...equipos]);
  const n = shuffled.length;
  if (n < 2) return { combates: [] };

  const startingKeys = getStartingKeys(n);
  const parentKeys = getAncestorKeys(startingKeys.map(k => k.idLlave), tercerPuesto);
  const allKeys = [...startingKeys, ...parentKeys];

  const combates = [];
  const keyMap = {};

  startingKeys.forEach((k, i) => {
    const eqA = shuffled[i * 2] || null;
    const eqB = shuffled[i * 2 + 1] || null;

    if (!eqA && !eqB) return;

    const combat = {
      idLlave: k.idLlave,
      instancia: k.instancia,
      idEquipoA: eqA?.id_equipo || null,
      idEquipoB: eqB?.id_equipo || null,
      nombreEquipoA: eqA?.nombre || null,
      nombreEquipoB: eqB?.nombre || null,
      dependsOnA: null,
      dependsOnB: null,
    };

    if (eqA && !eqB) {
      combat.autoAvance = true;
    }

    combates.push(combat);
    keyMap[k.idLlave] = combates.length - 1;
  });

  parentKeys.forEach(pk => {
    const childAKey = pk.idLlaveA;
    const childBKey = pk.idLlaveB;
    const refA = keyMap[childAKey];
    const refB = keyMap[childBKey];
    if (refA === undefined && refB === undefined) return;

    const combat = {
      idLlave: pk.idLlave,
      instancia: pk.instancia,
      idEquipoA: refA !== undefined ? `_key_${childAKey}` : null,
      idEquipoB: refB !== undefined ? `_key_${childBKey}` : null,
      nombreEquipoA: refA !== undefined ? `Ganador ${childAKey}` : null,
      nombreEquipoB: refB !== undefined ? `Ganador ${childBKey}` : null,
      dependsOnA: refA !== undefined ? refA : null,
      dependsOnB: refB !== undefined ? refB : null,
      esTercerPuesto: pk.esTercerPuesto || false,
    };

    combates.push(combat);
    keyMap[pk.idLlave] = combates.length - 1;
  });

  return { combates, estructura: 'eliminatoria', keyMap };
}

export function generarGruposYEliminatoria(equiposPorGrupo) {
  const combatesFaseGrupos = [];
  const nombresGrupos = Object.keys(equiposPorGrupo);

  nombresGrupos.forEach(grupo => {
    const eqs = equiposPorGrupo[grupo];
    for (let i = 0; i < eqs.length; i++) {
      for (let j = i + 1; j < eqs.length; j++) {
        combatesFaseGrupos.push({
          idEquipoA: eqs[i].id_equipo,
          idEquipoB: eqs[j].id_equipo,
          fase: 'grupos',
          grupo,
        });
      }
    }
  });

  return combatesFaseGrupos;
}

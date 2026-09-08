export function distribuirAleatoriamente(equipos, cantidadGrupos) {
  const shuffled = [...equipos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const grupos = Array.from({ length: cantidadGrupos }, (_, i) => ({
    numero: i + 1,
    nombre: `Grupo ${String.fromCharCode(65 + i)}`,
    equipos: [],
  }));

  shuffled.forEach((equipo, idx) => {
    grupos[idx % cantidadGrupos].equipos.push(equipo);
  });

  return grupos;
}

export function validarDistribucion(grupos, equipos) {
  const equiposEnGrupos = grupos.flatMap(g => g.equipos.map(e => e.id_equipo));
  const equiposIds = equipos.map(e => e.id_equipo);

  const faltantes = equiposIds.filter(id => !equiposEnGrupos.includes(id));
  const duplicados = equiposEnGrupos.filter((id, idx) => equiposEnGrupos.indexOf(id) !== idx);

  return {
    valida: faltantes.length === 0 && duplicados.length === 0,
    faltantes,
    duplicados,
  };
}

export function getEquiposAsignadosPorGrupo(grupos) {
  const result = {};
  grupos.forEach(g => {
    result[g.nombre] = g.equipos;
  });
  return result;
}

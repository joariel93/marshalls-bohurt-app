const colores = [
  { id_color: 1, nombre: "Negro", hex: "#000000" },
  { id_color: 2, nombre: "Blanco", hex: "#ffffff" },
  { id_color: 3, nombre: "Rojo", hex: "#e00e00" },
  { id_color: 4, nombre: "Azul", hex: "#004cff" },
  { id_color: 5, nombre: "Verde", hex: "#16a34a" },
  { id_color: 6, nombre: "Amarillo", hex: "#eab308" },
  { id_color: 7, nombre: "Naranja", hex: "#ff6a00" },
  { id_color: 8, nombre: "Rosa", hex: "#ec4899" },
  { id_color: 9, nombre: "Violeta", hex: "#8b5cf6" },
  { id_color: 10, nombre: "Marrón", hex: "#92400e" },
  { id_color: 11, nombre: "Gris", hex: "#6b7280" },
  { id_color: 12, nombre: "Celeste", hex: "#38bdf8" },
];

const genero = [
  { id_genero: 1, nombre: "Masculino" },
  { id_genero: 2, nombre: "Femenino" },
];

const modalidad = [
  { id_modalidad: 1, nombre: "Buhurt" },
  { id_modalidad: 2, nombre: "Duelo" },
  { id_modalidad: 3, nombre: "Profight" },
];

const categoria = [
  { id_categoria: 1, id_modalidad: 1, nombre: "5 vs 5" },
  { id_categoria: 2, id_modalidad: 1, nombre: "3 vs 3" },
  { id_categoria: 3, id_modalidad: 2, nombre: "Heraldico" },
  { id_categoria: 4, id_modalidad: 2, nombre: "80kg" },
];

const tipoTorneo = [
  { id_tipo_torneo: 1, nombre: "Grupos y eliminatorias", con_grupos: 1, con_eliminatorias: 1 },
  { id_tipo_torneo: 2, nombre: "Eliminatorias", con_grupos: 0, con_eliminatorias: 1 },
  { id_tipo_torneo: 3, nombre: "Liga", con_grupos: 0, con_eliminatorias: 0 },
];

const usuarios = [
  { id_usuario: "user-marshall-001", username: "marshall@test.com", nombre: "Carlos", apellido: "Rodriguez", id_tipo_usuario: 5 },
  { id_usuario: "user-f1", username: "juan.perez@test.com", nombre: "Juan", apellido: "Pérez", id_tipo_usuario: 4, dni: "30123456" },
  { id_usuario: "user-f2", username: "pedro.gomez@test.com", nombre: "Pedro", apellido: "Gómez", id_tipo_usuario: 4, dni: "30234567" },
  { id_usuario: "user-f3", username: "lucas.diaz@test.com", nombre: "Lucas", apellido: "Díaz", id_tipo_usuario: 4, dni: "30345678" },
  { id_usuario: "user-f4", username: "mateo.fernandez@test.com", nombre: "Mateo", apellido: "Fernández", id_tipo_usuario: 4, dni: "30456789" },
  { id_usuario: "user-f5", username: "santiago.lopez@test.com", nombre: "Santiago", apellido: "López", id_tipo_usuario: 4, dni: "30567890" },
  { id_usuario: "user-f6", username: "nicolas.martinez@test.com", nombre: "Nicolás", apellido: "Martínez", id_tipo_usuario: 4, dni: "30678901" },
  { id_usuario: "user-f7", username: "facundo.garcia@test.com", nombre: "Facundo", apellido: "García", id_tipo_usuario: 4, dni: "30789012" },
  { id_usuario: "user-f8", username: "tomas.ramirez@test.com", nombre: "Tomás", apellido: "Ramírez", id_tipo_usuario: 4, dni: "30890123" },
  { id_usuario: "user-f9", username: "joaquin.torres@test.com", nombre: "Joaquín", apellido: "Torres", id_tipo_usuario: 4, dni: "30901234" },
  { id_usuario: "user-f10", username: "federico.ruiz@test.com", nombre: "Federico", apellido: "Ruiz", id_tipo_usuario: 4, dni: "31012345" },
  { id_usuario: "user-f11", username: "agustin.alvarez@test.com", nombre: "Agustín", apellido: "Álvarez", id_tipo_usuario: 4, dni: "31123456" },
  { id_usuario: "user-f12", username: "emiliano.romero@test.com", nombre: "Emiliano", apellido: "Romero", id_tipo_usuario: 4, dni: "31234567" },
  { id_usuario: "user-f13", username: "gonzalo.sosa@test.com", nombre: "Gonzalo", apellido: "Sosa", id_tipo_usuario: 4, dni: "31345678" },
  { id_usuario: "user-f14", username: "sebastian.flores@test.com", nombre: "Sebastián", apellido: "Flores", id_tipo_usuario: 4, dni: "31456789" },
  { id_usuario: "user-f15", username: "matias.acosta@test.com", nombre: "Matías", apellido: "Acosta", id_tipo_usuario: 4, dni: "31567890" },
  { id_usuario: "user-f16", username: "leandro.benitez@test.com", nombre: "Leandro", apellido: "Benítez", id_tipo_usuario: 4, dni: "31678901" },
  { id_usuario: "user-f17", username: "pablo.medina@test.com", nombre: "Pablo", apellido: "Medina", id_tipo_usuario: 4, dni: "31789012" },
  { id_usuario: "user-f18", username: "diego.castro@test.com", nombre: "Diego", apellido: "Castro", id_tipo_usuario: 4, dni: "31890123" },
  { id_usuario: "user-f19", username: "alejandro.suarez@test.com", nombre: "Alejandro", apellido: "Suárez", id_tipo_usuario: 4, dni: "31901234" },
  { id_usuario: "user-f20", username: "valentin.morales@test.com", nombre: "Valentín", apellido: "Morales", id_tipo_usuario: 4, dni: "32012345" },
  { id_usuario: "user-f21", username: "maximiliano.ortega@test.com", nombre: "Maximiliano", apellido: "Ortega", id_tipo_usuario: 4, dni: "32123456" },
  { id_usuario: "user-f22", username: "esteban.vega@test.com", nombre: "Esteban", apellido: "Vega", id_tipo_usuario: 4, dni: "32234567" },
  { id_usuario: "user-f23", username: "gabriel.gutierrez@test.com", nombre: "Gabriel", apellido: "Gutiérrez", id_tipo_usuario: 4, dni: "32345678" },
  { id_usuario: "user-f24", username: "fernando.navarro@test.com", nombre: "Fernando", apellido: "Navarro", id_tipo_usuario: 4, dni: "32456789" },
  { id_usuario: "user-f25", username: "rodrigo.rios@test.com", nombre: "Rodrigo", apellido: "Ríos", id_tipo_usuario: 4, dni: "32567890" },
  { id_usuario: "user-f26", username: "martin.mendoza@test.com", nombre: "Martín", apellido: "Mendoza", id_tipo_usuario: 4, dni: "32678901" },
  { id_usuario: "user-f27", username: "luciano.paredes@test.com", nombre: "Luciano", apellido: "Paredes", id_tipo_usuario: 4, dni: "32789012" },
  { id_usuario: "user-f28", username: "franco.cabrera@test.com", nombre: "Franco", apellido: "Cabrera", id_tipo_usuario: 4, dni: "32890123" },
  { id_usuario: "user-f29", username: "ignacio.molina@test.com", nombre: "Ignacio", apellido: "Molina", id_tipo_usuario: 4, dni: "32901234" },
  { id_usuario: "user-f30", nombre: "Ezequiel", apellido: "Silva", dni: "33012345" },
];

const equipos = [
  {
    id_equipo: "equipo-001", nombre: "Mercenarios", logo: null,
    id_color1: 1, id_color2: 2, id_color3: 7,
    id_categoria: 1, id_modalidad: 1, id_genero: 1
  },
  {
    id_equipo: "equipo-002", nombre: "Guardianes", logo: null,
    id_color1: 1, id_color2: 3, id_color3: 2,
    id_categoria: 1, id_modalidad: 1, id_genero: 1
  },
  {
    id_equipo: "equipo-003", nombre: "Acero", logo: null,
    id_color1: 4, id_color2: 11, id_color3: 1,
    id_categoria: 1, id_modalidad: 1, id_genero: 1
  },
  {
    id_equipo: "equipo-004", nombre: "Fénix", logo: null,
    id_color1: 3, id_color2: 6, id_color3: 7,
    id_categoria: 1, id_modalidad: 1, id_genero: 1
  },
  {
    id_equipo: "equipo-005", nombre: "Titanes", logo: null,
    id_color1: 5, id_color2: 1, id_color3: 2,
    id_categoria: 1, id_modalidad: 1, id_genero: 1
  },
  {
    id_equipo: "equipo-006", nombre: "Lobos", logo: null,
    id_color1: 11, id_color2: 4, id_color3: 1,
    id_categoria: 1, id_modalidad: 1, id_genero: 1
  },
];

const torneos = [
  {
    id_torneo: "torneo-001",
    nombre: "Torneo Nacional 2026",
    localizacion: "Buenos Aires",
    fecha_torneo: "2026-12-01",
    fecha_cierre_inscripcion: "2026-11-15",
    id_modalidad: 1,
    id_categoria: 1,
    id_genero: 1,
    id_tipo_torneo: 1,
    password: "ABC123",
    passwordJugadores: "PLAY456",
  },
  {
    id_torneo: "torneo-002",
    nombre: "Copa Regional 2026",
    localizacion: "Córdoba",
    fecha_torneo: "2026-12-15",
    fecha_cierre_inscripcion: "2026-11-30",
    id_modalidad: 1,
    id_categoria: 2,
    id_genero: 1,
    id_tipo_torneo: 3,
    password: "DEF456",
    passwordJugadores: "PLAY789",
  },
];

const torneoEquipo = [
  { id_equipo: "equipo-001", id_torneo: "torneo-001", cantidad_combates: 2, cantidad_victorias: 2, cantidad_derrotas: 0, cantidad_rounds_ganados: 4, cantidad_rounds_perdidos: 1 },
  { id_equipo: "equipo-002", id_torneo: "torneo-001", cantidad_combates: 2, cantidad_victorias: 1, cantidad_derrotas: 1, cantidad_rounds_ganados: 3, cantidad_rounds_perdidos: 3 },
  { id_equipo: "equipo-003", id_torneo: "torneo-001", cantidad_combates: 2, cantidad_victorias: 0, cantidad_derrotas: 2, cantidad_rounds_ganados: 1, cantidad_rounds_perdidos: 4 },
  { id_equipo: "equipo-004", id_torneo: "torneo-002", cantidad_combates: 0, cantidad_victorias: 0, cantidad_derrotas: 0, cantidad_rounds_ganados: 0, cantidad_rounds_perdidos: 0 },
  { id_equipo: "equipo-005", id_torneo: "torneo-002", cantidad_combates: 0, cantidad_victorias: 0, cantidad_derrotas: 0, cantidad_rounds_ganados: 0, cantidad_rounds_perdidos: 0 },
  { id_equipo: "equipo-006", id_torneo: "torneo-002", cantidad_combates: 0, cantidad_victorias: 0, cantidad_derrotas: 0, cantidad_rounds_ganados: 0, cantidad_rounds_perdidos: 0 },
];

const torneoEquipoPeleador = [
  { id_torneo: "torneo-001", id_equipo: "equipo-001", id_usuario: "user-f1", numero_peleador: 1, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-001", id_usuario: "user-f2", numero_peleador: 2, cantidad_amarillas: 1, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-001", id_usuario: "user-f3", numero_peleador: 3, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-001", id_usuario: "user-f4", numero_peleador: 4, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-001", id_usuario: "user-f5", numero_peleador: 5, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-002", id_usuario: "user-f6", numero_peleador: 10, cantidad_amarillas: 2, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-002", id_usuario: "user-f7", numero_peleador: 11, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-002", id_usuario: "user-f8", numero_peleador: 12, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-002", id_usuario: "user-f9", numero_peleador: 13, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-002", id_usuario: "user-f10", numero_peleador: 14, cantidad_amarillas: 0, descalificado: 1 },
  { id_torneo: "torneo-001", id_equipo: "equipo-003", id_usuario: "user-f11", numero_peleador: 5, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-003", id_usuario: "user-f12", numero_peleador: 7, cantidad_amarillas: 1, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-003", id_usuario: "user-f13", numero_peleador: 8, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-003", id_usuario: "user-f14", numero_peleador: 3, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-001", id_equipo: "equipo-003", id_usuario: "user-f15", numero_peleador: 9, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-004", id_usuario: "user-f16", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-004", id_usuario: "user-f17", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-004", id_usuario: "user-f18", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-004", id_usuario: "user-f19", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-004", id_usuario: "user-f20", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-005", id_usuario: "user-f21", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-005", id_usuario: "user-f22", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-005", id_usuario: "user-f23", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-005", id_usuario: "user-f24", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-005", id_usuario: "user-f25", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-006", id_usuario: "user-f26", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-006", id_usuario: "user-f27", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-006", id_usuario: "user-f28", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
  { id_torneo: "torneo-002", id_equipo: "equipo-006", id_usuario: "user-f29", numero_peleador: 0, cantidad_amarillas: 0, descalificado: 0 },
];

const combates = [
  {
    id_torneo: "torneo-001", id_combate: "combate-001", orden: 1,
    id_equipo_a: "equipo-001", id_equipo_b: "equipo-002",
    id_equipo_ganador: "equipo-001",
    cantidad_round_ganados_ganador: 2, cantidad_round_ganados_perdedor: 1,
    link: null,
  },
  {
    id_torneo: "torneo-001", id_combate: "combate-002", orden: 2,
    id_equipo_a: "equipo-001", id_equipo_b: "equipo-003",
    id_equipo_ganador: "equipo-001",
    cantidad_round_ganados_ganador: 2, cantidad_round_ganados_perdedor: 0,
    link: null,
  },
  {
    id_torneo: "torneo-001", id_combate: "combate-003", orden: 3,
    id_equipo_a: "equipo-002", id_equipo_b: "equipo-003",
    id_equipo_ganador: "equipo-002",
    cantidad_round_ganados_ganador: 2, cantidad_round_ganados_perdedor: 1,
    link: null,
  },
];

const roundCombate = [
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_equipo_ganador: "equipo-001", puntos_ganador: 5, puntos_perdedor: 3 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 2, id_equipo_ganador: "equipo-002", puntos_ganador: 6, puntos_perdedor: 4 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 3, id_equipo_ganador: "equipo-001", puntos_ganador: 7, puntos_perdedor: 2 },
  { id_torneo: "torneo-001", id_combate: "combate-002", orden: 2, round: 1, id_equipo_ganador: "equipo-001", puntos_ganador: 8, puntos_perdedor: 2 },
  { id_torneo: "torneo-001", id_combate: "combate-002", orden: 2, round: 2, id_equipo_ganador: "equipo-001", puntos_ganador: 5, puntos_perdedor: 3 },
  { id_torneo: "torneo-001", id_combate: "combate-003", orden: 3, round: 1, id_equipo_ganador: "equipo-002", puntos_ganador: 4, puntos_perdedor: 4 },
  { id_torneo: "torneo-001", id_combate: "combate-003", orden: 3, round: 2, id_equipo_ganador: "equipo-003", puntos_ganador: 6, puntos_perdedor: 3 },
  { id_torneo: "torneo-001", id_combate: "combate-003", orden: 3, round: 3, id_equipo_ganador: "equipo-002", puntos_ganador: 5, puntos_perdedor: 2 },
];

const roundPeleador = [
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f1", en_pie: 1, amonestado: 0, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f2", en_pie: 1, amonestado: 1, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f3", en_pie: 0, amonestado: 0, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f4", en_pie: 1, amonestado: 0, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f5", en_pie: 1, amonestado: 0, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f6", en_pie: 0, amonestado: 0, expulsado: 1 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f7", en_pie: 1, amonestado: 0, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f8", en_pie: 1, amonestado: 0, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f9", en_pie: 1, amonestado: 1, expulsado: 0 },
  { id_torneo: "torneo-001", id_combate: "combate-001", orden: 1, round: 1, id_usuario: "user-f10", en_pie: 1, amonestado: 0, expulsado: 0 },
];

const equiposPorGrupo = [];

const organizacionTorneo = [
  { id_torneo: "torneo-001", id_tipo_torneo: 1, cantidad_grupos: null },
  { id_torneo: "torneo-002", id_tipo_torneo: 3, cantidad_grupos: null },
];

const torneoLuchador = [
  { id_torneo: "torneo-001", id_usuario: "user-f1", cantidad_combates: 2, cantidad_puntos: 15, cantidad_victorias: 2, cantidad_derrotas: 0, cantidad_rounds_ganados: 4, cantidad_rounds_perdidos: 1, cantidad_rounds_en_pie: 5 },
  { id_torneo: "torneo-001", id_usuario: "user-f2", cantidad_combates: 2, cantidad_puntos: 12, cantidad_victorias: 2, cantidad_derrotas: 0, cantidad_rounds_ganados: 4, cantidad_rounds_perdidos: 1, cantidad_rounds_en_pie: 4 },
  { id_torneo: "torneo-001", id_usuario: "user-f3", cantidad_combates: 2, cantidad_puntos: 10, cantidad_victorias: 2, cantidad_derrotas: 0, cantidad_rounds_ganados: 4, cantidad_rounds_perdidos: 1, cantidad_rounds_en_pie: 3 },
  { id_torneo: "torneo-001", id_usuario: "user-f4", cantidad_combates: 2, cantidad_puntos: 8, cantidad_victorias: 2, cantidad_derrotas: 0, cantidad_rounds_ganados: 4, cantidad_rounds_perdidos: 1, cantidad_rounds_en_pie: 5 },
  { id_torneo: "torneo-001", id_usuario: "user-f5", cantidad_combates: 2, cantidad_puntos: 7, cantidad_victorias: 2, cantidad_derrotas: 0, cantidad_rounds_ganados: 4, cantidad_rounds_perdidos: 1, cantidad_rounds_en_pie: 5 },
  { id_torneo: "torneo-001", id_usuario: "user-f6", cantidad_combates: 2, cantidad_puntos: 5, cantidad_victorias: 1, cantidad_derrotas: 1, cantidad_rounds_ganados: 3, cantidad_rounds_perdidos: 3, cantidad_rounds_en_pie: 3 },
  { id_torneo: "torneo-001", id_usuario: "user-f7", cantidad_combates: 2, cantidad_puntos: 6, cantidad_victorias: 1, cantidad_derrotas: 1, cantidad_rounds_ganados: 3, cantidad_rounds_perdidos: 3, cantidad_rounds_en_pie: 4 },
  { id_torneo: "torneo-001", id_usuario: "user-f8", cantidad_combates: 2, cantidad_puntos: 4, cantidad_victorias: 1, cantidad_derrotas: 1, cantidad_rounds_ganados: 3, cantidad_rounds_perdidos: 3, cantidad_rounds_en_pie: 5 },
  { id_torneo: "torneo-001", id_usuario: "user-f9", cantidad_combates: 2, cantidad_puntos: 3, cantidad_victorias: 1, cantidad_derrotas: 1, cantidad_rounds_ganados: 3, cantidad_rounds_perdidos: 3, cantidad_rounds_en_pie: 3 },
  { id_torneo: "torneo-001", id_usuario: "user-f10", cantidad_combates: 2, cantidad_puntos: 2, cantidad_victorias: 1, cantidad_derrotas: 1, cantidad_rounds_ganados: 3, cantidad_rounds_perdidos: 3, cantidad_rounds_en_pie: 2 },
  { id_torneo: "torneo-001", id_usuario: "user-f11", cantidad_combates: 2, cantidad_puntos: 4, cantidad_victorias: 0, cantidad_derrotas: 2, cantidad_rounds_ganados: 1, cantidad_rounds_perdidos: 4, cantidad_rounds_en_pie: 4 },
  { id_torneo: "torneo-001", id_usuario: "user-f12", cantidad_combates: 2, cantidad_puntos: 3, cantidad_victorias: 0, cantidad_derrotas: 2, cantidad_rounds_ganados: 1, cantidad_rounds_perdidos: 4, cantidad_rounds_en_pie: 3 },
  { id_torneo: "torneo-001", id_usuario: "user-f13", cantidad_combates: 2, cantidad_puntos: 2, cantidad_victorias: 0, cantidad_derrotas: 2, cantidad_rounds_ganados: 1, cantidad_rounds_perdidos: 4, cantidad_rounds_en_pie: 2 },
  { id_torneo: "torneo-001", id_usuario: "user-f14", cantidad_combates: 2, cantidad_puntos: 1, cantidad_victorias: 0, cantidad_derrotas: 2, cantidad_rounds_ganados: 1, cantidad_rounds_perdidos: 4, cantidad_rounds_en_pie: 3 },
  { id_torneo: "torneo-001", id_usuario: "user-f15", cantidad_combates: 2, cantidad_puntos: 2, cantidad_victorias: 0, cantidad_derrotas: 2, cantidad_rounds_ganados: 1, cantidad_rounds_perdidos: 4, cantidad_rounds_en_pie: 4 },
];

const bracketTemplate = [
  { idLlave: 1, instancia: "Final", idLlaveA: 3, idLlaveB: 4, capacidadMax: 2 },
  { idLlave: 2, instancia: "3er Puesto", idLlaveA: 3, idLlaveB: 4, esTercerPuesto: true, capacidadMax: 2 },
  { idLlave: 3, instancia: "Semifinal 1", idLlaveA: 5, idLlaveB: 6, capacidadMax: 4 },
  { idLlave: 4, instancia: "Semifinal 2", idLlaveA: 7, idLlaveB: 8, capacidadMax: 4 },
  { idLlave: 5, instancia: "Cuartos 1", idLlaveA: 9, idLlaveB: 10, capacidadMax: 8 },
  { idLlave: 6, instancia: "Cuartos 2", idLlaveA: 11, idLlaveB: 12, capacidadMax: 8 },
  { idLlave: 7, instancia: "Cuartos 3", idLlaveA: 13, idLlaveB: 14, capacidadMax: 8 },
  { idLlave: 8, instancia: "Cuartos 4", idLlaveA: 15, idLlaveB: 16, capacidadMax: 8 },
  { idLlave: 9, instancia: "Octavos 1", idLlaveA: 17, idLlaveB: 18, capacidadMax: 16 },
  { idLlave: 10, instancia: "Octavos 2", idLlaveA: 19, idLlaveB: 20, capacidadMax: 16 },
  { idLlave: 11, instancia: "Octavos 3", idLlaveA: 21, idLlaveB: 22, capacidadMax: 16 },
  { idLlave: 12, instancia: "Octavos 4", idLlaveA: 23, idLlaveB: 24, capacidadMax: 16 },
  { idLlave: 13, instancia: "Octavos 5", idLlaveA: 25, idLlaveB: 26, capacidadMax: 16 },
  { idLlave: 14, instancia: "Octavos 6", idLlaveA: 27, idLlaveB: 28, capacidadMax: 16 },
  { idLlave: 15, instancia: "Octavos 7", idLlaveA: 29, idLlaveB: 30, capacidadMax: 16 },
  { idLlave: 16, instancia: "Octavos 8", idLlaveA: 31, idLlaveB: 32, capacidadMax: 16 },
  { idLlave: 17, instancia: "Dieciseisavos 1", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 18, instancia: "Dieciseisavos 2", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 19, instancia: "Dieciseisavos 3", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 20, instancia: "Dieciseisavos 4", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 21, instancia: "Dieciseisavos 5", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 22, instancia: "Dieciseisavos 6", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 23, instancia: "Dieciseisavos 7", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 24, instancia: "Dieciseisavos 8", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 25, instancia: "Dieciseisavos 9", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 26, instancia: "Dieciseisavos 10", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 27, instancia: "Dieciseisavos 11", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 28, instancia: "Dieciseisavos 12", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 29, instancia: "Dieciseisavos 13", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 30, instancia: "Dieciseisavos 14", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 31, instancia: "Dieciseisavos 15", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
  { idLlave: 32, instancia: "Dieciseisavos 16", idLlaveA: null, idLlaveB: null, capacidadMax: 32 },
];

export {
  colores,
  genero,
  modalidad,
  categoria,
  tipoTorneo,
  usuarios,
  equipos,
  torneos,
  torneoEquipo,
  torneoEquipoPeleador,
  combates,
  roundCombate,
  roundPeleador,
  equiposPorGrupo,
  organizacionTorneo,
  torneoLuchador,
  bracketTemplate,
};

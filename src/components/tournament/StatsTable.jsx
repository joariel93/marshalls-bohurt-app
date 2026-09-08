export default function StatsTable({ estadisticas }) {
  if (!estadisticas || !estadisticas.equipos?.length) {
    return <p className="text-color-secondary text-center p-4">No hay estadísticas disponibles.</p>;
  }

  return (
    <div className="flex flex-column gap-3">
      <div className="overflow-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Equipo</th>
              <th className="text-center p-2">C</th>
              <th className="text-center p-2">V</th>
              <th className="text-center p-2">D</th>
              <th className="text-center p-2">RG</th>
              <th className="text-center p-2">RP</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.equipos.map((eq, idx) => (
              <tr
                key={eq.id}
                style={{ borderBottom: '1px solid var(--surface-border)' }}
                className="hover:surface-hover"
              >
                <td className="p-2">
                  <span className={`font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : ''}`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex align-items-center gap-2">
                    <span className="font-semibold">{eq.nombre}</span>
                  </div>
                </td>
                <td className="text-center p-2">{eq.combates}</td>
                <td className="text-center p-2 font-bold" style={{ color: 'var(--green-400)' }}>{eq.victorias}</td>
                <td className="text-center p-2" style={{ color: 'var(--red-400)' }}>{eq.derrotas}</td>
                <td className="text-center p-2">{eq.roundsGanados}</td>
                <td className="text-center p-2">{eq.roundsPerdidos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 text-xs text-color-secondary justify-content-center mt-2">
        <span>C: Combates</span>
        <span>V: Victorias</span>
        <span>D: Derrotas</span>
        <span>RG: Rounds ganados</span>
        <span>RP: Rounds perdidos</span>
      </div>
    </div>
  );
}

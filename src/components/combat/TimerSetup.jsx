export default function TimerSetup({ value, onChange, onConfirm }) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinusMinute = () => {
    const newVal = Math.max(60, value - 60);
    onChange(newVal);
  };

  const handlePlusMinute = () => {
    const newVal = Math.min(600, value + 60);
    onChange(newVal);
  };

  const handleMinus30 = () => {
    const newVal = Math.max(30, value - 30);
    onChange(newVal);
  };

  const handlePlus30 = () => {
    const newVal = Math.min(600, value + 30);
    onChange(newVal);
  };

  return (
    <div className="flex flex-column align-items-center gap-4 p-4 border-round"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
      <p className="text-color-secondary text-center m-0">
        Configurá la duración de los rounds de este combate:
      </p>

      <div className="flex align-items-center gap-3">
        <button className="p-button p-button-outlined p-button-sm" onClick={handleMinus30}>
          -30s
        </button>
        <button className="p-button p-button-outlined" onClick={handleMinusMinute}>
          <i className="pi pi-minus" />
        </button>

        <div
          className="text-center p-3 border-round"
          style={{ background: 'var(--surface-section)', minWidth: '7rem' }}
        >
          <div className="text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-color-secondary">minutos</div>
        </div>

        <button className="p-button p-button-outlined" onClick={handlePlusMinute}>
          <i className="pi pi-plus" />
        </button>
        <button className="p-button p-button-outlined p-button-sm" onClick={handlePlus30}>
          +30s
        </button>
      </div>

      <div className="flex gap-2">
        {[120, 180, 240, 300].map(d => (
          <button
            key={d}
            className={`p-button p-button-sm ${value === d ? '' : 'p-button-outlined'}`}
            onClick={() => onChange(d)}
          >
            {Math.floor(d / 60)}:00
          </button>
        ))}
      </div>

      <button className="p-button w-full mt-2" onClick={onConfirm}>
        <i className="pi pi-forward mr-2" />
        Comenzar combate
      </button>
    </div>
  );
}

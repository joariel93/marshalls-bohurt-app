import { useId } from 'react';

const SHIELD_PATH = "M50 5 L80 15 L80 50 C80 70 65 85 50 95 C35 85 20 70 20 50 L20 15 Z";

export default function Shield({
  number,
  color1 = "#666",
  color2 = "#888",
  color3 = "#aaa",
  size = 60,
  down = false,
  yellowCard = false,
  redCard = false,
  onClick,
  selectable = false,
  selected = false,
}) {
  const uid = useId();
  const halfW = size;
  const halfH = size * 0.95;
  const borderW = size * 1.05;
  const borderH = size * 0.99;

  const isInteractive = selectable || onClick;
  const opacity = down ? 0.35 : 1;
  const cursor = isInteractive ? 'pointer' : 'default';

  const baseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.2s ease',
    opacity,
  };

  let borderStyle = { ...baseStyle };
  if (yellowCard) {
    borderStyle.filter = 'drop-shadow(0 0 4px #eab308) drop-shadow(0 0 6px #eab308)';
  } else if (redCard) {
    borderStyle.filter = 'drop-shadow(0 0 4px #ef4444) drop-shadow(0 0 6px #ef4444)';
  } else if (selected) {
    borderStyle.filter = 'drop-shadow(0 0 4px #10b981) drop-shadow(0 0 6px #10b981)';
  }

  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      style={{
        position: 'relative',
        width: borderW,
        height: borderH + 8,
        cursor,
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg
          viewBox="0 0 100 100"
          width={halfW}
          height={halfH}
          style={baseStyle}
        >
          <defs>
            <clipPath id={`${uid}-left`}>
              <rect x="0" y="0" width="50" height="100" />
            </clipPath>
          </defs>
          <path d={SHIELD_PATH} fill={color1} clipPath={`url(#${uid}-left)`} />
        </svg>

        <svg
          viewBox="0 0 100 100"
          width={halfW}
          height={halfH}
          style={baseStyle}
        >
          <defs>
            <clipPath id={`${uid}-right`}>
              <rect x="50" y="0" width="50" height="100" />
            </clipPath>
          </defs>
          <path d={SHIELD_PATH} fill={color2} clipPath={`url(#${uid}-right)`} />
        </svg>

        <svg
          viewBox="0 0 100 100"
          width={borderW}
          height={borderH}
          style={borderStyle}
        >
          <path d={SHIELD_PATH} fill="none" stroke={color3} strokeWidth="3" />
        </svg>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity,
            textAlign: 'center',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#fff',
              WebkitTextStroke: '2px #000',
              textShadow: '0 0 4px rgba(0,0,0,0.8)',
              userSelect: 'none',
            }}
          >
            {number}
          </span>
        </div>

        {down && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: size * 0.35,
              opacity: 0.8,
              pointerEvents: 'none',
              textShadow: '0 0 6px rgba(0,0,0,0.8)',
            }}
          >
            ✕
          </div>
        )}
      </div>
    </div>
  );
}

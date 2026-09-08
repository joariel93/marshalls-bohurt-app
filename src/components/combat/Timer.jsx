import { useState, useEffect, useRef, useCallback } from 'react';

export default function Timer({ duration, running, onTick, onComplete }) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef(null);
  const totalRef = useRef(duration);

  useEffect(() => {
    totalRef.current = duration;
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setTimeout(() => onComplete?.(), 50);
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  useEffect(() => {
    onTick?.(remaining);
  }, [remaining, onTick]);

  const total = totalRef.current;
  const progress = total > 0 ? remaining / total : 0;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isLow = remaining <= 30 && remaining > 0;
  const isUp = remaining === 0;

  return (
    <div style={{ position: 'relative', width: 90, height: 90 }}>
      <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="var(--surface-border)"
          strokeWidth="6"
        />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={isUp ? '#10b981' : isLow ? '#ef4444' : 'var(--primary-color)'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.4s linear, stroke 0.3s' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            fontVariantNumeric: 'tabular-nums',
            color: isUp ? '#10b981' : isLow ? '#ef4444' : 'var(--text-color)',
            transition: 'color 0.3s',
          }}
        >
          {timeStr}
        </div>
      </div>
    </div>
  );
}

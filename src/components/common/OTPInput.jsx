import { useState, useRef } from 'react';

export default function OTPInput({ onSubmit, loading }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().slice(0, 6);
    if (pasted.length > 0) {
      const newCode = [...code];
      pasted.split('').forEach((char, i) => { newCode[i] = char; });
      setCode(newCode);
      const nextIndex = Math.min(pasted.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const fullCode = code.join('');
  const isValid = fullCode.length === 6;

  const handleSubmit = () => {
    if (isValid && !loading) {
      onSubmit(fullCode);
    }
  };

  return (
    <div className="flex flex-column align-items-center gap-4">
      <div className="flex gap-2 justify-content-center" onPaste={handlePaste}>
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={el => inputsRef.current[idx] = el}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            className="text-center font-bold"
            style={{
              width: '3rem',
              height: '3.5rem',
              fontSize: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--surface-border)',
              background: 'var(--surface-section)',
              color: 'var(--text-color)',
              outline: 'none',
              textTransform: 'uppercase',
            }}
            autoFocus={idx === 0}
            inputMode="text"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className="p-button w-full"
        style={{ maxWidth: '20rem' }}
      >
        {loading ? (
          <>
            <i className="pi pi-spin pi-spinner mr-2" />
            Verificando...
          </>
        ) : (
          'Ingresar al torneo'
        )}
      </button>
    </div>
  );
}

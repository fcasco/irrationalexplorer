import { useState, useMemo, useCallback } from 'react';
import { PI, PHI, E } from './data/digits';

type IrrationalNumber = {
  name: string;
  symbol: string;
  digits: string;
  description: string;
};

type DigitFunction = {
  id: string;
  name: string;
  description: string;
  fn: (digit: number, index: number, allDigits: number[]) => boolean;
};

const NUMBERS: IrrationalNumber[] = [
  { name: 'Pi', symbol: 'π', digits: PI, description: '3.14159265…' },
  { name: 'Phi', symbol: 'φ', digits: PHI, description: '1.61803398…' },
  { name: 'Euler', symbol: 'e', digits: E, description: '2.71828182…' },
];

const FUNCTIONS: DigitFunction[] = [
  {
    id: 'greater-than-5',
    name: 'Digit > 5',
    description: 'True if digit is greater than 5',
    fn: (digit) => digit > 5,
  },
  {
    id: 'less-than-5',
    name: 'Digit < 5',
    description: 'True if digit is less than 5',
    fn: (digit) => digit < 5,
  },
  {
    id: 'even',
    name: 'Even digit',
    description: 'True if digit is even (0, 2, 4, 6, 8)',
    fn: (digit) => digit % 2 === 0,
  },
  {
    id: 'odd',
    name: 'Odd digit',
    description: 'True if digit is odd (1, 3, 5, 7, 9)',
    fn: (digit) => digit % 2 !== 0,
  },
  {
    id: 'prime',
    name: 'Prime digit',
    description: 'True if digit is prime (2, 3, 5, 7)',
    fn: (digit) => [2, 3, 5, 7].includes(digit),
  },
  {
    id: 'decreasing',
    name: 'Less than previous',
    description: 'True if digit is smaller than the previous digit',
    fn: (digit, index, allDigits) => index === 0 ? false : digit < allDigits[index - 1],
  },
  {
    id: 'increasing',
    name: 'Greater than previous',
    description: 'True if digit is larger than the previous digit',
    fn: (digit, index, allDigits) => index === 0 ? false : digit > allDigits[index - 1],
  },
  {
    id: 'same-as-previous',
    name: 'Same as previous',
    description: 'True if digit equals the previous digit',
    fn: (digit, index, allDigits) => index === 0 ? false : digit === allDigits[index - 1],
  },
  {
    id: 'multiple-of-3',
    name: 'Multiple of 3',
    description: 'True if digit is divisible by 3 (0, 3, 6, 9)',
    fn: (digit) => digit % 3 === 0,
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci digit',
    description: 'True if digit is a Fibonacci number (0, 1, 2, 3, 5, 8)',
    fn: (digit) => [0, 1, 2, 3, 5, 8].includes(digit),
  },
  {
    id: 'perfect-square',
    name: 'Perfect square',
    description: 'True if digit is a perfect square (0, 1, 4, 9)',
    fn: (digit) => [0, 1, 4, 9].includes(digit),
  },
  {
    id: 'greater-than-index-mod10',
    name: 'Greater than position (mod 10)',
    description: 'True if digit is greater than its position within range modulo 10',
    fn: (digit, index) => digit > (index % 10),
  },
];

// Jewel tone palette
const COLORS = {
  bg: '#1a1625',
  bgCard: '#241e33',
  bgDeep: '#15111d',
  text: '#e8e4f0',
  textMuted: '#a89bb8',
  textFaint: '#6b5f7a',
  ruby: '#c9375c',
  rubySoft: '#e85d7f',
  emerald: '#2d9b6e',
  sapphire: '#3b5998',
  border: '#3d3452',
  falseBg: '#2d2640',
};

export default function App() {
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [selectedFunction, setSelectedFunction] = useState(0);
  const [startDigit, setStartDigit] = useState(0);
  const [endDigit, setEndDigit] = useState(100);
  const [copied, setCopied] = useState(false);

  const number = NUMBERS[selectedNumber];
  const func = FUNCTIONS[selectedFunction];

  const digitsArray = useMemo(() => {
    return number.digits.slice(startDigit, endDigit).split('').map(Number);
  }, [number, startDigit, endDigit]);

  const states = useMemo(() => {
    return digitsArray.map((digit, i) => func.fn(digit, i, digitsArray));
  }, [digitsArray, func]);

  const binaryString = useMemo(() => {
    return states.map(s => s ? '1' : '0').join('');
  }, [states]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(binaryString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [binaryString]);

  const maxDigits = number.digits.length;
  const trueCount = states.filter(s => s).length;
  const falseCount = states.length - trueCount;
  const ratio = states.length > 0 ? ((trueCount / states.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">

        {/* Header */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: COLORS.text }}>
              Irrational Explorer
            </h1>
            <span className="text-sm" style={{ color: COLORS.textFaint }}>—</span>
            <span className="text-sm" style={{ color: COLORS.textMuted }}>digit patterns</span>
          </div>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            Choose a number, apply a function, observe the structure.
          </p>
        </header>

        {/* Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Number selector */}
          <div className="p-5 rounded-lg" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <label className="block text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: COLORS.textMuted }}>
              Number
            </label>
            <div className="flex gap-2">
              {NUMBERS.map((num, i) => (
                <button
                  key={num.name}
                  onClick={() => setSelectedNumber(i)}
                  className="flex-1 py-2.5 rounded-md text-sm font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: selectedNumber === i ? COLORS.ruby : 'transparent',
                    color: selectedNumber === i ? COLORS.text : COLORS.textMuted,
                    border: selectedNumber === i ? `1px solid ${COLORS.ruby}` : `1px solid ${COLORS.border}`,
                  }}
                >
                  <span className="font-mono text-base">{num.symbol}</span>
                  <span className="ml-1.5 hidden sm:inline">{num.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Function selector */}
          <div className="p-5 rounded-lg" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <label className="block text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: COLORS.textMuted }}>
              Function
            </label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(Number(e.target.value))}
              className="w-full rounded-md px-3 py-2.5 text-sm font-medium focus:outline-none transition-colors"
              style={{
                backgroundColor: COLORS.bgDeep,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text,
              }}
            >
              {FUNCTIONS.map((f, i) => (
                <option key={f.id} value={i}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Range */}
          <div className="p-5 rounded-lg" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <label className="block text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: COLORS.textMuted }}>
              Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={maxDigits - 1}
                value={startDigit}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(Number(e.target.value), maxDigits - 1));
                  setStartDigit(v);
                  if (v >= endDigit) setEndDigit(v + 1);
                }}
                className="w-20 rounded-md px-3 py-2.5 text-sm font-mono focus:outline-none"
                style={{ backgroundColor: COLORS.bgDeep, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              />
              <span style={{ color: COLORS.textFaint }}>→</span>
              <input
                type="number"
                min={1}
                max={maxDigits}
                value={endDigit}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(Number(e.target.value), maxDigits));
                  setEndDigit(v);
                  if (v <= startDigit) setStartDigit(v - 1);
                }}
                className="w-20 rounded-md px-3 py-2.5 text-sm font-mono focus:outline-none"
                style={{ backgroundColor: COLORS.bgDeep, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              />
            </div>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { label: '1–100', s: 0, e: 100 },
            { label: '1–250', s: 0, e: 250 },
            { label: '1–500', s: 0, e: 500 },
            { label: '100–200', s: 100, e: 200 },
            { label: '500–600', s: 500, e: 600 },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => { setStartDigit(preset.s); setEndDigit(Math.min(preset.e, maxDigits)); }}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150"
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.ruby; e.currentTarget.style.color = COLORS.ruby; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Function description */}
        <div className="mb-6 px-1">
          <p className="text-sm font-mono" style={{ color: COLORS.textMuted }}>
            <span style={{ color: COLORS.text }}>{func.name}</span>
            <span className="mx-2" style={{ color: COLORS.textFaint }}>·</span>
            {func.description}
          </p>
        </div>

        {/* Visualization */}
        <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
          {/* Legend + Copy */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.ruby }} />
                <span className="text-xs" style={{ color: COLORS.textMuted }}>True</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.falseBg }} />
                <span className="text-xs" style={{ color: COLORS.textMuted }}>False</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-md text-xs font-medium transition-colors duration-150"
              style={{
                backgroundColor: copied ? COLORS.emerald : 'transparent',
                color: copied ? COLORS.text : COLORS.textMuted,
                border: copied ? `1px solid ${COLORS.emerald}` : `1px solid ${COLORS.border}`,
              }}
            >
              {copied ? 'Copied ✓' : 'Copy states'}
            </button>
          </div>

          {/* Squares grid */}
          <div className="flex flex-wrap gap-[3px] p-4 rounded-md" style={{ backgroundColor: COLORS.bgDeep }}>
            {states.map((state, i) => (
              <div
                key={`${startDigit + i}`}
                className="w-[7px] h-[7px] sm:w-[9px] sm:h-[9px] md:w-[11px] md:h-[11px] rounded-[1px]"
                style={{
                  backgroundColor: state ? COLORS.ruby : COLORS.falseBg,
                }}
                title={`Digit ${startDigit + i}: ${digitsArray[i]} → ${state ? '1' : '0'}`}
              />
            ))}
          </div>

          {/* Digit reference */}
          <div className="mt-4 flex flex-wrap gap-[3px] px-4">
            {digitsArray.slice(0, Math.min(digitsArray.length, 200)).map((d, i) => (
              <span
                key={`ref-${i}`}
                className="font-mono w-[7px] h-[10px] sm:w-[9px] sm:h-[12px] md:w-[11px] md:h-[14px] flex items-center justify-center"
                style={{
                  fontSize: '7px',
                  color: states[i] ? COLORS.rubySoft : COLORS.textFaint,
                }}
              >
                {d}
              </span>
            ))}
            {digitsArray.length > 200 && (
              <span className="text-xs ml-2" style={{ color: COLORS.textFaint }}>…</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-12">
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <div className="text-xl font-bold font-mono" style={{ color: COLORS.ruby }}>{trueCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: COLORS.textMuted }}>True</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <div className="text-xl font-bold font-mono" style={{ color: COLORS.text }}>{falseCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: COLORS.textMuted }}>False</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <div className="text-xl font-bold font-mono" style={{ color: COLORS.emerald }}>{ratio}%</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: COLORS.textMuted }}>Ratio</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
            <div className="text-xl font-bold font-mono" style={{ color: COLORS.sapphire }}>{states.length}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: COLORS.textMuted }}>Total</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <p className="text-xs" style={{ color: COLORS.textFaint }}>
            {number.description} · {number.name} · {maxDigits} digits available
          </p>
        </footer>
      </div>
    </div>
  );
}

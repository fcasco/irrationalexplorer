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
    <div className="min-h-screen" style={{ backgroundColor: '#F4EDE4', color: '#2D2926' }}>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">

        {/* Header */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: '#2D2926' }}>
              Irrational Explorer
            </h1>
            <span className="text-sm" style={{ color: '#B5ADA4' }}>—</span>
            <span className="text-sm" style={{ color: '#8C837A' }}>digit patterns</span>
          </div>
          <p className="text-sm" style={{ color: '#8C837A' }}>
            Choose a number, apply a function, observe the structure.
          </p>
        </header>

        {/* Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Number selector */}
          <div className="p-5 rounded-lg" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <label className="block text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: '#8C837A' }}>
              Number
            </label>
            <div className="flex gap-2">
              {NUMBERS.map((num, i) => (
                <button
                  key={num.name}
                  onClick={() => setSelectedNumber(i)}
                  className="flex-1 py-2.5 rounded-md text-sm font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: selectedNumber === i ? '#C2694A' : 'transparent',
                    color: selectedNumber === i ? '#F4EDE4' : '#2D2926',
                    border: selectedNumber === i ? '1px solid #C2694A' : '1px solid #DDD5CB',
                  }}
                >
                  <span className="font-mono text-base">{num.symbol}</span>
                  <span className="ml-1.5 hidden sm:inline">{num.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Function selector */}
          <div className="p-5 rounded-lg" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <label className="block text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: '#8C837A' }}>
              Function
            </label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(Number(e.target.value))}
              className="w-full rounded-md px-3 py-2.5 text-sm font-medium focus:outline-none transition-colors"
              style={{
                backgroundColor: '#F4EDE4',
                border: '1px solid #DDD5CB',
                color: '#2D2926',
              }}
            >
              {FUNCTIONS.map((f, i) => (
                <option key={f.id} value={i}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Range */}
          <div className="p-5 rounded-lg" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <label className="block text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: '#8C837A' }}>
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
                style={{ backgroundColor: '#F4EDE4', border: '1px solid #DDD5CB', color: '#2D2926' }}
              />
              <span style={{ color: '#B5ADA4' }}>→</span>
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
                style={{ backgroundColor: '#F4EDE4', border: '1px solid #DDD5CB', color: '#2D2926' }}
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
                border: '1px solid #DDD5CB',
                color: '#8C837A',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C2694A'; e.currentTarget.style.color = '#C2694A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#DDD5CB'; e.currentTarget.style.color = '#8C837A'; }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Function description */}
        <div className="mb-6 px-1">
          <p className="text-sm font-mono" style={{ color: '#8C837A' }}>
            <span style={{ color: '#2D2926' }}>{func.name}</span>
            <span className="mx-2" style={{ color: '#B5ADA4' }}>·</span>
            {func.description}
          </p>
        </div>

        {/* Visualization */}
        <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
          {/* Legend + Copy */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C2694A' }} />
                <span className="text-xs" style={{ color: '#8C837A' }}>True</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D9D2CA' }} />
                <span className="text-xs" style={{ color: '#8C837A' }}>False</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-md text-xs font-medium transition-colors duration-150"
              style={{
                backgroundColor: copied ? '#C2694A' : 'transparent',
                color: copied ? '#F4EDE4' : '#8C837A',
                border: copied ? '1px solid #C2694A' : '1px solid #DDD5CB',
              }}
            >
              {copied ? 'Copied ✓' : 'Copy states'}
            </button>
          </div>

          {/* Squares grid */}
          <div className="flex flex-wrap gap-[3px] p-4 rounded-md" style={{ backgroundColor: '#E5DDD3' }}>
            {states.map((state, i) => (
              <div
                key={`${startDigit + i}`}
                className="w-[7px] h-[7px] sm:w-[9px] sm:h-[9px] md:w-[11px] md:h-[11px] rounded-[1px]"
                style={{
                  backgroundColor: state ? '#C2694A' : '#D9D2CA',
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
                  color: states[i] ? '#C2694A' : '#B5ADA4',
                }}
              >
                {d}
              </span>
            ))}
            {digitsArray.length > 200 && (
              <span className="text-xs ml-2" style={{ color: '#B5ADA4' }}>…</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-12">
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#C2694A' }}>{trueCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: '#8C837A' }}>True</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#2D2926' }}>{falseCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: '#8C837A' }}>False</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#2D2926' }}>{ratio}%</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: '#8C837A' }}>Ratio</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#EDE6DC', border: '1px solid #DDD5CB' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#2D2926' }}>{states.length}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: '#8C837A' }}>Total</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6" style={{ borderTop: '1px solid #DDD5CB' }}>
          <p className="text-xs" style={{ color: '#B5ADA4' }}>
            {number.description} · {number.name} · {maxDigits} digits available
          </p>
        </footer>
      </div>
    </div>
  );
}

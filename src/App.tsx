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
  { name: 'Pi (π)', symbol: 'π', digits: PI, description: '3.14159265...' },
  { name: 'Phi (φ)', symbol: 'φ', digits: PHI, description: '1.61803398...' },
  { name: "Euler's number (e)", symbol: 'e', digits: E, description: '2.71828182...' },
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-mono relative overflow-hidden">
      {/* Background grid effect */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }} />
      
      {/* Glowing orbs */}
      <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Irrational Explorer
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Visualize the hidden patterns in infinite digits
          </p>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Number selector */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
            <label className="block text-xs uppercase tracking-wider text-purple-400 mb-3 font-semibold">
              Irrational Number
            </label>
            <div className="flex gap-2 flex-wrap">
              {NUMBERS.map((num, i) => (
                <button
                  key={num.name}
                  onClick={() => setSelectedNumber(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedNumber === i
                      ? 'bg-purple-500/20 border border-purple-400/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:border-purple-400/30 hover:text-purple-300'
                  }`}
                >
                  <span className="text-lg mr-1">{num.symbol}</span>
                  <span className="hidden sm:inline">{num.name}</span>
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-3">{number.description}</p>
          </div>

          {/* Function selector */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
            <label className="block text-xs uppercase tracking-wider text-cyan-400 mb-3 font-semibold">
              Digit Function
            </label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(Number(e.target.value))}
              className="w-full bg-[#12121a] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all"
            >
              {FUNCTIONS.map((f, i) => (
                <option key={f.id} value={i}>{f.name}</option>
              ))}
            </select>
            <p className="text-gray-600 text-xs mt-3">{func.description}</p>
          </div>
        </div>

        {/* Range controls */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <label className="block text-xs uppercase tracking-wider text-emerald-400 mb-4 font-semibold">
            Digit Range
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">From</span>
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
                className="w-24 bg-[#12121a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-400/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">To</span>
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
                className="w-24 bg-[#12121a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-400/50 transition-all"
              />
            </div>
            <div className="text-gray-600 text-xs">
              {endDigit - startDigit} digits shown
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <button
                onClick={() => { setStartDigit(0); setEndDigit(100); }}
                className="px-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg text-gray-400 hover:text-emerald-300 hover:border-emerald-400/30 transition-all"
              >
                0–100
              </button>
              <button
                onClick={() => { setStartDigit(0); setEndDigit(500); }}
                className="px-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg text-gray-400 hover:text-emerald-300 hover:border-emerald-400/30 transition-all"
              >
                0–500
              </button>
              <button
                onClick={() => { setStartDigit(0); setEndDigit(Math.min(1000, maxDigits)); }}
                className="px-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg text-gray-400 hover:text-emerald-300 hover:border-emerald-400/30 transition-all"
              >
                0–1000
              </button>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-purple-400 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="text-xs text-gray-400">True</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#1a1a2e] border border-white/[0.08]" />
                <span className="text-xs text-gray-400">False</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                copied
                  ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:border-emerald-400/30 hover:text-emerald-300'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy States'}
            </button>
          </div>

          {/* Squares grid */}
          <div className="flex flex-wrap gap-[2px] p-3 bg-[#06060a] rounded-xl border border-white/[0.04]">
            {states.map((state, i) => (
              <div
                key={`${startDigit + i}`}
                className={`w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] md:w-[10px] md:h-[10px] rounded-[1px] transition-all duration-150 ${
                  state
                    ? 'bg-gradient-to-br from-purple-400 to-cyan-400 shadow-[0_0_4px_rgba(168,85,247,0.4)]'
                    : 'bg-[#1a1a2e] border border-white/[0.04]'
                }`}
                title={`Digit ${startDigit + i}: ${digitsArray[i]} → ${state ? '1' : '0'}`}
              />
            ))}
          </div>

          {/* Digit reference */}
          <div className="mt-4 flex flex-wrap gap-[2px] px-3">
            {digitsArray.slice(0, Math.min(digitsArray.length, 200)).map((d, i) => (
              <span
                key={`ref-${i}`}
                className={`text-[8px] sm:text-[9px] w-[6px] h-[10px] sm:w-[8px] sm:h-[12px] md:w-[10px] md:h-[14px] flex items-center justify-center ${
                  states[i] ? 'text-purple-300/70' : 'text-gray-700'
                }`}
              >
                {d}
              </span>
            ))}
            {digitsArray.length > 200 && <span className="text-gray-700 text-xs ml-2">...</span>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{states.filter(s => s).length}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">True</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{states.filter(s => !s).length}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">False</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {((states.filter(s => s).length / states.length) * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Ratio</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{states.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Total</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-700 text-xs">
          <p>Exploring the beauty of irrational numbers through their digit patterns</p>
        </footer>
      </div>
    </div>
  );
}

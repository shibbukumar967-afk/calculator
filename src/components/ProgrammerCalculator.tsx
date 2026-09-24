import React, { useState } from 'react';
import { Language } from '../types';
import { sound } from '../utils/audio';

interface ProgrammerCalculatorProps {
  language: Language;
}

type Base = 'HEX' | 'DEC' | 'OCT' | 'BIN';
type WordSize = 8 | 16 | 32;

export const ProgrammerCalculator: React.FC<ProgrammerCalculatorProps> = () => {
  const [currentBase, setCurrentBase] = useState<Base>('DEC');
  const [currentVal, setCurrentVal] = useState<bigint>(0n);
  const [storedVal, setStoredVal] = useState<bigint | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [wordSize, setWordSize] = useState<WordSize>(32);

  const mask = (n: bigint): bigint => {
    const bitMask = (1n << BigInt(wordSize)) - 1n;
    return n & bitMask;
  };

  const handleDigit = (digit: string) => {
    sound.playClick();
    const str = currentVal.toString(
      currentBase === 'HEX' ? 16 : currentBase === 'OCT' ? 8 : currentBase === 'BIN' ? 2 : 10
    );
    const newStr = str === '0' ? digit : str + digit;
    try {
      const radix = currentBase === 'HEX' ? 16 : currentBase === 'OCT' ? 8 : currentBase === 'BIN' ? 2 : 10;
      let parsed = 0n;
      for (const ch of newStr.toLowerCase()) {
        const val = BigInt('0123456789abcdef'.indexOf(ch));
        if (val >= 0n && val < BigInt(radix)) {
          parsed = parsed * BigInt(radix) + val;
        }
      }
      setCurrentVal(mask(parsed));
    } catch {
      // Ignore overflow
    }
  };

  const handleBackspace = () => {
    sound.playClear();
    const radix = currentBase === 'HEX' ? 16 : currentBase === 'OCT' ? 8 : currentBase === 'BIN' ? 2 : 10;
    const str = currentVal.toString(radix);
    if (str.length <= 1) {
      setCurrentVal(0n);
    } else {
      const newStr = str.slice(0, -1);
      let parsed = 0n;
      for (const ch of newStr.toLowerCase()) {
        const val = BigInt('0123456789abcdef'.indexOf(ch));
        parsed = parsed * BigInt(radix) + val;
      }
      setCurrentVal(mask(parsed));
    }
  };

  const handleAllClear = () => {
    sound.playClear();
    setCurrentVal(0n);
    setStoredVal(null);
    setPendingOp(null);
  };

  const handleBitwiseOp = (op: string) => {
    sound.playOperator();
    if (op === 'NOT') {
      setCurrentVal(mask(~currentVal));
      return;
    }
    setStoredVal(currentVal);
    setPendingOp(op);
    setCurrentVal(0n);
  };

  const handleEquals = () => {
    sound.playEquals();
    if (storedVal === null || pendingOp === null) return;
    let res = 0n;
    switch (pendingOp) {
      case 'AND':
        res = storedVal & currentVal;
        break;
      case 'OR':
        res = storedVal | currentVal;
        break;
      case 'XOR':
        res = storedVal ^ currentVal;
        break;
      case 'LSH':
        res = storedVal << currentVal;
        break;
      case 'RSH':
        res = storedVal >> currentVal;
        break;
      case '+':
        res = storedVal + currentVal;
        break;
      case '-':
        res = storedVal - currentVal;
        break;
      case '*':
        res = storedVal * currentVal;
        break;
      case '/':
        res = currentVal !== 0n ? storedVal / currentVal : 0n;
        break;
      default:
        res = currentVal;
    }
    setCurrentVal(mask(res));
    setStoredVal(null);
    setPendingOp(null);
  };

  // Format representations
  const hexStr = currentVal.toString(16).toUpperCase();
  const decStr = currentVal.toString(10);
  const octStr = currentVal.toString(8);
  const rawBin = currentVal.toString(2).padStart(wordSize, '0');
  // Group binary in nibbles (4 bits)
  const binChunks = rawBin.match(/.{1,4}/g)?.join(' ') || rawBin;

  const isKeyActive = (key: string) => {
    if (currentBase === 'BIN') return ['0', '1'].includes(key);
    if (currentBase === 'OCT') return ['0', '1', '2', '3', '4', '5', '6', '7'].includes(key);
    if (currentBase === 'DEC') return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key);
    return true; // HEX has all 0-9 and A-F
  };

  const btnBase =
    'h-11 sm:h-12 rounded-xl font-mono text-sm sm:text-base font-semibold transition-all flex items-center justify-center select-none active:scale-95 shadow-sm';

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Base Value Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-xl">
        {/* Word Size Selector */}
        <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
          <span className="text-slate-400 font-medium">Word Size:</span>
          <div className="flex items-center gap-1">
            {([8, 16, 32] as WordSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  sound.playClick();
                  setWordSize(size);
                  setCurrentVal(mask(currentVal));
                }}
                className={`px-2 py-0.5 rounded font-mono text-xs ${
                  wordSize === size
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {size === 8 ? 'BYTE' : size === 16 ? 'WORD' : 'DWORD'} ({size}b)
              </button>
            ))}
          </div>
        </div>

        {/* 4 Bases Rows */}
        <div className="flex flex-col gap-1.5 pt-1">
          {/* HEX */}
          <div
            onClick={() => {
              sound.playClick();
              setCurrentBase('HEX');
            }}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
              currentBase === 'HEX' ? 'bg-cyan-500/15 border border-cyan-500/40' : 'hover:bg-slate-800/50'
            }`}
          >
            <span className={`text-xs font-mono font-bold ${currentBase === 'HEX' ? 'text-cyan-400' : 'text-slate-400'}`}>
              HEX
            </span>
            <span className="font-mono text-sm sm:text-base text-slate-100 font-semibold tracking-wide truncate max-w-[80%]">
              {hexStr}
            </span>
          </div>

          {/* DEC */}
          <div
            onClick={() => {
              sound.playClick();
              setCurrentBase('DEC');
            }}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
              currentBase === 'DEC' ? 'bg-cyan-500/15 border border-cyan-500/40' : 'hover:bg-slate-800/50'
            }`}
          >
            <span className={`text-xs font-mono font-bold ${currentBase === 'DEC' ? 'text-cyan-400' : 'text-slate-400'}`}>
              DEC
            </span>
            <span className="font-mono text-sm sm:text-base text-slate-100 font-semibold tracking-wide truncate max-w-[80%]">
              {decStr}
            </span>
          </div>

          {/* OCT */}
          <div
            onClick={() => {
              sound.playClick();
              setCurrentBase('OCT');
            }}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
              currentBase === 'OCT' ? 'bg-cyan-500/15 border border-cyan-500/40' : 'hover:bg-slate-800/50'
            }`}
          >
            <span className={`text-xs font-mono font-bold ${currentBase === 'OCT' ? 'text-cyan-400' : 'text-slate-400'}`}>
              OCT
            </span>
            <span className="font-mono text-sm sm:text-base text-slate-100 font-semibold tracking-wide truncate max-w-[80%]">
              {octStr}
            </span>
          </div>

          {/* BIN */}
          <div
            onClick={() => {
              sound.playClick();
              setCurrentBase('BIN');
            }}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
              currentBase === 'BIN' ? 'bg-cyan-500/15 border border-cyan-500/40' : 'hover:bg-slate-800/50'
            }`}
          >
            <span className={`text-xs font-mono font-bold ${currentBase === 'BIN' ? 'text-cyan-400' : 'text-slate-400'}`}>
              BIN
            </span>
            <span className="font-mono text-xs sm:text-sm text-slate-200 font-medium tracking-wider truncate max-w-[80%]">
              {binChunks}
            </span>
          </div>
        </div>
      </div>

      {/* Programmer Matrix Keypad */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
        {/* Bitwise Row */}
        <div className="grid grid-cols-6 gap-1.5">
          {['AND', 'OR', 'XOR', 'NOT', 'LSH', 'RSH'].map((op) => (
            <button
              key={op}
              onClick={() => handleBitwiseOp(op)}
              className="py-2 text-xs font-mono font-bold rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-cyan-300 border border-slate-700/40 active:scale-95"
            >
              {op}
            </button>
          ))}
        </div>

        {/* Hex keys A-F & Controls */}
        <div className="grid grid-cols-6 gap-1.5 mt-1">
          {['A', 'B', 'C', 'D', 'E', 'F'].map((hexKey) => {
            const active = isKeyActive(hexKey);
            return (
              <button
                key={hexKey}
                disabled={!active}
                onClick={() => handleDigit(hexKey)}
                className={`py-2 text-sm font-mono font-bold rounded-lg border transition-all ${
                  active
                    ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700 active:scale-95'
                    : 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                }`}
              >
                {hexKey}
              </button>
            );
          })}
        </div>

        {/* Standard Numeric + Programmer Ops Grid */}
        <div className="grid grid-cols-5 gap-1.5 mt-1">
          {/* Row 1 */}
          <button onClick={handleAllClear} className={`${btnBase} bg-rose-500/20 text-rose-400 border border-rose-500/30`}>
            AC
          </button>
          <button onClick={handleBackspace} className={`${btnBase} bg-slate-800 text-slate-300 border border-slate-700`}>
            ⌫
          </button>
          <button onClick={() => handleBitwiseOp('/')} className={`${btnBase} bg-indigo-600/20 text-indigo-300 border border-indigo-500/30`}>
            ÷
          </button>
          <button onClick={() => handleBitwiseOp('*')} className={`${btnBase} bg-indigo-600/20 text-indigo-300 border border-indigo-500/30`}>
            ×
          </button>
          <button onClick={() => handleBitwiseOp('-')} className={`${btnBase} bg-indigo-600/20 text-indigo-300 border border-indigo-500/30`}>
            −
          </button>

          {/* Row 2 */}
          {['7', '8', '9'].map((d) => (
            <button
              key={d}
              disabled={!isKeyActive(d)}
              onClick={() => handleDigit(d)}
              className={`${btnBase} ${
                isKeyActive(d)
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-950/40 text-slate-600 border-slate-900 opacity-40 cursor-not-allowed'
              }`}
            >
              {d}
            </button>
          ))}
          <button onClick={() => handleBitwiseOp('+')} className={`${btnBase} col-span-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30`}>
            +
          </button>

          {/* Row 3 */}
          {['4', '5', '6'].map((d) => (
            <button
              key={d}
              disabled={!isKeyActive(d)}
              onClick={() => handleDigit(d)}
              className={`${btnBase} ${
                isKeyActive(d)
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-950/40 text-slate-600 border-slate-900 opacity-40 cursor-not-allowed'
              }`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleEquals}
            className={`${btnBase} col-span-2 row-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border border-cyan-400/40 shadow-lg`}
          >
            =
          </button>

          {/* Row 4 */}
          {['1', '2', '3'].map((d) => (
            <button
              key={d}
              disabled={!isKeyActive(d)}
              onClick={() => handleDigit(d)}
              className={`${btnBase} ${
                isKeyActive(d)
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-950/40 text-slate-600 border-slate-900 opacity-40 cursor-not-allowed'
              }`}
            >
              {d}
            </button>
          ))}

          {/* Row 5 */}
          <button
            disabled={!isKeyActive('0')}
            onClick={() => handleDigit('0')}
            className={`${btnBase} col-span-3 ${
              isKeyActive('0')
                ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
                : 'bg-slate-950/40 text-slate-600 border-slate-900 opacity-40'
            }`}
          >
            0
          </button>
        </div>
      </div>
    </div>
  );
};

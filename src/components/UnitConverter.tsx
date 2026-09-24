import React, { useState, useEffect } from 'react';
import { Language, UnitCategory } from '../types';
import { UNIT_CATEGORIES, UNITS_DATA } from '../utils/unitsData';
import { sound } from '../utils/audio';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { formatNumber } from '../utils/mathEngine';

interface UnitConverterProps {
  language: Language;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ language }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [val1, setVal1] = useState<string>('1');
  const [val2, setVal2] = useState<string>('');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [copied, setCopied] = useState(false);

  const units = UNITS_DATA[category] || [];

  // Reset default units when category changes
  useEffect(() => {
    if (units.length >= 2) {
      setFromUnitId(units[0].id);
      setToUnitId(units[1].id);
    }
  }, [category]);

  // Sync conversion from Val1 -> Val2
  useEffect(() => {
    const num = parseFloat(val1);
    if (isNaN(num)) {
      setVal2('');
      return;
    }
    const fromUnit = units.find((u) => u.id === fromUnitId);
    const toUnit = units.find((u) => u.id === toUnitId);
    if (fromUnit && toUnit) {
      const inBase = fromUnit.toBase(num);
      const converted = toUnit.fromBase(inBase);
      // Clean float
      const cleaned = Math.round(converted * 1e8) / 1e8;
      setVal2(cleaned.toString());
    }
  }, [val1, fromUnitId, toUnitId, category]);

  const handleVal2Change = (newVal2: string) => {
    setVal2(newVal2);
    const num = parseFloat(newVal2);
    if (isNaN(num)) {
      setVal1('');
      return;
    }
    const fromUnit = units.find((u) => u.id === fromUnitId);
    const toUnit = units.find((u) => u.id === toUnitId);
    if (fromUnit && toUnit) {
      const inBase = toUnit.toBase(num);
      const converted = fromUnit.fromBase(inBase);
      const cleaned = Math.round(converted * 1e8) / 1e8;
      setVal1(cleaned.toString());
    }
  };

  const swapUnits = () => {
    sound.playClick();
    const tempUnit = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(tempUnit);
  };

  const handleCopy = () => {
    sound.playClick();
    const fromUnit = units.find((u) => u.id === fromUnitId);
    const toUnit = units.find((u) => u.id === toUnitId);
    const text = `${val1} ${fromUnit?.symbol || ''} = ${val2} ${toUnit?.symbol || ''}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const fromUnit = units.find((u) => u.id === fromUnitId);
  const toUnit = units.find((u) => u.id === toUnitId);

  // Compute 1 unit equivalent formula
  let formulaText = '';
  if (fromUnit && toUnit) {
    const oneBase = fromUnit.toBase(1);
    const oneConverted = Math.round(toUnit.fromBase(oneBase) * 1e6) / 1e6;
    formulaText = `1 ${fromUnit.symbol} = ${oneConverted} ${toUnit.symbol}`;
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {UNIT_CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setCategory(cat.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {language === 'hi' ? cat.nameHi : cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Conversion Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        {/* Source Box */}
        <div className="flex flex-col gap-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">From</span>
            <select
              value={fromUnitId}
              onChange={(e) => {
                sound.playClick();
                setFromUnitId(e.target.value);
              }}
              className="bg-slate-900 text-cyan-300 text-xs font-medium rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {language === 'hi' ? u.nameHi : u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <input
            type="number"
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
            className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-slate-100 focus:outline-none pt-1"
            placeholder="0"
          />
        </div>

        {/* Swap Button Divider */}
        <div className="flex items-center justify-center -my-2 relative z-10">
          <button
            onClick={swapUnits}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Swap Units"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Target Box */}
        <div className="flex flex-col gap-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">To</span>
            <select
              value={toUnitId}
              onChange={(e) => {
                sound.playClick();
                setToUnitId(e.target.value);
              }}
              className="bg-slate-900 text-cyan-300 text-xs font-medium rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {language === 'hi' ? u.nameHi : u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <input
            type="number"
            value={val2}
            onChange={(e) => handleVal2Change(e.target.value)}
            className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-cyan-400 focus:outline-none pt-1"
            placeholder="0"
          />
        </div>

        {/* Conversion Formula & Quick Copy */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 font-mono">{formulaText}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

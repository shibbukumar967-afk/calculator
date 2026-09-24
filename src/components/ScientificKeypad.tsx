import React, { useState } from 'react';
import { AngleMode } from '../types';
import { sound } from '../utils/audio';

interface ScientificKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onFunction: (funcName: string) => void;
  onConstant: (val: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onEquals: () => void;
  onNegate: () => void;
  onParentheses: (char?: string) => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onDigit,
  onOperator,
  onFunction,
  onConstant,
  onClear: _onClear,
  onAllClear,
  onEquals,
  onNegate,
  onParentheses,
  angleMode,
  onToggleAngleMode,
}) => {
  const [isSecond, setIsSecond] = useState(false);

  const btnBase =
    'h-12 sm:h-13 rounded-xl font-mono text-sm sm:text-base font-semibold transition-all duration-100 flex items-center justify-center select-none active:scale-[0.95] shadow-sm';

  const numBtn =
    `${btnBase} bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700/40 text-base sm:text-lg`;

  const sciBtn =
    `${btnBase} bg-slate-800/40 hover:bg-slate-700/50 text-cyan-300/90 hover:text-cyan-200 border border-slate-700/30 text-xs sm:text-sm font-medium`;

  const opBtn =
    `${btnBase} bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 text-base sm:text-lg`;

  const activeToggleBtn =
    `${btnBase} bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 text-xs sm:text-sm font-semibold`;

  const equalsBtn =
    `${btnBase} bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold border border-cyan-400/40 shadow-lg shadow-cyan-500/25 text-lg`;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 5-Column Responsive Scientific Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Mode toggles and basic scientific constants */}
        <button
          onClick={() => {
            sound.playClick();
            setIsSecond(!isSecond);
          }}
          className={isSecond ? activeToggleBtn : sciBtn}
          title="Second functions"
        >
          2nd
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onToggleAngleMode();
          }}
          className={sciBtn}
          title="Toggle Radian / Degree"
        >
          {angleMode}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onConstant('π');
          }}
          className={sciBtn}
        >
          π
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onConstant('e');
          }}
          className={sciBtn}
        >
          e
        </button>
        <button
          onClick={() => {
            sound.playClear();
            onAllClear();
          }}
          className={`${btnBase} bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30`}
        >
          AC
        </button>

        {/* Row 2: Trig / Inverse Trig */}
        <button
          onClick={() => {
            sound.playClick();
            onFunction(isSecond ? 'asin' : 'sin');
          }}
          className={sciBtn}
        >
          {isSecond ? 'sin⁻¹' : 'sin'}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onFunction(isSecond ? 'acos' : 'cos');
          }}
          className={sciBtn}
        >
          {isSecond ? 'cos⁻¹' : 'cos'}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onFunction(isSecond ? 'atan' : 'tan');
          }}
          className={sciBtn}
        >
          {isSecond ? 'tan⁻¹' : 'tan'}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onParentheses('(');
          }}
          className={sciBtn}
        >
          (
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onParentheses(')');
          }}
          className={sciBtn}
        >
          )
        </button>

        {/* Row 3: Logarithms & Powers */}
        <button
          onClick={() => {
            sound.playClick();
            if (isSecond) {
              onOperator('^'); // e^x
            } else {
              onFunction('ln');
            }
          }}
          className={sciBtn}
        >
          {isSecond ? 'eˣ' : 'ln'}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            if (isSecond) {
              onOperator('^');
            } else {
              onFunction('log');
            }
          }}
          className={sciBtn}
        >
          {isSecond ? '10ˣ' : 'log'}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            if (isSecond) {
              onFunction('cbrt');
            } else {
              onFunction('sqrt');
            }
          }}
          className={sciBtn}
        >
          {isSecond ? '∛x' : '√x'}
        </button>
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('^');
          }}
          className={sciBtn}
        >
          xʸ
        </button>
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('÷');
          }}
          className={opBtn}
        >
          ÷
        </button>

        {/* Row 4: Factorial & Numbers 7, 8, 9, × */}
        <button
          onClick={() => {
            sound.playClick();
            onOperator('!');
          }}
          className={sciBtn}
          title="Factorial"
        >
          x!
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('7');
          }}
          className={numBtn}
        >
          7
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('8');
          }}
          className={numBtn}
        >
          8
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('9');
          }}
          className={numBtn}
        >
          9
        </button>
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('×');
          }}
          className={opBtn}
        >
          ×
        </button>

        {/* Row 5: 1/x & Numbers 4, 5, 6, − */}
        <button
          onClick={() => {
            sound.playClick();
            onFunction('abs');
          }}
          className={sciBtn}
          title="Absolute Value"
        >
          |x|
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('4');
          }}
          className={numBtn}
        >
          4
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('5');
          }}
          className={numBtn}
        >
          5
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('6');
          }}
          className={numBtn}
        >
          6
        </button>
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('−');
          }}
          className={opBtn}
        >
          −
        </button>

        {/* Row 6: % & Numbers 1, 2, 3, + */}
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('%');
          }}
          className={sciBtn}
        >
          %
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('1');
          }}
          className={numBtn}
        >
          1
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('2');
          }}
          className={numBtn}
        >
          2
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('3');
          }}
          className={numBtn}
        >
          3
        </button>
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('+');
          }}
          className={opBtn}
        >
          +
        </button>

        {/* Row 7: ±, 0, ., = */}
        <button
          onClick={() => {
            sound.playClick();
            onNegate();
          }}
          className={sciBtn}
        >
          ±
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('0');
          }}
          className={numBtn}
        >
          0
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onDigit('.');
          }}
          className={numBtn}
        >
          .
        </button>
        <button
          onClick={() => {
            sound.playEquals();
            onEquals();
          }}
          className={`col-span-2 ${equalsBtn}`}
        >
          =
        </button>
      </div>
    </div>
  );
};

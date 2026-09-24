import React from 'react';
import { sound } from '../utils/audio';

interface StandardKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onEquals: () => void;
  onNegate: () => void;
  onParentheses: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
}

export const StandardKeypad: React.FC<StandardKeypadProps> = ({
  onDigit,
  onOperator,
  onClear: _onClear,
  onAllClear,
  onEquals,
  onNegate,
  onParentheses,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
}) => {
  const btnBase =
    'h-14 sm:h-16 rounded-xl font-mono text-lg sm:text-xl font-semibold transition-all duration-100 flex items-center justify-center select-none active:scale-[0.96] shadow-sm';

  const numBtn =
    `${btnBase} bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700/40`;

  const opBtn =
    `${btnBase} bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50`;

  const funcBtn =
    `${btnBase} bg-slate-800/40 hover:bg-slate-700/50 text-slate-300 border border-slate-700/30`;

  const equalsBtn =
    `${btnBase} bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold border border-cyan-400/40 shadow-lg shadow-cyan-500/25`;

  const memBtn =
    'h-8 text-xs font-mono font-medium rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all border border-slate-800/60 active:scale-95';

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Memory Bar */}
      <div className="grid grid-cols-5 gap-1.5 mb-1">
        <button
          onClick={() => {
            sound.playClick();
            onMemoryClear();
          }}
          className={memBtn}
          title="Memory Clear"
        >
          MC
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onMemoryRecall();
          }}
          className={memBtn}
          title="Memory Recall"
        >
          MR
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onMemoryAdd();
          }}
          className={memBtn}
          title="Memory Add"
        >
          M+
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onMemorySubtract();
          }}
          className={memBtn}
          title="Memory Subtract"
        >
          M-
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onMemoryStore();
          }}
          className={memBtn}
          title="Memory Store"
        >
          MS
        </button>
      </div>

      {/* Standard 4x5 Key Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <button
          onClick={() => {
            sound.playClear();
            onAllClear();
          }}
          className={`${funcBtn} text-rose-400 hover:text-rose-300 border-rose-500/20`}
        >
          AC
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onParentheses();
          }}
          className={funcBtn}
        >
          ( )
        </button>
        <button
          onClick={() => {
            sound.playOperator();
            onOperator('%');
          }}
          className={funcBtn}
        >
          %
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

        {/* Row 2 */}
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

        {/* Row 3 */}
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

        {/* Row 4 */}
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

        {/* Row 5 */}
        <button
          onClick={() => {
            sound.playClick();
            onNegate();
          }}
          className={numBtn}
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
          className={equalsBtn}
        >
          =
        </button>
      </div>
    </div>
  );
};

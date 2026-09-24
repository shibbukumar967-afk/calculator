import React, { useRef, useEffect, useState } from 'react';
import { AngleMode } from '../types';
import { Copy, Check, Delete } from 'lucide-react';
import { sound } from '../utils/audio';

interface DisplayProps {
  expression: string;
  result: string;
  previewResult?: string | null;
  angleMode: AngleMode;
  onToggleAngleMode?: () => void;
  memoryValue?: number;
  onBackspace: () => void;
  onClear: () => void;
  showAngleBadge?: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  previewResult,
  angleMode,
  onToggleAngleMode,
  memoryValue,
  onBackspace,
  onClear,
  showAngleBadge = true,
}) => {
  const [copied, setCopied] = useState(false);
  const exprRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression to right on typing
  useEffect(() => {
    if (exprRef.current) {
      exprRef.current.scrollLeft = exprRef.current.scrollWidth;
    }
  }, [expression]);

  const handleCopy = () => {
    const textToCopy = result || expression || '0';
    sound.playClick();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  // Determine dynamic font size for main display based on length
  const displayLength = (result || expression || '0').length;
  let textSizeClass = 'text-4xl sm:text-5xl';
  if (displayLength > 18) {
    textSizeClass = 'text-xl sm:text-2xl';
  } else if (displayLength > 12) {
    textSizeClass = 'text-2xl sm:text-3xl';
  } else if (displayLength > 8) {
    textSizeClass = 'text-3xl sm:text-4xl';
  }

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden backdrop-blur-sm">
      {/* Top Status & Controls Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          {showAngleBadge && onToggleAngleMode && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleAngleMode();
              }}
              title="Click to toggle Degree / Radian"
              className="px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-slate-800 text-cyan-400 hover:bg-slate-700/80 border border-slate-700/50 transition-colors"
            >
              {angleMode}
            </button>
          )}

          {typeof memoryValue === 'number' && memoryValue !== 0 && (
            <span
              title={`Memory Stored: ${memoryValue}`}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30"
            >
              M ({memoryValue})
            </span>
          )}
        </div>

        {/* Right utility buttons: Copy & Backspace */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors relative"
            title="Copy result"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copied</span>
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClear();
              onBackspace();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Backspace (Delete last character)"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expression line */}
      <div
        ref={exprRef}
        className="w-full text-right text-sm sm:text-base text-slate-400 font-mono tracking-wide overflow-x-auto whitespace-nowrap no-scrollbar min-h-[1.5rem] select-all cursor-text py-0.5"
      >
        {expression || <span className="opacity-0">0</span>}
      </div>

      {/* Main active result / input */}
      <div className="w-full text-right my-1">
        <div
          className={`font-mono font-bold text-slate-100 tracking-tight select-all truncate ${textSizeClass}`}
          title={result || expression || '0'}
        >
          {result || expression || '0'}
        </div>
      </div>

      {/* Live Preview row (when expression has pending operation) */}
      <div className="w-full text-right h-5 flex items-center justify-end">
        {previewResult && previewResult !== result && (
          <span className="text-xs sm:text-sm font-mono text-cyan-400/80 font-medium">
            = {previewResult}
          </span>
        )}
      </div>
    </div>
  );
};

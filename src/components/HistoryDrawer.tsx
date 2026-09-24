import React from 'react';
import { HistoryItem, Language } from '../types';
import { t } from '../utils/i18n';
import { sound } from '../utils/audio';
import { X, Trash2, Download, Copy, Check } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  language: Language;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  language,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    sound.playClick();
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const handleExport = () => {
    sound.playClick();
    const content = history
      .map((h) => `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.expression} = ${h.result}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmniCalc_History_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">{t('history', language)}</h2>
            <span className="text-xs font-mono text-slate-400">({history.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExport}
                  title="Export History"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playClear();
                    onClearHistory();
                  }}
                  title={t('clearHistory', language)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <p className="text-sm">{t('noHistory', language)}</p>
              <p className="text-xs text-slate-600 mt-1">Calculations will be saved automatically here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="group relative p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/30 transition-all cursor-pointer flex flex-col gap-1 text-right"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-[10px] uppercase text-cyan-400/80">
                    {item.mode}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 truncate">
                  {item.expression}
                </div>

                <div className="font-mono text-base sm:text-lg font-bold text-cyan-400">
                  = {item.result}
                </div>

                {/* Floating copy button */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopy(e, item)}
                    title="Copy calculation"
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

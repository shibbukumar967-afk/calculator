import React from 'react';
import { CalculatorMode, Language, Theme } from '../types';
import { t } from '../utils/i18n';
import { Volume2, VolumeX, Moon, Sun, History, Languages } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  onToggleHistory,
  historyCount,
}) => {
  const modes: { id: CalculatorMode; labelKey: 'standard' | 'scientific' | 'financial' | 'converter' | 'date' | 'programmer' }[] = [
    { id: 'standard', labelKey: 'standard' },
    { id: 'scientific', labelKey: 'scientific' },
    { id: 'financial', labelKey: 'financial' },
    { id: 'converter', labelKey: 'converter' },
    { id: 'date', labelKey: 'date' },
    { id: 'programmer', labelKey: 'programmer' },
  ];

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            {t('appName', language)}
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean tabs) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playClick();
                  onSelectMode(m.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {t(m.labelKey, language)}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Controls / Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* History Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleHistory();
            }}
            title={t('history', language)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label={t('history', language)}
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-mono font-bold bg-cyan-500 text-slate-950 rounded-full flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            title={soundEnabled ? t('soundOn', language) : t('soundOff', language)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled
                ? 'text-cyan-400 hover:bg-slate-800/80'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/80'
            }`}
            aria-label="Sound Toggle"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleLanguage();
            }}
            title={language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-700/60 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            title={theme === 'dark' ? t('themeLight', language) : t('themeDark', language)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="Theme Toggle"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { CalculatorMode, AngleMode, Theme, Language, HistoryItem } from './types';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { StandardKeypad } from './components/StandardKeypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { FinancialCalculator } from './components/FinancialCalculator';
import { UnitConverter } from './components/UnitConverter';
import { DateAgeCalculator } from './components/DateAgeCalculator';
import { ProgrammerCalculator } from './components/ProgrammerCalculator';
import { HistoryDrawer } from './components/HistoryDrawer';
import { evaluateExpression, formatNumber } from './utils/mathEngine';
import { sound } from './utils/audio';

const STORAGE_KEY_HISTORY = 'omni_calc_history_v1';
const STORAGE_KEY_THEME = 'omni_calc_theme';
const STORAGE_KEY_LANG = 'omni_calc_lang';
const STORAGE_KEY_SOUND = 'omni_calc_sound';

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load persisted settings
  useEffect(() => {
    try {
      const savedHist = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHist) setHistory(JSON.parse(savedHist));

      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as Theme;
      if (savedTheme) setTheme(savedTheme);

      const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (savedLang) setLanguage(savedLang);

      const savedSound = localStorage.getItem(STORAGE_KEY_SOUND);
      if (savedSound !== null) {
        const enabled = savedSound === 'true';
        setSoundEnabled(enabled);
        sound.enabled = enabled;
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  // Save history updates
  const saveHistoryItem = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 100);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {
        // quota exceeded
      }
      return updated;
    });
  }, []);

  // Live expression preview
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setPreviewResult(null);
      return;
    }
    // Only preview if expression ends in a number, paren, or constant
    const lastChar = expression.trim().slice(-1);
    if (/[\d)πe!]/.test(lastChar)) {
      const { result: val, formatted } = evaluateExpression(expression, angleMode);
      if (!isNaN(val) && isFinite(val)) {
        setPreviewResult(formatted);
      } else {
        setPreviewResult(null);
      }
    } else {
      setPreviewResult(null);
    }
  }, [expression, angleMode]);

  // Digit Input Handler
  const handleDigit = useCallback((digit: string) => {
    setExpression((prev) => {
      if (prev === '0' && digit !== '.') return digit;
      // Handle multiple decimals in the same number
      if (digit === '.') {
        const parts = prev.split(/[+\-×÷^()%]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return prev;
        if (!lastPart || lastPart === '') return prev + '0.';
      }
      return prev + digit;
    });
    setResult('');
  }, []);

  // Operator Input Handler
  const handleOperator = useCallback((op: string) => {
    setExpression((prev) => {
      if (!prev || prev === '') {
        // Use last result or 0
        const base = result && result !== 'Error' && result !== '0' ? result.replace(/,/g, '') : '0';
        if (op === '%') return base + '%';
        if (op === '!') return base + '!';
        return `${base} ${op} `;
      }

      const trimmed = prev.trim();
      const lastChar = trimmed.slice(-1);

      if (op === '%' || op === '!') {
        if (/[\d)πe]/.test(lastChar)) {
          return `${trimmed}${op}`;
        }
        return prev;
      }

      // If already ends with an operator, replace it
      if (['+', '−', '×', '÷', '^'].includes(lastChar)) {
        return `${trimmed.slice(0, -1).trim()} ${op} `;
      }

      return `${trimmed} ${op} `;
    });
    setResult('');
  }, [result]);

  // Parentheses Handler
  const handleParentheses = useCallback((explicitChar?: string) => {
    if (explicitChar) {
      setExpression((prev) => prev + explicitChar);
      return;
    }

    setExpression((prev) => {
      const openCount = (prev.match(/\(/g) || []).length;
      const closeCount = (prev.match(/\)/g) || []).length;
      const lastChar = prev.trim().slice(-1);

      if (openCount > closeCount && /[\d)πe!]/.test(lastChar)) {
        return prev + ')';
      } else if (lastChar === '' || ['+', '−', '×', '÷', '(', '^'].includes(lastChar)) {
        return prev + '(';
      } else {
        return prev + ' × (';
      }
    });
  }, []);

  // Function Input Handler (sin, cos, ln, sqrt, etc.)
  const handleFunction = useCallback((funcName: string) => {
    setExpression((prev) => {
      const trimmed = prev.trim();
      const lastChar = trimmed.slice(-1);
      if (trimmed === '' || ['+', '−', '×', '÷', '(', '^'].includes(lastChar)) {
        return `${trimmed}${funcName}(`;
      }
      return `${trimmed} × ${funcName}(`;
    });
  }, []);

  // Constant Input Handler (π, e)
  const handleConstant = useCallback((constVal: string) => {
    setExpression((prev) => {
      const trimmed = prev.trim();
      const lastChar = trimmed.slice(-1);
      if (trimmed === '' || ['+', '−', '×', '÷', '(', '^'].includes(lastChar)) {
        return `${trimmed}${constVal}`;
      }
      return `${trimmed} × ${constVal}`;
    });
  }, []);

  // Negate (+/-) Handler
  const handleNegate = useCallback(() => {
    setExpression((prev) => {
      if (!prev || prev === '') return '-(0)';
      // If ends with a number, wrap in negation
      const match = prev.match(/(\d+(\.\d+)?)$/);
      if (match) {
        const num = match[0];
        const before = prev.slice(0, -num.length);
        if (before.endsWith('(-')) {
          return before.slice(0, -2) + num;
        }
        return `${before}(-` + num + ')';
      }
      return `-( ${prev} )`;
    });
  }, []);

  // Backspace Handler
  const handleBackspace = useCallback(() => {
    setExpression((prev) => {
      if (!prev || prev.length === 0) return '';
      const trimmed = prev.trimEnd();
      // If ends with whitespace operator e.g. " + "
      if (trimmed.endsWith(' +') || trimmed.endsWith(' −') || trimmed.endsWith(' ×') || trimmed.endsWith(' ÷') || trimmed.endsWith(' ^')) {
        return trimmed.slice(0, -2).trimEnd();
      }
      return trimmed.slice(0, -1);
    });
    setResult('');
  }, []);

  // Clear Handler
  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setPreviewResult(null);
  }, []);

  // Equals / Calculate Handler
  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const { result: val, formatted } = evaluateExpression(expression, angleMode);
    setResult(formatted);

    if (!isNaN(val) && isFinite(val)) {
      saveHistoryItem({
        id: Date.now().toString(),
        expression,
        result: formatted,
        timestamp: Date.now(),
        mode,
      });
    }
  }, [expression, angleMode, mode, saveHistoryItem]);

  // Memory Operations
  const handleMemoryClear = () => {
    setMemoryValue(0);
  };

  const handleMemoryRecall = () => {
    if (memoryValue !== 0) {
      handleDigit(memoryValue.toString());
    }
  };

  const handleMemoryAdd = () => {
    const cur = parseFloat(result.replace(/,/g, '')) || 0;
    setMemoryValue((prev) => prev + cur);
  };

  const handleMemorySubtract = () => {
    const cur = parseFloat(result.replace(/,/g, '')) || 0;
    setMemoryValue((prev) => prev - cur);
  };

  const handleMemoryStore = () => {
    const cur = parseFloat(result.replace(/,/g, '')) || 0;
    setMemoryValue(cur);
  };

  // Keyboard navigation & Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input field (e.g. GST or unit converter)
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        sound.playClick();
        handleDigit(e.key);
      } else if (e.key === '.') {
        sound.playClick();
        handleDigit('.');
      } else if (e.key === '+') {
        sound.playOperator();
        handleOperator('+');
      } else if (e.key === '-') {
        sound.playOperator();
        handleOperator('−');
      } else if (e.key === '*') {
        sound.playOperator();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        sound.playOperator();
        handleOperator('÷');
      } else if (e.key === '%') {
        sound.playOperator();
        handleOperator('%');
      } else if (e.key === '^') {
        sound.playOperator();
        handleOperator('^');
      } else if (e.key === '(' || e.key === ')') {
        sound.playClick();
        handleParentheses(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        sound.playEquals();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        sound.playClear();
        handleBackspace();
      } else if (e.key === 'Escape') {
        sound.playClear();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleParentheses, handleEquals, handleBackspace, handleClear]);

  // Theme & Language toggles
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    localStorage.setItem(STORAGE_KEY_LANG, next);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    localStorage.setItem(STORAGE_KEY_SOUND, String(next));
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Bar Header */}
      <Header
        currentMode={mode}
        onSelectMode={(newMode) => {
          setMode(newMode);
          if (newMode !== 'standard' && newMode !== 'scientific') {
            setResult('0');
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onToggleLanguage={toggleLanguage}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-start">
        {/* Standard and Scientific Calculator View */}
        {(mode === 'standard' || mode === 'scientific') && (
          <div className="w-full max-w-md flex flex-col gap-4">
            {/* Display Component */}
            <Display
              expression={expression}
              result={result}
              previewResult={previewResult}
              angleMode={angleMode}
              onToggleAngleMode={() => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'))}
              memoryValue={memoryValue}
              onBackspace={handleBackspace}
              onClear={handleClear}
              showAngleBadge={mode === 'scientific'}
            />

            {/* Keypad Container */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-xl">
              {mode === 'standard' ? (
                <StandardKeypad
                  onDigit={handleDigit}
                  onOperator={handleOperator}
                  onClear={handleClear}
                  onAllClear={handleClear}
                  onEquals={handleEquals}
                  onNegate={handleNegate}
                  onParentheses={() => handleParentheses()}
                  onMemoryClear={handleMemoryClear}
                  onMemoryRecall={handleMemoryRecall}
                  onMemoryAdd={handleMemoryAdd}
                  onMemorySubtract={handleMemorySubtract}
                  onMemoryStore={handleMemoryStore}
                />
              ) : (
                <ScientificKeypad
                  onDigit={handleDigit}
                  onOperator={handleOperator}
                  onFunction={handleFunction}
                  onConstant={handleConstant}
                  onClear={handleClear}
                  onAllClear={handleClear}
                  onEquals={handleEquals}
                  onNegate={handleNegate}
                  onParentheses={handleParentheses}
                  angleMode={angleMode}
                  onToggleAngleMode={() => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'))}
                />
              )}
            </div>

            {/* Quick Keyboard shortcuts hint */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-2">
              <span>Shortcuts: 0-9, +, -, *, /, Enter, Backspace</span>
              <span>ESC = Clear</span>
            </div>
          </div>
        )}

        {/* Financial & GST View */}
        {mode === 'financial' && <FinancialCalculator language={language} />}

        {/* Unit Converter View */}
        {mode === 'converter' && <UnitConverter language={language} />}

        {/* Date & Age View */}
        {mode === 'date' && <DateAgeCalculator language={language} />}

        {/* Programmer Mode View */}
        {mode === 'programmer' && <ProgrammerCalculator language={language} />}
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => {
          setExpression(item.expression);
          setResult(item.result);
          if (mode !== 'standard' && mode !== 'scientific') {
            setMode('standard');
          }
        }}
        onClearHistory={() => {
          setHistory([]);
          try {
            localStorage.removeItem(STORAGE_KEY_HISTORY);
          } catch {}
        }}
        language={language}
      />
    </div>
  );
}

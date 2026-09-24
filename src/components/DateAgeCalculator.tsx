import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { sound } from '../utils/audio';
import { Calendar, Cake, Clock } from 'lucide-react';
import { formatNumber } from '../utils/mathEngine';

interface DateAgeCalculatorProps {
  language: Language;
}

export const DateAgeCalculator: React.FC<DateAgeCalculatorProps> = ({ language }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Age state
  const [dob, setDob] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  // Date difference state
  const [subTab, setSubTab] = useState<'age' | 'diff'>('age');
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );

  // Calculate age breakdown
  const dStart = new Date(dob);
  const dEnd = new Date(targetDate);

  let years = 0;
  let months = 0;
  let days = 0;
  let totalDaysLived = 0;
  let daysUntilNextBday = 0;
  let nextBdayDayName = '';

  if (!isNaN(dStart.getTime()) && !isNaN(dEnd.getTime()) && dEnd >= dStart) {
    totalDaysLived = Math.floor((dEnd.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24));

    let y = dEnd.getFullYear() - dStart.getFullYear();
    let m = dEnd.getMonth() - dStart.getMonth();
    let d = dEnd.getDate() - dStart.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonthLastDay = new Date(dEnd.getFullYear(), dEnd.getMonth(), 0).getDate();
      d += prevMonthLastDay;
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    years = y;
    months = m;
    days = d;

    // Next birthday calculation
    const currentYear = dEnd.getFullYear();
    let nextBday = new Date(currentYear, dStart.getMonth(), dStart.getDate());
    if (nextBday < dEnd) {
      nextBday = new Date(currentYear + 1, dStart.getMonth(), dStart.getDate());
    }
    daysUntilNextBday = Math.ceil((nextBday.getTime() - dEnd.getTime()) / (1000 * 60 * 60 * 24));
    nextBdayDayName = nextBday.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
  }

  // Calculate date diff
  const diffStart = new Date(startDate);
  const diffEnd = new Date(endDate);
  let totalDiffDays = 0;
  let weeksCount = 0;
  let remainingDays = 0;
  let businessDays = 0;

  if (!isNaN(diffStart.getTime()) && !isNaN(diffEnd.getTime())) {
    const diffTime = Math.abs(diffEnd.getTime() - diffStart.getTime());
    totalDiffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    weeksCount = Math.floor(totalDiffDays / 7);
    remainingDays = totalDiffDays % 7;

    // Count business days (Mon-Fri)
    const cur = new Date(Math.min(diffStart.getTime(), diffEnd.getTime()));
    const finish = new Date(Math.max(diffStart.getTime(), diffEnd.getTime()));
    while (cur < finish) {
      cur.setDate(cur.getDate() + 1);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Sub tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => {
            sound.playClick();
            setSubTab('age');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            subTab === 'age'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Cake className="w-3.5 h-3.5" />
          <span>{t('yourAge', language)}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('diff');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            subTab === 'diff'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Date Difference</span>
        </button>
      </div>

      {/* AGE CALCULATOR */}
      {subTab === 'age' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">{t('dob', language)}</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">{t('targetDate', language)}</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Primary Age Display Box */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/20 rounded-xl p-4 flex flex-col gap-2 shadow-inner">
            <span className="text-xs text-cyan-400 font-medium tracking-wide uppercase">
              {t('yourAge', language)}
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-slate-100">{years}</span>
                <span className="text-xs text-slate-400">{t('years', language)}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-300">{months}</span>
                <span className="text-xs text-slate-400">{t('months', language)}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-300">{days}</span>
                <span className="text-xs text-slate-400">{t('days', language)}</span>
              </div>
            </div>
          </div>

          {/* Next Birthday & Milestones */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Cake className="w-3.5 h-3.5 text-pink-400" />
                {t('nextBirthday', language)}
              </span>
              <div className="text-xl font-mono font-bold text-pink-400">
                {daysUntilNextBday === 0 ? 'Today! 🎂' : `${daysUntilNextBday} ${t('days', language)}`}
              </div>
              {daysUntilNextBday > 0 && (
                <span className="text-[11px] text-slate-500 font-mono">on {nextBdayDayName}</span>
              )}
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {t('daysOld', language)}
              </span>
              <div className="text-xl font-mono font-bold text-cyan-400">
                {formatNumber(totalDaysLived)}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                ~ {formatNumber(totalDaysLived * 24)} hours
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DATE DIFFERENCE CALCULATOR */}
      {subTab === 'diff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-center py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Total Difference</span>
              <div className="text-3xl font-mono font-bold text-cyan-400 mt-1">
                {formatNumber(totalDiffDays)} Days
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Weeks Breakdown:</span>
              <span className="font-mono text-slate-200">
                {weeksCount} weeks and {remainingDays} days
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Working / Business Days:</span>
              <span className="font-mono text-emerald-400 font-semibold">{businessDays} days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

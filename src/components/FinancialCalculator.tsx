import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { formatNumber } from '../utils/mathEngine';
import { sound } from '../utils/audio';
import { Copy, Check, Percent, Landmark, Tag } from 'lucide-react';

interface FinancialCalculatorProps {
  language: Language;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'gst' | 'emi' | 'discount'>('gst');

  // --- GST STATE ---
  const [gstAmount, setGstAmount] = useState<string>('10000');
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [selectedSlab, setSelectedSlab] = useState<number>(18);
  const [customSlab, setCustomSlab] = useState<string>('');
  const [copiedGst, setCopiedGst] = useState(false);

  // --- EMI STATE ---
  const [loanPrincipal, setLoanPrincipal] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [tenureYears, setTenureYears] = useState<string>('5');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  // --- DISCOUNT STATE ---
  const [originalPrice, setOriginalPrice] = useState<string>('2499');
  const [discountPercent, setDiscountPercent] = useState<string>('20');
  const [extraDiscount, setExtraDiscount] = useState<string>('5');

  // Calculate GST
  const slabRate = customSlab !== '' ? parseFloat(customSlab) || 0 : selectedSlab;
  const rawGstAmount = parseFloat(gstAmount) || 0;

  let netVal = 0;
  let totalGstVal = 0;
  let grossVal = 0;

  if (gstType === 'exclusive') {
    netVal = rawGstAmount;
    totalGstVal = (rawGstAmount * slabRate) / 100;
    grossVal = netVal + totalGstVal;
  } else {
    grossVal = rawGstAmount;
    netVal = (rawGstAmount * 100) / (100 + slabRate);
    totalGstVal = grossVal - netVal;
  }
  const cgstVal = totalGstVal / 2;
  const sgstVal = totalGstVal / 2;

  // Calculate EMI
  const p = parseFloat(loanPrincipal) || 0;
  const r = (parseFloat(interestRate) || 0) / (12 * 100);
  const n = tenureType === 'years' ? (parseFloat(tenureYears) || 0) * 12 : parseFloat(tenureYears) || 0;

  let monthlyEmi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (p > 0 && r > 0 && n > 0) {
    monthlyEmi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = monthlyEmi * n;
    totalInterest = totalPayment - p;
  } else if (p > 0 && r === 0 && n > 0) {
    monthlyEmi = p / n;
    totalPayment = p;
    totalInterest = 0;
  }

  const principalRatio = totalPayment > 0 ? (p / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  // Calculate Discount
  const rawOriginalPrice = parseFloat(originalPrice) || 0;
  const disc1 = parseFloat(discountPercent) || 0;
  const disc2 = parseFloat(extraDiscount) || 0;

  const afterFirstDiscount = rawOriginalPrice * (1 - disc1 / 100);
  const finalDiscountedPrice = afterFirstDiscount * (1 - disc2 / 100);
  const totalSavings = rawOriginalPrice - finalDiscountedPrice;
  const effectiveDiscountPercent = rawOriginalPrice > 0 ? (totalSavings / rawOriginalPrice) * 100 : 0;

  const copyGstSummary = () => {
    sound.playClick();
    const summary = `GST Breakdown (${slabRate}%):
Base Amount: ${formatNumber(netVal.toFixed(2))}
CGST (50%): ${formatNumber(cgstVal.toFixed(2))}
SGST (50%): ${formatNumber(sgstVal.toFixed(2))}
Total GST: ${formatNumber(totalGstVal.toFixed(2))}
Total Amount: ${formatNumber(grossVal.toFixed(2))}`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopiedGst(true);
      setTimeout(() => setCopiedGst(false), 1800);
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('gst');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            activeTab === 'gst'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>{t('gstCalc', language)}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('emi');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            activeTab === 'emi'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>{t('emiCalc', language)}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('discount');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            activeTab === 'discount'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>{t('discountCalc', language)}</span>
        </button>
      </div>

      {/* GST CALCULATOR */}
      {activeTab === 'gst' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          {/* Mode toggle (Exclusive / Inclusive) */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800/80">
            <button
              onClick={() => {
                sound.playClick();
                setGstType('exclusive');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                gstType === 'exclusive'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('exclusive', language)}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setGstType('inclusive');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                gstType === 'inclusive'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('inclusive', language)}
            </button>
          </div>

          {/* Amount input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">
              {gstType === 'exclusive' ? t('netAmount', language) : t('grossAmount', language)}
            </label>
            <div className="relative">
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xl font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          {/* GST Slabs */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">{t('gstRate', language)}</label>
            <div className="grid grid-cols-5 gap-2">
              {[3, 5, 12, 18, 28].map((slab) => (
                <button
                  key={slab}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSlab(slab);
                    setCustomSlab('');
                  }}
                  className={`py-2 rounded-xl text-sm font-mono font-bold transition-all border ${
                    customSlab === '' && selectedSlab === slab
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  +{slab}%
                </button>
              ))}
            </div>

            {/* Custom slab input */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 whitespace-nowrap">Custom %:</span>
              <input
                type="number"
                value={customSlab}
                onChange={(e) => setCustomSlab(e.target.value)}
                placeholder="e.g. 7.5"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/60 pb-2">
              <span>{t('netAmount', language)}</span>
              <span className="font-mono text-sm text-slate-200 font-semibold">
                {formatNumber(netVal.toFixed(2))}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t('cgst', language)} ({slabRate / 2}%)</span>
              <span className="font-mono text-slate-300">
                + {formatNumber(cgstVal.toFixed(2))}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t('sgst', language)} ({slabRate / 2}%)</span>
              <span className="font-mono text-slate-300">
                + {formatNumber(sgstVal.toFixed(2))}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-cyan-400 font-medium border-t border-slate-800/60 pt-2">
              <span>{t('igst', language)} ({slabRate}%)</span>
              <span className="font-mono text-sm font-semibold">
                + {formatNumber(totalGstVal.toFixed(2))}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-100 border-t border-slate-800/60 pt-2">
              <span>{t('finalAmount', language)}</span>
              <span className="font-mono text-xl text-cyan-400">
                {formatNumber(grossVal.toFixed(2))}
              </span>
            </div>

            <button
              onClick={copyGstSummary}
              className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors"
            >
              {copiedGst ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('copied', language)}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('copy', language)} {t('gstCalc', language)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* LOAN EMI CALCULATOR */}
      {activeTab === 'emi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          {/* Principal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">{t('loanAmount', language)}</label>
            <input
              type="number"
              value={loanPrincipal}
              onChange={(e) => setLoanPrincipal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Interest Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">{t('interestRate', language)}</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Tenure */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-slate-400">{t('loanTenure', language)}</label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setTenureType('years')}
                  className={`px-2 py-0.5 rounded ${
                    tenureType === 'years' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                  }`}
                >
                  {t('years', language)}
                </button>
                <span className="text-slate-600">/</span>
                <button
                  onClick={() => setTenureType('months')}
                  className={`px-2 py-0.5 rounded ${
                    tenureType === 'months' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                  }`}
                >
                  {t('months', language)}
                </button>
              </div>
            </div>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* EMI Results */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-center py-2 border-b border-slate-800/60">
              <div className="text-xs font-medium text-slate-400 mb-1">{t('monthlyEmi', language)}</div>
              <div className="text-3xl font-mono font-bold text-cyan-400">
                {formatNumber(monthlyEmi.toFixed(0))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t('loanAmount', language)}</span>
              <span className="font-mono text-sm text-slate-200 font-semibold">{formatNumber(p.toFixed(0))}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t('totalInterest', language)}</span>
              <span className="font-mono text-sm text-amber-400 font-semibold">
                {formatNumber(totalInterest.toFixed(0))}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/60 pt-2">
              <span className="font-semibold text-slate-300">{t('totalPayment', language)}</span>
              <span className="font-mono text-base font-bold text-slate-100">
                {formatNumber(totalPayment.toFixed(0))}
              </span>
            </div>

            {/* Proportion Bar */}
            <div className="mt-1 flex flex-col gap-1">
              <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-800">
                <div style={{ width: `${principalRatio}%` }} className="bg-cyan-500 h-full" title={`Principal: ${principalRatio.toFixed(1)}%`} />
                <div style={{ width: `${interestRatio}%` }} className="bg-amber-500 h-full" title={`Interest: ${interestRatio.toFixed(1)}%`} />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Principal ({principalRatio.toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Interest ({interestRatio.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISCOUNT CALCULATOR */}
      {activeTab === 'discount' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Original Price</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Extra Discount (%)</label>
              <input
                type="number"
                value={extraDiscount}
                onChange={(e) => setExtraDiscount(e.target.value)}
                placeholder="Optional"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Discount Results */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Original Price</span>
              <span className="font-mono text-slate-300">{formatNumber(rawOriginalPrice.toFixed(2))}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-emerald-400">
              <span>Total You Save ({effectiveDiscountPercent.toFixed(1)}%)</span>
              <span className="font-mono font-semibold">- {formatNumber(totalSavings.toFixed(2))}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-100 border-t border-slate-800/60 pt-2">
              <span>Final Price to Pay</span>
              <span className="font-mono text-2xl text-cyan-400">{formatNumber(finalDiscountedPrice.toFixed(2))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

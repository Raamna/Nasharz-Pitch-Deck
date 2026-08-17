import React, { useState, useEffect } from 'react';
import { EstimateItem, BrandingConfig } from '../types';
import { generateEstimatePDF } from '../utils/pdfGenerator';
import { calculateEstimateItems, ESTIMATE_CATEGORIES } from '../data/defaultEstimate';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';

interface EstimateModalProps {
  estimates: EstimateItem[];
  branding: BrandingConfig;
  clientName: string;
  onClose: () => void;
}

export const EstimateModal: React.FC<EstimateModalProps> = ({
  estimates: initialEstimates,
  branding,
  clientName,
  onClose,
}) => {
  // Estimate Number sequence state (persisted in localStorage or default to NCW/EST/555/2026)
  const [estimateSequence, setEstimateSequence] = useState<number>(() => {
    const saved = localStorage.getItem('nasharz_estimate_seq');
    return saved ? parseInt(saved, 10) : 555;
  });

  const estimateNo = `NCW/EST/${estimateSequence}/2026`;

  // Step 1: Input Parameters State
  const [days, setDays] = useState<number>(1);
  const [locationsPerDay, setLocationsPerDay] = useState<number>(1);
  const [studioShots, setStudioShots] = useState<boolean>(true);
  
  // Tax Toggles (Default: OFF / 0%, client can toggle on)
  const [whtEnabled, setWhtEnabled] = useState<boolean>(false);
  const [regTaxEnabled, setRegTaxEnabled] = useState<boolean>(false);
  const [whtRate, setWhtRate] = useState<number>(10);
  const [regTaxRate, setRegTaxRate] = useState<number>(8);

  // Client Details
  const [clientAddress, setClientAddress] = useState<string>(
    'Alaska Battery. 7th Floor, B-3 Tower, Jinnah Avenue, New Blue Area, Islamabad'
  );
  const [clientNTN, setClientNTN] = useState<string>('');

  // Flow State: false = Configuration View, true = Detailed Breakdown View
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Collapsible Terms & Conditions
  const [showTerms, setShowTerms] = useState<boolean>(false);

  // UI Helpers
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Editable Line Items State
  const [items, setItems] = useState<EstimateItem[]>(() => {
    return calculateEstimateItems({ days: 1, locationsPerDay: 1, studioShots: true });
  });

  // Calculate items when inputs change or when client presses Generate
  const performCalculation = (numDays: number, locs: number, studio: boolean) => {
    const updated = calculateEstimateItems({
      days: numDays,
      locationsPerDay: locs,
      studioShots: studio,
    });
    setItems(updated);
  };

  const handleInitialGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    performCalculation(days, locationsPerDay, studioShots);
    setHasCalculated(true);
  };

  const handleQuickRecalculate = (newDays: number, newLocs: number, newStudio: boolean) => {
    setDays(newDays);
    setLocationsPerDay(newLocs);
    setStudioShots(newStudio);
    performCalculation(newDays, newLocs, newStudio);
  };

  // Toggle item inclusion
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, included: !item.included } : item))
    );
  };

  // Update specific item field inline
  const updateItemField = (id: string, field: keyof EstimateItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Delete line item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add custom line item
  const handleAddCustomItem = () => {
    const targetCat = activeCategoryFilter !== 'ALL' ? activeCategoryFilter : 'PRE-PRODUCTION';
    const newItem: EstimateItem = {
      id: `custom-${Date.now()}`,
      category: targetCat,
      description: 'Custom Production Line Item',
      rate: '—',
      units: 1,
      days: days > 1 ? days : '—',
      amount: 50000,
      quantity: 1,
      unit: 'Item',
      included: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Reset to default baseline
  const handleResetToBaseline = () => {
    setDays(1);
    setLocationsPerDay(1);
    setStudioShots(true);
    setWhtEnabled(false);
    setRegTaxEnabled(false);
    setWhtRate(10);
    setRegTaxRate(8);
    setClientNTN('');
    performCalculation(1, 1, true);
    setHasCalculated(false);
  };

  // Financial Calculations - PH Fee is muted / not added to total cost
  const hardCostsTotal = items
    .filter((i) => i.included && !i.isLeadTalent && typeof i.amount === 'number')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const subtotalWithoutTax = hardCostsTotal;
  
  const effectiveWhtRate = whtEnabled ? (Number(whtRate) || 0) : 0;
  const effectiveRegTaxRate = regTaxEnabled ? (Number(regTaxRate) || 0) : 0;

  const whtTax = Math.round(subtotalWithoutTax * (effectiveWhtRate / 100));
  const regTax = Math.round(subtotalWithoutTax * (effectiveRegTaxRate / 100));
  const grandTotal = subtotalWithoutTax + whtTax + regTax;

  const taxesAreOff = !whtEnabled && !regTaxEnabled;

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchCat = activeCategoryFilter === 'ALL' || item.category === activeCategoryFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Group items by category for rendering
  const groupedCategories = ESTIMATE_CATEGORIES.map((cat) => ({
    category: cat,
    items: filteredItems.filter((i) => i.category === cat),
  })).filter((group) => group.items.length > 0);

  // PDF Export - Increments sequence on download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    await generateEstimatePDF(
      items,
      branding,
      clientName,
      {
        days,
        locationsPerDay,
        studioShots,
        clientAddress,
        clientNTN,
        whtRate: effectiveWhtRate,
        srbRate: effectiveRegTaxRate,
        estimateNumber: estimateNo,
      }
    );
    // Increment estimate sequence and save
    const nextSeq = estimateSequence + 1;
    setEstimateSequence(nextSeq);
    localStorage.setItem('nasharz_estimate_seq', nextSeq.toString());
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn antialiased">
      <div className="bg-white text-zinc-900 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-zinc-200/80">
        
        {/* TOP MODAL HEADER (With Real Nasharz Logo Circle) */}
        <div className="px-6 sm:px-8 py-4 border-b border-zinc-200/80 bg-[#fafafa] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center overflow-hidden p-1 shadow-xs shrink-0">
              <BrandLogo
                src={branding.whiteLogo || branding.nasharzIcon}
                alt="Nasharz"
                className="w-full h-full object-contain"
                fallbackColor="#ffffff"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Estimate
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[11px] font-bold text-zinc-700 font-mono tracking-tight">
                  {estimateNo}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-zinc-900 tracking-tight">
                Alaska Battery Campaign
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {hasCalculated && (
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-full flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generating...' : 'Export PDF'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-full transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CLIENT DETAILS SUB-HEADER (High-Contrast, Fully Readable NTN) */}
        <div className="bg-white border-b border-zinc-200/70 px-6 sm:px-8 py-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
          <div className="sm:col-span-7 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-zinc-600 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Client:</span>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full text-zinc-900 font-medium bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-zinc-200 focus:border-zinc-400 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-all"
              placeholder="Client Name and Address"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2 justify-start sm:justify-end">
            <span className="text-zinc-700 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Client NTN:</span>
            <input
              type="text"
              value={clientNTN}
              onChange={(e) => setClientNTN(e.target.value)}
              placeholder="e.g. 2403251-4"
              className="w-48 text-zinc-900 font-semibold bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-zinc-300 focus:border-zinc-600 rounded-lg px-3 py-1.5 text-xs focus:outline-none transition-all placeholder:text-zinc-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* VIEW 1: INITIAL PARAMETERS SELECTION (Clean Form with Tax Toggles) */}
          {!hasCalculated ? (
            <div className="max-w-2xl mx-auto my-4 space-y-8 animate-fadeIn">
              <div className="text-center space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                  Configure Campaign Scope
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  Select your shoot parameters and optional tax calculations. Detailed breakdown and itemized schedule will calculate automatically.
                </p>
              </div>

              <form onSubmit={handleInitialGenerate} className="bg-zinc-50/70 border border-zinc-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
                
                {/* 1. Number of Days */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-200/70">
                  <div>
                    <label className="text-xs font-semibold text-zinc-900 block">
                      Number of Shoot Days
                    </label>
                    <span className="text-[11px] text-zinc-500">
                      Day 1: 7.5M PKR • Day 2: +5.5M PKR • Day 3+: +5.25M PKR/day
                    </span>
                  </div>

                  <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setDays((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium flex items-center justify-center transition-all cursor-pointer text-sm"
                    >
                      −
                    </button>
                    <span className="w-16 text-center text-xs font-semibold text-zinc-900">
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDays((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium flex items-center justify-center transition-all cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 2. Locations per Day */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-200/70">
                  <div>
                    <label className="text-xs font-semibold text-zinc-900 block">
                      Locations per Day
                    </label>
                    <span className="text-[11px] text-zinc-500">
                      1 Location = 1 Location head item • 2+ Locations = Multiple location setups
                    </span>
                  </div>

                  <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setLocationsPerDay((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium flex items-center justify-center transition-all cursor-pointer text-sm"
                    >
                      −
                    </button>
                    <span className="w-20 text-center text-xs font-semibold text-zinc-900">
                      {locationsPerDay} {locationsPerDay === 1 ? 'Location' : 'Locations'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLocationsPerDay((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium flex items-center justify-center transition-all cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 3. Studio Shots (Yes / No) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-200/70">
                  <div>
                    <label className="text-xs font-semibold text-zinc-900 block">
                      Studio / Soundstage Setup
                    </label>
                    <span className="text-[11px] text-zinc-500">
                      Includes studio prep, studio rent, staff, and studio power
                    </span>
                  </div>

                  <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStudioShots(true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        studioShots
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioShots(false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        !studioShots
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* 4. Tax Parameters with Explicit ON/OFF TOGGLES (Default: 0 / Off) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                  
                  {/* WHT Tax Block */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    whtEnabled ? 'bg-white border-zinc-300 shadow-xs' : 'bg-zinc-100/70 border-zinc-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="text-xs font-bold text-zinc-900 block">
                          WHT Tax
                        </label>
                        <span className="text-[10px] text-zinc-500">
                          {whtEnabled ? 'Applied to subtotal' : 'Disabled (0%)'}
                        </span>
                      </div>

                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setWhtEnabled(!whtEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                          whtEnabled ? 'bg-zinc-900 justify-end' : 'bg-zinc-300 justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-xs block"></span>
                      </button>
                    </div>

                    {whtEnabled ? (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100">
                        <span className="text-xs text-zinc-500 font-medium">Rate:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          value={whtRate}
                          onChange={(e) => setWhtRate(Number(e.target.value))}
                          className="w-20 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-zinc-900 font-bold focus:outline-none focus:bg-white focus:border-zinc-400"
                        />
                        <span className="text-xs text-zinc-600 font-bold">%</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-zinc-400 font-mono mt-1">Tax: 0%</div>
                    )}
                  </div>

                  {/* Reg Services Tax Block */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    regTaxEnabled ? 'bg-white border-zinc-300 shadow-xs' : 'bg-zinc-100/70 border-zinc-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="text-xs font-bold text-zinc-900 block">
                          Reg Services Tax
                        </label>
                        <span className="text-[10px] text-zinc-500">
                          {regTaxEnabled ? 'Applied to subtotal' : 'Disabled (0%)'}
                        </span>
                      </div>

                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setRegTaxEnabled(!regTaxEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                          regTaxEnabled ? 'bg-zinc-900 justify-end' : 'bg-zinc-300 justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-xs block"></span>
                      </button>
                    </div>

                    {regTaxEnabled ? (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100">
                        <span className="text-xs text-zinc-500 font-medium">Rate:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          value={regTaxRate}
                          onChange={(e) => setRegTaxRate(Number(e.target.value))}
                          className="w-20 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-zinc-900 font-bold focus:outline-none focus:bg-white focus:border-zinc-400"
                        />
                        <span className="text-xs text-zinc-600 font-bold">%</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-zinc-400 font-mono mt-1">Tax: 0%</div>
                    )}
                  </div>

                </div>

                {/* Tax Status Notice if disabled */}
                {taxesAreOff && (
                  <div className="px-3.5 py-2.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      Taxes are currently turned off (0%). You can calculate without taxes, but please note that all applicable taxes (WHT and Provincial Services Tax) remain payable by the client.
                    </p>
                  </div>
                )}

                {/* Action Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  <span>View Detailed Estimate Breakdown</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* TERMS & CONDITIONS & POLICIES NOTICE AT BOTTOM OF CALCULATOR */}
                <div className="pt-2 border-t border-zinc-200/80 space-y-3 text-xs text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                      Key Terms & Conditions
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">Nasharz Films Production Policies</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                    {/* Shoot Cancellation Policy */}
                    <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 space-y-1">
                      <strong className="text-zinc-900 block font-semibold text-[11px]">
                        Shoot Cancellation & Delays
                      </strong>
                      <p className="text-zinc-600 text-[10.5px]">
                        • <strong className="text-zinc-800">50% of the total estimate fee</strong> is incurred in the event of project or shoot cancellation post-confirmation.
                      </p>
                      <p className="text-zinc-600 text-[10.5px]">
                        • Rescheduling or shoot postponements due to weather, location unavailability, or force majeure remain the client's responsibility and will be billed at actuals.
                      </p>
                    </div>

                    {/* Production House Rights Reservation */}
                    <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 space-y-1">
                      <strong className="text-zinc-900 block font-semibold text-[11px]">
                        Production House Rights Reservation
                      </strong>
                      <p className="text-zinc-600 text-[10.5px]">
                        • Nasharz Films (Production House) reserves all rights to revise, modify, adjust, or decline final confirmation based on project schedule availability, creative scope revisions, script changes, or operational constraints.
                      </p>
                    </div>
                  </div>

                  {/* Payment & Talent Quick Points */}
                  <div className="px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200/60 rounded-xl text-[10.5px] text-zinc-500 space-y-1">
                    <p>
                      • <strong className="text-zinc-700">Payment Milestones:</strong> 75% advance payment required at least 7 days prior to shooting date; 25% balance payable at 1st cut review.
                    </p>
                    <p>
                      • <strong className="text-zinc-700">Celebrity / Talent Exclusion:</strong> Celebrity / Lead talent fees, travel, lodging, glam team, and rider expenses are strictly excluded from this estimate and billed separately at actuals.
                    </p>
                  </div>
                </div>

              </form>
            </div>
          ) : (
            /* VIEW 2: DETAILED ESTIMATE BREAKDOWN & SUMMARY */
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOP CONTROLS BAR (Parameters pill bar + actions) */}
              <div className="bg-zinc-50/80 border border-zinc-200/70 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-zinc-500 text-[11px] font-medium mr-1">Scope:</span>
                  
                  {/* Days Selector Pill */}
                  <div className="flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-2xs gap-1.5">
                    <span className="text-zinc-600 font-medium">Days:</span>
                    <button
                      onClick={() => handleQuickRecalculate(Math.max(1, days - 1), locationsPerDay, studioShots)}
                      className="px-1 hover:bg-zinc-100 rounded text-zinc-500 font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-zinc-900">{days}</span>
                    <button
                      onClick={() => handleQuickRecalculate(days + 1, locationsPerDay, studioShots)}
                      className="px-1 hover:bg-zinc-100 rounded text-zinc-500 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Locations Selector Pill */}
                  <div className="flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-2xs gap-1.5">
                    <span className="text-zinc-600 font-medium">Locations:</span>
                    <button
                      onClick={() => handleQuickRecalculate(days, Math.max(1, locationsPerDay - 1), studioShots)}
                      className="px-1 hover:bg-zinc-100 rounded text-zinc-500 font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-zinc-900">{locationsPerDay}</span>
                    <button
                      onClick={() => handleQuickRecalculate(days, locationsPerDay + 1, studioShots)}
                      className="px-1 hover:bg-zinc-100 rounded text-zinc-500 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Studio Setup Pill */}
                  <button
                    onClick={() => handleQuickRecalculate(days, locationsPerDay, !studioShots)}
                    className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1 text-zinc-700 font-medium hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
                  >
                    Studio: <strong className="text-zinc-900">{studioShots ? 'Yes' : 'No'}</strong>
                  </button>

                  {/* Tax Toggles in Detail Bar */}
                  <button
                    onClick={() => setWhtEnabled(!whtEnabled)}
                    className={`border rounded-lg px-2 py-1 text-[11px] font-medium transition-all cursor-pointer shadow-2xs ${
                      whtEnabled
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    WHT: {whtEnabled ? `${whtRate}%` : 'Off (0%)'}
                  </button>

                  <button
                    onClick={() => setRegTaxEnabled(!regTaxEnabled)}
                    className={`border rounded-lg px-2 py-1 text-[11px] font-medium transition-all cursor-pointer shadow-2xs ${
                      regTaxEnabled
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Reg Tax: {regTaxEnabled ? `${regTaxRate}%` : 'Off (0%)'}
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => setHasCalculated(false)}
                    className="text-xs text-zinc-500 hover:text-zinc-900 font-medium px-2.5 py-1 rounded-lg hover:bg-zinc-200/50 transition-all cursor-pointer"
                  >
                    Edit Scope
                  </button>
                  <button
                    onClick={handleResetToBaseline}
                    className="text-xs text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-200/50 transition-all cursor-pointer"
                    title="Reset to 1-Day default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CLEAN SUMMARY CARD */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Estimated Production Investment ({days} Shoot {days === 1 ? 'Day' : 'Days'})
                  </span>
                  <div className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight flex items-baseline gap-2 font-mono">
                    <span>PKR {grandTotal.toLocaleString()}</span>
                    <span className="text-xs font-normal text-zinc-400 tracking-normal font-sans">
                      {taxesAreOff ? 'Excl. Taxes' : 'Incl. Applied Taxes'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <span>Hard Costs: <strong className="text-zinc-700 font-medium">PKR {hardCostsTotal.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>WHT: <strong className="text-zinc-700 font-medium">{whtEnabled ? `PKR ${whtTax.toLocaleString()} (${whtRate}%)` : '0% (Off)'}</strong></span>
                    <span>•</span>
                    <span>Reg Services Tax: <strong className="text-zinc-700 font-medium">{regTaxEnabled ? `PKR ${regTax.toLocaleString()} (${regTaxRate}%)` : '0% (Off)'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleAddCustomItem}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* TAX NOTIFICATION IF OFF IN DETAILED VIEW */}
              {taxesAreOff && (
                <div className="px-4 py-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="font-semibold">Notice:</strong> You have not added taxes to this estimate. All applicable statutory taxes (WHT and Provincial Services Tax) remain payable directly by the client.
                  </p>
                </div>
              )}

              {/* CELEBRITY NOTICE & REFERENCE DISCLAIMER BANNER */}
              <div className="space-y-2.5">
                <div className="px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex items-start gap-2.5 text-xs text-zinc-700">
                  <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-zinc-900 font-semibold">P.S. Notice:</strong> Celebrity / Lead Talent fees, talent travel, accommodation, per diem, personal styling/glam crew, and rider expenses are strictly <span className="underline decoration-zinc-400 font-medium">EXCLUDED</span> from this quote and will be billed separately at actuals based on confirmed talent selection.
                  </p>
                </div>

                <div className="px-4 py-2.5 bg-zinc-50/60 border border-zinc-200/60 rounded-xl flex items-start gap-2 text-xs text-zinc-500">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-[10.5px] leading-relaxed italic">
                    <strong>Reference Disclaimer:</strong> This cost estimate is generated for your reference and planning purposes only. Nasharz Films (PH) reserves all rights to revise, modify, or decline final confirmation based on creative revisions, schedule changes, or operational constraints.
                  </p>
                </div>
              </div>

              {/* CATEGORY FILTER PILLS & SEARCH */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                  <button
                    onClick={() => setActiveCategoryFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeCategoryFilter === 'ALL'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                    }`}
                  >
                    All ({items.length})
                  </button>
                  {ESTIMATE_CATEGORIES.map((cat) => {
                    const count = items.filter((i) => i.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                          activeCategoryFilter === cat
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Filter line items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-44 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-300"
                />
              </div>

              {/* DETAILED LINE ITEMS TABLE */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/80 text-zinc-500 uppercase text-[10px] font-semibold tracking-wider border-b border-zinc-200">
                        <th className="py-2.5 px-3 text-center w-10">Inc</th>
                        <th className="py-2.5 px-3 min-w-[220px]">Description</th>
                        <th className="py-2.5 px-3 text-center w-24">Rate (PKR)</th>
                        <th className="py-2.5 px-3 text-center w-16">Units</th>
                        <th className="py-2.5 px-3 text-center w-16">Days</th>
                        <th className="py-2.5 px-3 text-right min-w-[130px]">Amount (PKR)</th>
                        <th className="py-2.5 px-3 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-sans">
                      {groupedCategories.map((group) => (
                        <React.Fragment key={group.category}>
                          {/* Section Category Header */}
                          <tr className="bg-zinc-50/50">
                            <td colSpan={7} className="px-4 py-2 border-y border-zinc-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                {group.category}
                              </span>
                            </td>
                          </tr>

                          {/* Line Items */}
                          {group.items.map((item) => (
                            <tr
                              key={item.id}
                              className={`transition-colors hover:bg-zinc-50/70 ${
                                !item.included ? 'opacity-35 bg-zinc-50/30' : ''
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-2 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={item.included}
                                  onChange={() => toggleItem(item.id)}
                                  className="w-3.5 h-3.5 rounded text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                                />
                              </td>

                              {/* Description */}
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                                  className="w-full bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus:border-zinc-400 focus:bg-white px-1 py-0.5 font-medium text-zinc-900 focus:outline-none text-xs"
                                />
                                {item.isLeadTalent && (
                                  <span className="inline-block mt-0.5 text-[9px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded">
                                    Billed at actuals
                                  </span>
                                )}
                              </td>

                              {/* Rate */}
                              <td className="py-2 px-3 text-center">
                                <input
                                  type="text"
                                  value={item.rate || '—'}
                                  onChange={(e) => updateItemField(item.id, 'rate', e.target.value)}
                                  className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus:border-zinc-400 focus:bg-white px-1 py-0.5 text-zinc-600 focus:outline-none text-xs font-mono"
                                />
                              </td>

                              {/* Units */}
                              <td className="py-2 px-3 text-center">
                                <input
                                  type="text"
                                  value={item.units !== undefined ? item.units : 1}
                                  onChange={(e) => updateItemField(item.id, 'units', e.target.value)}
                                  className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus:border-zinc-400 focus:bg-white px-1 py-0.5 text-zinc-600 focus:outline-none text-xs font-mono"
                                />
                              </td>

                              {/* Days */}
                              <td className="py-2 px-3 text-center">
                                <input
                                  type="text"
                                  value={item.days !== undefined ? item.days : '—'}
                                  onChange={(e) => updateItemField(item.id, 'days', e.target.value)}
                                  className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus:border-zinc-400 focus:bg-white px-1 py-0.5 text-zinc-600 focus:outline-none text-xs font-mono"
                                />
                              </td>

                              {/* Amount (PKR) */}
                              <td className="py-2 px-3 text-right">
                                {item.isAtActual ? (
                                  <span className="text-zinc-400 font-medium text-xs">At Actual</span>
                                ) : (
                                  <div className="flex items-center justify-end gap-1 font-mono">
                                    <input
                                      type="number"
                                      value={item.amount || 0}
                                      onChange={(e) =>
                                        updateItemField(item.id, 'amount', Math.max(0, Number(e.target.value)))
                                      }
                                      className="w-24 text-right bg-transparent hover:bg-zinc-50 focus:bg-white border border-transparent hover:border-zinc-200 focus:border-zinc-400 rounded px-1.5 py-0.5 font-medium text-zinc-900 focus:outline-none text-xs"
                                    />
                                  </div>
                                )}
                              </td>

                              {/* Delete */}
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FINANCIAL SUMMARY TOTALS */}
                <div className="bg-zinc-50 border-t border-zinc-200 p-6 space-y-2.5 text-xs text-zinc-600 font-sans">
                  <div className="flex justify-between items-center text-zinc-900 font-semibold">
                    <span className="uppercase tracking-wider text-[11px]">Hard Costs Total (Subtotal Without Tax)</span>
                    <span className="font-mono font-bold text-sm text-zinc-900">PKR {hardCostsTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                    <span>+ WHT @ {effectiveWhtRate}%</span>
                    <span className="font-mono">{whtEnabled ? `PKR ${whtTax.toLocaleString()}` : 'PKR 0 (Disabled)'}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                    <span>+ Reg Services Tax @ {effectiveRegTaxRate}%</span>
                    <span className="font-mono">{regTaxEnabled ? `PKR ${regTax.toLocaleString()}` : 'PKR 0 (Disabled)'}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-zinc-900 pt-3 border-t border-zinc-300">
                    <span className="uppercase tracking-tight">Grand Total (PKR) — {taxesAreOff ? 'Excl. Taxes' : 'Incl. Taxes'}</span>
                    <span className="font-mono text-base font-bold">PKR {grandTotal.toLocaleString()}</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 pt-1">
                    * All Applicable Taxes (GST, WHT, Provincial Services Tax etc.) Payable by Client. Challan receipts of WHT and SST shall be required.
                  </p>
                </div>
              </div>

              {/* COLLAPSIBLE TERMS & CONDITIONS ACCORDION */}
              <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/80 overflow-hidden text-xs transition-all">
                <button
                  type="button"
                  onClick={() => setShowTerms(!showTerms)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-zinc-100/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                      Terms & Conditions
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      ({showTerms ? 'Click to collapse' : 'Click to view full terms'})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
                    <span>{showTerms ? 'Hide Terms' : 'View Terms & Conditions'}</span>
                    {showTerms ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                </button>

                {showTerms && (
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-200/60 text-zinc-600 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                      <div>
                        <strong className="text-zinc-800 block mb-1">1. Payment Terms:</strong>
                        <p>• 75% advance payment to be paid at least 7 days prior to shooting date.</p>
                        <p>• 25% payment to be paid at 1st cut review.</p>
                        <p>• Challan receipts of WHT and Regional Services Tax shall be required.</p>
                      </div>
                      <div>
                        <strong className="text-zinc-800 block mb-1">2. Creative Scope:</strong>
                        <p>• Brand artwork and sung lines provided by agency prior to shoot.</p>
                        <p>• Estimate includes up to 1 creative revision cycle.</p>
                        <p>• Photography & digital adapt versions billed separately.</p>
                      </div>
                      <div>
                        <strong className="text-zinc-800 block mb-1">3. Talent & Travel:</strong>
                        <p>• Celebrity talent fees, travel, lodging, per diem, and exclusive team expenses are strictly excluded and billed at actuals.</p>
                        <p>• Travel/lodging expenses for client/agency are billed separately.</p>
                      </div>
                      <div>
                        <strong className="text-zinc-800 block mb-1">4. Delays & Cancellations:</strong>
                        <p>• 50% of total fee incurred in case of project cancellation post-confirmation.</p>
                        <p>• Reschedules due to weather or force majeure will be client's responsibility.</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/60 text-[10.5px] text-zinc-500 italic">
                      * This cost estimate is generated for reference only. Nasharz Films reserves all rights to revise, modify, or decline final confirmation based on project schedule, creative scope changes, or operational constraints.
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 sm:px-8 py-3 bg-[#fafafa] border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Prepared for: <strong className="text-zinc-800 font-medium">Alaska Battery</strong>
          </span>
          <span className="text-[11px] text-zinc-400">
            Nasharz Films Creative Production
          </span>
        </div>

      </div>
    </div>
  );
};


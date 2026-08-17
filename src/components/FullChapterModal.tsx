import React from 'react';
import { Chapter, BrandingConfig } from '../types';
import { generateChapterPDF } from '../utils/pdfGenerator';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  FileDown, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Folder, 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface FullChapterModalProps {
  chapter: Chapter;
  branding: BrandingConfig;
  clientName: string;
  onClose: () => void;
}

export const FullChapterModal: React.FC<FullChapterModalProps> = ({
  chapter,
  branding,
  clientName,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [activeFolderId, setActiveFolderId] = React.useState<string>(
    chapter.folders && chapter.folders.length > 0 ? chapter.folders[0].id : ''
  );
  const [enlargedIndex, setEnlargedIndex] = React.useState<number | null>(null);
  const [zoomScale, setZoomScale] = React.useState<number>(1);
  const [panPosition, setPanPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number }>({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Determine active list of images based on active folder or default galleryImages
  const currentFolder = chapter.folders?.find((f) => f.id === activeFolderId) || (chapter.folders && chapter.folders.length > 0 ? chapter.folders[0] : null);
  const galleryList = currentFolder ? currentFolder.images : chapter.galleryImages || [];
  const enlargedImage = enlargedIndex !== null && galleryList[enlargedIndex] ? galleryList[enlargedIndex] : null;

  const isStoryboard = chapter.id === 'storyboards' || chapter.number === '06';

  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Separator line: e.g. "___________________" or "===================" or "..................."
          if (/^([_=.-])\1{4,}$/.test(trimmed)) {
            return (
              <div key={idx} className="my-6 py-2">
                <div className="h-1 bg-gradient-to-r from-zinc-800 via-[#b8860b] to-zinc-800 rounded-full shadow-sm w-full opacity-90"></div>
              </div>
            );
          }

          // Concept Titles: e.g. "Concept 1", "Concept 1A", "Concept 2", "Concept 3", "Concept 3A", "CONCEPT 1:", "CONCEPT 3A:", etc.
          const isConceptTitle = /^(CONCEPT\s+([0-9]+[A-Z]?)|Concept\s+([0-9]+[A-Z]?))/i.test(trimmed);
          if (isConceptTitle) {
            return (
              <div
                key={idx}
                className="mt-6 mb-3 p-3.5 bg-[#1c2024] text-white rounded-xl border border-zinc-700/80 shadow-md flex items-center gap-3"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#c69a53] flex-shrink-0 animate-pulse"></span>
                <span className="font-extrabold text-base sm:text-lg tracking-wide uppercase text-amber-300">
                  {trimmed}
                </span>
              </div>
            );
          }

          // Major Route / Chapter Banner
          const isRouteHeader = /^(ALASKA BATTERIES — TVC ROUTE|TVC ROUTE [0-9]|CAMPAIGN FILM CONCEPTS)/i.test(trimmed);
          if (isRouteHeader) {
            return (
              <div
                key={idx}
                className="mt-7 mb-3 px-4 py-2.5 bg-zinc-200/90 text-zinc-900 rounded-lg border-l-4 border-[#b8860b] font-bold text-sm sm:text-base tracking-tight uppercase"
              >
                {trimmed}
              </div>
            );
          }

          // Subheaders or Scene Headers: e.g. "OPEN — WORKSHOP", "CORE IDEA", "PRODUCT REVEAL", "THE FILM", "PART 01", "PRODUCT SCOPE", etc.
          const isSubhead = /^(OPEN|THE GURU|THE EXPERT TEST|RESOLUTION|ALASKA REVEAL|THE SECOND BATTERY|JINGLE|COMPLETE JINGLE|THE ENERGY BUILDS|RETURN TO THE WORKSHOP|PRODUCT REVEAL|END FRAME|CORE IDEA|THE FILM|PART 01|PART 02|PRODUCT SCOPE|CURRENT PRESENTATION|FUTURE EXPANSION|LIGHTS OUT)\b/i.test(trimmed);
          if (isSubhead) {
            return (
              <div key={idx} className="font-bold text-zinc-900 text-sm sm:text-base mt-4 mb-1 text-[#b8860b]">
                {trimmed}
              </div>
            );
          }

          // Empty lines
          if (!trimmed) {
            return <div key={idx} className="h-2"></div>;
          }

          // Regular narrative / dialogue line
          return (
            <p key={idx} className="text-zinc-700 leading-relaxed text-sm sm:text-base">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (enlargedIndex === null || galleryList.length <= 1) return;
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    setEnlargedIndex((prev) => (prev !== null ? (prev - 1 + galleryList.length) % galleryList.length : 0));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (enlargedIndex === null || galleryList.length <= 1) return;
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    setEnlargedIndex((prev) => (prev !== null ? (prev + 1) % galleryList.length : 0));
  };

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.35, 1.0);
      if (next === 1.0) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Mouse & Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: panPosition.x,
      initialPanY: panPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    setPanPosition({
      x: dragStartRef.current.initialPanX + deltaX,
      y: dragStartRef.current.initialPanY + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      initialPanX: panPosition.x,
      initialPanY: panPosition.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomScale <= 1 || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.startX;
    const deltaY = e.touches[0].clientY - dragStartRef.current.startY;
    setPanPosition({
      x: dragStartRef.current.initialPanX + deltaX,
      y: dragStartRef.current.initialPanY + deltaY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation for lightbox (Left, Right, Escape, +, -)
  React.useEffect(() => {
    if (enlargedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setEnlargedIndex(null);
        setZoomScale(1);
      } else if (e.key === '+' || e.key === '=') {
        setZoomScale((prev) => Math.min(prev + 0.35, 3.0));
      } else if (e.key === '-' || e.key === '_') {
        setZoomScale((prev) => Math.max(prev - 0.35, 1.0));
      } else if (e.key === '0') {
        setZoomScale(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedIndex, galleryList.length]);

  const handleDownload = async () => {
    setIsGenerating(true);
    // Pass along active gallery images to make sure storyboard sheets match the current view
    const exportChapter: Chapter = {
      ...chapter,
      galleryImages: galleryList
    };
    await generateChapterPDF(exportChapter, branding, clientName);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-zinc-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-3">
            <BrandLogo src={branding.blackLogo} alt="Nasharz" className="h-6 w-auto object-contain" fallbackColor="#1a1c1e" />
            <span className="h-3.5 w-px bg-zinc-300"></span>
            <div>
              <span className="text-[10px] font-bold text-[#c69a53] uppercase tracking-widest block">
                Chapter {chapter.number}
              </span>
              <h3 className="text-base font-bold text-zinc-900 leading-tight">
                {chapter.title} — <span className="text-zinc-500 font-medium">{chapter.category}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <span>Generating PDF...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-zinc-800">
          {/* Summary Box */}
          <div className="bg-[#faf8f5] border-l-4 border-[#c69a53] p-5 rounded-r-xl">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
              Executive Summary
            </div>
            <p className="text-base font-semibold text-zinc-900 leading-relaxed italic">
              "{chapter.summary}"
            </p>
          </div>

          {/* Visual Banner */}
          {chapter.visualImage && (
            <div className="relative rounded-2xl overflow-hidden w-full aspect-[16/9] sm:aspect-[21/9] min-h-[210px] sm:min-h-[260px] max-h-[380px] bg-zinc-950 shadow-md">
              <img
                src={chapter.visualImage}
                alt={chapter.title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition:
                    chapter.visualImagePosition ||
                    (chapter.id === 'market'
                      ? 'center 12%'
                      : chapter.id === 'big-idea'
                      ? 'center 15%'
                      : 'center center')
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end items-end text-right p-5 sm:p-7 pointer-events-none">
                <span className="w-6 h-0.5 bg-[#b8860b] rounded-full mb-1.5 self-end"></span>
                <p className="text-white text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
                  {chapter.title}
                </p>
              </div>
            </div>
          )}

          {/* Full Text Details & Custom Rich Views for Market Chapter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 border-b border-zinc-100 pb-2 flex items-center justify-between">
              <span>Full Chapter Documentation</span>
              {chapter.title === 'Market' && (
                <span className="text-[10px] text-[#c69a53] font-semibold bg-[#c69a53]/10 px-2.5 py-0.5 rounded-full border border-[#c69a53]/20">
                  Interactive Market Matrix
                </span>
              )}
            </h4>

            {chapter.title === 'Market' ? (
              <div className="space-y-8 my-4">
                
                {/* 1. Market Share & Competitor Ranking */}
                <div className="bg-zinc-900 text-white p-5 sm:p-6 rounded-2xl border border-zinc-800 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                        Competitive Benchmark
                      </span>
                      <h5 className="text-lg font-bold text-white font-heading">
                        Market Share & Brand Perception Ranking
                      </h5>
                    </div>
                    <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                      70+ Year Legacy Context
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-6">
                    Osaka is currently perceived at position #1, followed by Volta, Atlas (AGS), Phoenix, and Exide. AGS & Exide carry 70+ years of operational legacy.
                  </p>

                  {/* Market Share Bars */}
                  <div className="space-y-3">
                    {[
                      { name: 'PAL (Osaka / Volta)', share: 35, color: 'bg-[#c69a53]' },
                      { name: 'AGS (Atlas Batteries)', share: 25, color: 'bg-zinc-300' },
                      { name: 'Exide Pakistan', share: 20, color: 'bg-zinc-400' },
                      { name: 'Phoenix', share: 12, color: 'bg-zinc-500' },
                      { name: 'Daewoo', share: 4, color: 'bg-zinc-600' },
                      { name: 'Others (Unique, FB, Millat)', share: 4, color: 'bg-zinc-700' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-zinc-200">{item.name}</span>
                          <span className="text-[#c69a53] font-bold">{item.share}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.share}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Quarterly Demand Cycles */}
                <div>
                  <h5 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wider">
                    Quarterly Demand Cycles
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { q: 'Q1', months: 'Jul – Sep', focus: 'UPS/Solar, Tractor, Bike', desc: 'Monsoon, heat & crop harvest peak.' },
                      { q: 'Q2', months: 'Oct – Dec', focus: 'Car, Truck', desc: 'Crop transport & early winter starts.' },
                      { q: 'Q3', months: 'Jan – Mar', focus: 'Car, UPS/Solar, Bike', desc: 'Deep winter cold starts & spring.' },
                      { q: 'Q4', months: 'Apr – Jun', focus: 'UPS/Solar (Peak)', desc: 'Peak summer heatwaves & load-shedding.' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">{item.q}</span>
                          <span className="text-[11px] font-bold text-[#c69a53]">{item.months}</span>
                        </div>
                        <div className="text-xs font-bold text-zinc-900 pt-1">{item.focus}</div>
                        <div className="text-[11px] text-zinc-500 leading-tight">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 4 Seasonal Worlds */}
                <div>
                  <h5 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wider">
                    Alaska — 4 Seasonal Worlds
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: '☀️', season: 'Hot / Summer', trigger: 'Cooling demand, heavy load-shedding, mobility', battery: 'UPS / Solar / Car / Bike' },
                      { icon: '🌧️', season: 'Rainy / Monsoon', trigger: 'Urban waterlogging, power outages, travel', battery: 'Car / Bike / UPS / Solar' },
                      { icon: '❄️', season: 'Winter', trigger: 'Vehicle cold-starts, business continuity', battery: 'Car / Truck / Bike / UPS' },
                      { icon: '🌾', season: 'Crop / Harvest', trigger: 'Agricultural machinery non-stop operation', battery: 'Tractor / Truck / Heavy Duty' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-zinc-900">{item.season}</div>
                          <div className="text-[11px] text-zinc-600 mb-1">{item.trigger}</div>
                          <div className="text-[11px] font-semibold text-[#b8860b]">
                            Opportunity: {item.battery}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Rich Interactive Table */}
                <div>
                  <h5 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wider">
                    Seasonal Product Matrix & Consumer Triggers
                  </h5>
                  <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-900 text-white">
                          <th className="p-3 font-bold border-b border-zinc-800">Product Category</th>
                          <th className="p-3 font-bold border-b border-zinc-800">Peak Months / Season</th>
                          <th className="p-3 font-bold border-b border-zinc-800">Why / Consumer Trigger</th>
                          <th className="p-3 font-bold border-b border-zinc-800">Alaska Line</th>
                          <th className="p-3 font-bold border-b border-zinc-800">Key USP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 text-zinc-700 bg-white">
                        {[
                          { prod: 'Motorcycle', season: 'Apr–Sep (Summer + Monsoon)', trigger: 'Daily commuting, travel, monsoon reliability', alaska: 'Motorcycle Battery', usp: 'Reliability + Affordability' },
                          { prod: 'Car', season: 'Oct–Mar & Apr–Jun (Winter + Summer)', trigger: 'Cold starts, travel, family mobility, AC electrical load', alaska: 'Automotive', usp: 'Warranty + Tech (Calcium Silver & Graphite)' },
                          { prod: 'Truck', season: 'Oct–Mar (Crop + Winter)', trigger: 'Transport, harvest movement, commercial uptime', alaska: 'Heavy Duty', usp: 'Uptime + Dependability' },
                          { prod: 'Tractor', season: 'Jul–Sep & Oct–Nov (Crop Season)', trigger: 'Machinery must start and work when crop demands', alaska: 'Agri / Heavy Duty', usp: 'Endurance + Dependability' },
                          { prod: 'UPS', season: 'Apr–Sep (Summer)', trigger: 'Heat, load-shedding, power interruptions', alaska: 'DeepCycle', usp: 'Thicker plates + 9M warranty' },
                          { prod: 'Solar', season: 'Apr–Jun & Jul–Sep (Summer)', trigger: 'High electricity bills, solar generation, energy-cost pressure', alaska: 'Lithium', usp: 'Long life + Long cycles (LiFePO4)' },
                          { prod: 'Home Backup', season: 'Apr–Sep (Summer + Monsoon)', trigger: "Family shouldn't stop when electricity does", alaska: 'DeepCycle / Lithium', usp: 'Backup duration + Value' },
                          { prod: 'Commercial Backup', season: 'Apr–Sep & Year-round', trigger: 'Business cannot afford interruption', alaska: 'DeepCycle / Lithium', usp: 'Uptime & Zero Downtime' },
                        ].map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-amber-50/30' : 'bg-zinc-50/60 hover:bg-amber-50/30'}>
                            <td className="p-3 font-bold text-zinc-900 whitespace-nowrap">{row.prod}</td>
                            <td className="p-3 font-medium text-[#b8860b] whitespace-nowrap">{row.season}</td>
                            <td className="p-3 text-zinc-600 min-w-[200px]">{row.trigger}</td>
                            <td className="p-3 font-semibold text-zinc-800 whitespace-nowrap">{row.alaska}</td>
                            <td className="p-3 font-bold text-zinc-900 bg-zinc-100/50 rounded">{row.usp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Text Notes */}
                {chapter.fullText && (
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap font-sans">
                    {chapter.fullText}
                  </div>
                )}

              </div>
            ) : (chapter.folders && chapter.folders.length > 0) || (chapter.galleryImages && chapter.galleryImages.length > 0) ? (
              <div className="space-y-6 my-2">
                
                {/* Folders Tab Bar (if chapter has multiple storyboard folders) */}
                {chapter.folders && chapter.folders.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-200">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" /> Concept Folders:
                    </span>
                    {chapter.folders.map((folder) => {
                      const isActive = folder.id === activeFolderId;
                      return (
                        <button
                          key={folder.id}
                          onClick={() => {
                            setActiveFolderId(folder.id);
                            setEnlargedIndex(null);
                          }}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            isActive
                              ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                          }`}
                        >
                          {isActive ? (
                            <FolderOpen className="w-3.5 h-3.5 text-[#c69a53]" />
                          ) : (
                            <Folder className="w-3.5 h-3.5 text-zinc-400" />
                          )}
                          <span>{folder.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                            {folder.images.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* For Storyboards: Top-to-Bottom Vertical Scroll Feed with Magnifying Glass */}
                {isStoryboard ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-amber-50/60 border border-amber-200/80 rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#c69a53]"></span>
                        <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                          {currentFolder?.name || 'Storyboard Sequence'}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          ({galleryList.length} Storyboard Sheets)
                        </span>
                      </div>
                      <span className="text-[11px] text-[#b8860b] font-medium flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Click any sheet to zoom in with magnifier
                      </span>
                    </div>

                    <div className="flex flex-col gap-8">
                      {galleryList.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setEnlargedIndex(idx);
                            setZoomScale(1.4); // Auto initial crisp reading zoom
                          }}
                          className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden"
                        >
                          {/* Storyboard Top Bar */}
                          <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                                0{idx + 1}
                              </span>
                              <h5 className="text-sm font-bold text-zinc-900 group-hover:text-[#b8860b] transition-colors">
                                {img.title}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 group-hover:border-[#c69a53] group-hover:text-[#b8860b] transition-all">
                                <ZoomIn className="w-3.5 h-3.5" /> Click to Zoom & Read
                              </span>
                            </div>
                          </div>

                          {/* Large High-Res Storyboard Frame */}
                          <div className="relative w-full bg-zinc-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-full h-auto max-h-[650px] object-contain rounded-lg transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                            />
                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                              <span className="px-4 py-2 bg-zinc-900/90 text-white rounded-full text-xs font-semibold tracking-wide shadow-xl backdrop-blur-md flex items-center gap-2">
                                <ZoomIn className="w-4 h-4 text-[#c69a53]" />
                                <span>Enlarge with Magnifying Glass</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Standard 2-Column Gallery Grid (e.g. Art & Talent) */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {galleryList.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setEnlargedIndex(idx);
                          setZoomScale(1);
                        }}
                        className="group cursor-pointer flex flex-col transition-all duration-300"
                      >
                        {/* Apple-aesthetic Image Container */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100/80 border border-zinc-200/80 shadow-sm transition-all duration-500 ease-out group-hover:shadow-xl group-hover:border-zinc-300 group-hover:-translate-y-1">
                          <img
                            src={img.url}
                            alt={img.title}
                            style={{ objectPosition: img.objectPosition || 'center center' }}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          
                          {/* Hover Overlay with Apple-like frosted glass zoom button */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="px-4 py-2 bg-white/90 text-zinc-900 rounded-full text-xs font-semibold tracking-wide shadow-lg backdrop-blur-md flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <ZoomIn className="w-3.5 h-3.5 text-[#b8860b]" />
                              <span>Click to Enlarge</span>
                            </span>
                          </div>
                        </div>

                        {/* Minimalist Apple-style caption */}
                        <div className="pt-3.5 px-1 flex items-baseline justify-between gap-2">
                          <h5 className="text-sm font-semibold text-zinc-900 group-hover:text-[#b8860b] transition-colors duration-200">
                            {img.title}
                          </h5>
                          <span className="text-[11px] font-medium text-zinc-400 whitespace-nowrap">
                            Artwork {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {chapter.fullText ? (
                  <div className="font-sans mt-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-sm">
                    {renderFormattedText(chapter.fullText)}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="font-sans">
                {renderFormattedText(chapter.fullText || '')}
              </div>
            )}
          </div>

          {/* Key Deliverables */}
          {chapter.keyPoints && chapter.keyPoints.length > 0 && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c69a53]" />
                Key Deliverables & Specs
              </h4>
              <ul className="space-y-2">
                {chapter.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53] mt-2 flex-shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attached Files */}
          {chapter.attachedFiles && chapter.attachedFiles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Attached Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chapter.attachedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white border border-zinc-200 rounded-lg flex items-center justify-between hover:border-zinc-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 rounded-md text-zinc-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-900 truncate">
                          {file.name}
                        </div>
                        {file.size && (
                          <div className="text-[10px] text-zinc-400">{file.size}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-md transition-all"
                      title="Download"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>{branding.producedBy}</span>
          <div className="flex items-center gap-3">
            <span>
              {clientName && clientName.toLowerCase() !== 'alaska batteries' && clientName.toLowerCase() !== 'alaska' ? (
                <>Prepared by: <strong className="text-zinc-900">{clientName}</strong> for <strong className="text-zinc-900">Alaska Batteries</strong></>
              ) : (
                <>Prepared for: <strong className="text-zinc-900">Alaska Batteries</strong></>
              )}
            </span>
            <img src={branding.nasharzIcon} alt="Nasharz Films" className="h-6 w-auto opacity-80" />
          </div>
        </div>

      </div>

      {/* Lightbox / Enlarged View Modal with Next / Prev Navigation */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
          onClick={() => setEnlargedIndex(null)}
        >
          {/* Top Bar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between py-2 px-2 text-white mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c69a53] block font-heading">
                {currentFolder?.name ? `${currentFolder.name} • ` : ''}{chapter.title} • Page {(enlargedIndex ?? 0) + 1} of {galleryList.length}
              </span>
              <h4 className="text-sm sm:text-base font-semibold text-white">
                {enlargedImage.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Magnifier / Zoom Bar */}
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1.0}
                  className="p-1.5 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-transparent rounded-full text-white transition-all cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-zinc-300 min-w-[44px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3.0}
                  className="p-1.5 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-transparent rounded-full text-white transition-all cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {zoomScale > 1 && (
                  <button
                    onClick={handleResetZoom}
                    className="p-1.5 hover:bg-white/20 rounded-full text-[#c69a53] transition-all cursor-pointer ml-0.5"
                    title="Reset Zoom (0)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-xs text-zinc-400 bg-white/10 px-3 py-1 rounded-full font-mono">
                {(enlargedIndex ?? 0) + 1} / {galleryList.length}
              </span>
              <button
                onClick={() => {
                  setEnlargedIndex(null);
                  setZoomScale(1);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Stage with Carousel Nav Buttons */}
          <div 
            className="relative max-w-5xl w-full flex-1 max-h-[82vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {galleryList.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-white/40 shadow-2xl backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Enlarged Image Display with Magnifier Zoom & Pan Drag container */}
            <div 
              className={`relative w-full h-full flex items-center justify-center p-2 select-none ${
                zoomScale > 1 
                  ? isDragging 
                    ? 'cursor-grabbing' 
                    : 'cursor-grab' 
                  : 'cursor-default'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="transition-transform duration-75 ease-out origin-center"
                style={{ 
                  transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})` 
                }}
              >
                <img
                  src={enlargedImage.url}
                  alt={enlargedImage.title}
                  className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl border border-white/10 bg-zinc-950 block select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Next Button */}
            {galleryList.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-white/40 shadow-2xl backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails / Indicator Dots */}
          {galleryList.length > 1 && (
            <div 
              className="flex items-center gap-2 mt-3 p-1.5 bg-white/10 rounded-full backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setEnlargedIndex(i);
                    setZoomScale(1);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    i === enlargedIndex 
                      ? 'w-6 h-2 bg-[#c69a53]' 
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}

          <p className="text-zinc-400 text-[11px] mt-2 select-none flex items-center gap-3">
            <span>Use arrow keys <span className="font-mono text-zinc-300">← →</span> to navigate</span>
            <span>•</span>
            <span>Zoom: <span className="font-mono text-zinc-300">+ / -</span> (or click magnifier buttons above)</span>
            <span>•</span>
            <span>Press <span className="font-mono text-zinc-300">Esc</span> to exit</span>
          </p>
        </div>
      )}

    </div>
  );
};

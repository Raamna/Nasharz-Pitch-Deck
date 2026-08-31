import React, { useState } from 'react';
import { DeckData, Chapter } from '../types';
import { generateChapterPDF } from '../utils/pdfGenerator';
import { FullChapterModal } from './FullChapterModal';
import { EstimateModal } from './EstimateModal';
import { MediaHubModal } from './MediaHubModal';
import { UpdatesModal } from './UpdatesModal';
import { BrandLogo } from './BrandLogo';
import {
  Download,
  LogOut,
  ChevronDown,
  Calculator,
  Maximize2,
  Lock,
  Sparkles,
  Sliders,
  CheckCircle2,
  Video,
  Music,
  Play,
  LayoutDashboard,
  ArrowRight,
  X,
  Bell,
  Film,
  Image as ImageIcon
} from 'lucide-react';

interface DeckPageProps {
  data: DeckData;
  userName: string;
  userRole: 'client' | 'admin';
  onSignOut: () => void;
  onOpenAdmin: () => void;
}

export const DeckPage: React.FC<DeckPageProps> = ({
  data,
  userName,
  userRole,
  onSignOut,
  onOpenAdmin,
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(data.chapters[0]?.id || 'brief');
  const [selectedConceptTab, setSelectedConceptTab] = useState<string>('final-concepts');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showMediaHub, setShowMediaHub] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentChapter = data.chapters.find((c) => c.id === activeChapterId) || data.chapters[0];
  const totalChapters = data.chapters.length;

  const handleDownloadPDF = async () => {
    if (!currentChapter) return;
    setIsGenerating(true);
    await generateChapterPDF(currentChapter, data.branding, userName);
    setIsGenerating(false);
  };

  const handleNavigateChapter = (chapterId: string, conceptTab?: string) => {
    setActiveChapterId(chapterId);
    if (conceptTab) {
      setSelectedConceptTab(conceptTab);
    }
    setShowFullModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f3f0] text-[#1a1c1e] font-sans flex flex-col justify-between selection:bg-[#c69a53] selection:text-white">
      
      {/* 1. TOP HEADER */}
      <header className="px-6 sm:px-12 py-4 sm:py-5 border-b border-zinc-200/80 flex items-center justify-between bg-[#f4f3f0] sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <BrandLogo
            src={data.branding.blackLogo}
            alt="Nasharz"
            className="h-6 w-auto object-contain"
            fallbackColor="#1a1c1e"
          />
          <span className="h-3.5 w-px bg-zinc-300"></span>
          <span className="text-xs font-semibold text-zinc-800 tracking-tight font-sans">
            Nasharz Films
          </span>
        </div>

        {/* Right Header Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Highlighted Updates Button */}
          <button
            onClick={() => setShowUpdatesModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border border-amber-500/40 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="View Campaign Updates, Wardrobe, Vehicles & Locations"
          >
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span className="hidden xs:inline">What's New</span>
            <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
              NEW
            </span>
          </button>

          {/* Direct Generate Estimate Button */}
          <button
            onClick={() => setShowEstimateModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Open Estimate & Budget Breakdown"
          >
            <Calculator className="w-3.5 h-3.5 text-black" />
            <span className="hidden xs:inline">Generate Estimate</span>
            <span className="xs:hidden">Estimate</span>
          </button>

          {/* Quick Access Media Vault Button */}
          <button
            onClick={() => setShowMediaHub(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#1c2024] hover:bg-black text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer border border-zinc-800"
          >
            <Video className="w-3.5 h-3.5 text-[#c69a53]" />
            <span className="hidden sm:inline">Media Vault</span>
            <span className="sm:hidden">Vault</span>
            <span className="bg-[#c69a53] text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {data.mediaAssets?.length || 0}
            </span>
          </button>

          {/* Quick Admin Portal Button for Admin */}
          {userRole === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-black text-amber-400 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer border border-amber-500/30"
              title="Return to Producer Backend Control Center"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#c69a53]" />
              <span className="hidden md:inline">Admin Panel</span>
            </button>
          )}

          {/* User Profile & Signout Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-transparent hover:bg-zinc-200/50 px-2.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <span className="text-xs font-normal text-zinc-700">{userName}</span>
              <div className="w-6 h-6 rounded-full bg-[#d5d2cb] text-zinc-700 flex items-center justify-center text-xs font-medium">
                {userName.charAt(0) || 'a'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-zinc-200/80 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-zinc-100">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Logged in as</p>
                  <p className="text-xs font-bold text-zinc-900 truncate">{userName}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold text-[#c69a53] uppercase bg-[#c69a53]/10 px-1.5 py-0.5 rounded">
                    {userRole === 'admin' ? 'Executive Producer' : 'Client Reviewer'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowUpdatesModal(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-amber-900 hover:bg-amber-50 font-bold flex items-center justify-between transition-all cursor-pointer border-b border-zinc-100 bg-amber-500/5"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#b8860b]" />
                    <span>What's New (Updates)</span>
                  </div>
                  <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">NEW</span>
                </button>

                {/* Return to Admin Panel Option (Prominent for Admin) */}
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#916723] hover:bg-amber-50 font-bold flex items-center justify-between transition-all cursor-pointer border-b border-zinc-100 bg-amber-500/5"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-[#b8860b]" />
                      <span>Back to Admin Panel</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#b8860b]" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowMediaHub(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#c69a53]" />
                  <span>Video & Audio Vault ({data.mediaAssets?.length || 0})</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowEstimateModal(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-[#c69a53]" />
                  <span>Generate Estimate</span>
                </button>

                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-[#c69a53]" />
                    <span>Producer Backend</span>
                  </button>
                )}

                <button
                  onClick={onSignOut}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 transition-all cursor-pointer border-t border-zinc-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN PRESENTATION CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        
        {/* Title and Client Breadcrumb */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <div className="text-xs font-medium text-[#b8860b] mb-1">
              Alaska Batteries / Launch Deck
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 font-heading tracking-tight">
              Campaign Review
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-1">
              From brief to final execution.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-normal text-zinc-400 block mb-0.5">
              Prepared for
            </span>
            <span className="text-xs font-medium text-zinc-900">
              Alaska Batteries
            </span>
          </div>
        </div>

        {/* Chapter Navigation Tabs with Highlight Badges */}
        <div className="border-b border-zinc-200/80 pb-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-5 sm:gap-7 py-1">
            {data.chapters.map((ch) => {
              const isActive = ch.id === currentChapter.id;
              const hasUpdate = ch.id === 'concepts' || ch.id === 'storyboards' || !!ch.lastUpdated;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterId(ch.id)}
                  className={`relative text-xs font-medium pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'text-zinc-900 font-bold' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <span className="text-[#b8860b] font-normal">{ch.number}</span>
                  <span>{ch.title}</span>
                  {hasUpdate && (
                    <span className="text-[9px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-900 border border-amber-500/40 px-1.5 py-0.2 rounded-md animate-pulse ml-0.5">
                      UPDATED
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Deck Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Widescreen Visual Card */}
          <div className="lg:col-span-7 relative w-full aspect-[16/9] sm:aspect-[16/9] lg:aspect-auto min-h-[240px] sm:min-h-[380px] lg:min-h-[440px] rounded-3xl overflow-hidden bg-zinc-950 group shadow-sm flex flex-col">
            <img
              src={currentChapter.visualImage || data.branding.robotWide}
              alt={currentChapter.title}
              className="w-full h-full object-cover"
              style={{
                objectPosition:
                  currentChapter.visualImagePosition ||
                  (currentChapter.id === 'market'
                    ? 'center 12%'
                    : currentChapter.id === 'big-idea'
                    ? 'center 15%'
                    : 'center center')
              }}
            />

            {/* Bottom Overlay Headline on Right Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end items-end text-right p-6 sm:p-10 pointer-events-none">
              <span className="w-8 h-1 bg-[#b8860b] rounded-full mb-3 self-end"></span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-tight tracking-tight">
                {currentChapter.title}
              </h2>
            </div>
          </div>

          {/* Right Column: Narrative Card */}
          <div 
            className="lg:col-span-5 bg-[#eae8e3] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-zinc-200/50 hover:border-zinc-300 transition-all cursor-pointer group"
            onClick={() => setShowFullModal(true)}
            title="Click to view full chapter detail"
          >
            <div>
              {/* Category Header & Update Tag */}
              <div className="flex justify-between items-center text-xs font-normal mb-5">
                <span className="text-[#b8860b] font-semibold tracking-wide uppercase text-[11px]">{currentChapter.category || 'The ask'}</span>
                {currentChapter.lastUpdated && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                    <span>(Last Updated {currentChapter.lastUpdated})</span>
                  </span>
                )}
              </div>

              {/* Special Prominent Highlight Callout Banners for Updated Chapters */}
              {currentChapter.id === 'concepts' && (
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 animate-pulse" />
                    <div>
                      <span className="font-extrabold text-amber-950 block">
                        ⭐ Updated Master Concepts:
                      </span>
                      <span className="text-amber-900 text-[11px]">
                        "Battery Phelwan" 5-film suite with Punjabi jingles & dialogue options.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConceptTab('final-concepts');
                      setShowFullModal(true);
                    }}
                    className="px-2.5 py-1 bg-[#c69a53] text-black font-extrabold rounded-lg text-[11px] hover:bg-[#b08542] transition-all cursor-pointer shrink-0 shadow-2xs"
                  >
                    Read Script →
                  </button>
                </div>
              )}

              {currentChapter.id === 'storyboards' && (
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 animate-pulse" />
                    <div>
                      <span className="font-extrabold text-amber-950 block">
                        ⭐ Updated Storyboards:
                      </span>
                      <span className="text-amber-900 text-[11px]">
                        Complete 5 commercial film storyboards & vector PDFs.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullModal(true);
                    }}
                    className="px-2.5 py-1 bg-[#c69a53] text-black font-extrabold rounded-lg text-[11px] hover:bg-[#b08542] transition-all cursor-pointer shrink-0 shadow-2xs"
                  >
                    View Sheets →
                  </button>
                </div>
              )}

              {/* Main Chapter Summary / Body Narrative */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-heading leading-[1.25]">
                {currentChapter.summary ? (
                  currentChapter.summary.split(/(\([^)]+\))/g).map((part, idx) => {
                    if (part.startsWith('(') && part.endsWith(')')) {
                      return (
                        <span
                          key={idx}
                          className="font-semibold text-amber-900 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs sm:text-sm tracking-normal inline-flex items-center gap-1.5 mt-1 sm:mt-0 sm:ml-2 align-middle font-sans shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block animate-pulse"></span>
                          {part}
                        </span>
                      );
                    }
                    return <span key={idx}>{part}</span>;
                  })
                ) : (
                  currentChapter.title
                )}
              </h3>

              {/* Concept Sub-Tabs Quick Access for Chapter 5 */}
              {currentChapter.conceptTabs && currentChapter.conceptTabs.length > 0 && (
                <div className="mt-5 pt-4 border-t border-zinc-300/60">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#b8860b]" /> Explore Concept Routes:
                  </div>
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {currentChapter.conceptTabs.map((tab) => {
                      const isFinal = tab.isFinal || tab.id === 'final-concepts' || tab.name.toLowerCase().includes('final');
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setSelectedConceptTab(tab.id);
                            setShowFullModal(true);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            isFinal
                              ? 'bg-amber-400/25 text-amber-950 hover:bg-amber-400/40 border border-amber-500/50 font-extrabold shadow-xs'
                              : 'bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 border border-zinc-300/60 font-semibold'
                          }`}
                        >
                          {isFinal && <Sparkles className="w-3 h-3 text-amber-700 animate-pulse" />}
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-5 border-t border-zinc-300/60 flex items-center justify-between gap-3 mt-6">
              <span className="text-xs text-zinc-400 font-normal">
                {currentChapter.pageCount.toString().padStart(2, '0')} pages
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadPDF();
                }}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-[#1c2024] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Download'}</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* 3. FOOTER */}
      <footer className="px-6 sm:px-12 py-5 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-400 font-normal bg-[#f4f3f0]">
        <span>Confidential - For review only</span>
        <span>{data.branding.producedBy || 'Nasharz'}</span>
      </footer>

      {/* MODALS */}
      {showFullModal && (
        <FullChapterModal
          chapter={currentChapter}
          branding={data.branding}
          clientName={userName}
          initialConceptTab={selectedConceptTab}
          onClose={() => setShowFullModal(false)}
        />
      )}

      {showEstimateModal && (
        <EstimateModal
          estimates={data.estimates}
          branding={data.branding}
          clientName={userName}
          onClose={() => setShowEstimateModal(false)}
        />
      )}

      {showMediaHub && (
        <MediaHubModal
          assets={data.mediaAssets || []}
          branding={data.branding}
          onClose={() => setShowMediaHub(false)}
        />
      )}

      {showUpdatesModal && (
        <UpdatesModal
          isOpen={showUpdatesModal}
          onClose={() => setShowUpdatesModal(false)}
          onNavigateChapter={handleNavigateChapter}
        />
      )}

    </div>
  );
};

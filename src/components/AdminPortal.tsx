import React, { useState } from 'react';
import { DeckData, Chapter, EstimateItem, BrandingConfig, MediaAsset } from '../types';
import { resetToFactoryDefault, saveStoredData } from '../utils/storage';
import { getMediaEmbedInfo } from '../utils/mediaUtils';
import {
  Save,
  Plus,
  Trash2,
  RotateCcw,
  LogOut,
  Image,
  FileText,
  DollarSign,
  Lock,
  Layers,
  History,
  Check,
  Eye,
  Sliders,
  Video,
  Music,
  ExternalLink,
  Play,
  HelpCircle
} from 'lucide-react';

interface AdminPortalProps {
  data: DeckData;
  onUpdateData: (newData: DeckData) => void;
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  data,
  onUpdateData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'media' | 'estimates' | 'branding' | 'logs'>('chapters');
  const [deck, setDeck] = useState<DeckData>(data);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(data.chapters[0]?.id || 'brief');
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  const selectedChapter = deck.chapters.find((c) => c.id === selectedChapterId) || deck.chapters[0];

  // Helper to commit state changes in real time, saving to localStorage & notifying main deck
  const commitDeckUpdate = (updater: (prev: DeckData) => DeckData) => {
    setDeck((prev) => {
      const next = updater(prev);
      saveStoredData(next);
      onUpdateData(next);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      return next;
    });
  };

  const handleSaveAll = () => {
    saveStoredData(deck);
    onUpdateData(deck);
    setSaveSuccess(true);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExitAdmin = () => {
    saveStoredData(deck);
    onUpdateData(deck);
    onExitAdmin();
  };

  const handleResetFactory = () => {
    if (confirm('Are you sure you want to reset all deck data, chapters, and images to default factory settings?')) {
      const reset = resetToFactoryDefault();
      setDeck(reset);
      onUpdateData(reset);
      alert('Factory reset completed.');
    }
  };

  // Chapter editing helpers
  const handleUpdateChapter = (field: keyof Chapter, value: any) => {
    commitDeckUpdate((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === selectedChapterId ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleAddChapter = () => {
    const num = (deck.chapters.length + 1).toString().padStart(2, '0');
    const newId = `chapter-${Date.now()}`;
    const newChapter: Chapter = {
      id: newId,
      number: num,
      title: `New Chapter ${num}`,
      category: 'Category',
      visualImage: deck.branding.robotWide,
      overlayHeadline: 'New Headline Here',
      summary: 'Summary description for the client review deck.',
      fullText: 'Detailed brief content goes here...',
      keyPoints: ['Key deliverable 1', 'Key deliverable 2'],
      pageCount: 4,
    };

    commitDeckUpdate((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
    setSelectedChapterId(newId);
  };

  const handleDeleteChapter = (id: string) => {
    if (deck.chapters.length <= 1) {
      alert('You must keep at least one chapter in the deck.');
      return;
    }
    if (confirm('Delete this chapter from client deck?')) {
      const filtered = deck.chapters.filter((c) => c.id !== id);
      commitDeckUpdate((prev) => ({ ...prev, chapters: filtered }));
      setSelectedChapterId(filtered[0].id);
    }
  };

  // Branding editing
  const handleUpdateBranding = (field: keyof BrandingConfig, value: string) => {
    commitDeckUpdate((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value,
      },
    }));
  };

  // Estimate editing
  const handleUpdateEstimate = (id: string, field: keyof EstimateItem, value: any) => {
    commitDeckUpdate((prev) => ({
      ...prev,
      estimates: prev.estimates.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddEstimateItem = () => {
    const newItem: EstimateItem = {
      id: `est-${Date.now()}`,
      category: 'Production',
      description: 'New line item description',
      amount: 1000,
      quantity: 1,
      unit: 'Item',
      included: true,
    };
    commitDeckUpdate((prev) => ({
      ...prev,
      estimates: [...prev.estimates, newItem],
    }));
  };

  const handleDeleteEstimateItem = (id: string) => {
    commitDeckUpdate((prev) => ({
      ...prev,
      estimates: prev.estimates.filter((e) => e.id !== id),
    }));
  };

  // Media editing
  const handleUpdateMedia = (id: string, field: keyof MediaAsset, value: any) => {
    commitDeckUpdate((prev) => ({
      ...prev,
      mediaAssets: (prev.mediaAssets || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddMedia = (type: 'video' | 'audio' = 'video') => {
    const newItem: MediaAsset = {
      id: `media-${Date.now()}`,
      title: type === 'video' ? 'New Commercial Video Cut' : 'New Voiceover / Audio Track',
      type,
      category: type === 'video' ? 'Video Master' : 'Audio & VO',
      url: '',
      downloadUrl: '',
      thumbnailUrl: '',
      description: 'Production asset for review and approval.',
      duration: type === 'video' ? '0:60' : '1:00',
      fileSize: '25 MB',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    commitDeckUpdate((prev) => ({
      ...prev,
      mediaAssets: [newItem, ...(prev.mediaAssets || [])],
    }));
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Delete this media asset from client review vault?')) {
      commitDeckUpdate((prev) => ({
        ...prev,
        mediaAssets: (prev.mediaAssets || []).filter((m) => m.id !== id),
      }));
      if (previewMediaId === id) setPreviewMediaId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] text-zinc-100 font-sans flex flex-col">
      {/* Admin Top Navigation Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src={deck.branding.whiteLogo} alt="Nasharz" className="h-6 w-auto object-contain" />
          <span className="h-4 w-px bg-zinc-700"></span>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#c69a53]" />
              Producer Backend Control Center
            </h1>
            <p className="text-[11px] text-zinc-400">Logged in as Executive Admin (aati)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Auto-Sync Active</span>
          </span>

          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-lg animate-fadeIn">
              <Check className="w-3.5 h-3.5" /> Saved to live deck
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#c69a53] hover:bg-[#b08542] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Live Changes
          </button>

          <button
            onClick={handleExitAdmin}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Client View
          </button>
        </div>
      </header>

      {/* Main Admin View Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 block mb-2">
              Portal Modules
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'chapters'
                    ? 'bg-[#c69a53] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Layers className="w-4 h-4" /> Chapters & Content ({deck.chapters.length})
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'media'
                    ? 'bg-[#c69a53] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Video className="w-4 h-4" /> Media & Deliverables ({deck.mediaAssets?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('estimates')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'estimates'
                    ? 'bg-[#c69a53] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <DollarSign className="w-4 h-4" /> Budget & Estimates
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'branding'
                    ? 'bg-[#c69a53] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Image className="w-4 h-4" /> Branding Assets & Credentials
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'logs'
                    ? 'bg-[#c69a53] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <History className="w-4 h-4" /> Client Access Logs ({deck.logs.length})
              </button>
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              System Operations
            </span>
            <button
              onClick={handleResetFactory}
              className="w-full py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
            </button>
            <button
              onClick={onExitAdmin}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out Admin
            </button>
          </div>
        </div>

        {/* Right Main Panel Content */}
        <div className="lg:col-span-9 bg-zinc-900/90 border border-zinc-800 rounded-xl p-6">
          
          {/* TAB 1: CHAPTERS MANAGER */}
          {activeTab === 'chapters' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Deck Chapters & Client Views</h2>
                  <p className="text-xs text-zinc-400">Select a chapter to edit text, visual banner images, and deliverables.</p>
                </div>
                <button
                  onClick={handleAddChapter}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Chapter
                </button>
              </div>

              {/* Chapter selector pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800/60">
                {deck.chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedChapterId === ch.id
                        ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ch.number} {ch.title}
                  </button>
                ))}
              </div>

              {/* Editing Form for Selected Chapter */}
              {selectedChapter && (
                <div className="space-y-5 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/80">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#c69a53] uppercase tracking-widest">
                      Editing Chapter {selectedChapter.number}
                    </span>
                    <button
                      onClick={() => handleDeleteChapter(selectedChapter.id)}
                      className="px-2.5 py-1 text-red-400 hover:bg-red-950/50 rounded border border-red-900/40 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Chapter
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Number</label>
                      <input
                        type="text"
                        value={selectedChapter.number}
                        onChange={(e) => handleUpdateChapter('number', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Title</label>
                      <input
                        type="text"
                        value={selectedChapter.title}
                        onChange={(e) => handleUpdateChapter('title', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Category Badge</label>
                      <input
                        type="text"
                        value={selectedChapter.category}
                        onChange={(e) => handleUpdateChapter('category', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Visual Banner Image URL</label>
                      <input
                        type="text"
                        value={selectedChapter.visualImage}
                        onChange={(e) => handleUpdateChapter('visualImage', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        Visual Focal Alignment <span className="text-zinc-500 font-normal">(e.g. center 12%, center top)</span>
                      </label>
                      <input
                        type="text"
                        value={selectedChapter.visualImagePosition || ''}
                        placeholder="center center (or center 15%)"
                        onChange={(e) => handleUpdateChapter('visualImagePosition', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Overlay Headline Text</label>
                    <input
                      type="text"
                      value={selectedChapter.overlayHeadline}
                      onChange={(e) => handleUpdateChapter('overlayHeadline', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-semibold text-zinc-400">
                        Update Disclaimer / Last Updated Tag
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          const month = d.toLocaleString('en-US', { month: 'short' });
                          const day = d.getDate().toString().padStart(2, '0');
                          const weekday = d.toLocaleString('en-US', { weekday: 'short' });
                          const formatted = `${month}/${day}/${weekday}`;
                          handleUpdateChapter('lastUpdated', formatted);
                        }}
                        className="text-[10px] text-[#c69a53] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        ⚡ Set to Today
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Aug/09/Wed"
                      value={selectedChapter.lastUpdated || ''}
                      onChange={(e) => handleUpdateChapter('lastUpdated', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Displays "(Last Updated on ...)" in refined amber badge with pulsating status indicator across the deck.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Card Summary (Short text shown in main card)</label>
                    <textarea
                      rows={2}
                      value={selectedChapter.summary}
                      onChange={(e) => handleUpdateChapter('summary', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                    />
                  </div>

                  {/* Concept Tabs Editor (if available on this chapter) */}
                  {selectedChapter.conceptTabs && selectedChapter.conceptTabs.length > 0 ? (
                    <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#c69a53] uppercase tracking-wider block">
                          ⭐ Concept Routes & Tabs Editor ({selectedChapter.conceptTabs.length} Tabs)
                        </label>
                        <span className="text-[10px] text-zinc-500">Includes "Final Concepts"</span>
                      </div>
                      <div className="space-y-3">
                        {selectedChapter.conceptTabs.map((tab, tIdx) => (
                          <div key={tab.id} className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                {tab.isFinal ? '⭐' : '📄'} {tab.name}
                              </span>
                              <span className="text-[10px] text-[#c69a53] font-mono">{tab.badge || tab.id}</span>
                            </div>
                            <textarea
                              rows={5}
                              value={tab.content}
                              onChange={(e) => {
                                const val = e.target.value;
                                commitDeckUpdate((prev) => ({
                                  ...prev,
                                  chapters: prev.chapters.map((c) => {
                                    if (c.id !== selectedChapterId) return c;
                                    const newTabs = [...(c.conceptTabs || [])];
                                    newTabs[tIdx] = { ...newTabs[tIdx], content: val };
                                    return {
                                      ...c,
                                      conceptTabs: newTabs,
                                      ...(tab.id === 'all' ? { fullText: val } : {}),
                                    };
                                  }),
                                }));
                              }}
                              className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#c69a53]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Full Text Content (Visible in Modal Pop-up & Downloaded PDF)</label>
                      <textarea
                        rows={8}
                        value={selectedChapter.fullText}
                        onChange={(e) => handleUpdateChapter('fullText', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53] font-mono leading-relaxed"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Key Deliverables (Comma separated)</label>
                    <input
                      type="text"
                      value={(selectedChapter.keyPoints || []).join(', ')}
                      onChange={(e) =>
                        handleUpdateChapter(
                          'keyPoints',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c69a53]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEDIA & ASSET DELIVERABLES */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#c69a53]" /> Video & Audio Deliverables Management
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Upload and configure Cloudinary or Google Drive video and audio links for client review & download.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddMedia('video')}
                    className="px-3 py-1.5 bg-[#c69a53] hover:bg-[#b08542] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Video Link
                  </button>
                  <button
                    onClick={() => handleAddMedia('audio')}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
                  >
                    <Plus className="w-4 h-4" /> Add Audio Track
                  </button>
                </div>
              </div>

              {/* Cloudinary & Google Drive helper banner */}
              <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 space-y-2">
                <div className="flex items-center gap-2 text-[#c69a53] font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>How Link Formats Work:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-zinc-400">
                  <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                    <strong className="text-zinc-200 block mb-1">☁️ Cloudinary Links:</strong>
                    Paste any Cloudinary video/audio URL. Direct video playback and attachments will work seamlessly.
                  </div>
                  <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                    <strong className="text-zinc-200 block mb-1">📁 Google Drive Links:</strong>
                    Paste standard share link (e.g. <code>https://drive.google.com/file/d/XYZ/view</code>). The system automatically embeds and enables direct download for client.
                  </div>
                </div>
              </div>

              {/* Media List */}
              <div className="space-y-4">
                {(deck.mediaAssets || []).map((media) => {
                  const isPreviewing = previewMediaId === media.id;
                  const embed = getMediaEmbedInfo(media.url, media.type, media.downloadUrl);

                  return (
                    <div
                      key={media.id}
                      className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-4 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1.5 rounded-lg ${
                              media.type === 'video' ? 'bg-amber-950 text-[#c69a53]' : 'bg-emerald-950 text-emerald-400'
                            }`}
                          >
                            {media.type === 'video' ? <Video className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                          </span>
                          <span className="text-xs font-bold text-white uppercase tracking-wide">
                            {media.type.toUpperCase()} ASSET
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">ID: {media.id}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewMediaId(isPreviewing ? null : media.id)}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-[#c69a53]" />
                            <span>{isPreviewing ? 'Hide Test Player' : 'Live Test Player'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(media.id)}
                            className="p-1 text-red-400 hover:bg-red-950/50 rounded transition-all cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Live Test Player Preview (if opened) */}
                      {isPreviewing && (
                        <div className="bg-black/90 p-4 rounded-xl border border-zinc-800 space-y-2 animate-fadeIn">
                          <span className="text-[10px] font-bold text-[#c69a53] uppercase tracking-wider block">
                            Backend Test Playback
                          </span>
                          {media.type === 'video' && embed.isDirectVideo && (
                            <video src={embed.embedUrl} controls className="w-full max-h-64 rounded-lg bg-black object-contain" />
                          )}
                          {media.type === 'video' && embed.isIframe && (
                            <iframe src={embed.embedUrl} title={media.title} className="w-full h-64 rounded-lg border-0" allowFullScreen />
                          )}
                          {media.type === 'audio' && (
                            <audio src={embed.embedUrl || media.url} controls className="w-full mt-2" />
                          )}
                        </div>
                      )}

                      {/* Form Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Asset Title</label>
                          <input
                            type="text"
                            value={media.title}
                            onChange={(e) => handleUpdateMedia(media.id, 'title', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Media Type</label>
                          <select
                            value={media.type}
                            onChange={(e) => handleUpdateMedia(media.id, 'type', e.target.value as 'video' | 'audio')}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                          >
                            <option value="video">Video (TVC / Reel)</option>
                            <option value="audio">Audio (VO / Jingle)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Category Badge</label>
                          <input
                            type="text"
                            value={media.category}
                            onChange={(e) => handleUpdateMedia(media.id, 'category', e.target.value)}
                            placeholder="e.g. Master TVC, Urdu VO"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                            Media Link URL <span className="text-[#c69a53] font-normal">(Cloudinary / Google Drive / MP4 / MP3)</span>
                          </label>
                          <input
                            type="text"
                            value={media.url}
                            onChange={(e) => handleUpdateMedia(media.id, 'url', e.target.value)}
                            placeholder="https://res.cloudinary.com/... or https://drive.google.com/file/d/..."
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                            Direct Download URL <span className="text-zinc-500 font-normal">(Optional Override)</span>
                          </label>
                          <input
                            type="text"
                            value={media.downloadUrl || ''}
                            onChange={(e) => handleUpdateMedia(media.id, 'downloadUrl', e.target.value)}
                            placeholder="Leave empty for auto-derive"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Thumbnail Poster URL</label>
                          <input
                            type="text"
                            value={media.thumbnailUrl || ''}
                            onChange={(e) => handleUpdateMedia(media.id, 'thumbnailUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Duration</label>
                          <input
                            type="text"
                            value={media.duration || ''}
                            onChange={(e) => handleUpdateMedia(media.id, 'duration', e.target.value)}
                            placeholder="0:60"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">File Size</label>
                          <input
                            type="text"
                            value={media.fileSize || ''}
                            onChange={(e) => handleUpdateMedia(media.id, 'fileSize', e.target.value)}
                            placeholder="45 MB"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Description / Production Notes</label>
                        <textarea
                          rows={2}
                          value={media.description || ''}
                          onChange={(e) => handleUpdateMedia(media.id, 'description', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#c69a53] focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET & ESTIMATES */}
          {activeTab === 'estimates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Campaign Estimate Line Items</h2>
                  <p className="text-xs text-zinc-400">Configure prices, descriptions, and quantities for client estimate calculator.</p>
                </div>
                <button
                  onClick={handleAddEstimateItem}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Line Item
                </button>
              </div>

              <div className="space-y-3">
                {deck.estimates.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-zinc-500 font-bold block">Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleUpdateEstimate(item.id, 'category', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-zinc-500 font-bold block">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateEstimate(item.id, 'description', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-zinc-500 font-bold block">Rate (PKR)</label>
                      <input
                        type="text"
                        value={item.rate || '—'}
                        onChange={(e) => handleUpdateEstimate(item.id, 'rate', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-[10px] text-zinc-500 font-bold block">Units</label>
                      <input
                        type="text"
                        value={item.units !== undefined ? item.units : 1}
                        onChange={(e) => handleUpdateEstimate(item.id, 'units', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white text-center"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-[10px] text-zinc-500 font-bold block">Days</label>
                      <input
                        type="text"
                        value={item.days !== undefined ? item.days : '—'}
                        onChange={(e) => handleUpdateEstimate(item.id, 'days', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white text-center"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-[10px] text-zinc-500 font-bold block">PKR Amount</label>
                      <input
                        type="number"
                        value={item.amount || 0}
                        onChange={(e) => handleUpdateEstimate(item.id, 'amount', Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleDeleteEstimateItem(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/50 rounded transition-all cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BRANDING & CREDENTIALS */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-lg font-bold text-white">Brand Assets & Credentials</h2>
                <p className="text-xs text-zinc-400">Manage logos, stamp seals, robot hero images, and client password settings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-4 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800">
                  <h3 className="text-xs font-bold text-[#c69a53] uppercase tracking-widest">Image Asset URLs</h3>
                  
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Nasharz White Logo URL</label>
                    <input
                      type="text"
                      value={deck.branding.whiteLogo}
                      onChange={(e) => handleUpdateBranding('whiteLogo', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Nasharz Black Logo URL</label>
                    <input
                      type="text"
                      value={deck.branding.blackLogo}
                      onChange={(e) => handleUpdateBranding('blackLogo', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Nasharz Icon URL</label>
                    <input
                      type="text"
                      value={deck.branding.nasharzIcon}
                      onChange={(e) => handleUpdateBranding('nasharzIcon', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Alaska Batteries Logo URL</label>
                    <input
                      type="text"
                      value={deck.branding.alaskaLogo}
                      onChange={(e) => handleUpdateBranding('alaskaLogo', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Official Seal Stamp URL</label>
                    <input
                      type="text"
                      value={deck.branding.sealStamp}
                      onChange={(e) => handleUpdateBranding('sealStamp', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Wide Robot Banner URL</label>
                    <input
                      type="text"
                      value={deck.branding.robotWide}
                      onChange={(e) => handleUpdateBranding('robotWide', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Long Robot Banner URL</label>
                    <input
                      type="text"
                      value={deck.branding.robotLong}
                      onChange={(e) => handleUpdateBranding('robotLong', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800">
                  <h3 className="text-xs font-bold text-[#c69a53] uppercase tracking-widest">Portal Texts & Passwords</h3>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Client Access Code / Password</label>
                    <input
                      type="text"
                      value={deck.branding.clientAccessCode}
                      onChange={(e) => handleUpdateBranding('clientAccessCode', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Admin Portal Password</label>
                    <input
                      type="text"
                      value={deck.branding.adminPassword}
                      onChange={(e) => handleUpdateBranding('adminPassword', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Home Subtext</label>
                    <input
                      type="text"
                      value={deck.branding.subtext}
                      onChange={(e) => handleUpdateBranding('subtext', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Footer "Produced By" Text</label>
                    <input
                      type="text"
                      value={deck.branding.producedBy}
                      onChange={(e) => handleUpdateBranding('producedBy', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Date Badge</label>
                    <input
                      type="text"
                      value={deck.branding.dateBadge}
                      onChange={(e) => handleUpdateBranding('dateBadge', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT ACCESS LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-lg font-bold text-white">Client Access History</h2>
                <p className="text-xs text-zinc-400">Log of every client and admin session login.</p>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {deck.logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/30">
                        <td className="p-3 font-semibold text-white">{log.name}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.role === 'admin'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}
                          >
                            {log.role}
                          </span>
                        </td>
                        <td className="p-3 text-right text-zinc-400">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

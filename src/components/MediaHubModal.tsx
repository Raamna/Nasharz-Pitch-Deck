import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset, BrandingConfig } from '../types';
import { getMediaEmbedInfo } from '../utils/mediaUtils';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Play,
  Pause,
  Download,
  Video,
  Music,
  ExternalLink,
  Volume2,
  VolumeX,
  Check,
  Copy,
  Sparkles,
  Info,
  Clock,
  HardDrive,
  Calendar,
  Layers,
  ChevronRight,
  Maximize2,
  ArrowLeft,
  Inbox,
  Film,
  UploadCloud,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface MediaHubModalProps {
  mediaAssets?: MediaAsset[];
  assets?: MediaAsset[];
  branding: BrandingConfig;
  clientName?: string;
  onClose: () => void;
}

export const MediaHubModal: React.FC<MediaHubModalProps> = ({
  mediaAssets,
  assets,
  branding,
  clientName = 'Alaska Batteries Team',
  onClose,
}) => {
  const items = assets || mediaAssets || [];
  const [activeMediaId, setActiveMediaId] = useState<string>(items[0]?.id || '');
  const [filter, setFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeMedia = items.find((m) => m.id === activeMediaId) || items[0];

  const filteredList = items.filter((item) => {
    if (filter === 'video') return item.type === 'video';
    if (filter === 'audio') return item.type === 'audio';
    return true;
  });

  // When active media changes, reset player states
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeMediaId]);

  const embedInfo = activeMedia ? getMediaEmbedInfo(activeMedia.url, activeMedia.type, activeMedia.downloadUrl) : null;

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Audio play error', e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec === 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (media: MediaAsset) => {
    const info = getMediaEmbedInfo(media.url, media.type, media.downloadUrl);
    const targetUrl = info.downloadUrl || media.url;
    
    // Trigger download via anchor
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', `${media.title.replace(/[^a-zA-Z0-9]/g, '_')}.${media.type === 'video' ? 'mp4' : 'mp3'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // IF NO ASSETS UPLOADED: Show transparent/frosted floating popup card directly
  if (items.length === 0) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        {/* Transparent Frosted Glass Card */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg p-7 sm:p-10 rounded-3xl bg-[#14171d]/80 backdrop-blur-2xl border border-zinc-700/60 shadow-2xl text-center space-y-6 animate-fadeIn overflow-hidden"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute w-72 h-72 rounded-full bg-[#c69a53]/15 blur-3xl pointer-events-none -top-16 -left-16"></div>
          <div className="absolute w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -bottom-10 -right-10"></div>

          {/* Close X button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-all cursor-pointer border border-zinc-700/50"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Friendly Icon Container with Animated Spark */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#c69a53]/30 via-[#c69a53]/15 to-zinc-800/60 border border-[#c69a53]/50 flex items-center justify-center shadow-xl shadow-[#c69a53]/10">
            <div className="absolute inset-0 rounded-2xl bg-[#c69a53]/20 animate-ping opacity-25"></div>
            <Film className="w-9 h-9 text-[#c69a53]" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
          </div>

          {/* Title & Friendly Description */}
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c69a53]/15 border border-[#c69a53]/30 text-[#c69a53] text-[11px] font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3 animate-pulse text-[#c69a53]" />
              Video & Audio Deliverables Vault
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              No data has landed yet
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-md mx-auto pt-1">
              Once Master commercials, digital reels, and audio deliverables are produced and files are uploaded from the studio, they will automatically sync here for live preview and 1-click download.
            </p>
          </div>

          {/* Status Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-center relative z-10">
            <div className="py-2.5 px-3 rounded-xl bg-zinc-900/60 border border-zinc-700/40 flex items-center justify-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#c69a53]" />
              <span className="text-xs font-bold text-zinc-200">Master Cloud Sync</span>
            </div>
            <div className="py-2.5 px-3 rounded-xl bg-zinc-900/60 border border-zinc-700/40 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-200">Master Copy</span>
            </div>
          </div>

          {/* Friendly Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-[#c69a53] hover:bg-[#b08542] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Campaign Review</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      <div className="bg-[#121418] text-white w-full max-w-6xl max-h-[92vh] rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* TOP MODAL HEADER */}
        <div className="px-5 sm:px-7 py-4 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/90">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            
            {/* Prominent Back to Campaign Review button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-[#c69a53] text-zinc-200 hover:text-black border border-zinc-700/80 hover:border-[#c69a53] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 group"
            >
              <ArrowLeft className="w-4 h-4 text-[#c69a53] group-hover:text-black transition-colors" />
              <span>Back to Main Campaign Review</span>
            </button>

            <div className="h-5 w-px bg-zinc-800 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c69a53]/15 border border-[#c69a53]/30 flex items-center justify-center text-[#c69a53]">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Media & Deliverables Vault
                </h2>
                <p className="text-[10px] text-zinc-400">
                  Alaska Batteries Campaign Preview
                </p>
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="sm:hidden w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-full sm:w-auto justify-center sm:justify-start">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === 'all' ? 'bg-[#c69a53] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilter('video')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  filter === 'video' ? 'bg-[#c69a53] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-3 h-3" /> Videos ({items.filter((m) => m.type === 'video').length})
              </button>
              <button
                onClick={() => setFilter('audio')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  filter === 'audio' ? 'bg-[#c69a53] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Music className="w-3 h-3" /> Audio ({items.filter((m) => m.type === 'audio').length})
              </button>
            </div>

            <button
              onClick={onClose}
              title="Close Vault (Return to Campaign Deck)"
              className="hidden sm:flex w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto">
          
          {/* LEFT 7 COLS: ACTIVE MEDIA PLAYER SPOTLIGHT */}
          <div className="lg:col-span-7 p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between bg-gradient-to-b from-zinc-950 to-[#121418]">
            
            {activeMedia ? (
              <div className="space-y-5">
                
                {/* Active Media Title & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#c69a53] block mb-1">
                      {activeMedia.category || (activeMedia.type === 'video' ? 'Video Master' : 'Audio Master')}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                      {activeMedia.title}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 bg-zinc-800/90 text-zinc-300 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 border border-zinc-700/60">
                    {activeMedia.type === 'video' ? <Video className="w-3.5 h-3.5 text-[#c69a53]" /> : <Music className="w-3.5 h-3.5 text-[#c69a53]" />}
                    <span>{activeMedia.duration || (activeMedia.type === 'video' ? 'Video' : 'Audio')}</span>
                  </span>
                </div>

                {/* THE PLAYER CONTAINER */}
                <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl aspect-[16/9] flex items-center justify-center">
                  
                  {/* VIDEO TYPE (Direct file or Cloudinary) */}
                  {activeMedia.type === 'video' && embedInfo?.isDirectVideo && (
                    <video
                      ref={videoRef}
                      src={embedInfo.embedUrl}
                      controls
                      poster={activeMedia.thumbnailUrl || branding.robotWide}
                      className="w-full h-full object-contain"
                      playsInline
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  )}

                  {/* IFRAME EMBED (Google Drive Preview, YouTube, Vimeo) */}
                  {activeMedia.type === 'video' && embedInfo?.isIframe && (
                    <iframe
                      src={embedInfo.embedUrl}
                      title={activeMedia.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}

                  {/* AUDIO PLAYER WITH STUDIO WAVEFORM UI */}
                  {activeMedia.type === 'audio' && (
                    <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-zinc-900 via-black to-zinc-950 relative">
                      
                      <audio
                        ref={audioRef}
                        src={embedInfo?.embedUrl || activeMedia.url}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                      />

                      {/* Header in audio screen */}
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="font-mono uppercase tracking-wider text-[10px] text-zinc-300">Studio Master Audio Playback</span>
                        </div>
                        <span className="font-mono text-zinc-400">{formatSeconds(currentTime)} / {formatSeconds(duration || 60)}</span>
                      </div>

                      {/* Waveform Animation */}
                      <div className="flex items-center justify-center gap-1.5 h-20 my-auto px-4">
                        {[40, 65, 30, 80, 95, 45, 70, 85, 35, 60, 90, 75, 50, 80, 60, 40, 85, 95, 70, 55, 35, 65, 80, 45].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1.5 rounded-full transition-all duration-150 ${
                              isPlaying ? 'bg-[#c69a53]' : 'bg-zinc-700'
                            }`}
                            style={{
                              height: isPlaying ? `${Math.max(12, (h * (Math.sin(i + currentTime * 4) + 1.2)) / 2.2)}%` : `${h * 0.4}%`,
                              opacity: isPlaying ? 0.9 : 0.4,
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Audio Controls */}
                      <div className="space-y-3 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                        {/* Scrubber */}
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c69a53]"
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={togglePlayAudio}
                              className="w-10 h-10 rounded-full bg-[#c69a53] hover:bg-[#b08542] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </button>
                            <div>
                              <span className="text-xs font-bold text-white block">{activeMedia.title}</span>
                              <span className="text-[10px] text-zinc-400">Master Sound Design & VO</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.muted = !isMuted;
                                  setIsMuted(!isMuted);
                                }
                              }}
                              className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                            >
                              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

                {/* Description & Technical Specs */}
                <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80 space-y-3">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {activeMedia.description || 'Campaign deliverable asset for review and sign-off.'}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    {activeMedia.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#c69a53]" />
                        <span>Duration: <strong className="text-zinc-200">{activeMedia.duration}</strong></span>
                      </span>
                    )}
                    {activeMedia.fileSize && (
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-[#c69a53]" />
                        <span>File Size: <strong className="text-zinc-200">{activeMedia.fileSize}</strong></span>
                      </span>
                    )}
                    {activeMedia.uploadedAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c69a53]" />
                        <span>Uploaded: <strong className="text-zinc-200">{activeMedia.uploadedAt}</strong></span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Action Buttons for Active Media */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleDownload(activeMedia)}
                    className="px-5 py-2.5 bg-[#c69a53] hover:bg-[#b08542] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Original {activeMedia.type === 'video' ? 'Video (.mp4)' : 'Audio (.mp3)'}
                  </button>

                  <button
                    onClick={() => handleCopyLink(activeMedia.url, activeMedia.id)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all border border-zinc-700/60 cursor-pointer"
                  >
                    {copiedId === activeMedia.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Cloud Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all border border-zinc-800 cursor-pointer ml-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Cloud Tab</span>
                  </a>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No media files uploaded yet.</p>
              </div>
            )}

          </div>

          {/* RIGHT 5 COLS: PLAYLIST & DELIVERABLES CATALOG */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col bg-zinc-950/60 overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Deliverables Playlist ({filteredList.length})
              </span>
              <span className="text-[11px] text-[#c69a53] font-semibold">
                Click any file to preview
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {filteredList.map((item) => {
                const isSelected = item.id === activeMediaId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveMediaId(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-[#c69a53]/15 border-[#c69a53] shadow-md'
                        : 'bg-zinc-900/70 border-zinc-800/80 hover:bg-zinc-800/60 hover:border-zinc-700'
                    }`}
                  >
                    {/* Media Thumbnail / Icon */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800 flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[#c69a53]">
                          {item.type === 'video' ? <Video className="w-6 h-6" /> : <Music className="w-6 h-6" />}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-[#c69a53] text-white flex items-center justify-center">
                          <Play className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c69a53]">
                          {item.category || item.type}
                        </span>
                        {item.duration && (
                          <span className="text-[10px] text-zinc-400 font-mono">
                            • {item.duration}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {item.fileSize || 'Digital master'} • {item.type === 'video' ? 'Full HD Video' : 'HQ Master Audio'}
                      </p>
                    </div>

                    {/* Quick Download button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      title="Download file"
                      className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-[#c69a53] text-zinc-300 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom info note for client */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-900/40 p-3 rounded-xl">
              <Info className="w-4 h-4 text-[#c69a53] shrink-0" />
              <span>
                All video and audio links are hosted on secure high-speed Cloudinary & Google Drive CDNs with unrestricted client downloads.
              </span>
            </div>

          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-zinc-800/80 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Nasharz Films Digital Asset Suite • Prepared for Alaska Batteries</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span>Total Deliverables: <strong className="text-zinc-200">{items.length} Files</strong></span>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#c69a53] hover:bg-[#b08542] text-black font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Campaign Review</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

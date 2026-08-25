import React from 'react';
import { X, Sparkles, Film, Image as ImageIcon, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateChapter: (chapterId: string, conceptTab?: string) => void;
}

export const UpdatesModal: React.FC<UpdatesModalProps> = ({
  isOpen,
  onClose,
  onNavigateChapter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#eae8e3] border border-zinc-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#c69a53] uppercase tracking-widest">
                  Release Notes & Changelog
                </span>
                <span className="bg-amber-400 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  August 2026
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                Recent Campaign Updates
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-zinc-800">
          <p className="text-zinc-600">
            Welcome to the updated Alaska Batteries Campaign Deck. Below is a summary of the latest scripts, storyboard assets, and revisions added to the presentation:
          </p>

          {/* Update Item 1: Chapter 05 Master Concepts */}
          <div className="p-5 bg-white/80 rounded-2xl border border-amber-400/40 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-xl shadow-2xs">
              Updated Script
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl mt-0.5">
                <Film className="w-5 h-5 text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#b8860b]">Chapter 05</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="font-extrabold text-zinc-900 text-base">
                    Master "Battery Phelwan" TVC Suite
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                  Replaced previous concepts with the complete 5-film master commercial suite starring Iftikhar Thakur, featuring comic timing, Urdu script dialogues, Pehlwan arrivals, and 3 Punjabi Jingle options (Option A, B, C) plus ending dialogue taglines.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-2 bg-zinc-100/90 px-2.5 py-1.5 rounded-lg text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span><strong>Concept 1:</strong> Car "Pehelwan Reveal"</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100/90 px-2.5 py-1.5 rounded-lg text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span><strong>Concept 2:</strong> Truck "Fish"</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100/90 px-2.5 py-1.5 rounded-lg text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span><strong>Concept 3:</strong> Tractor "Field"</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100/90 px-2.5 py-1.5 rounded-lg text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span><strong>Concept 4:</strong> Bike "Interview"</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100/90 px-2.5 py-1.5 rounded-lg text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span><strong>Concept 5:</strong> UPS "Wedding"</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100/90 px-2.5 py-1.5 rounded-lg text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span><strong>Jingles:</strong> 3 Punjabi Jingle Options</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('concepts', 'final-concepts');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c69a53] hover:bg-[#b08542] text-black font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Open Master Concepts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Update Item 2: Chapter 06 Storyboards */}
          <div className="p-5 bg-white/80 rounded-2xl border border-zinc-300 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-zinc-800 text-amber-300 text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-xl shadow-2xs">
              Updated Visuals
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-zinc-200 text-zinc-900 rounded-xl mt-0.5">
                <ImageIcon className="w-5 h-5 text-zinc-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#b8860b]">Chapter 06</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="font-extrabold text-zinc-900 text-base">
                    5 Commercial Storyboards & Vector PDFs
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                  Updated storyboard gallery across Bike, Car, Truck, Tractor, and UPS folders with full-screen zoom, pan controls, and downloadable vector production PDFs for each concept.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('storyboards');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>View Storyboards</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c69a53]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-200/90 border-t border-zinc-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Latest sync: August 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

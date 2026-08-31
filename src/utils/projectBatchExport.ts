import JSZip from 'jszip';
import { DeckData, Chapter, BrandingConfig } from '../types';
import { generateChapterPDF } from './pdfGenerator';
import {
  generateWardrobeLookbookPDF,
  generateVehiclesPropsPDF,
  generateLocationsDossierPDF,
  generateTalentAgreementPDF,
  generateChapter07CompletePDF
} from './artTalentPdfGenerator';

export interface ExportItemConfig {
  id: string;
  chapterId: string;
  chapterNumber: string;
  title: string;
  category: string;
  section?: 'all' | 'wardrobe' | 'vehicles' | 'locations' | 'talent' | 'complete_art';
  folder: string;
  filename: string;
  description: string;
  pageCountEst: string;
  isSubItem?: boolean;
}

export const ALL_EXPORTABLE_ITEMS: ExportItemConfig[] = [
  {
    id: 'ch01_overview',
    chapterId: 'brief',
    chapterNumber: '01',
    title: 'Chapter 01: Campaign Overview & Strategic Brief',
    category: 'The Ask & Strategic Scope',
    folder: 'Chapter_01_Campaign_Overview',
    filename: 'Nasharz_Alaska_Chapter01_Campaign_Overview.pdf',
    description: 'Executive mandate, brand challenge, target audience analysis & core deliverables.',
    pageCountEst: '4 Pages'
  },
  {
    id: 'ch02_creative_concept',
    chapterId: 'big-idea',
    chapterNumber: '02',
    title: 'Chapter 02: Creative Concept & Campaign Narratives',
    category: 'Big Idea & Core Message',
    folder: 'Chapter_02_Creative_Concepts',
    filename: 'Nasharz_Alaska_Chapter02_Creative_Concepts.pdf',
    description: '"Battery Pehlwan" big idea, comedic tension matrix & emotional consumer resonance.',
    pageCountEst: '6 Pages'
  },
  {
    id: 'ch03_scripts',
    chapterId: 'concepts',
    chapterNumber: '03',
    title: 'Chapter 03: 5 Hero Film Master Scripts & Audio Direction',
    category: '5 TVC Scripts & Punjabi Jingles',
    folder: 'Chapter_03_Master_Scripts',
    filename: 'Nasharz_Alaska_Chapter03_Master_Scripts.pdf',
    description: 'Complete 5 commercial film scripts, Punjabi dialogue variants & sung musical routes.',
    pageCountEst: '8 Pages'
  },
  {
    id: 'ch04_storyboards',
    chapterId: 'storyboards',
    chapterNumber: '04',
    title: 'Chapter 04: Shot-by-Shot Visual Storyboards',
    category: '5 Film Visual Breakdown',
    folder: 'Chapter_04_Storyboards',
    filename: 'Nasharz_Alaska_Chapter04_Visual_Storyboards.pdf',
    description: 'High-res visual storyboards, action beats, camera angles & timing for all 5 films.',
    pageCountEst: '10 Pages'
  },
  {
    id: 'ch05_treatment',
    chapterId: 'production',
    chapterNumber: '05',
    title: "Chapter 05: Director's Visual Treatment & Cinematography",
    category: 'Director Vision & Aesthetic',
    folder: 'Chapter_05_Visual_Treatment',
    filename: 'Nasharz_Alaska_Chapter05_Visual_Treatment.pdf',
    description: 'ARRI Alexa LF camera package, anamorphic lenses, lighting cues & color grading palette.',
    pageCountEst: '6 Pages'
  },
  {
    id: 'ch06_schedule',
    chapterId: 'execution',
    chapterNumber: '06',
    title: 'Chapter 06: Production Schedule, Crew & Technical Plan',
    category: 'Schedule & Logistics',
    folder: 'Chapter_06_Production_Plan',
    filename: 'Nasharz_Alaska_Chapter06_Production_Plan.pdf',
    description: '4-day multi-city shoot schedule, unit management, crew roster & post-production milestones.',
    pageCountEst: '5 Pages'
  },
  // Chapter 07 Separated Standalone Modules
  {
    id: 'ch07_wardrobe',
    chapterId: 'art-talent',
    chapterNumber: '07',
    section: 'wardrobe',
    title: '01. Lead & Support Wardrobe Lookbook (Standalone PDF)',
    category: 'Art & Talent Suite',
    folder: 'Chapter_07_Art_and_Talent',
    filename: '01_Nasharz_Alaska_Wardrobe_Lookbook.pdf',
    description: '17 Character specification sheets: Iftikhar Thakur variants, Battery Expert uniform & supporting cast.',
    pageCountEst: '12 Pages',
    isSubItem: true
  },
  {
    id: 'ch07_vehicles_props',
    chapterId: 'art-talent',
    chapterNumber: '07',
    section: 'vehicles',
    title: '02. Vehicle Fleet & Props Design Grids (Standalone PDF)',
    category: 'Art & Talent Suite',
    folder: 'Chapter_07_Art_and_Talent',
    filename: '02_Nasharz_Alaska_Vehicles_and_Props_Fleet.pdf',
    description: 'Master Mobile Lab Van Options 1, 2, 3 + Film-by-film isolated prop sheets (Car, Truck, Tractor, Bike, UPS).',
    pageCountEst: '9 Pages',
    isSubItem: true
  },
  {
    id: 'ch07_locations',
    chapterId: 'art-talent',
    chapterNumber: '07',
    section: 'locations',
    title: '03. Location Scouting Dossiers & Permits Matrix (Standalone PDF)',
    category: 'Art & Talent Suite',
    folder: 'Chapter_07_Art_and_Talent',
    filename: '03_Nasharz_Alaska_Location_Scouting_Dossiers.pdf',
    description: '6 Scouting dossiers (Badshahi Food Street, Karachi Jetty, Lahore Farmlands, Packages Mall, Fakir Khana Haveli, Evernew Soundstage) + Logistics Matrix.',
    pageCountEst: '8 Pages',
    isSubItem: true
  },
  {
    id: 'ch07_talent_contract',
    chapterId: 'art-talent',
    chapterNumber: '07',
    section: 'talent',
    title: '04. Celebrity Talent Agreement & Likeness Authorization (Standalone PDF)',
    category: 'Art & Talent Suite',
    folder: 'Chapter_07_Art_and_Talent',
    filename: '04_Nasharz_Alaska_Talent_Agreement_and_Casting.pdf',
    description: 'Iftikhar Thakur 2-year exclusive ambassador contract, rights, exclusivity clauses & official sealed signatory.',
    pageCountEst: '4 Pages',
    isSubItem: true
  },
  {
    id: 'ch07_complete_master',
    chapterId: 'art-talent',
    chapterNumber: '07',
    section: 'complete_art',
    title: '05. Complete Chapter 07 Master Lookbook (Combined All-in-One)',
    category: 'Art & Talent Suite',
    folder: 'Chapter_07_Art_and_Talent',
    filename: '05_Nasharz_Alaska_Chapter07_Master_Lookbook_Complete.pdf',
    description: 'Full omnibus production design suite containing Wardrobe, Vehicles, Props, Locations, and Talent Contract in a single master book.',
    pageCountEst: '30+ Pages',
    isSubItem: true
  }
];

export interface BatchProgress {
  current: number;
  total: number;
  currentItemTitle: string;
  status: 'idle' | 'generating' | 'zipping' | 'completed' | 'error';
  errorMessage?: string;
}

/**
 * Triggers a browser download of a Blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Executes batch export for all selected item IDs
 */
export async function executeBatchExport(
  selectedIds: string[],
  data: DeckData,
  clientName: string,
  mode: 'zip' | 'individual',
  onProgress?: (progress: BatchProgress) => void
): Promise<void> {
  const selectedConfigs = ALL_EXPORTABLE_ITEMS.filter((item) => selectedIds.includes(item.id));
  if (selectedConfigs.length === 0) return;

  const total = selectedConfigs.length;
  const zip = mode === 'zip' ? new JSZip() : null;

  try {
    for (let i = 0; i < selectedConfigs.length; i++) {
      const item = selectedConfigs[i];
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          currentItemTitle: item.title,
          status: 'generating'
        });
      }

      // Find the corresponding chapter data
      const chapter = data.chapters.find((c) => c.id === item.chapterId) || {
        id: item.chapterId,
        number: item.chapterNumber,
        title: item.title,
        category: item.category,
        summary: item.description,
        fullText: '',
        keyPoints: [],
        pageCount: 6
      } as Chapter;

      let resultBlob: Blob | null = null;

      if (item.section === 'wardrobe') {
        const res = await generateWardrobeLookbookPDF(chapter, data.branding, clientName, { returnBlob: true });
        if (res && 'blob' in res && res.blob) resultBlob = res.blob;
      } else if (item.section === 'vehicles') {
        const res = await generateVehiclesPropsPDF(chapter, data.branding, clientName, { returnBlob: true });
        if (res && 'blob' in res && res.blob) resultBlob = res.blob;
      } else if (item.section === 'locations') {
        const res = await generateLocationsDossierPDF(chapter, data.branding, clientName, { returnBlob: true });
        if (res && 'blob' in res && res.blob) resultBlob = res.blob;
      } else if (item.section === 'talent') {
        const res = await generateTalentAgreementPDF(chapter, data.branding, clientName, { returnBlob: true });
        if (res && 'blob' in res && res.blob) resultBlob = res.blob;
      } else if (item.section === 'complete_art') {
        const res = await generateChapter07CompletePDF(chapter, data.branding, clientName, { returnBlob: true });
        if (res && 'blob' in res && res.blob) resultBlob = res.blob;
      } else {
        const res = await generateChapterPDF(chapter, data.branding, clientName, { returnBlob: true });
        if (res && 'blob' in res && res.blob) resultBlob = res.blob;
      }

      if (resultBlob) {
        if (mode === 'zip' && zip) {
          zip.folder(item.folder)?.file(item.filename, resultBlob);
        } else {
          // Download individual file with small delay to avoid browser throttle
          downloadBlob(resultBlob, item.filename);
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }

    if (mode === 'zip' && zip) {
      if (onProgress) {
        onProgress({
          current: total,
          total,
          currentItemTitle: 'Packaging into organized ZIP archive...',
          status: 'zipping'
        });
      }

      const zipBlob = await zip.generateAsync(
        { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
        (meta) => {
          if (onProgress) {
            onProgress({
              current: Math.round((meta.percent / 100) * total),
              total,
              currentItemTitle: `Compressing files (${Math.round(meta.percent)}%)...`,
              status: 'zipping'
            });
          }
        }
      );

      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(zipBlob, `Nasharz_Alaska_Batteries_Production_Package_${timestamp}.zip`);
    }

    if (onProgress) {
      onProgress({
        current: total,
        total,
        currentItemTitle: 'All documents generated successfully!',
        status: 'completed'
      });
    }
  } catch (err: any) {
    console.error('Batch export failed:', err);
    if (onProgress) {
      onProgress({
        current: 0,
        total,
        currentItemTitle: 'Export encountered an error',
        status: 'error',
        errorMessage: err?.message || 'An unexpected error occurred during PDF generation.'
      });
    }
  }
}

export interface StoryboardFolder {
  id: string;
  name: string;
  conceptName?: string;
  product?: string;
  images: {
    title: string;
    url: string;
    objectPosition?: string;
  }[];
}

export interface ConceptTab {
  id: string;
  name: string;
  badge?: string;
  summary?: string;
  content: string;
  isFinal?: boolean;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  category: string;
  visualImage: string;
  visualImagePosition?: string;
  overlayHeadline: string;
  summary: string;
  fullText: string;
  pdfFullText?: string;
  keyPoints?: string[];
  pageCount: number;
  folders?: StoryboardFolder[];
  galleryImages?: {
    title: string;
    url: string;
    objectPosition?: string;
  }[];
  attachedFiles?: {
    name: string;
    url: string;
    size?: string;
  }[];
  conceptTabs?: ConceptTab[];
  finalConceptsText?: string;
}

export interface EstimateItem {
  id: string;
  category: string;
  description: string;
  rate?: string;
  units?: number | string;
  days?: number | string;
  amount: number;
  quantity: number;
  unit: string;
  isLeadTalent?: boolean;
  isAtActual?: boolean;
  included: boolean;
}

export interface BrandingConfig {
  whiteLogo: string;
  blackLogo: string;
  nasharzIcon: string;
  alaskaLogo: string;
  sealStamp: string;
  robotWide: string;
  robotLong: string;
  clientAccessCode: string;
  adminPassword: string;
  subtext: string;
  producedBy: string;
  dateBadge: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  userName: string;
  role: 'client' | 'admin';
  loginTime: string;
}

export interface LoginLog {
  id: string;
  name: string;
  role: 'client' | 'admin';
  timestamp: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'video' | 'audio';
  category: string;
  url: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  duration?: string;
  fileSize?: string;
  uploadedAt?: string;
}

export interface DeckData {
  branding: BrandingConfig;
  chapters: Chapter[];
  estimates: EstimateItem[];
  logs: LoginLog[];
  mediaAssets: MediaAsset[];
}

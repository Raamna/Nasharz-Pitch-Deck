export function parseDriveId(url: string): string | null {
  if (!url) return null;
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  const match3 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match3) return match3[1];
  return null;
}

export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function parseVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  return match ? match[3] : null;
}

export interface MediaEmbedInfo {
  type: 'direct-video' | 'direct-audio' | 'gdrive' | 'youtube' | 'vimeo' | 'external';
  embedUrl: string;
  downloadUrl: string;
  isDirectAudio: boolean;
  isDirectVideo: boolean;
  isIframe: boolean;
}

export function getMediaEmbedInfo(url: string, mediaType: 'video' | 'audio', customDownloadUrl?: string): MediaEmbedInfo {
  if (!url) {
    return {
      type: 'external',
      embedUrl: '',
      downloadUrl: customDownloadUrl || '',
      isDirectAudio: mediaType === 'audio',
      isDirectVideo: mediaType === 'video',
      isIframe: false,
    };
  }

  const driveId = parseDriveId(url);
  if (driveId) {
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      downloadUrl: customDownloadUrl || `https://drive.google.com/uc?export=download&id=${driveId}`,
      isDirectAudio: false,
      isDirectVideo: false,
      isIframe: true,
    };
  }

  const ytId = parseYouTubeId(url);
  if (ytId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`,
      downloadUrl: customDownloadUrl || url,
      isDirectAudio: false,
      isDirectVideo: false,
      isIframe: true,
    };
  }

  const vimeoId = parseVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      downloadUrl: customDownloadUrl || url,
      isDirectAudio: false,
      isDirectVideo: false,
      isIframe: true,
    };
  }

  // Cloudinary or Direct audio/video URL
  const lower = url.toLowerCase();
  const isAudioFile = mediaType === 'audio' || lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.aac') || lower.endsWith('.ogg') || lower.includes('/audio/');
  const isVideoFile = mediaType === 'video' || lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.includes('/video/');

  let download = customDownloadUrl || url;
  // If Cloudinary, we can create an attachment download link
  if (url.includes('cloudinary.com') && url.includes('/upload/') && !url.includes('fl_attachment')) {
    download = url.replace('/upload/', '/upload/fl_attachment/');
  }

  if (isAudioFile) {
    return {
      type: 'direct-audio',
      embedUrl: url,
      downloadUrl: download,
      isDirectAudio: true,
      isDirectVideo: false,
      isIframe: false,
    };
  }

  return {
    type: 'direct-video',
    embedUrl: url,
    downloadUrl: download,
    isDirectAudio: false,
    isDirectVideo: true,
    isIframe: false,
  };
}

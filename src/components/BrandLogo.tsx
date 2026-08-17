import React, { useState } from 'react';

interface BrandLogoProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  src,
  alt = 'Nasharz Films Logo',
  className = 'h-6 w-auto object-contain',
  fallbackColor = '#1a1c1e',
}) => {
  const [hasError, setHasError] = useState(false);

  // Ensure Cloudinary URLs include /upload/ if missing
  const normalizedSrc = React.useMemo(() => {
    if (!src) return '';
    if (src.includes('cloudinary.com') && src.includes('/image/') && !src.includes('/image/upload/')) {
      return src.replace('/image/', '/image/upload/');
    }
    return src;
  }, [src]);

  if (hasError || !normalizedSrc) {
    return (
      <svg className={className} viewBox="0 0 70 50" fill={fallbackColor} xmlns="http://www.w3.org/2000/svg">
        <path d="M10 45 L30 5 L45 5 L25 45 Z" />
        <path d="M30 45 L50 5 L65 5 L45 45 Z" />
      </svg>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};


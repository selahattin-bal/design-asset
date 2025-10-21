import { useEffect, useRef, useState } from 'react';
import { Eye, Heart, Download } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { LoadingSpinner } from './LoadingSpinner';

export interface AssetCardProps {
  image: string;
  title: string;
  subtitle?: string;
  author?: string;
  views?: number;
  likes?: number;
  date?: string;
  credits?: number | 'free';
  size?: 'small' | 'medium' | 'large';
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export function AssetCard({
  image,
  title,
  subtitle,
  author,
  views,
  likes,
  date,
  credits = 'free',
  size = 'medium',
  aspectRatio = 'square',
}: AssetCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setIsImageLoaded(false);
    setHasImageError(false);
  }, [image]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) {
      return;
    }
    if (img.complete) {
      if (img.naturalWidth === 0) {
        setHasImageError(true);
        setIsImageLoaded(true);
      } else {
        setHasImageError(false);
        setIsImageLoaded(true);
      }
    }
  }, [image]);

  const handleImageLoad = () => {
    setHasImageError(false);
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setHasImageError(true);
    setIsImageLoaded(true);
  };
  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  const { t } = useI18n();

  const badgeClasses =
    credits === 'free'
      ? 'bg-yellow-400 text-gray-900'
      : 'bg-gray-900 text-white';

  const creditLabel = credits === 'free' ? t('asset.free') : t('asset.credits', { count: credits });

  return (
    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className={`relative ${aspectClasses[aspectRatio]} bg-gray-100 overflow-hidden`}>
        <span
          className={`absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full text-sm font-bold ${badgeClasses}`}
        >
          {creditLabel}
        </span>
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-100 transition-opacity duration-200 ${
            !isImageLoaded && !hasImageError ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LoadingSpinner label="Loading preview…" className="text-xs text-gray-500" />
        </div>
        <img
          src={image}
          alt={title}
          ref={imageRef}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isImageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
          }`}
        />
        {hasImageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-500">
            Preview unavailable
          </div>
        )}
      </div>

      <div className="p-4 md:p-5">
        <h3 className={`font-bold text-gray-900 mb-2 ${sizeClasses[size]} md:text-base line-clamp-1`}>
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
        )}

        {(views !== undefined || likes !== undefined || date) && (
          <div className="flex items-center gap-4 mb-3 text-gray-600">
            {views !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-medium">{views}</span>
              </div>
            )}
            {likes !== undefined && (
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium">{likes}</span>
              </div>
            )}
            {date && (
              <span className="text-xs text-gray-500 ml-auto">{date}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {author && (
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
              {author}
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Download className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

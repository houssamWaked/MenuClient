export const FALLBACK_IMAGES = {
  banner:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80',
  hero:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80',
  dish:
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1400&q=80',
  ambiance:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
  blog:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  portrait:
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
  generic:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
};

export const FALLBACK_PLATE_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1514516816566-de580c621376?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1600891963935-9e13f75a8f41?auto=format&fit=crop&w=700&q=80',
];

export const FALLBACK_SIGNATURE_IMAGES = [
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80',
];

export const FALLBACK_AMBIANCE_IMAGES = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1515669097368-22e68427d265?auto=format&fit=crop&w=1400&q=80',
];

export function getSafeImageUrl(imageUrl, fallback = FALLBACK_IMAGES.generic) {
  return typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl : fallback;
}

export function getBackgroundImageStyle(imageUrl, fallback = FALLBACK_IMAGES.banner) {
  return { backgroundImage: `url(${getSafeImageUrl(imageUrl, fallback)})` };
}

export function getSafeImageList(images, fallbackImages = FALLBACK_PLATE_IMAGES) {
  const validImages = Array.isArray(images)
    ? images.filter((imageUrl) => typeof imageUrl === 'string' && imageUrl.trim())
    : [];

  return validImages.length ? validImages : fallbackImages;
}

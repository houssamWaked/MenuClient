import { useEffect, useState } from 'react';
import { toArray } from '../siteHelpers.js';

export function useHeroRotation(slides) {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const normalizedSlides = toArray(slides);
    if (normalizedSlides.length <= 1) return undefined;
    const timer = window.setInterval(
      () => setHeroIndex((previousIndex) => (previousIndex + 1) % normalizedSlides.length),
      5000
    );
    return () => window.clearInterval(timer);
  }, [slides]);

  return heroIndex;
}

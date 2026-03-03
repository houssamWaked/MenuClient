import { useEffect } from 'react';

export function useRevealMotion() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const trackedElements = new WeakSet();

    const markVisible = (element) => {
      if (!element.classList.contains('is-visible')) {
        window.requestAnimationFrame(() => {
          element.classList.add('is-visible');
        });
      }
    };

    const observer = reducedMotionQuery.matches
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add('is-visible');
              observer?.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
            rootMargin: '0px 0px -10% 0px',
          }
        );

    const registerElement = (element) => {
      if (!(element instanceof HTMLElement) || trackedElements.has(element)) {
        return;
      }

      trackedElements.add(element);

      if (reducedMotionQuery.matches) {
        element.classList.add('is-visible');
        return;
      }

      const elementTop = element.getBoundingClientRect().top;
      const shouldRevealImmediately = elementTop <= window.innerHeight * 0.9;

      if (shouldRevealImmediately) {
        markVisible(element);
        return;
      }

      observer?.observe(element);
    };

    const scanTree = (rootNode) => {
      if (!(rootNode instanceof HTMLElement)) {
        return;
      }

      if (rootNode.matches('[data-reveal]')) {
        registerElement(rootNode);
      }

      rootNode.querySelectorAll('[data-reveal]').forEach((element) => {
        registerElement(element);
      });
    };

    scanTree(document.body);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          scanTree(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, []);
}

import React, { useState } from 'react';
import { flushSync } from 'react-dom';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', prefersDark);
    return prefersDark;
  });

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    const nextIsDark = !isDark;

    const applyTheme = () => {
      document.documentElement.classList.toggle('dark', nextIsDark);
      localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
      flushSync(() => setIsDark(nextIsDark));
    };

    const vt = (document as any).startViewTransition;
    if (!vt) {
      applyTheme();
      return;
    }

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const animatedRadius = maxRadius + 24;

    if (nextIsDark) {
      document.documentElement.classList.add('vt-to-dark');
    }

    const transition = vt.call(document, applyTheme);

    transition.ready.then(() => {
      if (nextIsDark) {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${animatedRadius}px at ${x}px ${y}px)`] },
          { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)', fill: 'forwards' }
        );
      } else {
        document.documentElement.animate(
          { clipPath: [`circle(${animatedRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`] },
          { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-old(root)', fill: 'forwards' }
        );
      }
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove('vt-to-dark');
    });
  };

  return { isDark, toggle };
}

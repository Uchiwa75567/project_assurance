import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import AppRouter from './app/router/AppRouter';
import Logo from './assets/images/logo.png';

const App: FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const preloadSources = useMemo(
    () => [
      Logo,
      '/login-illustration.svg',
      '/login-bench.svg',
      '/login-shadow.svg',
      '/register-illustration.svg',
    ],
    [],
  );

  useEffect(() => {
    let active = true;
    const start = Date.now();
    const minDurationMs = 3000;
    const maxDurationMs = 2500;

    const preload = (sources: string[]) =>
      Promise.allSettled(
        sources.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
            }),
        ),
      );

    const maxTimer = window.setTimeout(() => {
      if (active) setShowSplash(false);
    }, maxDurationMs);

    preload(preloadSources).then(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(minDurationMs - elapsed, 0);
      window.setTimeout(() => {
        if (active) setShowSplash(false);
      }, remaining);
    });

    return () => {
      active = false;
      window.clearTimeout(maxTimer);
    };
  }, [preloadSources]);

  return (
    <>
      {showSplash && (
        <div className="app-splash" role="status" aria-live="polite">
          <div className="app-splash__halo" />
          <img src={Logo} alt="MA Santé Assurance" className="app-splash__logo" />
          <div className="app-splash__pulse" />
        </div>
      )}
      <AppRouter />
    </>
  );
};

export default App;

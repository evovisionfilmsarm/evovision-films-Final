import { useEffect, useState } from 'react';

export interface Route {
  path: string;
  segments: string[];
}

function parse(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  const path = '/' + clean;
  const segments = clean ? clean.split('/').filter(Boolean) : [];
  return { path, segments };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() =>
    parse(typeof window !== 'undefined' ? window.location.hash : '')
  );

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(to: string) {
  const target = to.startsWith('/') ? to : '/' + to;
  window.location.hash = '#' + target;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={'#' + (to.startsWith('/') ? to : '/' + to)}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy, useCallback, useState, type CSSProperties } from 'react';
import { ArrowUpRight, BookOpen, Folder, Heart, Monitor, Printer, Trophy, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumePrintCopy } from '@/components/ReadingContent';
import { corners, type Corner } from '@/lib/portfolio';
import { profile } from '@/personal';

// Three.js is most of the page's weight: load it in its own chunk so the page shell paints first.
const CabinScene = lazy(() => import('@/components/CabinScene').then(m => ({ default: m.CabinScene })));

export const Route = createFileRoute('/')({
  ssr: false,
  head: () => ({ meta: [
    { title: profile.siteTitle },
    { name: 'description', content: profile.siteDescription },
    { property: 'og:title', content: profile.siteTitle },
    { property: 'og:description', content: profile.shareDescription },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<Corner | null>(null);
  const close = useCallback(() => setActive(null), []);
  const icons = [Monitor, BookOpen, Trophy, Waves, Printer, Folder];
  return <div className="portfolio-page">
    <header className="site-header" inert={active !== null}>
      <div className="name-tag-wrap"><div className="name-tag">
        <i className="tag-hole" aria-hidden="true" />
        <span className="tag-mark" aria-hidden="true">{profile.monogram}</span>
        <span className="tag-text"><h1>{profile.name}</h1><small>{profile.role}</small></span>
      </div></div>
      <Button className="about-pill" variant="ghost" onClick={() => setActive('about')}>About me <ArrowUpRight /></Button>
    </header>
    <main>
      <Suspense fallback={<div className="scene-wrap scene-loading" aria-label="Loading the cabin" />}><CabinScene active={active} onSelect={setActive} onClose={close} /></Suspense>
      <nav className="corner-nav" aria-label="Explore my corner">{corners.map((corner, i) => { const Icon = icons[i]; return <Button key={corner.id} variant="ghost" style={{ '--i': i } as CSSProperties} onClick={() => setActive(corner.id)}>{Icon && <Icon />}<span><strong>{corner.label}</strong><small>{corner.subtitle}</small></span></Button>; })}</nav>
    </main>
    <footer className="site-footer" inert={active !== null}><span>© {profile.year} {profile.name}</span><span>{profile.footerNote} <Heart size={11} /></span></footer>
    <ResumePrintCopy />
  </div>;
}

import { ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid, Maximize2, Minus, Plus, Printer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { corners, type Corner } from '@/lib/portfolio';
import { achievements, hobbies, experience } from '@/personal';

/* DOM controls layered over the cabin. Kept outside the scene JSX runtime so ARIA props survive. */
type Props = {
  active: Corner | null;
  ready: boolean;
  detail: number | null;
  onDetail: (detail: number | null) => void;
  onClose: () => void;
  onZoom: (step: number) => void;
  onReset: () => void;
  onFullscreen: () => void;
};

export function SceneOverlay({ active, ready, detail, onDetail, onClose, onZoom, onReset, onFullscreen }: Props) {
  if (!active) return <div className="scene-controls">
    <Button variant="ghost" size="icon" aria-label="Zoom in" title="Zoom in" onClick={() => onZoom(1)}><Plus /></Button>
    <Button variant="ghost" size="icon" aria-label="Zoom out" title="Zoom out" onClick={() => onZoom(-1)}><Minus /></Button>
    <Button variant="ghost" size="icon" aria-label="Reset view" title="Reset view" onClick={onReset}><RotateCcw /></Button>
    <Button variant="ghost" size="icon" aria-label="Fullscreen" title="Fullscreen" onClick={onFullscreen}><Maximize2 /></Button>
  </div>;
  const labels = active === 'achievements' ? achievements.map(a => a.title) : active === 'hobbies' ? hobbies.map(h => h.title) : active === 'experience' ? experience.map(j => j.organization ?? j.title) : null;
  const whole = active === 'achievements' || active === 'experience' ? 'Whole board' : 'All gear';
  const unit = active === 'achievements' ? 'photo' : active === 'experience' ? 'experience' : 'tag';
  const step = (direction: number) => {
    if (!labels) return;
    const from = detail ?? (direction > 0 ? -1 : 0);
    onDetail((from + direction + labels.length) % labels.length);
  };
  const name = active === 'about' ? 'About me' : corners.find(c => c.id === active)?.label ?? '';
  return <>
    <div className="reading-toolbar">
      <Button variant="outline" onClick={onClose}><ArrowLeft />Back to room</Button>
      {active === 'resume' && <Button variant="outline" onClick={() => window.print()}><Printer />Print résumé</Button>}
      {active === 'experience' && detail !== null && experience[detail]?.projectUrl && <a className="experience-project-link" href={experience[detail].projectUrl} target="_blank" rel="noopener noreferrer">View project ↗</a>}
    </div>
    <p className="sr-only" aria-live="polite">{ready ? `${name} is open.` : `Opening ${name}…`}</p>
    {labels && <div className="detail-stepper" role="group" aria-label={active === 'achievements' ? 'Photos on the board' : active === 'experience' ? 'Work experience focus' : 'Gear tags'}>
      <Button variant="ghost" size="icon" aria-label={`Previous ${unit}`} onClick={() => step(-1)}><ChevronLeft /></Button>
      <span>{detail === null ? whole : labels[detail]}</span>
      <Button variant="ghost" size="icon" aria-label={`Next ${unit}`} onClick={() => step(1)}><ChevronRight /></Button>
      {detail !== null && <Button variant="ghost" className="detail-whole" onClick={() => onDetail(null)}><LayoutGrid />{whole}</Button>}
    </div>}
  </>;
}

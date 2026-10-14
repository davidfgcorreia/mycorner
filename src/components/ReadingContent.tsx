import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Folder, Home, Monitor } from 'lucide-react';
import { about, achievementBoard, achievements, education, educationNote, experience, hobbies, profile, projects, resume, tagNote } from '@/personal';
import { boardCards, boardNote, type BoardItem } from '@/lib/board-layout';
import { ProjectPage } from './ProjectPage';

/*
 * Readable content for the physical surfaces in the cabin. Each component fills exactly
 * the pixel size of its surface (see reading-surfaces) and is mounted only up close.
 */
function Region({ label, className, focus = true, children }: { label: string; className: string; focus?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { if (focus) ref.current?.focus({ preventScroll: true }); }, [focus]);
  return <section ref={ref} role="region" aria-label={label} tabIndex={-1} className={`reading-region ${className}`}>{children}</section>;
}

const categories = ['All projects', ...new Set(projects.map(p => p.category))];
const home = `/home/${profile.firstName.toLowerCase()}/projects`;
const slug = (name: string) => name.toLowerCase().replaceAll(' ', '-');

export function ScreenContent() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState('All projects');
  const folderButtons = useRef<Map<number, HTMLButtonElement>>(new Map());
  const project = selected === null ? null : projects[selected];
  const visible = projects.map((p, i) => ({ p, i })).filter(({ p }) => filter === 'All projects' || p.category === filter);
  const choose = (value: string) => { setFilter(value); setSelected(null); };
  const back = () => {
    const previous = selected;
    setSelected(null);
    requestAnimationFrame(() => { if (previous !== null) folderButtons.current.get(previous)?.focus({ preventScroll: true }); });
  };
  return <Region label={`File Manager — ${profile.firstName}’s projects`} className="os-screen">
    <div className={`os-window ${project ? 'os-project-open' : ''}`}>
      <div className="os-title"><Monitor aria-hidden="true" /><span>File Manager — {home}</span><i aria-hidden="true"><b /><b /><b /></i></div>
      <div className="os-menu" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Bookmarks</span><span>Help</span></div>
      <div className="os-toolbar">
        <button type="button" aria-label="Back to projects" disabled={!project} onClick={back}><ArrowLeft /></button>
        <button type="button" aria-label="Home folder" onClick={() => choose('All projects')}><Home /></button>
        <span className="os-location">{home}{project ? `/${slug(project.name)}` : ''}</span>
        <label className="os-filter"><span className="sr-only">Show projects</span><select value={filter} onChange={e => choose(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
      </div>
      <div className="os-body">
        <nav className="os-sidebar" aria-label="Project places"><span>PLACES</span>{categories.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => choose(item)}><Folder aria-hidden="true" />{item}</button>)}</nav>
        <div className="os-main">
          {project ? <ProjectPage key={selected} project={project} /> : <div className="os-files">{visible.map(({ p, i }) => <button ref={node => { if (node) folderButtons.current.set(i, node); else folderButtons.current.delete(i); }} type="button" key={p.name} className="os-file" onClick={() => setSelected(i)}><Folder aria-hidden="true" /><strong>{p.name}</strong><small>{p.category}</small></button>)}</div>}
        </div>
      </div>
      <div className="os-status">{project ? project.name : `${visible.length} folders`}</div>
    </div>
  </Region>;
}

export function ResumeSheet() {
  return <article className="resume-sheet">
    <span className="eyebrow">{resume.heading.toUpperCase()}</span>
    <h2>{profile.name}</h2>
    {resume.isSample && <p className="sample-note">Sample résumé · personal details not yet supplied</p>}
    {resume.sections.map(s => <section key={s.title}><h3>{s.title}</h3><p>{s.text}</p></section>)}
    <footer>Printed in {profile.firstName}’s corner · {profile.year}</footer>
  </article>;
}
export function ResumeContent() { return <Region label={`${profile.name} — Résumé`} className="resume-region"><ResumeSheet /></Region>; }
/** Print-only copy: the in-room sheet is transformed, so printing uses a plain document. */
export function ResumePrintCopy() { return <div className="resume-print-copy"><ResumeSheet /></div>; }

export function BookSpread() {
  const [chapter, setChapter] = useState(0);
  const school = education[chapter];
  if (!school) return null;
  return <Region label="My school history" className="book-spread">
    <div className="book-page book-left">
      <BookOpen aria-hidden="true" />
      <span className="eyebrow">{profile.name.toUpperCase()}</span>
      <h2>School<br />history.</h2>
      <div className="book-index">{education.map((s, i) => <button type="button" key={s.title} aria-current={chapter === i} onClick={() => setChapter(i)}><span>0{i + 1}</span>{s.title}</button>)}</div>
      <small>{educationNote}</small>
    </div>
    <div className="book-page book-right">
      <div key={chapter} className="page-turn" role="region" aria-label={`${school.title} details`} tabIndex={0}>
        <span className="eyebrow">{school.period}</span>
        <h2>{school.title}</h2>
        <a className="book-institution" href={school.institutionUrl} target="_blank" rel="noopener noreferrer">{school.institution}</a>
        <h3>{school.qualification}</h3>
        <p>{school.description}</p>
        <dl className="book-results">{school.results.map(result => <div key={result.label}>
          <dt>{result.label}</dt>
          <dd>{result.value}{result.note && <span>{result.note}</span>}</dd>
        </div>)}</dl>
        {school.research && <section className="book-research" aria-label="Current thesis">
          <h3>{school.research.title}</h3>
          <p>{school.research.description}</p>
        </section>}
        <div className="ruled-paper" />
      </div>
      <div className="book-pagination">
        <button type="button" aria-label="Previous school chapter" disabled={chapter === 0} onClick={() => setChapter(v => v - 1)}><ArrowLeft /></button>
        <span>{chapter + 1} / {education.length}</span>
        <button type="button" aria-label="Next school chapter" disabled={chapter === education.length - 1} onClick={() => setChapter(v => v + 1)}><ArrowRight /></button>
      </div>
    </div>
  </Region>;
}

const place = (item: BoardItem): CSSProperties => ({ left: item.x - item.w / 2, top: item.y - item.h / 2, width: item.w, height: item.h, transform: `rotate(${item.angle}deg)` });

export function BoardContent({ detail, onDetail }: { detail: number | null; onDetail: (detail: number | null) => void }) {
  return <Region label="The achievement board" className="board-surface">
    <div className="board-note" style={place(boardNote)}><span>{achievementBoard.title}</span><small>{achievementBoard.note}</small></div>
    {achievements.map((a, i) => { const card = boardCards[i]; return card && <button type="button" key={a.title} className={`board-card ${detail === i ? 'is-focused' : ''}`} style={place(card)} aria-pressed={detail === i} onClick={() => onDetail(detail === i ? null : i)}>
      <i className="board-pin" aria-hidden="true" />
      <img src={a.image} width={288} height={192} alt={`Illustrative photograph: ${a.title}`} />
      <strong>{a.title}</strong>
      <p>{a.description}</p>
      <small>{achievementBoard.cardNote}</small>
    </button>; })}
  </Region>;
}

export function JournalContent() {
  return <Region label="Work experience" className="journal-surface">
    <span className="eyebrow">WORK JOURNAL</span>
    <h2>Experience</h2>
    <ol>{experience.map((w, i) => <li key={w.title}><span>0{i + 1}</span><div><h3>{w.title}</h3><p>{w.text}</p></div></li>)}</ol>
    <p className="sample-note">Sample work history · awaiting David’s details</p>
  </Region>;
}

export function TagContent({ index, focused, onFocus }: { index: number; focused: boolean; onFocus: () => void }) {
  const hobby = hobbies[index];
  if (!hobby) return null;
  return <Region label={`${hobby.title} tag`} focus={focused} className="tag-surface">
    <button type="button" aria-pressed={focused} onClick={onFocus}><strong>{hobby.title}</strong><p>{hobby.text}</p><small>{tagNote}</small></button>
  </Region>;
}

export function NotebookSpread() {
  return <Region label="About me" className="notebook-spread">
    <div className="note-page note-left"><span className="note-mark">{profile.monogram}.</span><h2>About me</h2><small>{about.coverNote}</small></div>
    <div className="note-page note-right"><h2>{about.greeting}</h2><p>{about.text}</p><div className="ruled-paper" /><p className="sample-note">Sample biography · awaiting David’s details</p></div>
  </Region>;
}

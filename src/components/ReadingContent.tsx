import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Folder, Home, Monitor } from 'lucide-react';
import { about, achievementBoard, achievements, education, educationNote, experience, hobbies, profile, projects, resume, tagNote, type ResumeEntry } from '@/personal';
import { boardCards, boardNote, type BoardItem } from '@/lib/board-layout';
import { ProjectPage } from './ProjectPage';
import { journalEntry } from '@/lib/journal-layout';
import { NotebookDoodles } from './NotebookDoodles';

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

const contactLine = () => {
  const { email, github, linkedin, location } = profile.contact;
  const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');
  return [location, email, github && bare(github), linkedin && bare(linkedin)].filter(Boolean).join(' · ');
};

function ResumeEntries({ title, entries }: { title: string; entries: ResumeEntry[] }) {
  return <section><h3>{title}</h3>{entries.map(e => <div key={e.title} className="resume-entry">
    <p className="resume-entry-head"><strong>{e.title}</strong><span>{e.place}</span><span>{e.period}</span></p>
    <ul>{e.points.map(point => <li key={point}>{point}</li>)}</ul>
  </div>)}</section>;
}

/** The printer sheet: the short version, sized to fit the paper without scrolling. */
export function ResumeSheet() {
  const line = (e: ResumeEntry) => <li key={e.title}><strong>{e.title}</strong> · {e.place} · {e.period}</li>;
  return <article className="resume-sheet">
    <span className="eyebrow">{resume.heading.toUpperCase()}</span>
    <h2>{profile.name}</h2>
    <p className="resume-contact">{resume.role} · {contactLine()}</p>
    <section><h3>Profile</h3><p>{resume.sheetSummary}</p></section>
    <section><h3>Experience</h3><ul>{resume.experience.map(line)}</ul></section>
    <section><h3>Education</h3><ul>{resume.education.map(line)}</ul></section>
    <section><h3>Awards</h3><ul>{resume.awards.map(a => <li key={a}>{a}</li>)}</ul></section>
    <section><h3>Skills</h3><p>{resume.sheetSkills}</p></section>
    <footer>Full résumé: “Print résumé” downloads the PDF · {profile.year}</footer>
  </article>;
}

/** The full résumé, used for printing and the PDF. */
function ResumeDocument() {
  const { github, linkedin, email } = profile.contact;
  return <article className="resume-document">
    <header>
      <h1>{profile.name}</h1>
      <p className="resume-role">{resume.role}</p>
      <p className="resume-contact">{profile.contact.location} · <a href={`mailto:${email}`}>{email}</a> · <a href={github}>{github.replace(/^https?:\/\//, '')}</a> · <a href={linkedin}>{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></p>
    </header>
    <section><h3>Profile</h3><p>{resume.summary}</p></section>
    <ResumeEntries title="Experience" entries={resume.experience} />
    <ResumeEntries title="Education" entries={resume.education} />
    <ResumeEntries title="Selected projects" entries={resume.projects} />
    <section><h3>Awards</h3><ul>{resume.awards.map(a => <li key={a}>{a}</li>)}</ul></section>
    <section><h3>Skills</h3>{resume.skills.map(g => <p key={g.label}><strong>{g.label}:</strong> {g.items}</p>)}<p><strong>Spoken languages:</strong> {resume.spoken}</p></section>
  </article>;
}
export function ResumeContent() { return <Region label={`${profile.name} — Résumé`} className="resume-region"><ResumeSheet /></Region>; }
/** Print-only copy: the in-room sheet is transformed, so printing uses a plain document. */
export function ResumePrintCopy() { return <div className="resume-print-copy"><ResumeDocument /></div>; }

type Turn = { from: number; to: number };
const TURN_MS = 1100;
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function BookLeft({ chapter, onChapter, copy }: { chapter: number; onChapter: (i: number) => void; copy?: boolean }) {
  return <>
    <BookOpen aria-hidden="true" />
    <span className="eyebrow">{profile.name.toUpperCase()}</span>
    <h2>School<br />history.</h2>
    <div className="book-index">{education.map((s, i) => <button type="button" key={s.title} tabIndex={copy ? -1 : undefined} aria-current={chapter === i} onClick={() => onChapter(i)}><span>0{i + 1}</span>{s.title}</button>)}</div>
    <small>{educationNote}</small>
  </>;
}

function BookRight({ chapter, onChapter, copy }: { chapter: number; onChapter: (i: number) => void; copy?: boolean }) {
  const school = education[chapter];
  if (!school) return null;
  const tab = copy ? -1 : undefined;
  return <>
    <div className="page-turn" role={copy ? undefined : 'region'} aria-label={copy ? undefined : `${school.title} details`}>
      <span className="eyebrow">{school.period}</span>
      <h2>{school.title}</h2>
      <a className="book-institution" href={school.institutionUrl} tabIndex={tab} target="_blank" rel="noopener noreferrer">{school.institution}</a>
      {school.qualification && <h3>{school.qualification}</h3>}
      {school.description && <p>{school.description}</p>}
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
      <button type="button" tabIndex={tab} aria-label="Previous school chapter" disabled={chapter === 0} onClick={() => onChapter(chapter - 1)}><ArrowLeft /></button>
      <span>{chapter + 1} / {education.length}</span>
      <button type="button" tabIndex={tab} aria-label="Next school chapter" disabled={chapter === education.length - 1} onClick={() => onChapter(chapter + 1)}><ArrowRight /></button>
    </div>
  </>;
}

/**
 * Turning a chapter flips the right page over the spine like a real leaf. Forward, the old page
 * turns over and lands on the left; backward, a leaf lifts off the left and lands on the right with
 * the earlier chapter. The leaf's back is a copy of the index page, so the left page reads the same
 * before, during and after. The outer half bends ahead of the inner half (a curl), so some of the
 * page faces the viewer in every frame instead of going edge-on and vanishing.
 */
/** One half of the turning leaf, front (a chapter) and back (the index page), both inert copies. */
function leafFaces(right: number, left: number, half: 'inner' | 'outer') {
  const noop = () => {};
  return <>
    <div className={`book-page book-right leaf-front is-${half}`}><BookRight chapter={right} onChapter={noop} copy /></div>
    <div className={`book-page book-left leaf-back is-${half}`}><BookLeft chapter={left} onChapter={noop} copy /></div>
  </>;
}

export function BookSpread() {
  const [chapter, setChapter] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const go = (to: number) => {
    if (turn || to === chapter || to < 0 || to >= education.length) return;
    if (!reducedMotion()) setTurn({ from: chapter, to });
    setChapter(to);
  };
  useEffect(() => {
    if (!turn) return;
    const t = window.setTimeout(() => setTurn(null), TURN_MS + 50);
    return () => window.clearTimeout(t);
  }, [turn]);
  const forward = turn ? turn.to > turn.from : true;
  // Backward, the old chapter stays on the right until the leaf lands on it.
  const right = turn && !forward ? turn.from : chapter;
  // Each index page highlights the level on the page facing it: the page under the leaf keeps the
  // spread it belongs to, and the leaf's back carries the other one.
  const left = turn && forward ? turn.from : chapter;
  const leafLeft = turn && !forward ? turn.from : chapter;
  return <Region label="My school history" className="book-spread">
    <div className="book-page book-left"><BookLeft chapter={left} onChapter={go} /></div>
    <div className="book-page book-right"><BookRight chapter={right} onChapter={go} /></div>
    {turn && <div className={`book-leaf ${forward ? 'is-forward' : 'is-backward'}`} aria-hidden="true" inert style={{ '--turn': `${TURN_MS}ms` } as CSSProperties}>
      {leafFaces(forward ? turn.from : turn.to, leafLeft, 'inner')}
      <div className="leaf-fold">{leafFaces(forward ? turn.from : turn.to, leafLeft, 'outer')}</div>
    </div>}
  </Region>;
}

const place = (item: BoardItem): CSSProperties => ({ left: item.x - item.w / 2, top: item.y - item.h / 2, width: item.w, height: item.h, transform: `rotate(${item.angle}deg)` });

export function BoardContent({ detail, onDetail }: { detail: number | null; onDetail: (detail: number | null) => void }) {
  return <Region label="The achievement board" className="board-surface">
    <div className="board-note" style={place(boardNote)}><span>{achievementBoard.title}</span><small>{achievementBoard.note}</small></div>
    {achievements.map((a, i) => { const card = boardCards[i]; return card && <button type="button" key={a.title} className={`board-card ${detail === i ? 'is-focused' : ''}`} style={place(card)} aria-pressed={detail === i} onClick={() => onDetail(detail === i ? null : i)}>
      <i className="board-pin" aria-hidden="true" />
      <img src={a.image} width={288} height={192} alt={a.alt} />
      <strong>{a.title}</strong>
      <p>{a.description}</p>
      <small>{a.note}</small>
    </button>; })}
  </Region>;
}

export function JournalContent({ detail, onDetail }: { detail: number | null; onDetail: (detail: number | null) => void }) {
  return <Region label="Work experience" className="journal-surface">
    <span className="eyebrow">WORK JOURNAL</span>
    <h2>Experience</h2>
    {experience.map((job, i) => <button key={`${job.period}-${job.title}`} type="button" className="journal-entry" style={{ left: journalEntry(i).x, top: journalEntry(i).y, width: journalEntry(i).width, height: journalEntry(i).height }} aria-label={`Focus ${job.organization ?? job.title} experience`} aria-pressed={detail === i} onClick={() => onDetail(detail === i ? null : i)}>
      <span className="journal-meta">{job.period}{job.organization && ` · ${job.organization}`}</span>
      <strong>{job.title}</strong>
      <p>{job.summary}</p>
    </button>)}
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
    <div className="note-page note-left"><span className="note-mark">{profile.monogram}.</span><h2>About me</h2><NotebookDoodles cover /><small>{about.coverNote}</small></div>
    <div className="note-page note-right"><h2>{about.greeting}</h2>{about.paragraphs.map(text => <p key={text}>{text}</p>)}<NotebookDoodles /><div className="ruled-paper" /></div>
  </Region>;
}

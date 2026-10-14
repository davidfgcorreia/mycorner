import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Play } from "lucide-react";
import type { Project } from "@/personal";

type View = "overview" | "images" | "preview";

function webUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** A document inside the monitor, independent of the scene's camera and selection clock. */
export function ProjectPage({ project }: { project: Project }) {
  const [view, setView] = useState<View>("overview");
  const [image, setImage] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const images = project.images ?? [];
  const website = webUrl(project.websiteUrl);
  const source = webUrl(project.sourceUrl);
  const recording = project.demoType === "recording";
  const localRecording =
    recording && project.demoUrl?.startsWith("/projects/") ? project.demoUrl : undefined;
  const preview = localRecording ?? webUrl(project.demoUrl) ?? website;
  const externalPreview = webUrl(project.demoExternalUrl) ?? preview;
  const hasPreview = Boolean(preview);
  const previewLabel = project.demoUrl ? "Demo" : "Live site";
  const views: { id: View; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(images.length ? [{ id: "images" as const, label: `Images (${images.length})` }] : []),
    ...(hasPreview ? [{ id: "preview" as const, label: previewLabel }] : []),
  ];

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0;
  }, [view]);

  return (
    <article
      className={`project-page ${view === "preview" ? "has-preview-open" : ""}`}
      aria-label={`${project.name} project`}
    >
      <header className="project-header">
        <div>
          <span className="project-meta">
            {project.category} · {project.year}
          </span>
          <h2 ref={heading} tabIndex={-1}>
            {project.name}
          </h2>
        </div>
        <nav className="project-links" aria-label="Project links">
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer">
              Open site <ExternalLink aria-hidden="true" />
            </a>
          )}
          {source && (
            <a href={source} target="_blank" rel="noopener noreferrer">
              Source <ExternalLink aria-hidden="true" />
            </a>
          )}
        </nav>
      </header>
      <nav className="project-tabs" aria-label="Project views">
        {views.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={view === tab.id}
            aria-controls="project-view"
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <span>Scroll to explore ↓</span>
      </nav>
      <div
        ref={scroll}
        id="project-view"
        className="project-scroll"
        role="region"
        aria-label={`${project.name} ${view}`}
        tabIndex={0}
      >
        {view === "overview" && (
          <div className="project-overview">
            {images[0] && (
              <a
                className="project-image-link"
                href={images[0].src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open full-size image: ${images[0].alt}`}
              >
                <img className="project-hero" src={images[0].src} alt={images[0].alt} />
              </a>
            )}
            <p className="project-intro">{project.description}</p>
            <div className="os-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h3>About the project</h3>
            <p>{project.detail}</p>
            {Boolean(project.highlights?.length) && (
              <>
                <h3>What you can explore</h3>
                <ul>
                  {project.highlights?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {hasPreview && (
              <button
                type="button"
                className="project-preview-button"
                onClick={() => setView("preview")}
              >
                <Play aria-hidden="true" />
                View {previewLabel.toLowerCase()}
              </button>
            )}
          </div>
        )}
        {view === "images" && images[image] && (
          <div className="project-gallery">
            <figure>
              <a
                className="project-image-link"
                href={images[image].src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open full-size image: ${images[image].alt}`}
              >
                <img src={images[image].src} alt={images[image].alt} />
              </a>
              <figcaption>{images[image].caption ?? images[image].alt}</figcaption>
            </figure>
            {images.length > 1 && (
              <div className="project-gallery-controls">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => setImage((image + images.length - 1) % images.length)}
                >
                  <ArrowLeft />
                </button>
                <span aria-live="polite">
                  {image + 1} / {images.length}
                </span>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setImage((image + 1) % images.length)}
                >
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>
        )}
        {view === "preview" && (
          <div
            className={`project-preview ${project.demoType === "video" || recording ? "is-video" : ""}`}
          >
            <div className="project-preview-note">
              {previewLabel} preview
              {externalPreview && (
                <a href={externalPreview} target="_blank" rel="noopener noreferrer">
                  Open in new tab <ExternalLink aria-hidden="true" />
                </a>
              )}
            </div>
            {recording ? (
              <video
                src={preview}
                controls
                playsInline
                preload="metadata"
                aria-label={`${project.name} demo`}
              />
            ) : (
              <iframe
                title={`${project.name} ${previewLabel.toLowerCase()}`}
                src={preview}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
            {preview && !recording && (
              <p className="project-embed-help">
                If this site does not allow embedded viewing, use “Open in new tab” above.
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

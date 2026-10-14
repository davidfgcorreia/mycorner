import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScreenContent } from "@/components/ReadingContent";
import { ProjectPage } from "@/components/ProjectPage";
import type { Project } from "@/personal";

afterEach(cleanup);
const project: Project = {
  name: "Test site",
  category: "Web app",
  year: "2026",
  description: "A website.",
  detail: "Project details.",
  tags: ["React"],
  websiteUrl: "https://example.com/",
  sourceUrl: "https://github.com/example/project",
  images: [
    { src: "/one.webp", alt: "First screen" },
    { src: "/two.webp", alt: "Second screen" },
  ],
};

describe("Computer project viewer", () => {
  it("opens real project media, resets the view when reopened, and restores folder focus", async () => {
    render(<ScreenContent />);
    fireEvent.click(screen.getByRole("button", { name: "Cascais Micromobility Web app" }));
    expect(screen.getByRole("heading", { name: "Cascais Micromobility" })).toHaveFocus();
    expect(screen.queryByTitle("Cascais Micromobility demo")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Images (3)" }));
    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringContaining("Laya"));
    fireEvent.click(screen.getByRole("button", { name: "Demo" }));
    expect(screen.getByTitle("Cascais Micromobility demo")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/xIjXYXA3tug",
    );
    expect(screen.getByRole("link", { name: "Open in new tab" })).toHaveAttribute(
      "href",
      "https://youtu.be/xIjXYXA3tug",
    );
    fireEvent.click(screen.getByRole("button", { name: "Back to projects" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cascais Micromobility Web app" })).toHaveFocus(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Cascais Micromobility Web app" }));
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByTitle("Cascais Micromobility demo")).not.toBeInTheDocument();
  });

  it("embeds a website only when selected and keeps an external fallback", () => {
    render(<ProjectPage project={project} />);
    expect(screen.queryByTitle("Test site live site")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Live site" }));
    expect(screen.getByTitle("Test site live site")).toHaveAttribute("src", "https://example.com/");
    expect(screen.getByRole("link", { name: "Open in new tab" })).toHaveAttribute(
      "href",
      "https://example.com/",
    );
    fireEvent.click(screen.getByRole("button", { name: "Overview" }));
    expect(screen.queryByTitle("Test site live site")).not.toBeInTheDocument();
  });

  it("omits missing media and rejects non-web URL schemes", () => {
    render(
      <ProjectPage
        project={{
          ...project,
          images: [],
          websiteUrl: "javascript:alert(1)",
          sourceUrl: "",
        }}
      />,
    );
    expect(screen.queryByRole("button", { name: /Images|Live site|Demo/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Project details.")).toBeInTheDocument();
  });
});

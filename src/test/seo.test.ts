import { describe, expect, it } from "vitest";
import { crawlerContent } from "@/lib/crawler-content";
import { personJsonLd, profilePageJsonLd } from "@/lib/seo";
import { profile } from "@/personal";

describe("crawler-readable portfolio", () => {
  it("exposes name, academic identity and real project links without browser APIs", () => {
    const content = crawlerContent();
    expect(content).toContain(profile.name);
    expect(content).toContain(profile.academicSummary);
    expect(content).toContain(`${profile.site}/profile`);
    expect(content).toContain("https://github.com/davidfgcorreia");
  });
  it("connects the profile page to the same named person", () => {
    const person = JSON.parse(personJsonLd());
    const page = JSON.parse(profilePageJsonLd());
    expect(page.mainEntity["@id"]).toBe(person["@id"]);
    expect(person.name).toBe(profile.name);
    expect(person.sameAs).toContain(profile.contact.linkedin);
    expect(person.affiliation.alternateName).toContain("IST");
  });
});

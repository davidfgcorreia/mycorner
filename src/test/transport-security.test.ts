import { describe, expect, it } from "vitest";
import { canonicalRedirect, secureResponse } from "@/lib/transport-security";

describe("public transport security", () => {
  it.each([
    "http://davidfcorreia.com",
    "http://www.davidfcorreia.com",
    "https://www.davidfcorreia.com",
  ])("redirects %s to canonical HTTPS without losing the path or query", (origin) => {
    const response = canonicalRedirect(new Request(`${origin}/profile?source=cv`));
    expect(response?.status).toBe(308);
    expect(response?.headers.get("location")).toBe("https://davidfcorreia.com/profile?source=cv");
  });
  it("does not redirect canonical HTTPS or local development", () => {
    expect(canonicalRedirect(new Request("https://davidfcorreia.com/"))).toBeUndefined();
    expect(canonicalRedirect(new Request("http://localhost:3000/profile"))).toBeUndefined();
  });
  it("preserves the response while adding HTTPS policy headers", async () => {
    const response = secureResponse(
      new Request("https://davidfcorreia.com/profile"),
      new Response("profile", {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );
    expect(response.headers.get("strict-transport-security")).toBe("max-age=31536000");
    expect(response.headers.get("content-security-policy")).toBe("upgrade-insecure-requests");
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await response.text()).toBe("profile");
  });
});

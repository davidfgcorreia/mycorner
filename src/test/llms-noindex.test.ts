import { describe, expect, it } from "vitest";
import server from "@/server";

describe("/llms.txt", () => {
  it("is readable but kept out of search results", async () => {
    const response = await server.fetch(
      new Request("https://davidfcorreia.com/llms.txt"),
      undefined,
      undefined,
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
    expect(await response.text()).toContain("David Correia");
  });
});

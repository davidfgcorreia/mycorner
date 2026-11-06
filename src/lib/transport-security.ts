const productionHosts = new Set(["davidfcorreia.com", "www.davidfcorreia.com"]);

/** Keep local HTTP development working; canonicalize only our public domains. */
export function canonicalRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (!productionHosts.has(url.hostname)) return;
  if (url.protocol === "http:" || url.hostname.startsWith("www.")) {
    url.protocol = "https:";
    url.hostname = "davidfcorreia.com";
    url.port = "";
    return Response.redirect(url.toString(), 308);
  }
  return undefined;
}

export function secureResponse(request: Request, response: Response): Response {
  const url = new URL(request.url);
  if (url.protocol !== "https:" || !productionHosts.has(url.hostname)) return response;
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("Content-Security-Policy", "upgrade-insecure-requests");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

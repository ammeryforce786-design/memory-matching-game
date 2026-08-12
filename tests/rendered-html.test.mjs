import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Memory Match game shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Memory Match<\/title>/i);
  assert.match(html, /Memory Match/);
  assert.match(html, /Matches/);
  assert.match(html, /Lives/);
  assert.match(html, /Choose two cards with the same number/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("creates a GitHub Pages-compatible static export", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /href="\.\/_next\//);
  assert.doesNotMatch(html, /(?:href|src)="\/_next\//);
  await access(new URL("../dist/client/.nojekyll", import.meta.url));
});

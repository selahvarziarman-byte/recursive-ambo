/**
 * STAMP USE-2 (2026-09-25, the mothership) — THE PAGE SAYS WHICH VERSION IT RUNS.
 *
 * The Save / Load panel says `this page: 2027c6d` — the version the page was LOADED from, asked of `/__whereami` once
 * when the panel mounts (a reload remounts it, so the label is the load's by construction). Where the server does not
 * answer with a head — no endpoint, a non-JSON answer, a network failure, or the producer's own error body
 * `{"error":"whereami producer failed"}` (vite.config.ts) — the page shows NO version: a true absence, never a guess.
 * `/__whereami` is unchanged; it stays the server's truth. This file only READS it, and nothing here reloads a page.
 *
 * The stamp's step 0 was measured first (a scratch port, never :5180): vite's own client reloads a VISIBLE page
 * within a second of its server coming back — and the workspace store is not persisted, so that reload wipes unsaved
 * work; a HIDDEN page does not reload while hidden (its client logs "server connection lost" and waits to be shown);
 * when next shown, its client reloads it. The stamp's item 2 — a "the server now runs X" line for a page left running
 * across a release — was built and then CUT before landing on Arman's ruling (2026-09-25 20:54): a page in use across
 * a release is implementation scaffolding, worked around by halting the use while the coder works. This label is what
 * remains: a reader of the PAGE learns what the page runs (the server's answer is a right answer about the server), and
 * a label that ever differs from `/__whereami` is the falsifier of that rule.
 */

export const WHEREAMI_PATH = '/__whereami';

/** the 7-character head from /__whereami's body; null for anything that is not a head — the producer's error body,
 *  a malformed body, an absent field. NEVER a placeholder: a null here is rendered as nothing at all. */
export function readWhereamiHead(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const head = (body as { head?: unknown }).head;
  if (typeof head !== 'string' || !/^[0-9a-f]{7,40}$/.test(head)) return null;
  return head.slice(0, 7);
}

/** the one shape of `fetch` this reader uses, so a witness can stub the endpoint under node */
export type FetchLike = (input: string) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

/** ask the server which commit it serves; null wherever it does not answer with a head */
export async function askServerHead(fetchImpl: FetchLike = fetch): Promise<string | null> {
  try {
    const res = await fetchImpl(WHEREAMI_PATH);
    if (!res.ok) return null;
    return readWhereamiHead(await res.json());
  } catch {
    return null;
  }
}

/** the page's own line (the words are the mothership's placeholders; the designer may amend them) */
export function pageVersionLine(pageHead: string): string {
  return `this page: ${pageHead}`;
}

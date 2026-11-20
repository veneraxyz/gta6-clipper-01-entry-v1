// gta6-clipper-01 — "GTA 6's Most Polite Customer" (v1).
//
// The entry is the YouTube video itself; this program only hands the video's
// address to the grader. It reads VIDEO.json from the repository root and
// writes the same bytes to the output directory, so the house can read the
// video through the YouTube Data API. Node 22, standard library only, no
// network, no wall clock, deterministic output.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handInVideoAddress(): void {
  const source = join(BOT_DIR, 'VIDEO.json');
  const target = join(OUTPUT_DIR, 'VIDEO.json');
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const bytes = readFileSync(source);
  // Fail loudly on a malformed file instead of handing on bytes the gate
  // cannot read; the original bytes still go out unchanged when it parses.
  const parsed: unknown = JSON.parse(bytes.toString('utf8'));
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('VIDEO.json must be an object with a string url');
  }
  writeFileSync(target, bytes);
}

try {
  handInVideoAddress();
} catch (err) {
  console.error(`gta6-clipper-01: VIDEO.json handoff failed: ${(err as Error).message}`);
  process.exit(1);
}

# GTA 6's Most Polite Customer — gta6-clipper-01 entry (v1)

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/veneraxyz/gta6-clipper-01-entry-v1/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/veneraxyz/gta6-clipper-01-entry-v1/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

An entry for the make.fun bounty **"Clip GTA 6 for the most YouTube views"**:
a 20-second vertical Short cut from Rockstar's GTA VI Trailer 1 — an alligator
walking into a convenience store, treated as the most polite customer in
Leonida. The clip hooks on the GTA 6 moment, then pitches make.fun to the
viewer: they can make money on make.fun by making clips with AI.

make.fun is a site where people and their AI agents build things, enter them in
paid competitions (bounties) and earn real money when they win. This bounty
pays the 20 most-watched clips $500 in total; places go by YouTube views at the
deadline.

## The clip

- **Moment:** the "FRONT DOOR" security-camera shot in Trailer 1's social-media
  montage — an alligator walks through the glass door of a store while shoppers
  watch. Found by scanning the trailer frame by frame; the shot runs
  ~47.53–48.60s in Rockstar's upload.
- **Hook:** opens directly on the alligator crossing the threshold, captioned
  "GTA 6'S MOST POLITE CUSTOMER". The joke — a dangerous animal on an ordinary
  shopping trip — reads in under a second, with no mission context or spoilers.
- **Edit:** 20 seconds, 1080×1920 vertical. Entrance, freeze ("no robbery.
  just snacks."), a wider reframe ("bro came for one thing"), the strongest
  frame ("the entire snack aisle"), then the make.fun pitch spoken and captioned
  over the replaying footage ("Make money on make.fun by making clips with
  AI"), a call to action ("make.fun • try making a clip"), and a loop back into
  the opening movement ("someone serve him already"). One understated
  door-chime, no fake excitement, no end card.
- **Voice:** one dry conversational line, synthesized in-session with Piper
  (en_US-lessac-medium).
- **Source label:** "Rockstar • Trailer 1" on screen; footage is Rockstar
  Games', GTA VI Trailer 1.

`MAKING.md` in this repository records the exact cut points, the ffmpeg
commands and the TTS used.

## The video

`VIDEO.json` at the repository root names the video's YouTube address. It
currently holds a placeholder (`PLACEHOLDER-UPLOAD-PENDING`): the clip is
uploaded to the entrant's YouTube channel after this build, and the real
address replaces the placeholder before submission. `main.ts` (Node 22,
standard library only) copies `VIDEO.json` to the output directory, which is
all the grader needs — the house reads the video's views itself.

Run it the way the grader does:

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

It prints nothing on success and produces `out/VIDEO.json`, byte for byte the
repository's `VIDEO.json`.

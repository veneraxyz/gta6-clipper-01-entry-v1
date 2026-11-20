# MAKING.md — GTA 6's Most Polite Customer (v1)

How the clip was made, in this session, by the agent. Everything below was run
here, not by hand and not in another tool.

## Source choice

Rockstar's Grand Theft Auto VI Trailer 1, official upload:
https://www.youtube.com/watch?v=QdBZY2fkU-0 (downloaded with yt-dlp,
1920×1080, 90.05s). I scanned the whole trailer at 1 fps, then the montage
region at 4 fps, and located the shot visually rather than trusting a
timestamp: the "FRONT DOOR" security-camera clip in Trailer 1's social-media
montage, an alligator walking through a store's glass entrance while shoppers
watch. It is the only moment in the trailer where a dangerous animal does
something completely ordinary, which is why it holds a viewer with no context.

## Cut points (trailer time)

- CCTV shot boundaries (scene detection + frame reads): ~47.53s in, ~48.60s out
  (~1.07s of footage; the preceding livestream shot ends at ~47.53s, the police
  bodycam shot starts at ~48.60s).
- Entrance segment A used for every replay: **47.58–48.58** (exactly 1.00s,
  30 frames at 30 fps), trimmed to stay inside the shot.
- Strongest frame (freeze + thumbnail): **48.00** — the alligator's head fully
  inside, body still crossing the door, doorway readable.
- The 20-second clip is built from segment A looped and reframed, plus freezes
  on the 48.00 frame: 0–3s entrance (tight crop, tracking pan), 3–5s freeze
  punch-in, 5–8s wider blur-fill reframe, 8–10s strongest frame, 10–15s replay
  under the pitch, 15–18s clean replay + CTA, 18–20s return to the opening
  composition and cut into the opening movement so the clip loops.

## ffmpeg commands (ffmpeg 8.1.2)

Download (yt-dlp 2026.10.26, installed with `pip install --user
--break-system-packages yt-dlp`):

    python3 -m yt_dlp -f "bv*[height<=1080]+ba/b[height<=1080]" \
      --merge-output-format mp4 -o trailer1.mp4 \
      "https://www.youtube.com/watch?v=QdBZY2fkU-0"

Frame scan (1 fps contact sheets, then 4 fps over 46–52s):

    ffmpeg -i trailer1.mp4 -vf "fps=1,scale=320:180,tile=5x3" sheet%02d.png
    ffmpeg -ss 46 -i trailer1.mp4 -t 6 -vf "fps=4,scale=480:270,tile=6x4" gator_sheet.png

Base clips (tight crop tracks the animal: crop x drifts 960→900 over the
second; wide reframe is the full frame over a blurred, darkened fill):

    ffmpeg -ss 47.58 -i trailer1.mp4 -t 1.1 -vf \
      "crop=607:1080:x='960-60*t':y=0,scale=1080:1920,fps=30,trim=end_frame=30,setpts=N/30/TB" \
      -an -frames:v 30 -c:v libx264 -crf 16 -pix_fmt yuv420p a_tight.mp4
    ffmpeg -ss 47.58 -i trailer1.mp4 -t 1.1 -filter_complex \
      "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=40,eq=brightness=-0.25[bg];[b]scale=1080:607[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,fps=30,trim=end_frame=30,setpts=N/30/TB" \
      -an -frames:v 30 -c:v libx264 -crf 16 -pix_fmt yuv420p a_wide.mp4
    ffmpeg -ss 48.0 -i trailer1.mp4 -frames:v 1 -vf \
      "crop=607:1080:x=935:y=0,scale=1080:1920" freeze48_tight.png

Segments (8, exact frame counts, captions in DejaVu Sans Bold, white with
black outline/shadow, inside the Shorts safe area; freezes use zoompan for a
slight punch-in, 1.00→1.08 and 1.00→1.05):

    s1 3s: -stream_loop 2 a_tight.mp4 + "GTA 6'S MOST / POLITE CUSTOMER" (top) + "Rockstar • Trailer 1"
    s2 2s: freeze48_tight.png zoompan 1.00→1.08 + "no robbery. just snacks."
    s3 3s: -stream_loop 2 a_wide.mp4 + "bro came for one thing"
    s4 2s: freeze48_tight.png zoompan 1.00→1.05 + "the entire snack aisle"
    s5 5s: -stream_loop 4 a_tight.mp4 + "Make money on make.fun" (0–2.5s) / "by making clips with AI" (2.5–5s)
    s6 3s: -stream_loop 2 a_tight.mp4 + "make.fun • try making a clip" + "Competition entry • earnings not guaranteed"
    s7a 1s: freeze48_tight.png zoompan 1.05→1.00 + "someone serve him already"
    s7b 1s: a_tight.mp4 + "someone serve him already"

Final concat + audio (setsar=1 before concat: zoompan segments carry a
different sample aspect ratio and concat refuses the mix):

    ffmpeg -i s1.mp4 -i s2.mp4 -i s3.mp4 -i s4.mp4 -i s5.mp4 -i s6.mp4 -i s7a.mp4 -i s7b.mp4 -i vo_raw.wav \
      -filter_complex "[0:v]setsar=1[v0]; ... [v0]...[v7]concat=n=8:v=1:a=0[vout]; \
      [8:a]aresample=48000,adelay=10300:all=1[vo]; \
      sine=frequency=880:duration=0.45,aresample=48000,afade=t=out:st=0.15:d=0.3,volume=0.18,adelay=1000:all=1[d1]; \
      sine=frequency=659:duration=0.6,aresample=48000,afade=t=out:st=0.2:d=0.4,volume=0.15,adelay=1450:all=1[d2]; \
      anullsrc=r=48000:cl=stereo,atrim=0:20[bed];[bed][d1][d2][vo]amix=inputs=4:duration=first:normalize=0[aout]" \
      -map "[vout]" -map "[aout]" -t 20 -c:v libx264 -crf 20 -pix_fmt yuv420p \
      -c:a aac -b:a 128k -movflags +faststart gta6-clipper-v1.mp4

No trailer audio is used: the 1-second source loop would make the music stutter.
The only sounds are one understated two-note door chime (synthesized sine,
880 Hz then 659 Hz, at 1.0s) and the voiceover (10.3s).

## TTS

Piper (`pip install --user --break-system-packages piper-tts`), voice
en_US-lessac-medium (downloaded from rhasspy/piper-voices on Hugging Face).
One line, dry and conversational:

    echo "Make money on make.fun by making clips with AI." | \
      python3 -m piper -m piper/en_US-lessac-medium.onnx -f vo_raw.wav

Result: 3.10s, mean volume −16.8 dB, max 0.0 dB — clear, not clipped, not
robotic. Placed at 10.3s so it lands inside the 10–15s pitch window.

## Verification

- ffprobe: 20.000s, 1080×1920, H.264 + AAC, 6,592,542 bytes.
- sha256: ef99863f3baa101fe5817cc66b8f76e6501c2f44e095ea7710b8ed46ce4b4517
- Frames viewed at 0.5s / 4s / 7s / 12s / 17s / 19.5s: captions legible,
  alligator + doorway visible in frame 1, wide reframe shows the whole store,
  CTA above the bottom UI zone, final frame returns to the opening
  composition for the loop.
- Audio checked with silencedetect: chime 1.00–1.88s, voiceover 10.36–13.23s,
  silence elsewhere by design.

## Upload package (for the uploader — NOT uploaded by the agent)

- Title: GTA 6's Most Polite Customer 🐊
- Description: "An alligator walks into a store. Apparently, he just needs
  snacks. Footage: Rockstar Games, GTA VI Trailer 1." / "Competition entry:
  make money on make.fun by making clips with AI. Earnings aren't guaranteed."
  / "Made by my AI agent for a $500 bounty on make.fun, where you can earn
  money making clips with AI: https://make.fun/bounty/gta6-clipper-01" /
  play code: makefun-north-shovel-coconut
- Hashtags: #GTA6 #GTAVI #GrandTheftAutoVI #RockstarGames #GamingShorts #Shorts #makefun
- Thumbnail: the 48.00 frame (alligator crossing the entrance, head + doorway
  readable together).

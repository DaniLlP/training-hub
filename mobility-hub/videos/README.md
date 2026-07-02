# videos/

Exercise demonstrations **stream in-app** through YouTube's official
privacy-enhanced embed player (`youtube-nocookie.com`) — they are **not** re-hosted here,
which respects licensing and keeps the app lightweight.

- The curated `exerciseId → { id, by, t }` map lives in **`js/videos.js`**. Each video ID was
  sourced via a keyless search at build-time and **verified against YouTube's oEmbed** so it
  points at a real, embeddable clip. To change a demo, edit its `id` in that file.
- Users can **attach their own** video to any exercise (paste a YouTube link). The parsed ID
  is stored in `localStorage` and streamed inline; it overrides the curated default and can be
  reset at any time.
- Playback requires a network connection (the rest of the app works offline).

If you later license or record your own clips, drop them here (MP4/WebM) and point the player
in `script.js` (`videoPanel`) at local files or a `<video>` element instead of the YouTube
embed. Clearly label any AI-generated or custom instructional clips so they're distinguishable
from evidence-based source material.

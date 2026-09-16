# Portfolio projects — 16 September 2026

Source: user-shared Google document, "Links to work and thumbnails".

17 project links were extracted from the document. 15 returned public YouTube oEmbed metadata. PEGUSD (`X1XgnavTm7o`) and Khaira Gali (`TlC3EysakOw`) returned HTTP 401 and are held out of the live gallery pending accessible links. The user instructed us to continue with the other projects.

`projects.json` is the gallery data source. Add further verified projects here, including `id`, `title`, `category` and `url`, then supply a matching `public/media/work/VIDEO_ID.webp` file. Original YouTube titles and references are retained for provenance.

## Thumbnail enhancement status

Current website thumbnails are original YouTube thumbnail exports, resized for the cards. They are NOT described as Gemini-enhanced.

Gemini generated the first four-image sheet in the browser conversation `https://gemini.google.com/app/923df977c1e58dcb`. The output has not been downloaded or inspected locally. Download was initially stopped by the project-only filesystem preference; the user subsequently approved temporary Windows Downloads use followed by moving files into this project. Later Gemini browser actions were rejected by automatic approval review because its selected model was at capacity. The user explicitly authorized a retry, which failed for the same reason. No alternate route was used.

`reference-board-1.png` through `reference-board-4.png` preserve input references for future enhancement. `batches.json` maps each quadrant to its project. Save approved outputs as `gemini-board-1.png` etc., inspect identity and geometry fidelity, then run `node scripts/prepare-work-assets.mjs`. The script falls back to original references wherever no enhanced board exists. `thumbnail-provenance.json` records which source is actually used.

## Team portraits

`teamMembers` in `src/WorkGallery.tsx` contains ten empty entries. Set `image`, `name` and `role` for real members when provided. These are intentionally visual placeholders, not public upload controls.

## Gallery controls

Two CSS loops travel in opposite directions with fade edges. Hover pauses a row. Keyboard focus switches to manually scrollable browsing and excludes decorative duplicate cards. The pause button, global motion toggle and reduced-motion setting stop automatic travel. Video embeds load only after opening a project; each modal also offers the original YouTube link.

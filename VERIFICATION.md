# Verification — 13 September 2026

## Wireframe update — 14 September 2026

- Replaced opaque logo surfaces with transparent derivative-antialiased blue grids, luminous cyan contour tubes, volumetric contour layers and side ribs. Original eight shapes and inner cut-out are unchanged.
- TypeScript, ESLint and production build pass. Desktop rendering visually compared with the latest user reference; no shader/application errors observed.
- No image-generation calls or new dependencies. Removed the unused environment-map generation from the hero. Hero chunk is approximately 566 KB / 145 KB compressed; the existing Vite size advisory is still non-fatal.
- Static logo fallback updated to matching wireframe styling.

## Supplied-logo update

- Abstract ribbon replaced by the supplied logo's actual contours: 8 disconnected components and 1 internal hole. Thresholded source/trace silhouette overlap is 99.95%; local rounding removes raster corners in the 3D extrusion.
- TypeScript, lint and the updated production build pass.
- Updated production page returns HTTP 200. Desktop and mobile rendering inspected; no application errors and no horizontal overflow observed. Pointer drag changes the logo's angle while orbit and particle animations continue.
- The WebGL/loading fallback now displays a vector version of the supplied logo.
- The lazy hero bundle is approximately 575 KB / 147 KB compressed; the existing size advisory remains non-fatal.
- No other page sections were redesigned and no image generation was used.

## Passed

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit`.
- ESLint: `node node_modules/eslint/bin/eslint.js src`.
- Production bundle: `node node_modules/vite/bin/vite.js build`.
- Development page HTTP 200 at `http://127.0.0.1:3000/`.
- Production page and an optimized image HTTP 200 at `http://127.0.0.1:3001/`.
- Actual in-app browser rendering: real Three.js sculpture, chrome material, particles and orbital paths rendered successfully.
- Production browser rendered the page without application errors; dragging the sculpture visibly changed its 3D orientation.
- Desktop and mobile visual inspection against the supplied mockup; layout intentionally adapts the reference, with an original abstract hero sculpture.
- Overflow checks at 320, 390, 768 and 1280 px: document width equals available width, no horizontal overflow after fixing intrinsic service-card sizing. Desktop additionally inspected at 1440 px and the app's larger natural viewport.
- Mobile hero, service images and tablet service grid visually inspected. Mobile artwork/CTA overlap was fixed.
- Main navigation and section links; active section rail; top-to-bottom section flow.
- Mobile menu opening; service detail dialogs (including all three Film/TVC/AI offerings); portfolio concept overlay.
- Contact dialog inputs, selected service and field validity using non-sensitive test data.
- Native dialog Escape close and focus returning to its trigger.
- Pause motion toggles its accessible pressed state and presents the Resume motion control.
- All nine inline portfolio/service images reported loaded with nonzero intrinsic width.
- Supplied original SHA-256 remains `77b9caba888c3d888280b9fc5db22c6d6931588c59bc12dbb606b67916bd14f7`.

## Limits and diagnostics

- No application runtime errors were observed. The desktop graphics driver emitted a non-fatal floating-point precision diagnostic while compiling Three.js environment shaders; the scene still rendered normally.
- Vite reports that the separately lazy-loaded Three.js hero chunk is over its generic 500 KB warning threshold (about 543 KB, 136 KB compressed). This is a size advisory, not a failed build. The main bundle is about 123 KB compressed. Fonts and media are local, and the 12 optimized images total about 246 KB.
- Operating-system reduced-motion behavior, WebGL initialization failure and hidden-tab pause paths were implemented and reviewed in code; system settings/GPU availability were not forcibly changed for testing. Manual motion pause was tested in the browser.
- The contact form does not send data. Its download logic was reviewed; browser download was not triggered during testing so no test file would be written outside the requested project folder.
- Concept images originate from the supplied mockup and retain its limited source resolution. They are labelled illustrations, not verified project work. No video was supplied, so there is no fake showreel or video hover playback.
- No external publication was requested or performed. The development and production preview servers remain local.

Wireframe mobile follow-up: 390px viewport renders the reduced-detail 3D wireframe without overflow or application errors. Pause/Resume control successfully toggles its accessible state. Final preview returned to normal viewport with motion enabled.


## Edge refinement — 14 September 2026
- Raster outline resampled uniformly, smoothed within a source-pixel radius and reconstructed with continuous cubic curves. All eight components and the inner hole remain intact.
- Automated geometry comparison: maximum boundary deviation 0.479 source pixels; area change 0.116%. Results in assets/logo-smoothing-check.json.
- More rounded contour tubes, denser curve sampling and antialiasing on mobile/desktop. Matching SVG fallback uses the same curves.
- TypeScript, ESLint and production build pass; live preview shows smooth curves with no runtime errors.


## Service artwork and process alignment — 14 September 2026
- Replaced all six service artworks and their shared concept/detail images with original 1536×1024 AI-generated imagery. PNG masters and exact prompts are in assets/generated; 18 responsive WebP exports are in public/media.
- The connector now passes through all four icon centres; a persistent subtle track remains visible while the brighter stroke animates. Fixed numeral widths and a shared responsive grid gap keep the anchors aligned.
- Desktop 1440px: measured zero horizontal/vertical offset at all four icon centres. Mobile 390px: no horizontal overflow, two-column process layout with connector hidden, service dialog opens correctly. All six desktop service images loaded and browser error log was empty.
- TypeScript, ESLint and final production build passed. Existing nonfatal hero bundle size advisory remains.

## Our Work and Our Team — 16 September 2026
Replaced concept cards with 15 verified YouTube projects from the supplied document. Added two opposite-direction seamless carousel rows, edge fades, hover pause, manual browsing, global/reduced-motion support and click-to-open video dialogs with direct YouTube links. Added 10 empty team portrait slots immediately below the gallery and updated navigation.

PEGUSD and Khaira Gali links returned public oEmbed HTTP 401; user agreed to continue with other projects. Original YouTube thumbnails are currently used. Gemini produced the first reference-board enhancement but automatic approval review capacity failures prevented downloads and further generation, even after the user approved a retry. Thumbnail enhancements remain pending; see assets/work/README.md.

TypeScript, ESLint and production build passed. Server-rendered assertions verified 15 unique video mappings, all local thumbnails, 15 non-tabbable duplicate cards, motion states and 10 placeholders. Visual browser QA could not run because the same approval-review capacity error blocked browser actions. Existing hero bundle size advisory remains.

## Brand / team / clients preview checks (16 September 2026)
- Five loaded team portraits, numeric order and 4:5 displayed dimensions confirmed.
- Eight client images loaded; image bounds fit cards. Transparent alpha present in PNGs.
- 390px mobile check: no horizontal page overflow, two columns with fifth portrait centered.
- Header supplied logo and favicon paths updated; original header image preserved byte-for-byte.
- Client pause/resume interaction works; work tracks move in opposite directions with no container mask.
- TypeScript, ESLint, Vite build pass. Existing large hero bundle advisory remains.
- No publication: awaiting user review of local preview.
- Final browser check found native lazy loading left some transformed carousel images unloaded. Both work and client carousel images now load eagerly (duplicates share cached URLs), preventing blank cards as they scroll into view. Team portraits remain lazy loaded.

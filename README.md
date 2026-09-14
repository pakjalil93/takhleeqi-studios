# Takhleeqi Studios

Local interactive one-page website. All source, optimized images, local fonts, dependency store, build output and project notes are contained in `F:\ASTRA_WEBISTE_DEV`. The original `MOCKUP` has not been changed.

## Run locally

Requires Node.js 22.12+ (verified using the already-installed Node 24 runtime). Dependencies are already installed.

```powershell
cd F:\ASTRA_WEBISTE_DEV
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3000 --strictPort
```

Development: `http://127.0.0.1:3000/`

Build and serve the production output:

```powershell
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 3001 --strictPort
```

Production preview: `http://127.0.0.1:3001/`

The standard package scripts also work with an installed npm/pnpm: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`, `npm run typecheck`. `npm start` serves production on port 3000; stop the development server first. These are local preview servers, not public deployment configurations.

For dependency reinstall, use `pnpm install --frozen-lockfile --store-dir F:/ASTRA_WEBISTE_DEV/.cache/pnpm-store`. Project-local cache configuration is in `pnpm-workspace.yaml` (pnpm 11) and `.npmrc`. The package manager executable bundled with this machine is at `C:\Users\abdul\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs` and can be invoked with `node` when pnpm is not on PATH. The runtime is preinstalled; it is not website project data.

## Experience

- Transparent electric-blue wireframe of the supplied Takhleeqi logo: fine surface grids, layered depth contours, luminous cyan edges and a subtle scanning light. Orbiting particles, connecting lines, travelling light pulses, mouse drag and scroll-linked depth/speed remain active.
- Six visual service cards containing all nine capabilities, with accessible detail dialogs.
- Three clearly labelled illustrative concept studies and project overlays.
- Scroll-controlled media masks, staggered upward reveals, kinetic text, active section rail and animated process path.
- Studio positioning, four-stage process, light architectural CTA and complete footer.
- Responsive navigation, native modal focus trapping and Escape handling, focus restoration, reduced-motion support, visible focus states and a pause control.
- The 3D module loads separately; mobile uses fewer particles and lower pixel density. Rendering pauses off-screen and in hidden tabs. A geometric fallback remains available when WebGL cannot initialize.

## Content and assets

Edit service descriptions, grouped capabilities and concepts in `src/content.ts`; page structure and project-brief behavior are in `src/App.tsx`. Design tokens and responsive styling are in `src/styles.css`; particle motion is in `src/HeroScene.tsx`, and the logo geometry/material is in `src/LogoSculpture.ts`.

The active service and concept artwork now uses six original 1536×1024 AI-generated images, created with the built-in image generator on 14 September 2026. Originals and the complete prompt set are in `assets/generated/`. Run `node scripts/prepare-generated-assets.mjs` to rebuild the 480/960/1536 pixel WebP variants. `MEDIA_INVENTORY.json` records source hashes, dimensions, outputs and provenance. Earlier mockup crops are preserved as historical assets; `scripts/prepare-assets.mjs` is the legacy extraction script and is not part of the current build. Fonts are served locally and interface icons use Lucide. No original reference files were modified.

## Business details still needed

No verified projects, showreel, clients, metrics, testimonial, contact address or social URLs were supplied. Reference artwork is explicitly labelled concept material and never presented as a completed client commission. The hero now uses the supplied brand logo, replacing the initial abstract sculpture at the user's request. The showreel button is replaced by the working Explore Capabilities action. Client logos, statistics and testimonial claims in the mockup were omitted.

The supplied logo is preserved in `assets/source/takhleeqi-logo-original.png`. `node scripts/trace-logo.mjs` reproduces the traced contours and SVG fallback. `assets/logo-provenance.json` records its source hash, eight components, one internal cut-out and silhouette check. Its holographic treatment uses native Three.js geometry, without image-generation credits or new dependencies. The header monogram remains unchanged.

The 14 September wireframe treatment follows `assets/source/wireframe-style-reference.png`. The reference is preserved as source material; the website renders actual interactive geometry. `node scripts/wireframe-fallback.mjs` regenerates the matching static SVG fallback. Mobile reduces contour layers and glow geometry. The previous environment-map lighting setup was removed because this luminous wireframe does not need it.

The contact dialog prepares a locally downloaded text brief. It does not transmit data or claim that a message was sent. There is no contact backend and no browser storage. Download location is chosen by the visitor's browser. Connect verified contact information before using this as a public business enquiry channel.

## Verification

See `VERIFICATION.md` for executed checks and precise limits. `PROGRESS.md` records the final checkpoint for future continuation.

Animation lifecycle follows the official [GSAP matchMedia cleanup guidance](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/). The website itself makes no third-party network requests after installation.

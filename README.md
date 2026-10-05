# Ixaria website

Astro and TypeScript website for `https://ixaria.eu`. Pages are generated as static HTML with small JavaScript modules for interactive features.

## Develop and verify

Use Node.js 22.12 or later (an even-numbered supported release) and npm.

```sh
npm ci
npm run dev
```

The development server runs at `http://127.0.0.1:4321`.

```sh
npm run check       # Astro and TypeScript diagnostics
npm run build       # Typecheck and generate dist/
npm run preview     # Serve the production build
npm test            # Build and run 19 content/SEO migration checks
npx playwright install chromium
npm run test:browser # Browser checks against the production build
```

If Chrome is already installed, browser tests can use it instead of downloading Chromium. In PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:browser
```

`test:browser` uses an existing preview on port 4321 or starts one automatically. Run `npm run build` first after changing source files. External services are mocked in the browser suite; it does not submit real newsletter registrations.

## Where to edit

| Location | Purpose |
| --- | --- |
| `src/pages/` | Routes; compose layouts and sections |
| `src/layouts/` | Document shell, marketing and legal layouts |
| `src/components/shared/` | Header, footer, SEO head and vendor scripts |
| `src/components/ui/` | Reusable buttons, card grids, founders, values and FAQ list |
| `src/components/sections/` | Homepage sections and their page-specific copy |
| `src/data/site.ts` | Company details, navigation and social links |
| `src/data/home.ts` | Features, setup steps, founders and values |
| `src/data/faqs.ts` | FAQ copy; also generates FAQ structured data |
| `src/data/integrations.ts` | Existing GA4 ID, consent script and Brevo form endpoint |
| `src/content/legal/` | Legal copy and displayed update labels |
| `src/content/careers/` | Career page content |
| `src/content.config.ts` | Validated content collection schemas |
| `src/seo/pages.ts` | Per-page titles, descriptions, robots and social metadata |
| `src/seo/home-entities.json` | Homepage structured entities with stable IDs |
| `src/seo/structured-data.ts` | Organization, setup and FAQ schema assembly |
| `src/seo/sitemap-images.ts` | Sitemap image descriptions and URLs |
| `src/styles/` | Shared design tokens and separate page styles |
| `src/features/` | Navigation, animations, slideshow, newsletter, analytics and demo chat |
| `public/` | Files copied to the same public paths during build |
| `tests/` | Original migration contracts and production browser checks |

Long-form collections retain HTML where the original page needs custom styling. Keep HTML block tags left aligned in Markdown: indentation of four spaces turns HTML into displayed code. Collection metadata is validated at build time.

`docs/reference-faqs.md` is the original, unpublished FAQ draft. The live website uses `src/data/faqs.ts`; this reference document is not rendered or imported.

## Add a page

1. Create a route in `src/pages/`. An `about.astro` file builds to `/about.html`; the existing homepage stays at `/` with `/index.html` as an alias.
2. Add its metadata to `src/seo/pages.ts`, including its exact canonical `path` and deliberate `robots` setting.
3. Use `MarketingLayout` or `LegalLayout`; compose reusable components and pass content through properties or slots.
4. Add repeated or editorial content to a typed data file or a collection. Keep reusable behavior in `src/features/` and styling in the relevant component or page stylesheet.
5. Update navigation in `src/data/site.ts` where appropriate. Use root-relative internal links and asset paths.
6. Run the build and tests. Review new canonical paths and sitemap entries before publishing.

`src/pages/sitemap.xml.ts` generates the sitemap from the SEO registry and excludes pages containing `noindex`. Every new indexable page must have an entry in that registry. Use the same data for visible copy and related structured data to avoid drift.

Existing URLs and public image/font/video paths are preserved. Changing an established URL later requires a permanent redirect from the hosting provider; Astro's static output alone cannot send an HTTP 301 response.

## Integrations

The original GA4 ID and click/form event names are retained, with GA4 enabled on the homepage as before. The existing Secure Privacy script remains on every page. Consent configuration is managed by that vendor account.

The newsletter keeps the existing Brevo form action and fields. Its cross-origin opaque response confirms that the request was sent, so the UI asks visitors to check their inbox instead of claiming a verified subscription. Live vendor delivery must be checked separately with an authorized real subscription.

The original chat has demo responses and no visible launcher. Its dialog and styles are preserved on the homepage, and its behavior loads only when an `ixaria:open-chat` document event is dispatched. A future real assistant should call a server endpoint; never place provider credentials in browser code.

## Hosting

**Publish `dist/`, the generated website. The repository root now contains Astro source rather than deployable HTML.**

The build includes `CNAME` for `ixaria.eu`, `.nojekyll`, `robots.txt`, `sitemap.xml`, the existing `.html` routes and all original public assets. A static host can use `npm ci && npm run build` with `dist` as its publish directory. Host the custom domain at `/`, with the configured canonical origin `https://ixaria.eu`.

A manually triggered GitHub Pages workflow is provided in `.github/workflows/deploy-pages.yml`. If this repository is served by GitHub Pages:

1. Set repository **Settings → Pages → Source** to **GitHub Actions**.
2. Keep the existing custom domain configured as `ixaria.eu`.
3. Run **Deploy Astro to GitHub Pages** from the Actions tab on the intended branch.

The workflow runs the build and static migration tests before uploading the generated site. It does not publish automatically on push. This follows the [official Astro GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).

## Migration checks

The fixtures capture the pre-migration content, heading hierarchy and SEO values. They detect missing copy, changed existing metadata, broken local links/assets/anchors, changed schema entity IDs, and inconsistent shared headers/footers. Intentional future copy changes should update the affected baseline contract together with the implementation.

Browser checks cover every original route, desktop rendering, mobile menu navigation, images, errors, FAQ behavior, slideshow timing/reduced motion, analytics events, mocked newsletter success/failure, safe demo chat rendering, and reading/navigation with JavaScript disabled.

SEO corrections made during migration: canonical added to the career page; indexable career page added to the sitemap; legal pages remain `noindex` and are excluded; sitemap image paths changed to the existing WebP files. The missing career-page founder portrait now points to the existing `eduard-badea.webp` asset.

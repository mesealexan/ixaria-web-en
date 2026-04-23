# SEO Audit

## Scope
This audit is based on a source review of the static site files in this repo:

- `index.html`
- `non-eu-imports.html`
- `heavy-eu-regulations.html`
- `large-retailers.html`
- `terms-and-conditions.html`
- `cookie-policy.html`
- `gdpr.html`

It covers on-page SEO, crawlability, internal linking, metadata, and likely performance-related SEO risks visible in source. It does not include Google Search Console data, backlink analysis, live Lighthouse scores, or server/header checks.

## Executive Summary
The site has a strong positioning angle, but the current implementation is missing several baseline SEO signals that search engines rely on to understand, index, and present pages well in search results.

The biggest issues are:

1. Most pages reuse the same generic title and have no meta descriptions.
2. There are no canonical tags, social sharing tags, or structured data.
3. There is no `robots.txt` or sitemap.
4. `large-retailers.html` is effectively an empty page and is not internally linked.
5. Internal linking between commercial and editorial pages is very thin.
6. Images and frontend assets are not optimized in ways that support Core Web Vitals.

## Findings

### Critical

#### 1. Duplicate and weak title tags across most pages
Severity: Critical

Evidence:

- `index.html`: `Ixaria | Conversion Systems for Furniture`
- `non-eu-imports.html`: `Ixaria | Conversion Systems for Furniture`
- `large-retailers.html`: `Ixaria | Conversion Systems for Furniture`
- `terms-and-conditions.html`: `Ixaria | Conversion Systems for Furniture`
- `cookie-policy.html`: `Ixaria | Conversion Systems for Furniture`
- `gdpr.html`: `Ixaria | Conversion Systems for Furniture`

Why it matters:

- Titles are one of the strongest on-page relevance signals.
- Duplicate titles make it harder for Google to distinguish page purpose.
- Legal pages and editorial pages are currently sending almost identical signals.
- CTR will suffer because search snippets will look generic.

Recommendation:

- Give every indexable page a unique title aligned with its topic and intent.
- Keep titles concise and keyword-led.

Suggested direction:

- `index.html`: `Ixaria | eCommerce Conversion Systems for European Furniture Manufacturers`
- `non-eu-imports.html`: `Non-EU Furniture Imports Are Squeezing EU Manufacturers | Ixaria`
- `heavy-eu-regulations.html`: refine further to target regulation/compliance intent
- Legal pages: use exact document names plus brand, or consider `noindex` if they are not meant to attract search traffic

#### 2. No meta descriptions on any page
Severity: Critical

Evidence:

- No `meta name="description"` found in any reviewed HTML page.

Why it matters:

- Google may generate inconsistent snippets.
- Missing descriptions reduce control over SERP messaging and click-through rate.
- This is especially costly on a small site where every indexed page matters.

Recommendation:

- Add a unique meta description to every indexable page.
- Keep each around 140-160 characters and focused on value plus topic.

#### 3. No canonical tags on any page
Severity: Critical

Evidence:

- No `link rel="canonical"` found in any reviewed HTML page.

Why it matters:

- Canonicals help consolidate signals and reduce ambiguity.
- They are especially important once pages are shared, mirrored, parameterized, or accessible at multiple URLs.
- Without them, duplicate or near-duplicate interpretation risk increases.

Recommendation:

- Add a self-referencing canonical tag to every primary page.

#### 4. No XML sitemap and no `robots.txt`
Severity: Critical

Evidence:

- No `sitemap*` files found in the repo.
- No `robots.txt` found in the repo.

Why it matters:

- Search engines have no crawl hints about site structure.
- New pages may be discovered more slowly.
- There is no declared sitemap location or crawl guidance.

Recommendation:

- Add `robots.txt`
- Add `sitemap.xml`
- Submit the sitemap in Google Search Console and Bing Webmaster Tools

#### 5. `large-retailers.html` is effectively empty and not a viable landing page
Severity: Critical

Evidence:

- The file contains navigation and footer markup, but no `main`, `article`, `section`, `h1`, or body content.
- It currently functions like a shell page rather than a searchable document.

Why it matters:

- Thin pages can be ignored, devalued, or seen as low quality.
- If indexed, this page is unlikely to rank for anything meaningful.
- If linked publicly later, it weakens perceived site quality.

Recommendation:

- Either build the page out fully with original content and metadata, or remove it from the index until it is ready.

### High

#### 6. The `large-retailers` topic is orphaned from the main conversion path
Severity: High

Evidence:

- `index.html` shows a "Low Margins" teaser, but it has no link to `large-retailers.html`.
- Search across the HTML files did not find any internal links pointing to `large-retailers.html`.

Why it matters:

- Orphan or near-orphan pages are harder for crawlers to discover and harder for authority to reach.
- The homepage currently signals that this is a key topic, but the site architecture does not support it.

Recommendation:

- Add a prominent internal link from the homepage teaser to the full page.
- Add links from related articles and any future pillar pages.

#### 7. Internal linking is too thin for a topical authority strategy
Severity: High

Evidence:

- The homepage links to only two article pages: `non-eu-imports.html` and `heavy-eu-regulations.html`.
- The footer mainly links to legal pages.
- The content pages do not appear to cross-link to each other contextually.

Why it matters:

- Search engines use internal links to understand topic clusters and page importance.
- Thin linking makes it harder to build a clear content hub around furniture manufacturing, compliance, imports, and margin pressure.
- Users have fewer pathways deeper into the site, which can reduce engagement signals.

Recommendation:

- Treat `index.html` as the hub page.
- Add contextual internal links between the problem pages and the service narrative.
- Build a clear cluster around:
  - non-EU imports
  - EU regulation/compliance
  - retailer margin pressure
  - Ixaria's solution

#### 8. No structured data anywhere on the site
Severity: High

Evidence:

- No `application/ld+json` blocks found in the reviewed HTML files.

Why it matters:

- Structured data helps search engines interpret organization identity, page types, articles, and breadcrumbs.
- It can improve eligibility for richer search result features.

Recommendation:

- Add at least:
  - `Organization` on the homepage
  - `WebSite` on the homepage
  - `Article` on article-style pages
  - `BreadcrumbList` on deeper pages if breadcrumbs are added

#### 9. No Open Graph or Twitter card metadata
Severity: High

Evidence:

- No `og:*` or `twitter:*` meta tags found in the reviewed HTML files.

Why it matters:

- Shared links will render poorly on social and messaging platforms.
- Poor preview quality reduces click-through and link attractiveness, which can indirectly reduce reach and earned links.

Recommendation:

- Add page-specific Open Graph and Twitter metadata, including title, description, URL, and image.

### Medium

#### 10. Homepage images use `data-alt` instead of real `alt` attributes
Severity: Medium

Evidence:

- In `index.html`, the hero image and team image use `data-alt`, not `alt`.

Why it matters:

- Search engines and assistive technologies rely on `alt`, not `data-alt`.
- This weakens image accessibility and removes useful descriptive context.

Recommendation:

- Replace `data-alt` with proper `alt` text.
- Use empty `alt=""` only for purely decorative images.

#### 11. Images do not declare dimensions or loading hints
Severity: Medium

Evidence:

- No image `width`, `height`, `loading`, `decoding`, or `fetchpriority` attributes were found.

Why it matters:

- Missing dimensions can contribute to layout shift.
- Missing lazy-loading on non-critical images can slow rendering.
- Weak Core Web Vitals can limit SEO performance.

Recommendation:

- Add `width` and `height` to all content images.
- Use `loading="lazy"` and `decoding="async"` on non-critical images.
- Consider `fetchpriority="high"` for the hero image if it is the LCP element.

#### 12. Frontend asset loading is likely hurting Core Web Vitals
Severity: Medium

Evidence:

- Every page loads Tailwind from `https://cdn.tailwindcss.com` in the document head.
- Every page loads Google Fonts from the network.
- The Material Symbols stylesheet is included twice on each page.
- Many pages also load Sendinblue styles and scripts.

Why it matters:

- Render-blocking and repeated third-party assets can slow first paint and LCP.
- Duplicate requests are wasted bytes.
- SEO performance is increasingly tied to page experience and Core Web Vitals.

Recommendation:

- Replace CDN Tailwind runtime usage with a compiled local CSS build.
- Remove the duplicated Material Symbols include.
- Audit whether the Sendinblue embed needs to load on every page.
- Preload only the truly critical assets.

#### 13. Legal pages are indexable but currently optimized like homepage duplicates
Severity: Medium

Evidence:

- `terms-and-conditions.html`, `cookie-policy.html`, and `gdpr.html` all use the same generic title as the homepage.
- They also lack meta descriptions and canonicals.

Why it matters:

- If these pages remain indexable, they need correct metadata.
- Otherwise they may absorb crawl attention without contributing meaningful acquisition value.

Recommendation:

- Choose one of two approaches:
  1. Keep them indexable and give them unique legal-document metadata.
  2. Mark them `noindex,follow` if they are purely compliance/support pages and not part of the acquisition strategy.

### Low

#### 14. Footer email form may not provide a strong crawl or UX signal
Severity: Low

Evidence:

- A visible footer form appears across pages, but the simple footer form has no obvious action, label, or explanatory copy beyond the placeholder.
- Separate embedded subscription forms also exist on several pages.

Why it matters:

- This is more conversion/UX than direct SEO, but weak UX can reduce engagement quality.
- Multiple competing newsletter mechanisms can create confusion.

Recommendation:

- Standardize on one working subscription pattern.
- Add a proper label and clear post-submit behavior.

## Page-Level Notes

### `index.html`

- Strong core positioning and a clear `h1`.
- Missing description, canonical, structured data, OG/Twitter tags.
- Homepage images need real `alt` attributes and performance attributes.
- The "Low Margins" / large retailers problem block should link to its full page.

### `non-eu-imports.html`

- Has a strong `h1` and detailed content.
- Still uses the generic homepage title.
- Missing description, canonical, structured data, OG/Twitter tags.
- Could benefit from contextual links back to related pages and the core solution page.

### `heavy-eu-regulations.html`

- Better title than the other articles, but it still lacks description, canonical, structured data, and social tags.
- Content is detailed enough to be a solid article landing page if metadata and internal links are improved.

### `large-retailers.html`

- Not SEO-ready.
- Needs real content, metadata, internal links, and a clear page purpose before indexation.

### `terms-and-conditions.html`, `cookie-policy.html`, `gdpr.html`

- Structurally valid, but not properly differentiated for search.
- Need either unique metadata or `noindex,follow`.

## Prioritized Fix Plan

### Phase 1: Immediate

1. Write unique titles and meta descriptions for every page.
2. Add self-referencing canonicals.
3. Add `robots.txt` and `sitemap.xml`.
4. Decide whether legal pages should be indexed.
5. Remove or complete `large-retailers.html`.

### Phase 2: High Value

1. Add structured data.
2. Add Open Graph and Twitter metadata.
3. Improve internal links between homepage, articles, and service sections.
4. Link the homepage "Low Margins" block to the retailer page.

### Phase 3: Performance SEO

1. Replace CDN Tailwind with a production CSS build.
2. Deduplicate font includes.
3. Add image `alt`, dimensions, and loading hints.
4. Review third-party embeds for necessity and load timing.

## Suggested KPIs After Fixes

- Indexed pages count in Search Console
- Impressions and CTR by landing page
- Average position for target furniture-manufacturer queries
- Core Web Vitals pass rate
- Crawl stats and sitemap coverage
- Landing-page conversion rate from organic traffic


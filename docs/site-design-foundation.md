# Ixaria — Site Design Foundation

Version: 1.0 · 13 November 2026  
Status: Implemented locally following approval. Publication remains separate.  
Scope: The entire Ixaria website, including shared navigation, marketing pages, service pages, customer stories, careers, and legal pages.

## 1. Purpose and governing decisions

Create a visually coherent website that combines expressive furniture imagery with precise explanations of Ixaria's product. The intended impression is confident, tactile, technically capable, and unmistakably connected to furniture.

The visual signature is a realistic furniture object or material, photographed or rendered with care, paired with large navy typography and a clearly composed software example. Electric blue connects the physical product to the brand; cyan and orange provide controlled emphasis.

This document is the design authority for the site. The approved direction has been implemented locally. Numeric design values are Ixaria recommendations, not measurements copied from reference websites.

### Non-negotiable constraints

1. Preserve all existing website text verbatim, including headings, paragraphs, button labels, prices, terms, qualifiers, FAQs, newsletter messages, captions, careers content, and legal content.
2. Preserve the brand colors, existing logo artwork, company details, customer identities, and genuine evidence.
3. Prefer existing images and original image layers from the supplied sales deck. Generate an image only when a specific visual need cannot be met well with those resources.
4. Preserve existing routes, anchor IDs, integrations, consent behavior, booking destinations, and functional capabilities. Visual redesign does not authorize changing commercial terms or product behavior.
5. Apply one shared system across the website. Page type changes the composition and density, not the underlying brand.
6. The original specification task did not authorize implementation. The subsequent instruction to implement authorized local website changes; it did not authorize publication or changes to the sales deck. The implementation reuses existing artwork without generating new imagery.

The request to preserve text supersedes the earlier audit's proposed headline rewrites, shorter method descriptions, and typo corrections. Those suggestions are not part of the authorized redesign. Solve fit through layout and hierarchy; flag copy concerns separately without silently correcting them.

### Order of authority

When decisions conflict, use this order: explicit user constraints → current website content and functional contracts → this specification → sales deck visual references → external inspiration.

The sales deck is the primary source of art direction. Current website source is the authority for website wording and terms. A different term, metric, or label in the deck must not overwrite the website automatically.

## 2. Evidence and reference direction

### Primary visual reference: the supplied sales deck

[Ixaria Sales Deck 1.01](https://docs.google.com/presentation/d/1vyffTKuJfYkc8qyNp10LtnRrD83QrLCOntquRlyaYVw/edit) contains 20 slides, all visually reviewed during the design discussion.

| Slides | Observed visual language | Website application |
| --- | --- | --- |
| 1 | Sculptural blue sofa, navy environment, architectural arch, directional warm light, small orange accent | Principal hero art direction; a complete furniture scene with an intentional text-safe region |
| 2, 18, 20 | Large isolated blue sofa on white or light gray; restrained supporting text | Service-page heroes and closing sections; generous product scale |
| 3 | A human furniture consultation with the photograph fading into white | Occasional human context and editorial storytelling |
| 5, 15, 19 | Close views of blue upholstery, material texture, strong crops | Section transitions, supporting visual emphasis, and a repeated brand motif |
| 6 | Dimensional visual metaphors: conversion funnel, cutaway chair, telephone and envelope | Benefits illustrated with physical objects, when a metaphor improves comprehension |
| 7, 9–11, 14 | Specific mobile product-page examples; product images and visible adaptation | Demonstrations and explanations grounded in recognizable buying interfaces |
| 8 | Signals, Correlations, Responses shown as a sequence with furniture and interface detail | Shared method component with immediately visible explanations |
| 12 | Blue sofa inside a realistic glass enclosure | Reference for physical metaphors and lighting; use only in a semantically appropriate context |
| 13 | Navy evidence panel, large cyan result, a simple comparison chart | Customer-story results and evidence presentation |
| 16–17 | Spacious service comparison and an oversized numerical emphasis | Offer presentation with all existing price and timing qualifications intact |

The recurring blue furniture and upholstery texture are particularly useful brand devices. Repeat this family intentionally across pages instead of introducing a new visual style for every section.

### External references and how to combine them

The following public pages were revisited on 13 November 2026. The earlier homepage inspection could not obtain a browser render; this reference review uses accessible public-page content and the prior design assessment. It is not a pixel-level reproduction or a verification of every reference site's current animation. These sources inform principles; the design decisions below are original to Ixaria.

| Reference | Specific lesson | Ixaria interpretation |
| --- | --- | --- |
| [Linear](https://linear.app/) | Product examples organized around a consistent narrative | Strong hierarchy, stable framing, and a product explanation that carries the page |
| [Attio](https://attio.com/) | Concrete workflows and product scenarios | Show one shopper context becoming one useful response; make the mechanism tangible |
| [Stripe](https://stripe.com/en-de) | Capabilities supported by customer examples and commercial evidence | Clear division between explanation, proof, and the next action |
| [Tylko](https://tylko.com/) | Furniture, customization, and product imagery as the main story | Large physical products, visible materials, carefully composed furniture scenes |
| [Nosto](https://www.nosto.com/) | Personalization described alongside outcomes, case studies, and integration context | A category benchmark for explanation and reassurance; retain Ixaria's own wording |

Use Linear's compositional discipline, Attio's explanatory specificity, Stripe's evidence hierarchy, and Tylko's furniture emphasis inside the visual world of the sales deck. Nosto informs category comprehension. Do not combine five unrelated site styles or import their colors, copy, illustrations, or branded assets.

## 3. Content preservation and scope boundaries

### Content sources to preserve

| Content | Current source locations |
| --- | --- |
| Homepage structure and section copy | `src/pages/index.astro`, `src/components/sections/` |
| Navigation, footer, company details, destinations | `src/data/site.ts`, `src/components/shared/` |
| Features and founders | `src/data/home.ts` |
| Audit | `src/data/audit.ts`, `src/components/audit/AuditPage.astro` |
| Pilot | `src/data/pilot.ts`, `src/components/pilot/PilotPage.astro` |
| Full Implementation | `src/data/full-implementation.ts`, `src/components/sections/ImplementationPage.astro` |
| Shared implementation-stage summaries | `src/data/implementation.ts` |
| Shopper questions and demonstration scenarios | `src/data/shopperQuestions.ts`, `src/data/solutionScenarios.ts`, relevant section components |
| FAQs | `src/data/faqs.ts` |
| Agache story, figures, captions, evidence notes | `src/data/customer-stories/agache.ts`, `src/pages/customer-stories/agache.astro` |
| Careers | `src/content/careers/cofounder.md` |
| Legal | `src/content/legal/`, relevant page metadata and layouts |

Preserve the complete text set and its contextual relationships, not merely the word count. A price remains attached to its billing period; a result remains attached to its period and metric; an illustration note remains attached to its illustration.

Reflow, regroup, reorder, and restyle content where this specification calls for it. Do not shorten, paraphrase, truncate, line-clamp, or remove text to achieve a composition. Do not hide previously visible narrative copy in new accordions solely to shorten the page. Existing interactive collections must keep every entry available.

Do not substitute a full-slide screenshot for a website section. Native website text must remain selectable, accessible HTML. Text embedded in a genuine product screenshot remains part of that screenshot and does not replace the surrounding explanation.

### Preserve deliberate visibility states

The homepage's older before/after section is currently hidden. The Agache page also has before/after sections behind `showBeforeAfter = false`. Leave these states intact until separately authorized. Do not expose dormant chat UI, unpublished examples, or an unapproved testimonial because a new layout has room for them.

The Agache testimonial currently includes an approval placeholder. Preserve its wording and placeholder status; do not render it as an approved customer endorsement. Keep the current indexing directives, including the story's `noindex` settings.

### Copy issues remain separate

The current wording includes items previously flagged in the audit, such as “Find out what why your visitors don't buy?” Preserve them under the current instruction. The local problem statistic is currently `8/10`; a previously fetched public page used `9/10`. Use the local source in the redesign, without choosing or inventing a replacement figure. Any correction requires a separate editorial decision.

## 4. Brand color system

Keep the existing values exactly. Improve roles, proportions, and foreground/background pairings.

| Token | Value | Role |
| --- | --- | --- |
| `brand.navy` | `#090959` | Main headings, primary dark surface, anchors of the composition |
| `brand.blue` | `#0000FF` | Product interactions, selected states, links on light surfaces, selective emphasis |
| `brand.cyan` | `#00CCFF` | Highlights and important results on navy; small graphical accents |
| `brand.orange` | `#FF5F0A` | Primary booking actions and small physical-object accents |
| `brand.yellow` | `#FFDA00` | Rare small highlights; retain in the logo |
| `text.strong` | `#111111` | Dense reading text or interface content when appropriate |
| `surface.white` | `#FFFFFF` | Default content surface |
| `surface.soft` | `#F5F6FA` | Supporting sections, media stages, and quiet grouping |
| `border.subtle` | `#E8E9F0` | Decorative separators and nonessential card boundaries |
| `text.muted` | `#555570` | Supporting copy on light surfaces |

Photographic material colors are welcome: cream fabric, wood, stone, green plants, and skin tones do not become additional UI accent colors. Existing customer screenshots keep the customer's colors. This does not authorize recoloring evidence or client logos.

### Surface composition

Use light surfaces as the default reading environment. Navy provides an opening statement, an evidence moment, or a deliberate chapter transition. A dark hero and a dark results panel can coexist with long light sections between them.

Avoid alternating dark and white mechanically after every section. Group related content on a continuous surface, using spacing and typography to show structure. Bright blue, cyan, orange, and yellow should not all occupy large areas in the same viewport. As a visual target, neutral surfaces dominate; navy establishes depth; saturated accents remain concentrated.

### Contrast and focus

Approved visual update: all orange buttons use white text. Calculated from the existing solid brand colors, white on orange is approximately 3.05:1, below the normal-text target stated below. White on cyan is approximately 1.90:1; retain navy text on cyan (approximately 9.27:1). White on electric blue is approximately 8.59:1.

Use at least 4.5:1 for normal text and 3:1 for qualifying large text. Validate actual composited backgrounds, not just token values. Faint existing borders can remain decorative; essential controls need independently sufficient boundaries or other visible identification. Reference: [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Use electric-blue focus outlines on white and soft surfaces; white or cyan outlines on navy. Check contrast against adjacent colors and use a contrasting offset or two-color ring where needed. Never use cyan alone as the focus outline on white.

## 5. Typography

### Family decision

Use the existing locally hosted **Inter** as the primary website family for headings, body copy, labels, controls, and numbers. This follows the sales deck's typography and creates a clearer shared language across the site.

Use weights already available in `src/styles/inter.css`: 400, 500, 600, 700, and 800. Main headings generally use 700; a short focal statement may use 800. Body copy uses 400, controls 600, and labels 600–700.

The logo remains the existing artwork. Retain Gilroy asset files, but do not use Gilroy as a competing second narrative-heading system in the new design. Do not introduce another display or body family.

### Type scale

Values below are starting targets in CSS pixels at default zoom. Use rem-based implementation and interpolate between viewport anchors rather than forcing abrupt jumps.

| Role | Mobile <640px | Tablet 640–1023px | Desktop ≥1024px | Line height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Marketing H1 | 36 | 48 | 64; maximum 72 for short statements | 1.08–1.12 | -0.03em |
| Service/story H1 | 36 | 44 | 56 | 1.10–1.15 | -0.025em |
| Main H2 | 30 | 36 | 44 | 1.15–1.20 | -0.025em |
| H3 | 22 | 24 | 28 | 1.22–1.30 | -0.015em |
| H4 / card heading | 18 | 20 | 20 | 1.30 | -0.01em |
| Hero supporting copy | 18 | 19 | 20 | 1.55–1.65 | normal |
| Main body | 16 | 17 | 18 | 1.65–1.75 | normal |
| Supporting body | 16 | 16 | 16 | 1.60–1.70 | normal |
| Navigation / buttons | 15–16 | 15–16 | 15–16 | 1.30–1.40 | normal |
| Eyebrow / small label | 13 | 13 | 13 | 1.40 | up to 0.08em if uppercase |
| Caption / qualification | 14 | 14 | 14 | 1.50–1.60 | normal |
| Featured result | 56 | 72 | 88–104 | 1.00–1.05 | -0.04em |

At very narrow widths, long existing headings may need a local reduction toward 32px. This is an exception after adjusting width and composition; never reduce main body text below 16px to make content fit.

### Hierarchy and text composition

- One H1 per page. Use H2 for real sections and H3 for their subsections; visual size does not replace semantic hierarchy.
- Keep typical paragraph measure within 55–70 characters. Legal and careers content should target about 65 characters per line.
- Hero copy usually occupies 440–540px on desktop. Existing long headings can use four or five lines and a taller section; do not rewrite or clip them.
- Left-align narrative headings, paragraphs, and captions. Reserve centered treatment for concise stage introductions or a final existing call to action.
- Use one continuous phrase for colored emphasis, preferably an existing emphasized span. Avoid coloring isolated words across every heading.
- Preserve existing bold and italic meaning; do not introduce decorative italics as a second voice.
- Keep paragraphs 16–24px apart. Do not put hard line breaks in body copy solely to match a desktop screenshot.
- Use tabular figures in comparison tables and aligned financial figures; preserve existing formatting and values.
- Prices, monthly terms, revenue shares, periods, and disclaimers remain readable at the same time. Never isolate an attractive number from its qualification.

## 6. Layout, spacing, and responsive composition

### Shared widths

Define content width consistently, excluding the outer page gutter:

| Token / condition | Target |
| --- | --- |
| `layout.content` | 1200px maximum usable width |
| `layout.wide` | 1440px maximum for intentional image-led compositions |
| `layout.reading` | 720–760px maximum; use character measure where possible |
| Gutter below 360px | 16px each side |
| Gutter 360–639px | 20px each side |
| Gutter 640–1023px | 32px each side |
| Gutter ≥1024px | At least 48px each side, then centered max-width margins |

The main container fits within the viewport minus both gutters. Nested components must not add a second page gutter. Nav content, hero copy, section headings, evidence cards, and footer content share the same primary alignment lines.

Use a 12-column desktop grid, six-column tablet grid, and a simple single-column mobile flow. Standard desktop column gap is 24px. Editorial two-column sections can use a 48–64px gap. Switch composition when content needs it, rather than preserving desktop columns until they become unreadable.

### Spacing scale

Use this shared scale: **4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128px**. Avoid arbitrary per-page spacing values unless an optical correction is documented.

| Relationship | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Standard section vertical padding | 64 | 80 | 96 |
| Major image/evidence chapter | 72–80 | 96 | 128 |
| Compact supporting section | 40–48 | 48–64 | 64 |
| Hero top padding after navigation | 32–40 | 48 | 64 |
| Hero bottom padding | 48–64 | 64 | 80 |
| Section heading to main content | 32 | 40 | 48 |
| Eyebrow to heading | 12 | 12 | 16 |
| Heading to description | 16 | 20 | 24 |
| Description to actions | 24 | 28–32 | 32 |
| Card internal padding | 24 | 28–32 | 32–40 |
| Repeated cards | 16 | 24 | 24–32 |
| Image to caption | 12 | 12 | 16 |

Spacing is relational. Do not add two full section paddings between groups that form one story. Conversely, do not remove breathing room to fit all homepage content above an arbitrary fold.

### Hero geometry

For two-column heroes, use approximately 45% copy and 55% visual with a 48–64px gap. A cinematic full-width background can instead place native text in a protected region on the left.

The furniture visual should generally occupy 500–680px of desktop width where available. Its importance must be determined by available width and content, not viewport height. Remove the current dependency that dramatically shrinks the hero visual on short laptop screens.

Use natural content height. Avoid a mandatory full-screen hero, fixed text heights, and min-height calculations tied to a particular monitor. At short heights, allow ordinary scrolling. Keep the CTA close to its supporting paragraph.

### Breakpoint behavior

- **≥1024px:** two-column editorial compositions, full desktop navigation, up to three service cards when text remains comfortable.
- **640–1023px:** reduced gaps, optional two-column compositions, two-column supporting cards. A three-stage process may stack before the general mobile breakpoint.
- **<640px:** one-column reading order; copy → actions → visual in principal heroes; each figure follows its explanation.
- At 768px, 1024px, and intermediate widths, resolve actual fit. These are validation checkpoints, not a reason to force unsuitable layouts.

Keep DOM order and visual order aligned. Preserve access to all content at 200% text enlargement and reflow at 320 CSS pixels. Do not use global horizontal clipping to conceal layout overflow.

## 7. Graphics and art direction

### 7.1 Four graphic families

**A. Signature furniture scenes.** Realistic blue or neutral upholstered furniture, physical material detail, controlled light, and a clear silhouette. These carry the principal heroes and occasional chapter statements.

**B. Product demonstrations.** Genuine captures or accurate HTML compositions that show the existing furniture shopping experience. These explain what Ixaria does, with relevant changes visible at a readable scale.

**C. Physical metaphors.** Carefully rendered objects such as the deck's cutaway chair, conversion funnel, and glass enclosure. Use only where the meaning is immediate and matches existing copy.

**D. Supporting diagrams and icons.** Existing line illustrations, process steps, and simple connectors. These support detailed explanation with a consistent frame and scale. They do not compete with the signature furniture imagery.

Each section has one principal graphic family and one clear focal point. A signature scene may include a small accurate interface inset, but avoid a collage of metaphors, screens, icons, and floating badges.

### 7.2 Furniture-scene specification

- Use plausible proportions, upholstery construction, seams, cushion weight, legs, and contact with the floor.
- Favor three-quarter product views or carefully cropped material details. Preserve the product's recognizable shape.
- Match the deck's material richness: visible textile fibers, soft directional highlights, and grounded shadows.
- On light scenes, use a white or existing soft-gray environment with subtle contact shadows. On dark scenes, use navy with controlled illumination and a legible silhouette.
- Use electric blue as an actual upholstery or object color. Introduce orange through one small physical accent where useful. Cyan may illuminate a detail subtly; it should not wash the whole scene.
- Lighting across a scene should share one credible key direction. A soft light from above and camera-left is the default for a new coordinated set; preserve an existing scene's coherent lighting when reusing it.
- Leave a deliberate text-safe region occupying about 40–45% of a desktop hero. Do not cover busy textile texture, faces, or product controls with text.
- Keep website headlines, numbers, and calls to action out of generated image pixels. Compose them as live website elements.
- Avoid arbitrary sci-fi devices, unrelated neon scenery, toy-like furniture, excessive glossy plastic, and implausible floating products.

For a full-bleed desktop image, prepare a separate mobile crop from the same approved source. Move the text onto a solid surface on mobile when a safe overlay is impossible. Do not force a 16:9 desktop scene into a narrow portrait crop that loses the furniture.

### 7.3 Screenshots and interface compositions

- Use existing real Agache screenshots for evidence. Do not repaint, generate, or cosmetically alter customer results or interface states.
- For explanatory product demos, preserve the current data, scenarios, and text. Clearly distinguish a simulated demonstration from customer evidence using existing contextual copy and appropriate accessible descriptions.
- Fit the full image when the entire interface matters. When a detail needs emphasis, create a focused derivative crop and retain an accessible full-image view.
- Crop around the relevant controls instead of shrinking the whole website into a small card. Keep the full original unchanged.
- Use the same frame treatment: 16px radius, one subtle boundary, one restrained shadow, and a neutral stage. Native mobile frames are optional; do not frame every screenshot in a heavy phone bezel.
- Use a single browser toolbar style where browser chrome provides context. Remove redundant nested browser frames.
- Limit explanatory callouts to two or three per composition. Reuse existing explanatory text; do not invent new benefit claims or customer quotes.
- Interface colors inside a real capture stay genuine. Frame, caption, and surrounding typography follow Ixaria's system.
- Meaningful interface text should be readable without enlargement at the intended role. Otherwise show a focused crop and provide enlargement; do not pretend unreadable miniature text explains the product.

### 7.4 Physical metaphors and supporting illustration

The deck establishes that dimensional metaphors are part of the preferred style. Keep the objects large enough to communicate: a cutaway chair must reveal construction; a funnel must show a recognizable input and output. A metaphor should explain the same thing as the adjacent existing paragraph.

Reuse the current service and feature illustrations for supporting sections when they fit. Group line illustrations together with consistent sizes, margins, and a neutral background. Do not place a tiny line illustration beside a dominant photorealistic metaphor and give both equal importance.

For process diagrams, use restrained blue connectors, 2px strokes, consistent arrowheads, and native text. On mobile, connections become vertical and follow reading order. Essential explanation is visible without hover or flipping a card.

### 7.5 Texture, depth, and cropping

Blue upholstery texture is the preferred recurring detail. Use it for an occasional dark chapter, the edge of a hero, or a wide supporting strip. It should be related to the furniture family elsewhere on the page.

Texture never sits directly beneath long body text without a reliable solid or graded contrast region. Keep dark text areas calm. Do not add a site-wide fabric overlay, grain, or glow to every section.

Product cutouts and signature scenes can sit directly on the section surface. Reserve rounded cards for real grouping or interactive surfaces. A product photograph does not automatically need a border, shadow, and enclosing box.

### 7.6 People and customer logos

Preserve genuine people and their identities. Match portrait framing, eye-line, displayed head size, and tonal balance where possible. Use the existing portraits before considering any new photography. Do not generate replacement likenesses.

Use one portrait aspect ratio per repeated component, preferably 4:3. Desktop founder portraits can be 220–260px high. On mobile, use a compact image-and-details composition when space permits rather than three consecutive oversized portraits.

Use supplied logo files without distortion or decorative recoloring. Normalize optical size within approximately 144×48px display slots; differing logo proportions require different padding. Keep all supplied logos available rather than selecting a smaller set and silently dropping the others.

## 8. Asset reuse plan

The local assets below were inspected directly or in a contact sheet during this specification. Previously reviewed founder portraits and Agache evidence supplement that inventory. Reuse decisions are based on visual fit and communication, not just file existence.

| Asset / family | Decision | Intended treatment |
| --- | --- | --- |
| `public/logo-light.svg`, `logo-dark.svg`, `IXARIA-logo.svg` | Keep | Use the appropriate existing contrast variant; preserve artwork and aspect ratio |
| `public/sofa.webp` | Keep | Existing furniture cutout on navy; useful supporting or closing visual; do not enlarge beyond its practical source resolution |
| `public/newsletter.webp` | Keep selectively | Warm interior image for supporting content; use a restrained crop that does not make the heart-shaped shadow the site's central identity |
| `public/Picture1.webp` | Keep selectively | A specific inspection/detail metaphor; reserve for audit-related support rather than every booking panel |
| `public/hero-audit.webp` | Keep | Audit explanation graphic; show at a scale where its product-page question is understandable |
| `public/audit-results.webp` | Keep | Illustrative report preview; preserve its illustrative labeling and do not imply it is an approved downloadable client report |
| `public/audit-right-info.webp`, `audit-right-info2.webp` | Keep as alternatives | Supporting method illustrations; choose the relevant variant per composition, not both as redundant adjacent panels |
| `public/pilot-hero.webp`, `pilot-months.webp`, `pilt-agree.webp` | Keep | Supporting pilot walkthrough, duration, and measurement; coordinate framing rather than regenerating the family |
| `public/full-hero.webp`, `full-three.webp`, `full-measure.webp` | Keep | Catalog rollout and measurement explanations; the upward trend is illustrative, not numerical evidence |
| `public/feature-002.webp` through `feature-005.webp` | Keep | Shared supporting illustration family; display large enough to read, approximately 160–220px wide where layout allows |
| `public/work-001.webp` through `work-004.webp` | Available support assets | Reuse only where an existing explanation matches; their availability does not authorize new sections or copy |
| `public/cover.webp` | Secondary | Composite with embedded text; suitable only if its role remains readable. Do not make it the default hero or duplicate its text as a new message |
| `public/before.webp`, `after1.webp` through `after3.webp` | Keep | Existing demonstration sources; preserve accuracy and current visibility decisions |
| `public/sofa-colors/` | Keep | Existing product-demo color variants; retain their truthful relationship to the demonstration |
| `public/customer-stories/agache/leni-after.webp` and related captures | Keep as evidence | Focused preview plus full-image access; keep original customer UI and existing captions |
| Agache `signals`, `correlations`, `responses` WebP families | Keep | Current story illustrations; maintain their existing context and responsive variants |
| `public/signal.png`, `correlation.png`, `response.png` | Retain as sources | Prefer the existing responsive WebP derivatives for page delivery |
| `public/people/`, `SPO7558_Original.webp`, existing portrait variants | Keep | Consistent framing and display treatment; preserve identity |
| `public/logos/` and optimized logo derivatives | Keep | Static wrap/grid, accurate identities, optical sizing |
| `public/animation.mp4` | Retain pending playback review | Existing motion asset was identified but not frame-by-frame reviewed; use only after checking its visual fit, poster, and control behavior |
| `public/webpreview.webp`, `preview.webp` | Retain for current metadata roles | These contain embedded copy; do not treat them as reusable text-free section backgrounds |
| `public/optimized/` | Prefer for delivery | Continue using appropriate responsive variants; retain original source files |

### Deck imagery to reuse before generating

The deck's blue sofa scenes, material close-ups, dimensional benefit objects, and glass-enclosure metaphor are approved references supplied by the user. Their original image layers have not been imported into the repository as part of this task.

During a later implementation, first inspect and extract the original suitable image layer. Verify whether it contains baked-in text or logos, its native resolution, and whether it can support the intended crop. Do not assume a slide thumbnail is a high-resolution production asset. Preserve original deck content and keep provenance recorded.

### Conditional image gaps

No new image is required to write this specification. The first implementation should aim to reuse the existing library and deck artwork throughout.

Only commission or generate a new raster asset if a documented gap remains, such as a text-free wide hero crop, a compatible mobile crop, or a necessary matching fabric detail. Do not generate new screenshots, metrics, testimonials, portraits, logos, report content, or evidence.

Before producing a new asset, record: its role, the failed reuse candidates, reference image, subject, palette, camera/light direction, text-safe region, target aspect ratios, and delivery sizes. Review it alongside the actual reused assets for coherence.

Suggested production sizes for genuinely needed raster scenes: 2400–2880px wide for a desktop hero; 1200–1600px for a supporting scene; 900–1200px for a mobile crop. Export responsive WebP or AVIF derivatives where supported, keeping a suitable fallback. These are size targets, not a request to upscale existing imagery.

## 9. Shape, depth, and component surfaces

| Token | Target | Use |
| --- | --- | --- |
| `radius.control` | 8px | Buttons, inputs, small selectors |
| `radius.media` | 16px | Product-demo frames, screenshot previews |
| `radius.card` | 20px | Offer and evidence cards |
| `radius.feature` | 24px | One major featured composition when justified |
| `radius.pill` | 999px | Compact tags and swatches, not every button |
| `border.default` | 1px | Subtle separators and grouping |
| `shadow.media` | `0 12px 40px rgba(9,9,89,0.08)` | Product frames and elevated media |
| `shadow.overlay` | `0 20px 64px rgba(9,9,89,0.16)` | Menus or dialogs requiring separation |

Do not add a shadow to every card. Most informational sections should sit openly on the page or use a subtle boundary. A card's stronger treatment should correspond to its importance or interaction.

Use physically plausible glass in a graphic when it conveys meaning, as in the deck. General website navigation, body panels, and forms remain solid and readable rather than adopting glass effects indiscriminately.

## 10. Shared components and interaction states

### Navigation and footer

- One shared header across all routes: white surface, correct existing logo variant, 72px desktop height and approximately 64px mobile height.
- Header content aligns with the standard container. Use a fine separator; introduce a restrained shadow only when separation is useful.
- Preserve labels and destinations except for deliberate anchor consistency repairs during the later implementation. The two existing “how it works” actions should reach the same explanation; preserve existing anchor IDs and do not rename labels without approval.
- Keep the existing Process grouping and all destinations available on mobile. Open menus with click/tap and keyboard; hover can supplement access.
- Current-page state uses weight and a visible marker, not color alone. Use `aria-current` where appropriate.
- Keep the logo, booking action, and menu control legible at narrow widths. If a label needs more space, adapt the layout rather than shortening it.
- Sticky behavior must not obscure keyboard focus or anchors. Base offsets on the real header height; avoid duplicated page-specific offsets.
- The navy footer uses existing columns and text, shared spacing, readable secondary text, and larger comfortable link hit areas. Keep company and legal details intact.

### Buttons and text links

| Role | Appearance | Behavior |
| --- | --- | --- |
| Primary booking action | Orange fill, white text, 8px radius | Same appearance across header, hero, service pages, and closing sections |
| Secondary navigation action | White/transparent light surface, navy boundary and navy text | Visually lower priority than booking |
| Product-demo control | Blue selected state with white text; neutral unselected state | Consistent selection behavior and visible state |
| Inline link on light | Electric blue, clear underline in prose | Underline strengthens on hover; visible focus |
| Inline link on navy | White or cyan with adequate contrast | Same semantics and keyboard behavior |

Standard button height is 52px; compact header actions can be 44–48px. Keep at least 24px horizontal padding where space allows. Long existing labels may wrap with sufficient vertical padding. Do not force all labels into one line.

Hover: subtle elevation of at most 1px or boundary/shadow change. Pressed: return to baseline. Focus: clear contrasting ring. Disabled: retain readable text and a clear disabled state. Loading: reserve label width and avoid layout jumps. Never communicate action state through color alone.

Noninteractive cards do not lift, glow, or acquire a pointer cursor as if they were clickable.

### Method and process components

Keep Signals / Correlations / Responses as a connected sequence. Show the existing descriptions immediately. Use existing illustrations or accurate product details above the labels, with restrained connectors between stages.

Replace the presentation dependency on rotating cards with visible information. If additional interaction remains useful, it reveals supplementary detail; the essential explanation stays visible. Preserve every existing sentence.

The Audit / Pilot / Full Implementation journey uses a different composition from the product mechanism: numbered steps, existing summaries, and destination links. Keep the three stages visually related with the same surface and button treatment. Identify sequence through numbering and connectors rather than three unrelated bright fills.

### Product demonstrations

Approved replacement: use the three exact product-page views from slide 7 of the supplied sales deck: Standard product view, Pet-focused view, and Kids-focused view. Replace the former interactive Valencia sofa demo entirely. Keep the existing section heading and introduction.

Render the complete native slide compositions to preserve their labels, photos, fabric choices, and overlays. Publish each as responsive WebP images with explicit dimensions, meaningful alt text, and the slide's original caption. Keep all three side by side on desktop and stack them at readable width on mobile. Preserve image proportions and all screenshot content.

These are static examples. Do not add playback, scenario tabs, swatch controls, or simulated purchase actions. All views must render without JavaScript.

Approved motion update: show two existing shopper questions at a time. Switch the top row first, then the bottom row one second later, so each row changes on an approximately two-second cycle. Each outgoing question slides left while fading out and its replacement enters from the right; the other row remains stationary. Start only when the question list is at least half visible; pause offscreen or in a hidden tab. Reduced-motion preferences retain a static pair. Remove the circular next-arrow control. Preserve every question in the source collection and the static HTML.

### Evidence, charts, and screenshot enlargement

Evidence cards use a readable metric, its existing label and comparison period, a real customer identity, and a focused relevant visual. Large numbers do not outrank their meaning.

Charts retain the exact existing data. Use blue or cyan for the principal series and a distinct accessible secondary treatment. Include labels or patterns so color is not the only distinction. Keep zero baselines and consistent scales where appropriate. Preserve the existing table alternative and explanatory notes.

Screenshot enlargement opens a keyboard-accessible dialog, shows the full original image without stretching, provides an obvious close control, supports Escape, restores focus to the trigger, and allows scrolling when needed. A focused crop never replaces access to the full evidence image.

### Forms and FAQs

Keep current form copy, destinations, consent requirements, error/success messages, and submission semantics. Do not add fields, new promises, or a new registration workflow as part of visual design.

Inputs use at least 16px text, 52px target height, a persistent accessible label, and high-contrast focus. Error identification uses text and an icon or boundary treatment, not orange alone. Retain input values after recoverable errors. Place messages near the relevant field or form and preserve current announcement behavior.

FAQ rows use the full existing question as the interactive target. Show state through an icon and accessible expanded state. Preserve answers verbatim and keep them readable with JavaScript disabled according to the site's existing fallback approach.

## 11. Motion and animation

Motion directs attention to a meaningful change and then settles. The complete page should communicate correctly as a still composition.

| Interaction | Timing | Motion |
| --- | --- | --- |
| Button / link feedback | 120–180ms | Color, boundary, restrained shadow; translation at most 1px |
| Menu opening | 160–200ms | Small opacity change and up to 4px translation |
| Optional section entrance | 320–420ms | Opacity and up to 12px upward movement; once only |
| Product scenario change | 240–320ms | Crossfade or localized highlight; stable surrounding geometry |
| Optional method connector demonstration | 400–600ms | One finite visual explanation after explicit interaction |
| FAQ expansion | 180–240ms | Natural-height transition with content available throughout |
| Screenshot dialog | 160–220ms | Opacity; no large zoom across the page |
| Optional evidence chart entrance | 400–500ms | One restrained reveal; values and table already readable |

Use a consistent ease-out curve such as `cubic-bezier(0.22, 1, 0.36, 1)` for entrances and standard ease-out for simple controls. Stagger repeated entrances by at most 60ms and cap the group's total delay at about 180ms.

### Rules

- Principal text and the hero appear immediately. Never wait for an animation, font script, or observer to make important content visible.
- Static logos are the default; remove the design dependency on a continuous marquee.
- No scroll hijacking, pinned multi-screen tutorials, cursor-following decoration, mandatory parallax, or repeated card flips.
- Avoid continuous simultaneous motion in adjacent areas. A rich static furniture image can be the strongest visual moment.
- Existing hero video may become an optional user-played demonstration after its frames are reviewed. Provide a meaningful poster, play/pause, keyboard access, and a still fallback.
- Any future automatic moving content must meet pause/stop/hide requirements. Do not treat reduced-motion support as a substitute for visible playback controls.
- Stop active media when offscreen or when the document is hidden, where appropriate. Do not resume a user-paused sequence without another user action.
- Avoid flashing, animated financial counters, and layout changes that move a control away while someone is using it.

For reduced motion, show the final static state immediately, disable transforms and automatic progression, and use instant state changes or a minimal nonessential opacity transition. Video stays on its poster until deliberately played. These rules apply in JavaScript as well as CSS.

Reference: [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Automatically moving content lasting more than five seconds alongside other content needs a mechanism to pause, stop, or hide unless essential; auto-updating information has its own requirements.

## 12. Homepage composition

Preserve all current visible copy and functional content. The following sequence is the proposed layout, not permission to delete, rewrite, or republish dormant sections.

| Chapter | Composition | Graphic and hierarchy direction |
| --- | --- | --- |
| Hero | A signature navy furniture scene with a quiet text region; native existing heading, paragraph, and two actions | Prefer reusable deck sofa art. The product occupies the right portion; a readable existing demo preview can follow rather than crowd the scene |
| Client logos | Calm white strip or wrapping grid | All existing clients remain available; consistent optical scale and no automatic movement |
| Shopper problem | Light editorial panel or a restrained navy continuation depending on the hero transition | Existing statistic and paragraph, a furniture detail, and two existing shopper questions rotating on a two-second cadence while in view |
| Solution demonstration | Spacious light section with current heading and supporting sentence above three static views | Exact standard, pet-focused, and kids-focused product-page visuals from deck slide 7, converted to responsive WebP |
| Product mechanism | “How it works?” heading above the existing introduction, followed by Signals / Correlations / Responses | Header “How it works” links to `/#method`; existing descriptions remain fully visible with matching diagrams and product details |
| Agache proof | Featured navy result composition or a navy/white split within the shared grid | Existing result, period, text, and CTA; a plain, non-clickable product-page image without added labels, browser chrome, or caption |
| Implementation journey | Audit / Pilot / Full Implementation with consistent numbered stages | Existing copy and links; one visual family and common control treatment |
| Existing booking prompt | Open composition or restrained navy panel | Existing heading, description, and action; reusable furniture detail rather than a second oversized scene |
| Features | Existing title and four complete feature entries | Supporting line-illustration family, larger readable graphics, less enclosing decoration |
| Founders | Existing introduction and all three founders, with current titles and LinkedIn links | Consistent portraits and readable bios; Alex and Eduard reuse their Audit descriptions, Victor uses a LinkedIn-based summary |
| Newsletter | A quieter supporting destination directly before FAQs | Keep all existing copy and form; use the current warm scene only if it earns its space |
| FAQs | Existing full set | Clear reading measure, comfortable rows, minimal decoration |
| Footer | Shared navy footer | All current company, navigation, social, and legal information |

Approved homepage order places the product mechanism directly before the Agache customer story. Preserve the existing text, anchors, and booking actions when reordering sections. Do not add a new final marketing message by borrowing deck wording.

The hero's opening scene and the Agache panel are the principal visual peaks. Other sections support them. The homepage should not present every chapter as another equally large feature card.

## 13. Site-wide page patterns

### Route coverage

| Route | Pattern |
| --- | --- |
| `/` and existing `/index.html` alias | Narrative marketing homepage |
| `/audit.html` | Service detail: assessment and deliverables |
| `/pilot.html` | Service detail: bounded trial and measurement |
| `/full-implementation.html` | Service detail: rollout and continuing measurement |
| `/customer-stories/agache.html` | Evidence-led editorial customer story |
| `/cofounder.html` | Long-form careers / role description |
| `/privacy-policy.html`, `/terms.html`, `/cookie-policy.html` | Legal reading layout |

Keep current nonvisual endpoints and SEO assets operational. This specification does not introduce new routes, customer pages, pricing pages, or an About page.

### Audit

Use the shared service hero: current heading and paragraph on the left, exact offer and timing grouped nearby, and the existing audit illustration or a suitable reused furniture composition on the right. The long current headline determines the required height; do not shorten it.

Present the existing report preview at readable scale in the deliverables section. Keep all deliverable text adjacent to the visual. The four process steps use an ordered layout that becomes a two-by-two grid or vertical sequence when required. Team, method, newsletter, and closing content share the global components.

The existing report is illustrative and no approved example PDF is configured. Do not add a download button, fabricate a report, or make the image appear to be a genuine client artifact.

### Pilot

Use the same service hero typography, offer grouping, and action treatment as Audit. Keep the monthly price, term, and all existing conditions together.

Reuse `pilot-months.webp` for scope and duration, and `pilt-agree.webp` for the measurement explanation. Present them as supporting explanatory figures. Let the existing copy define the stages; do not add implied success guarantees or invented progress data.

Use readable numbered steps and an open measurement section. A shared deck sofa image may provide an opening or closing visual, but the useful existing explanatory assets remain part of the page.

### Full Implementation

Use the shared service hero, retaining the complete monthly price and revenue-share wording. The catalog-wide scope should be expressed through the existing multi-product image, with enough space to identify the products.

Reuse `full-three.webp` for method detail and `full-measure.webp` for the existing measurement narrative. Keep Prioritize / Adapt / Launch as the current ordered rollout. Do not make an illustrative upward line look like measured customer results.

### Agache customer story

Use an editorial opening with the existing result-led headline, introduction, customer identity, and authentic interface capture. Follow with the existing result strip and facts. Keep the challenge, adaptation, chart, table, notes, testimonial placeholder, and closing content intact.

Make narrative paragraphs comfortable to read and give each screenshot a clearly defined role. The current multi-image adaptation sequence uses consistent frames and full-image access. Keep all existing approval and illustration contexts.

Preserve the exact metric distinction: the supplied figure describes sales revenue growth over the stated comparison period. Do not relabel it as conversion uplift or a controlled causal effect. Keep the dates, currency notes, chart data, and table values together with their existing wording.

The result's prominence can follow the deck's large cyan-on-navy treatment. Supporting facts and qualifications remain readable at 14px or above. Preserve current hidden before/after sections and current indexing behavior.

### Careers

Retain every paragraph, list, role term, percentage, link, and team entry in `src/content/careers/cofounder.md`. Use a restrained heading area, a reading column, and the existing table of contents.

On desktop, the table of contents can occupy a narrow sticky side column with clear active state. On mobile, place it before the article in a compact accessible structure. It must not cover the role text. Use the shared founder portrait treatment and limited graphic decoration.

### Legal

Use a quiet white reading surface, the shared header/footer, a modest H1, the existing metadata, and a single comfortable reading column. Preserve all section numbers, lists, policy text, dates, and links exactly.

Use approximately 17–18px desktop body text, 16px mobile text, and 1.75 line height. Inline legal links remain visibly underlined. Avoid decorative hero images, animated entrances, and repeated booking interruptions in the article. Keep existing contact affordances accessible without allowing them to obscure text or focus.

## 14. Mobile, accessibility, and resilience

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) as the accessibility baseline for the future implementation. Compliance requires testing; this specification is not a conformance claim.

- Target 44×44px or larger interactive hit areas, with at least 8px separation where practical. WCAG 2.2 AA's minimum target rule is 24×24px with specified exceptions; 44px is the stronger project comfort target. [Target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Keep product selectors readable; use additional rows rather than tiny five-column labels or eight compressed swatches on narrow phones.
- Keep semantic landmarks, headings, labels, expanded states, image descriptions, and keyboard behavior intact.
- Important meaning and functionality cannot depend on hover, animation, a particular color, or a visual-only diagram.
- No mandatory horizontal page scrolling at 320 CSS pixels. Large data tables can have a clearly contained accessible scroll region if needed.
- Ensure 200% text enlargement and 400% page zoom do not lose text, controls, or reading order.
- Use width and height or aspect-ratio reservation for media to avoid layout shifts. Failed media should not remove the section's explanation.
- Keep content visible before JavaScript initializes. With JavaScript disabled, preserve reading, links, and the site's existing fallbacks.
- Use actual image descriptions for informative graphics and empty alt text for pure decoration. New accessibility-only descriptions may be necessary for changed graphics; they must not introduce new marketing claims.
- Menus and dialogs must handle focus, Escape, background interaction, and focus restoration correctly.
- Keep all existing consent and privacy behavior. No new tracking is part of the redesign.

## 15. Performance and delivery requirements

The visual design must remain fast enough to feel responsive. Rich imagery earns its place through composition and usefulness, not through heavy downloads or motion libraries.

Target field Core Web Vitals at the 75th percentile, assessed separately for mobile and desktop: LCP ≤2.5 seconds, INP ≤200ms, CLS ≤0.1. These are published thresholds, not measurements of the current site. [Google Web Vitals guidance](https://web.dev/articles/vitals).

- Keep the existing Astro/static architecture unless another task authorizes a change.
- Continue responsive image delivery through the existing image utilities and derivative pipeline.
- Prioritize only the principal above-the-fold image. Lazy-load supporting images below the fold; do not eager-load every carousel state or every asset in a scene.
- Default to a static hero image. Defer optional video bytes until useful; do not preload a full motion sequence simply for a decorative first impression.
- Use local Inter fonts and avoid adding remote font dependencies or unnecessary font weights.
- Prefer native HTML/CSS and the existing small interaction modules. Do not add a general animation library to accomplish simple transitions.
- Preserve originals, provide appropriate source sizes, and avoid stretching small raster assets. Generate derivatives when assets actually change during the later implementation.
- Preserve current analytics event meanings, consent requirements, form endpoints, and booking attribution. Layout changes must not duplicate submissions or event firing.

## 16. Future implementation sequence

This sequence is a handoff plan only. It does not authorize implementation now.

1. Capture the current text, visible/hidden states, destinations, and functional baseline for every route. Use the existing content fixtures as a starting point and account explicitly for planned section reordering.
2. Prepare an asset manifest distinguishing local production files, deck layers to extract, illustrative media, and genuine customer evidence. Attempt reuse before any generation.
3. Establish shared color roles, Inter typography, spacing, containers, surfaces, focus treatment, buttons, header, and footer.
4. Compose the homepage hero, demo, and Agache evidence as the visual exemplars. Verify all existing copy fits without edits before extending patterns.
5. Apply the shared service pattern to Audit, Pilot, and Full Implementation while retaining their distinctive content and useful existing graphics.
6. Apply editorial patterns to the Agache story, careers, and legal routes. Preserve all current publication states and disclaimers.
7. Complete manual scenario selection, controlled media, reduced-motion behavior, and no-JavaScript fallbacks.
8. Review the whole site together, then correct inconsistencies through shared patterns rather than adding independent page overrides.

## 17. Acceptance criteria

### Content and scope

- [ ] All current copy is preserved verbatim, with no unapproved headline, typo, label, term, or number changes.
- [ ] Every existing FAQ, feature, shopper question, scenario, person, and client logo remains available.
- [ ] Price qualifiers, result periods, notes, and approval placeholders remain attached to their meaning.
- [ ] No hidden section, unpublished evidence, demo chat, or indexing state has been changed without separate authorization.
- [ ] Existing routes, anchors, booking links, forms, consent, and analytics behavior are retained.

### Visual coherence

- [ ] The furniture scenes, product frames, typography, and page surfaces read as one brand.
- [ ] The homepage and service heroes use the same compositional rules while accommodating their full text.
- [ ] Header, section headings, main media, CTA panels, and footer share clear alignment lines.
- [ ] The signature blue furniture and material detail relate to the deck; supporting line art is subordinate and consistent.
- [ ] Existing useful assets are reused; every replacement or generated asset has a documented visual need.
- [ ] Genuine customer screenshots and charts remain accurate and distinguishable from illustrative content.
- [ ] There is one clear focal point per section and a visible difference between principal and supporting information.

### Interaction, reading, and responsiveness

- [ ] Buttons, fields, menus, selectors, FAQs, and dialogs have complete hover, active, focus, disabled, and error states as relevant.
- [ ] Text and essential controls meet the intended contrast requirements on their actual backgrounds.
- [ ] No meaningful content requires a flip, hover, automatic slide timing, or animation to be understood.
- [ ] All routes are inspected at 320, 390, 768, 1024, 1280, 1440, and 1920px widths; short 1280×720 and 1366×768 laptop views are included.
- [ ] Mobile crops retain the furniture subject and keep text readable. Native text is not baked into hero images.
- [ ] Keyboard navigation, reduced motion, text enlargement, zoom, media failure, and JavaScript-disabled behavior are checked.
- [ ] Product demonstrations remain useful and understandable on touch devices.

### Technical verification during implementation

- [ ] Run the existing Astro checks, build, relevant content/SEO tests, and browser checks after implementation.
- [ ] Preserve text contracts rather than updating baselines to conceal copy loss; account for approved visual reordering explicitly.
- [ ] Inspect representative desktop and mobile renders of every route and every changed interaction.
- [ ] Confirm no horizontal overflow, content clipping, broken images, layout shifts, duplicate events, or form regressions.
- [ ] Check performance in a controlled environment and use field data for production Core Web Vitals conclusions.

## 18. Decisions deliberately deferred

The exact deck image layers to import, their production-resolution suitability, the final mobile crops, and the existing video's playback treatment require an implementation-stage media review. These are bounded production choices within the direction above.

Editorial corrections, changed commercial claims, new testimonials, new downloadable reports, newly published case-study sections, and changed pricing or terms are outside the visual redesign. They require a separate explicit content decision.

The approved direction for design exploration is clear: large realistic furniture imagery, tactile blue materials, bold Inter typography, precise product explanations, readable evidence, generous shared spacing, and purposeful restrained motion throughout the site.

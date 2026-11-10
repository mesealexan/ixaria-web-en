# Agache customer story

Route: `/customer-stories/agache.html`. Astro generates static HTML; shared navigation, footer, consent and local fonts remain unchanged. Copy, percentage growth and monthly EUR totals live in `src/data/customer-stories/agache.ts`. Screenshots live in `public/customer-stories/agache/`.

## Evidence and editing

- The client confirmed the combined finalized purchase scope for both comparison years and the March 2026 launch of Signals, Correlations and Responses. The story compares April–October 2026 with April–October 2025, excluding the transition month.
- Overall growth is +256%, rounded from the period totals. Monthly percentages are rounded separately; do not average them to calculate the overall result.
- The client approved showing monthly revenue in EUR on 10 November 2026. The 2025 values use the supplied analytics export’s Total Revenue row; 2026 uses each monthly sheet’s total in the sales workbook. These reconcile to the existing monthly growth percentages. The older marketing workbook has different 2025 figures and is not the source for this comparison.
- EUR values use an indicative fixed conversion of 5.00 RON per EUR for both years, with whole euros displayed. This is a presentation assumption, not a historical FX rate. Source exports and customer-level records remain outside the repository.
- Observed growth is not an isolated causal measurement or a conversion-rate claim. The client requested removal of the public measurement disclosure.
- The exact adaptation journey is labelled illustrative until a real trigger, interpretation and response are approved. Replace the three-step diagram with approved evidence or screenshots when supplied.
- The client quotation is a clearly labelled placeholder, without invented wording or attribution. Keep `noindex` until the editorial gaps are resolved.

## Screenshot provenance

Before images: the client’s Drive `Original Screenshots` folder, archived November 2025. `pdp.png` supplies the Leni buying area and material comparison; `configurator.png` supplies the old swatch panel. Crops preserve the actual UI and have only been resized and converted to WebP.

After images: browser captures on 10 November 2026 from `https://agache.ro/collections/toate-produsele/products/canpea-leni`.

- `leni-after.webp`: the product page’s initial buying area.
- `materials-after.webp`: the material information overlay opened via “Vezi diferențe”.
- `configurator-after.webp`: selection controls cropped from the current configurator. The 3D preview did not finish loading in the capture browser and is intentionally outside this control-panel comparison.
- `buybox-after.webp`: dimensions, delivery and purchase controls.

Screenshots document the current visual state, not the exact March launch version. Product prices visible in public UI captures are not company revenue disclosures. No screenshot is generated or reconstructed.

## Verification

Run `npm test` for the build and all static tests. Story checks cover the approved EUR values and conversion label, removal of the measurement disclosure, image references, dimensions and no-JavaScript screenshot links. Native dialog enlargement supports Escape, closing and focus restoration. Without JavaScript, screenshot links open the assets directly.

# Quickstart: Implement and Verify APPLAND Home

**Feature**: 001-appland-home-redesign
**Purpose**: Repeatable setup, implementation record and validation guide for the active feature.

> **Platform update (2026-08-05):** The application now uses Angular 21.2 with Node 24.16 and remains NgModule-based. Historical Angular 16 evidence later in this document is retained as the original feature baseline.

## 1. Prerequisites

- Windows/PowerShell or an equivalent shell.
- Node 24.16.0 selected through NVM for Windows (`nvm use 24.16.0`).
- npm capable of honoring the existing package-lock.json.
- Current Chrome available to Karma and manual validation.
- No globally installed Angular CLI is required; use the local package scripts.

Confirm versions:

    node --version
    npm --version
    npm exec ng version

Expected result: Node 24.16.0, Angular 21.2.x, CLI 21.2.x and TypeScript 5.9.x.

Install exactly the locked dependencies:

    npm ci

The lockfile includes the approved Angular 21 dependency migration and compatible security overrides.

## 2. Confirm source authority before coding

Review in order:

1. specs/001-appland-home-redesign/spec.md.
2. specs/001-appland-home-redesign/plan.md.
3. specs/001-appland-home-redesign/data-model.md.
4. specs/001-appland-home-redesign/contracts/home-ui-contract.md.
5. docs/appland-web-brief.pdf for official content/order.
6. docs/appland-home-reference.dc.html for visual/interaction comparison.

Use docs/support.js only if required to render the reference. It must not appear in imports, angular.json, index.html, package files or production output.

Before making an asset visible, record that its local file, ownership/publication approval and destination approval are available. Missing approval invokes the contract's omission/fallback rule.

Typography compatibility rule: retain the inherited remote Roboto and Material Icons declarations while legacy `/about` and `/service` still consume them. Do not remove them in this feature and do not add another remote font request. Use Manrope only if an approved local asset is available; otherwise use the documented system-font fallback.

## 3. Baseline the unchanged application

Before the future implementation, capture:

    npm test -- --watch=false --browsers=ChromeHeadless
    npm run build -- --configuration production

The repository currently has no unit spec files, so the first command may report the present baseline rather than feature coverage. Do not solve that by changing test frameworks.

Record the current production bundle report and retain the existing angular.json budgets:

- Initial bundle: 500 kB warning, 1 MB error.
- Any component style: 6 kB warning and error.

## 4. Run the application

    npm start

Validate:

- http://localhost:4200/
- http://localhost:4200/about
- http://localhost:4200/service

The global header/footer must render on all three URLs. The Home navigation must route back to root fragments from either internal route.

## 5. Automated verification

Run once without watch:

    npm test -- --watch=false --browsers=ChromeHeadless

The test set must cover:

- Home section order and conditional products.
- Header fragment destinations, including Nosotros → por-que-appland.
- Registration and active-state mapping for every rendered Home region plus footer, using the 140 px activation line, the most recently crossed region and at most one active item.
- Exactly one matching header link exposes both the visual active class and `aria-current="location"`; the value moves with the active region and inactive links have no aria-current.
- Compact menu open/close, Escape, focus entry/restoration and aria-expanded.
- Exactly one appropriate header CTA at each side of the 559/560 CSS-pixel boundary.
- Meeting URL and contacto fallback.
- WhatsApp official number with and without approved message.
- Service tab activation and ArrowLeft/ArrowRight/Home/End behavior.
- Case/product manual carousel controls, named region, focusable track, current-position communication, touch scrolling and Arrow keys.
- Marquee pause/resume and reduced-motion static state when approved clients are present.
- Reveal fallback when IntersectionObserver is absent.
- Approval filtering for products/logos/media/actions/social/legal links, including omission of the entire clients region and heading when no logo is approved.
- Absence of legacy Home composition, duplicated regions, “100K”, visible language selector, data-en and hidden English alternatives.
- AppComponent input wiring for Menu navigation/meeting data and one FooterContent input—including nested contact—plus header/footer smoke rendering on `/`, `/about` and `/service`.

Run the release build:

    npm run build -- --configuration production

The build must pass without increasing budgets. Inspect any component style near 6 kB before accepting it.

### Early US1 MVP checkpoint

T069 is the complete early gate. Before later stories are integrated, run only the existing App/routing/Menu/Banner/HomeCta specs plus the production build and record:

- global header and basic root-fragment navigation;
- Hero proposition and primary action;
- meeting destination or contacto fallback and WhatsApp resolution;
- basic compact-menu keyboard/focus behavior;
- initial header/Hero/final-CTA behavior at 1024, 768, 560, 559, 390 and 360 CSS pixels;
- no horizontal page overflow or obscured focus in that increment.

This checkpoint does not require products, cases, IA, Why APPLAND, team, complete active-section enhancement, global performance validation or any Phase 9 task. Global closure gates remain indivisible and outside the MVP.

## 6. Static source/output checks

From the repository root:

    rg -n "support\.js|React|flagcdn|assets/proyectos/(emsula|ops|tengo)\.webp" src angular.json package.json
    rg -n "Placeholder|pendiente|coming soon|testimonio" src/app/feature/pages/home src/app/components
    rg -n "querySelector|setInterval|requestAnimationFrame" src/app/components src/app/shared
    rg -n "data-en|app-service|app-choose-us|app-our-team|100K" src/app/feature/pages/home src/app/app.component.html
    rg -n -U "<!--(?s:.*?)-->" src/app/feature/pages/home/home.component.html

Interpretation:

- support.js, React and flagcdn must have no new Home production reference.
- Known broken case paths must not remain in the refactored Home.
- No public placeholder/testimonial copy is allowed.
- Angular specs validate that legacy components, duplicate regions and “100K” do not render in the DOM.
- The separate home.component.html searches must find no legacy selector/metric and no inherited commented or alternative composition; any remaining ordinary comment is manually reviewed and documented rather than treated as a Karma assertion.
- requestAnimationFrame may appear only if a narrowly justified native behavior remains; no perpetual carousel/marquee/team loop is allowed.
- querySelector is not accepted for new Angular state/navigation behavior.

Validate local asset references:

    if (Test-Path -LiteralPath src/assets/images/home) {
      Get-ChildItem -LiteralPath src/assets/images/home -Recurse -File
    } else {
      Write-Output "No approved Home asset directory yet"
    }

If the directory does not yet contain an approved optional resource, its UI must be omitted rather than simulated.

## 7. Functional manual matrix

Use responsive mode and also one real touch-capable browser/device where available.

| Width | Header expectation | Hero expectation | Main checks |
|---:|---|---|---|
| 1440 | Desktop nav + CTA | Two columns | Max-width, spacing, three-column opportunities |
| 1280 | Desktop nav + CTA | Two columns | 24 px gutters and no edge clipping |
| 1024 | Desktop threshold | Two columns | Header fit, card grids, no overflow |
| 768 | Compact menu | One column | Two-column cards where suitable, track controls |
| 560 | Approved compact-header CTA state | Contract-appropriate column state | No competing duplicate/missing/shifted control, overlap or overflow |
| 559 | Mobile rule; desktop header CTA hidden | One column | Approved compact-menu/Hero conversion remains available with no competing duplicate |
| 390 | Compact | One column | Wrapped copy/actions, touch scroll |
| 360 | Compact | One column | No horizontal page scroll or clipped focus |

For every width:

1. Open Inicio, Servicios, Casos de éxito, Nosotros and Contacto from the header.
2. Confirm the destination heading remains visible below the fixed header.
3. Confirm Nosotros lands on “¿Por qué trabajar con APPLAND?” and no extra section exists.
4. Scroll across the 140 px activation line and confirm the most recently crossed registered region maps to exactly one active item: Hero/clientes → Inicio; desafíos/servicios/IA/productos → Servicios; casos → Casos; por-qué/equipo → Nosotros; CTA/footer → Contacto. Inspect the link to confirm its visual class and `aria-current="location"` agree, the value moves between links and inactive links expose no aria-current.
5. Select all five service tabs.
6. Traverse all five cases manually.
7. If products are approved, confirm the product track has an accessible name, can receive focus, exposes labelled controls/current position and works by touch and keyboard; otherwise confirm the whole region and nav target are absent.
8. If approved clients are present, pause/resume the client marquee; otherwise confirm that the entire clients region, including its heading, is absent with no name/placeholder substitute.
9. Activate meeting and WhatsApp from Hero/final CTA.
10. Confirm optional missing media/actions leave no blank frame or dead link.
11. Confirm there is no language selector, visible bilingual alternation, `data-en` attribute or hidden English duplicate.
12. Check document-level horizontal overflow in DevTools and by touch.

## 8. Keyboard and assistive validation

Starting at the address bar, use only keyboard:

1. Reach and activate the skip link.
2. Traverse desktop or compact header in visible order.
3. Open compact menu, verify trapped focus, close with Escape and confirm focus restoration.
4. Operate service tabs with ArrowLeft/ArrowRight/Home/End.
5. Focus each carousel track and use ArrowLeft/ArrowRight; also use its visible buttons.
6. Pause/resume the client marquee.
7. Reach both conversion actions and contact links.
8. Confirm focus is always visible and never obscured by the fixed header.

Screen-reader spot checks:

- Language announced as Spanish.
- One h1.
- Header, main, labelled regions and footer announced coherently.
- Menu state and selected tab state announced.
- The current header location is announced on exactly one link while the Home is active and moves when the observed region changes.
- Decorative graphics ignored.
- Informative image alternatives are useful and do not repeat adjacent copy unnecessarily.
- New-context external actions have understandable names.

Zoom the browser to 200% at 360/390 px equivalent and repeat primary navigation/contact tasks. Test 559 and 560 CSS pixels separately at 100% zoom; resizing across the boundary must never expose two header CTAs or none.

## 9. Reduced-motion validation

Enable prefers-reduced-motion: reduce at the OS or DevTools rendering panel, then reload.

Expected:

- Anchor and carousel movement is immediate.
- Client logos are static and all remain available.
- Reveal effects do not hide or delay content.
- Decorative spin, float, parallax and nonessential transitions are absent.
- Tabs, menu, carousels and CTA retain identical functionality.

Also test with IntersectionObserver unavailable/stubbed. All sections must remain visible.

## 10. Business-content validation

Compare visible output with the approved spec/PDF:

- 5 challenges.
- 5 services.
- 5 cases.
- 8 IA applications.
- 7 APPLAND attributes.
- 6 countries.
- 0 testimonials.
- 0 invented metrics/results/technologies.
- Only clients with approved local logos.
- If zero client logos are approved, zero clients-region heading, company-name substitute, empty marquee or recreated logo.
- Only approved products.
- No “Ver caso” without an approved destination.
- No privacy/terms/social link without an approved URL.

Check the exact contact data:

- hello@applandtech.com
- +504 3394-9211
- WhatsApp number 50433949211

## 11. Performance validation

Build production and serve the dist output using the team's existing static-server practice. Do not add a server package only for this check.

In current Chrome Lighthouse use:

- Mobile viewport 390 x 844.
- DPR 3.
- Fast 4G.
- 4x CPU slowdown.
- Cold cache.
- Three runs; record the median.

Required gates:

- Performance score at least 90.
- LCP at or below 2.5 seconds.
- CLS at or below 0.1.
- TBT at or below 200 milliseconds.
- Angular production budgets pass unchanged.

Network/Performance inspection must also confirm:

- Hero/nav/primary CTA appear and work without waiting for lower sections.
- No required Home image is remote.
- Below-fold media is lazy-loaded and dimensioned.
- No control shifts between pointer-down and activation.
- No perpetual JS timer/RAF drives marquee, carousel or team coverage.

If a lab metric fails, optimize content/assets/styles in scope. Do not raise an Angular budget or add a performance library without a separately approved decision.

## 12. Internal-route regression

At /about:

- Placeholder page content still renders.
- Header does not cover the content.
- Footer renders.
- Every Home nav link returns to the correct root fragment.
- AppComponent supplies Menu navigation/meeting inputs and one FooterContent input with nested contact; no shell input is left unbound.

At /service:

- Existing nine-service legacy route still renders through ServiceComponent/CardTemplateComponent.
- Header does not cover its title/cards.
- Footer renders.
- Home redesign copy/tabs have not replaced the legacy route.
- AppComponent supplies Menu navigation/meeting inputs and one FooterContent input with nested contact; no shell input is left unbound.

These are smoke protections only; redesigning either internal page remains out of scope.

## 13. Release evidence checklist

- Passing Karma output.
- Passing production build output and bundle/style budget report.
- Lighthouse median from three runs.
- Completed six required-width matrix plus explicit 560/559 boundary checks.
- Keyboard and reduced-motion notes.
- /about and /service smoke notes.
- Approval inventory for every visible governed asset/link/product.
- Confirmation that support.js/React/new UI libraries are absent.
- Confirmation that the legacy Home composition and visible/hidden bilingual alternatives are absent.
- Separate evidence for DOM-level legacy absence and the static home.component.html composition review.

Do not proceed to release with a failed mandatory gate, a dead destination, a visible placeholder, unapproved business content or document-level horizontal overflow.

## 14. Implementation evidence — 2026-08-04

### Runtime and installation

- Working branch: `main`; active feature artifacts: `001-appland-home-redesign`.
- Node `18.20.8`, npm `10.8.2`, Angular CLI `16.2.15`, Angular `16.2.12`, TypeScript `5.1.6`.
- `npm ci` completed against the existing lockfile: 1,076 packages installed and no package or lockfile change. The inherited audit reports 86 vulnerabilities (12 low, 19 moderate, 51 high and 4 critical); dependency remediation is outside this feature and was not attempted.

### Baseline record

- Baseline Karma failed with `TS18003` because the repository contained no `*.spec.ts` files before this feature.
- Baseline production build passed with an initial raw bundle of 877.16 kB and the inherited 500 kB warning.
- The baseline Home at 1440 px showed the inherited English Hero/language UI and heavy robot visual. A reproducible pre-change matrix for `/`, `/about` and `/service` at every requested width was not captured before implementation; T004 therefore remains open and is not backfilled with post-change evidence.
- The governed resource audit found multiple inherited source assets between approximately 1.4 MB and 2.3 MB, the documented missing `assets/images/services/develop.jpg` reference, pending client-logo publication approval, and no approved Home client/case/product asset directory. No inherited heavy asset is used by the new Home.

### Automated gates

- Final Karma command: `npm test -- --watch=false --browsers=ChromeHeadless`.
- Result: 64 of 64 tests passed in Chrome Headless 150.
- Coverage includes content/publication invariants, conversion destinations, one Home-only active navigation fragment, cleanup on `/about` and `/service`, header/menu accessibility, service tabs, manual tracks, reduced motion, reveal fallback, final section order, shell bindings and internal-route smoke tests.
- Final production command: `npm run build -- --configuration production`.
- Result: passed. Initial raw bundle 899.42 kB; estimated transfer 177.98 kB. The inherited 500 kB warning remains and the unchanged 1 MB error gate passes. All component styles remain below the unchanged 6 kB gate; the largest affected Home component stylesheet is 3,954 bytes.
- The build also emits two inherited Bootstrap selector-optimization notices for `.form-floating>~label`; neither selector is introduced by the Home.

### Final responsive/runtime matrix

Chrome DevTools Protocol emulation used the production build with reduced motion enabled. DOM width checks use the real emulated CSS viewport rather than Chrome headless's outer-window minimum.

| Width | Header mode | Header CTA | Hero | Horizontal overflow | Visible conditional regions |
|---:|---|---|---|---|---|
| 1440 | desktop | full | two columns | none | clients/products omitted |
| 1280 | desktop | full | two columns | none | clients/products omitted |
| 1024 | desktop threshold | full | two columns | none | clients/products omitted |
| 768 | compact | compact | one column | none | clients/products omitted |
| 560 | compact | compact | one column | none | clients/products omitted |
| 559 | compact | hidden from header; available in menu/Hero | one column | none | clients/products omitted |
| 390 | compact | hidden from header; available in menu/Hero | one column | none | clients/products omitted |
| 360 | compact | hidden from header; available in menu/Hero | one column | none | clients/products omitted |

Every width rendered one `h1`, no testimonials, no legacy Home selectors and the applicable order `inicio → desafios → servicios → casos → ia → por-que-appland → equipo-global → contacto`. The 390 px compact menu opened as a modal dialog, moved focus to its close button and contained one meeting CTA. Visual captures of Hero, services and final contact were inspected at desktop and mobile sizes; copy, controls and focusable tracks remained contained.

The production browser pass reported zero failed Home resources and zero Home console errors. `/about` and `/service` both retained their route component, global header/footer, no horizontal overflow and zero fragment-derived `aria-current`. The documented inherited `/service` request for missing `assets/images/services/develop.jpg` still returns 404; the Home does not reference it. A transient `/service` `NG0901` was removed by preserving an empty list until translated service data is an array and by initializing the application language to Spanish.

Static checks found no Home production reference to support.js, React, flagcdn, `data-en`, querySelector, new timers/RAF, testimonials, placeholders, legacy Home selectors or obsolete case paths. The only RAF match remains in the preserved, unused CountUpDirective, as specified by the plan. `package.json` and `package-lock.json` remain unchanged.

### Business publication decisions

- Client logos: existing files remain `pending`; the complete clients region and heading are omitted.
- Products: all candidates remain `pending`; the complete products region is omitted. The component accepts later approved typed content.
- Case media and destinations: none approved; official text-only cases render and “Ver caso” is absent.
- Meeting URL: not approved; all meeting actions fall back to `#contacto`.
- WhatsApp message: not approved; the official number is used without invented query text.
- Social and legal URLs: none approved; links are omitted.
- Testimonials: omitted completely.

### Performance and remaining release gates

The required Lighthouse CLI is not installed and adding it would violate the no-new-dependencies constraint, so no Lighthouse score or compliant three-run Lighthouse median is claimed. The latest release-readiness repetition ran the separate Chrome diagnostic using the planned 390 × 844, DPR 3, Fast-4G approximation and 4× CPU profile. It produced LCP values of 2,624 ms, 2,620 ms and 2,684 ms; CLS was 0 in all runs; approximate TBT values were 213 ms, 189 ms and 249 ms. This diagnostic is not a Lighthouse substitute and does not satisfy T088; its median LCP of 2,624 ms and approximate median TBT of 213 ms remain above the documented targets and preserve the performance risk.

The following mandatory evidence remains unavailable and must stay open:

- Complete pre-change visual baseline at all widths (T004).
- Three official Lighthouse runs and passing median (T088), therefore the dependent final comparison/release sequence is not closed.
- A real screen-reader and complete 200% zoom checklist (T098).
- Representative participant outcomes for SC-001 and SC-002 (T100).
- Final evidence normalization and full FR-001–FR-046 / SC-001–SC-014 release audit after those gates (T101–T102).

The feature implementation is buildable and technically exercised, but it is not release-complete while these mandatory tasks remain open.

## 15. Final release-readiness review — 2026-08-05

No application code or dependency file was changed during this review. The only correction was removal of trailing whitespace from four feature documents after the effective diff check exposed it.

### Repeated technical gates

- `npm test -- --watch=false --browsers=ChromeHeadless`: 64 of 64 tests passed in Chrome Headless 150.
- `npm run build -- --configuration production`: passed with 899.42 kB raw initial bundle and 177.98 kB estimated transfer. The inherited 500 kB warning and two inherited Bootstrap selector notices remain; the unchanged 1 MB error gate passes.
- `git diff --check` and `git diff HEAD --check`: passed after the documentation-only whitespace correction.
- `git diff --exit-code HEAD -- package.json package-lock.json`: passed; neither dependency manifest changed.
- Task inventory: 102 unique IDs, 91 complete and 11 open. The open set is T004, T041, T055, T087, T088, T089, T098, T099, T100, T101 and T102.
- Traceability inventory: all 46 functional requirement IDs and all 14 success-criterion IDs are represented in `tasks.md`. Evidence-based release closure remains incomplete while T100–T102 and their prerequisites are open.
- Production CDP matrix: 1440, 1280, 1024, 768, 560, 559, 390 and 360 CSS pixels passed without document-level horizontal overflow. One `h1`, the applicable section order, conditional client/product omission and the 559/560 header CTA boundary were preserved.
- Internal routes: `/about` and `/service` retained their route component plus global header/footer, had no horizontal overflow and exposed zero fragment-derived `aria-current`. Navigation from Home to `/about` cleared the previous Home state; `/service` also had no inherited fragment state.
- Browser console/network: the Home introduced no console error or failed resource. The only message was the already documented `/service` 404 for `assets/images/services/develop.jpg`; it is inherited and was not changed.
- Visual capture review: representative desktop, tablet/mobile Hero, 559/560 boundary, compact menu, services, final CTA and `/service` captures showed contained content and preserved hierarchy. This does not replace the required real-device, zoom, focus/hover or assistive-technology checkpoints.

### Open-task evidence assessment

| Task | Expected criterion | Evidence available | Evidence still missing | Can close without code? |
|---|---|---|---|---|
| T004 | Comparable pre-change `/`, `/about` and `/service` baseline at every requested width, including overflow and console | Baseline Karma/build plus one pre-change 1440 Home capture and inherited-resource notes | The complete pre-change route/width matrix was never captured and must not be recreated from post-change output | No. Keep the explicit historical deviation open unless formally accepted |
| T041 | Initial-increment layouts at 1440/1024/768/560/559/390/360, active-state/Menu specs, focus/zoom, CTA and overflow checkpoint | Final production width matrix, Menu/active-state tests, one `aria-current` contract, 559/560 CTA evidence and no overflow | Contemporaneous initial-increment checkpoint and complete manual focus/zoom validation | No code defect is identified; manual evidence or formal acceptance is required |
| T055 | Service/case/IA specs, full Karma/build and independent mouse, touch and keyboard checkpoints | Component tests plus 64/64 full Karma, passing build, manual controls rendered, click/keyboard behavior covered by specs | Independent real touch-device checkpoint | No code change is indicated; real touch evidence is required |
| T087 | Final mobile why/team/CTA/footer group at 560/559/390/360 and 200% zoom | All four widths pass overflow/containment and representative final CTA captures were inspected | Manual 200% zoom workflow | No; external/manual validation is required |
| T088 | Passing build/budgets, three Lighthouse mobile runs and Chrome Network/Performance inspection | Build passes its unchanged error gate; three non-Lighthouse Chrome diagnostic runs and Network/Performance evidence exist | Lighthouse is unavailable locally; no valid three-run Lighthouse median or approved performance deviation exists | No. Chrome diagnostics cannot close a Lighthouse-specific task |
| T089 | Full reference comparison at all eight widths plus typography, active/focus/hover, language and runtime review | Captures at all widths, representative visual inspection, typography fallback, active-state tests, no language UI and no Home runtime errors | T088 dependency and complete human focus/hover/all-width comparison | No code defect is confirmed; dependency and manual evidence remain |
| T098 | Complete keyboard, 200% zoom, reduced-motion and real screen-reader checklist | Automated keyboard, ARIA, focus-transfer and reduced-motion coverage | Manual 200% zoom and real screen-reader validation | No; both are required external checks |
| T099 | Final all-width visual/touch matrix plus DOM, console and network inspection | All-width DOM/capture matrix, no overflow, forbidden-runtime absence, Home-clean console/network and internal-route regression | Real touch-device execution and complete human visual interaction sign-off | No code defect is confirmed; touch/manual evidence remains |
| T100 | Representative first-visit/contact exercise for SC-001 and SC-002 | The target flows and acceptance method are documented | Real participants, anonymized counts, comprehension time and decision count | No; participant evidence cannot be simulated |
| T101 | Normalize the quickstart with actual final outcomes and approved deviations after T100 | Commands, build, browser diagnostics, publication decisions and current deviations are documented | T100 outcomes and any resulting approved deviations; dependency is not satisfied | No; keep open despite this incremental evidence update |
| T102 | Final evidence audit for all 46 FR and 14 SC with no blocker | All IDs exist and are mapped in the traceability table; automated coverage is recorded | Evidence-based closure after T101, including Lighthouse/manual/participant gates or formal approved deferrals | No; inventory coverage is not acceptance completion |

No task was marked complete during this review. The implementation remains technically buildable, but the recommended state is **Acceptance Pending**, not Ready for Release.

## 16. Controlled acceptance closure — 2026-08-05

No task was closed in this pass. The checks below extend the evidence, but automated browser inspection is not represented as manual zoom, a real touch device or a screen-reader session.

### Available environment and external-capability inventory

- Host: Windows, 1920 × 1080, Intel Iris Xe Graphics.
- Browser: Chrome 150.0.7871.187.
- Real touch: no present touch-screen/digitizer was detected by Windows PnP; `adb` is unavailable, so no connected Android device can be exercised.
- Screen reader: NVDA is not installed. Windows Narrator exists as an OS component, but this execution environment has no channel to operate it while observing and recording its spoken output; no screen-reader result is claimed.
- Lighthouse: no global command or project-local executable exists. No dependency was downloaded or added, and no Chrome diagnostic is treated as Lighthouse.
- Local supplemental evidence: `tmp/validation/acceptance/report.json` and its PNG captures. These temporary files are not production inputs.

### Automated real-Chrome supplemental checks

Chrome ran against the production build. The following results are repeatable and machine-observed:

- Sixteen sequential desktop tab stops were visible and matched `:focus-visible`, starting with the skip link and continuing through the header, conversion actions, service tab, case controls and case track.
- At 390 CSS pixels, keyboard Tab reached the compact-menu toggle with visible focus. Enter opened the dialog, focus moved to “Cerrar menú”, twelve subsequent Tab steps stayed inside the intentional focus trap, and Escape closed the dialog and restored visible focus to the toggle.
- Service tabs responded to End, Home and ArrowRight. End selected “Consultoría Tecnológica”; Home followed by ArrowRight selected “Inteligencia Artificial”, with selected and focused tabs aligned.
- The case carousel advanced from `1 de 5` to `2 de 5` with ArrowRight and to `3 de 5` by focusing “Caso siguiente” and pressing Enter. The product region is not published, so no product control or swipe result is claimed.
- The primary CTA received a visible 3 px focus outline without clipped text. Hovering the “Servicios” header link activated its non-color hover treatment; keyboard navigation independently exposed visible focus.
- Exactly one `aria-current="location"` existed on Home (“Inicio”). `/about` and `/service` each exposed zero fragment-derived current links.
- With reduced motion configured before page initialization, the media query matched, zero visible reveal elements remained at opacity zero and every applicable Home region remained available.
- The Chrome accessibility tree exposed one banner, one navigation, one main, one contentinfo, one `h1`, five tabs and one tabpanel. The published case carousel remained a labelled, focusable region. The Home rendered no `img` element in the current approved-resource state; decorative visuals were hidden from accessibility APIs.
- A supplemental 200% geometry approximation used Chrome at an effective 960 × 540 CSS viewport with DPR 2 on the 1920 × 1080 host. Home, `/about` and `/service` rendered their route components, a visible navigation mode, actions and headings with no document-level horizontal overflow or detected clipped text. This is automated geometry evidence only and does not close the required manual 200% browser-zoom check.

### T004 pre-change baseline deviation — approval pending

| Field | Record |
|---|---|
| Evidence that should exist | Pre-change `/`, `/about` and `/service` structure, overflow, console and shell evidence at 1440, 1280, 1024, 768, 390 and 360 CSS pixels |
| Why it is unavailable | The complete matrix was not captured before implementation. The current application cannot reproduce historical output without inventing or rebuilding evidence |
| Post-change evidence available | Baseline Karma/build results, one inherited Home capture at 1440 px, final production captures at eight widths, automated overflow checks and `/about`/`/service` regression coverage |
| Residual risk | A width-by-width visual delta against the exact prior implementation cannot be proven; current behavior can be verified only as post-change output |
| Acceptance owner | Pending explicit designation and approval by the Product Owner or Release Owner |
| Acceptance date | Pending human approval; no date recorded |
| Closure condition | Named owner records explicit acceptance and date, acknowledging that the historical baseline cannot be recovered |

T004 remains open. This record is a deviation request, not an approved deferral.

### T100 participant protocol for SC-001 and SC-002

**Expected participant profile**

- Spanish-speaking decision makers or project influencers from organizations that could need custom software, artificial intelligence or automation.
- First-time visitors who did not implement the feature and have not been briefed on the page structure.
- A mix of technical and non-technical profiles and, where practical, both desktop and mobile users.

**Minimum sample**

- Ten valid participants. This makes the approved 90% threshold directly observable as at least nine successful participants.

**Procedure and tasks**

1. Start a fresh browser session on `/` without explaining APPLAND's offer.
2. Expose the initial Home for up to ten seconds, then hide or pause interaction and ask the comprehension questions.
3. Ask the participant to find how to schedule a meeting; record every decision or navigation choice until the meeting destination or approved contact fallback is reached.
4. In a separate fresh attempt, ask the participant to find WhatsApp; record decisions until the official action is reached.
5. Provide no navigation hints. Record abandonment, hesitation, accidental activation and any inaccessible or dead destination.

**Measured indicators and questions**

- Time to first accurate statement of APPLAND's offer and primary action.
- Accurate answer to: “¿Qué hace APPLAND?”, “¿Para quién parece estar dirigida esta oferta?” and “¿Cuál es la acción principal que puedes realizar?”.
- Decision count to meeting and WhatsApp, selected path, completion and assistance required.
- Device/input mode and any observed confusion.

**Approval criteria**

- SC-001: at least 9 of 10 participants accurately identify the offer and primary CTA within ten seconds.
- SC-002: at least 9 of 10 reach the requested meeting or WhatsApp action in no more than two decisions, without assistance.
- Any dead destination or systematic accessibility blocker fails the corresponding exercise and requires triage before acceptance.

**Result record**

| Anonymous ID | Profile | Device/input | Offer understood | Time (s) | CTA identified | Meeting decisions/result | WhatsApp decisions/result | Assistance | Notes |
|---|---|---|---|---:|---|---|---|---|---|
| Pending | Pending | Pending | Pending | — | Pending | Pending | Pending | Pending | No participant executed yet |

T100 remains open until real results satisfy the criteria or an explicitly named human owner approves a formal deferral.

### Unexecuted-gate deviation requests — none approved

| Task | Reason not completed | Risk and impact | Acceptance owner | Target date | Closure condition |
|---|---|---|---|---|---|
| T004 | Historical baseline was not captured | Exact pre/post visual comparison cannot be proven | Product Owner or Release Owner, pending explicit designation | Pending human definition | Explicit named acceptance and date for the baseline deviation |
| T041 | Complete manual focus and 200% zoom checkpoint cannot be operated/observed here | Possible zoom clipping or focus issue could escape automation | Accessibility/QA owner, pending designation | Pending human definition | Manual browser matrix recorded with browser, resolution, route and evidence |
| T055 | No real touch device and no independent human input session are available | Gesture, touch-target or scroll-interference issue could remain | Mobile QA owner, pending designation | Pending human definition | Real-device mouse/touch/keyboard checkpoint passes and is recorded |
| T087 | Manual 200% zoom is unavailable | Final CTA/footer content could behave differently under real browser zoom | Accessibility/QA owner, pending designation | Pending human definition | Home final-group zoom checklist passes at required widths |
| T088 | No callable Lighthouse installation is available without adding/downloading a dependency | Official performance/accessibility/best-practices/SEO scores and median remain unknown; Chrome diagnostic remains above planned LCP/TBT targets | Performance or Release Owner, pending designation | Pending human definition | Three independent mobile Lighthouse reports pass, or a named owner explicitly accepts a documented deviation |
| T089 | Depends on T088 and lacks complete human all-width focus/hover comparison | A visual or interaction mismatch may remain | Design QA and Release Owner, pending designation | Pending human definition | T088 closes and the full reference comparison is signed off |
| T098 | No observable screen-reader session or manual 200% zoom | Announcements, reading order or zoom usability may differ from DOM/AX-tree evidence | Accessibility owner, pending designation | Pending human definition | NVDA/Chrome, NVDA/Edge or VoiceOver/Safari checklist plus manual zoom passes |
| T099 | No real touch device or complete human visual-interaction sign-off | Mobile gestures and touch targets remain unverified on hardware | Mobile QA owner, pending designation | Pending human definition | Real-device touch matrix and final browser inspection pass |
| T100 | No representative participants are available | SC-001 and SC-002 business outcomes remain unmeasured | Product Owner/UX Research owner, pending designation | Pending human definition | Protocol executes with at least ten participants and meets both 90% gates, or an explicit formal deferral is approved |
| T101 | Depends on actual T100 outcomes | Final verification record cannot contain unavailable outcomes | Release Owner, pending designation | After T100 | Quickstart is normalized with actual participant results or an approved deferral |
| T102 | Depends on T101 and all evidence gates | Requirement mapping exists, but release acceptance remains incomplete | Release Owner, pending designation | After T101 | Evidence audit confirms all 46 FR and 14 SC or records explicit approved deviations |

No acceptance owner, target date or deferral approval is inferred from a role label. Each remains pending explicit human confirmation.

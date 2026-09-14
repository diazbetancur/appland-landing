# Research: APPLAND Home Redesign

**Feature**: 001-appland-home-redesign

**Date**: 2026-08-04
**Status**: Complete

> **Post-implementation platform update (2026-08-05):** The technical baseline below records the state used to design and implement the Home. The current repository has since moved to Angular 21.2, TypeScript 5.9 and Node 24.16 without migrating away from NgModule. Current setup instructions live in [README.md](../../README.md).

## Sources and authority

The approved feature behavior and scope are consolidated in specs/001-appland-home-redesign/spec.md. When an underlying source must be interpreted, use this precedence:

1. docs/appland-web-brief.pdf for official business copy and section order.
2. docs/appland-home-reference.dc.html for visual composition and observable interactions.
3. The current Angular project for technical constraints and conventions.
4. docs/support.js only to render the reference; it is not a production dependency.

The files are currently located directly under docs/. They will not be moved or duplicated during this feature.

## Confirmed technical baseline

| Area | Finding | Planning consequence |
|---|---|---|
| Framework | Angular 16.2.12, Angular CLI/build tooling 16.2.15 | Keep Angular 16; no upgrade or standalone migration |
| Architecture | AppModule and declarations-based NgModule application | New components and directives are declared in AppModule |
| Language | TypeScript 5.1.6, strict compiler and strict templates, ES2022 target | All Home content and interaction state use explicit types |
| Runtime | Local shell exposes Node 24.16.0 and npm 11.13.0 | Use a project-approved Node 18.x runtime for implementation/CI reproducibility; do not change Angular |
| Routing | Root Home, /about and /service; no anchor or scroll restoration options | Add fragment navigation support without adding routes |
| Styling | SCSS, a global Angular Material theme, Bootstrap 5.3.3, Font Awesome 6.6.0 | Preserve dependencies; isolate Home tokens and avoid generic Bootstrap selector collisions |
| UI dependencies | Angular Material/CDK 16.2.14 already installed | CDK accessibility utilities may be used; add no UI library |
| Translation | ngx-translate 15 with Spanish and English dictionaries; current default is English | Keep the dependency for legacy compatibility, but remove the visible selector/alternation from the new shell and keep all new Home copy in typed Spanish configuration |
| Testing | Jasmine/Karma configured; no existing spec files and schematics skip tests | Add focused specs manually; no test-framework migration |
| Production budgets | Initial: 500 kB warning, 1 MB error. Component style: 6 kB warning/error | Keep every component stylesheet below 6 kB and place true tokens/utilities in the global layer |
| Assets | 41 files, about 24.2 MB; several individual images exceed 1.4 MB | Reuse only approved, optimized assets; do not ship the current heavy imagery unchanged |

Angular CLI 16.2 declares Node 16.14+ or 18.10+ in the installed package, but Node 24 is not the legacy runtime selected for this implementation. Pinning the implementation and CI workflow to Node 18.x avoids making a framework upgrade part of this feature.

## Current implementation assessment

| Element | Current condition | Decision |
|---|---|---|
| AppComponent | Global fixed header/footer; contains an inline style block and obsolete commented styles | Refactor the shell markup/styles, remove inline styling, and preserve the global router outlet |
| HomeComponent | Simple orchestrator with six active child components and three commented sections | Keep it as the only Home orchestrator and replace its composition with the approved order |
| MenuComponent | No usable desktop nav, mobile content is disabled, old links/language UI, querySelector and window state | Refactor in place as the global accessible header |
| BannerComponent | Responsibility matches the Hero but copy and heavy visuals differ | Refactor in place as the Home Hero |
| OurClientsComponent | Useful logo inventory, but duplicates animation in CSS/RAF and has a broken ViewChild contract | Refactor in place; keep only approved logos and one pausable CSS marquee |
| ServiceComponent | Used both inside Home and as the /service route; content has nine legacy services | Preserve it for /service and create HomeServicesComponent for the five approved Home services |
| ChooseUsComponent | Contains count-up metrics, including unapproved business claims | Remove from Home composition; leave legacy declaration untouched |
| SuccessStoriesComponent | Responsibility matches cases, but content and three image paths are obsolete/broken | Refactor in place using the five approved cases and optional media/destination rules |
| AiSolutionComponent | Responsibility matches IA but styling exceeds the component budget and copy comes from legacy dictionaries | Refactor in place using the eight official applications and smaller styles |
| WhyComponent | Responsibility matches “¿Por qué trabajar con APPLAND?” | Refactor in place with the seven official attributes and target fragment |
| TeamCoverageComponent | Current globe, clocks, intervals, five countries and flagcdn hotlinks conflict with the spec | Replace its internal presentation in place with a compact static six-country region |
| FooterComponent | Global but outdated, English labels, old year and ungoverned links | Refactor in place with approved navigation/contact and conditional links |
| OurTeamComponent | Not part of the approved Home | Keep outside the composition; do not delete in this feature |
| CardTemplateComponent | Supports the legacy /service presentation | Leave unchanged unless a regression-only adjustment is unavoidable |
| CountUpDirective | Uses RAF and textContent and is only relevant to removed metrics | Do not use in the new Home; do not remove globally |

Broken or unsafe resource findings:

- assets/proyectos/emsula.webp, assets/proyectos/ops.webp and assets/proyectos/tengo.webp are referenced but absent.
- The dynamic service image develop.jpg is absent; the existing file is develop.png.
- TeamCoverageComponent hotlinks flags from flagcdn.com.
- Google-hosted Roboto and Material Icons are inherited global requests that may still serve /about, /service and Angular Material.
- Existing Home imagery includes several files between about 1.5 MB and 2.3 MB.
- The current OurClientsComponent runs an uncancelled RAF loop and also applies a CSS animation.
- TeamCoverageComponent maintains two intervals for nonessential clocks/globe animation.

## Decision 1: Preserve the NgModule application

**Decision**: Declare all new components and directives in AppModule, keep AppRoutingModule, and retain BrowserAnimationsModule, Material, Bootstrap, Font Awesome and ngx-translate.

**Rationale**: This is the smallest compatible change and follows the explicit constraints.

**Alternatives rejected**:

- Standalone components: would introduce an architecture migration unrelated to the Home.
- Angular upgrade: expands scope and compatibility risk.
- A new feature module: possible, but unnecessary for one eagerly loaded page in the current small application.

## Decision 2: Keep HomeComponent as the orchestrator

**Decision**: HomeComponent owns ordered composition and receives the typed Home configuration. Section components own only their presentation and local UI state.

**Rationale**: It makes order and conditional product visibility testable from one place without concentrating section markup in a single template.

**Alternative rejected**: One monolithic Home template would reduce component reuse and make the style budget, testing and accessibility states harder to manage.

## Decision 3: Separate Home services from the legacy route

**Decision**: Create HomeServicesComponent. Do not turn the existing ServiceComponent into the Home tabs because it is also routed at /service.

**Rationale**: The Home requires exactly five services, tabs and different visual behavior; the route currently renders nine translated cards. Sharing the same component would couple an out-of-scope page to the redesign.

**Alternative rejected**: Refactoring ServiceComponent with route-mode inputs would introduce conditional behavior and regression risk into /service for no functional benefit to this feature.

## Decision 4: Use typed, feature-local Spanish content

**Decision**: Define readonly interfaces and a single home-content.config.ts beside HomeComponent. Templates receive typed data; they contain no business copy beyond labels inherent to controls.

**Rationale**: It preserves the approved PDF copy, makes publication rules explicit and avoids reusing legacy translation keys that contain stale or unapproved claims.

**Alternatives rejected**:

- Adding the new copy to both translation dictionaries: would create unrequested bilingual support.
- Embedding arrays in component classes/templates: would mix business content with behavior.
- Introducing a CMS or JSON fetch: out of scope and unnecessary.

ngx-translate remains installed and available for legacy routes.

The new header/footer remove the ES/EN selector, visible bilingual controls, copied data-en attributes and unused hidden English Home content. Keeping ngx-translate installed does not authorize language switching in the new Home.

## Decision 5: Centralize visual tokens without copying the reference

**Decision**: Translate the visual direction into CSS custom properties in a Home token partial imported by styles.scss. Use feature-scoped layout utilities for max width, spacing, focus and fixed-header offset. Component SCSS contains only component layout and states.

Reference values to preserve:

- Backgrounds: #090D12, #0D131B and #0A1219.
- Panels: #121923, #171E28 and #1B2430.
- Accent: #F05A24 with #FF6A2E hover; secondary #14B8C4.
- Text: #F5F7FA, #A8B0BC and #8B95A3.
- Borders: white at 10% and 18% opacity.
- Radii: 10, 16, 24 and 32 px.
- Major shadow: 0 24px 70px rgba(0,0,0,.5).
- Section spacing: clamp(72px, 8.5vw, 132px).
- Content width: 1280 px with 24 px side padding.
- Display scale: Hero clamp(38px, 5.4vw, 74px); major sections clamp(31px, 4vw, 52px).

Typography is represented by a configurable brand-font token. The existing remote Roboto and Material Icons requests are retained temporarily because legacy routes and Angular Material may use them; removing them globally is outside this feature. No new remote font request is introduced. Manrope is used only if an authorized local asset already exists; otherwise the Home uses the approved system fallback without blocking implementation.

**Alternative rejected**: Copying inline CSS from the reference would violate the source boundary, duplicate declarations and exceed per-component budgets.

## Decision 6: Use Router fragments and a fixed anchor contract

**Decision**: Enable anchor scrolling and scroll position restoration in AppRoutingModule. Global navigation uses root router links with fragments, so the same header works from /, /about and /service. Sections use scroll-margin-top based on the fixed header token.

Approved fragment contract:

- inicio
- clientes
- desafios
- servicios
- casos
- ia
- productos, only while the section is visible
- por-que-appland
- equipo-global
- contacto

“Nosotros” always maps to por-que-appland. It never creates a route or an extra section.

**Alternative rejected**: Imperative querySelector/scrollIntoView navigation would duplicate router behavior and fail when activated from an internal route.

## Decision 7: Implement the compact menu with semantic controls

**Decision**: Use Angular state and bindings for open/closed/scrolled state. Use a real button with aria-expanded and aria-controls, a labelled nav, Escape close, focus restoration and CDK A11yModule focus trapping. The full-screen compact panel prevents background interaction while open.

**Rationale**: CDK is already installed and provides the focus primitive without adding a UI system.

**Alternative rejected**: Integrating MatSidenav would add Material-specific layout and styling not present in the reference; raw document queries would repeat the current defect.

## Decision 8: Implement tabs as an Angular state machine

**Decision**: The active service id is component state. Use tablist/tab/tabpanel semantics, roving tabindex, aria-selected, aria-controls, click/touch, ArrowLeft/ArrowRight plus Home/End keyboard behavior. The active state includes shape/text/icon treatment, not color alone.

**Alternative rejected**: Bootstrap tabs and copied reference JavaScript would hide the state from Angular and complicate unit tests.

## Decision 9: Implement manual carousels with native scrolling

**Decision**: Cases and approved products use overflow-x, CSS scroll snap, touch/pointer scrolling, previous/next buttons and ArrowLeft/ArrowRight when the track has focus. A small declared HorizontalCarouselDirective may encapsulate only native measurement/scroll behavior; selection and content stay in the component.

**Rationale**: Native scroll already supplies touch momentum and avoids a dependency. Direct access through ElementRef is limited to the native scrolling API, where Angular bindings have no equivalent.

**Alternatives rejected**:

- Carousel library: not justified for two manual tracks.
- Autoplay/timers: conflicts with the approved manual behavior and motion controls.
- Copied scroll code from the reference: not an Angular implementation.

## Decision 10: Make the client marquee pausable and nonessential

**Decision**: Use one CSS keyframe track, an aria-hidden duplicate set for continuity, an explicit Pausar/Reanudar control, and pause on hover/focus. Under prefers-reduced-motion it becomes a static wrapping/list presentation and all logos remain available.

**Alternative rejected**: The current perpetual RAF loop consumes work, lacks lifecycle cleanup and duplicates CSS motion.

## Decision 11: Progressive reveal must fail visible

**Decision**: A RevealOnScrollDirective may use IntersectionObserver as progressive enhancement. Content is visible by default; the pending class is applied only when the API exists and motion is allowed. On unsupported API, reduced motion, error or destroy, content remains visible.

**Alternative rejected**: Initial hidden CSS risks permanently undiscoverable content when JavaScript or the observer is unavailable.

## Decision 12: Govern optional business resources

**Decision**: Products, logos, media and links include publication state in the typed data. Rendering filters approved items before composition:

- No approved products: omit the entire products region and its nav target.
- No approved client logos: omit the entire clients region, including its heading and marquee, without textual substitutes or empty-state messaging.
- Missing case/product media: render a complete text card with no empty media frame.
- Missing case destination: omit “Ver caso”.
- Missing meeting URL: use contacto.
- Missing WhatsApp message: open the official number without prefilled copy.
- Missing logo or authorization: omit that client; if no approved logo remains, omit the entire clients region.
- Missing social/legal URL: omit the link.

No placeholder is exposed in production.

## Decision 13: Keep assets local and sized

**Decision**: Production Home assets live under src/assets/images/home after approval, use WebP/AVIF when visually suitable, include intrinsic dimensions/aspect ratio, lazy-load below-fold informational imagery and never hotlink required imagery. The Hero uses CSS/SVG-like decorative composition or a small approved local asset rather than the existing 2 MB banner.

Existing approved logos may be reused only after authorization and optimization. Pepsi is not currently available and therefore remains hidden.

The feature does not remove the inherited Roboto or Material Icons requests and does not add Manrope from Google Fonts. A locally authorized Manrope resource may be connected through the configurable token; otherwise the system fallback is the release behavior.

**Alternative rejected**: Shipping all current assets would add more than 20 MB and expose non-approved clients/resources.

## Decision 14: Protect internal-route behavior

**Decision**: Header and footer changes are global, so /about and /service receive smoke tests for render, navigation and unobscured content. ServiceComponent and its card template remain legacy-owned. The shell reserves header space for routed content.

**Alternative rejected**: Scoping the header/footer only to Home would contradict the approved global regions and create inconsistent navigation.

## Decision 15: Test with the existing stack

**Decision**: Add Jasmine/Karma component/directive tests and use RouterTestingModule/TestBed. Stub matchMedia and dispatch keyboard/pointer/scroll events where required. Keep visual, touch and cross-viewport verification manual for this feature. Add no Playwright, Cypress, axe or visual snapshot dependency.

**Rationale**: Existing tools cover deterministic state and routing. The repository has no E2E foundation; introducing one is not indispensable to this Home.

## Performance validation decision

Implementation validation will use:

- Existing Angular production budgets unchanged: 500 kB initial warning, 1 MB initial error and 6 kB per component style.
- A production build served locally and Chrome Lighthouse mobile profile at 390 x 844, DPR 3, cold cache, Fast 4G and 4x CPU slowdown.
- Target Lighthouse performance score of at least 90, LCP at or below 2.5 s, CLS at or below 0.1 and TBT at or below 200 ms in three runs, recording the median.
- Chrome Performance/Network inspection to confirm no lower section blocks Hero/nav/CTA, no required Home image is hotlinked, and no persistent timer/RAF loop remains for carousels, clients or team coverage.
- Manual interaction confirmation that a control does not move between pointer-down and activation.

The lab profile is a repeatable engineering gate, while the approved spec remains the authority for the observable user outcome.

## Resolved unknowns

- No Spec Kit constitution exists in the repository; there are no additional constitution gates.
- No external API or storage contract is required.
- support.js and React are reference-runtime concerns only.
- The products section is optional and hidden until at least one item is approved.
- There is no need to create internal pages or new routes.
- Business resources that remain pending are handled by visibility/fallback rules and do not block implementation planning.

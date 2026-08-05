# UI and Content Contract: APPLAND Home

**Feature**: 001-appland-home-redesign  
**Contract type**: Internal Angular component, navigation and publication contract  
**External API**: None

## Route and fragment contract

The feature adds no routes. It preserves:

| URL | Owner | Expected result |
|---|---|---|
| / | HomeComponent | New ordered Home |
| /about | AboutComponent | Existing route still renders beneath the global shell |
| /service | ServiceComponent | Existing route still renders beneath the global shell |

All global Home navigation uses a root router link plus a fragment. This makes the same link valid from every existing route. Fragment-derived active state, however, applies only when the active route is `/`; `/about`, `/service` and every other non-Home route expose no activeNavigationFragment and no fragment-derived `aria-current` in the header.

| Visible label | Fragment | Required destination |
|---|---|---|
| Inicio | inicio | Hero |
| Servicios | servicios | Home services |
| Casos de éxito | casos | Approved case studies |
| Nosotros | por-que-appland | “¿Por qué trabajar con APPLAND?” |
| Contacto | contacto | Final contact CTA |

Observed-region active-link mapping while the active route is `/`:

| Region | Active header link |
|---|---|
| inicio (Hero) | Inicio |
| clientes | Inicio |
| desafios | Servicios |
| servicios | Servicios |
| casos | Casos de éxito |
| ia | Servicios |
| productos | Servicios |
| por-que-appland | Nosotros |
| equipo-global | Nosotros |
| contacto | Contacto |
| footer | Contacto |

The activation line is 140 CSS px from the viewport top. When two regions are partially visible on `/`, the region whose top most recently crossed this line wins. Exactly zero or one header item may be active; after Home initializes, one mapped item is active. On every non-Home route, zero header items are active by fragment.

Active-section flow:

1. The root-scoped HomeSectionObserverService owns the ObservedRegionId registry, current-route eligibility, activeRegionId and mapped activeNavigationFragment.
2. HomeSectionDirective registers/unregisters each rendered Home region and reports visibility/crossing changes. All ten possible HomeSectionId values are supported; conditional clientes/productos register only while rendered.
3. AppComponent marks the global footer as ObservedRegionId `footer`; FooterComponent does not own or relay scroll state. The footer remains registered globally but is eligible for active-link calculation only on `/`.
4. While the active route is `/`, the service applies the mapping above and publishes only one activeNavigationFragment.
5. When the route changes from `/` to `/about`, `/service` or any other non-Home route, the service clears activeRegionId and activeNavigationFragment, ignores visibility reports from the global footer and cannot preserve a previous fragment state.
6. MenuComponent consumes that shared state directly. AppComponent supplies configuration but does not manually relay each scroll event.
7. On `/`, the matching link alone has the visual active class and `aria-current="location"` (or an accessibility-equivalent current-location state). Every nonmatching link has no aria-current. On non-Home routes, every header link has no fragment-derived active class or aria-current.

Conditional products:

- productos may be linked only when at least one approved product is visible.
- Hiding productos must not change the ids or relative order of later regions.

Conditional clients:

- clientes exists only when at least one official, local and publication-approved logo is available.
- With zero approved logos, omit the complete region including heading and marquee; do not render company names as substitutes, recreated logos, placeholders or pending messages.

Each region exposes a stable id, a visible heading and scroll offset sufficient for the fixed header. A completed fragment navigation must leave the destination heading/purpose visible.

## Component contract

### AppComponent

Responsibilities:

- Render one global MenuComponent, one main router outlet and one global FooterComponent.
- Import or consume the shared approved configuration in AppComponent TS, supply NavigationItem/meetingAction inputs to MenuComponent and supply one `content: FooterContent` input—including nested contact information—to FooterComponent through explicit template bindings.
- Keep every required MenuComponent/FooterComponent input bound on /, /about and /service.
- Register the global footer as observed region `footer` without manually managing per-section scroll events; its observations are eligible for active-link calculation only on `/`.
- Reserve shell space so /about and /service content is not obscured.
- Contain no inline styles and no Home business sections.

### HomeComponent

Responsibilities:

- Orchestrate the ten possible regions in approved order.
- Supply typed, readonly content to child components.
- Completely replace the legacy composition: no inherited app-service, app-choose-us, app-our-team, alternative commented section block, duplicate section, legacy selector or unapproved “100K” metric remains in the Home template.
- Omit HomeProductsComponent when visibleProducts is empty.
- Expose one h1 through BannerComponent and coherent h2 section headings.

It does not own menu, footer, carousel mechanics or business-copy literals.

### MenuComponent

Inputs:

- items: readonly NavigationItem array.
- meetingAction: ConversionAction.

Observable output/behavior:

- Root-fragment navigation works from /, /about and /service.
- MenuComponent consumes activeNavigationFragment from HomeSectionObserverService.
- Exactly one matching link on `/` exposes both the visual active class and `aria-current="location"`; the value moves when the active region changes and no stale aria-current remains. On `/about`, `/service` and every other non-Home route, no header link exposes fragment-derived active state or aria-current, including immediately after navigation away from Home.
- isMenuOpen and isScrolled are represented through classes/attributes.
- Compact menu closes on Escape, close button, navigation selection and transition to desktop.
- Focus enters the compact menu when opened and returns to its trigger when closed.
- aria-expanded always reflects open state.
- No desktop/mobile/header/footer surface exposes an ES/EN selector, bilingual control, copied data-en attribute or unused hidden English Home content.

### BannerComponent

Inputs:

- content: HeroContent.

Behavior:

- Renders the single h1.
- Resolves meeting fallback and services fragment.
- Renders WhatsApp only when enabled by approved configuration.
- Decorative visual remains hidden from assistive technology and never blocks actions.

### OurClientsComponent

Inputs:

- clients: nonempty readonly Client array already filtered for publication.

Behavior:

- Renders every supplied logo once in the accessible sequence.
- Visual duplicate track is aria-hidden.
- Exposes one pause/resume control while motion is enabled.
- Becomes static under reduced motion.

If the filtered list is empty, Home omits the region rather than exposing an empty marquee. The omitted state includes the heading; company names are not used as logo substitutes.

### HomeChallengesComponent

Inputs:

- challenges: exactly five readonly Challenge items.

Behavior:

- Renders semantic cards/list content; decorative icons do not replace text.

### HomeServicesComponent

Inputs:

- services: exactly five readonly Service items.

Behavior:

- Exactly one tab is selected and one panel is presented.
- Mouse, touch, Enter/Space, ArrowLeft/ArrowRight and Home/End are supported.
- Tab ids and panel aria-labelledby/aria-controls references are stable.
- Selection is communicated with aria-selected and a non-color visual treatment.

### SuccessStoriesComponent

Inputs:

- cases: five approved readonly CaseStudy items.

Behavior:

- Manual-only track supports touch, focus plus Arrow keys, and visible previous/next controls.
- Missing media removes the media subregion without leaving a gap.
- Missing/unapproved destination removes “Ver caso”.
- Text content remains complete without media.

### AiSolutionComponent

Inputs:

- applications: exactly eight readonly AiApplication items.
- contactAction: ConversionAction.

Behavior:

- All eight labels are available without requiring animation.
- Contact action resolves through the same approved destination policy.

### HomeProductsComponent

Inputs:

- products: nonempty readonly Product array already filtered for publication.

Behavior:

- Component is never instantiated with an empty list.
- Manual carousel behavior matches the case carousel contract and exposes an identifiable, accessibly named region with appropriate natural/programmatic focus.
- Previous/next controls have accessible names; keyboard and touch preserve access; current item/position is communicated when the visual state implies a current item.
- “Solicitar información” resolves to the approved product destination or contacto.
- Missing media never creates placeholder markup.

### WhyComponent

Inputs:

- benefits: exactly seven readonly Benefit items.

Behavior:

- Owns fragment por-que-appland.
- Contains no testimonial block.

### TeamCoverageComponent

Inputs:

- countries: exactly six readonly CountryPresence items.

Behavior:

- Presents HN, US, CO, PA, BD and GT as a compact semantic list.
- Contains no clocks, flag hotlinks or continuous timer.

### HomeCtaComponent

Inputs:

- contact: ContactContent.

Behavior:

- Owns fragment contacto.
- Shows official email and phone.
- Resolves meeting and WhatsApp actions according to destination rules.
- Omits each unapproved social link independently.

### FooterComponent

Inputs:

- content: FooterContent.

Contact information is nested in `content.contact`; FooterComponent has no second contact input.

Behavior:

- Uses only valid Home fragments and approved contact/destinations.
- Omits unapproved social and legal links.
- Displays the current year without a recurring timer.

## Conversion destination contract

Resolution order is deterministic:

### Meeting

1. If destination is an approved valid external URL, render that URL.
2. Otherwise render a router fragment link to /#contacto.

### WhatsApp

1. Always use the official number 50433949211.
2. If approvedMessage is nonempty, URL-encode and append it.
3. Otherwise open the number without a text query.
4. A new browsing context uses noopener/noreferrer protection.

### Product inquiry

1. Use an approved product-specific destination when supplied.
2. Otherwise navigate to contacto.

### Case destination

1. Render “Ver caso” only for an approved destination.
2. No fallback control is displayed when the destination is absent.

## Publication contract

Rendering is deny-by-default for governed resources.

| Resource | Minimum publication condition | When condition fails |
|---|---|---|
| Client logo | Client approved, logo approved, local file resolves | Omit client |
| Case media | Approved local asset | Omit media only |
| Case action | Approved destination | Omit action |
| Product | Product approved | Omit product |
| Products region | At least one approved product | Omit region |
| Product media | Approved local asset | Omit media only |
| Meeting URL | Approved valid URL | Use contacto |
| WhatsApp message | Approved nonempty text | Use number with no message |
| Social/legal link | Approved valid URL | Omit link |
| Testimonial | Not modeled in this version | Never render |

No failure state exposes the words placeholder, pending, coming soon or equivalent.

## Carousel behavior contract

- The track is an identifiable, accessibly named and focusable region through semantic markup equivalent to role="region" plus aria-label or aria-labelledby; aria-roledescription may describe the carousel when it adds clarity.
- tabindex is applied when the track itself must receive ArrowLeft/ArrowRight input; focus remains natural when controls provide the complete keyboard path.
- Cards remain in DOM order and use CSS scroll snap.
- Previous/next controls have accessible names and disabled state at the boundaries when finite movement applies.
- ArrowLeft/ArrowRight moves one card when the track is focused.
- When a current item/position is visually communicated, the same state is exposed programmatically without relying only on color.
- Touch/pointer scrolling remains native.
- Smooth scrolling is disabled for reduced motion.
- There is no autoplay, timer or automatic selection.
- Focus is not forcibly moved when a control scrolls the track.

## Motion contract

### Reduced motion

When prefers-reduced-motion: reduce is active:

- Smooth anchor and carousel scrolling becomes immediate.
- Client marquee becomes static.
- Reveal effects are not initialized.
- Decorative spin, float, parallax and transition motion are disabled.
- All content and controls remain present.

### Reveal fallback

- Base CSS is visible.
- The directive may add a hidden/pending class only after confirming IntersectionObserver support and normal-motion preference.
- Destroy/error/unsupported paths remove or never add the pending class.

### Persistent motion

The client marquee is the only persistent content motion and has a visible pause/resume control. Decorative motion is nonessential and disabled with reduced motion.

## Responsive contract

| Range / validation width | Header | Hero | Content behavior |
|---|---|---|---|
| 1440 and 1280 | Desktop nav and CTA | Two columns, max-width 1280 | Multi-column grids |
| 1024 | Desktop threshold from reference | Two columns when content fits | Three/two-column grids as defined |
| 768 | Compact nav | One column | Primarily two-column cards; manual horizontal tracks |
| 390 and 360 | Compact nav; header CTA hidden below 560 | One column | One-column cards, full-width actions, no page overflow |

Breakpoints are mobile-first at 560, 768 and 1024 px. At exactly 1024 px the reference desktop mode applies; compact mode applies below 1024 px.

Boundary contract:

- At 559 px the mobile rule hides the duplicate desktop header CTA.
- At 560 px the approved compact-header CTA state applies.
- Neither side of the boundary may show competing duplicate controls, introduce layout shift/overlap or cause horizontal page overflow.

## Accessibility contract

- Document language is Spanish.
- No language selector, visible bilingual control, data-en attribute or unused hidden English Home copy is present; ngx-translate may remain installed for legacy compatibility only.
- A skip link targets the main content.
- One h1; each section has a coherent h2 and labelled region.
- All controls are native links/buttons unless a required composite pattern applies.
- Focus indicator uses the orange token with sufficient offset and is never removed.
- Compact menu, tabs and carousels have deterministic keyboard behavior.
- Informative images have contextual alt text; decorative visuals use empty alt/aria-hidden.
- Selection, disabled state and publication are not communicated by color alone.
- Touch targets are at least 44 by 44 CSS pixels.
- Text and controls remain usable at 200% zoom and 360 px without horizontal page scroll.
- New-context links are communicated accessibly and protected.

## Performance and stability contract

- Initial navigation, Hero and primary actions do not depend on below-fold images.
- Below-fold media is lazy-loaded and has intrinsic dimensions or aspect ratio.
- No layout shift moves a conversion control between pointer-down and activation.
- No required Home asset is loaded from a third-party image host.
- No persistent JavaScript RAF/timer drives marquee, team coverage or carousels.
- Production build remains within current Angular budgets.

## Test contract

Automated Jasmine/Karma tests cover:

- AppComponent configuration integration: Menu receives approved navigation/meeting data, Footer receives one complete FooterContent input with nested contact, no required input is unbound, and the shell renders on /, /about and /service.
- Angular rendering tests confirm that legacy components, duplicate regions and unapproved metrics do not appear in the DOM.
- Region-to-header tests cover registration of every rendered Home region plus footer, the complete mapping at the 140 px activation line on `/`, at most one active item and footer participation only on Home.
- Menu and route accessibility tests confirm exactly one `aria-current="location"` for the active link on `/`, movement of aria-current when the region changes, removal from inactive links, parity between accessible and visual state, zero fragment-derived aria-current values on `/about` and `/service`, and cleanup of the previous Home state when navigating to a non-Home route.
- Product carousel accessible region/name/focus/controls/current-position/touch/keyboard contract.
- Absence of language selectors/bilingual reference content in desktop header, compact menu and footer.
- Explicit header CTA behavior at 559 and 560 px.
- Ordered Home composition and conditional products.
- Header fragment map, compact menu keyboard/focus state and cross-route links.
- Meeting and WhatsApp destination resolution.
- Service tab mouse/keyboard state and ARIA references.
- Manual carousel control/keyboard behavior.
- Marquee pause and reduced-motion static state.
- Reveal fallback with unsupported observer/reduced motion.
- Optional media/actions and approval filtering.
- Header/footer rendering plus /about and /service smoke navigation.

Controlled static source validation, separate from Karma, covers:

- home.component.html contains no inherited commented composition, legacy selector, unapproved metric or alternative composition.

Manual validation covers:

- Touch behavior.
- Keyboard traversal of the complete page.
- Visual fidelity and overflow at 1440, 1280, 1024, 768, 390 and 360 px, plus the explicit 559/560 transition.
- Screen-reader landmark/state spot checks.
- Lighthouse and production budget gates defined in research.md and plan.md.

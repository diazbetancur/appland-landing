# Tasks: APPLAND Home Redesign

**Input**: Design documents from specs/001-appland-home-redesign/

**Prerequisites**: spec.md, plan.md, research.md, data-model.md, contracts/home-ui-contract.md, quickstart.md and checklists/requirements.md

**Tests**: Required by the approved plan and the user request. Story-specific tests are written before or beside the functionality they verify, then executed again during closure.

**Organization**: The nine requested delivery phases are preserved. Functional tasks carry a user-story label so every increment remains traceable and independently verifiable.

> **Historical baseline note (2026-08-05):** Task descriptions that mention Angular 16 or Node 18 retain the exact implementation baseline and must not be reinterpreted as current environment instructions. The repository now uses Angular 21.2 and Node 24.16; see [README.md](../../README.md).

## Format

- [P] means the task can run in parallel with other ready tasks because it uses different files and has no dependency on their unfinished changes.
- [US1] Comprender y contactar (P1).
- [US2] Navegar y explorar soluciones (P1).
- [US3] Validar confianza (P2).
- [US4] Explorar IA y productos aprobados (P2).
- [US5] Confirmar cobertura internacional (P2).
- [US6] Acceder sin barreras (P1).
- Every task states its real dependency, concrete files and expected result.

---

## Phase 1 — Preparación y baseline

**Goal**: Establish a reproducible Angular 16 baseline and record the current behavior before changing the application.

- [x] T001 Confirm that the working branch/feature is 001-appland-home-redesign and select a project-approved Node 18.x runtime; record branch, Node, npm, Angular CLI and TypeScript versions in specs/001-appland-home-redesign/quickstart.md. Depende de: ninguna. Resultado: runtime y feature reproducibles sin actualizar Angular.
- [x] T002 Run npm ci against package-lock.json without changing package.json or package-lock.json, and record dependency-install status in specs/001-appland-home-redesign/quickstart.md. Depende de: T001. Resultado: dependencias existentes instaladas exactamente y cero paquetes nuevos.
- [x] T003 Run the current Karma command and production build from package.json/angular.json, capturing pass/fail, bundle sizes and the absence/presence of specs in specs/001-appland-home-redesign/quickstart.md. Depende de: T002. Resultado: baseline automatizado y budgets iniciales documentados.
- [ ] T004 Inspect the current /, /about and /service at 1440, 1280, 1024, 768, 390 and 360 px and record structure, overflow, console and shell regressions in specs/001-appland-home-redesign/quickstart.md. Depende de: T003. Resultado: baseline visual/funcional comparable.
- [x] T005 Audit src/assets/, src/app/components/, src/index.html and docs/ for broken references, hotlinks, oversized assets and pending business approvals; record the governed resource inventory and omission/fallback outcome in specs/001-appland-home-redesign/quickstart.md. Depende de: T004. Resultado: cada recurso conocido queda clasificado como aprobado, pendiente, roto u omitido.
- [x] T006 Reconcile the planned create/modify/preserve file map and colocated Jasmine specs against the actual repository, updating only discrepancies in specs/001-appland-home-redesign/quickstart.md. Depende de: T005. Resultado: alcance de archivos confirmado antes de implementación y /about,/service protegidos.

**Checkpoint**: Baseline captured; no application behavior has been changed.

---

## Phase 2 — Fundación visual y contenido

**Goal**: Create the shared typed content, publication/fallback rules and global visual foundation that block all functional stories.

- [x] T007 [P] Write failing invariant/publication tests for HomeSectionId, exact official entity counts, Spanish copy, conditional clients/products and prohibited testimonials/placeholders in src/app/feature/pages/home/home-content.config.spec.ts. Depende de: T006. Resultado: contrato de contenido ejecutable antes de crear la configuración.
- [x] T008 [P] Write failing tests for meeting, WhatsApp, product inquiry and case destination resolution in src/app/shared/utils/conversion-destination.util.spec.ts. Depende de: T006. Resultado: fallbacks aprobados quedan especificados sin URLs o mensajes inventados.
- [x] T009 Create PublicationStatus, HomeContent and all entity/UI-state interfaces from data-model.md in src/app/feature/pages/home/home-content.models.ts. Depende de: T006. Resultado: modelos readonly y discriminados compilan con strictTemplates.
- [x] T010 Populate the official Hero, navigation, challenges, services, cases, IA applications, benefits, countries, contact and footer data in src/app/feature/pages/home/home-content.config.ts. Depende de: T009. Resultado: una única fuente española reproduce exclusivamente el spec/PDF.
- [x] T011 Add approved-only selectors and conditional-region derivation for clients, cases, products, social/legal links and optional media/destinations in src/app/feature/pages/home/home-content.config.ts. Depende de: T010 y T007. Resultado: elementos pendientes nunca llegan a las plantillas y cero productos/logos omite su región vacía.
- [x] T012 Implement the pure destination resolver in src/app/shared/utils/conversion-destination.util.ts and make T008 pass without adding services or dependencies. Depende de: T009 y T008. Resultado: reunión usa URL aprobada o contacto; WhatsApp nunca inventa mensaje; “Ver caso” no obtiene fallback.
- [x] T013 [P] Define approved palette, panel, border, radius, shadow, spacing, width, typography and header-height CSS custom properties in src/styles/_appland-home-tokens.scss. Depende de: T006. Resultado: tokens reutilizables reflejan la referencia sin copiar estilos inline.
- [x] T014 Import the token partial and implement scoped container, section, button, focus-visible, skip-link, body/shell and reduced-overflow primitives in src/styles.scss. Depende de: T013. Resultado: base oscura/naranja/cian consistente, targets de 44 px y ningún selector genérico colisiona con Bootstrap.
- [x] T015 Set html lang to es, remove the inline body background, add approved basic title/description, retain the inherited Roboto/Material Icons requests and configure Manrope only from an authorized local asset with system fallback in src/index.html and src/styles/_appland-home-tokens.scss. Depende de: T013. Resultado: documento español, sin estilo inline ni nueva fuente remota; recursos globales heredados permanecen por compatibilidad.
- [x] T016 Run T007/T008 plus the production build and record the foundation gate in specs/001-appland-home-redesign/quickstart.md. Depende de: T011, T012, T014 y T015. Resultado: contenido/fallbacks pasan y budgets existentes siguen sin cambios.

**Checkpoint**: Typed Spanish content and visual primitives are ready; all story work may build on them.

---

## Phase 3 — Shell compartido

**Goal**: Deliver a global header/footer and root-fragment navigation that work from Home, /about and /service.

- [x] T017 [P] [US2] Write header tests for Inicio/Servicios/Casos/Nosotros/Contacto fragments, Nosotros → por-que-appland, sticky state, root links and absence of desktop language selector/data-en/hidden English in src/app/components/menu/menu-navigation.spec.ts. Depende de: T016. Resultado: navegación española global falla antes del refactor.
- [x] T018 [P] [US6] Write compact-menu tests for aria-expanded/controls, Escape, focus entry/trap/restoration, close-on-navigation, absence of mobile language controls and exact nonduplicated CTA behavior at 559/560 px in src/app/components/menu/menu-accessibility.spec.ts. Depende de: T016. Resultado: comportamiento accesible y boundary responsive quedan probados antes de implementarse.
- [x] T019 [P] [US1] Write footer/meeting fallback/contact/conditional link and no-language-selector/hidden-English tests in src/app/components/footer/footer.component.spec.ts. Depende de: T016. Resultado: el shell no puede publicar enlaces muertos, UI bilingüe ni perder la conversión.
- [x] T020 [P] [US2] Write routing and AppComponent integration tests for root fragments, scroll behavior, unchanged route ownership, Menu navigation/meeting inputs, the single Footer `content: FooterContent` input with nested contact, and zero required unbound shell inputs in src/app/app-routing.module.spec.ts and src/app/app.component.spec.ts. Depende de: T016. Resultado: configuración del shell y renderizado de /,/about,/service quedan cubiertos antes de implementarse.
- [x] T021 [US2] Enable anchorScrolling, scrollPositionRestoration and a fixed safe scroll offset while preserving the three existing routes in src/app/app-routing.module.ts. Depende de: T020. Resultado: cada enlace deja visible el destino bajo el header.
- [x] T022 [US6] Refactor src/app/app.component.ts, src/app/app.component.html and src/app/app.component.scss to consume the approved Home/site configuration, bind NavigationItem/meetingAction to MenuComponent and one complete FooterContent value—including nested contact—to FooterComponent, render header/skip-link/main/router-outlet/footer landmarks, remove inline/commented legacy styling and reserve header space for every route. Depende de: T014, T011, T012 y T020. Resultado: ningún input requerido queda sin enlazar y el shell semántico funciona en /,/about,/service.
- [x] T023 [P] [US6] Import the already installed CDK A11yModule in src/app/app.module.ts without adding a package or changing NgModule architecture. Depende de: T018. Resultado: focus trap disponible mediante la dependencia existente.
- [x] T024 [US2] Refactor src/app/components/menu/menu.component.ts, src/app/components/menu/menu.component.html and src/app/components/menu/menu.component.scss for typed inputs, desktop root-fragment navigation and class-bound sticky/scrolled state without querySelector, removing ES/EN selector, bilingual controls, data-en attributes and hidden English copy. Depende de: T017, T021 y T022. Resultado: header desktop español, funcional, fijo y visualmente diferenciado tras scroll.
- [x] T025 [US1] Bind the configurable meeting action and contacto fallback into the header CTA in src/app/components/menu/menu.component.ts and src/app/components/menu/menu.component.html. Depende de: T012 y T024. Resultado: CTA del header siempre tiene destino válido.
- [x] T026 [US6] Implement compact menu open/close state, CDK focus trap, Escape, focus restoration and close-on-breakpoint/navigation in src/app/components/menu/menu.component.ts, src/app/components/menu/menu.component.html and src/app/components/menu/menu.component.scss. Depende de: T018, T023 y T024. Resultado: menú usable con mouse, touch y teclado bajo 1024 px.
- [x] T027 [US1] Refactor src/app/components/footer/footer.component.ts, src/app/components/footer/footer.component.html and src/app/components/footer/footer.component.scss with the single required `content: FooterContent` input, nested contact, approved fragments, current year and independently filtered social/legal links, removing any second contact input, language selector, data-en or hidden English. Depende de: T011, T012, T019 y T022. Resultado: footer global español con contrato único y sin destinos no aprobados ni interfaz bilingüe.
- [x] T028 Run AppComponent/routing/menu/footer specs and manually smoke /,/about,/service, recording bound inputs, header offset, root-fragment behavior, Spanish-only shell and footer results in specs/001-appland-home-redesign/quickstart.md. Depende de: T021–T027. Resultado: Fase 3 validada sin inputs sueltos ni cambios internos en About/Service.

**Checkpoint**: The global shell is independently usable and regression-safe.

---

## Phase 4 — Primer incremento funcional

**Goal**: Produce a navigable, responsive Home increment containing Hero, approved clients and challenges.

**Independent test**: Open /, understand the proposition, navigate to challenges/contact, inspect approved clients, and complete the same traversal with keyboard at desktop/mobile widths.

- [x] T029 [P] [US1] Write Hero copy, single-h1, CTA fallback, services-fragment and decorative-media tests in src/app/components/banner/banner.component.spec.ts. Depende de: T028. Resultado: Hero approved contract fails before refactor.
- [x] T030 [P] [US3] Write client approval filtering, logo alt/intrinsic-size and zero-logo full-region omission tests—including no heading, company-name substitute, empty marquee, recreated logo, placeholder or pending message—in src/app/components/our-clients/our-clients.component.spec.ts. Depende de: T028. Resultado: only authorized local logos can render and the entire region disappears when none remain.
- [x] T031 [P] [US2] Write exact five challenge/response and semantic-heading tests in src/app/components/home-challenges/home-challenges.component.spec.ts. Depende de: T028. Resultado: official challenge content is executable.
- [x] T032 [P] [US2] Write initial Home order/stable-fragment Angular tests plus DOM-level negative assertions that inherited app-service, app-choose-us, app-our-team, other legacy rendered selectors, duplicate regions and “100K” metrics do not render in src/app/feature/pages/home/home.component.spec.ts; do not use Karma to inspect source comments. Depende de: T028. Resultado: this shared validation guards removal of the rendered legacy composition before T038 can establish the US1 Hero MVP; complete final order across all sections remains owned by T095.
- [x] T033 [P] [US2] Write active-section service/directive tests for registration and cleanup of all ten HomeSectionId values plus footer, the complete region→header map on `/`, 140 px crossing arbitration, most-recent crossing, at-most-one activeNavigationFragment, Home-only router-fragment fallback, unsupported IntersectionObserver, ignored footer observations outside Home and route-transition cleanup in src/app/shared/services/home-section-observer.service.spec.ts and src/app/shared/directives/home-section.directive.spec.ts; extend src/app/components/menu/menu-navigation.spec.ts to assert exactly one active link has aria-current="location" on `/`, the value moves with the active region, inactive links have no aria-current and visual/accessible state match, while non-Home routes expose no fragment-derived active state. Depende de: T028. Resultado: every possible rendered Home region maps deterministically through one shared, accessibly represented state, and no active fragment can leak to an internal route.
- [x] T034 [P] [US1] Refactor src/app/components/banner/banner.component.ts, src/app/components/banner/banner.component.html and src/app/components/banner/banner.component.scss to consume HeroContent and render the approved two-column/one-column Hero. Depende de: T029, T010 y T012. Resultado: proposition and conversion actions are immediately usable without heavy legacy banner imagery.
- [x] T035 [P] [US3] Refactor src/app/components/our-clients/our-clients.component.ts, src/app/components/our-clients/our-clients.component.html and src/app/components/our-clients/our-clients.component.scss into a static accessible approved-logo list with no RAF loop. Depende de: T030 y T011. Resultado: client evidence is correct before motion enhancement.
- [x] T036 [P] [US2] Create src/app/components/home-challenges/home-challenges.component.ts, src/app/components/home-challenges/home-challenges.component.html and src/app/components/home-challenges/home-challenges.component.scss. Depende de: T031 y T010. Resultado: five official challenges render as semantic responsive cards.
- [x] T037 [US2] Implement root-scoped registry, visibility notification, 140 px arbitration, Home-only router-fragment fallback and activeNavigationFragment stream in src/app/shared/services/home-section-observer.service.ts, plus register/unregister/cleanup behavior in src/app/shared/directives/home-section.directive.ts; gate active calculations to `/`, clear activeRegionId/activeNavigationFragment on every non-Home route transition and ignore global-footer visibility outside Home. Depende de: T033 y T021. Resultado: active fragment is a complete Angular/RxJS shared-state flow on Home with visible fallback when observation is unavailable and no stale state on internal routes.
- [x] T038 [US1] Completely replace src/app/feature/pages/home/home.component.ts and src/app/feature/pages/home/home.component.html legacy composition, removing inherited app-service/app-choose-us/app-our-team, old order, legacy selectors, commented alternatives, duplicate sections and unapproved metrics, then keep HomeComponent only as the typed new-Home orchestrator with BannerComponent. Depende de: T034 y T032. Resultado: root route delivers an independently testable Hero with no legacy composition.
- [x] T039 [US3] Add the conditional approved-client region in src/app/feature/pages/home/home.component.ts and src/app/feature/pages/home/home.component.html. Depende de: T035, T038 y T011. Resultado: clients appear in official order only when publishable logos exist.
- [x] T040 [US2] Declare HomeChallengesComponent/HomeSectionDirective in src/app/app.module.ts; register inicio, conditional clientes and desafios in src/app/feature/pages/home/home.component.html; register the global footer as `footer` in src/app/app.component.html; and make src/app/components/menu/menu.component.ts plus src/app/components/menu/menu.component.html consume HomeSectionObserverService.activeNavigationFragment so exactly one matching link owns both the visual active class and aria-current="location" on `/`, while all fragment-derived active state is absent on non-Home routes. Depende de: T036, T037, T038 y T039. Resultado: initial regions and footer complete the Home-only observation-to-Menu flow with no stale or duplicate active state.
- [ ] T041 [US6] Complete initial 1440/1024/768/560/559/390/360 layouts and focus/zoom checks in src/app/feature/pages/home/home.component.scss plus Banner, OurClients, HomeChallenges and Menu SCSS; run the T033 active-section/Menu specs and record aria-current, duplicate-CTA and overflow behavior in specs/001-appland-home-redesign/quickstart.md. Depende de: T038–T040. Resultado: primer incremento sin estado activo duplicado, overflow, recortes, foco oculto ni CTA competidores en el boundary.

**Checkpoint**: Hero + clients + challenges + global navigation form a usable first increment.

---

## Phase 5 — Servicios y confianza

**Goal**: Add accessible service selection, manually traversable official cases and eight IA applications.

**Independent test**: Select every service with mouse/touch/keyboard, traverse all official cases without autoplay, and locate all eight IA applications/contact action.

- [x] T042 [P] [US2] Write five-service tablist/tab/tabpanel, active-state, click and ArrowLeft/ArrowRight/Home/End tests in src/app/components/home-services/home-services.component.spec.ts. Depende de: T041. Resultado: accessible tab contract fails before component creation.
- [x] T043 [P] [US3] Write five-case, optional-media, hidden-“Ver caso” and manual-control tests in src/app/components/success-stories/success-stories.component.spec.ts. Depende de: T041. Resultado: official case and omission rules are guarded.
- [x] T044 [P] [US4] Write eight-application, official-copy and contact-action tests in src/app/components/ai-solution/ai-solution.component.spec.ts. Depende de: T041. Resultado: IA section cannot reuse stale translated claims.
- [x] T045 [P] [US3] Write one-card-step, boundary and no-autoplay tests in src/app/shared/directives/horizontal-carousel.directive.spec.ts. Depende de: T041. Resultado: reusable native manual-scroll contract is defined.
- [x] T046 [P] [US2] Create src/app/components/home-services/home-services.component.ts, src/app/components/home-services/home-services.component.html and src/app/components/home-services/home-services.component.scss using the five typed services. Depende de: T042 y T010. Resultado: exactly one official service panel renders.
- [x] T047 [US2] Add roving tabindex, stable ARIA ids, non-color selected treatment and ArrowLeft/ArrowRight/Home/End activation to src/app/components/home-services/home-services.component.ts, src/app/components/home-services/home-services.component.html and src/app/components/home-services/home-services.component.scss. Depende de: T046. Resultado: all five services are operable and announced with keyboard.
- [x] T048 [P] [US3] Refactor src/app/components/success-stories/success-stories.component.ts, src/app/components/success-stories/success-stories.component.html and src/app/components/success-stories/success-stories.component.scss with five typed cases and optional media/action subregions. Depende de: T043 y T011. Resultado: no broken legacy project path, fake mockup or dead “Ver caso” remains.
- [x] T049 [US3] Implement src/app/shared/directives/horizontal-carousel.directive.ts using native scroll measurements/scrollBy and lifecycle cleanup only. Depende de: T045. Resultado: manual one-card movement exists without library, timer or autoplay.
- [x] T050 [US3] Integrate labelled track, previous/next controls and HorizontalCarouselDirective into src/app/components/success-stories/success-stories.component.ts, src/app/components/success-stories/success-stories.component.html and src/app/components/success-stories/success-stories.component.scss. Depende de: T048 y T049. Resultado: all cases can be traversed manually by controls and native touch scroll.
- [x] T051 [P] [US4] Refactor src/app/components/ai-solution/ai-solution.component.ts, src/app/components/ai-solution/ai-solution.component.html and src/app/components/ai-solution/ai-solution.component.scss to the eight typed applications and shared contact resolver, keeping SCSS under 6 kB. Depende de: T044, T010 y T012. Resultado: IA content is official, responsive and within style budget.
- [x] T052 [US2] Declare HomeServicesComponent in src/app/app.module.ts, insert and register it at fragment servicios through HomeSectionDirective in src/app/feature/pages/home/home.component.html, and bind typed services in src/app/feature/pages/home/home.component.ts. Depende de: T047 y T040. Resultado: service story is independently navigable and participates in shared active-header state after challenges.
- [x] T053 [US3] Declare HorizontalCarouselDirective in src/app/app.module.ts, insert and register SuccessStoriesComponent at fragment casos through HomeSectionDirective in src/app/feature/pages/home/home.component.html, and bind visible cases in src/app/feature/pages/home/home.component.ts. Depende de: T050 y T052. Resultado: cases preserve approved order after services and participate in shared active-header state.
- [x] T054 [US4] Insert and register AiSolutionComponent at fragment ia through HomeSectionDirective in src/app/feature/pages/home/home.component.html and bind IA/contact data in src/app/feature/pages/home/home.component.ts. Depende de: T051 y T053. Resultado: IA follows cases, exposes a valid contact action and participates in shared active-header state.
- [ ] T055 Run service/case/IA specs, full Karma and production build, then record independent mouse/touch/keyboard checkpoints in specs/001-appland-home-redesign/quickstart.md. Depende de: T052–T054. Resultado: Fase 5 pasa contenido, interacción, orden y budgets.

**Checkpoint**: Services, cases and IA are each independently demonstrable.

---

## Phase 6 — Productos y conversión final

**Goal**: Complete conditional products, APPLAND attributes, global coverage and the final contact conversion region.

**Independent test**: With no approved products the region disappears; with an approved fixture it is manually traversable. Benefits, six countries and final contact remain complete in either state.

- [x] T056 [P] [US4] Write empty-product omission, approved-only rendering, optional-media, inquiry-fallback and accessible-carousel assertions for identifiable/named region, appropriate focus/tabindex, labelled previous/next controls, keyboard/touch and current-position communication in src/app/components/home-products/home-products.component.spec.ts. Depende de: T055. Resultado: no unapproved product becomes public and the product track has an executable accessibility contract.
- [x] T057 [P] [US3] Write exact seven-attribute, por-que-appland fragment and zero-testimonial tests in src/app/components/why/why.component.spec.ts. Depende de: T055. Resultado: “Nosotros” destination has official trust content only.
- [x] T058 [P] [US5] Write six-country, compact-region, no-clock/timer and no-flag-hotlink tests in src/app/components/team-coverage/team-coverage.component.spec.ts. Depende de: T055. Resultado: international coverage contract is explicit.
- [x] T059 [P] [US1] Write final CTA title/body/email/phone, meeting fallback, official WhatsApp and conditional social tests in src/app/components/home-cta/home-cta.component.spec.ts. Depende de: T016. Resultado: complete conversion block can be developed independently of services, cases, IA, products, benefits and team.
- [x] T060 [P] [US4] Create src/app/components/home-products/home-products.component.ts, src/app/components/home-products/home-products.component.html and src/app/components/home-products/home-products.component.scss with a nonempty approved Product input contract. Depende de: T056 y T011. Resultado: component cannot render an empty/public pending state.
- [x] T061 [US4] Add semantic region/name, appropriate focus/tabindex, labelled previous/next controls, programmatic current-position state, native touch/keyboard carousel behavior and configurable “Solicitar información” resolution to src/app/components/home-products/home-products.component.ts, src/app/components/home-products/home-products.component.html and src/app/components/home-products/home-products.component.scss. Depende de: T060, T049, T012 y T056. Resultado: approved products support an accessible manual inquiry without autoplay.
- [x] T062 [P] [US3] Refactor src/app/components/why/why.component.ts, src/app/components/why/why.component.html and src/app/components/why/why.component.scss with seven typed attributes and no testimonial markup. Depende de: T057 y T010. Resultado: trust region matches PDF/spec.
- [x] T063 [P] [US5] Refactor src/app/components/team-coverage/team-coverage.component.ts, src/app/components/team-coverage/team-coverage.component.html and src/app/components/team-coverage/team-coverage.component.scss into a static compact six-country list. Depende de: T058 y T010. Resultado: Guatemala included; flagcdn, clocks and globe intervals removed.
- [x] T064 [P] [US1] Create src/app/components/home-cta/home-cta.component.ts, src/app/components/home-cta/home-cta.component.html and src/app/components/home-cta/home-cta.component.scss using ContactContent. Depende de: T059 y T010. Resultado: final CTA renders official copy/contact with semantic actions.
- [x] T065 [US1] Integrate src/app/shared/utils/conversion-destination.util.ts into src/app/components/home-cta/home-cta.component.ts and src/app/components/home-cta/home-cta.component.html for approved meeting URL/contacto fallback and WhatsApp message omission/encoding. Depende de: T064 y T012. Resultado: both conversion paths are always valid without invented text.
- [x] T066 [US4] Declare HomeProductsComponent in src/app/app.module.ts and conditionally insert/register it at fragment productos through HomeSectionDirective in src/app/feature/pages/home/home.component.ts and src/app/feature/pages/home/home.component.html only when visibleProducts is nonempty. Depende de: T061 y T054. Resultado: later region order and active-header registry remain stable with products present or absent.
- [x] T067 [US3] Insert and register WhyComponent at por-que-appland through HomeSectionDirective in src/app/feature/pages/home/home.component.html and bind benefits in src/app/feature/pages/home/home.component.ts. Depende de: T062 y T066. Resultado: header “Nosotros” reaches and tracks the correct region with no new route/section.
- [x] T068 [US5] Insert and register TeamCoverageComponent at equipo-global through HomeSectionDirective before contacto in src/app/feature/pages/home/home.component.html and bind countries in src/app/feature/pages/home/home.component.ts. Depende de: T063 y T067. Resultado: compact six-country region participates in active-header state and cannot displace/hide final CTA.
- [x] T069 [US1] Declare HomeCtaComponent in src/app/app.module.ts; integrate it with stable id contacto at the current final position using approved contact/navigation data in src/app/feature/pages/home/home.component.ts and src/app/feature/pages/home/home.component.html; then run only App/routing/Menu/Banner/HomeCta scoped specs, the production build and an initial header/Hero/CTA responsive-accessibility check, recording the early US1 checkpoint in specs/001-appland-home-redesign/quickstart.md. Depende de: T065 y T038. Resultado: a tested, buildable US1 MVP exists independently of active-section enhancement, footer finalization, services, cases, IA, products, benefits, team and Phase 9 closure gates.
- [x] T070 Validate/reposition the already integrated HomeCtaComponent after all preceding applicable regions, register contacto through HomeSectionDirective, synchronize the final FooterContent binding—including nested contact—in src/app/feature/pages/home/home.component.ts, src/app/feature/pages/home/home.component.html, src/app/components/footer/footer.component.ts and src/app/app.component.ts, then run product/benefit/team/CTA/order/active-registry specs and record zero/approved-product checkpoints in specs/001-appland-home-redesign/quickstart.md. Depende de: T066–T069. Resultado: complete Home preserves ten-region relative order, CTA-final/footer position, complete active-section registry and bound global shell without placeholders.

**Checkpoint**: All approved Home content and conversion paths are present; products remain non-blocking.

---

## Phase 7 — Interacciones y motion

**Goal**: Complete pausable motion, touch/keyboard carousel behavior, progressive reveals and lifecycle cleanup.

- [x] T071 [P] [US3] Extend src/app/components/our-clients/our-clients.component.spec.ts with explicit pause/resume, hover/focus pause, aria-hidden duplicate and reduced-motion static tests. Depende de: T070. Resultado: persistent client motion has an executable accessibility contract.
- [x] T072 [P] [US6] Extend src/app/shared/directives/horizontal-carousel.directive.spec.ts with ArrowLeft/ArrowRight, touch/native scroll, reduced-motion immediate behavior and destroy cleanup tests. Depende de: T070. Resultado: both tracks support equivalent input without autoplay.
- [x] T073 [P] [US6] Write visible-by-default, supported-observer reveal, unsupported API, reduced-motion and disconnect tests in src/app/shared/directives/reveal-on-scroll.directive.spec.ts. Depende de: T070. Resultado: reveal enhancement can never strand hidden content.
- [x] T074 [US3] Implement the CSS marquee, Angular pause state, explicit Pausar/Reanudar control, hover/focus pause and static reduced-motion layout in src/app/components/our-clients/our-clients.component.ts, src/app/components/our-clients/our-clients.component.html and src/app/components/our-clients/our-clients.component.scss. Depende de: T071 y T035. Resultado: approved logos remain understandable with motion running, paused or disabled.
- [x] T075 [US6] Add keyboard step, reduced-motion scroll mode, boundary state and cleanup to src/app/shared/directives/horizontal-carousel.directive.ts and expose the behavior in SuccessStories/HomeProducts templates. Depende de: T072, T050 y T061. Resultado: cases/products work with controls, touch and keyboard.
- [x] T076 [US6] Implement src/app/shared/directives/reveal-on-scroll.directive.ts with base-visible progressive enhancement and observer cleanup. Depende de: T073. Resultado: unsupported API/reduced motion leaves every section visible.
- [x] T077 [P] [US6] Integrate the reveal and reduced-motion foundation into the shell/orchestration group: declare RevealOnScrollDirective in src/app/app.module.ts; preserve base-visible content in src/styles.scss, src/app/app.component.html, src/app/app.component.scss, src/app/feature/pages/home/home.component.html and src/app/feature/pages/home/home.component.scss; remove leaked listener/direct-DOM patterns from src/app/components/menu/menu.component.ts, src/app/components/menu/menu.component.html, src/app/components/menu/menu.component.scss, src/app/components/footer/footer.component.html and src/app/components/footer/footer.component.scss; and run the scoped App/Menu/Footer/Home specs. Depende de: T076 y T070. Resultado: shell motion is independently verified, Menu owns/cleans its listeners and neither header nor footer can be stranded hidden.
- [x] T078 [P] [US6] Integrate nonessential reveal groups and reduced-motion behavior into the first content group in src/app/components/banner/banner.component.html, src/app/components/banner/banner.component.scss, src/app/components/our-clients/our-clients.component.ts, src/app/components/our-clients/our-clients.component.html, src/app/components/our-clients/our-clients.component.scss, src/app/components/home-challenges/home-challenges.component.html, src/app/components/home-challenges/home-challenges.component.scss, src/app/components/home-services/home-services.component.html and src/app/components/home-services/home-services.component.scss, including marquee pause/cleanup, and run those four component specs. Depende de: T074, T076 y T070. Resultado: Hero, clients, challenges and services are independently verified with motion running, paused, reduced or unsupported.
- [x] T079 [P] [US6] Integrate nonessential reveal groups, reduced-motion behavior and carousel cleanup into the second content group in src/app/components/success-stories/success-stories.component.ts, src/app/components/success-stories/success-stories.component.html, src/app/components/success-stories/success-stories.component.scss, src/app/components/ai-solution/ai-solution.component.ts, src/app/components/ai-solution/ai-solution.component.html, src/app/components/ai-solution/ai-solution.component.scss, src/app/components/home-products/home-products.component.ts, src/app/components/home-products/home-products.component.html and src/app/components/home-products/home-products.component.scss, and run the three component/carousel specs. Depende de: T075, T076 y T070. Resultado: cases, IA and products are independently verified with equivalent content/controls and no autoplay or leaked work.
- [x] T080 [P] [US6] Integrate nonessential reveal groups and reduced-motion behavior into the third content group in src/app/components/why/why.component.ts, src/app/components/why/why.component.html, src/app/components/why/why.component.scss, src/app/components/team-coverage/team-coverage.component.ts, src/app/components/team-coverage/team-coverage.component.html, src/app/components/team-coverage/team-coverage.component.scss, src/app/components/home-cta/home-cta.component.ts, src/app/components/home-cta/home-cta.component.html and src/app/components/home-cta/home-cta.component.scss; remove perpetual timers/hotlinks; and run those three component specs plus scoped static searches. Depende de: T076 y T070. Resultado: why/team/CTA motion and cleanup are independently verified with base-visible content and reduced-motion parity.

**Checkpoint**: All interactive behavior is Angular-native, pausable and reduced-motion safe.

---

## Phase 8 — Responsive, recursos y rendimiento

**Goal**: Bring the complete Home to visual, asset and performance release thresholds at all required widths.

- [x] T081 [US3] Optimize and place only approved client/case assets under src/assets/images/home/clients/ and src/assets/images/home/cases/, update their ApprovedAsset entries in src/app/feature/pages/home/home-content.config.ts, add intrinsic dimensions/aspect-ratio, meaningful/empty alt and below-Hero lazy loading in src/app/components/our-clients/our-clients.component.html and src/app/components/success-stories/success-stories.component.html, and validate full clients-region omission when no logo is approved. Depende de: T078 y T079; recursos aprobados son opcionales. Resultado: no recreated logo, text substitute, mockup, hotlink or oversized legacy case asset ships.
- [x] T082 [US4] Optimize and place only approved product assets under src/assets/images/home/products/, update approved Product entries in src/app/feature/pages/home/home-content.config.ts, add intrinsic dimensions/aspect-ratio, meaningful/empty alt and lazy loading in src/app/components/home-products/home-products.component.html, and validate hidden-section behavior when none exist. Depende de: T079; recursos aprobados son opcionales. Resultado: dependencia empresarial no bloquea ni publica candidatos.
- [x] T083 Add intrinsic dimensions/aspect-ratio and image semantics to src/app/components/banner/banner.component.html and src/app/components/ai-solution/ai-solution.component.html; then tune 1440, 1280, 1024 and 768 layouts against docs/appland-home-reference.dc.html in src/styles.scss, src/app/feature/pages/home/home.component.scss, src/app/components/menu/menu.component.scss, src/app/components/banner/banner.component.scss, src/app/components/home-challenges/home-challenges.component.scss, src/app/components/home-services/home-services.component.scss, src/app/components/success-stories/success-stories.component.scss, src/app/components/ai-solution/ai-solution.component.scss and src/app/components/home-products/home-products.component.scss. Depende de: T081 y T082, aplicando omisión si no hay assets. Resultado: desktop/tablet preserve the approved hierarchy and stable image loading without copying the reference.
- [x] T084 [US6] Tune global tokens and shell at 560, 559, 390 and 360 CSS pixels in src/styles/_appland-home-tokens.scss, src/styles.scss, src/app/app.component.scss, src/app/feature/pages/home/home.component.scss and src/app/components/menu/menu.component.scss; explicitly validate that at 559 the desktop header CTA is hidden while the approved mobile conversion remains available, and at 560 the approved compact-header CTA state applies. Depende de: T077 y T083. Resultado: breakpoint ownership is deterministic with no competing duplicate, shifted, overlapped or missing conversion control.
- [x] T085 [P] [US6] Tune and independently validate the mobile Hero/clients/challenges/services group at 560, 559, 390 and 360 CSS pixels in src/app/components/banner/banner.component.scss, src/app/components/our-clients/our-clients.component.scss, src/app/components/home-challenges/home-challenges.component.scss and src/app/components/home-services/home-services.component.scss. Depende de: T084. Resultado: first-half content wraps, scrolls and focuses without page overflow or clipping.
- [x] T086 [P] [US6] Tune and independently validate the mobile cases/IA/products group at 560, 559, 390 and 360 CSS pixels in src/app/components/success-stories/success-stories.component.scss, src/app/components/ai-solution/ai-solution.component.scss and src/app/components/home-products/home-products.component.scss. Depende de: T084. Resultado: both manual tracks and IA content preserve controls, containment and min-width:0 without page overflow.
- [ ] T087 [P] [US6] Tune and independently validate the mobile why/team/final-CTA/footer group at 560, 559, 390 and 360 CSS pixels and 200% zoom in src/app/components/why/why.component.scss, src/app/components/team-coverage/team-coverage.component.scss, src/app/components/home-cta/home-cta.component.scss and src/app/components/footer/footer.component.scss. Depende de: T080 y T084. Resultado: final content and conversion remain ordered, legible and unobscured without horizontal page overflow.
- [ ] T088 Run the production build, inspect the existing budgets in angular.json without changing them, run three Lighthouse mobile-profile passes and Chrome Network/Performance inspection, and optimize only affected Home files such as src/app/components/ai-solution/ai-solution.component.scss, src/app/components/banner/banner.component.html, src/app/components/banner/banner.component.scss and approved files under src/assets/images/home/; record build/budget and median performance outcomes in specs/001-appland-home-redesign/quickstart.md. Depende de: T081–T087. Resultado: existing build gates and the planned user-observable loading/responsiveness experience pass or any deviation is explicitly approved.
- [ ] T089 Compare the completed Home with docs/appland-home-reference.dc.html at 1440, 1280, 1024, 768, 560, 559, 390 and 360 CSS pixels; verify typography fallback, active/focus/hover states, absence of language UI and console/runtime issues; and record remaining approved deviations in specs/001-appland-home-redesign/quickstart.md. Depende de: T088. Resultado: Fase 8 has traceable visual/performance evidence and zero support.js integration.

**Checkpoint**: Complete Home meets responsive, asset, visual and performance gates.

---

## Phase 9 — Pruebas y cierre

**Goal**: Execute full regression/acceptance coverage, close gaps and produce release evidence without broadening scope.

- [x] T090 [P] [US2] Complete and run header/menu/anchor coverage in src/app/components/menu/menu-navigation.spec.ts, src/app/components/menu/menu-accessibility.spec.ts and src/app/app-routing.module.spec.ts, including on `/` registration of all rendered Home regions plus footer, the full observed-region mapping, 140 px activation line, most-recent-crossing arbitration, at most one active item and exactly one matching aria-current="location"; verify movement/removal of aria-current and visual/accessibility parity; verify on `/about` and `/service` that every header link has no fragment-derived aria-current; verify navigation from Home to a non-Home route clears the previous active fragment and that footer visibility there cannot activate Contacto; also cover absence of language UI/data-en/hidden English and the 559/560 CTA boundary. Depende de: T089. Resultado: every header destination, Home-scoped shared active state, route cleanup, sticky state and compact-menu path passes without inherited aria-current.
- [x] T091 [P] [US2] Complete and run service tab coverage in src/app/components/home-services/home-services.component.spec.ts for all input modes, focus order and ARIA relationships. Depende de: T089. Resultado: five services remain independently accessible.
- [x] T092 [P] [US3] Complete and run client/case/manual-carousel coverage in src/app/components/our-clients/our-clients.component.spec.ts, src/app/components/success-stories/success-stories.component.spec.ts and src/app/shared/directives/horizontal-carousel.directive.spec.ts. Depende de: T089. Resultado: trust content, pause and manual traversal pass without autoplay.
- [x] T093 [P] [US4] Complete and run IA/product/conditional visibility coverage in src/app/components/ai-solution/ai-solution.component.spec.ts, src/app/components/home-products/home-products.component.spec.ts and src/app/feature/pages/home/home-content.config.spec.ts, including an identifiable named product-carousel region, track focus/tabindex, previous/next controls, current-position state, touch scrolling and keyboard traversal. Depende de: T089. Resultado: eight IA uses and approved-only products pass in empty/nonempty states with equivalent accessible carousel operation.
- [x] T094 [P] [US6] Complete and run reduced-motion/reveal/lifecycle coverage in src/app/shared/directives/reveal-on-scroll.directive.spec.ts and src/app/shared/services/home-section-observer.service.spec.ts. Depende de: T089. Resultado: all content remains accessible when motion/observer support is absent.
- [x] T095 [P] [US1] Complete and run DOM-level content/order/fallback coverage in src/app/components/banner/banner.component.spec.ts, src/app/feature/pages/home/home.component.spec.ts, src/app/components/home-cta/home-cta.component.spec.ts and src/app/components/footer/footer.component.spec.ts, asserting the complete relative order of all applicable final Home sections and that legacy app-service/app-choose-us/app-our-team, duplicated regions and “100K” do not render; separately run a controlled static review/search of src/app/feature/pages/home/home.component.html for inherited commented blocks, legacy selectors, old metrics and alternative composition, recording both levels in specs/001-appland-home-redesign/quickstart.md. Depende de: T089. Resultado: complete final order plus rendered and source composition pass independently with no legacy composition, invented content or dead destination.
- [x] T096 [P] Add and run AppComponent integration plus smoke regression specs in src/app/app.component.spec.ts, src/app/components/about/about.component.spec.ts and src/app/components/service/service.component.spec.ts, asserting bound navigation/meeting inputs on Menu, one bound FooterContent input with nested contact on Footer, zero unbound shell inputs, unobscured rendering and root-fragment behavior on `/`, `/about` and `/service`; confirm Home exposes the mapped active fragment, `/about` and `/service` expose no fragment-derived aria-current, navigation from Home to either internal route clears the previous active fragment, and the globally registered footer cannot activate Contacto outside `/`. Depende de: T089. Resultado: all three routes use the configured global shell while internal pages retain ownership/content and cannot inherit Home active state.
- [x] T097 Run the full npm test -- --watch=false --browsers=ChromeHeadless and npm run build -- --configuration production commands from package.json, recording clean console/test/build/budget output in specs/001-appland-home-redesign/quickstart.md. Depende de: T090–T096. Resultado: automated release gate passes with no new dependency.
- [ ] T098 [US6] Execute the complete keyboard, 200% zoom, reduced-motion and screen-reader landmark/state checklist from specs/001-appland-home-redesign/quickstart.md and record results there. Depende de: T097. Resultado: navigation, tabs, tracks, pause and contact complete without mouse.
- [ ] T099 Repeat the 1440/1280/1024/768/560/559/390/360 visual/touch matrix and inspect browser DOM, console and network for overflow, dead links, support.js/React/hotlinks, failed resources, language selector/data-en/hidden English and legacy Home composition, recording findings in specs/001-appland-home-redesign/quickstart.md. Depende de: T097. Resultado: zero clipping, page overflow, legacy/forbidden runtime integration, language UI or unexpected console error.
- [ ] T100 Conduct the representative first-visit/contact acceptance exercise for SC-001 and SC-002 and record anonymized participant counts, time-to-understand and decision count in specs/001-appland-home-redesign/quickstart.md. Depende de: T098 y T099. Resultado: ≥90% identifica la oferta/CTA en 10 s y alcanza reunión/WhatsApp en no más de dos decisiones, o la feature no se cierra.
- [ ] T101 Update specs/001-appland-home-redesign/quickstart.md only where actual commands, approved asset decisions, participant outcomes or validated deviations differ from the plan; do not add internal-page scope. Depende de: T100. Resultado: verification documentation is executable and matches delivered behavior.
- [ ] T102 Audit FR-001–FR-046 and SC-001–SC-014 against implemented tests/manual/participant evidence in specs/001-appland-home-redesign/spec.md and specs/001-appland-home-redesign/quickstart.md, resolving any uncovered in-scope requirement before marking the feature complete. Depende de: T101. Resultado: 100% requirement traceability with no open blocker, placeholder, unapproved resource or hidden regression.

**Checkpoint**: Feature is ready for implementation review/release decision; this Tasks phase itself performs no implementation.

---

## Dependencies and execution order

### Phase dependencies

- Phase 1 has no dependency and establishes the baseline.
- Phase 2 depends on Phase 1 and blocks every functional story.
- Phase 3 depends on Phase 2 and establishes the global shell used by all stories.
- Phase 4 depends on Phase 3 and produces the first navigable Home increment.
- Phase 5 depends on Phase 4 and adds services/cases/IA.
- Phase 6 depends on Phase 5 for the approved final composition, although the US1 final CTA tasks can be pulled forward for a story-complete MVP.
- Phase 7 depends on all behavior-bearing components from Phases 4–6.
- Phase 8 depends on the complete composition and interaction model.
- Phase 9 depends on Phase 8 and closes integrated verification.

### Critical dependency chain

Shell/content branch: T001 → T002 → T003 → T006 → T009 → T010 → T011 → T016 → T021/T022 → T024 → T028 → T029/T030/T031/T032/T033 → T034/T035/T036/T037 → T038 → T039 → T040 → T041 → T052 → T053 → T054 → T055 → T066 → T067 → T068.

Independent final-CTA branch: T016 → T059 → T064 → T065 → T069. Both branches join at T070, then continue through T071/T072/T073 → T074/T075/T076 → T077/T078/T079/T080. Asset/layout branches then follow their actual owners: T078/T079 → T081, T079 → T082, T081/T082 → T083, T077/T083 → T084, T084 → T085/T086, and T080/T084 → T087. T081–T087 join at T088 → T089 → T097 → T100 → T102.

Business assets do not belong to the blocking chain: T081/T082 complete by integrating approved resources or validating their configured omission.

### User-story dependencies

- US1 can be completed after Foundation + Shell using Hero test/component tasks T029/T034, shared legacy-composition validation T032 before integration task T038, then final CTA T059/T064/T065/T069; T032 retains its US2 label but is a necessary shared guard for the US1 MVP, which does not require approved products/assets.
- US2 depends on Shell and typed service/challenge content, then completes through T031/T036/T040 and T042/T046/T047/T052.
- US3 component work for clients, cases and Why can be built in parallel where files are disjoint; its Home integration is ordered, so cases follow integrated services and Why follows the preceding optional-products position.
- US4 component work for IA and products can be built independently from other component files; its Home integration follows integrated cases, and conditional products follow IA.
- US5 TeamCoverage component work depends only on typed countries/global shell, but its Home integration follows Why and remains before the final CTA.
- US6 is cross-cutting: its independent test is complete only after menu, responsive controls, reduced motion and keyboard validation pass.

Construction independence does not authorize out-of-order Home integration. The PDF order is enforced by T052–T054 and T066–T070 even when component implementation tasks are parallelizable.

## Parallel opportunities

- Foundation: T007, T008 and T013 can start together after T006.
- Shell tests: T017–T020 can run in parallel; T023 can proceed independently after its menu-accessibility contract is known.
- First increment: T029–T033 tests can run together; T034–T036 implementations can then run together in separate component files.
- Services/trust: T042–T045 tests can run together; T046, T048 and T051 can then proceed in parallel.
- Products/conversion: T056–T059 tests can run together; T060, T062, T063 and T064 can then proceed in parallel.
- Motion: T071–T073 can run in parallel; after their implementations, T077–T080 own four disjoint file groups and can also run in parallel.
- Responsive: T084 establishes the token/shell boundary; T085–T087 then own three disjoint content-style groups and can run in parallel before T088.
- Closure: T090–T096 can run in parallel because they own separate spec files before the consolidated gate.

Parallel markers apply to component/test construction with disjoint file ownership. HomeComponent integration tasks remain sequential where the approved section order requires the preceding integration.

### Parallel examples by story

- US1: after shared foundation, T029/T019/T059 test files can be prepared independently; T034 and T064 use separate components.
- US2: T031, T033 and T042 use separate specs; T036 and T046 use separate components.
- US3: T030, T043 and T057 use separate specs; T035, T048 and T062 use separate components.
- US4: T044 and T056 can be prepared independently; T051 and T060 use separate components.
- US5: T058 and its fixture/content review can proceed without product approval; T063 owns only TeamCoverage files.
- US6: T018, T033, T045 and T073 cover different primitives and may be prepared independently when their phase prerequisites are satisfied.

## Incremental implementation strategy

### First navigable increment

1. Complete Phases 1–3.
2. Complete Phase 4.
3. Stop and validate Hero, clients, challenges, navigation, responsive baseline and accessibility.

### Story-complete MVP

1. Complete shared Phases 1–3.
2. Deliver US1 Hero test/component tasks T029/T034, complete T032 as the shared legacy-composition validation, and only then execute integration task T038. T032 is required because T038 depends on it; it does not replace the complete final-order validation retained in T095.
3. Deliver US1 final CTA tasks T059/T064/T065/T069 without waiting for optional products/assets.
4. Use the scoped tests, production build and initial responsive/accessibility evidence completed inside T069 as the early US1 release gate.
5. Stop and demonstrate header/basic navigation, Hero, compact menu, valid meeting fallback/WhatsApp conversion and initial responsive/focus behavior. No Phase 9 or global closure task forms part of this MVP.

### Full incremental delivery

1. First navigable increment.
2. Early US1 final CTA integration and T069 MVP checkpoint.
3. Services and cases.
4. IA, conditional products, benefits and global team; T070 then validates final order/CTA/footer/registry.
5. Motion/reduced-motion hardening.
6. Responsive/asset/performance gates.
7. Full closure and requirement audit through T095/T097 and the remaining Phase 9 gates.

## Requirement traceability

| Functional requirements | Covered by tasks |
|---|---|
| FR-001 section order | T032, T038–T040, T052–T054, T066–T070, T095, T101 |
| FR-002 approved content only | T007, T010–T012, T043–T044, T056–T059, T093, T102 |
| FR-003 global header/sections/footer | T020, T022, T024, T027, T038–T040, T052–T054, T066–T070, T096 |
| FR-004 header labels | T017, T024, T090 |
| FR-005 valid visible anchor destinations | T020–T021, T024, T037, T040, T090 |
| FR-006 Nosotros maps to por-que-appland only | T017, T024, T032, T057, T067, T090, T102 |
| FR-007 persistent/scrolled/active header | T017, T024, T033, T037, T040, T090 |
| FR-008 compact navigation input modes | T018, T023, T026, T090, T098 |
| FR-009 approved Hero | T029, T034, T038, T095 |
| FR-010 meeting URL/fallback | T008, T012, T019, T025, T059, T065, T095 |
| FR-011 official WhatsApp/no invented message | T008, T012, T059, T065, T095 |
| FR-012 approved official logos only | T005, T011, T030, T035, T081, T092 |
| FR-013 pausable/static client motion | T071, T074, T078, T092, T098 |
| FR-014 five official challenges | T007, T010, T031, T036, T040 |
| FR-015 five selectable services | T007, T010, T042, T046–T047, T052, T091 |
| FR-016 non-color service selection | T042, T047, T091, T098 |
| FR-017 manual cases by mouse/touch/keyboard | T043, T045, T048–T050, T072, T075, T092 |
| FR-018 cases accept later official media | T011, T043, T048, T081, T083 |
| FR-019 hide “Ver caso” without destination | T008, T011–T012, T043, T048, T093 |
| FR-020 eight IA applications/contact | T007, T010, T044, T051, T054, T093 |
| FR-021 approved products only | T007, T011, T056, T060–T061, T082, T093 |
| FR-022 omit empty products region | T007, T011, T056, T060, T066, T070, T093 |
| FR-023 manual approved products/inquiry | T056, T061, T066, T072, T075, T093, T098 |
| FR-024 seven APPLAND attributes | T007, T010, T057, T062, T067 |
| FR-025 no testimonials | T007, T010, T057, T062, T093, T102 |
| FR-026 six-country compact team | T007, T010, T058, T063, T068, T087 |
| FR-027 complete final CTA | T010, T059, T064–T065, T069, T095 |
| FR-028 approved footer content | T019–T020, T022, T027, T070, T095–T096 |
| FR-029 hide unapproved social/legal links | T007, T011, T019, T027, T059, T095 |
| FR-030 Spanish-only visible content | T007, T010, T015, T017–T019, T024, T027, T090, T099, T101 |
| FR-031 no placeholders/inventions/dead links | T005, T007, T011–T012, T043, T056, T081–T083, T099, T102 |
| FR-032 six required responsive widths plus 559/560 boundary | T004, T018, T041, T083–T089, T099 |
| FR-033 desktop two-column Hero | T029, T034, T083, T089 |
| FR-034 tablet/mobile one-column + compact nav | T018, T026, T034, T041, T083–T087 |
| FR-035 no clipping/page overflow | T041, T083–T089, T099 |
| FR-036 keyboard/focus for all actions | T018, T026, T042, T045, T047, T072, T075, T090–T098 |
| FR-037 compact-menu communicated state/focus | T018, T023, T026, T090, T098 |
| FR-038 one h1/coherent headings | T029, T031–T032, T034, T095, T098 |
| FR-039 image alternatives/decorative semantics | T029–T030, T034–T035, T081–T083, T098 |
| FR-040 state not color-only | T014, T042, T047, T084–T087, T091, T098 |
| FR-041 contrast/touch targets | T013–T014, T041, T084–T087, T098 |
| FR-042 reduced motion retains content | T071–T080, T094, T098 |
| FR-043 Hero/nav/CTA before lower resources | T034, T038, T083, T087–T088, T095 |
| FR-044 stable loading/no accidental activation | T081–T089, T099 |
| FR-045 optional-resource failure is safe | T005, T011, T030, T043, T056, T081–T083, T093 |
| FR-046 internal pages remain out of scope | T004, T006, T020–T022, T028, T096, T102 |

| Success criteria | Covered by tasks |
|---|---|
| SC-001 first-visit understanding in 10 seconds | T029, T034, T095, T100, T102 |
| SC-002 conversion within two decisions | T025, T065, T069, T095, T100, T102 |
| SC-003 all header links, active mapping and Nosotros destination | T017, T020–T024, T033, T037, T040, T090, T102 |
| SC-004 all published business content approved | T005, T007, T010–T012, T093, T102 |
| SC-005 zero placeholders/dead/unapproved content | T011, T043, T056, T081–T083, T099, T102 |
| SC-006 services/cases/products across input modes | T042–T050, T056, T061, T072, T075, T091–T093 |
| SC-007 pausable/reduced persistent motion | T071–T080, T092, T094, T098 |
| SC-008 keyboard completion with visible focus | T018, T026, T047, T075, T090–T098 |
| SC-009 zero clipping/overflow at six widths plus 559/560 boundary | T018, T041, T083–T089, T099 |
| SC-010 Hero/nav/actions available before lower content | T034, T038, T083, T088, T095 |
| SC-011 stable loading and activation | T083, T086, T088–T089, T099 |
| SC-012 approval rules for companies/products/cases | T011, T030, T043, T056, T081–T083, T092–T093 |
| SC-013 visual direction at six widths | T013–T015, T084–T089, T099 |
| SC-014 relative order/no Nosotros section | T032, T038–T040, T052–T054, T066–T070, T095, T102 |

## Task summary

| Phase | Tasks |
|---|---:|
| 1 — Preparación y baseline | 6 |
| 2 — Fundación visual y contenido | 10 |
| 3 — Shell compartido | 12 |
| 4 — Primer incremento funcional | 13 |
| 5 — Servicios y confianza | 14 |
| 6 — Productos y conversión final | 15 |
| 7 — Interacciones y motion | 10 |
| 8 — Responsive, recursos y rendimiento | 9 |
| 9 — Pruebas y cierre | 13 |
| **Total** | **102** |

| Ownership | Tasks |
|---|---:|
| US1 | 11 |
| US2 | 16 |
| US3 | 16 |
| US4 | 9 |
| US5 | 3 |
| US6 | 19 |
| Shared setup/foundation/integration gates | 28 |

**Parallelizable tasks**: 48, subject to the explicit dependencies on each line.

## Notes

- Tests for each behavior precede or accompany its implementation and are rerun in Phase 9.
- No task adds a route, page, UI/carousel/animation library, React, support.js or bilingual behavior.
- No task raises Angular budgets or updates Angular.
- Missing business assets/URLs/messages apply omission/fallback rules and do not stop unrelated tasks.
- ServiceComponent and CardTemplateComponent remain owned by /service; HomeServicesComponent is separate.
- Completion requires every checkbox and checkpoint evidence, but task execution may stop after any independently validated increment.
